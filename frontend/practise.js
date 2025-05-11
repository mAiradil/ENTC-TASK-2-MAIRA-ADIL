window.addEventListener('DOMContentLoaded', () => {
    const name = localStorage.getItem('userFullName');
    if (name) {
      document.getElementById('welcomeUser').textContent = `Welcome ${name}!`;
    }
  });
  
