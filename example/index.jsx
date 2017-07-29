import React, { Component, PureComponent, Children, createElement } from 'react'
import ReactDOM, { findDOMNode } from 'react-dom'
import PropTypes from 'prop-types'
import { VelocityTransitionGroup } from 'velocity-react'
import Transition from 'react-motion-ui-pack'
import { Manager, Target, Popper, Arrow } from '../src/react-popper'
import { placements } from 'popper.js'
import Portal from 'react-travel'
import outy from 'outy'

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

const CustomTarget = ({ innerRef, ...props }) =>
  <button
    ref={innerRef}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 200,
      height: 200,
      padding: 24,
      fontSize: 32,
      lineHeight: '1',
      backgroundColor: 'rebeccapurple',
      color: 'rgba(255, 255, 255, 0.5)',
      userSelect: 'none',
    }}
    {...props}
  />

const CustomPopper = ({ innerRef, style, ...props }) =>
  <div
    ref={innerRef}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 200,
      height: 100,
      fontSize: 16,
      backgroundColor: '#ff9121',
      color: 'rgba(255, 255, 255, 0.8)',
      ...style,
    }}
    {...props}
  />

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
          {placements.map(placement =>
            <option key={placement} value={placement}>
              {placement}
            </option>
          )}
        </select>
        <Manager>
          <Target style={{ width: 120, height: 120, background: 'red' }}>
            Box
          </Target>
          <Popper placement="left">
            {({ popperProps }) =>
              <div {...popperProps} className="popper">
                Content Left
                <Arrow>
                  {({ arrowProps }) =>
                    <span {...arrowProps} className="popper__arrow" />}
                </Arrow>
              </div>}
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

class AnimatedExample extends PureComponent {
  state = {
    isOpen: false,
  }

  componentDidMount() {
    this._setOusideTap()
  }

  componentDidUpdate(lastProps, lastState) {
    if (lastState.isOpen !== this.state.isOpen) {
      setTimeout(() => this._setOusideTap())
    }
  }

  componentWillUnmount() {
    this.outsideTap.remove()
  }

  _setOusideTap = () => {
    const elements = [this.target]

    if (this.popper) {
      elements.push(this.popper)
    }

    if (this.outsideTap) {
      this.outsideTap.remove()
    }

    this.outsideTap = outy(
      elements,
      ['click', 'touchstart'],
      this._handleOutsideTap
    )
  }

  _handleOutsideTap = () => {
    this.setState({ isOpen: false })
  }

  _handleTargetClick = () => {
    this.setState({ isOpen: true })
  }

  render() {
    return (
      <Manager>
        <Target
          innerRef={c => (this.target = findDOMNode(c))}
          component={CustomTarget}
          onClick={this._handleTargetClick}
        >
          Click {this.state.isOpen ? 'outside to hide' : 'to show'} popper
        </Target>
        <Transition
          component={false}
          enter={{ opacity: 1, scale: 1 }}
          leave={{ opacity: 0, scale: 0.9 }}
        >
          {this.state.isOpen &&
            <Popper
              key="popper"
              component={CustomPopper}
              innerRef={c => {
                this.popper = findDOMNode(c)
              }}
              placement="bottom"
            >
              <div>
                Animated Popper 🎉
              </div>
            </Popper>}
        </Transition>
      </Manager>
    )
  }
}
const App = () =>
  <div
    style={{
      padding: 200,
    }}
  >
    <div style={{ marginBottom: 200 }}>
      <MultipleExample />
    </div>
    <div style={{ marginBottom: 200 }}>
      <AnimatedExample />
    </div>
  </div>
ReactDOM.render(<App />, document.getElementById('app'))
