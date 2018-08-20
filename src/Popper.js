// @flow
import * as React from 'react';
import PopperJS, {
  type Placement,
  type Instance,
  type Data,
  type Modifiers,
  type ReferenceObject,
} from 'popper.js';
import type { Style } from 'typed-styles';
import { ManagerContext } from './Manager';
import { safeInvoke, unwrapArray } from './utils';

type getRefFn = (?HTMLElement) => void;
type ReferenceElement = ReferenceObject | HTMLElement | null;
type StyleOffsets = { top: number, left: number };
type StylePosition = { position: 'absolute' | 'fixed' };

export type PopperArrowProps = {
  ref: getRefFn,
  style: StyleOffsets & Style,
};
export type PopperChildrenProps = {|
  ref: getRefFn,
  style: StyleOffsets & StylePosition & Style,
  placement: Placement,
  outOfBoundaries: ?boolean,
  scheduleUpdate: () => void,
  arrowProps: PopperArrowProps,
|};
export type PopperChildren = PopperChildrenProps => React.Node;

export type PopperProps = {
  children: PopperChildren,
  eventsEnabled?: boolean,
  innerRef?: getRefFn,
  modifiers?: Modifiers,
  placement?: Placement,
  positionFixed?: boolean,
  referenceElement?: ReferenceElement,
};

type PopperState = {
  data: ?Data,
  placement: ?Placement,
};

const initialStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  opacity: 0,
  pointerEvents: 'none',
};

const initialArrowStyle = {};

export class InnerPopper extends React.Component<PopperProps, PopperState> {
  static defaultProps = {
    placement: 'bottom',
    eventsEnabled: true,
    referenceElement: undefined,
    positionFixed: false,
  };

  state = {
    data: undefined,
    placement: undefined,
  };

  popperInstance: ?Instance;

  popperNode: ?HTMLElement = null;
  arrowNode: ?HTMLElement = null;

  setPopperNode = (popperNode: ?HTMLElement) => {
    if (this.popperNode === popperNode) return;

    safeInvoke(this.props.innerRef, popperNode);
    this.popperNode = popperNode;

    if (!this.popperInstance) this.updatePopperInstance();
  };

  setArrowNode = (arrowNode: ?HTMLElement) => {
    if (this.arrowNode === arrowNode) return;
    this.arrowNode = arrowNode;

    if (!this.popperInstance) this.updatePopperInstance();
  };

  updateStateModifier = {
    enabled: true,
    order: 900,
    fn: (data: Object) => {
      const { placement } = data;
      this.setState(
        { data, placement },
        placement !== this.state.placement ? this.scheduleUpdate : undefined
      );
      return data;
    },
  };

  getOptions = () => ({
    placement: this.props.placement,
    eventsEnabled: this.props.eventsEnabled,
    positionFixed: this.props.positionFixed,
    modifiers: {
      ...this.props.modifiers,
      arrow: {
        enabled: !!this.arrowNode,
        element: this.arrowNode,
      },
      applyStyle: { enabled: false },
      updateStateModifier: this.updateStateModifier,
    },
  });

  getPopperStyle = () =>
    !this.popperNode || !this.state.data
      ? initialStyle
      : {
          position: this.state.data.offsets.popper.position,
          ...this.state.data.styles,
        };

  getPopperPlacement = () =>
    !this.state.data ? undefined : this.state.placement;

  getArrowStyle = () =>
    !this.arrowNode || !this.state.data
      ? initialArrowStyle
      : this.state.data.arrowStyles;

  getOutOfBoundariesState = () =>
    this.state.data ? this.state.data.hide : undefined;

  destroyPopperInstance = () => {
    if (!this.popperInstance) return;

    this.popperInstance.destroy();
    this.popperInstance = null;
  };

  updatePopperInstance = () => {
    this.destroyPopperInstance();

    const { popperNode } = this;
    const { referenceElement } = this.props;

    if (!referenceElement || !popperNode) return;

    this.popperInstance = new PopperJS(
      referenceElement,
      popperNode,
      this.getOptions()
    );
  };

  scheduleUpdate = () => {
    if (this.popperInstance) {
      this.popperInstance.scheduleUpdate();
    }
  };

  componentDidUpdate(prevProps: PopperProps, prevState: PopperState) {
    // If the Popper.js options have changed, update the instance (destroy + create)
    if (
      this.props.placement !== prevProps.placement ||
      this.props.referenceElement !== prevProps.referenceElement ||
      this.props.positionFixed !== prevProps.positionFixed
    ) {
      this.updatePopperInstance();
    } else if (
      this.props.eventsEnabled !== prevProps.eventsEnabled &&
      this.popperInstance
    ) {
      this.props.eventsEnabled
        ? this.popperInstance.enableEventListeners()
        : this.popperInstance.disableEventListeners();
    }

    // A placement difference in state means popper determined a new placement
    // apart from the props value. By the time the popper element is rendered with
    // the new position Popper has already measured it, if the place change triggers
    // a size change it will result in a misaligned popper. So we schedule an update to be sure.
    if (prevState.placement !== this.state.placement) {
      this.scheduleUpdate();
    }
  }

  componentWillUnmount() {
    this.destroyPopperInstance();
  }

  render() {
    return unwrapArray(this.props.children)({
      ref: this.setPopperNode,
      style: this.getPopperStyle(),
      placement: this.getPopperPlacement(),
      outOfBoundaries: this.getOutOfBoundariesState(),
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

export default function Popper(props: PopperProps) {
  return (
    <ManagerContext.Consumer>
      {({ referenceNode }) => (
        <InnerPopper referenceElement={referenceNode} {...props} />
      )}
    </ManagerContext.Consumer>
  );
}
