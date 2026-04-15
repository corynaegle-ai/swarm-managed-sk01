import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { openScoreboard } from '../store/slices/gameSlice';

/**
 * Custom hook that automatically opens the scoreboard after each round completes.
 * This satisfies the requirement to auto-show the scoreboard after round completion.
 */
const useScoreboardAutoShow = () => {
  const dispatch = useDispatch();
  const { roundComplete, roundCount } = useSelector((state: RootState) => ({
    roundComplete: state.game.roundComplete,
    roundCount: state.game.roundCount,
  }));

  useEffect(() => {
    // Automatically show scoreboard when a round completes
    if (roundComplete && roundCount > 0) {
      // Small delay to ensure UI state has updated
      const timer = setTimeout(() => {
        dispatch(openScoreboard());
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [roundComplete, roundCount, dispatch]);
};

export default useScoreboardAutoShow;
