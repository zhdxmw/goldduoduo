import config from "../config/config.js";

class CozeTtsService {
  constructor() {
    this.baseURL = config.coze.baseUrl;
    this.token = config.coze.apiKey;
    this.workflowId = config.coze.workflows.textToSpeech;
  }

  // 调用扣子语言合成工作流
  async generateSpeech(text, type) {
    try {
      const parameters = {
        input: text,
        voice_id: type
      }
      
      const response = await fetch(`${this.baseURL}/workflow/stream_run`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workflow_id: this.workflowId,
          parameters: parameters
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`语言合成工作流调用失败: ${errorData.msg || response.statusText}`);
      }

      // 处理流式响应
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        result += chunk;
      }

      return this.parseStreamResponse(result);
    } catch (error) {
      console.error('语言合成工作流调用错误:', error);
      throw error;
    }
  }

  // 解析流式响应
  parseStreamResponse(streamData) {
    try {
      const lines = streamData.split('\n').filter(line => line.trim());
      let audioUrl = null;
      let messages = [];
      let isDone = false;
      
      console.log('解析语言合成流式数据，总行数:', lines.length);
      
      // 按组解析数据（每3行为一组：id, event, data）
      for (let i = 0; i < lines.length; i += 3) {
        if (i + 2 >= lines.length) break;
        
        const idLine = lines[i];
        const eventLine = lines[i + 1];
        const dataLine = lines[i + 2];
        
        // 解析 id
        const idMatch = idLine.match(/^id:\s*(\d+)$/);
        if (!idMatch) continue;
        
        // 解析 event
        const eventMatch = eventLine.match(/^event:\s*(.+)$/);
        if (!eventMatch) continue;
        const event = eventMatch[1].trim();
        
        // 解析 data
        const dataMatch = dataLine.match(/^data:\s*(.+)$/);
        if (!dataMatch) continue;
        
        try {
          const data = JSON.parse(dataMatch[1]);
          
          console.log(`处理语言合成事件: ${event}`, data);
          
          // 处理不同类型的事件
          if (event === 'Message') {
            // 提取消息内容，可能包含音频URL
            if (data.content) {
              messages.push(data.content);
              
              // 尝试从内容中提取音频URL
              const urlMatch = data.content.match(/https?:\/\/[^\s]+\.(mp3|wav|m4a|ogg)/i);
              if (urlMatch) {
                audioUrl = urlMatch[0];
              }
            }
          } else if (event === 'Done') {
            // 标记完成
            isDone = true;
            console.log('语言合成工作流执行完成');
            break;
          } else if (event === 'PING') {
            // 心跳事件，忽略
            continue;
          }
        } catch (e) {
          console.warn('解析语言合成数据失败:', dataMatch[1], e);
          continue;
        }
      }
      
      // 组合所有消息内容
      const fullContent = messages.join('');
      console.log('组合后的消息内容:', fullContent);
      
      if (isDone && audioUrl) {
        return {
          success: true,
          audioUrl: fullContent,
          content: fullContent,
          message: '语言合成完成'
        };
      } else if (isDone && fullContent) {
        return {
          success: true,
          content: fullContent,
          message: '语言合成完成，但未获取到音频URL'
        };
      } else if (isDone) {
        return {
          success: true,
          content: '语言合成完成，但未获取到内容',
          message: '语言合成完成'
        };
      } else {
        return {
          success: false,
          error: '语言合成工作流未正常完成'
        };
      }
      
    } catch (error) {
      console.error('解析语言合成流式响应错误:', error);
      return { 
        success: false, 
        error: '语言合成响应解析失败: ' + error.message 
      };
    }
  }

  // 构建工作流参数
  buildParameters(text, options = {}) {
    return {
      text: text,                                    // 要合成的文本
      voice: options.voice || 'default',            // 声音类型
      speed: options.speed || '1.0',                // 语速
      pitch: options.pitch || '1.0',                // 音调
      volume: options.volume || '1.0',              // 音量
      format: options.format || 'mp3',              // 音频格式
      language: options.language || 'zh-CN',        // 语言
      ...options.customParams                       // 其他自定义参数
    };
  }

  // 预设的声音选项
  getVoiceOptions() {
    return [
      { id: 'default', name: '默认', description: '标准合成声音' },
      { id: 'female', name: '女声', description: '温柔女性声音' },
      { id: 'male', name: '男声', description: '沉稳男性声音' },
      { id: 'child', name: '童声', description: '活泼儿童声音' },
      { id: 'elderly', name: '老年', description: '慈祥老年声音' }
    ];
  }

  // 预设的语速选项
  getSpeedOptions() {
    return [
      { id: '0.5', name: '很慢', value: '0.5' },
      { id: '0.75', name: '慢', value: '0.75' },
      { id: '1.0', name: '正常', value: '1.0' },
      { id: '1.25', name: '快', value: '1.25' },
      { id: '1.5', name: '很快', value: '1.5' }
    ];
  }

  // 预设的音调选项
  getPitchOptions() {
    return [
      { id: '0.5', name: '很低', value: '0.5' },
      { id: '0.75', name: '低', value: '0.75' },
      { id: '1.0', name: '正常', value: '1.0' },
      { id: '1.25', name: '高', value: '1.25' },
      { id: '1.5', name: '很高', value: '1.5' }
    ];
  }
}

// 创建单例实例
const cozeTtsService = new CozeTtsService();

export default cozeTtsService;