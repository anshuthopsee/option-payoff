import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { getPathName } from "./utils";
import { PRESETS } from "../const/presets";
import { splitWords, joinWords, getHash } from "./utils";

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

const getCustomPresetLegs = (presetName) => {
  const customPresets = JSON.parse(localStorage.getItem("customPresets"));
  if (customPresets) {
    for (const preset of customPresets) {
      if (preset.name === presetName) {
        return preset.legs;
      };
    };
  };
  return null;
};

const usePathBasedPresetName = (initialState, setLegs) => {
  const location = useLocation();
  const pathName = getPathName(location);

  const firstRender = useRef(true);
  const [selectedPreset, setSelectedPreset] = useState(() => getSelectedPreset(initialState.name, pathName));

  const handlePopState = () => {
    const preset = getSelectedPreset(selectedPreset.name);
    if (preset.name !== selectedPreset.name) {
      setSelectedPreset(preset);
      if (!preset.custom) {
        setLegs(PRESETS[preset.name]);
      } else {
        const customPresetLegs = getCustomPresetLegs(preset.name);
        setLegs(customPresetLegs);
      };
    };
  };

  useEffect(() => {
    if (pathName && pathName !== selectedPreset.name) {
      setSelectedPreset(getSelectedPreset(initialState.name, pathName));
    };
  }, [pathName]);

  return [selectedPreset, setSelectedPreset];
};

export default usePathBasedPresetName;