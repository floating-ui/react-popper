import { PropTypes, createElement } from 'react'

const Arrow = ({ component, style, getRef, ...restProps }, context) => (
  createElement(component, {
    ...restProps,
    ref: c => {
      context.popper.setArrowNode(c)
      getRef(c)
    },
    style: {
      ...context.popper.getArrowStyle(),
      ...style
    }
  })
)

Arrow.contextTypes = {
  popper: PropTypes.object.isRequired
}

Arrow.propTypes = {
  component: PropTypes.any,
  getRef:    PropTypes.func
}

Arrow.defaultProps = {
  component: 'span',
  className: 'popper__arrow',
  getRef:    () => null
}

export default Arrow
