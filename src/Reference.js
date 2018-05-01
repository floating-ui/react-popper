// @flow
import * as React from 'react';
import warning from 'warning';
import { ManagerContext } from './Manager';
import { unwrapArray } from './utils';

export type ReferenceChildrenProps = { ref: (?HTMLElement) => void };
export type ReferenceProps = {
  children: ReferenceChildrenProps => React.Node,
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
