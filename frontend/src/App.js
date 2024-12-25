import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Welcome from './components/splash';
import Login from './components/login';
import Register from './components/register';
import ToDo from './components/home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<ToDo />} />
      </Routes>
    </Router>
  );
}

export default App;
