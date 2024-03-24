import { type RefObject, useCallback, useEffect } from "react";

const useOnClickOutside = (ref: RefObject<HTMLElement> | null, handler: (event: MouseEvent) => void) => {
  const listener = useCallback((event: MouseEvent) => {
    if (ref?.current === null) handler(event);
    else if (ref?.current && !event.composedPath().includes(ref.current)) handler(event);
  }, [ref, handler])

  useEffect(() => {
    document.addEventListener("click", listener, { capture: true });
    return () => {
      document.removeEventListener("click", listener, { capture: true });
    };
  }, [listener]);
}

export default useOnClickOutside;