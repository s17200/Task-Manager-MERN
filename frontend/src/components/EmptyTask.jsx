import React from "react";
import { Link } from "react-router-dom";

function EmptyTask() {
  return (
    <>
      <span>No tasks found</span>
      <Link
        to="/tasks/add"
        className="bg-blue-500 text-white hover:bg-blue-600 font-medium rounded-md px-4 py-2"
      >
        + Add new task{" "}
      </Link>
    </>
  );
}

export default EmptyTask;
