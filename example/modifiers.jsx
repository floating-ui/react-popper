import React from 'react'
import { Manager, Target, Popper, Arrow } from '../src/react-popper'
import PopperJS from 'popper.js'
import Portal from 'react-travel'
import {modifiers} from './common'

class MultipleExample extends React.Component {
  state = {
    placement: 'bottom',
  }

  render() {
    const { placement } = this.state
    return (
        <div>
            <h2>Modifier Example</h2>
            <div style={{
              height: 150,
              border: '1px solid gray',
              overflow: 'auto'
            }}>
            <Manager>
              <Target style={{ width: 120, height: 50, marginTop: 180, marginBottom: 200, background: 'gold' }}>
                Box
              </Target>
              <Portal>
                  <Popper
                    className="popper"
                    placement={placement}
                    modifiers={modifiers}
                  >
                    Popper Content
                    <Arrow className="popper__arrow" />
                  </Popper>
              </Portal>
            </Manager>
          </div>
      </div>
    )
  }
}

export default MultipleExample
