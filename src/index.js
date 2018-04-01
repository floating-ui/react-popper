// @flow
import React, { Component, type Node } from 'react';
import PopperJS from 'popper.js';

type PopperInstance = {
  destroy: () => void,
};

type Placement =
  | 'auto-start'
  | 'auto'
  | 'auto-end'
  | 'top-start'
  | 'top'
  | 'top-end'
  | 'right-start'
  | 'right'
  | 'right-end'
  | 'bottom-end'
  | 'bottom'
  | 'bottom-start'
  | 'left-end'
  | 'left'
  | 'left-start';

type getRefFn = (?HTMLElement) => void;
type Style = { [string]: string | number };

type RenderProp = ({|
  referenceProps: {
    getRef: getRefFn,
  },
  popperProps: {
    getRef: getRefFn,
    style: Style,
    placement: ?Placement,
  },
  arrowProps: {
    getRef: getRefFn,
    style: Style,
  },
|}) => Node;

type PopperProps = {
  modifiers?: {
    [string]: { order: number, enabled: boolean, fn: Object => Object },
  },
  placement?: Placement,
  eventsEnabled?: boolean,
  children: RenderProp,
};

type PopperState = {
  referenceNode: ?HTMLElement,
  popperNode: ?HTMLElement,
  arrowNode: ?HTMLElement,
  popperInstance: ?PopperInstance,
  data: ?Object,
};

const initialStyle = {
  position: 'absolute',
  opacity: 0,
  pointerEvents: 'none',
};

const initialArrowStyle = {};

export default class Popper extends Component<PopperProps, PopperState> {
  static defaultProps = {
    placement: 'bottom',
    eventsEnabled: true,
  };

  state = {
    referenceNode: undefined,
    popperNode: undefined,
    arrowNode: undefined,
    popperInstance: undefined,
    data: undefined,
  };

  setReferenceNode = (referenceNode: ?HTMLElement) =>
    this.setState({ referenceNode });
  setPopperNode = (popperNode: ?HTMLElement) => this.setState({ popperNode });
  setArrowNode = (arrowNode: ?HTMLElement) => this.setState({ arrowNode });

  updateStateModifier = {
    enabled: true,
    order: 900,
    fn: (data: Object) => {
      this.setState({ data });
      return data;
    },
  };

  getOptions = () => ({
    placement: this.props.placement,
    eventsEnabled: this.props.eventsEnabled,
    modifiers: {
      ...this.props.modifiers,
      arrow: {
        enabled: !!this.state.arrowNode,
        element: this.state.arrowNode,
      },
      applyStyle: { enabled: false },
      updateStateModifier: this.updateStateModifier,
    },
  });

  getPopperStyle = () =>
    !this.state.popperNode || !this.state.data
      ? initialStyle
      : {
          position: this.state.data.offsets.popper.position,
          ...this.state.data.styles,
        };

  getPopperPlacement = () =>
    !this.state.data ? undefined : this.state.data.placement;

  getArrowStyle = () =>
    !this.state.arrowNode || !this.state.data
      ? initialArrowStyle
      : this.state.data.arrowStyles;

  initPopperInstance = () => {
    const { referenceNode, popperNode, popperInstance } = this.state;
    if (referenceNode && popperNode && !this.state.popperInstance) {
      const popperInstance = new PopperJS(
        referenceNode,
        popperNode,
        this.getOptions()
      );
      this.setState({ popperInstance });
      return true;
    }
    return false;
  };

  destroyPopperInstance = (callback: () => boolean) => {
    this.state.popperInstance && this.state.popperInstance.destroy();
    this.setState({ popperInstance: undefined }, callback);
  };

  updatePopperInstance = () => {
    if (this.state.popperInstance) {
      this.destroyPopperInstance(() => this.initPopperInstance());
    }
  };

  componentDidUpdate(prevProps: PopperProps, prevState: PopperState) {
    // If needed, initialize the Popper.js instance
    // it will return `true` if it initialized a new instance, or `false` otherwise
    // if it returns `false`, we make sure Popper props haven't changed, and update
    // the Popper.js instance if needed
    if (!this.initPopperInstance()) {
      // If the Popper.js options have changed, update the instance (destroy + create)
      if (
        this.props.placement !== prevProps.placement ||
        this.props.eventsEnabled !== prevProps.eventsEnabled ||
        this.state.referenceNode !== prevState.referenceNode ||
        this.state.arrowNode !== prevState.arrowNode ||
        this.state.popperNode !== prevState.popperNode
      ) {
        this.updatePopperInstance();
      }
    }
  }

  componentWillUnmount() {
    this.state.popperInstance && this.state.popperInstance.destroy();
  }

  render() {
    return this.props.children({
      referenceProps: {
        getRef: this.setReferenceNode,
      },
      popperProps: {
        getRef: this.setPopperNode,
        style: this.getPopperStyle(),
        placement: this.getPopperPlacement(),
      },
      arrowProps: {
        getRef: this.setArrowNode,
        style: this.getArrowStyle(),
      },
    });
  }
}

const placements = PopperJS.placements;
export { placements };
