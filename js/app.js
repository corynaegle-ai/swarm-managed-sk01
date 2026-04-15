/**
 * Game Application - Main entry point
 * Handles game state, round management, and scoreboard integration
 */

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

  // Clear previous content
  scoreboardContainer.innerHTML = '';
  scoreboardContainer.style.display = 'block';

  // Create scoreboard using scoreboardUI module
  if (typeof ScoreboardUI !== 'undefined' && ScoreboardUI.createScoreboard) {
    const scoreboardElement = ScoreboardUI.createScoreboard(scoreboardData);
    scoreboardContainer.appendChild(scoreboardElement);
  } else {
    // Fallback: Create a basic scoreboard if module not available
    const scoreboardHTML = createFallbackScoreboard(scoreboardData);
    scoreboardContainer.innerHTML = scoreboardHTML;
  }

  // Add close button functionality
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
    closeBtn.addEventListener('click', hideScoreboard);
  }
  
  // Also allow clicking outside the scoreboard to close it
  container.addEventListener('click', function(e) {
    if (e.target === container) {
      hideScoreboard();
    }
  });
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
