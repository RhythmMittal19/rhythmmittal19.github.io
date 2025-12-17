/*

┌─────────────────────────────────────────────────────────────────────────────┐
│                           FORM VALIDATOR FLOW                               │
└─────────────────────────────────────────────────────────────────────────────┘

                              USER OPENS PAGE
                                    │
                                    ▼
                              ┌─────────────┐
                              │  Get All    │
                              │  DOM        │
                              │  Elements   │
                              └──────┬──────┘
                                    │
                                    ▼
    ┌─────────────────────────────────────────────────────────────┐
    │                        EVENT LISTENERS                      │
    ├─────────────────────────────────────────────────────────────┤
    │  • Form submit event                                        │
    │  • Each input blur event (real-time validation)             │
    │  • Each input input event (for progress bar)                │
    │  • Password input event (for strength meter)                │
    │  • Password toggle click                                    │
    │  • Modal close button click                                 │
    └─────────────────────────────────────────────────────────────┘
                              │
                              │ User interacts with form
                              ▼
    ┌─────────────────────────────────────────────────────────────┐
    │                    ON EACH INPUT                            │
    ├─────────────────────────────────────────────────────────────┤
    │  1. Validate that specific field                            │
    │  2. Update progress bar percentage                          │
    │  3. If password field → update strength meter               │
    └─────────────────────────────────────────────────────────────┘
                              │
                              │ User clicks submit
                              ▼
    ┌─────────────────────────────────────────────────────────────┐
    │                    ON FORM SUBMIT                           │
    ├─────────────────────────────────────────────────────────────┤
    │  1. Prevent default form behavior                           │
    │  2. Run ALL validators                                      │
    │  3. Check if ALL passed                                     │
    │  4. If YES → show loading → show success modal              │
    │  5. If NO → fields already show errors                      │
    └─────────────────────────────────────────────────────────────┘

*/

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 1: DOM ELEMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

// Form & Inputs
const form = document.getElementById("signup-form");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirm-password");

// Progress & Strength
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const strengthBar = document.getElementById("strength-bar");
const strengthText = document.getElementById("strength-text");

// Buttons & Modal
const submitBtn = document.getElementById("submit-btn");
const togglePasswordBtn = document.getElementById("toggle-password");
const successModal = document.getElementById("success-modal");
const closeModalBtn = document.getElementById("close-modal");

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 2: REGEX PATTERN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\d{10}$/,
  hasLetter: /[a-zA-Z]/,
  hasNumber: /\d/,
  hasSpecial: /[!@#$%^&*]/,
};

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 3: HELPER FUNCTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

function showError(input, message) {
  const parent = input.closest(".form-group");
  parent.classList.remove("success");
  parent.classList.add("error");

  const errorSpan = parent.querySelector(".error-message");
  if (errorSpan) errorSpan.textContent = message;

  return false;
}

function showSuccess(input) {
  const parent = input.closest(".form-group");
  parent.classList.remove("error");
  parent.classList.add("success");

  const errorSpan = parent.querySelector(".error-message");
  if (errorSpan) errorSpan.textContent = "";

  return true;
}

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 4: VALIDATORS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

function validateUsername() {
  const value = usernameInput.value.trim();

  if (value === "") return showError(usernameInput, "Username is required");
  if (value.length < 3)
    return showError(usernameInput, "At least 3 characters");

  return showSuccess(usernameInput);
}

function validateEmail() {
  const value = emailInput.value.trim();

  if (value === "") return showError(emailInput, "Email is required");
  if (!patterns.email.test(value))
    return showError(emailInput, "Enter valid email");

  return showSuccess(emailInput);
}

function validatePhone() {
  const value = phoneInput.value.trim();

  if (value === "") return showError(phoneInput, "Phone is required");
  if (!patterns.phone.test(value))
    return showError(phoneInput, "Enter 10 digits");

  return showSuccess(phoneInput);
}

function validatePassword() {
  const value = passwordInput.value;

  if (value === "" || value.trim() === "")
    return showError(passwordInput, "Password is required");
  if (value.length < 8)
    return showError(passwordInput, "At least 8 characters");

  return showSuccess(passwordInput);
}

