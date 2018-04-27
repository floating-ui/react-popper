import * as React from "react";
import * as PopperJS from "popper.js";

interface ManagerProps {
    children: React.ReactNode;
}
export class Manager extends React.Component<ManagerProps, {}> { }

interface RefProps {
    ref: (ref: HTMLElement | null) => void;
}

interface ReferenceProps {
    children: (props: RefProps) => React.ReactNode;
}
export class Reference extends React.Component<ReferenceProps, {}> { }

interface ArrowProps extends RefProps {
    style: React.CSSProperties;
}

interface PopperChildrenProps extends RefProps {
    arrowProps: ArrowProps
    placement: PopperJS.Placement;
    scheduleUpdate: () => void;
    style: React.CSSProperties;
}

interface PopperProps {
    children: (props: PopperChildrenProps) => React.ReactNode;
    eventsEnabled?: boolean;
    modifiers?: PopperJS.Modifiers;
    placement?: PopperJS.Placement;
    positionFixed?: boolean;
}
export class Popper extends React.Component<PopperProps, {}> { }
