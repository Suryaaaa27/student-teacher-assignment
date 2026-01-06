import time
import socketio
SERVER_URL = "http://localhost:5000"
SESSION_ID = "test-session-1"
sio_student = socketio.Client()
sio_teacher = socketio.Client()

@sio_teacher.event
def connect():
    print("[Teacher] Connected")
    sio_teacher.emit("teacher_join", {"session_id": SESSION_ID})

@sio_teacher.on("state_update")
def on_state_update(data):
    print("[Teacher] State update:", data)

@sio_teacher.on("session_lost")
def on_session_lost(data):
    print("[Teacher] Session lost:", data)

@sio_student.event
def connect():
    print("[Student] Connected")
    sio_student.emit("student_join", {"session_id": SESSION_ID})

def run_test():
    sio_teacher.connect(SERVER_URL)
    sio_student.connect(SERVER_URL)

    for i in range(5):
        fake_payload = {
            "session_id": SESSION_ID,
            "state": "CONFUSED" if i % 2 == 0 else "FOCUSED",
            "timestamp": time.time(),
            "signals": {
                "brow_furrow": i % 2 == 0,
                "smile": False,
                "head_tilt": True
            },
            "proctor": {
                "gaze": "CENTER",
                "face_count": 1
            }
        }

        sio_student.emit("student_telemetry", fake_payload)
        time.sleep(1)

    print("[Student] Disconnecting")
    sio_student.disconnect()
    time.sleep(2)

    sio_teacher.disconnect()


if __name__ == "__main__":
    run_test()
