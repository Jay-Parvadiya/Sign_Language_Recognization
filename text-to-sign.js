document.addEventListener('DOMContentLoaded', () => {
    const translateButton = document.querySelector('.translate-button');
    const textInput = document.querySelector('.text-input textarea');
    const signOutput = document.querySelector('.sign-output');
    const API_URL = 'http://localhost:5000';
    let currentImageIndex = 0;
    let currentImages = [];
    let isPlaying = false;
    let playInterval = null;
    const PLAY_INTERVAL_MS = 1000; // 1 second per gesture

    // Initialize profile images
    const profileImages = document.querySelectorAll('img[src=""]');
    const defaultAvatar = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2YjdjOTMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjAgMjF2LTJhNCA0IDAgMCAwLTQtNEg4YTQgNCAwIDAgMC00IDR2MiI+PC9wYXRoPjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCIgLz48L3N2Zz4=";
    profileImages.forEach(img => {
        if (!img.src || img.src === window.location.href) {
            img.src = defaultAvatar;
        }
    });

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .loading {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 200px;
        }
        .loading::after {
            content: '';
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid var(--primary-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .error-message {
            color: #ff6b6b;
            padding: 1rem;
            border-radius: 8px;
            background: #fff5f5;
            border: 1px solid #ff8787;
            margin-top: 1rem;
        }
        .sign-output {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 12px;
            gap: 1rem;
        }
        .image-container {
            width: 300px;
            height: 300px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            padding: 1rem;
            margin: 1rem 0;
        }
        .sign-output img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            transition: transform 0.2s;
        }
        .sign-output img:hover {
            transform: scale(1.05);
        }
        .navigation-controls {
            display: flex;
            gap: 1rem;
            align-items: center;
            margin-top: 1rem;
        }
        .nav-button {
            padding: 0.5rem 1rem;
            border: none;
            background: var(--primary-color);
            color: white;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .nav-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        .nav-button i {
            font-size: 1.2rem;
        }
        .play-button {
            min-width: 100px;
            justify-content: center;
        }
        .play-button.playing {
            background: #dc3545;
        }
        .speed-control {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-top: 1rem;
        }
        .speed-control select {
            padding: 0.25rem;
            border-radius: 4px;
            border: 1px solid #ccc;
        }
        .speed-label {
            color: #666;
            font-size: 0.9rem;
        }
        .image-counter {
            font-size: 0.9rem;
            color: #666;
        }
        .no-gestures {
            color: #666;
            text-align: center;
            padding: 2rem;
        }
        .original-text {
            font-size: 1.2rem;
            color: #333;
            margin-bottom: 1rem;
            text-align: center;
        }
        .current-letter {
            font-size: 2rem;
            font-weight: bold;
            color: var(--primary-color);
            margin-bottom: 1rem;
        }
    `;
    document.head.appendChild(style);

    function togglePlay() {
        if (isPlaying) {
            stopPlayback();
        } else {
            startPlayback();
        }
    }

    function startPlayback() {
        if (!currentImages.length) return;
        
        isPlaying = true;
        updatePlayButton();
        
        // Get the selected speed
        const speedSelect = document.querySelector('.speed-select');
        const interval = PLAY_INTERVAL_MS / parseFloat(speedSelect.value);
        
        playInterval = setInterval(() => {
            if (currentImageIndex < currentImages.length - 1) {
                showImage(currentImageIndex + 1);
            } else {
                stopPlayback(); // Stop at the end
            }
        }, interval);
    }

    function stopPlayback() {
        isPlaying = false;
        if (playInterval) {
            clearInterval(playInterval);
            playInterval = null;
        }
        updatePlayButton();
    }

    function updatePlayButton() {
        const playButton = document.querySelector('.play-button');
        if (playButton) {
            playButton.innerHTML = isPlaying ? 
                '<i class="fas fa-pause"></i> Pause' : 
                '<i class="fas fa-play"></i> Play';
            playButton.classList.toggle('playing', isPlaying);
        }
    }

    function showImage(index) {
        if (!currentImages.length) return;
        
        currentImageIndex = index;
        const imageUrl = currentImages[index];
        const letter = imageUrl.split('/').pop().split('.')[0].toUpperCase();
        
        signOutput.innerHTML = `
            <div class="current-letter">${letter}</div>
            <div class="image-container">
                <img src="${API_URL}${imageUrl}" alt="Sign for '${letter}'" title="Sign for '${letter}'">
            </div>
            <div class="navigation-controls">
                <button class="nav-button prev-button" ${index === 0 ? 'disabled' : ''}>
                    <i class="fas fa-chevron-left"></i> Previous
                </button>
                <button class="nav-button play-button">
                    ${isPlaying ? '<i class="fas fa-pause"></i> Pause' : '<i class="fas fa-play"></i> Play'}
                </button>
                <button class="nav-button next-button" ${index === currentImages.length - 1 ? 'disabled' : ''}>
                    Next <i class="fas fa-chevron-right"></i>
                </button>
            </div>
            <div class="image-counter">${index + 1} / ${currentImages.length}</div>
            <div class="speed-control">
                <span class="speed-label">Speed:</span>
                <select class="speed-select">
                    <option value="0.5">0.5x</option>
                    <option value="1" selected>1x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2x</option>
                </select>
            </div>
        `;

        // Add event listeners to navigation buttons
        const prevButton = signOutput.querySelector('.prev-button');
        const nextButton = signOutput.querySelector('.next-button');
        const playButton = signOutput.querySelector('.play-button');
        const speedSelect = signOutput.querySelector('.speed-select');
        
        prevButton.addEventListener('click', () => {
            stopPlayback();
            if (currentImageIndex > 0) showImage(currentImageIndex - 1);
        });
        
        nextButton.addEventListener('click', () => {
            stopPlayback();
            if (currentImageIndex < currentImages.length - 1) showImage(currentImageIndex + 1);
        });

        playButton.addEventListener('click', togglePlay);
        
        speedSelect.addEventListener('change', () => {
            if (isPlaying) {
                stopPlayback();
                startPlayback();
            }
        });

        // Add keyboard navigation
        document.addEventListener('keydown', handleKeyPress);
    }

    function handleKeyPress(e) {
        if (e.key === 'ArrowLeft' && currentImageIndex > 0) {
            stopPlayback();
            showImage(currentImageIndex - 1);
        } else if (e.key === 'ArrowRight' && currentImageIndex < currentImages.length - 1) {
            stopPlayback();
            showImage(currentImageIndex + 1);
        } else if (e.key === ' ') { // Space bar
            e.preventDefault();
            togglePlay();
        }
    }

    translateButton.addEventListener('click', async () => {
        const text = textInput.value.trim();
        if (!text) {
            showError('Please enter some text to translate');
            return;
        }

        try {
            // Show loading animation
            signOutput.innerHTML = '<div class="loading"></div>';
            translateButton.disabled = true;
            currentImages = [];
            currentImageIndex = 0;

            console.log('Making API request to:', `${API_URL}/api/text-to-sign`);
            console.log('Request payload:', { text });

            // Make API request
            const response = await fetch(`${API_URL}/api/text-to-sign`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ text }),
                mode: 'cors'
            });

            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.text();
                console.error('Server error response:', errorData);
                throw new Error(`Translation failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Response data:', data);
            
            if (data.success && data.images && data.images.length > 0) {
                currentImages = data.images;
                showImage(0);
            } else {
                signOutput.innerHTML = '<div class="no-gestures">No gestures found for the given text</div>';
            }
        } catch (error) {
            console.error('Translation error:', error);
            showError(`Failed to translate text to sign language: ${error.message}`);
        } finally {
            translateButton.disabled = false;
        }
    });

    function showError(message) {
        console.error('Showing error:', message);
        signOutput.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                ${message}
            </div>
        `;
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

    // Update cleanup
    window.addEventListener('beforeunload', () => {
        document.removeEventListener('keydown', handleKeyPress);
        stopPlayback();
    });
}); 