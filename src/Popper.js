// @flow
import deepEqual from "deep-equal";
import * as React from 'react';
import { createPopper } from '@popperjs/core';
import {
  type State,
  type Placement,
  type PositioningStrategy,
  type Instance,
  type VirtualElement,
  type Modifier,
  type ModifierArguments,
} from '@popperjs/core/lib';
import type { Style } from 'typed-styles';
import { ManagerReferenceNodeContext } from './Manager';
import { unwrapArray, setRef, shallowEqual } from './utils';
import { type Ref } from "./RefTypes";

type ReferenceElement = VirtualElement | HTMLElement | null;
type StyleOffsets = { top: number, left: number };
type StylePosition = { position: 'absolute' | 'fixed' };
type Modifiers = Array<$Shape<Modifier<any>>>

export type PopperArrowProps = {
  ref: Ref,
  style: StyleOffsets & Style,
};
export type PopperChildrenProps = {|
  ref: Ref,
  style: StyleOffsets & StylePosition & Style,

  placement: Placement,
  isReferenceHidden: ?boolean,
  hasPopperEscaped: ?boolean,

  update: () => Promise<null | $Shape<State>>,
  arrowProps: PopperArrowProps,
|};
export type PopperChildren = PopperChildrenProps => React.Node;

export type PopperProps = {
  children: PopperChildren,
  innerRef?: Ref,
  modifiers?: Modifiers,
  placement?: Placement,
  strategy?: PositioningStrategy,
  referenceElement?: ReferenceElement,
  onFirstUpdate?: ($Shape<State>) => void
};

type PopperState = {
  placement: ?Placement,
  styles: ?{
    popper: Style,
    arrow: Style,
  },
  isReferenceHidden: ?boolean,
  hasPopperEscaped: ?boolean,
};

const initialPopperStyle = {
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
    strategy: 'absolute',
    modifiers: [],
    referenceElement: undefined,
  };

  state = {
    data: undefined,
    placement: undefined,
  };

  popperInstance: ?Instance;

  popperNode: ?HTMLElement = null;
  arrowNode: ?HTMLElement = null;

  setPopperNode = (popperNode: ?HTMLElement) => {
    if (!popperNode || this.popperNode === popperNode) return;

    setRef(this.props.innerRef, popperNode);
    this.popperNode = popperNode;

    this.updatePopperInstance();
  };

  setArrowNode = (arrowNode: ?HTMLElement) => {
    this.arrowNode = arrowNode;
  };

  updateStateModifier: Modifier<{||}> = {
    name: 'reactPopperState',
    enabled: true,
    phase: 'write',
    fn: ({ state }: ModifierArguments<{||}>) => {
      const { placement, styles, modifiersData } = state;
      let isReferenceHidden: boolean;
      let hasPopperEscaped: boolean;

      if (modifiersData.hide) {
        isReferenceHidden = modifiersData.hide.isReferenceHidden;
        hasPopperEscaped = modifiersData.hide.hasPopperEscaped;
      }

      this.setState({
        placement,
        styles,
        isReferenceHidden,
        hasPopperEscaped,
      });
    },
  };

  getOptions = () => ({
    placement: this.props.placement,
    strategy: this.props.strategy,
    modifiers: [
      ...this.props.modifiers,
      {
        name: 'arrow',
        enabled: !!this.arrowNode,
        options: {
          element: this.arrowNode,
        },
      },
      {
        name: 'applyStyles',
        enabled: false
      },
      this.updateStateModifier,
    ],
    onFirstUpdate: this.props.onFirstUpdate
  });

  getPopperStyle = () =>
    !this.popperNode || !this.state.styles
      ? initialPopperStyle
      : this.state.styles.popper;

  getArrowStyle = () =>
    !this.arrowNode || !this.state.styles
      ? initialArrowStyle
      : this.state.styles.arrow;

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

    this.popperInstance = createPopper(
      referenceElement,
      popperNode,
      this.getOptions()
    );
  };

  update = () => {
    if (this.popperInstance) {
      return this.popperInstance.update();
    } else {
      return Promise.resolve(null);
    }
  };

  componentDidUpdate(prevProps: PopperProps, prevState: PopperState) {
    // If the Popper.js reference element has changed, update the instance (destroy + create)
    if (this.props.referenceElement !== prevProps.referenceElement) {
      this.updatePopperInstance();
    }

    // If the Popper.js options have changed, set options
    if (
      this.props.placement !== prevProps.placement ||
      this.props.strategy !== prevProps.strategy ||
      !deepEqual(this.props.modifiers, prevProps.modifiers, {strict: true})
    ) {

      // develop only check that modifiers isn't being updated needlessly
      if (process.env.NODE_ENV === "development") {
        if (
          this.props.modifiers !== prevProps.modifiers &&
          this.props.modifiers != null &&
          prevProps.modifiers != null &&
          shallowEqual(this.props.modifiers, prevProps.modifiers)
        ) {
          console.warn("'modifiers' prop reference updated even though all values appear the same.\nConsider memoizing the 'modifiers' object to avoid needless rendering.");
        }
      }

      if (this.popperInstance) {
        this.popperInstance.setOptions(this.getOptions())
      }
    }

    // A placement difference in state means popper determined a new placement
    // apart from the props value. By the time the popper element is rendered with
    // the new position Popper has already measured it, if the place change triggers
    // a size change it will result in a misaligned popper. So we schedule an update to be sure.
    if (prevState.placement !== this.state.placement) {
      this.update();
    }
  }

  componentWillUnmount() {
    setRef(this.props.innerRef, null)
    this.destroyPopperInstance();
  }

  render() {
    const { placement, isReferenceHidden, hasPopperEscaped } = this.state;

    return unwrapArray(this.props.children)({
      ref: this.setPopperNode,
      style: this.getPopperStyle(),
      placement,
      isReferenceHidden,
      hasPopperEscaped,
      update: this.update,
      arrowProps: {
        ref: this.setArrowNode,
        style: this.getArrowStyle(),
      },
    });
  }
}

export default function Popper({ referenceElement, ...props }: PopperProps) {
  return (
    <ManagerReferenceNodeContext.Consumer>
      {(referenceNode) => (
        <InnerPopper
          referenceElement={
            referenceElement !== undefined ? referenceElement : referenceNode
          }
          {...props}
        />
      )}
    </ManagerReferenceNodeContext.Consumer>
  );
}
