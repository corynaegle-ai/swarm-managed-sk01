import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import useScoreboardAutoShow from './useScoreboardAutoShow';
import gameReducer, { completeRound } from '../store/slices/gameSlice';

const createMockStore = (initialState: any) => {
  return configureStore({
    reducer: {
      game: gameReducer,
    },
    preloadedState: initialState,
  });
};

describe('useScoreboardAutoShow', () => {
  it('dispatches openScoreboard when round completes', (done) => {
    const mockState = {
      game: {
        players: [],
        currentRound: 1,
        roundScores: {},
        isScoreboardOpen: false,
        roundComplete: true,
        roundCount: 1,
      },
    };

    const store = createMockStore(mockState);
    const wrapper = ({ children }: any) => <Provider store={store}>{children}</Provider>;

    renderHook(() => useScoreboardAutoShow(), { wrapper });

    // Wait for the setTimeout to resolve
    setTimeout(() => {
      const state = store.getState();
      expect(state.game.isScoreboardOpen).toBe(true);
      done();
    }, 600);
  });

  it('does not show scoreboard when round is not complete', () => {
    const mockState = {
      game: {
        players: [],
        currentRound: 1,
        roundScores: {},
        isScoreboardOpen: false,
        roundComplete: false,
        roundCount: 0,
      },
    };

    const store = createMockStore(mockState);
    const wrapper = ({ children }: any) => <Provider store={store}>{children}</Provider>;

    renderHook(() => useScoreboardAutoShow(), { wrapper });

    const state = store.getState();
    expect(state.game.isScoreboardOpen).toBe(false);
  });
});
