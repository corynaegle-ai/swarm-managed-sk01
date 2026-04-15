/**
 * Scoreboard UI Module
 * Handles rendering and display control for the pirate-themed scoreboard
 */

const ScoreboardUI = (() => {
  const SCOREBOARD_ID = 'scoreboard-container';
  const SCOREBOARD_CLASS = 'scoreboard';
  let currentScoreboardData = null;
  let currentRound = 0;

  /**
   * Renders the scoreboard with player standings and round-by-round breakdown
   * @param {Object} scoreboardData - Data object containing players and scores
   * @param {Array} scoreboardData.players - Array of player objects
   * @param {string} scoreboardData.players[].name - Player name
   * @param {number} scoreboardData.players[].totalScore - Total player score
   * @param {Array} scoreboardData.players[].roundScores - Array of round scores
   * @param {number} scoreboardData.currentRound - Current round number (0-indexed)
   */
  function renderScoreboard(scoreboardData) {
    if (!scoreboardData || !scoreboardData.players) {
      console.error('Invalid scoreboard data provided');
      return;
    }

    currentScoreboardData = scoreboardData;
    currentRound = scoreboardData.currentRound || 0;

    // Remove existing scoreboard if present
    const existingScoreboard = document.getElementById(SCOREBOARD_ID);
    if (existingScoreboard) {
      existingScoreboard.remove();
    }

    // Create main scoreboard container
    const scoreboardContainer = document.createElement('div');
    scoreboardContainer.id = SCOREBOARD_ID;
    scoreboardContainer.className = SCOREBOARD_CLASS;

    // Create title
    const title = document.createElement('h2');
    title.className = 'scoreboard__title';
    title.textContent = '⚓ Player Standings ⚓';
    scoreboardContainer.appendChild(title);

    // Sort players by total score (highest first)
    const sortedPlayers = [...scoreboardData.players].sort((a, b) => {
      return b.totalScore - a.totalScore;
    });

    // Create scoreboard table
    const table = document.createElement('table');
    table.className = 'scoreboard__table';

    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.className = 'scoreboard__header-row';

    // Header cells
    const headers = ['Rank', 'Player', ...createRoundHeaders(scoreboardData.players[0]?.roundScores?.length || 0), 'Total'];
    headers.forEach(headerText => {
      const th = document.createElement('th');
      th.className = 'scoreboard__header-cell';
      th.textContent = headerText;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body with player rows
    const tbody = document.createElement('tbody');
    sortedPlayers.forEach((player, index) => {
      const row = createPlayerRow(player, index, scoreboardData.players[0]?.roundScores?.length || 0);
      tbody.appendChild(row);
    });
    table.appendChild(tbody);

    scoreboardContainer.appendChild(table);

    // Create current round highlight section
    const currentRoundSection = createCurrentRoundSection(sortedPlayers, currentRound);
    scoreboardContainer.appendChild(currentRoundSection);

    // Append to app container
    const appContainer = document.getElementById('app');
    if (appContainer) {
      appContainer.appendChild(scoreboardContainer);
    } else {
      console.error('App container not found');
    }
  }

  /**
   * Creates array of round headers
   * @param {number} roundCount - Number of rounds
   * @returns {Array} Array of round header strings
   */
  function createRoundHeaders(roundCount) {
    const headers = [];
    for (let i = 1; i <= roundCount; i++) {
      headers.push(`R${i}`);
    }
    return headers;
  }

  /**
   * Creates a player row for the scoreboard table
   * @param {Object} player - Player object
   * @param {number} rank - Player rank (0-indexed)
   * @param {number} roundCount - Total number of rounds
   * @returns {HTMLTableRowElement} Table row element
   */
  function createPlayerRow(player, rank, roundCount) {
    const row = document.createElement('tr');
    row.className = 'scoreboard__body-row';
    row.setAttribute('data-player-name', player.name);

    // Rank cell
    const rankCell = document.createElement('td');
    rankCell.className = 'scoreboard__cell scoreboard__rank-cell';
    rankCell.textContent = rank + 1;
    row.appendChild(rankCell);

    // Player name cell
    const nameCell = document.createElement('td');
    nameCell.className = 'scoreboard__cell scoreboard__name-cell';
    nameCell.textContent = player.name;
    row.appendChild(nameCell);

    // Round score cells
    const roundScores = player.roundScores || [];
    for (let i = 0; i < roundCount; i++) {
      const scoreCell = document.createElement('td');
      scoreCell.className = 'scoreboard__cell scoreboard__score-cell';
      scoreCell.textContent = roundScores[i] !== undefined ? roundScores[i] : '-';

      // Highlight current round
      if (i === currentRound) {
        scoreCell.classList.add('scoreboard__score-cell--current-round');
      }

      row.appendChild(scoreCell);
    }

    // Total score cell
    const totalCell = document.createElement('td');
    totalCell.className = 'scoreboard__cell scoreboard__total-cell';
    totalCell.textContent = player.totalScore || 0;
    row.appendChild(totalCell);

    return row;
  }

  /**
   * Creates current round highlight section
   * @param {Array} players - Sorted array of players
   * @param {number} round - Current round number
   * @returns {HTMLElement} Current round section element
   */
  function createCurrentRoundSection(players, round) {
    const section = document.createElement('div');
    section.className = 'scoreboard__current-round';

    const title = document.createElement('h3');
    title.className = 'scoreboard__current-round-title';
    title.textContent = `💰 Round ${round + 1} Results 💰`;
    section.appendChild(title);

    const resultsList = document.createElement('ul');
    resultsList.className = 'scoreboard__current-round-list';

    players.slice(0, 3).forEach((player, index) => {
      const item = document.createElement('li');
      item.className = 'scoreboard__current-round-item';

      const medal = ['🥇', '🥈', '🥉'][index];
      const roundScore = player.roundScores && player.roundScores[round] ? player.roundScores[round] : 0;

      item.innerHTML = `<span class="scoreboard__medal">${medal}</span> <span class="scoreboard__player-info">${player.name}: ${roundScore} points</span>`;
      resultsList.appendChild(item);
    });

    section.appendChild(resultsList);
    return section;
  }

  /**
   * Shows the scoreboard (makes it visible)
   */
  function showScoreboard() {
    const scoreboard = document.getElementById(SCOREBOARD_ID);
    if (scoreboard) {
      scoreboard.classList.add('scoreboard--visible');
      scoreboard.style.display = 'block';
    }
  }

  /**
   * Hides the scoreboard (makes it invisible)
   */
  function hideScoreboard() {
    const scoreboard = document.getElementById(SCOREBOARD_ID);
    if (scoreboard) {
      scoreboard.classList.remove('scoreboard--visible');
      scoreboard.style.display = 'none';
    }
  }

  /**
   * Updates the scoreboard with new data
   * @param {Object} scoreboardData - Updated scoreboard data
   */
  function updateScoreboard(scoreboardData) {
    renderScoreboard(scoreboardData);
    showScoreboard();
  }

  // Public API
  return {
    renderScoreboard,
    showScoreboard,
    hideScoreboard,
    updateScoreboard,
  };
})();
