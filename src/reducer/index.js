import { combineReducers } from 'redux';
import QuestionReducer from './QuestionReducer';

const appReducer = combineReducers({
  QuestionReducer
});

const rootReducer = (state, action) => {
    state = undefined
    return appReducer(state, action)
  }

export default rootReducer;
