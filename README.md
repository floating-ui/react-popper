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

`react-popper` makes use of a React pattern called **"render prop"**, if you are not
familiar with it, please read more [on the official React documentation](https://reactjs.org/docs/render-props.html).

### API documentation

The `Manager` component is a simple wrapper that needs to surround all the other `react-popper` components in order
to make them communicate with each others.

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
  ref: (?HTMLElement) => void,
  style: { [string]: string | number },
  placement: ?Placement,
  arrowProps: {
    ref: (?HTMLElement) => void,
    style: { [string]: string | number },
  },
|}) => Node
```

A function (render prop) that takes as argument an object containing the properties
`ref`, `style`, 'placement`, and`arrowProps`.

The first 3 properties are the `ref` property that is going to be used to retrieve the [React refs](https://reactjs.org/docs/refs-and-the-dom.html) of the **popper** element, the `style` property,
which contains the CSS styles (React CSS properties) computed by Popper.js and needed to style
the **popper** element so that it gets positioned in the desired way.  
These styles should be applied to your React component using the `style` prop or with any CSS-in-JS
library of your choice.

The `placement` property describes the placement of your popper after Popper.js has applied all the modifiers
that may have flipped or altered the originally provided `placement` property. You can use this to alter the
style of the popper and or of the arrow according to the definitive placement. For instance, you can use this
property to orient the arrow to the right direction.

The `arrowProps` argument is an object, containing a `style` and `ref` properties that are identical to the
ones provided as first and second argument of `children`, but are relative to the **arrow** element rather than
the popper. Use them to, accordingly, retrieve the ref of the **arrow** element and style it.

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
modifiers?: PopperJS$Modifiers};
```

An object containing custom settings for the [Popper.js modifiers](https://popper.js.org/popper-documentation.html#modifiers).  
You can use this property to override their settings or to inject your custom ones.

## Usage without a reference `HTMLElement`

Whenever you need to position a popper based on some arbitrary coordinates, you can provide `Popper` with a `referenceElement` property that is going to be used in place of the `referenceProps.getRef` React ref.

The `referenceElement` property must be an object with an interface compatible with an `HTMLElement` as described in the [Popper.js referenceObject documentation](https://popper.js.org/popper-documentation.html#referenceObject), this implies that you may also provide a real HTMLElement if needed.

If `referenceElement` is defined, it will take precedence over any `referenceProps.ref` provided refs.

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
    {({ ref, style, placement, arrowProps }) => (
      <div ref={ref} style={style} data-placement={placement}>
        Popper element
        <div ref={arrowProps.ref} style={arrowProps.style} />
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

`npm run demo` or `yarn demo`

#### open your browser and visit:

`http://localhost:1234/`
