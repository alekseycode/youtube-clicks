chrome.storage.local.get(
  {
    dailyCount: 0,
    totalCount: 0,
    workHoursCount: 0,
    nonWorkHoursCount: 0,
    zeroClickStreak: 0,
    longestStreak: 0,
    darkMode: false,
  },
  (data) => {
    document.getElementById("dailyCount").textContent = data.dailyCount;
    document.getElementById("totalCount").textContent = data.totalCount;
    document.getElementById("workHoursCount").textContent = data.workHoursCount;
    document.getElementById("nonWorkHoursCount").textContent = data.nonWorkHoursCount;
    document.getElementById("zeroClickStreak").textContent = data.zeroClickStreak;
    document.getElementById("longestStreak").textContent = data.longestStreak;

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

  const isDark = document.body.classList.contains("dark");
  const bgColor = isDark ? "#111827" : "#f9fafb";

  html2canvas(dashboard, {
    backgroundColor: bgColor,
  }).then((canvas) => {
    const link = document.createElement("a");
    link.download = `youtube-tracker-${new Date().toISOString().split("T")[0]}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
});
