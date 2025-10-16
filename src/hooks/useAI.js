import { useState, useCallback, useRef } from 'react';
import aiService from '../services/aiService';

export const useAI = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const abortControllerRef = useRef(null);

  // 初始化AI服务
  const initializeAI = useCallback((apiKey) => {
    try {
      aiService.initialize(apiKey);
      setIsInitialized(true);
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      setIsInitialized(false);
      return false;
    }
  }, []);

  // 发送消息
  const sendMessage = useCallback(async (message, options = {}) => {
    if (!isInitialized) {
      setError('AI服务未初始化');
      return null;
    }

    setIsLoading(true);
    setError(null);

    // 添加用户消息到聊天记录
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await aiService.sendMessage(message, options);
      
      if (response.success) {
        // 添加AI回复到聊天记录
        const aiMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: response.message,
          timestamp: new Date(),
          usage: response.usage
        };
        
        setMessages(prev => [...prev, aiMessage]);
        return response;
      } else {
        setError(response.error);
        return response;
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized]);

  // 流式发送消息
  const sendMessageStream = useCallback(async (message, options = {}) => {
    if (!isInitialized) {
      setError('AI服务未初始化');
      return null;
    }

    setIsLoading(true);
    setError(null);

    // 添加用户消息
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);

    // 创建AI消息占位符
    const aiMessageId = Date.now() + 1;
    const aiMessage = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true
    };
    
    setMessages(prev => [...prev, aiMessage]);

    try {
      const response = await aiService.sendMessageStream(
        message,
        (chunk, fullResponse) => {
          // 更新流式响应
          setMessages(prev => 
            prev.map(msg => 
              msg.id === aiMessageId 
                ? { ...msg, content: fullResponse }
                : msg
            )
          );
        },
        options
      );

      // 标记流式响应完成
      setMessages(prev => 
        prev.map(msg => 
          msg.id === aiMessageId 
            ? { ...msg, isStreaming: false }
            : msg
        )
      );

      return response;
    } catch (err) {
      setError(err.message);
      // 移除失败的消息
      setMessages(prev => prev.filter(msg => msg.id !== aiMessageId));
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized]);

  // 生成图片
  const generateImage = useCallback(async (prompt, options = {}) => {
    if (!isInitialized) {
      setError('AI服务未初始化');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await aiService.generateImage(prompt, options);
      
      if (response.success) {
        // 添加图片生成记录
        const imageMessage = {
          id: Date.now(),
          role: 'assistant',
          type: 'image',
          content: prompt,
          images: response.images,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, imageMessage]);
      } else {
        setError(response.error);
      }
      
      return response;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized]);

  // 清除聊天记录
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  // 清除错误
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 重置AI服务
  const resetAI = useCallback(() => {
    setIsInitialized(false);
    setMessages([]);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    // 状态
    isInitialized,
    isLoading,
    error,
    messages,
    
    // 方法
    initializeAI,
    sendMessage,
    sendMessageStream,
    generateImage,
    clearMessages,
    clearError,
    resetAI
  };
};