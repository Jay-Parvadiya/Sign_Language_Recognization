const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
const sendVerificationBtn = document.querySelector("#sendVerificationBtn");
const verifyCodeBtn = document.querySelector("#verifyCodeBtn");
const resendCodeBtn = document.querySelector("#resendCodeBtn");
const verificationSection = document.querySelector(".verification-section");
const signUpSubmit = document.querySelector("#signUpSubmit");
const emailInput = document.querySelector("#email");

// Form elements
const signInForm = document.querySelector("#signInForm");
const signUpForm = document.querySelector("#signUpForm");
const passwordInput = document.querySelector("#password");
const phoneInput = document.querySelector("#phone");
const fullNameInput = document.querySelector("#fullName");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

// Validation functions
function showError(input, message) {
  const formField = input.parentElement;
  formField.classList.add('error');
  formField.classList.remove('valid');
  const error = formField.querySelector('.error-message');
  error.textContent = message;
}

function showSuccess(input) {
  const formField = input.parentElement;
  formField.classList.remove('error');
  formField.classList.add('valid');
  const error = formField.querySelector('.error-message');
  error.textContent = '';
}

function validateEmail(input) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!input.value.trim()) {
    showError(input, 'Email is required');
    return false;
  } else if (!emailRegex.test(input.value)) {
    showError(input, 'Please enter a valid email address');
    return false;
  }
  showSuccess(input);
  return true;
}

function validatePhone(input) {
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!input.value.trim()) {
    showError(input, 'Phone number is required');
    return false;
  } else if (!phoneRegex.test(input.value)) {
    showError(input, 'Please enter a valid 10-digit Indian phone number');
    return false;
  }
  showSuccess(input);
  return true;
}

function validateFullName(input) {
  const nameRegex = /^[A-Za-z\s]+$/;
  if (!input.value.trim()) {
    showError(input, 'Full name is required');
    return false;
  } else if (!nameRegex.test(input.value)) {
    showError(input, 'Name should only contain letters and spaces');
    return false;
  } else if (input.value.trim().length < 3) {
    showError(input, 'Name should be at least 3 characters long');
    return false;
  }
  showSuccess(input);
  return true;
}

function validatePassword(input) {
  const password = input.value;
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*]/.test(password)
  };

  // Update requirement list UI
  Object.keys(requirements).forEach(req => {
    const li = document.getElementById(req);
    if (li) {
      if (requirements[req]) {
        li.classList.add('valid');
      } else {
        li.classList.remove('valid');
      }
    }
  });

  if (!password) {
    showError(input, 'Password is required');
    return false;
  }

  const isValid = Object.values(requirements).every(Boolean);
  if (!isValid) {
    showError(input, 'Please meet all password requirements');
    return false;
  }

  showSuccess(input);
  return true;
}

// Real-time validation
emailInput.addEventListener('input', () => validateEmail(emailInput));
phoneInput.addEventListener('input', () => validatePhone(phoneInput));
fullNameInput.addEventListener('input', () => validateFullName(fullNameInput));
passwordInput.addEventListener('input', () => validatePassword(passwordInput));

// Form submission
signUpForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const isEmailValid = validateEmail(emailInput);
  const isPhoneValid = validatePhone(phoneInput);
  const isNameValid = validateFullName(fullNameInput);
  const isPasswordValid = validatePassword(passwordInput);

  if (isEmailValid && isPhoneValid && isNameValid && isPasswordValid) {
    // Proceed with form submission
    console.log('Form is valid, proceeding with submission');
  }
});

signInForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const signInEmail = document.querySelector("#signInEmail");
  const signInPassword = document.querySelector("#signInPassword");
  
  const isEmailValid = validateEmail(signInEmail);
  const isPasswordValid = signInPassword.value.length >= 8;

  if (!isPasswordValid) {
    showError(signInPassword, 'Password must be at least 8 characters');
    return;
  }

  if (isEmailValid && isPasswordValid) {
    // Redirect to dashboard
    window.location.href = 'dashboard.html';
  }
});

// Email verification process
let verificationCode = '';

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function simulateEmailSending(email, code) {
  console.log(`Sending verification code ${code} to ${email}`);
  alert(`Verification code sent to ${email}! (For demo: ${code})`);
}

sendVerificationBtn.addEventListener("click", () => {
  if (!validateEmail(emailInput)) {
    return;
  }

  verificationCode = generateVerificationCode();
  simulateEmailSending(emailInput.value, verificationCode);
  
  verificationSection.style.display = 'block';
  sendVerificationBtn.style.display = 'none';
});

verifyCodeBtn.addEventListener("click", () => {
  const codeInput = document.querySelector("#verificationCode");
  const enteredCode = codeInput.value;
  
  if (!enteredCode.match(/^\d{6}$/)) {
    showError(codeInput, 'Please enter a valid 6-digit code');
    return;
  }
  
  if (enteredCode === verificationCode) {
    alert('Email verified successfully!');
    verificationSection.style.display = 'none';
    signUpSubmit.style.display = 'block';
    showSuccess(codeInput);
  } else {
    showError(codeInput, 'Invalid verification code');
  }
});

resendCodeBtn.addEventListener("click", () => {
  if (!validateEmail(emailInput)) {
    return;
  }
  
  verificationCode = generateVerificationCode();
  simulateEmailSending(emailInput.value, verificationCode);
});