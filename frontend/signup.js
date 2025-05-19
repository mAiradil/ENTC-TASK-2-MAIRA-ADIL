const roleRadios = document.getElementsByName('role');
const studentFields = document.getElementById('studentFields');
const staffFields = document.getElementById('staffFields');
const emailInput = document.getElementById('email');
const dietDropdown = document.getElementById('hasDiet');
const dietDetails = document.getElementById('dietDetails');
const togglePassword = document.getElementById('togglePassword');
const passwordField = document.getElementById('password');
const fullNameInput = document.getElementById('fullName');
const form = document.getElementById('signupForm');

// Role toggle
roleRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    studentFields.style.display = radio.value === 'student' ? 'block' : 'none';
    staffFields.style.display = radio.value === 'staff' ? 'block' : 'none';
  });
});

// Dietary toggle
function toggleDietDetails() {
  dietDetails.style.display = dietDropdown.value === 'yes' ? 'block' : 'none';
}

// Password toggle
togglePassword.addEventListener('click', () => {
  const isPassword = passwordField.type === 'password';
  passwordField.type = isPassword ? 'text' : 'password';
  togglePassword.textContent = isPassword ? '🙉' : '🙈';
});

// ✅ Main Form Submit Handler
form.addEventListener('submit', function (e) {
  e.preventDefault(); // Stop real form submission

  const email = emailInput.value;
  if (!email.includes('@')) {
    alert("Please enter a valid email address with '@'.");
    return;
  }

  const fullName = fullNameInput.value;
  localStorage.setItem('userFullName', fullName);

  // ✅ Redirect after storing name
  window.location.href = 'practise.html';
});
