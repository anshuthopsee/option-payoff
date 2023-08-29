import { useState, useEffect, useRef } from "react";
import useUpdateEffect from "./useUpdateEffect";
import { PRESETS } from "../const/presets";
import { splitWords, joinWords, getHash } from "./utils";

const getSelectedPreset = (defaultPresetName) => {
  const hash = getHash();
  if (!hash) return { name: defaultPresetName, custom: false };

  const pathName = splitWords(hash);
  console.log(pathName)
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
      }
    };
  };
  return null;
};

const usePathBasedPresetName = (initialState, setLegs) => {
  const firstRender = useRef(true);
  const [selectedPreset, setSelectedPreset] = useState(() => getSelectedPreset(initialState.name));

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
    if (firstRender.current) {
      const joinedWords = joinWords(selectedPreset.name);
      history.replaceState(selectedPreset.name, document.title, document.URL.split('#')[0] + `#/${joinedWords}`);
      firstRender.current = false;
    };
  }, []);

  useEffect(() => {
    window.onpopstate = handlePopState;
    const joinedWords = joinWords(selectedPreset.name);
    const hash = getHash();
    const presetName = splitWords(hash);
    if (selectedPreset.name !== presetName) {
      history.pushState(presetName, document.title, document.URL.split('#')[0] + `#/${joinedWords}`);
    };
  }, [selectedPreset]);

  return [selectedPreset, setSelectedPreset];
};

export default usePathBasedPresetName;