import React, { useState, useEffect } from 'react';
import BonusPointEntry from './BonusPointEntry';
import './ScoreCard.css';

const ScoreCard = ({ players, bidTarget, onScoresUpdate }) => {
  const [bonusPoints, setBonusPoints] = useState({});
  const [scores, setScores] = useState([]);

  useEffect(() => {
    calculateScores();
  }, [players, bonusPoints, bidTarget]);

  const calculateScores = () => {
    const calculatedScores = players.map((player, index) => {
      let score = 0;

      // Check if bid was correct
      if (player.bid !== undefined && player.bid === bidTarget) {
        // Base score for correct bid (e.g., bid amount)
        score = player.bid;

        // Add bonus points only if bid was correct
        const bonus = bonusPoints[index] || 0;
        score += bonus;
      }

      return {
        playerIndex: index,
        playerName: player.name || `Player ${index + 1}`,
        bid: player.bid,
        bidCorrect: player.bid === bidTarget,
        bonus: bonusPoints[index] || 0,
        totalScore: score
      };
    });

    setScores(calculatedScores);
    if (onScoresUpdate) {
      onScoresUpdate(calculatedScores);
    }
  };

  const handleBonusChange = (updatedBonusPoints) => {
    setBonusPoints(updatedBonusPoints);
  };

  return (
    <div className="score-card">
      <div className="score-card-header">
        <h2>Score Card</h2>
        <p className="bid-target">Bid Target: <strong>{bidTarget}</strong></p>
      </div>

      <BonusPointEntry
        players={players}
        bidTarget={bidTarget}
        onBonusChange={handleBonusChange}
      />

      <div className="scores-table">
        <h3>Scores</h3>
        <table>
          <thead>
            <tr>
              <th>Player</th>
              <th>Bid</th>
              <th>Correct</th>
              <th>Bonus</th>
              <th>Total Score</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score) => (
              <tr key={score.playerIndex} className={score.bidCorrect ? 'correct-bid' : 'incorrect-bid'}>
                <td>{score.playerName}</td>
                <td>{score.bid !== undefined ? score.bid : '-'}</td>
                <td>
                  <span className={`badge ${score.bidCorrect ? 'badge-success' : 'badge-danger'}`}>
                    {score.bidCorrect ? '✓' : '✗'}
                  </span>
                </td>
                <td>{score.bonus}</td>
                <td className="total-score"><strong>{score.totalScore}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScoreCard;
