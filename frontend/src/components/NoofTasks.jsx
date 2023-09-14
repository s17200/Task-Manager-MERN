import React from "react";

function NoofTasks({ tasks }) {
  return (
    <div>
      {tasks?.length !== 0 && (
        <h2 className="text-white my-2 ml-2 md:ml-0 text-xl">
          Your tasks ({tasks?.length})
        </h2>
      )}
    </div>
  );
}

export default NoofTasks;
