import { createElement } from 'react'
import PropTypes from 'prop-types'

const Target = (props, context) => {
  const { component = 'div', innerRef, children, ...restProps } = props
  const { popperManager } = context
  const targetRef = node => {
    popperManager.setTargetNode(node)
    if (typeof innerRef === 'function') {
      innerRef(node)
    }
  }

  if (typeof children === 'function') {
    const targetProps = { ref: targetRef }
    return children({ targetProps, restProps })
  }

  const componentProps = {
    ...restProps,
  }

  if (typeof component === 'string') {
    componentProps.ref = targetRef
  } else {
    componentProps.innerRef = targetRef
  }

  return createElement(component, componentProps, children)
}

Target.contextTypes = {
  popperManager: PropTypes.object.isRequired,
}

Target.propTypes = {
  component: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  innerRef: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
}

export default Target
