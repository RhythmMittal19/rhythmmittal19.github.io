/*

┌─────────────────────────────────────────────────────────────────────────┐
│                        MULTI-STEP FORM FLOW                             │
└─────────────────────────────────────────────────────────────────────────┘

    ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
    │ Step 1  │────▶│ Step 2  │────▶│ Step 3  │────▶│ Step 4  │
    │Personal │     │ Contact │     │ Account │     │ Confirm │
    └────┬────┘     └────┬────┘     └────┬────┘     └────┬────┘
         │               │               │               │
         ▼               ▼               ▼               ▼
    ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
    │Validate │     │Validate │     │Validate │     │ Submit  │
    │Step 1   │     │Step 2   │     │Step 3   │     │  Form   │
    └─────────┘     └─────────┘     └─────────┘     └─────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                      NEXT BUTTON CLICK                                  │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Validate Current │
                    │      Step        │
                    └────────┬─────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
        ┌───────────┐                 ┌───────────┐
        │   VALID   │                 │  INVALID  │
        └─────┬─────┘                 └─────┬─────┘
              │                             │
              ▼                             ▼
        ┌───────────┐                 ┌───────────┐
        │currentStep│                 │Show errors│
        │    ++     │                 │   STOP    │
        └─────┬─────┘                 └───────────┘
              │
              ▼
        ┌───────────┐
        │ showStep()│
        └───────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                      showStep(stepNumber)                               │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────────┐
        │  1. Hide all form steps                     │
        │  2. Show step matching stepNumber           │
        │  3. Update step indicators                  │
        │  4. Update step lines                       │
        │  5. Update prev/next/submit buttons         │
        │  6. If step 4 → populate summary            │
        └─────────────────────────────────────────────┘

*/

/*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1: Define State
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

let currentStep = 1
const totalSteps = 4

*/

let currentStep = 1;
const totalSteps = 4;

/*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2: Grab Elements
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

├── All form steps (querySelectorAll)
├── All step indicators (querySelectorAll)
├── All step lines (querySelectorAll)
├── Prev button
├── Next button
├── Submit button
├── Form element
├── Modal elements
└── All input fields for each step

*/

// Form & Steps
const form = document.getElementById("multiStepForm");
const formSteps = document.querySelectorAll(".form-step");
const stepItems = document.querySelectorAll(".step-item");
const stepLines = document.querySelectorAll(".step-line");

// Navigation Buttons
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");

// Modal
const successModal = document.getElementById("successModal");
const closeModal = document.getElementById("closeModal");

// Step 1: Personal Info
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const dob = document.getElementById("dob");

// Step 2: Contact Info
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const address = document.getElementById("address");

// Step 3: Account Setup
const username = document.getElementById("username");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

// Step 4: Summary Values
const summaryName = document.getElementById("summaryName");
const summaryDob = document.getElementById("summaryDob");
const summaryEmail = document.getElementById("summaryEmail");
const summaryPhone = document.getElementById("summaryPhone");
const summaryAddress = document.getElementById("summaryAddress");
const summaryUsername = document.getElementById("summaryUsername");

/*

Regex Patterns:
├── email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
└── phone: /^\d{10}$/

*/

const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\d{10}$/,
};

/*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3: HELPER FUNCTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function showError(input, message):
├── Get parent: input.closest(".form-group")
├── Remove "success" class from parent
├── Add "error" class to parent
├── Find error span: parent.querySelector(".error-message")
├── Set errorSpan.textContent = message
└── return false

function showSuccess(input):
├── Get parent: input.closest(".form-group")
├── Remove "error" class from parent
├── Add "success" class to parent
├── Find error span: parent.querySelector(".error-message")
├── Set errorSpan.textContent = ""
└── return true

*/

function showError(input, message) {
  let parent = input.closest(".form-group");
  parent.classList.remove("success");
  parent.classList.add("error");

  let errorSpan = parent.querySelector(".error-message");
  errorSpan.textContent = message;
  return false;
}

function showSuccess(input) {
  let parent = input.closest(".form-group");
  parent.classList.remove("error");
  parent.classList.add("success");

  let errorSpan = parent.querySelector(".error-message");
  errorSpan.textContent = "";
  return true;
}

/*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4: VALIDATORS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function validateStep1():
│
├── Validate firstName:
│   ├── value = firstName.value.trim()
│   ├── IF value === "" → showError(firstName, "First name is required")
│   ├── ELSE IF value.length < 2 → showError(firstName, "At least 2 characters")
│   └── ELSE → showSuccess(firstName)
│
├── Validate lastName:
│   ├── value = lastName.value.trim()
│   ├── IF value === "" → showError(lastName, "Last name is required")
│   ├── ELSE IF value.length < 2 → showError(lastName, "At least 2 characters")
│   └── ELSE → showSuccess(lastName)
│
├── Validate dob:
│   ├── value = dob.value
│   ├── IF value === "" → showError(dob, "Date of birth is required")
│   └── ELSE → showSuccess(dob)
│
└── RETURN: Store all results first, then return all && together
    const a = (firstName validation result)
    const b = (lastName validation result)
    const c = (dob validation result)
    return a && b && c

*/

