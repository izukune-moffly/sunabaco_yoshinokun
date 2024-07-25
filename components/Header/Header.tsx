// components/Header.tsx
import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";
import styles from "./Header.module.css";

interface HeaderProps {
  handleSidebarToggle: () => void;
  handleShowCompleteChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleShowIncompleteChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showComplete: boolean;
  showIncomplete: boolean;
}

const Header: React.FC<HeaderProps> = ({
  handleSidebarToggle,
  handleShowCompleteChange,
  handleShowIncompleteChange,
  showComplete,
  showIncomplete,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible((prev) => !prev);
  };

  return (
    <header className={styles.header}>
      <h1>よしのくん</h1>
      <nav>
        <FiMenu className={styles.menuIcon} onClick={toggleModal} />
        {/* <div
          id="modal"
          className={styles.modal}
          style={{ display: isModalVisible ? "block" : "none" }}
        >
          <label style={{ display: "block", marginBottom: "10px" }}>
            <input
              type="checkbox"
              name="status"
              checked={showIncomplete}
              onChange={handleShowIncompleteChange}
            />
            未完了
          </label>
          <label style={{ display: "block" }}>
            <input
              type="checkbox"
              name="status"
              checked={showComplete}
              onChange={handleShowCompleteChange}
            />
            完了
          </label>
        </div> */}
      </nav>
    </header>
  );
};

export default Header;
