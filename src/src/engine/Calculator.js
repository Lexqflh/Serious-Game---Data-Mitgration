// KPI Calculation Engine - All game formulas

import {
  OBJECTS,
  TOOL_EFFORTS,
  COMPLEXITY_MULTIPLIERS,
  TESTING_EFFORT,
  CLEANING_EFFORT,
  JUNIOR_RATIO_PRODUCTIVITY,
  OFFSHORE_PRODUCTIVITY,
  COST_RATES,
  CLEANUP_MINUTES_PER_RECORD,
  SCORE_REFERENCES
} from '../config';

const HOURS_PER_WEEK = 40;

/**
 * Calculate per-object workload (setup + manual effort)
 */
export function calculateObjectWorkload(object, toolChoices) {
  const { extraction, transformation, load } = toolChoices;

  // Setup effort (fixed per tool)
  const setupEffort =
    TOOL_EFFORTS.extraction[extraction].setup +
    TOOL_EFFORTS.transformation[transformation].setup +
    TOOL_EFFORTS.load[load].setup;

  // Manual effort (scales with volume and complexity)
  const volumeScaler = object.volume / 100000;
  const complexityMult = COMPLEXITY_MULTIPLIERS[object.complexity];

  const manualEffort = (
    TOOL_EFFORTS.extraction[extraction].manual_per_100k * volumeScaler +
    TOOL_EFFORTS.transformation[transformation].manual_per_100k * volumeScaler +
    TOOL_EFFORTS.load[load].manual_per_100k * volumeScaler
  ) * complexityMult;

  return {
    setup: setupEffort,
    manual: manualEffort,
    total: setupEffort + manualEffort
  };
}

/**
 * Calculate total workload for each phase
 */
export function calculatePhaseWorkloads(gameState) {
  const workloads = {
    design: { it: 0, functional: 0, total: 0 },
    build: { it: 0, functional: 0, total: 0 },
    cutover: { it: 0, functional: 0, total: 0 }
  };

  // Calculate base workload from all objects
  let baseBuildWorkload = 0;
  gameState.objects.forEach(object => {
    const toolChoices = {
      extraction: object.extraction,
      transformation: object.transformation,
      load: object.load
    };
    const objWorkload = calculateObjectWorkload(object, toolChoices);
    baseBuildWorkload += objWorkload.total;
  });

  // Design Workload = Build Workload (same hours)
  workloads.design.it = baseBuildWorkload * 0.6;
  workloads.design.functional = baseBuildWorkload * 0.4;
  workloads.design.total = baseBuildWorkload;

  // Build Workload (with Testing multiplier)
  const testingMult = TESTING_EFFORT[gameState.strategic.testingEffort].buildMult;
  workloads.build.it = baseBuildWorkload * 0.7 * testingMult;
  workloads.build.functional = baseBuildWorkload * 0.3 * testingMult;
  workloads.build.total = workloads.build.it + workloads.build.functional;

  // Cutover Workload
  const testingReduction = TESTING_EFFORT[gameState.strategic.testingEffort].postMigrationReduct;
  const cleaningData = CLEANING_EFFORT[gameState.strategic.cleaningEffort];

  // IT: Manual effort × 2 runs × testing reduction
  workloads.cutover.it = (baseBuildWorkload * 0.7) * 2 * testingReduction;

  // Functional: Post-migration cleanup (3 min per unclean record)
  let totalUncleanRecords = 0;
  gameState.objects.forEach(object => {
    totalUncleanRecords += object.volume * cleaningData.uncleanPercent;
  });
  const cleanupMinutes = totalUncleanRecords * CLEANUP_MINUTES_PER_RECORD;
  workloads.cutover.functional = cleanupMinutes / 60; // Convert to hours

  workloads.cutover.total = workloads.cutover.it + workloads.cutover.functional;

  return workloads;
}

/**
 * Calculate duration for a phase
 */
export function calculatePhaseDuration(phaseWorkload, teamSize, juniorRatio, offshorePolicy, isITTeam) {
  if (teamSize === 0) return 999; // Avoid division by zero

  // Productivity factors
  const juniorProductivity = JUNIOR_RATIO_PRODUCTIVITY[juniorRatio];
  const offshoreProductivity = isITTeam
    ? OFFSHORE_PRODUCTIVITY[offshorePolicy].it
    : OFFSHORE_PRODUCTIVITY[offshorePolicy].functional;

  const totalProductivity = juniorProductivity * offshoreProductivity;

  // Duration = Workload / (Team Size * Hours Per Week) / Productivity
  const durationWeeks = phaseWorkload / (teamSize * HOURS_PER_WEEK) / totalProductivity;

  return Math.max(durationWeeks, 0.5); // Minimum 0.5 weeks
}

/**
 * Calculate total project duration
 */
