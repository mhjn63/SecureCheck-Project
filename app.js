const passwordInput = document.getElementById('password-input');
const toggleBtn = document.getElementById('toggle-password');
const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');
const requirementsList = document.getElementById('requirements-list');

// Common weak words
const commonWords = ["password", "123456", "qwerty", "admin", "welcome", "love", "111111"];

const requirements = [
    { regex: /.{8,}/, index: 0 }, 
    { regex: /[a-z]/, index: 1 }, 
    { regex: /[A-Z]/, index: 2 }, 
    { regex: /[0-9]/, index: 3 }, 
    { regex: /[^A-Za-z0-9]/, index: 4 }, 
    { regex: (pwd) => !commonWords.some(w => pwd.toLowerCase().includes(w)), index: 5 } 
];

const requirementItems = Array.from(requirementsList.querySelectorAll('li'));

passwordInput.addEventListener('input', () => {
    const value = passwordInput.value;
    let score = 0;

    requirements.forEach(req => {
        const isValid = typeof req.regex === 'function' ? req.regex(value) : req.regex.test(value);
        const item = requirementItems[req.index];
        const icon = item.querySelector('i');

        if (isValid && value.length > 0) {
            score++;
            item.classList.add('valid');
            icon.className = 'fa-solid fa-circle-check'; // Solid check
        } else {
            item.classList.remove('valid');
            icon.className = 'fa-solid fa-circle'; // Empty circle
        }
    });

    const percent = Math.min((score / requirements.length) * 100, 100);
    strengthBar.style.width = `${percent}%`;

    updateMeterColor(score, value.length);
});

function updateMeterColor(score, length) {
    let color = '#cbd5e1'; // Grey (default)
    let status = 'Enter Password';

    if(length === 0) {
        strengthBar.style.width = '0%';
        strengthBar.style.backgroundColor = 'transparent';
        strengthText.innerText = status;
        strengthText.style.color = '#64748b';
        return;
    }

    if (score <= 2) {
        color = '#ef4444'; // Red
        status = 'Weak';
    } else if (score <= 4) {
        color = '#f59e0b'; // Orange/Yellow
        status = 'Medium';
    } else if (score === 5) {
        color = '#10b981'; // Teal/Green
        status = 'Strong';
    } else if (score === 6) {
        color = '#059669'; // Deep Green
        status = 'Very Strong';
    }

    strengthBar.style.backgroundColor = color;
    strengthBar.style.boxShadow = `0 0 10px ${color}40`; // Soft glow with opacity
    strengthText.innerText = status;
    strengthText.style.color = color;
}

toggleBtn.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    const icon = toggleBtn.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
});