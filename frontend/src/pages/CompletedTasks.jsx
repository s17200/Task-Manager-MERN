import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useFetch from "../hooks/useFetch";
import useFetchUserDataForAssignedUsers from "../hooks/useFetchUserDataForAssignedUsers";
import { handleDateFormate } from "../components/utils/formateDate";
import { getColorByPriority } from "../components/utils/colorbypriority";

function CompletedTasks() {
  const authState = useSelector((state) => state.auth);
  const [fetchData, { loading }] = useFetch();
  const [completedTasks, setCompletedTasks] = useState([]);
  const [taskData, setTaskData] = useState([]);

  const { assignedBy, assignedTo, isLoading } =
    useFetchUserDataForAssignedUsers(completedTasks, authState);
  useEffect(() => {
    const config = {
      url: `/completed`,
      method: "get",
      headers: { Authorization: authState.token },
    };
    fetchData(config, { showSuccessToast: false }).then((data) => {
      setCompletedTasks(data.map((item) => item.task));
    });
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4">Completed Tasks</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 text-left">Description</th>
                <th className="py-2 px-4 text-left">Assigned By</th>
                <th className="py-2 px-4 text-left">Assigned To</th>
                <th className="py-2 px-4 text-left">Created At</th>
                <th className="py-2 px-4 text-left">Deadline</th>
                <th className="py-2 px-4 text-left">Priority</th>
              </tr>
            </thead>
            <tbody>
              {completedTasks.map((task, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                  <td className="py-2 px-4">{task.description}</td>
                  <td className="py-2 px-4">{assignedBy[task.assignedBy]}</td>
                  <td className="py-2 px-4">{assignedTo[task.assignedTo]}</td>
                  <td className="py-2 px-4">
                    {handleDateFormate(task.createdAt)}
                  </td>
                  <td className="py-2 px-4">
                    {handleDateFormate(task.deadline)}
                  </td>
                  <td
                    className={`px-2 py-1 rounded-md font-bold text-white ${getColorByPriority(
                      task.priority
                    )}`}
                  >
                    {task?.priority}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CompletedTasks;
