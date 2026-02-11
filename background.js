const YOUTUBE_REGEX = /^https?:\/\/(www\.)?youtube\.com/;

chrome.runtime.onInstalled.addListener(() => {
  scheduleMidnightReset();
  ensureToday();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "midnightReset") {
    resetDailyCount();
    scheduleMidnightReset();
  }
});

chrome.webNavigation.onCommitted.addListener((details) => {
  if (details.frameId !== 0) return;

  const { url, transitionType, transitionQualifiers } = details;

  if (!YOUTUBE_REGEX.test(url)) return;
  if (transitionType === "reload") return;

  // Only count actual link clicks (not typing URL)
  if (transitionQualifiers.includes("from_address_bar")) return;

  incrementCounters();
});

function incrementCounters() {
  ensureToday(() => {
    chrome.storage.local.get({ dailyCount: 0, totalCount: 0 }, (data) => {
      chrome.storage.local.set({
        dailyCount: data.dailyCount + 1,
        totalCount: data.totalCount + 1,
      });
    });
  });
}

function ensureToday(callback) {
  const today = getTodayString();

  chrome.storage.local.get({ lastResetDate: today, dailyCount: 0 }, (data) => {
    if (data.lastResetDate !== today) {
      chrome.storage.local.set(
        {
          dailyCount: 0,
          lastResetDate: today,
        },
        callback,
      );
    } else if (callback) {
      callback();
    }
  });
}

function resetDailyCount() {
  chrome.storage.local.set({
    dailyCount: 0,
    lastResetDate: getTodayString(),
  });
}

function scheduleMidnightReset() {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);

  chrome.alarms.create("midnightReset", {
    when: midnight.getTime(),
  });
}

function getTodayString() {
  return new Date().toISOString().split("T")[0];
}
