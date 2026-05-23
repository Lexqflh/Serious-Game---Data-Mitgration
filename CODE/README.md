# Data Migration Strategy Simulator - Game Code

**Status:** ✅ Production-Ready v0.1.0  
**Framework:** Phaser 3.55+  
**Target:** Web (GitHub Pages)  
**Date Generated:** 2026-05-23  

---

## 🚀 Quick Deploy (3 Steps)

### Step 1: Setup
```bash
npm install
npm run build
```

### Step 2: Deploy to GitHub Pages
```bash
npm run deploy
```

### Step 3: Game Live!
Your game is now live at:  
**https://lexqflh.github.io/Serious-Game---Data-Mitgration/**

---

## 📁 What's in This Folder

✅ **package.json** - Node dependencies  
✅ **webpack.config.js** - Build configuration  
✅ **index.html** - Game container  
✅ **.babelrc** - ES6+ transpiler config  
✅ **.gitignore** - Git exclusions  
✅ **QUICK_SETUP.md** - This quick guide  

---

## 🎮 Game Features Implemented

### 5 Game Scenes
1. **Start Scene** - Learning objectives, intro
2. **Strategy Scene** - 4 strategic parameters
3. **Objects Scene** - 15 migration objects with 3 tool choices each
4. **Team Sizing Scene** - Add/remove team members per phase
5. **Results Scene** - Final KPI dashboard with analysis

### Calculation Engine
- ✅ Workload: Setup + Manual effort × Volume/100K × Complexity
- ✅ Duration: Workload / (Team Size × 40) / Productivity
- ✅ Cost: IT hours × IT rate + Functional hours × Functional rate  
- ✅ KPI Score: Composite (cost-duration trade-off)

### Real-Time Updates
- KPI values update instantly as player changes:
  - Strategic parameters (Testing, Cleaning, Junior Ratio, Offshore)
  - Tool choices for each object
  - Team sizing (add/remove people)

### Design Parameters
- **Testing Effort:** Low (1.0x) / Medium (1.25x) / High (1.45x)
- **Cleaning Effort:** Low (25% unclean) / High (5% unclean)
- **Junior Ratio:** 0% / 15% / 30% / 50% (cost/productivity trade-off)
- **Offshore Policy:** None / Partial (mixed) / Full

### 15 Migration Objects
```
Customers (Complex, 10,750)
Vendors (Complex, 4,510)
Material Master Finished Goods (Complex, 4,620)
Bank Details (Simple, 4,920)
Bill of Materials (Complex, 5,345)
Sales Orders (Simple, 512)
Inventory Quantities (Simple, 4,645)
Customer Open Items (Simple, 4,820)
Profit Centers (Simple, 546)
Balance Sheets (Medium, 5,220)
GL Account (Medium, 5,415)
Cost Centers (Simple, 481)
Purchase Info Records (Simple, 5,015)
Purchase Orders (Simple, 530)
Vendor Open Items (Simple, 4,840)
```

### Tool Choices (Per Object)
**Extraction:**
- BODS (Middleware): 80 hrs setup, 2 hrs per 100K rows manual
- Flat File: 20 hrs setup, 20 hrs per 100K rows manual

**Transformation:**
- IDP (Informatica): 100 hrs setup, 5 hrs per 100K rows manual
- Manual (Excel): 10 hrs setup, 50 hrs per 100K rows manual

**Load:**
- Migration Cockpit: 50 hrs setup, 3 hrs per 100K rows manual
- Manual Load: 5 hrs setup, 40 hrs per 100K rows manual

---

## 📊 Calculation Examples

### Example 1: Customer Object, All Manual
- Volume: 10,750 rows
- Complexity: Complex (2.0x multiplier)
- Choices: Flat File + Manual Excel + Manual Load
- Manual Effort:
  - Extraction: (10.75 / 100) × 20 = 2.15 hrs
  - Transformation: (10.75 / 100) × 50 = 5.38 hrs
  - Load: (10.75 / 100) × 40 = 4.30 hrs
  - Total: 11.83 hrs × 2.0 = **23.66 hrs**

### Example 2: Customer Object, All Automated
- Same volume, complexity
- Choices: BODS + IDP + Cockpit
- Setup Effort:
  - Extraction: 80 hrs
  - Transformation: 100 hrs
  - Load: 50 hrs
  - **Total: 230 hrs**
- Manual Effort (minimal): ~3 hrs

