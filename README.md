# 🤖 AI聊天助手

一个基于React和OpenAI API构建的现代化AI聊天应用，支持文本对话和图片生成功能。

## ✨ 功能特性

- 💬 **智能对话**: 支持与GPT模型进行自然语言对话
- 🎨 **图片生成**: 使用DALL-E模型生成高质量图片
- ⚡ **流式响应**: 实时显示AI回复，提升用户体验
- 🎯 **多模型支持**: 支持GPT-3.5、GPT-4等多种模型
- 📱 **响应式设计**: 完美适配桌面和移动设备
- 🔒 **安全可靠**: API密钥本地存储，保护用户隐私
- 🎨 **现代UI**: 美观的界面设计和流畅的交互体验

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置API密钥

复制环境变量示例文件：

```bash
cp .env.example .env.local
```

在 `.env.local` 文件中填入您的OpenAI API密钥：

```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

### 3. 启动开发服务器

```bash
npm run dev
```

### 4. 打开浏览器

访问 `http://localhost:5173` 开始使用AI聊天助手。

## 🔧 配置说明

### 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `VITE_OPENAI_API_KEY` | OpenAI API密钥 | - |
| `VITE_DEFAULT_MODEL` | 默认AI模型 | `gpt-3.5-turbo` |
| `VITE_MAX_TOKENS` | 最大token数 | `1000` |
| `VITE_TEMPERATURE` | 创造性参数 | `0.7` |
| `VITE_ENABLE_IMAGE_GENERATION` | 启用图片生成 | `true` |
| `VITE_ENABLE_STREAM_MODE` | 启用流式响应 | `true` |

### 获取OpenAI API密钥

1. 访问 [OpenAI官网](https://platform.openai.com/)
2. 注册或登录账户
3. 前往 [API Keys页面](https://platform.openai.com/api-keys)
4. 创建新的API密钥
5. 将密钥复制到 `.env.local` 文件中

## 📦 项目结构

```
src/
├── components/          # React组件
│   ├── ChatInterface.jsx    # 聊天界面组件
│   └── ChatInterface.css    # 聊天界面样式
├── hooks/              # 自定义Hooks
│   └── useAI.js            # AI服务Hook
├── services/           # 服务层
│   └── aiService.js        # AI服务封装
├── config/             # 配置文件
│   └── config.js           # 应用配置
├── App.jsx             # 主应用组件
├── App.css             # 应用样式
├── main.jsx            # 应用入口
└── index.css           # 全局样式
```

## 🎯 使用指南

### 基本对话

1. 在输入框中输入您的问题
2. 点击"发送"按钮或按Enter键
3. AI将实时回复您的问题

### 图片生成

1. 在输入框中描述您想要的图片
2. 点击"生成图片"按钮
3. 等待AI生成图片并显示

### 功能设置

- **流式响应**: 开启后AI回复将实时显示
- **清除对话**: 清空当前对话历史
- **设置**: 重新配置API密钥

## 🛠️ 开发

### 技术栈

- **前端框架**: React 18
- **构建工具**: Vite
- **AI服务**: OpenAI API
- **样式**: CSS3 + Flexbox
- **状态管理**: React Hooks

### 可用脚本

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 代码检查
npm run lint
```

## 🔒 安全注意事项

1. **API密钥安全**: 
   - 不要将API密钥提交到版本控制系统
   - 在生产环境中使用环境变量管理密钥
   - 定期轮换API密钥

2. **浏览器安全**:
   - 当前版本在浏览器中直接调用OpenAI API
   - 生产环境建议通过后端代理API调用
   - 考虑实现请求频率限制

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 📞 支持

如果您在使用过程中遇到问题，请：

1. 查看本README文档
2. 检查环境变量配置
3. 确认API密钥有效性
4. 提交Issue描述问题
