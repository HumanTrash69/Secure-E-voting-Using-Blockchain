class FaceVerification {
    constructor() {
        this.stream = null;
        this.videoElement = null;
    }

    async startVerification(voterId) {
        try {
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                z-index: 999;
            `;
            document.body.appendChild(overlay);

            // Create verification UI
            const verificationDiv = document.createElement('div');
            verificationDiv.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #fff;
                padding: 20px;
                border-radius: 10px;
                z-index: 1000;
                text-align: center;
            `;
            
            verificationDiv.innerHTML = `
                <h3 style="margin-bottom: 15px;">Face Verification</h3>
                <p style="margin-bottom: 15px;">Please look directly at the camera</p>
                <div style="position: relative; margin: 20px 0;">
                    <video id="faceVideo" width="640" height="480" autoplay playsinline></video>
                    <canvas id="faceCanvas" style="display: none;"></canvas>
                    <div id="faceBox" style="position: absolute; border: 3px solid #00ff00; display: none;"></div>
                    <div id="guidanceOverlay" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                        color: white; font-size: 24px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);"></div>
                </div>
                <div id="verificationStatus" style="margin-top: 15px; font-weight: bold;"></div>
                <div id="positionGuidance" style="margin-top: 10px; color: #666;"></div>
            `;
            
            document.body.appendChild(verificationDiv);

            // Initialize video
            this.videoElement = document.getElementById('faceVideo');
            this.stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: "user" } 
            });
            this.videoElement.srcObject = this.stream;

            // Wait for video to be ready
            await new Promise((resolve) => {
                this.videoElement.onloadedmetadata = () => {
                    this.videoElement.play();
                    resolve();
                };
            });

            const statusElement = document.getElementById('verificationStatus');
            const boxElement = document.getElementById('faceBox');
            const guidanceElement = document.getElementById('positionGuidance');
            
            let successCount = 0;
            for(let i = 0; i < 3; i++) {
                statusElement.textContent = "Detecting face...";
                const result = await this.verifyFace();
                
                if(result.success) {
                    successCount++;
                    boxElement.style.display = 'block';
                    boxElement.style.left = `${result.faceLocation.x}px`;
                    boxElement.style.top = `${result.faceLocation.y}px`;
                    boxElement.style.width = `${result.faceLocation.width}px`;
                    boxElement.style.height = `${result.faceLocation.height}px`;
                    
                    if (result.faceLocation.eyes >= 2) {
                        statusElement.textContent = "Face and eyes detected! ✓";
                        statusElement.style.color = "green";
                    } else {
                        statusElement.textContent = "Please look directly at camera";
                        statusElement.style.color = "orange";
                    }
                    
                    guidanceElement.textContent = result.guidance || "";
                } else {
                    boxElement.style.display = 'none';
                    statusElement.textContent = result.message;
                    statusElement.style.color = "red";
                }
                
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            // Cleanup
            this.stopCamera();
            document.body.removeChild(verificationDiv);
            document.body.removeChild(overlay);

            return successCount >= 2;

        } catch (error) {
            console.error('Face verification failed:', error);
            this.stopCamera();
            return false;
        }
    }

    async verifyFace() {
        const canvas = document.getElementById('faceCanvas');
        const context = canvas.getContext('2d');
        
        canvas.width = this.videoElement.videoWidth;
        canvas.height = this.videoElement.videoHeight;
        context.drawImage(this.videoElement, 0, 0);
        
        const imageData = canvas.toDataURL('image/jpeg');

        try {
            const response = await fetch('http://localhost:5000/verify-face', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: imageData })
            });

            return await response.json();
        } catch (error) {
            console.error('Server communication failed:', error);
            return { success: false, message: error.message };
        }
    }

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
    }
}

export default FaceVerification;