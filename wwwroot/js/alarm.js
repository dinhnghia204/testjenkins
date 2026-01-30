// Alarm functionality
const ALARM_API_URL = '/api/alarm';
let alarmCheckInterval = null;

document.addEventListener('DOMContentLoaded', () => {
    loadAlarms();
    startAlarmChecker();
});

async function loadAlarms() {
    try {
        const response = await fetch(ALARM_API_URL);
        const alarms = await response.json();
        renderAlarms(alarms);
    } catch (error) {
        console.error('Lỗi khi load alarms:', error);
    }
}

function renderAlarms(alarms) {
    const alarmList = document.getElementById('alarmList');
    
    if (alarms.length === 0) {
        alarmList.innerHTML = '<div class="empty-state">Chưa có báo thức nào. Hãy thêm mới!</div>';
        return;
    }
    
    alarmList.innerHTML = alarms.map(alarm => `
        <li class="alarm-item ${alarm.isActive ? '' : 'inactive'}">
            <label class="alarm-toggle">
                <input type="checkbox" ${alarm.isActive ? 'checked' : ''} 
                       onchange="toggleAlarm(${alarm.id}, this.checked)" />
                <span class="alarm-toggle-slider"></span>
            </label>
            <div class="alarm-info">
                <div class="alarm-time">${formatAlarmTime(alarm.time)}</div>
                <div class="alarm-name">${escapeHtml(alarm.name)}</div>
            </div>
            <button class="alarm-delete" onclick="deleteAlarm(${alarm.id})">Xóa</button>
        </li>
        
    `).join('');
}

async function addAlarm() {
    const name = document.getElementById('alarmName').value.trim();
    const time = document.getElementById('alarmTime').value;
    
    if (!name) {
        alert('Vui lòng nhập tên báo thức!');
        return;
    }
    
    if (!time) {
        alert('Vui lòng chọn thời gian!');
        return;
    }
    
    try {
        const response = await fetch(ALARM_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                time: time + ':00',
                isActive: true,
                repeatDays: [],
                sound: 'default'
            })
        });
        
        if (response.ok) {
            document.getElementById('alarmName').value = '';
            document.getElementById('alarmTime').value = '';
            loadAlarms();
        }
    } catch (error) {
        console.error('Lỗi khi thêm alarm:', error);
    }
}

async function toggleAlarm(id, isActive) {
    try {
        const response = await fetch(`${ALARM_API_URL}/${id}`);
        const alarm = await response.json();
        
        await fetch(`${ALARM_API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...alarm,
                isActive: isActive
            })
        });
        
        loadAlarms();
    } catch (error) {
        console.error('Lỗi khi toggle alarm:', error);
    }
}

async function deleteAlarm(id) {
    if (!confirm('Bạn có chắc muốn xóa báo thức này?')) {
        return;
    }
    
    try {
        await fetch(`${ALARM_API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        loadAlarms();
    } catch (error) {
        console.error('Lỗi khi xóa alarm:', error);
    }
}

function formatAlarmTime(timeString) {
    // timeString format: "HH:mm:ss"
    const parts = timeString.split(':');
    return `${parts[0]}:${parts[1]}`;
}

function startAlarmChecker() {
    // Check every 30 seconds
    alarmCheckInterval = setInterval(checkAlarms, 30000);
}

async function checkAlarms() {
    try {
        const response = await fetch(`${ALARM_API_URL}/active`);
        const activeAlarms = await response.json();
        
        const now = new Date();
        const currentTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
        
        activeAlarms.forEach(alarm => {
            const alarmTime = formatAlarmTime(alarm.time);
            if (currentTime === alarmTime) {
                triggerAlarm(alarm);
            }
        });
    } catch (error) {
        console.error('Lỗi khi check alarms:', error);
    }
}

function triggerAlarm(alarm) {
    // Play sound
    const audio = document.getElementById('alarmSound');
    audio.loop = true;
    audio.play();
    
    // Show notification
    showAlarmNotification(alarm);
}

function showAlarmNotification(alarm) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'alarm-overlay show';
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'alarm-notification show';
    notification.innerHTML = `
        <h2>⏰ ${escapeHtml(alarm.name)}</h2>
        <div style="font-size: 3em; margin: 20px 0;">${formatAlarmTime(alarm.time)}</div>
        <button onclick="dismissAlarm(this)">Tắt Báo Thức</button>
    `;
    
    document.body.appendChild(overlay);
    document.body.appendChild(notification);
}

function dismissAlarm(button) {
    // Stop sound
    const audio = document.getElementById('alarmSound');
    audio.pause();
    audio.currentTime = 0;
    
    // Remove notification and overlay
    const notification = button.closest('.alarm-notification');
    const overlay = document.querySelector('.alarm-overlay');
    
    if (notification) notification.remove();
    if (overlay) overlay.remove();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function pad(num) {
    return num.toString().padStart(2, '0');
}
