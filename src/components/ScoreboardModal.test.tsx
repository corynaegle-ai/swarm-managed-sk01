import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ScoreboardModal from './ScoreboardModal';
import gameReducer from '../store/slices/gameSlice';

const createMockStore = (initialState: any) => {
  return configureStore({
    reducer: {
      game: gameReducer,
    },
    preloadedState: initialState,
  });
};

describe('ScoreboardModal', () => {
  it('displays all players with their scores', () => {
    const mockState = {
      game: {
        players: [
          { id: '1', name: 'Blackbeard' },
          { id: '2', name: 'Captain Kidd' },
        ],
        currentRound: 2,
        roundScores: {
          '1': [10, 15],
          '2': [12, 8],
        },
        isScoreboardOpen: true,
        roundComplete: false,
        roundCount: 0,
      },
    };

    const store = createMockStore(mockState);
    render(
      <Provider store={store}>
        <ScoreboardModal />
      </Provider>
    );

    expect(screen.getByText('Blackbeard')).toBeInTheDocument();
    expect(screen.getByText('Captain Kidd')).toBeInTheDocument();
  });

  it('sorts players by total score in descending order', () => {
    const mockState = {
      game: {
        players: [
          { id: '1', name: 'Player One' },
          { id: '2', name: 'Player Two' },
          { id: '3', name: 'Player Three' },
        ],
        currentRound: 1,
        roundScores: {
          '1': [10],
          '2': [50],
          '3': [30],
        },
        isScoreboardOpen: true,
        roundComplete: false,
        roundCount: 0,
      },
    };

    const store = createMockStore(mockState);
    render(
      <Provider store={store}>
        <ScoreboardModal />
      </Provider>
    );

    const rows = screen.getAllByRole('row');
    // First row is header, second row should be highest scorer
    expect(rows[1]).toHaveTextContent('Player Two');
  });

  it('highlights the current round', () => {
    const mockState = {
      game: {
        players: [{ id: '1', name: 'Test Player' }],
        currentRound: 2,
        roundScores: {
          '1': [10, 20],
        },
        isScoreboardOpen: true,
        roundComplete: false,
        roundCount: 0,
      },
    };

    const store = createMockStore(mockState);
    const { container } = render(
      <Provider store={store}>
        <ScoreboardModal />
      </Provider>
    );

    const currentRoundColumns = container.querySelectorAll('.round-col.current-round');
    expect(currentRoundColumns.length).toBeGreaterThan(0);
  });

  it('does not render when scoreboard is closed', () => {
    const mockState = {
      game: {
        players: [{ id: '1', name: 'Test' }],
        currentRound: 1,
        roundScores: { '1': [10] },
        isScoreboardOpen: false,
        roundComplete: false,
        roundCount: 0,
      },
    };

    const store = createMockStore(mockState);
    const { container } = render(
      <Provider store={store}>
        <ScoreboardModal />
      </Provider>
    );

    expect(container.querySelector('.scoreboard-modal')).not.toBeInTheDocument();
  });

  it('has pirate-themed styling with proper ARIA labels', () => {
    const mockState = {
      game: {
        players: [{ id: '1', name: 'Pirate' }],
        currentRound: 1,
        roundScores: { '1': [10] },
        isScoreboardOpen: true,
        roundComplete: false,
        roundCount: 0,
      },
    };

    const store = createMockStore(mockState);
    const { container } = render(
      <Provider store={store}>
        <ScoreboardModal />
      </Provider>
    );

    const modal = container.querySelector('[role="dialog"]');
    expect(modal).toHaveAttribute('aria-modal', 'true');
    expect(modal).toHaveAttribute('aria-labelledby', 'scoreboard-title');

    const title = screen.getByText(/Current Standings/);
    expect(title).toHaveClass('scoreboard-title');
  });
});
