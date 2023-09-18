import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import Loader from './utils/Loader';
import Tooltip from './utils/Tooltip';
import NoofTasks from "./NoofTasks";
import IndiVidualTask from "./IndiVidualTask";

const Tasks = ({ Filter }) => {
  const authState = useSelector((state) => state.auth);
  const [tasks, setTasks] = useState([]);
  const [fetchData, { loading }] = useFetch();
  const [assignedBy, setAssignedBy] = useState({});
  const [assignedTo, setAssignedTo] = useState({});

  const fetchTasks = useCallback(() => {
    const config = {
      url: `/tasks?priority=${Filter}`,
      method: "get",
      headers: { Authorization: authState.token },
    };
    // const {userTasks, allTasks}=config
    fetchData(config, { showSuccessToast: false }).then((data) => {
      setTasks(data);
    });
  }, [authState.token, fetchData, Filter]);

  useEffect(() => {
    if (!authState.isLoggedIn) return;
    fetchTasks();
  }, [authState.isLoggedIn, fetchTasks, Filter]);

  const deleteTask = (id) => {
    const config = {
      url: `/tasks/${id}`,
      method: "delete",
      headers: { Authorization: authState.token },
    };
    fetchData(config).then(() => fetchTasks());
  };

  useEffect(() => {
    // Function to fetch user data for a given user ID
    const getUsersData = async (id) => {
      const config = {
        url: `/users/${id}`,
        method: "get",
        headers: { Authorization: authState.token },
      };
      try {
        const data = await fetchData(config, { showSuccessToast: false });
        return data.user.name;
      } catch (error) {
        console.log(error);
        return null;
      }
    };

    // Fetch user data for assigned users
    const fetchUserDataForAssignedUsers = async () => {
      const newAssignedBy = {};
      const newAssignedTo = {}; // Create a new map to store user data

      // Iterate through tasks to collect unique user IDs
      const uniqueAssignedByIds = Array.from(
        new Set(tasks.map((task) => task.assignedBy._id))
      );
      const uniqueAssignedToIds = Array.from(
        new Set(tasks.map((task) => task.assignedTo._id))
      );

      // Fetch user data for each unique user ID
      for (const userId of uniqueAssignedByIds) {
        const userName = await getUsersData(userId);
        if (userName !== null) {
          newAssignedBy[userId] = userName;
        }
      }

      for (const userId of uniqueAssignedToIds) {
        const userName = await getUsersData(userId);
        if (userName !== null) {
          newAssignedTo[userId] = userName;
        }
      }

      // Update the userDataMap state with the fetched user data
      setAssignedBy(newAssignedBy);
      setAssignedTo(newAssignedTo);
    };

    // Call the function to fetch user data when tasks or authState.token changes
    fetchUserDataForAssignedUsers();
  }, [tasks, authState.token]);

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
                <span>No tasks found</span>
                <Link
                  to="/tasks/add"
                  className="bg-blue-500 text-white hover:bg-blue-600 font-medium rounded-md px-4 py-2"
                >
                  + Add new task{" "}
                </Link>
              </div>
            ) : (
              tasks.map((task, index) => (
                <IndiVidualTask
                  task={task}
                  index={index}
                  assignedBy={assignedBy}
                  assignedTo={assignedTo}
                  deleteTask={deleteTask}
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