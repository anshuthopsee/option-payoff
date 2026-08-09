import { useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getSelectedStrategyName, getSelectedStrategyLegs } from '../../features/selected/selectedSlice';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PayoffChart from './PayoffChart';

const calculatePayoff = (price, leg) => {
  const pos = leg.action === "Buy" ? 1 : -1;
  return leg.type === 'CE'
    ? pos * (Math.max(price - leg.strike, 0) - leg.premium)
    : pos * (Math.max(leg.strike - price, 0) - leg.premium);
};

const getPayoffDetails = (legs) => {
  if (!legs || legs.length === 0) return { maxProfit: 0, maxLoss: 0, breakEvens: [] };

  const selected = legs.filter(l => l.selected);
  if (selected.length === 0) return { maxProfit: 0, maxLoss: 0, breakEvens: [] };

  const minStrike = Math.min(...selected.map(l => l.strike));
  const maxStrike = Math.max(...selected.map(l => l.strike));
  const range = maxStrike - minStrike || 100;
  const steps = 500;
  const stepSize = range / steps;

  let maxProfit = -Infinity;
  let maxLoss = Infinity;
  const breakEvens = [];

  let prevPrice = minStrike - range / 2;
  let prevPayoff = 0;

  for (let i = 0; i <= steps; i++) {
    const price = minStrike - range / 2 + i * stepSize;
    const payoff = selected.reduce((sum, leg) => sum + calculatePayoff(price, leg), 0);
    maxProfit = Math.max(maxProfit, payoff);
    maxLoss = Math.min(maxLoss, payoff);

    if (i > 0 && ((prevPayoff < 0 && payoff >= 0) || (prevPayoff > 0 && payoff <= 0))) {
      const be = prevPrice - (prevPayoff * (price - prevPrice) / (payoff - prevPayoff));
      breakEvens.push(Math.round(be * 100) / 100);
    }
    prevPrice = price;
    prevPayoff = payoff;
  }

  return {
    maxProfit: Math.round(maxProfit * 100) / 100,
    maxLoss: Math.round(maxLoss * 100) / 100,
    breakEvens
  };
};

const Chart = () => {
  const chartAreaRef = useRef();
  const selectedStrategyName = useSelector(getSelectedStrategyName);
  const selectedStrategyLegs = useSelector(getSelectedStrategyLegs);
  const details = useMemo(() => getPayoffDetails(selectedStrategyLegs), [selectedStrategyLegs]);

  return (
    <Box sx={
      {
        minHeight: { xs: "400px", md: "520px" },
        width: "100%",
        backgroundColor: "background.secondary",
        borderRadius: "5px",
        display: "flex",
        flexDirection: "column"
      }
    }>
      <Box sx={
        { 
          display: "flex", 
          alignItems: "center", 
          height: '55px', 
          borderBottom: 1,
          borderColor: "border.main", 
          px: 2, 
          justifyContent: 
          'space-between'
        }
      }>
        <Typography variant='body1'>
          {`${selectedStrategyName} Payoff at Expiry`}
        </Typography>
      </Box>
      <Box sx={{display: "flex", width: "100%", flex: 1}} ref={chartAreaRef}>
        <PayoffChart parentRef={chartAreaRef}/>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, px: 2, pb: 2, flexWrap: 'wrap' }}>
        <Typography variant="body2" sx={{ color: '#32CD32', fontWeight: 'bold' }}>
          Max Profit: {isFinite(details.maxProfit) ? `₹${details.maxProfit}` : 'Unlimited'}
        </Typography>
        <Typography variant="body2" sx={{ color: '#FF6347', fontWeight: 'bold' }}>
          Max Loss: {isFinite(details.maxLoss) ? `₹${Math.abs(details.maxLoss)}` : 'Unlimited'}
        </Typography>
        {details.breakEvens.length > 0 && (
          <Typography variant="body2" sx={{ color: '#aeafb0', fontWeight: 'bold' }}>
            Break-even: {details.breakEvens.join(', ')}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Chart;