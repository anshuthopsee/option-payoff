import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  strategies: []
};

const customSlice = createSlice({
  name: 'custom',
  initialState,
  reducers: {
    setCustomStrategies: (state, action) => {
      state.strategies = [...action.payload];
    },
    addCustomStrategy: (state, action) => {
      state.strategies.push(action.payload);
    },
    removeCustomStrategy: (state, action) => {
      state.strategies = state.strategies.filter((strategy, i) => i !== action.payload);
    },
    updateCustomStrategy: (state, action) => {
      const updatedStrategy = action.payload;
      const strategyIndex = state.strategies.findIndex((strategy) => strategy.name === updatedStrategy.name);
      if (strategyIndex !== -1) {
        state.strategies[strategyIndex] = updatedStrategy;
      };
    },
  },
});

export const getCustomStrategies = (store) => store.custom.strategies;

export const { setCustomStrategies, addCustomStrategy, removeCustomStrategy, updateCustomStrategy } = customSlice.actions;

export default customSlice.reducer;