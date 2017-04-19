import React, { Component, createElement } from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'

class Target extends Component {
  static contextTypes = {
    popperManager: PropTypes.object.isRequired
  }

  static propTypes = {
    component: PropTypes.any
  }

  static defaultProps = {
    component: 'div'
  }

  componentDidMount() {
    this.context.popperManager.setTargetNode(findDOMNode(this))
  }

  render() {
    const { component, children, ...restProps } = this.props
    if (component) {
      return createElement(component, restProps, children)
    } else {
      return children
    }
  }
}

export default Target
