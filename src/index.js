// Data Migration Strategy Game - Main Entry Point
import Phaser from 'phaser';
import StartScene from './scenes/StartScene';
import StrategyScene from './scenes/StrategyScene';
import ObjectsScene from './scenes/ObjectsScene';
import TeamSizingScene from './scenes/TeamSizingScene';
import ResultsScene from './scenes/ResultsScene';
import './styles/game.css';

const gameConfig = {
  type: Phaser.AUTO,
  parent: 'gameContainer',
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    expandParent: true,
    fullscreenTarget: 'parent'
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
  backgroundColor: '#2c3e50'
};

// Create the game
const game = new Phaser.Game(gameConfig);
