import { useContext, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import { StrategyContext } from './StrategyContextProvider';
export const CustomPresetsContext = createContext();

const CustomPresetsContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [customPresets, setCustomPresets] = useLocalStorage("customPresets", []);
  const { 
    selectedPreset, 
    selectPreset, 
    setSelectedPreset, 
    legs, 
    updateLegs 
  } = useContext(StrategyContext);

  const saveNewCustomPreset = (name) => {
    const newCustomPreset = {
      name: name,
      legs: [...legs]
    };
    const newCustomPresets = [...customPresets, newCustomPreset];
    if (customPresets.length <= 4) {
      setCustomPresets(newCustomPresets);
    };
  };

  const saveCustomPreset = () => {
    const updatedPreset = { name: selectedPreset.name, legs: legs }
    setCustomPresets(
      customPresets.map((preset) => (preset.name === selectedPreset.name) ? updatedPreset : preset)
    )
  };

  const deleteCustomPreset = (index) => {
    const tobeDeleted = customPresets[index];

    if (tobeDeleted.name === selectedPreset.name) {
      const precedingPresetIndex = index-1;
      if (precedingPresetIndex > -1) {
        const precedingPresetName = customPresets[precedingPresetIndex].name;
        navigate(`/${precedingPresetName}`);
      } else {
        navigate("/Bull-Put-Spread");
      };
    };
    setCustomPresets(customPresets.filter((preset, i) => index !== i))
  };

  const selectCustomPreset = (presetName, customPresetIndex) => {
    setSelectedPreset(
      {
        name: presetName, 
        custom: true
      }
    );
    updateLegs(customPresets[customPresetIndex].legs);
  };

  const value = {
    customPresets: customPresets,
    setCustomPresets: setCustomPresets,
    deleteCustomPreset: deleteCustomPreset,
    saveCustomPreset: saveCustomPreset,
    saveNewCustomPreset: saveNewCustomPreset,
    selectCustomPreset: selectCustomPreset
  };

  return (
    <CustomPresetsContext.Provider value={value}>
      {children}
    </CustomPresetsContext.Provider>
  );
};

export default CustomPresetsContextProvider;