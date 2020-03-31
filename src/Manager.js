// @flow
import * as React from 'react';

export const ManagerReferenceNodeContext = React.createContext<?HTMLElement>();
export const ManagerReferenceNodeSetterContext = React.createContext<
  void | ((?HTMLElement) => void)
>();

export type ManagerProps = {
  children: React.Node,
};

export default class Manager extends React.Component<ManagerProps> {
  referenceNode: ?HTMLElement;

  setReferenceNode = (newReferenceNode: ?HTMLElement) => {
    if (newReferenceNode && this.referenceNode !== newReferenceNode) {
      this.referenceNode = newReferenceNode;
      this.forceUpdate();
    }
  };

  componentWillUnmount() {
    this.referenceNode = null;
  }

  render() {
    return (
      <ManagerReferenceNodeContext.Provider value={this.referenceNode}>
        <ManagerReferenceNodeSetterContext.Provider
          value={this.setReferenceNode}
        >
          {this.props.children}
        </ManagerReferenceNodeSetterContext.Provider>
      </ManagerReferenceNodeContext.Provider>
    );
  }
}
