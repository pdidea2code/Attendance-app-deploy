import { LOGIN_SUCCESS, LOGOUT, PERMISSION } from '../actions/action'

const initialState = {
  isAuthenticated: false,
  admin: null,
  role: null,
  permission: null,
}

const authReducer = (state = initialState, action) => {
  // console.log(state)
  switch (action.type) {
    case LOGIN_SUCCESS: {
      return {
        ...state,
        isAuthenticated: true,
        admin: action.data,
      }
    }
    case PERMISSION: {
      return {
        ...state,
        isAuthenticated: true,
        role: action.role,
        permission: action.permission,
      }
    }
    case LOGOUT: {
      return {
        ...state,
        isAuthenticated: false,
        admin: null,
      }
    }
    default: {
      return {
        ...state,
      }
    }
  }
}

export default authReducer
