import React, { Component, Children, PropTypes } from 'react'
import ReactDOM, { findDOMNode } from 'react-dom'

class PopperArrow extends Component {
  static contextTypes = {
    popperManager: PropTypes.object.isRequired
  }

  componentDidMount() {
    this.context.popperManager.addArrow(findDOMNode(this))
  }

  render() {
    return <span {...this.props}/>
  }
}

export default PopperArrow
