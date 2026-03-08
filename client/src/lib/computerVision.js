import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as faceLandmarksDetection from '@tensorflow-models/face-detection';
import * as bodySegmentation from '@tensorflow-models/body-segmentation';

let faceDetector = null;
let bodySegmentor = null;

export const initDetectors = async () => {
  try {
    // Initialize face detection
    faceDetector = await faceLandmarksDetection.createDetector(
      faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
      {
        runtime: 'mediapipe',
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
      }
    );

    // Initialize body segmentation
    bodySegmentor = await bodySegmentation.createSegmenter(
      bodySegmentation.SupportedModels.BodyPix,
      {
        architecture: 'MobileNetV1',
        outputStride: 16,
        multiplier: 0.75,
        quantBytes: 2,
      }
    );

    console.log('✅ Computer Vision detectors initialized');
  } catch (error) {
    console.error('Error initializing detectors:', error);
  }
};

export const detectFaces = async (video) => {
  if (!faceDetector) return [];
  try {
    const faces = await faceDetector.estimateFaces(video);
    return faces;
  } catch (error) {
    console.error('Face detection error:', error);
    return [];
  }
};

export const detectBodySegmentation = async (video) => {
  if (!bodySegmentor) return null;
  try {
    const segmentation = await bodySegmentor.segmentPeople(video);
    return segmentation;
  } catch (error) {
    console.error('Body segmentation error:', error);
    return null;
  }
};

export const blurBackground = async (video, canvas, ctx, segmentation) => {
  if (!segmentation || !ctx) return;

  try {
    const { data } = await bodySegmentor.segmentPeople(video);
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixelData = pixels.data;

    for (let i = 0; i < data.length; i++) {
      if (data[i] === 0) {
        // Background pixel
        // Apply blur effect
        const pixelIndex = i * 4;
        // Simple blur by averaging neighboring pixels
        const r = pixelData[pixelIndex];
        const g = pixelData[pixelIndex + 1];
        const b = pixelData[pixelIndex + 2];
        const blurred = Math.floor((r + g + b) / 3);
        pixelData[pixelIndex] = blurred;
        pixelData[pixelIndex + 1] = blurred;
        pixelData[pixelIndex + 2] = blurred;
      }
    }

    ctx.putImageData(pixels, 0, 0);
  } catch (error) {
    console.error('Background blur error:', error);
  }
};

export const drawFaceBoxes = (canvas, ctx, faces) => {
  faces.forEach(face => {
    if (face.box) {
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.strokeRect(face.box.xMin, face.box.yMin, face.box.width, face.box.height);

      // Draw face landmarks
      if (face.landmarks) {
        ctx.fillStyle = '#00ff00';
        face.landmarks.forEach(point => {
          ctx.beginPath();
          ctx.arc(point[0], point[1], 2, 0, 2 * Math.PI);
          ctx.fill();
        });
      }
    }
  });
};

export const detectEmotion = (landmarks) => {
  // Simple emotion detection based on facial landmarks
  // In production, you would use a proper emotion detection model
  if (!landmarks || landmarks.length === 0) return 'neutral';

  try {
    // Calculate mouth openness (rough estimate)
    const mouthTop = landmarks[13];
    const mouthBottom = landmarks[14];
    const mouthDistance = Math.abs(mouthBottom[1] - mouthTop[1]);

    if (mouthDistance > 20) {
      return 'happy';
    }

    // Calculate eye openness
    const leftEyeTop = landmarks[159];
    const leftEyeBottom = landmarks[145];
    const eyeOpenness = Math.abs(leftEyeBottom[1] - leftEyeTop[1]);

    if (eyeOpenness < 10) {
      return 'surprised';
    }

    return 'neutral';
  } catch (error) {
    console.error('Emotion detection error:', error);
    return 'neutral';
  }
};

export const detectGestureHand = (landmarks) => {
  // Simple hand gesture detection
  // In production, use MediaPipe Hand Detection
  if (!landmarks) return 'none';

  try {
    // Check for thumbs up
    const thumbTip = landmarks[4];
    const otherFingerTips = [8, 12, 16, 20];

    const allFingersDown = otherFingerTips.every(idx => {
      return landmarks[idx][1] > landmarks[idx - 1][1];
    });

    if (allFingersDown && thumbTip[1] < landmarks[3][1]) {
      return 'thumbs-up';
    }

    return 'neutral';
  } catch (error) {
    console.error('Gesture detection error:', error);
    return 'none';
  }
};

export const applyVirtualBackground = async (video, canvas, ctx, backgroundImage) => {
  try {
    const segmentation = await detectBodySegmentation(video);
    
    if (!segmentation || !segmentation.data) return;

    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixelData = pixels.data;
    const segmentationData = segmentation.data;

    for (let i = 0; i < segmentationData.length; i++) {
      if (segmentationData[i] === 0) {
        // Background pixel - replace with background image
        const pixelIndex = i * 4;
        // In production, sample from background image
        pixelData[pixelIndex] = 100;      // R
        pixelData[pixelIndex + 1] = 200;  // G
        pixelData[pixelIndex + 2] = 255;  // B
      }
    }

    ctx.putImageData(pixels, 0, 0);
  } catch (error) {
    console.error('Virtual background error:', error);
  }
};
