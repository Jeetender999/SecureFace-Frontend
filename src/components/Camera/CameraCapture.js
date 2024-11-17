import React, { useRef, useState } from 'react';

const CameraCapture = ({ onCapture, onFileUpload, onReset }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraStarted(true);
      setUploadedImage(null); // Clear uploaded image
      onReset(); // Reset results in parent
    } catch (error) {
      console.error('Error accessing the camera:', error);
      alert('Unable to access the camera. Please check your permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraStarted(false);
  };

  const captureImage = async () => {
    if (!cameraStarted) {
      alert('Camera is not started yet!');
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL('image/jpeg'); // Convert to Base64

    setIsProcessing(true);
    await onCapture(imageData); // Send image data to parent
    setIsProcessing(false);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        setUploadedImage(reader.result); // Show uploaded image
        stopCamera(); // Stop the camera if running
        setIsProcessing(true);
        await onFileUpload(reader.result); // Send Base64 image to parent
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ margin: '20px auto', width: '80%', maxWidth: '400px', position: 'relative' }}>
        {!uploadedImage ? (
          <video
            ref={videoRef}
            style={{
              width: '100%',
              height: 'auto',
              border: '1px solid black',
              borderRadius: '10px',
            }}
          ></video>
        ) : (
          <img
            src={uploadedImage}
            alt="Uploaded"
            style={{
              width: '100%',
              height: 'auto',
              border: '1px solid black',
              borderRadius: '10px',
            }}
          />
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      </div>
      <div style={{ margin: '20px' }}>
        {!cameraStarted && (
          <button onClick={startCamera} disabled={isProcessing}>
            Start Camera
          </button>
        )}
        {cameraStarted && (
          <button onClick={captureImage} disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Capture Image'}
          </button>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={isProcessing}
          style={{ marginLeft: '10px' }}
        />
      </div>
    </div>
  );
};

export default CameraCapture;
