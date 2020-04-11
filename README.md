# React Popper

[![Build Status](https://travis-ci.org/popperjs/react-popper.svg?branch=master)](https://travis-ci.org/popperjs/react-popper)
[![npm version](https://img.shields.io/npm/v/react-popper.svg)](https://www.npmjs.com/package/react-popper)
[![npm downloads](https://img.shields.io/npm/dm/react-popper.svg)](https://www.npmjs.com/package/react-popper)
[![Dependency Status](https://david-dm.org/souporserious/react-popper.svg)](https://david-dm.org/souporserious/react-popper)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Get support or discuss](https://img.shields.io/badge/chat-on_spectrum-6833F9.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyBpZD0iTGl2ZWxsb18xIiBkYXRhLW5hbWU9IkxpdmVsbG8gMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTAgOCI%2BPGRlZnM%2BPHN0eWxlPi5jbHMtMXtmaWxsOiNmZmY7fTwvc3R5bGU%2BPC9kZWZzPjx0aXRsZT5zcGVjdHJ1bTwvdGl0bGU%2BPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNSwwQy40MiwwLDAsLjYzLDAsMy4zNGMwLDEuODQuMTksMi43MiwxLjc0LDMuMWgwVjcuNThhLjQ0LjQ0LDAsMCwwLC42OC4zNUw0LjM1LDYuNjlINWM0LjU4LDAsNS0uNjMsNS0zLjM1UzkuNTgsMCw1LDBaTTIuODMsNC4xOGEuNjMuNjMsMCwxLDEsLjY1LS42M0EuNjQuNjQsMCwwLDEsMi44Myw0LjE4Wk01LDQuMThhLjYzLjYzLDAsMSwxLC42NS0uNjNBLjY0LjY0LDAsMCwxLDUsNC4xOFptMi4xNywwYS42My42MywwLDEsMSwuNjUtLjYzQS42NC42NCwwLDAsMSw3LjE3LDQuMThaIi8%2BPC9zdmc%2B)](https://spectrum.chat/popper-js/react-popper)

React wrapper around [Popper](https://popper.js.org).

**important note:** Popper is **not** a tooltip library, it's a _positioning
engine_ to be used to build features such as (but not restricted to) tooltips.

## Install

Via package managers:

```bash
# With npm
npm i react-popper @popperjs/core

# With Yarn
yarn add react-popper @popperjs/core
```

**Note:** `@popperjs/core` must be installed in your project in order for
`react-popper` to work.

Via `script` tag (UMD library exposed as `ReactPopper`):

```html
<script src="https://unpkg.com/react-popper/dist/index.umd.js"></script>
```

## Usage

> Using `react-popper@0.x`? You can find its documentation
> [clicking here](https://github.com/souporserious/react-popper/tree/v0.x)

`react-popper` provides two different APIs to help consume it:

### 1. React Hooks (recommended)

The `usePopper` hook can be used to quickly initialize a Popper, it requires a
basic understanding of how the
[React Hooks](https://reactjs.org/docs/hooks-overview.html) work.

```jsx
import { usePopper } from 'react-popper';

const Example = () => {
  const [referenceElement, setReferenceElement] = React.useState(null);
  const [popperElement, setPopperElement] = React.useState(null);
  const [arrowElement, setArrowElement] = React.useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: 'arrow', options: { element: arrowElement } }],
  });

  return (
    <>
      <button type="button" ref={setReferenceElement}>
        Reference element
      </button>

      <div ref={setPopperElement} style={styles.popper} {...attributes.popper}>
        Popper element
        <div ref={setArrowElement} style={styles.arrow} />
      </div>
    </>
  );
};
```

### 2. Render Props (legacy)

This is a legacy API for compatibility with v1.x users moving to Popper v2. We recommend using the `usePopper` Hook in new code.

<details>
<summary>View details</summary>

The `Manager`, `Reference` and `Popper` render-props components offer an
alternative API to initialize a Popper instance, they require a basic
understanding of how the
[React Render Props](https://reactjs.org/docs/render-props.html) work.

```jsx
import { Manager, Reference, Popper } from 'react-popper';

const Example = () => (
  <Manager>
    <Reference>
      {({ ref }) => (
        <button type="button" ref={ref}>
          Reference element
        </button>
      )}
    </Reference>
    <Popper placement="right">
      {({ ref, style, placement, arrowProps }) => (
        <div ref={ref} style={style} data-placement={placement}>
          Popper element
          <div ref={arrowProps.ref} style={arrowProps.style} />
        </div>
      )}
    </Popper>
  </Manager>
);
```

</details>

## API documentation

### `usePopper`

The `usePopper` hook provides an API almost identical to the ones of
[`createPopper`](https://popper.js.org/docs/v2/constructors/#createpopper)
constructor.

Rather than returning a Popper instance, it will return an object containing the
following properties:

##### `styles`

The `styles` property is an object, its properties are `popper`, and `arrow`.
The two properties are a
[`CSSStyleDeclaration` interface](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration)
describing the necessary CSS properties needed to properly position the two
elements.

You can directly assign the value of the two properties to the React `style`
property of your components.

```js
<div style={styles.popper} />
```

##### `attributes`

Similar to `styles`, the `attributes` object lists the `popper` and `arrow` HTML
attributes, by default, only `popper` will hold some attributes (e.g.
`data-popper-placement`), but more generically, any HTML attribute described by
the Popper documentation will be available inside these properties.

The easiest way to consume their values is by destructuring them directly onto
your React component.

```js
<div {...attributes.popper} />
```

##### `update`, `forceUpdate`, and `state`

These properties match the ones described in the
[Popper docs](https://popper.js.org/docs/v2/constructors/#types), the only
difference is that they can be `null` if Popper isn't yet been initialized or
has been destroyed.

### Render Props

This is a legacy API for compatibility with v1.x users moving to Popper v2. We recommend using the `usePopper` Hook in new code.

<details>
<summary>View details</summary>

The `Manager` component is a simple wrapper that needs to surround all the other
`react-popper` components in order to make them communicate with each others.

The `Popper` component accepts the properties `children`, `placement`,
`modifiers` and `strategy`.

```jsx
<Popper
  innerRef={(node) => this.popperNode = node}
  placement="right"
  modifiers={[{ name: 'preventOverflow', enabled: false }]}
  strategy="fixed"
>
    { props => [...] }
</Popper>
```

##### `children`

```js
children: ({|
  ref: (?HTMLElement) => void,
  style: { [string]: string | number },
  placement: ?Placement,
  isReferenceHidden: ?boolean,
  hasPopperEscaped: ?boolean,
  update: () => void,
  forceUpdate: () => void,
  arrowProps: {
    ref: (?HTMLElement) => void,
    style: { [string]: string | number },
  },
|}) => Node
```

A function (render prop) that takes as argument an object containing the
following properties:

- **`ref`**: used to retrieve the
  [React refs](https://reactjs.org/docs/refs-and-the-dom.html) of the **popper**
  element.
- **`style`**: contains the necessary CSS styles (React CSS properties) which
  are computed by Popper.js to correctly position the **popper** element.
- **`placement`**: describes the placement of your popper after Popper.js has
  applied all the modifiers that may have flipped or altered the originally
  provided `placement` property. You can use this to alter the style of the
  popper and or of the arrow according to the definitive placement. For
  instance, you can use this property to orient the arrow to the right
  direction.
- **`isReferenceHidden`**: a boolean signifying the reference element is fully
  clipped and hidden from view.
- **`hasPopperEscaped`**: a boolean signifying the popper escapes the reference
  element's boundary (and so it appears detached).
- **`update`**: a function you can ask Popper to recompute your tooltip's
  position . It will directly call the
  [Popper#update](https://popper.js.org/docs/v2/lifecycle/#manual-update)
  method.
- **`arrowProps`**: an object, containing `style` and `ref` properties that are
  identical to the ones provided as the first and second arguments of
  `children`, but relative to the **arrow** element. The `style` property
  contains `left` and `top` offset values, which are used to center the arrow
  within the popper. These values can be merged with further custom styling and
  positioning. See
  [the demo](https://github.com/FezVrasta/react-popper/blob/8994933c430e48ab62e71495be71e4f440b48a5a/demo/styles.js#L100)
  for an example.

##### `innerRef`

```js
innerRef?: (?HTMLElement) => void
```

Function that can be used to obtain popper reference

##### `placement`

```js
placement?: PopperJS$Placement;
```

One of the accepted placement values listed in the
[Popper.js documentation](https://popper.js.org/popper-documentation.html#Popper.placements).  
Your popper is going to be placed according to the value of this property.  
Defaults to `bottom`.

##### `strategy`

Describes the positioning strategy to use. By default, it is `absolute`, which
in the simplest cases does not require repositioning of the popper. If your
reference element is in a `fixed` container, use the `fixed` strategy.
[Read More](https://popper.js.org/docs/v2/constructors/#strategy)

##### `modifiers`

```js
modifiers?: PopperJS$Modifiers;
```

An object containing custom settings for the
[Popper.js modifiers](https://popper.js.org/docs/v2/modifiers/).  
You can use this property to override their settings or to inject your custom
ones.

</details>

## Usage with `ReactDOM.createPortal`

Popper.js is smart enough to work even if the **popper** and **reference**
elements aren't in the same DOM context.  
This means that you can use
[`ReactDOM.createPortal`](https://reactjs.org/docs/portals.html) (or any pre
React 16 alternative) to move the popper component somewhere else in the DOM.

This can be useful if you want to position a tooltip inside an
`overflow: hidden` container that you want to make overflow.

**Please note that you can also try `strategy: 'fixed'` to obtain a similar
effect with less hassle.**

```jsx
import { usePopper } from 'react-popper';

const Example = () => {
  const [referenceElement, setReferenceElement] = React.useState(null);
  const [popperElement, setPopperElement] = React.useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement);

  return (
    <>
      <button type="button" ref={setReferenceElement}>
        Reference
      </button>
      {ReactDOM.createPortal(
        <div
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          Popper
        </div>,
        document.querySelector('#destination')
      )}
    </>
  );
};
```

## Usage without a reference `HTMLElement`

Whenever you need to position a popper based on some arbitrary coordinates, you
can provide Popper with a [virtual element](https://popper.js.org/docs/v2/virtual-elements/).

```jsx
import { usePopper } from 'react-popper';

// This is going to create a virtual reference element
// positioned 10px from top and left of the document
// 90px wide and 10px high
const virtualReference = {
  getBoundingClientRect() {
    return {
      top: 10,
      left: 10,
      bottom: 20,
      right: 100,
      width: 90,
      height: 10,
    };
  },
};

const Example = () => {
  const [popperElement, setPopperElement] = React.useState(null);
  const { styles, attributes } = usePopper(virtualReference, popperElement);

  return (
    <div ref={setPopperElement} style={styles.popper} {...attributes.popper}>
      Popper element
    </div>
  );
};
```

## Flow and TypeScript types

This library is built with Flow but it supports TypeScript as well.

You can find the exported Flow types in `src/index.js`, and the TypeScript
definitions in `typings/react-popper.d.ts`.

## Running Locally

#### clone repo

`git clone git@github.com:FezVrasta/react-popper.git`

#### move into folder

`cd ~/react-popper`

#### install dependencies

`npm install` or `yarn`

#### run dev mode

`npm run demo:dev` or `yarn demo:dev`

#### open your browser and visit:

`http://localhost:1234/`
