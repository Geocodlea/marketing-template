const longDate = (date) => {
  const dateObj = new Date(date);

  return dateObj.toLocaleDateString("ro-RO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const shortDate = (date) => {
  const dateObj = new Date(date);

  return dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export { longDate, shortDate };
