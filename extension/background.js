// background.js - Manifest V3 (Firefox + Chrome)

console.log("✅ Focus Pilot Pro: Background Service Worker running perfectly");

const api = typeof browser !== "undefined" ? browser : chrome;
let activeTabIds = [];

// ==================== Message Listener ====================
api.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "startMission") {
        startNewMission(message);
        sendResponse({ status: "started", active: true });
    }
    
    else if (message.command === "stopMission") {
        stopMission();
        sendResponse({ status: "stopped", active: false });
    }
    
    else if (message.command === "getStatus") {
        api.storage.local.get(['missionActive', 'currentTask', 'timeLeft'], (result) => {
            sendResponse({
                active: result?.missionActive || false,
                currentTask: result?.currentTask || "Ready to go!",
                timeLeft: result?.timeLeft || 0
            });
        });
        return true;
    }
    
    else if (message.command === "addLiveTask") {
        api.storage.local.get(['missionQueue'], (result) => {
            let queue = result.missionQueue || [];
            queue.push(message.newTask);
            
            // 🌟 [FIXED] হার্ডকোডেড ৫ মিনিট না পাঠিয়ে পপআপ থেকে পাঠানো ওরিজিনাল ব্রেক টাইম কিউতে পুশ করা হচ্ছে
            if (message.newBreak) {
                queue.push(message.newBreak);
            }
            
            api.storage.local.set({ missionQueue: queue }, () => {
                sendResponse({ status: "success" });
            });
        });
        return true;
    }
    return true;
});

// ==================== Start New Mission ====================
function startNewMission(data) {
    stopMission();

    const missionData = {
        missionActive: true,
        missionQueue: data.tasks,
        currentIndex: -1,
        timeLeft: data.countdown,
        settings: data.settings || { tone: 880, volume: 0.7 }
    };

    api.storage.local.set(missionData, () => {
        api.alarms.create("countdown", { periodInMinutes: 1/60 });
    });
}

// ==================== Alarm Listener ====================
api.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "countdown") {
        handleCountdown();
    } else if (alarm.name === "taskTimer") {
        handleTaskTimer();
    }
});

// ==================== Countdown Handler ====================
function handleCountdown() {
    api.storage.local.get(['timeLeft', 'missionActive', 'settings'], (result) => {
        if (!result || !result.missionActive) return;
        
        let timeLeft = (result.timeLeft || 0) - 1;
        updateBadge(timeLeft);

        if (timeLeft <= 10 && timeLeft > 0) {
            playBeep(result.settings?.tone || 880, 150, result.settings?.volume || 0.7, true);
        }

        if (timeLeft <= 0) {
            api.alarms.clear("countdown");
            startTask(0);
        } else {
            api.storage.local.set({ timeLeft: timeLeft });
        }
    });
}

