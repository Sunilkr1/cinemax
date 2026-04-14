export const formatDate = (dateStr: string): string => {
  if (!dateStr) return "TBA";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const formatShortDate = (dateStr: string): string => {
  if (!dateStr) return "TBA";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const getYear = (dateStr: string): string => {
  if (!dateStr) return "TBA";
  return new Date(dateStr).getFullYear().toString();
};

export const isUpcoming = (dateStr: string): boolean => {
  if (!dateStr) return false;
  return new Date(dateStr) > new Date();
};

export const formatRelativeDate = (dateStr: string): string => {
  if (!dateStr) return "TBA";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return formatShortDate(dateStr);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays < 7) return `In ${diffDays} days`;
  if (diffDays < 30) return `In ${Math.ceil(diffDays / 7)} weeks`;
  if (diffDays < 365) return `In ${Math.ceil(diffDays / 30)} months`;
  return formatShortDate(dateStr);
};
