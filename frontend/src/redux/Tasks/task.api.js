import api from "../../api";

export const getTask = async (config, filter) => {
  const res = await api.request(`/tasks?priority=${filter}`, config);
  return res.data;
};
