import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Tasks from "../components/Tasks";
import MainLayout from "../layouts/MainLayout";
import useFetch from "../hooks/useFetch";
import { getTasks } from "../redux/Tasks/task.actions";
import { useSearchParams } from "react-router-dom";

const Home = () => {
  const authState = useSelector((state) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFilterValues = searchParams.getAll("priority");
  const [priorityParams, setPriorityParams] = useState(null);
  const [priorities, setPriorities] = useState(initialFilterValues || []);

  const { isLoggedIn } = authState;
  const [Filter, setFilter] = useState("default");
  const location = useLocation();
  console.log(searchParams);
  const dispatch = useDispatch();

  const fetchTasks = useCallback(() => {
    const config = {
      method: "get",
      headers: { Authorization: authState.token },
    };

    dispatch(getTasks(config, Filter));
  }, [authState.token, Filter]);

  const handlePriorityChange = (e) => {
    const { value, checked } = e.target;
    setPriorities((prevPriorities) => {
      if (checked) {
        return [...prevPriorities, value];
      } else {
        return prevPriorities.filter((priority) => priority !== value);
      }
    });
  };

  useEffect(() => {
    document.title = authState.isLoggedIn
      ? `${authState.user.name}'s tasks`
      : "Task Manager";
    fetchTasks();

    if (location) {
      const getProductsParam = {
        params: {
          category: searchParams.getAll("priority"),
        },
      };
      setPriorityParams(getProductsParam);
    }
  }, [authState, fetchTasks, location.search]);

  useEffect(() => {
    let params = {};
    if (priorities.length) params.priority = priorities;

    setSearchParams(params);
  }, [priorities]);

  return (
    <>
      e
      <MainLayout>
        {!isLoggedIn ? (
          <div className="bg-primary text-white h-[40vh] py-8 text-center">
            <h1 className="text-2xl"> Welcome to Task Manager App</h1>
            <Link
              to="/signup"
              className="mt-10 text-xl block space-x-2 hover:space-x-4"
            >
              <span className="transition-[margin]">
                Join now to manage your tasks
              </span>
              <span className="relative ml-4 text-base transition-[margin]">
                <i className="fa-solid fa-arrow-right"></i>
              </span>
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-lg text-white mt-8 mx-8 border-b border-b-gray-300">
              Welcome {authState.user.name}
            </h1>
            {/* <select
              className=" mt-8 mx-8 rounded-md p-2"
              name="Filter"
              id="filter"
              onChange={(e) => setFilter(e.target.value)}
            >
              <option className="p-1" value="default">
                Default
              </option>
              <option className="p-1" value="High">
                High
              </option>
              <option className="p-1" value="Low">
                Low
              </option>
              <option className="p-1" value="Medium">
                Medium
              </option>
              
            </select> */}

            <div className="flex flex-col  space-x-2">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-indigo-600"
                value="Low"
                onChange={handlePriorityChange}
                checked={priorities.includes("Low")}
              />
              {/* Label for the checkbox */}
              <label className="text-gray-700">Low</label>
              <input
                type="checkbox"
                value="Medium"
                className="form-checkbox h-5 w-5 text-indigo-600"
                onChange={handlePriorityChange}
                checked={priorities.includes("Medium")}
              />
              {/* Label for the checkbox */}
              <label className="text-gray-700">Medium</label>
              <input
                type="checkbox"
                value="High"
                className="form-checkbox h-5 w-5 text-indigo-600"
                onChange={handlePriorityChange}
                checked={priorities.includes("High")}
              />
              {/* Label for the checkbox */}
              <label className="text-gray-700">High</label>
            </div>
            <Link to="/tasks/completed">
              <button className="rounded-md p-2 bg-green-500 text-white font-bold">
                Completed Tasks
              </button>
            </Link>

            <Tasks priorityParams={priorityParams} />
          </>
        )}
      </MainLayout>
    </>
  );
};

export default Home;
