import React, { Component, Children, createElement } from 'react'
import PropTypes from 'prop-types'
import ReactDOM, { findDOMNode } from 'react-dom'
import { Manager, Target, Popper, Arrow } from '../src/react-popper'
import { placements } from 'popper.js'
import Portal from 'react-travel'

import './main.scss'

const modifiers = {
  customStyle: {
    enabled: true,
    function: data => {
      data.styles = {
        ...data.styles,
        background: 'red',
      }
      return data
    },
  },
}

class App extends Component {
  state = {
    placement: 'bottom',
  }

  render() {
    const { placement } = this.state
    return (
      <div
        style={{
          padding: 200,
        }}
      >
        <select
          value={placement}
          onChange={e => this.setState({ placement: e.target.value })}
        >
          {placements.map(placement => (
            <option key={placement} value={placement}>
              {placement}
            </option>
          ))}
        </select>
        <Manager>
          <Target style={{ width: 120, height: 120, background: 'red' }}>
            Box
          </Target>
          <Popper placement="left">
            Content Left
            <Arrow />
          </Popper>
          <Popper placement="right">
            Content Right
            <Arrow />
          </Popper>
          <Portal>
            <Popper placement={placement} modifiers={modifiers}>
              Dynamic Content in a Portal!
              <Arrow />
            </Popper>
          </Portal>
        </Manager>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
