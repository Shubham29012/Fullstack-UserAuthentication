
document.addEventListener('DOMContentLoaded', function() {
    
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', validateRegisterForm);
    }
    
  
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', validateLoginForm);
    }
    
    initSessionTimeoutWarning();
  });
  
  
  function validateRegisterForm(event) {
    let isValid = true;
  
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
   
    const usernameError = document.getElementById('username-error');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const confirmPasswordError = document.getElementById('confirmPassword-error');
   
    usernameError.textContent = '';
    emailError.textContent = '';
    passwordError.textContent = '';
    confirmPasswordError.textContent = '';
    
   
    if (!usernameInput.value.trim()) {
      usernameError.textContent = 'Username is required';
      isValid = false;
    } else if (!/^[a-zA-Z0-9_]{3,50}$/.test(usernameInput.value)) {
      usernameError.textContent = 'Username must be 3-50 characters and contain only letters, numbers, and underscores';
      isValid = false;
    }
    
    if (!emailInput.value.trim()) {
      emailError.textContent = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
      emailError.textContent = 'Please enter a valid email address';
      isValid = false;
    }
   
    if (!passwordInput.value) {
      passwordError.textContent = 'Password is required';
      isValid = false;
    } else if (passwordInput.value.length < 8) {
      passwordError.textContent = 'Password must be at least 8 characters long';
      isValid = false;
    }
  
    if (!confirmPasswordInput.value) {
      confirmPasswordError.textContent = 'Please confirm your password';
      isValid = false;
    } else if (passwordInput.value !== confirmPasswordInput.value) {
      confirmPasswordError.textContent = 'Passwords do not match';
      isValid = false;
    }
    
    if (!isValid) {
      event.preventDefault();
    }
  }
  
 
  function validateLoginForm(event) {
    let isValid = true;
    
    const identifierInput = document.getElementById('identifier');
    const passwordInput = document.getElementById('password');
   
    const identifierError = document.getElementById('identifier-error');
    const passwordError = document.getElementById('password-error');
    const recaptchaError = document.getElementById('recaptcha-error');
   
    identifierError.textContent = '';
    passwordError.textContent = '';
    recaptchaError.textContent = '';

    if (!identifierInput.value.trim()) {
      identifierError.textContent = 'Username or email is required';
      isValid = false;
    }
    
    
    if (!passwordInput.value) {
      passwordError.textContent = 'Password is required';
      isValid = false;
    }
    
    // Validate reCAPTCHA
    if (typeof grecaptcha !== 'undefined') {
      const recaptchaResponse = grecaptcha.getResponse();
      if (!recaptchaResponse) {
        recaptchaError.textContent = 'Please complete the reCAPTCHA';
        isValid = false;
      }
    }
    
    if (!isValid) {
      event.preventDefault();
    }
  }
  
  
  function initSessionTimeoutWarning() {
    
    const warningElement = document.querySelector('.alert-warning');
    if (warningElement && warningElement.textContent.includes('session will expire')) {
      // If warning is present, set a timer to refresh or logout
      setTimeout(() => {
        if (confirm('Your session is about to expire. Would you like to refresh your session?')) {
          
          window.location.reload();
        }
      }, 60000); e
    }
  }