import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { getPathName, joinWords } from "./utils";
import { PRESETS } from "../const/presets";
import { splitWords } from "./utils";

const getSelectedPreset = (defaultPresetName, pathName) => {
  if (!pathName) return { name: defaultPresetName, custom: false };

  pathName = splitWords(pathName);
  const inPresets = Object.keys(PRESETS).includes(pathName);
  if (inPresets) {
    return { name: pathName, custom: false }
  };

  const customPresets = JSON.parse(localStorage.getItem("customPresets"));
  if (customPresets) {
    for (const preset of customPresets) {
      if (preset.name === pathName) {
        return { name: pathName, custom: true }
      };
    };
    return { name: defaultPresetName, custom: false };
  };
  return { name: defaultPresetName, custom: false };
};

const usePathBasedPresetName = (initialState) => {
  const location = useLocation();
  const pathName = getPathName(location);

  const [selectedPreset, setSelectedPreset] = useState(() => getSelectedPreset(initialState.name, pathName));

  useEffect(() => {
    const joinedWords = joinWords(initialState.name);
    history.replaceState(selectedPreset.name, document.title, document.URL.split('#')[0] + `#/${joinedWords}`);
  }, []);

  useEffect(() => {
    if (pathName && pathName !== selectedPreset.name) {
      setSelectedPreset(getSelectedPreset(selectedPreset.name, pathName));
    };
  }, [pathName]);

  return [selectedPreset, setSelectedPreset];
};

export default usePathBasedPresetName;