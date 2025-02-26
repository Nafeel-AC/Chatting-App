import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Form from './components/Login';
import Signup from './components/Signup';
import RegisterUser from './components/Register_User';
import Dashboard from './components/Dashboard';
import Chat from './components/Chat';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Form />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/register-user" element={<RegisterUser />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
