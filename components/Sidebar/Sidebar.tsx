import React, { useState } from "react";
import styles from "./Sidebar.module.css";
import axios from "axios";

const API_URL = "https://api.openai.com/v1/";
const MODEL = "gpt-3.5-turbo";
const API_KEY = process.env.OPENAI_API_KEY;

interface SidebarProps {
  isSidebarVisible: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarVisible }) => {
  const [activeTab, setActiveTab] = useState("業務分析");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isSidebarVisible) return null;

  const handleButtonClick = async () => {
    setIsLoading(true);
    const chat = async (prompt: string) => {
      try {
        const response = await axios.post(
          `${API_URL}chat/completions`,
          {
            model: MODEL,
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${API_KEY}`,
            },
          }
        );
        console.log(prompt);
        return response.data.choices[0].message.content;
      } catch (error) {
        console.error(error);
        return null;
      } finally {
        setIsLoading(false);
      }
    };

    const messageElement = document.getElementById(
      "taskTextarea"
    ) as HTMLTextAreaElement;
    if (!messageElement) {
      console.error("taskTextarea element not found");
      setIsLoading(false);
      return;
    }
    const message = messageElement.value;
    const prompt = `
    ◯私の今日やること：${message}\n\n

    ### 指示\n
    このタスクをできるだけ簡単に5つに分解して他のメンバーに依頼できるようにしてください。出力形式はjsonにしてください。\n\n

    ### 出力形式\n
    {\n
      "task1": "タスク1の説明",\n
      "task2": "タスク2の説明",\n
      "task3": "タスク3の説明",\n
      "task4": "タスク4の説明",\n
      "task5": "タスク5の説明"\n
    }\n
    `;
    const responseText = await chat(prompt);
    setResponse(responseText);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "業務分析":
        return (
          <div className={styles.sidebarContent}>
            <p>今日やることはなんですか？</p>
            <textarea id="taskTextarea"></textarea>
            <button
              className={styles.sidebarContentButton}
              onClick={handleButtonClick}
            >
              業務切り出し
            </button>
            {isLoading ? (
              <div className={styles.loadingSpinner}></div>
            ) : (
              <div id="responseList" className={styles.sidebarContentList}>
                {response && (
                  <pre>{JSON.stringify(JSON.parse(response), null, 2)}</pre>
                )}
              </div>
            )}
          </div>
        );
      case "依頼分析":
        return (
          <div className={styles.sidebarContent}>依頼分析のコンテンツ</div>
        );
      case "よしのくん":
        return (
          <div className={styles.sidebarContent}>よしのくんのコンテンツ</div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarTabs}>
        <button className={styles.sidebarTab}>業務分解</button>
        <button className={styles.sidebarTab}>依頼分析</button>
        <button className={styles.sidebarTab}>よしのくん</button>
      </div>
      {renderContent()}
    </div>
  );
};

export default Sidebar;
