import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(function () {
      setDebouncedValue(value);
    }, delay);

    return function () {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
