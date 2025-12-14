function timeAgo(dateString) {
  const now = new Date();
  const past = new Date(dateString);

  const diff = (now - past) / 1000; // seconds

  if (diff < 60) return `${Math.floor(diff)} seconds ago`;
  else if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  else if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  else return `${Math.floor(diff / 86400)} days ago`;
}
export default timeAgo;
