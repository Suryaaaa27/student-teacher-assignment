const SESSION_ID = "test-session-1";
const socket = io("http://localhost:5000");

const statusBox = document.getElementById("statusBox");
const statusText = document.getElementById("statusText");

const canvas = document.getElementById("timeline");
const ctx = canvas.getContext("2d");

const timeline = [];
const MAX_POINTS = 60;

socket.on("connect", () => {
  socket.emit("teacher_join", { session_id: SESSION_ID });
});

socket.on("state_update", data => {
  if (data.message === "student_connected") {
    statusText.textContent = "Student connected";
    return;
  }

  updateStatus(data.state);
  pushTimeline(data.state);
  drawTimeline();
});

socket.on("session_lost", () => {
  statusText.textContent = "Student disconnected";
  statusBox.className = "status";
});

function updateStatus(state) {
  statusBox.className = "status";

  if (state === "FOCUSED") {
    statusBox.classList.add("focused");
    statusText.textContent = "Student is Focused";
  } else if (state === "CONFUSED") {
    statusBox.classList.add("confused");
    statusText.textContent = "Student is Confused";
  } else if (state === "PROCTOR_ALERT") {
    statusBox.classList.add("proctor");
    statusText.textContent = "Proctor Alert";
  } else if (state === "HAPPY") {
    statusBox.classList.add("focused");
    statusText.textContent = "Student is Happy";
  }
}

function pushTimeline(state) {
  timeline.push(state);
  if (timeline.length > MAX_POINTS) {
    timeline.shift();
  }
}

function drawTimeline() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const step = canvas.width / MAX_POINTS;

  timeline.forEach((state, index) => {
    if (state === "FOCUSED") ctx.fillStyle = "#2ecc71";
    else if (state === "CONFUSED") ctx.fillStyle = "#f1c40f";
    else if (state === "PROCTOR_ALERT") ctx.fillStyle = "#e74c3c";
    else ctx.fillStyle = "#95a5a6";

    ctx.fillRect(index * step, 0, step, canvas.height);
  });
}
