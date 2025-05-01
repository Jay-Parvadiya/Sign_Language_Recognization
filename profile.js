document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const personalInfoForm = document.getElementById('personalInfoForm');
    const editInfoBtn = document.getElementById('editInfoBtn');
    const editAvatarBtn = document.getElementById('editAvatarBtn');
    const editCoverBtn = document.getElementById('editCoverBtn');
    const editNameBtn = document.getElementById('editNameBtn');
    const avatarInput = document.getElementById('avatarInput');
    const coverInput = document.getElementById('coverInput');
    const profileImage = document.getElementById('profileImage');
    const usernameInput = document.getElementById('usernameInput');
    const displayName = document.getElementById('displayName');
    const profileCover = document.querySelector('.profile-cover');
    
    // Form fields
    const fields = [
        { display: 'fullNameDisplay', input: 'fullNameInput' },
        { display: 'emailDisplay', input: 'emailInput' },
        { display: 'phoneDisplay', input: 'phoneInput' },
        { display: 'locationDisplay', input: 'locationInput' }
    ];

    // Initialize with default profile image if none exists
    if (!profileImage.src || profileImage.src === window.location.href) {
        profileImage.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2YjdjOTMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjAgMjF2LTJhNCA0IDAgMCAwLTQtNEg4YTQgNCAwIDAgMC00IDR2MiI+PC9wYXRoPjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCIgLz48L3N2Zz4=";
    }

    // Handle username input
    usernameInput.addEventListener('input', (e) => {
        const value = e.target.value;
        if (value) {
            usernameInput.value = value.startsWith('@') ? value : '@' + value;
        }
    });

    usernameInput.addEventListener('blur', () => {
        if (usernameInput.value.trim() === '@') {
            usernameInput.value = '';
        }
    });

    usernameInput.addEventListener('focus', () => {
        if (!usernameInput.value) {
            usernameInput.value = '@';
        }
    });

    // Handle name editing
    editNameBtn.addEventListener('click', () => {
        const currentName = displayName.textContent;
        const newName = prompt('Enter new name:', currentName);
        if (newName && newName.trim()) {
            displayName.textContent = newName.trim();
            saveProfileChanges({
                name: newName.trim(),
                username: usernameInput.value
            });
        }
    });

    // Handle avatar upload
    editAvatarBtn.addEventListener('click', () => {
        avatarInput.click();
    });

    avatarInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profileImage.src = e.target.result;
                saveProfileImage(file);
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle cover upload
    editCoverBtn.addEventListener('click', () => {
        coverInput.click();
    });

    coverInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profileCover.style.backgroundImage = `url(${e.target.result})`;
                profileCover.style.backgroundSize = 'cover';
                profileCover.style.backgroundPosition = 'center';
                saveCoverImage(file);
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle edit mode
    editInfoBtn.addEventListener('click', () => {
        console.log('Edit button clicked');
        personalInfoForm.classList.add('edit-mode');
        
        // Populate input fields with current values
        fields.forEach(field => {
            const displayEl = document.getElementById(field.display);
            const inputEl = document.getElementById(field.input);
            if (displayEl && inputEl) {
                inputEl.value = displayEl.textContent;
                console.log(`Setting ${field.input} value to:`, displayEl.textContent);
            } else {
                console.error(`Missing element: ${field.display} or ${field.input}`);
            }
        });

        // Show form buttons
        const formButtons = document.querySelector('.form-buttons');
        if (formButtons) {
            formButtons.style.display = 'flex';
        } else {
            console.error('Form buttons element not found');
        }
    });

    // Handle form submission
    personalInfoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Update display values
        const formData = getFormData();
        await saveProfileChanges(formData);

        // Exit edit mode
        exitEditMode();
    });

    // Handle cancel button
    const cancelBtn = document.querySelector('.cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', exitEditMode);
    } else {
        console.error('Cancel button not found');
    }

    function exitEditMode() {
        console.log('Exiting edit mode');
        personalInfoForm.classList.remove('edit-mode');
        const formButtons = document.querySelector('.form-buttons');
        if (formButtons) {
            formButtons.style.display = 'none';
        }
    }

    function getFormData() {
        return {
            name: displayName.textContent,
            username: usernameInput.value,
            fullName: document.getElementById('fullNameInput')?.value,
            email: document.getElementById('emailInput')?.value,
            phone: document.getElementById('phoneInput')?.value,
            location: document.getElementById('locationInput')?.value
        };
    }

    async function saveProfileChanges(data) {
        try {
            console.log('Saving profile changes:', data);
            // Here you would make an API call to save the changes
        } catch (error) {
            console.error('Error saving profile changes:', error);
        }
    }

    async function saveProfileImage(file) {
        try {
            console.log('Uploading profile image:', file);
            // Here you would upload the image to your server
        } catch (error) {
            console.error('Error uploading profile image:', error);
        }
    }

    async function saveCoverImage(file) {
        try {
            console.log('Uploading cover image:', file);
            // Here you would upload the cover image to your server
        } catch (error) {
            console.error('Error uploading cover image:', error);
        }
    }
}); 