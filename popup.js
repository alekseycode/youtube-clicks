chrome.storage.local.get({ dailyCount: 0, totalCount: 0 }, (data) => {
  document.getElementById("dailyCount").textContent = data.dailyCount;
  document.getElementById("totalCount").textContent = data.totalCount;
});
