import React from 'react'
import ReactDOM from 'react-dom'

import MultipleExample from './multiple'
import AnimatedExample from './animated'
import ModifiersExample from './modifiers'
import ToggleableExample from './toggleable'
import StandaloneExample from './standalone'
import StandaloneObjectExample from './standaloneObject'

import './main.css'

const App = () => (
  <div style={{ padding: 200 }}>
    <div style={{ marginBottom: 200 }}>
      <MultipleExample />
    </div>
    <div style={{ marginBottom: 200 }}>
      <AnimatedExample />
    </div>
    <div style={{ marginBottom: 200 }}>
      <ModifiersExample />
    </div>
    <div style={{ marginBottom: 200 }}>
      <ToggleableExample />
    </div>
    <div style={{ marginBottom: 200 }}>
      <StandaloneExample />
    </div>
    <div style={{ marginBottom: 200 }}>
      <StandaloneObjectExample />
    </div>
  </div>
)

ReactDOM.render(<App />, document.getElementById('app'))