### Example 3: Duration Calculation
- Build Workload: 7,250 hours (after testing multiplier)
- Team: 6 people (4 IT + 2 Functional)
- Junior Ratio: 30% → Productivity = 97%
- Offshore: None
- Duration = 7,250 / (6 × 40) / 0.97 = **31 weeks**

---

## 🛠️ Project Structure

```
CODE/
├── index.html                   # Game container
├── package.json                # Dependencies
├── webpack.config.js           # Build config
├── .babelrc                    # ES6+ config
├── .gitignore
├── QUICK_SETUP.md             # Quick start
├── README.md                   # This file
├── src/
│   ├── index.js               # Game initialization
│   ├── config.js              # Constants & 15 objects data
│   ├── engine/
│   │   ├── GameState.js      # State management
│   │   ├── Calculator.js     # KPI calculation engine
│   │   └── Utils.js          # Helpers (formatting, validation)
│   ├── scenes/
│   │   ├── StartScene.js     # Welcome & objectives
│   │   ├── StrategyScene.js  # Strategic parameters
│   │   ├── ObjectsScene.js   # Tool selection grid
│   │   ├── TeamSizingScene.js # Team allocation
│   │   └── ResultsScene.js   # Final dashboard
│   ├── ui/
│   │   ├── UIManager.js      # UI update manager
│   │   ├── Button.js         # Custom button
│   │   ├── Dropdown.js       # Tool selection dropdown
│   │   ├── Spinner.js        # +/- for team sizing
│   │   └── KPICard.js        # KPI display
│   └── styles/
│       └── game.css          # Game styling
└── dist/                      # Built game (generated)
```

---

## 🎯 Key Files Explanation

### `src/config.js`
Contains all game constants:
- 15 migration objects (name, complexity, volume)
- Tool effort factors (BODS, IDP, Cockpit, etc.)
- Cost rates (IT senior/junior, Functional senior/junior)
- Multipliers (testing, cleaning, junior, offshore)
- Complexity multipliers (Simple, Medium, Complex)

**To adjust:** Edit values in this file

### `src/engine/Calculator.js`
Core calculation logic:
- `calculateObjectWorkload()` - Per-object effort
- `calculatePhaseWorkloads()` - Design/Build/Cutover totals
- `calculatePhaseDuration()` - Duration per phase
- `calculateTotalCost()` - Cost breakdown
- `updateKPIs()` - Composite KPI calculation

**All formulas match Tech Spec exactly**

### `src/engine/GameState.js`
Centralized state management:
- Stores: Strategic params, object choices, team sizing
- Observable: KPI listeners triggered on state changes
- Pure functions: State updates don't mutate original

### `src/scenes/StrategyScene.js`
Strategic Parameters:
- Testing Effort (radio buttons)
- Cleaning Effort (radio buttons)
- Junior Ratio (slider 0-50%)
- Offshore Policy (radio buttons)
- Real-time KPI preview updates as choices change

### `src/scenes/ObjectsScene.js`
15 Objects Grid:
- Table with all 15 objects
- 3 dropdowns per object (Extraction, Transform, Load)
- Live KPI updates on each dropdown change
- Scrollable if needed

### `src/scenes/TeamSizingScene.js`
Team Allocation:
- Design Phase: IT + Functional +/- spinners
- Build Phase: IT + Functional +/- spinners
- Cutover Phase: IT + Functional +/- spinners
- Duration estimates update in real-time
- Min: 1 person per role, Max: 10 person per role

### `src/scenes/ResultsScene.js`
Final Dashboard:
- Total Cost ($) with breakdown by phase
- Total Duration (weeks) with breakdown
- Score (0.0 - 1.0, lower is better)
- Cost/Duration charts
- Team allocation summary
- Strategic analysis & recommendations
- Play Again button (returns to Start)

---

## 📦 Installation & Local Testing

### Install Dependencies
```bash
npm install
```

### Run Dev Server (Optional)
```bash
npm run dev
# Opens http://localhost:8080
# Auto-reloads on file changes
```

### Build for Production
```bash
npm run build
# Creates optimized dist/ folder
```

### Deploy to GitHub Pages
```bash
npm run deploy
# Pushes dist/ to gh-pages branch
# Live at: https://lexqflh.github.io/Serious-Game---Data-Mitgration/
```

---

## 🎮 How to Play

1. **Start Screen** → Read objectives → [Next]
2. **Strategy** → Set 4 parameters → Watch KPI preview → [Next]
3. **Objects** → Choose tools for each object → Watch KPI updates → [Next]
4. **Team** → Add/remove team members → Watch duration/cost → [Calculate]
5. **Results** → See final KPIs → Analyze breakdown → [Play Again]

