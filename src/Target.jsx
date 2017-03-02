import { PropTypes, createElement } from 'react'

const Target = ({ component, ...restProps }, context) => (
  createElement(component, {
    ref: c => context.popperManager.setTargetNode(c),
    ...restProps
  })
)

Target.contextTypes = {
  popperManager: PropTypes.object.isRequired
}

Target.propTypes = {
  component: PropTypes.any
}

Target.defaultProps = {
  component: 'div'
}

export default Target
