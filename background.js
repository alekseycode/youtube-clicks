const previousUrls = {};

const YOUTUBE_REGEX = /^https?:\/\/(www\.)?youtube\.com/;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    zeroClickStreak: 0,
    lastStreakDate: null,
    longestStreak: 0,
  });

  scheduleMidnightReset();
  ensureToday();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "midnightReset") {
    resetDailyCounts();
    scheduleMidnightReset();
  }
});

chrome.webNavigation.onCommitted.addListener((details) => {
  if (details.frameId !== 0) return;

  const { tabId, url, transitionType } = details;

  const prevUrl = previousUrls[tabId];

  // Save current URL for next navigation
  previousUrls[tabId] = url;

  if (!YOUTUBE_REGEX.test(url)) return;
  if (transitionType === "reload") return;

  // Only count if previous URL was NOT YouTube
  if (prevUrl && YOUTUBE_REGEX.test(prevUrl)) return;

  incrementCounters();
});

chrome.tabs.onRemoved.addListener((tabId) => {
  delete previousUrls[tabId];
});

function incrementCounters() {
  ensureToday(() => {
    chrome.storage.local.get(
      {
        dailyCount: 0,
        totalCount: 0,
        workHoursCount: 0,
        nonWorkHoursCount: 0,
      },
      (data) => {
        const isWork = isWorkingHours(new Date());

        chrome.storage.local.set({
          dailyCount: data.dailyCount + 1,
          totalCount: data.totalCount + 1,
          workHoursCount: data.workHoursCount + (isWork ? 1 : 0),
          nonWorkHoursCount: data.nonWorkHoursCount + (isWork ? 0 : 1),
        });
      },
    );
  });
}

function isWorkingHours(date) {
  const day = date.getDay();

  // Only allow Monday (1) through Friday (5)
  if (day < 1 || day > 5) {
    return false;
  }

  const minutes = date.getHours() * 60 + date.getMinutes();

  const morningStart = 8 * 60 + 30; // 8:30
  const morningEnd = 12 * 60; // 12:00

  const afternoonStart = 12 * 60 + 45; // 12:45
  const afternoonEnd = 16 * 60 + 30; // 4:30

  return (
    (minutes >= morningStart && minutes < morningEnd) ||
    (minutes >= afternoonStart && minutes < afternoonEnd)
  );
}

function ensureToday(callback) {
  const today = getTodayString();

  chrome.storage.local.get(
    {
      lastResetDate: today,
      dailyCount: 0,
      workHoursCount: 0,
      nonWorkHoursCount: 0,
    },
    (data) => {
      if (data.lastResetDate !== today) {
        chrome.storage.local.set(
          {
            dailyCount: 0,
            workHoursCount: 0,
            nonWorkHoursCount: 0,
            lastResetDate: today,
          },
          callback,
        );
      } else if (callback) {
        callback();
      }
    },
  );
}

function resetDailyCounts() {
  chrome.storage.local.get(
    {
      dailyCount: 0,
      zeroClickStreak: 0,
      lastStreakDate: null,
      longestStreak: 0,
    },
    (data) => {
      const today = getTodayString();

      let newStreak = data.zeroClickStreak;
      let newLongest = data.longestStreak;

      if (data.dailyCount === 0) {
        // Only increment if yesterday wasn't already counted
        if (data.lastStreakDate !== today) {
          newStreak += 1;
        }

        if (newStreak > newLongest) {
          newLongest = newStreak;
        }
      } else {
        newStreak = 0;
      }

      chrome.storage.local.set({
        dailyCount: 0,
        workHoursCount: 0,
        nonWorkHoursCount: 0,
        zeroClickStreak: newStreak,
        longestStreak: newLongest,
        lastStreakDate: today,
        lastResetDate: today,
      });
    },
  );
}

function scheduleMidnightReset() {
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);

  chrome.alarms.create("midnightReset", {
    when: midnight.getTime(),
  });
}

function getTodayString() {
  return new Date().toISOString().split("T")[0];
}
