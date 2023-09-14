import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import Loader from './utils/Loader';
import Tooltip from './utils/Tooltip';
import NoofTasks from "./NoofTasks";

const Tasks = () => {
  const authState = useSelector((state) => state.authReducer);
  const [tasks, setTasks] = useState([]);
  const [fetchData, { loading }] = useFetch();
  const [assignedBy, setAssignedBy] = useState({});
  const [assignedTo, setAssignedTo] = useState({});

  const fetchTasks = useCallback(() => {
    const config = {
      url: "/tasks",
      method: "get",
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

  const handleDelete = (id) => {
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

  const handleDateFormate = (date) => {
    const inputDate = new Date(date);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];
    const year = inputDate.getFullYear();

    const monthIndex = inputDate.getMonth();
    const day = inputDate.getDate();

    const monthName = monthNames[monthIndex];

    const formattedDate = `${day} - ${monthName} - ${year}`;
    return formattedDate;
  };

  const getColorByPriority = (priority) => {
    switch (priority) {
      case "Low":
        return "bg-green-500";
      case "Medium":
        return "bg-yellow-400";
      case "High":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

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
                <div
                  key={task._id}
                  className="bg-white my-4 p-4 text-gray-600 rounded-md shadow-lg"
                >
                  <div className="flex">
                    <span className="font-medium">Task #{index + 1}</span>

                    <div className="mx-10">
                      <span className="font-medium  ">Assigned By</span>
                      <h3 className="text-center">
                        {assignedBy[task?.assignedBy._id] || "Loading..."}
                      </h3>
                    </div>

                    <div>
                      <span className="font-medium">Assigned To</span>
                      <h3 className="text-center">
                        {assignedTo[task?.assignedTo._id] || "Loading..."}
                      </h3>
                    </div>

                    <div className="mx-10">
                      <span className="font-medium">Created At</span>
                      <h3 className="text-center">
                        {handleDateFormate(task?.createdAt)}
                      </h3>
                    </div>

                    <div>
                      <span className="font-medium">Deadline</span>
                      <h3 className="text-center">
                        {handleDateFormate(task?.deadline)}
                      </h3>
                    </div>

                    <div className="mx-10">
                      <div>
                        <span className="font-medium">Priority</span>
                        <p
                          className={`px-2 py-1 rounded-md font-bold text-white ${getColorByPriority(
                            task.priority
                          )}`}
                        >
                          {task?.priority}
                        </p>
                      </div>
                    </div>

                    <Tooltip text={"Edit this task"} position={"top"}>
                      <Link
                        to={`/tasks/${task?._id}`}
                        className="ml-auto mr-2 text-green-600 cursor-pointer"
                      >
                        <i className="fa-solid fa-pen"></i>
                      </Link>
                    </Tooltip>

                    <Tooltip text={"Delete this task"} position={"top"}>
                      <span
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleDelete(task?._id)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </span>
                    </Tooltip>
                  </div>
                  <div className="whitespace-pre">{task?.description}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Tasks