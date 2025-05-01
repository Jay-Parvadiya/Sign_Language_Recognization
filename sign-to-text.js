document.addEventListener('DOMContentLoaded', () => {
    const cameraButton = document.querySelector('.camera-button');
    const cameraFeed = document.querySelector('#cameraFeed');
    const textOutput = document.querySelector('.text-output p');
    let stream = null;
    let isStreaming = false;

    // Handle camera button click
    cameraButton.addEventListener('click', async () => {
        if (!isStreaming) {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { 
                        facingMode: 'user',
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                    } 
                });
                cameraFeed.srcObject = stream;
                await cameraFeed.play();
                isStreaming = true;
                cameraButton.innerHTML = '<i class="fas fa-stop"></i><span>Stop Camera</span>';
                cameraButton.style.background = '#45B7AF';
                
                // Here you would typically start processing video frames
                // for sign language recognition
                startSignRecognition();
            } catch (err) {
                console.error('Error accessing camera:', err);
                alert('Unable to access camera. Please make sure you have granted camera permissions.');
            }
        } else {
            stopCamera();
        }
    });

    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            cameraFeed.srcObject = null;
            isStreaming = false;
            cameraButton.innerHTML = '<i class="fas fa-camera"></i><span>Start Camera</span>';
            cameraButton.style.background = '';
            textOutput.textContent = 'The translated text will appear here...';
        }
    }

    function startSignRecognition() {
        // This is where you would implement sign language recognition
        // For now, we'll just show a simulated processing message
        textOutput.textContent = 'Processing sign language...';
        
        // Simulated recognition result after 3 seconds
        setTimeout(() => {
            if (isStreaming) {
                textOutput.textContent = 'Recognized signs will appear here in real-time...';
            }
        }, 3000);
    }

    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        stopCamera();
    });

    // Handle navigation active state
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        if (link.href === window.location.href) {
            link.parentElement.classList.add('active');
        }
    });
}); 