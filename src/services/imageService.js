import config from "../config/config";

class ImageService {
  constructor() {
    this.apiKey = null;
    this.baseUrl = null;
    this.workflowId = null;
    this.streamRunUrl = null;
  }

  /**
   * 初始化服务
   */
  initialize() {
    this.apiKey = config.coze.apiKey;
    this.baseUrl = config.coze.baseUrl;
    this.workflowId = config.coze.workflowId;
    this.streamRunUrl = config.coze.streamRunUrl;
  }

  /**
   * 生成图片
   * @param {string} prompt - 图片描述文本
   * @param {function} onProgress - 进度回调函数
   * @returns {Promise<string>} 生成的图片URL
   */
  async generateImage(prompt, onProgress = null) {
    if (!this.apiKey) {
      throw new Error("服务未初始化，请先调用 initialize() 方法");
    }

    if (!prompt || prompt.trim() === "") {
      throw new Error("请输入图片描述");
    }

    try {
      const response = await fetch(this.streamRunUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workflow_id: this.workflowId,
          parameters: {
            input: prompt.trim(),
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `API请求失败: ${response.status} - ${
            errorData.msg || response.statusText
          }`
        );
      }

      // 处理流式响应
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let imageUrl = null;
      let buffer = "";
      let currentEvent = null;
      let currentData = null;

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        console.log("buffer", buffer);


        const lines = buffer.split("\n");
        buffer = lines.pop(); // 保留最后一个可能不完整的行

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line === "") continue;

          try {
            // 解析event行
            if (line.startsWith("event:")) {
              currentEvent = line.replace("event:", "").trim();
              continue;
            }

            // 解析data行
            if (line.startsWith("data:")) {
              const jsonStr = line.replace("data:", "").trim();
              try {
                currentData = JSON.parse(jsonStr);

                // 当我们有了event和data，处理这个事件
                if (currentEvent && currentData) {
                  const eventData = {
                    event: currentEvent,
                    data: currentData,
                  };

                  console.log("解析到事件:", eventData);

                  // 调用进度回调
                  if (onProgress && typeof onProgress === "function") {
                    onProgress(eventData);
                  }

                  // 检查是否是Message事件且包含图片URL
                  if (currentEvent === "Message" && currentData.content) {
                    // 从content中提取URL，处理反引号包围的情况
                    const content = currentData.content.trim();

                    // 匹配被反引号包围的URL或直接的URL
                    const urlMatch = content.match(
                      /`([^`]*https?:\/\/[^`\s]*)`|https?:\/\/[^\s`]*/
                    );

                    if (urlMatch) {
                      // 如果匹配到反引号包围的URL，使用第一个捕获组，否则使用整个匹配
                      const extractedUrl = urlMatch[1] || urlMatch[0];
                      // 清理URL，移除可能的空格和特殊字符
                      imageUrl = extractedUrl.trim().replace(/[`\s]+$/, "");
                      console.log("提取到图片URL:", imageUrl);
                    }
                  }

                  // 检查是否完成
                  if (currentEvent === "Done") {
                    console.log("工作流完成");
                    break;
                  }

                  // 重置当前事件和数据
                  currentEvent = null;
                  currentData = null;
                }
              } catch (parseError) {
                console.warn(
                  "解析JSON数据失败:",
                  parseError,
                  "原始数据:",
                  jsonStr
                );
              }
              continue;
            }

            // 解析id行（可以忽略）
            if (line.startsWith("id:")) {
              continue;
            }
          } catch (error) {
            console.warn("解析行失败:", error, "原始行:", line);
          }
        }
      }

      if (!imageUrl) {
        throw new Error("未能从响应中获取到图片URL");
      }

      return imageUrl;
    } catch (error) {
      console.error("图片生成失败:", error);
      throw error;
    }
  }


  /**
   * 验证图片URL是否有效
   * @param {string} url - 图片URL
   * @returns {Promise<boolean>} 是否有效
   */
  async validateImageUrl(url) {
    try {
      const response = await fetch(url, { method: "HEAD" });
      return (
        response.ok &&
        response.headers.get("content-type")?.startsWith("image/")
      );
    } catch {
      return false;
    }
  }

  /**
   * 下载图片
   * @param {string} url - 图片URL
   * @param {string} filename - 文件名
   */
  async downloadImage(url, filename = "generated-image.jpg") {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("下载图片失败");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("下载图片失败:", error);
      throw error;
    }
  }

  /**
   * 获取错误信息
   * @param {Error} error - 错误对象
   * @returns {string} 用户友好的错误信息
   */
  getErrorMessage(error) {
    if (error.message.includes("API请求失败")) {
      return error.message;
    } else if (error.message.includes("网络")) {
      return "网络连接失败，请检查网络设置";
    } else if (error.message.includes("未初始化")) {
      return "服务配置错误，请联系管理员";
    } else {
      return `图片生成失败: ${error.message}`;
    }
  }
}

// 创建单例实例
const imageService = new ImageService();

export default imageService;
