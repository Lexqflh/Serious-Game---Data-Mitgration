import Phaser from 'phaser';

export default class TeamSizingScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TeamSizingScene' });
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
      }
    };
  }

  create() {
    // Background
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillGradientStyle(0xecf0f1, 0xecf0f1, 0xf8f9fa, 0xf8f9fa, 1);
    graphics.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
    graphics.generateTexture('bgLight3', this.cameras.main.width, this.cameras.main.height);
    graphics.destroy();

    this.add.image(0, 0, 'bgLight3').setOrigin(0, 0);

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const contentStartX = 40;

    // Title
    this.add.text(contentStartX, 20, '3. Size Your Team', {
      fontSize: '32px',
      fontFamily: 'Arial, sans-serif',
      color: '#2c3e50',
      fontStyle: 'bold'
    }).setOrigin(0, 0);

    // Phases
    const phases = ['Design', 'Build', 'Cutover'];
    const phaseStartY = 80;
    const phaseSpacing = 120;

    phases.forEach((phase, index) => {
      const phaseY = phaseStartY + (index * phaseSpacing);
      const phaseLower = phase.toLowerCase();

      // Phase label
      this.add.text(contentStartX, phaseY, phase + ' Phase', {
        fontSize: '16px',
        fontFamily: 'Arial, sans-serif',
        color: '#2c3e50',
        fontStyle: 'bold'
      }).setOrigin(0, 0);

      // IT People
      this.createTeamSizer(
        contentStartX,
        phaseY + 35,
        'IT People',
        this.gameState.teamSizing[phaseLower].it,
        (value) => {
          this.gameState.teamSizing[phaseLower].it = value;
          this.updateForecast();
        }
      );

      // Functional People
      this.createTeamSizer(
        contentStartX + 300,
        phaseY + 35,
        'Functional People',
        this.gameState.teamSizing[phaseLower].functional,
        (value) => {
          this.gameState.teamSizing[phaseLower].functional = value;
          this.updateForecast();
        }
      );

      // Duration estimate
      const phaseDuration = 4 + (this.gameState.teamSizing[phaseLower].it + this.gameState.teamSizing[phaseLower].functional);
      this.add.text(contentStartX, phaseY + 80, `Est. Duration: ${phaseDuration} weeks`, {
        fontSize: '13px',
        fontFamily: 'Arial, sans-serif',
        color: '#667eea',
        fontStyle: 'italic'
      }).setOrigin(0, 0);
    });

    // Sidebar: Final Forecast
    const sidebarX = width - 280;
    this.add.rectangle(sidebarX + 140, height / 2, 280, height - 100, 0xffffff, 0.95)
      .setStrokeStyle(2, 0x667eea);

    this.add.text(sidebarX + 20, 100, 'Final Forecast', {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      color: '#667eea',
      fontStyle: 'bold'
    }).setOrigin(0, 0);

    this.forecastCostText = this.add.text(sidebarX + 20, 150, 'Cost: $0', {
      fontSize: '14px',
      fontFamily: 'Arial, sans-serif',
      color: '#2c3e50',
      fontStyle: 'bold'
    }).setOrigin(0, 0);

    this.forecastDurationText = this.add.text(sidebarX + 20, 190, 'Duration: 0 weeks', {
      fontSize: '14px',
      fontFamily: 'Arial, sans-serif',
      color: '#2c3e50',
      fontStyle: 'bold'
    }).setOrigin(0, 0);

    this.forecastScoreText = this.add.text(sidebarX + 20, 230, 'Score: 0', {
      fontSize: '14px',
      fontFamily: 'Arial, sans-serif',
      color: '#2c3e50',
      fontStyle: 'bold'
    }).setOrigin(0, 0);

    this.updateForecast();

    // Navigation buttons
    const buttonY = height - 40;
    const centerX = width / 2;

    // Back button
    const backButton = this.add.rectangle(centerX - 100, buttonY, 120, 40, 0x95a5a6);
    backButton.setInteractive({ useHandCursor: true });
    this.add.text(centerX - 100, buttonY, 'Back', {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);
    backButton.on('pointerdown', () => {
      this.scene.start('ObjectsScene', { gameState: this.gameState });
    });

    // Calculate Results button
    const calcButton = this.add.rectangle(centerX + 100, buttonY, 160, 40, 0x27ae60);
    calcButton.setInteractive({ useHandCursor: true });
    this.add.text(centerX + 100, buttonY, 'Calculate →', {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);
    calcButton.on('pointerdown', () => {
      this.gameState.results = {
        totalCost: this.calculateTotalCost(),
        totalDuration: this.calculateTotalDuration(),
        score: 50,
        costBreakdown: { design: 20, build: 50, cutover: 30 },
        durationBreakdown: { design: 25, build: 50, cutover: 25 }
      };
      this.scene.start('ResultsScene', { gameState: this.gameState });
    });
  }

  createTeamSizer(x, y, label, initialValue, callback) {
    this.add.text(x, y, label, {
      fontSize: '13px',
      fontFamily: 'Arial, sans-serif',
      color: '#7f8c8d'
    }).setOrigin(0, 0);

    const minusBtn = this.add.rectangle(x + 10, y + 25, 30, 30, 0xecf0f1);
    minusBtn.setStrokeStyle(1, 0xbdc3c7);
    minusBtn.setInteractive({ useHandCursor: true });
    this.add.text(x + 10, y + 25, '−', {
      fontSize: '20px',
      fontFamily: 'Arial, sans-serif',
      color: '#2c3e50'
    }).setOrigin(0.5, 0.5);
    minusBtn.on('pointerdown', () => {
      const newValue = Math.max(1, initialValue - 1);
      callback(newValue);
    });

    const valueText = this.add.text(x + 55, y + 25, `${initialValue}`, {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      color: '#2c3e50',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);

    const plusBtn = this.add.rectangle(x + 100, y + 25, 30, 30, 0x667eea);
    plusBtn.setInteractive({ useHandCursor: true });
    this.add.text(x + 100, y + 25, '+', {
      fontSize: '20px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff'
    }).setOrigin(0.5, 0.5);
    plusBtn.on('pointerdown', () => {
      const newValue = Math.min(10, initialValue + 1);
      callback(newValue);
    });
  }

  updateForecast() {
    const cost = this.calculateTotalCost();
    const duration = this.calculateTotalDuration();
    const score = Math.max(0, 100 - (cost / 10000) - (duration / 5));

    this.forecastCostText.setText(`Cost: $${cost.toLocaleString()}`);
    this.forecastDurationText.setText(`Duration: ${duration} weeks`);
    this.forecastScoreText.setText(`Score: ${Math.round(score)}`);
  }

  calculateTotalCost() {
    let cost = 0;
    const rates = { it: 180, functional: 150 };
    const hoursPerWeek = 40;

    ['design', 'build', 'cutover'].forEach(phase => {
      const duration = 4 + (this.gameState.teamSizing[phase].it + this.gameState.teamSizing[phase].functional);
      cost += (this.gameState.teamSizing[phase].it * rates.it +
        this.gameState.teamSizing[phase].functional * rates.functional) * hoursPerWeek * duration;
    });

    return cost;
  }

  calculateTotalDuration() {
    let total = 0;
    ['design', 'build', 'cutover'].forEach(phase => {
      const duration = 4 + (this.gameState.teamSizing[phase].it + this.gameState.teamSizing[phase].functional);
      total += duration;
    });
    return total;
  }
}
