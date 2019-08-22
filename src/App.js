import React from 'react';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom'
import Root from './pages/Root';

function App() {
  return (
    <Router>
      <Root />
    </Router>
  );
}

export default App;
