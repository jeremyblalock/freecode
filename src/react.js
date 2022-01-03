import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './redux-store'
import Controls from './components/Controls'

export const initializeReact = domNode => {
  ReactDOM.render(
    <Provider store={store}>
      <Controls />
    </Provider>,
    domNode
  )
}
