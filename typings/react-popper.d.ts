import * as React from "react";
import * as PopperJS from "popper.js";

interface ManagerProps {
  children: React.ReactNode
}
export class Manager extends React.Component<ManagerProps, {}> { }

interface TargetProps {
  children: (props: ({
    getTargetRef: (ref: HTMLElement) => void;
  })) => React.ReactNode;
}
export const Target: React.SFC<TargetProps>;

interface PopperProps {
  modifiers?: PopperJS.Modifiers;
  placement?: PopperJS.Placement;
  eventsEnabled?: boolean;
  children: (props: ({
    getPopperRef: (ref: HTMLElement) => void,
    style: React.CSSProperties,
    placement: ?PopperJS.Placement,
  })) => React.ReactNode;
}
export class Popper extends React.Component<PopperProps, {}> { }

interface ArrowProps {
  children: (props: ({
    getArrowRef: (ref: HTMLElement) => void;
    style: React.CSSProperties;
  })) => React.ReactNode;
}
export const Arrow: React.SFC<ArrowProps>;
