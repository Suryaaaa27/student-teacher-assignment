const videoElement = document.getElementById("video");

export function startCamera() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      videoElement.srcObject = stream;
    })
    .catch(err => {
      console.error("Camera access denied:", err);
    });
}
