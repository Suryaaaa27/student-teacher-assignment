function distance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function computeBrowFurrow(landmarks, baseline) {
  const leftBrow = landmarks[70];
  const rightBrow = landmarks[300];

  const currentDistance = distance(leftBrow, rightBrow);

  if (!baseline || baseline === 0) {
    return { ratio: 1.0, furrowed: false };
  }

  const ratio = currentDistance / baseline;

  return {
    ratio,
    furrowed: ratio < 0.92
  };
}

function computeSmile(landmarks) {
  const left = landmarks[61];
  const right = landmarks[291];
  const upper = landmarks[13];
  const lower = landmarks[14];

  const mouthWidth = distance(left, right);
  const mouthHeight = distance(upper, lower);

  if (mouthHeight === 0) {
    return { ratio: 0, smiling: false };
  }

  const ratio = mouthWidth / mouthHeight;

  return {
    ratio,
    smiling: ratio > 1.8
  };
}

function computeHeadTilt(landmarks) {
  const nose = landmarks[1];
  const chin = landmarks[152];

  const dx = chin.x - nose.x;
  const dy = chin.y - nose.y;

  const angleRad = Math.atan2(dx, dy);
  const angleDeg = angleRad * (180 / Math.PI);

  return {
    angle: angleDeg,
    tilted: Math.abs(angleDeg) > 8
  };
}

function computeGaze(landmarks) {
  const eyeOuter = landmarks[33];
  const eyeInner = landmarks[133];
  const iris = landmarks[468];

  const eyeWidth = eyeInner.x - eyeOuter.x;
  const irisPos = (iris.x - eyeOuter.x) / eyeWidth;

  if (irisPos < 0.35) return "LEFT";
  if (irisPos > 0.65) return "RIGHT";

  return "CENTER";
}

function computeFaceCount(results) {
  if (!results.multiFaceLandmarks) return 0;
  return results.multiFaceLandmarks.length;
}

export {
  computeBrowFurrow,
  computeSmile,
  computeHeadTilt,
  computeGaze,
  computeFaceCount
};
