import React from 'react'
import PopperJS from 'popper.js'
import { Portal } from 'react-portal'
import { Manager, Target, Popper, Arrow } from '../src/index'

const modifiers = {
  customStyle: {
    enabled: true,
    fn: data => {
      data.styles = {
        ...data.styles,
        background: 'red',
      }
      return data
    },
  },
}

class MultipleExample extends React.Component {
  state = {
    placement: 'bottom',
  }

  render() {
    const { placement } = this.state
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
          {PopperJS.placements.map(placement => (
            <option key={placement} value={placement}>
              {placement}
            </option>
          ))}
        </select>
        <Manager>
          <Target style={{ width: 120, height: 120, background: 'red' }}>
            Box
          </Target>
          <Popper placement="left">
            {({ popperProps }) => (
              <div {...popperProps} className="popper">
                Content Left
                <Arrow>
                  {({ arrowProps }) => (
                    <span {...arrowProps} className="popper__arrow" />
                  )}
                </Arrow>
              </div>
            )}
          </Popper>
          <Popper className="popper" placement="right">
            Content Right
            <Arrow className="popper__arrow" />
          </Popper>
          <Portal>
            <Popper
              className="popper"
              placement={placement}
              modifiers={modifiers}
            >
              Dynamic Content in a Portal!
              <Arrow className="popper__arrow" />
            </Popper>
          </Portal>
        </Manager>
      </div>
    )
  }
}

export default MultipleExample
