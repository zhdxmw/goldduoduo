import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './VideoPlayerPage.css';

const VideoPlayerPage = () => {
  const navigate = useNavigate();
  const { storyId } = useParams();
  const videoRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // 模拟故事数据
  const storyData = {
    'magic-academy': {
      title: '魔法学院的秘密',
      subtitle: '数字学习开始',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', // 示例视频
      thumbnail: 'https://via.placeholder.com/400x225/667eea/ffffff?text=Magic+Academy'
    },
    'space-mission': {
      title: '太空探索任务',
      subtitle: '数字学习开始',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      thumbnail: 'https://via.placeholder.com/400x225/764ba2/ffffff?text=Space+Mission'
    }
  };

  const story = storyData[storyId] || storyData['magic-academy'];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * duration;
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    videoRef.current.playbackRate = speed;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleFullscreen = () => {
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <div className="video-player-page">
      <div className="video-container">
        {/* 头部 */}
        <div className="video-header">
          <button className="back-button" onClick={handleBackClick}>
            ← 返回
          </button>
          <div className="story-info">
            <h1 className="story-title">{story.title}</h1>
            <p className="story-subtitle">{story.subtitle}</p>
          </div>
        </div>

        {/* 视频播放器 */}
        <div className="video-player-wrapper">
          <div className="video-player">
            <video
              ref={videoRef}
              className="video-element"
              poster={story.thumbnail}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onClick={() => setShowControls(!showControls)}
            >
              <source src={story.videoUrl} type="video/mp4" />
              您的浏览器不支持视频播放。
            </video>

            {/* 播放按钮覆盖层 */}
            {!isPlaying && (
              <div className="play-overlay" onClick={togglePlay}>
                <div className="play-button">
                  <span>▶</span>
                </div>
              </div>
            )}

            {/* 控制栏 */}
            {showControls && (
              <div className="video-controls">
                <div className="progress-bar" onClick={handleSeek}>
                  <div 
                    className="progress-fill"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>

                <div className="controls-row">
                  <button className="control-btn" onClick={togglePlay}>
                    {isPlaying ? '⏸' : '▶'}
                  </button>

                  <div className="time-display">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>

                  <div className="volume-control">
                    <span>🔊</span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="volume-slider"
                    />
                  </div>

                  <button className="control-btn" onClick={handleFullscreen}>
                    ⛶
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 播放设置 */}
        <div className="player-settings">
          <div className="setting-group">
            <label className="setting-label">播放速度</label>
            <div className="speed-buttons">
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                <button
                  key={speed}
                  className={`speed-btn ${playbackSpeed === speed ? 'active' : ''}`}
                  onClick={() => handleSpeedChange(speed)}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          <div className="learning-features">
            <h3>学习功能</h3>
            <div className="feature-buttons">
              <button className="feature-btn">
                📝 字幕显示
              </button>
              <button className="feature-btn">
                🔄 重复播放
              </button>
              <button className="feature-btn">
                📚 词汇笔记
              </button>
              <button className="feature-btn">
                🎯 重点标记
              </button>
            </div>
          </div>
        </div>

        {/* 学习进度 */}
        <div className="learning-progress">
          <div className="progress-header">
            <h3>学习进度</h3>
            <span className="progress-percentage">
              {Math.round((currentTime / duration) * 100) || 0}%
            </span>
          </div>
          <div className="progress-bar-large">
            <div 
              className="progress-fill-large"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          <div className="progress-stats">
            <div className="stat-item">
              <span className="stat-label">已学习</span>
              <span className="stat-value">{formatTime(currentTime)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">剩余时间</span>
              <span className="stat-value">{formatTime(duration - currentTime)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerPage;