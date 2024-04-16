async function createBoomerangEffect(videoElement, canvasOutput, bufferVideo, mimeType) {
    let recording = false;
    let playback = false;
    let frames = [];
    let frameIdx = 0;
    const context = canvasOutput.getContext('2d');
    const width = videoElement.videoWidth;
    const height = videoElement.videoHeight;
    canvasOutput.width = width;
    canvasOutput.height = height;

    // Set up the streams and recorder
    let canvasStream = canvasOutput.captureStream(0);
    let canvasStreamTrack = canvasStream.getTracks()[0];
    let rec = new MediaRecorder(canvasStream, { mimeType: mimeType });

    // Function to render frames
    let renderFrame = () => {
        if (canvasStreamTrack === undefined) return;

        if (recording) {
            context.drawImage(bufferVideo, 0, 0);
            let imageData = context.getImageData(0, 0, width, height);
            frames.push(imageData);
        } else if (playback) {
            canvasOutput.width = canvasOutput.width; // Clear canvas
            frameIdx = (++frameIdx) % frames.length;
            context.putImageData(frames[frameIdx], 0, 0);
            if (frameIdx === 0 && rec.state !== 'inactive') {
                rec.stop();
            }
        } else {
            context.drawImage(bufferVideo, 0, 0);
        }

        canvasStreamTrack.requestFrame();
        requestAnimationFrame(renderFrame);
    };

    // Start recording
    let startRecording = async () => {
        recording = true;
        playback = false;
        frames = [];
        rec.start(10);
    };

    // Stop recording and prepare for playback
    let stopRecording = () => {
        recording = false;
        playback = true;
        frames = [...frames, ...frames.slice(0).reverse()];
        frameIdx = Math.round(frames.length / 2);
    };

    // Event listeners for starting and stopping the recording
    document.getElementById('startRecording').addEventListener('click', startRecording);
    document.getElementById('stopRecording').addEventListener('click', stopRecording);

    // Initialize frame rendering
    requestAnimationFrame(renderFrame);

    // Handle the data available event of MediaRecorder
    rec.ondataavailable = (event) => {
        if (event.data.size > 0) {
            let url = URL.createObjectURL(event.data);
            // Do something with the video file, e.g., download it or play it back
            console.log('Boomerang video URL:', url);
        }
    };
}
