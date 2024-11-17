import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MatchPage from './pages/Match/MatchPage';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/match" element={<MatchPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
