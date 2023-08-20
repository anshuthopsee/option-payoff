import { createTheme } from "@mui/material"
import { blue } from "@mui/material/colors";

const commonButtonTheme = (darkMode) => {
  return {
    defaultProps: {
      size: "small"
    },
    styleOverrides: {
      root: ({ ownerState }) => {
        if (ownerState.variant === 'contained') {
          return {
            minHeight: "35px",
            minWidth: "35px",
            borderRadius: "3px",
            backgroundColor: ownerState.disabled ? blue[100] : darkMode ? blue[300] : blue[600],
            color: "white",
            '&:hover': {
              backgroundColor: darkMode ? blue[300] : blue[600],
            }, 
          }
        }
      }
    }
  };
};

export const buttonTheme = (darkMode) => createTheme({
  components: {
    MuiButton: {...commonButtonTheme(darkMode)},
    MuiButtonBase: {...commonButtonTheme(darkMode)}
  }
});

export const textFieldTheme = (darkMode) => {
  return createTheme({
    components: {
      MuiTextField: {
        defaultProps: {
          size: 'small',
          variant: 'outlined'
        },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: darkMode ? "#525252" : "#d1d1d1",
              },
              "&:hover fieldset": {
                borderColor: darkMode ? "#ffffff" : "#0a0a0a",
              },
              '&.Mui-focused fieldset': {
                borderColor: blue[400],
              },
            }
          }
        }
      },
    }
  });
};