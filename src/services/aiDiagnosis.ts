import { GoogleGenAI, Type, Schema } from '@google/genai';
import {
  runBehavioralDiagnosis,
  BehavioralDiagnosisResult,
  AdoptStageKey,
  ReportMode,
  SignalSource,
  EvidenceStrength,
  PriorityLevel,
  SolutionType,
  StageHealthItem,
  BehavioralRootCause,
  RecommendationInitiative,
  BusinessOutcome,
  PrimaryDiagnosisSynthesis,
  MissingEvidenceItem,
  LargestBehavioralDrop,
  SignalItem,
  ExtractedContext,
} from './behavioralEngine';

export type {
  BehavioralDiagnosisResult,
  AdoptStageKey,
  ReportMode,
  SignalSource,
  EvidenceStrength,
  PriorityLevel,
  SolutionType,
  StageHealthItem,
  BehavioralRootCause,
  RecommendationInitiative,
  BusinessOutcome,
  PrimaryDiagnosisSynthesis,
  MissingEvidenceItem,
  LargestBehavioralDrop,
  SignalItem,
  ExtractedContext,
};

// Legacy compatibility aliases for existing components
export type AdoptIQDashboardData = BehavioralDiagnosisResult;
export type HealthScore = StageHealthItem;
export type PrimaryDiagnosis = PrimaryDiagnosisSynthesis;
export type EvidenceItem = {
  type: 'quant' | 'qual';
  title: string;
  description: string;
  impactLevel: 'High' | 'Medium' | 'Low';
};
export type Initiative = RecommendationInitiative;
export type Outcome = BusinessOutcome;

export const fallbackDatasets: Record<string, BehavioralDiagnosisResult> = {
  PROFICIENT: runBehavioralDiagnosis(
    'We rolled Copilot out to 40,000 Sales employees six months ago. Awareness is 94%, 62% tried it, WAU is 6%, task abandonment is 65%, reps say outputs aren\'t predictable and most still complete the work manually, and we\'ve already run training and communications.'
  ),
  DESIRE: runBehavioralDiagnosis(
    'Users visit the landing page for our automation add-on, but less than 2% click to begin a trial because ROI is ambiguous and prospects ask for real before/after proof.'
  ),
  OPEN: runBehavioralDiagnosis(
    'Users open the tool after signup, but 42% drop off during first-session onboarding due to blank-canvas paralysis and 14 complex configuration toggles.'
  ),
  AWARE: runBehavioralDiagnosis(
    'We launched an executive financial dashboard 3 months ago. 85% of Finance Managers have never visited or know it exists. Internal comms are buried, and there is no entry point from Excel or ERP workflows.'
  ),
  TRANSFORM: runBehavioralDiagnosis(
    'Power users have built custom prompts that save 10 hours a week, but workflows remain siloed with zero cross-team template sharing infrastructure.'
  ),
};

import {
  getPlaybookForStage,
  getAllPlaybookInterventions,
  formatPlaybookForSystemPrompt,
  findPlaybookMatch,
  isPlaybookInitiative,
  buildInitiativeFromRegistry,
  OFFICIAL_ADOPT_PLAYBOOK,
} from '../lib/adoptPlaybookRegistry';

