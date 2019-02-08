import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import MainContainer from './containers/main'
import store from './store'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <MainContainer />
    </Provider>
  </React.StrictMode>,
  document.getElementById('app')
)
