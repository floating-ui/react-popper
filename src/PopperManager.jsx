import React, { Component, PropTypes, createElement } from 'react'
import ReactDOM from 'react-dom'
import Popper from 'popper.js'
import isEqual from 'lodash.isequal'

const noop = () => null

class PopperComponent extends Component {
  static childContextTypes = {
    popperManager: PropTypes.object.isRequired
  }

  static propTypes = {
    tag:           PropTypes.any,
    placement:     PropTypes.oneOf(Popper.placements),
    eventsEnabled: PropTypes.bool,
    modifiers:     PropTypes.object,
    onCreate:      PropTypes.func,
    onUpdate:      PropTypes.func,
  }

  static defaultProps = {
    tag:           'div',
    placement:     'bottom',
    eventsEnabled: true,
    modifiers:     {},
    onCreate:      noop,
    onUpdate:      noop,
  }

  state = {}

  getChildContext() {
    return {
      popperManager: {
        addTargetNode:      this._addTargetNode,
        addPopperNode:      this._addPopperNode,
        addArrowNode:       this._addArrowNode,
        getPopperStyle:     this._getPopperStyle,
        getPopperPlacement: this._getPopperPlacement,
        getArrowStyle:      this._getArrowStyle,
      }
    }
  }

  componentDidMount() {
    this._updatePopper()
  }

  componentDidUpdate(lastProps) {
    if (lastProps.placement !== this.props.placement ||
        lastProps.eventsEnabled !== this.props.eventsEnabled
    ) {
      this._updatePopper()
    }
  }

  componentWillUnmount() {
    this._destroyPopper()
  }

  _addTargetNode = (node) => {
    this._targetNode = node
  }

  _addPopperNode = (node) => {
    this._popperNode = node
  }

  _addArrowNode = (node) => {
    this._arrowNode = node
  }

  _updateStateModifier = {
    enabled: true,
    order: 900,
    function: (data) => {
      if ((this.state.data && !isEqual(data.offsets, this.state.data.offsets)) || !this.state.data) {
        this.setState({ data })
      }
    }
  }

  _updatePopper() {
    const {
      placement,
      modifiers,
    } = this.props

    if (!this._targetNode || !this._popperNode) return;

    // destroy any prior popper instance before creating another
    this._destroyPopper()
    this._createPopper()
  }

  _createPopper() {
    const { placement, eventsEnabled, onCreate, onUpdate } = this.props
    const modifiers = {
      ...this.props.modifiers,
      applyStyle:  { enabled: false },
      updateState: this._updateStateModifier,
    }

    if (this._arrowNode) {
      modifiers.arrow = {
        element: this._arrowNode
      }
    }

    this._popper = new Popper(
      this._targetNode,
      this._popperNode,
      {
        placement,
        eventsEnabled,
        modifiers,
        onCreate,
        onUpdate
      }
    )
  }

  _destroyPopper() {
    if (this._popper) {
      this._popper.destroy()
    }
  }

  _getPopperStyle = () => {
    // If Popper isn't instantiated, hide the popperElement
    // to avoid flash of unstyled content
    if (!this._popper || !this.state.data) {
      return {
        position:      'absolute',
        pointerEvents: 'none',
        opacity:       0,
      }
    }

    const {
      top,
      left,
      position,
    } = this.state.data.offsets.popper

    return {
      position,
      top:        0,
      left:       0,
      transform:  `translate3d(${left}px, ${top}px, 0px)`,
      willChange: 'transform',
    }
  }

  _getPopperPlacement = () => {
    return !!this.state.data ? this.state.data.placement : undefined
  }

  _getArrowStyle = () => {
    if (!this.state.data || !this.state.data.offsets.arrow) {
      return {
        top:  0,
        left: 0,
      }
    } else {
      const { top, left } = this.state.data.offsets.arrow
      return {
        top:  +top,
        left: +left,
      }
    }
  }

  render() {
    const {
      tag,
      placement,
      eventsEnabled,
      modifiers,
      onCreate,
      onUpdate,
      ...restProps
    } = this.props

    return createElement(tag, restProps)
  }
}

export default PopperComponent
