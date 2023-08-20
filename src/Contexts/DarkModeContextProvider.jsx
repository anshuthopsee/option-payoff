import { createContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

export const DarkModeContext = createContext();

const DarkModeContextProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useLocalStorage("darkMode", false);
  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
        {children}
    </DarkModeContext.Provider>
  )
}

export default DarkModeContextProvider;