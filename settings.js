document.addEventListener('DOMContentLoaded', () => {
    // Initialize profile images
    const sidebarProfileImage = document.getElementById('sidebarProfileImage');
    const headerProfileImage = document.getElementById('headerProfileImage');
    const defaultAvatar = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2YjdjOTMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjAgMjF2LTJhNCA0IDAgMCAwLTQtNEg4YTQgNCAwIDAgMC00IDR2MiI+PC9wYXRoPjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCIgLz48L3N2Zz4=";

    [sidebarProfileImage, headerProfileImage].forEach(img => {
        if (!img.src || img.src === window.location.href) {
            img.src = defaultAvatar;
        }
    });

    // Settings Navigation
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.settings-section');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetSection = btn.dataset.section;
            
            // Update active states
            navButtons.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(targetSection).classList.add('active');
        });
    });

    // Theme Options
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            themeOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            // Here you would implement theme switching logic
        });
    });

    // Color Options
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            colorOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            const color = option.style.getPropertyValue('--color');
            document.documentElement.style.setProperty('--primary-color', color);
        });
    });

    // Form Editing
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const formGroup = btn.closest('.form-group');
            const input = formGroup.querySelector('.settings-input');
            
            if (input.disabled) {
                input.disabled = false;
                input.focus();
                btn.innerHTML = '<i class="fas fa-check"></i>';
                btn.style.color = 'var(--primary-color)';
            } else {
                input.disabled = true;
                btn.innerHTML = input.type === 'password' ? 
                    '<i class="fas fa-key"></i>' : 
                    '<i class="fas fa-pen"></i>';
                btn.style.color = '';
                saveChanges(input.name, input.value);
            }
        });
    });

    // Handle logout
    const logoutBtn = document.querySelector('.logout-btn');
    logoutBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
            // Implement logout logic here
            console.log('Logging out...');
            window.location.href = 'login.html'; // Redirect to login page
        }
    });

    // Handle account deletion
    const deleteAccountBtn = document.querySelector('.delete-account-btn');
    deleteAccountBtn.addEventListener('click', () => {
        const confirmation = prompt('Type "DELETE" to confirm account deletion:');
        if (confirmation === 'DELETE') {
            // Implement account deletion logic here
            console.log('Deleting account...');
            window.location.href = 'login.html'; // Redirect to login page
        }
    });

    // Save changes function
    async function saveChanges(field, value) {
        try {
            console.log(`Saving ${field}:`, value);
            // Here you would implement API calls to save changes
            // const response = await fetch('/api/settings', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ [field]: value })
            // });
            // const result = await response.json();
            // return result;
        } catch (error) {
            console.error('Error saving changes:', error);
        }
    }

    // Handle notification toggles
    const toggleSwitches = document.querySelectorAll('.switch input[type="checkbox"]');
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            const setting = e.target.closest('.toggle-item').querySelector('span').textContent;
            const enabled = e.target.checked;
            saveChanges(setting, enabled);
        });
    });

    // Handle text size changes
    const textSizeSelect = document.querySelector('select[class="settings-input"]');
    if (textSizeSelect) {
        textSizeSelect.addEventListener('change', (e) => {
            const size = e.target.value;
            document.documentElement.style.fontSize = {
                'small': '14px',
                'medium': '16px',
                'large': '18px'
            }[size];
            saveChanges('textSize', size);
        });
    }
}); 