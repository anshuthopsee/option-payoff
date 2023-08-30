import { useState, useContext, forwardRef } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { CustomPresetsContext } from '../../Contexts/CustomPresetsContextProvider';
import { ToastContext } from '../../Contexts/ToastContextProvider';
import { PRESETS } from '../../const/presets';
import { Typography } from '@mui/material';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function SaveNewDialog({ dialogOpen, setDialogOpen }) {
  const [strategyName, setStrategyName] = useState("");
  const [saveDisabled, setSaveDisabled] = useState(false);
  const { customPresets, saveNewCustomPreset } = useContext(CustomPresetsContext);
  const { toggleToast } = useContext(ToastContext);
  
  const handleClose = () => {
    setDialogOpen(false);
    setStrategyName("");
  };

  const handleChange = (e) => {
    const { value } = e.target;
    if (value.includes("-")) return;
    if (value.includes('"')) return;
    if (value.includes("/")) return;
    setStrategyName(value);

    const nameExists = !customPresets.every((preset) => preset.name !== value)
    || Object.keys(PRESETS).includes(value);

    if (nameExists) {
      setSaveDisabled(true);
    } else {
      setSaveDisabled(false);
    };
  };

  const handleSave = () => {
    if (strategyName) {
      saveNewCustomPreset(strategyName);
      setDialogOpen(false);
      setStrategyName("");
      toggleToast({
        show: true,
        severity: "success",
        message: `New strategy "${strategyName}" saved.`,
        key: new Date().getTime()
      })
    };
  };

  return (
    <Dialog open={dialogOpen} onClose={handleClose} TransitionComponent={Transition}>
      <DialogTitle>Save new strategy</DialogTitle>
      <DialogContent sx={{ maxWidth: "440px" }}>
        <Typography variant='body2' sx={{mb: "10px", color: "text.secondary"}}>Name cannot match an exisiting name, or have any of these [-"/] characters in it</Typography>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Strategy Name"
          type="email"
          fullWidth
          variant="outlined"
          value={strategyName}
          onChange={handleChange}
          focused
          inputProps={{
            maxLength: 30
          }}
        />
      </DialogContent>
      <DialogActions sx={{px: "20px", pb: "20px"}}>
        <Button onClick={handleClose} variant='contained' size='small' fullWidth>Cancel</Button>
        <Button onClick={handleSave} disabled={!strategyName || saveDisabled} variant='contained' size='small' fullWidth>Save</Button>
      </DialogActions>
    </Dialog>
  );
}