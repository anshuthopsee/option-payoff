import { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSelectedStrategyName, getSelectedStrategyLegs } from '../../features/selected/selectedSlice';
import { getCustomStrategies, updateCustomStrategy } from '../../features/custom/customSlice';
import { ToastContext } from '../../Contexts/ToastContextProvider';
import { Box, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import SaveNewDialog from './SaveNewDialog';
import SaveIcon from '@mui/icons-material/Save';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const selectedStrategyName = useSelector(getSelectedStrategyName);
  const selectedStrategyLegs = useSelector(getSelectedStrategyLegs);
  const { toggleToast } = useContext(ToastContext);
  const customStrategies = useSelector(getCustomStrategies);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSaveClick = () => {
    handleClose();

    dispatch(updateCustomStrategy({
      name: selectedStrategyName,
      legs: selectedStrategyLegs
    }));

    toggleToast({
      show: true,
      severity: "success",
      message: `Strategy "${selectedStrategyName}" updated.`,
      key: new Date().getTime()
    });
  };

  const handleSaveNewClick = () => {
    handleClose();
    setDialogOpen(true);
  };

  const isCustomPresetSelected = () => {
    return customStrategies.every((preset) => preset.name !== selectedStrategyName);
  };

  return (
    <Box sx={
      { 
        display: "flex", 
        alignItems: "center", 
        minHeight: "55px",
        borderBottom: 1,
        borderColor: "border.main",
        pl: 2,
        pr: 1,
        justifyContent: "space-between"
      }
    }>
      <Typography variant={'body1'}>Configure Strategy</Typography>
      <Box sx={{display: "flex", alignItems: "center", width: "auto", justifyContent: "end", columnGap: "5px"}}>
        <IconButton
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <SaveIcon/>
        </IconButton>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={handleSaveClick} disabled={isCustomPresetSelected()}>Save</MenuItem>
          <MenuItem onClick={handleSaveNewClick}>Save new</MenuItem>
        </Menu>
      </Box>
      <SaveNewDialog dialogOpen={dialogOpen} setDialogOpen={setDialogOpen}/>
    </Box>
  );
};

export default Header;