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
    console.log(tasks);
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


  return (
    <>
      <div className="my-2 mx-auto max-w-[900px] py-4 ">

        {tasks.length !== 0 && <h2 className='text-white my-2 ml-2 md:ml-0 text-xl'>Your tasks ({tasks.length})</h2>}
        {loading ? (
          <Loader />
        ) : (
          <div>
            {tasks.length === 0 ? (

              <div className='w-[600px] h-[300px] flex items-center justify-center gap-4'>
                <span>No tasks found</span>
                <Link to="/tasks/add" className="bg-blue-500 text-white hover:bg-blue-600 font-medium rounded-md px-4 py-2">+ Add new task </Link>
              </div>

            ) : (
              tasks.map((task, index) => (
                <div key={task._id} className='bg-white my-4 p-4 text-gray-600 rounded-md shadow-lg'>
                  <div className='flex'>

                    <span className='font-medium'>Task #{index + 1}</span>
                      
                    <div className='mx-10'>
                    <span className='font-medium  '>Assigned By</span> 
                    <h3 className='text-center'>Saurabh Sonvane</h3>
                    </div>
                      
                    <div>
                    <span className='font-medium'>Assigned To</span>
                    <h3 className='text-center'>Saurabh Sonvane</h3>
                    </div>  

                    <div className='mx-10'>
                    <span className='font-medium'>Created At</span>
                    <h3 className='text-center'>07-09-2023</h3>
                    </div>  

                    <div>
                    <span className='font-medium'>Deadline</span>
                    <h3 className='text-center'>08-09-2023</h3>
                    </div> 

                    <div className='mx-10'>
                        <select name="Priority" id="select1" className='p-1'>
                             <option  value="High">High</option>
                             <option value="Low">Low</option>
                             <option value="Medium">Medium</option>
                        </select>
                    </div> 
                    

                    <Tooltip text={"Edit this task"} position={"top"}>
                      <Link to={`/tasks/${task._id}`} className='ml-auto mr-2 text-green-600 cursor-pointer'>
                        <i className="fa-solid fa-pen"></i>
                      </Link>
                    </Tooltip>

                    <Tooltip text={"Delete this task"} position={"top"}>
                      <span className='text-red-500 cursor-pointer' onClick={() => handleDelete(task._id)}>
                        <i className="fa-solid fa-trash"></i>
                      </span>
                    </Tooltip>

                  </div>
                  <div className='whitespace-pre'>{task.description}</div>
                </div>
              ))

            )}
          </div>
        )}
      </div>
    </>
  )

}

export default Tasks