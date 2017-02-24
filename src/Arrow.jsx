import { PropTypes, createElement } from 'react'

const Arrow = ({ tag, style, ...restProps }, context) => (
  createElement(tag, {
    ref: c => context.popperManager.addArrowNode(c),
    style: {
      ...context.popperManager.getArrowStyle(),
      ...style
    },
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
