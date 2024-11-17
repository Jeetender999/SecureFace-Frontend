import React, { useState } from 'react';
import CameraCapture from '../../components/Camera/CameraCapture';
import axios from 'axios';
import moment from 'moment'; // For date formatting

import './MatchPage.css';


const MatchPage = () => {
  const [matchResult, setMatchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageCapture = async (imageData) => {
    setMatchResult(null); // Clear previous results
    await sendImageToBackend(imageData);
  };

  const handleFileUpload = async (imageData) => {
    setMatchResult(null); // Clear previous results
    await sendImageToBackend(imageData);
  };

  const sendImageToBackend = async (imageData) => {
    setIsLoading(true);

    // Convert Base64 image to Blob
    const blob = await fetch(imageData).then((res) => res.blob());
    const formData = new FormData();
    formData.append('image', blob, 'captured.jpg');

    try {
      const response = await axios.post('http://localhost:5000/api/images/match', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMatchResult(formatResponse(response.data)); // Format and save result
    } catch (error) {
      console.error('Error sending image to backend:', error);
      alert('Failed to match face. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatResponse = (response) => {
    if (response.visitor) {
      const { visitor } = response;
      return {
        type: 'Visitor',
        name: visitor.name,
        age: visitor.age,
        gender: visitor.gender,
        currentEmotion: visitor.currentEmotion,
        emotions: visitor.emotion,
        detectedAt: moment(visitor.detectedAt).format('MMMM Do YYYY, h:mm A'),
      };
    } else if (response.user) {
      const { user, currentEmotion } = response;
      return {
        type: 'User',
        name: user.name,
        age: user.age,
        gender: user.gender,
        currentEmotion,
        registeredAt: moment(user.registeredAt).format('MMMM Do YYYY, h:mm A'),
      };
    } else {
      throw new Error('Unexpected response format.');
    }
  };

  const handleReset = () => {
    setMatchResult(null); // Clear previous results
  };

  return (
    <div className="container">
      <h1>Face Match</h1>
      {isLoading && <p className="loader">Matching in progress... Please wait.</p>}
      <CameraCapture
        onCapture={handleImageCapture}
        onFileUpload={handleFileUpload}
        onReset={handleReset}
      />
      {matchResult && (
        <div className="result-card">
          <h2>{matchResult.type === 'Visitor' ? 'Visitor Details' : 'User Details'}</h2>
          <p><strong>Name:</strong> {matchResult.name}</p>
          <p><strong>Age:</strong> {matchResult.age}</p>
          <p><strong>Gender:</strong> {matchResult.gender}</p>
          <p><strong>Current Emotion:</strong> {matchResult.currentEmotion}</p>
          {matchResult.type === 'Visitor' && (
            <>
              <h3>Emotion Breakdown:</h3>
              <ul className="emotion-list">
                {Object.entries(matchResult.emotions).map(([key, value]) => (
                  <li key={key}>
                    {key}: {value.toFixed(2)}%
                  </li>
                ))}
              </ul>
              <p><strong>Detected At:</strong> {matchResult.detectedAt}</p>
            </>
          )}
          {matchResult.type === 'User' && (
            <p><strong>Registered At:</strong> {matchResult.registeredAt}</p>
          )}
        </div>
      )}
    </div>
  );
  
};

export default MatchPage;
