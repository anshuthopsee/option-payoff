import { useState, useContext } from 'react';
import { StrategyContext } from '../../Contexts/StrategyContextProvider';
import { CustomPresetsContext } from '../../Contexts/CustomPresetsContextProvider';
import { ToastContext } from '../../Contexts/ToastContextProvider';
import { Box, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import SaveNewDialog from './SaveNewDialog';
import SaveIcon from '@mui/icons-material/Save';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const open = Boolean(anchorEl);
  const { selectedPreset } = useContext(StrategyContext);
  const { customPresets, saveCustomPreset } = useContext(CustomPresetsContext);
  const { toggleToast } = useContext(ToastContext);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSaveClick = () => {
    handleClose();
    saveCustomPreset();
    toggleToast({
      show: true,
      severity: "success",
      message: `Strategy "${selectedPreset.name}" updated.`,
      key: new Date().getTime()
    })
  };

  const handleSaveNewClick = () => {
    handleClose();
    setDialogOpen(true);
  };

  const isCustomPresetSelected = () => {
    return customPresets.every((preset) => preset.name !== selectedPreset.name);
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