"""Bid collection module for card game rounds.

Handles collecting and validating bids from all players before each round.
"""

from typing import List, Dict


class BidCollector:
    """Manages bid collection and validation for game rounds."""

    def __init__(self, players: List[str]):
        """Initialize bid collector with list of players.
        
        Args:
            players: List of player names in order of play.
        """
        self.players = players
        self.bids: Dict[str, int] = {}
        self.current_round = 0

    def display_round_info(self, round_number: int) -> None:
        """Display current round number and hand count.
        
        Args:
            round_number: The current round number (also equals hand count).
        """
        self.current_round = round_number
        print(f"\n=== ROUND {round_number} ===")
        print(f"Hands in this round: {round_number}")
        print(f"Players: {', '.join(self.players)}")
        print()

    def collect_bids(self) -> Dict[str, int]:
        """Collect bids from each player in order.
        
        Returns:
            Dictionary mapping player names to their bids.
            
        Raises:
            ValueError: If a bid exceeds the round number or invalid input is provided.
        """
        self.bids = {}
        
        for player in self.players:
            bid = self._get_valid_bid(player)
            self.bids[player] = bid
        
        print("All bids collected successfully!\n")
        return self.bids

    def _get_valid_bid(self, player: str) -> int:
        """Get a valid bid from a player.
        
        Args:
            player: The player name.
            
        Returns:
            Valid bid amount (0 <= bid <= round_number).
            
        Raises:
            ValueError: If bid is invalid.
        """
        while True:
            try:
                bid_input = input(f"{player}'s bid (0-{self.current_round}): ").strip()
                bid = int(bid_input)
                
                if bid < 0:
                    print(f"Error: Bid cannot be negative. Please enter a value >= 0.")
                    continue
                
                if bid > self.current_round:
                    print(f"Error: Bid cannot exceed {self.current_round} hands in this round.")
                    continue
                
                return bid
            
            except ValueError:
                print(f"Error: Please enter a valid integer.")

    def validate_all_bids_collected(self) -> bool:
        """Verify that all players have submitted bids.
        
        Returns:
            True if all bids collected, False otherwise.
        """
        if len(self.bids) != len(self.players):
            missing_players = [p for p in self.players if p not in self.bids]
            print(f"Error: Missing bids from: {', '.join(missing_players)}")
            return False
        return True

    def get_bids(self) -> Dict[str, int]:
        """Get the current bids dictionary.
        
        Returns:
            Dictionary of player bids.
        """
        return self.bids.copy()

    def can_proceed(self) -> bool:
        """Check if bidding is complete and we can proceed to the round.
        
        Returns:
            True if all bids collected and valid, False otherwise.
        """
        return self.validate_all_bids_collected() and len(self.bids) == len(self.players)
