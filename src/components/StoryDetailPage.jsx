import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './StoryDetailPage.css';

const StoryDetailPage = () => {
  const navigate = useNavigate();
  const { storyId } = useParams();
  
  // 故事创作状态管理
  const [creationStatus, setCreationStatus] = useState('creating'); // creating, outline_complete, all_complete
  const [isLoading, setIsLoading] = useState(false);

  // 模拟故事数据
  const [storyData, setStoryData] = useState({
    id: storyId || 'new-story',
    title: '太空探索任务',
    subtitle: '未来科技的冒险之旅',
    description: '2050年，人类的太空探索技术已经非常先进。作为一名宇航员，你将参与一次重要的太空任务，探索未知的星球，发现新的生命形式，体验未来科技的魅力。',
    coverImage: '🚀',
    difficulty: '中级',
    duration: '20分钟',
    vocabulary: '60个新词',
    color: '#667eea',
    outline: [
      { id: 1, title: '太空站准备', status: 'completed' },
      { id: 2, title: '发射升空', status: 'completed' },
      { id: 3, title: '星际航行', status: 'completed' },
      { id: 4, title: '外星球探索', status: 'creating' },
      { id: 5, title: '意外发现', status: 'pending' },
      { id: 6, title: '安全返回', status: 'pending' }
    ],
    chapters: [
      {
        id: 1,
        title: '太空站准备',
        content: '在地球轨道上的国际太空站里，宇航员们正在为即将到来的深空探索任务做最后的准备。先进的AI系统正在检查所有设备的状态...',
        illustration: '🛰️',
        status: 'completed',
        words: ['space station', 'astronaut', 'equipment', 'AI system', 'preparation']
      },
      {
        id: 2,
        title: '发射升空',
        content: '随着倒计时的结束，巨大的火箭引擎点火，宇宙飞船缓缓离开地球，向着未知的星系进发。透过舷窗，地球变得越来越小...',
        illustration: '🚀',
        status: 'completed',
        words: ['rocket', 'engine', 'spacecraft', 'galaxy', 'window']
      },
      {
        id: 3,
        title: '星际航行',
        content: '在漫长的星际航行中，宇航员们利用先进的虚拟现实技术进行训练，同时AI助手持续监控着飞船的各项系统...',
        illustration: '🌌',
        status: 'completed',
        words: ['interstellar', 'virtual reality', 'training', 'AI assistant', 'monitor']
      },
      {
        id: 4,
        title: '外星球探索',
        content: '',
        illustration: '🪐',
        status: 'creating',
        words: []
      }
    ]
  });

  // 模拟创作进度
  useEffect(() => {
    if (creationStatus === 'creating') {
      const timer = setTimeout(() => {
        setCreationStatus('outline_complete');
      }, 3000);
      return () => clearTimeout(timer);
    } else if (creationStatus === 'outline_complete') {
      const timer = setTimeout(() => {
        setCreationStatus('all_complete');
        // 模拟完成最后的章节
        setStoryData(prev => ({
          ...prev,
          chapters: prev.chapters.map(chapter => 
            chapter.id === 4 ? {
              ...chapter,
              content: '宇宙飞船成功着陆在一个神秘的星球上。这里的大气成分与地球相似，但重力只有地球的一半。宇航员们穿上特制的探索服，开始了激动人心的外星球探索之旅...',
              status: 'completed',
              words: ['landing', 'mysterious planet', 'atmosphere', 'gravity', 'exploration suit']
            } : chapter
          ),
          outline: prev.outline.map(item => 
            item.id <= 4 ? { ...item, status: 'completed' } : item
          )
        }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [creationStatus]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleStartReading = () => {
    if (creationStatus === 'all_complete') {
      navigate(`/video/${storyId}`);
    }
  };

  const getStatusText = () => {
    switch (creationStatus) {
      case 'creating':
        return '正在创作故事大纲...';
      case 'outline_complete':
        return '大纲创建完成，正在生成故事内容...';
      case 'all_complete':
        return '故事创作完成！';
      default:
        return '准备中...';
    }
  };

  const getStatusIcon = () => {
    switch (creationStatus) {
      case 'creating':
        return '⏳';
      case 'outline_complete':
        return '📝';
      case 'all_complete':
        return '✅';
      default:
        return '🎭';
    }
  };

  return (
    <div className="story-detail-page">
      <div className="story-detail-container">
        {/* 头部 */}
        <div className="story-header">
          <button className="back-button" onClick={handleBackClick}>
            ← 返回
          </button>
          
          {/* 封面区域 */}
          <div 
            className="story-cover"
            style={{ background: `linear-gradient(135deg, ${storyData.color}, ${storyData.color}dd)` }}
          >
            <div className="cover-image">{storyData.coverImage}</div>
            <div className="story-info">
              <h1 className="story-title">{storyData.title}</h1>
              <p className="story-subtitle">{storyData.subtitle}</p>
              <p className="story-description">{storyData.description}</p>
            </div>
          </div>
        </div>

        {/* 创作状态 */}
        <div className="creation-status">
          <div className="status-header">
            <span className="status-icon">{getStatusIcon()}</span>
            <span className="status-text">{getStatusText()}</span>
            {(creationStatus === 'creating' || creationStatus === 'outline_complete') && (
              <div className="loading-spinner"></div>
            )}
          </div>
          
          {/* 进度条 */}
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: creationStatus === 'creating' ? '33%' : 
                       creationStatus === 'outline_complete' ? '66%' : '100%'
              }}
            ></div>
          </div>
        </div>

        {/* 故事大纲 */}
        {creationStatus !== 'creating' && (
          <div className="story-outline">
            <h3>故事大纲</h3>
            <div className="outline-list">
              {storyData.outline.map((item) => (
                <div key={item.id} className={`outline-item ${item.status}`}>
                  <div className="outline-number">{item.id}</div>
                  <div className="outline-title">{item.title}</div>
                  <div className="outline-status">
                    {item.status === 'completed' && '✅'}
                    {item.status === 'creating' && '⏳'}
                    {item.status === 'pending' && '⏸️'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 故事内容卡片 */}
        {storyData.chapters.some(chapter => chapter.status === 'completed') && (
          <div className="story-content">
            <h3>故事内容</h3>
            <div className="chapters-list">
              {storyData.chapters.map((chapter) => (
                <div key={chapter.id} className={`chapter-card ${chapter.status}`}>
                  <div className="chapter-header">
                    <div className="chapter-illustration">{chapter.illustration}</div>
                    <div className="chapter-info">
                      <h4 className="chapter-title">{chapter.title}</h4>
                      <div className="chapter-status">
                        {chapter.status === 'completed' && '已完成'}
                        {chapter.status === 'creating' && '创作中...'}
                        {chapter.status === 'pending' && '等待中'}
                      </div>
                    </div>
                  </div>
                  
                  {chapter.content && (
                    <div className="chapter-content">
                      <p>{chapter.content}</p>
                      {chapter.words.length > 0 && (
                        <div className="chapter-words">
                          <span className="words-label">重点词汇：</span>
                          {chapter.words.map((word, index) => (
                            <span key={index} className="word-tag">{word}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {chapter.status === 'creating' && (
                    <div className="creating-indicator">
                      <div className="creating-animation"></div>
                      <span>AI正在创作中...</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 开始阅读按钮 */}
        <div className="action-section">
          <button 
            className={`start-reading-button ${creationStatus !== 'all_complete' ? 'disabled' : ''}`}
            onClick={handleStartReading}
            disabled={creationStatus !== 'all_complete'}
          >
            {creationStatus === 'all_complete' ? '🎭 开始阅读故事' : '⏳ 等待创作完成'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryDetailPage;