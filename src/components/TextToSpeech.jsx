import React, { useState, useRef, useEffect } from 'react';
import ttsService from '../services/ttsService';
import cozeTtsService from '../services/cozeTtsService';
import config from '../config/config';
import './TextToSpeech.css';

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [error, setError] = useState('');
  
  // 服务选择
  const [selectedService, setSelectedService] = useState('youdao'); // 'youdao' 或 'coze'
  
  // TTS选项
  const [voiceName, setVoiceName] = useState(config.youdao.defaultVoice);
  const [speed, setSpeed] = useState(config.youdao.defaultSpeed);
  const [volume, setVolume] = useState(config.youdao.defaultVolume);
  
  // 扣子TTS选项
  const [cozeVoice, setCozeVoice] = useState('default');
  const [cozeSpeed, setCozeSpeed] = useState('1.0');
  const [cozePitch, setCozePitch] = useState('1.0');
  
  const audioRef = useRef(null);

  // 组件加载时自动初始化TTS服务
  useEffect(() => {
    try {
      ttsService.initialize(config.youdao.appKey, config.youdao.appSecret);
    } catch (err) {
      setError('TTS服务初始化失败: ' + err.message);
    }
  }, []);

  // 文本转语音
  const handleTextToSpeech = async () => {
    if (!text.trim()) {
      setError('请输入要转换的文本');
      return;
    }

    setIsLoading(true);
    setError('');
    setAudioUrl('');

    try {
      let result;
      
      if (selectedService === 'coze') {
        // 使用扣子语言合成服务
        result = await cozeTtsService.generateSpeech(text, {
          voice: cozeVoice,
          speed: cozeSpeed,
          pitch: cozePitch,
          volume: volume,
          format: 'mp3',
          language: 'zh-CN'
        });
        result.audioUrl = result.content || '';
      } else {
        // 使用有道TTS服务
        result = await ttsService.textToSpeech(text, {
          voiceName,
          speed,
          volume,
          format: 'mp3'
        });
      }

      if (result.success) {
        setAudioUrl(result.audioUrl);
        setError('');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 播放音频
  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  // 下载音频
  const handleDownload = () => {
    if (audioUrl) {
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = `tts_${Date.now()}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // 清除结果
  const handleClear = () => {
    setText('');
    setAudioUrl('');
    setError('');
  };

  return (
    <div className="text-to-speech">
      <div className="tts-header">
        <h1>文本转语音</h1>
        <p>支持有道智云TTS和扣子语言合成服务</p>
      </div>

      <div className="tts-main">
        <div className="input-section">
          <div className="form-group">
            <label htmlFor="text">输入文本 (最多2048字符):</label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="请输入要转换为语音的文本..."
              maxLength={2048}
              rows={6}
            />
            <div className="char-count">
              {text.length}/2048
            </div>
          </div>

          <div className="options-section">
            {/* 服务选择 */}
            <div className="option-group">
              <label htmlFor="service">TTS服务:</label>
              <select
                id="service"
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
              >
                <option value="youdao">有道智云TTS</option>
                <option value="coze">扣子语言合成</option>
              </select>
            </div>

            {/* 有道TTS选项 */}
            {selectedService === 'youdao' && (
              <>
                <div className="option-group">
                   <label htmlFor="voice">语音选择:</label>
                   <select
                     id="voice"
                     value={voiceName}
                     onChange={(e) => setVoiceName(e.target.value)}
                   >
                     {ttsService.getSupportedVoices().map(voice => (
                       <option key={voice.value} value={voice.value}>
                         {voice.label}
                       </option>
                     ))}
                   </select>
                 </div>

                 <div className="option-group">
                   <label htmlFor="speed">语速:</label>
                   <select
                     id="speed"
                     value={speed}
                     onChange={(e) => setSpeed(e.target.value)}
                   >
                     {ttsService.getSpeedOptions().map(option => (
                       <option key={option.value} value={option.value}>
                         {option.label}
                       </option>
                     ))}
                   </select>
                 </div>

                 <div className="option-group">
                   <label htmlFor="volume">音量:</label>
                   <select
                     id="volume"
                     value={volume}
                     onChange={(e) => setVolume(e.target.value)}
                   >
                     {ttsService.getVolumeOptions().map(option => (
                       <option key={option.value} value={option.value}>
                         {option.label}
                       </option>
                     ))}
                   </select>
                 </div>
               </>
             )}

            {/* 扣子TTS选项 */}
            {selectedService === 'coze' && (
              <>
                <div className="option-group">
                  <label htmlFor="coze-voice">声音类型:</label>
                  <select
                    id="coze-voice"
                    value={cozeVoice}
                    onChange={(e) => setCozeVoice(e.target.value)}
                  >
                    {cozeTtsService.getVoiceOptions().map(voice => (
                      <option key={voice.id} value={voice.id}>
                        {voice.name} - {voice.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="option-group">
                  <label htmlFor="coze-speed">语速:</label>
                  <select
                    id="coze-speed"
                    value={cozeSpeed}
                    onChange={(e) => setCozeSpeed(e.target.value)}
                  >
                    {cozeTtsService.getSpeedOptions().map(speed => (
                      <option key={speed.id} value={speed.value}>
                        {speed.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="option-group">
                  <label htmlFor="coze-pitch">音调:</label>
                  <select
                    id="coze-pitch"
                    value={cozePitch}
                    onChange={(e) => setCozePitch(e.target.value)}
                  >
                    {cozeTtsService.getPitchOptions().map(pitch => (
                      <option key={pitch.id} value={pitch.value}>
                        {pitch.name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>

          <div className="action-buttons">
            <button
              onClick={handleTextToSpeech}
              disabled={isLoading || !text.trim()}
              className="convert-btn"
            >
              {isLoading ? '转换中...' : '转换为语音'}
            </button>
            <button
              onClick={handleClear}
              className="clear-btn"
              disabled={isLoading}
            >
              清除
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {audioUrl && (
          <div className="result-section">
            <h3>转换结果</h3>
            <div className="audio-controls">
              <audio
                ref={audioRef}
                src={audioUrl}
                controls
                className="audio-player"
              >
                您的浏览器不支持音频播放
              </audio>
              <div className="audio-actions">
                <button onClick={handlePlay} className="play-btn">
                  播放
                </button>
                <button onClick={handleDownload} className="download-btn">
                  下载
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextToSpeech;