import {
  GET_TASKS,
  GET_TASKS_ERROR,
  GET_TASKS_LOADING,
} from "./task.actionTypes";

const inititalState = {
  loading: false,
  tasks: [],
  error: false,
};

export const TaskReducer = (state = inititalState, { type, payload }) => {
  switch (type) {
    case GET_TASKS_LOADING:
      return {
        ...state,
        loading: true,
      };

    case GET_TASKS_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
      };
    case GET_TASKS:
      return {
        ...state,
        tasks: payload,
      };

    default:
      return state;
  }
};
