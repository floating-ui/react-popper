// @flow

// Please remember to update also the TypeScript test files that can
// be found under `/typings/tests` please. Thanks! 🤗

import React from 'react';
import { Manager, Reference, Popper } from '..';

export const Test = () => (
  <Manager>
    {/* $FlowExpectError: empty children */}
    <Reference />
    <Reference>{({ ref }) => <div ref={ref} />}</Reference>
    <Popper
      // $FlowExpectError: should be one of allowed placements
      placement="custom"
      placement="top"
      // $FlowExpectError: should be absolute or fixed
      strategy="custom"
      strategy="fixed"
      // $FlowExpectError: enabled should be boolean, order number
      modifiers={[{ name: 'flip', enabled: 'bar', order: 'foo' }]}
      modifiers={[{ name: 'flip', enabled: false }]}
    >
      {({
        ref,
        style,
        placement,
        isReferenceHidden,
        hasPopperEscaped,
        update,
        arrowProps,
      }) => (
        <div
          ref={ref}
          style={{ ...style, opacity: (isReferenceHidden || hasPopperEscaped) ? 0 : 1 }}
          data-placement={placement}
          onClick={() => update()}
        >
          Popper
          <div ref={arrowProps.ref} style={arrowProps.style} />
        </div>
      )}
    </Popper>
    <Popper>
      {({ ref, style, placement }) => (
        <div ref={ref} style={style} data-placement={placement}>
          Popper
        </div>
      )}
    </Popper>
  </Manager>
);
