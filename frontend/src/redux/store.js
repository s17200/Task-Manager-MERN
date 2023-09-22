import {
  applyMiddleware,
  compose,
  legacy_createStore,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";
import authReducer from "./Auth/auth.Reducer";
import { TaskReducer } from "./Tasks/task.reducer";

const middleware = [thunk];

const rootReducer = combineReducers({
  auth: authReducer,
  task: TaskReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = legacy_createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middleware))
);
export default store;
