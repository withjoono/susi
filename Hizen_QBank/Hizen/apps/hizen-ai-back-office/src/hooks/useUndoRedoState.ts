import { useState, useCallback } from 'react';

interface History<T> {
  past: T[];
  present: T;
  future: T[];
}

type SetStateAction<T> = T | ((prevState: T) => T);

export function useUndoRedoState<T>(
  initialState: T,
): [
  T,
  (newState: SetStateAction<T>) => void,
  () => void,
  () => void,
  boolean,
  boolean,
] {
  const [state, setState] = useState<History<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const set = useCallback((newStateAction: SetStateAction<T>) => {
    setState((currentState) => {
      const newState =
        typeof newStateAction === 'function'
          ? (newStateAction as (prevState: T) => T)(currentState.present)
          : newStateAction;

      if (Object.is(currentState.present, newState)) {
        return currentState; // No change
      }

      return {
        past: [...currentState.past, currentState.present],
        present: newState,
        future: [], // Clear future when new state is set
      };
    });
  }, []);

  const undo = useCallback(() => {
    setState((currentState) => {
      if (currentState.past.length === 0) return currentState;

      const previous = currentState.past[currentState.past.length - 1];
      const newPast = currentState.past.slice(0, currentState.past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [currentState.present, ...currentState.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState((currentState) => {
      if (currentState.future.length === 0) return currentState;

      const next = currentState.future[0];
      const newFuture = currentState.future.slice(1);

      return {
        past: [...currentState.past, currentState.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  // Reset state when initial state changes (e.g., opening dialog with different data)
  // This simple reset might need refinement depending on how initial state changes are handled.
  // A useEffect inside the hook could compare initialState changes. For now, we assume
  // the component using the hook handles re-initialization if needed.

  return [state.present, set, undo, redo, canUndo, canRedo];
}
