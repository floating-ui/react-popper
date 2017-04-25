import React, { Component, createElement } from 'react'
import PropTypes from 'prop-types'

const Target = (props, context) => {
  const { tag = 'div', innerRef, children, ...restProps } = props
  const { popperManager } = context
  const targetRef = node => popperManager.setTargetNode(node)

  if (typeof children === 'function') {
    return children({ targetRef })
  }

  return createElement(
    tag,
    {
      ref: node => {
        targetRef(node)
        if (typeof innerRef === 'function') {
          innerRef(node)
        }
      },
      ...restProps,
    },
    children
  )
}

Target.contextTypes = {
  popperManager: PropTypes.object.isRequired,
}

Target.propTypes = {
  tag: PropTypes.string,
  innerRef: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
}

export default Target
