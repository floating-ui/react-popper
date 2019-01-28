// @flow
import * as React from 'react';
import createContext, { type Context } from 'create-react-context';

export const ManagerContext: Context<{
  setReferenceNode?: (?HTMLElement) => void,
  referenceNode?: ?HTMLElement,
}> = createContext({ setReferenceNode: undefined, referenceNode: undefined });

export type ManagerProps = {
  children: React.Node,
};
type ManagerState = {
  context: {
    setReferenceNode?: (?HTMLElement) => void,
    referenceNode?: ?HTMLElement,
  },
};

export default class Manager extends React.Component<
  ManagerProps,
  ManagerState
> {
  constructor() {
    super();
    this.state = {
      context: {
        setReferenceNode: this.setReferenceNode,
        referenceNode: undefined,
      },
    };
  }

  setReferenceNode = (referenceNode: ?HTMLElement) => {
    if (!referenceNode || this.state.context.referenceNode === referenceNode) {
      return;
    }

    this.setState(({ context }) => ({
      context: { ...context, referenceNode },
    }));
  };

  render() {
    return (
      <ManagerContext.Provider value={this.state.context}>
        {this.props.children}
      </ManagerContext.Provider>
    );
  }
}
