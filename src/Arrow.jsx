import React, { Component, createElement } from 'react'
import PropTypes from 'prop-types'

class Arrow extends Component {
  // State is updated by the containing Popper component when popper.js updates
  state = { arrowStyle: {} }

  // Subscribe on mount
  componentDidMount() {
    const { props, context } = this
    const { popper: { subscribe } } = context
    subscribe(this._update)
  }

  // Unsubscribe on unmount
  componentWillUnmount() {
    const { props, context } = this
    const { popper: { unsubscribe } } = context
    unsubscribe(this._update)
  }

  _update = data => {
    const { top, left } = data.offsets.arrow
    this.setState({ arrowStyle: { top, left } })
  }

  render() {
    const { props, context, state } = this
    const { component = 'span', innerRef, children, ...restProps } = props
    const { popper } = context
    const { arrowStyle } = state

    const arrowRef = node => {
      popper.setArrowNode(node)
      if (typeof innerRef === 'function') {
        innerRef(node)
      }
    }

    if (typeof children === 'function') {
      const arrowProps = {
        ref: arrowRef,
        style: arrowStyle,
      }
      return children({ arrowProps, restProps })
    }

    const componentProps = {
      ...restProps,
      style: {
        ...arrowStyle,
        ...restProps.style,
      },
    }

    if (typeof component === 'string') {
      componentProps.ref = arrowRef
    } else {
      componentProps.innerRef = arrowRef
    }

    return createElement(component, componentProps, children)
  }
}

Arrow.contextTypes = {
  popper: PropTypes.object.isRequired,
}

Arrow.propTypes = {
  component: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  innerRef: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
}

export default Arrow
