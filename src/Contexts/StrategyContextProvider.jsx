import { createContext, useState } from 'react';

export const StrategyContext = createContext();

const PRESETS = {
  "Short Straddle": [
    {
      id: 0,
      type: "CE", 
      action: "Sell", 
      strike: 100, 
      premium: 5,
      selected: true
    },
    {
      id: 1,
      type: "PE", 
      action: "Sell", 
      strike: 100, 
      premium: 5,
      selected: true
    },
  ],
  "Short Strangle": [
    {
      id: 0,
      type: "CE", 
      action: "Sell", 
      strike: 200, 
      premium: 5,
      selected: true
    },
    {
      id: 1,
      type: "PE", 
      action: "Sell", 
      strike: 100, 
      premium: 10,
      selected: true
    },
  ],
  "Bull Call Spread": [
    {
      id: 0,
      type: "CE", 
      action: "Buy", 
      strike: 100, 
      premium: 10,
      selected: true
    },
    {
      id: 1,
      type: "CE", 
      action: "Sell", 
      strike: 150, 
      premium: 5,
      selected: true
    },
  ],
  "Bull Put Spread": [
    {
      id: 0,
      type: "PE", 
      action: "Sell", 
      strike: 150, 
      premium: 10,
      selected: true
    },
    {
      id: 1,
      type: "PE", 
      action: "Buy", 
      strike: 100, 
      premium: 5,
      selected: true
    },
  ]
};

const StrategyContextProvider = ({ children }) => {
  const [legs, setLegs] = useState(PRESETS["Short Straddle"]);
  const [selectedPreset, setSelectedPreset] = useState({
    name: "Short Straddle",
    custom: false
  });
  
  const selectPreset = (presetName, custom=false) => {
    setSelectedPreset(
      {
        name: presetName,
        custom: custom
      }
    );
    setLegs(PRESETS[presetName]);
  };

  const updateLegs = (updatedLegs) => {
    if (updatedLegs.length <= 10) {
      setLegs(updatedLegs);
    };
  };

  return (
    <StrategyContext.Provider value={{ legs, updateLegs, selectedPreset, setSelectedPreset, selectPreset}}>
      {children}
    </StrategyContext.Provider>
  );
};

export default StrategyContextProvider;