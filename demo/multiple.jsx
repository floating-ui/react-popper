import React, { Fragment } from 'react';
import { Portal } from 'react-portal';
import Popper, { placements } from '../src/index';

const modifiers = {
  customStyle: {
    enabled: true,
    fn: data => {
      data.styles = {
        ...data.styles,
        background: 'red',
      };
      return data;
    },
  },
};

class MultipleExample extends React.Component {
  state = {
    placement: 'bottom',
  };

  render() {
    const { placement } = this.state;
    return (
      <div>
        <h2>Multiple Popper Example</h2>
        <select
          value={placement}
          onChange={e =>
            this.setState({
              placement: e.target.value,
            })
          }
        >
          {placements.map(placement => (
            <option key={placement} value={placement}>
              {placement}
            </option>
          ))}
        </select>
        <Popper placement={this.state.placement}>
          {({ referenceProps, popperProps, arrowProps }) => (
            <Fragment>
              <div
                ref={referenceProps.getRef}
                style={{ width: 120, height: 120, background: 'red' }}
              >
                Reference
              </div>
              <div
                data-placement={popperProps.placement}
                ref={popperProps.getRef}
                className="popper"
                style={popperProps.style}
              >
                Popper
                <div
                  ref={arrowProps.getRef}
                  className="popper__arrow"
                  style={arrowProps.style}
                />
              </div>
            </Fragment>
          )}
        </Popper>
      </div>
    );
  }
}

export default MultipleExample;
