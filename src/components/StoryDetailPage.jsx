import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StoryDetailComponent from './StoryDetailComponent';
import stories from '../config/story';
import './StoryDetailPage.css';

const StoryDetailPage = () => {
  const { id } = useParams(); // 接收动态路由id
  const navigate = useNavigate();
  const [resultContent, setResultContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 根据id加载故事数据
  useEffect(() => {
    const loadStoryData = async () => {
      if (!id) {
        setError('故事ID不存在');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // 这里可以添加API调用来根据id获取故事数据
        // const storyData = await fetchStoryById(id);
        // setResultContent(storyData);
        
        // 临时：从localStorage获取数据（如果有的话）
        const savedStory = stories[id];
        if (savedStory) {
          setResultContent(savedStory);
        } else {
          setError('未找到对应的故事数据');
        }
      } catch (err) {
        console.error('加载故事数据失败:', err);
        setError('加载故事数据失败');
      } finally {
        setLoading(false);
      }
    };

    loadStoryData();
  }, [id]);

  // 处理关闭事件
  const handleClose = () => {
    navigate('/'); // 返回首页或故事列表页
  };

  if (loading) {
    return (
      <div className="story-detail-loading">
        <div className="loading-spinner">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="story-detail-error">
        <div className="error-message">{error}</div>
        <button onClick={handleClose} className="back-button">返回</button>
      </div>
    );
  }

  return (
    <StoryDetailComponent 
      storyData={resultContent} 
      creationStatus='all_complete'
      onClose={handleClose}
    />
  );
};

export default StoryDetailPage;