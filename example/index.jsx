import React, { Component, PropTypes, Children, createElement } from 'react'
import ReactDOM, { findDOMNode } from 'react-dom'
import { PopperManager, PopperArrow } from '../src/react-popper'

import './main.scss'

const placements = ['top', 'right', 'bottom', 'left']

class App extends Component {
  state = {
    placement: 'bottom'
  }

  render() {
    const { placement } = this.state
    return (
      <div
        style={{
          padding: 100
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
        <PopperManager placement={placement}>
          {/* Reference */}
          <div style={{ width: 120, height: 120, background: 'red' }}>
            Box
          </div>
          {/* Popper */}
          <div>
            Content
            <PopperArrow className="popper__arrow"/>
          </div>
        </PopperManager>
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('app'))
