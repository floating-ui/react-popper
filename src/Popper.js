// @flow
import * as React from 'react';
import PopperJS, {
  type Placement,
  type Instance as PopperJS$Instance,
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
  popperNode: ?HTMLElement,
  arrowNode: ?HTMLElement,
  popperInstance: ?PopperJS$Instance,
  data: ?Data,
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
    popperNode: undefined,
    arrowNode: undefined,
    popperInstance: undefined,
    data: undefined,
  };

  setPopperNode = (popperNode: ?HTMLElement) => {
    safeInvoke(this.props.innerRef, popperNode);
    this.setState({ popperNode });
  }
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
    positionFixed: this.props.positionFixed,
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

  getOutOfBoundariesState = () =>
    this.state.data ? this.state.data.hide : undefined;

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
        this.props.referenceElement !== prevProps.referenceElement ||
        this.props.positionFixed !== prevProps.positionFixed
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
