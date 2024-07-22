import React, { useState } from "react";
import styles from "./QuestCreationForm.module.css";

interface Quest {
  id: string;
  requester: string;
  content: string;
  estimatedTime: string;
  contractor: string;
}

interface QuestCreationFormProps {
  isCreating: boolean;
  newQuest: Quest;
  handleCreateClose: () => void;
  handleNewQuestChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleCreateClick: () => void;
  timeOptions: string[];
}

const QuestCreationForm: React.FC<QuestCreationFormProps> = ({
  isCreating,
  newQuest,
  handleCreateClose,
  handleNewQuestChange,
  handleCreateClick,
  timeOptions,
}) => {
  if (!isCreating) return null;
  console.log("isCreating", isCreating);

  return (
    <div
      className={styles.quest_edit_wrapper}
      onClick={(e) => {
        e.stopPropagation();
        handleCreateClose();
      }}
    >
      <div
        className={styles.quest_edit}
        onClick={(e) => e.stopPropagation()} // Prevent event bubbling
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
  );
};

export default QuestCreationForm;
