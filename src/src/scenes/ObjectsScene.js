import Phaser from 'phaser';
import { OBJECTS } from '../config';

export default class ObjectsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ObjectsScene' });
  }

  init(data) {
    this.gameState = data.gameState || {};
    // Initialize tool selections from gameState
    OBJECTS.forEach(obj => {
      if (!this.gameState.objectTools) this.gameState.objectTools = {};
      if (!this.gameState.objectTools[obj.id]) {
        this.gameState.objectTools[obj.id] = {
          extraction: 'BODS',
          transformation: 'IDP',
          load: 'Cockpit'
        };
      }
    });
  }

  create() {
    // Background
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillGradientStyle(0xecf0f1, 0xecf0f1, 0xf8f9fa, 0xf8f9fa, 1);
    graphics.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
    graphics.generateTexture('bgLight2', this.cameras.main.width, this.cameras.main.height);
    graphics.destroy();

    this.add.image(0, 0, 'bgLight2').setOrigin(0, 0);

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const isMobile = width < 768;
    const tableStartX = isMobile ? 20 : 40;

    // Title
    this.add.text(tableStartX, 20, '2. Choose Tools for 15 Objects', {
      fontSize: isMobile ? '24px' : '32px',
      fontFamily: 'Arial, sans-serif',
      color: '#2c3e50',
      fontStyle: 'bold'
    }).setOrigin(0, 0);

    // Create scrollable list (showing first 7 for MVP)
    const listStartY = 80;
    const rowHeight = 50;

    this.add.text(tableStartX, listStartY, 'Object | Complexity | Volume | Extraction | Transform | Load', {
      fontSize: '12px',
      fontFamily: 'Arial, sans-serif',
      color: '#667eea',
      fontStyle: 'bold'
    }).setOrigin(0, 0);

    OBJECTS.slice(0, 7).forEach((obj, index) => {
      const rowY = listStartY + 30 + (index * rowHeight);

      // Alternate colors
      if (index % 2 === 0) {
        this.add.rectangle(tableStartX + 200, rowY + 15, width - 80, rowHeight, 0xf8f9fa);
      }

      // Object info
      this.add.text(tableStartX, rowY, `${obj.name} | ${obj.complexity} | ${obj.volume}`, {
        fontSize: '11px',
        fontFamily: 'Arial, sans-serif',
        color: '#2c3e50'
      }).setOrigin(0, 0);

      // Tool selection dropdowns
      this.createToolDropdown(
        tableStartX + 350, rowY,
        ['BODS', 'FlatFile'],
        this.gameState.objectTools[obj.id].extraction,
        (val) => this.setTool(obj.id, 'extraction', val)
      );

      this.createToolDropdown(
        tableStartX + 500, rowY,
        ['IDP', 'Manual'],
        this.gameState.objectTools[obj.id].transformation,
        (val) => this.setTool(obj.id, 'transformation', val)
      );

      this.createToolDropdown(
        tableStartX + 640, rowY,
        ['Cockpit', 'Manual'],
        this.gameState.objectTools[obj.id].load,
        (val) => this.setTool(obj.id, 'load', val)
      );
    });

    // Note about remaining objects
    this.add.text(tableStartX, listStartY + 30 + (7 * rowHeight) + 10,
      `... and ${OBJECTS.length - 7} more objects (configure in full game)`, {
      fontSize: '12px',
      fontFamily: 'Arial, sans-serif',
      color: '#999',
      fontStyle: 'italic'
    }).setOrigin(0, 0);

    // KPI Panel
    const sidebarX = width - 280;
    this.add.rectangle(sidebarX + 140, height / 2, 280, height - 100, 0xffffff, 0.95)
      .setStrokeStyle(2, 0x667eea);

    this.add.text(sidebarX + 20, 100, 'KPI Summary', {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      color: '#667eea',
      fontStyle: 'bold'
    }).setOrigin(0, 0);

    this.add.text(sidebarX + 20, 150, 'Cost: $1,250,000', {
      fontSize: '13px',
      fontFamily: 'Arial, sans-serif',
      color: '#2c3e50'
    }).setOrigin(0, 0);

    this.add.text(sidebarX + 20, 185, 'Duration: 18 weeks', {
      fontSize: '13px',
      fontFamily: 'Arial, sans-serif',
      color: '#2c3e50'
    }).setOrigin(0, 0);

    this.add.text(sidebarX + 20, 220, 'Score: 50', {
      fontSize: '13px',
      fontFamily: 'Arial, sans-serif',
      color: '#2c3e50'
    }).setOrigin(0, 0);

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
      this.scene.start('StrategyScene', { gameState: this.gameState });
    });

    // Next button
    const nextButton = this.add.rectangle(centerX + 100, buttonY, 120, 40, 0x667eea);
    nextButton.setInteractive({ useHandCursor: true });
    this.add.text(centerX + 100, buttonY, 'Next', {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);
    nextButton.on('pointerdown', () => {
      this.scene.start('TeamSizingScene', { gameState: this.gameState });
    });
  }

  createToolDropdown(x, y, options, selected, callback) {
    const btn = this.add.rectangle(x, y + 10, 100, 30, 0xffffff);
    btn.setStrokeStyle(1, 0xbdc3c7);
    btn.setInteractive({ useHandCursor: true });

    const text = this.add.text(x - 40, y, selected, {
      fontSize: '11px',
      fontFamily: 'Arial, sans-serif',
      color: '#2c3e50'
    }).setOrigin(0, 0);

    btn.on('pointerdown', () => {
      const idx = options.indexOf(selected);
      const next = options[(idx + 1) % options.length];
      text.setText(next);
      callback(next);
    });
  }

  setTool(objId, toolType, value) {
    this.gameState.objectTools[objId][toolType] = value;
  }
}
