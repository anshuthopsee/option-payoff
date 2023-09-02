import { useState, useContext } from "react"
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import AddIcon from '@mui/icons-material/Add';
import { StrategyContext } from '../../Contexts/StrategyContextProvider';

const AddLegs = () => {
  const inputHeaders = ["action", "strike", "premium", "type"];
  const { legs, updateLegs } = useContext(StrategyContext);

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
    value = value.replace(/^0+/, '0');
    const parsedValue = Number(value);

    if (!isNaN(parsedValue) && (parsedValue === 0 || (parsedValue >= 0.1 && parsedValue < 10000))) {
      return value;
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
    const id = legs.length;
    const updatedLegs = [...legs, 
      {
        id: id, 
        type: type, 
        action: action, 
        strike: Number(strike), 
        premium: Number(premium),
        selected: true
      }
    ];
    updateLegs(updatedLegs);
  };

  const renderTextField = (header) => {
    if (header === "action") {
      return (
        <TextField 
          label={"Action"}
          onChange={handleActionChange}
          value={action}
          size= "small"
          select
          fullWidth
        >
          <MenuItem value="Buy">Buy</MenuItem>
          <MenuItem value="Sell">Sell</MenuItem>
        </TextField>
      );
    } else if (header === "type") {
      return (
        <TextField 
          label={"Type"}
          onChange={handleTypeChange}
          value={type}
          defaultValue={undefined}
          size= "small"
          select
          fullWidth
        >
          <MenuItem value="CE">CE</MenuItem>
          <MenuItem value="PE">PE</MenuItem>
        </TextField>
      );
    } else if (header === "strike") {
      return (
        <TextField 
          label={"Strike"}
          onChange={handleStrikeChange}
          value={strike}
          defaultValue={undefined}
          inputProps={{
            inputMode: 'numeric',
            pattern: '[0-9]*'
          }}
          size= "small"
          fullWidth
        />
      );
    } else if (header === "premium") {
      return (
        <TextField 
          label={"Premium"}
          onChange={hanldePremiumChange}
          value={premium}
          defaultValue={undefined}
          inputProps={{
            inputMode: 'numeric',
            pattern: '[0-9]*'
          }}
          size= "small"
          fullWidth
        />
      );
    };
  };
    
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
              {renderTextField(header)}
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