import { useContext } from "react";
import { ToastContext } from "../contexts/ToastContextProvider";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";

export default function Toast() {
  const { toastState, toggleToast } = useContext(ToastContext);

  const handleExited = () => {
    toggleToast( {
        show: false,
        message: undefined,
        severity: toastState.severity,
        key: toastState.key
    });
  };

  const handleClose = (e, reason) => {
    if (reason === "clickaway") return;
    
    toggleToast({
      show: false,
      message: toastState.message,
      severity: toastState.severity,
      key: toastState.key
    });
  };
  
  return (
    <Snackbar
      key={toastState.key}
      open={toastState.show}
      TransitionComponent={Slide}
      autoHideDuration={5000}
      onClose={handleClose}
      TransitionProps={
      {
        onExited: handleExited
      }}
      disableWindowBlurListener
    >
    <Alert 
      severity={toastState.severity} 
      sx={{ width: '100%' }}
    >
      {toastState.message}
    </Alert>
    </Snackbar>
  );
};