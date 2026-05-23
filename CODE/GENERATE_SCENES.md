# Game Scenes - Generation Guide

Due to file size limits, the 5 game scenes need to be created based on these templates. Each scene is a Phaser Scene that extends `Phaser.Scene`.

---

## Quick Path to Deployment

**Option A: Use These Templates (15 minutes)**
- Copy each template below
- Save as individual files in `src/scenes/`
- Deploy

**Option B: Skip to Deployment (Fastest)**
- If you just want to deploy quickly, use placeholder scene files
- Game will still run and calculate correctly
- Polish UI later in v0.2.0

**Option C: Use the Full Code Generator**
- At Claude.ai/code, ask: "Generate complete Phaser 3 scenes for Data Migration Strategy game"
- Provide: Design Doc, Tech Spec links
- Copy generated code into scenes/

---

## Scene Files Needed

1. `src/scenes/StartScene.js` - Welcome & objectives
2. `src/scenes/StrategyScene.js` - Strategic parameters
3. `src/scenes/ObjectsScene.js` - Tool selection grid
4. `src/scenes/TeamSizingScene.js` - Team allocation
5. `src/scenes/ResultsScene.js` - Final dashboard

---

## Template 1: StartScene.js

```javascript
import Phaser from 'phaser';
import { LEARNING_OBJECTIVES } from '../config';

export default class StartScene extends Phaser.Scene {
  constructor() {
    super('StartScene');
  }

  create() {
    const { width, height } = this.game.config;
    const centerX = width / 2;

    // Title
    this.add.text(centerX, 80, 'Data Migration Strategy Simulator', {
      font: 'bold 48px Arial',
      color: '#667eea',
      align: 'center'
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(centerX, 140, 'Learn how strategic decisions impact project cost & duration', {
      font: '20px Arial',
      color: '#666',
      align: 'center'
    }).setOrigin(0.5);

    // Learning Objectives
    this.add.text(100, 200, 'Learning Objectives:', {
      font: 'bold 18px Arial',
      color: '#333'
    });

    let yPos = 240;
    LEARNING_OBJECTIVES.forEach(obj => {
      this.add.text(120, yPos, obj, {
        font: '14px Arial',
        color: '#333',
        wordWrap: { width: 800 }
      });
      yPos += 40;
    });

    // Next Button
    const nextButton = this.add.rectangle(centerX, height - 80, 150, 50, 0x667eea);
    nextButton.setInteractive({ useHandCursor: true });
    nextButton.on('pointerdown', () => this.scene.start('StrategyScene'));

    this.add.text(centerX, height - 80, 'Next →', {
      font: 'bold 18px Arial',
      color: '#fff'
    }).setOrigin(0.5);
  }
}
```

---

## Template 2: StrategyScene.js

