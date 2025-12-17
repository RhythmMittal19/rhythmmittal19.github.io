// ═══════════════════════════════════════════════════════════════════════════
// CONFIG.JS - All constants and configuration
// ═══════════════════════════════════════════════════════════════════════════

const API_CONFIG = {
  BASE_URL: "https://api.github.com",
  ENDPOINTS: {
    USER: "/users/",
    REPOS: "/repos",
    ORGS: "/orgs",
    FOLLOWERS: "/followers",
    EVENTS: "/events/public",
  },
  TOKEN: "", // Set to your token string: "ghp_xxxxxxxxxxxx" or leave null
};

const STORAGE_KEYS = {
  HISTORY: "devscope_history",
  THEME: "devscope_theme",
};

const APP_CONFIG = {
  REPOS_PER_PAGE: 6,
  MAX_HISTORY_ITEMS: 10,
  TOAST_DURATION: 3000,
  MAX_LANGUAGES_SHOWN: 5,
  MAX_FOLLOWERS_PREVIEW: 8,
  MAX_ACTIVITY_ITEMS: 10,
};

const STATES = {
  EMPTY: "empty",
  LOADING: "loading",
  ERROR: "error",
  RATE_LIMIT: "rateLimit",
  PROFILE: "profile",
};

const STATE_ELEMENTS = {
  empty: "emptyState",
  loading: "loadingState",
  error: "errorState",
  rateLimit: "rateLimitState",
  profile: "profileContent",
};

const LANGUAGE_COLORS = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  Python: "#3572a5",
  Java: "#ed8b00",
  Go: "#00add8",
  Rust: "#dea584",
  Ruby: "#cc342d",
  "C++": "#00599c",
  "C#": "#512bd4",
  C: "#555555",
  PHP: "#777bb4",
  Swift: "#f05138",
  Kotlin: "#7f52ff",
  HTML: "#e34f26",
  CSS: "#1572b6",
  SCSS: "#c6538c",
  Shell: "#89e051",
  Vue: "#4fc08d",
  Dart: "#0175c2",
  default: "#8b8b8b",
};

const ERROR_MESSAGES = {
  USER_NOT_FOUND: "We couldn't find a GitHub user with that username.",
  RATE_LIMIT:
    "GitHub API rate limit exceeded. Please wait before trying again.",
  NETWORK_ERROR: "Network error. Please check your internet connection.",
  EMPTY_USERNAME: "Please enter a username to search.",
  INVALID_USERNAME: "Username can only contain letters, numbers, and hyphens.",
};

console.log("✅ config.js loaded");
