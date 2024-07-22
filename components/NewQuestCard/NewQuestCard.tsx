// components/NewQuestCard.tsx
import React from "react";
import styles from "./NewQuestCard.module.css";

interface NewQuestCardProps {
  handleNewCardClick: () => void;
}

const NewQuestCard: React.FC<NewQuestCardProps> = ({ handleNewCardClick }) => {
  return (
    <div className={styles.quest_new_card} onClick={handleNewCardClick}>
      <img src="/plus.png" alt="プラスボタン" />
      <p>困りごとを依頼しよう</p>
    </div>
  );
};

export default NewQuestCard;
