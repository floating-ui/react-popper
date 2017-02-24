import { PropTypes, createElement } from 'react'

const PopperArrow = ({ tag = 'span', ...restProps }, context) => (
  createElement(tag, {
    ref: c => context.popperManager.addArrow(c),
    ...restProps
  })
)

PopperArrow.contextTypes = {
  popperManager: PropTypes.object.isRequired
}

PopperArrow.propTypes = {
  tag: PropTypes.string
}

PopperArrow.defaultProps = {
  tag: 'span'
}

export default PopperArrow
