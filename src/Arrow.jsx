import { PropTypes, createElement } from 'react'

const Arrow = ({ tag, ...restProps }, context) => (
  createElement(tag, {
    ref: c => context.popperManager.addArrowNode(c),
    ...restProps
  })
)

Arrow.contextTypes = {
  popperManager: PropTypes.object.isRequired
}

Arrow.propTypes = {
  tag: PropTypes.string
}

Arrow.defaultProps = {
  tag:       'span',
  className: 'popper__arrow'
}

export default Arrow
