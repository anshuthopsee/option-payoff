import { useState, createContext } from 'react';

export const ToastContext = createContext();

const ToastContextProvider = ({children}) => {
  const [toastState, setToastState] = useState({
    show: false,
    severity: "info",
    message: undefined,
    key: undefined
  });

  const toggleToast = (updatedToastState) => {
    setToastState({...updatedToastState});
  };

  return (
    <ToastContext.Provider value={{ toastState, toggleToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export default ToastContextProvider;