import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Textarea } from '../components/utils/Input';
import Loader from '../components/utils/Loader';
import useFetch from '../hooks/useFetch';
import MainLayout from '../layouts/MainLayout';
import validateManyFields from '../validations';

const Task = () => {

  const authState = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [fetchData, { loading }] = useFetch();
  const { taskId } = useParams();


  const mode = taskId === undefined ? "add" : "update";
  const [task, setTask] = useState(null);
  const [assignTo, setassignTo] = useState([]);
  const [formData, setFormData] = useState({
    description: "",
    assignedTo: "",
    priority: "",
    deadline: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    document.title = mode === "add" ? "Add task" : "Update Task";
  }, [mode]);

  useEffect(() => {
    const config = {
      url: `/users`,
      method: "get",
      headers: { Authorization: authState.token },
    };
    fetchData(config, { showSuccessToast: false }).then((data) => {
      setassignTo(data?.users);
    });
  }, []);

  // useEffect(() => {
  //   if (mode === "update") {
  //     const config = {
  //       url: `/tasks/${taskId}`,
  //       method: "get",
  //       headers: { Authorization: authState.token },
  //     };
  //     fetchData(config, { showSuccessToast: false }).then((data) => {
  //       setTask(data.task);
  //       setFormData({ description: data.task.description });
      
  //     });
  //   }
  // }, [mode, authState, taskId, fetchData]);

  useEffect(() => {
    if (mode === "update") {
      const config = {
        url: `/tasks/${taskId}`,
        method: "get",
        headers: { Authorization: authState.token },
      };
      fetchData(config, { showSuccessToast: false })
        .then((data) => {
          setTask(data.task);
          setFormData({ description: data.task.description });
        })
        .catch((error) => {
          navigate("/")
        });
    }
  }, [mode, authState, taskId, fetchData]);
  

   

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleReset = (e) => {
    e.preventDefault();
    setFormData({
      description: task.description,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateManyFields("task", formData);
    setFormErrors({});

    if (errors.length > 0) {
      setFormErrors(
        errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {})
      );
      return;
    }

    if (mode === "add") {
      const config = {
        url: "/tasks",
        method: "post",
        data: formData,
        headers: { Authorization: authState.token },
      };
      fetchData(config).then(() => {
        navigate("/");
      });
    } else {
      const config = {
        url: `/tasks/${taskId}`,
        method: "put",
        data: formData,
        headers: { Authorization: authState.token },
      };
      fetchData(config).then(() => {
        navigate("/");
      });
    }
  };

  const fieldError = (field) => (
    <p
      className={`mt-1 text-pink-600 text-sm ${
        formErrors[field] ? "block" : "hidden"
      }`}
    >
      <i className="mr-2 fa-solid fa-circle-exclamation"></i>
      {formErrors[field]}
    </p>
  );
  // max-w-[1000px]

  return (
    <>                      
      <MainLayout>
        <form className="m-auto my-400 w-16 md:w-800 lg:w-[1000px] bg-white p-8 border-2 shadow-md rounded-md">
          {loading ? (
            <Loader />
          ) : (
            <>
              <h2 className="text-center mb-4">
                {mode === "add" ? "Add New Task" : "Edit Task"}
              </h2>
              <div className="mb-4">
                <label htmlFor="description">Description</label>
                <Textarea
                  type="description"
                  name="description"
                  id="description"
                  value={formData.description}
                  placeholder="Write here.."
                  onChange={handleChange}
                />
                <div className="flex flex-col gap-2 mt-4">
                  <label htmlFor="Assignedto">AssignedTo</label>
                  <select
                    className="py-3 outline-2 border-2"
                    onChange={handleChange}
                    name="assignedTo"
              
                  >
                    <option value="">Select Name</option>
                    {assignTo.map((item) => (
                      <option key={item._id} value={item?._id}>
                        {item?.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  <label htmlFor="Assignedto">Priority</label>
                  <select
                    className="py-3 outline-2 border-2"
                    onChange={handleChange}
                    name="priority"
                  >
                    <option value="">Select Priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  <label htmlFor="Assignedto">Deadline</label>
                  <input
                    type="date"
                    onChange={handleChange}
                    name="deadline"
                    className="py-3 outline-2 border-2 "
                  />
                </div>
                {fieldError("description")}
              </div>

              <button
                className="bg-primary text-white px-4 py-2 font-medium hover:bg-primary-dark"
                onClick={handleSubmit}
              >
                {mode === "add" ? "Add task" : "Update Task"}
              </button>
              <button
                className="ml-4 bg-red-500 text-white px-4 py-2 font-medium"
                onClick={() => navigate("/")}
              >
                Cancel
              </button>
              {mode === "update" && (
                <button
                  className="ml-4 bg-blue-500 text-white px-4 py-2 font-medium hover:bg-blue-600"
                  onClick={handleReset}
                >
                  Reset
                </button>
              )}
            </>
          )}
        </form>
      </MainLayout>
    </>
  );
}

export default Task