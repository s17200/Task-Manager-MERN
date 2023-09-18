import React, { useState } from "react";
import Tooltip from "./utils/Tooltip";
import { Link } from "react-router-dom";

function IndiVidualTask({ task, index, assignedBy, assignedTo, deleteTask }) {
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
  const handleDelete = (id) => {
    deleteTask(id);
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
      </div>
      <div className="whitespace-pre">{task?.description}</div>
    </div>
  );
}

export default IndiVidualTask;
