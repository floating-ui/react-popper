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

  React.useEffect(
    () => () => {
      setReferenceNode(null);
    },
    [setReferenceNode]
  );

  return (
    <ManagerReferenceNodeContext.Provider value={referenceNode}>
      <ManagerReferenceNodeSetterContext.Provider value={setReferenceNode}>
        {children}
      </ManagerReferenceNodeSetterContext.Provider>
    </ManagerReferenceNodeContext.Provider>
  );
}
