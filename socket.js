const SESSION_ID = "test-session-1";

const socket = io("http://localhost:5000");

socket.on("connect", () => {
  socket.emit("student_join", { session_id: SESSION_ID });
});

function sendTelemetry(payload) {
  socket.emit("student_telemetry", payload);
}

export { sendTelemetry };
