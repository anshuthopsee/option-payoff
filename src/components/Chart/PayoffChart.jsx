import { useRef, useEffect, useState, useContext } from 'react';
import { StrategyContext } from '../../contexts/StrategyContextProvider';
import * as d3 from 'd3';

const tooltipStyle = {
  position: "absolute",
  display: "none",
  padding: "2px 4px",
  width: "auto",
  background: "#3b87eb",
  color: "white",
  fontSize: "12px",
  borderRadius: "2px",
  whiteSpace: "pre-line",
  overflowWrap: "wrap",
}

const calculatePayoff = (underlyingPrice, leg) => {
  const strike = leg.strike;
  const premium = leg.premium;
  const position = leg.action === "Buy" ? 1 : -1;
  const optionType = leg.type;

  let payoff;
  if (optionType === 'CE') {
      payoff = position * (Math.max(underlyingPrice - strike, 0) - premium);
  } else {
      payoff = position * (Math.max(strike - underlyingPrice, 0) - premium);
  };
  return payoff;
}

const generatePayoffDiagram = (legs) => {
  const minStrike = Math.min(...legs.map(leg => leg.strike));
  const maxStrike = Math.max(...legs.map(leg => leg.strike));
  const avgStrike = (maxStrike + minStrike) / 2
  const startStrike = minStrike - (avgStrike / 2)
  const endStrike = maxStrike + (avgStrike / 2)
  const numPoints = 400;
  
  const data = [];

  for (let i = 0; i < numPoints; i++) {
      const underlyingPrice = startStrike + (endStrike - startStrike) * i / (numPoints - 1);
      let totalPayoff = 0;

      for (const leg of legs) {
          const legPayoff = calculatePayoff(underlyingPrice, leg);
          totalPayoff += legPayoff;
      };
      data.push({ x: underlyingPrice, y: totalPayoff });
  };
  return data;
};

const splitLines = (data) => { 
  let currentSegment = [];
  const segments = [];
  const thresholdDistance = 1;
  for (let i = 0; i < data.length; i++) {
    currentSegment.push(data[i]);

    if (i < data.length - 1) {
      const distance = Math.abs(data[i + 1].x - data[i].x);

      if (distance >= thresholdDistance) {
        segments.push(currentSegment);
        currentSegment = [];
      }
    } else {
      segments.push(currentSegment);
    };
  };
  return segments;
};

