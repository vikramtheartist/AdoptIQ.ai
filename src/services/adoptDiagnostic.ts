export type AdoptStage = 'AWARE' | 'DESIRE' | 'OPEN' | 'PROFICIENT' | 'TRANSFORM';

export type Intervention = {
  title: string;
  description: string;
  impact: 'High' | 'Medium';
  effort: 'Low' | 'Medium';
  priority: 'P0' | 'P1';
};

export type Diagnosis = {
  stageLabel: string;
  confidence: number;
  behavioralPattern: string;
  psychologicalDriver: string;
  diagnosis: string;
  signals: { label: string; detail: string; tone: 'coral' | 'blue' | 'lavender' }[];
  interventions: Intervention[];
  takeaway: string;
};

export const stages: { key: AdoptStage; label: string }[] = [
  { key: 'AWARE', label: 'Aware' },
  { key: 'DESIRE', label: 'Desire' },
  { key: 'OPEN', label: 'Open' },
  { key: 'PROFICIENT', label: 'Proficient' },
  { key: 'TRANSFORM', label: 'Transform' },
];

export const diagnoses: Record<AdoptStage, Diagnosis> = {
  AWARE: {
    stageLabel: 'Discovery breakdown', confidence: 79, behavioralPattern: 'Invisible value', psychologicalDriver: 'Attentional blindness',
    diagnosis: 'Users are not encountering the capability at the moment they have a relevant need, so its value never enters their consideration set.',
    signals: [
      { label: 'Feature discovery is under 5%', detail: 'Low exposure across high-intent sessions.', tone: 'coral' },
      { label: 'Low navigation reach', detail: 'Users rarely enter the feature surface.', tone: 'blue' },
      { label: 'Search intent is unserved', detail: 'Relevant queries end without a next action.', tone: 'lavender' },
    ],
    interventions: [
      { title: 'Contextual discovery cues', description: 'Place a clear, benefit-led invitation at the moment an existing workflow makes the new capability relevant.', impact: 'High', effort: 'Low', priority: 'P0' },
      { title: 'Intent-based entry points', description: 'Connect high-intent search and navigation moments to a focused first action.', impact: 'High', effort: 'Medium', priority: 'P0' },
      { title: 'Outcome-led education', description: 'Replace feature language with a short story of what users can accomplish next.', impact: 'Medium', effort: 'Low', priority: 'P1' },
    ],
    takeaway: "Adoption isn't failing because the capability lacks value. Users are failing to encounter it when the need is present.",
  },
  DESIRE: {
    stageLabel: 'Motivation breakdown', confidence: 82, behavioralPattern: 'Value ambiguity', psychologicalDriver: 'Unclear reward',
    diagnosis: 'Users understand that the capability exists, but the path from trying it to a meaningful outcome is not compelling enough to create intent.',
    signals: [
      { label: 'High awareness, low intent', detail: 'Recognition does not translate into trial.', tone: 'coral' },
      { label: 'Value language is abstract', detail: 'Users cannot predict a concrete outcome.', tone: 'blue' },
      { label: 'Drop-off before trial', detail: 'Interest fades before first action.', tone: 'lavender' },
    ],
    interventions: [
      { title: 'Outcome-first framing', description: 'Lead with a concrete, recognizable result instead of describing the capability itself.', impact: 'High', effort: 'Low', priority: 'P0' },
      { title: 'Proof in the moment', description: 'Show a small, credible example of the value users can unlock in one session.', impact: 'High', effort: 'Medium', priority: 'P0' },
      { title: 'Role-based success paths', description: 'Tailor the opening promise to the user’s job, intent, and immediate context.', impact: 'Medium', effort: 'Low', priority: 'P1' },
    ],
    takeaway: "Adoption isn't failing because users are unaware. They're failing to see a valuable enough reason to begin.",
  },
  OPEN: {
    stageLabel: 'Activation breakdown', confidence: 87, behavioralPattern: 'Blank-canvas paralysis', psychologicalDriver: 'Cognitive overload',
    diagnosis: 'Users successfully discover the core value proposition, but activation breaks before the first meaningful engagement.',
    signals: [
      { label: '42% activation rate drop-off', detail: 'Measured between generic landing and first input engagement.', tone: 'coral' },
      { label: 'Time-to-first-value > 45s', detail: 'Exceeds the expected threshold by 30s.', tone: 'blue' },
      { label: 'Erratic cursor movement', detail: 'Detected hovering over empty canvas.', tone: 'lavender' },
      { label: 'High perceived effort', detail: 'Users report uncertainty about where to begin.', tone: 'blue' },
    ],
    interventions: [
      { title: 'Prompt-First First Run', description: 'Bypass the empty canvas. Pre-fill the input area with contextual, single-click prompt suggestions based on user intent.', impact: 'High', effort: 'Medium', priority: 'P0' },
      { title: 'Seeded Community Templates', description: 'Give users ready-to-use structures so the first experience starts with momentum rather than uncertainty.', impact: 'High', effort: 'Low', priority: 'P0' },
      { title: 'Contextual Creation Cards', description: 'Turn uncertainty into an obvious first action using contextual prompts and a visible expected outcome.', impact: 'Medium', effort: 'Low', priority: 'P1' },
    ],
    takeaway: "Adoption isn't failing because users don't have access. They're failing at the moment of activation.",
  },
  PROFICIENT: {
    stageLabel: 'Mastery breakdown', confidence: 74, behavioralPattern: 'Habit interruption', psychologicalDriver: 'Low reinforcement',
    diagnosis: 'Users reach first value, but the experience does not help them build a repeatable workflow that becomes part of how they work.',
    signals: [
      { label: 'Strong first session', detail: 'Initial value is visible and measurable.', tone: 'coral' },
      { label: 'Week-two retention drops', detail: 'Repeat behavior is not forming.', tone: 'blue' },
      { label: 'Workflow fragmentation', detail: 'Users leave the product to finish the job.', tone: 'lavender' },
    ],
    interventions: [
      { title: 'Habit loops in context', description: 'Make the next repeat action visible immediately after a successful first outcome.', impact: 'High', effort: 'Medium', priority: 'P0' },
      { title: 'Personal workflow memory', description: 'Remember successful patterns and make them easy to reuse across future sessions.', impact: 'High', effort: 'Low', priority: 'P0' },
      { title: 'Progressive skill paths', description: 'Introduce one next-level behavior at the moment confidence is highest.', impact: 'Medium', effort: 'Low', priority: 'P1' },
    ],
    takeaway: "Adoption isn't failing at first value. It is failing to turn that value into a reliable habit.",
  },
  TRANSFORM: {
    stageLabel: 'Advocacy breakdown', confidence: 68, behavioralPattern: 'Unshared expertise', psychologicalDriver: 'Low social leverage',
    diagnosis: 'Power users have developed productive behaviors, but the product gives them no clear way to scale that expertise across their organization.',
    signals: [
      { label: 'Power users are isolated', detail: 'Successful patterns stay within individual accounts.', tone: 'coral' },
      { label: 'Few shared workflows', detail: 'Teams cannot see or reuse proven behaviors.', tone: 'blue' },
      { label: 'Mentorship is manual', detail: 'Advocacy depends on one-to-one explanation.', tone: 'lavender' },
    ],
    interventions: [
      { title: 'Shareable workflow kits', description: 'Package successful behaviors into lightweight templates that teams can adopt in one click.', impact: 'High', effort: 'Medium', priority: 'P0' },
      { title: 'Peer pattern library', description: 'Make the best internal examples visible, searchable, and easy to adapt.', impact: 'High', effort: 'Low', priority: 'P0' },
      { title: 'Guided team rituals', description: 'Create a repeatable moment for experienced users to model the next behavior for peers.', impact: 'Medium', effort: 'Low', priority: 'P1' },
    ],
    takeaway: "Adoption isn't failing among power users. Their expertise is failing to travel across the organization.",
  },
};