export type AdoptStage = 'AWARE' | 'DESIRE' | 'OPEN' | 'PROFICIENT' | 'TRANSFORM';

export interface Intervention {
  title: string;
  description: string;
  impact: 'High Impact' | 'Medium Impact';
  type: string;
}

export interface DiagnosisResult {
  stage: AdoptStage;
  title: string;
  confidence: number;
  description: string;
  interventions: Intervention[];
}

export const DIAGNOSTIC_KNOWLEDGE_BASE: Record<AdoptStage, DiagnosisResult> = {
  AWARE: {
    stage: 'AWARE',
    title: 'Discovery breakdown',
    confidence: 94,
    description: 'Users are unaware the capability exists because it is isolated outside their active daily workflow.',
    interventions: [
      {
        title: 'In-Workflow Pulse Beacons',
        description: 'Contextual micro-anchors alerting users to features when relevant context occurs.',
        impact: 'High Impact',
        type: 'Discovery Hook'
      },
      {
        title: 'Smart Empty-State Cards',
        description: 'Transform passive dead-ends into high-intent discovery entry points.',
        impact: 'High Impact',
        type: 'Surface Area'
      },
      {
        title: 'Event-Triggered Spotlight',
        description: 'Highlight shortcut availability immediately following manual multi-step actions.',
        impact: 'Medium Impact',
        type: 'Nudge'
      }
    ]
  },
  DESIRE: {
    stage: 'DESIRE',
    title: 'Motivation breakdown',
    confidence: 91,
    description: 'Users understand the feature exists but lack compelling proof of immediate ROI or value outcome.',
    interventions: [
      {
        title: 'Outcome-First Preview Cards',
        description: 'Display before-and-after dynamic previews before requiring user commitment.',
        impact: 'High Impact',
        type: 'Value Signal'
      },
      {
        title: 'Peer Benchmark Metrics',
        description: 'Surface aggregated team efficiency gains directly inside the empty state.',
        impact: 'High Impact',
        type: 'Social Proof'
      },
      {
        title: 'Interactive ROI Estimator',
        description: 'Quantify minutes saved per workflow dynamically based on user role.',
        impact: 'Medium Impact',
        type: 'Motivation'
      }
    ]
  },
  OPEN: {
    stage: 'OPEN',
    title: 'Activation breakdown',
    confidence: 93,
    description: 'Users reach the entry point but abandon setup due to blank-canvas paralysis or initial cognitive friction.',
    interventions: [
      {
        title: 'Pre-Populated Starter Canvas',
        description: 'Provide 3 ready-to-run templates directly in the opening canvas to eliminate zero-state dread.',
        impact: 'High Impact',
        type: 'Scaffolding'
      },
      {
        title: 'Progressive Micro-Checklist',
        description: 'Break setup into two lightweight micro-actions with clear milestone celebration.',
        impact: 'High Impact',
        type: 'Onboarding'
      },
      {
        title: 'Inline Synthetic Mock Data',
        description: 'Auto-fill test telemetry so users can experience output before connecting real data.',
        impact: 'Medium Impact',
        type: 'Activation'
      }
    ]
  },
  PROFICIENT: {
    stage: 'PROFICIENT',
    title: 'Mastery breakdown',
    confidence: 89,
    description: 'Users encounter a productivity dip after initial use, preventing habit formation and repeat workflows.',
    interventions: [
      {
        title: 'Contextual Shortcut Palette',
        description: 'Dynamic overlay teaching command keystrokes contextually during repetitive tasks.',
        impact: 'High Impact',
        type: 'Efficiency'
      },
      {
        title: 'Prompt of the Week Cards',
        description: 'Bite-sized mastery challenges embedded in the workspace toolbar.',
        impact: 'High Impact',
        type: 'Skill Acceleration'
      },
      {
        title: 'Smart Auto-Completion Engine',
        description: 'Suggest syntax completions inline as users formulate complex queries.',
        impact: 'Medium Impact',
        type: 'Assistance'
      }
    ]
  },
  TRANSFORM: {
    stage: 'TRANSFORM',
    title: 'Advocacy breakdown',
    confidence: 96,
    description: 'Power users lack native mechanisms to share templates, mentor teammates, or scale organizational impact.',
    interventions: [
      {
        title: '1-Click Team Recipe Publisher',
        description: 'Let champions publish sanitized workflow blueprints to the workspace gallery.',
        impact: 'High Impact',
        type: 'Viral Loop'
      },
      {
        title: 'Workspace Champion Leaderboard',
        description: 'Recognize top internal creators and surface their vetted workflows.',
        impact: 'High Impact',
        type: 'Incentive'
      },
      {
        title: 'Shared Team Prompt Library',
        description: 'Centralized collaborative repository for departmental prompt standards.',
        impact: 'Medium Impact',
        type: 'Collaboration'
      }
    ]
  }
};

export const diagnosePrompt = (input: string): DiagnosisResult => {
  const q = input.toLowerCase();

  // PROFICIENT: Mastery & efficiency drop-offs
  if (
    q.includes('shortcut') ||
    q.includes('master') ||
    q.includes('syntax') ||
    q.includes('day 7') ||
    q.includes('habit') ||
    q.includes('complex') ||
    q.includes('slow') ||
    q.includes('hard')
  ) {
    return DIAGNOSTIC_KNOWLEDGE_BASE.PROFICIENT;
  }

  // TRANSFORM: Sharing, scale & advocacy
  if (
    q.includes('share') ||
    q.includes('team') ||
    q.includes('champion') ||
    q.includes('scale') ||
    q.includes('invite') ||
    q.includes('collaborate')
  ) {
    return DIAGNOSTIC_KNOWLEDGE_BASE.TRANSFORM;
  }

  // DESIRE: Motivation, ROI & value perception
  if (
    q.includes('why') ||
    q.includes('value') ||
    q.includes('benefit') ||
    q.includes('roi') ||
    q.includes('worth') ||
    q.includes('point')
  ) {
    return DIAGNOSTIC_KNOWLEDGE_BASE.DESIRE;
  }

  // AWARE: Discovery, awareness & surface area
  if (
    q.includes('find') ||
    q.includes('discover') ||
    q.includes('where') ||
    q.includes('5%') ||
    q.includes('under 5%') ||
    q.includes('aware') ||
    q.includes('see')
  ) {
    return DIAGNOSTIC_KNOWLEDGE_BASE.AWARE;
  }

  // OPEN: Activation, onboarding & setup
  return DIAGNOSTIC_KNOWLEDGE_BASE.OPEN;
};