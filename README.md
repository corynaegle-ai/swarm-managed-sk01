# Bid Collection System

A bid collection module for card game rounds (e.g., wizard/skull king games).

## Overview

Before each round, players must submit bids indicating how many tricks/hands they expect to win. This module handles the collection, validation, and storage of these bids.

## Features

- **Round Information Display**: Shows the current round number and the number of hands/tricks in that round
- **Sequential Bid Collection**: Collects bids from each player in the specified order
- **Bid Validation**: Ensures no player bids more than the number of hands in the round
- **Error Handling**: Provides clear error messages for invalid bids and re-prompts players
- **All Bids Required**: Cannot proceed to the next phase until all players have submitted valid bids

## Usage

### Basic Usage

```python
from bid_collection import BidCollector

players = ["Alice", "Bob", "Carol"]
collector = BidCollector(players)

# Collect bids for round 3 (max bid = 3)
bids = collector.collect_bids(round_number=3)

# bids = {"Alice": 2, "Bob": 1, "Carol": 0}
```

### Game Integration

```python
from game_integration import GameRound

players = ["Alice", "Bob", "Carol"]
game_round = GameRound(players, round_number=3)

# Collect bids for the round
bids = game_round.collect_bids()

# Get bids later
all_bids = game_round.get_bids()
alice_bid = game_round.get_bid("Alice")
```

## Acceptance Criteria

All acceptance criteria are satisfied:

1. **Display current round number and hand count**
   - Round information is displayed at the start of bid collection
   - Format: "=== Round {number} ==="
   - Hand count equals the round number

2. **Collect bid from each player in order**
   - Bids are collected sequentially from each player
   - Players are prompted in the order they appear in the players list
   - Uses interactive input prompts

3. **Validate bid <= round number**
   - Bids must be non-negative integers
   - Bids cannot exceed the round number
   - Invalid bids result in error messages and re-prompts

4. **Cannot proceed without all bids entered**
   - The collection loop continues until all players have submitted valid bids
   - A final validation ensures all players are represented in the bids dictionary

## File Structure

- `bid_collection.py`: Core BidCollector class
- `game_integration.py`: GameRound class for game integration
- `test_bid_collection.py`: Comprehensive test suite
- `README.md`: This file

## Testing

Run the test suite:

```bash
pytest test_bid_collection.py -v
```

Tests cover:
- Valid bid collection
- Round information display
- Sequential collection from all players
- Bid validation (max, min, type checking)
- Error handling for invalid input
- Edge cases (round 1, max bid = round number, etc.)
