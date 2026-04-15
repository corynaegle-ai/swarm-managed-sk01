<template>
  <button
    class="scoreboard-button"
    @click="toggleScoreboard"
    :aria-pressed="isScoreboardOpen"
    aria-label="Toggle scoreboard display"
    title="View current game standings"
  >
    <span class="button-icon">📊</span>
    <span class="button-text">STANDINGS</span>
  </button>
</template>

<script>
export default {
  name: 'ScoreboardButton',
  props: {
    isScoreboardOpen: {
      type: Boolean,
      default: false,
      description: 'Whether the scoreboard is currently visible'
    }
  },
  methods: {
    toggleScoreboard() {
      this.$emit('toggle-scoreboard');
    }
  }
};
</script>

<style scoped>
.scoreboard-button {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #3d2817;
  border: 2px solid #8B7355;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
  white-space: nowrap;
}

.scoreboard-button:hover {
  background: linear-gradient(135deg, #ffed4e 0%, #fff9cd 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 215, 0, 0.5);
}

.scoreboard-button:active {
  transform: translateY(0);
}

.scoreboard-button[aria-pressed="true"] {
  background: linear-gradient(135deg, #ff6347 0%, #dc143c 100%);
  color: #fff;
  border-color: #8B0000;
}

.button-icon {
  font-size: 16px;
  display: inline-block;
}

.button-text {
  display: none;
}

@media (min-width: 600px) {
  .button-text {
    display: inline;
  }
}

@media (max-width: 480px) {
  .scoreboard-button {
    padding: 8px 12px;
    font-size: 12px;
  }

  .button-icon {
    font-size: 14px;
  }
}
</style>
