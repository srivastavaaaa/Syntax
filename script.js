// Initialize any JavaScript functionality here
document.addEventListener('DOMContentLoaded', function() {
    // Sidebar Toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        content.classList.toggle('expanded');
    });

    // Theme Toggle
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const icon = themeToggle.querySelector('i');
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
    });

    // Pomodoro Timer
    let timerInterval;
    let timeLeft = 25 * 60; // 25 minutes in seconds
    const startButton = document.getElementById('start-timer');
    const resetButton = document.getElementById('reset-timer');
    const timeDisplay = document.querySelector('.time');

    function updateTimer() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function startTimer() {
        if (startButton.textContent === 'Start') {
            startButton.textContent = 'Pause';
            startButton.classList.remove('btn-success');
            startButton.classList.add('btn-warning');
            
            timerInterval = setInterval(() => {
                timeLeft--;
                updateTimer();
                
                if (timeLeft === 0) {
                    clearInterval(timerInterval);
                    startButton.textContent = 'Start';
                    startButton.classList.remove('btn-warning');
                    startButton.classList.add('btn-success');
                    // Play notification sound or show alert
                    alert('Pomodoro session completed!');
                }
            }, 1000);
        } else {
            clearInterval(timerInterval);
            startButton.textContent = 'Start';
            startButton.classList.remove('btn-warning');
            startButton.classList.add('btn-success');
        }
    }

    function resetTimer() {
        clearInterval(timerInterval);
        timeLeft = 25 * 60;
        updateTimer();
        startButton.textContent = 'Start';
        startButton.classList.remove('btn-warning');
        startButton.classList.add('btn-success');
    }

    startButton.addEventListener('click', startTimer);
    resetButton.addEventListener('click', resetTimer);

    // Stopwatch functionality
    let stopwatchInterval;
    let stopwatchTime = 0;
    let stopwatchRunning = false;
    let lapCount = 0;
    let lapTimes = [];

    const startStopwatchBtn = document.getElementById('start-stopwatch');
    const lapStopwatchBtn = document.getElementById('lap-stopwatch');
    const resetStopwatchBtn = document.getElementById('reset-stopwatch');
    const stopwatchDisplay = document.querySelector('.stopwatch .time');
    const lapList = document.getElementById('lap-list');

    function formatTime(ms) {
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function updateStopwatch() {
        stopwatchTime += 10;
        stopwatchDisplay.textContent = formatTime(stopwatchTime);
    }

    function startStopwatch() {
        if (!stopwatchRunning) {
            stopwatchRunning = true;
            startStopwatchBtn.textContent = 'Pause';
            stopwatchInterval = setInterval(updateStopwatch, 10);
        } else {
            stopwatchRunning = false;
            startStopwatchBtn.textContent = 'Start';
            clearInterval(stopwatchInterval);
        }
    }

    function lapStopwatch() {
        if (stopwatchRunning) {
            lapCount++;
            lapTimes.push(stopwatchTime);
            
            const lapItem = document.createElement('div');
            lapItem.className = 'lap-item';
            lapItem.innerHTML = `
                <span class="lap-number">Lap ${lapCount}</span>
                <span class="lap-time">${formatTime(stopwatchTime)}</span>
            `;
            lapList.insertBefore(lapItem, lapList.firstChild);
        }
    }

    function resetStopwatch() {
        stopwatchRunning = false;
        startStopwatchBtn.textContent = 'Start';
        clearInterval(stopwatchInterval);
        stopwatchTime = 0;
        stopwatchDisplay.textContent = formatTime(0);
        lapCount = 0;
        lapTimes = [];
        lapList.innerHTML = '';
    }

    startStopwatchBtn.addEventListener('click', startStopwatch);
    lapStopwatchBtn.addEventListener('click', lapStopwatch);
    resetStopwatchBtn.addEventListener('click', resetStopwatch);
});
