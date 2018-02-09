import { Component, createElement } from 'react'
import PropTypes from 'prop-types'
import PopperJS from 'popper.js'

class Popper extends Component {
  static contextTypes = {
    popperManager: PropTypes.object,
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
    target: PropTypes.instanceOf(Element),
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
      this._scheduleUpdate()
    }
  }

  componentWillUnmount() {
    this._destroyPopper()
  }

  _setArrowNode = node => {
    this._arrowNode = node
  }

  _getTargetNode = () => {
    if (this.props.target) {
      return this.props.target
    }
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
    this._popper = new PopperJS(this._getTargetNode(), this._popperNode, {
      placement,
      eventsEnabled,
      modifiers,
    })

    // TODO: look into setTimeout scheduleUpdate call, without it, the popper will not position properly on creation
    setTimeout(() => this._scheduleUpdate())
  }

  _destroyPopper() {
    if (this._popper) {
      this._popper.destroy()
    }
  }

  _getPopperStyle = () => {
    const { data } = this.state

    if (!this._popper || !data) {
      return {
        position: 'absolute',
        pointerEvents: 'none',
        opacity: 0,
      }
    }

    return {
      position: data.offsets.popper.position,
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

  _handlePopperRef = node => {
    this._popperNode = node
    if (node) {
      this._createPopper()
    } else {
      this._destroyPopper()
    }
    if (this.props.innerRef) {
      this.props.innerRef(node)
    }
  }

  _scheduleUpdate = () => {
    this._popper && this._popper.scheduleUpdate()
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
        ref: this._handlePopperRef,
        style: popperStyle,
        'data-placement': popperPlacement,
        'data-x-out-of-boundaries': popperHide,
      }
      return children({
        popperProps,
        restProps,
        scheduleUpdate: this._scheduleUpdate,
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
      componentProps.ref = this._handlePopperRef
    } else {
      componentProps.innerRef = this._handlePopperRef
    }

    return createElement(component, componentProps, children)
  }
}

export default Popper
