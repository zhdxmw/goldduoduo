import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  const storyCategories = [
    {
      id: 'magic',
      title: '魔法世界',
      subtitle: '奇幻冒险',
      icon: '🪄',
      color: '#667eea'
    },
    {
      id: 'space',
      title: '太空探索',
      subtitle: '科幻冒险',
      icon: '🚀',
      color: '#764ba2'
    },
    {
      id: 'romance',
      title: '浪漫爱情',
      subtitle: '情感故事',
      icon: '💙',
      color: '#f093fb'
    },
    {
      id: 'mystery',
      title: '神秘侦探',
      subtitle: '悬疑推理',
      icon: '💙',
      color: '#4facfe'
    }
  ];

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  const handleCreateStory = () => {
    navigate('/create');
  };

  const handleContinueLearning = () => {
    navigate('/story/magic-academy');
  };

  return (
    <div className="home-page">
      <div className="home-container">
        {/* 搜索栏 */}
        <div className="search-section">
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="搜索故事"
              className="search-input"
            />
            <button className="search-button">🔍</button>
          </div>
        </div>

        {/* 推荐故事 */}
        <div className="recommendations-section">
          <h2 className="section-title">推荐故事</h2>
          <div className="story-list">
            <div className="story-item" onClick={() => navigate('/category/magic')}>
              <div className="story-content">
                <div className="story-icon">🪄</div>
                <div className="story-info">
                  <div className="story-name">魔法世界</div>
                  <div className="story-count">12个故事</div>
                </div>
              </div>
              <div className="story-arrow">→</div>
            </div>

            <div className="story-item" onClick={() => navigate('/category/space')}>
              <div className="story-content">
                <div className="story-icon">🚀</div>
                <div className="story-info">
                  <div className="story-name">太空探索</div>
                  <div className="story-count">8个故事</div>
                </div>
              </div>
              <div className="story-arrow">→</div>
            </div>

            <div className="story-item" onClick={() => navigate('/category/romance')}>
              <div className="story-content">
                <div className="story-icon">💕</div>
                <div className="story-info">
                  <div className="story-name">浪漫爱情</div>
                  <div className="story-count">15个故事</div>
                </div>
              </div>
              <div className="story-arrow">→</div>
            </div>

            <div className="story-item" onClick={() => navigate('/category/mystery')}>
              <div className="story-content">
                <div className="story-icon">🔍</div>
                <div className="story-info">
                  <div className="story-name">神秘侦探</div>
                  <div className="story-count">10个故事</div>
                </div>
              </div>
              <div className="story-arrow">→</div>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="action-buttons">
          <button className="action-btn primary" onClick={() => navigate('/create')}>
            ✨ 创建故事
          </button>
          <button className="action-btn secondary" onClick={() => navigate('/story/magic-academy')}>
            📚 继续学习
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;