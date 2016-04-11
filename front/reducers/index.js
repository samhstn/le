import {combineReducers} from 'redux'
import WordsReducer from './reducer_words'
import WordsHide from './reducer_hide'

const rootReducer = combineReducers({
  words: WordsReducer,
  wordsHide: WordsHide
})

export default rootReducer
