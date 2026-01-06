import {
  computeBrowFurrow,
  computeSmile,
  computeHeadTilt,
  computeGaze,
  computeFaceCount
} from "./signals.js";

import { updateState } from "./state_logic.js";
import { sendTelemetry } from "./socket.js";
import { startCamera } from "./camera.js";

startCamera();

let browBaseline = null;
let baselineSamples = [];
let baselineStartTime = null;


let lastEmitTime = 0;
const EMIT_INTERVAL = 500;

function onResults(results) {
  const now = performance.now();

 
  if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
    const state = updateState(
      {
        browFurrowed: false,
        smiling: false,
        headTilted: false,
        gaze: "CENTER",
        faceCount: 0
      },
      now
    );

    maybeEmit(state, {}, now, 0);
    return;
  }

  const landmarks = results.multiFaceLandmarks[0];

  if (!baselineStartTime) {
    baselineStartTime = now;
  }

  if (!browBaseline) {
    const left = landmarks[70];
    const right = landmarks[300];

    baselineSamples.push(Math.abs(left.x - right.x));

    if (now - baselineStartTime < 1000) {
      return;
    }

    const sum = baselineSamples.reduce((a, b) => a + b, 0);
    browBaseline = sum / baselineSamples.length;

    console.log("Brow baseline locked:", browBaseline);
  }
  const brow = computeBrowFurrow(landmarks, browBaseline);
  const smile = computeSmile(landmarks);
  const tilt = computeHeadTilt(landmarks);
  const gaze = computeGaze(landmarks);
  const faceCount = computeFaceCount(results);

  const signals = {
    browFurrowed: brow.furrowed,
    smiling: smile.smiling,
    headTilted: tilt.tilted,
    gaze,
    faceCount
  };
  const state = updateState(signals, now);

  console.log("Signals:", signals);
  console.log("STATE:", state);

  maybeEmit(state, signals, now, faceCount);
}

function maybeEmit(state, signals, now, faceCount) {
  if (now - lastEmitTime < EMIT_INTERVAL) return;

  lastEmitTime = now;

  sendTelemetry({
    session_id: "test-session-1",
    state,
    timestamp: Date.now(),
    signals: {
      brow_furrow: signals.browFurrowed || false,
      smile: signals.smiling || false,
      head_tilt: signals.headTilted || false
    },
    proctor: {
      gaze: signals.gaze || "CENTER",
      face_count: faceCount
    }
  });
}
