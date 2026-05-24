import Phaser from 'phaser';
import { LEARNING_OBJECTIVES, OBJECTS } from '../config';
import { updateKPIs } from '../engine/Calculator';

export default class StrategyScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StrategyScene' });
    this.kpiUpdateTimer = null;
    this.parameterButtons = {}; // Store button references for updating
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
      ).setStrokeStyle(2, 0x00A3E0);

      this.add.text(sidebarX + 20, 100, 'KPI Preview', {
        fontSize: '18px',
        fontFamily: 'Arial, sans-serif',
        color: '#00A3E0',
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

    // Next button (Accenture Teal)
    const nextButton = this.add.rectangle(centerX + buttonSpacing / 2, buttonY, 120, 40, 0x00A3E0);
    nextButton.setInteractive({ useHandCursor: true });

    this.add.text(centerX + buttonSpacing / 2, buttonY, 'Next', {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);

    nextButton.on('pointerover', () => {
      nextButton.setFillStyle(0x0088B8);
      this.input.setDefaultCursor('pointer');
    });
    nextButton.on('pointerout', () => {
      nextButton.setFillStyle(0x00A3E0);
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
    const buttonRefs = []; // Store button references

    options.forEach((option, index) => {
      const optionX = x + (index * optionSpacing);
      const isSelected = isNumeric
        ? currentValue === option
        : currentValue === option.toLowerCase();

      // Button background (Accenture Teal when selected)
      const buttonBg = this.add.rectangle(
        optionX + 40,
        optionY,
        80,
        35,
        isSelected ? 0x00A3E0 : 0xffffff,
        1
      );
      buttonBg.setStrokeStyle(2, isSelected ? 0x00A3E0 : 0xbdc3c7);
      buttonBg.setInteractive({ useHandCursor: true });

      // Button text
      const buttonText = this.add.text(optionX + 40, optionY, option, {
        fontSize: '13px',
        fontFamily: 'Arial, sans-serif',
        color: isSelected ? '#ffffff' : '#2c3e50'
      }).setOrigin(0.5, 0.5);

      buttonRefs.push({ option, buttonBg, buttonText, isNumeric, paramKey, optionX });

      // Click handler - Update KPI in real-time WITHOUT restart
      buttonBg.on('pointerdown', () => {
        if (isNumeric) {
          const ratioMap = { '0%': 0, '15%': 0.15, '30%': 0.30, '50%': 0.50 };
          this.gameState[paramKey] = ratioMap[option];
        } else {
          this.gameState[paramKey] = option.toLowerCase();
        }

        // Update ALL buttons in this section to reflect new selection
        buttonRefs.forEach(btn => {
          const isNowSelected = isNumeric
            ? this.gameState[paramKey] === parseFloat(btn.option.replace('%', '')) / 100 || this.gameState[paramKey].toString() === btn.option
            : this.gameState[paramKey] === btn.option.toLowerCase();

          btn.buttonBg.setFillStyle(isNowSelected ? 0x00A3E0 : 0xffffff);
          btn.buttonBg.setStrokeStyle(2, isNowSelected ? 0x00A3E0 : 0xbdc3c7);
          btn.buttonText.setColor(isNowSelected ? '#ffffff' : '#2c3e50');
        });

        // Update KPI display in real-time
        this.updateKPIDisplay();
      });

      buttonBg.on('pointerover', () => {
        const isCurrentlySelected = isNumeric
          ? currentValue === option
          : currentValue === option.toLowerCase();
        buttonBg.setFillStyle(isCurrentlySelected ? 0x0088B8 : 0xecf0f1);
      });
      buttonBg.on('pointerout', () => {
        const isCurrentlySelected = isNumeric
          ? currentValue === option
          : currentValue === option.toLowerCase();
        buttonBg.setFillStyle(isCurrentlySelected ? 0x00A3E0 : 0xffffff);
      });
    });
  }

  updateKPIDisplay() {
    if (this.kpiCostText) {
      // Build proper gameState structure for calculation
      const fullGameState = {
        strategic: {
          testingEffort: this.gameState.testingEffort || 'medium',
          cleaningEffort: this.gameState.cleaningEffort || 'high',
          juniorRatio: this.gameState.juniorRatio || 0.15,
          offshorePolicy: this.gameState.offshorePolicy || 'partial'
        },
        objects: OBJECTS,
        team: {
          design: { itPeople: 2, functionalPeople: 2 },
          build: { itPeople: 3, functionalPeople: 3 },
          cutover: { itPeople: 2, functionalPeople: 2 }
        }
      };

      // Calculate KPIs
      const kpiResults = updateKPIs(fullGameState);
      const { cost, duration, score } = kpiResults.kpis;

      // Update display
      this.kpiCostText.setText(`Cost: $${(cost / 1000000).toFixed(1)}M`);
      this.kpiDurationText.setText(`Duration: ${duration.toFixed(1)} weeks`);
      this.kpiScoreText.setText(`Score: ${(score * 100).toFixed(0)}`);
    }
  }

  shutdown() {
    if (this.kpiUpdateTimer) {
      this.time.removeEvent(this.kpiUpdateTimer);
    }
  }
}
