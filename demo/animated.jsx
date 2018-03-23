import React, { PureComponent } from 'react'
import { findDOMNode } from 'react-dom'
import Transition from 'react-transition-group/Transition'
import PropTypes from 'prop-types'
import outy from 'outy'
import { Manager, Target, Popper } from '../src/index'

const duration = 300

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0,
}

const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1 },
}

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

CustomTarget.propTypes = {
  innerRef: PropTypes.func,
}

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

CustomPopper.propTypes = {
  innerRef: PropTypes.func,
  style: PropTypes.object,
}

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
      this._handleOutsideTap,
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
          <Transition in={this.state.isOpen} timeout={duration}>
            {state => (
              <Popper
                key="popper"
                component={CustomPopper}
                innerRef={c => {
                  this.popper = findDOMNode(c)
                }}
                placement="bottom"
                style={{
                  ...defaultStyle,
                  ...transitionStyles[state],
                }}
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
