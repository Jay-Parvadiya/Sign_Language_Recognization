document.addEventListener('DOMContentLoaded', () => {
    const micButton = document.querySelector('.mic-button');
    const speechText = document.querySelector('.speech-text p');
    const signOutput = document.querySelector('.sign-output');
    let isRecording = false;
    let recognition = null;

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = () => {
            speechText.textContent = 'Listening...';
            micButton.style.background = '#45B7AF';
            micButton.querySelector('i').className = 'fas fa-stop';
        };

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');
            
            speechText.textContent = transcript;
            
            // Here you would typically send the transcript to your backend
            // for sign language translation
            signOutput.textContent = 'Processing translation...';
        };

        recognition.onend = () => {
            isRecording = false;
            micButton.style.background = '';
            micButton.querySelector('i').className = 'fas fa-microphone';
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            speechText.textContent = 'Error occurred. Please try again.';
            isRecording = false;
            micButton.style.background = '';
            micButton.querySelector('i').className = 'fas fa-microphone';
        };
    }

    // Handle mic button click
    micButton.addEventListener('click', () => {
        if (!recognition) {
            alert('Speech recognition is not supported in your browser. Please use Chrome.');
            return;
        }

        if (!isRecording) {
            recognition.start();
            isRecording = true;
        } else {
            recognition.stop();
            isRecording = false;
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