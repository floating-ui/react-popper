## React Popper

[![npm version](https://badge.fury.io/js/react-popper.svg)](https://badge.fury.io/js/react-popper)
[![Dependency Status](https://david-dm.org/souporserious/react-popper.svg)](https://david-dm.org/souporserious/react-popper)

React wrapper around [PopperJS](https://github.com/FezVrasta/popper.js/).

## Install

`npm install react-popper --save`

```html
<script src="https://unpkg.com/react-popper/dist/react-popper.js"></script>
(UMD library exposed as `ReactPopper`)
```

## Usage

```js
import { Manager, Target, Popper, Arrow } from 'react-popper'

const PopperExample = () => (
  <Manager>
    <Target style={{ width: 120, height: 120, background: '#b4da55' }}>
      Target Box
    </Target>
    <Popper placement="left" className="popper">
      Left Content
      <Arrow className="popper__arrow"/>
    </Popper>
    <Popper placement="right" className="popper">
      Right Content
      <Arrow className="popper__arrow"/>
    </Popper>
  </Manager>
)
```

## Usage w/ child function

This is a useful way to interact with custom components. Just make sure you pass down the refs properly.

```js
import { Manager, Target, Popper, Arrow } from 'react-popper'

const PopperExample = () => (
  <Manager>
    <Target>
      {({ targetRef }) => (
        <div ref={targetRef}>
          Target Box
        </div>
      )}
    </Target>
    <Popper placement="left">
      {({ popperRef, popperStyle, popperPlacement }) => (
        <div
          ref={popperRef}
          className="popper"
          style={popperStyle}
          data-placement={popperPlacement}
        >
          Popper Content
          <Arrow>
            {({ arrowRef, arrowStyle }) => (
              <span
                ref={arrowRef}
                className="popper__arrow"
                style={arrowStyle}
              />
            )}
          </Arrow>
        </div>
      )}
    </Popper>
  </Manager>
)
```

## `Shared Props`

`Manager`, `Target`, `Popper`, and `Arrow` all share the following props

#### `tag`: PropTypes.string

A valid DOM tag to render. Some components allow rendering just children or a child function making this prop obsolete.

#### `innerRef`: PropTypes.func

Use this prop to access the internal ref. Does not apply to the `Manager` component since we do not interact with its ref.

## `Manager`

This is a special component that provides the `Target` component to the `Popper` component. Pass any props as you normally would here.

The `tag` prop can be set to `false` to allow just passing children through. This can be useful when composing other components.

## `Target`

This is just a simple component that subscribes to `PopperManager`, so `Popper` can make use of it. Again, pass any props as you normally would here.

Each `Target` must be wrapped in a `Manager`, and each `Manager` can wrap only one `Target`.

#### `children`: PropTypes.oneOfType([PropTypes.node, PropTypes.func])

A `Target`'s child may be one of the following:

- a React element[s]
- a function accepting the following object (all props must be passed down in order for the PopperJS to work properly)

  ```js
  {
    targetRef, // a function that accepts the target component as an argument
  }
  ```


## `Popper`

Your popper that gets attached to the `Target` component.

Each `Popper` must be wrapped in a `Manager`, and each `Manager` can wrap multiple `Popper` components.

#### `placement`: PropTypes.oneOf(Popper.placements)
#### `eventsEnabled`: PropTypes.bool
#### `modifiers`: PropTypes.object

Passes respective options to a new [Popper instance](https://github.com/FezVrasta/popper.js/blob/master/docs/_includes/popper-documentation.md#new-popperreference-popper-options). As for `onCreate` and `onUpdate`, these callbacks were intentionally left out in favor of using the [component lifecycle methods](https://facebook.github.io/react/docs/react-component.html#the-component-lifecycle). If you have a good use case for these please feel free to file and issue and I will consider adding them in.

#### `children`: PropTypes.oneOfType([PropTypes.node, PropTypes.func])

A `Popper`'s child may be one of the following:

- a React element[s]
- a function accepting the following object (all props must be passed down in order for the PopperJS to work properly)

  ```js
  {
    popperRef, // a function that accepts the popper component as an argument
    popperStyle, // the styles to apply to the popper element
    popperPlacement // the placement of the Popper, pass to data-placement
  }
  ```

## `Arrow`

Another component that subscribes to the `Popper` component as an [arrow modifier](https://github.com/FezVrasta/popper.js/blob/master/docs/_includes/popper-documentation.md#Modifiers.arrow). Must be a child of `Popper`.

#### `children`: PropTypes.oneOfType([PropTypes.node, PropTypes.func])

An `Arrow`'s child may be one of the following:

- a React element[s]
- a function accepting the following object (all props must be passed down in order for the PopperJS to work properly)

  ```js
  {
    arrowRef, // a function that accepts the arrow component as an argument
    arrowStyle // the styles to apply to the arrow element
  }
  ```


## Running Locally

clone repo

`git clone git@github.com:souporserious/react-popper.git`

move into folder

`cd ~/react-popper`

install dependencies

`npm install`

run dev mode

`npm run dev`

open your browser and visit: `http://localhost:8080/`
