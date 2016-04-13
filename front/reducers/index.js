import {combineReducers} from 'redux'
import WordsReducer from './wordsReducer.js'
import ShowingReducer from './showingReducer.js'

const rootReducer = combineReducers({
  words: WordsReducer,
  showing: ShowingReducer
})

export default rootReducer
