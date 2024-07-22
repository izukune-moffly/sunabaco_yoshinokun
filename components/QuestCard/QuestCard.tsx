// components/QuestCard.tsx
import React from "react";
import styles from "./QuestCard.module.css";

interface Quest {
  id: string;
  requester: string;
  content: string;
  estimatedTime: string;
  contractor: string;
}

interface QuestCardProps {
  quest: Quest;
  index: number;
  handleDetailClick: (index: number) => void;
  handleEditClick: () => void;
  handleSaveClick: () => void;
  handleDetailClose: () => void;
  handleDeleteClick: (index: number) => void;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    index: number
  ) => void;
  isEditing: boolean;
  isShowDetail: boolean;
  selectedQuestIndex: number | null;
  timeOptions: string[];
}

const QuestCard: React.FC<QuestCardProps> = ({
  quest,
  index,
  handleDetailClick,
  handleEditClick,
  handleSaveClick,
  handleDeleteClick,
  handleDetailClose,
  handleChange,
  isEditing,
  isShowDetail,
  selectedQuestIndex,
  timeOptions,
}) => {
  return (
    <div className={styles.quest_card}>
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
          <p
            className={styles.quest_value_help}
            onClick={() => handleDetailClick(index)}
          >
            業務を手伝う
          </p>
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
          onClick={(e) => {
            e.stopPropagation();
            handleDetailClose();
          }}
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
                <p className={styles.quest_value}>{quest.estimatedTime}</p>
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
                <p
                  className={styles.quest_value_help}
                  onClick={() => handleDetailClick(index)}
                >
                  業務を手伝う
                </p>
              )}
            </div>
            <div className={styles.quest_buttons}>
              {isEditing ? (
                <button onClick={handleSaveClick}>保存する</button>
              ) : (
                <div>
                  <button onClick={() => handleDeleteClick(index)}>
                    完了する
                  </button>
                  <button onClick={handleEditClick}>編集する</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestCard;
