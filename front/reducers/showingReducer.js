export default function (state = [false, false, false, false, false], action) {
  switch (action.type) {
  case 'WORD_SELECTED':
    return state.map((n, i) => i === action.payload ? !n : n)
  default:
    return state
  }
}
