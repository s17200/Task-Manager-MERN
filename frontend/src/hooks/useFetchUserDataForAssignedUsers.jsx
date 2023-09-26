import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useFetch from "./useFetch";

const useFetchUserDataForAssignedUsers = (tasks, authState) => {
  const [assignedBy, setAssignedBy] = useState({});
  const [assignedTo, setAssignedTo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [fetchData, { loading }] = useFetch();
  console.log(tasks);

  useEffect(() => {
    const fetchUserDataForAssignedUsers = async () => {
      setIsLoading(true);

      const uniqueAssignedByIds = Array.from(
        new Set(tasks.map((task) => task?.assignedBy._id || task?.assignedBy))
      );
      const uniqueAssignedToIds = Array.from(
        new Set(tasks.map((task) => task?.assignedTo._id || task?.assignedTo))
      );

      const newAssignedBy = {};
      const newAssignedTo = {};

      // Fetch user data for assignedBy
      for (const userId of uniqueAssignedByIds) {
        try {
          const config = {
            url: `/users/${userId}`,
            method: "get",
            headers: { Authorization: authState.token },
          };
          const data = await fetchData(config, { showSuccessToast: false });
          newAssignedBy[userId] = data.user.name;
        } catch (error) {
          console.log(error);
          toast.error("Error fetching user data");
        }
      }

      // Fetch user data for assignedTo
      for (const userId of uniqueAssignedToIds) {
        try {
          const config = {
            url: `/users/${userId}`,
            method: "get",
            headers: { Authorization: authState.token },
          };
          const data = await fetchData(config, { showSuccessToast: false });
          newAssignedTo[userId] = data.user.name;
        } catch (error) {
          console.log(error);
          toast.error("Error fetching user data");
        }
      }

      setAssignedBy(newAssignedBy);
      setAssignedTo(newAssignedTo);
      setIsLoading(false);
    };

    fetchUserDataForAssignedUsers();
  }, [tasks, authState]);

  return { assignedBy, assignedTo, isLoading };
};

export default useFetchUserDataForAssignedUsers;
