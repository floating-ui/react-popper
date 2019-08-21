// Please remember to update also the Flow test files that can
// be found under `/src/__typings__` please. Thanks! 🤗

import * as React from 'react';
import { Manager, Reference, Popper } from '../..';

export const Test = () => (
  <Manager>
    <svg>
      <Reference>{({ ref }) => <g ref={ref} />}</Reference>
    </svg>
    <Popper
      eventsEnabled
      positionFixed
      modifiers={{ flip: { enabled: false } }}
    >
      {({
        ref,
        style,
        placement,
        outOfBoundaries,
        scheduleUpdate,
        arrowProps,
      }) => (
        <div
          ref={ref}
          style={{ ...style, opacity: outOfBoundaries ? 0 : 1 }}
          data-placement={placement}
          onClick={() => scheduleUpdate()}
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
