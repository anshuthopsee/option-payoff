import { useState, useEffect } from "react";

const getSavedState = (key, initialState) => {
  const savedState = JSON.parse(localStorage.getItem(key));

  if (savedState) return savedState;
  if (typeof initialState === "function") return initialState();
  return initialState;
};

const useLocalStorage = (key, initialState) => {
  const [state, setState] = useState(() => {
    return getSavedState(key, initialState);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [state]);
  
  return [state, setState];
};

export default useLocalStorage;