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

document.getElementById("saveBtn").addEventListener("click", () => {
  const dashboard = document.getElementById("dashboard");

  html2canvas(dashboard).then((canvas) => {
    const link = document.createElement("a");
    link.download = `youtube-tracker-${new Date().toISOString().split("T")[0]}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
});
