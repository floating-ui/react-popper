## React Popper

[![npm version](https://img.shields.io/npm/v/react-popper.svg)](https://www.npmjs.com/package/react-popper)
[![npm downloads](https://img.shields.io/npm/dm/react-popper.svg)](https://www.npmjs.com/package/react-popper)
[![Dependency Status](https://david-dm.org/souporserious/react-popper.svg)](https://david-dm.org/souporserious/react-popper)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

React wrapper around [PopperJS](https://github.com/FezVrasta/popper.js/).

## Install

Via package managers:

```bash
npm install react-popper --save
# or
yarn add react-popper
```

Via `script` tag (UMD library exposed as `ReactPopper`):

```html
<script src="https://unpkg.com/react-popper/dist/react-popper.js"></script>
```

## Usage

Example:

```jsx
import Popper from 'react-popper';

const Example = () => (
  <Popper placement="right">
    {({ referenceProps, popperProps, arrowProps }) => (
      <>
        <button type="button" ref={referenceProps.getRef}>
          Reference element
        </button>
        <div
          ref={popperProps.getRef}
          style={popperProps.style}
          data-placement={popperProps.placement}
        >
          Popper element
          <div ref={arrowProps.getRef} style={arrowProps.style} />
        </div>
      </>
    )}
  </Popper>
);
```

`react-popper` makes use of a React pattern called **"render prop"**, if you are not
familiar with it, please read more [on the official React documentation](https://reactjs.org/docs/render-props.html).

### API documentation

The `Popper` component accepts the properties `children`, `placement`, `modifiers`, and `eventsEneabled`.

```jsx
<Popper
  placement="right"
  modifiers={{ preventOverflow: { enabled: false } }}
  eventsEnabled={true}
>
    { props => [...] }
</Popper>
```

##### `children`

```js
children: ({|
  referenceProps: {
    getRef: (?HTMLElement) => void,
  },
  popperProps: {
    getRef: (?HTMLElement) => void,
    style: { [string]: string | number },
    placement: ?Placement,
  },
  arrowProps: {
    getRef: (?HTMLElement) => void,
    style: { [string]: string | number },
    placement: ?Placement,
  },
|}) => Node
```

A function (render prop) that takes as argument an object containing the properties
`referenceProps`, `popperProps`, and `arrowProps`.

These 3 properties are objects, each of them containing a `getRef` property that is going to be used to retrieve the [React refs](https://reactjs.org/docs/refs-and-the-dom.html) of the 3 components needed by `react-popper`: the **reference**, **popper**, and **arrow**.

`popperProps` and `arrowProps`, additionally, provide a `style` property, which contains the CSS styles (React CSS properties) computed by Popper.js and needed to style the **popper** and **arrow** components so that they get positioned in the desired way. These styles should be applied to your React component usingthe `style` prop or with any CSS-in-JS library of your choice.

They also provide a convenience property called `placement` that is going to describe the placement of your popper after Popper.js has applied all the modifiers that may have flipped or altered the originally provided `placement` property. You can use this to alter the style of the popper and or of the arrow according to the definitive placement. For instance, you can use this property to orient the arrow on the right direction.

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

## Usage without a reference `HTMLElement`

Whenever you need to position a popper based on some arbitrary coordinates, you can provide `Popper` with a `referenceElement` property that is going to be used in place of the `referenceProps.getRef` React ref.

The `referenceElement` property must be an object with an interface compatible with an `HTMLElement` as described in the [Popper.js referenceObject documentation](https://popper.js.org/popper-documentation.html#referenceObject), this implies that you may also provide a real HTMLElement if needed.

If `referenceElement` is defined, it will take precedence over any `referenceProps.getRef` provied refs.

```jsx
import Popper from 'react-popper';

class VirtualReference {
  getBoundingClientRect() {
    return {
      top: 10,
      left: 10,
      bottom: 20,
      right: 100,
      width: 90,
      height: 10,
    };
  }

  get clientWidth() {
    return this.getBoundingClientRect().width;
  }

  get clientHeight() {
    return this.getBoundingClientRect().height;
  }
}

// This is going to create a virtual reference element
// positioned 10px from top and left of the document
// 90px wide and 10px high
const virtualReferenceElement = new VirtualReference();

// This popper will be positioned relatively to the
// virtual reference element defined above
const Example = () => (
  <Popper referenceElement={virtualReferenceElement}>
    {({ popperProps, arrowProps }) => (
      <div
        ref={popperProps.getRef}
        style={popperProps.style}
        data-placement={popperProps.placement}
      >
        Popper element
        <div ref={arrowProps.getRef} style={arrowProps.style} />
      </div>
    )}
  </Popper>
);
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
