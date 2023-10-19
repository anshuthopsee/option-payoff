import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { StrategyContext } from '../../Contexts/StrategyContextProvider';

const BullCallSpreadSVG = () => {
  const navigate = useNavigate();
  const { selectedPreset } = useContext(StrategyContext);

  const isSelected = () => {
    return (selectedPreset.name === "Bull Call Spread" && !selectedPreset.custom);
  };

  return (
    <Box sx={
      { 
        display: "flex", 
        p: "10px", 
        border: isSelected() ? 2 : 2, 
        borderColor:  isSelected() ? "border.selected" : "border.main",
        borderRadius: "5px",  
        cursor: "pointer",
        height: "100%", 
        width: "fit-content",
        position: "relative", 
        justifyContent: "center" 
      }
    }
      onClick={() => navigate("#/Bull-Call-Spread")}
    >
      <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        {/* Background */}
        <rect x="0" y="0" width="100" height="100" fill="transparent" />
  
        {/* X-Axis */}
        <line x1="0" y1="50" x2="100" y2="50" stroke="#c9c7c7" strokeWidth="1" />
        {/* Y-Axis */}
        <line x1="0" y1="0" x2="0" y2="100" stroke="#c9c7c7" strokeWidth="1" />
  
        {/* Call Option Line That Stays Above X Axis*/}
        <line x1="45" y1="50" x2="65" y2="30" stroke="#32CD32" strokeWidth="2" />
        {/* Call Option Line That Goes Below X Axis*/}
        <line x1="35" y1="60" x2="45" y2="50" stroke="#FF6347" strokeWidth="2" />
        <line x1="20" y1="60" x2="35" y2="60" stroke="#FF6347" strokeWidth="2" />
  
        {/* Put Option Line That Goes Below X Axis*/}
        <line x1="65" y1="30" x2="80" y2="30" stroke="#32CD32" strokeWidth="2" />
      </svg>
      <Typography variant='body2' sx={{ position: "absolute", bottom: "7px", fontSize: "11px" }}>Bull Call Spread</Typography>
    </Box>
  );
};

export default BullCallSpreadSVG;