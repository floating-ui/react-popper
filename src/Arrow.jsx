import React, { Component, createElement } from 'react'
import PropTypes from 'prop-types'

const Arrow = (props, context) => {
  const { tag = 'span', innerRef, style, children, ...restProps } = props
  const { popper } = context
  const arrowRef = node => popper.setArrowNode(node)
  const arrowStyle = {
    ...popper.getArrowStyle(),
    ...style,
  }

  if (typeof children === 'function') {
    return children({ arrowRef, arrowStyle })
  }

  return createElement(
    tag,
    {
      ref: node => {
        arrowRef(node)
        if (typeof innerRef === 'function') {
          innerRef(node)
        }
      },
      style: arrowStyle,
      ...restProps,
    },
    children
  )
}

Arrow.contextTypes = {
  popper: PropTypes.object.isRequired,
}

Arrow.propTypes = {
  tag: PropTypes.string,
  innerRef: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
}

export default Arrow
