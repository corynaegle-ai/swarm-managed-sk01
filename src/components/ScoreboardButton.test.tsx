import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ScoreboardButton from './ScoreboardButton';
import gameReducer from '../store/slices/gameSlice';

const createMockStore = () => {
  return configureStore({
    reducer: {
      game: gameReducer,
    },
    preloadedState: {
      game: {
        players: [],
        currentRound: 1,
        roundScores: {},
        isScoreboardOpen: false,
        roundComplete: false,
        roundCount: 0,
      },
    },
  });
};

describe('ScoreboardButton', () => {
  it('renders the button with proper label', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <ScoreboardButton />
      </Provider>
    );

    const button = screen.getByRole('button', { name: /View scoreboard and current standings/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('⚓ Standings');
  });

  it('opens scoreboard when clicked', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <ScoreboardButton />
      </Provider>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Verify the state was updated
    const state = store.getState();
    expect(state.game.isScoreboardOpen).toBe(true);
  });

  it('has accessibility features', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <ScoreboardButton />
      </Provider>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label');
    expect(button).toHaveAttribute('title');
  });

  it('accepts custom className', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <ScoreboardButton className="custom-class" />
      </Provider>
    );

    const button = container.querySelector('.custom-class');
    expect(button).toBeInTheDocument();
  });
});