function validateConfirmPassword() {
  const confirmValue = confirmInput.value;
  const passwordValue = passwordInput.value;

  if (confirmValue === "")
    return showError(confirmInput, "Please confirm password");
  if (confirmValue !== passwordValue)
    return showError(confirmInput, "Passwords don't match");

  return showSuccess(confirmInput);
}

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 5: PROGRESS BAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

function updateProgressBar() {
  const formGroups = document.querySelectorAll(".form-group");
  const successCount = document.querySelectorAll(".form-group.success").length;
  const percentage = (successCount / formGroups.length) * 100;

  // Use CSS custom property for progress bar
  progressBar.style.setProperty("--progress", `${percentage}%`);
  progressText.textContent = `${Math.round(percentage)}%`;
}

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 6: PASSWORD STRENGTH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

function updatePasswordStrength() {
  const value = passwordInput.value;

  // Clear if empty
  if (value === "") {
    strengthBar.className = "strength-bar";
    strengthText.className = "strength-text";
    strengthText.textContent = "";
    return;
  }

  // Check criteria
  const hasLetter = patterns.hasLetter.test(value);
  const hasNumber = patterns.hasNumber.test(value);
  const hasSpecial = patterns.hasSpecial.test(value);

  // Determine strength
  let strength;
  if (value.length < 8) {
    strength = "weak";
  } else if (hasLetter && hasNumber && hasSpecial) {
    strength = "strong";
  } else if (hasLetter && hasNumber) {
    strength = "medium";
  } else {
    strength = "weak";
  }

  // Update UI
  strengthBar.className = `strength-bar ${strength}`;
  strengthText.className = `strength-text ${strength}`;
  strengthText.textContent =
    strength.charAt(0).toUpperCase() + strength.slice(1);
}

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 7: PASSWORD TOGGLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

togglePasswordBtn.addEventListener("click", () => {
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  togglePasswordBtn.classList.toggle("active", isPassword);
});

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 8: MODAL FUNCTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

function showModal() {
  successModal.classList.add("active");
}

function hideModal() {
  successModal.classList.remove("active");
  submitBtn.classList.remove("loading");
  form.reset();

  // Reset all form groups
  document.querySelectorAll(".form-group").forEach((group) => {
    group.classList.remove("success", "error");
  });

  // Clear all error messages
  document.querySelectorAll(".error-message").forEach((error) => {
    error.textContent = "";
  });

  // Reset progress
  progressBar.style.width = "0%";
  progressText.textContent = "0% Complete";

  // Reset strength meter
  strengthBar.className = "strength-bar";
  strengthText.className = "strength-text";
  strengthText.textContent = "";
}

closeModalBtn.addEventListener("click", hideModal);

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 9: EVENT LISTENERS (Optimized!)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

// Map inputs to their validators
const validatorMap = [
  { input: usernameInput, validator: validateUsername },
  { input: emailInput, validator: validateEmail },
  { input: phoneInput, validator: validatePhone },
  { input: passwordInput, validator: validatePassword },
  { input: confirmInput, validator: validateConfirmPassword },
];

// Add blur event to each input (DRY approach!)
validatorMap.forEach(({ input, validator }) => {
  input.addEventListener("blur", () => {
    validator();
    updateProgressBar();
  });
});

// Password-specific events
passwordInput.addEventListener("input", updatePasswordStrength);
passwordInput.addEventListener("input", () => {
  // Re-validate confirm password when password changes
  if (confirmInput.value !== "") {
    validateConfirmPassword();
    updateProgressBar();
  }
});

// Form submit
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Run all validators
  const results = validatorMap.map(({ validator }) => validator());
  const allValid = results.every((result) => result === true);

  updateProgressBar();

  if (allValid) {
    submitBtn.classList.add("loading");
    setTimeout(showModal, 1500);
  }
});

/*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 REGEX CHEAT SHEET:
├── Email:      /^[^\s@]+@[^\s@]+\.[^\s@]+$/
├── Phone:      /^\d{10}$/
├── Has Letter: /[a-zA-Z]/
├── Has Number: /\d/
└── Has Special: /[!@#$%^&*]/

⚠️ KEY EDGE CASES TO REMEMBER:
├── Always trim() inputs (except password)
├── Check empty BEFORE other validations
├── Store all validator results before checking (avoid short-circuit)
├── Confirm password is case-sensitive
└── Remove opposite class before adding (error/success)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

*/
