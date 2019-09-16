import * as React from "react";
import * as PopperJS from "popper.js";

interface ManagerProps {
  children: React.ReactNode;
}
export class Manager extends React.Component<ManagerProps, {}> { }

interface ReferenceChildrenProps {
  ref: React.Ref<HTMLElement | SVGElement | null>;
}

interface ReferenceProps {
  children: (props: ReferenceChildrenProps) => React.ReactNode;
  innerRef?: React.Ref<HTMLElement | SVGElement | null>;
}
export class Reference extends React.Component<ReferenceProps, {}> { }

export interface PopperArrowProps {
  ref: React.Ref<HTMLElement | SVGElement | null>;
  style: React.CSSProperties;
}

export interface PopperChildrenProps {
  arrowProps: PopperArrowProps;
  outOfBoundaries: boolean | null;
  placement: PopperJS.Placement;
  ref: React.Ref<HTMLElement | SVGElement | null>;
  scheduleUpdate: () => void;
  style: React.CSSProperties;
}

export interface PopperProps {
  children: (props: PopperChildrenProps) => React.ReactNode;
  eventsEnabled?: boolean;
  innerRef?: React.Ref<HTMLElement | SVGElement | null>;
  modifiers?: PopperJS.Modifiers;
  placement?: PopperJS.Placement;
  positionFixed?: boolean;
  referenceElement?: PopperJS.ReferenceObject;
}
export class Popper extends React.Component<PopperProps, {}> { }
