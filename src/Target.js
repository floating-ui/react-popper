// @flow
import React, { type Node } from 'react';
import { TargetNodeContext } from './Manager';

type TargetProps = {
  children: ({ getTargetRef: (?HTMLElement) => void }) => Node,
};

export default ({ children }: TargetProps) => (
  <TargetNodeContext.Consumer>
    {({ setTargetNode }) => children({ getTargetRef: setTargetNode })}
  </TargetNodeContext.Consumer>
);
