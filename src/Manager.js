// @flow
import * as React from 'react';

export const ManagerReferenceNodeContext = React.createContext<?Element>();
export const ManagerReferenceNodeSetterContext = React.createContext<
  void | ((?Element) => void)
>();

export type ManagerProps = {
  children: React.Node,
};

export function Manager({ children }: ManagerProps) {
  const [referenceNode, setReferenceNode] = React.useState<?Element>(null);

  const hasUnmounted = React.useRef(false);
  React.useEffect(() => {
    return () => {
      hasUnmounted.current = true;
    };
  }, []);

  const handleSetReferenceNode = React.useCallback((node) => {
    if (!hasUnmounted.current) {
      setReferenceNode(node);
    }
  }, []);

  return (
    <ManagerReferenceNodeContext.Provider value={referenceNode}>
      <ManagerReferenceNodeSetterContext.Provider
        value={handleSetReferenceNode}
      >
        {children}
      </ManagerReferenceNodeSetterContext.Provider>
    </ManagerReferenceNodeContext.Provider>
  );
}
