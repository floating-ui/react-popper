import React from 'react';
import { Popper, Manager, Reference, placements } from '../src/index';

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
        <Manager>
          <Reference>
            {referenceProps => (
              <div {...referenceProps} className="reference" />
            )}
          </Reference>
          <Popper placement={this.state.placement}>
            {({ ref, style, placement, arrowProps }) => (
              <div
                ref={ref}
                style={style}
                data-placement={placement}
                className="popper"
              >
                Popper
                <div {...arrowProps} className="popper__arrow" />
              </div>
            )}
          </Popper>
        </Manager>
      </div>
    );
  }
}

export default MultipleExample;
