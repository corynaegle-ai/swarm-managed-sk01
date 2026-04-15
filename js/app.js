/**
 * Game Application - Main entry point
 * Handles game state, round management, and scoreboard integration
 */

// Pirate-themed styles for scoreboard button
const style = document.createElement('style');
style.textContent = `
  .pirate-btn {
    background-color: #8B4513;
    color: #FFD700;
    border: 2px solid #DAA520;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 1px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
  }
  
  .pirate-btn:hover {
    background-color: #A0522D;
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.4);
    transform: translateY(-2px);
  }
  
  .pirate-btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
`;
if (document.head) {
  document.head.appendChild(style);
}

// Game state management
const gameState = {
  players: [
    { id: 1, name: 'Player 1', score: 0 },
    { id: 2, name: 'Player 2', score: 0 },
    { id: 3, name: 'Player 3', score: 0 }
  ],
  currentRound: 0,
  maxRounds: 5,
  isRoundComplete: false,
  scoreboardVisible: false
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeGameUI();
  setupEventListeners();
});

/**
 * Initialize game UI components
 */
function initializeGameUI() {
  console.log('Game initialized with state:', gameState);
}

/**
 * Setup event listeners for game controls
 */
function setupEventListeners() {
  const showScoreboardBtn = document.getElementById('show-scoreboard-btn');
  
  if (showScoreboardBtn) {
    showScoreboardBtn.addEventListener('click', handleShowScoreboardClick);
  }
}

/**
 * Handle 'Show Scoreboard' button click
 */
function handleShowScoreboardClick() {
  displayScoreboard();
}

/**
 * Display the scoreboard with current game state
 */
function displayScoreboard() {
  const scoreboardContainer = document.getElementById('scoreboard-container');
  
  if (!scoreboardContainer) {
    console.error('Scoreboard container not found');
    return;
  }

  // Prepare scoreboard data from game state
  const scoreboardData = {
    players: gameState.players.map(player => ({
      id: player.id,
      name: player.name,
      score: player.score
    })),
    currentRound: gameState.currentRound,
    maxRounds: gameState.maxRounds
  };

  // Clear previous content and remove existing listeners
  scoreboardContainer.innerHTML = '';
  scoreboardContainer.style.display = 'block';

  // Create scoreboard using scoreboardUI module
  if (typeof ScoreboardUI !== 'undefined' && ScoreboardUI.createScoreboard) {
    const scoreboardElement = ScoreboardUI.createScoreboard(scoreboardData);
    // Ensure close button exists or add it
    if (!scoreboardElement.querySelector('#close-scoreboard')) {
      const closeBtn = document.createElement('button');
      closeBtn.id = 'close-scoreboard';
      closeBtn.className = 'close-btn';
      closeBtn.textContent = '×';
      scoreboardElement.insertBefore(closeBtn, scoreboardElement.firstChild);
    }
    scoreboardContainer.appendChild(scoreboardElement);
  } else {
    // Fallback: Create a basic scoreboard if module not available
    const scoreboardHTML = createFallbackScoreboard(scoreboardData);
    scoreboardContainer.innerHTML = scoreboardHTML;
  }

  // Add close button functionality (only once, after clearing previous listeners)
  addScoreboardCloseHandler(scoreboardContainer);

  // Update state
  gameState.scoreboardVisible = true;
}

/**
 * Create fallback scoreboard HTML if module unavailable
 */
function createFallbackScoreboard(data) {
  let html = '<div class="scoreboard-modal">';
  html += '<div class="scoreboard-content">';
  html += '<button id="close-scoreboard" class="close-btn">×</button>';
  html += '<h2>Scoreboard</h2>';
  html += `<p>Round ${data.currentRound} of ${data.maxRounds}</p>`;
  html += '<div class="scoreboard-standings">';
  
  // Sort players by score (descending)
  const sortedPlayers = [...data.players].sort((a, b) => b.score - a.score);
  
  sortedPlayers.forEach((player, index) => {
    html += `<div class="scoreboard-row" style="position: relative;">`;
    html += `<span class="rank">#${index + 1}</span>`;
    html += `<span class="player-name">${player.name}</span>`;
    html += `<span class="player-score">${player.score} points</span>`;
    html += `</div>`;
  });
  
  html += '</div>';
  html += '</div>';
  html += '</div>';
  
  return html;
}

/**
 * Add close handler for scoreboard
 */
function addScoreboardCloseHandler(container) {
  const closeBtn = container.querySelector('#close-scoreboard');
  
  if (closeBtn) {
    // Remove previous listeners to prevent accumulation
    const newCloseBtn = closeBtn.cloneNode(true);
    closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
    newCloseBtn.addEventListener('click', hideScoreboard);
  }
  
  // Create a reusable click handler for outside clicks
  const handleOutsideClick = function(e) {
    if (e.target === container) {
      hideScoreboard();
    }
  };
  
  // Remove old listeners and add new one
  container.removeEventListener('click', handleOutsideClick);
  container.addEventListener('click', handleOutsideClick);
}

/**
 * Hide the scoreboard
 */
function hideScoreboard() {
  const scoreboardContainer = document.getElementById('scoreboard-container');
  
  if (scoreboardContainer) {
    scoreboardContainer.style.display = 'none';
    scoreboardContainer.innerHTML = '';
  }
  
  gameState.scoreboardVisible = false;
}

/**
 * Update player score and sync with scoreboard
 * @param {number} playerId - The ID of the player
 * @param {number} points - Points to add to the player's score
 */
function updatePlayerScore(playerId, points) {
  const player = gameState.players.find(p => p.id === playerId);
  
  if (player) {
    player.score += points;
    console.log(`${player.name}'s score updated to ${player.score}`);
    
    // Refresh scoreboard if it's visible
    if (gameState.scoreboardVisible) {
      displayScoreboard();
    }
  }
}

/**
 * Complete the current round and show scoreboard
 */
function completeRound() {
  if (gameState.currentRound < gameState.maxRounds) {
    gameState.currentRound++;
    gameState.isRoundComplete = true;
    
    console.log(`Round ${gameState.currentRound} completed`);
    
    // Automatically display scoreboard after round completion
    displayScoreboard();
  } else {
    console.log('All rounds completed!');
    gameState.isRoundComplete = true;
    displayScoreboard();
  }
}

/**
 * Reset game state for a new game
 */
function resetGame() {
  gameState.players.forEach(player => {
    player.score = 0;
  });
  gameState.currentRound = 0;
  gameState.isRoundComplete = false;
  gameState.scoreboardVisible = false;
  
  hideScoreboard();
  console.log('Game reset');
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    gameState,
    displayScoreboard,
    hideScoreboard,
    updatePlayerScore,
    completeRound,
    resetGame
  };
}
