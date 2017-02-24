import { PropTypes, createElement } from 'react'

const Popper = ({ tag, style, ...restProps }, context) => (
  createElement(tag, {
    ref: c => context.popperManager.addPopperNode(c),
    style: {
      ...context.popperManager.getPopperStyle(),
      ...style
    },
    'data-placement': context.popperManager.getPopperPlacement(),
    ...restProps
  })
)

Popper.contextTypes = {
  popperManager: PropTypes.object.isRequired
}

Popper.propTypes = {
  tag: PropTypes.string
}

Popper.defaultProps = {
  tag: 'div',
  className: 'popper'
}

export default Popper
