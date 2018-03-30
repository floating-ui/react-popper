import React from 'react';
import { Portal } from 'react-portal';
import { Manager, Target, Popper, Arrow, placements } from '../src/index';

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
        <Manager>
          <Target>
            {({ getTargetRef }) => (
              <div
                ref={getTargetRef}
                style={{ width: 120, height: 120, background: 'red' }}
              >
                Box
              </div>
            )}
          </Target>
          <Popper placement={this.state.placement}>
            {({ getPopperRef, style, placement }) => (
              <div
                data-placement={placement}
                ref={getPopperRef}
                className="popper"
                style={style}
              >
                Popper
                <Arrow>
                  {({ getArrowRef, style }) => (
                    <div
                      ref={getArrowRef}
                      className="popper__arrow"
                      style={style}
                    />
                  )}
                </Arrow>
              </div>
            )}
          </Popper>
        </Manager>
      </div>
    );
  }
}

export default MultipleExample;
