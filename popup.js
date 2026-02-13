chrome.storage.local.get(
  {
    dailyCount: 0,
    totalCount: 0,
    workHoursCount: 0,
    nonWorkHoursCount: 0,
    darkMode: false,
  },
  (data) => {
    document.getElementById("dailyCount").textContent = data.dailyCount;
    document.getElementById("totalCount").textContent = data.totalCount;
    document.getElementById("workHoursCount").textContent = data.workHoursCount;
    document.getElementById("nonWorkHoursCount").textContent =
      data.nonWorkHoursCount;

    const btn = document.getElementById("themeToggle");

    if (data.darkMode) {
      document.body.classList.add("dark");
      btn.textContent = "☀️";
    } else {
      btn.textContent = "🌙";
    }
  },
);

document.getElementById("themeToggle").addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");

  const btn = document.getElementById("themeToggle");
  btn.textContent = isDark ? "☀️" : "🌙";

  chrome.storage.local.set({ darkMode: isDark });
});

document.getElementById("saveBtn").addEventListener("click", () => {
  const dashboard = document.getElementById("dashboard");

  html2canvas(dashboard).then((canvas) => {
    const link = document.createElement("a");
    link.download = `youtube-tracker-${new Date().toISOString().split("T")[0]}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
});
