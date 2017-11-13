import React, { Component, createElement } from 'react'
import PropTypes from 'prop-types'

const Arrow = (props, context) => {
  const { component = 'span', innerRef, children, ...restProps } = props
  const { popper } = context
  const arrowRef = node => {
    popper.setArrowNode(node)
    if (typeof innerRef === 'function') {
      innerRef(node)
    }
  }
  const arrowStyle = popper.getArrowStyle()
  const popperPlacement = popper.getPlacement()

  if (typeof children === 'function') {
    const arrowProps = {
      ref: arrowRef,
      style: arrowStyle,
      ['data-placement']: popperPlacement,
    }
    return children({ arrowProps, restProps })
  }

  const componentProps = {
    ['data-placement']: popperPlacement,
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

Arrow.contextTypes = {
  popper: PropTypes.object.isRequired,
}

Arrow.propTypes = {
  component: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  innerRef: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
}

export default Arrow
