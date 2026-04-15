"""Tests for bid collection system."""

import pytest
from unittest.mock import patch, MagicMock
from bid_collection import BidCollector


class TestBidCollector:
    """Test suite for BidCollector class."""

    def test_init(self):
        """Test BidCollector initialization."""
        players = ["Alice", "Bob", "Carol"]
        collector = BidCollector(players)

        assert collector.players == players
        assert collector.bids == {}
        assert collector.current_round is None

    @patch("builtins.input")
    @patch("builtins.print")
    def test_collect_bids_valid(self, mock_print, mock_input):
        """Test collecting valid bids from all players."""
        players = ["Alice", "Bob", "Carol"]
        collector = BidCollector(players)

        # Setup input: Alice bids 2, Bob bids 1, Carol bids 0
        mock_input.side_effect = ["2", "1", "0"]

        bids = collector.collect_bids(round_number=3)

        assert bids == {"Alice": 2, "Bob": 1, "Carol": 0}
        assert collector.current_round == 3

    @patch("builtins.input")
    @patch("builtins.print")
    def test_collect_bids_round_info_displayed(self, mock_print, mock_input):
        """Test that round information is displayed (Criterion 1)."""
        players = ["Alice", "Bob"]
        collector = BidCollector(players)

        mock_input.side_effect = ["1", "1"]

        collector.collect_bids(round_number=2)

        # Check that round number and hand count were displayed
        printed_output = " ".join([call[0][0] for call in mock_print.call_args_list])
        assert "Round 2" in printed_output
        assert "2" in printed_output  # Hand count

    @patch("builtins.input")
    @patch("builtins.print")
    def test_collect_bids_from_each_player_in_order(self, mock_print, mock_input):
        """Test that bids are collected from each player in order (Criterion 2)."""
        players = ["Alice", "Bob", "Carol"]
        collector = BidCollector(players)

        mock_input.side_effect = ["1", "2", "3"]

        bids = collector.collect_bids(round_number=3)

        # Verify bids were collected in the correct order
        assert list(bids.keys()) == players
        assert bids["Alice"] == 1
        assert bids["Bob"] == 2
        assert bids["Carol"] == 3

    @patch("builtins.input")
    @patch("builtins.print")
    def test_validate_bid_not_exceeding_round_number(self, mock_print, mock_input):
        """Test that bids cannot exceed round number (Criterion 3)."""
        players = ["Alice", "Bob"]
        collector = BidCollector(players)

        # Alice tries to bid 5 in round 3 (invalid), then bids 2 (valid)
        # Bob bids 1
        mock_input.side_effect = ["5", "2", "1"]

        bids = collector.collect_bids(round_number=3)

        assert bids["Alice"] == 2  # Valid bid after retry
        assert bids["Bob"] == 1

    @patch("builtins.input")
    @patch("builtins.print")
    def test_validate_bid_zero_allowed(self, mock_print, mock_input):
        """Test that zero bid is allowed."""
        players = ["Alice"]
        collector = BidCollector(players)

        mock_input.side_effect = ["0"]

        bids = collector.collect_bids(round_number=3)

        assert bids["Alice"] == 0

    @patch("builtins.input")
    @patch("builtins.print")
    def test_validate_bid_negative_not_allowed(self, mock_print, mock_input):
        """Test that negative bids are not allowed."""
        players = ["Alice"]
        collector = BidCollector(players)

        # Alice tries to bid -1 (invalid), then bids 1 (valid)
        mock_input.side_effect = ["-1", "1"]

        bids = collector.collect_bids(round_number=3)

        assert bids["Alice"] == 1

    @patch("builtins.input")
    @patch("builtins.print")
    def test_validate_non_numeric_input(self, mock_print, mock_input):
        """Test handling of non-numeric input."""
        players = ["Alice"]
        collector = BidCollector(players)

        # Alice enters invalid input, then valid
        mock_input.side_effect = ["abc", "1"]

        bids = collector.collect_bids(round_number=3)

        assert bids["Alice"] == 1

    @patch("builtins.input")
    @patch("builtins.print")
    def test_cannot_proceed_without_all_bids(self, mock_print, mock_input):
        """Test that all bids must be entered before proceeding (Criterion 4)."""
        players = ["Alice", "Bob", "Carol"]
        collector = BidCollector(players)

        # Simulate only getting 2 out of 3 bids somehow
        # (This is more of a logical test - in practice the loop ensures all bids)
        collector.bids = {"Alice": 1, "Bob": 2}  # Missing Carol

        # The collect_bids method should complete and include all players
        mock_input.side_effect = ["1", "2", "0"]
        bids = collector.collect_bids(round_number=3)

        assert len(bids) == len(players)
        assert all(player in bids for player in players)

    @patch("builtins.input")
    @patch("builtins.print")
    def test_get_bids(self, mock_print, mock_input):
        """Test retrieving collected bids."""
        players = ["Alice", "Bob"]
        collector = BidCollector(players)

        mock_input.side_effect = ["1", "2"]
        collector.collect_bids(round_number=2)

        bids = collector.get_bids()

        assert bids == {"Alice": 1, "Bob": 2}

    @patch("builtins.input")
    @patch("builtins.print")
    def test_get_bid_specific_player(self, mock_print, mock_input):
        """Test retrieving a specific player's bid."""
        players = ["Alice", "Bob"]
        collector = BidCollector(players)

        mock_input.side_effect = ["1", "2"]
        collector.collect_bids(round_number=2)

        assert collector.get_bid("Alice") == 1
        assert collector.get_bid("Bob") == 2

    @patch("builtins.input")
    @patch("builtins.print")
    def test_get_bid_nonexistent_player(self, mock_print, mock_input):
        """Test retrieving bid for non-existent player returns None."""
        players = ["Alice"]
        collector = BidCollector(players)

        mock_input.side_effect = ["1"]
        collector.collect_bids(round_number=2)

        assert collector.get_bid("NonExistent") is None

    @patch("builtins.input")
    @patch("builtins.print")
    def test_bid_equals_round_number_allowed(self, mock_print, mock_input):
        """Test that bidding exactly the round number is allowed."""
        players = ["Alice"]
        collector = BidCollector(players)

        mock_input.side_effect = ["5"]  # Round 5, bid 5

        bids = collector.collect_bids(round_number=5)

        assert bids["Alice"] == 5

    @patch("builtins.input")
    @patch("builtins.print")
    def test_round_1_with_valid_bid(self, mock_print, mock_input):
        """Test round 1 (1 hand) with valid bids."""
        players = ["Alice", "Bob"]
        collector = BidCollector(players)

        # In round 1, max bid is 1
        mock_input.side_effect = ["0", "1"]

        bids = collector.collect_bids(round_number=1)

        assert bids == {"Alice": 0, "Bob": 1}

    @patch("builtins.input")
    @patch("builtins.print")
    def test_round_1_invalid_bid_exceeds_limit(self, mock_print, mock_input):
        """Test that round 1 does not allow bid > 1."""
        players = ["Alice"]
        collector = BidCollector(players)

        # In round 1, max bid is 1. Try bidding 2, then 1.
        mock_input.side_effect = ["2", "1"]

        bids = collector.collect_bids(round_number=1)

        assert bids["Alice"] == 1

    def test_get_bids_returns_copy(self):
        """Test that get_bids returns a copy (defensive programming)."""
        players = ["Alice", "Bob"]
        collector = BidCollector(players)
        collector.bids = {"Alice": 1, "Bob": 2}

        bids1 = collector.get_bids()
        bids2 = collector.get_bids()

        # Modifying one copy shouldn't affect the other
        bids1["Alice"] = 999
        assert bids2["Alice"] == 1
        assert collector.get_bid("Alice") == 1
