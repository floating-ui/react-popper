import React, { Component, PropTypes, createElement } from 'react'
import ReactDOM from 'react-dom'

class Manager extends Component {
  static childContextTypes = {
    popperManager: PropTypes.object.isRequired
  }

  static propTypes = {
    component: PropTypes.any
  }

  static defaultProps = {
    component: 'div'
  }

  getChildContext() {
    return {
      popperManager: {
        setTargetNode: this._setTargetNode,
        getTargetNode: this._getTargetNode
      }
    }
  }

  _setTargetNode = (node) => {
    this._targetNode = node
  }

  _getTargetNode = () => {
    return this._targetNode
  }

  render() {
    const { component, ...restProps } = this.props
    return createElement(component, restProps)
  }
}

export default Manager
