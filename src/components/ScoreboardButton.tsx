import React from 'react';
import { useDispatch } from 'react-redux';
import { openScoreboard } from '../store/slices/gameSlice';
import './ScoreboardButton.css';

interface ScoreboardButtonProps {
  className?: string;
}

const ScoreboardButton: React.FC<ScoreboardButtonProps> = ({ className = '' }) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(openScoreboard());
  };

  return (
    <button
      className={`scoreboard-button ${className}`}
      onClick={handleClick}
      aria-label="View scoreboard and current standings"
      title="View current standings"
    >
      ⚓ Standings
    </button>
  );
};

export default ScoreboardButton;
