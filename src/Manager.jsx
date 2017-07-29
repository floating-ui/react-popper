import React, { Component, createElement } from 'react'
import PropTypes from 'prop-types'

class Manager extends Component {
  static childContextTypes = {
    popperManager: PropTypes.object.isRequired,
  }

  getChildContext() {
    return {
      popperManager: {
        setTargetNode: this._setTargetNode,
        getTargetNode: this._getTargetNode,
      },
    }
  }

  _setTargetNode = node => {
    this._targetNode = node
  }

  _getTargetNode = () => {
    return this._targetNode
  }

  render() {
    return this.props.children
  }
}

export default Manager
