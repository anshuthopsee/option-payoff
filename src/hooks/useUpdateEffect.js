import { useEffect, useRef } from "react";

const useUpdateEffect = (effect, deps) => {
  const isFirstMount = useRef(true);
  const cleanupRef = useRef();

  useEffect(() => {
    if (!isFirstMount.current) {
      return cleanupRef.current = effect();
    } else isFirstMount.current = false;

    return () => {
      if (cleanupRef.current) cleanupRef.current();
    };
  }, deps);
};

export default useUpdateEffect;  