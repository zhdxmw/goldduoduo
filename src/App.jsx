import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import HomePage from './components/HomePage';
import CategoryPage from './components/CategoryPage';
import StoryDetailPage from './components/StoryDetailPage';
import CreateStoryPage from './components/CreateStoryPage';
import VideoPlayerPage from './components/VideoPlayerPage';
import TextToSpeechPage from './components/TextToSpeech';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/tts" element={<TextToSpeechPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/story/:storyId" element={<StoryDetailPage />} />
          <Route path="/create" element={<CreateStoryPage />} />
          <Route path="/video/:storyId" element={<VideoPlayerPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
