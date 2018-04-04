// @flow
import React, { Component, type Node } from 'react';
import createContext, { type Context } from 'create-react-context';

export const ManagerContext: Context<{
  getReferenceRef?: (?HTMLElement) => void,
  referenceNode?: ?HTMLElement,
}> = createContext({});

type ManagerProps = {
  children: Node,
};
type ManagerState = {
  referenceNode?: ?HTMLElement,
};

export default class Manager extends Component<ManagerProps, ManagerState> {
  state = {};

  getReferenceRef = (referenceNode: ?HTMLElement) =>
    this.setState({ referenceNode });

  render() {
    return (
      <ManagerContext.Provider
        value={{
          referenceNode: this.state.referenceNode,
          getReferenceRef: this.getReferenceRef,
        }}
      >
        {this.props.children}
      </ManagerContext.Provider>
    );
  }
}