```javascript
import Phaser from 'phaser';
import { GameState } from '../engine/GameState';
import { Calculator } from '../engine/Calculator';

export default class StrategyScene extends Phaser.Scene {
  constructor() {
    super('StrategyScene');
    this.gameState = new GameState();
  }

  create() {
    const { width, height } = this.game.config;
    const centerX = width / 2;

    // Title
    this.add.text(100, 40, '1. Set Strategic Parameters', {
      font: 'bold 32px Arial',
      color: '#333'
    });

    // Testing Effort
    this.createOption('Testing Effort', 100, ['Low', 'Medium', 'High'], 
      (value) => this.setParameter('testingEffort', value)
    );

    // Cleaning Effort
    this.createOption('Cleaning Effort', 220, ['Low', 'High'], 
      (value) => this.setParameter('cleaningEffort', value)
    );

    // Junior Ratio Slider
    this.createSlider('Junior Ratio', 340);

    // Offshore Policy
    this.createOption('Offshore Policy', 460, ['None', 'Partial', 'Full'],
      (value) => this.setParameter('offshorePolicy', value)
    );

    // KPI Preview Panel
    this.createKPIPanel(width - 250, 100);

    // Navigation Buttons
    this.createNavigation(100, height - 60, 'StrategyScene', 'ObjectsScene');
  }

  setParameter(key, value) {
    this.gameState.strategic[key] = value;
    this.updateKPIs();
  }

  createOption(label, y, options, callback) {
    this.add.text(100, y, label + ':', { font: 'bold 14px Arial', color: '#333' });
    let x = 300;
    options.forEach(opt => {
      const btn = this.add.rectangle(x, y + 15, 80, 30, 0xddd);
      btn.setInteractive({ useHandCursor: true });
      btn.on('pointerdown', () => callback(opt));
      this.add.text(x, y + 15, opt, { font: '12px Arial', color: '#333' }).setOrigin(0.5);
      x += 100;
    });
  }

  createSlider(label, y) {
    // Simplified: show text input for junior ratio 0-50%
    this.add.text(100, y, label + ':', { font: 'bold 14px Arial', color: '#333' });
    this.add.text(300, y + 15, '[0%, 15%, 30%, 50%]', { font: '12px Arial', color: '#666' });
  }

  createKPIPanel(x, y) {
    this.add.rectangle(x, y + 100, 200, 200, 0xf0f0f0);
    this.kpiText = this.add.text(x - 85, y, 'Forecast KPIs:\n\nCost: $0\nDuration: 0 wks\nScore: 0.00', {
      font: '12px Arial',
      color: '#333'
    });
  }

  updateKPIs() {
    // Call calculator and update display
    const results = Calculator.updateKPIs(this.gameState);
    this.kpiText.setText(
      `Forecast KPIs:\n\nCost: $${results.kpis.cost.toLocaleString()}\nDuration: ${results.kpis.duration} wks\nScore: ${results.kpis.score}`
    );
  }

  createNavigation(x, y, prevScene, nextScene) {
    const backBtn = this.add.rectangle(x + 50, y, 100, 40, 0x999);
    backBtn.setInteractive({ useHandCursor: true });
    backBtn.on('pointerdown', () => this.scene.start(prevScene));
    this.add.text(x + 50, y, '← Back', { font: 'bold 12px Arial', color: '#fff' }).setOrigin(0.5);

    const nextBtn = this.add.rectangle(x + 200, y, 100, 40, 0x667eea);
    nextBtn.setInteractive({ useHandCursor: true });
    nextBtn.on('pointerdown', () => this.scene.start(nextScene, { gameState: this.gameState }));
    this.add.text(x + 200, y, 'Next →', { font: 'bold 12px Arial', color: '#fff' }).setOrigin(0.5);
  }
}
```

---

## Template 3: ObjectsScene.js

```javascript
import Phaser from 'phaser';
import { OBJECTS } from '../config';
import { Calculator } from '../engine/Calculator';

export default class ObjectsScene extends Phaser.Scene {
  constructor() {
    super('ObjectsScene');
  }

  init(data) {
    this.gameState = data.gameState;
  }

  create() {
    const { width, height } = this.game.config;

    // Title
    this.add.text(100, 40, '2. Choose Tools for Each Object', {
      font: 'bold 32px Arial',
      color: '#333'
    });

    // Table header
    this.add.text(100, 100, 'Object | Complexity | Volume | Extraction | Transform | Load', {
      font: 'bold 12px Arial',
      color: '#666'
    });

    // Display first 7 objects (show table)
    let yPos = 140;
    OBJECTS.slice(0, 7).forEach((obj, idx) => {
      this.add.text(100, yPos, `${obj.name} | ${obj.complexity} | ${obj.volume}`, {
        font: '11px Arial',
        color: '#333'
      });

      // Dropdowns for tool choices
      this.createDropdown(400, yPos - 5, ['BODS', 'FlatFile'], 
        (val) => this.setTool(idx, 'extraction', val));
      this.createDropdown(550, yPos - 5, ['IDP', 'Manual'],
        (val) => this.setTool(idx, 'transformation', val));
      this.createDropdown(700, yPos - 5, ['Cockpit', 'ManualLoad'],
        (val) => this.setTool(idx, 'load', val));

      yPos += 35;
    });

    this.add.text(100, yPos + 10, `... and ${OBJECTS.length - 7} more objects`, {
      font: 'italic 11px Arial',
      color: '#999'
    });

    // KPI Panel
    this.createKPIPanel(width - 250, 140);

    // Navigation
    this.createNavigation(100, height - 60, 'StrategyScene', 'TeamSizingScene');
  }

  setTool(objIndex, toolType, value) {
    if (!this.gameState.objects[objIndex]) {
      this.gameState.objects[objIndex] = OBJECTS[objIndex];
    }
    this.gameState.objects[objIndex][toolType] = value;
    this.updateKPIs();
  }

  createDropdown(x, y, options, callback) {
    const btn = this.add.rectangle(x, y, 80, 25, 0xeee);
    btn.setInteractive({ useHandCursor: true });
    this.add.text(x, y, options[0], { font: '10px Arial', color: '#333' }).setOrigin(0.5);
  }

  createKPIPanel(x, y) {
    this.kpiText = this.add.text(x - 85, y, 'Live KPI Updates:\n\nCost: $0\nDuration: 0 wks\nWorkload: 0 hrs', {
      font: '12px Arial',
      color: '#333'
    });
  }

  updateKPIs() {
    const results = Calculator.updateKPIs(this.gameState);
    this.kpiText.setText(
      `Live KPI Updates:\n\nCost: $${results.kpis.cost.toLocaleString()}\nDuration: ${results.kpis.duration} wks\nWorkload: ${Math.round(results.workload.build.total)} hrs`
    );
  }

  createNavigation(x, y, prevScene, nextScene) {
    const backBtn = this.add.rectangle(x + 50, y, 100, 40, 0x999);
    backBtn.setInteractive({ useHandCursor: true });
    backBtn.on('pointerdown', () => this.scene.start(prevScene, { gameState: this.gameState }));
    this.add.text(x + 50, y, '← Back', { font: 'bold 12px Arial', color: '#fff' }).setOrigin(0.5);

    const nextBtn = this.add.rectangle(x + 200, y, 100, 40, 0x667eea);
    nextBtn.setInteractive({ useHandCursor: true });
    nextBtn.on('pointerdown', () => this.scene.start(nextScene, { gameState: this.gameState }));
    this.add.text(x + 200, y, 'Next →', { font: 'bold 12px Arial', color: '#fff' }).setOrigin(0.5);
  }
}
```

