import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './StoryDetailPage.css';

const StoryDetailPage = () => {
  const navigate = useNavigate();
  const { storyId } = useParams();
  const [difficulty, setDifficulty] = useState('中级');

  // 模拟故事数据
  const storyData = {
    'magic-academy': {
      title: '魔法学院的秘密',
      subtitle: '一个关于友谊和勇气的奇幻故事',
      icon: '🪄',
      difficulty: '中级',
      duration: '15分钟',
      focus: '日常对话',
      vocabulary: '50个新词',
      description: '在这个充满魔法的世界里，年轻的巫师们在学院中学习各种神奇的法术。跟随主人公的脚步，探索隐藏在学院深处的秘密，结交新朋友，面对挑战，成长为真正的魔法师。',
      color: '#667eea'
    },
    'space-mission': {
      title: '太空探索任务',
      subtitle: '未来科技的冒险之旅',
      icon: '🚀',
      difficulty: '高级',
      duration: '20分钟',
      focus: '科技词汇',
      vocabulary: '60个新词',
      description: '2050年，人类的太空探索技术已经非常先进。作为一名宇航员，你将参与一次重要的太空任务，探索未知的星球，发现新的生命形式，体验未来科技的魅力。',
      color: '#764ba2'
    }
  };

  const story = storyData[storyId] || storyData['magic-academy'];

  const handleStartLearning = () => {
    navigate(`/video/${storyId}`);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const difficultyLevels = ['初级', '中级', '高级'];
  const focusOptions = ['日常对话', '商务英语', '学术英语', '旅游英语'];

  return (
    <div className="story-detail-page">
      <div className="story-detail-container">
        {/* 头部 */}
        <div className="story-header">
          <button className="back-button" onClick={handleBackClick}>
            ← 返回
          </button>
          <div 
            className="story-banner"
            style={{ background: `linear-gradient(135deg, ${story.color}, ${story.color}dd)` }}
          >
            <div className="story-icon">{story.icon}</div>
            <h1 className="story-title">{story.title}</h1>
            <p className="story-subtitle">{story.subtitle}</p>
          </div>
        </div>

        {/* 故事信息 */}
        <div className="story-info-section">
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">难度等级</div>
              <div className="info-value">{story.difficulty}</div>
            </div>
            <div className="info-item">
              <div className="info-label">预计时长</div>
              <div className="info-value">{story.duration}</div>
            </div>
            <div className="info-item">
              <div className="info-label">学习重点</div>
              <div className="info-value">{story.focus}</div>
            </div>
            <div className="info-item">
              <div className="info-label">词汇量</div>
              <div className="info-value">{story.vocabulary}</div>
            </div>
          </div>

          <div className="story-description">
            <h3>故事简介</h3>
            <p>{story.description}</p>
          </div>
        </div>

        {/* 学习设置 */}
        <div className="learning-settings">
          <h3>学习设置</h3>
          
          <div className="setting-group">
            <label className="setting-label">学习难度</label>
            <div className="difficulty-buttons">
              {difficultyLevels.map((level) => (
                <button
                  key={level}
                  className={`difficulty-btn ${difficulty === level ? 'active' : ''}`}
                  onClick={() => setDifficulty(level)}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="setting-group">
            <label className="setting-label">学习重点</label>
            <select className="setting-select">
              {focusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 开始学习按钮 */}
        <div className="start-section">
          <button 
            className="start-learning-button"
            onClick={handleStartLearning}
          >
            ▶ 开始学习
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryDetailPage;