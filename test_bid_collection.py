"""Tests for bid collection module."""

import pytest
from unittest.mock import patch
from io import StringIO
from bid_collection import BidCollector


class TestBidCollector:
    """Test cases for BidCollector class."""

    def setup_method(self):
        """Set up test fixtures before each test."""
        self.players = ["Alice", "Bob", "Charlie"]
        self.collector = BidCollector(self.players)

    def test_initialization(self):
        """Test BidCollector initialization."""
        assert self.collector.players == self.players
        assert self.collector.bids == {}
        assert self.collector.current_round == 0

    def test_display_round_info(self, capsys):
        """Test displaying round information (Criterion 1)."""
        self.collector.display_round_info(3)
        captured = capsys.readouterr()
        
        assert "ROUND 3" in captured.out
        assert "Hands in this round: 3" in captured.out
        assert self.collector.current_round == 3

    @patch('builtins.input', side_effect=['2', '1', '3'])
    def test_collect_bids_valid(self, mock_input, capsys):
        """Test collecting valid bids from all players (Criterion 2)."""
        self.collector.display_round_info(3)
        bids = self.collector.collect_bids()
        
        assert bids == {"Alice": 2, "Bob": 1, "Charlie": 3}
        assert len(bids) == 3
        captured = capsys.readouterr()
        assert "All bids collected successfully" in captured.out

    @patch('builtins.input', side_effect=['0', '0', '0'])
    def test_collect_bids_zero_bids(self, mock_input):
        """Test collecting zero bids (valid)."""
        self.collector.display_round_info(2)
        bids = self.collector.collect_bids()
        
        assert bids == {"Alice": 0, "Bob": 0, "Charlie": 0}

    @patch('builtins.input', side_effect=['4', '3', '4', '2', '1', '0'])
    def test_bid_validation_exceeds_round(self, mock_input, capsys):
        """Test bid validation rejects bids > round number (Criterion 3)."""
        self.collector.display_round_info(3)
        bids = self.collector.collect_bids()
        
        # First input (4) should fail, retry with valid input (3)
        # Second input (3) succeeds
        # Third input (4) should fail, retry with valid input (2)
        assert bids == {"Alice": 3, "Bob": 3, "Charlie": 2}
        captured = capsys.readouterr()
        assert "cannot exceed 3" in captured.out

    @patch('builtins.input', side_effect=['-1', '2', '1', '0'])
    def test_bid_validation_negative(self, mock_input, capsys):
        """Test bid validation rejects negative bids."""
        self.collector.display_round_info(2)
        bids = self.collector.collect_bids()
        
        # First input (-1) should fail, retry with valid input (2)
        assert bids["Alice"] == 2
        captured = capsys.readouterr()
        assert "cannot be negative" in captured.out

    @patch('builtins.input', side_effect=['abc', '2'])
    def test_bid_validation_non_integer(self, mock_input, capsys):
        """Test bid validation rejects non-integer input."""
        self.collector.display_round_info(2)
        # Only collect from Alice to keep test simple
        self.collector.players = ["Alice"]
        bids = self.collector.collect_bids()
        
        assert bids == {"Alice": 2}
        captured = capsys.readouterr()
        assert "valid integer" in captured.out

    @patch('builtins.input', side_effect=['1', '2', '3'])
    def test_validate_all_bids_collected(self, mock_input):
        """Test validation that all bids are collected (Criterion 4)."""
        self.collector.display_round_info(3)
        self.collector.collect_bids()
        
        assert self.collector.validate_all_bids_collected() is True

    def test_validate_missing_bids(self, capsys):
        """Test validation fails when bids are missing (Criterion 4)."""
        self.collector.display_round_info(3)
        # Manually set incomplete bids
        self.collector.bids = {"Alice": 1, "Bob": 2}
        
        assert self.collector.validate_all_bids_collected() is False
        captured = capsys.readouterr()
        assert "Missing bids" in captured.out
        assert "Charlie" in captured.out

    @patch('builtins.input', side_effect=['1', '2', '3'])
    def test_can_proceed_with_all_bids(self, mock_input):
        """Test can_proceed returns True when all bids collected."""
        self.collector.display_round_info(3)
        self.collector.collect_bids()
        
        assert self.collector.can_proceed() is True

    def test_can_proceed_without_all_bids(self):
        """Test can_proceed returns False when bids are incomplete (Criterion 4)."""
        self.collector.display_round_info(3)
        self.collector.bids = {"Alice": 1}  # Only one player
        
        assert self.collector.can_proceed() is False

    def test_get_bids(self):
        """Test get_bids returns a copy of current bids."""
        self.collector.bids = {"Alice": 1, "Bob": 2}
        bids_copy = self.collector.get_bids()
        
        assert bids_copy == {"Alice": 1, "Bob": 2}
        # Verify it's a copy, not the same object
        bids_copy["Alice"] = 999
        assert self.collector.bids["Alice"] == 1

    @patch('builtins.input', side_effect=['1', '2', '3'])
    def test_round_1_three_bids(self, mock_input):
        """Test bidding in round 1 with 1 hand (edge case)."""
        self.collector.display_round_info(1)
        bids = self.collector.collect_bids()
        
        assert bids == {"Alice": 1, "Bob": 2, "Charlie": 3}

    @patch('builtins.input', side_effect=['5', '4', '3', '5'])
    def test_round_5_valid_bids(self, mock_input):
        """Test bidding in round 5 with 5 hands."""
        self.collector.display_round_info(5)
        bids = self.collector.collect_bids()
        
        assert bids == {"Alice": 5, "Bob": 4, "Charlie": 3}
        assert all(bid <= 5 for bid in bids.values())
