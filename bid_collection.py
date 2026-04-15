"""Bid collection system for card game rounds."""


class BidCollector:
    """Collects and validates bids from players before each round."""

    def __init__(self, players):
        """
        Initialize the bid collector.

        Args:
            players: List of player names
        """
        self.players = players
        self.bids = {}
        self.current_round = None

    def collect_bids(self, round_number):
        """
        Collect bids from all players for the current round.

        The round number also represents the number of hands/tricks in that round.

        Args:
            round_number: The current round number (1-indexed)

        Returns:
            dict: Dictionary mapping player names to their bids

        Raises:
            ValueError: If bids are invalid or incomplete
        """
        self.current_round = round_number
        self.bids = {}

        # Display round information (Criterion 1)
        self._display_round_info()

        # Collect bids from each player in order (Criterion 2)
        for player in self.players:
            bid = self._get_bid_from_player(player, round_number)
            self.bids[player] = bid

        # Criterion 4: Verify all bids entered
        if len(self.bids) != len(self.players):
            raise ValueError(
                f"Cannot proceed: Missing bids from {len(self.players) - len(self.bids)} player(s)"
            )

        return self.bids

    def _display_round_info(self):
        """Display current round number and hand count."""
        print(f"\n=== Round {self.current_round} ===")
        print(f"Number of hands in this round: {self.current_round}")
        print()

    def _get_bid_from_player(self, player_name, round_number):
        """
        Get a valid bid from a player.

        Args:
            player_name: Name of the player
            round_number: The current round number (max bid allowed)

        Returns:
            int: The player's valid bid

        Raises:
            ValueError: If bid is invalid
        """
        max_bid = round_number

        while True:
            try:
                bid_input = input(
                    f"{player_name}, enter your bid (0-{max_bid}): "
                ).strip()

                # Parse the bid
                bid = int(bid_input)

                # Validate bid (Criterion 3: bid <= round number)
                if bid < 0:
                    print(f"Error: Bid cannot be negative. Please try again.")
                    continue

                if bid > max_bid:
                    print(
                        f"Error: Bid cannot exceed {max_bid} (number of hands in this round). "
                        f"Please try again."
                    )
                    continue

                return bid

            except ValueError:
                print("Error: Please enter a valid number.")
                continue

    def get_bids(self):
        """Get the collected bids.

        Returns:
            dict: Dictionary mapping player names to their bids
        """
        return self.bids.copy()

    def get_bid(self, player_name):
        """Get a specific player's bid.

        Args:
            player_name: Name of the player

        Returns:
            int: The player's bid, or None if not collected
        """
        return self.bids.get(player_name)
