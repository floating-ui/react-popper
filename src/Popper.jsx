import React, { Component, Children, PropTypes } from 'react'
import ReactDOM, { findDOMNode, unstable_renderSubtreeIntoContainer } from 'react-dom'
import PopperJS from 'popper.js'

class Popper extends Component {
  static defaultProps = {
    renderElementTag: 'div',
    renderElementTo: null
  }

  _targetNode = null
  _elementParentNode = null
  _popper = false

  get targetNode() {
    return this._targetNode
  }

  get elementParentNode() {
    return this._elementParentNode
  }

  get tetherInstance() {
    return this._popper
  }

  componentDidMount() {
    this._targetNode = findDOMNode(this)
    this._update()
  }

  componentDidUpdate() {
    this._update()
  }

  componentWillUnmount() {
    this._destroy()
  }

  get _renderNode() {
    const { renderElementTo } = this.props
    if (typeof renderElementTo === 'string') {
      return document.querySelector(renderElementTo)
    } else {
      return renderElementTo || document.body
    }
  }

  _destroy() {
    if (this._elementParentNode) {
      // unmount component
      ReactDOM.unmountComponentAtNode(this._elementParentNode)

      // clean up DOM
      this._elementParentNode.parentNode.removeChild(this._elementParentNode)
    }

    if (this._popper) {
      this._popper.destroy()
    }

    this._elementParentNode = null
    this._popper = null
  }

  _update() {
    const { children, renderElementTag } = this.props
    const elementComponent = Children.toArray(children)[1]

    // if no element component provided, bail out
    if (!elementComponent) {
      // destroy Popper element if it has been created
      if (this._popper) {
        this._destroy()
      }
      return
    }

    // create element node container if it hasn't been yet
    if (!this._elementParentNode) {
      // create a node that we can stick our content Component in
      this._elementParentNode = document.createElement(renderElementTag)

      // append node to the render node
      this._renderNode.appendChild(this._elementParentNode)
    }

    // render element component into the DOM
    unstable_renderSubtreeIntoContainer(
      this, elementComponent, this._elementParentNode, () => {
        // don't update Popper until the subtree has finished rendering
        this._updatePopper()
      }
    )
  }

  _updatePopper() {
    const { children, renderElementTag, renderElementTo, id, className, style, ...options } = this.props

    if (id) {
      this._elementParentNode.id = id
    }

    if (className) {
      this._elementParentNode.className = className
    }

    if (style) {
      Object.keys(style).forEach(key => {
        this._elementParentNode.style[key] = style[key]
      })
    }

    if (!this._popper) {
      this._popper = new PopperJS(
        this._targetNode,
        this._elementParentNode,
        {
          placement: 'top'
        }
      )
    } else {
      // this._popper.setOptions(popperOptions)
    }
  }

  render() {
    return Children.toArray(this.props.children)[0]
  }
}

export default Popper
