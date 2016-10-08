import React, { Component, PropTypes, Children, createElement } from 'react'
import ReactDOM, { findDOMNode } from 'react-dom'
import Popper from '../src/react-popper'

import './main.scss'

const placements = ['top', 'right', 'bottom', 'left']

const Popover = props => <div {...props}/>

// class Popover extends Component {
//   render() {
//     return <div {...this.props}/>
//   }
// }

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
        <Popper
          placement={placement}
        >
          <div
            style={{
              width: 120,
              height: 120,
              background: 'red'
            }}
          >
            Box
          </div>
          <Popover
            style={{
              width: 60,
              height: 60,
              background: 'blue'
            }}
          >
            Content
          </Popover>
        </Popper>
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('app'))
