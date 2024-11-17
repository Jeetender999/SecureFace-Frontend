import * as faceapi from 'face-api.js';

export const loadModels = async () => {
  const MODEL_URL = '/models'; // Path to the models folder in public

  try {
    // Load all necessary models
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ]);

    console.log('All Face API models loaded successfully!');
  } catch (error) {
    console.error('Error loading Face API models:', error);
  }
};
