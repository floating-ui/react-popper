## React Popper

[![npm version](https://badge.fury.io/js/react-popper.svg)](https://badge.fury.io/js/react-popper)
[![Dependency Status](https://david-dm.org/souporserious/react-popper.svg)](https://david-dm.org/souporserious/react-popper)

React wrapper around [PopperJS](https://github.com/FezVrasta/popper.js/).

## Usage

```js
import { PopperManager, Target, Popper, Arrow } from 'react-popper'

const PopperExample = () => (
  <PopperManager placement="bottom">
    <Target style={{ width: 120, height: 120, background: '#b4da55' }}>
      Target Box
    </Target>
    <Popper className="popper">
      Popper Content
      <Arrow className="popper__arrow"/>
    </Popper>
  </PopperManager>
)
```

## Install

`npm install react-popper --save`

```html
<script src="https://unpkg.com/react-popper/dist/react-popper.js"></script>
(UMD library exposed as `ReactPopper`)
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
