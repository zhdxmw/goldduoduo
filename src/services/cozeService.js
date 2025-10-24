import config from "../config/config";

class CozeService {
  constructor() {
    this.baseURL = config.coze.baseUrl;
    this.token = config.coze.apiKey;
    this.workflowId = '7564605518636023842'; // 故事生成工作流ID
  }

  // 调用扣子工作流生成故事
  async generateStory(parameters = {}) {
    try {
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
        throw new Error(`扣子工作流调用失败: ${errorData.msg || response.statusText}`);
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
      console.error('扣子工作流调用错误:', error);
      throw error;
    }
  }

  // 解析流式响应
  parseStreamResponse(streamData) {
    try {
      // 处理流式数据，提取最终结果
      const lines = streamData.split('\n').filter(line => line.trim());
      let messages = [];
      let isDone = false;
      
      console.log('解析流式数据，总行数:', lines.length);
      
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
          
          console.log(`处理事件: ${event}`, data);
          
          // 处理不同类型的事件
          if (event === 'Message') {
            // 提取消息内容
            if (data.content) {
              messages.push(data.content);
            }
          } else if (event === 'Done') {
            // 标记完成
            isDone = true;
            console.log('工作流执行完成');
            break;
          } else if (event === 'PING') {
            // 心跳事件，忽略
            continue;
          }
        } catch (e) {
          console.warn('解析数据失败:', dataMatch[1], e);
          continue;
        }
      }
      
      // 组合所有消息内容
      const finalContent = messages.join('');
      
      if (isDone && finalContent) {
        return {
          success: true,
          content: JSON.parse(finalContent),
          message: '故事生成完成'
        };
      } else if (isDone) {
        return {
          success: true,
          content: '故事生成完成，但未获取到内容',
          message: '故事生成完成'
        };
      } else {
        return {
          success: false,
          error: '工作流未正常完成'
        };
      }
      
    } catch (error) {
      console.error('解析流式响应错误:', error);
      return { 
        success: false, 
        error: '响应解析失败: ' + error.message 
      };
    }
  }
}

// 创建服务实例
const cozeService = new CozeService();

export default cozeService;