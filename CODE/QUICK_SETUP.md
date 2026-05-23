# Data Migration Strategy Game - Quick Setup

## Status
✅ All source code generated and ready for deployment  
✅ Tech Spec fully implemented  
✅ Ready for GitHub Pages deployment  

---

## Quick Start (3 Minutes)

### Step 1: Download This Folder
This `CODE` folder contains the complete Phaser 3 game ready to deploy.

### Step 2: Clone Your GitHub Repo Locally
```bash
git clone https://github.com/Lexqflh/Serious-Game---Data-Mitgration.git
cd Serious-Game---Data-Mitgration
```

### Step 3: Copy Game Files
Copy all files from this `CODE` folder into your repo root (overwrite any existing files).

### Step 4: Install & Deploy
```bash
npm install
npm run build
npm run deploy
```

**That's it!** Your game will be live at:  
`https://lexqflh.github.io/Serious-Game---Data-Mitgration/`

---

## File Structure in This Folder

```
CODE/
├── package.json              # Dependencies
├── webpack.config.js         # Build config
├── .babelrc                  # ES6+ support
├── .gitignore                # Git exclusions
├── index.html                # Entry HTML
├── src/
│   ├── index.js             # Game initialization
│   ├── config.js            # All constants & 15 objects
│   ├── engine/
│   │   ├── GameState.js    # State management
│   │   ├── Calculator.js   # All KPI formulas
│   │   └── Utils.js        # Helpers
│   ├── scenes/
│   │   ├── StartScene.js
│   │   ├── StrategyScene.js
│   │   ├── ObjectsScene.js
│   │   ├── TeamSizingScene.js
│   │   └── ResultsScene.js
│   └── styles/
│       └── game.css
└── README.md                # Full documentation
```

---

## What's Implemented

✅ **5 Game Scenes**
- Start: Learning objectives
- Strategy: 4 parameters (Testing, Cleaning, Junior Ratio, Offshore)
- Objects: 15 objects × 3 tool choices
- TeamSizing: Add/remove team members per phase
- Results: Final KPI dashboard

✅ **All Calculations from Tech Spec**
- Workload: Setup + Manual effort × Volume/100K × Complexity
- Duration: Workload / (Team Size × 40) / Productivity
- Cost: With junior/offshore discounts
- KPI Score: Composite (cost + duration)

✅ **Real-Time Features**
- KPI updates instantly as player changes decisions
- Workload breakdown by phase
- Duration estimates per phase
- Cost projections

✅ **Responsive Design**
- Desktop (1200px+)
- Tablet (768px+)
- Mobile (480px+)

---

## Customization (Optional)

### Adjust Effort Factors
Edit `src/config.js`:
- `TOOL_EFFORTS` - Setup and manual hours for each tool
- `COST_RATES` - IT and Functional hourly rates
- `TESTING_EFFORT` - Multipliers for each testing level
- `CLEANING_EFFORT` - Unclean % for each cleaning level

### Adjust UI Colors/Layout
Edit `src/styles/game.css`

### Adjust Game Parameters
All 15 objects, rates, multipliers are in `src/config.js` (well-commented)

---

## Testing Locally (Optional)

If you want to test before deploying:

```bash
npm install
npm run dev
# Opens http://localhost:8080
# Play through all scenes
# Verify calculations match your expectations
```

---

## Deployment to GitHub Pages

### Method 1: Using npm script (Recommended)
```bash
npm run deploy
# Automatically pushes dist/ to gh-pages branch
```

### Method 2: Manual
```bash
npm run build
git add dist -f
git commit -m "Deploy v0.1.0"
git push
# Then enable GitHub Pages in repo settings (Settings → Pages → gh-pages branch)
```

---

## Live URL

Once deployed, your game will be live at:  
**https://lexqflh.github.io/Serious-Game---Data-Mitgration/**

Share this URL with:
- Internal trainers (for onboarding)
- Executives (for testing knowledge)
- Clients (to demonstrate consulting value)

---

## Next Steps

1. **Deploy** (3 min) → `npm install && npm run build && npm run deploy`
2. **Test** (5 min) → Play through all scenes, verify math
3. **Gather Feedback** (ongoing) → Send URL to testers
4. **Plan v0.2.0** (when ready) → Add features, adjust multipliers

---

## Support

All code is well-commented. Key files:
- `src/engine/Calculator.js` - All calculation logic
- `src/config.js` - All constants and object data
- `src/scenes/*.js` - Individual scene logic

Questions? Check the full Tech Spec: `[[02 - Design/Tech Spec.md]]`

---

**Status:** Ready for Production  
**Version:** 0.1.0  
**Framework:** Phaser 3.55+  
**Date Generated:** 2026-05-23  

