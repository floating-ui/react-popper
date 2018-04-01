import * as React from 'react';
import Popper from '../..';

const Test = () => (
  <Popper placement="right">
    {({ referenceProps, popperProps, arrowProps }) => (
      <React.Fragment>
        <div ref={referenceProps.getRef}>
          Reference
        </div>
        <div
          data-placement={popperProps.placement}
          ref={popperProps.getRef}
          style={popperProps.style}
        >
          Popper
          <div
            ref={arrowProps.getRef}
            style={arrowProps.style}
          />
        </div>
      </React.Fragment>
    )}
  </Popper>
)
