export const getColorByPriority = (priority) => {
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
