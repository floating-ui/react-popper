import React, { Component, Children, createElement } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import glamorous, { Div } from 'glamorous'
import { VelocityTransitionGroup } from 'velocity-react'
import Transition from 'react-motion-ui-pack'
import { Manager, Target, Popper, Arrow } from '../src/react-popper'
import { placements } from 'popper.js'
import Portal from 'react-travel'

import './main.scss'

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

class MultipleExample extends Component {
  state = {
    placement: 'bottom',
  }

  render() {
    const { placement } = this.state
    return (
      <div>
        <select
          value={placement}
          onChange={e => this.setState({ placement: e.target.value })}
        >
          {placements.map(placement => (
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

const StyledTarget = glamorous(Target)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 200,
  height: 200,
  fontSize: 56,
  lineHeight: '70px',
  backgroundColor: 'rebeccapurple',
  color: 'rgba(255, 255, 255, 0.5)',
  userSelect: 'none',
})

const StyledPopper = glamorous(Popper)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 200,
  height: 100,
  fontSize: 16,
  backgroundColor: '#ff9121',
  color: 'rgba(255, 255, 255, 0.8)',
})

class AnimatedExample extends Component {
  state = {
    isOpen: false,
  }
  render() {
    return (
      <Manager>
        <StyledTarget
          onClick={() => this.setState(state => ({ isOpen: !state.isOpen }))}
        >
          Click to {this.state.isOpen ? 'hide' : 'show'} popper
        </StyledTarget>
        <Transition
          component={false}
          enter={{ opacity: 1, scale: 1 }}
          leave={{ opacity: 0, scale: 0.9 }}
        >
          {this.state.isOpen &&
            <StyledPopper key="popper">
              {({ popperProps, restProps }) => (
                <div {...popperProps}>
                  <div {...restProps}>
                    Animated Popper 🎉
                  </div>
                </div>
              )}
            </StyledPopper>}
        </Transition>
      </Manager>
    )
  }
}
const App = () => (
  <Div
    css={{
      padding: 200,
    }}
  >
    <Div css={{ marginBottom: 200 }}>
      <MultipleExample />
    </Div>
    <Div css={{ marginBottom: 200 }}>
      <AnimatedExample />
    </Div>
  </Div>
)
ReactDOM.render(<App />, document.getElementById('app'))
