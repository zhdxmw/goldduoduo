import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './CategoryPage.css';

const CategoryPage = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();

  const categoryData = {
    magic: {
      title: '奇幻冒险',
      subtitle: '魔法世界的神秘故事',
      icon: '🪄',
      color: '#667eea',
      stories: [
        { id: 'magic-academy', title: '魔法学院的秘密', count: '12个故事' },
        { id: 'wizard-quest', title: '巫师的冒险', count: '8个故事' }
      ]
    },
    space: {
      title: '科幻未来',
      subtitle: '太空探索和未来科技',
      icon: '🚀',
      color: '#764ba2',
      stories: [
        { id: 'space-mission', title: '太空任务', count: '10个故事' },
        { id: 'alien-contact', title: '外星接触', count: '6个故事' }
      ]
    },
    romance: {
      title: '浪漫爱情',
      subtitle: '温暖感人的爱情故事',
      icon: '💙',
      color: '#f093fb',
      stories: [
        { id: 'love-story', title: '浪漫爱情', count: '15个故事' },
        { id: 'heartwarming', title: '温暖故事', count: '12个故事' }
      ]
    },
    mystery: {
      title: '悬疑推理',
      subtitle: '烧脑的推理故事',
      icon: '💙',
      color: '#4facfe',
      stories: [
        { id: 'detective', title: '神秘侦探', count: '6个故事' },
        { id: 'thriller', title: '悬疑推理', count: '9个故事' }
      ]
    }
  };

  const category = categoryData[categoryId] || categoryData.magic;

  const handleStoryClick = (storyId) => {
    navigate(`/story/${storyId}`);
  };

  const handleBackClick = () => {
    navigate('/home');
  };

  return (
    <div className="category-page">
      <div className="category-container">
        {/* 头部 */}
        <div className="category-header">
          <button className="back-button" onClick={handleBackClick}>
            ← 返回
          </button>
          <div 
            className="category-banner"
            style={{ background: `linear-gradient(135deg, ${category.color}, ${category.color}dd)` }}
          >
            <div className="category-icon">{category.icon}</div>
            <h1 className="category-title">{category.title}</h1>
            <p className="category-subtitle">{category.subtitle}</p>
          </div>
        </div>

        {/* 故事列表 */}
        <div className="stories-section">
          <div className="stories-list">
            <div className="story-item" onClick={() => navigate('/story/magic-academy')}>
              <div className="story-content">
                <div className="story-icon">🪄</div>
                <div className="story-info">
                  <div className="story-name">魔法学院的秘密</div>
                  <div className="story-count">15分钟 · 中级</div>
                </div>
              </div>
              <div className="story-arrow">→</div>
            </div>

            <div className="story-item" onClick={() => navigate('/story/ancient-castle')}>
              <div className="story-content">
                <div className="story-icon">🏰</div>
                <div className="story-info">
                  <div className="story-name">古堡里的魔法师</div>
                  <div className="story-count">20分钟 · 高级</div>
                </div>
              </div>
              <div className="story-arrow">→</div>
            </div>

            <div className="story-item" onClick={() => navigate('/story/crystal-ball')}>
              <div className="story-content">
                <div className="story-icon">🔮</div>
                <div className="story-info">
                  <div className="story-name">水晶球的预言</div>
                  <div className="story-count">12分钟 · 初级</div>
                </div>
              </div>
              <div className="story-arrow">→</div>
            </div>

            <div className="story-item" onClick={() => navigate('/story/witch-potion')}>
              <div className="story-content">
                <div className="story-icon">🧙‍♀️</div>
                <div className="story-info">
                  <div className="story-name">女巫的魔法药水</div>
                  <div className="story-count">18分钟 · 中级</div>
                </div>
              </div>
              <div className="story-arrow">→</div>
            </div>
          </div>

          {/* 其他分类 */}
          <div className="other-categories">
            <h2 className="section-title">其他分类</h2>
            <div className="categories-grid">
              {Object.entries(categoryData)
                .filter(([key]) => key !== categoryId)
                .map(([key, cat]) => (
                  <div 
                    key={key}
                    className="category-card"
                    style={{ background: `linear-gradient(135deg, ${cat.color}, ${cat.color}dd)` }}
                    onClick={() => navigate(`/category/${key}`)}
                  >
                    <div className="category-card-icon">{cat.icon}</div>
                    <h3 className="category-card-title">{cat.title}</h3>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;