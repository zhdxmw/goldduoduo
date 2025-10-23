import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleStartLearning = () => {
    navigate('/home');
  };

  return (
    <div className="welcome-page">
      <div className="welcome-container">
        <div className="welcome-header">
          <div className="app-icon">
            📚
          </div>
          <h1 className="app-title">StoryLearn</h1>
          <p className="app-subtitle">通过个性化故事学习英语</p>
        </div>

        <div className="welcome-content">
          <div className="feature-highlight">
            <h2>让学习变得有趣和高效</h2>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">🎯</div>
                <h3>个性化学习</h3>
                <p>根据你的水平定制故事内容</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📖</div>
                <h3>丰富故事</h3>
                <p>魔法世界、太空探索等精彩主题</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🎵</div>
                <h3>多媒体学习</h3>
                <p>文字、音频、视频全方位体验</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">💡</div>
                <h3>智能推荐</h3>
                <p>AI推荐最适合你的学习内容</p>
              </div>
            </div>
          </div>

          <div className="welcome-actions">
            <button 
              className="start-button"
              onClick={handleStartLearning}
            >
              ▶ 开始学习
            </button>
            <p className="welcome-note">
              开始你的英语学习之旅
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;