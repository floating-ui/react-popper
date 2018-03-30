import React, { PureComponent } from 'react'
import { Popper, Arrow } from '../src/react-popper'

class StandaloneObjectExample extends PureComponent {
  state = {
    isOpen: false,
  }

  handleClick = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen,
    }))
  }

  render() {
    const reference = {
      getBoundingClientRect: () => ({
        top: 10,
        left: 100,
        right: 150,
        bottom: 90,
        width: 50,
        height: 80,
      }),
      clientWidth: 50,
      clientHeight: 80,
    }
    return (
      <div>
        <h2>Standalone referenceObject Popper Example</h2>
        <div
          style={{ width: 120, height: 120, background: '#b4da55' }}
          onClick={this.handleClick}
        >
          Click {this.state.isOpen ? 'to hide' : 'to show'} popper
        </div>
        {this.state.isOpen && (
          <Popper className="popper" target={reference}>
            Popper Content for Standalone example
            <Arrow className="popper__arrow" />
          </Popper>
        )}
      </div>
    )
  }
}

export default StandaloneObjectExample
