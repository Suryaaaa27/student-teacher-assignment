const timers = {
  confusion: 0,
  smile: 0,
  gazeAway: 0,
  noFace: 0
};

let lastTimestamp = null;

const THRESHOLDS = {
  CONFUSION_TIME: 2.5,
  SMILE_TIME: 1.5,
  GAZE_AWAY_TIME: 4.0,
  NO_FACE_TIME: 1.5
};

function getDeltaTime(now) {
  if (lastTimestamp === null) {
    lastTimestamp = now;
    return 0;
  }

  const delta = (now - lastTimestamp) / 1000;
  lastTimestamp = now;
  return delta;
}

function updateState(signals, now) {
  const dt = getDeltaTime(now);

  const {
    browFurrowed,
    smiling,
    headTilted,
    gaze,
    faceCount
  } = signals;

    if (gaze !== "CENTER") {
    timers.gazeAway += dt;
  } else {
    timers.gazeAway = Math.max(0, timers.gazeAway - dt);
  }

  if (faceCount === 0) {
    timers.noFace += dt;
  } else {
    timers.noFace = 0;
  }

  if (faceCount > 1) {
    return "PROCTOR_ALERT";
  }

  if (
    timers.gazeAway >= THRESHOLDS.GAZE_AWAY_TIME ||
    timers.noFace >= THRESHOLDS.NO_FACE_TIME
  ) {
    return "PROCTOR_ALERT";
  }

    const confusionSignals =
    (browFurrowed ? 1 : 0) +
    (headTilted ? 1 : 0) +
    (!smiling ? 1 : 0);

  if (confusionSignals >= 2 && gaze === "CENTER") {
    timers.confusion += dt;
  } else {
    timers.confusion = Math.max(0, timers.confusion - dt);
  }

  if (timers.confusion >= THRESHOLDS.CONFUSION_TIME) {
    return "CONFUSED";
  }

    if (smiling && !browFurrowed) {
    timers.smile += dt;
  } else {
    timers.smile = 0;
  }

  if (timers.smile >= THRESHOLDS.SMILE_TIME) {
    return "HAPPY";
  }
  return "FOCUSED";
}
export { updateState };
