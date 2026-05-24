import Phaser from 'phaser';
import { LEARNING_OBJECTIVES } from '../config';

export default class StrategyScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StrategyScene' });
    this.kpiUpdateTimer = null;
  }

  init(data) {
    this.gameState = data.gameState || {
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
  }

  create() {
    // Background
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillGradientStyle(0xecf0f1, 0xecf0f1, 0xf8f9fa, 0xf8f9fa, 1);
    graphics.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
    graphics.generateTexture('bgLight', this.cameras.main.width, this.cameras.main.height);
    graphics.destroy();

    this.add.image(0, 0, 'bgLight').setOrigin(0, 0);

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const isMobile = width < 768;
    const contentWidth = isMobile ? width - 40 : 600;
    const sidebarWidth = isMobile ? 0 : 280;

    // Title
    this.add.text(isMobile ? 20 : 40, 20, '1. Set Strategic Parameters', {
      fontSize: isMobile ? '24px' : '32px',
      fontFamily: 'Arial, sans-serif',
      color: '#2c3e50',
      fontStyle: 'bold'
    }).setOrigin(0, 0);

    const contentStartX = isMobile ? 20 : 40;
    const contentStartY = 80;
    const sectionSpacing = 110;

    // Testing Effort Section
    this.createParameterSection(
      contentStartX, contentStartY, 'Testing Effort',
      ['Low', 'Medium', 'High'],
      this.gameState.testingEffort,
      'testingEffort',
      contentWidth
    );

    // Cleaning Effort Section
    this.createParameterSection(
      contentStartX, contentStartY + sectionSpacing, 'Cleaning Effort',
      ['Low', 'High'],
      this.gameState.cleaningEffort,
      'cleaningEffort',
      contentWidth
    );

    // Junior Ratio Section
    this.createParameterSection(
      contentStartX, contentStartY + (sectionSpacing * 2), 'Junior Staff Ratio',
      ['0%', '15%', '30%', '50%'],
      `${Math.round(this.gameState.juniorRatio * 100)}%`,
      'juniorRatio',
      contentWidth,
      true
    );

    // Offshore Policy Section
    this.createParameterSection(
      contentStartX, contentStartY + (sectionSpacing * 3), 'Offshore Policy',
      ['None', 'Partial', 'Full'],
      this.gameState.offshorePolicy,
      'offshorePolicy',
      contentWidth
    );

    // Sidebar: KPI Preview
    if (!isMobile) {
      const sidebarX = width - sidebarWidth - 20;

      // Sidebar background
      this.add.rectangle(
        sidebarX + sidebarWidth / 2,
        height / 2,
        sidebarWidth,
        height - 100,
        0xffffff,
        0.95
      ).setStrokeStyle(2, 0x667eea);

      this.add.text(sidebarX + 20, 100, 'KPI Preview', {
        fontSize: '18px',
        fontFamily: 'Arial, sans-serif',
        color: '#667eea',
        fontStyle: 'bold'
      }).setOrigin(0, 0);

      // KPI display texts (stored as references for updates)
      this.kpiCostText = this.add.text(sidebarX + 20, 150, 'Cost: $0', {
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
        color: '#2c3e50'
      }).setOrigin(0, 0);

      this.kpiDurationText = this.add.text(sidebarX + 20, 190, 'Duration: 0 weeks', {
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
        color: '#2c3e50'
      }).setOrigin(0, 0);

      this.kpiScoreText = this.add.text(sidebarX + 20, 230, 'Score: 0', {
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
        color: '#2c3e50'
      }).setOrigin(0, 0);

      // Store sidebar position for updates
      this.sidebarX = sidebarX;
      this.updateKPIDisplay();
    }

    // Navigation buttons
    const buttonY = height - 40;
    const buttonSpacing = 150;
    const centerX = contentStartX + contentWidth / 2;

    // Back button
    const backButton = this.add.rectangle(centerX - buttonSpacing / 2, buttonY, 120, 40, 0x95a5a6);
    backButton.setInteractive({ useHandCursor: true });

    this.add.text(centerX - buttonSpacing / 2, buttonY, 'Back', {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);

    backButton.on('pointerover', () => {
      backButton.setFillStyle(0x7f8c8d);
      this.input.setDefaultCursor('pointer');
    });
    backButton.on('pointerout', () => {
      backButton.setFillStyle(0x95a5a6);
      this.input.setDefaultCursor('default');
    });
    backButton.on('pointerdown', () => {
      this.scene.start('StartScene');
    });

    // Next button
    const nextButton = this.add.rectangle(centerX + buttonSpacing / 2, buttonY, 120, 40, 0x667eea);
    nextButton.setInteractive({ useHandCursor: true });

    this.add.text(centerX + buttonSpacing / 2, buttonY, 'Next', {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);

    nextButton.on('pointerover', () => {
      nextButton.setFillStyle(0x5568d3);
      this.input.setDefaultCursor('pointer');
    });
    nextButton.on('pointerout', () => {
      nextButton.setFillStyle(0x667eea);
      this.input.setDefaultCursor('default');
    });
    nextButton.on('pointerdown', () => {
      this.scene.start('ObjectsScene', { gameState: this.gameState });
    });
  }

  createParameterSection(x, y, label, options, currentValue, paramKey, width, isNumeric = false) {
    // Label
    this.add.text(x, y, label, {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      color: '#2c3e50',
      fontStyle: 'bold'
    }).setOrigin(0, 0);

    // Options
    const optionY = y + 35;
    const optionSpacing = width / Math.max(options.length, 3);

    options.forEach((option, index) => {
      const optionX = x + (index * optionSpacing);
      const isSelected = isNumeric
        ? currentValue === option
        : currentValue === option.toLowerCase();

      // Button background
      const buttonBg = this.add.rectangle(
        optionX + 40,
        optionY,
        80,
        35,
        isSelected ? 0x667eea : 0xffffff,
        1
      );
      buttonBg.setStrokeStyle(2, isSelected ? 0x667eea : 0xbdc3c7);
      buttonBg.setInteractive({ useHandCursor: true });

      // Button text
      const buttonText = this.add.text(optionX + 40, optionY, option, {
        fontSize: '13px',
        fontFamily: 'Arial, sans-serif',
        color: isSelected ? '#ffffff' : '#2c3e50'
      }).setOrigin(0.5, 0.5);

      // Click handler
      buttonBg.on('pointerdown', () => {
        if (isNumeric) {
          const ratioMap = { '0%': 0, '15%': 0.15, '30%': 0.30, '50%': 0.50 };
          this.gameState[paramKey] = ratioMap[option];
        } else {
          this.gameState[paramKey] = option.toLowerCase();
        }

        // Refresh section
        this.scene.restart();
      });

      buttonBg.on('pointerover', () => {
        buttonBg.setFillStyle(isSelected ? 0x5568d3 : 0xecf0f1);
      });
      buttonBg.on('pointerout', () => {
        buttonBg.setFillStyle(isSelected ? 0x667eea : 0xffffff);
      });
    });
  }

  updateKPIDisplay() {
    if (this.kpiCostText) {
      // Stub: Would calculate from current state
      const cost = 500000;
      const duration = 24;

      this.kpiCostText.setText(`Cost: $${cost.toLocaleString()}`);
      this.kpiDurationText.setText(`Duration: ${duration} weeks`);
      this.kpiScoreText.setText(`Score: 50`);
    }
  }

  shutdown() {
    if (this.kpiUpdateTimer) {
      this.time.removeEvent(this.kpiUpdateTimer);
    }
  }
}
