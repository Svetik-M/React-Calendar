import { combineReducers } from 'redux';

import authReducer from './authReducer';

const App = combineReducers({
  authorization: authReducer,
});

export default App;
