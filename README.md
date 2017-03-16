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

## `Common Props`

`Target`, `Popper`, and `Arrow` all share the following props

#### `component`: PropTypes.any

The component that gets rendered.


## `Manager`

This is a special component that provides the `Target` component to the `Popper` component. Pass any props as you normally would here.

## `Target`

This is just a simple component that subscribes to `PopperManager`, so `Popper` can make use of it. Again, pass any props as you normally would here.

## `Popper`

Your popper that gets attached to the `Target` component.

#### `placement`: PropTypes.oneOf(Popper.placements)
#### `eventsEnabled`: PropTypes.bool
#### `modifiers`: PropTypes.object

Passes respective options to a new [Popper instance](https://github.com/FezVrasta/popper.js/blob/master/docs/_includes/popper-documentation.md#new-popperreference-popper-options). As for `onCreate` and `onUpdate`, these callbacks were intentionally left out in favor of using the [component lifecycle methods](https://facebook.github.io/react/docs/react-component.html#the-component-lifecycle). If you have a good use case for these please feel free to file and issue and I will consider adding them in.

## `Arrow`

Another component that subscribes to the `Popper` component as an [arrow modifier](https://github.com/FezVrasta/popper.js/blob/master/docs/_includes/popper-documentation.md#Modifiers.arrow). Must be a child of `Popper`.

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
