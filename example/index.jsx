import React, { Component, PropTypes, Children, createElement } from 'react'
import ReactDOM, { findDOMNode } from 'react-dom'
import { PopperManager, Target, Popper, Arrow } from '../src/react-popper'
import { placements } from 'popper.js'

import './main.scss'

class App extends Component {
  state = {
    placement: 'bottom'
  }

  render() {
    const { placement } = this.state
    return (
      <div
        style={{
          padding: 200
        }}
      >
        <select
          value={placement}
          onChange={e =>
            this.setState({ placement: e.target.value })
          }
        >
          {placements.map(placement =>
            <option key={placement} value={placement}>
              {placement}
            </option>
          )}
        </select>
        <PopperManager>
          <Target style={{ width: 120, height: 120, background: 'red' }}>
            Box
          </Target>
          <Popper placement="left">
            Content Left
            <Arrow/>
          </Popper>
          <Popper placement="right">
            Content Right
            <Arrow/>
          </Popper>
          <Popper placement={placement}>
            Dynamic Content
            <Arrow/>
          </Popper>
        </PopperManager>
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('app'))
