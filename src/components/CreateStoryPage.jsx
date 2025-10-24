import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  kidsWords,
  childWords,
  teenWords,
  youngWords,
  adultWords,
} from "../config/words";
import cozeService from "../services/cozeService";
import imageService from "../services/imageService";
import "./CreateStoryPage.css";
import cozeTtsService from "../services/cozeTtsService";
import StoryDetailComponent from "./StoryDetailComponent";
const maxWords = 10;

const CreateStoryPage = () => {
  const [wordDictionaries, setWordDictionaries] = useState(kidsWords);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: "童话",
    ageGroup: "kid",
    themeCharacter: "",
    selectedWords: [],
    nums: 300,
  });
  const [showDetail, setShowDetail] = useState(false);

  const [scenes, setScenes] = useState([]);
  const [imgScenes, setImgScenes] = useState([]);
  const [storyContent, setStoryContent] = useState({});

  // 弹窗状态管理
  const [isWordModalOpen, setIsWordModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  
  // 创作状态管理
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [creationStatus, setCreationStatus] = useState('all_complete'); // creating, outline_complete, all_complete

  const categories = [
    { id: "fairy", name: "童话", icon: "🧚‍♀️" },
    { id: "mystery", name: "悬疑推理", icon: "🔍" },
    { id: "urban", name: "晋江都市", icon: "🏙️" },
    { id: "fantasy", name: "魔幻冒险", icon: "🐉" },
  ];

  const ageGroups = [
    { id: "kid", name: "学龄前", icon: "👶" },
    { id: "child", name: "7-12岁", icon: "👧" },
    { id: "teen", name: "13-17岁", icon: "🧑‍🎓" },
    { id: "young", name: "18-24岁", icon: "👨‍💼" },
    { id: "adult", name: "24岁以上", icon: "👩‍💼" },
  ];

  const themeCharacters = [
    {
      id: "harry",
      name: "哈利波特",
      icon: "⚡",
      description: "魔法世界的小巫师",
      image: (
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="35" fill="#8B4513" />
          <circle cx="40" cy="35" r="25" fill="#FFE4B5" />
          <circle cx="35" cy="30" r="2" fill="#000" />
          <circle cx="45" cy="30" r="2" fill="#000" />
          <path
            d="M35 40 Q40 45 45 40"
            stroke="#000"
            strokeWidth="2"
            fill="none"
          />
          <rect x="30" y="20" width="20" height="3" rx="1" fill="#000" />
          <path
            d="M25 15 Q40 10 55 15"
            stroke="#8B4513"
            strokeWidth="3"
            fill="none"
          />
          <circle
            cx="40"
            cy="25"
            r="8"
            fill="none"
            stroke="#FFD700"
            strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      id: "thanos",
      name: "灭霸",
      icon: "💜",
      description: "漫威宇宙的反派",
      image: (
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="35" fill="#4B0082" />
          <circle cx="40" cy="35" r="25" fill="#8A2BE2" />
          <circle cx="35" cy="30" r="2" fill="#FFD700" />
          <circle cx="45" cy="30" r="2" fill="#FFD700" />
          <path
            d="M35 40 Q40 43 45 40"
            stroke="#000"
            strokeWidth="2"
            fill="none"
          />
          <rect x="35" y="20" width="10" height="8" fill="#FFD700" />
          <circle cx="30" cy="25" r="3" fill="#FF4500" />
          <circle cx="50" cy="25" r="3" fill="#FF4500" />
          <circle cx="40" cy="15" r="3" fill="#FF4500" />
        </svg>
      ),
    },
    {
      id: "elsa",
      name: "艾莎",
      icon: "❄️",
      description: "冰雪女王",
      image: (
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="35" fill="#E6F3FF" />
          <circle cx="40" cy="35" r="25" fill="#FFE4E1" />
          <circle cx="35" cy="30" r="2" fill="#4169E1" />
          <circle cx="45" cy="30" r="2" fill="#4169E1" />
          <path
            d="M35 40 Q40 43 45 40"
            stroke="#FF69B4"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M20 20 Q40 15 60 20"
            stroke="#87CEEB"
            strokeWidth="4"
            fill="none"
          />
          <path
            d="M25 25 L35 15 M45 15 L55 25"
            stroke="#87CEEB"
            strokeWidth="2"
          />
          <circle cx="30" cy="20" r="2" fill="#00BFFF" />
          <circle cx="50" cy="20" r="2" fill="#00BFFF" />
          <circle cx="40" cy="12" r="2" fill="#00BFFF" />
        </svg>
      ),
    },
    {
      id: "spiderman",
      name: "蜘蛛侠",
      icon: "🕷️",
      description: "友好邻居超级英雄",
      image: (
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="35" fill="#DC143C" />
          <circle cx="40" cy="35" r="25" fill="#FF0000" />
          <ellipse cx="35" cy="30" rx="4" ry="6" fill="#FFF" />
          <ellipse cx="45" cy="30" rx="4" ry="6" fill="#FFF" />
          <circle cx="35" cy="30" r="2" fill="#000" />
          <circle cx="45" cy="30" r="2" fill="#000" />
          <path
            d="M20 25 Q40 20 60 25 Q50 35 40 30 Q30 35 20 25"
            fill="#000"
            opacity="0.3"
          />
          <path
            d="M25 40 Q40 35 55 40 Q45 50 40 45 Q35 50 25 40"
            fill="#000"
            opacity="0.3"
          />
          <circle cx="40" cy="50" r="3" fill="#000" />
        </svg>
      ),
    },
    {
      id: "pikachu",
      name: "皮卡丘",
      icon: "⚡",
      description: "可爱的电气宝可梦",
      image: (
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="35" fill="#FFD700" />
          <circle cx="40" cy="35" r="25" fill="#FFFF00" />
          <circle cx="35" cy="30" r="2" fill="#000" />
          <circle cx="45" cy="30" r="2" fill="#000" />
          <circle cx="32" cy="35" r="3" fill="#FF69B4" />
          <circle cx="48" cy="35" r="3" fill="#FF69B4" />
          <path
            d="M35 40 Q40 43 45 40"
            stroke="#000"
            strokeWidth="2"
            fill="none"
          />
          <ellipse cx="25" cy="20" rx="5" ry="10" fill="#FFD700" />
          <ellipse cx="55" cy="20" rx="5" ry="10" fill="#FFD700" />
          <path
            d="M20 15 L25 10 L30 15"
            stroke="#000"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M50 15 L55 10 L60 15"
            stroke="#000"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      ),
    },
    {
      id: "sherlock",
      name: "福尔摩斯",
      icon: "🔍",
      description: "著名侦探",
      image: (
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="35" fill="#8B4513" />
          <circle cx="40" cy="35" r="25" fill="#F5DEB3" />
          <circle cx="35" cy="30" r="2" fill="#000" />
          <circle cx="45" cy="30" r="2" fill="#000" />
          <path
            d="M35 40 Q40 43 45 40"
            stroke="#000"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M30 20 Q40 15 50 20 Q45 25 40 22 Q35 25 30 20"
            fill="#8B4513"
          />
          <rect x="38" y="38" width="4" height="8" fill="#8B4513" />
          <circle
            cx="55"
            cy="25"
            r="8"
            fill="none"
            stroke="#FFD700"
            strokeWidth="2"
          />
          <rect x="60" y="30" width="2" height="8" fill="#8B4513" />
          <path
            d="M32 45 Q40 48 48 45"
            stroke="#8B4513"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      ),
    },
  ];

  useEffect(() => {
    console.log("formData.ageGroup", formData.ageGroup);

    switch (formData.ageGroup) {
      case "kid":
        setWordDictionaries(kidsWords);
        break;
      case "child":
        setWordDictionaries(childWords);
        break;
      case "teen":
        setWordDictionaries(teenWords);
        break;
      case "young":
        setWordDictionaries(youngWords);
        break;

      case "adult":
        setWordDictionaries(adultWords);
        break;
      default:
        setWordDictionaries(kidsWords);
        break;
    }
  }, [formData.ageGroup]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleWordToggle = (wordObj) => {
    setFormData((prev) => {
      const currentWords = prev.selectedWords;
      const isSelected = currentWords.some((w) => w.en === wordObj.en);

      if (isSelected) {
        // 取消选择
        return {
          ...prev,
          selectedWords: currentWords.filter((w) => w.en !== wordObj.en),
        };
      } else {
        // 选择单词，但不超过20个
        if (currentWords.length >= maxWords) {
          // alert("最多只能选择10个单词");
          return prev;
        }
        return {
          ...prev,
          selectedWords: [...currentWords, wordObj],
        };
      }
    });
  };

  // 清空已选单词
  const handleClearWords = () => {
    setFormData((prev) => ({
      ...prev,
      selectedWords: [],
    }));
  };

  // 弹窗控制函数
  const openWordModal = () => setIsWordModalOpen(true);
  const closeWordModal = () => setIsWordModalOpen(false);
  const openThemeModal = () => setIsThemeModalOpen(true);
  const closeThemeModal = () => setIsThemeModalOpen(false);

  // 主题角色选择处理函数
  const handleThemeCharacterSelect = (character) => {
    // 将角色名称和描述添加到故事主题描述中
    const newDescription = `${character.description}${character.name}`;

    setFormData((prev) => ({
      ...prev,
      description: newDescription,
      themeCharacter: character.name,
    }));
    closeThemeModal();
  };

  // 自动推荐填充功能
  const handleAutoFillWords = () => {
    // 收集所有可用的单词
    const allWords = [];
    Object.values(wordDictionaries).forEach((dictionary) => {
      allWords.push(...dictionary.words);
    });

    // 过滤掉已经选中的单词
    const availableWords = allWords.filter(
      (word) =>
        !formData.selectedWords.some((selected) => selected.en === word.en)
    );

    // 如果可用单词不足，提示用户
    if (availableWords.length === 0) {
      // alert("所有单词都已选择！");
      return;
    }

    // 计算需要选择的单词数量（最多10个，减去已选择的数量）
    const remainingSlots = maxWords - formData.selectedWords.length;
    const wordsToSelect = Math.min(remainingSlots, availableWords.length);

    if (wordsToSelect <= 0) {
      // alert("已达到最大选择数量（10个）！");
      return;
    }

    // 随机选择单词
    const shuffled = [...availableWords].sort(() => Math.random() - 0.5);
    const randomWords = shuffled.slice(0, wordsToSelect);

    // 更新选中的单词
    setFormData((prev) => ({
      ...prev,
      selectedWords: [...prev.selectedWords, ...randomWords],
    }));
  };

  const handleSubmit = async () => {
    if (!formData.selectedWords.length) {
      setCreateError("请选择至少一个单词");
      return;
    }

    setIsCreating(true);
    setCreateError(null);
    setCreationStatus('creating');

    try {
      // 构建工作流参数
      const ageMap = {
        "kid": '3-6岁',
        "child": '7-12岁',
        "teen": '13-17岁',
        "young": '18-24岁',
        "adult": '24岁以上',
      }
      const parameters = {
        word: formData.selectedWords.map(word => word.en),
        style: formData.category || '',
        age: ageMap[formData.ageGroup] || '',
        theme: formData.description || '',
        nums: formData.nums || 300,
      };
      setShowDetail(true);
      // 调用扣子工作流生成故事
      const result = await cozeService.generateStory(parameters);
      
      console.log("工作流调用结果:", result);
      
      // 检查结果是否成功
      if (result.success) {
        console.log("故事生成成功:", result.content);
        setCreationStatus('outline_complete');
        const content = result.content;
        setStoryContent(content);
        
        // 优化后的处理流程：即使部分失败也继续执行
        let finalContent = content;
        let hasAudioError = false;
        let hasImageError = false;
        imageService.initialize();

        finalContent.words = formData.selectedWords.map(word => word.en);

        try {
           const coverImg = await imageService.generateImage(
              content.prompt,
              (progress) => {
                console.log(`图片生成进度:`, progress);
              }
            );
            finalContent.story_intro.cover_img = coverImg;
        } catch (error) {
          hasImageError = true;
          console.error("封面图图片生成过程出现异常:", error);
          // 继续执行，不中断流程
        }
        try {
          // 生成封面图
           
          // 处理故事内容，生成语音
          console.log("开始处理音频生成...");
          const processedRes = await processStoryContent(content);
          if (processedRes.success) {
            finalContent = processedRes.data;
            console.log("音频生成完成，成功率:", 
              `${processedRes.stats?.successCount || 0}/${processedRes.stats?.totalSegments || 0}`);
          } else {
            hasAudioError = true;
            console.warn("音频生成部分失败:", processedRes.error);
            // 继续使用原始内容，不中断流程
          }
        } catch (error) {
          hasAudioError = true;
          console.error("音频生成过程出现异常:", error);
          // 继续执行，不中断流程
        }
        
        // 更新内容（即使音频生成失败）
        setStoryContent(finalContent);
        
        try {
          // 处理图片生成
            // 初始化imageService
          console.log("开始处理图片生成...");
          const imgsContent = await processImageGeneration(finalContent);
          if (imgsContent.success) {
            finalContent = imgsContent.data;
            console.log("图片生成完成，成功率:", 
              `${imgsContent.stats?.successCount || 0}/${imgsContent.stats?.totalImages || 0}`);
          } else {
            hasImageError = true;
            console.warn("图片生成部分失败:", imgsContent.error);
            // 继续使用当前内容，不中断流程
          }
        } catch (error) {
          hasImageError = true;
          console.error("图片生成过程出现异常:", error);
          // 继续执行，不中断流程
        }
        
        // 最终更新内容
        setStoryContent(finalContent);
        setCreationStatus('all_complete');
        
        // 显示处理结果摘要
        if (hasAudioError || hasImageError) {
          const errorMessages = [];
          if (hasAudioError) errorMessages.push("音频生成");
          if (hasImageError) errorMessages.push("图片生成");
          console.warn(`故事创建完成，但${errorMessages.join("和")}过程中出现问题，部分内容可能不完整`);
        } else {
          console.log("故事创建完全成功！");
        }

      } else {
        // 工作流执行失败
        throw new Error(result.error || "工作流执行失败");
      }
      
    } catch (error) {
      console.error("故事生成失败:", error);
      setCreateError(error.message || "故事生成失败，请重试");
      setCreationStatus('all_complete'); // 出错时重置为完成状态，不显示loading
    } finally {
      setIsCreating(false);
    }
  };

  // 参考resultContent detailed_scenes 格式 循环调用为text_en生成语音， 新增语音字段
  const processStoryContent = async (content) => {
    try {
      // 检查content是否包含detailed_scenes
      if (!content || !content.detailed_scenes || !Array.isArray(content.detailed_scenes)) {
        throw new Error('内容格式不正确，缺少detailed_scenes字段');
      }

      console.log('开始处理故事内容，生成语音...');
      
      // 深拷贝content以避免修改原始数据
      const processedContent = JSON.parse(JSON.stringify(content));
      
      // 统计总的segments数量用于进度显示
      let totalSegments = 0;
      let processedSegments = 0;
      let successCount = 0;
      let errorCount = 0;
      
      processedContent.detailed_scenes.forEach(scene => {
        if (scene.segments && Array.isArray(scene.segments)) {
          totalSegments += scene.segments.length;
        }
      });

      console.log(`总共需要处理 ${totalSegments} 个文本片段`);

      // 重试函数
      const retryTtsGeneration = async (text, voiceId, maxRetries = 2) => {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            const result = await cozeTtsService.generateSpeech(text, voiceId);
            if (result.success && result.audioUrl) {
              return result;
            } else {
              console.warn(`TTS生成尝试 ${attempt} 失败:`, result.error);
              if (attempt === maxRetries) {
                return { success: false, error: result.error || '达到最大重试次数' };
              }
            }
          } catch (error) {
            console.warn(`TTS生成尝试 ${attempt} 异常:`, error.message);
            if (attempt === maxRetries) {
              return { success: false, error: error.message };
            }
            // 重试前等待
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          }
        }
      };

      // 遍历每个场景
      for (let sceneIndex = 0; sceneIndex < processedContent.detailed_scenes.length; sceneIndex++) {
        const scene = processedContent.detailed_scenes[sceneIndex];
        
        if (!scene.segments || !Array.isArray(scene.segments)) {
          console.warn(`场景 ${scene.scene_index} 没有segments，跳过`);
          continue;
        }

        console.log(`处理场景 ${scene.scene_index}，包含 ${scene.segments.length} 个片段`);

        // 遍历每个片段
        for (let segmentIndex = 0; segmentIndex < scene.segments.length; segmentIndex++) {
          const segment = scene.segments[segmentIndex];
          
          // 检查是否有text_en字段且不为空
          if (!segment.text_en || segment.text_en.trim().length === 0) {
            console.warn(`场景 ${scene.scene_index} 片段 ${segmentIndex} 的text_en为空，跳过`);
            segment.audio_url = null;
            processedSegments++;
            continue;
          }

          // 过滤掉只包含标点符号的文本
          const cleanText = segment.text_en.trim();
          if (cleanText.length <= 2 && /^[^\w\s]*$/.test(cleanText)) {
            console.log(`跳过标点符号文本: "${cleanText}"`);
            segment.audio_url = null; // 标记为无需语音
            processedSegments++;
            continue;
          }

          try {
            console.log(`正在为文本生成语音: "${segment.text_en}"`);
            const voiceMaps = {
              "0": "7468518846874533939",
              "1": "7468512265151512603",
              "2": "7481299960424742966",
              "3": "7426725529589661723",
              "4": "7426720361753952293",
            }
            
            // 使用重试机制调用TTS服务
            const ttsResult = await retryTtsGeneration(segment.text_en, voiceMaps[segment.type]);
            
            if (ttsResult.success && ttsResult.audioUrl) {
              // 将生成的语音URL添加到segment中
              segment.audio_url = ttsResult.audioUrl;
              successCount++;
              console.log(`语音生成成功: 场景 ${scene.scene_index} 片段 ${segmentIndex}`);
            } else {
              console.error(`语音生成失败: ${ttsResult.error}`);
              segment.audio_url = null; // 标记为生成失败
              errorCount++;
            }

          } catch (error) {
            console.error(`为文本 "${segment.text_en}" 生成语音时出错:`, error);
            segment.audio_url = null; // 标记为生成失败
            errorCount++;
          }

          processedSegments++;
          
          // 显示进度
          const progress = Math.round((processedSegments / totalSegments) * 100);
          console.log(`语音生成进度: ${processedSegments}/${totalSegments} (${progress}%) - 成功: ${successCount}, 失败: ${errorCount}`);

          // 添加小延迟避免API调用过于频繁
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      console.log('故事内容语音生成完成', processedContent);
      
      // 即使有部分失败，只要有成功的就返回成功
      const isSuccess = successCount > 0 || errorCount === 0;
      
      return {
        success: isSuccess,
        data: processedContent,
        stats: {
          totalSegments,
          processedSegments,
          successCount,
          errorCount,
          successRate: totalSegments > 0 ? Math.round((successCount / totalSegments) * 100) : 0
        },
        message: isSuccess ? 
          `音频生成完成，成功率: ${successCount}/${totalSegments}` : 
          `音频生成失败，错误数: ${errorCount}/${totalSegments}`
      };

    } catch (error) {
      console.error('处理故事内容时出错:', error);
      return {
        success: false,
        error: error.message,
        data: content, // 返回原始内容
        stats: {
          totalSegments: 0,
          processedSegments: 0,
          successCount: 0,
          errorCount: 0,
          successRate: 0
        }
      };
    }
  };


  // 处理插图生成 img_prompt
  const processImageGeneration = async (content) => {
    try {
      // 检查content是否包含img_prompt
      if (!content || !content.img_prompt || !Array.isArray(content.img_prompt)) {
        throw new Error('内容格式不正确，缺少img_prompt字段');
      }

      console.log('开始处理插图生成...');
    
      // 深拷贝content以避免修改原始数据
      const processedContent = JSON.parse(JSON.stringify(content));
      
      const totalImages = processedContent.img_prompt.length;
      let processedImages = 0;
      let successCount = 0;
      let errorCount = 0;

      console.log(`总共需要生成 ${totalImages} 张图片`);

      // 重试函数
      const retryImageGeneration = async (prompt, maxRetries = 2) => {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            const imageUrl = await imageService.generateImage(
              prompt,
              (progress) => {
                console.log(`图片生成进度:`, progress);
              }
            );
            
            if (imageUrl) {
              return { success: true, imageUrl };
            } else {
              console.warn(`图片生成尝试 ${attempt} 失败: 未返回URL`);
              if (attempt === maxRetries) {
                return { success: false, error: '达到最大重试次数，未返回图片URL' };
              }
            }
          } catch (error) {
            console.warn(`图片生成尝试 ${attempt} 异常:`, error.message);
            if (attempt === maxRetries) {
              return { success: false, error: error.message };
            }
            // 重试前等待，递增延迟
            await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
          }
        }
      };

      // 并发处理图片生成（限制并发数量）
      const concurrencyLimit = 2; // 限制同时处理的图片数量
      const processImageBatch = async (items) => {
        const results = [];
        
        for (let i = 0; i < items.length; i += concurrencyLimit) {
          const batch = items.slice(i, i + concurrencyLimit);
          
          const batchPromises = batch.map(async (imgItem) => {
            // 检查是否有prompt字段且不为空
            if (!imgItem.prompt || imgItem.prompt.trim().length === 0) {
              console.warn(`图片 ${imgItem.index} 的prompt为空，跳过`);
              return {
                ...imgItem,
                img_url: null,
                success: false,
                error: 'prompt为空'
              };
            }

            try {
              console.log(`正在生成图片 ${imgItem.index}: "${imgItem.prompt.substring(0, 50)}..."`);
              
              // 使用重试机制调用图片生成服务
              const result = await retryImageGeneration(imgItem.prompt);
              
              if (result.success) {
                console.log(`图片 ${imgItem.index} 生成成功: ${result.imageUrl}`);
                return {
                  ...imgItem,
                  img_url: result.imageUrl,
                  success: true
                };
              } else {
                console.error(`图片 ${imgItem.index} 生成失败: ${result.error}`);
                return {
                  ...imgItem,
                  img_url: null,
                  success: false,
                  error: result.error
                };
              }

            } catch (error) {
              console.error(`生成图片 ${imgItem.index} 时出错:`, error);
              return {
                ...imgItem,
                img_url: null,
                success: false,
                error: error.message
              };
            }
          });

          // 等待当前批次完成
          const batchResults = await Promise.allSettled(batchPromises);
          
          // 处理批次结果
          batchResults.forEach((result, index) => {
            const imgItem = batch[index];
            if (result.status === 'fulfilled') {
              results.push(result.value);
              if (result.value.success) {
                successCount++;
              } else {
                errorCount++;
              }
            } else {
              console.error(`图片 ${imgItem.index} 处理异常:`, result.reason);
              results.push({
                ...imgItem,
                img_url: null,
                success: false,
                error: result.reason?.message || '未知错误'
              });
              errorCount++;
            }
            
            processedImages++;
            
            // 显示进度
            const progress = Math.round((processedImages / totalImages) * 100);
            console.log(`图片生成进度: ${processedImages}/${totalImages} (${progress}%) - 成功: ${successCount}, 失败: ${errorCount}`);
          });

          // 批次间延迟，避免API调用过于频繁
          if (i + concurrencyLimit < items.length) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
        
        return results;
      };

      // 执行图片生成
      const results = await processImageBatch(processedContent.img_prompt);
      
      // 更新处理后的内容
      processedContent.img_prompt = results.map(result => ({
        index: result.index,
        prompt: result.prompt,
        img_url: result.img_url
      }));

      console.log('插图生成完成', processedContent);
      
      // 即使有部分失败，只要有成功的就返回成功
      const isSuccess = successCount > 0 || errorCount === 0;
      
      return {
        success: isSuccess,
        data: processedContent,
        stats: {
          totalImages,
          processedImages,
          successCount,
          errorCount,
          successRate: totalImages > 0 ? Math.round((successCount / totalImages) * 100) : 0
        },
        message: isSuccess ? 
          `图片生成完成，成功率: ${successCount}/${totalImages}` : 
          `图片生成失败，错误数: ${errorCount}/${totalImages}`
      };

    } catch (error) {
      console.error('处理插图生成时出错:', error);
      return {
        success: false,
        error: error.message,
        data: content, // 返回原始内容
        stats: {
          totalImages: 0,
          processedImages: 0,
          successCount: 0,
          errorCount: 0,
          successRate: 0
        }
      };
    }
  };


  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="create-story-page">
      <div className="create-story-container">
        {/* 头部 */}
        <div className="create-header">
          <button className="back-button" onClick={handleBackClick}>
            ← 返回
          </button>
          <h1 className="page-title">创建故事</h1>
        </div>

        {/* 表单内容 */}
        <div className="form-content">
          {/* 故事分类 */}
          <div className="form-group">
            <label className="form-label">故事风格</label>
            <div className="category-grid">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`category-option ${
                    formData.category === category.name ? "active" : ""
                  }`}
                  onClick={() => handleInputChange("category", category.name)}
                >
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-name">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 年龄段选择 */}
          <div className="form-group">
            <label className="form-label">适合年龄</label>
            <div className="category-grid">
              {ageGroups.map((ageGroup) => (
                <button
                  key={ageGroup.id}
                  className={`category-option ${
                    formData.ageGroup === ageGroup.id ? "active" : ""
                  }`}
                  onClick={() => handleInputChange("ageGroup", ageGroup.id)}
                >
                  <span className="category-icon">{ageGroup.icon}</span>
                  <span className="category-name">{ageGroup.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 单词选择 */}
          <div className="form-group">
            <label className="form-label">
              单词选择
              <span className="word-count">
                ({formData.selectedWords.length}/{maxWords})
              </span>
              {formData.selectedWords.length < maxWords && (
                <span
                  className="inline-auto-fill"
                  style={{ display: 'inline-block', marginLeft: '20px' }}
                  onClick={handleAutoFillWords}
                  title="自动填充"
                >
                  🎲 自动填充
                </span>
              )}
              {formData.selectedWords.length > 0 && (
                  <span
                    className="clear-words-btn"
                    onClick={handleClearWords}
                    style={{ display: 'inline-block', marginLeft: '20px' }}
                    title="清空所有已选单词"
                  >
                    🗑️ 清空
                  </span>
                )}
            </label>
            <button className="word-select-trigger" onClick={openWordModal}>
              <span className="trigger-icon">📚</span>
              <span className="trigger-text">
                {formData.selectedWords.length > 0
                  ? `已选择 ${formData.selectedWords.length} 个单词`
                  : "点击选择单词"}
              </span>
              <span className="trigger-arrow">→</span>
            </button>

            {formData.selectedWords.length > 0 && (
              <div className="selected-words-preview">
                <div className="preview-header">已选择的单词：</div>
                <div className="selected-words-list">
                  {formData.selectedWords.map((wordObj) => (
                    <span key={wordObj.en} className="selected-word-tag">
                      {wordObj.en}
                      <span className="word-translation">({wordObj.cn})</span>
                      <button
                        className="remove-word"
                        onClick={() => handleWordToggle(wordObj)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 故事主题 */}
          <div className="form-group">
            <label className="form-label">
              故事主题
              <button
                className="theme-character-trigger"
                onClick={openThemeModal}
                type="button"
              >
                <span className="trigger-icon">🎭</span>
                <span className="trigger-text">选择推荐主题角色</span>
                <span className="trigger-arrow">→</span>
              </button>
            </label>
            <textarea
              className="form-textarea"
              placeholder="请描述你想要的故事主题、主题角色、情节设定、背景等..."
              rows="4"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />

            {/* 推荐主题角色触发按钮 */}
          </div>

          {/* 字数限制 */}
          <div className="form-group">
            <label className="form-label">字数限制</label>
            <input
              type="number"
              className="form-input"
              placeholder="请输入故事字数限制"
              min="50"
              max="2000"
              value={formData.nums}
              onChange={(e) => handleInputChange("nums", parseInt(e.target.value) || 300)}
            />
            <div className="input-hint">
              建议字数范围：50-2000字，默认300字
            </div>
          </div>
        </div>

        {/* 创建按钮 */}
        <div className="create-section">
          {createError && (
            <div className="error-message">
              {createError}
            </div>
          )}
          <button 
            className={`create-button ${isCreating ? 'creating' : ''}`} 
            onClick={handleSubmit}
            disabled={isCreating}
          >
            <span>{isCreating ? '⏳' : '🎭'}</span>
            <span>{isCreating ? '正在创作中...' : 'AI 智能创作'}</span>
            <span>{isCreating ? '⏳' : '✨'}</span>
          </button>
          
        </div>
      </div>

      {/* 单词选择弹窗 */}
      {isWordModalOpen && (
        <div className="word-modal-overlay" onClick={closeWordModal}>
          <div className="word-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>选择单词</h3>
              <div className="modal-word-count">
                已选择 {formData.selectedWords.length}/{maxWords} 个单词
                {formData.selectedWords.length > 0 && (
                  <button
                    className="clear-words-btn"
                    onClick={handleClearWords}
                    title="清空所有已选单词"
                  >
                    🗑️ 清空
                  </button>
                )}
              </div>
              <button className="modal-close" onClick={closeWordModal}>
                ×
              </button>
            </div>

            <div className="modal-content">
              <div className="word-dictionaries">
                {Object.entries(wordDictionaries).map(([key, dictionary]) => (
                  <div key={key} className="dictionary-section">
                    <div className="dictionary-header">
                      <span className="dictionary-icon">{dictionary.icon}</span>
                      <span className="dictionary-name">{dictionary.name}</span>
                    </div>
                    <div className="words-grid">
                      {dictionary.words.map((wordObj) => (
                        <button
                          key={wordObj.en}
                          className={`word-option ${
                            formData.selectedWords.some(
                              (w) => w.en === wordObj.en
                            )
                              ? "selected"
                              : ""
                          }`}
                          onClick={() => handleWordToggle(wordObj)}
                        >
                          <div className="word-en">{wordObj.en}</div>
                          <div className="word-cn">{wordObj.cn}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-auto-fill" onClick={handleAutoFillWords}>
                自动推荐填充
              </button>
              <button className="modal-confirm" onClick={closeWordModal}>
                确认选择
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 主题角色选择弹窗 */}
      {isThemeModalOpen && (
        <div className="modal-overlay" onClick={closeThemeModal}>
          <div
            className="modal-content theme-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 className="modal-title">选择推荐主题角色</h3>
              <button className="modal-close" onClick={closeThemeModal}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="theme-characters-grid">
                <div className="character-category">
                  <h4 className="category-title">推荐主题角色</h4>
                  <div className="characters-horizontal-list">
                    {themeCharacters.map((character) => (
                      <div
                        key={character.id}
                        className="character-card"
                        onClick={() => handleThemeCharacterSelect(character)}
                      >
                        <div className="character-image">{character.image}</div>
                        <div className="character-info">
                          <div className="character-name">{character.name}</div>
                          <div className="character-description">
                            {character.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-cancel" onClick={closeThemeModal}>
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {
        showDetail? <StoryDetailComponent storyData={storyContent} creationStatus={creationStatus} /> : null
      }


    </div>
  );
};

export default CreateStoryPage;
