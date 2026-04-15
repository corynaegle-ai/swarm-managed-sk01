import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Player {
  id: string;
  name: string;
}

export interface GameState {
  players: Player[];
  currentRound: number;
  roundScores: Record<string, number[]>;
  isScoreboardOpen: boolean;
  roundComplete: boolean;
  roundCount: number;
}

const initialState: GameState = {
  players: [],
  currentRound: 1,
  roundScores: {},
  isScoreboardOpen: false,
  roundComplete: false,
  roundCount: 0,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setPlayers: (state, action: PayloadAction<Player[]>) => {
      state.players = action.payload;
      // Initialize score tracking for each player
      action.payload.forEach((player) => {
        if (!state.roundScores[player.id]) {
          state.roundScores[player.id] = [];
        }
      });
    },

    addRoundScore: (
      state,
      action: PayloadAction<{ playerId: string; score: number }>
    ) => {
      const { playerId, score } = action.payload;
      if (!state.roundScores[playerId]) {
        state.roundScores[playerId] = [];
      }
      state.roundScores[playerId].push(score);
    },

    completeRound: (state) => {
      state.roundComplete = true;
      state.roundCount += 1;
    },

    nextRound: (state) => {
      state.currentRound += 1;
      state.roundComplete = false;
    },

    openScoreboard: (state) => {
      state.isScoreboardOpen = true;
    },

    closeScoreboard: (state) => {
      state.isScoreboardOpen = false;
    },

    resetGame: (state) => {
      return initialState;
    },
  },
});

export const {
  setPlayers,
  addRoundScore,
  completeRound,
  nextRound,
  openScoreboard,
  closeScoreboard,
  resetGame,
} = gameSlice.actions;

export default gameSlice.reducer;
