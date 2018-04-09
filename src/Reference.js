// @flow
import React, { type Node } from 'react';
import warning from 'warning';
import { ManagerContext } from './Manager';
import { unwrapArray } from './utils';

type ReferenceProps = {
  children: ({ ref: (?HTMLElement) => void }) => Node,
};

export default function Reference({ children }: ReferenceProps) {
  return (
    <ManagerContext.Consumer>
      {({ getReferenceRef }) => {
        warning(
          getReferenceRef,
          '`Reference` should not be used outside of a `Manager` component.'
        );
        return unwrapArray(children)({ ref: getReferenceRef });
      }}
    </ManagerContext.Consumer>
  );
}
