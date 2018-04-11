import * as React from 'react';
import { Manager, Reference, Popper } from '../..';

const Test = () => (
  <Manager>
    <Reference>{({ ref }) => <div ref={ref} />}</Reference>
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
