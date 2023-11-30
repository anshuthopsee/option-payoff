import { configureStore } from '@reduxjs/toolkit';
import { PRESETS } from './const/presets.js';
import { splitWords, getPathName } from './hooks/utils.js';
import selectedReducer, { setSelectedStrategy, getSelectedStrategyName } from './features/selected/selectedSlice.js';
import customReducer, { setCustomStrategies } from './features/custom/customSlice.js';

const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  if (action.type === "selected/fetchMFData/pending" || 
    action.type === "selected/removeFund") {

    const selected = {
      schemeName: store.getState().selected.schemeName,
      schemeCode: store.getState().selected.schemeCode,
    };

    localStorage.setItem("selectedFund", JSON.stringify(selected));
  };

  if (action.type === "theme/switchTheme") {
    const theme = {
      mode: store.getState().theme.mode
    };

    localStorage.setItem("appTheme", JSON.stringify(theme));
  };

  if (action.type === "custom/addCustomStrategy" || 
    "custom/removeCustomStrategy" || 
    "custom/updateCustomStrategy"
  ) {
    const strategies = store.getState().custom.strategies

    localStorage.setItem("customStrategies", JSON.stringify(strategies));
  };

  return result;
};

const store = configureStore({
  reducer: {
    selected: selectedReducer,
    custom: customReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(localStorageMiddleware),
});

const savedCustomStrategies = JSON.parse(localStorage.getItem("customStrategies"));

if (savedCustomStrategies.length > 0) {
  store.dispatch(setCustomStrategies(savedCustomStrategies));
};

export default store;
