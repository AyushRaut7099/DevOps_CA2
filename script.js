// script.js - Form Validation using JavaScript

function validateForm() {
  // Clear previous errors
  clearErrors();

  let isValid = true;

  // 1. Student Name validation
  const name = document.getElementById("studentName").value.trim();
  if (name === "") {
    showError("nameError", "studentName");
    isValid = false;
  }

  // 2. Email validation
  const email = document.getElementById("emailId").value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email === "" || !emailPattern.test(email)) {
    showError("emailError", "emailId");
    isValid = false;
  }

  // 3. Mobile Number validation (10 digits only)
  const mobile = document.getElementById("mobileNum").value.trim();
  const mobilePattern = /^[0-9]{10}$/;
  if (!mobilePattern.test(mobile)) {
    showError("mobileError", "mobileNum");
    isValid = false;
  }

  // 4. Department validation
  const dept = document.getElementById("department").value;
  if (dept === "") {
    showError("deptError", "department");
    isValid = false;
  }

  // 5. Gender validation
  const genderOptions = document.querySelectorAll('input[name="gender"]');
  let genderSelected = false;
  genderOptions.forEach(function(option) {
    if (option.checked) {
      genderSelected = true;
    }
  });
  if (!genderSelected) {
    document.getElementById("genderError").style.display = "block";
    isValid = false;
  }

  // 6. Feedback Comments validation (not blank, min 10 words)
  const feedback = document.getElementById("feedback").value.trim();
  const wordCount = feedback.split(/\s+/).filter(function(w) {
    return w.length > 0;
  }).length;

  if (feedback === "" || wordCount < 10) {
    showError("feedbackError", "feedback");
    isValid = false;
  }

  // If all validations pass, show success message
  if (isValid) {
    document.getElementById("successMsg").style.display = "block";
    document.getElementById("feedbackForm").reset();
    // Scroll to success message
    document.getElementById("successMsg").scrollIntoView({ behavior: "smooth" });
  }

  // Prevent actual form submission
  return false;
}

// Helper: show error message and highlight input
function showError(errorId, inputId) {
  document.getElementById(errorId).style.display = "block";
  var inputEl = document.getElementById(inputId);
  if (inputEl) {
    inputEl.classList.add("input-error");
  }
}

// Helper: clear all error messages and highlights
function clearErrors() {
  var errors = document.querySelectorAll(".error-msg");
  errors.forEach(function(e) {
    e.style.display = "none";
  });

  var inputs = document.querySelectorAll(".input-error");
  inputs.forEach(function(i) {
    i.classList.remove("input-error");
  });

  document.getElementById("successMsg").style.display = "none";
}

// Reset button handler
function resetForm() {
  clearErrors();
  document.getElementById("successMsg").style.display = "none";
}