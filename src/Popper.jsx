import React, { Component, createElement } from 'react'
import PropTypes from 'prop-types'
import PopperJS from 'popper.js'

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

  getChildContext() {
    return {
      popper: {
        setArrowNode: this._setArrowNode,
        getArrowStyle: this._getArrowStyle,
      },
    }
  }

  componentDidUpdate(lastProps) {
    if (
      lastProps.placement !== this.props.placement ||
      lastProps.eventsEnabled !== this.props.eventsEnabled
    ) {
      this._destroyPopper()
      this._createPopper()
    }

    if (lastProps.children !== this.props.children) {
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

  _getOffsets = data => {
    return Object.keys(data.offsets).map(key => data.offsets[key])
  }

  _isDataDirty = data => {
    if (this.state.data) {
      return (
        JSON.stringify(this._getOffsets(this.state.data)) !==
        JSON.stringify(this._getOffsets(data))
      )
    } else {
      return true
    }
  }

  _updateStateModifier = {
    enabled: true,
    order: 900,
    fn: data => {
      if (this._isDataDirty(data)) {
        this.setState({ data })
      }
      return data
    },
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

    // schedule an update to make sure everything gets positioned correctly
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
    if (!data) {
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
    return this.state.data ? this.state.data.placement : undefined
  }

  _getPopperHide = () => {
    return !!this.state.data && this.state.data.hide ? '' : undefined
  }

  _getArrowStyle = () => {
    if (!this.state.data || !this.state.data.offsets.arrow) {
      return {}
    } else {
      const { top, left } = this.state.data.offsets.arrow
      return { top, left }
    }
  }

  _getPopperRef = (node) => {
    this._node = node
    if (node) {
      this._createPopper();
    } else {
      this._destroyPopper();
    }
    if (this.props.innerRef) {
      this.props.innerRef(node)
    }
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
    const popperStyle = this._getPopperStyle()
    const popperPlacement = this._getPopperPlacement()
    const popperHide = this._getPopperHide()

    if (typeof children === 'function') {
      const popperProps = {
        ref: this._getPopperRef,
        style: popperStyle,
        ['data-placement']: popperPlacement,
        ['data-x-out-of-boundaries']: popperHide,
      }

      return children({
        popperProps,
        restProps,
        scheduleUpdate: () => {
          // _createPopper will scheduleUpdate,
          // so calling this before this._popper exists
          // can be a noop.
          this._popper && this._popper.scheduleUpdate();
        },
      })
    }

    const componentProps = {
      ...restProps,
      style: {
        ...restProps.style,
        ...popperStyle,
      },
      'data-placement': popperPlacement,
      'data-x-out-of-boundaries': popperHide,
    }

    if (typeof component === 'string') {
      componentProps.ref = this._getPopperRef
    } else {
      componentProps.innerRef = this._getPopperRef
    }

    return createElement(component, componentProps, children)
  }
}

export default Popper