export function calculateTotalDuration(gameState, workloads) {
  const durations = {
    design: {
      it: calculatePhaseDuration(
        workloads.design.it,
        gameState.team.design.itPeople,
        gameState.strategic.juniorRatio,
        gameState.strategic.offshorePolicy,
        true
      ),
      functional: calculatePhaseDuration(
        workloads.design.functional,
        gameState.team.design.functionalPeople,
        gameState.strategic.juniorRatio,
        gameState.strategic.offshorePolicy,
        false
      )
    },
    build: {
      it: calculatePhaseDuration(
        workloads.build.it,
        gameState.team.build.itPeople,
        gameState.strategic.juniorRatio,
        gameState.strategic.offshorePolicy,
        true
      ),
      functional: calculatePhaseDuration(
        workloads.build.functional,
        gameState.team.build.functionalPeople,
        gameState.strategic.juniorRatio,
        gameState.strategic.offshorePolicy,
        false
      )
    },
    cutover: {
      it: calculatePhaseDuration(
        workloads.cutover.it,
        gameState.team.cutover.itPeople,
        gameState.strategic.juniorRatio,
        gameState.strategic.offshorePolicy,
        true
      ),
      functional: calculatePhaseDuration(
        workloads.cutover.functional,
        gameState.team.cutover.functionalPeople,
        gameState.strategic.juniorRatio,
        gameState.strategic.offshorePolicy,
        false
      )
    }
  };

  // Each phase's duration is the MAX of IT and Functional (parallel work)
  return {
    design: Math.max(durations.design.it, durations.design.functional),
    build: Math.max(durations.build.it, durations.build.functional),
    cutover: Math.max(durations.cutover.it, durations.cutover.functional),
    total:
      Math.max(durations.design.it, durations.design.functional) +
      Math.max(durations.build.it, durations.build.functional) +
      Math.max(durations.cutover.it, durations.cutover.functional),
    breakdown: durations // For detailed view
  };
}

/**
 * Calculate cost for a phase
 */
export function calculatePhaseCost(phaseWorkload, teamIT, teamFunctional, juniorRatio, offshorePolicy) {
  const juniorPercent = juniorRatio / 100;
  const seniorPercent = 1 - juniorPercent;

  // IT rate (affected by offshore)
  let itRate = 0;
  if (offshorePolicy === 'None') {
    itRate = (COST_RATES.itSenior * seniorPercent) + (COST_RATES.itJunior * juniorPercent);
  } else if (offshorePolicy === 'Partial') {
    const onshoreRate = (COST_RATES.itSenior * seniorPercent) + (COST_RATES.itJunior * juniorPercent);
    itRate = (onshoreRate * 0.7) + (onshoreRate * 0.3 * 0.6); // 30% offshore at reduced rate
  } else {
    // Full offshore
    itRate = (COST_RATES.itSenior * 0.6) + (COST_RATES.itJunior * 0.6);
  }

  // Functional rate (no offshore impact)
  const functionalRate = (COST_RATES.functionalSenior * seniorPercent) + (COST_RATES.functionalJunior * juniorPercent);

  // Workload split (IT vs Functional)
  const workloadIT = phaseWorkload * 0.65;
  const workloadFunctional = phaseWorkload * 0.35;

  const itCost = workloadIT * itRate;
  const functionalCost = workloadFunctional * functionalRate;

  return {
    it: itCost,
    functional: functionalCost,
    total: itCost + functionalCost
  };
}

/**
 * Calculate total project cost
 */
export function calculateTotalCost(gameState, workloads) {
  const designCost = calculatePhaseCost(
    workloads.design.total,
    gameState.team.design.itPeople,
    gameState.team.design.functionalPeople,
    gameState.strategic.juniorRatio,
    gameState.strategic.offshorePolicy
  );

  const buildCost = calculatePhaseCost(
    workloads.build.total,
    gameState.team.build.itPeople,
    gameState.team.build.functionalPeople,
    gameState.strategic.juniorRatio,
    gameState.strategic.offshorePolicy
  );

  const cutoverCost = calculatePhaseCost(
    workloads.cutover.total,
    gameState.team.cutover.itPeople,
    gameState.team.cutover.functionalPeople,
    gameState.strategic.juniorRatio,
    gameState.strategic.offshorePolicy
  );

  return {
    design: designCost.total,
    build: buildCost.total,
    cutover: cutoverCost.total,
    total: designCost.total + buildCost.total + cutoverCost.total
  };
}

/**
 * Calculate composite KPI score (lower is better)
 */
export function calculateScore(totalCost, totalDuration) {
  const costNormalized = totalCost / SCORE_REFERENCES.maxCost;
  const durationNormalized = totalDuration / SCORE_REFERENCES.maxDuration;
  const score = (costNormalized * 0.5) + (durationNormalized * 0.5);
  return Math.min(score, 1.0); // Cap at 1.0
}

/**
 * Master update function - calculates all KPIs
 */
export function updateKPIs(gameState) {
  const workloads = calculatePhaseWorkloads(gameState);
  const durations = calculateTotalDuration(gameState, workloads);
  const costs = calculateTotalCost(gameState, durations);
  const score = calculateScore(costs.total, durations.total);

  return {
    workload: workloads,
    duration: durations,
    cost: costs,
    kpis: {
      cost: Math.round(costs.total),
      duration: Math.round(durations.total * 10) / 10,
      score: Math.round(score * 100) / 100
    }
  };
}
