import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { closeScoreboard } from '../store/slices/gameSlice';
import './ScoreboardModal.css';

interface PlayerScore {
  playerId: string;
  playerName: string;
  totalScore: number;
  roundScores: number[];
}

const ScoreboardModal: React.FC = () => {
  const dispatch = useDispatch();
  const { isScoreboardOpen, players, currentRound, roundScores } = useSelector(
    (state: RootState) => ({
      isScoreboardOpen: state.game.isScoreboardOpen,
      players: state.game.players,
      currentRound: state.game.currentRound,
      roundScores: state.game.roundScores,
    })
  );

  // Prepare player scores sorted by total score descending
  const playerScores: PlayerScore[] = players
    .map((player) => {
      const totalScore = (roundScores[player.id] || []).reduce((sum, score) => sum + score, 0);
      return {
        playerId: player.id,
        playerName: player.name,
        totalScore,
        roundScores: roundScores[player.id] || [],
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore);

  const handleClose = () => {
    dispatch(closeScoreboard());
  };

  if (!isScoreboardOpen) {
    return null;
  }

  return (
    <div className="scoreboard-overlay" onClick={handleClose} role="presentation">
      <div
        className="scoreboard-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="scoreboard-title"
      >
        <div className="scoreboard-header">
          <h2 id="scoreboard-title" className="scoreboard-title">⚓ Current Standings ⚓</h2>
          <button
            className="scoreboard-close"
            onClick={handleClose}
            aria-label="Close scoreboard"
          >
            ✕
          </button>
        </div>

        <div className="scoreboard-container">
          <table className="scoreboard-table" role="table">
            <thead>
              <tr>
                <th scope="col" className="rank-col">Rank</th>
                <th scope="col" className="name-col">Pirate Name</th>
                <th scope="col" className="total-col">Total Plunder</th>
                {Array.from({ length: currentRound }).map((_, index) => (
                  <th
                    key={`round-${index + 1}`}
                    scope="col"
                    className={`round-col ${index + 1 === currentRound ? 'current-round' : ''}`}
                    aria-label={`Round ${index + 1} ${index + 1 === currentRound ? '(current)' : ''}`}
                  >
                    Rd {index + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {playerScores.map((player, index) => (
                <tr
                  key={player.playerId}
                  className={`scoreboard-row ${index === 0 ? 'leader' : ''}`}
                  role="row"
                >
                  <td className="rank-col">
                    <span className="rank-badge">{index + 1}</span>
                  </td>
                  <td className="name-col">
                    <span className="pirate-name">{player.playerName}</span>
                  </td>
                  <td className="total-col">
                    <span className="total-score">{player.totalScore}</span>
                  </td>
                  {Array.from({ length: currentRound }).map((_, roundIndex) => (
                    <td
                      key={`${player.playerId}-round-${roundIndex + 1}`}
                      className={`round-col ${roundIndex + 1 === currentRound ? 'current-round' : ''}`}
                      role="cell"
                    >
                      <span className="round-score">
                        {player.roundScores[roundIndex] !== undefined ? player.roundScores[roundIndex] : '-'}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="scoreboard-footer">
          <p className="round-info">⚔️ Round {currentRound} ⚔️</p>
          <button
            className="scoreboard-close-btn"
            onClick={handleClose}
            aria-label="Close scoreboard and continue"
          >
            Continue Adventure
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScoreboardModal;
