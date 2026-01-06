**Real-Time Student Supervision & Engagement System (MVP)**

A privacy-first, real-time web application that empowers teachers with live visibility into student engagement and integrity, without streaming or storing any raw video data.

This system detects confusion, focus, and proctoring violations using browser-based computer vision and transmits only derived behavioral signals to a teacher dashboard via WebSockets.

**Problem Statement**
Online education lacks real-time feedback. Teachers cannot easily know:

when a student is confused,

when attention drops,

or when academic integrity is compromised.

Traditional proctoring systems are invasive and privacy-unfriendly.

Our goal:
Provide actionable insights to teachers while keeping student privacy intact.

**Key Features
 Student Portal**

Live webcam capture (browser-side)

Facial landmark analysis using MediaPipe

Behavioral signal extraction (no image storage)

Real-time state inference:

Focused / Neutral

Confused

Proctor Alert

**Teacher Dashboard**

Live student connection status

Real-time engagement state visualization

Color-coded alerts:

🟢 Focused

🟡 Confused

🔴 Proctor Alert

Timeline-ready architecture (MVP shows live state)

**Architecture Overview**
Student Browser
 ├─ Camera (Web API)
 ├─ MediaPipe FaceMesh
 ├─ Signal Extraction (JS)
 ├─ Temporal State Logic
 └─ WebSocket (Socket.IO)
          ↓
Flask Backend (Relay Only)
          ↓
Teacher Dashboard (Live UI)

Why this design?

Low latency (no video upload)

Privacy-first (signals only)

Scalable (stateless backend relay)

Explainable logic (no black-box ML)

**Tech Stack**
Frontend

HTML, CSS, Vanilla JavaScript

MediaPipe FaceMesh (CDN)

Socket.IO client

Backend

Python

Flask

Flask-SocketIO

Communication

WebSockets (Socket.IO)

No HTTP polling for state updates

**Confusion Detection Logic (Core Idea)**

Confusion is not treated as a single emotion, but inferred from sustained facial cues:

A student is classified as CONFUSED when:

Brow furrowing is detected

Head tilt is present

Smile is absent

Gaze remains centered

Signals persist for a minimum duration

This conservative approach avoids false positives and favors teacher trust over aggressive detection.

**Proctoring Logic**

Proctor alerts are triggered when:

No face is detected for a sustained duration

Multiple faces appear in frame

Gaze is consistently away from the screen (basic MVP logic)

**How to Run the Project**
Backend
cd backend
pip install -r requirements.txt
python app.py


Backend runs at:
http://localhost:5000

Student Interface

Open student/index.html using a local server (Live Server recommended)

Allow camera access when prompted

Teacher Dashboard

Open teacher/index.html

The dashboard updates automatically when the student connects

**Privacy Considerations**

No video or images are sent to the backend

Only derived signals and state labels are transmitted

No data persistence is implemented

This system is designed to be privacy-preserving by default.

**Repository Structure**
backend/
  ├── app.py
  ├── socket_events.py
  ├── session_store.py
  └── requirements.txt

student/
  ├── index.html
  ├── facemesh.js
  ├── camera.js
  ├── signals.js
  ├── state_logic.js
  └── socket.js

teacher/
  ├── index.html
  ├── dashboard.js
  └── style.css

**Limitations & Future Work**

Gaze detection can be refined using iris depth modeling

Timeline visualization can be extended using chart libraries

Multi-student sessions can be supported via room scaling

Model calibration per user can improve robustness

**Conclusion**

This MVP demonstrates a production-minded approach to real-time student supervision:

Explainable logic

Ethical design

Low-latency communication

Clear separation of concerns

It prioritizes teacher insight over surveillance and lays a strong foundation for future expansion.
