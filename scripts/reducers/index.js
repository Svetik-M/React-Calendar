import { combineReducers } from 'redux';

import authReducer from './authReducer';

const App = combineReducers({
  authReducer,
});

export default App;
