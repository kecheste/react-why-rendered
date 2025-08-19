import * as React from "react";
import { useWhyRendered } from "./useWhyRendered";

/**
 * Higher-order component (HOC) wrapper to log why a component re-rendered.
 * 
 * @param Component - The component to wrap
 * @param componentName - Optional custom name for logs
 * 
 * Usage:
 * const EnhancedComponent = withWhyRendered(MyComponent);
 */
export function withWhyRendered<P extends Record<string, any>>(
  Component: React.ComponentType<P>,
  componentName?: string
): React.FC<P> {
  const name = componentName || Component.displayName || Component.name || "Component";

  return function Wrapper(props: P) {
    // Hook monitors prop changes internally
    useWhyRendered(name, props);

    return React.createElement(Component, props);
  };
}
