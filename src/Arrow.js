// @flow
import React, { type Node } from 'react';
import { ArrowNodeContext } from './Popper';

type ArrowProps = {
  children: ({
    getArrowRef: (?HTMLElement) => void,
    style: { [string]: string | number },
  }) => Node,
};

export default ({ children }: ArrowProps) => (
  <ArrowNodeContext.Consumer>
    {({ setArrowNode, arrowStyle }) =>
      children({ getArrowRef: setArrowNode, style: arrowStyle })
    }
  </ArrowNodeContext.Consumer>
);
