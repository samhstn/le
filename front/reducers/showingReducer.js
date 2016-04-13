export default function (state = [0, 0, 0, 0, 0], action) {
  switch (action.type) {
  case 'WORD_SELECTED':
    return (state.slice(0, action.payload)
                 .concat((state[action.payload] + 1) % 2)
                 .concat(state.slice(action.payload + 1, state.length))
    )
  default:
    return state
  }
}
