import React, { Component, Children, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import Popper from 'popper.js'

class PopperComponent extends Component {
  static childContextTypes = {
    popperManager: PropTypes.object.isRequired,
    placement: PropTypes.oneOf(Popper.placements),
  }

  static defaultProps = {
    popperProps: {
      tag: 'div',
      renderTo: null,
      id: '',
      className: 'popper',
      style: {}
    },
    placement: 'bottom',
    modifiers: {},
  }

  _referenceNode = null
  _popperNode = null
  _arrowNode = null
  _popper = false

  getChildContext() {
    return {
      popperManager: {
        addArrow: this._addArrowNode
      }
    }
  }

  componentDidMount() {
    this._referenceNode = ReactDOM.findDOMNode(this)
    this._createPopperNode()
    this._renderPopper({ popperProps: {} })
  }

  componentDidUpdate(lastProps) {
    this._renderPopper(lastProps)
  }

  componentWillUnmount() {
    this._destroy()
  }

  get _popperParentNode() {
    const { popperProps: { renderTo } } = this.props
    if (typeof renderTo === 'string') {
      return document.querySelector(renderTo)
    } else {
      return renderTo || document.body
    }
  }

  _addArrowNode = (node) => {
    this._arrowNode = node
  }

  _createPopperNode() {
    // create a node that we can stick our popper Component in
    this._popperNode = document.createElement(this.props.popperProps.tag)

    // append that node to the parent node
    this._popperParentNode.appendChild(this._popperNode)
  }

  _destroy() {
    if (this._popperParentNode) {
      // unmount component
      ReactDOM.unmountComponentAtNode(this._popperParentNode)

      // clean up DOM
      this._popperParentNode.parentNode.removeChild(this._popperNode)
    }

    if (this._popper) {
      this._popper.destroy()
    }

    this._popperNode = null
    this._popper = null
  }

  _renderPopper(lastProps) {
    const popperChild = Children.toArray(this.props.children)[1]

    // if no popper child provided, bail out
    if (!popperChild) {
      // destroy Popper element if it has been created
      this._destroy()
      return
    }

    // render element component into the DOM
    ReactDOM.unstable_renderSubtreeIntoContainer(
      this, popperChild, this._popperNode, () => {
        // don't update Popper until the subtree has finished rendering
        this._updatePopperNode(lastProps)
        this._updatePopper(lastProps)
      }
    )
  }

  _updatePopperNode(lastProps) {
    const { popperProps: { id, className, style } } = this.props

    if (lastProps.popperProps.id !== id) {
      this._popperNode.id = id
    }

    if (lastProps.popperProps.className !== className) {
      this._popperNode.className = className
    }

    if (style) {
      Object.keys(style).forEach(key => {
        this._popperNode.style[key] = style[key]
      })
    }
  }

  _updatePopper(lastProps) {
    const {
      placement,
      modifiers,
    } = this.props

    // TODO: check if props changed here, no need to update if nothing has changed

    // destroy any prior popper instance before creating another
    if (this._popper) {
      this._popper.destroy()
    }

    this._popper = new Popper(
      this._referenceNode,
      this._popperNode,
      {
        placement,
        modifiers: {
          ...modifiers,
          arrow: { element: this._arrowNode }
        },
      }
    )
  }

  render() {
    return Children.toArray(this.props.children)[0]
  }
}

export default PopperComponent
