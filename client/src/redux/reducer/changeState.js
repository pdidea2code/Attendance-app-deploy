const initialState = {
  sidebarShow: true,
  unfoldable: false,
}

const changeState = (state = initialState, { type, ...rest }) => {
  // console.log(state)
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
}

export default changeState
