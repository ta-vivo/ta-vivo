const getMsOrSecondsFromMs = (ms) => {
  if (!ms) return 0;
  if (ms < 1000) {
    return `${Number(ms).toFixed(0)} ms`;
  }
  return `${(ms / 1000).toFixed(2)} seconds`;
};

const getTheAverageResponseTime = (data) => {
  const averageTime = data.reduce(
    (acc, log) => acc + parseFloat(log.duration),
    0
  );
  return data.length > 0
    ? getMsOrSecondsFromMs(averageTime / data.length)
    : 0;
};

const getUpTimePercent = (data) => {
  const upTime = data.filter((log) => log.status === "up").length;
  return data.length > 0
    ? `${((upTime / data.length) * 100).toFixed(0)}%`
    : "0.00%";
};

export { getMsOrSecondsFromMs, getTheAverageResponseTime, getUpTimePercent }