export function classifyQueryStage(text: string): AdoptStageKey {
  const q = text.toLowerCase();

  // 1. Check Funnel Math & "Find the Cliff" Rule if numbers exist
  const eligibleMatch = text.match(/(\d{1,3}(?:,\d{3})+|\d+)\s*(?:initial\s+audience|total\s+audience|target\s+audience|employees|users|seats|licenses|eligible|total|people)/i) ||
    text.match(/(?:initial\s+audience|total\s+audience|eligible|total|population|audience)\s*(?:is|at|=|:)?\s*(\d{1,3}(?:,\d{3})+|\d+)/i);
  const exposedMatch = text.match(/(\d{1,3}(?:,\d{3})+|\d+)\s*(?:viewers|opened|saw|exposed|viewed|aware|received|visited|reached|discovered)/i) ||
    text.match(/(?:viewers|opened|saw|exposed|viewed|aware|received|visited|reached|discovered)\s*(?:by|at|=|:)?\s*(\d{1,3}(?:,\d{3})+|\d+)/i);
  const clickedMatch = text.match(/(\d{1,3}(?:,\d{3})+|\d+)\s*(?:clicked|tried|started|attempted|opted|signed\s*up|intent|conversion)/i) ||
    text.match(/(?:clicked|tried|started|attempted|opted|signed\s*up|intent)\s*(?:by|at|=|:)?\s*(\d{1,3}(?:,\d{3})+|\d+)/i);
  const setupMatch = text.match(/(\d{1,3}(?:,\d{3})+|\d+)\s*(?:activators|completed\s+setup|completed\s+onboarding|setup|onboarded|first-run|started|activated|tutorial\s+completers)/i) ||
    text.match(/(?:activators|completed\s+setup|completed\s+onboarding|activated|setup)\s*(?:is|at|=|:)?\s*(\d{1,3}(?:,\d{3})+|\d+)/i);

  if (exposedMatch && eligibleMatch) {
    const awareRate = (parseInt(exposedMatch[1].replace(/,/g, ''), 10) / parseInt(eligibleMatch[1].replace(/,/g, ''), 10)) * 100;
    if (setupMatch) {
      const openRate = (parseInt(setupMatch[1].replace(/,/g, ''), 10) / parseInt(exposedMatch[1].replace(/,/g, ''), 10)) * 100;
      if (openRate < 40) return 'OPEN';
    }
    if (clickedMatch) {
      const desireRate = (parseInt(clickedMatch[1].replace(/,/g, ''), 10) / parseInt(exposedMatch[1].replace(/,/g, ''), 10)) * 100;
      if (desireRate < 40) return 'DESIRE';
    }
    if (awareRate < 40) return 'AWARE';
  }

  // 2. TRANSFORM Qualitative Signals
  if (
    q.includes('power user') || q.includes('template') || q.includes('champion') ||
    q.includes('advoca') || q.includes('mentor') || q.includes('pillar') ||
    q.includes('transform') || q.includes('spotlight') || q.includes('share') ||
    q.includes('sharing') || q.includes('scale across') || q.includes('silo') ||
    q.includes('cross-team') || q.includes('department')
  ) {
    return 'TRANSFORM';
  }

  // 3. DESIRE Qualitative Signals (High Priority: Checked before Open & Proficient)
  // Keywords: don't trust, not worth the switch, proof, testimonials, case studies, why switch, manual alternatives, skeptical
  if (
    q.includes("don't trust") || q.includes("dont trust") || q.includes('not worth') ||
    q.includes('proof') || q.includes('testimonial') || q.includes('case stud') ||
    q.includes('why switch') || q.includes('why change') || q.includes('manual alternative') ||
    q.includes('skeptic') || q.includes('hesitant to switch') || q.includes('refuse to switch') ||
    q.includes('trust') || q.includes('status quo') || q.includes('roi') || q.includes('why') ||
    q.includes('value') || q.includes('benefit') || q.includes('landing') || q.includes('trial') ||
    q.includes('convert') || q.includes('ignite') || q.includes('desire') || q.includes('motivation') ||
    q.includes('interest') || q.includes('clicked') || q.includes('click') || q.includes('try now') ||
    q.includes('cta')
  ) {
    return 'DESIRE';
  }

  // 4. OPEN Qualitative Signals (Vocabulary Anchors for OPEN: tutorial, setup, onboarding, first-run, blank canvas)
  if (
    q.includes('tutorial') || q.includes('setup') || q.includes('onboard') ||
    q.includes('first-run') || q.includes('first run') || q.includes('blank canvas') ||
    q.includes('blank') || q.includes('get started') || q.includes('sign up') ||
    q.includes('configure') || q.includes('activat')
  ) {
    return 'OPEN';
  }

  // 5. PROFICIENT Qualitative Signals (Requires evidence of active ongoing task execution post-onboarding)
  if (
    q.includes('skill') || q.includes('literacy') || q.includes('prompt') ||
    q.includes('confidence') || q.includes('output') || q.includes('daily workflow') ||
    q.includes('scale it into daily') || q.includes('experimenting') || q.includes('shortcut') ||
    q.includes('syntax') || q.includes('rule') || q.includes('slow') ||
    q.includes('hard') || q.includes('complex') || q.includes('habit') ||
    q.includes('manual') || q.includes('revert') || q.includes('retention') ||
    q.includes('unpredictable') || q.includes('accuracy') || q.includes('hallucinat')
  ) {
    return 'PROFICIENT';
  }

  // 6. AWARE Qualitative Signals or Chronological Funnel Default
  return 'AWARE';
}

const geminiDiagnosisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    pageTitle: {
      type: Type.STRING,
      description: 'Ultra-concise single-line executive title strictly between 35 and 48 characters (e.g. "Low Discovery for Invoice Reconciliation", "Trust & Value Deficit for AI Meeting Notes"). NEVER exceed 48 characters to prevent wrapping on desktop.',
    },
    targetPersona: {
      type: Type.STRING,
      description: 'The exact target persona explicitly extracted from prompt (e.g. "Finance Managers", "Sales Reps", "DevOps Engineers", or "Users" if unstated)',
    },
    primaryStage: {
      type: Type.STRING,
      enum: ['AWARE', 'DESIRE', 'OPEN', 'PROFICIENT', 'TRANSFORM'],
      description: 'Primary bottleneck stage among AWARE, DESIRE, OPEN, PROFICIENT, TRANSFORM',
    },
    diagnosticSummary: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: 'Composite behavioral diagnosis title (e.g. "Activation & Habituation Deficit", "Discovery & Channel Blindness", "Trust & Value Skepticism")' },
        description: { type: Type.STRING, description: 'Precise, complete problem summary and behavioral breakdown.' },
        primaryStage: { type: Type.STRING, enum: ['AWARE', 'DESIRE', 'OPEN', 'PROFICIENT', 'TRANSFORM'] },
        secondaryStage: { type: Type.STRING, enum: ['AWARE', 'DESIRE', 'OPEN', 'PROFICIENT', 'TRANSFORM'] },
        persona: { type: Type.STRING, description: 'The exact user role/persona explicitly extracted from prompt' },
      },
      required: ['title', 'description', 'primaryStage'],
    },
    recommendedFocus: {
      type: Type.OBJECT,
      properties: {
        trajectory: { type: Type.STRING, description: 'Strategic trajectory (e.g. "Move users from discovery → active workflow trial")' },
        instructions: { type: Type.STRING, description: 'Direct actionable strategy instructions' },
        targetStages: {
          type: Type.ARRAY,
          items: { type: Type.STRING, enum: ['AWARE', 'DESIRE', 'OPEN', 'PROFICIENT', 'TRANSFORM'] },
        },
      },
      required: ['trajectory', 'instructions'],
    },
    stageHealth: {
      type: Type.ARRAY,
      description: 'Array of 5 objects strictly for [AWARE, DESIRE, OPEN, PROFICIENT, TRANSFORM]. Compute percentages if numbers/drop-offs are given (e.g. "85% unaware" -> 15% Aware Health). If completely unmentioned, set healthPercentage to null.',
      items: {
        type: Type.OBJECT,
        properties: {
          stage: { type: Type.STRING, enum: ['AWARE', 'DESIRE', 'OPEN', 'PROFICIENT', 'TRANSFORM'] },
          healthPercentage: { type: Type.INTEGER, description: 'Health percentage score (0-100), or null if no explicit telemetry/numbers in user input' },
          statusDescription: { type: Type.STRING, description: 'Status description (e.g. "15% active discovery (85% discovery cliff)" or "Awaiting observed telemetry or survey signals...")' },
        },
        required: ['stage', 'statusDescription'],
      },
    },
    evidence: {
      type: Type.ARRAY,
      description: '2 to 4 distinct, deconstructed root causes/evidence signals across discovery, technical friction, workflow timing, or communication',
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: 'e.g. "RC01", "RC02", "RC03", "RC04"' },
          title: { type: Type.STRING, description: 'Title of the behavioral root cause' },
          description: { type: Type.STRING, description: 'Detailed causal explanation of why this specific friction occurs' },
          criticality: { type: Type.STRING, enum: ['HIGH', 'MEDIUM', 'LOW'], description: 'Criticality based on stated impact in prompt' },
        },
        required: ['id', 'title', 'description', 'criticality'],
      },
    },
    initiatives: {
      type: Type.ARRAY,
      description: '3 to 4 prioritized initiatives directly from official ADOPT playbook. Card #1 must address RC01, secondary cards address secondary root causes.',
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING, description: 'Exact official playbook title if isPlaybook is true, or concise AI title.' },
          description: { type: Type.STRING, description: '1-2 sentence description of what the intervention does.' },
          isPlaybook: { type: Type.BOOLEAN, description: 'True if selected from official ADOPT playbook, false if custom AI fallback.' },
          addressesRootCauseId: { type: Type.STRING, description: 'e.g. "RC01", "RC02", "RC03"' },
          targetStages: {
            type: Type.ARRAY,
            items: { type: Type.STRING, enum: ['AWARE', 'DESIRE', 'OPEN', 'PROFICIENT', 'TRANSFORM'] },
          },
          impact: { type: Type.STRING, enum: ['High', 'Med', 'Low'] },
          effort: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
          evidenceStrength: { type: Type.STRING, enum: ['Strong', 'Moderate', 'Directional'] },
          whyRecommended: { type: Type.STRING, description: 'Rationale linking to root cause and user friction.' },
        },
        required: ['id', 'title', 'description', 'isPlaybook', 'addressesRootCauseId', 'impact', 'effort', 'whyRecommended'],
      },
    },
    expectedOutcome: {
      type: Type.OBJECT,
      properties: {
        summaryText: { type: Type.STRING, description: 'Grounded projected behavioral outcome statement referencing actual numbers/telemetry' },
        metrics: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              value: { type: Type.STRING, description: 'Projected target value/range based on input telemetry (e.g. "15% → 55-65%") or null if no baseline given' },
              type: { type: Type.STRING, enum: ['metric', 'missing_evidence'] },
            },
            required: ['label', 'type'],
          },
        },
      },
      required: ['summaryText', 'metrics'],
    },
  },
  required: ['pageTitle', 'diagnosticSummary', 'recommendedFocus', 'stageHealth', 'evidence', 'initiatives', 'expectedOutcome'],
};

