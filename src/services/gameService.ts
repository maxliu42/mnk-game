/**
 * Game Service
 * This module provides services for game operations like saving/loading games
 */

import { BoardSize, GridType, PlayerConfig } from '../types/game.types';

/**
 * Interface for saved game data
 */
interface SavedGame {
  id: string;
  name: string;
  date: string;
  board: (number | null)[][];
  currentPlayer: number;
  playerConfigs: PlayerConfig[];
  boardSize: BoardSize;
  winLength: number;
  gridType: GridType;
}

/**
 * Save a game to local storage
 */
export const saveGame = (gameData: Omit<SavedGame, 'id' | 'date'>) => {
  try {
    // Get existing saved games
    const savedGamesJson = localStorage.getItem('mnk-saved-games');
    const savedGames: SavedGame[] = savedGamesJson ? JSON.parse(savedGamesJson) : [];
    
    // Create a new saved game entry
    const newSavedGame: SavedGame = {
      ...gameData,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    
    // Add to saved games and store back in localStorage
    savedGames.push(newSavedGame);
    localStorage.setItem('mnk-saved-games', JSON.stringify(savedGames));
    
    return newSavedGame.id;
  } catch (error) {
    console.error('Error saving game:', error);
    return null;
  }
};

/**
 * Load all saved games from local storage
 */
export const loadSavedGames = (): SavedGame[] => {
  try {
    const savedGamesJson = localStorage.getItem('mnk-saved-games');
    return savedGamesJson ? JSON.parse(savedGamesJson) : [];
  } catch (error) {
    console.error('Error loading saved games:', error);
    return [];
  }
};

/**
 * Load a specific saved game by ID
 */
export const loadGame = (gameId: string): SavedGame | null => {
  try {
    const savedGames = loadSavedGames();
    return savedGames.find(game => game.id === gameId) || null;
  } catch (error) {
    console.error('Error loading game:', error);
    return null;
  }
};

/**
 * Delete a saved game
 */
export const deleteGame = (gameId: string): boolean => {
  try {
    const savedGames = loadSavedGames();
    const filteredGames = savedGames.filter(game => game.id !== gameId);
    localStorage.setItem('mnk-saved-games', JSON.stringify(filteredGames));
    return true;
  } catch (error) {
    console.error('Error deleting game:', error);
    return false;
  }
}; 