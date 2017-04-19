import React, { Component, createElement } from 'react'
import PropTypes from 'prop-types'
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
    const { component, children, ...restProps } = this.props
    if (component) {
      return createElement(component, restProps, children)
    } else {
      return children
    }
  }
}

export default Manager
