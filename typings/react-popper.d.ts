import * as React from "react";
import * as PopperJS from "popper.js";

interface ManagerProps {
  children: React.ReactNode;
}
export class Manager extends React.Component<ManagerProps, {}> { }

interface ReferenceProps {
  children: (props: ({
    ref: (ref: HTMLElement | null) => void,
  })) => React.ReactNode;
}
export class Reference extends React.Component<ReferenceProps, {}> { }

interface PopperProps {
  modifiers?: PopperJS.Modifiers;
  placement?: PopperJS.Placement;
  eventsEnabled?: boolean;
  children: (props: ({
    ref: (ref: HTMLElement | null) => void,
    style: React.CSSProperties,
    placement: ?PopperJS.Placement,
    scheduleUpdate: () => void,
    arrowProps: {
      ref: (ref: HTMLElement | null) => void,
      style: React.CSSProperties,
    },
  })) => React.ReactNode;
}
export class Popper extends React.Component<PopperProps, {}> { }
