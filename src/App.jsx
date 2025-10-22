import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import ChatInterface from './components/ChatInterface';
import TextToSpeech from './components/TextToSpeech';
import ImageGenerator from './components/ImageGenerator';
import './App.css';

function Navigation() {
  const location = useLocation();
  
  return (
    <nav className="app-nav">
      <div className="nav-container">
        <div className="nav-brand">
          <h2>AI助手工具箱</h2>
        </div>
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            💬 AI聊天
          </Link>
          <Link 
            to="/tts" 
            className={`nav-link ${location.pathname === '/tts' ? 'active' : ''}`}
          >
            🔊 文本转语音
          </Link>
          <Link 
            to="/image" 
            className={`nav-link ${location.pathname === '/image' ? 'active' : ''}`}
          >
            🎨 图片生成
          </Link>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<ChatInterface />} />
            <Route path="/tts" element={<TextToSpeech />} />
            <Route path="/image" element={<ImageGenerator />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
