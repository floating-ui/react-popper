// @flow
import React, { Component, type Node } from 'react';
import createReactContext, { type Context } from 'create-react-context';

const noop = () => {};

export const TargetNodeContext: Context<{
  targetNode: ?HTMLElement,
  setTargetNode: (?HTMLElement) => void,
}> = createReactContext({ targetNode: undefined, setTargetNode: noop });

type ManagerProps = {
  children: Node,
};

type ManagerState = {
  targetNode: ?HTMLElement,
};

export default class Manager extends Component<ManagerProps, ManagerState> {
  state = {
    targetNode: undefined,
  };

  setTargetNode = (targetNode: ?HTMLElement) => this.setState({ targetNode });

  render() {
    return (
      <TargetNodeContext.Provider
        value={{
          targetNode: this.state.targetNode,
          setTargetNode: this.setTargetNode,
        }}
      >
        {this.props.children}
      </TargetNodeContext.Provider>
    );
  }
}
