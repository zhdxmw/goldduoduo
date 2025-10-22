import CryptoJS from 'crypto-js';
import config from '../config/config.js';

class TTSService {
  constructor() {
    this.appKey = '';
    this.appSecret = '';
    this.isInitialized = false;
  }

  // 初始化TTS服务
  initialize(appKey, appSecret) {
    if (!appKey || !appSecret) {
      throw new Error('有道TTS API密钥不能为空');
    }
    
    this.appKey = appKey;
    this.appSecret = appSecret;
    this.isInitialized = true;
  }

  // 检查是否已初始化
  checkInitialization() {
    if (!this.isInitialized) {
      throw new Error('TTS服务未初始化，请先设置API密钥');
    }
  }

  // 生成签名
  generateSign(q, salt, curtime) {
    const str = this.appKey + this.truncate(q) + salt + curtime + this.appSecret;
    return CryptoJS.SHA256(str).toString();
  }

  // 截断文本用于签名
  truncate(q) {
    const len = q.length;
    if (len <= 20) return q;
    return q.substring(0, 10) + len + q.substring(len - 10, len);
  }

  // 生成UUID
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // 文本转语音
  async textToSpeech(text, options = {}) {
    this.checkInitialization();

    const {
      voiceName = config.youdao.defaultVoice,
      speed = config.youdao.defaultSpeed,
      volume = config.youdao.defaultVolume,
      format = config.youdao.defaultFormat
    } = options;

    // 参数验证
    if (!text || text.trim().length === 0) {
      throw new Error('文本内容不能为空');
    }

    if (text.length > 2048) {
      throw new Error('文本长度不能超过2048个字符');
    }

    const salt = this.generateUUID();
    const curtime = Math.round(new Date().getTime() / 1000);
    const sign = this.generateSign(text, salt, curtime);

    const params = new URLSearchParams({
      q: text,
      appKey: this.appKey,
      salt: salt,
      sign: sign,
      signType: 'v3',
      curtime: curtime,
      voiceName: voiceName,
      speed: speed,
      volume: volume,
      format: format
    });

    try {
      const response = await fetch(config.youdao.ttsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
      });

      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        // 如果返回JSON，说明有错误
        const errorData = await response.json();
        throw new Error(`TTS API错误: ${errorData.errorCode} - ${this.getErrorMessage(errorData.errorCode)}`);
      }

      // 返回音频数据
      const audioBlob = await response.blob();
      return {
        success: true,
        audioBlob: audioBlob,
        audioUrl: URL.createObjectURL(audioBlob)
      };

    } catch (error) {
      console.error('TTS服务错误:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 错误码对应的错误信息
  getErrorMessage(errorCode) {
    const errorMessages = {
      '101': '缺少必填的参数',
      '102': '不支持的语言类型',
      '103': '翻译文本过长',
      '104': '不支持的API类型',
      '105': '不支持的签名类型',
      '106': '不支持的响应类型',
      '107': '不支持的传输加密类型',
      '108': 'appKey无效',
      '109': 'batchLog格式不正确',
      '110': '无相关服务的有效实例',
      '111': '开发者账号无效',
      '201': '解密失败',
      '202': '签名检验失败',
      '203': '访问IP地址不在可访问IP列表',
      '301': '辞典查询失败',
      '302': '翻译查询失败',
      '303': '服务端的其它异常',
      '401': '账户已经欠费',
      '411': '访问频率受限',
      '412': '长请求过于频繁'
    };
    
    return errorMessages[errorCode] || '未知错误';
  }

  // 获取支持的语音列表
  getSupportedVoices() {
    return [
      { value: 'youxiaoqin', label: '优小琴 (女声)' },
      { value: 'youxiaoxin', label: '优小新 (男声)' },
      { value: 'youxiaomei', label: '优小美 (女声)' },
      { value: 'youxiaokai', label: '优小凯 (男声)' },
      { value: 'youxiaoyun', label: '优小云 (男声)' }
    ];
  }

  // 获取支持的语速选项
  getSpeedOptions() {
    return [
      { value: '0.5', label: '0.5倍速 (很慢)' },
      { value: '0.8', label: '0.8倍速 (慢)' },
      { value: '1', label: '1倍速 (正常)' },
      { value: '1.5', label: '1.5倍速 (快)' },
      { value: '2.0', label: '2倍速 (很快)' }
    ];
  }

  // 获取支持的音量选项
  getVolumeOptions() {
    return [
      { value: '0.1', label: '0.1 (很小声)' },
      { value: '0.5', label: '0.5 (小声)' },
      { value: '1.0', label: '1.0 (正常)' },
      { value: '1.5', label: '1.5 (大声)' },
      { value: '2.0', label: '2.0 (很大声)' }
    ];
  }
}

// 创建TTS服务实例
const ttsService = new TTSService();

export default ttsService;