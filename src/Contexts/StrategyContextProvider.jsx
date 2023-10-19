import { createContext } from 'react';
import usePathBasedPresetName from '../hooks/usePathBasedPresetName';
import usePathBasedLegs from '../hooks/usePathBasedLegs';
import { PRESETS } from '../const/presets';

export const StrategyContext = createContext();

const defaultPresetName = "Short Straddle";

const StrategyContextProvider = ({ children }) => {

  const [selectedPreset, setSelectedPreset] = usePathBasedPresetName({
    name: defaultPresetName,
    custom: false
  });

  const [legs, setLegs] = usePathBasedLegs(selectedPreset.name);

  const updateLegs = (updatedLegs) => {
    if (updatedLegs.length <= 10) {
      setLegs(updatedLegs);
    };
  };

  return (
    <StrategyContext.Provider value={{ legs, updateLegs, selectedPreset }}>
      {children}
    </StrategyContext.Provider>
  );
};

export default StrategyContextProvider;