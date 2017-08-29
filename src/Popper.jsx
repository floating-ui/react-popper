import React, { Component, createElement } from 'react'
import PropTypes from 'prop-types'
import PopperJS from 'popper.js'
import isEqual from 'is-equal-shallow'

const noop = () => null

class Popper extends Component {
  static contextTypes = {
    popperManager: PropTypes.object.isRequired,
  }

  static childContextTypes = {
    popper: PropTypes.object.isRequired,
  }

  static propTypes = {
    component: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    innerRef: PropTypes.func,
    placement: PropTypes.oneOf(PopperJS.placements),
    eventsEnabled: PropTypes.bool,
    modifiers: PropTypes.object,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  }

  static defaultProps = {
    component: 'div',
    placement: 'bottom',
    eventsEnabled: true,
    modifiers: {},
  }

  state = {}

  subscribers = []

  getChildContext() {
    console.log('getChildContext', this)
    return {
      popper: {
        subscribe: this._subscribe,
        unsubscribe: this._unsubscribe,
        setArrowNode: this._setArrowNode,
      },
    }
  }

  // Add a subcomponent update fn that needs to get updated when we do
  _subscribe = fn => this.subscribers.push(fn)
  // Remove such a fn
  _unsubscribe = fn =>
    (this.subscribers = this.subscribers.filter(s => s !== fn))

  componentDidMount() {
    this._updatePopper()
  }

  componentDidUpdate(lastProps) {
    if (
      lastProps.placement !== this.props.placement ||
      lastProps.eventsEnabled !== this.props.eventsEnabled
    ) {
      this._updatePopper()
    }

    if (this._popper && lastProps.children !== this.props.children) {
      this._popper.scheduleUpdate()
    }
  }

  componentWillUnmount() {
    this._destroyPopper()
  }

  _setArrowNode = node => {
    this._arrowNode = node
  }

  _getTargetNode = () => {
    return this.context.popperManager.getTargetNode()
  }

  _updateFromData = data => {
    if (
      (this.state.data && !isEqual(data.offsets, this.state.data.offsets)) ||
      !this.state.data
    ) {
      this.setState({ data })
      this.subscribers.forEach(s => s(data))
    }
    return data
  }

  _updateStateModifier = {
    enabled: true,
    order: 900,
    fn: this._updateFromData,
  }

  _updatePopper() {
    this._destroyPopper()
    if (this._node) {
      this._createPopper()
    }
  }

  _createPopper() {
    const { placement, eventsEnabled } = this.props
    const modifiers = {
      ...this.props.modifiers,
      applyStyle: { enabled: false },
      updateState: this._updateStateModifier,
    }

    if (this._arrowNode) {
      modifiers.arrow = {
        element: this._arrowNode,
      }
    }

    this._popper = new PopperJS(this._getTargetNode(), this._node, {
      placement,
      eventsEnabled,
      modifiers,
    })

    // schedule an update to make sure everything gets positioned correct
    // after being instantiated
    this._popper.scheduleUpdate()
  }

  _destroyPopper() {
    if (this._popper) {
      this._popper.destroy()
    }
  }

  _getPopperStyle = () => {
    const { data } = this.state

    // If Popper isn't instantiated, hide the popperElement
    // to avoid flash of unstyled content
    if (!this._popper || !data) {
      return {
        position: 'absolute',
        pointerEvents: 'none',
        opacity: 0,
      }
    }

    const { top, left, position } = data.offsets.popper

    return {
      position,
      ...data.styles,
    }
  }

  _getPopperPlacement = () => {
    return !!this.state.data ? this.state.data.placement : undefined
  }

  render() {
    const {
      component,
      innerRef,
      placement,
      eventsEnabled,
      modifiers,
      children,
      ...restProps
    } = this.props

    const popperRef = node => {
      this._node = node
      if (typeof innerRef === 'function') {
        innerRef(node)
      }
    }
    const popperStyle = this._getPopperStyle()
    const popperPlacement = this._getPopperPlacement()

    if (typeof children === 'function') {
      const popperProps = {
        ref: popperRef,
        style: popperStyle,
        ['data-placement']: popperPlacement,
      }
      return children({
        popperProps,
        restProps,
        scheduleUpdate: this._popper && this._popper.scheduleUpdate,
      })
    }

    const componentProps = {
      ...restProps,
      style: {
        ...restProps.style,
        ...popperStyle,
      },
      'data-placement': popperPlacement,
    }

    if (typeof component === 'string') {
      componentProps.ref = popperRef
    } else {
      componentProps.innerRef = popperRef
    }

    return createElement(component, componentProps, children)
  }
}

export default Popper
