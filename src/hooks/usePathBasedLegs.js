import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PRESETS } from "../const/presets";
import { splitWords, getPathName } from "./utils";

const getLegs = (defaultPresetName, pathName) => {
  if (!pathName) return PRESETS[defaultPresetName];

  pathName = splitWords(pathName);
  const inPresets = Object.keys(PRESETS).includes(pathName);
  if (inPresets) {
    return PRESETS[pathName];
  };

  const customPresets = JSON.parse(localStorage.getItem("customPresets"));
  if (customPresets) {
    for (const preset of customPresets) {
      if (preset.name === pathName) {
        return preset.legs;
      };
    };
    return PRESETS[defaultPresetName];
  };
  return PRESETS[defaultPresetName];
};

const usePathBasedLegs = (defaultPresetName) => {
  const location = useLocation();
  const pathName = getPathName(location);

  const [legs, setLegs] = useState(() => {
    return getLegs(defaultPresetName);
  });

  useEffect(() => {
    if (pathName && pathName !== legs.name) {
      setLegs(getLegs(defaultPresetName, pathName));
    };
  }, [pathName]);

  return [legs, setLegs];
};

export default usePathBasedLegs;