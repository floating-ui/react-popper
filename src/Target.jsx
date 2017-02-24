import { PropTypes, createElement } from 'react'

const Target = ({ tag, ...restProps }, context) => (
  createElement(tag, {
    ref: c => context.popperManager.addTargetNode(c),
    ...restProps
  })
)

Target.contextTypes = {
  popperManager: PropTypes.object.isRequired
}

Target.propTypes = {
  tag: PropTypes.string
}

Target.defaultProps = {
  tag: 'div'
}

export default Target
