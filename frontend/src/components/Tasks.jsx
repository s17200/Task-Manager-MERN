import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import Loader from './utils/Loader';
import Tooltip from './utils/Tooltip';
import NoofTasks from "./NoofTasks";
import IndiVidualTask from "./IndiVidualTask";
import EmptyTask from "./EmptyTask";
import useFetchUserDataForAssignedUsers from "../hooks/useFetchUserDataForAssignedUsers";
import axios from "axios";

const Tasks = ({ priorityParams }) => {
  console.log(priorityParams);
  const authState = useSelector((state) => state.auth);
  const [tasks, setTasks] = useState([]);
  const [fetchData, { loading }] = useFetch();
  const { assignedBy, assignedTo, isLoading } =
    useFetchUserDataForAssignedUsers(tasks, authState);

  const fetchTasks = useCallback(() => {
    const config = {
      url: `/tasks`,
      method: "get",
      params: {
        priority: priorities.join(","),
      },
      headers: { Authorization: authState.token },
    };

    fetchData(config, { showSuccessToast: false }).then((data) => {
      setTasks(data);
    });
  }, [authState.token, fetchData]);

  useEffect(() => {
    if (!authState.isLoggedIn) return;
    fetchTasks();
  }, [authState.isLoggedIn, fetchTasks]);

  const deleteTask = (id) => {
    const config = {
      url: `/tasks/${id}`,
      method: "delete",

      headers: { Authorization: authState.token },
    };
    fetchData(config).then(() => fetchTasks());
  };

  useEffect(() => {
    axios
      .get("/api/tasks", {
        params: {
          priority: priorities.join(","),
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error("Error fetching tasks: ", error);
      });
  }, [priorities]);

  return (
    <>
      <div className="my-2 mx-auto max-w-[900px] py-4 ">
        <NoofTasks tasks={tasks} />
        {loading ? (
          <Loader />
        ) : (
          <div>
            {tasks?.length === 0 ? (
              <div className="w-[600px] h-[300px] flex items-center justify-center gap-4">
                <EmptyTask />
              </div>
            ) : (
              tasks.map((task, index) => (
                <IndiVidualTask
                  task={task}
                  index={index}
                  assignedBy={assignedBy}
                  assignedTo={assignedTo}
                  deleteTask={deleteTask}
                  // filter={Filter}
                  fetchTasks={fetchTasks}
                />
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Tasks