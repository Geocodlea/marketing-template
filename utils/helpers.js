const formattedDate = (date) => {
  const dateObj = new Date(date);

  return dateObj.toLocaleDateString("ro-RO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export { formattedDate };
