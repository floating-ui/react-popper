import React, { Component, PropTypes, Children, createElement } from 'react'
import ReactDOM, { findDOMNode } from 'react-dom'
import Popper from '../src/react-popper'

import './main.scss'

class App extends Component {
  render() {
    return (
      <div
        style={{
          padding: 100
        }}
      >
        <Popper>
          <div
            style={{
              width: 120,
              height: 120,
              background: 'red'
            }}
          >
            Box
          </div>
          <div
            style={{
              width: 60,
              height: 60,
              background: 'blue'
            }}
          >
            Content
          </div>
        </Popper>
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('app'))
