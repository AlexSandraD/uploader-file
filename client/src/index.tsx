import React from 'react'
import ReactDOM from 'react-dom'
import { GlobalStyle } from './global-style'
import Filepond from './components/filepond'

console.info(`⚛️ ${React.version}`)

const App = () => (
  <>
    <GlobalStyle />
    <Filepond />
  </>
)

ReactDOM.render(<App />, document.getElementById('root'))

module.hot && module.hot.accept()
