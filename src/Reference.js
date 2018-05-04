// @flow
import * as React from 'react';
import warning from 'warning';
import { ManagerContext } from './Manager';
import { safeInvoke, unwrapArray } from './utils';

export type ReferenceChildrenProps = { ref: (?HTMLElement) => void };
export type ReferenceProps = {
  children: ReferenceChildrenProps => React.Node,
  innerRef?: (?HTMLElement) => void,
};

type InnerReferenceProps = {
  getReferenceRef?: (?HTMLElement) => void,
}

class InnerReference extends React.Component<ReferenceProps & InnerReferenceProps> {
  refHandler = (node: ?HTMLElement) => {
    safeInvoke(this.props.innerRef, node);
    safeInvoke(this.props.getReferenceRef, node);
  }

  render() {
    warning(
      this.props.getReferenceRef,
      '`Reference` should not be used outside of a `Manager` component.'
    );
    return unwrapArray(this.props.children)({ ref: this.refHandler });
  }
}

export default function Reference(props: ReferenceProps) {
  return (
    <ManagerContext.Consumer>
      {({ getReferenceRef }) => <InnerReference getReferenceRef={getReferenceRef} {...props} />}
    </ManagerContext.Consumer>
  );
}