export async function generateEnterpriseDashboard(userPrompt: string): Promise<BehavioralDiagnosisResult> {
  // Run deterministic behavioral engine first as authoritative foundation
  const baselineResult = runBehavioralDiagnosis(userPrompt);
  const detectedStage = baselineResult.primaryDiagnosis.primaryStage || classifyQueryStage(userPrompt);
  const stagePlaybook = getPlaybookForStage(detectedStage);
  const formattedPlaybookPrompt = formatPlaybookForSystemPrompt(detectedStage);

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey.includes('YourActualKeyHere')) {
    return baselineResult;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `
You are the AdoptIQ Behavioral Intelligence Engine. Your job is to diagnose enterprise software adoption bottlenecks using the 5-stage ADOPT framework and prescribe exact UX interventions from the official ADOPT Playbook.

### 5-STAGE ADOPT REASONING RULES:

1. AWARE (Discovery & Visibility)
- Symptoms: Users have never seen, visited, or known the feature exists.
- Telemetry: High drop-off at discovery entry points.
- Official Plays: "In-Product Banners", "Email Marketing", "Leadership Communications", "Micro-Content/Short-Form Video".

2. DESIRE (Motivation, Trust & Proof)
- Symptoms: Users know the tool exists (Aware cleared), but refuse to switch from legacy habits (e.g. Word/Excel) due to skepticism, lack of trust, fear of inaccuracies, or missing "What's In It For Me" (WIIFM) proof.
- Official Plays: "User Testimonials / Case Studies", "Benefit-Oriented Messaging", "Interactive Demos / Simulations", "Landing page / Take a tour sliders".

3. OPEN (First-Run & Setup Friction)
- Symptoms: Users clicked "Get Started" or tried to launch, but stalled within minutes due to blank-canvas paralysis, complex setup, or missing guidance.
- Official Plays: "FRE & Guided Tours", "Quick Start Guides / Cheat Sheets", "In-Product Help & Tooltips", "AI-Powered Onboarding Bots", "Single Sign-On (SSO) & Pre-configuration".

4. PROFICIENT (Habituation & Workflow Integration)
- Symptoms: Users complete initial onboarding, but fail to form a recurring weekly habit due to output verification fatigue, lack of advanced recipes, or workflow friction.
- Official Plays: "Automated Task Support", "Advanced Tutorials", "Usage Analytics", "Knowledge Base / FAQs", "In-App Surveys / Feedback Prompts".

5. TRANSFORM (Scaling & Advocacy)
- Symptoms: Power users love and use the tool daily, but workflows remain isolated in individual silos without peer sharing, cross-team templates, or executive ROI visibility.
- Official Plays: "Champions Programs", "Community-Driven Content", "Community Spotlights", "Copilot-Generated Impact Reports", "User-Led Success Stories".

### CRITICAL EXECUTION CONSTRAINTS:
- Persona Extraction: Extract the EXACT target persona stated in input (e.g., 'Finance Managers', not generic 'Users' or 'Team Managers').
- Page Title: Output pageTitle as a crisp, single-line headline under 48 characters that never wraps awkwardly.
- Telemetry Calculation: Calculate exact health percentages when numbers are provided (e.g., "85% unaware" -> Aware health = 15%). Stages lacking data must return healthPercentage: null.
- Playbook First: Strictly pick 3 to 4 initiatives matching the diagnosed stage directly from the ADOPT Playbook.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: geminiDiagnosisSchema,
        temperature: 0.15,
      },
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      if (parsed.diagnosticSummary?.title && parsed.diagnosticSummary?.description) {
        const resolvedPrimaryStage: AdoptStageKey = parsed.primaryStage || parsed.diagnosticSummary.primaryStage || baselineResult.primaryDiagnosis.primaryStage;
        const resolvedSecondaryStage: AdoptStageKey | undefined = parsed.diagnosticSummary.secondaryStage || undefined;
        const extractedPersona: string = parsed.targetPersona || parsed.diagnosticSummary.persona || baselineResult.context.persona || 'Users';

        // Map stageHealth to 5-stage records
        const stagesOrder: AdoptStageKey[] = ['AWARE', 'DESIRE', 'OPEN', 'PROFICIENT', 'TRANSFORM'];
        const stageHealthMap: Record<AdoptStageKey, StageHealthItem> = { ...baselineResult.stageHealth };
        const healthScoresList: StageHealthItem[] = [];

        stagesOrder.forEach((st) => {
          const genStage = Array.isArray(parsed.stageHealth) ? parsed.stageHealth.find((s: any) => s.stage === st) : null;
          const baselineStage = baselineResult.stageHealth[st];
          const hasScore = genStage && genStage.healthPercentage !== null && genStage.healthPercentage !== undefined;
          const scoreVal = hasScore ? Number(genStage.healthPercentage) : baselineStage.score;
          const isBottleneck = st === resolvedPrimaryStage;

          const updatedStage: StageHealthItem = {
            ...baselineStage,
            stage: st,
            score: scoreVal,
            percentageString: scoreVal !== null ? `${scoreVal}%` : '—',
            status: scoreVal !== null ? (scoreVal >= 60 ? 'healthy' : scoreVal >= 25 ? 'at_risk' : 'critical') : 'insufficient_evidence',
            role: isBottleneck ? 'PRIMARY FOCUS' : (scoreVal !== null && scoreVal >= 60 ? 'HEALTHY UPSTREAM' : 'INSUFFICIENT EVIDENCE'),
            roleLabel: isBottleneck ? 'Primary Bottleneck' : (scoreVal !== null && scoreVal >= 60 ? 'Healthy' : 'Need Evidence'),
            isBottleneck,
            isSecondary: st === resolvedSecondaryStage,
            specificMeaning: genStage?.statusDescription || baselineStage.specificMeaning,
            insightText: genStage?.statusDescription || baselineStage.insightText,
          };

          stageHealthMap[st] = updatedStage;
          healthScoresList.push(updatedStage);
        });

        // Map root causes from evidence with exact criticality
        let rootCauses: BehavioralRootCause[] = baselineResult.rootCauses;
        if (Array.isArray(parsed.evidence) && parsed.evidence.length > 0) {
          rootCauses = parsed.evidence.map((ev: any, idx: number) => {
            const rawCrit = (ev.criticality || '').toUpperCase();
            const strength: EvidenceStrength = rawCrit === 'HIGH' ? 'Strong' : rawCrit === 'MEDIUM' ? 'Medium' : 'Preliminary';
            return {
              id: ev.id || `RC0${idx + 1}`,
              code: ev.id || `RC0${idx + 1}`,
              cause: ev.title || `Root Cause ${idx + 1}`,
              explanation: ev.description || '',
              evidence: [ev.description || ''],
              adoptImpact: resolvedPrimaryStage,
              evidenceStrength: strength,
              criticality: rawCrit || (idx === 0 ? 'HIGH' : idx === 1 ? 'MEDIUM' : 'LOW'),
              mechanism: ev.description || '',
              supportingSignalsCount: 1,
            };
          });
        }

        // Map initiatives with depth and playbook anchoring
        let finalInitiatives: RecommendationInitiative[] = baselineResult.initiatives;
        if (Array.isArray(parsed.initiatives) && parsed.initiatives.length > 0) {
          finalInitiatives = parsed.initiatives.map((genInit: any, idx: number) => {
            const isHero = idx === 0;
            const priority = isHero ? 'P0' : idx === 1 ? 'P1' : 'P2';
            const targetStage = (genInit.targetStages && genInit.targetStages[0]) ? (genInit.targetStages[0] as AdoptStageKey) : resolvedPrimaryStage;

            const matchedPlay = findPlaybookMatch(genInit.title, targetStage);
            const isPlaybook = genInit.isPlaybook !== false && (!!matchedPlay || isPlaybookInitiative(genInit.title));
            const canonicalTitle = isPlaybook && matchedPlay ? matchedPlay : genInit.title;
            const rcRef = genInit.addressesRootCauseId || `RC0${Math.min(rootCauses.length, idx + 1)}`;

            return buildInitiativeFromRegistry(
              canonicalTitle,
              targetStage,
              priority,
              idx,
              extractedPersona,
              baselineResult.context.product || 'the product',
              {
                isPlaybookMatch: isPlaybook,
                playbookTitle: isPlaybook ? canonicalTitle : undefined,
                shortDescription: genInit.description || undefined,
                whyThisFirst: genInit.whyRecommended || undefined,
                whyThis: genInit.whyRecommended || undefined,
                impact: genInit.impact === 'Med' ? 'Medium' : genInit.impact || (isHero ? 'High' : 'Medium'),
                effort: genInit.effort || (idx === 0 ? 'Medium' : 'Low'),
                evidenceStrength: genInit.evidenceStrength === 'Moderate' ? 'Medium' : genInit.evidenceStrength === 'Directional' ? 'Preliminary' : 'Strong',
                rootCauseRef: rcRef,
                rootCauseBadge: `Addresses ${rcRef}`,
              }
            );
          });
        }

        // Map expected outcomes
        let finalOutcomes: BusinessOutcome[] = baselineResult.outcomes;
        if (parsed.expectedOutcome?.metrics && Array.isArray(parsed.expectedOutcome.metrics) && parsed.expectedOutcome.metrics.length > 0) {
          finalOutcomes = parsed.expectedOutcome.metrics.map((m: any, idx: number) => ({
            metricLabel: m.label || `Metric ${idx + 1}`,
            currentValue: m.value && m.value.includes('→') ? m.value.split('→')[0].trim() : 'Baseline required',
            targetValue: m.value && m.value.includes('→') ? m.value.split('→')[1].trim() : (m.value || 'Target'),
            projectedLift: m.value || '+35%',
            directionalImpact: 'High positive lift',
            benchmarkRange: '30-50%',
            estimationRationale: parsed.expectedOutcome.summaryText || 'Based on ADOPT benchmark models',
          }));
        }

        return {
          ...baselineResult,
          context: {
            ...baselineResult.context,
            persona: extractedPersona,
          },
          dashboardTitle: parsed.pageTitle || baselineResult.dashboardTitle,
          primaryDiagnosis: {
            ...baselineResult.primaryDiagnosis,
            title: parsed.diagnosticSummary.title || baselineResult.primaryDiagnosis.title,
            primaryStage: resolvedPrimaryStage,
            secondaryStage: resolvedSecondaryStage || null,
            summary: parsed.diagnosticSummary.description || baselineResult.primaryDiagnosis.summary,
          },
          strategyBridge: {
            headline: parsed.recommendedFocus?.trajectory || baselineResult.strategyBridge.headline,
            description: parsed.recommendedFocus?.instructions || baselineResult.strategyBridge.description,
            threeStepArc: baselineResult.strategyBridge.threeStepArc,
          },
          stageHealth: stageHealthMap,
          healthScoresList,
          rootCauses,
          initiatives: finalInitiatives,
          outcomes: finalOutcomes,
        };
      }
    }
  } catch (error) {
    console.warn('AdoptIQ Generative API fell back to Behavioral Engine:', error);
  }

  return baselineResult;
}