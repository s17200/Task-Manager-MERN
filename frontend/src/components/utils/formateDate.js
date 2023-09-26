export const handleDateFormate = (date) => {
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