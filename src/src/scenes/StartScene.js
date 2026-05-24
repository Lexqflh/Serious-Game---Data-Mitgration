import Phaser from 'phaser';
import { LEARNING_OBJECTIVES } from '../config';

export default class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StartScene' });
  }

  create() {
    // Set background gradient with Accenture colors
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillGradientStyle(0x9B1D20, 0x9B1D20, 0x00A3E0, 0x00A3E0, 1);
    graphics.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
    graphics.generateTexture('gradientBg', this.cameras.main.width, this.cameras.main.height);
    graphics.destroy();

    this.add.image(0, 0, 'gradientBg').setOrigin(0, 0);

    // Determine layout based on screen size
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const isMobile = width < 768;
    const contentWidth = isMobile ? width - 40 : Math.min(800, width - 80);
    const centerX = width / 2;

    // Title with improved visibility
    this.add.text(centerX, isMobile ? 40 : 60, 'Data Migration Strategy Simulator', {
      fontSize: isMobile ? '32px' : '48px',
      fontFamily: 'Arial, sans-serif',
      color: '#FFFFFF',
      fontStyle: 'bold',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5, 0);

    // Subtitle
    this.add.text(centerX, isMobile ? 90 : 130, 'Learn strategic decision-making in enterprise data migrations', {
      fontSize: isMobile ? '14px' : '18px',
      fontFamily: 'Arial, sans-serif',
      color: '#ecf0f1',
      align: 'center',
      wordWrap: { width: contentWidth }
    }).setOrigin(0.5, 0);

    // Learning Objectives Section
    const objectiveStartY = isMobile ? 150 : 220;

    this.add.text(centerX, objectiveStartY, 'Learning Objectives', {
      fontSize: isMobile ? '20px' : '24px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      fontStyle: 'bold',
      align: 'center'
    }).setOrigin(0.5, 0);

    // Objective cards
    const cardStartY = objectiveStartY + 50;
    const cardSpacing = isMobile ? 100 : 90;

    LEARNING_OBJECTIVES.forEach((objective, index) => {
      const cardY = cardStartY + (index * cardSpacing);

      // Card background
      const cardBg = this.add.rectangle(centerX, cardY + 25, contentWidth - 20, 70, 0x2c3e50, 0.9);
      cardBg.setStrokeStyle(2, 0xecf0f1);

      // Objective number
      this.add.text(centerX - (contentWidth - 20) / 2 + 15, cardY, `${index + 1}`, {
        fontSize: isMobile ? '18px' : '20px',
        fontFamily: 'Arial, sans-serif',
        color: '#667eea',
        fontStyle: 'bold'
      }).setOrigin(0, 0);

      // Objective text
      this.add.text(centerX - (contentWidth - 20) / 2 + 45, cardY, objective, {
        fontSize: isMobile ? '13px' : '15px',
        fontFamily: 'Arial, sans-serif',
        color: '#ecf0f1',
        wordWrap: { width: contentWidth - 75 },
        align: 'left'
      }).setOrigin(0, 0);
    });

    // Start button positioning
    const buttonY = cardStartY + (LEARNING_OBJECTIVES.length * cardSpacing) + 40;

    // Start Game button
    const startButton = this.add.rectangle(centerX, buttonY, 200, 50, 0xffffff);
    startButton.setInteractive({ useHandCursor: true });

    const buttonText = this.add.text(centerX, buttonY, 'Start Game', {
      fontSize: '18px',
      fontFamily: 'Arial, sans-serif',
      color: '#667eea',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);

    // Button hover effects
    startButton.on('pointerover', () => {
      startButton.setFillStyle(0xecf0f1);
      buttonText.setColor('#667eea');
      this.input.setDefaultCursor('pointer');
    });

    startButton.on('pointerout', () => {
      startButton.setFillStyle(0xffffff);
      buttonText.setColor('#667eea');
      this.input.setDefaultCursor('default');
    });

    // Button click handler
    startButton.on('pointerdown', () => {
      // Initialize game state
      const gameState = {
        testingEffort: 'medium',
        cleaningEffort: 'high',
        juniorRatio: 0.15,
        offshorePolicy: 'partial',
        objectTools: {},
        teamSizing: {
          design: { it: 2, functional: 2 },
          build: { it: 3, functional: 3 },
          cutover: { it: 2, functional: 2 }
        },
        results: null
      };

      this.scene.start('StrategyScene', { gameState });
    });

    // Footer
    this.add.text(centerX, height - 20, '© 2026 Migration Academy | Enterprise Data Strategy', {
      fontSize: '12px',
      fontFamily: 'Arial, sans-serif',
      color: '#bdc3c7',
      align: 'center'
    }).setOrigin(0.5, 0.5);
  }
}
