// @flow
import React, { Component, type Node } from 'react';
import PopperJS, {
  type Placement,
  type Instance as PopperJS$Instance,
  type Data,
  type Modifiers,
  type ReferenceObject,
} from 'popper.js';
import { ManagerContext } from './Manager';
import { unwrapArray } from './utils';

type getRefFn = (?HTMLElement) => void;
type Style = Object;

type ReferenceElement = ReferenceObject | HTMLElement | null;

type RenderProp = ({|
  ref: getRefFn,
  style: Style,
  placement: ?Placement,
  scheduleUpdate: () => void,
  arrowProps: {
    ref: getRefFn,
    style: Style,
  },
|}) => Node;

type PopperProps = {
  modifiers?: Modifiers,
  placement?: Placement,
  eventsEnabled?: boolean,
  referenceElement?: ReferenceElement,
  children: RenderProp,
};

type PopperState = {
  popperNode: ?HTMLElement,
  arrowNode: ?HTMLElement,
  popperInstance: ?PopperJS$Instance,
  data: ?Data,
};

const initialStyle = {
  position: 'absolute',
  opacity: 0,
  pointerEvents: 'none',
};

const initialArrowStyle = {};

export class Popper extends Component<PopperProps, PopperState> {
  static defaultProps = {
    placement: 'bottom',
    eventsEnabled: true,
    referenceElement: undefined,
  };

  state = {
    popperNode: undefined,
    arrowNode: undefined,
    popperInstance: undefined,
    data: undefined,
  };

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
    const { referenceElement } = this.props;
    const { popperNode, popperInstance } = this.state;
    if (referenceElement && popperNode && !popperInstance) {
      const popperInstance = new PopperJS(
        referenceElement,
        popperNode,
        this.getOptions()
      );
      this.setState({ popperInstance });
      return true;
    }
    return false;
  };

  destroyPopperInstance = (callback: () => boolean) => {
    if (this.state.popperInstance) {
      this.state.popperInstance.destroy();
    }
    this.setState({ popperInstance: undefined }, callback);
  };

  updatePopperInstance = () => {
    if (this.state.popperInstance) {
      this.destroyPopperInstance(() => this.initPopperInstance());
    }
  };

  scheduleUpdate = () => {
    if (this.state.popperInstance) {
      this.state.popperInstance.scheduleUpdate();
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
        this.state.arrowNode !== prevState.arrowNode ||
        this.state.popperNode !== prevState.popperNode ||
        this.props.referenceElement !== prevProps.referenceElement
      ) {
        this.updatePopperInstance();
      }
    }
  }

  componentWillUnmount() {
    if (this.state.popperInstance) {
      this.state.popperInstance.destroy();
    }
  }

  render() {
    return unwrapArray(this.props.children)({
      ref: this.setPopperNode,
      style: this.getPopperStyle(),
      placement: this.getPopperPlacement(),
      scheduleUpdate: this.scheduleUpdate,
      arrowProps: {
        ref: this.setArrowNode,
        style: this.getArrowStyle(),
      },
    });
  }
}

const placements = PopperJS.placements;
export { placements };

export default (props: PopperProps) => (
  <ManagerContext.Consumer>
    {({ referenceNode }) => (
      <Popper referenceElement={referenceNode} {...props} />
    )}
  </ManagerContext.Consumer>
);
