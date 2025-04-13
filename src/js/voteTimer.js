class VoteTimer {
    constructor() {
        this.timeLimit = 15;
        this.timer = null;
    }

    initializeTimer() {
        this.startTimer();
    }

    startTimer() {
        let timeLeft = this.timeLimit;
        this.updateDisplay(timeLeft);

        this.timer = setInterval(() => {
            timeLeft--;
            this.updateDisplay(timeLeft);

            if (timeLeft <= 0) {
                this.timeExpired();
            }
        }, 1000);
    }

    updateDisplay(seconds) {
        const timerDisplay = document.getElementById('timer-display');
        if (timerDisplay) {
            timerDisplay.style.fontSize = '36px';  // Bigger font
            timerDisplay.style.fontWeight = 'bold';
            timerDisplay.style.color = seconds <= 5 ? '#ff0000' : '#ffffff';  // Changed black to white
            timerDisplay.textContent = `${seconds}s`;
        }
    }

    timeExpired() {
        clearInterval(this.timer);
        
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 9998;
        `;
        
        const timeoutDiv = document.createElement('div');
        timeoutDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
            text-align: center;
            z-index: 9999;
            width: 80%;
            max-width: 500px;
        `;
        
        timeoutDiv.innerHTML = `
            <h2 style="font-size: 32px; margin-bottom: 20px; color: #f44336;">Session Timeout</h2>
            <p style="font-size: 20px; margin-bottom: 30px;">Your voting session has timed out.</p>
            <button id="extend-time" style="
                background-color: #4CAF50;
                color: white;
                padding: 12px 24px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 18px;
                margin: 10px;
                transition: background-color 0.3s;
            ">Request Additional Time</button>
            <button id="logout-btn" style="
                background-color: #f44336;
                color: white;
                padding: 12px 24px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 18px;
                margin: 10px;
                transition: background-color 0.3s;
            ">Logout</button>
        `;
        
        document.body.appendChild(overlay);
        document.body.appendChild(timeoutDiv);

        // Add hover effects
        const buttons = timeoutDiv.getElementsByTagName('button');
        for (let button of buttons) {
            button.addEventListener('mouseover', function() {
                this.style.opacity = '0.9';
                this.style.transform = 'scale(1.05)';
            });
            button.addEventListener('mouseout', function() {
                this.style.opacity = '1';
                this.style.transform = 'scale(1)';
            });
        }

        document.getElementById('extend-time').addEventListener('click', () => {
            overlay.remove();
            timeoutDiv.remove();
            const newTimer = new VoteTimer();
            newTimer.initializeTimer();
        });

        document.getElementById('logout-btn').addEventListener('click', () => {
            window.location.href = '/login.html';
        });
    }

    clearTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
}

export default VoteTimer;