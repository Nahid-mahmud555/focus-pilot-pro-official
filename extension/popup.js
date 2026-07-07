// popup.js - Manifest V3 (Firefox + Chrome) with Dynamic Live Injection & 5s Alerts

(function() {
    'use strict';
    
    const api = typeof browser !== 'undefined' ? browser : chrome;

    // ==================== STATE ====================
    let taskCount = 2;
    let countdownTime = 1;
    let taskTimes = [];
    let breakTimes = [];
    let isMissionRunning = false;
    
    // ==================== DOM ELEMENTS ====================
    const taskList = document.getElementById('task-list');
    const taskCountSpan = document.getElementById('taskCount');
    const countdownDisplay = document.getElementById('countdownDisplay');
    const timerContainer = document.getElementById('timer-container');
    const timerDisplay = document.getElementById('timer-display');
    const currentTaskName = document.getElementById('current-task-name');
    const startBtn = document.getElementById('startMissionBtn');
    const stopBtn = document.getElementById('stopMissionBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    
    // ==================== INITIALIZATION ====================
    function init() {
        loadSettings();
        setupEventListeners();
        checkMissionStatus();
        setInterval(checkMissionStatus, 1000);
    }
    
    function loadSettings() {
        taskCount = parseInt(localStorage.getItem('focusPilot_taskCount')) || 2;
        countdownTime = parseInt(localStorage.getItem('focusPilot_countdown')) || 1;
        
        taskCountSpan.textContent = taskCount;
        countdownDisplay.textContent = countdownTime;

        // বিদ্যমান ডাটা ঠিক রেখে কেবল কম পড়লে ব্যাকআপ ভ্যালু পুশ করবে (বাগ ফিক্সড)
        const savedTaskTimes = JSON.parse(localStorage.getItem('focusPilot_taskTimes')) || [];
        const savedBreakTimes = JSON.parse(localStorage.getItem('focusPilot_breakTimes')) || [];
        
        taskTimes = [];
        breakTimes = [];
        
        for (let i = 0; i < taskCount; i++) {
            taskTimes.push(savedTaskTimes[i] !== undefined ? savedTaskTimes[i] : 1);
            breakTimes.push(savedBreakTimes[i] !== undefined ? savedBreakTimes[i] : 0); // ডিফল্ট ব্রেক ০ করা হলো
        }
        
        document.getElementById('volume-control').value = localStorage.getItem('focusPilot_volume') || 0.7;
        document.getElementById('tone-select').value = localStorage.getItem('focusPilot_tone') || 880;
        
        const darkModeCheckbox = document.getElementById('dark-mode-checkbox');
        if (localStorage.getItem('focusPilot_theme') === 'dark') {
            if (darkModeCheckbox) darkModeCheckbox.checked = true;
        } else {
            if (darkModeCheckbox) darkModeCheckbox.checked = false;
        }
        
        renderTasks();
    }

    // ==================== RENDER TASKS ====================
    function renderTasks() {
        taskList.innerHTML = '';
        const savedLinks = JSON.parse(localStorage.getItem('focusPilot_links') || '{}');
        
        for (let i = 0; i < taskCount; i++) {
            const taskItem = document.createElement('div');
            taskItem.className = 'task-item';
            taskItem.id = `task-${i}`;
            
            // যদি ভ্যালু ১ এর কম হয় (যেমন ০.০৮৩৩), তবে "5 Sec" দেখাবে, নাহলে "X Min"
            const taskTimeDisplay = taskTimes[i] < 1 ? "5 Sec" : `${taskTimes[i]} Min`;
            const breakTimeDisplay = breakTimes[i] < 1 && breakTimes[i] > 0 ? "5 Sec" : `${breakTimes[i]} Min`;
            
            taskItem.innerHTML = `
                <div class="task-header"><span class="task-number">Task ${i + 1}</span></div>
                <input type="text" class="task-link-input" data-index="${i}" placeholder="Link or Text Reminder (e.g., show youtube)" value="${savedLinks[i] || ''}">
                <div class="task-time-row">
                    <span>Work in progress ⏱️: <span id="task-time-${i}">${taskTimeDisplay}</span></span>
                    <div class="task-time-controls">
                        <button class="task-time-btn" data-task="${i}" data-type="task" data-action="minus">−</button>
                        <button class="task-time-btn" data-task="${i}" data-type="task" data-action="plus">+</button>
                    </div>
                </div>
                <div class="task-time-row" style="background: rgba(16,185,129,0.1);">
                    <span> Break : <span id="break-time-${i}">${breakTimeDisplay}</span></span>
                    <div class="task-time-controls">
                        <button class="task-time-btn" data-task="${i}" data-type="break" data-action="minus">−</button>
                        <button class="task-time-btn" data-task="${i}" data-type="break" data-action="plus">+</button>
                    </div>
                </div>`;
            taskList.appendChild(taskItem);
        }

        document.querySelectorAll('.task-link-input').forEach((input, index) => {
            input.addEventListener('input', (e) => {
                const links = JSON.parse(localStorage.getItem('focusPilot_links') || '{}');
                links[index] = e.target.value;
                localStorage.setItem('focusPilot_links', JSON.stringify(links));
            });
        });

        document.querySelectorAll('.task-time-btn').forEach(btn => {
            btn.removeEventListener('click', handleTimeChange); // ওল্ড ডুপ্লিকেট লিসেনার ক্লিনআপ
            btn.addEventListener('click', handleTimeChange);
        });
    }

    function handleTimeChange(e) {
        const i = parseInt(e.target.dataset.task);
        const type = e.target.dataset.type;
        const action = e.target.dataset.action;

        if (type === 'task') {
            if (action === 'minus') {
                // ১ মিনিট থেকে মাইনাস চাপলে সরাসরি ৫ সেকেন্ড (৫/৬০ মিনিট) হবে
                if (taskTimes[i] === 1) {
                    taskTimes[i] = 5 / 60; 
                } else if (taskTimes[i] > 1) {
                    taskTimes[i] = Math.max(1, taskTimes[i] - 1);
                }
            } else { // plus
                // ৫ সেকেন্ড থাকা অবস্থায় প্লাস চাপলে ১ মিনিট হবে
                if (taskTimes[i] < 1) {
                    taskTimes[i] = 1;
                } else {
                    taskTimes[i] = Math.min(120, taskTimes[i] + 1);
                }
            }
            
            const displayVal = taskTimes[i] < 1 ? "5 Sec" : `${taskTimes[i]} Min`;
            document.getElementById(`task-time-${i}`).textContent = displayVal;
            localStorage.setItem('focusPilot_taskTimes', JSON.stringify(taskTimes));
            
        } else { // break
            if (action === 'minus') {
                // ১ মিনিট থেকে কমলে ৫ সেকেন্ড, ৫ সেকেন্ড থেকে কমলে ০ মিনিট (নো ব্রেক)
                if (breakTimes[i] === 1) {
                    breakTimes[i] = 5 / 60;
                } else if (breakTimes[i] < 1 && breakTimes[i] > 0) {
                    breakTimes[i] = 0;
                } else if (breakTimes[i] > 1) {
                    breakTimes[i] = Math.max(1, breakTimes[i] - 1);
                }
            } else { // plus
                // ০ থেকে বাড়লে ৫ সেকেন্ড, ৫ সেকেন্ড থেকে বাড়লে ১ মিনিট
                if (breakTimes[i] === 0) {
                    breakTimes[i] = 5 / 60;
                } else if (breakTimes[i] < 1) {
                    breakTimes[i] = 1;
                } else {
                    breakTimes[i] = Math.min(30, breakTimes[i] + 1);
                }
            }
            
            const displayVal = breakTimes[i] < 1 && breakTimes[i] > 0 ? "5 Sec" : `${breakTimes[i]} Min`;
            document.getElementById(`break-time-${i}`).textContent = displayVal;
            localStorage.setItem('focusPilot_breakTimes', JSON.stringify(breakTimes));
        }
    }

    // ==================== MISSION CONTROL ====================
    function startMission() {
        const inputs = document.querySelectorAll('.task-link-input');
        
        if (isMissionRunning) {
            let lastTypedIndex = -1;
            let textVal = "";
            
            for (let i = 0; i < taskCount; i++) {
                if (inputs[i].value.trim() !== "") {
                    lastTypedIndex = i;
                    textVal = inputs[i].value.trim();
                }
            }
            
            if (lastTypedIndex === -1) {
                startBtn.textContent = "Type something first! ❌";
                setTimeout(() => { startBtn.textContent = "Add Task Live ➕"; }, 2000);
                return;
            }
            
            const liveTask = {
                type: 'task',
                link: textVal,
                time: taskTimes[lastTypedIndex] * 60
            };
            
            const liveBreak = {
                type: 'break',
                link: 'BREAK',
                time: breakTimes[lastTypedIndex] * 60
            };
            
            api.runtime.sendMessage({ 
                command: "addLiveTask", 
                newTask: liveTask, 
                newBreak: liveBreak 
            }, (response) => {
                if (response && response.status === "success") {
                    startBtn.style.background = "#10b981";
                    startBtn.textContent = "Task Added Successfully! ✅";
                    setTimeout(() => {
                        startBtn.style.background = "";
                        startBtn.textContent = "Add Task Live ➕";
                    }, 2000);
                }
            });
            return; 
        }

        const tasks = [];
        for (let i = 0; i < taskCount; i++) {
            let link = inputs[i].value.trim();
            if (!link) { 
                alert(`Drop Task ${i+1} link or text reminder! 🔗`); 
                return; 
            }
            
            tasks.push({ type: 'task', link: link, time: taskTimes[i] * 60 });
            tasks.push({ type: 'break', link: 'BREAK', time: breakTimes[i] * 60 });
        }

        const missionData = {
            command: "startMission",
            countdown: countdownTime * 60,
            tasks: tasks,
            settings: {
                tone: document.getElementById('tone-select').value,
                volume: document.getElementById('volume-control').value
            }
        };

        api.runtime.sendMessage(missionData, () => {
            if (api.runtime.lastError) {
                startLocalMission(missionData);
            } else {
                setTimeout(() => window.close(), 400);
            }
        });
    }

    function startLocalMission(data) {
        alert(`Local Mode: Active! 🏁\n⏰ Going live! ${data.countdown/60} Minutes out. ⏳`);
        timerContainer.style.display = 'block';
        currentTaskName.textContent = `It's about to start! ${data.countdown/60} Minutes to go..`;
        
        let timeLeft = data.countdown;
        const localTimer = setInterval(() => {
            timeLeft--;
            const mins = Math.floor(timeLeft / 60);
            const secs = timeLeft % 60;
            timerDisplay.textContent = `${mins < 10 ? '0'+mins : mins}:${secs < 10 ? '0'+secs : secs}`;
            
            if (timeLeft <= 0) {
                clearInterval(localTimer);
                currentTaskName.textContent = "Task in progress...";
                
                let taskDelay = 0;
                data.tasks.forEach(task => {
                    if (task.type === 'task' && task.link) {
                        setTimeout(() => {
                            window.open(task.link, '_blank');
                        }, taskDelay * 1000);
                        taskDelay += task.time;
                    } else if (task.type === 'break' && task.time > 0) {
                        taskDelay += task.time;
                    }
                });
            }
        }, 1000);
    }

    function stopMission() {
        api.runtime.sendMessage({ command: "stopMission" }, () => {
            timerContainer.style.display = 'none';
            startBtn.disabled = false;
            startBtn.textContent = "Start Mission 🚀";
            stopBtn.disabled = true;
            isMissionRunning = false;
        });
    }

    function checkMissionStatus() {
        api.runtime.sendMessage({ command: "getStatus" }, (response) => {
            if (response && response.active) {
                timerContainer.style.display = 'block';
                currentTaskName.textContent = response.currentTask || "Task in progress....";
                const mins = Math.floor(response.timeLeft / 60);
                const secs = response.timeLeft % 60;
                timerDisplay.textContent = `${mins < 10 ? '0'+mins : mins}:${secs < 10 ? '0'+secs : secs}`;
                
                isMissionRunning = true;
                startBtn.disabled = false; 
                if(!startBtn.textContent.includes("Successfully") && !startBtn.textContent.includes("Type")) {
                    startBtn.textContent = "Add Task Live ➕"; 
                }
                stopBtn.disabled = false;
            } else {
                timerContainer.style.display = 'none';
                startBtn.disabled = false;
                startBtn.textContent = "Start Mission 🚀";
                stopBtn.disabled = true;
                isMissionRunning = false;
            }
        });
    }

    function refreshAll() {
        localStorage.clear(); // ওল্ড করাপ্টেড কি ডাটা একবারে ক্লিনআপ করার জন্য
        
        taskCount = 2;
        countdownTime = 1;
        taskTimes = [1, 1];
        breakTimes = [0, 0];
        
        taskCountSpan.textContent = taskCount;
        countdownDisplay.textContent = countdownTime;
        
        document.getElementById('volume-control').value = 0.7;
        document.getElementById('tone-select').value = '880';
        
        renderTasks();
        
        timerContainer.style.display = 'none';
        startBtn.disabled = false;
        startBtn.textContent = "Start Mission 🚀";
        stopBtn.disabled = true;
        isMissionRunning = false;
        
        alert(" Fresh start—all data gone! 🔥");
    }

    function setupEventListeners() {
        document.getElementById('increaseTasks').onclick = () => { if(taskCount < 10) { taskCount++; updateTaskCount(); } };
        document.getElementById('decreaseTasks').onclick = () => { if(taskCount > 1) { taskCount--; updateTaskCount(); } };
        document.getElementById('increaseCountdown').onclick = () => { if(countdownTime < 30) { countdownTime++; updateCountdown(); } };
        document.getElementById('decreaseCountdown').onclick = () => { if(countdownTime > 1) { countdownTime--; updateCountdown(); } };
        
        startBtn.onclick = startMission;
        stopBtn.onclick = stopMission;
        
        document.getElementById('settingsBtn').onclick = () => document.getElementById('settings-panel').style.display = 'block';
        document.getElementById('closeSettingsBtn').onclick = () => document.getElementById('settings-panel').style.display = 'none';
        
        document.getElementById('testSoundBtn').onclick = () => {
            const tone = document.getElementById('tone-select').value;
            const vol = document.getElementById('volume-control').value;
            try {
                const audioCtx = new AudioContext();
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.frequency.value = tone;
                gain.gain.value = vol;
                osc.start();
                osc.stop(audioCtx.currentTime + 0.5);
            } catch (e) {}
        };
        
        document.getElementById('volume-control').onchange = (e) => localStorage.setItem('focusPilot_volume', e.target.value);
        document.getElementById('tone-select').onchange = (e) => localStorage.setItem('focusPilot_tone', e.target.value);
        
        const darkModeCheckbox = document.getElementById('dark-mode-checkbox');
        if (darkModeCheckbox) {
            darkModeCheckbox.addEventListener('change', () => {
                if (darkModeCheckbox.checked) {
                    localStorage.setItem('focusPilot_theme', 'dark');
                } else {
                    localStorage.setItem('focusPilot_theme', 'light');
                }
            });
        }

        if (refreshBtn) {
            refreshBtn.addEventListener('click', refreshAll);
        }
    }

    function updateTaskCount() {
        taskCountSpan.textContent = taskCount;
        localStorage.setItem('focusPilot_taskCount', taskCount);
        
        // টাস্ক কাউন্ট বাড়লে পুরানো ডাটা ঠিক রেখে কেবল নতুনের জন্য ডিফল্ট পুশ করবে (বাগ ফিক্সড)
        while (taskTimes.length < taskCount) taskTimes.push(1);
        while (breakTimes.length < taskCount) breakTimes.push(0); 
        
        localStorage.setItem('focusPilot_taskTimes', JSON.stringify(taskTimes));
        localStorage.setItem('focusPilot_breakTimes', JSON.stringify(breakTimes));
        renderTasks();
    }

    function updateCountdown() {
        countdownDisplay.textContent = countdownTime;
        localStorage.setItem('focusPilot_countdown', countdownTime);
    }

    init();
})();
