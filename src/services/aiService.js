import OpenAI from 'openai';

class AIService {
  constructor() {
    this.openai = null;
    this.isInitialized = false;
  }

  // 初始化OpenAI客户端
  initialize(apiKey) {
    if (!apiKey) {
      throw new Error('API密钥不能为空');
    }
    
    this.openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true // 注意：在生产环境中应该通过后端代理API调用
    });
    
    this.isInitialized = true;
  }

  // 检查是否已初始化
  checkInitialization() {
    if (!this.isInitialized || !this.openai) {
      throw new Error('AI服务未初始化，请先设置API密钥');
    }
  }

  // 发送聊天消息
  async sendMessage(message, options = {}) {
    this.checkInitialization();

    const {
      model = 'gpt-3.5-turbo',
      maxTokens = 1000,
      temperature = 0.7,
      systemPrompt = '你是一个有用的AI助手。'
    } = options;

    try {
      const response = await this.openai.chat.completions.create({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: maxTokens,
        temperature: temperature,
      });

      return {
        success: true,
        message: response.choices[0].message.content,
        usage: response.usage
      };
    } catch (error) {
      console.error('AI服务调用失败:', error);
      return {
        success: false,
        error: error.message || '调用AI服务时发生未知错误'
      };
    }
  }

  // 流式聊天（实时响应）
  async sendMessageStream(message, onChunk, options = {}) {
    this.checkInitialization();

    const {
      model = 'gpt-3.5-turbo',
      maxTokens = 1000,
      temperature = 0.7,
      systemPrompt = '你是一个有用的AI助手。'
    } = options;

    try {
      const stream = await this.openai.chat.completions.create({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: maxTokens,
        temperature: temperature,
        stream: true,
      });

      let fullResponse = '';
      
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullResponse += content;
          onChunk(content, fullResponse);
        }
      }

      return {
        success: true,
        message: fullResponse
      };
    } catch (error) {
      console.error('流式AI服务调用失败:', error);
      return {
        success: false,
        error: error.message || '调用AI服务时发生未知错误'
      };
    }
  }

  // 生成图片
  async generateImage(prompt, options = {}) {
    this.checkInitialization();

    const {
      model = 'dall-e-3',
      size = '1024x1024',
      quality = 'standard',
      n = 1
    } = options;

    try {
      const response = await this.openai.images.generate({
        model: model,
        prompt: prompt,
        size: size,
        quality: quality,
        n: n,
      });

      return {
        success: true,
        images: response.data.map(img => img.url)
      };
    } catch (error) {
      console.error('图片生成失败:', error);
      return {
        success: false,
        error: error.message || '生成图片时发生未知错误'
      };
    }
  }

  // 文本嵌入
  async getEmbedding(text, model = 'text-embedding-ada-002') {
    this.checkInitialization();

    try {
      const response = await this.openai.embeddings.create({
        model: model,
        input: text,
      });

      return {
        success: true,
        embedding: response.data[0].embedding,
        usage: response.usage
      };
    } catch (error) {
      console.error('获取文本嵌入失败:', error);
      return {
        success: false,
        error: error.message || '获取文本嵌入时发生未知错误'
      };
    }
  }
}

// 创建单例实例
const aiService = new AIService();

export default aiService;