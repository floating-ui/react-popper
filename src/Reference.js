// @flow
import React, { type Node } from 'react';
import { ManagerContext } from './Manager';
import { unwrapArray } from './utils';

type ReferenceProps = {
  children: ({ ref: (?HTMLElement) => void }) => Node,
};
export default ({ children }: ReferenceProps) => (
  <ManagerContext.Consumer>
    {({ getReferenceRef }) => unwrapArray(children)({ ref: getReferenceRef })}
  </ManagerContext.Consumer>
);
