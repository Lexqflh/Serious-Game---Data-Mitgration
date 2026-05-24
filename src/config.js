// Game Constants and Data Configuration

// 15 Migration Objects
export const OBJECTS = [
  { id: 'cust', name: 'Customers', complexity: 'Complex', volume: 10750 },
  { id: 'vend', name: 'Vendors', complexity: 'Complex', volume: 4510 },
  { id: 'bom', name: 'Bill of Materials', complexity: 'Complex', volume: 5345 },
  { id: 'matfg', name: 'Material Master (Finished Goods)', complexity: 'Complex', volume: 4620 },
  { id: 'gla', name: 'GL Account', complexity: 'Medium', volume: 5415 },
  { id: 'bs', name: 'Balance Sheets', complexity: 'Medium', volume: 5220 },
  { id: 'bank', name: 'Bank Details', complexity: 'Simple', volume: 4920 },
  { id: 'invq', name: 'Inventory Quantities', complexity: 'Simple', volume: 4645 },
  { id: 'coai', name: 'Customer Open Items', complexity: 'Simple', volume: 4820 },
  { id: 'so', name: 'Sales Orders', complexity: 'Simple', volume: 512 },
  { id: 'pir', name: 'Purchase Info Records', complexity: 'Simple', volume: 5015 },
  { id: 'po', name: 'Purchase Orders', complexity: 'Simple', volume: 530 },
  { id: 'voi', name: 'Vendor Open Items', complexity: 'Simple', volume: 4840 },
  { id: 'pc', name: 'Profit Centers', complexity: 'Simple', volume: 546 },
  { id: 'cc', name: 'Cost Centers', complexity: 'Simple', volume: 481 }
];

// Tool Effort Factors (hours)
export const TOOL_EFFORTS = {
  extraction: {
    BODS: { setup: 80, manual_per_100k: 2 },
    FlatFile: { setup: 20, manual_per_100k: 20 }
  },
  transformation: {
    IDP: { setup: 100, manual_per_100k: 5 },
    Manual: { setup: 10, manual_per_100k: 50 }
  },
  load: {
    Cockpit: { setup: 50, manual_per_100k: 3 },
    ManualLoad: { setup: 5, manual_per_100k: 40 }
  }
};

// Complexity Multipliers
export const COMPLEXITY_MULTIPLIERS = {
  Simple: 1.0,
  Medium: 1.5,
  Complex: 2.0
};

// Strategic Parameters
export const TESTING_EFFORT = {
  Low: { buildMult: 1.0, postMigrationReduct: 1.0 },
  Medium: { buildMult: 1.25, postMigrationReduct: 0.8 },
  High: { buildMult: 1.45, postMigrationReduct: 0.5 }
};

export const CLEANING_EFFORT = {
  Low: { uncleanPercent: 0.25 },
  High: { uncleanPercent: 0.05 }
};

export const JUNIOR_RATIO_PRODUCTIVITY = {
  0: 1.0,
  15: 0.985,
  30: 0.97,
  50: 0.95
};

export const OFFSHORE_PRODUCTIVITY = {
  None: { it: 1.0, functional: 1.0 },
  Partial: { it: 0.97, functional: 1.0 },
  Full: { it: 0.95, functional: 1.0 }
};

// Cost Rates ($/hr)
export const COST_RATES = {
  itSenior: 150,
  itJunior: 90,
  functionalSenior: 120,
  functionalJunior: 72
};

// Cleanup effort per unclean record (minutes)
export const CLEANUP_MINUTES_PER_RECORD = 3;

// Max values for scoring
export const SCORE_REFERENCES = {
  maxCost: 5000000,    // $5M
  maxDuration: 52      // 52 weeks
};

// Default team sizes
export const DEFAULT_TEAM = {
  design: { itPeople: 2, functionalPeople: 2 },
  build: { itPeople: 4, functionalPeople: 2 },
  cutover: { itPeople: 3, functionalPeople: 2 }
};

// UI Colors
export const COLORS = {
  primary: '#667eea',
  secondary: '#764ba2',
  success: '#48bb78',
  danger: '#f56565',
  warning: '#ed8936',
  light: '#f7fafc',
  dark: '#2d3748',
  border: '#cbd5e0'
};

// Learning Objectives
export const LEARNING_OBJECTIVES = [
  '✓ Understand how tool selection (automation vs. manual) affects cutover workload',
  '✓ Recognize volume × complexity trade-offs in effort estimation',
  '✓ Appreciate how testing/cleaning effort upfront reduces post-migration risk',
  '✓ Understand team sizing impact on project duration and cost',
  '✓ Learn why offshore staffing appears cheap but has hidden coordination costs'
];
