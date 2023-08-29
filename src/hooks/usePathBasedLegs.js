import { useState } from "react";
import { PRESETS } from "../const/presets";
import { splitWords, getHash } from "./utils";

const getLegs = (defaultPresetName) => {
  const hash = getHash();
  if (!hash) return PRESETS[defaultPresetName];

  const presetName = splitWords(hash);
  const inPresets = Object.keys(PRESETS).includes(presetName);
  if (inPresets) {
    return PRESETS[presetName];
  };

  const customPresets = JSON.parse(localStorage.getItem("customPresets"));
  if (customPresets) {
    for (const preset of customPresets) {
      if (preset.name === presetName) {
        return preset.legs;
      }
    }
    return PRESETS[defaultPresetName];
  }
  return PRESETS[defaultPresetName];
};

const usePathBasedLegs = (defaultPresetName) => {
  const [legs, setLegs] = useState(() => {
    return getLegs(defaultPresetName);
  });

  return [legs, setLegs];
};

export default usePathBasedLegs;