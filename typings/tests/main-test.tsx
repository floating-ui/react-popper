import * as React from 'react';
import { Manager, Target, Popper, Arrow } from '../..';

const Test = () => (
  <Manager>
    <Target>
      {({ getTargetRef }) => <button ref={getTargetRef}>Target</button>}
    </Target>
    <Popper>
      {({ getPopperRef, style, placement }) => (
        <div ref={getPopperRef} style={style} data-placement={placement}>
          Popper
          <Arrow>
            {({ getArrowRef, style }) => <div ref={getArrowRef} style={style} />}
          </Arrow>
        </div>
      )}
    </Popper>
  </Manager>
)