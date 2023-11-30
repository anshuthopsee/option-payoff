import { useState, useContext, forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSelectedStrategyLegs } from '../../features/selected/selectedSlice';
import { addCustomStrategy, getCustomStrategies } from '../../features/custom/customSlice';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { ToastContext } from '../../Contexts/ToastContextProvider';
import { PRESETS } from '../../const/presets';
import { Typography } from '@mui/material';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function SaveNewDialog({ dialogOpen, setDialogOpen }) {
  const [strategyName, setStrategyName] = useState("");
  const [saveDisabled, setSaveDisabled] = useState(false);
  const customStrategies = useSelector(getCustomStrategies);
  const selectedStrategyLegs = useSelector(getSelectedStrategyLegs);
  const { toggleToast } = useContext(ToastContext);
  const dispatch = useDispatch();
  
  const handleClose = () => {
    setDialogOpen(false);
    setStrategyName("");
  };

  const handleChange = (e) => {
    const { value } = e.target; 
    const format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (!format.test(value)) {
      setStrategyName(value);
    };

    const nameExists = !customStrategies.every((preset) => preset.name !== value)
    || Object.keys(PRESETS).includes(value);

    if (nameExists) {
      setSaveDisabled(true);
    } else {
      setSaveDisabled(false);
    };
  };

  const handleSave = () => {
    if (strategyName) {
      const nameWithoutExtraSpaces = strategyName.trim().replace(/ +/g, ' ');
      // saveNewCustomPreset(nameWithoutExtraSpaces);
      dispatch(addCustomStrategy({
        name: nameWithoutExtraSpaces,
        legs: [...selectedStrategyLegs]
      }));

      setDialogOpen(false);
      setStrategyName("");
      toggleToast({
        show: true,
        severity: "success",
        message: `New strategy "${strategyName}" saved.`,
        key: new Date().getTime()
      });
    };
  };

  return (
    <Dialog open={dialogOpen} onClose={handleClose} TransitionComponent={Transition}>
      <DialogTitle>Save new strategy</DialogTitle>
      <DialogContent sx={{ maxWidth: "395px" }}>
        <Typography variant='body2' sx={{mb: "10px", color: "text.secondary"}}>Name cannot match an existing name or have special characters in it.</Typography>
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