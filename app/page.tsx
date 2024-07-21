"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./page.module.css";
import { useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore/lite"; // 修正
import React from "react";
import { SiGooglegemini } from "react-icons/si";

interface Quest {
  id: string;
  requester: string;
  content: string;
  estimatedTime: string;
  contractor: string;
}

export default function Quest() {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const [isEditing, setIsEditing] = useState(false);
  const [isShowDetail, setIsShowDetail] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [selectedQuestIndex, setSelectedQuestIndex] = useState<number | null>(
    null
  );
  const [newQuest, setNewQuest] = useState<Quest>({
    id: "",
    requester: "",
    content: "",
    estimatedTime: "0:00",
    contractor: "",
  });
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  useEffect(() => {
    const fetchQuestData = async () => {
      const querySnapshot = await getDocs(collection(db, "quest"));
      const questsData: Quest[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        questsData.push({
          id: doc.id,
          requester: data.requester || "",
          content: data.content || "",
          estimatedTime: data.estimatedTime || "",
          contractor: data.contractor || "",
        });
      });
      setQuests(questsData);
    };

    fetchQuestData();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    if (selectedQuestIndex !== null) {
      const quest = quests[selectedQuestIndex];
      const questRef = doc(db, "quest", quest.id);
      await updateDoc(questRef, {
        requester: quest.requester,
        content: quest.content,
        estimatedTime: quest.estimatedTime,
        contractor: quest.contractor,
      });
    }
    setIsEditing(false);
  };

  const handleDeleteClick = async (index: number) => {
    const quest = quests[index];
    const questRef = doc(db, "quest", quest.id);
    await deleteDoc(questRef);
    setQuests((prevQuests) => prevQuests.filter((_, i) => i !== index));
    setIsEditing(false); // 編集モードを非表示にする
  };

  const handleCreateClick = async () => {
    const docRef = await addDoc(collection(db, "quest"), newQuest);
    setQuests((prevQuests) => [...prevQuests, { ...newQuest, id: docRef.id }]);
    setIsCreating(false);
    setNewQuest({
      id: "",
      requester: "",
      content: "",
      estimatedTime: "",
      contractor: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    index: number
  ) => {
    const { name, value } = e.target;
    setQuests((prevQuests) => {
      const newQuests = [...prevQuests];
      newQuests[index] = {
        ...newQuests[index],
        [name]: value,
      };
      return newQuests;
    });
  };

  const handleNewQuestChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setNewQuest((prevNewQuest) => ({
      ...prevNewQuest,
      [name]: value,
    }));
  };

  const handleDetailClick = (index: number) => {
    setSelectedQuestIndex(index);
    setIsShowDetail(true);
  };

  const handleDetailClose = () => {
    setIsShowDetail(false);
    setSelectedQuestIndex(null);
  };

  const handleNewCardClick = () => {
    setIsCreating(true);
  };

  const handleCreateClose = () => {
    setIsCreating(false);
  };

  const handleSidebarToggle = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hours = String(Math.floor(i / 2)).padStart(2, "0");
    const minutes = i % 2 === 0 ? "00" : "30";
    return `${hours}:${minutes}`;
  });

  console.log(quests);

  return (
    <>
      <header className={styles.header}>
        <h1>よしのくん</h1>
        <nav onClick={handleSidebarToggle}>
          <SiGooglegemini />
          <p>タスク分解</p>
        </nav>
      </header>
      <main className={styles.main_quest}>
        <div className={styles.quest_card_wrapper}>
          {quests.map((quest, index) => (
            <div key={index} className={styles.quest_card}>
              <div className={styles.key_value}>
                <p className={styles.quest_key}>依頼者</p>
                <p className={styles.quest_value}>{quest.requester}</p>
              </div>
              <div className={styles.key_value}>
                <p className={styles.quest_key}>依頼内容</p>
                <p className={styles.quest_value_textarea}>{quest.content}</p>
              </div>
              <div className={styles.key_value}>
                <p className={styles.quest_key}>予想作業時間</p>
                <p className={styles.quest_value}>{quest.estimatedTime}</p>
              </div>
              <div className={styles.key_value}>
                <p className={styles.quest_key}>受注者</p>
                {quest.contractor ? (
                  <p className={styles.quest_value}>{quest.contractor}</p>
                ) : (
                  <p className={styles.quest_value_help}>業務を手伝う</p>
                )}
              </div>
              <div
                className={styles.quest_detail}
                onClick={() => handleDetailClick(index)}
              >
                <p>詳細情報▼</p>
              </div>
              {isShowDetail && selectedQuestIndex === index && (
                <div
                  className={styles.quest_edit_wrapper}
                  onClick={handleDetailClose}
                >
                  <div
                    className={styles.quest_edit}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className={styles.key_value}>
                      <p className={styles.quest_key}>依頼者</p>
                      {isEditing ? (
                        <input
                          type="text"
                          name="requester"
                          value={quest.requester}
                          onChange={(e) => handleChange(e, index)}
                        />
                      ) : (
                        <p className={styles.quest_value}>{quest.requester}</p>
                      )}
                    </div>
                    <div className={styles.key_value}>
                      <p className={styles.quest_key}>依頼内容</p>
                      {isEditing ? (
                        <textarea
                          name="content"
                          value={quest.content}
                          onChange={(e) => handleChange(e, index)}
                        />
                      ) : (
                        <p className={styles.quest_value}>{quest.content}</p>
                      )}
                    </div>
                    <div className={styles.key_value}>
                      <p className={styles.quest_key}>予想作業時間</p>
                      {isEditing ? (
                        <select
                          name="estimatedTime"
                          value={quest.estimatedTime}
                          onChange={(e) => handleChange(e, index)}
                        >
                          {timeOptions.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className={styles.quest_value}>
                          {quest.estimatedTime}
                        </p>
                      )}
                    </div>
                    <div className={styles.key_value}>
                      <p className={styles.quest_key}>受注者</p>
                      {isEditing ? (
                        <input
                          type="text"
                          name="contractor"
                          value={quest.contractor}
                          onChange={(e) => handleChange(e, index)}
                        />
                      ) : quest.contractor ? (
                        <p className={styles.quest_value}>{quest.contractor}</p>
                      ) : (
                        <button className={styles.help_button}>
                          業務を手伝う
                        </button>
                      )}
                    </div>
                    <div className={styles.quest_buttons}>
                      {isEditing ? (
                        <button onClick={handleSaveClick}>保存する</button>
                      ) : (
                        <div>
                          <button onClick={() => handleDeleteClick(index)}>
                            削除する
                          </button>
                          <button onClick={handleEditClick}>編集する</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div className={styles.quest_new_card} onClick={handleNewCardClick}>
            <img src="/plus.png" alt="プラスボタン" />
            <p>困りごとを依頼しよう</p>
          </div>
          {isSidebarVisible && (
            <div className={styles.sidebar}>
              <p>今日は何をしますか</p>
              <textarea></textarea>
            </div>
          )}
          {isCreating && (
            <div
              className={styles.quest_edit_wrapper}
              onClick={handleCreateClose}
            >
              <div
                className={styles.quest_edit}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={styles.key_value}>
                  <p className={styles.quest_key}>依頼者</p>
                  <input
                    type="text"
                    name="requester"
                    value={newQuest.requester}
                    onChange={handleNewQuestChange}
                  />
                </div>
                <div className={styles.key_value}>
                  <p className={styles.quest_key}>依頼内容</p>
                  <textarea
                    name="content"
                    value={newQuest.content}
                    onChange={handleNewQuestChange}
                  />
                </div>
                <div className={styles.key_value}>
                  <p className={styles.quest_key}>予想作業時間</p>
                  <select
                    name="estimatedTime"
                    value={newQuest.estimatedTime}
                    onChange={handleNewQuestChange}
                  >
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.key_value}>
                  <p className={styles.quest_key}>受注者</p>
                  <input
                    type="text"
                    name="contractor"
                    value={newQuest.contractor}
                    onChange={handleNewQuestChange}
                  />
                </div>
                <div className={styles.quest_buttons}>
                  <button onClick={handleCreateClick}>作成する</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
