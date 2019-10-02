// @flow
import * as React from 'react';
import createContext, { type Context } from 'create-react-context';

type ContextData = {
  setReferenceNode?: (?HTMLElement) => void,
  referenceNode?: ?HTMLElement,
};

export const ManagerContext: Context<ContextData> = createContext({ setReferenceNode: undefined, referenceNode: undefined });

export type ManagerProps = {
  children: React.Node,
};

export default class Manager extends React.Component<
  ManagerProps
> {
  contextObj: ContextData;

  constructor() {
    super();
    this.contextObj = {
        setReferenceNode: this.setReferenceNode,
        referenceNode: undefined,
    };
  }

  setReferenceNode = (referenceNode: ?HTMLElement) => {
    if (!referenceNode || this.contextObj.referenceNode === referenceNode) {
      return;
    }

    this.contextObj = {
      ...this.contextObj,
      referenceNode
    };

    this.forceUpdate();
  };

  componentWillUnmount() {
    this.contextObj.referenceNode = null;
  }

  render() {
    return (
      <ManagerContext.Provider value={this.contextObj}>
        {this.props.children}
      </ManagerContext.Provider>
    );
  }
}
