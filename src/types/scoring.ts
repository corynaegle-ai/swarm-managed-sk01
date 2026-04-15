/**
 * Scoring types for bid games
 */

export interface PlayerBid {
  playerId: string;
  playerName: string;
  bid: number;
  bidCorrect: boolean;
}

export interface BonusPoints {
  playerId: string;
  bonusAmount: number;
}

export interface PlayerScore {
  playerId: string;
  playerName: string;
  bid: number;
  bidCorrect: boolean;
  bonusPoints: number;
  totalScore: number;
}

export interface ScoringState {
  bids: PlayerBid[];
  bonuses: BonusPoints[];
  scores: PlayerScore[];
}
