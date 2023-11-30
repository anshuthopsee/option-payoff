import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { getSelectedStrategyName } from '../../features/selected/selectedSlice';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PayoffChart from './PayoffChart';

const Chart = () => {
  const chartAreaRef = useRef();
  const selectedStrategyName = useSelector(getSelectedStrategyName);

  return (
    <Box sx={
      {
        height: { xs: "400px", md: "520px" }, 
        minWidth: "290px",
        backgroundColor: "background.secondary",
        borderRadius: "5px"
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
      <Box sx={{display: "flex", width: "100%", height: "100%"}} ref={chartAreaRef}>
        <PayoffChart parentRef={chartAreaRef}/>
      </Box>
    </Box>
  );
};

export default Chart;