// ==================== Start Task ====================
function startTask(index) {
    api.storage.local.get(['missionQueue', 'settings'], (result) => {
        if (!result || !result.missionQueue || index >= result.missionQueue.length) {
            missionComplete();
            return;
        }
        
        const task = result.missionQueue[index];
        
        if (task.type === 'break' && task.time === 0) {
            startTask(index + 1);
            return;
        }

        // ব্রাউজার নোটিফিকেশন টাইটেল
        const notifTitle = task.type === 'break' ? "Break Time! ☕" : "Focus Pilot: Task Alert! 🟢";
        const notifMsg = task.type === 'break' 
            ? `Enjoy your ${Math.floor(task.time/60)} min break.` 
            : `Time for: "${task.link}"`;

        // 🌟 [SYSTEM RICH NOTIFICATION - GUARANTEED ONSCREEN]
        api.notifications.create({
            type: "basic",
            title: notifTitle,
            message: notifMsg,
            iconUrl: api.runtime.getURL("icons/icon128.png"),
            priority: 2 // ম্যাক্সিমাম প্রায়োরিটি যাতে অন্য উইন্ডো থাকলেও উপরে ভেসে ওঠে
        });

        // লিংক বনাম টেক্সট চেক
        if (task.link && task.link !== "BREAK") {
            const isLink = task.link.includes('.') || task.link.startsWith('http') || task.link.startsWith('localhost');
            
            if (isLink) {
                openNewTab(task.link);
            } else {
                // 🌟 [TAB INJECTION FALLBACK] যদি ব্রাউজারে থাকে তবে স্ক্রিন কালো করে ওভারলে দেখাবে
                api.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                    if (tabs[0] && tabs[0].id) {
                        api.scripting.executeScript({
                            target: { tabId: tabs[0].id },
                            func: (reminderText) => {
                                const oldOverlay = document.getElementById('focus-pilot-overlay');
                                if (oldOverlay) oldOverlay.remove();

                                const overlay = document.createElement('div');
                                overlay.id = 'focus-pilot-overlay';
                                overlay.style.cssText = `
                                    position: fixed !important; top: 0 !important; left: 0 !important; 
                                    width: 100vw !important; height: 100vh !important;
                                    background: rgba(15, 23, 42, 0.98) !important; color: #10b981 !important; 
                                    display: flex !important; justify-content: center !important; align-items: center !important;
                                    font-size: 45px !important; font-weight: bold !important; z-index: 2147483647 !important;
                                    font-family: sans-serif !important; text-align: center !important; padding: 40px !important;
                                    box-sizing: border-box !important; line-height: 1.4 !important;
                                `;
                                overlay.innerHTML = `<div>🚨 Focus Reminder:<br><span style="color: #f43f5e; font-size: 60px;">${reminderText}</span></div>`;
                                document.body.appendChild(overlay);

                                setTimeout(() => { overlay.remove(); }, 5000);
                            },
                            args: [task.link]
                        }).catch(e => console.log("Overlay skipped on local browser page, desktop notification fired."));
                    }
                });
            }
        }

        playBeep(result.settings?.tone || 880, 500, result.settings?.volume || 0.7, false);
        api.alarms.create("taskTimer", { periodInMinutes: 1/60 });

        api.storage.local.set({
            currentIndex: index,
            currentTask: task.type === 'break' ? "On break.. ⏸️" : `Task: ${task.link}`,
            timeLeft: task.time,
            missionActive: true
        });
    });
}

// ==================== Task Timer Handler ====================
function handleTaskTimer() {
    api.storage.local.get(['timeLeft', 'currentIndex', 'missionActive', 'settings'], (result) => {
        if (!result || !result.missionActive) return;
        
        let timeLeft = (result.timeLeft || 0) - 1;
        updateBadge(timeLeft);

        if (timeLeft <= 10 && timeLeft > 0) {
            playBeep(result.settings?.tone || 880, 150, result.settings?.volume || 0.7, true);
        }

        if (timeLeft <= 0) {
            api.alarms.clear("taskTimer");
            startTask((result.currentIndex || 0) + 1);
        } else {
            api.storage.local.set({ timeLeft: timeLeft });
        }
    });
}

// ==================== Helpers ====================
function openNewTab(url) {
    const finalUrl = url.startsWith('http') ? url : 'https://' + url;
    api.tabs.create({ url: finalUrl, active: true }).then(tab => {
        activeTabIds.push(tab.id);
    }).catch(err => console.log("Tab open error:", err));
}

function stopMission() {
    api.alarms.clearAll();
    updateBadge(0);
    api.storage.local.set({ missionActive: false, timeLeft: 0 });
    activeTabIds = [];
}

function missionComplete() {
    api.notifications.create({
        type: "basic",
        title: "Mission Completed! 🏆",
        message: "All tasks and live injections done like a boss! 🔥",
        iconUrl: api.runtime.getURL("icons/icon128.png"),
        priority: 2
    });
    playBeep(600, 1000, 0.7, true);
    stopMission();
}

function updateBadge(seconds) {
    if (seconds <= 0) {
        if (api.action) api.action.setBadgeText({ text: "" });
        return;
    }
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const text = `${mins}:${secs < 10 ? '0' + secs : secs}`;
    if (api.action) {
        api.action.setBadgeText({ text: text });
        api.action.setBadgeBackgroundColor({ color: "#f43f5e" });
    }
}

function playBeep(freq, duration, volume, urgent) {
    try {
        const audioCtx = new (self.AudioContext || self.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.frequency.value = urgent ? freq * 1.2 : freq;
        gainNode.gain.value = volume;
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + duration / 1000);
    } catch (e) {}
}

api.runtime.onStartup.addListener(() => {
    api.storage.local.get(['missionActive', 'currentIndex'], (result) => {
        if (result?.missionActive) {
            if (result.currentIndex === -1) api.alarms.create("countdown", { periodInMinutes: 1/60 });
            else api.alarms.create("taskTimer", { periodInMinutes: 1/60 });
        }
    });
});

api.runtime.onInstalled.addListener(() => { updateBadge(0); });
