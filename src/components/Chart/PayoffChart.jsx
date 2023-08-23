import { useRef, useEffect, useState, useContext } from 'react';
import { StrategyContext } from '../../Contexts/StrategyContextProvider';
import * as d3 from 'd3';

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

    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${HEIGHT})`)
      .call(d3.axisBottom(xScale));

    svg.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(yScale));

    svg.append('g')
      .attr('class', 'x-axis-zero')
      .attr("transform", `translate(0, ${yScale(Math.min(d3.max(data, d => d.y), 0))})`)
      .attr('stroke-dasharray', '12 12')
      .attr("stroke-width", "2px")
      .call(d3.axisBottom(xZeroLine));
    
    const outsideArea = d3.area()
      .x(d => xScale(d.x))
      .y0(yScale(0))
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

    svg.append('text')
      .attr('class', 'x-label')
      .attr('x', WIDTH / 2)
      .attr('font-size', "12px")
      .attr('fill', "#aeafb0")
      .attr('y', HEIGHT + 35)
      .attr('text-anchor', 'middle')
      .text('Underlying Price');

    svg.append('text')
      .attr('class', 'y-label')
      .attr('x', -HEIGHT / 2)
      .attr('font-size', "12px")
      .attr('fill', "#aeafb0")
      .attr('y', -MARGIN.LEFT + 20)
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
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
    </div>
  );
};

export default PayoffChart;