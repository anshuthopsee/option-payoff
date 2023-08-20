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
    setStrategyName(value);

    const nameExists = !customPresets.every((preset) => preset.name !== value);
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
      <DialogContent>
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
            maxLength: 15
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