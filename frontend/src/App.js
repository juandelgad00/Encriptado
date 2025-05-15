import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Welcome from './Welcome';
import Register from './Register'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/register" element={<Register />} /> {/* nueva ruta */}
      </Routes>
    </Router>
  );
}

export default App;