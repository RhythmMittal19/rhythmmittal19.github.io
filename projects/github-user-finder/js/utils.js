// ═══════════════════════════════════════════════════════════════════════════
// UTILS.JS - Helper/Utility functions
// ═══════════════════════════════════════════════════════════════════════════

console.log("✅ utils.js loaded");

// We'll add functions here later:
// - formatNumber()
// - formatDate()
// - timeAgo()
// - getLanguageColor()
// - calculateTotalStars()
// - calculateLanguageStats()

function formatNumber(num) {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return String(num);
}

function timeAgo(dateString) {
  const currentTime = new Date();
  const pastTime = new Date(dateString);

  const timeDiff = currentTime - pastTime;
  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  // 🆕 Handle "just now" for very recent times
  if (seconds < 5) {
    return "Just now";
  }
  if (seconds < 60) {
    return `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`;
  }
  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  }
  if (hours < 24) {
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }
  if (days < 30) {
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }
  if (months < 12) {
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  }
  return `${years} ${years === 1 ? "year" : "years"} ago`;
}

function formatDate(dateString) {
  const fDate = new Date(dateString);

  return fDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getLanguageColor(language) {
  return LANGUAGE_COLORS[language] ?? LANGUAGE_COLORS.default;
}

function calculateTotalStars(repos) {
  if (!repos || repos.length === 0) return 0;

  let total = 0;
  repos.forEach((repo) => {
    total += repo.stargazers_count || 0;
  });
  return total;
}

function calculateLanguageStats(repos) {
  if (!repos || repos.length === 0) return [];

  const languages = {};

  repos.forEach((repo) => {
    console.log(repo.language)
    if (repo.language) {
      languages[repo.language] = (languages[repo.language] || 0) + 1;
    }
  });

  console.log(languages);

  // const languageCount = Object.values(languages).reduce(
  //   (sum, count) => sum + count,
  //   0
  // );

  // Object.entries(languages).forEach((language) => {
  //   return {
  //     name: language.name,
  //     percentage: (language.count / languageCount) * 100,
  //     color: LANGUAGE_COLORS[language],
  //   };
  // });

  // languages.sort()
}