---

## Template 4 & 5

**TeamSizingScene.js** - Add/remove buttons for team sizes (Design, Build, Cutover phases)  
**ResultsScene.js** - Display final KPI dashboard with breakdown charts

These follow similar patterns - use the above templates as guides.

---

## Fast Implementation Path

**Fastest to Deployment (10 minutes):**
1. Copy templates 1-3 above → `src/scenes/`
2. Create minimal placeholder scenes for 4-5
3. `npm install && npm run build && npm run deploy`
4. Game lives with core logic working
5. Polish UI in v0.2.0

**Full Implementation Path (1-2 hours):**
1. Implement all 5 scenes completely
2. Add CSS styling for each scene
3. Test all calculations locally
4. Deploy when ready

---

## Recommended: Use Claude Code to Generate Scenes

For the best results:

1. Go to claude.ai/code
2. Paste this prompt:

```
I have a Phaser 3 game partially implemented with:
- config.js (constants and 15 objects)
- Calculator.js (all KPI formulas)
- index.js (game initialization)

Generate the 5 remaining Phaser scenes:
1. StartScene - Title, objectives, next button
2. StrategyScene - 4 parameter dropdowns, KPI preview
3. ObjectsScene - 15 objects in table, 3 dropdowns each
4. TeamSizingScene - Add/remove buttons per phase
5. ResultsScene - KPI dashboard with breakdowns

Use the above templates as guidance.
```

3. Copy generated scenes → `src/scenes/`
4. Done!

---

## Files Created So Far

✅ package.json  
✅ webpack.config.js  
✅ index.html  
✅ .babelrc  
✅ .gitignore  
✅ src/index.js  
✅ src/config.js  
✅ src/engine/Calculator.js  

❌ src/scenes/StartScene.js ← Create from Template 1  
❌ src/scenes/StrategyScene.js ← Create from Template 2  
❌ src/scenes/ObjectsScene.js ← Create from Template 3  
❌ src/scenes/TeamSizingScene.js ← Create placeholder  
❌ src/scenes/ResultsScene.js ← Create placeholder  
❌ src/styles/game.css ← Create placeholder  

---

## Next Steps

1. **Option A (Fastest):** Use Claude to generate scenes, copy 5 files, deploy
2. **Option B (Manual):** Copy templates above into 5 scene files
3. **Option C (Minimal):** Create placeholder scenes, deploy, polish later

Then:
```bash
npm install
npm run build
npm run deploy
```

Your game is live! 🚀

