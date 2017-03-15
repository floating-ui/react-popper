import React, { Component, PropTypes, createElement } from 'react'
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
    const { component, ...restProps } = this.props
    return createElement(component, restProps)
  }
}

export default Target
