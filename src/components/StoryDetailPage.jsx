import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StoryDetailComponent from './StoryDetailComponent';
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
    <StoryDetailComponent
      storyData={storyData}
      creationStatus={creationStatus}
      onClose={handleBackClick}
      onStartReading={handleStartReading}
    />
  );
};

export default StoryDetailPage;