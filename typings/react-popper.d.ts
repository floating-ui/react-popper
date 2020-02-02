import * as React from "react";
import * as PopperJS from "@popperjs/core";

interface ManagerProps {
  children: React.ReactNode;
}
export class Manager extends React.Component<ManagerProps, {}> { }

interface ReferenceChildrenProps {
  // React refs are supposed to be contravariant (allows a more general type to be passed rather than a more specific one)
  // However, Typescript currently can't infer that fact for refs
  // See https://github.com/microsoft/TypeScript/issues/30748 for more information
  ref: React.Ref<any>;
}

interface ReferenceProps {
  children: (props: ReferenceChildrenProps) => React.ReactNode;
  innerRef?: React.Ref<any>;
}
export class Reference extends React.Component<ReferenceProps, {}> { }

export interface PopperArrowProps {
  ref: React.Ref<any>;
  style: React.CSSProperties;
}

export interface PopperChildrenProps {
  ref: React.Ref<any>;
  style: React.CSSProperties;

  placement: PopperJS.Placement;
  isReferenceHidden?: boolean,
  hasPopperEscaped?: boolean,

  update: () => Promise<null | Partial<PopperJS.State>>;
  arrowProps: PopperArrowProps;
}

export interface PopperProps {
  children: (props: PopperChildrenProps) => React.ReactNode;
  innerRef?: React.Ref<any>;
  modifiers?: Array<Partial<PopperJS.Modifier<any>>>;
  placement?: PopperJS.Placement;
  strategy?: PopperJS.PositioningStrategy;
  referenceElement?: HTMLElement | PopperJS.VirtualElement | null;
  onFirstUpdate?: (state: Partial<PopperJS.State>) => void
}
export class Popper extends React.Component<PopperProps, {}> { }
