import { useContext } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { StrategyContext } from '../../contexts/StrategyContextProvider';
import { CustomPresetsContext } from '../../contexts/CustomPresetsContextProvider';
import { ToastContext } from '../../contexts/ToastContextProvider';
import CancelIcon from '@mui/icons-material/Close';

const CustomSVG = ({ name, index }) => {
  const { selectedPreset } = useContext(StrategyContext);
  const { deleteCustomPreset, selectCustomPreset } = useContext(CustomPresetsContext);
  const { toggleToast } = useContext(ToastContext);

  const isSelected = () => {
    if (selectedPreset.name === name && selectedPreset.custom) {
      return true;
    } else {
      return false;
    };
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    deleteCustomPreset(index);
    toggleToast({
      show: true,
      severity: "error",
      message: `Strategy "${name}" deleted.`,
      key: new Date().getTime()
    })
  };

  return (
    <Box sx={
      { 
        display: "flex", 
        p: "10px", 
        border: isSelected() ? 2 : 2, 
        borderColor:  isSelected() ? "border.selected" : "border.main",
        position: "relative",
        borderRadius: "5px",  
        cursor: "pointer",
        height: "100%", 
        width: "fit-content",
        position: "relative", 
        justifyContent: "center" 
      }
    }
      onClick={() => selectCustomPreset(name, index)}
    >
      <IconButton sx={{ position: 'absolute', top: "0px", right: "0px" }} onClick={handleDeleteClick}>
        <CancelIcon/>
      </IconButton>
      <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        {/* Background */}
        <rect x="0" y="0" width="100" height="100" fill="transparent" />
        {/* X-Axis */}
        <line x1="0" y1="50" x2="100" y2="50" stroke="#c9c7c7" strokeWidth="1" />
        {/* Y-Axis */}
        <line x1="0" y1="0" x2="0" y2="100" stroke="#c9c7c7" strokeWidth="1" />
  
      </svg>
      <Typography variant='body2' sx={{ position: "absolute", bottom: "7px", fontSize: "11px" }}>{`${name}`}</Typography>
    </Box>
  );
};

export default CustomSVG;