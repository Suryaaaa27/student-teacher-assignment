active_sessions = {}


def create_session(session_id, student_sid):
    active_sessions[session_id] = {
        "student_sid": student_sid,
        "last_state": None,
        "timeline": []
    }


def get_session(session_id):
    return active_sessions.get(session_id)


def update_session_state(session_id, data):
    session = active_sessions.get(session_id)
    if not session:
        return None

    session["last_state"] = data
    session["timeline"].append(data)

    if len(session["timeline"]) > 60:
        session["timeline"].pop(0)

    return session


def remove_session_by_student_sid(student_sid):
    for session_id, session in list(active_sessions.items()):
        if session.get("student_sid") == student_sid:
            del active_sessions[session_id]
            return session_id
    return None
