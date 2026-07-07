# 🧠 Focus Pilot

### An Intelligent Browser Extension for Mitigating Attention Fragmentation in High-Cognitive Digital Workflows

<p align="center">

![Version](https://img.shields.io/badge/version-4.0.0-blue)
![Manifest](https://img.shields.io/badge/Manifest-V3-success)
![Platform](https://img.shields.io/badge/Platform-Chrome%20%7C%20Firefox-orange)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-Active%20Development-purple)

</p>

<p align="center">
  <em>
  Focus is no longer a matter of willpower. It is a matter of architecture.
  </em>
</p>

---

# 📖 Overview

**Focus Pilot** is a next-generation browser extension designed to reduce attention fragmentation during deep work, software development, research, academic study, and knowledge-intensive workflows.

Unlike traditional productivity tools that rely on passive timers and voluntary compliance, Focus Pilot introduces an **active intervention model**, where reminders, contextual prompts, task checkpoints, and temporal enforcement mechanisms appear directly within the user's workflow.

The project explores a simple but powerful hypothesis:

> Human focus is rarely lost because we forget our goals.
> Human focus is lost because digital environments continuously compete for our attention.

Focus Pilot attempts to redesign this interaction layer.

---


📥 **Install the Extension:** [Get it on Firefox Add-ons Store](https://addons.mozilla.org/en-US/firefox/addon/focus-pilot-pro/)



<p align="center">
  <img src="Screenshot 2026-07-07 at 19-29-01 Focus Pilot Pro • centered.png" width="400" title="Light Dashboard">
  <img src="Screenshot 2026-07-07 at 19-29-39 Focus Pilot Pro • centered.png" width="400" title="Dark Dashboard">
  <img src="Screenshot 2026-07-07 at 19-31-14 Focus Pilot Pro • centered.png" width="400" title="Multi-Task Setup">
  <img src="Screenshot 2026-07-07 at 19-31-56 Focus Pilot Pro • centered.png" width="400" title="Active Mission Timer">
</p>  

# 🎯 Why Focus Pilot Exists

Modern browsers have become the primary operating environment for developers, researchers, students, founders, and knowledge workers.

Yet the same environment contains:

* Infinite scrolling systems
* Social media interruptions
* Context switching loops
* Notification-driven distractions
* Tab overload
* Cognitive fatigue accumulation

Most productivity applications respond to these challenges with:

* Timers
* Sound alerts
* Passive notifications
* Static schedules

The problem is simple:

When a notification appears, the user can ignore it.

When cognitive fatigue increases, passive systems lose effectiveness.

Focus Pilot was built to investigate an alternative model:

> Active In-Context Intervention.

Instead of asking users to constantly self-regulate, the system assists attention management directly inside the browser environment.

---

# 🏛️ Project History

## Phase I — Initial Launch (April 2026)

The earliest version of Focus Pilot was developed as a lightweight productivity extension focused on interval management.

### Core Characteristics

* Fixed minute-based work sessions
* Linear task scheduling
* Static break periods
* Basic reminder architecture
* Local browser persistence

### Limitations Discovered

While effective for traditional study sessions, the architecture struggled with:

* Rapid development workflows
* Research-driven browsing
* Quick reference lookups
* Dynamic task changes
* Sub-minute productivity cycles

The system assumed work was predictable.

Real-world work is not.

---

## Phase II — Architectural Reconstruction (July 2026)

The project underwent a complete redesign.

Instead of functioning as a timer, Focus Pilot evolved into a browser-native attention management framework.

### Major Improvements

#### ✅ Dynamic Task Injection

Tasks can be updated during active sessions without restarting workflow cycles.

#### ✅ State Preservation Engine

Critical session information remains synchronized even after popup closures or interface reloads.

#### ✅ Live Runtime Updates

Users can modify operational parameters while missions remain active.

#### ✅ Micro-Sprint Support

The system now supports ultra-short intervention cycles designed for:

* Quick memory refreshes
* Visual recovery breaks
* Flashcard reviews
* Cognitive reset moments

#### ✅ Improved Session Reliability

Local state synchronization significantly reduces accidental configuration loss.

---

# 🔬 What Makes Focus Pilot Different?

Most productivity applications treat focus as a timer problem.

Focus Pilot treats focus as an interaction design problem.

| Category              | Traditional Productivity Apps | Focus Pilot               |
| --------------------- | ----------------------------- | ------------------------- |
| Focus Model           | Passive Reminder              | Active Intervention       |
| Task Updates          | Session Restart Required      | Live Runtime Injection    |
| Workflow Adaptation   | Static                        | Dynamic                   |
| Browser Awareness     | Limited                       | Native Extension Layer    |
| Cognitive Checkpoints | Minimal                       | Integrated                |
| Session Persistence   | Basic                         | State Preservation Engine |
| Micro-Sprint Support  | Rare                          | Built-In                  |

---

# 🧠 Core Design Philosophy

The extension is built around four principles:

### 1. Attention Is a Limited Resource

Focus should be protected before it is lost.

---

### 2. Friction Can Be Useful

Small, intentional interruptions can prevent larger distractions.

---

### 3. Context Matters

Reminders are most effective when delivered inside the active workflow.

---

### 4. Systems Beat Motivation

Consistent environments outperform temporary motivation.

---

# ⚙️ Key Features

## 🚀 Dynamic Live Task Injection

Inject new tasks, goals, reminders, or links into an active session without restarting.

---

## 🧩 Session Persistence Engine

Automatic local synchronization preserves workflow state across interface closures.

---

## ⏱️ Micro-Sprint Framework

Supports extremely short attention cycles for rapid cognitive reinforcement.

---

## 📋 Multi-Task Workflow Support

Manage multiple focus objectives simultaneously.

---

## 🔄 Runtime Configuration Updates

Modify schedules and operational settings while sessions remain active.

---

## 🌐 Browser-Native Experience

Designed specifically for modern web-based work environments.

---

# 🏗️ Technical Architecture

```text
┌─────────────────────────────┐
│        Popup Interface      │
│     User Tasks & Inputs     │
└─────────────┬───────────────┘
              │
              ▼
┌─────────────────────────────┐
│  Background Service Worker  │
│  Session State Management   │
└─────────────┬───────────────┘
              │
              ▼
┌─────────────────────────────┐
│ Dynamic Task Injection Core │
│ Runtime Event Controller    │
└─────────────┬───────────────┘
              │
              ▼
┌─────────────────────────────┐
│ Active Browser Environment  │
│ Contextual Focus Overlays   │
└─────────────────────────────┘
```

---

# 🛠️ Technology Stack

### Frontend

* HTML5
* CSS3
* JavaScript (ES6+)

### Browser APIs

* Chrome Extension API
* Firefox Extension API
* Storage API
* Runtime Messaging API

### Architecture

* Manifest V3
* Event Driven Design
* Local State Synchronization
* Runtime Task Injection

---

# 📦 Installation

## Chromium Browsers

Compatible with:

* Google Chrome
* Microsoft Edge
* Brave Browser
* Opera

### Steps

```bash
git clone https://github.com/Nahid-mahmud555/focus-pilot-pro-official.git
```

1. Open:

```text
chrome://extensions
```

2. Enable Developer Mode

3. Click:

```text
Load Unpacked
```

4. Select the project directory

---

## Firefox

1. Open:

```text
about:debugging
```

2. Click:

```text
This Firefox
```

3. Select:

```text
Load Temporary Add-on
```

4. Choose:

```text
manifest.json
```

---


## 📥 Get Focus Pilot Pro

You can download the latest version of **Focus Pilot Pro** directly from our official website.

### [👉 Download from Official Website](https://full-f.vercel.app/)


# 📚 Potential Use Cases

### 🎓 Students

* Study planning
* Revision sessions
* Exam preparation

### 👨‍💻 Developers

* Coding sprints
* Debugging sessions
* Documentation review

### 🔬 Researchers

* Literature review
* Paper analysis
* Knowledge synthesis

### 🚀 Founders & Builders

* Deep work blocks
* Product development
* Strategic planning

---

# 🔮 Future Roadmap

### Version 4.x

* Smart Adaptive Scheduling
* Cognitive Load Estimation
* Focus Analytics Dashboard
* Session Heatmaps
* Advanced Browser Blocking
* AI-Assisted Workflow Suggestions

### Long-Term Vision

Develop Focus Pilot into a browser-native cognitive operating layer capable of assisting users in managing attention, workflow transitions, and digital focus at scale.

---

# 👨‍💻 Author

## Nahid Mahmud

Founder & Principal Architect

Department of Computer Science & Engineering

Varendra University

Research Interests:

* Human-Computer Interaction (HCI)
* Cognitive Systems
* Productivity Engineering
* Attention Management Frameworks
* Browser-Native Productivity Architecture

---

# 📬 Contact

For collaboration, academic discussion, feature proposals, bug reports, or research inquiries:

**Email:** [tohidul07890@gmail.com](mailto:tohidul07890@gmail.com)

---

# ⭐ Support The Project

If you find this project useful:

* Star the repository
* Fork the project
* Open issues
* Submit pull requests
* Share feedback

Every contribution helps improve the future of browser-native productivity systems.

---

# 📄 License

Licensed under the MIT License.

Copyright © 2026 Nahid Mahmud

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files, to deal in the Software without restriction under the terms of the MIT License.

---

<p align="center">
<b>Focus Pilot</b><br>
Building systems that protect attention in a world designed to fragment it.
</p>
