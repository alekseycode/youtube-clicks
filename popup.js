chrome.storage.local.get(
  {
    dailyCount: 0,
    totalCount: 0,
    workHoursCount: 0,
    nonWorkHoursCount: 0,
  },
  (data) => {
    document.getElementById("dailyCount").textContent = data.dailyCount;
    document.getElementById("totalCount").textContent = data.totalCount;
    document.getElementById("workHoursCount").textContent = data.workHoursCount;
    document.getElementById("nonWorkHoursCount").textContent =
      data.nonWorkHoursCount;
  },
);
