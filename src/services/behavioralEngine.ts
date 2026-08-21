/**
 * AdoptIQ.ai Behavioral Intelligence Engine
 * 
 * Implements the core behavioral reasoning layer:
 * INPUT -> SIGNAL UNDERSTANDING -> BEHAVIORAL ANALYSIS -> ADOPT STAGE DIAGNOSIS 
 * -> ROOT CAUSE -> AI SYNTHESIS -> PRIORITIZED INITIATIVES -> GENERATED SOLUTION -> MEASUREMENT PLAN
 */

export type AdoptStageKey = 'AWARE' | 'DESIRE' | 'OPEN' | 'PROFICIENT' | 'TRANSFORM';
export type ReportMode = 'hypothesis' | 'diagnostic' | 'intelligence';
export type SignalSource = 'OBSERVED' | 'REPORTED' | 'CONTEXTUAL' | 'INFERRED' | 'MISSING';
export type EvidenceStrength = 'Strong' | 'Medium' | 'Preliminary';
export type PriorityLevel = 'P0' | 'P1' | 'P2';
export type SolutionType = 'ux_intervention' | 'campaign' | 'onboarding' | 'champion_program' | 'prompt_workflow';

export interface SignalItem {
  id: string;
  name: string;
  value: string | number | null;
  source: SignalSource;
  confidence: number;
  category: 'telemetry' | 'feedback' | 'context' | 'journey';
  rawSnippet?: string;
}

export interface ExtractedContext {
  product: string | null;
  feature: string | null;
  persona: string;
  organization: string | null;
  industry: string | null;
  adoptionGoal: string | null;
  observedProblem: string;
  previousInterventions: string[];
  metrics: {
    awarenessRate?: number | null;
    trialRate?: number | null;
    desireRate?: number | null;
    openBounceRate?: number | null;
    activationRate?: number | null;
    firstValueTime?: string | null;
    taskAbandonmentRate?: number | null;
    taskSuccessRate?: number | null;
    repeatUseRate?: number | null;
    wauRate?: number | null;
    mauRate?: number | null;
    transformRate?: number | null;
    retentionD7?: number | null;
    retentionD30?: number | null;
    eligiblePopulation?: number | null;
  };
  qualitativeFeedback: string[];
  userComplaints: string[];
  positiveSignals: string[];
  knownConstraints: string[];
  missingInformation: string[];
}

export type StageRole =
  | 'HEALTHY UPSTREAM'
  | 'WATCH'
  | 'PRIMARY FOCUS'
  | 'SECONDARY CONSTRAINT'
  | 'DOWNSTREAM EFFECT'
  | 'INSUFFICIENT EVIDENCE';

export interface StageHealthItem {
  stage: AdoptStageKey;
  letter: string;
  name: string;
  score: number | null; // null if insufficient evidence
  status: 'healthy' | 'watch' | 'at_risk' | 'critical' | 'insufficient_evidence';
  role: StageRole;
  roleLabel: string;
  percentageString: string;
  insightText: string;
  specificMeaning: string;
  isBottleneck: boolean;
  isSecondary: boolean;
  evidenceAvailable: boolean;
  signalsSupporting: SignalItem[];
  behavioralInterpretation: string;
  failureMechanism: string;
  suggestedMetrics: string[];
}

export interface LargestBehavioralDrop {
  fromStage: AdoptStageKey;
  toStage: AdoptStageKey;
  delta: number;
  explanation: string;
}

export interface BehavioralRootCause {
  id: string;
  code: string; // e.g. "RC01", "RC02"
  cause: string;
  explanation: string;
  evidence: string[];
  adoptImpact: AdoptStageKey;
  evidenceStrength: EvidenceStrength;
  mechanism: string;
  supportingSignalsCount: number;
}

export interface MeasurementPlan {
  primaryMetric: { name: string; baseline: string; target: string };
  leadingIndicators: string[];
  behavioralMetric: string;
  laggingMetric: string;
  guardrails: string[];
}

export interface WireframeSpec {
  componentName: string;
  badge: string;
  headline: string;
  subheadline: string;
  contextItems: string[];
  actionOptions: { label: string; description?: string; isPrimary?: boolean; icon?: string }[];
  primaryCtaText: string;
  verificationBadge?: { label: string; status: 'verified' | 'suggested' | 'caution'; detail: string };
  interactiveStateExample: string;
}

export interface SolutionAssetSpec {
  conceptTitle: string;
  behavioralObjective: string;
  trigger: string;
  solutionType: SolutionType;
  journeySteps: { step: number; title: string; description: string }[];
  wireframe?: WireframeSpec;
  states: { name: string; description: string }[];
  interactionLogic: string[];
  exampleCopy: { element: string; text: string }[];
  edgeCases: string[];
  instrumentationEvents: { eventName: string; trigger: string; properties: string[] }[];
  successCriteria: string[];
  campaignCadence?: { day: string; channel: string; subject: string; message: string; cta: string }[];
  codeSnippet?: { language: string; filename: string; code: string };
}

export interface RecommendationInitiative {
  id: string;
  priority: PriorityLevel;
  priorityLabel: string; // e.g. "01 — P0"
  isPrimaryHero: boolean;
  heroBadge: string; // e.g. "P0 · START HERE"
  title: string;
  shortDescription: string;
  targetedStages: AdoptStageKey[];
  whyThis: string;
  whyThisFirst: string;
  behaviorToChange: string;
  movesStage: string;
  successMetric: string;
  rootCauseRef: string; // e.g. "RC01"
  rootCauseBadge: string; // e.g. "Addresses RC01"
  behavioralObjective: string;
  impact: 'High' | 'Medium' | 'Low';
  effort: 'Low' | 'Medium' | 'High';
  evidenceStrength: EvidenceStrength;
  priorityScore: number;
  solutionType: SolutionType;
  isPlaybookMatch?: boolean;
  playbookTitle?: string;
  whyRecommendedChain?: {
    observedEvidence: string;
    behavioralRootCause: string;
    adoptStage: string;
    targetBehavior: string;
    chosenIntervention: string;
  };
  generatedAsset?: any;
  priorityTier?: string;
  impactBarValue?: number;
  reasoningChain: {
    evidence: string;
    behavioralCause: string;
    adoptStage: AdoptStageKey;
    targetBehavior: string;
    intervention: string;
  };
  measurementPlan: MeasurementPlan;
  solutionAsset: SolutionAssetSpec;
}

export interface BusinessOutcome {
  metricLabel: string;
  currentValue: string;
  targetValue: string;
  projectedLift: string;
  directionalImpact: string;
  benchmarkRange: string;
  estimationRationale: string;
}

export interface StrategyBridge {
  headline: string;
  description: string;
  threeStepArc: string[];
}

export interface NorthStarMetric {
  title: string;
  label: string;
  baseline: string;
  target: string;
  lift: string;
  supportingMetrics: { label: string; target: string; rationale: string }[];
}

export interface PrimaryDiagnosisSynthesis {
  title: string;
  primaryStage: AdoptStageKey;
  secondaryStage: AdoptStageKey | null;
  healthyStages: AdoptStageKey[];
  summary: string;
  behavioralBarrier: string;
  barrierProvenance: 'User evidence' | 'Synthesized user mindset';
  userQuote: string | null;
  confidenceScore: number;
  confidenceLevel: 'preliminary' | 'moderate' | 'strong' | 'high';
  confidenceLabel: string; // e.g. "High · 86%"
  confidenceBreakdown: {
    completeness: number; // max 25
    quantitative: number; // max 20
    qualitative: number; // max 15
    consistency: number; // max 15
    differentiation: number; // max 15
    sourceReliability: number; // max 10
  };
  confidenceReasons: string[];
  competingStagesEvaluated: {
    stage: AdoptStageKey;
    probability: number;
    rejectionReason: string;
  }[];
}

export interface MissingEvidenceItem {
  metricOrSignal: string;
  rationale: string;
  howItHelps: string;
}

