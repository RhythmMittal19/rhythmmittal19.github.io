// ═══════════════════════════════════════════════════════════════════════════
// APP.JS - Main application logic
// ═══════════════════════════════════════════════════════════════════════════

console.log("✅ app.js loaded");

// ═══════════════════════════════════════════════════════════════════════════
// STATE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

function showState(stateName) {
  // Step 1: Get all state containers
  const stateContainers = document.querySelectorAll(".state-container");

  // Step 2: Remove "show" class from all
  stateContainers.forEach((stateContainer) => {
    stateContainer.classList.remove("show");
  });
  // After removing from all state-containers, also handle profileContent
  document.getElementById("profileContent").classList.remove("show");

  // Step 3: Get element ID from STATE_ELEMENTS object
  const elementID = STATE_ELEMENTS[stateName];

  // Step 3.5: Handle invalid state
  if (!elementID) {
    console.warn(
      `⚠️ showState: Invalid state "${stateName}", defaulting to empty`
    );
    document.getElementById(STATE_ELEMENTS.empty).classList.add("show");
    return;
  }

  // Step 4: Add "show" class to target element
  document.getElementById(elementID).classList.add("show");

  // Step 5: Log for debugging
  console.log(`📍 State changed to: ${stateName}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════

function initApp() {
  console.log("🚀 DevScope App Starting...");

  // Show empty state on load
  showState(STATES.EMPTY);

  console.log("✅ App initialized!");
}

// Start the app when DOM is ready
document.addEventListener("DOMContentLoaded", initApp);