function validateStep1() {
  // Validate firstName
  const fValue = firstName.value.trim();
  let a;

  if (fValue === "") {
    a = showError(firstName, "First name is required");
  } else if (fValue.length < 2) {
    a = showError(firstName, "At least 2 characters");
  } else {
    a = showSuccess(firstName);
  }

  // Validate lastName
  const lValue = lastName.value.trim();
  let b;

  if (lValue === "") {
    b = showError(lastName, "Last name is required");
  } else if (lValue.length < 2) {
    b = showError(lastName, "At least 2 characters");
  } else {
    b = showSuccess(lastName);
  }

  // Validate dob
  const dobValue = dob.value;
  let c;

  if (dobValue === "") {
    c = showError(dob, "Date of birth is required");
  } else {
    c = showSuccess(dob);
  }

  return a && b && c;
}

/*

function validateStep2():
│
├── Validate email:
│   ├── value = email.value.trim()
│   ├── IF value === "" → showError(email, "Email is required")
│   ├── ELSE IF !patterns.email.test(value) → showError(email, "Enter valid email")
│   └── ELSE → showSuccess(email)
│
├── Validate phone:
│   ├── value = phone.value.trim()
│   ├── IF value === "" → showError(phone, "Phone is required")
│   ├── ELSE IF !patterns.phone.test(value) → showError(phone, "Enter 10 digits")
│   └── ELSE → showSuccess(phone)
│
├── Validate address:
│   ├── value = address.value.trim()
│   ├── IF value === "" → showError(address, "Address is required")
│   └── ELSE → showSuccess(address)
│
└── RETURN: all three results && together

*/

function validateStep2() {
  // Validate email
  const emailValue = email.value.trim();
  let a;

  if (emailValue === "") {
    a = showError(email, "Email is required");
  } else if (!patterns.email.test(emailValue)) {
    a = showError(email, "Enter valid email");
  } else {
    a = showSuccess(email);
  }

  // Validate phone
  const phoneValue = phone.value.trim();
  let b;

  if (phoneValue === "") {
    b = showError(phone, "Phone is required");
  } else if (!patterns.phone.test(phoneValue)) {
    b = showError(phone, "Enter 10 digits");
  } else {
    b = showSuccess(phone);
  }

  // Validate address
  const addressValue = address.value.trim();
  let c;

  if (addressValue === "") {
    c = showError(address, "Address is required");
  } else {
    c = showSuccess(address);
  }

  return a && b && c;
}

/*

function validateStep3():
│
├── Validate username:
│   ├── value = username.value.trim()
│   ├── IF value === "" → showError(username, "Username is required")
│   ├── ELSE IF value.length < 3 → showError(username, "At least 3 characters")
│   └── ELSE → showSuccess(username)
│
├── Validate password:
│   ├── value = password.value
│   ├── IF value === "" → showError(password, "Password is required")
│   ├── ELSE IF value.length < 8 → showError(password, "At least 8 characters")
│   └── ELSE → showSuccess(password)
│
├── Validate confirmPassword:
│   ├── value = confirmPassword.value
│   ├── IF value === "" → showError(confirmPassword, "Please confirm password")
│   ├── ELSE IF value !== password.value → showError(confirmPassword, "Passwords don't match")
│   └── ELSE → showSuccess(confirmPassword)
│
└── RETURN: all three results && together

*/

function validateStep3() {
  // Validate username
  const userValue = username.value.trim();
  let a;

  if (userValue === "") {
    a = showError(username, "Username is required");
  } else if (userValue.length < 3) {
    a = showError(username, "At least 3 characters");
  } else {
    a = showSuccess(username);
  }

  // Validate password
  const passValue = password.value;
  let b;

  if (passValue === "") {
    b = showError(password, "Password is required");
  } else if (passValue.length < 8) {
    b = showError(password, "At least 8 characters");
  } else {
    b = showSuccess(password);
  }

  // Validate confirmPassword
  const confirmValue = confirmPassword.value;
  let c;

  if (confirmValue === "") {
    c = showError(confirmPassword, "Please confirm password");
  } else if (confirmValue !== password.value) {
    c = showError(confirmPassword, "Passwords don't match");
  } else {
    c = showSuccess(confirmPassword);
  }

  return a && b && c;
}

/*

function validateCurrentStep():
├── IF currentStep === 1 → return validateStep1()
├── IF currentStep === 2 → return validateStep2()
├── IF currentStep === 3 → return validateStep3()
└── IF currentStep === 4 → return true (no validation needed)

*/

function validateCurrentStep() {
  if (currentStep === 1) return validateStep1();
  if (currentStep === 2) return validateStep2();
  if (currentStep === 3) return validateStep3();
  if (currentStep === 4) return true;
}

