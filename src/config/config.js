// 应用配置管理
const config = {
  // 应用信息
  app: {
    name: import.meta.env.VITE_APP_NAME || 'AI聊天助手',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0'
  },

  // OpenAI API配置
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.openai.com/v1',
    defaultModel: import.meta.env.VITE_DEFAULT_MODEL || 'gpt-3.5-turbo',
    maxTokens: parseInt(import.meta.env.VITE_MAX_TOKENS) || 1000,
    temperature: parseFloat(import.meta.env.VITE_TEMPERATURE) || 0.7
  },

  // 有道智云TTS配置
  youdao: {
    appKey: '3d1f75da0452fa8b',
    appSecret: 'U3Y8rzZnmx9GWyloXw0OFl9D8HPOrAy5',
    ttsUrl: 'https://openapi.youdao.com/ttsapi',
    defaultVoice: 'youxiaoqin',
    defaultSpeed: '1',
    defaultVolume: '1.0',
    defaultFormat: 'mp3'
  },

  // Coze API配置
  coze: {
    apiKey: 'pat_5zHtDGQSPrCl2jvL1rR2ETUIWemvJ50CgVVr17x3f4nCLqNiJITRjEuNmF7hPFoa',
    baseUrl: 'https://api.coze.cn/v1',
    workflows: {
      imageGeneration: '7563497461432500243',  // 图片生成流程
      textToSpeech: '7564619896999526442'      // 语言合成流程
    },
    streamRunUrl: 'https://api.coze.cn/v1/workflow/stream_run'
  },

  // 功能开关
  features: {
    imageGeneration: import.meta.env.VITE_ENABLE_IMAGE_GENERATION === 'true',
    streamMode: import.meta.env.VITE_ENABLE_STREAM_MODE === 'true',
    usageTracking: import.meta.env.VITE_ENABLE_USAGE_TRACKING === 'true'
  },

  // 模型配置
  models: {
    chat: [
      { id: 'gpt-4', name: 'GPT-4', description: '最强大的模型，适合复杂任务' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: '更快的GPT-4版本' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: '快速且经济的选择' }
    ],
    image: [
      { id: 'dall-e-3', name: 'DALL-E 3', description: '最新的图像生成模型' },
      { id: 'dall-e-2', name: 'DALL-E 2', description: '经典的图像生成模型' }
    ]
  },

  // 图片生成配置
  imageGeneration: {
    sizes: ['256x256', '512x512', '1024x1024'],
    qualities: ['standard', 'hd'],
    defaultSize: '1024x1024',
    defaultQuality: 'standard'
  },

  // 本地存储键名
  storage: {
    apiKey: 'ai_chat_api_key',
    chatHistory: 'ai_chat_history',
    settings: 'ai_chat_settings'
  },

  // 开发模式检查
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD
};

// 验证配置
export const validateConfig = () => {
  const errors = [];

  // 检查必要的环境变量
  if (!config.openai.apiKey && config.isProduction) {
    errors.push('生产环境需要设置 VITE_OPENAI_API_KEY');
  }

  if (config.openai.maxTokens <= 0) {
    errors.push('VITE_MAX_TOKENS 必须大于 0');
  }

  if (config.openai.temperature < 0 || config.openai.temperature > 2) {
    errors.push('VITE_TEMPERATURE 必须在 0-2 之间');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// 获取配置值的辅助函数
export const getConfig = (path) => {
  return path.split('.').reduce((obj, key) => obj?.[key], config);
};

// 更新配置的辅助函数
export const updateConfig = (path, value) => {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((obj, key) => obj[key], config);
  if (target) {
    target[lastKey] = value;
  }
};

export default config;