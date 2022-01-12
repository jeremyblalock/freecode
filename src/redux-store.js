import { createStore, combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import * as reducers from './ducks'

export default createStore(combineReducers({ ...reducers, form: formReducer }))
