import React, { Component, createElement } from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'

class Arrow extends Component {
  static contextTypes = {
    popper: PropTypes.object.isRequired,
  }

  static propTypes = {
    component: PropTypes.any,
  }

  static defaultProps = {
    component: 'span',
    className: 'popper__arrow',
  }

  componentDidMount() {
    this.context.popper.setArrowNode(findDOMNode(this))
  }

  render() {
    const { component, style, ...restProps } = this.props
    return createElement(component, {
      style: {
        ...this.context.popper.getArrowStyle(),
        ...style,
      },
      ...restProps,
    })
  }
}

export default Arrow
