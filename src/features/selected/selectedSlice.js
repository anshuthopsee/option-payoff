import { createSlice } from '@reduxjs/toolkit';
import { PRESETS } from '../../const/presets';

const initialState = {
  strategyName: "Short Straddle",
  strategyLegs: [...PRESETS["Short Straddle"]],
};

const selectedSlice = createSlice({
  name: 'selected',
  initialState,
  reducers: {
    setSelectedStrategy: (state, action) => {
      state.strategyName = action.payload.strategyName;
      state.strategyLegs = action.payload.strategyLegs;
    },
    updateStrategyLegs: (state, action) => {
      state.strategyLegs = [...action.payload];
    },
    clearSelectedStrategy: (state) => {
      return null;
    },
  },
});

export const getSelectedStrategyName = (store) => store.selected.strategyName;

export const getSelectedStrategyLegs = (store) => store.selected.strategyLegs;

export const { setSelectedStrategy, clearSelectedStrategy, updateStrategyLegs } = selectedSlice.actions;

export default selectedSlice.reducer;
