# Scorekeeper Application

A game scorekeeper application that manages players and scoring.

## Features

### Player Setup (TKT-E7F93C4C)
- Add 2-8 players with unique names
- Automatic unique ID generation for each player
- Enforce minimum (2) and maximum (8) player constraints
- Display players in setup order
- Validation for game start readiness

## Installation

```bash
npm install
```

## Usage

```javascript
const { PlayerManager } = require('./src');

// Create a new game setup
const manager = new PlayerManager();

// Add players
manager.addPlayer('Alice');
manager.addPlayer('Bob');
manager.addPlayer('Charlie');

// Check if game can start
if (manager.canStartGame()) {
  console.log('Game is ready to start!');
}

// Get all players in setup order
const players = manager.getPlayers();
players.forEach(player => {
  console.log(`${player.getId()}: ${player.getName()}`);
});
```

## API

### PlayerManager

#### Methods

- `addPlayer(name: string): Player` - Add a new player (throws if validation fails)
- `getPlayers(): Player[]` - Get all players in setup order
- `getPlayerCount(): number` - Get the number of players
- `canStartGame(): boolean` - Check if game can start (2-8 players)
- `getPlayerById(playerId: string): Player|null` - Get a specific player by ID
- `removePlayer(playerId: string): boolean` - Remove a player
- `reset(): void` - Clear all players and reset
- `toJSON(): Object[]` - Get JSON representation of all players

### Player

#### Methods

- `getId(): string` - Get the player's unique ID
- `getName(): string` - Get the player's name
- `toJSON(): Object` - Get JSON representation of the player

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Architecture

The application follows a clean separation of concerns:

- **Models** (`src/models/`) - Data models (Player)
- **Managers** (`src/managers/`) - Business logic (PlayerManager)
- **Tests** (`test/`) - Unit tests for all components

## Acceptance Criteria

✅ AC1: Can add 2-8 players with names
✅ AC2: Cannot start game with less than 2 players  
✅ AC3: Cannot add more than 8 players
✅ AC4: Player names are displayed in setup order
