import { PropTypes, createElement } from 'react'

const Arrow = ({ component, style, ...restProps }, context) => (
  createElement(component, {
    ref: c => context.popper.setArrowNode(c),
    style: {
      ...context.popper.getArrowStyle(),
      ...style
    },
    ...restProps
  })
)

Arrow.contextTypes = {
  popper: PropTypes.object.isRequired
}

Arrow.propTypes = {
  component: PropTypes.any
}

Arrow.defaultProps = {
  component: 'span',
  className: 'popper__arrow'
}

export default Arrow
