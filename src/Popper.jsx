import React, { Component, PropTypes, createElement } from 'react'
import ReactDOM, { findDOMNode } from 'react-dom'
import PopperJS from 'popper.js'
import isEqual from 'lodash.isequal'

const noop = () => null

class Popper extends Component {
  static contextTypes = {
    popperManager: PropTypes.object.isRequired
  }

  static childContextTypes = {
    popper: PropTypes.object.isRequired
  }

  static propTypes = {
    component:     PropTypes.any,
    placement:     PropTypes.oneOf(PopperJS.placements),
    eventsEnabled: PropTypes.bool,
    modifiers:     PropTypes.object
  }

  static defaultProps = {
    component:     'div',
    placement:     'bottom',
    eventsEnabled: true,
    modifiers:     {},
    className:     'popper'
  }

  state = {}

  getChildContext() {
    return {
      popper: {
        setArrowNode:  this._setArrowNode,
        getArrowStyle: this._getArrowStyle
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

  _setArrowNode = (node) => {
    this._arrowNode = node
  }

  _getTargetNode = () => {
    return this.context.popperManager.getTargetNode()
  }

  _updateStateModifier = {
    enabled:  true,
    order:    900,
    function: (data) => {
      if (this.state.data && !isEqual(data.offsets, this.state.data.offsets) ||
          !this.state.data
      ) {
        this.setState({ data })
      }
    }
  }

  _updatePopper() {
    this._destroyPopper()
    this._createPopper()
  }

  _createPopper() {
    const { placement, eventsEnabled } = this.props
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

    this._popper = new PopperJS(
      this._getTargetNode(),
      findDOMNode(this),
      {
        placement,
        eventsEnabled,
        modifiers
      }
    )

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
        position:      'absolute',
        pointerEvents: 'none',
        opacity:       0,
      }
    }

    const {
      top,
      left,
      position,
    } = data.offsets.popper

    return {
      position,
      top:        0,
      left:       0,
      transform:  `translate3d(${Math.round(left)}px, ${Math.round(top)}px, 0px)`,
      willChange: 'transform',
      ...data.styles
    }
  }

  _getPopperPlacement = () => {
    return !!this.state.data ? this.state.data.placement : undefined
  }

  _getArrowStyle = () => {
    if (!this.state.data || !this.state.data.offsets.arrow) {
      return {}
    } else {
      const { top, left } = this.state.data.offsets.arrow
      if (!left) {
        return { top: +top }
      } else {
        return { left: +left }
      }
    }
  }

  _getProps() {
    const {
      component,
      placement,
      eventsEnabled,
      modifiers,
      style,
      children,
      ...restProps
    } = this.props

    return {
      style: {
        ...this._getPopperStyle(),
        ...style
      },
      'data-placement': this._getPopperPlacement(),
      ...restProps
    }
  }

  render() {
    const { component, children } = this.props
    const props = this._getProps()
    if (typeof children === 'function') {
      return children(props)
    } else {
      return createElement(component, props, children)
    }
  }
}

export default Popper