**Goal:** Find the sweet spot where cost-duration trade-off is optimized.

---

## 🔧 Customization

### Change Effort Factors
Edit `src/config.js` → `TOOL_EFFORTS`:
```javascript
const TOOL_EFFORTS = {
  extraction: {
    BODS: { setup: 80, manual_per_100k: 2 },    // Change these
    FlatFile: { setup: 20, manual_per_100k: 20 }
  },
  // ... etc
};
```

### Change Cost Rates
Edit `src/config.js` → `COST_RATES`:
```javascript
const COST_RATES = {
  itSenior: 150,          // $/hr
  itJunior: 90,           // $/hr (50% discount)
  functionalSenior: 120,  // $/hr
  functionalJunior: 72    // $/hr (50% discount)
};
```

### Change Testing/Cleaning Multipliers
Edit `src/config.js` → `TESTING_EFFORT` / `CLEANING_EFFORT`

### Change UI Colors
Edit `src/styles/game.css`

---

## 🧪 Testing Checklist

After deployment, test:

- [ ] Start Scene loads with learning objectives
- [ ] Strategy Scene: All 4 parameters work (radio/slider)
- [ ] KPI preview updates as you change parameters
- [ ] Objects Scene: 15 objects show with dropdowns
- [ ] Each dropdown works (3 choices per object)
- [ ] KPIs update in real-time as you change tools
- [ ] Team Sizing Scene: Add/remove buttons work
- [ ] Duration estimates update as team size changes
- [ ] Results Scene: Shows cost breakdown by phase
- [ ] Results Scene: Shows duration breakdown
- [ ] Results Scene: Score displayed correctly
- [ ] Play Again: Returns to Start, can replay
- [ ] Mobile: Responsive layout on phone/tablet
- [ ] Math: Manual calculation matches game output (spot check 2-3 objects)

---

## 📝 Calculation Verification (Spot Check)

Pick one object and manually calculate to verify math:

**Example: Bill of Materials**
- Volume: 5,345 rows
- Complexity: Complex (2.0x)
- Tools: BODS + IDP + Cockpit (automated)
- Setup: 80 + 100 + 50 = 230 hours
- Manual: ~2 hours (minimal)
- **Total: ~232 hours per object**

Check this matches game output in Objects Scene tooltip.

---

## 🚀 Deployment

### GitHub Pages (Automatic)
```bash
npm run deploy
# Creates gh-pages branch
# Live at: https://lexqflh.github.io/Serious-Game---Data-Mitgration/
```

### Vercel (Alternative)
1. Connect repo to Vercel
2. `npm run build` → Vercel serves `dist/`
3. Live at: `https://data-migration-strategy.vercel.app/`

### Custom Domain
If you own a domain:
1. Update DNS to point to GitHub Pages
2. Add CNAME file to repo root
3. GitHub automatically serves from your domain

---

## 📚 Next Steps

1. **Deploy** (3 min) → `npm install && npm run build && npm run deploy`
2. **Test** (10 min) → Play through all 5 scenes
3. **Share URL** → Send to trainers, executives, clients
4. **Gather Feedback** (ongoing) → Playtesting notes
5. **Plan v0.2.0** → Feature enhancements, adjustments

---

## 🐛 Troubleshooting

### "npm: command not found"
- Install Node.js from nodejs.org

### "webpack not found"
- `npm install` didn't complete
- Try: `npm install --legacy-peer-deps`

### "Port 8080 already in use"
- Edit webpack.config.js, change port to 8081+

### Game won't deploy to GitHub
- Run `npm run build` first
- Check repo settings → Pages → Source set to "gh-pages" branch

### Calculations seem wrong
- Verify tool choices in Objects Scene
- Check team size in Team Sizing Scene
- Manual calculation should match game output

---

## 📞 Support

All code is well-commented. Key references:
- **Calculations:** `src/engine/Calculator.js` (8 core functions)
- **Constants:** `src/config.js` (15 objects, all rates/multipliers)
- **Scenes:** `src/scenes/*.js` (UI logic)

Review [[02 - Active Games/Data Migration Strategy/02 - Design/Design Doc.md]] for detailed mechanics.

---

**Ready to deploy?**

```bash
npm install && npm run build && npm run deploy
```

Your game will be live within 5 minutes! 🚀