/*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5: POPULATE SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function populateSummary():
├── summaryName.textContent = firstName.value + " " + lastName.value
├── summaryDob.textContent = dob.value (or format nicely with Date)
├── summaryEmail.textContent = email.value
├── summaryPhone.textContent = phone.value
├── summaryAddress.textContent = address.value
└── summaryUsername.textContent = username.value

*/

function populateSummary() {
  summaryName.textContent = firstName.value + " " + lastName.value;
  summaryDob.textContent = formatDate(dob.value);
  summaryEmail.textContent = email.value;
  summaryPhone.textContent = phone.value;
  summaryAddress.textContent = address.value;
  summaryUsername.textContent = username.value;
}

function formatDate(dateString) {
  if (!dateString) return "Not provided";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 6: SHOW STEP FUNCTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function showStep(stepNumber):
│
├── PART A: Update form steps visibility
│   │
│   └── LOOP through formSteps:
│       ├── Remove "active" class from this step
│       └── IF parseInt(step.dataset.step) === stepNumber
│           └── Add "active" class
│
├── PART B: Update step indicators (circles)
│   │
│   └── LOOP through stepItems with INDEX:
│       │
│       ├── Remove "active" and "completed" classes first
│       │
│       ├── IF (index + 1) < stepNumber
│       │   └── Add "completed" class (past step)
│       │
│       └── ELSE IF (index + 1) === stepNumber
│           └── Add "active" class (current step)
│
├── PART C: Update step lines
│   │
│   └── LOOP through stepLines with INDEX:
│       │
│       ├── IF (index + 1) < stepNumber
│       │   └── Add "completed" class
│       │
│       └── ELSE
│           └── Remove "completed" class
│
├── PART D: Update navigation buttons
│   │
│   ├── IF stepNumber === 1
│   │   └── prevBtn.disabled = true
│   ├── ELSE
│   │   └── prevBtn.disabled = false
│   │
│   ├── IF stepNumber === totalSteps
│   │   ├── nextBtn.style.display = "none"
│   │   └── submitBtn.style.display = "flex"
│   └── ELSE
│       ├── nextBtn.style.display = "flex"
│       └── submitBtn.style.display = "none"
│
└── PART E: Populate summary if on last step
    │
    └── IF stepNumber === totalSteps
        └── Call populateSummary()

*/

function showStep(stepNumber) {
  formSteps.forEach((formstep) => {
    formstep.classList.remove("active");
    if (parseInt(formstep.dataset.step) === stepNumber) {
      formstep.classList.add("active");
    }
  });

  stepItems.forEach((step, index) => {
    step.classList.remove("active", "completed");
    if (index + 1 < stepNumber) {
      step.classList.add("completed");
    } else if (index + 1 === stepNumber) {
      step.classList.add("active");
    }
  });

  stepLines.forEach((line, index) => {
    if (index + 1 < stepNumber) {
      line.classList.add("completed");
    } else {
      line.classList.remove("completed");
    }
  });

  if (stepNumber === 1) {
    prevBtn.disabled = true;
  } else {
    prevBtn.disabled = false;
  }

  if (stepNumber === totalSteps) {
    nextBtn.style.display = "none";
    submitBtn.style.display = "flex";
  } else {
    nextBtn.style.display = "flex";
    submitBtn.style.display = "none";
  }

  if (stepNumber === totalSteps) {
    populateSummary();
  }
}

/*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 7: NAVIGATION FUNCTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function nextStep():
├── IF validateCurrentStep() === false
│   └── return (stop, don't proceed)
│
└── IF currentStep < totalSteps
    ├── currentStep++
    └── showStep(currentStep)


function prevStep():
└── IF currentStep > 1
    ├── currentStep--
    └── showStep(currentStep)

*/

function nextStep() {
  if (validateCurrentStep() === false) {
    return;
  }

  if (currentStep < totalSteps) {
    currentStep++;
    showStep(currentStep);
  }
}

function prevStep() {
  if (currentStep > 1) {
    currentStep--;
    showStep(currentStep);
  }
}

/*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 8: MODAL FUNCTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function showModal():
└── successModal.classList.add("active")


function hideModal():
├── successModal.classList.remove("active")
├── form.reset()
├── Remove "success" and "error" from all .form-group elements
├── currentStep = 1
└── showStep(1)

*/

function showModalSuccess() {
  successModal.classList.add("active");
}

function hideModal() {
  successModal.classList.remove("active");
  form.reset();

  document.querySelectorAll(".form-group").forEach((group) => {
    group.classList.remove("success", "error");
  });

  currentStep = 1;
  showStep(1);
}

/*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 9: EVENT LISTENERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

nextBtn.addEventListener("click", nextStep)

prevBtn.addEventListener("click", prevStep)

form.addEventListener("submit", (event) => {
├── event.preventDefault()
└── showModal()
})

closeModal.addEventListener("click", hideModal)

*/

nextBtn.addEventListener("click", nextStep);

prevBtn.addEventListener("click", prevStep);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  showModalSuccess();
});

closeModal.addEventListener("click", hideModal);

/*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 10: INITIALIZE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

showStep(1)

*/

showStep(1);
