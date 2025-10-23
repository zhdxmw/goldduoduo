import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  kidsWords,
  childWords,
  teenWords,
  youngWords,
  adultWords,
} from "../config/words";
import "./CreateStoryPage.css";
const maxWords = 10;

const CreateStoryPage = () => {
  const [wordDictionaries, setWordDictionaries] = useState(kidsWords);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: "童话",
    ageGroup: "kid",
    themeCharacter: "",
    selectedWords: [],
  });

  // 弹窗状态管理
  const [isWordModalOpen, setIsWordModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

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

  const handleSubmit = () => {
    if (!formData.selectedWords.length) {
      // alert("请选择单词");
      return;
    }

    return;
    // 这里可以添加创建故事的逻辑
    console.log("创建故事:", formData);
    navigate("/home");
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
        </div>

        {/* 创建按钮 */}
        <div className="create-section">
          <button className="create-button" onClick={handleSubmit}>
            <span>🎭</span>
            <span>AI 智能创作</span>
            <span>✨</span>
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
    </div>
  );
};

export default CreateStoryPage;
