// pages/quest.tsx
"use client"; // Add this line

import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import Header from "../components/Header/Header";
import QuestCard from "../components/QuestCard/QuestCard";
import NewQuestCard from "../components/NewQuestCard/NewQuestCard";
import Sidebar from "../components/Sidebar/Sidebar";
import QuestCreationForm from "../components/QuestCreationForm/QuestCreationForm";
import styles from "./page.module.css";
import { truncate } from "fs";

interface Quest {
  id: string;
  requester: string;
  content: string;
  estimatedTime: string;
  contractor: string;
  complete: boolean;
  createdAt: string; // 追加
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
    complete: false,
    createdAt: new Date().toISOString(), // 追加
  });
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [showComplete, setShowComplete] = useState(false);
  const [showIncomplete, setShowIncomplete] = useState(true);

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
          complete: data.complete || false,
          createdAt: data.createdAt
            ? new Date(data.createdAt).toISOString()
            : "", // 修正
        });
      });
      setQuests(questsData);
    };

    fetchQuestData();
    const unsubscribe = onSnapshot(collection(db, "quest"), (snapshot: any) => {
      const questsData: Quest[] = [];
      snapshot.docs.forEach((doc: any) => {
        const data = doc.data();
        questsData.push({
          id: doc.id,
          requester: data.requester || "",
          content: data.content || "",
          estimatedTime: data.estimatedTime || "",
          contractor: data.contractor || "",
          complete: data.complete || false,
          createdAt: data.createdAt
            ? new Date(data.createdAt).toISOString()
            : "", // 修正
        });
      });
      setQuests(questsData);
    });
    return () => unsubscribe();
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
        complete: quest.complete,
        createdAt: quest.createdAt, // 追加
      });
    }
    setIsEditing(false);
    setIsShowDetail(false);
  };

  const handleCompleteClick = async (index: number) => {
    const quest = quests[index];
    const questRef = doc(db, "quest", quest.id);
    await updateDoc(questRef, {
      complete: true,
    });
    setIsEditing(false);
    setIsShowDetail(false);
  };

  const handleDeleteClick = async (index: number) => {
    const quest = quests[index];
    const questRef = doc(db, "quest", quest.id);
    await deleteDoc(questRef);
    setIsEditing(false);
    setIsShowDetail(false);
  };

  const handleCreateClick = async () => {
    const newQuestWithId = { ...newQuest, id: "" };
    setIsCreating(false);
    try {
      const docRef = await addDoc(collection(db, "quest"), newQuestWithId);
      const newQuestId = docRef.id;
    } catch (error) {
      console.error("Error adding document: ", error);
    } finally {
      setNewQuest({
        id: "",
        requester: "",
        content: "",
        estimatedTime: "",
        contractor: "",
        complete: false,
        createdAt: new Date().toISOString(), // 追加
      });
    }
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

  const handleNewCardClickWithContent = (content?: string) => {
    setIsCreating(true);
    setNewQuest((prevNewQuest) => ({
      ...prevNewQuest,
      content: content || "",
    }));
  };

  const handleCreateClose = () => {
    setIsCreating(false);
    setIsEditing(false);
    setNewQuest({
      id: "",
      requester: "",
      content: "",
      estimatedTime: "",
      contractor: "",
      complete: false,
      createdAt: new Date().toISOString(), // 追加
    });
  };

  const handleSidebarToggle = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  const handleShowCompleteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowComplete(e.target.checked);
  };

  const handleShowIncompleteChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setShowIncomplete(e.target.checked);
  };

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hours = String(Math.floor(i / 2)).padStart(2, "0");
    const minutes = i % 2 === 0 ? "00" : "30";
    return `${hours}:${minutes}`;
  });
  console.log("showComplete", showComplete);
  console.log("showIncomplete", showIncomplete);

  return (
    <>
      <Header
        handleSidebarToggle={handleSidebarToggle}
        handleShowCompleteChange={handleShowCompleteChange}
        handleShowIncompleteChange={handleShowIncompleteChange}
        showComplete={showComplete}
        showIncomplete={showIncomplete}
      />
      <main className={styles.main_quest}>
        <Sidebar
          isSidebarVisible={isSidebarVisible}
          handleNewCardClickWithContent={handleNewCardClickWithContent}
        />
        <div className={styles.quest_card_wrapper}>
          {quests
            .filter(
              (quest) =>
                (showComplete && quest.complete) ||
                (showIncomplete && !quest.complete)
            )
            .map((quest, index) => (
              <QuestCard
                key={index}
                quest={quest}
                index={index}
                handleDetailClick={handleDetailClick}
                handleEditClick={handleEditClick}
                handleSaveClick={handleSaveClick}
                handleCompleteClick={handleCompleteClick}
                handleDeleteClick={handleDeleteClick}
                handleDetailClose={handleDetailClose}
                handleChange={handleChange}
                isEditing={isEditing}
                isShowDetail={isShowDetail}
                selectedQuestIndex={selectedQuestIndex}
                timeOptions={timeOptions}
              />
            ))}
          <NewQuestCard handleNewCardClick={handleNewCardClick} />
          <QuestCreationForm
            isCreating={isCreating}
            newQuest={newQuest}
            handleCreateClose={handleCreateClose}
            handleNewQuestChange={handleNewQuestChange}
            handleCreateClick={handleCreateClick}
            timeOptions={timeOptions}
          />
        </div>
      </main>
    </>
  );
}
