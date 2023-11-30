import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import AddIcon from '@mui/icons-material/Add';
import { getSelectedStrategyLegs, updateStrategyLegs } from "../../features/selected/selectedSlice";

const AddLegs = () => {
  const inputHeaders = ["action", "strike", "premium", "type"];
  const dispatch = useDispatch();
  const selectedStrategyLegs = useSelector(getSelectedStrategyLegs);

  const [action, setAction] = useState('');
  const [strike, setStrike] = useState('');
  const [premium, setPremium] = useState('');
  const [type, setType] = useState('');

  const areStatesEmpty = () => {
    return !action || !strike || !premium || !type;
  };

  const handleActionChange = (e) => {
    setAction(e.target.value);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  const numberValidator = (value, prevState) => {
    value = value.replace(/^0+/, '0').trim(" ");
    const parsedValue = Number(value);

    const [integer, decimal] = value.split('.');

    if (!isNaN(parsedValue) && (parsedValue === 0 || (parsedValue >= 0.1 && parsedValue < 10000))) {
      if (integer !== "0" || (decimal?.charAt(0) !== "0" && decimal?.charAt(1) !== "0")) {
        return value;
      };
    };

    return prevState;
  };

  const handleStrikeChange = (e) => {
    const { value } = e.target;

    setStrike((prevState) => {
      return numberValidator(value, prevState);
    });
  };
  
  const hanldePremiumChange = (e) => {
    const { value } = e.target;

    setPremium((prevState) => {
      return numberValidator(value, prevState);
    });
  };

  const addLeg = () => {
    const updatedLegs = [];

    for (let i = 0; i < selectedStrategyLegs.length; i++) {
      updatedLegs[i] = { ...selectedStrategyLegs[i], id: i };
    };
  
    updatedLegs.push({
      id: selectedStrategyLegs.length,
      type: type,
      action: action,
      strike: Number(strike),
      premium: Number(premium),
      selected: true,
    });
  
    dispatch(updateStrategyLegs(updatedLegs));
  };

  const renderTextField = (labelText, onChange, value, selectItems, inputProps) => {
    return ( 
      <TextField
        label={labelText}
        onChange={onChange}
        value={value}
        defaultValue={undefined}
        size="small"
        select={selectItems !== undefined}
        fullWidth
        inputProps={inputProps}
      >
        {selectItems &&
          selectItems.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
      </TextField>
    );
  };

  const ActionTextField = renderTextField("Action", handleActionChange, action, ["Buy", "Sell"]);
  const TypeTextField = renderTextField("Type", handleTypeChange, type, ["CE", "PE"]);
  const StrikeTextField = renderTextField("Strike", handleStrikeChange, strike, undefined, {
    inputMode: 'numeric',
    pattern: '[0-9]*',
  });
  const PremiumTextField = renderTextField("Premium", hanldePremiumChange, premium, undefined, {
    inputMode: 'numeric',
    pattern: '[0-9]*',
  });
    
  return (
    <Box sx={
      {
        display: 'inline-flex',
        columnGap: '5px',
        height: '50px',
        alignItems: 'center',
        backgroundColor: "background.secondary",
        px: "5px",
        mt: '5px',
      }
    }> 
      <Grid container columnSpacing={"5px"} >
        {inputHeaders.map((header) => {
          return (
            <Grid item xs={3} key={header}>
              {header === "action" && ActionTextField}
              {header === "strike" && StrikeTextField}
              {header === "premium" && PremiumTextField}
              {header === "type" && TypeTextField}
            </Grid>
            )
        })}
      </Grid>
      <IconButton 
        variant={"contained"} 
        disabled={areStatesEmpty()}
        onClick={addLeg}
        disableRipple
        sx={{
          backgroundColor: "button.main",
          color: "white",
          "&.Mui-disabled": {
            color: "#b5b5b5"
          }
        }}
      >
        <AddIcon sx={{ fontSize: 26 }}/>
      </IconButton>
    </Box>
  );
};

export default AddLegs;