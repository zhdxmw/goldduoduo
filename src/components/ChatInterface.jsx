import React, { useState, useRef, useEffect } from 'react';
import { useAI } from '../hooks/useAI';
import './ChatInterface.css';

const ChatInterface = () => {
  const {
    isInitialized,
    isLoading,
    error,
    messages,
    initializeAI,
    sendMessage,
    sendMessageStream,
    generateImage,
    clearMessages,
    clearError
  } = useAI();

  const [apiKey, setApiKey] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [isStreamMode, setIsStreamMode] = useState(true);
  const [showApiKeyInput, setShowApiKeyInput] = useState(!isInitialized);
  const messagesEndRef = useRef(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 初始化AI服务
  const handleInitialize = () => {
    if (apiKey.trim()) {
      const success = initializeAI(apiKey.trim());
      if (success) {
        setShowApiKeyInput(false);
      }
    }
  };

  // 发送消息
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const message = inputMessage.trim();
    setInputMessage('');

    if (isStreamMode) {
      await sendMessageStream(message);
    } else {
      await sendMessage(message);
    }
  };

  // 生成图片
  const handleGenerateImage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const prompt = inputMessage.trim();
    setInputMessage('');
    await generateImage(prompt);
  };

  // 处理键盘事件
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 格式化时间
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (showApiKeyInput) {
    return (
      <div className="api-key-setup">
        <div className="setup-container">
          <h2>🤖 AI聊天助手</h2>
          <p>请输入您的OpenAI API密钥来开始使用</p>
          <div className="api-key-input-group">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="api-key-input"
              onKeyPress={(e) => e.key === 'Enter' && handleInitialize()}
            />
            <button 
              onClick={handleInitialize}
              disabled={!apiKey.trim()}
              className="initialize-btn"
            >
              开始使用
            </button>
          </div>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          <div className="setup-note">
            <p>💡 提示：</p>
            <ul>
              <li>API密钥仅在本地存储，不会上传到服务器</li>
              <li>您可以在 <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">OpenAI官网</a> 获取API密钥</li>
              <li>支持文本聊天和图片生成功能</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h1>🤖 AI聊天助手</h1>
        <div className="header-controls">
          <label className="stream-toggle">
            <input
              type="checkbox"
              checked={isStreamMode}
              onChange={(e) => setIsStreamMode(e.target.checked)}
            />
            流式响应
          </label>
          <button onClick={clearMessages} className="clear-btn">
            清除对话
          </button>
          <button 
            onClick={() => setShowApiKeyInput(true)} 
            className="settings-btn"
          >
            设置
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={clearError} className="close-error">×</button>
        </div>
      )}

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <h3>👋 欢迎使用AI聊天助手！</h3>
            <p>您可以：</p>
            <ul>
              <li>💬 与AI进行自然语言对话</li>
              <li>🎨 生成图片（使用"生成图片"按钮）</li>
              <li>⚡ 选择流式或普通响应模式</li>
            </ul>
            <p>开始输入消息来开始对话吧！</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`message ${message.role}`}>
              <div className="message-header">
                <span className="role">
                  {message.role === 'user' ? '👤 您' : '🤖 AI助手'}
                </span>
                <span className="timestamp">{formatTime(message.timestamp)}</span>
              </div>
              <div className="message-content">
                {message.type === 'image' ? (
                  <div className="image-message">
                    <p><strong>图片提示：</strong> {message.content}</p>
                    <div className="generated-images">
                      {message.images?.map((imageUrl, index) => (
                        <img 
                          key={index} 
                          src={imageUrl} 
                          alt={`Generated image ${index + 1}`}
                          className="generated-image"
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-message">
                    {message.content}
                    {message.isStreaming && <span className="cursor">|</span>}
                  </div>
                )}
              </div>
              {message.usage && (
                <div className="usage-info">
                  Token使用: {message.usage.total_tokens} 
                  (输入: {message.usage.prompt_tokens}, 输出: {message.usage.completion_tokens})
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <div className="input-group">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isLoading ? "AI正在思考中..." : "输入您的消息..."}
            disabled={isLoading}
            className="message-input"
            rows="1"
          />
          <div className="input-buttons">
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="send-btn"
            >
              {isLoading ? '发送中...' : '发送'}
            </button>
            <button
              onClick={handleGenerateImage}
              disabled={!inputMessage.trim() || isLoading}
              className="image-btn"
            >
              生成图片
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;