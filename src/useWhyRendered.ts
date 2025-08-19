import { useRef } from "react";

/**
 * Type for shallow comparison results
 */
interface ChangeRecord {
  [key: string]: { before: any; after: any };
}

/**
 * Perform a shallow comparison of two objects and return the changed keys
 * @param prev - previous props or state
 * @param next - current props or state
 */
function shallowDiff(prev: Record<string, any>, next: Record<string, any>): ChangeRecord {
  const changes: ChangeRecord = {};

  const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);
  keys.forEach((key) => {
    // Use strict equality to detect changes; could extend to deep equality if needed
    if (prev[key] !== next[key]) {
      changes[key] = { before: prev[key], after: next[key] };
    }
  });

  return changes;
}

/**
 * Custom React hook to log why a component re-rendered.
 * 
 * @param componentName - Optional name for the component (helps in console logs)
 * @param props - The props of the component to monitor
 * @param state - Optional state object to monitor alongside props
 * 
 * Usage:
 * useWhyRendered("MyComponent", props, { count });
 */
export function useWhyRendered<T extends Record<string, any>>(
  componentName: string,
  props: T,
  state?: T
) {
  const prevProps = useRef<T>();
  const prevState = useRef<T>();

  // Calculate changes for props and state
  const propsChanges = prevProps.current ? shallowDiff(prevProps.current, props) : {};
  const stateChanges = state && prevState.current ? shallowDiff(prevState.current, state) : {};

  // Only log if there are actual changes
  const hasChanges = Object.keys(propsChanges).length || Object.keys(stateChanges).length;

  if (hasChanges) {
    // Group logs for readability
    console.group(`[react-why-rendered] ${componentName} re-rendered`);

    if (Object.keys(propsChanges).length) {
      console.table(
        Object.entries(propsChanges).map(([key, value]) => ({
          type: "prop",
          name: key,
          before: value.before,
          after: value.after
        }))
      );
    }

    if (Object.keys(stateChanges).length) {
      console.table(
        Object.entries(stateChanges).map(([key, value]) => ({
          type: "state",
          name: key,
          before: value.before,
          after: value.after
        }))
      );
    }

    console.groupEnd();
  }

  // Save current values for next render
  prevProps.current = props;
  if (state) prevState.current = state;
}
