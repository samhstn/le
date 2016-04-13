import { combineReducers } from 'redux'
import WordsReducer from './wordsReducer.js'
import ShowingReducer from './showingReducer.js'

export default combineReducers({
  words: WordsReducer,
  showing: ShowingReducer
})
