import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { joinWords } from '../../hooks/utils';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { StrategyContext } from '../../Contexts/StrategyContextProvider';
import { CustomPresetsContext } from '../../Contexts/CustomPresetsContextProvider';
import { ToastContext } from '../../Contexts/ToastContextProvider';
import CancelIcon from '@mui/icons-material/Close';

const CustomSVG = ({ name, index }) => {
  const navigate = useNavigate();
  const { selectedPreset } = useContext(StrategyContext);
  const { deleteCustomPreset } = useContext(CustomPresetsContext);
  const { toggleToast } = useContext(ToastContext);

  const isSelected = () => {
    return (selectedPreset.name === name && selectedPreset.custom);
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
      onClick={() => navigate(`/${joinWords(name)}`)}
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
      <div style={{ position: "absolute", bottom: "7px", display: "flex", maxWidth: "80px", height: "fit-content", flexWrap: "wrap"}}>
        <Typography variant='body2' sx={{ fontSize: "11px", maxWidth: "100%", wordWrap: "break-word" }}>
          {`${name}`}
        </Typography>
      </div>
    </Box>
  );
};

export default CustomSVG;