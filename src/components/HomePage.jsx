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
      color: '#667eea',
      role: 'hli',
      description: '进入神秘的魔法世界，体验奇幻冒险'
    },
    {
      id: 'princess',
      title: '艾莎女王',
      subtitle: '童话故事',
      icon: '👸',
      color: '#764ba2',
      role: 'aisha',
      description: '与冰雪女王一起探索童话王国'
    },
    {
      id: 'romance',
      title: '浪漫爱情',
      subtitle: '情感故事',
      icon: '💕',
      color: '#f093fb',
      role: 'bazong',
      description: '体验甜蜜浪漫的爱情故事'
    },
    {
      id: 'mystery',
      title: '神秘侦探',
      subtitle: '悬疑推理',
      icon: '🔍',
      color: '#4facfe',
      role: 'woman',
      description: '解开谜团，体验刺激的推理过程'
    }
  ];

  const handleCategoryClick = (role) => {
    navigate(`/story/${role}`);
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

        {/* 故事分类 */}
        <div className="recommendations-section">
          <h2 className="section-title">故事分类</h2>
          <div className="story-categories-grid">
            {storyCategories.map((category) => (
              <div 
                key={category.id} 
                className="category-card" 
                onClick={() => handleCategoryClick(category.role)}
                style={{ '--category-color': category.color }}
              >
                <div className="category-icon">{category.icon}</div>
                <div className="category-content">
                  <h3 className="category-title">{category.title}</h3>
                  <p className="category-subtitle">{category.subtitle}</p>
                  <p className="category-description">{category.description}</p>
                </div>
                <div className="category-arrow">→</div>
              </div>
            ))}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="action-buttons">
          <button className="action-btn primary" onClick={() => navigate('/create')}>
            ✨ 创建故事
          </button>
          {/* <button className="action-btn secondary" onClick={() => navigate('/story/magic-academy')}>
            📚 继续学习
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default HomePage;