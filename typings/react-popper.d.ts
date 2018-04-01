import * as React from "react";
import * as PopperJS from "popper.js";

interface PopperProps {
  modifiers?: PopperJS.Modifiers;
  placement?: PopperJS.Placement;
  eventsEnabled?: boolean;
  children: (props: ({
    referenceProps: {
      getRef: (ref: HTMLElement | null) => void,
    },
    popperProps: {
      getRef: (ref: HTMLElement | null) => void,
      style: React.CSSProperties,
      placement: ?PopperJS.Placement,
    },
    arrowProps: {
      getRef: (ref: HTMLElement | null) => void,
      style: React.CSSProperties,
      placement: ?PopperJS.Placement,
    },
  })) => React.ReactNode;
}

export default class Popper extends React.Component<PopperProps, {}> { }
