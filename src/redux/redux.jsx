//----------------------------------------------------
// redux
import { createStore, applyMiddleware, combineReducers } from "redux";

import reducer from "./reducer";

const appReducer = combineReducers({
  reducer,
});

export const store = createStore(appReducer);
