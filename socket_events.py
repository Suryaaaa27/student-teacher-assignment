from flask_socketio import join_room, emit
from flask import request
from session_store import (
    create_session,
    get_session,
    update_session_state,
    remove_session_by_student_sid
)


def register_socket_events(socketio):

    @socketio.on("student_join")
    def handle_student_join(data):
        session_id = data.get("session_id")
        join_room(session_id)

        create_session(session_id, request.sid)

        emit("state_update", {"message": "student_connected"}, room=session_id)

    @socketio.on("teacher_join")
    def handle_teacher_join(data):
        session_id = data.get("session_id")
        join_room(session_id)

        session = get_session(session_id)
        if session and session["last_state"]:
            emit("state_update", session["last_state"])

    @socketio.on("student_telemetry")
    def handle_student_telemetry(data):
        session_id = data.get("session_id")

        session = update_session_state(session_id, data)
        if not session:
            return

        emit("state_update", data, room=session_id)

    @socketio.on("disconnect")
    def handle_disconnect():
        sid = request.sid
        session_id = remove_session_by_student_sid(sid)
        if session_id:
            emit("session_lost", {"session_id": session_id}, room=session_id)
