export const getdifficultbybadge = (difficulty) => {
  let level = difficulty?.toLowerCase();
  if (level === "easy") return "badge-success";
  if (level === "medium") return "badge-warning";
  if (level === "hard") return "badge-error";

  return "badge-ghost";
};
