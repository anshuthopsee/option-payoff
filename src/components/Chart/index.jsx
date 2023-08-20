import { useRef, useContext } from 'react';
import { StrategyContext } from '../../Contexts/StrategyContextProvider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PayoffChart from './PayoffChart';

const getStrategyName = (selected) => {
  if (Object.keys(PRESET_NAMES).includes(selected)) {
    return PRESET_NAMES[selected];
  } else {
    return selected;
  }
};

const Chart = () => {
  const chartAreaRef = useRef();
  const { selectedPreset } = useContext(StrategyContext);

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
          {`${selectedPreset.name} Payoff at Expiry`}
        </Typography>
      </Box>
      <Box sx={{display: "flex", width: "100%", height: "100%"}} ref={chartAreaRef}>
        <PayoffChart parentRef={chartAreaRef}/>
      </Box>
    </Box>
  );
};

export default Chart;