## React Popper

[![npm version](https://img.shields.io/npm/v/react-popper.svg)](https://www.npmjs.com/package/react-popper)
[![npm downloads](https://img.shields.io/npm/dm/react-popper.svg)](https://www.npmjs.com/package/react-popper)
[![Dependency Status](https://david-dm.org/souporserious/react-popper.svg)](https://david-dm.org/souporserious/react-popper)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

React wrapper around [PopperJS](https://github.com/FezVrasta/popper.js/).

## Install

`npm install react-popper --save` or `yarn add react-popper`

```html
<script src="https://unpkg.com/react-popper/dist/react-popper.js"></script>
(UMD library exposed as `ReactPopper`)
```

## Usage

Example:

```jsx
import { Manager, Target, Popper, Arrow } from 'react-popper';

const Example = () => (
  <Manager>
    <Target>
      {({ getTargetRef }) => (
        <button ref={getTargetRef} className="target">
          Target box
        </button>
      )}
    </Target>
    <Popper placement="right">
      {({ getPopperRef, style, placement }) => (
        <div
          ref={getPopperRef}
          style={style}
          data-placement={placement}
          className="popper"
        >
          Positioned on the right of Target
          <Arrow>
            {({ getArrowRef, style }) => (
              <div ref={getArrowRef} style={style} className="arrow" />
            )}
          </Arrow>
        </div>
      )}
    </Popper>
  </Manager>
);
```

`react-popper` makes use of a React pattern called **"render props"**, if you are not
familiar with them, please read more [on the official React documentation](https://reactjs.org/docs/render-props.html).

### `Manager`

The `Manager` component allows the `Target` and `Popper` components to communicate.  
Each of them can contain only one `Target`, and as many `Popper` as you'd like.

All the `Popper` components will be positioned relatively to the `Target` component.

> **React 14 and 15 be aware!** You need to wrap your `Popper` and `Target` components
> into a single `div` if you want this library to work on these versions.

### `Target`

The `Target` component takes `children` as only property. `children` must
be a function that takes an object as only argument. The object contains a property called
`getTargetRef` that must be assigned to the `ref` property of the HTML element you are going
to use as target element.

```jsx
<Target>
  {targetProps => <button ref={targetProps.getTargetRef}>Target</button>}
</Target>
```

### `Popper`

The `Popper` component accepts the properties `children`, `placement`, `modifiers`, and `eventsEneabled`.

```jsx
<Popper
  placement="right"
  modifiers={{ preventOverflow: { enabled: false } }}
  eventsEnabled={true}
>
  ({getPopperRef})
</Popper>
```

##### `children`

```js
children: ({|
  getPopperRef: (?HTMLElement) => void,
  style: { [string]: string | number },
  placement: ?string,
|}) => Node;
```

A function (render prop) that takes as argument an object containing the properties
`getPopperRef`, `placement`, and `style`.

* `getPopperRef` must be assigned to the `ref` property of the HTML element
  you are going to use as popper;

* `placement` matches with the current Popper.js placement applied to the popper element,
  it may differ from the one you specified in case it has been altered by any of the
  Popper.js modifiers (like the `flip` modifier);

* `style` is a list of CSS properties that define the styles needed to position the
  popper correctly according to its target element;

##### `placement`

```js
placement?: PopperJS$Placement;
```

One of the accepted placement values listed in the [Popper.js documentation](https://popper.js.org/popper-documentation.html#Popper.placements).  
Your popper is going to be placed according to the value of this property.  
Defaults to `bottom`.

##### `eventsEnabled`

```js
eventsEnabled?: boolean;
```

Tells `react-popper` to enable or disable the [Popper.js event listeners](https://popper.js.org/popper-documentation.html#Popper.Defaults.eventsEnabled). `true` by default.

##### `modifiers`

```js
modifiers?: {
  [string]: { order: number, enabled: boolean, fn: Object => Object },
};
```

An object containing custom settings for the [Popper.js modifiers](https://popper.js.org/popper-documentation.html#modifiers).  
You can use this property to override their settings or to inject your custom ones.

### `Arrow`

The `Arrow` component can be used to position an arrow on your popper element.  
This component must be child of a `Popper` component.

The component takes `children` as only property, and it expects it to be a function
that takes as only argument an object containing the following properties:

* `getArrowRef` must be assigned to the ref property of the HTML element you are going to use as arrow;
* `style` is a list of CSS properties that define the styles needed to position
  the arrow correctly according to its parent popper;

## Usage without Manager

It's generally easiest to let the `Manager` and `Target` components handle passing the target DOM element to the `Popper` component. However, you can pass a target [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) or a [referenceObject](https://popper.js.org/popper-documentation.html#referenceObject) directly into `Popper` if you need to.

Handling DOM Elements from React can be complicated. The `Manager` and `Target` components handle these complexities for you, so their use is strongly recommended when using DOM Elements.

```js
import { PureComonent } from 'react'
import { Popper, Arrow } from 'react-popper'

class StandaloneExample extends PureComponent {
  state = {
    isOpen: false,
  }

  handleClick() = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen
    }))
  }

  render() {
    return (
      <div>
        <div
          ref={(div) => this.target = div}
          style={{ width: 120, height: 120, background: '#b4da55' }}
          onClick={this.handleClick}
        >
          Click {this.state.isOpen ? 'to hide' : 'to show'} popper
        </div>
        {this.state.isOpen && (
          <Popper className="popper" target={this.target}>
            Popper Content
            <Arrow className="popper__arrow"/>
          </Popper>
        )}
      </div>
    )
  }
}
```

## Running Locally

#### clone repo

`git clone git@github.com:souporserious/react-popper.git`

#### move into folder

`cd ~/react-popper`

#### install dependencies

`npm install` or `yarn`

#### run dev mode

`npm run dev` or `yarn dev`

#### open your browser and visit:

`http://localhost:8080/`
