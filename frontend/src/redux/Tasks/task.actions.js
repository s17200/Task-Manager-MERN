import {
  GET_TASKS,
  GET_TASKS_ERROR,
  GET_TASKS_LOADING,
} from "./task.actionTypes";
import { getTask } from "./task.api";

export const getTasks = (config, filter) => async (dispatch) => {
  dispatch({ type: GET_TASKS_LOADING });
  try {
    let data = await getTask(config, filter);
    dispatch({ type: GET_TASKS, payload: data });
  } catch (error) {
    dispatch({ type: GET_TASKS_ERROR });
  }
};
