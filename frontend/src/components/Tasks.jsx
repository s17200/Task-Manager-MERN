import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import Loader from './utils/Loader';
import Tooltip from './utils/Tooltip';

const Tasks = () => {

  const authState = useSelector(state => state.authReducer);
  const [tasks, setTasks] = useState([]);
  // const [users, setUsers] = useState([]);
  const [fetchData, { loading }] = useFetch();

  const fetchTasks = useCallback(() => {
    const config = { url: "/tasks", method: "get", headers: { Authorization: authState.token } };
    fetchData(config, { showSuccessToast: false }).then(data => setTasks(data.tasks));

  }, [authState.token, fetchData]);

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
    const config = { url: `/tasks/${id}`, method: "delete", headers: { Authorization: authState.token } };
    fetchData(config).then(() => fetchTasks());
  }
  const getColorByPriority = (priority) => {
    switch (priority) {
      case "Low":
        return "green-400";
      case "Medium":
        return "yellow-400";
      case "High":
        return "red-400";
      default:
        return "gray-400  ";
    }
  };

  return (
    <>
      <div className="my-2 mx-auto max-w-[1200px] py-4">
        {tasks.length !== 0 && (
          <h2 className="my-2 ml-2 md:ml-0 text-xl">
            Your tasks ({tasks.length})
          </h2>
        )}
        {loading ? (
          <Loader />
        ) : (
          <div>
            {tasks.length === 0 ? (
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
              <div className="container mx-auto mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tasks.map((task) => (
                    <div
                      key={task._id}
                      className="bg-white shadow-md rounded-md p-4"
                    >
                      <h2 className="text-lg font-semibold">
                        {task.description}
                      </h2>
                      <p className="text-gray-600">{task.deadline}</p>
                      <div className="mt-4">
                        <p className="text-sm text-gray-700">
                          Assigned By: {task.assignedBy}
                        </p>
                        <p className="text-sm text-gray-700">
                          Assigned To: {task.assignedTo}
                        </p>
                        <div
                          className={`mt-2 bg-${getColorByPriority(
                            task.priority
                          )} text-white text-sm font-semibold py-1 px-2 rounded-full inline-block`}
                        >
                          Priority: {task.priority}
                        </div>
                      </div>
                      <div className="mt-4">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 mr-2">
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(task._id)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2"
                        >
                          Delete
                        </button>
                        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 ml-2">
                          Update
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );

}

export default Tasks