export interface BehavioralDiagnosisResult {
  reportMode: ReportMode;
  context: ExtractedContext;
  signals: SignalItem[];
  dashboardTitle: string;
  primaryDiagnosis: PrimaryDiagnosisSynthesis;
  strategyBridge: StrategyBridge;
  stageHealth: Record<AdoptStageKey, StageHealthItem>;
  healthScoresList: StageHealthItem[];
  largestBehavioralDrop: LargestBehavioralDrop | null;
  rootCauses: BehavioralRootCause[];
  initiatives: RecommendationInitiative[];
  outcomes: BusinessOutcome[];
  northStarMetric: NorthStarMetric;
  missingEvidence: MissingEvidenceItem[];
  contraindicatedInterventions: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// KNOWLEDGE BASE & BEHAVIORAL TAXONOMY
// ─────────────────────────────────────────────────────────────────────────────

export const ADOPT_META: Record<AdoptStageKey, {
  letter: string;
  name: string;
  question: string;
  failureName: string;
  coreMechanisms: string[];
  typicalSignals: string[];
  standardMetrics: string[];
}> = {
  AWARE: {
    letter: 'A',
    name: 'Aware',
    question: 'Do users know the capability exists and recognize when it is relevant?',
    failureName: 'Discovery Breakdown',
    coreMechanisms: ['Attentional blindness', 'Information overload', 'Poor contextual discovery', 'Low mental availability'],
    typicalSignals: ['Low feature discovery', 'Low exposure rate', 'Weak announcement reach', 'Users say they did not know it existed'],
    standardMetrics: ['Reach %', 'Discovery rate', 'Eligible → Exposed %', 'Time to discovery'],
  },
  DESIRE: {
    letter: 'D',
    name: 'Desire',
    question: 'Do users believe changing their behavior is worth it?',
    failureName: 'Motivation Breakdown',
    coreMechanisms: ['Status quo bias', 'Unclear perceived value / ROI', 'Switching-cost perception', 'Weak social proof', 'Uncertain outcome'],
    typicalSignals: ['High awareness but low trial', 'Users say "I don\'t see why I need this"', 'Preference for manual baseline', 'Ambiguous ROI'],
    standardMetrics: ['Aware → Interested %', 'Interested → Try %', 'CTA engagement', 'Intent-to-use rate', 'Trial start rate'],
  },
  OPEN: {
    letter: 'O',
    name: 'Open',
    question: 'Once users want to try the product, can they successfully begin?',
    failureName: 'Activation Breakdown',
    coreMechanisms: ['Cognitive overload', 'Choice overload', 'Blank-canvas anxiety', 'Setup friction', 'Commitment cost'],
    typicalSignals: ['Users intend to start but abandon', 'Setup drop-off', 'Blank canvas dread', '"I don\'t know where to start"'],
    standardMetrics: ['Setup completion %', 'First-action completion %', 'Onboarding abandonment %', 'Time to first value (TTFV)'],
  },
  PROFICIENT: {
    letter: 'P',
    name: 'Proficient',
    question: 'Can users repeatedly achieve a useful outcome with enough confidence for the behavior to continue?',
    failureName: 'Mastery & Habituation Breakdown',
    coreMechanisms: ['Low self-efficacy', 'Prompt/skill literacy gap', 'Verification burden', 'Unreliable outputs', 'Lack of habit cues', 'Weak workflow integration'],
    typicalSignals: ['Users try once but do not return', 'High task abandonment', 'Unpredictable output feedback', 'Reverting to manual work', 'Low WAU/MAU'],
    standardMetrics: ['Task success rate', 'Repeat-use rate (D7/D30)', 'WAU/MAU ratio', 'Output acceptance rate', 'Manual fallback rate'],
  },
  TRANSFORM: {
    letter: 'T',
    name: 'Transform',
    question: 'Has successful individual behavior become scalable organizational behavior?',
    failureName: 'Scale & Advocacy Breakdown',
    coreMechanisms: ['Weak social reinforcement', 'Knowledge silos', 'Missing shared template infrastructure', 'Weak managerial reinforcement'],
    typicalSignals: ['Power users exist but usage is siloed', 'Teams reinvent workflows', 'No template reuse', 'Inconsistent adoption across departments'],
    standardMetrics: ['Workflow sharing rate', 'Template reuse count', 'Cross-team adoption multiplier', 'Champion influence rate'],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// PARSING & SIGNAL EXTRACTION ENGINE
// ─────────────────────────────────────────────────────────────────────────────

export function extractContextFromInput(rawInput: string): ExtractedContext {
  const inputLower = rawInput.toLowerCase();

  // Strict Variable Passing: If user does not explicitly name the product, product MUST be null
  let product: string | null = null;
  if (inputLower.includes('copilot')) product = 'Copilot';
  else if (inputLower.includes('salesforce')) product = 'Salesforce';
  else if (inputLower.includes('slack')) product = 'Slack';
  else if (inputLower.includes('teams') || inputLower.includes('ms teams')) product = 'Microsoft Teams';
  else if (inputLower.includes('jira')) product = 'Jira';
  else if (inputLower.includes('notion')) product = 'Notion';
  else if (inputLower.includes('chatgpt')) product = 'ChatGPT';
  else if (inputLower.includes('gemini')) product = 'Gemini';
  else if (inputLower.includes('claude')) product = 'Claude';

  // Detect persona (match exact persona keywords with high priority)
  let persona = 'Users';
  if (inputLower.includes('finance manager') || inputLower.includes('financial manager')) persona = 'Finance Managers';
  else if (inputLower.includes('product manager') || inputLower.includes('pm')) persona = 'Product Managers';
  else if (inputLower.includes('engineering manager') || inputLower.includes('eng manager')) persona = 'Engineering Managers';
  else if (inputLower.includes('commercial underwriter') || inputLower.includes('underwriter')) persona = 'Commercial Underwriters';
  else if (inputLower.includes('sales rep') || inputLower.includes('sales representative') || inputLower.includes('account executive') || inputLower.includes('ae')) persona = 'Sales Representatives';
  else if (inputLower.includes('devops') || inputLower.includes('site reliability') || inputLower.includes('sre')) persona = 'DevOps Engineers';
  else if (inputLower.includes('software engineer') || inputLower.includes('developer') || inputLower.includes('dev')) persona = 'Software Engineers';
  else if (inputLower.includes('support agent') || inputLower.includes('cx rep') || inputLower.includes('customer success')) persona = 'Support Agents';
  else if (inputLower.includes('marketing') || inputLower.includes('content creator')) persona = 'Marketing Specialists';
  else if (inputLower.includes('finance') || inputLower.includes('accounting')) persona = 'Finance Analysts';
  else if (inputLower.includes('manager') || inputLower.includes('leader')) persona = 'Team Managers';

  // Quantitative Funnel Counts & Percentages Extraction
  const metrics: ExtractedContext['metrics'] = {};

  let eligibleCount: number | null = null;
  let exposedCount: number | null = null;
  let clickedCount: number | null = null;
  let completedCount: number | null = null;
  let activeCount: number | null = null;

  // 1. Total Eligible / Population / Initial Audience
  const eligibleMatch = rawInput.match(/(\d{1,3}(?:,\d{3})+|\d+)\s*(?:initial\s+audience|total\s+audience|target\s+audience|employees|users|seats|licenses|eligible|people|members|total)/i) ||
    rawInput.match(/(?:initial\s+audience|total\s+audience|eligible|total|population|audience)\s*(?:is|at|=|:)?\s*(\d{1,3}(?:,\d{3})+|\d+)/i);
  if (eligibleMatch) eligibleCount = parseInt(eligibleMatch[1].replace(/,/g, ''), 10);

  // 2. Exposed / Opened / Saw / Aware / Viewers Count
  const exposedMatch = rawInput.match(/(\d{1,3}(?:,\d{3})+|\d+)\s*(?:viewers|opened|saw|exposed|viewed|aware|received|visited|reached|discovered)/i) ||
    rawInput.match(/(?:viewers|opened|saw|exposed|viewed|aware|received|visited|reached|discovered)\s*(?:by|at|=|:)?\s*(\d{1,3}(?:,\d{3})+|\d+)/i);
  if (exposedMatch) exposedCount = parseInt(exposedMatch[1].replace(/,/g, ''), 10);

  // 3. Clicked / Tried / Started / Intent Count
  const clickedMatch = rawInput.match(/(\d{1,3}(?:,\d{3})+|\d+)\s*(?:clicked|tried|started|attempted|opted|signed\s*up|intent|conversion)/i) ||
    rawInput.match(/(?:clicked|tried|started|attempted|opted|signed\s*up|intent)\s*(?:by|at|=|:)?\s*(\d{1,3}(?:,\d{3})+|\d+)/i);
  if (clickedMatch) clickedCount = parseInt(clickedMatch[1].replace(/,/g, ''), 10);

  // 4. Completed Setup / Onboarded / Activators Count
  const completedMatch = rawInput.match(/(\d{1,3}(?:,\d{3})+|\d+)\s*(?:activators|completed\s+setup|completed\s+onboarding|setup|onboarded|first-run|first run|started|activated|tutorial\s+completers)/i) ||
    rawInput.match(/(?:activators|completed\s+setup|completed\s+onboarding|activated|setup)\s*(?:is|at|=|:)?\s*(\d{1,3}(?:,\d{3})+|\d+)/i);
  if (completedMatch) completedCount = parseInt(completedMatch[1].replace(/,/g, ''), 10);

  // 5. Active / Repeat Users Count
  const activeMatch = rawInput.match(/(\d{1,3}(?:,\d{3})+|\d+)\s*(?:active|weekly|daily|regular|recurring|wau)/i);
  if (activeMatch) activeCount = parseInt(activeMatch[1].replace(/,/g, ''), 10);

  if (eligibleCount) metrics.eligiblePopulation = eligibleCount;

  // Complete the Math (Chain-of-Thought Funnel Calculations)
  if (exposedCount !== null && eligibleCount !== null && eligibleCount > 0) {
    metrics.awarenessRate = Math.round((exposedCount / eligibleCount) * 100);
  }
  if (clickedCount !== null && exposedCount !== null && exposedCount > 0) {
    metrics.desireRate = Math.round((clickedCount / exposedCount) * 1000) / 10;
  } else if (clickedCount !== null && eligibleCount !== null && eligibleCount > 0 && exposedCount === null) {
    metrics.trialRate = Math.round((clickedCount / eligibleCount) * 1000) / 10;
  }
  if (completedCount !== null) {
    const denom = clickedCount || exposedCount || eligibleCount;
    if (denom && denom > 0) {
      metrics.trialRate = Math.round((completedCount / denom) * 1000) / 10;
    }
  }
  if (activeCount !== null && (completedCount !== null || clickedCount !== null || exposedCount !== null)) {
    const denom = completedCount || clickedCount || exposedCount!;
    metrics.wauRate = Math.round((activeCount / denom) * 100);
  }

  // Explicit Percentage Overrides if present in prompt
  const awareMatch = rawInput.match(/(\d+(?:\.\d+)?)\s*%\s*(?:are\s+)?aware/i) || rawInput.match(/awareness\s*(?:is|at|=)?\s*(\d+(?:\.\d+)?)\s*%/i) || rawInput.match(/(\d+(?:\.\d+)?)\s*%\s*(?:know\s+about|heard\s+of|discovered|viewers)/i);
  if (awareMatch) metrics.awarenessRate = parseFloat(awareMatch[1]);

  // Deficit / Unaware / Drop-off Telemetry Math (e.g. "85% have never visited" -> 15% aware)
  const unawareMatch = rawInput.match(/(\d+(?:\.\d+)?)\s*%\s*(?:have\s+never\s+visited|don't\s+know|do\s+not\s+know|have\s+never\s+heard|unaware|never\s+visited|never\s+heard|never\s+know|lack\s+awareness|have\s+never\s+used|never\s+used|never\s+logged|unexposed)/i) ||
    rawInput.match(/(\d+(?:\.\d+)?)\s*%\s*(?:have\s+never\s+visited\s+or\s+know\s+it\s+exists)/i) ||
    rawInput.match(/(\d+(?:\.\d+)?)\s*%\s*(?:are\s+unaware|unaware\s+of)/i);
  if (unawareMatch && metrics.awarenessRate === undefined) {
    metrics.awarenessRate = Math.max(0, 100 - parseFloat(unawareMatch[1]));
  }

  const desireMatch = rawInput.match(/(\d+(?:\.\d+)?)\s*%\s*(?:desire|want\s+to\s+use|motivated|intent|clicked|click-through|ctr)/i) || rawInput.match(/desire\s*(?:is|at|=)?\s*(\d+(?:\.\d+)?)\s*%/i);
  if (desireMatch) metrics.desireRate = parseFloat(desireMatch[1]);

  const openBounceMatch = rawInput.match(/(\d+(?:\.\d+)?)\s*%\s*(?:bounce|drop|drop-off|drop off|abandon|leave|fail)\s*(?:during|in|on)?\s*(?:first-run|setup|onboarding|sign-up|start|trial|tutorial)/i) || rawInput.match(/(?:bounce|drop-off|drop off|abandonment)\s*(?:during|in|on)?\s*(?:first-run|setup|onboarding|tutorial)\s*(?:is|at|=)?\s*(\d+(?:\.\d+)?)\s*%/i);
  if (openBounceMatch) metrics.openBounceRate = parseFloat(openBounceMatch[1]);

  const trialMatch = rawInput.match(/(\d+(?:\.\d+)?)\s*%\s*(?:have\s+)?(?:tried|setup|onboarded|activated|activators|first-run|first run|completed\s+setup)/i) || rawInput.match(/(?:trial|setup|onboarding|activation)\s*(?:is|at|=)?\s*(\d+(?:\.\d+)?)\s*%/i) || rawInput.match(/(\d+(?:\.\d+)?)\s*%\s*(?:signed\s+up|opened|completed\s+setup)/i);
  if (trialMatch) metrics.trialRate = parseFloat(trialMatch[1]);

  const wauMatch = rawInput.match(/wau\s*(?:is|at|=)?\s*(\d+(?:\.\d+)?)\s*%/i) || rawInput.match(/(\d+(?:\.\d+)?)\s*%\s*wau/i) || rawInput.match(/(\d+(?:\.\d+)?)\s*%\s*(?:weekly\s+active|weekly\s+usage|daily\s+active)/i);
  if (wauMatch) metrics.wauRate = parseFloat(wauMatch[1]);

  const abandonMatch = rawInput.match(/abandonment\s*(?:is|at|=)?\s*(\d+(?:\.\d+)?)\s*%/i) || rawInput.match(/(\d+(?:\.\d+)?)\s*%\s*task\s+abandonment/i) || rawInput.match(/(\d+(?:\.\d+)?)\s*%\s*(?:abandon|quit|give\s+up)\s*(?:during|mid-task|in\s+workflow)/i);
  if (abandonMatch) metrics.taskAbandonmentRate = parseFloat(abandonMatch[1]);

  const transformMatch = rawInput.match(/(\d+(?:\.\d+)?)\s*%\s*(?:share|sharing|templates?|champions?|advocates?)/i) || rawInput.match(/template\s*(?:sharing|adoption)\s*(?:is|at|=)?\s*(\d+(?:\.\d+)?)\s*%/i);
  if (transformMatch) metrics.transformRate = parseFloat(transformMatch[1]);

  // Extract previous interventions
  const previousInterventions: string[] = [];
  if (inputLower.includes('training') || inputLower.includes('trained')) previousInterventions.push('General User Training');
  if (inputLower.includes('communication') || inputLower.includes('announcement') || inputLower.includes('emails')) previousInterventions.push('Executive Communications & Announcements');
  if (inputLower.includes('webinar') || inputLower.includes('workshop')) previousInterventions.push('Interactive Workshops');
  if (inputLower.includes('documentation') || inputLower.includes('guide')) previousInterventions.push('Help Documentation & Guides');

  // Extract user quotes or complaints
  const userComplaints: string[] = [];
  const qualitativeFeedback: string[] = [];

  if (inputLower.includes('unpredictable') || inputLower.includes('accuracy') || inputLower.includes('hallucinat') || inputLower.includes('wrong output')) {
    userComplaints.push('Outputs lack predictable accuracy and reliability');
    qualitativeFeedback.push('Users report difficulty validating AI-generated results safely');
  }
  if (inputLower.includes('manual') || inputLower.includes('prefer doing') || inputLower.includes('revert')) {
    userComplaints.push('Users prefer completing tasks manually rather than correcting AI');
    qualitativeFeedback.push('Manual fallback is perceived as faster than prompt iteration');
  }
  if (inputLower.includes('don\'t see why') || inputLower.includes('roi') || inputLower.includes('no value')) {
    userComplaints.push('Ambiguous value proposition / unclear ROI');
  }
  if (inputLower.includes('don\'t know where to start') || inputLower.includes('blank') || inputLower.includes('setup')) {
    userComplaints.push('Blank-canvas friction and setup ambiguity');
  }
  if (inputLower.includes('silo') || inputLower.includes('share') || inputLower.includes('isolated')) {
    userComplaints.push('Workflows remain isolated without cross-team template sharing');
  }

  // Detect missing information
  const missingInformation: string[] = [];
  if (metrics.taskSuccessRate === undefined) missingInformation.push('Task success rate by persona');
  if (metrics.retentionD7 === undefined) missingInformation.push('Day-7 repeat usage rate');
  if (metrics.firstValueTime === undefined) missingInformation.push('Time to first meaningful value');
  if (metrics.trialRate === undefined && metrics.wauRate !== undefined) missingInformation.push('Initial trial / first-run rate');

  return {
    product,
    feature: null,
    persona,
    organization: metrics.eligiblePopulation ? `${metrics.eligiblePopulation.toLocaleString()} Seats Enterprise` : null,
    industry: persona === 'Sales Representatives' ? 'B2B Enterprise' : null,
    adoptionGoal: 'Transition casual trial into recurring daily workflow integration',
    observedProblem: rawInput.trim(),
    previousInterventions,
    metrics,
    qualitativeFeedback,
    userComplaints,
    positiveSignals: metrics.awarenessRate && metrics.awarenessRate > 80 ? ['High baseline awareness across organization'] : [],
    knownConstraints: previousInterventions.length > 0 ? [`Already completed: ${previousInterventions.join(', ')}`] : [],
    missingInformation,
  };
}

export function extractSignals(context: ExtractedContext, rawInput: string): SignalItem[] {
  const signals: SignalItem[] = [];

  if (context.metrics.awarenessRate !== undefined && context.metrics.awarenessRate !== null) {
    signals.push({
      id: 'sig-aware',
      name: 'Feature Awareness',
      value: `${context.metrics.awarenessRate}%`,
      source: 'OBSERVED',
      confidence: 95,
      category: 'telemetry',
      rawSnippet: `${context.metrics.awarenessRate}% awareness`,
    });
  }

  if (context.metrics.trialRate !== undefined && context.metrics.trialRate !== null) {
    signals.push({
      id: 'sig-trial',
      name: 'Initial Feature Trial',
      value: `${context.metrics.trialRate}%`,
      source: 'OBSERVED',
      confidence: 92,
      category: 'telemetry',
      rawSnippet: `${context.metrics.trialRate}% tried`,
    });
  }

  if (context.metrics.wauRate !== undefined && context.metrics.wauRate !== null) {
    signals.push({
      id: 'sig-wau',
      name: 'Weekly Active Usage (WAU)',
      value: `${context.metrics.wauRate}%`,
      source: 'OBSERVED',
      confidence: 94,
      category: 'telemetry',
      rawSnippet: `WAU ${context.metrics.wauRate}%`,
    });
  }

  if (context.metrics.taskAbandonmentRate !== undefined && context.metrics.taskAbandonmentRate !== null) {
    signals.push({
      id: 'sig-abandon',
      name: 'Task Abandonment Rate',
      value: `${context.metrics.taskAbandonmentRate}%`,
      source: 'OBSERVED',
      confidence: 90,
      category: 'telemetry',
      rawSnippet: `${context.metrics.taskAbandonmentRate}% task abandonment`,
    });
  }

  context.userComplaints.forEach((complaint, idx) => {
    signals.push({
      id: `sig-complaint-${idx}`,
      name: 'Reported User Friction',
      value: complaint,
      source: 'REPORTED',
      confidence: 85,
      category: 'feedback',
    });
  });

  context.previousInterventions.forEach((prev, idx) => {
    signals.push({
      id: `sig-prev-${idx}`,
      name: 'Prior Intervention Attempted',
      value: prev,
      source: 'CONTEXTUAL',
      confidence: 90,
      category: 'context',
    });
  });

  if (signals.length === 0) {
    // Minimal freeform input -> Inferred signals
    signals.push({
      id: 'sig-inferred-problem',
      name: 'Observed Friction Description',
      value: rawInput.slice(0, 80),
      source: 'REPORTED',
      confidence: 60,
      category: 'feedback',
    });
  }

  return signals;
}

// ─────────────────────────────────────────────────────────────────────────────
// BEHAVIORAL REASONING & 5-STAGE HEALTH EVALUATION
// ─────────────────────────────────────────────────────────────────────────────

export function determineReportMode(context: ExtractedContext, signals: SignalItem[], rawInput: string): ReportMode {
  const quantCount = signals.filter(s => s.source === 'OBSERVED').length;
  const qualCount = signals.filter(s => s.source === 'REPORTED').length;
  const wordCount = rawInput.trim().split(/\s+/).length;

  if (quantCount >= 2 || (quantCount >= 1 && qualCount >= 1) || context.metrics.eligiblePopulation) {
    return 'intelligence'; // Mode C
  }

  if (quantCount >= 1 || qualCount >= 1 || wordCount >= 15) {
    return 'diagnostic'; // Mode B
  }

  return 'hypothesis'; // Mode A (Only for short vague inputs lacking both numbers and qualitative markers)
}

export function evaluateStageHealth(
  context: ExtractedContext,
  signals: SignalItem[],
  mode: ReportMode
): {
  stageHealth: Record<AdoptStageKey, StageHealthItem>;
  primaryStage: AdoptStageKey;
  secondaryStage: AdoptStageKey | null;
  healthyStages: AdoptStageKey[];
  largestDrop: LargestBehavioralDrop | null;
} {
  const m = context.metrics;
  const inputLower = context.observedProblem.toLowerCase();
  const hasNumbers = Object.keys(m).some(k => m[k as keyof typeof m] !== undefined && m[k as keyof typeof m] !== null);

  // Check qualitative behavioral signals first
  const isTransformQualitative = inputLower.includes('power user') || inputLower.includes('template') || inputLower.includes('silo') || inputLower.includes('champion') || inputLower.includes('advoca') || inputLower.includes('share') || inputLower.includes('scale across');
  const isDesireQualitative = inputLower.includes("don't trust") || inputLower.includes("dont trust") || inputLower.includes("not worth") || inputLower.includes("proof") || inputLower.includes("testimonial") || inputLower.includes("case stud") || inputLower.includes("why switch") || inputLower.includes("why change") || inputLower.includes("manual alternative") || inputLower.includes("skeptic") || inputLower.includes("hesitant to switch") || inputLower.includes("refuse to switch") || inputLower.includes("trust") || inputLower.includes("status quo") || inputLower.includes("roi") || inputLower.includes("why") || inputLower.includes("value") || inputLower.includes("benefit") || inputLower.includes("trial") || inputLower.includes("convert") || inputLower.includes("motivation");
  const isOpenQualitative = inputLower.includes('tutorial') || inputLower.includes('setup') || inputLower.includes('onboard') || inputLower.includes('blank canvas') || inputLower.includes('blank') || inputLower.includes('first run') || inputLower.includes('first-run') || inputLower.includes('configure') || inputLower.includes('activat');
  const isProficientQualitative = (inputLower.includes('prompt') || inputLower.includes('syntax') || inputLower.includes('skill') || inputLower.includes('literacy') || inputLower.includes('unpredictable') || inputLower.includes('accuracy') || inputLower.includes('hallucinat') || inputLower.includes('manual') || inputLower.includes('revert') || inputLower.includes('habit') || inputLower.includes('output') || inputLower.includes('confidence')) && !isDesireQualitative;
  const isAwareQualitative = inputLower.includes('discover') || inputLower.includes('unaware') || inputLower.includes('never visited') || inputLower.includes('find') || inputLower.includes('visibility') || inputLower.includes('banner') || inputLower.includes('exposure') || inputLower.includes('never heard');

  // Baseline Stage Health Evaluation based on behavioral evidence
  let awareScore: number | null = null;
  let awareSubtext: string | null = null;

  let desireScore: number | null = null;
  let desireSubtext: string | null = null;

  let openScore: number | null = null;
  let openSubtext: string | null = null;

  let proficientScore: number | null = null;
  let proficientSubtext: string | null = null;

  let transformScore: number | null = null;
  let transformSubtext: string | null = null;

  // 1. AWARE Evaluation
  if (m.awarenessRate !== undefined && m.awarenessRate !== null) {
    awareScore = m.awarenessRate;
    awareSubtext = `${m.awarenessRate}% active discovery (${100 - m.awarenessRate}% discovery cliff)`;
  } else if (inputLower.includes('fully aware') || inputLower.includes('high awareness') || (inputLower.includes('aware') && isDesireQualitative)) {
    awareScore = 90;
    awareSubtext = 'High brand & feature awareness';
  }

  // 2. DESIRE Evaluation
  if (m.desireRate !== undefined && m.desireRate !== null) {
    desireScore = m.desireRate;
    desireSubtext = `${m.desireRate}% trial motivation / perceived value reported.`;
  } else if (isDesireQualitative && (awareScore !== null && awareScore >= 60 || inputLower.includes('aware') || inputLower.includes('trust') || inputLower.includes('proof'))) {
    desireScore = 20;
    desireSubtext = '20% intent (High trust & motivation barrier)';
  } else if (m.trialRate !== undefined && m.trialRate !== null && m.awarenessRate && !isOpenQualitative) {
    desireScore = Math.min(100, Math.round((m.trialRate / m.awarenessRate) * 100));
    desireSubtext = `${m.trialRate}% trial conversion from ${m.awarenessRate}% aware population.`;
  }

  // 3. OPEN Evaluation
  if (m.openBounceRate !== undefined && m.openBounceRate !== null) {
    openScore = Math.max(0, 100 - m.openBounceRate);
    openSubtext = `${m.openBounceRate}% immediate bounce observed during onboarding.`;
  } else if (m.trialRate !== undefined && m.trialRate !== null) {
    openScore = m.trialRate;
    openSubtext = `${m.trialRate}% activation / first-run setup completion rate.`;
  }

  // 4. PROFICIENT Evaluation
  if (m.wauRate !== undefined && m.wauRate !== null) {
    proficientScore = m.wauRate;
    proficientSubtext = `${m.wauRate}% weekly active usage reported.`;
  } else if (m.taskAbandonmentRate !== undefined && m.taskAbandonmentRate !== null) {
    proficientScore = Math.max(5, 100 - m.taskAbandonmentRate);
    proficientSubtext = `${m.taskAbandonmentRate}% task abandonment reported in regular workflows.`;
  }

  // 5. TRANSFORM Evaluation
  if (m.transformRate !== undefined && m.transformRate !== null) {
    transformScore = m.transformRate;
    transformSubtext = `${m.transformRate}% cross-team template sharing reported.`;
  }

  // Detect Primary & Secondary Bottlenecks (Qualitative Evidence is Definitive)
  let primaryStage: AdoptStageKey = 'AWARE';
  let secondaryStage: AdoptStageKey | null = 'DESIRE';

  // 1. The "Find the Cliff" Rule & Quantitative Chronological Drop-offs:
  // If an early stage has a high score (e.g. >= 60% Aware) but the next stage has a terrible conversion rate (e.g. 1.25% Open or 1.4% Desire),
  // you MUST highlight the stage with the lowest conversion / biggest drop as the primary bottleneck.
  // NEVER highlight a stage (like Aware) if its conversion rate is high.
  if (awareScore !== null && awareScore < 40) {
    primaryStage = 'AWARE';
    secondaryStage = desireScore !== null && desireScore < 40 ? 'DESIRE' : (openScore !== null && openScore < 40 ? 'OPEN' : 'DESIRE');
  } else if (desireScore !== null && desireScore < 40) {
    // E.g., only 1.4% click Try Now -> Bottleneck is undeniably DESIRE
    primaryStage = 'DESIRE';
    secondaryStage = openScore !== null && openScore < 40 ? 'OPEN' : 'AWARE';
  } else if (openScore !== null && openScore < 40) {
    // E.g., 80% Aware but only 1.25% setup/activators -> Bottleneck is undeniably OPEN
    primaryStage = 'OPEN';
    secondaryStage = proficientScore !== null && proficientScore < 40 ? 'PROFICIENT' : 'DESIRE';
  } else if (proficientScore !== null && proficientScore < 50) {
    primaryStage = 'PROFICIENT';
    secondaryStage = openScore !== null && openScore < 60 ? 'OPEN' : 'TRANSFORM';
  } else if (transformScore !== null && transformScore < 40) {
    primaryStage = 'TRANSFORM';
    secondaryStage = 'PROFICIENT';
  } else {
    // 2. Qualitative Evidence & Vocabulary Anchors for OPEN:
    // If input contains phrases like "tutorial," "setup," "onboarding," "first-run," or "blank canvas,"
    // this is definitive proof that user cleared Aware and Desire -> highlight OPEN.
    if (isOpenQualitative) {
      primaryStage = 'OPEN';
      secondaryStage = isProficientQualitative ? 'PROFICIENT' : 'DESIRE';
    } else if (isTransformQualitative) {
      primaryStage = 'TRANSFORM';
      secondaryStage = 'PROFICIENT';
    } else if (isProficientQualitative) {
      primaryStage = 'PROFICIENT';
      secondaryStage = 'OPEN';
    } else if (isDesireQualitative) {
      primaryStage = 'DESIRE';
      secondaryStage = 'AWARE';
    } else if (isAwareQualitative) {
      primaryStage = 'AWARE';
      secondaryStage = 'DESIRE';
    } else {
      // Chronological Funnel Default: Triggered ONLY when input is vague and lacks both numbers and qualitative markers
      primaryStage = 'AWARE';
      secondaryStage = 'DESIRE';
    }
  }

  // Detect Healthy Upstream Stages
  const healthyStages: AdoptStageKey[] = [];
  if (awareScore !== null && awareScore >= 60 && primaryStage !== 'AWARE') healthyStages.push('AWARE');
  if (desireScore !== null && desireScore >= 60 && primaryStage !== 'DESIRE') healthyStages.push('DESIRE');
  if (openScore !== null && openScore >= 60 && primaryStage !== 'OPEN') healthyStages.push('OPEN');

  // Calculate Largest Behavioral Drop
  let largestDrop: LargestBehavioralDrop | null = null;
  const stagesOrdered: { key: AdoptStageKey; score: number | null }[] = [
    { key: 'AWARE', score: awareScore },
    { key: 'DESIRE', score: desireScore },
    { key: 'OPEN', score: openScore },
    { key: 'PROFICIENT', score: proficientScore },
    { key: 'TRANSFORM', score: transformScore },
  ];

  let maxDrop = 0;
  for (let i = 0; i < stagesOrdered.length - 1; i++) {
    const current = stagesOrdered[i];
    const next = stagesOrdered[i + 1];
    if (current.score !== null && next.score !== null) {
      const drop = current.score - next.score;
      if (drop > maxDrop && drop > 15) {
        maxDrop = drop;
        largestDrop = {
          fromStage: current.key,
          toStage: next.key,
          delta: -drop,
          explanation: `Users successfully progress through ${ADOPT_META[current.key].name} (${current.score}%), but experience severe behavioral break transitioning into ${ADOPT_META[next.key].name} (${next.score}%).`,
        };
      }
    }
  }

  const stageSubtextMap: Record<AdoptStageKey, string | null> = {
    AWARE: awareSubtext,
    DESIRE: desireSubtext,
    OPEN: openSubtext,
    PROFICIENT: proficientSubtext,
    TRANSFORM: transformSubtext,
  };

  const formatStageItem = (
    key: AdoptStageKey,
    score: number | null
  ): StageHealthItem => {
    const meta = ADOPT_META[key];
    const hasEvidence = score !== null;
    const isBottleneck = primaryStage === key;
    const isSecondary = secondaryStage === key;

    let status: StageHealthItem['status'] = 'insufficient_evidence';
    if (hasEvidence) {
      if (score < 30) status = 'critical';
      else if (score < 60) status = 'at_risk';
      else if (score < 75) status = 'watch';
      else status = 'healthy';
    }

    let role: StageRole = 'WATCH';
    let roleLabel = 'WATCH';
    let specificMeaning = '';

    if (!hasEvidence) {
      role = 'INSUFFICIENT EVIDENCE';
      roleLabel = 'NEED EVIDENCE';
      specificMeaning = `Awaiting observed telemetry or survey signals to evaluate ${meta.name} progression.`;
    } else if (isBottleneck) {
      role = 'PRIMARY FOCUS';
      roleLabel = 'PRIMARY FOCUS';
      if (stageSubtextMap[key]) {
        specificMeaning = stageSubtextMap[key]!;
      } else {
        switch (key) {
          case 'AWARE': specificMeaning = 'Users fail to discover or recognize the feature during daily workflows.'; break;
          case 'DESIRE': specificMeaning = 'Users see the feature but perceive ambiguous ROI; motivation is the primary constraint.'; break;
          case 'OPEN': specificMeaning = 'Users intend to try the feature, but setup friction or blank-canvas paralysis halts first use.'; break;
          case 'PROFICIENT': specificMeaning = 'Users fail to convert trial into trusted, recurring workflow usage.'; break;
          case 'TRANSFORM': specificMeaning = 'Individual habits exist, but team-scale adoption remains blocked by lack of shared workflow templates.'; break;
        }
      }
    } else if (key === 'TRANSFORM' && (primaryStage === 'PROFICIENT' || primaryStage === 'OPEN' || primaryStage === 'DESIRE' || primaryStage === 'AWARE')) {
      role = 'DOWNSTREAM EFFECT';
      roleLabel = 'DOWNSTREAM EFFECT';
      specificMeaning = stageSubtextMap[key] || 'Team-scale adoption remains weak because individual proficiency has not formed yet.';
    } else if (isSecondary) {
      role = 'SECONDARY CONSTRAINT';
      roleLabel = 'SECONDARY CONSTRAINT';
      specificMeaning = stageSubtextMap[key] || `Secondary constraint: downstream drag observed following ${ADOPT_META[primaryStage].name} breakdown.`;
    } else if (score >= 70) {
      role = 'HEALTHY UPSTREAM';
      roleLabel = 'HEALTHY UPSTREAM';
      if (stageSubtextMap[key]) {
        specificMeaning = stageSubtextMap[key]!;
      } else {
        switch (key) {
          case 'AWARE': specificMeaning = 'Users consistently reach and recognize the feature.'; break;
          case 'DESIRE': specificMeaning = 'Users show enough intent to experiment; motivation is not the primary constraint.'; break;
          case 'OPEN': specificMeaning = 'Initial trial occurs, but first-value consistency varies by task.'; break;
          case 'PROFICIENT': specificMeaning = 'Users reliably execute core workflows with high repeat frequency.'; break;
          case 'TRANSFORM': specificMeaning = 'Workflows scale seamlessly across teams.'; break;
        }
      }
    } else {
      role = 'WATCH';
      roleLabel = 'WATCH';
      if (stageSubtextMap[key]) {
        specificMeaning = stageSubtextMap[key]!;
      } else {
        switch (key) {
          case 'AWARE': specificMeaning = 'Discovery is moderate, but some departments miss contextual announcements.'; break;
          case 'DESIRE': specificMeaning = 'Motivation is adequate for trial, but perceived ROI varies across pods.'; break;
          case 'OPEN': specificMeaning = 'Initial trial occurs, but first-value consistency varies by task complexity.'; break;
          case 'PROFICIENT': specificMeaning = 'Occasional repeat usage observed, but habituation remains fragile.'; break;
          case 'TRANSFORM': specificMeaning = 'Ad-hoc template sharing occurs within localized teams.'; break;
        }
      }
    }

    let insightText = specificMeaning;

    return {
      stage: key,
      letter: meta.letter,
      name: meta.name,
      score,
      status,
      role,
      roleLabel,
      percentageString: hasEvidence ? `${score}%` : '—',
      insightText,
      specificMeaning,
      isBottleneck,
      isSecondary,
      evidenceAvailable: hasEvidence,
      signalsSupporting: signals.filter(s => s.name.toLowerCase().includes(key.toLowerCase())),
      behavioralInterpretation: hasEvidence
        ? `Adoption health at ${meta.name} stage is measured at ${score}%. ${meta.question}`
        : `Awaiting observed telemetry or survey signals to evaluate ${meta.name} progression.`,
      failureMechanism: meta.coreMechanisms[0],
      suggestedMetrics: meta.standardMetrics,
    };
  };

  const stageHealth: Record<AdoptStageKey, StageHealthItem> = {
    AWARE: formatStageItem('AWARE', awareScore),
    DESIRE: formatStageItem('DESIRE', desireScore),
    OPEN: formatStageItem('OPEN', openScore),
    PROFICIENT: formatStageItem('PROFICIENT', proficientScore),
    TRANSFORM: formatStageItem('TRANSFORM', transformScore),
  };

  return {
    stageHealth,
    primaryStage,
    secondaryStage,
    healthyStages,
    largestDrop,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// CONFIDENCE MATHEMATICAL MODEL
// ─────────────────────────────────────────────────────────────────────────────

export function calculateConfidence(
  context: ExtractedContext,
  signals: SignalItem[],
  mode: ReportMode,
  primaryStage: AdoptStageKey
): {
  score: number;
  level: 'preliminary' | 'moderate' | 'strong' | 'high';
  breakdown: PrimaryDiagnosisSynthesis['confidenceBreakdown'];
  reasons: string[];
} {
  const m = context.metrics;
  const quantSignals = signals.filter(s => s.source === 'OBSERVED');
  const qualSignals = signals.filter(s => s.source === 'REPORTED');
  const contextualSignals = signals.filter(s => s.source === 'CONTEXTUAL');

  // 1. Completeness (25%)
  let completeness = 5;
  if (m.awarenessRate !== undefined) completeness += 5;
  if (m.trialRate !== undefined) completeness += 5;
  if (m.wauRate !== undefined || m.taskAbandonmentRate !== undefined) completeness += 5;
  if (context.qualitativeFeedback.length > 0) completeness += 5;
  completeness = Math.min(25, completeness);

  // 2. Quantitative Evidence (20%)
  let quantitative = 0;
  if (quantSignals.length >= 4) quantitative = 20;
  else if (quantSignals.length >= 3) quantitative = 17;
  else if (quantSignals.length >= 2) quantitative = 13;
  else if (quantSignals.length >= 1) quantitative = 8;
  else quantitative = 2;

  // 3. Qualitative Evidence (15%)
  let qualitative = 0;
  if (context.userComplaints.length >= 2) qualitative = 15;
  else if (context.userComplaints.length >= 1) qualitative = 11;
  else if (qualSignals.length >= 1) qualitative = 8;
  else qualitative = 3;

  // 4. Signal Consistency (15%)
  let consistency = 10;
  if (m.taskAbandonmentRate && m.taskAbandonmentRate > 50 && context.userComplaints.some(c => c.includes('accuracy') || c.includes('manual'))) {
    consistency = 15; // Strong synergy
  } else if (quantSignals.length > 0 && qualSignals.length > 0) {
    consistency = 13;
  } else if (mode === 'hypothesis') {
    consistency = 6;
  }

  // 5. Stage Differentiation (15%)
  let differentiation = 8;
  if (m.awarenessRate && m.awarenessRate > 85 && m.wauRate && m.wauRate < 10) {
    differentiation = 15; // Clear separation: Aware is high, Proficient is rock bottom
  } else if (m.trialRate && m.wauRate) {
    differentiation = 12;
  } else if (mode === 'hypothesis') {
    differentiation = 5;
  }

  // 6. Source Reliability (10%)
  let sourceReliability = 5;
  if (quantSignals.some(s => s.source === 'OBSERVED')) sourceReliability += 3;
  if (contextualSignals.length > 0) sourceReliability += 2;
  sourceReliability = Math.min(10, sourceReliability);

  const totalScore = Math.min(96, Math.max(28, completeness + quantitative + qualitative + consistency + differentiation + sourceReliability));

  let level: 'preliminary' | 'moderate' | 'strong' | 'high' = 'preliminary';
  if (totalScore >= 80) level = 'high';
  else if (totalScore >= 60) level = 'strong';
  else if (totalScore >= 40) level = 'moderate';
  else level = 'preliminary';

  const reasons: string[] = [];
  if (quantSignals.length >= 2) reasons.push(`Supported by ${quantSignals.length} direct telemetry metrics (${quantSignals.map(s => s.name).join(', ')})`);
  if (context.userComplaints.length > 0) reasons.push(`Corroborated by explicit user feedback on output predictability`);
  if (context.previousInterventions.length > 0) reasons.push(`Verified against previous intervention history (${context.previousInterventions.join(', ')})`);
  if (mode === 'hypothesis') reasons.push('Preliminary assessment based on minimal input; recommend telemetry ingestion to verify');

  return {
    score: totalScore,
    level,
    breakdown: {
      completeness,
      quantitative,
      qualitative,
      consistency,
      differentiation,
      sourceReliability,
    },
    reasons,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// CRITIC PASS & COMPETING STAGE EVALUATION
// ─────────────────────────────────────────────────────────────────────────────

export function runCriticPass(
  primaryStage: AdoptStageKey,
  context: ExtractedContext
): PrimaryDiagnosisSynthesis['competingStagesEvaluated'] {
  const stages: AdoptStageKey[] = ['AWARE', 'DESIRE', 'OPEN', 'PROFICIENT', 'TRANSFORM'];
  const m = context.metrics;

  return stages
    .filter(s => s !== primaryStage)
    .map(stage => {
      let probability = 10;
      let rejectionReason = '';

      if (stage === 'AWARE') {
        if (m.awarenessRate && m.awarenessRate > 75) {
          probability = 4;
          rejectionReason = `High baseline awareness (${m.awarenessRate}%) confirms discovery is not the gating constraint.`;
        } else {
          probability = 25;
          rejectionReason = 'Awareness is partially unmeasured, but reported behavior indicates users reach experimentation.';
        }
      } else if (stage === 'DESIRE') {
        if (m.trialRate && m.trialRate > 50) {
          probability = 8;
          rejectionReason = `Strong initial trial volume (${m.trialRate}%) demonstrates users find the value proposition compelling enough to start.`;
        } else {
          probability = 30;
          rejectionReason = 'Users show intent to try, ruling out total motivation collapse.';
        }
      } else if (stage === 'OPEN') {
        if (m.trialRate && m.trialRate > 40 && (!m.taskAbandonmentRate || m.taskAbandonmentRate < 40)) {
          probability = 12;
          rejectionReason = 'Setup and first-run completion are executed reliably; friction occurs downstream in repeated tasks.';
        } else {
          probability = 22;
          rejectionReason = 'First-run activation succeeds, but habituation breaks during ongoing workflow execution.';
        }
      } else if (stage === 'PROFICIENT') {
        probability = 15;
        rejectionReason = 'Proficient failure is considered, but upstream activation or discovery bottlenecks take precedence.';
      } else if (stage === 'TRANSFORM') {
        probability = 18;
        rejectionReason = 'Transform gap exists, but individual proficiency must be stabilized before peer scaling can succeed.';
      }

      return {
        stage,
        probability,
        rejectionReason,
      };
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT CAUSE & BEHAVIORAL BARRIER SYNTHESIS
// ─────────────────────────────────────────────────────────────────────────────

export function synthesizeDiagnosisTitle(
  primaryStage: AdoptStageKey,
  secondaryStage: AdoptStageKey | null,
  context: ExtractedContext
): string {
  if (secondaryStage && secondaryStage !== primaryStage) {
    if (primaryStage === 'PROFICIENT' && secondaryStage === 'TRANSFORM') return 'Proficiency & Transformation gap';
    if (primaryStage === 'PROFICIENT' && secondaryStage === 'OPEN') return 'Activation & Habituation deficit';
    if (primaryStage === 'DESIRE' && secondaryStage === 'OPEN') return 'Desire → Activation gap';
    if (primaryStage === 'AWARE' && secondaryStage === 'DESIRE') return 'Discovery & Motivation breakdown';
    if (primaryStage === 'OPEN' && secondaryStage === 'PROFICIENT') return 'First-Value & Repeat Mastery gap';
  }

  switch (primaryStage) {
    case 'AWARE': return 'Discovery & Visibility gap';
    case 'DESIRE': return 'Value Perception & Motivation gap';
    case 'OPEN': return 'Activation & First-Value gap';
    case 'PROFICIENT': return 'Proficiency & Habituation gap';
    case 'TRANSFORM': return 'Organizational Scaling gap';
  }
}

export function generateBehavioralMindset(
  primaryStage: AdoptStageKey,
  context: ExtractedContext
): { barrier: string; quote: string; provenance: 'User evidence' | 'Synthesized user mindset' } {
  // If explicit user quote is found in qualitative feedback
  if (context.userComplaints.some(c => c.includes('unpredictable') && c.includes('manual'))) {
    return {
      barrier: '“I can try it, but I can’t reliably depend on it for real work.”',
      quote: '"Outputs aren\'t predictable enough to trust on client calls, so I complete the work manually."',
      provenance: 'Synthesized user mindset',
    };
  }

  switch (primaryStage) {
    case 'AWARE':
      return {
        barrier: '“I had no idea this capability even existed in my daily tools.”',
        quote: '"I\'ve been doing this manually for months—nobody told our team this feature was released."',
        provenance: 'Synthesized user mindset',
      };
    case 'DESIRE':
      return {
        barrier: '“I don\'t see how changing my current routine saves me meaningful time.”',
        quote: '"The demo looked flashy, but I can\'t tell if this actually solves my specific quarterly workflow."',
        provenance: 'Synthesized user mindset',
      };
    case 'OPEN':
      return {
        barrier: '“I opened the tool to start, but got stuck staring at an empty setup screen.”',
        quote: '"There were too many configuration steps and no pre-filled examples, so I closed the tab."',
        provenance: 'Synthesized user mindset',
      };
    case 'PROFICIENT':
      return {
        barrier: '“I can use it, but I can’t reliably depend on it.”',
        quote: '"When the prompt outputs need tweaking, the syntax is so ambiguous that it\'s faster to click manually."',
        provenance: 'Synthesized user mindset',
      };
    case 'TRANSFORM':
      return {
        barrier: '“I built great workflows, but there’s no way to share them across my organization.”',
        quote: '"I save 6 hours a week with custom prompts, but other pods keep reinventing the wheel."',
        provenance: 'Synthesized user mindset',
      };
  }
}

export function extractRootCauses(
  primaryStage: AdoptStageKey,
  context: ExtractedContext,
  signals: SignalItem[]
): BehavioralRootCause[] {
  const causes: BehavioralRootCause[] = [];
  const m = context.metrics;

  if (primaryStage === 'PROFICIENT') {
    causes.push({
      id: 'rc-1',
      code: 'RC01',
      cause: 'Output Verification Burden',
      explanation: 'Users struggle to determine whether generated responses are reliable enough to use without extensive manual checking.',
      evidence: [
        m.taskAbandonmentRate ? `${m.taskAbandonmentRate}% task abandonment` : 'High mid-task exit rate',
        'User feedback describing unpredictable accuracy',
      ],
      adoptImpact: 'PROFICIENT',
      evidenceStrength: 'Strong',
      mechanism: 'Verification burden & low self-efficacy',
      supportingSignalsCount: 2,
    });

    causes.push({
      id: 'rc-2',
      code: 'RC02',
      cause: 'Workflow Uncertainty',
      explanation: 'Users have not developed clear recurring moments where the feature becomes the default choice.',
      evidence: [
        'Users clear prompt input after failed attempts',
        'Preference for structured 1-click recipes over open text',
      ],
      adoptImpact: 'OPEN',
      evidenceStrength: 'Strong',
      mechanism: 'Cognitive blank-canvas overload',
      supportingSignalsCount: 2,
    });

    causes.push({
      id: 'rc-3',
      code: 'RC03',
      cause: 'Existing Habit Advantage',
      explanation: 'Familiar manual workflows remain more predictable and require less cognitive effort.',
      evidence: [
        m.wauRate ? `${m.wauRate}% WAU despite ${m.trialRate || 62}% trial` : 'Low weekly repeat frequency',
        'Manual fallback to legacy spreadsheet rituals',
      ],
      adoptImpact: 'PROFICIENT',
      evidenceStrength: 'Medium',
      mechanism: 'Missing habit cues & context switching penalty',
      supportingSignalsCount: 2,
    });
  } else if (primaryStage === 'DESIRE') {
    causes.push({
      id: 'rc-des-1',
      code: 'RC01',
      cause: 'Ambiguous Value Proof',
      explanation: 'Landing surfaces describe abstract capabilities rather than quantified workflow time savings for specific roles.',
      evidence: ['High bounce rate on pricing/feature overview', 'User feedback asking for before/after proof'],
      adoptImpact: 'DESIRE',
      evidenceStrength: 'Strong',
      mechanism: 'Unclear perceived value & status quo bias',
      supportingSignalsCount: 2,
    });
    causes.push({
      id: 'rc-des-2',
      code: 'RC02',
      cause: 'Perceived Switching-Cost Penalty',
      explanation: 'Users perceive adopting a new workflow as risky compared to their known manual baseline.',
      evidence: ['Low trial start conversion despite high awareness'],
      adoptImpact: 'DESIRE',
      evidenceStrength: 'Medium',
      mechanism: 'Loss aversion & status quo bias',
      supportingSignalsCount: 1,
    });
  } else if (primaryStage === 'OPEN') {
    causes.push({
      id: 'rc-open-1',
      code: 'RC01',
      cause: 'Blank-Canvas Zero-State Friction',
      explanation: 'New users land on unseeded workspaces requiring manual configuration before seeing meaningful output.',
      evidence: ['Drop-off during first-session onboarding', 'Telemetry indicates hesitation on empty inputs'],
      adoptImpact: 'OPEN',
      evidenceStrength: 'Strong',
      mechanism: 'Choice overload & blank-canvas anxiety',
      supportingSignalsCount: 2,
    });
    causes.push({
      id: 'rc-open-2',
      code: 'RC02',
      cause: 'Setup Cognitive Overload',
      explanation: 'Multi-step onboarding forces premature decision-making before demonstrating early value proof.',
      evidence: ['High abandonment on permission and preference dialogues'],
      adoptImpact: 'OPEN',
      evidenceStrength: 'Medium',
      mechanism: 'Commitment cost before value',
      supportingSignalsCount: 1,
    });
  } else if (primaryStage === 'AWARE') {
    causes.push({
      id: 'rc-aware-1',
      code: 'RC01',
      cause: 'Hidden In-Product Discovery Pathways',
      explanation: 'The capability is buried beneath multi-click navigation menus rather than surfacing contextually during relevant tasks.',
      evidence: [
        m.awarenessRate !== undefined ? `${m.awarenessRate}% active discovery (${100 - m.awarenessRate}% awareness cliff)` : '< 15% feature exposure rate',
        'Employees ask support how to locate new tools',
      ],
      adoptImpact: 'AWARE',
      evidenceStrength: 'Strong',
      criticality: 'HIGH',
      mechanism: 'Attentional blindness & low mental availability',
      supportingSignalsCount: 2,
    });
    causes.push({
      id: 'rc-aware-2',
      code: 'RC02',
      cause: 'Workflow & Tooling Isolation',
      explanation: 'Capability exists in an isolated destination URL rather than being embedded into daily spreadsheets and editor workflows.',
      evidence: [
        'Zero organic referral traffic from core daily work surfaces',
        'Lack of in-workflow quick-launch triggers',
      ],
      adoptImpact: 'AWARE',
      evidenceStrength: 'Strong',
      criticality: 'HIGH',
      mechanism: 'Context switching friction & workflow isolation',
      supportingSignalsCount: 1,
    });
    causes.push({
      id: 'rc-aware-3',
      code: 'RC03',
      cause: 'Communication Channel Saturation',
      explanation: 'Broadcast announcements and launch emails get lost in general inbox noise without role-targeted relevance.',
      evidence: [
        'Low email open rates on company-wide newsletters',
        'Absence of dedicated team manager briefings',
      ],
      adoptImpact: 'AWARE',
      evidenceStrength: 'Medium',
      criticality: 'MEDIUM',
      mechanism: 'Information overload & lack of targeted messaging',
      supportingSignalsCount: 1,
    });
  } else {
    causes.push({
      id: 'rc-trans-1',
      code: 'RC01',
      cause: 'Missing Collaborative Template Infrastructure',
      explanation: 'Power users lack 1-click mechanisms to publish, fork, and verify workflow recipes across departments.',
      evidence: ['Prompts remain in private user notes', 'Low cross-team viral coefficient'],
      adoptImpact: 'TRANSFORM',
      evidenceStrength: 'Strong',
      criticality: 'HIGH',
      mechanism: 'Knowledge silos & lack of social proof',
      supportingSignalsCount: 2,
    });
    causes.push({
      id: 'rc-trans-2',
      code: 'RC02',
      cause: 'Departmental Knowledge Silos',
      explanation: 'Individual pods discover high-value automation recipes but lack cross-functional sharing channels.',
      evidence: ['Redundant template recreation across teams'],
      adoptImpact: 'TRANSFORM',
      evidenceStrength: 'Medium',
      criticality: 'MEDIUM',
      mechanism: 'Siloed team communication',
      supportingSignalsCount: 1,
    });
  }

  return causes;
}

export function generateStrategyBridge(
  primaryStage: AdoptStageKey,
  secondaryStage: AdoptStageKey | null,
  context: ExtractedContext
): StrategyBridge {
  switch (primaryStage) {
    case 'PROFICIENT':
      return {
        headline: 'Move users from experimentation → trusted repeat workflow',
        description: 'Prioritize interventions that reduce verification effort, guide users into recurring tasks, and make successful workflows easy to repeat.',
        threeStepArc: ['Reduce uncertainty', 'Create success', 'Reinforce repetition'],
      };
    case 'OPEN':
      return {
        headline: 'Accelerate first-run activation → early value milestone',
        description: 'Eliminate setup complexity and seed interactive task templates so new users experience immediate utility on Day 1.',
        threeStepArc: ['Lower start barrier', 'Deliver instant proof', 'Guide next action'],
      };
    case 'DESIRE':
      return {
        headline: 'Clarify tangible ROI → compel initial trial commitment',
        description: 'Replace abstract feature showcases with concrete, quantified workflow before/after outcomes for specific personas.',
        threeStepArc: ['Demonstrate clear ROI', 'Provide social proof', 'Lower trial risk'],
      };
    case 'AWARE':
      return {
        headline: 'Embed contextual discovery → establish mental availability',
        description: 'Surface AI capabilities directly inside existing daily tools and high-frequency employee workflows.',
        threeStepArc: ['Contextual surface', 'Trigger on intent', 'Drive first discovery'],
      };
    case 'TRANSFORM':
      return {
        headline: 'Connect isolated power users → team-wide template reuse',
        description: 'Build shared recipe hubs and cross-pod sharing infrastructure to scale individual productivity gains across the organization.',
        threeStepArc: ['Capture best practices', 'Enable 1-click sharing', 'Scale cross-pod habits'],
      };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// RECOMMENDATION ENGINE & PRIORITIZATION
// ─────────────────────────────────────────────────────────────────────────────

export function generateRecommendations(
  primaryStage: AdoptStageKey,
  secondaryStage: AdoptStageKey | null,
  context: ExtractedContext,
  rootCauses: BehavioralRootCause[]
): { initiatives: RecommendationInitiative[]; contraindicated: string[] } {
  const persona = context.persona;
  const product = context.product;
  const previousInterventions = context.previousInterventions;

  const contraindicated: string[] = [];
  if (previousInterventions.some(p => p.toLowerCase().includes('training'))) {
    contraindicated.push('Generic User Training (Already completed; upstream literacy is not the core bottleneck)');
  }
  if (previousInterventions.some(p => p.toLowerCase().includes('communication')) && (context.metrics.awarenessRate || 0) > 80) {
    contraindicated.push('Executive Awareness Campaign (Awareness is already 94%; further broadcast comms will yield diminishing ROI)');
  }

  const initiatives: RecommendationInitiative[] = [];

  if (primaryStage === 'PROFICIENT') {
    // 01 — P0 START HERE: Automated Task Support
    initiatives.push({
      id: 'init-prof-1',
      priority: 'P0',
      priorityLabel: '01 — P0',
      isPrimaryHero: true,
      heroBadge: 'P0 · START HERE',
      title: 'Automated Task Support',
      isPlaybookMatch: true,
      playbookTitle: 'Automated Task Support',
      shortDescription: `Help users verify ${product} outputs with source grounding, assumptions, confidence cues, and targeted validation prompts.`,
      targetedStages: ['PROFICIENT'],
      whyThis: `Directly addresses the strongest root cause: Output Verification Burden (RC01).`,
      whyThisFirst: `Directly addresses the strongest root cause: Output Verification Burden (RC01).`,
      behaviorToChange: `Manual verification → confident task completion`,
      movesStage: 'PROFICIENT',
      successMetric: `Successful task completion without manual fallback`,
      rootCauseRef: 'RC01',
      rootCauseBadge: 'Addresses RC01',
      behavioralObjective: 'Increase independent successful task completion and eliminate manual fallback.',
      impact: 'High',
      effort: 'Medium',
      evidenceStrength: 'Strong',
      priorityScore: 94,
      solutionType: 'ux_intervention',
      reasoningChain: {
        evidence: '65% task abandonment + user feedback describing unpredictable accuracy',
        behavioralCause: 'High verification burden and fear of unverified errors',
        adoptStage: 'PROFICIENT',
        targetBehavior: 'Safely validate and accept AI output without manual recalculation',
        intervention: 'Automated Task Support (Inline Verification & Citation Layer)',
      },
      measurementPlan: {
        primaryMetric: { name: 'Output Acceptance Rate', baseline: '35%', target: '78%' },
        leadingIndicators: [
          'Verification badge click-through rate',
          'Citation source drill-down frequency',
          'Average output edit time (reduced from 4.2m to 45s)',
        ],
        behavioralMetric: `${persona} successfully validates and sends AI output without opening manual spreadsheet backup.`,
        laggingMetric: 'Day-30 Repeat Feature Retention (+42% lift)',
        guardrails: ['Task completion latency', 'User-reported error escalation rate < 0.5%'],
      },
      solutionAsset: {
        conceptTitle: 'Certainty & Citation Verification Layer',
        behavioralObjective: 'Eliminate verification fatigue by highlighting confidence levels and underlying CRM/data citations.',
        trigger: `${product} completes response generation.`,
        solutionType: 'ux_intervention',
        journeySteps: [
          { step: 1, title: 'Output Rendered', description: 'AI output displays alongside a compact "96% High Certainty" badge.' },
          { step: 2, title: 'Citation Hover', description: 'Hovering over any claim highlights the exact CRM opportunity or email thread sourced.' },
          { step: 3, title: '1-Click Accept / Edit', description: 'User clicks "Insert into Email" or "Refine Segment" with instant undo.' },
        ],
        wireframe: {
          componentName: 'OutputConfidenceVerificationWidget',
          badge: 'Inline Verification Active',
          headline: 'Account Executive Briefing Ready',
          subheadline: 'All 4 deal risk factors verified against Salesforce Opportunity #8821.',
          contextItems: [
            '✓ Opportunity Stage: Negotiation (Verified via CRM)',
            '✓ Primary Objection: Budget cap mentioned in thread #4',
            '✓ Recommended Pricing Floor: $140,000 ARR',
          ],
          actionOptions: [
            { label: '⚡ Insert into Salesforce', isPrimary: true, icon: 'CheckCircle2' },
            { label: '🔍 View 4 Sourced Quotes', isPrimary: false, icon: 'ExternalLink' },
            { label: '✏️ Edit Assumptions', isPrimary: false, icon: 'Sparkles' },
          ],
          primaryCtaText: 'Accept & Sync to CRM (1-Click) →',
          verificationBadge: {
            label: 'High Confidence · 96%',
            status: 'verified',
            detail: 'Cross-referenced against 3 verified data sources',
          },
          interactiveStateExample: 'Clicking any citation highlights the exact paragraph sourced from the email thread with 99.4% confidence score.',
        },
        states: [
          { name: 'Default Generated State', description: 'Shows confidence badge (96% High Certainty) with subtle green outline.' },
          { name: 'Citation Inspection State', description: 'Expands underlying customer transcript quote on hover.' },
        ],
        interactionLogic: [
          'If model confidence score < 80%, render amber "Assumptions Required" pill with 1-click prompt adjustment.',
          'Log output_accepted event when user clicks Primary CTA.',
        ],
        exampleCopy: [
          { element: 'Confidence Badge', text: '96% Verified Certainty · Grounded in Salesforce Opportunity #8821' },
          { element: 'Citation Hover', text: 'Sourced from Client Email: "Budget approved up to $150k" (Aug 14)' },
        ],
        edgeCases: [
          'CRM data unreachable: Fallback to manual review alert with highlighted ungrounded claims.',
        ],
        instrumentationEvents: [
          { eventName: 'adopt_output_accepted', trigger: 'User clicks Primary CTA', properties: ['confidence_score', 'latency_ms'] },
          { eventName: 'adopt_citation_hovered', trigger: 'User hovers citation badge', properties: ['citation_id'] },
        ],
        successCriteria: [
          'Output acceptance rate increases from 35% to > 75%.',
          'Manual fallback to spreadsheet reduced by > 50%.',
        ],
        codeSnippet: {
          language: 'tsx',
          filename: 'InlineVerificationLayer.tsx',
          code: `import React from 'react';\nimport { ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';\n\nexport function InlineVerificationLayer({ confidence, citations, onAccept }: any) {\n  return (\n    <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">\n      <div className="flex items-center gap-2">\n        <ShieldCheck size={16} className="text-emerald-600" />\n        <span className="text-xs font-semibold text-emerald-800">{confidence}% Verified Certainty</span>\n        <span className="text-xs text-slate-500">({citations.length} sources linked)</span>\n      </div>\n      <button onClick={onAccept} className="px-3 py-1 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700">\n        Accept & Insert\n      </button>\n    </div>\n  );\n}`,
        },
      },
    });

    // 02 — P0: Advanced Tutorials
    initiatives.push({
      id: 'init-prof-2',
      priority: 'P0',
      priorityLabel: '02 — P0',
      isPrimaryHero: false,
      heroBadge: '02 · P0',
      title: 'Advanced Tutorials',
      isPlaybookMatch: true,
      playbookTitle: 'Advanced Tutorials',
      shortDescription: `Surface role-relevant AI task recipes and interactive prompt tutorials inside recurring employee workflows.`,
      targetedStages: ['OPEN', 'PROFICIENT'],
      whyThis: `Directly eliminates prompt syntax hesitation and blank-canvas paralysis observed in ${persona} tasks.`,
      whyThisFirst: `Scaffolds prompt construction to eliminate blank-canvas cognitive load.`,
      behaviorToChange: `Blank-canvas hesitation → 1-click recipe execution`,
      movesStage: 'OPEN → PROFICIENT',
      successMetric: `Recipe-initiated task completion rate`,
      rootCauseRef: 'RC02',
      rootCauseBadge: 'Addresses RC02',
      behavioralObjective: 'Help users generate high-quality first outputs with zero prompt-engineering effort.',
      impact: 'High',
      effort: 'Medium',
      evidenceStrength: 'Strong',
      priorityScore: 92,
      solutionType: 'prompt_workflow',
      reasoningChain: {
        evidence: '11.4s cursor hesitation on empty inputs + requests for job-tailored recipes',
        behavioralCause: 'Blank-canvas anxiety and lack of mental model for prompt phrasing',
        adoptStage: 'PROFICIENT',
        targetBehavior: 'Initiate meaningful task execution via 1-click recipe selection',
        intervention: 'Advanced Tutorials & Contextual In-Workflow Recipe Bar',
      },
      measurementPlan: {
        primaryMetric: { name: 'Recipe-Driven Task Completion', baseline: '18%', target: '64%' },
        leadingIndicators: [
          'Recipe selector click-through rate',
          'Prompt input dwell latency (reduced from 12s to 2s)',
          'Session query frequency per user',
        ],
        behavioralMetric: `User initiates daily tasks using recipe shortcuts rather than staring at blank textboxes.`,
        laggingMetric: 'Weekly Active Users (WAU) lift from 6% to 28%',
        guardrails: ['Recipe diversity usage across different accounts'],
      },
      solutionAsset: {
        conceptTitle: `${persona} Meeting Preparation & Task Recipes`,
        behavioralObjective: 'Provide instant 1-click prompt recipes tailored to immediate calendar context.',
        trigger: `Upcoming meeting or account record opened.`,
        solutionType: 'prompt_workflow',
        journeySteps: [
          { step: 1, title: 'Context Detection', description: 'System detects upcoming client meeting or open deal stage.' },
          { step: 2, title: 'Proactive Recipe Banner', description: 'Surfaces 3 relevant 1-click recipes: Summarize Account, Risk RCA, Generate Questions.' },
          { step: 3, title: 'Instant Prefill', description: '1-click populates prompt with CRM context and triggers generation.' },
        ],
        wireframe: {
          componentName: 'ContextualTaskRecipeDock',
          badge: 'Smart Context Detected',
          headline: 'Prepare for Upcoming Client Call',
          subheadline: 'Acme Corp Q3 Review · Tomorrow at 10:30 AM',
          contextItems: [
            '✓ Opportunity: $180k Enterprise Expansion',
            '✓ Recent Activity: 4 email threads, 1 contract redline',
          ],
          actionOptions: [
            { label: '⚡ Summarize Account History', isPrimary: true, icon: 'FileText' },
            { label: '⚠️ Identify Key Deal Risks', isPrimary: false, icon: 'AlertTriangle' },
            { label: '❓ Generate Executive Questions', isPrimary: false, icon: 'HelpCircle' },
          ],
          primaryCtaText: 'Generate Meeting Briefing (1-Click) →',
          interactiveStateExample: 'Clicking any recipe immediately runs generation with pre-injected CRM identifiers.',
        },
        states: [
          { name: 'Idle Surface', description: 'Compact horizontal recipe pill bar above query input.' },
          { name: 'Context Popover', description: 'Expanded 3-recipe card grid when relevant meeting or record is detected.' },
        ],
        interactionLogic: [
          'Listen for calendar events < 60 minutes away.',
          'Auto-generate meeting summary chips pre-populated with attendee metadata.',
        ],
        exampleCopy: [
          { element: 'Header', text: '✦ Recommended for your 10:30 AM Call' },
          { element: 'Recipe 1', text: 'Extract top 3 objections from last 3 call transcripts' },
        ],
        edgeCases: ['No upcoming meetings: Default to top 3 departmental evergreen recipes.'],
        instrumentationEvents: [
          { eventName: 'adopt_recipe_selected', trigger: 'User clicks recipe chip', properties: ['recipe_id', 'context_type'] },
        ],
        successCriteria: ['Over 50% of generative queries initiated via recipes.'],
      },
    });

    // 03 — P1: Usage Analytics
    initiatives.push({
      id: 'init-prof-3',
      priority: 'P1',
      priorityLabel: '03 — P1',
      isPrimaryHero: false,
      heroBadge: '03 · P1',
      title: 'Usage Analytics',
      isPlaybookMatch: true,
      playbookTitle: 'Usage Analytics',
      shortDescription: `Quantify time-savings and reintroduce ${product || 'the product'} at high-value moments with usage analytics and workflow triggers.`,
      targetedStages: ['PROFICIENT'],
      whyThis: `Anchors usage to existing daily rituals and provides visible productivity feedback rather than requiring conscious memory.`,
      whyThisFirst: `Builds habit triggers directly into existing daily moments.`,
      behaviorToChange: `Manual tool habit → contextual AI invocation`,
      movesStage: 'PROFICIENT',
      successMetric: `D7 repeat workflow usage`,
      rootCauseRef: 'RC03',
      rootCauseBadge: 'Addresses RC03',
      behavioralObjective: 'Form automatic cue-routine-reward habit loops around daily tasks.',
      impact: 'High',
      effort: 'Medium',
      evidenceStrength: 'Medium',
      priorityScore: 85,
      solutionType: 'ux_intervention',
      reasoningChain: {
        evidence: 'Single-session drop-off + usage remains occasional',
        behavioralCause: 'Lack of environmental habit triggers and contextual entry points',
        adoptStage: 'PROFICIENT',
        targetBehavior: 'Trigger AI assistance automatically following routine workflow milestones',
        intervention: 'Usage Analytics & Contextual Action Triggers',
      },
      measurementPlan: {
        primaryMetric: { name: 'Trigger-to-Workflow Conversion', baseline: '0%', target: '42%' },
        leadingIndicators: ['Nudge impression rate', 'Nudge click-through rate', 'Dismissal rate < 15%'],
        behavioralMetric: 'Users execute subsequent workflow steps via nudge recommendations.',
        laggingMetric: 'D7 Repeat Frequency (2.8x baseline)',
        guardrails: ['Frequency capping (max 2 nudges per user per day)'],
      },
      solutionAsset: {
        conceptTitle: 'Post-Call Automation Nudge',
        behavioralObjective: 'Prompt call summary generation immediately after a Zoom or Teams meeting concludes.',
        trigger: 'Customer meeting ends.',
        solutionType: 'ux_intervention',
        journeySteps: [
          { step: 1, title: 'Meeting Concludes', description: 'System detects customer call ended.' },
          { step: 2, title: 'Slide-in Toast', description: 'Toast asks: "Log call summary & next steps to CRM?"' },
          { step: 3, title: 'Review & Confirm', description: 'Pre-drafted action items appear for 1-click sync.' },
        ],
        wireframe: {
          componentName: 'PostCallNudgeToast',
          badge: 'Meeting Just Ended',
          headline: 'Sync Call Notes to Salesforce?',
          subheadline: 'Call with Acme Corp (32 mins) · Transcript ready',
          contextItems: ['✓ 3 action items detected', '✓ Follow-up deadline: Friday'],
          actionOptions: [
            { label: 'Auto-Draft Follow-Up Email', isPrimary: true },
            { label: 'Sync to CRM Notes', isPrimary: false },
          ],
          primaryCtaText: 'Review & Sync (30s) →',
          interactiveStateExample: 'One click opens pre-filled email draft ready for review.',
        },
        states: [{ name: 'Toast Visible', description: 'Floats in lower right corner for 20s.' }],
        interactionLogic: ['Trigger only if transcript length > 200 words.'],
        exampleCopy: [{ element: 'Toast', text: 'Call finished: Ready to draft follow-up?' }],
        edgeCases: ['Internal meetings without external attendees: Suppress nudge.'],
        instrumentationEvents: [{ eventName: 'adopt_nudge_clicked', trigger: 'User accepts nudge', properties: ['nudge_type'] }],
        successCriteria: ['35% of completed calls synced via nudge.'],
      },
    });

    // 04 — P1: Champions Programs
    initiatives.push({
      id: 'init-prof-4',
      priority: 'P1',
      priorityLabel: '04 — P1',
      isPrimaryHero: false,
      heroBadge: '04 · P1',
      title: 'Champions Programs',
      isPlaybookMatch: true,
      playbookTitle: 'Champions Programs',
      shortDescription: `Convert successful one-off interactions into reusable recurring workflows through departmental champion networks.`,
      targetedStages: ['PROFICIENT', 'TRANSFORM'],
      whyThis: `Spreads high-yield workflows across pods and breaks team-level knowledge silos.`,
      whyThisFirst: `Turns isolated single-user victories into team-wide templates.`,
      behaviorToChange: `One-off isolated execution → team-wide template reuse`,
      movesStage: 'PROFICIENT → TRANSFORM',
      successMetric: `Template reuse count across pods`,
      rootCauseRef: 'RC03',
      rootCauseBadge: 'Addresses RC03',
      behavioralObjective: 'Transform isolated individual productivity gains into organizational scale.',
      impact: 'Medium',
      effort: 'Low',
      evidenceStrength: 'Medium',
      priorityScore: 78,
      solutionType: 'champion_program',
      reasoningChain: {
        evidence: 'Power user workflows isolated without peer sharing',
        behavioralCause: 'No shared infrastructure for workflow publishing and discovery',
        adoptStage: 'TRANSFORM',
        targetBehavior: 'Team members search and reuse vetted colleague blueprints',
        intervention: 'Champions Programs & Shared Team Blueprint Gallery',
      },
      measurementPlan: {
        primaryMetric: { name: 'Shared Blueprint Reuse Count', baseline: '0', target: '120/mo' },
        leadingIndicators: ['Published blueprints count', 'Peer bookmark/star rate'],
        behavioralMetric: 'Team members fork existing vetted blueprints rather than writing from scratch.',
        laggingMetric: 'Cross-Department Adoption Multiplier (2.2x)',
        guardrails: ['Content moderation & sensitive data sanitization'],
      },
      solutionAsset: {
        conceptTitle: 'Enterprise Prompt & Workflow Gallery',
        behavioralObjective: 'Enable 1-click sharing of validated prompts across departments.',
        trigger: 'User successfully executes a high-satisfaction workflow.',
        solutionType: 'champion_program',
        journeySteps: [
          { step: 1, title: 'Publish', description: 'User clicks "Share with Team".' },
          { step: 2, title: 'Sanitize', description: 'System auto-replaces customer names with variables.' },
          { step: 3, title: 'Gallery Listing', description: 'Recipe appears in Department Featured tab.' },
        ],
        wireframe: {
          componentName: 'TeamBlueprintGalleryWidget',
          badge: 'Department Verified',
          headline: 'Top Sales Blueprints This Week',
          subheadline: 'Vetted by Enterprise Sales Champions',
          contextItems: ['⭐ 48 team runs', '⏱️ 4.5 hrs saved avg'],
          actionOptions: [
            { label: 'Run Blueprint', isPrimary: true },
            { label: 'View Variables', isPrimary: false },
          ],
          primaryCtaText: 'Add to My Toolbar →',
          interactiveStateExample: 'Clicking Add pins the recipe to user’s personal command bar.',
        },
        states: [{ name: 'Gallery View', description: 'Grid of recipe cards with run counts.' }],
        interactionLogic: ['Rank blueprints by peer run count and star ratings.'],
        exampleCopy: [{ element: 'Card', text: 'Alex’s Enterprise RFP Questionnaire Solver' }],
        edgeCases: ['Confidential data: Strip PII automatically prior to listing.'],
        instrumentationEvents: [{ eventName: 'adopt_blueprint_forked', trigger: 'User runs shared recipe', properties: ['author_id'] }],
        successCriteria: ['10+ active shared recipes per department within 30 days.'],
      },
    });
  } else if (primaryStage === 'DESIRE') {
    // DESIRE Recommendations
    initiatives.push({
      id: 'init-des-1',
      priority: 'P0',
      priorityLabel: '01 — P0',
      isPrimaryHero: true,
      heroBadge: 'P0 · START HERE',
      title: 'User Testimonials/Case Studies',
      isPlaybookMatch: true,
      playbookTitle: 'User Testimonials/Case Studies',
      shortDescription: `Publish peer customer stories and verified before/after workflow case studies to eliminate skepticism and demonstrate real-world ROI for ${persona}.`,
      targetedStages: ['DESIRE'],
      whyThis: `Directly provides social proof and verifiable time savings to overcome status-quo bias and lack of trust.`,
      whyThisFirst: `Directly provides social proof and verifiable time savings to overcome status-quo bias and lack of trust.`,
      behaviorToChange: `Skepticism and mistrust → verified confidence in tangible value`,
      movesStage: 'DESIRE',
      successMetric: `Trial conversion from proof surfaces`,
      rootCauseRef: 'RC01',
      rootCauseBadge: 'Addresses RC01',
      behavioralObjective: 'Build immediate trust through peer evidence and verified outcomes.',
      impact: 'High',
      effort: 'Low',
      evidenceStrength: 'Strong',
      priorityScore: 94,
      solutionType: 'campaign',
      reasoningChain: {
        evidence: 'Users skeptical of claims and ask for proof before changing legacy routines',
        behavioralCause: 'Loss aversion, status quo bias, and fear of unverified output risk',
        adoptStage: 'DESIRE',
        targetBehavior: 'Read peer case study and initiate evaluation trial',
        intervention: 'User Testimonials/Case Studies',
      },
      measurementPlan: {
        primaryMetric: { name: 'Proof-to-Trial Conversion', baseline: '1.2%', target: '6.8%' },
        leadingIndicators: ['Case study dwell time > 90s', 'Testimonial CTA click rate'],
        behavioralMetric: 'Users review peer evidence before clicking trial CTA.',
        laggingMetric: 'Trial Start Velocity (+45%)',
        guardrails: ['Use real verified metrics from active customer deployments'],
      },
      solutionAsset: {
        conceptTitle: 'Peer Proof & ROI Case Study Card',
        behavioralObjective: 'Display 3 verified peer metrics.',
        trigger: 'Prospect visits landing page or evaluation prompt.',
        solutionType: 'campaign',
        journeySteps: [
          { step: 1, title: 'Case Study View', description: 'Displays Fortune 500 peer quote & 6.2 hrs/wk saved metric.' },
          { step: 2, title: '1-Click Trial', description: 'Launches matching pre-configured workspace.' },
        ],
        states: [{ name: 'Default Card', description: 'Featured quote card with company logo.' }],
        interactionLogic: ['Match testimonial dynamically to user role.'],
        exampleCopy: [{ element: 'Quote', text: '“We cut monthly close latency by 65% in 3 weeks.” — VP Finance, Tier-1 Tech' }],
        edgeCases: ['General visitors see aggregate industry metrics.'],
        instrumentationEvents: [{ eventName: 'adopt_case_study_viewed', trigger: 'Testimonial viewed', properties: ['role'] }],
        successCriteria: ['4x increase in trial signup rate from testimonial card.'],
      },
    });
    initiatives.push({
      id: 'init-des-2',
      priority: 'P1',
      priorityLabel: '02 — P1',
      isPrimaryHero: false,
      heroBadge: '02 · P1',
      title: 'Benefit-Oriented Messaging',
      isPlaybookMatch: true,
      playbookTitle: 'Benefit-Oriented Messaging',
      shortDescription: `Replace generic feature claims with concrete, role-tailored time-savings proof and quantifiable ROI.`,
      targetedStages: ['DESIRE'],
      whyThis: `Connects abstract capability to tangible daily relief for ${persona}.`,
      whyThisFirst: `Directly bridges the motivation gap with quantifiable outcomes.`,
      behaviorToChange: `Status quo inertia → urgent trial initiation`,
      movesStage: 'DESIRE',
      successMetric: `Trial signup intent CTR`,
      rootCauseRef: 'RC02',
      rootCauseBadge: 'Addresses RC02',
      behavioralObjective: 'Prove immediate role-specific time savings.',
      impact: 'High',
      effort: 'Low',
      evidenceStrength: 'Medium',
      priorityScore: 86,
      solutionType: 'campaign',
      reasoningChain: {
        evidence: 'Users do not see why changing workflow habits is worth the effort',
        behavioralCause: 'Unclear perceived value and status quo bias',
        adoptStage: 'DESIRE',
        targetBehavior: 'Initiate evaluation based on verified time savings',
        intervention: 'Benefit-Oriented Messaging Campaign',
      },
      measurementPlan: {
        primaryMetric: { name: 'CTA Conversion Lift', baseline: '2.1%', target: '7.8%' },
        leadingIndicators: ['Benefit headline dwell time', 'ROI calculator interactions'],
        behavioralMetric: 'Prospects click trial CTA after reviewing role metrics.',
        laggingMetric: 'Trial Start Velocity (+40%)',
        guardrails: ['Messaging accuracy verified by product leads'],
      },
      solutionAsset: {
        conceptTitle: 'Role-Tailored Value Matrix',
        behavioralObjective: 'Communicate 3 key quantifiable benefits.',
        trigger: 'Evaluation page visit.',
        solutionType: 'campaign',
        journeySteps: [
          { step: 1, title: 'Role Selection', description: 'User selects department.' },
          { step: 2, title: 'Impact Metric', description: 'Displays 4.2 hrs/wk saved metric.' },
        ],
        states: [{ name: 'Default', description: 'Highlighted ROI banner.' }],
        interactionLogic: ['Tailor copy dynamically by persona.'],
        exampleCopy: [{ element: 'Header', text: 'Spend 80% less time on manual data entry' }],
        edgeCases: ['General visitors see blended aggregate metric.'],
        instrumentationEvents: [{ eventName: 'adopt_benefit_clicked', trigger: 'User clicks benefit card', properties: ['benefit_id'] }],
        successCriteria: ['Double-digit lift in trial activation.'],
      },
    });
    initiatives.push({
      id: 'init-des-3',
      priority: 'P1',
      priorityLabel: '03 — P1',
      isPrimaryHero: false,
      heroBadge: '03 · P1',
      title: 'Interactive Demos/Simulations',
      isPlaybookMatch: true,
      playbookTitle: 'Interactive Demos/Simulations',
      shortDescription: `Provide an instant, zero-auth interactive sandbox where ${persona} can drag and drop their current tasks to visualize live before/after time savings.`,
      targetedStages: ['DESIRE', 'AWARE'],
      whyThis: `Directly demonstrates tangible ROI and collapses abstract value perception into concrete proof.`,
      whyThisFirst: `Directly demonstrates tangible ROI and collapses abstract value perception into concrete proof.`,
      behaviorToChange: `Ambiguous ROI skepticism → verified time-savings confidence`,
      movesStage: 'DESIRE',
      successMetric: `Visitor-to-Trial conversion rate`,
      rootCauseRef: 'RC01',
      rootCauseBadge: 'Addresses RC01',
      behavioralObjective: 'Convert curious visitors into high-intent trial signups.',
      impact: 'High',
      effort: 'Medium',
      evidenceStrength: 'Strong',
      priorityScore: 93,
      solutionType: 'ux_intervention',
      reasoningChain: {
        evidence: 'Landing visitors bounce without trying + feedback asking for ROI proof',
        behavioralCause: 'Abstract reward horizon and fear of setup friction',
        adoptStage: 'DESIRE',
        targetBehavior: 'Experience tangible output preview before committing to setup',
        intervention: 'Interactive Demos/Simulations (Zero-Auth Sandbox)',
      },
      measurementPlan: {
        primaryMetric: { name: 'Visitor-to-Trial Conversion', baseline: '1.8%', target: '6.5%' },
        leadingIndicators: ['Simulator completion rate', 'ROI export download rate'],
        behavioralMetric: 'Prospects interact with live sandbox before clicking signup.',
        laggingMetric: 'Evaluation Cycle Reduction (-8 business days)',
        guardrails: ['Mobile responsiveness & load time < 1.5s'],
      },
      solutionAsset: {
        conceptTitle: 'Zero-Auth ROI Simulator',
        behavioralObjective: 'Show live time savings on real user tasks in under 60 seconds.',
        trigger: 'Prospect visits landing page.',
        solutionType: 'ux_intervention',
        journeySteps: [
          { step: 1, title: 'Select Role', description: 'User picks their job title.' },
          { step: 2, title: 'Select Workflow', description: 'Drags current task into simulator.' },
          { step: 3, title: 'Instant Output', description: 'See before (45m) vs after (2m) visual proof.' },
        ],
        states: [{ name: 'Interactive', description: 'Slider showing team size and dollar savings.' }],
        interactionLogic: ['Dynamic calculation of weekly hours saved.'],
        exampleCopy: [{ element: 'Headline', text: 'See how much time your team saves in 60s' }],
        edgeCases: ['Unsupported roles: Show general enterprise calculator.'],
        instrumentationEvents: [{ eventName: 'adopt_simulator_completed', trigger: 'User completes demo', properties: ['role'] }],
        successCriteria: ['3x increase in trial starts from simulator page.'],
      },
    });
    initiatives.push({
      id: 'init-des-4',
      priority: 'P2',
      priorityLabel: '04 — P2',
      isPrimaryHero: false,
      heroBadge: '04 · P2',
      title: 'Landing page',
      isPlaybookMatch: true,
      playbookTitle: 'Landing page',
      shortDescription: `Deploy high-converting role-specific landing surfaces with clear benefit propositions and 1-click trial initiation.`,
      targetedStages: ['DESIRE'],
      whyThis: `Provides dedicated entry points focused on role-specific problem resolution.`,
      whyThisFirst: `Establishes a focused conversion funnel.`,
      behaviorToChange: `Dispersed traffic → focused trial conversion`,
      movesStage: 'DESIRE',
      successMetric: `Landing page conversion rate`,
      rootCauseRef: 'RC02',
      rootCauseBadge: 'Addresses RC02',
      behavioralObjective: 'Drive direct conversion from marketing to product trial.',
      impact: 'Medium',
      effort: 'Low',
      evidenceStrength: 'Medium',
      priorityScore: 80,
      solutionType: 'campaign',
      reasoningChain: {
        evidence: 'General homepages fail to convert specific roles',
        behavioralCause: 'Generic messaging that misses specific pain points',
        adoptStage: 'DESIRE',
        targetBehavior: 'Click trial CTA on role-specific landing page',
        intervention: 'Role-Specific Landing Page',
      },
      measurementPlan: {
        primaryMetric: { name: 'Landing Conversion Rate', baseline: '1.5%', target: '5.2%' },
        leadingIndicators: ['Page bounce rate < 40%', 'Trial CTA clicks'],
        behavioralMetric: 'Visitors sign up directly from targeted landing page.',
        laggingMetric: 'Trial Inflow (+35%)',
        guardrails: ['A/B test against baseline generic page'],
      },
      solutionAsset: {
        conceptTitle: 'Dedicated Role Landing Page',
        behavioralObjective: 'Convert visitors through targeted copy.',
        trigger: 'Campaign or direct search traffic.',
        solutionType: 'campaign',
        journeySteps: [
          { step: 1, title: 'Land on Page', description: 'Sees role-targeted headline.' },
          { step: 2, title: 'Click Trial', description: 'Opens seamless signup.' },
        ],
        states: [{ name: 'Responsive Layout', description: 'Clean desktop and mobile design.' }],
        interactionLogic: ['Dynamic persona detection from URL UTM parameters.'],
        exampleCopy: [{ element: 'Headline', text: `The AI Workflow Solution Built for ${persona}` }],
        edgeCases: ['Unknown persona: Default to core product overview.'],
        instrumentationEvents: [{ eventName: 'adopt_landing_trial_started', trigger: 'Trial button clicked', properties: ['utm_source'] }],
        successCriteria: ['5% visitor-to-trial conversion rate.'],
      },
    });
  } else if (primaryStage === 'OPEN') {
    // OPEN Recommendations
    initiatives.push({
      id: 'init-open-1',
      priority: 'P0',
      priorityLabel: '01 — P0',
      isPrimaryHero: true,
      heroBadge: 'P0 · START HERE',
      title: 'FRE & Guided Tours',
      isPlaybookMatch: true,
      playbookTitle: 'FRE & Guided Tours',
      shortDescription: `Eliminate blank screens by defaulting new ${persona} accounts to pre-populated, role-specific sample data and instant runnable examples.`,
      targetedStages: ['OPEN'],
      whyThis: `Eliminates zero-state dread and guides new users directly to their first meaningful output.`,
      whyThisFirst: `Eliminates zero-state dread and guides new users directly to their first meaningful output.`,
      behaviorToChange: `Blank-canvas hesitation → immediate first output`,
      movesStage: 'OPEN',
      successMetric: `First-run setup completion rate`,
      rootCauseRef: 'RC01',
      rootCauseBadge: 'Addresses RC01',
      behavioralObjective: 'Reduce time-to-first-value from minutes to seconds.',
      impact: 'High',
      effort: 'Low',
      evidenceStrength: 'Strong',
      priorityScore: 95,
      solutionType: 'onboarding',
      reasoningChain: {
        evidence: '42% first-session drop-off + requests for pre-filled templates',
        behavioralCause: 'Blank-canvas paralysis and excessive configuration cognitive load',
        adoptStage: 'OPEN',
        targetBehavior: 'Execute first runnable template within 30 seconds of account creation',
        intervention: 'FRE & Guided Tours (Seeded Starter Workspaces)',
      },
      measurementPlan: {
        primaryMetric: { name: 'First-Run Setup Completion', baseline: '22%', target: '74%' },
        leadingIndicators: ['Time to first action (< 20s)', 'Template selection rate'],
        behavioralMetric: 'User generates first live output on day 1.',
        laggingMetric: 'Day-7 Activation Retention (+45%)',
        guardrails: ['Clean reset option to clear mock sample data'],
      },
      solutionAsset: {
        conceptTitle: 'Seeded Role-Based Starter Workspace',
        behavioralObjective: 'Give users immediate runnable data upon first login.',
        trigger: 'First login after registration.',
        solutionType: 'onboarding',
        journeySteps: [
          { step: 1, title: 'Welcome', description: 'Pre-selects role template based on signup info.' },
          { step: 2, title: 'Seeded Data', description: 'Displays realistic sample project.' },
          { step: 3, title: 'Run Now', description: '1-click runs the sample analysis.' },
        ],
        states: [{ name: 'Seeded Canvas', description: 'Interactive sample dashboard.' }],
        interactionLogic: ['Guide cursor with gentle pulsating highlight to Run button.'],
        exampleCopy: [{ element: 'Banner', text: 'Welcome! We pre-loaded a sample project for you.' }],
        edgeCases: ['Existing data found: Skip seeding and show user data.'],
        instrumentationEvents: [{ eventName: 'adopt_first_action_completed', trigger: 'First run clicked', properties: ['template_type'] }],
        successCriteria: ['80% of new signups complete first action in < 60 seconds.'],
      },
    });
    initiatives.push({
      id: 'init-open-2',
      priority: 'P1',
      priorityLabel: '02 — P1',
      isPrimaryHero: false,
      heroBadge: '02 · P1',
      title: 'Quick Start Guides/Cheat Sheets',
      isPlaybookMatch: true,
      playbookTitle: 'Quick Start Guides/Cheat Sheets',
      shortDescription: `Provide compact, role-specific cheat sheets with the top 5 essential prompt templates and workflows.`,
      targetedStages: ['OPEN'],
      whyThis: `Reduces cognitive barrier to first output with 1-page printable and dockable reference cards.`,
      whyThisFirst: `Gives users instant confidence during initial configuration.`,
      behaviorToChange: `Setup confusion → instant reference lookup`,
      movesStage: 'OPEN',
      successMetric: `Day-1 First Action Completion`,
      rootCauseRef: 'RC02',
      rootCauseBadge: 'Addresses RC02',
      behavioralObjective: 'Equip new users with immediate cheat-sheet prompts.',
      impact: 'Medium',
      effort: 'Low',
      evidenceStrength: 'Medium',
      priorityScore: 84,
      solutionType: 'onboarding',
      reasoningChain: {
        evidence: 'Users struggle to know what to type during first session',
        behavioralCause: 'Lack of initial prompt mental models',
        adoptStage: 'OPEN',
        targetBehavior: 'Execute first task using cheatsheet shortcut',
        intervention: 'Quick Start Guides/Cheat Sheets',
      },
      measurementPlan: {
        primaryMetric: { name: 'Cheatsheet-Assisted First Run', baseline: '10%', target: '58%' },
        leadingIndicators: ['Cheatsheet downloads', 'Template copy actions'],
        behavioralMetric: 'Users paste cheatsheet templates into first prompt.',
        laggingMetric: 'Activation conversion (+35%)',
        guardrails: ['Keep cheatsheet strictly to 1 page'],
      },
      solutionAsset: {
        conceptTitle: '1-Page Copilot Quick Start Dock',
        behavioralObjective: 'Provide top 5 runnable prompts.',
        trigger: 'First launch of workspace.',
        solutionType: 'onboarding',
        journeySteps: [
          { step: 1, title: 'Dock Appears', description: 'Side drawer shows top 5 prompts.' },
          { step: 2, title: '1-Click Insert', description: 'Copies prompt into input box.' },
        ],
        states: [{ name: 'Pinned Drawer', description: 'Subtle side drawer.' }],
        interactionLogic: ['Auto-collapse once first prompt successfully runs.'],
        exampleCopy: [{ element: 'Prompt 1', text: 'Summarize meeting notes into 3 bullets' }],
        edgeCases: ['Experienced users can permanently dismiss drawer.'],
        instrumentationEvents: [{ eventName: 'adopt_cheatsheet_used', trigger: 'Prompt copied', properties: ['prompt_index'] }],
        successCriteria: ['50% of new users run a cheatsheet prompt.'],
      },
    });
  } else if (primaryStage === 'AWARE') {
    // AWARE Recommendations
    initiatives.push({
      id: 'init-aware-1',
      priority: 'P0',
      priorityLabel: '01 — P0',
      isPrimaryHero: true,
      heroBadge: 'P0 · START HERE',
      title: 'In-Product Banners',
      isPlaybookMatch: true,
      playbookTitle: 'In-Product Banners',
      shortDescription: `Place non-intrusive smart entry points directly inside frequently used editor surfaces and universal quick-search bars.`,
      targetedStages: ['AWARE', 'DESIRE'],
      whyThis: `Surfaces the capability in the user’s line of sight during moments of maximum relevance.`,
      whyThisFirst: `Surfaces the capability in the user’s line of sight during moments of maximum relevance.`,
      behaviorToChange: `Attentional blindness → organic in-workflow discovery`,
      movesStage: 'AWARE',
      successMetric: `Feature discovery and initial invocation rate`,
      rootCauseRef: 'RC01',
      rootCauseBadge: 'Addresses RC01',
      behavioralObjective: 'Drive organic feature discovery in daily workspaces.',
      impact: 'High',
      effort: 'Low',
      evidenceStrength: 'Strong',
      priorityScore: 93,
      solutionType: 'ux_intervention',
      reasoningChain: {
        evidence: '< 5% feature exposure + users unaware tool exists',
        behavioralCause: 'Attentional blindness and hidden navigation placement',
        adoptStage: 'AWARE',
        targetBehavior: 'Discover and open the tool during routine work sessions',
        intervention: 'In-Product Banners (In-Workflow Discovery Beacon & Quick Command Access)',
      },
      measurementPlan: {
        primaryMetric: { name: 'Contextual Discovery Rate', baseline: '4.8%', target: '38%' },
        leadingIndicators: ['Command-K prompt impressions', 'In-editor badge hover rate'],
        behavioralMetric: 'Users invoke the tool directly from their daily editor.',
        laggingMetric: 'Eligible-to-Active Ratio (+3.4x)',
        guardrails: ['Do not show banner more than once per day'],
      },
      solutionAsset: {
        conceptTitle: 'Contextual Command-K Discovery Bar',
        behavioralObjective: 'Place instant shortcut inside daily workspace.',
        trigger: 'User presses Cmd+K or focuses active editor.',
        solutionType: 'ux_intervention',
        journeySteps: [
          { step: 1, title: 'Shortcut', description: 'Press Cmd+K anywhere.' },
          { step: 2, title: 'Suggestion', description: 'Surfaces top relevant AI actions.' },
          { step: 3, title: '1-Click Run', description: 'Runs without opening separate tab.' },
        ],
        states: [{ name: 'Command Bar', description: 'Floating modal with quick suggestions.' }],
        interactionLogic: ['Pre-filter actions based on open file or page.'],
        exampleCopy: [{ element: 'Placeholder', text: 'Ask AI or type a command...' }],
        edgeCases: ['Keybinding conflicts: Fallback to bottom-right floating pill.'],
        instrumentationEvents: [{ eventName: 'adopt_command_k_invoked', trigger: 'Cmd+K pressed', properties: ['surface'] }],
        successCriteria: ['40% of daily active users invoke tool via shortcut.'],
      },
    });
    initiatives.push({
      id: 'init-aware-2',
      priority: 'P1',
      priorityLabel: '02 — P1',
      isPrimaryHero: false,
      heroBadge: '02 · P1',
      title: 'Email Marketing',
      isPlaybookMatch: true,
      playbookTitle: 'Email Marketing',
      shortDescription: `Deploy high-relevance, role-targeted email campaigns showcasing 1-click workflow templates and tangible time savings for ${persona}.`,
      targetedStages: ['AWARE'],
      whyThis: `Breaks through communication silos with direct, role-tailored workflow invitations.`,
      whyThisFirst: `Directly reactivates unreached team members through primary communication channels.`,
      behaviorToChange: `Inbox blindness → high-intent workspace activation`,
      movesStage: 'AWARE',
      successMetric: `Campaign CTR and first-session activation`,
      rootCauseRef: 'RC03',
      rootCauseBadge: 'Addresses RC03',
      behavioralObjective: 'Drive targeted re-activation and initial workflow exploration.',
      impact: 'High',
      effort: 'Low',
      evidenceStrength: 'Strong',
      priorityScore: 89,
      solutionType: 'campaign',
      reasoningChain: {
        evidence: 'General newsletters ignored + lack of persona-specific communication',
        behavioralCause: 'Information overload and lack of role-specific context',
        adoptStage: 'AWARE',
        targetBehavior: 'Click contextual workflow link and complete first task',
        intervention: 'Role-Targeted Email Marketing Series',
      },
      measurementPlan: {
        primaryMetric: { name: 'Email-to-Workflow Conversion', baseline: '2.5%', target: '24%' },
        leadingIndicators: ['Email open rate > 45%', 'Recipe link click-through rate > 18%'],
        behavioralMetric: 'Users open email and launch pre-filled recipe directly.',
        laggingMetric: 'Discovery Lift (+40%)',
        guardrails: ['Frequency cap: Max 1 enablement email per week'],
      },
      solutionAsset: {
        conceptTitle: 'Role-Targeted Workflow Invitation Email',
        behavioralObjective: 'Provide instant 1-click launch from inbox.',
        trigger: 'Feature release or monthly enablement cycle.',
        solutionType: 'campaign',
        journeySteps: [
          { step: 1, title: 'Email Delivered', description: 'Subject highlights top 3 weekly time savers.' },
          { step: 2, title: '1-Click Launch', description: 'Direct deep link into pre-populated workspace.' },
        ],
        states: [{ name: 'Email Template', description: 'Rich HTML email with interactive preview.' }],
        interactionLogic: ['Embed personalized recipient role data.'],
        exampleCopy: [{ element: 'Headline', text: `Save 4 hours this week on ${persona} reporting` }],
        edgeCases: ['Unsubscribed users: Suppress outbound send.'],
        instrumentationEvents: [{ eventName: 'adopt_email_clicked', trigger: 'Email CTA clicked', properties: ['campaign_id'] }],
        successCriteria: ['25% CTR to live product.'],
      },
    });
    initiatives.push({
      id: 'init-aware-3',
      priority: 'P1',
      priorityLabel: '03 — P1',
      isPrimaryHero: false,
      heroBadge: '03 · P1',
      title: 'Micro-Content/Short-Form Video',
      isPlaybookMatch: true,
      playbookTitle: 'Micro-Content/Short-Form Video',
      shortDescription: `Produce 30-second workflow demonstration clips embedded directly in team chat channels and intranet digests.`,
      targetedStages: ['AWARE', 'DESIRE'],
      whyThis: `Demonstrates instantaneous value proof in under 30 seconds without requiring training attendance.`,
      whyThisFirst: `Provides lightweight mental availability and visual proof.`,
      behaviorToChange: `Abstract concept → clear visual comprehension`,
      movesStage: 'AWARE',
      successMetric: `Video view completion and subsequent tool visits`,
      rootCauseRef: 'RC02',
      rootCauseBadge: 'Addresses RC02',
      behavioralObjective: 'Build immediate mental models through micro-demonstrations.',
      impact: 'Medium',
      effort: 'Low',
      evidenceStrength: 'Medium',
      priorityScore: 82,
      solutionType: 'campaign',
      reasoningChain: {
        evidence: 'Users do not understand where or how the tool applies to daily work',
        behavioralCause: 'Lack of visual mental models and time constraint for long training',
        adoptStage: 'AWARE',
        targetBehavior: 'Watch 30s clip and replicate workflow in own workspace',
        intervention: '30-Second Micro-Content Workflow Videos',
      },
      measurementPlan: {
        primaryMetric: { name: 'Video Completion Rate', baseline: '0%', target: '65%' },
        leadingIndicators: ['Slack/Teams video plays', 'Direct link clicks from video'],
        behavioralMetric: 'Users replicate showcased recipe within 24h of viewing.',
        laggingMetric: 'Initial Workflow Trial (+32%)',
        guardrails: ['Keep duration strictly under 45 seconds'],
      },
      solutionAsset: {
        conceptTitle: '30-Second Recipe Clip Player',
        behavioralObjective: 'Show fast visual proof.',
        trigger: 'Posted to Slack/Teams channels.',
        solutionType: 'campaign',
        journeySteps: [
          { step: 1, title: 'Video Plays', description: 'Autoplays muted with captions in feed.' },
          { step: 2, title: 'Try It Button', description: 'Bottom overlay opens the recipe.' },
        ],
        states: [{ name: 'Inline Video', description: 'Compact responsive player.' }],
        interactionLogic: ['Auto-loop key 5-second workflow highlight.'],
        exampleCopy: [{ element: 'Caption', text: 'Watch how to generate a quarterly summary in 15 seconds' }],
        edgeCases: ['Bandwidth constraints: Fallback to animated GIF preview.'],
        instrumentationEvents: [{ eventName: 'adopt_video_viewed', trigger: 'Video plays', properties: ['video_id'] }],
        successCriteria: ['50% viewer-to-workspace conversion.'],
      },
    });
    initiatives.push({
      id: 'init-aware-4',
      priority: 'P2',
      priorityLabel: '04 — P2',
      isPrimaryHero: false,
      heroBadge: '04 · P2',
      title: 'Leadership Communications',
      isPlaybookMatch: true,
      playbookTitle: 'Leadership Communications',
      shortDescription: `Deploy executive sponsorship briefings to signal organizational priority and establish dedicated learning windows.`,
      targetedStages: ['AWARE'],
      whyThis: `Clarifies executive sponsorship and removes perceived risk of experimenting with new workflows.`,
      whyThisFirst: `Signals top-down mandate to explore new capabilities.`,
      behaviorToChange: `Perceived optionality → prioritized team evaluation`,
      movesStage: 'AWARE',
      successMetric: `Departmental kickoff engagement`,
      rootCauseRef: 'RC02',
      rootCauseBadge: 'Addresses RC02',
      behavioralObjective: 'Establish executive alignment and legitimate exploration time.',
      impact: 'High',
      effort: 'Low',
      evidenceStrength: 'Strong',
      priorityScore: 88,
      solutionType: 'campaign',
      reasoningChain: {
        evidence: 'Teams unaware of tool priority and unsure if allowed to use',
        behavioralCause: 'Lack of clear executive mandate and perceived compliance uncertainty',
        adoptStage: 'AWARE',
        targetBehavior: 'Attend department kickoff and claim workspace access',
        intervention: 'Leadership Communications Memo & Townhall',
      },
      measurementPlan: {
        primaryMetric: { name: 'Townhall/Memo Engagement', baseline: '0%', target: '70%' },
        leadingIndicators: ['Memo open rate', 'Townhall attendance'],
        behavioralMetric: 'Managers schedule team enablement sessions.',
        laggingMetric: 'Initial Login Rate (+55%)',
        guardrails: ['Provide direct links to pre-configured workspaces'],
      },
      solutionAsset: {
        conceptTitle: 'Executive Enablement Briefing',
        behavioralObjective: 'Broadcast strategic priority.',
        trigger: 'Department townhall or quarterly kickoff.',
        solutionType: 'campaign',
        journeySteps: [
          { step: 1, title: 'Memo Sent', description: 'VP sends 2-minute vision memo.' },
          { step: 2, title: 'Workspace Link', description: 'Includes 1-click workspace link.' },
        ],
        states: [{ name: 'Briefing Page', description: 'Executive video and strategic roadmap.' }],
        interactionLogic: ['Track link clicks by department.'],
        exampleCopy: [{ element: 'Subject', text: 'Empowering our team with AI: What you need to know' }],
        edgeCases: ['Contractors: Show restricted access notice.'],
        instrumentationEvents: [{ eventName: 'adopt_exec_memo_opened', trigger: 'Memo opened', properties: ['department'] }],
        successCriteria: ['60% of department visits tool within 48h.'],
      },
    });
  } else {
    // TRANSFORM Recommendations
    initiatives.push({
      id: 'init-trans-1',
      priority: 'P0',
      priorityLabel: '01 — P0',
      isPrimaryHero: true,
      heroBadge: 'P0 · START HERE',
      title: 'Champions Programs',
      isPlaybookMatch: true,
      playbookTitle: 'Champions Programs',
      shortDescription: `Establish a verified peer champion network and searchable departmental template hub with 1-click recipe sharing.`,
      targetedStages: ['TRANSFORM'],
      whyThis: `Breaks knowledge silos and incentivizes power users to scale best practices across the organization.`,
      whyThisFirst: `Breaks knowledge silos and incentivizes power users to scale best practices across the organization.`,
      behaviorToChange: `Isolated power-user tricks → cross-pod template standard`,
      movesStage: 'TRANSFORM',
      successMetric: `Shared template reuse count across pods`,
      rootCauseRef: 'RC01',
      rootCauseBadge: 'Addresses RC01',
      behavioralObjective: 'Scale individual productivity gains across departments.',
      impact: 'High',
      effort: 'Medium',
      evidenceStrength: 'Strong',
      priorityScore: 91,
      solutionType: 'champion_program',
      reasoningChain: {
        evidence: 'Power users exist but recipes remain in private notes',
        behavioralCause: 'No shared infrastructure for workflow publishing and discovery',
        adoptStage: 'TRANSFORM',
        targetBehavior: 'Publish and reuse verified colleague recipes',
        intervention: 'Champions Programs & Shared Team Blueprint Gallery',
      },
      measurementPlan: {
        primaryMetric: { name: 'Cross-Team Template Multiplier', baseline: '1.0x', target: '2.8x' },
        leadingIndicators: ['Published recipes count', 'Department fork rate'],
        behavioralMetric: 'Teams adopt templates created by other business units.',
        laggingMetric: 'Organizational Time Savings (+3.8 hrs/user/week)',
        guardrails: ['PII & confidential data auto-sanitization'],
      },
      solutionAsset: {
        conceptTitle: 'Enterprise Champion & Template Network',
        behavioralObjective: 'Incentivize power users to publish reusable blueprints.',
        trigger: 'Power user logs high weekly usage.',
        solutionType: 'champion_program',
        journeySteps: [
          { step: 1, title: 'Invite Champion', description: 'Badge awarded to top 5% users.' },
          { step: 2, title: 'Publish Template', description: 'Champion publishes team recipe.' },
          { step: 3, title: 'Leaderboard', description: 'Department recognizes champion impact.' },
        ],
        states: [{ name: 'Leaderboard View', description: 'Champion ranking and public recipes.' }],
        interactionLogic: ['Auto-award Champion status upon 50 successful workflow executions.'],
        exampleCopy: [{ element: 'Badge', text: 'Certified AI Champion · Sales' }],
        edgeCases: ['Inactivated champions: Re-engage with quarterly showcase invitation.'],
        instrumentationEvents: [{ eventName: 'adopt_champion_awarded', trigger: 'Champion status earned', properties: ['user_id'] }],
        successCriteria: ['25+ certified champions active across all major business units.'],
      },
    });
  }

  return { initiatives, contraindicated };
}

// ─────────────────────────────────────────────────────────────────────────────
// BUSINESS OUTCOME MODEL (DEFENSIBLE & HONEST)
// ─────────────────────────────────────────────────────────────────────────────

export function generateOutcomes(
  primaryStage: AdoptStageKey,
  context: ExtractedContext
): BusinessOutcome[] {
  const m = context.metrics;
  const hasWau = m.wauRate !== undefined && m.wauRate !== null;
  const hasAbandon = m.taskAbandonmentRate !== undefined && m.taskAbandonmentRate !== null;
  const hasPop = m.eligiblePopulation !== undefined && m.eligiblePopulation !== null;

  let wauDirection = 'High lift in recurring workflow habituation';
  let latencyDirection = 'Reduction in output validation hesitation';
  let abandonDirection = 'Improvement in task completion and reduced manual fallback';
  let valueDirection = 'Preserves seat license ROI and accelerates daily adoption';

  if (primaryStage === 'OPEN') {
    wauDirection = 'Increase in Day-1 onboarding conversion';
    latencyDirection = 'Reduction in time-to-first-meaningful-value';
    abandonDirection = 'Decrease in zero-state canvas abandonment';
    valueDirection = 'Faster time-to-value for newly provisioned seats';
  } else if (primaryStage === 'TRANSFORM') {
    wauDirection = 'Cross-team viral workflow scaling';
    latencyDirection = 'Elimination of redundant template rebuilds';
    abandonDirection = 'Decrease in departmental knowledge silos';
    valueDirection = 'Multiplied organizational productivity through peer sharing';
  } else if (primaryStage === 'DESIRE') {
    wauDirection = 'Conversion of passive awareness into active trials';
    latencyDirection = 'Shortened evaluation and signup decision cycles';
    abandonDirection = 'Reduction in pre-trial bounce rate';
    valueDirection = 'Clear justification of seat licensing and expansion ROI';
  } else if (primaryStage === 'AWARE') {
    wauDirection = 'Expansion of feature exposure across daily workspaces';
    latencyDirection = 'Instant Command-K in-workflow discovery';
    abandonDirection = 'Elimination of attentional blindness';
    valueDirection = 'Maximizes discovery of unutilized enterprise software';
  }

  const hasAware = m.awarenessRate !== undefined && m.awarenessRate !== null;

  if (primaryStage === 'AWARE') {
    return [
      {
        metricLabel: 'Feature Discovery Rate',
        currentValue: hasAware ? `${m.awarenessRate}%` : 'Baseline required',
        targetValue: hasAware ? `${Math.min(95, m.awarenessRate! + 45)}%` : '55%–65%',
        projectedLift: hasAware ? `+${Math.min(95, m.awarenessRate! + 45) - m.awarenessRate!} pts Discovery` : '+45% Discovery',
        directionalImpact: 'High lift in organic in-workflow discovery',
        benchmarkRange: 'Enterprise Feature Exposure Benchmark: 50%–70%',
        estimationRationale: 'Contextual in-product banners and command bar entry points.',
      },
      {
        metricLabel: 'In-Editor Invocation CTR',
        currentValue: 'Baseline required',
        targetValue: 'Target pending data',
        projectedLift: '+32% Initial Trial',
        directionalImpact: 'Direct conversion from editor line-of-sight to first run',
        benchmarkRange: '25%–35% initial trial rate from contextual discovery points',
        estimationRationale: 'Surfacing 1-click recipes at the point of need.',
      },
      {
        metricLabel: 'Email Re-activation Rate',
        currentValue: 'Baseline required',
        targetValue: 'Target pending data',
        projectedLift: '+18% Campaign CTR',
        directionalImpact: 'Role-targeted messaging breaking through inbox saturation',
        benchmarkRange: '15%–25% CTR for persona-specific workflow invitations',
        estimationRationale: 'Specific time-saving value proof in outbound comms.',
      },
      {
        metricLabel: 'Unutilized License Value Recaptured',
        currentValue: 'Baseline required',
        targetValue: 'Protected & Expanded',
        projectedLift: hasPop
          ? `$${Math.round((m.eligiblePopulation! * 0.45 * 120 * 85) / 1000)}k Potential Value`
          : 'ROI Acceleration',
        directionalImpact: 'Re-activates dormant paid seat licenses',
        benchmarkRange: '$400–$800 annual value per active user',
        estimationRationale: 'Calculated from eligible population discovering existing paid tools.',
      },
    ];
  }

  return [
    {
      metricLabel: 'Weekly Active Users (WAU)',
      currentValue: hasWau ? `${m.wauRate}%` : 'Baseline required',
      targetValue: hasWau ? `${Math.min(100, m.wauRate! + 22)}%` : 'Target pending data',
      projectedLift: hasWau ? `+${Math.min(100, m.wauRate! + 22) - m.wauRate!} pts Lift` : 'Directional Lift',
      directionalImpact: wauDirection,
      benchmarkRange: 'B2B SaaS Copilot Benchmark: 22%–35% Post-Intervention',
      estimationRationale: 'Derived from structured UX interventions addressing the primary bottleneck.',
    },
    {
      metricLabel: 'Task Latency & Validation',
      currentValue: 'Baseline required',
      targetValue: 'Target pending data',
      projectedLift: 'Latency Reduction',
      directionalImpact: latencyDirection,
      benchmarkRange: '-50% to -75% latency reduction in verified recipe workflows',
      estimationRationale: 'Derived from inline citation verification and structured prompt scaffolding.',
    },
    {
      metricLabel: 'Task Abandonment Rate',
      currentValue: hasAbandon ? `${m.taskAbandonmentRate}%` : 'Baseline required',
      targetValue: hasAbandon ? `${Math.max(5, Math.round(m.taskAbandonmentRate! * 0.3))}%` : 'Target pending data',
      projectedLift: hasAbandon ? `-${m.taskAbandonmentRate! - Math.max(5, Math.round(m.taskAbandonmentRate! * 0.3))} pts Abandonment` : 'Directional Reduction',
      directionalImpact: abandonDirection,
      benchmarkRange: '15%–22% baseline for guided recipe workflows',
      estimationRationale: 'Scaffolding inputs eliminates failed iteration cycles that trigger abandonment.',
    },
    {
      metricLabel: 'Productivity Value Recaptured',
      currentValue: 'Baseline required',
      targetValue: 'Protected & Expanded',
      projectedLift: hasPop
        ? `$${Math.round((m.eligiblePopulation! * 0.22 * 120 * 85) / 1000)}k Annual ARR Value`
        : 'ROI Acceleration',
      directionalImpact: valueDirection,
      benchmarkRange: '$400–$800 annual value recaptured per active knowledge worker',
      estimationRationale: 'Calculated from weekly hours saved across active user cohorts.',
    },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// MISSING EVIDENCE IDENTIFIER ("STRENGTHEN THIS DIAGNOSIS")
// ─────────────────────────────────────────────────────────────────────────────

export function identifyMissingEvidence(
  primaryStage: AdoptStageKey,
  context: ExtractedContext,
  mode: ReportMode
): MissingEvidenceItem[] {
  const missing: MissingEvidenceItem[] = [];

  if (mode === 'hypothesis') {
    missing.push({
      metricOrSignal: '% of eligible users who discovered the feature',
      rationale: 'Clarifies whether awareness or initial motivation is the true bottleneck.',
      howItHelps: 'Distinguishes an Aware problem from a Desire problem.',
    });
    missing.push({
      metricOrSignal: '% of aware users who attempted first use',
      rationale: 'Measures conversion from discovery into active experimentation.',
      howItHelps: 'Validates if users perceive sufficient value to begin.',
    });
    missing.push({
      metricOrSignal: '7-day repeat usage rate (D7 retention)',
      rationale: 'Shows whether first-time users return without external prompts.',
      howItHelps: 'Distinguishes first-run activation from long-term habituation.',
    });
    missing.push({
      metricOrSignal: 'Common qualitative feedback or complaints',
      rationale: 'Provides behavioral context on why users abandon after trial.',
      howItHelps: 'Pinpoints specific UX failure mechanisms (e.g. accuracy vs latency).',
    });
  } else {
    missing.push({
      metricOrSignal: 'Task success rate broken down by persona',
      rationale: 'Helps determine whether output friction is universal or specific to complex technical roles.',
      howItHelps: 'Allows targeted recipe customization for Sales vs Engineering vs Operations.',
    });
    missing.push({
      metricOrSignal: 'Output acceptance & citation interaction rate',
      rationale: 'Measures the exact percentage of generated responses that users paste directly into workflows.',
      howItHelps: 'Distinguishes a prompt-writing literacy problem from an underlying model accuracy problem.',
    });
    missing.push({
      metricOrSignal: 'Cross-department template reuse counts',
      rationale: 'Reveals whether organic peer advocacy exists within isolated pods.',
      howItHelps: 'Determines timing for scaling from Proficient interventions into Transform champion programs.',
    });
  }

  return missing;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN BEHAVIORAL INTELLIGENCE ORCHESTRATOR
// ─────────────────────────────────────────────────────────────────────────────

export function runBehavioralDiagnosis(rawInput: string): BehavioralDiagnosisResult {
  const context = extractContextFromInput(rawInput);
  const signals = extractSignals(context, rawInput);
  const reportMode = determineReportMode(context, signals, rawInput);

  const { stageHealth, primaryStage, secondaryStage, healthyStages, largestDrop } = evaluateStageHealth(
    context,
    signals,
    reportMode
  );

  const confidence = calculateConfidence(context, signals, reportMode, primaryStage);
  const competingStages = runCriticPass(primaryStage, context);
  const diagnosisTitle = synthesizeDiagnosisTitle(primaryStage, secondaryStage, context);
  const mindset = generateBehavioralMindset(primaryStage, context);
  const rootCauses = extractRootCauses(primaryStage, context, signals);
  const { initiatives, contraindicated } = generateRecommendations(primaryStage, secondaryStage, context, rootCauses);
  const outcomes = generateOutcomes(primaryStage, context);
  const missingEvidence = identifyMissingEvidence(primaryStage, context, reportMode);

  // Generate crisp, precise AI synthesis anchoring directly to the ADOPT framework
  let summary = '';
  const prod = context.product || 'the product';
  const persona = context.persona || 'Users';

  if (reportMode === 'hypothesis') {
    if (primaryStage === 'DESIRE') {
      summary = `Users are aware of ${prod} but lack motivation to start, placing the preliminary bottleneck at the Desire stage. Prioritize interactive workflow simulators and time-savings calculators to prove immediate ROI, or provide trial telemetry to strengthen this diagnosis.`;
    } else {
      summary = `Users are not actively using ${prod}, but because no telemetry was provided, the primary bottleneck defaults to the Aware stage under the zero-data rule. Prioritize contextual in-app discovery banners and Command-K entry points to establish visibility, or provide exposure telemetry to test downstream stages.`;
    }
  } else if (primaryStage === 'PROFICIENT') {
    const metricsPrefix = context.metrics.awarenessRate && context.metrics.trialRate
      ? `With ${context.metrics.awarenessRate}% awareness and ${context.metrics.trialRate}% trial among ${persona}, `
      : `While ${persona} are aware of ${prod} and open to trying it, `;
    const frictionDetail = context.userComplaints.some(c => c.includes('unpredictable') || c.includes('manual'))
      ? `unpredictable outputs cause users to abandon tasks and revert to manual work.`
      : `teams lack the skills, confidence, and habit integration to achieve consistent value.`;
    summary = `${metricsPrefix}${frictionDetail} Adoption breaks at the Proficient stage. Prioritize contextual prompt recipes, inline output verification, and automated workflow triggers rather than generic training.`;
  } else if (primaryStage === 'DESIRE') {
    const metricsPrefix = context.metrics.awarenessRate
      ? `Despite ${context.metrics.awarenessRate}% awareness, `
      : `While ${persona} are aware of ${prod}, `;
    summary = `${metricsPrefix}conversion to active trial stalls due to ambiguous ROI and unclear time savings. Adoption breaks at the Desire stage. Prioritize interactive workflow simulators and side-by-side time savings calculators to demonstrate immediate value proof.`;
  } else if (primaryStage === 'OPEN') {
    summary = `${persona} express intent to adopt ${prod}, but abandon during first-run setup due to blank-canvas hesitation and configuration friction. Adoption breaks at the Open stage. Prioritize 1-click seeded starter workspaces and guided onboarding recipes to accelerate time-to-first-value.`;
  } else if (primaryStage === 'AWARE') {
    summary = `${persona} have access to ${prod}, but remain unaware of its capabilities because it is isolated outside daily workflow paths. Adoption breaks at the Aware stage. Prioritize contextual in-workflow discovery beacons and Command-K entry points to establish natural visibility.`;
  } else if (primaryStage === 'TRANSFORM') {
    summary = `Individual ${persona} power users achieve high productivity with ${prod}, but best practices remain siloed without peer sharing mechanisms. Adoption breaks at the Transform stage. Prioritize a structured Champions Network and shared departmental template registry to scale organizational impact.`;
  } else {
    summary = `While ${persona} are aware of ${prod} and open to trying it, adoption breaks at the Proficient stage due to output uncertainty. Prioritize contextual prompt recipes and inline verification to build sustained daily habits.`;
  }

  // Dashboard Title: Ultra-concise single-line executive title strictly 35–48 characters (never wraps on desktop)
  let dashboardTitle = 'Product Adoption Friction Analysis';
  const obsLower = (context.observedProblem || '').toLowerCase();
  if (obsLower.includes('invoice') || obsLower.includes('reconciliation')) {
    dashboardTitle = 'Low Discovery for Invoice Reconciliation';
  } else if (obsLower.includes('meeting') || obsLower.includes('notes')) {
    dashboardTitle = 'Trust & Value Deficit for AI Meeting Notes';
  } else if (obsLower.includes('financial') || obsLower.includes('finance')) {
    dashboardTitle = 'Low Discovery for Financial Dashboard';
  } else if (primaryStage === 'AWARE') {
    dashboardTitle = `Low Discovery for ${prod}`;
  } else if (primaryStage === 'DESIRE') {
    dashboardTitle = `Trust & Value Deficit for ${prod}`;
  } else if (primaryStage === 'OPEN') {
    dashboardTitle = `First-Run Setup Drop-Off for ${prod}`;
  } else if (primaryStage === 'PROFICIENT') {
    dashboardTitle = `Output Verification Friction in ${prod}`;
  } else {
    dashboardTitle = `Siloed Workflow Scaling in ${prod}`;
  }

  // Strict clamp to 48 characters
  if (dashboardTitle.length > 48) {
    dashboardTitle = dashboardTitle.substring(0, 48).trim();
  }

  const primaryDiagnosis: PrimaryDiagnosisSynthesis = {
    title: diagnosisTitle,
    primaryStage,
    secondaryStage,
    healthyStages,
    summary,
    behavioralBarrier: mindset.barrier,
    barrierProvenance: mindset.provenance,
    userQuote: mindset.quote,
    confidenceScore: confidence.score,
    confidenceLevel: confidence.level,
    confidenceLabel: `${confidence.level.charAt(0).toUpperCase() + confidence.level.slice(1)} · ${confidence.score}%`,
    confidenceBreakdown: confidence.breakdown,
    confidenceReasons: confidence.reasons,
    competingStagesEvaluated: competingStages,
  };

  const strategyBridge = generateStrategyBridge(primaryStage, secondaryStage, context);

  const northStarMetric: NorthStarMetric = {
    title: 'North-star behavioral metric',
    label: `% of users completing 2+ successful repeatable ${context.product || 'the product'} workflows per week`,
    baseline: context.metrics.wauRate ? `${context.metrics.wauRate}%` : 'Baseline required',
    target: context.metrics.wauRate ? `${Math.min(100, context.metrics.wauRate + 22)}%` : 'Target pending data',
    lift: context.metrics.wauRate ? `+${Math.min(100, context.metrics.wauRate + 22) - context.metrics.wauRate} pts lift` : 'Directional lift',
    supportingMetrics: [
      {
        label: 'D7 Repeat Workflow Usage',
        target: '48%',
        rationale: 'Active users returning to execute at least 1 recurring prompt recipe within 7 days.',
      },
      {
        label: 'Successful Task Completion',
        target: '82%',
        rationale: 'Percentage of initiated AI flows resolved without mid-task exit or manual recalculation.',
      },
      {
        label: 'Output Acceptance Rate',
        target: '78%',
        rationale: 'Generated summaries verified and inserted directly into customer records.',
      },
      {
        label: 'Manual Fallback Rate',
        target: '14%',
        rationale: 'Reduction from 65% baseline legacy spreadsheet fallback.',
      },
    ],
  };

  const healthScoresList: StageHealthItem[] = [
    stageHealth.AWARE,
    stageHealth.DESIRE,
    stageHealth.OPEN,
    stageHealth.PROFICIENT,
    stageHealth.TRANSFORM,
  ];

  return {
    reportMode,
    context,
    signals,
    dashboardTitle,
    primaryDiagnosis,
    strategyBridge,
    stageHealth,
    healthScoresList,
    largestBehavioralDrop: largestDrop,
    rootCauses,
    initiatives,
    outcomes,
    northStarMetric,
    missingEvidence,
    contraindicatedInterventions: contraindicated,
  };
}
