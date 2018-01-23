import React, { Component, PureComponent, Children, createElement } from 'react'
import ReactDOM, { findDOMNode } from 'react-dom'
import PropTypes from 'prop-types'
import { VelocityTransitionGroup } from 'velocity-react'
import Transition from 'react-motion-ui-pack'
import { Manager, Target, Popper, Arrow } from '../src/react-popper'
import PopperJS from 'popper.js'
import Portal from 'react-travel'
import outy from 'outy'
import MultipleExample from './multiple'
import AnimatedExample from './animated'
import ModifiersExample from './modifiers'

import './main.scss'

const App = () => (
  <div
    style={{
      padding: 200,
    }}
  >
    <div style={{ marginBottom: 200 }}>
      <MultipleExample />
    </div>
    <div style={{ marginBottom: 200 }}>
      <AnimatedExample />
    </div>
    <div style={{ marginBottom: 200 }}>
      <ModifiersExample />
    </div>
  </div>
)
ReactDOM.render(<App />, document.getElementById('app'))
