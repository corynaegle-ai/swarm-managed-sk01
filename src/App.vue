<template>
  <div class="app">
    <h1>Pirate Game</h1>
    <ScoreboardButton
      :isScoreboardOpen="scoreboardVisible"
      @toggle-scoreboard="toggleScoreboard"
    />
    
    <Scoreboard
      :players="players"
      :currentRound="currentRound"
      :autoShow="roundComplete"
      @scoreboard-shown="onScoreboardShown"
      @scoreboard-closed="onScoreboardClosed"
    />
    
    <div class="game-controls">
      <button @click="completeRound">Complete Round</button>
      <button @click="addPlayerScore">Add Player Score</button>
    </div>
  </div>
</template>

<script>
import Scoreboard from './components/Scoreboard.vue'
import ScoreboardButton from './components/ScoreboardButton.vue'

export default {
  name: 'App',
  components: {
    Scoreboard,
    ScoreboardButton
  },
  data() {
    return {
      scoreboardVisible: false,
      roundComplete: false,
      currentRound: 1,
      players: [
        {
          id: 1,
          name: 'Captain Hook',
          roundScores: [15, 20],
          totalScore: 35
        },
        {
          id: 2,
          name: 'Blackbeard',
          roundScores: [12, 18],
          totalScore: 30
        },
        {
          id: 3,
          name: 'Redbeard',
          roundScores: [10, 15],
          totalScore: 25
        }
      ]
    }
  },
  methods: {
    toggleScoreboard() {
      this.scoreboardVisible = !this.scoreboardVisible
    },
    onScoreboardShown() {
      console.log('Scoreboard is now visible')
    },
    onScoreboardClosed() {
      console.log('Scoreboard is now hidden')
    },
    completeRound() {
      this.roundComplete = true
      setTimeout(() => {
        this.roundComplete = false
        this.currentRound++
        // Add new round scores
        this.players.forEach(player => {
          const newScore = Math.floor(Math.random() * 20) + 5
          player.roundScores.push(newScore)
          player.totalScore += newScore
        })
      }, 1000)
    },
    addPlayerScore() {
      this.players.forEach(player => {
        const newScore = Math.floor(Math.random() * 20) + 5
        player.roundScores.push(newScore)
        player.totalScore += newScore
      })
      this.currentRound++
    }
  }
}
</script>

<style>
.app {
  font-family: Arial, sans-serif;
  text-align: center;
  padding: 20px;
}

.game-controls {
  margin-top: 20px;
}

.game-controls button {
  margin: 0 10px;
  padding: 10px 20px;
  background: #8B7355;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.game-controls button:hover {
  background: #6B5344;
}
</style>
