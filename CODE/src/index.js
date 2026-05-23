// Data Migration Strategy Game - Main Entry Point
import Phaser from 'phaser';
import StartScene from './scenes/StartScene';
import StrategyScene from './scenes/StrategyScene';
import ObjectsScene from './scenes/ObjectsScene';
import TeamSizingScene from './scenes/TeamSizingScene';
import ResultsScene from './scenes/ResultsScene';
import '../styles/game.css';

const gameConfig = {
  type: Phaser.AUTO,
  parent: 'gameContainer',
  width: 1200,
  height: 800,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: { width: 480, height: 360 },
    max: { width: 1920, height: 1440 }
  },
  physics: {
    default: 'arcade',
    arcade: { debug: false }
  },
  scene: [
    StartScene,
    StrategyScene,
    ObjectsScene,
    TeamSizingScene,
    ResultsScene
  ],
  backgroundColor: '#f5f5f5'
};

// Create the game
const game = new Phaser.Game(gameConfig);
