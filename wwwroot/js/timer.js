// Timer functionality
let timerMode = 'stopwatch'; // stopwatch, countdown, pomodoro
let timerInterval = null;
let timerSeconds = 0;
let isTimerRunning = false;
let laps = [];

function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
}

function setTimerMode(mode) {
    if (isTimerRunning) {
        alert('Vui lòng dừng timer trước khi đổi chế độ!');
        return;
    }
    
    timerMode = mode;
    resetTimer();
    
    // Update UI
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Show/hide countdown input
    const countdownInput = document.getElementById('countdownInput');
    if (mode === 'countdown') {
        countdownInput.style.display = 'flex';
    } else {
        countdownInput.style.display = 'none';
    }
    
    // Set pomodoro default (25 minutes)
    if (mode === 'pomodoro') {
        timerSeconds = 25 * 60;
        updateTimerDisplay();
    }
}

function startTimer() {
    if (isTimerRunning) return;
    
    if (timerMode === 'countdown' && timerSeconds === 0) {
        const minutes = parseInt(document.getElementById('countdownMinutes').value) || 0;
        const seconds = parseInt(document.getElementById('countdownSeconds').value) || 0;
        timerSeconds = minutes * 60 + seconds;
        
        if (timerSeconds === 0) {
            alert('Vui lòng nhập thời gian!');
            return;
        }
    }
    
    isTimerRunning = true;
    document.getElementById('timerStartBtn').style.display = 'none';
    document.getElementById('timerPauseBtn').style.display = 'inline-block';
    
    timerInterval = setInterval(() => {
        if (timerMode === 'countdown' || timerMode === 'pomodoro') {
            timerSeconds--;
            if (timerSeconds <= 0) {
                timerSeconds = 0;
                pauseTimer();
                playTimerSound();
                alert('⏰ Hết giờ!');
                if (timerMode === 'pomodoro') {
                    // Auto reset for next pomodoro
                    setTimeout(() => {
                        timerSeconds = 5 * 60; // 5 min break
                        updateTimerDisplay();
                    }, 1000);
                }
            }
        } else {
            timerSeconds++;
        }
        updateTimerDisplay();
    }, 1000);
}

function pauseTimer() {
    isTimerRunning = false;
    clearInterval(timerInterval);
    document.getElementById('timerStartBtn').style.display = 'inline-block';
    document.getElementById('timerPauseBtn').style.display = 'none';
    
    // Add lap for stopwatch
    if (timerMode === 'stopwatch' && timerSeconds > 0) {
        addLap();
    }
}

function resetTimer() {
    pauseTimer();
    timerSeconds = 0;
    laps = [];
    updateTimerDisplay();
    document.getElementById('timerLaps').innerHTML = '';
    
    if (timerMode === 'pomodoro') {
        timerSeconds = 25 * 60;
        updateTimerDisplay();
    }
}

function updateTimerDisplay() {
    const hours = Math.floor(timerSeconds / 3600);
    const minutes = Math.floor((timerSeconds % 3600) / 60);
    const seconds = timerSeconds % 60;
    
    const display = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    document.getElementById('timerDisplay').textContent = display;
}

function addLap() {
    laps.push(timerSeconds);
    const lapsList = document.getElementById('timerLaps');
    const lapNumber = laps.length;
    const lapTime = formatTime(timerSeconds);
    
    const lapItem = document.createElement('div');
    lapItem.className = 'lap-item';
    lapItem.innerHTML = `
        <span>Vòng ${lapNumber}</span>
        <span>${lapTime}</span>
    `;
    lapsList.insertBefore(lapItem, lapsList.firstChild);
}

function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function pad(num) {
    return num.toString().padStart(2, '0');
}

function playTimerSound() {
    const audio = document.getElementById('alarmSound');
    audio.currentTime = 0;
    audio.play();
    setTimeout(() => audio.pause(), 3000);
}
