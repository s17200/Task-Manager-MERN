import React, { useCallback, useEffect, useState } from "react";
import Tooltip from "./utils/Tooltip";
import { Link, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { useSelector } from "react-redux";
import { handleDateFormate } from "./utils/formateDate";
import { getColorByPriority } from "./utils/colorbypriority";

function IndiVidualTask({
  task,
  index,
  assignedBy,
  assignedTo,
  deleteTask,
  fetchTasks,
  filter,
}) {
  const authState = useSelector((state) => state.auth);
  const [fetchData, { loading }] = useFetch();

  const handleDelete = (id) => {
    deleteTask(id);
  };

  const handleCompleted = (id) => {
    const config = {
      url: `/completed/tasks`,
      method: "post",
      data: { taskId: id },
      headers: { Authorization: authState.token },
    };
    fetchData(config, { showSuccessToast: false }).then((data) => {
      fetchTasks();
    });
  };

  return (
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
          <h3 className="text-center">{handleDateFormate(task?.createdAt)}</h3>
        </div>

        <div>
          <span className="font-medium">Deadline</span>
          <h3 className="text-center">{handleDateFormate(task?.deadline)}</h3>
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

        <Tooltip text={"Mark as Completed"} position={"top"}>
          <span
            className="text-blue-500 cursor-pointer ml-2"
            onClick={() => handleCompleted(task?._id)}
          >
            <i className="fa-regular fa-check-circle"></i>
          </span>
        </Tooltip>
      </div>
      <div className="whitespace-pre">{task?.description}</div>
    </div>
  );
}

export default IndiVidualTask;
