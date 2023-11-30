import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { getSelectedStrategyName } from '../../features/selected/selectedSlice';

const ShortStraddleSVG = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedStrategyName = useSelector(getSelectedStrategyName);
  
  const isSelected = () => {
    return (selectedStrategyName === "Short Straddle") 
  };

  const handleClick = () => {
    navigate("#/Short-Straddle");
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
      onClick={handleClick}
    >
      <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        {/* Background */}
        <rect x="0" y="0" width="100" height="100" fill="transparent" />
  
        {/* X-Axis */}
        <line x1="0" y1="50" x2="100" y2="50" stroke="#c9c7c7" strokeWidth="1" />
        {/* Y-Axis */}
        <line x1="0" y1="0" x2="0" y2="100" stroke="#c9c7c7" strokeWidth="1" />
  
        {/* Call Option Line That Stays Above X Axis*/}
        <line x1="35" y1="50" x2="50" y2="30" stroke="#32CD32" strokeWidth="2" />
        {/* Call Option Line That Goes Below X Axis*/}
        <line x1="20" y1="70" x2="35" y2="50" stroke="#FF6347" strokeWidth="2" />
  
        {/* Put Option Line That Stays Above X Axis*/}
        <line x1="50" y1="30" x2="65" y2="50" stroke="#32CD32" strokeWidth="2" />
        {/* Put Option Line That Goes Below X Axis*/}
        <line x1="65" y1="50" x2="80" y2="70" stroke="#FF6347" strokeWidth="2" />
      </svg>
      <Typography variant='body2' sx={{ position: "absolute", bottom: "7px", fontSize: "11px" }}>Short Straddle</Typography>
    </Box>
  );
};

export default ShortStraddleSVG;