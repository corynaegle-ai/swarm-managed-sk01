import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Scoreboard from '../Scoreboard.vue';
import { scoreboardService } from '@/services/ScoreboardService';

describe('Scoreboard.vue', () => {
  let wrapper;
  const mockPlayers = [
    {
      id: 1,
      name: 'Blackbeard',
      roundScores: [10, 15, 20],
      totalScore: 45
    },
    {
      id: 2,
      name: 'Captain Hook',
      roundScores: [12, 18, 25],
      totalScore: 55
    },
    {
      id: 3,
      name: 'Davy Jones',
      roundScores: [8, 10, 15],
      totalScore: 33
    }
  ];

  beforeEach(() => {
    wrapper = mount(Scoreboard, {
      props: {
        players: mockPlayers,
        currentRound: 3,
        autoShow: false
      }
    });
  });

  describe('Rendering', () => {
    it('renders the scoreboard wrapper when visible', async () => {
      wrapper.vm.isVisible = true;
      await wrapper.vm.$nextTick();
      
      expect(wrapper.find('.scoreboard-wrapper').exists()).toBe(true);
    });

    it('does not render the scoreboard wrapper when hidden', () => {
      expect(wrapper.find('.scoreboard-wrapper').exists()).toBe(false);
    });

    it('renders the scoreboard title', async () => {
      wrapper.vm.isVisible = true;
      await wrapper.vm.$nextTick();
      
      const title = wrapper.find('.scoreboard-title');
      expect(title.exists()).toBe(true);
      expect(title.text()).toContain('CURRENT STANDINGS');
    });
  });

  describe('Player Display', () => {
    beforeEach(async () => {
      wrapper.vm.isVisible = true;
      await wrapper.vm.$nextTick();
    });

    it('displays all players in the table', () => {
      const playerRows = wrapper.findAll('.player-row');
      expect(playerRows).toHaveLength(3);
    });

    it('displays player names correctly', () => {
      const playerNames = wrapper.findAll('.player-name');
      expect(playerNames[0].text()).toBe('Captain Hook'); // First in sorted order
      expect(playerNames[1].text()).toBe('Blackbeard');
      expect(playerNames[2].text()).toBe('Davy Jones');
    });

    it('displays total scores correctly', () => {
      const totalScores = wrapper.findAll('.total-score');
      expect(totalScores[0].text()).toBe('55'); // Highest score
      expect(totalScores[1].text()).toBe('45');
      expect(totalScores[2].text()).toBe('33');
    });
  });

  describe('Sorting', () => {
    it('sorts players by total score in descending order', () => {
      const sortedPlayers = wrapper.vm.sortedPlayers;
      
      expect(sortedPlayers[0].totalScore).toBe(55); // Captain Hook
      expect(sortedPlayers[1].totalScore).toBe(45); // Blackbeard
      expect(sortedPlayers[2].totalScore).toBe(33); // Davy Jones
    });

    it('maintains sort order with updated scores', async () => {
      const updatedPlayers = [
        { ...mockPlayers[0], totalScore: 100 },
        { ...mockPlayers[1], totalScore: 50 },
        { ...mockPlayers[2], totalScore: 30 }
      ];

      await wrapper.setProps({ players: updatedPlayers });
      
      const sortedPlayers = wrapper.vm.sortedPlayers;
      expect(sortedPlayers[0].totalScore).toBe(100);
    });
  });

  describe('Round Scores', () => {
    beforeEach(async () => {
      wrapper.vm.isVisible = true;
      await wrapper.vm.$nextTick();
    });

    it('displays round-by-round scores for each player', () => {
      const roundScores = wrapper.findAll('.round-score');
      expect(roundScores.length).toBeGreaterThan(0);
    });

    it('highlights current round scores', async () => {
      const currentRoundScores = wrapper.findAll('.current-round-score');
      expect(currentRoundScores.length).toBeGreaterThan(0);
    });

    it('displays correct round indicator', () => {
      const roundIndicator = wrapper.find('.round-text');
      expect(roundIndicator.text()).toContain('CURRENT ROUND: 3');
    });
  });

  describe('Auto Show', () => {
    it('shows scoreboard when autoShow prop is true', async () => {
      const newWrapper = mount(Scoreboard, {
        props: {
          players: mockPlayers,
          currentRound: 3,
          autoShow: true
        }
      });

      await newWrapper.vm.$nextTick();
      expect(newWrapper.vm.isVisible).toBe(true);
    });

    it('shows scoreboard when autoShow prop changes to true', async () => {
      await wrapper.setProps({ autoShow: true });
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.isVisible).toBe(true);
    });
  });

  describe('User Interactions', () => {
    beforeEach(async () => {
      wrapper.vm.isVisible = true;
      await wrapper.vm.$nextTick();
    });

    it('closes scoreboard when close button is clicked', async () => {
      const closeBtn = wrapper.find('.scoreboard-close-btn');
      await closeBtn.trigger('click');
      
      expect(wrapper.vm.isVisible).toBe(false);
    });

    it('emits scoreboard-shown event when opened', async () => {
      wrapper.vm.isVisible = false;
      await wrapper.vm.$nextTick();
      
      wrapper.vm.showScoreboard();
      await wrapper.vm.$nextTick();
      
      expect(wrapper.emitted('scoreboard-shown')).toBeTruthy();
    });

    it('emits scoreboard-closed event when closed', async () => {
      wrapper.vm.closeScoreboard();
      await wrapper.vm.$nextTick();
      
      expect(wrapper.emitted('scoreboard-closed')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    beforeEach(async () => {
      wrapper.vm.isVisible = true;
      await wrapper.vm.$nextTick();
    });

    it('has proper ARIA labels', () => {
      expect(wrapper.find('[role="main"]').exists()).toBe(true);
      expect(wrapper.find('[role="table"]').exists()).toBe(true);
    });

    it('has proper table semantics', () => {
      const headers = wrapper.findAll('[scope="col"]');
      expect(headers.length).toBeGreaterThan(0);
    });

    it('has accessible close button', () => {
      const closeBtn = wrapper.find('.scoreboard-close-btn');
      expect(closeBtn.attributes('aria-label')).toBe('Close scoreboard');
    });
  });

  describe('Highlighting', () => {
    beforeEach(async () => {
      wrapper.vm.isVisible = true;
      await wrapper.vm.$nextTick();
    });

    it('highlights the first-place player', () => {
      const firstPlayerRow = wrapper.find('.player-row');
      expect(firstPlayerRow.classes()).toContain('highlight');
    });

    it('marks current round results', () => {
      const playerRows = wrapper.findAll('.player-row');
      // At least some rows should have current-round class if they scored in current round
      const hasCurrentRound = playerRows.some(row => 
        row.classes().includes('current-round')
      );
      expect(hasCurrentRound).toBe(true);
    });
  });
});
