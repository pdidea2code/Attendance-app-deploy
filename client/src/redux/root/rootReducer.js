// rootReducer.js
import { combineReducers } from 'redux'
import authReducer from '../reducer/authReducer'
import changeState from 'src/redux/reducer/changeState'

const rootReducer = combineReducers({
  sidebar: changeState,
  auth: authReducer,
})

export default rootReducer
