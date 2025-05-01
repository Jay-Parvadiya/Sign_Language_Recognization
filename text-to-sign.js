document.addEventListener('DOMContentLoaded', () => {
    const translateButton = document.querySelector('.translate-button');
    const textInput = document.querySelector('.text-input textarea');
    const signOutput = document.querySelector('.sign-output');
    let isTranslating = false;

    // Handle translate button click
    translateButton.addEventListener('click', async () => {
        const text = textInput.value.trim();
        
        if (!text) {
            alert('Please enter some text to translate.');
            return;
        }

        if (isTranslating) {
            return;
        }

        try {
            isTranslating = true;
            translateButton.disabled = true;
            translateButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Translating...</span>';
            signOutput.textContent = 'Processing translation...';

            // Here you would typically send the text to your backend
            // for sign language translation
            // For now, we'll simulate a delay
            await simulateTranslation(text);

        } catch (error) {
            console.error('Translation error:', error);
            signOutput.textContent = 'An error occurred during translation. Please try again.';
        } finally {
            isTranslating = false;
            translateButton.disabled = false;
            translateButton.innerHTML = '<i class="fas fa-language"></i><span>Translate</span>';
        }
    });

    // Simulate translation process
    function simulateTranslation(text) {
        return new Promise((resolve) => {
            setTimeout(() => {
                signOutput.textContent = `Translation will be shown here for: "${text}"`;
                resolve();
            }, 2000);
        });
    }

    // Auto-resize textarea
    textInput.addEventListener('input', () => {
        textInput.style.height = 'auto';
        textInput.style.height = textInput.scrollHeight + 'px';
    });

    // Handle Enter key in textarea
    textInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            translateButton.click();
        }
    });

    // Handle navigation active state
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        if (link.href === window.location.href) {
            link.parentElement.classList.add('active');
        }
    });
}); 