const PayoffChart = () => {
  const chartParentRef = useRef();
  const chartAreaRef = useRef();
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const { legs } = useContext(StrategyContext);

  const resizeObserver = new ResizeObserver((entries) => {
    const chartParent = entries[0].target;
    setWidth(chartParent.clientWidth);
    setHeight(chartParent.clientHeight - 50);
  });

  const drawChart = () => {
    while (chartAreaRef.current.firstChild) {
      chartAreaRef.current.removeChild(chartAreaRef.current.firstChild);
    };

    const MARGIN = { TOP: 20, RIGHT: 30, BOTTOM: 50, LEFT: 50 };
    const WIDTH = width - MARGIN.LEFT - MARGIN.RIGHT;
    const HEIGHT = height - MARGIN.TOP - MARGIN.BOTTOM;

    const selectedLegs = legs.filter(leg => leg.selected);
    selectedLegs.sort((a, b) => a.strike - b.strike);
    const data = generatePayoffDiagram(selectedLegs);

    const svg = d3.select(chartAreaRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.x))
      .range([0, WIDTH]);

    const yScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.y), d3.max(data, d => d.y)])
      .range([HEIGHT, 0]);

    const xZeroLine = d3.scaleLinear()
      .domain(0)
      .range([0, WIDTH])

    const line = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))

    const positiveData = data.filter((d) => d.y >= 0);
    const negativeData = data.filter((d) => d.y < 0);

    const positiveLines = splitLines(positiveData);
    const negativeLines = splitLines(negativeData);

    positiveLines.forEach(positiveLine => {
      svg.append("path")
        .attr("d", line(positiveLine))
        .attr("stroke", "#32CD32")
        .attr("stroke-width", 2)
        .attr("fill", "none");
    });

    negativeLines.forEach(negativeLine => {
      svg.append("path")
        .attr("d", line(negativeLine))
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("fill", "none");
    });

    const insideArea = d3.area()
      .x(d => xScale(d.x))
      .y0(yScale(Math.max(d3.min(data, d => d.y), 0)))
      .y1(d => Math.max(yScale(d.y), 0))
      .defined(d => d.y > 0);
    
    svg.append("path")
      .datum(data)
      .attr("d", insideArea)
      .attr("fill", "#90de97")
      .attr("fill-opacity", 0.3)

    const maxTicks = Math.floor(WIDTH / 70);

    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${HEIGHT})`)
      .call(d3.axisBottom(xScale).ticks(maxTicks));

    svg.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(yScale));

    svg.append('g')
      .attr('class', 'x-axis-zero')
      .attr("transform", `translate(0, ${Math.min(yScale(Math.min(d3.max(data, d => d.y), 0)), HEIGHT)})`)
      .attr('stroke-dasharray', '12 12')
      .attr("stroke-width", "2px")
      .call(d3.axisBottom(xZeroLine));
    
    const outsideArea = d3.area()
      .x(d => xScale(d.x))
      .y0(yScale(Math.min(d3.max(data, d => d.y), 0)))
      .y1(d => yScale(d.y))
      .defined(d => d.y < 0);
    
    svg.append("path")
      .datum(data)
      .attr("d", outsideArea)
      .attr("fill", "#e36c64")
      .attr("fill-opacity", 0.3)

    const drawBreakEvenLine = (breakEven) => {
      breakEven = Math.round(breakEven);
      const xPosition = xScale(breakEven);
      const yMin = d3.min(data, d => d.y);
      const yMax = d3.max(data, d => d.y);

      svg.append("line")
        .attr("x1", xPosition)
        .attr("y1", yScale(yMin))
        .attr("x2", xPosition)
        .attr("y2", yScale(yMax))
        .attr("stroke", "#a19f9f")
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "12 12");
    };

    let prevBreakEven = null;
    const sortedData = [...data].sort((a, b) => a.x - b.x);
    sortedData.forEach(d => {
      if (Math.round(d.y) === 0) {
        if (prevBreakEven === null || Math.abs(d.x - prevBreakEven) >= 1) {
          drawBreakEvenLine(d.x);
          prevBreakEven = d.x;
        };
      };
    });
        
    const crosshairVertical = svg
    .append("line")
    .attr("class", "crosshair")
    .style("stroke", "#858483")
    .style("stroke-width", 1)
    .style("display", "none");

    const crosshairHorizontal = svg
    .append("line")
    .attr("class", "crosshair")
    .style("stroke", "#858483")
    .style("stroke-width", 1)
    .style("display", "none");

    const onMouseMove = (e) => {
      e.preventDefault();
        const [x, y] = d3.pointers(e)[0];
        const underlyingPrice = Math.round(xScale.invert(x));
        const payoff = Math.round(yScale.invert(y));
        
        const xTooltip = document.getElementById("x-axis-tooltip");
        const yTooltip = document.getElementById("y-axis-tooltip");
        crosshairVertical
        .style("display", "block")
        .attr("x1", x)
        .attr("x2", x)
        .attr("y1", 0)
        .attr("y2", HEIGHT)

        crosshairHorizontal
        .style("display", "block")
        .attr("x1", 0)
        .attr("x2", WIDTH)
        .attr("y1", y)
        .attr("y2", y)

        xTooltip.style.display = "block";
        xTooltip.textContent = underlyingPrice ? underlyingPrice : 0;
        const adjustedX = x + Math.max(MARGIN.LEFT, xTooltip.clientWidth / 2) - Math.min(MARGIN.RIGHT, xTooltip.clientWidth / 2) + 10;
        xTooltip.style.left = (adjustedX) + "px";
        xTooltip.style.top = HEIGHT + 147 + "px";

        yTooltip.style.display = "block";
        yTooltip.textContent = payoff;
        const adjustedY = 50 - yTooltip.clientWidth
        yTooltip.style.left = adjustedY + "px";
        yTooltip.style.top = y + 127 + "px";
    }

    const onMouseOut = (e) => {
      e.preventDefault();
      const xTooltip = document.getElementById("x-axis-tooltip");
      const yTooltip = document.getElementById("y-axis-tooltip");
      
      crosshairVertical.style("display", "none");
      crosshairHorizontal.style("display", "none");
      xTooltip.style.display = "none";
      yTooltip.style.display = "none";
    };

    svg.append("rect")
      .attr("class", "overlay")
      .attr("position", "relative")
      .attr("z-index", 10)
      .attr("width", WIDTH)
      .attr("height", HEIGHT)
      .attr("fill", "none")
      .attr("cursor", "crosshair")
      .style("pointer-events", "all")
      .on("mousemove", onMouseMove)
      .on("touchstart", onMouseMove)
      .on("mouseout", onMouseOut)
      .on("touchend", onMouseOut); 

    svg.append('text')
      .attr('class', 'x-label')
      .attr('x', WIDTH / 2)
      .attr('font-size', "12px")
      .attr('fill', "#aeafb0")
      .attr('y', HEIGHT + 35)
      .attr('text-anchor', 'middle')
      .attr("pointer-events", "none")
      .text('Underlying Price');

    svg.append('text')
      .attr('class', 'y-label')
      .attr('x', -HEIGHT / 2)
      .attr('font-size', "12px")
      .attr('fill', "#aeafb0")
      .attr('y', -MARGIN.LEFT + 20)
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr("pointer-events", "none")
      .text('Payoff');
  };

  useEffect(() => {
    const parentWidth = chartParentRef.current.clientWidth;
    const parentHeight = chartParentRef.current.clientHeight;
    setWidth(parentWidth);
    setHeight(parentHeight - 50);

    resizeObserver.observe(chartParentRef.current);
    drawChart();

    return () => {
      resizeObserver.unobserve(chartParentRef.current);
    };
  }, [width, legs]);

  return (
    <div
      ref={chartParentRef}
      style={{
        display: 'flex',
        width: '100%',
      }}
    >
      <div ref={chartAreaRef} style={{ display: 'flex' }}></div>
      <div id="x-axis-tooltip" style={{...tooltipStyle}}></div>
      <div id="y-axis-tooltip" style={{...tooltipStyle}}></div>
    </div>
  );
};

export default PayoffChart;