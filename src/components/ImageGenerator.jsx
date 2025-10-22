import React, { useState, useEffect } from 'react';
import imageService from '../services/imageService';
import './ImageGenerator.css';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');
  const [history, setHistory] = useState([]);

  // 组件加载时初始化服务
  useEffect(() => {
    imageService.initialize();
    // 从localStorage加载历史记录
    const savedHistory = localStorage.getItem('imageGenerationHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.warn('加载历史记录失败:', e);
      }
    }
  }, []);

  // 保存历史记录到localStorage
  const saveToHistory = (prompt, imageUrl) => {
    const newItem = {
      id: Date.now(),
      prompt,
      imageUrl,
      timestamp: new Date().toLocaleString()
    };
    const newHistory = [newItem, ...history.slice(0, 9)]; // 保留最近10条记录
    setHistory(newHistory);
    localStorage.setItem('imageGenerationHistory', JSON.stringify(newHistory));
  };

  // 处理生成图片
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('请输入图片描述');
      return;
    }

    setIsGenerating(true);
    setError('');
    setProgress('正在连接服务器...');
    setGeneratedImage(null);

    try {
      const imageUrl = await imageService.generateImage(
        prompt,
        (progressData) => {
          // 处理进度更新
          if (progressData.event === 'Message' && progressData.message) {
            const message = progressData.message;
            if (message.type === 'answer') {
              setProgress('正在生成图片...');
            }
          } else if (progressData.event === 'WorkflowStart') {
            setProgress('工作流已启动...');
          } else if (progressData.event === 'WorkflowFinish') {
            setProgress('生成完成！');
          }
        }
      );

      setGeneratedImage(imageUrl);
      setProgress('图片生成成功！');
      saveToHistory(prompt, imageUrl);
    } catch (err) {
      setError(imageService.getErrorMessage(err));
      setProgress('');
    } finally {
      setIsGenerating(false);
    }
  };

  // 处理下载图片
  const handleDownload = async () => {
    if (!generatedImage) return;

    try {
      const filename = `generated-${Date.now()}.jpg`;
      await imageService.downloadImage(generatedImage, filename);
    } catch (err) {
      setError('下载失败: ' + err.message);
    }
  };

  // 处理重新生成
  const handleRegenerate = () => {
    if (prompt.trim()) {
      handleGenerate();
    }
  };

  // 使用历史记录中的提示词
  const useHistoryPrompt = (historyPrompt) => {
    setPrompt(historyPrompt);
    setError('');
  };

  // 清除历史记录
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('imageGenerationHistory');
  };

  return (
    <div className="image-generator">
      <div className="image-generator-header">
        <h1>AI 图片生成器</h1>
        <p>使用 Coze AI 根据文字描述生成精美图片</p>
      </div>

      <div className="image-generator-content">
        {/* 输入区域 */}
        <div className="input-section">
          <div className="input-group">
            <label htmlFor="prompt">图片描述</label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="请详细描述您想要生成的图片，例如：一只可爱的狸花猫坐在阳光明媚的窗台上..."
              rows={4}
              disabled={isGenerating}
            />
            <div className="char-count">
              {prompt.length}/500
            </div>
          </div>

          <div className="action-buttons">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="generate-btn"
            >
              {isGenerating ? '生成中...' : '生成图片'}
            </button>
            {generatedImage && (
              <button
                onClick={handleRegenerate}
                disabled={isGenerating}
                className="regenerate-btn"
              >
                重新生成
              </button>
            )}
          </div>
        </div>

        {/* 进度显示 */}
        {progress && (
          <div className="progress-section">
            <div className="progress-text">{progress}</div>
            {isGenerating && <div className="progress-bar"></div>}
          </div>
        )}

        {/* 错误显示 */}
        {error && (
          <div className="error-section">
            <div className="error-message">{error}</div>
          </div>
        )}

        {/* 结果显示 */}
        {generatedImage && (
          <div className="result-section">
            <h3>生成结果</h3>
            <div className="image-container">
              <img
                src={generatedImage}
                alt="Generated"
                onError={() => setError('图片加载失败')}
              />
            </div>
            <div className="result-actions">
              <button onClick={handleDownload} className="download-btn">
                下载图片
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(generatedImage)}
                className="copy-btn"
              >
                复制链接
              </button>
            </div>
          </div>
        )}

        {/* 历史记录 */}
        {history.length > 0 && (
          <div className="history-section">
            <div className="history-header">
              <h3>生成历史</h3>
              <button onClick={clearHistory} className="clear-history-btn">
                清除历史
              </button>
            </div>
            <div className="history-list">
              {history.map((item) => (
                <div key={item.id} className="history-item">
                  <div className="history-image">
                    <img src={item.imageUrl} alt="历史图片" />
                  </div>
                  <div className="history-content">
                    <div className="history-prompt" onClick={() => useHistoryPrompt(item.prompt)}>
                      {item.prompt}
                    </div>
                    <div className="history-time">{item.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 使用说明 */}
      <div className="help-section">
        <h3>使用说明</h3>
        <ul>
          <li>详细描述您想要的图片内容，包括主体、风格、颜色、场景等</li>
          <li>支持中文描述，AI会根据您的描述生成相应的图片</li>
          <li>生成过程可能需要几十秒，请耐心等待</li>
          <li>可以点击历史记录中的描述来快速复用</li>
          <li>生成的图片可以下载保存到本地</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageGenerator;