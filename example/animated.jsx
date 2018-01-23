import React, { PureComponent } from 'react'
import ReactDOM, { findDOMNode } from 'react-dom'
import Transition from 'react-motion-ui-pack'
import { Manager, Target, Popper, Arrow } from '../src/react-popper'
import outy from 'outy'

const CustomTarget = ({ innerRef, ...props }) => (
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
)

const CustomPopper = ({ innerRef, style, ...props }) => (
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
)

class AnimatedExample extends PureComponent {
  state = {
    isOpen: false,
  }

  componentDidMount() {
    this._setOutsideTap()
  }

  componentDidUpdate(lastProps, lastState) {
    if (lastState.isOpen !== this.state.isOpen) {
      setTimeout(() => this._setOutsideTap())
    }
  }

  componentWillUnmount() {
    this.outsideTap.remove()
  }

  _setOutsideTap = () => {
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
        <div>
            <h2>Animated Example</h2>
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
                {this.state.isOpen && (
                  <Popper
                    key="popper"
                    component={CustomPopper}
                    innerRef={c => {
                      this.popper = findDOMNode(c)
                    }}
                    placement="bottom"
                  >
                    <div>Animated Popper 🎉</div>
                  </Popper>
                )}
              </Transition>
            </Manager>
        </div>
    )
  }
}

export default AnimatedExample
