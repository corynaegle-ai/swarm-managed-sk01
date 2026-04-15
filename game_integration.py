"""Integration point for bid collection in the game flow."""

from bid_collection import BidCollector


class GameRound:
    """Manages a single round of the game including bid collection."""

    def __init__(self, players, round_number):
        """
        Initialize a game round.

        Args:
            players: List of player names
            round_number: The round number (1-indexed)
        """
        self.players = players
        self.round_number = round_number
        self.bid_collector = BidCollector(players)
        self.bids = None

    def collect_bids(self):
        """
        Collect bids from all players for this round.

        Returns:
            dict: Dictionary mapping player names to their bids
        """
        self.bids = self.bid_collector.collect_bids(self.round_number)
        return self.bids

    def get_bids(self):
        """
        Get the collected bids for this round.

        Returns:
            dict: Dictionary mapping player names to their bids
        """
        return self.bid_collector.get_bids()

    def get_bid(self, player_name):
        """
        Get a specific player's bid for this round.

        Args:
            player_name: Name of the player

        Returns:
            int: The player's bid, or None if not collected
        """
        return self.bid_collector.get_bid(player_name)
