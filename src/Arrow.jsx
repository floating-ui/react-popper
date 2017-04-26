import React, { Component, createElement } from 'react'
import PropTypes from 'prop-types'

const Arrow = (props, context) => {
  const { tag = 'span', innerRef, children, ...restProps } = props
  const { popper } = context
  const arrowRef = node => popper.setArrowNode(node)
  const arrowStyle = popper.getArrowStyle()

  if (typeof children === 'function') {
    const arrowProps = {
      ref: arrowRef,
      style: arrowStyle,
    }
    return children({ arrowProps, restProps })
  }

  return createElement(
    tag,
    {
      ...restProps,
      ref: node => {
        arrowRef(node)
        if (typeof innerRef === 'function') {
          innerRef(node)
        }
      },
      style: {
        ...arrowStyle,
        ...restProps.style,
      },
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
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
}

export default Arrow
