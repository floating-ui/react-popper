import React, { Component, createElement } from 'react'
import PropTypes from 'prop-types'

const Arrow = (props, context) => {
  const { tag = 'span', innerRef, children, ...restProps } = props
  const { popper } = context
  const arrowRef = node => {
    popper.setArrowNode(node)
    if (typeof innerRef === 'function') {
      innerRef(node)
    }
  }
  const arrowStyle = popper.getArrowStyle()
  const popperPlacement = popper.getPopperPlacement()

  if (typeof children === 'function') {
    const arrowProps = {
      ref: arrowRef,
      style: arrowStyle,
      ['data-popper-placement']: popperPlacement,
    }
    return children({ arrowProps, restProps })
  }

  return createElement(
    tag,
    {
      ...restProps,
      ref: arrowRef,
      style: {
        ...arrowStyle,
        ...restProps.style,
      },
      ['data-popper-placement']: popperPlacement,
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
