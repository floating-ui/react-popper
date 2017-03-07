import { PropTypes, createElement } from 'react'

const Target = ({ component, getRef, ...restProps }, context) => (
  createElement(component, {
    ...restProps,
    ref: c => {
      context.popperManager.setTargetNode(c)
      getRef(c)
    }
  })
)

Target.contextTypes = {
  popperManager: PropTypes.object.isRequired
}

Target.propTypes = {
  component: PropTypes.any,
  getRef:    PropTypes.func
}

Target.defaultProps = {
  component: 'div',
  getRef:    () => null
}

export default Target
