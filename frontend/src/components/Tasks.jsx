import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import Loader from './utils/Loader';
import Tooltip from './utils/Tooltip';

const Tasks = () => {
  const authState = useSelector((state) => state.authReducer);
  const [tasks, setTasks] = useState([]);
  const [fetchData, { loading }] = useFetch();
  const [usersData, setUsersData] = useState({}); // Store user data

  const fetchTasks = useCallback(() => {
    const config = {
      url: "/tasks",
      method: "get",
      headers: { Authorization: authState.token},
    };
    // const {userTasks, allTasks}=config
    fetchData(config, { showSuccessToast: false }).then((data) => {
      setTasks(data);

      // Promise.all(
      //   data.tasks.map(async (task) => {
      //     // Extract the userId from the task
      //     const userId = task.user;

      //     // Fetch additional data based on userId
      //     const userData = await fetchUserData(userId);
      //   })
      // );
    });
  }, [authState.token, fetchData]);

  // async function fetchUserData(userId) {
  //   const config = {
  //     url: "/tasks",
  //     method: "get",
  //     headers: { Authorization: authState.token },
  //   };
  //   try {
  //     const response = await fetch(`http://localhost:5000/api/users/${userId}`);
  //     const userData = await response.json();
  //     console.log(userData);
  //   } catch (error) {
  //     console.error("Error fetching user data:", error);
  //     return null;
  //   }
  // }

  // const fetchUsers = useCallback(() => {
  //   const config = { url: "/users", method: "get", headers: { Authorization: authState.token } };
  //   fetchData(config, { showSuccessToast: false }).then(data => setTasks(data.users));
  //   console.log(users)
  // }, [authState.token, fetchData]);

  useEffect(() => {
    if (!authState.isLoggedIn) return;
    fetchTasks();
  }, [authState.isLoggedIn, fetchTasks]);

  const handleDelete = (id) => {
    const config = {
      url: `/tasks/${id}`,
      method: "delete",
      headers: { Authorization: authState.token},
    };
    fetchData(config).then(() => fetchTasks());
  };

  const getUsersData =  (id) => {
    console.log(id);
    // const config = {
    //   url: `/users/${id}`,
    //   method: "get",
    //   headers: { Authorization: authState.token },
    // };
    // try {
    //   const data = await fetchData(config, { showSuccessToast: false });
    //   // return data.user.name;
    //   console.log(data.user.name)
    // } catch (error) {
    //   console.log(error);
    // }
  };

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
        {tasks?.length !== 0 && (
          <h2 className="text-white my-2 ml-2 md:ml-0 text-xl">
            Your tasks ({tasks?.length})
          </h2>
        )}
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
                        {getUsersData(task?.assignedBy._id)}
                      </h3>
                    </div>

                    <div>
                      <span className="font-medium">Assigned To</span>
                      <h3 className="text-center">
                        {getUsersData(task?.assignedTo._id)}
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
}

export default Tasks