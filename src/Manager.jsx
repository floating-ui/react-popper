import { Component, createElement } from 'react'
import PropTypes from 'prop-types'

class Manager extends Component {
  static childContextTypes = process.env.NODE_ENV !== 'production'
    ? {
        popperManager: PropTypes.object.isRequired,
      }
    : {
        popperManager: () => {},
      }

  static propTypes = {
    tag: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  }

  static defaultProps = {
    tag: 'div',
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
    const { tag, children, ...restProps } = this.props
    if (tag !== false) {
      return createElement(tag, restProps, children)
    } else {
      return children
    }
  }
}

export default Manager
