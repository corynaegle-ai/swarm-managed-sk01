<template>
  <div class="scoreboard-wrapper" v-if="isVisible" role="main" aria-label="Game Scoreboard">
    <div class="scoreboard-container">
      <!-- Header with Pirate Theme -->
      <div class="scoreboard-header">
        <div class="pirate-skull">☠</div>
        <h1 class="scoreboard-title">CURRENT STANDINGS</h1>
        <div class="pirate-skull">☠</div>
      </div>

      <!-- Scoreboard Table -->
      <div class="scoreboard-content">
        <table class="standings-table" role="table">
          <thead>
            <tr class="table-header">
              <th scope="col" class="rank-col">RANK</th>
              <th scope="col" class="name-col">PIRATE NAME</th>
              <th scope="col" class="round-scores-col">ROUND SCORES</th>
              <th scope="col" class="total-col">TOTAL PLUNDER</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(player, index) in sortedPlayers"
              :key="player.id"
              class="player-row"
              :class="{
                'current-round': isCurrentRound(player.id),
                'highlight': index === 0
              }"
              role="row"
            >
              <td class="rank-cell" role="gridcell">
                <span class="rank-badge">{{ index + 1 }}</span>
              </td>
              <td class="name-cell" role="gridcell">
                <span class="player-name">{{ player.name }}</span>
              </td>
              <td class="round-scores-cell" role="gridcell">
                <div class="round-scores">
                  <span
                    v-for="(score, roundIndex) in player.roundScores"
                    :key="roundIndex"
                    class="round-score"
                    :class="{
                      'current-round-score': roundIndex === currentRound - 1
                    }"
                    :title="`Round ${roundIndex + 1}: ${score} points`"
                  >
                    {{ score }}
                  </span>
                </div>
              </td>
              <td class="total-cell" role="gridcell">
                <span class="total-score">{{ player.totalScore }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Round Indicator -->
      <div class="round-indicator" v-if="currentRound > 0">
        <span class="round-text">CURRENT ROUND: {{ currentRound }}</span>
      </div>

      <!-- Close Button -->
      <button
        class="scoreboard-close-btn"
        @click="closeScoreboard"
        aria-label="Close scoreboard"
      >
        ✕ CLOSE
      </button>
    </div>
  </div>
</template>

<script>
import { scoreboardService } from '@/services/ScoreboardService';

export default {
  name: 'Scoreboard',
  props: {
    players: {
      type: Array,
      required: true,
      description: 'Array of player objects with id, name, roundScores, and totalScore'
    },
    currentRound: {
      type: Number,
      default: 0,
      description: 'Current round number'
    },
    autoShow: {
      type: Boolean,
      default: false,
      description: 'Whether to auto-show after round completion'
    }
  },
  data() {
    return {
      isVisible: false
    };
  },
  computed: {
    sortedPlayers() {
      return scoreboardService.getSortedPlayers(this.players);
    }
  },
  watch: {
    autoShow(newVal) {
      if (newVal) {
        this.showScoreboard();
      }
    }
  },
  methods: {
    showScoreboard() {
      this.isVisible = true;
      this.$emit('scoreboard-shown');
    },
    closeScoreboard() {
      this.isVisible = false;
      this.$emit('scoreboard-closed');
    },
    isCurrentRound(playerId) {
      return this.currentRound > 0 && this.players.some(
        p => p.id === playerId && p.roundScores[this.currentRound - 1] > 0
      );
    }
  },
  mounted() {
    if (this.autoShow) {
      this.showScoreboard();
    }
  }
};
</script>

<style scoped>
@import './Scoreboard.css';
</style>
