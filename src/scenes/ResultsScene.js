import Phaser from 'phaser';

export default class ResultsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ResultsScene' });
  }

  init(data) {
    this.gameState = data.gameState || {};
    this.results = this.gameState.results || {
      totalCost: 500000,
      totalDuration: 24,
      score: 50
    };
  }

  create() {
    // Background
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillGradientStyle(0x667eea, 0x667eea, 0x764ba2, 0x764ba2, 1);
    graphics.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
    graphics.generateTexture('gradientBg2', this.cameras.main.width, this.cameras.main.height);
    graphics.destroy();

    this.add.image(0, 0, 'gradientBg2').setOrigin(0, 0);

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const centerX = width / 2;

    // Title
    this.add.text(centerX, 20, '📊 Final Results', {
      fontSize: '40px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      fontStyle: 'bold',
      align: 'center'
    }).setOrigin(0.5, 0);

    // Score badge (large)
    const scoreColor = this.results.score >= 75 ? 0x27ae60 : this.results.score >= 50 ? 0xf39c12 : 0xe74c3c;
    this.add.circle(centerX, 100, 50, scoreColor);
    this.add.text(centerX, 100, Math.round(this.results.score), {
      fontSize: '48px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);

    this.add.text(centerX, 160, 'Strategy Score', {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      color: '#ecf0f1'
    }).setOrigin(0.5, 0);

    // Cost display
    this.add.text(centerX - 150, 220, '$' + this.results.totalCost.toLocaleString(), {
      fontSize: '36px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffd700',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0);

    this.add.text(centerX - 150, 270, 'Total Cost', {
      fontSize: '14px',
      fontFamily: 'Arial, sans-serif',
      color: '#ecf0f1'
    }).setOrigin(0.5, 0);

    // Duration display
    this.add.text(centerX + 150, 220, this.results.totalDuration + ' weeks', {
      fontSize: '36px',
      fontFamily: 'Arial, sans-serif',
      color: '#87ceeb',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0);

    this.add.text(centerX + 150, 270, 'Total Duration', {
      fontSize: '14px',
      fontFamily: 'Arial, sans-serif',
      color: '#ecf0f1'
    }).setOrigin(0.5, 0);

    // Breakdown section
    const breakdownY = 330;

    this.add.text(40, breakdownY, 'Cost Breakdown by Phase', {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0, 0);

    const phases = ['Design', 'Build', 'Cutover'];
    const percentages = [20, 50, 30];
    let yPos = breakdownY + 40;

    phases.forEach((phase, idx) => {
      this.add.text(40, yPos, phase + ': ' + percentages[idx] + '%', {
        fontSize: '13px',
        fontFamily: 'Arial, sans-serif',
        color: '#ecf0f1'
      }).setOrigin(0, 0);

      // Progress bar
      this.add.rectangle(150, yPos + 5, percentages[idx] * 2, 15, 0xffd700);
      this.add.rectangle(150 + 100, yPos + 5, 200, 15, 0x34495e).setStrokeStyle(1, 0xffd700);

      yPos += 30;
    });

    // Team allocation
    const teamY = breakdownY + 160;

    this.add.text(40, teamY, 'Team Allocation', {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0, 0);

    let teamYPos = teamY + 40;
    const phases2 = ['design', 'build', 'cutover'];
    const phaseLabels2 = ['Design', 'Build', 'Cutover'];

    phases2.forEach((phase, idx) => {
      const team = this.gameState.teamSizing[phase];
      const text = `${phaseLabels2[idx]}: ${team.it} IT, ${team.functional} Functional`;

      this.add.text(40, teamYPos, text, {
        fontSize: '13px',
        fontFamily: 'Arial, sans-serif',
        color: '#ecf0f1'
      }).setOrigin(0, 0);

      teamYPos += 25;
    });

    // Strategic Analysis
    const analysisY = teamY + 140;

    this.add.text(40, analysisY, 'Strategic Analysis', {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0, 0);

    const analysis = this.getAnalysis();
    this.add.text(40, analysisY + 40, analysis, {
      fontSize: '13px',
      fontFamily: 'Arial, sans-serif',
      color: '#ecf0f1',
      wordWrap: { width: 600 }
    }).setOrigin(0, 0);

    // Navigation buttons
    const buttonY = height - 40;

    // Play Again button
    const playAgainBtn = this.add.rectangle(centerX - 100, buttonY, 140, 40, 0x2ecc71);
    playAgainBtn.setInteractive({ useHandCursor: true });

    this.add.text(centerX - 100, buttonY, 'Play Again', {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);

    playAgainBtn.on('pointerdown', () => {
      this.scene.start('StrategyScene', {
        gameState: {
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
        }
      });
    });

    // Share button
    const shareBtn = this.add.rectangle(centerX + 100, buttonY, 140, 40, 0x3498db);
    shareBtn.setInteractive({ useHandCursor: true });

    this.add.text(centerX + 100, buttonY, 'Share Results', {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);

    shareBtn.on('pointerdown', () => {
      alert('Results: Cost $' + this.results.totalCost + ', Duration ' + this.results.totalDuration + ' weeks, Score ' + Math.round(this.results.score));
    });
  }

  getAnalysis() {
    const cost = this.results.totalCost;
    const duration = this.results.totalDuration;
    const score = this.results.score;

    let analysis = '';

    if (cost < 250000) {
      analysis += 'Cost-Efficient: Your strategy demonstrates strong resource optimization. ';
    } else if (cost < 500000) {
      analysis += 'Balanced Cost: Good resource allocation with room for optimization. ';
    } else {
      analysis += 'High Cost: Consider offshore opportunities and automation investments. ';
    }

    if (duration < 16) {
      analysis += 'Fast Execution: Aggressive team sizing enables rapid delivery. ';
    } else if (duration < 24) {
      analysis += 'Realistic Timeline: Balanced approach with good phase overlap. ';
    } else {
      analysis += 'Extended Timeline: Review critical path and parallelization opportunities. ';
    }

    if (score >= 75) {
      analysis += '✓ Excellent Strategy! Proceed with confidence.';
    } else if (score >= 50) {
      analysis += '✓ Solid Strategy! Fine-tune for better results.';
    } else {
      analysis += '✓ Needs Adjustment. Explore automation and staffing options.';
    }

    return analysis;
  }
}
