import React, { useState, useEffect, useRef } from 'react';
import './StoryDetailComponent.css';

const StoryDetailComponent = ({ 
  storyData, 
  creationStatus = 'creating', 
  onClose,
  onStartReading 
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // 自动播放相关状态
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(-1);
  const audioRefsRef = useRef([]);
  const autoPlayTimeoutRef = useRef(null);
  const pageChangeTimeoutRef = useRef(null);
  const audioStatesRef = useRef({}); // 保存每个页面的音频播放状态
  
  // 触摸滑动相关状态
  const containerRef = useRef(null);
  const startTouchRef = useRef(null);
  const isDraggingRef = useRef(false);
  
  // 鼠标拖动相关状态
  const startMouseRef = useRef(null);
  const isMouseDraggingRef = useRef(false);

  // 根据创作状态确定可用页面
  const getAvailablePages = () => {
    const pages = [
      { type: 'cover', title: '封面' }
    ];
    
    // 如果有详细场景数据，为每个场景创建页面
    if (storyData.detailed_scenes && storyData.detailed_scenes.length > 0) {
      storyData.detailed_scenes.forEach((scene, index) => {
        // 找到对应的图片数据
        const imageData = storyData.img_prompt?.find(img => 
          parseInt(img.index) === scene.scene_index
        );
        
        pages.push({
          type: 'scene',
          title: `场景 ${scene.scene_index}`,
          sceneNumber: scene.scene_index,
          segments: scene.segments,
          imageData: imageData,
          ...scene
        });
      });
    }
    
    return pages;
  };

  const pages = getAvailablePages();
  const totalPages = pages.length;
  const currentPageData = pages[currentPage] || pages[0];

  // 翻页函数
  const nextPage = () => {
    console.log('nextPage调用:', { isAnimating, currentPage, totalPages });
    if (isAnimating || currentPage >= totalPages - 1) {
      console.log('nextPage被阻止:', { isAnimating, currentPage, totalPages });
      return;
    }
    
    console.log('执行翻页操作');
    setIsAnimating(true);
    setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
    
    setTimeout(() => {
      setIsAnimating(false);
      console.log('翻页动画完成');
    }, 300);
  };

  // 专门用于自动播放的翻页函数，绕过动画检查
  const autoPlayNextPage = () => {
    console.log('autoPlayNextPage调用:', { currentPage, totalPages });
    if (currentPage >= totalPages - 1) {
      console.log('已到最后一页，停止自动播放');
      setIsAutoPlaying(false);
      return;
    }
    
    console.log('执行自动翻页操作');
    setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
  };

  const prevPage = () => {
    if (isAnimating || currentPage <= 0) return;
    
    setIsAnimating(true);
    setCurrentPage(prev => Math.max(prev - 1, 0));
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  // 自动播放相关函数
  const getCurrentPageAudios = () => {
    if (currentPageData?.type === 'scene' && currentPageData.segments) {
      return currentPageData.segments
        .map((segment, index) => ({ segment, index }))
        .filter(({ segment }) => segment.audio_url);
    }
    return [];
  };

  const playNextAudio = (audioIndex = 0) => {
    const audios = getCurrentPageAudios();
    if (audioIndex >= audios.length) {
      // 当前页所有音频播放完成，标记页面为已完成
      const pageKey = `page_${currentPage}`;
      audioStatesRef.current[pageKey] = { completed: true };
      
      setCurrentPlayingIndex(-1);
      pageChangeTimeoutRef.current = setTimeout(() => {
        console.log('自动翻页检查:', { currentPage, totalPages, isAnimating });
        // 使用专门的自动播放翻页函数，绕过动画检查
        autoPlayNextPage();
      }, 1000);
      return;
    }

    const { segment, index: segmentIndex } = audios[audioIndex];
    setCurrentPlayingIndex(segmentIndex);

    // 找到对应的audio元素并播放
    const audioElement = audioRefsRef.current[segmentIndex];
    if (audioElement) {
      // 总是从头开始播放音频
      audioElement.currentTime = 0;
      
      const playPromise = audioElement.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          // 播放成功
        }).catch((error) => {
          console.warn('音频播放失败:', error);
          // 播放失败，继续下一个
          autoPlayTimeoutRef.current = setTimeout(() => {
            playNextAudio(audioIndex + 1);
          }, 1000);
        });
      }

      // 监听音频播放结束
      const handleEnded = () => {
        audioElement.removeEventListener('ended', handleEnded);
        
        // 标记当前音频为已播放
        const pageKey = `page_${currentPage}`;
        const audioKey = `audio_${segmentIndex}`;
        if (!audioStatesRef.current[pageKey]) {
          audioStatesRef.current[pageKey] = {};
        }
        audioStatesRef.current[pageKey][audioKey] = { played: true };
        
        // 1秒后播放下一个音频
        autoPlayTimeoutRef.current = setTimeout(() => {
          playNextAudio(audioIndex + 1);
        }, 1000);
      };

      audioElement.addEventListener('ended', handleEnded);
    } else {
      // 找不到音频元素，跳过
      autoPlayTimeoutRef.current = setTimeout(() => {
        playNextAudio(audioIndex + 1);
      }, 1000);
    }
  };

  const toggleAutoPlay = () => {
    if (isAutoPlaying) {
      // 停止自动播放
      setIsAutoPlaying(false);
      setCurrentPlayingIndex(-1);
      
      // 清除所有定时器
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
        autoPlayTimeoutRef.current = null;
      }
      if (pageChangeTimeoutRef.current) {
        clearTimeout(pageChangeTimeoutRef.current);
        pageChangeTimeoutRef.current = null;
      }

      // 停止当前播放的音频
      audioRefsRef.current.forEach(audio => {
        if (audio && !audio.paused) {
          audio.pause();
        }
      });
    } else {
      // 开始自动播放
      setIsAutoPlaying(true);
      playNextAudio(0);
    }
  };

  // 切换单个音频的播放/暂停状态
  const toggleAudioPlay = (audioIndex) => {
    const audio = audioRefsRef.current[audioIndex];
    if (!audio) return;

    if (audio.paused) {
      // 暂停其他正在播放的音频
      audioRefsRef.current.forEach((otherAudio, index) => {
        if (otherAudio && !otherAudio.paused && index !== audioIndex) {
          otherAudio.pause();
        }
      });
      
      // 移除之前的事件监听器（如果存在）
      const existingHandler = audio._endedHandler;
      if (existingHandler) {
        audio.removeEventListener('ended', existingHandler);
      }
      
      // 添加音频结束事件监听器
      const handleAudioEnded = () => {
        setCurrentPlayingIndex(-1); // 重置播放状态
        audio.removeEventListener('ended', handleAudioEnded);
        delete audio._endedHandler;
      };
      
      audio.addEventListener('ended', handleAudioEnded);
      audio._endedHandler = handleAudioEnded; // 保存引用以便后续移除
      
      // 播放当前音频
      audio.currentTime = 0; // 从头开始播放
      audio.play();
      setCurrentPlayingIndex(audioIndex);
    } else {
      // 暂停当前音频
      audio.pause();
      setCurrentPlayingIndex(-1);
      
      // 移除事件监听器
      const existingHandler = audio._endedHandler;
      if (existingHandler) {
        audio.removeEventListener('ended', existingHandler);
        delete audio._endedHandler;
      }
    }
  };

  // 页面切换时重置自动播放状态
  useEffect(() => {
    setCurrentPlayingIndex(-1);
    audioRefsRef.current = [];
    
    // 清除定时器
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current);
      autoPlayTimeoutRef.current = null;
    }
    if (pageChangeTimeoutRef.current) {
      clearTimeout(pageChangeTimeoutRef.current);
      pageChangeTimeoutRef.current = null;
    }

    // 如果正在自动播放，开始播放新页面的音频
    if (isAutoPlaying && currentPageData?.type === 'scene') {
      // 使用重试机制确保音频元素已经注册
      const startAutoPlayWithRetry = (retryCount = 0) => {
        const maxRetries = 10;
        const audios = getCurrentPageAudios();
        
        if (audios.length > 0 && audioRefsRef.current.length > 0) {
          // 音频元素已注册，从第一个音频开始播放
          playNextAudio(0);
        } else if (retryCount < maxRetries) {
          // 还没有注册完成，继续重试
          setTimeout(() => {
            startAutoPlayWithRetry(retryCount + 1);
          }, 100);
        } else {
          // 重试次数用完，停止自动播放
          console.warn('无法找到音频元素，停止自动播放');
          setIsAutoPlaying(false);
        }
      };

      // 等待页面切换动画完成后开始重试
      setTimeout(() => {
        startAutoPlayWithRetry();
      }, 300);
    }
  }, [currentPage]);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
      if (pageChangeTimeoutRef.current) {
        clearTimeout(pageChangeTimeoutRef.current);
      }
    };
  }, []);

  // 触摸滑动处理
  const handleTouchStart = (e) => {
    startTouchRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now()
    };
    isDraggingRef.current = false;
  };

  const handleTouchMove = (e) => {
    if (!startTouchRef.current) return;
    
    const currentTouch = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
    
    const deltaX = Math.abs(currentTouch.x - startTouchRef.current.x);
    const deltaY = Math.abs(currentTouch.y - startTouchRef.current.y);
    
    // 如果水平滑动距离大于垂直滑动距离，则认为是翻页手势
    if (deltaX > deltaY && deltaX > 10) {
      isDraggingRef.current = true;
      e.preventDefault(); // 阻止默认滚动行为
    }
  };

  const handleTouchEnd = (e) => {
    if (!startTouchRef.current || !isDraggingRef.current) {
      startTouchRef.current = null;
      isDraggingRef.current = false;
      return;
    }
    
    const endTouch = e.changedTouches[0];
    const deltaX = endTouch.clientX - startTouchRef.current.x;
    const deltaTime = Date.now() - startTouchRef.current.time;
    
    // 滑动距离和时间阈值
    const minSwipeDistance = 50;
    const maxSwipeTime = 300;
    
    if (Math.abs(deltaX) > minSwipeDistance && deltaTime < maxSwipeTime) {
      if (deltaX > 0) {
        // 向右滑动，上一页
        prevPage();
      } else {
        // 向左滑动，下一页
        nextPage();
      }
    }
    
    startTouchRef.current = null;
    isDraggingRef.current = false;
  };

  // 鼠标拖动处理
  const handleMouseDown = (e) => {
    // 只处理左键点击
    if (e.button !== 0) return;
    
    startMouseRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now()
    };
    isMouseDraggingRef.current = false;
    
    // 添加全局鼠标事件监听
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // 阻止文本选择
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!startMouseRef.current) return;
    
    const currentMouse = {
      x: e.clientX,
      y: e.clientY
    };
    
    const deltaX = Math.abs(currentMouse.x - startMouseRef.current.x);
    const deltaY = Math.abs(currentMouse.y - startMouseRef.current.y);
    
    // 如果水平拖动距离大于垂直拖动距离，则认为是翻页手势
    if (deltaX > deltaY && deltaX > 10) {
      isMouseDraggingRef.current = true;
      setIsDragging(true);
      // 改变鼠标样式
      document.body.style.cursor = 'grabbing';
    }
  };

  const handleMouseUp = (e) => {
    // 移除全局事件监听
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    // 恢复鼠标样式
    document.body.style.cursor = '';
    
    if (!startMouseRef.current || !isMouseDraggingRef.current) {
      startMouseRef.current = null;
      isMouseDraggingRef.current = false;
      setIsDragging(false);
      return;
    }
    
    const deltaX = e.clientX - startMouseRef.current.x;
    const deltaTime = Date.now() - startMouseRef.current.time;
    
    // 拖动距离和时间阈值
    const minDragDistance = 50;
    const maxDragTime = 500;
    
    if (Math.abs(deltaX) > minDragDistance && deltaTime < maxDragTime) {
      if (deltaX > 0) {
        // 向右拖动，上一页
        prevPage();
      } else {
        // 向左拖动，下一页
        nextPage();
      }
    }
    
    startMouseRef.current = null;
    isMouseDraggingRef.current = false;
    setIsDragging(false);
  };

  // 滚轮事件处理
  const handleWheel = (e) => {
    // 防抖处理
    if (isAnimating) return;
    
    const deltaY = e.deltaY;
    const threshold = 50; // 滚动阈值
    
    if (Math.abs(deltaY) > threshold) {
      if (deltaY > 0) {
        // 向下滚动，下一页
        nextPage();
      } else {
        // 向上滚动，上一页
        prevPage();
      }
      
      // 阻止默认滚动行为
      // e.preventDefault();
    }
  };

  // 键盘导航
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        prevPage();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextPage();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, totalPages]);

  // 获取状态信息
  const getStatusInfo = () => {
    switch (creationStatus) {
      case 'creating':
        return {
          icon: '⏳',
          text: '正在创作故事大纲...',
          color: '#f39c12'
        };
      case 'outline_complete':
        return {
          icon: '📝',
          text: '大纲创作完成，正在生成章节内容...',
          color: '#3498db'
        };
      case 'all_complete':
        return {
          icon: '✅',
          text: '故事创作完成！',
          color: '#27ae60'
        };
      default:
        return {
          icon: '⏳',
          text: '创作中...',
          color: '#f39c12'
        };
    }
  };

  const statusInfo = getStatusInfo();

  // 如果还在创作中且没有可显示的内容，显示加载状态
  if (creationStatus === 'creating' && (!storyData.detailed_scenes || storyData.detailed_scenes.length === 0)) {
    return (
      <div className="loading-overlay">
        <div className="loading-content">
          <div className="loading-icon">{statusInfo.icon}</div>
          <h2>故事创作中</h2>
          <p>{statusInfo.text}</p>
        </div>
        <button className="loading-close-button" onClick={onClose}>
          ← 返回
        </button>
      </div>
    );
  }

  return (
    <div 
      className={`story-detail-component fullscreen ${isDragging ? 'dragging' : ''}`}
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onWheel={handleWheel}
      style={{ cursor: 'grab' }}
    >
      <div className="story-detail-container">
        {/* 关闭按钮 */}
        <button className="close-button" onClick={onClose}>
          ← 返回
        </button>

        {/* 状态指示器 */}
        {
          creationStatus !== 'all_complete' && (
            <div className="status-indicator">
              <span className="status-icon">{statusInfo.icon}</span>
              <span className="status-text">{statusInfo.text}</span>
              {creationStatus === 'creating' && <div className="loading-spinner"></div>}
            </div>
          )
        }

        {/* 主要卡片内容 */}
        <div className={`story-card fullscreen-page ${isAnimating ? 'animating' : ''}`}>
          {currentPageData.type === 'cover' && (
            <div className="cover-page">
              <div className="story-cover">
                <div className="cover-illustration">📚</div>
                <h1 className="story-title">
                  {storyData.story_title?.title_zh || storyData.story_title?.title_en || storyData.title || '故事标题'}
                </h1>
                <p className="story-description">
                  {storyData.story_intro?.intro_zh || storyData.story_intro?.intro_en || storyData.description || '故事简介'}
                </p>
                <div className="story-meta">
                  <span className="story-genre">🎭 {storyData.genre || '故事'}</span>
                  <span className="story-length">📖 {storyData.detailed_scenes?.length || 0} 个场景</span>
                </div>
              </div>
            </div>
          )}

          {currentPageData.type === 'scene' && (
            <div className="scene-page">
              <div className="scene-header">
                {currentPageData.imageData?.img_url && (
                  <div className="scene-illustration">
                    <img 
                      src={currentPageData.imageData.img_url} 
                      alt={`场景 ${currentPageData.sceneNumber}`}
                      className="scene-image"
                    />
                  </div>
                )}
      
              </div>
              <div className="scene-content">
                {currentPageData.segments?.map((segment, index) => (
                  <div 
                    key={index} 
                    className={`segment ${currentPlayingIndex === index ? 'playing' : ''}`}
                  >
                    <div className="segment-text">
                      <p className={`text-en ${currentPlayingIndex === index ? 'highlight' : ''}`}>
                        {segment.text_en}
                        {segment.audio_url && (
                          <span 
                            className="audio-play-btn-inline"
                            onClick={() => toggleAudioPlay(index)}
                          >
                            {currentPlayingIndex === index ? '⏸' : '▶'}
                          </span>
                        )}
                      </p>
                      <p className={`text-zh ${currentPlayingIndex === index ? 'highlight' : ''}`}>
                        {segment.text_zh}
                      </p>
                    </div>
                    {segment.audio_url && (
                      <div className="segment-audio">
                        <audio 
                          key={segment.audio_url}
                          ref={(el) => {
                            if (el) {
                              audioRefsRef.current[index] = el;
                            }
                          }}
                        >
                          <source src={segment.audio_url} type="audio/mpeg" />
                          您的浏览器不支持音频播放。
                        </audio>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 导航控件 */}
        <div className="navigation-controls">
          <button 
            className="nav-button prev" 
            onClick={prevPage}
            disabled={currentPage === 0}
          >
            ↑
          </button>
          
          <div className="page-indicator">
            <span className="current-page">{currentPage + 1}</span>
            <span className="page-separator">/</span>
            <span className="total-pages">{pages.length}</span>
          </div>
          
          <button 
            className="nav-button next" 
            onClick={nextPage}
            disabled={currentPage === pages.length - 1}
          >
            ↓
          </button>
        </div>

        {/* 自动播放控件 */}
        {currentPageData?.type === 'scene' && getCurrentPageAudios().length > 0 && (
          <div className="auto-play-controls">
            <button 
              className={`auto-play-button ${isAutoPlaying ? 'playing' : ''}`}
              onClick={toggleAutoPlay}
            >
              {isAutoPlaying ? '⏸️ 停止播放' : '▶️ 自动播放'}
            </button>
            {isAutoPlaying && (
              <div className="auto-play-status">
                正在播放第 {currentPlayingIndex + 1} 段音频
              </div>
            )}
          </div>
        )}

        {/* 开始阅读按钮 */}
        {(creationStatus === 'all_complete' || (storyData.detailed_scenes && storyData.detailed_scenes.length > 0)) && (
          <button className="start-reading-button" onClick={onStartReading}>
            🎭 开始阅读故事
          </button>
        )}
      </div>
    </div>
  );
};

export default StoryDetailComponent;