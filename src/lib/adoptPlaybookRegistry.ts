/**
 * AdoptIQ.ai — Official ADOPT Playbook Registry
 * 
 * Central authoritative registry mapping the 5 stages of the ADOPT framework
 * to proven, high-leverage product adoption interventions.
 */

import {
  AdoptStageKey,
  SolutionType,
  RecommendationInitiative,
  MeasurementPlan,
  SolutionAssetSpec,
} from '../services/behavioralEngine';

export type { AdoptStageKey };

export interface PlaybookInitiative {
  id: string;
  stage: 'AWARE' | 'DESIRE' | 'OPEN' | 'PROFICIENT' | 'TRANSFORM';
  title: string;
  description: string;
  defaultImpact: 'High' | 'Med' | 'Low';
  defaultEffort: 'High' | 'Medium' | 'Low';
}

export interface PlaybookInterventionMeta {
  name: string;
  stage: AdoptStageKey;
  objective: string;
  bestFor: string;
  typicalImpact: 'High' | 'Medium' | 'Low';
  typicalEffort: 'Low' | 'Medium' | 'High';
  solutionType: SolutionType;
  defaultSuccessMetric: string;
  behaviorToChange: string;
  wireframeSpec: {
    componentName: string;
    badge: string;
    headline: string;
    subheadline: string;
    contextItems: string[];
    actionOptions: { label: string; isPrimary: boolean; icon?: string }[];
    primaryCtaText: string;
    previewSnippet?: string;
  };
}

export const OFFICIAL_ADOPT_PLAYBOOK: Record<AdoptStageKey, string[]> = {
  AWARE: [
    'In-Product Banners',
    'Email Marketing',
    'Leadership Communications',
    'Micro-Content/Short-Form Video',
  ],
  DESIRE: [
    'Landing page',
    'Take a tour sliders',
    'Benefit-Oriented Messaging',
    'User Testimonials/Case Studies',
    'Interactive Demos/Simulations',
  ],
  OPEN: [
    'FRE & Guided Tours',
    'Quick Start Guides/Cheat Sheets',
    'AI-Powered Onboarding Bots',
    'Single Sign-On (SSO) & Pre-configuration',
    'In-Product Help & Tooltips',
    'Contextual Help',
  ],
  PROFICIENT: [
    'Automated Task Support',
    'Advanced Tutorials',
    'User Forums/Communities',
    'Knowledge Base/FAQs',
    'In-App Surveys/Feedback Prompts',
    'Usage Analytics',
    'Personalized Learning Paths',
  ],
  TRANSFORM: [
    'Champions Programs',
    'User-Led Success Stories',
    'Idea Submission',
    'Community Spotlights',
    'Community-Driven Content',
    'Recognition & Rewards',
    'Copilot-Generated Impact Reports',
  ],
};

export const PLAYBOOK_REGISTRY: PlaybookInitiative[] = [
  // AWARE
  {
    id: 'pb-aware-01',
    stage: 'AWARE',
    title: 'In-Product Banners',
    description: 'Drive contextual discovery directly within active user workflows without interrupting critical path tasks.',
    defaultImpact: 'High',
    defaultEffort: 'Low',
  },
  {
    id: 'pb-aware-02',
    stage: 'AWARE',
    title: 'Email Marketing',
    description: 'Re-engage inactive eligible cohorts with targeted, role-specific outcome announcements.',
    defaultImpact: 'Med',
    defaultEffort: 'Low',
  },
  {
    id: 'pb-aware-03',
    stage: 'AWARE',
    title: 'Leadership Communications',
    description: 'Establish executive sponsorship and strategic organizational mandate for adoption.',
    defaultImpact: 'High',
    defaultEffort: 'Low',
  },
  {
    id: 'pb-aware-04',
    stage: 'AWARE',
    title: 'Micro-Content/Short-Form Video',
    description: 'Deliver 15-30 second digestible teaser video clips showing tangible before/after wins.',
    defaultImpact: 'Med',
    defaultEffort: 'Low',
  },

  // DESIRE
  {
    id: 'pb-desire-01',
    stage: 'DESIRE',
    title: 'Landing page',
    description: 'Showcase concrete value propositions, social proof, and role-based outcomes.',
    defaultImpact: 'High',
    defaultEffort: 'Medium',
  },
  {
    id: 'pb-desire-02',
    stage: 'DESIRE',
    title: 'Take a tour sliders',
    description: 'Provide a lightweight, self-paced 3-slide visual preview of high-impact outcomes.',
    defaultImpact: 'Med',
    defaultEffort: 'Low',
  },
  {
    id: 'pb-desire-03',
    stage: 'DESIRE',
    title: 'Benefit-Oriented Messaging',
    description: 'Replace feature-first descriptions with tangible, role-tailored time-savings and accuracy metrics.',
    defaultImpact: 'High',
    defaultEffort: 'Low',
  },
  {
    id: 'pb-desire-04',
    stage: 'DESIRE',
    title: 'User Testimonials/Case Studies',
    description: 'Leverage peer social proof and authentic peer success stories to conquer status quo bias.',
    defaultImpact: 'High',
    defaultEffort: 'Medium',
  },
  {
    id: 'pb-desire-05',
    stage: 'DESIRE',
    title: 'Interactive Demos/Simulations',
    description: 'Provide a zero-auth, live interactive sandbox demonstrating real time-savings on sample data.',
    defaultImpact: 'High',
    defaultEffort: 'Medium',
  },

  // OPEN
  {
    id: 'pb-open-01',
    stage: 'OPEN',
    title: 'FRE & Guided Tours',
    description: 'Deliver a streamlined First-Run Experience (FRE) that guarantees a successful first output in < 60s.',
    defaultImpact: 'High',
    defaultEffort: 'Medium',
  },
  {
    id: 'pb-open-02',
    stage: 'OPEN',
    title: 'Quick Start Guides/Cheat Sheets',
    description: 'Provide compact 1-page cheatsheets and actionable keyboard shortcut references.',
    defaultImpact: 'Med',
    defaultEffort: 'Low',
  },
  {
    id: 'pb-open-03',
    stage: 'OPEN',
    title: 'AI-Powered Onboarding Bots',
    description: 'Interactive conversational assistant that configures user settings and walks through first task.',
    defaultImpact: 'High',
    defaultEffort: 'High',
  },
  {
    id: 'pb-open-04',
    stage: 'OPEN',
    title: 'Single Sign-On (SSO) & Pre-configuration',
    description: 'Eliminate account creation, permission requests, and configuration barriers.',
    defaultImpact: 'High',
    defaultEffort: 'Medium',
  },
  {
    id: 'pb-open-05',
    stage: 'OPEN',
    title: 'In-Product Help & Tooltips',
    description: 'Provide contextual micro-hints on UI buttons and inputs to prevent dead ends.',
    defaultImpact: 'Med',
    defaultEffort: 'Low',
  },
  {
    id: 'pb-open-06',
    stage: 'OPEN',
    title: 'Contextual Help',
    description: 'Dynamically surface relevant troubleshooting tips matching the user’s current screen state.',
    defaultImpact: 'Med',
    defaultEffort: 'Low',
  },

  // PROFICIENT
  {
    id: 'pb-proficient-01',
    stage: 'PROFICIENT',
    title: 'Automated Task Support',
    description: 'Provide inline scaffolding, 1-click contextual prompt recipes, and verification trust markers.',
    defaultImpact: 'High',
    defaultEffort: 'Medium',
  },
  {
    id: 'pb-proficient-02',
    stage: 'PROFICIENT',
    title: 'Advanced Tutorials',
    description: 'Interactive modules teaching multi-turn prompt chains and advanced parameter tuning.',
    defaultImpact: 'Med',
    defaultEffort: 'Medium',
  },
  {
    id: 'pb-proficient-03',
    stage: 'PROFICIENT',
    title: 'User Forums/Communities',
    description: 'Internal peer discussion channels for troubleshooting and workflow exchange.',
    defaultImpact: 'Med',
    defaultEffort: 'Low',
  },
  {
    id: 'pb-proficient-04',
    stage: 'PROFICIENT',
    title: 'Knowledge Base/FAQs',
    description: 'Searchable repository of vetted prompt recipes, FAQs, and integration guides.',
    defaultImpact: 'Med',
    defaultEffort: 'Low',
  },
  {
    id: 'pb-proficient-05',
    stage: 'PROFICIENT',
    title: 'In-App Surveys/Feedback Prompts',
    description: 'Capture micro-feedback (thumbs up/down with 1-click tags) immediately following generation.',
    defaultImpact: 'High',
    defaultEffort: 'Low',
  },
  {
    id: 'pb-proficient-06',
    stage: 'PROFICIENT',
    title: 'Usage Analytics',
    description: 'Provide managers and individual users with transparency into time-saved metrics and habits.',
    defaultImpact: 'High',
    defaultEffort: 'Medium',
  },
  {
    id: 'pb-proficient-07',
    stage: 'PROFICIENT',
    title: 'Personalized Learning Paths',
    description: 'Deliver adaptive learning modules tailored to the specific tools and workflows used by each role.',
    defaultImpact: 'High',
    defaultEffort: 'Medium',
  },

  // TRANSFORM
  {
    id: 'pb-transform-01',
    stage: 'TRANSFORM',
    title: 'Champions Programs',
    description: 'Empower departmental power users as certified coaches with dedicated badges and sharing tools.',
    defaultImpact: 'High',
    defaultEffort: 'Medium',
  },
  {
    id: 'pb-transform-02',
    stage: 'TRANSFORM',
    title: 'User-Led Success Stories',
    description: 'Highlight real employee achievements and workflow breakdowns in team townhalls and newsletters.',
    defaultImpact: 'High',
    defaultEffort: 'Low',
  },
  {
    id: 'pb-transform-03',
    stage: 'TRANSFORM',
    title: 'Idea Submission',
    description: 'Crowdsource high-impact automation ideas and custom tool requests directly from end users.',
    defaultImpact: 'Med',
    defaultEffort: 'Low',
  },
  {
    id: 'pb-transform-04',
    stage: 'TRANSFORM',
    title: 'Community Spotlights',
    description: 'Celebrate departmental achievements and rank teams on adoption milestones.',
    defaultImpact: 'Med',
    defaultEffort: 'Low',
  },
  {
    id: 'pb-transform-05',
    stage: 'TRANSFORM',
    title: 'Community-Driven Content',
    description: 'Enable users to publish, rate, and curate custom prompt templates and workflow recipes.',
    defaultImpact: 'High',
    defaultEffort: 'Medium',
  },
  {
    id: 'pb-transform-06',
    stage: 'TRANSFORM',
    title: 'Recognition & Rewards',
    description: 'Recognize top adopting employees with verifiable LinkedIn badges, internal perks, and awards.',
    defaultImpact: 'High',
    defaultEffort: 'Low',
  },
  {
    id: 'pb-transform-07',
    stage: 'TRANSFORM',
    title: 'Copilot-Generated Impact Reports',
    description: 'Automatically generate executive-ready ROI and time-saved summary slide decks.',
    defaultImpact: 'High',
    defaultEffort: 'Low',
  },
];

export const ADOPT_STAGE_PRINCIPLES: Record<AdoptStageKey, {
  corePrinciple: string;
  failureMechanism: string;
  designTone: string;
  keyRule: string;
}> = {
  AWARE: {
    corePrinciple: 'Contextual Visibility & Discovery',
    failureMechanism: 'Attentional blindness and siloed existence outside natural workflow paths.',
    designTone: 'Subtle, high-contrast, non-intrusive, integrated into daily trigger points.',
    keyRule: 'Place discovery signals directly at the moment of relevant user intent.',
  },
  DESIRE: {
    corePrinciple: 'Value Proof & Perceived ROI',
    failureMechanism: 'Ambiguous value, fear of wasted trial effort, high switching costs.',
    designTone: 'Concrete, role-specific, outcome-oriented, interactive simulation.',
    keyRule: 'Prove tangible time-savings or value before demanding setup effort.',
  },
  OPEN: {
    corePrinciple: 'Simplicity, Immediate Gratification & Zero-State Reduction',
    failureMechanism: 'Blank-canvas friction, multi-step configuration fatigue, launch abandonment.',
    designTone: 'Frictionless, guided, pre-populated, instant payoff in < 30 seconds.',
    keyRule: 'Eliminate blank states with 1-click starter templates and pre-configured defaults.',
  },
  PROFICIENT: {
    corePrinciple: 'Habit Formation, Prompt Literacy & Output Verification',
    failureMechanism: 'Verification fatigue, output uncertainty, failure to integrate into weekly rhythm.',
    designTone: 'Automated scaffolding, certainty badges, inline task recipes, workflow integration.',
    keyRule: 'Automate cognitive task burden and provide instant output trust markers.',
  },
  TRANSFORM: {
    corePrinciple: 'Peer Contagion, Social Proof & Viral Template Propagation',
    failureMechanism: 'Isolated power-user silos without cross-departmental sharing mechanisms.',
    designTone: 'Community-driven, celebratory, recognition-rich, easily forkable templates.',
    keyRule: 'Turn top performer recipes into 1-click shared team assets and champion networks.',
  },
};

export const PLAYBOOK_INTERVENTION_DETAILS: Record<string, PlaybookInterventionMeta> = {
  // AWARE
  'In-Product Banners': {
    name: 'In-Product Banners',
    stage: 'AWARE',
    objective: 'Drive contextual discovery directly within active user workflows without interrupting critical path tasks.',
    bestFor: 'Users active in core product who have zero awareness of new generative/AI capabilities.',
    typicalImpact: 'High',
    typicalEffort: 'Low',
    solutionType: 'ux_intervention',
    defaultSuccessMetric: 'Banner impression-to-discovery CTR (> 18%)',
    behaviorToChange: 'Attentional blindness → organic in-workflow discovery',
    wireframeSpec: {
      componentName: 'InProductBannerWidget',
      badge: 'NEW CAPABILITY',
      headline: 'Automate Account Briefings Directly in Your Daily View',
      subheadline: 'Summarize CRM accounts and generate action items with 1-click AI assistance.',
      contextItems: ['✓ Integrated in Salesforce & Outlook', '✓ 1-click execution'],
      actionOptions: [
        { label: 'Try 30-Second Demo', isPrimary: true, icon: 'Sparkles' },
        { label: 'Dismiss for now', isPrimary: false, icon: 'X' },
      ],
      primaryCtaText: 'Launch Discovery Tour →',
      previewSnippet: 'Banner surfaces non-intrusively in top toolbar when eligible task context is active.',
    },
  },
  'Email Marketing': {
    name: 'Email Marketing',
    stage: 'AWARE',
    objective: 'Re-engage inactive eligible cohorts with targeted, role-specific outcome announcements.',
    bestFor: 'Broad enterprise audiences who do not log into the web application daily.',
    typicalImpact: 'Medium',
    typicalEffort: 'Low',
    solutionType: 'campaign',
    defaultSuccessMetric: 'Email Open Rate (> 35%) and Re-activation CTR (> 8%)',
    behaviorToChange: 'Zero mental availability → intentional product launch visit',
    wireframeSpec: {
      componentName: 'RoleTargetedEmailDigest',
      badge: 'EXECUTIVE UPDATE',
      headline: 'Your Weekly Hours-Saved Forecast with AI',
      subheadline: 'Personalized breakdown of top 3 manual tasks automated for your role.',
      contextItems: ['✓ 3.5 hrs estimated weekly savings', '✓ Pre-configured for your team'],
      actionOptions: [
        { label: 'Claim Your Pre-Built Workspace', isPrimary: true },
        { label: 'View 2-Min Video', isPrimary: false },
      ],
      primaryCtaText: 'Open My Workspace →',
    },
  },
  'Leadership Communications': {
    name: 'Leadership Communications',
    stage: 'AWARE',
    objective: 'Establish executive sponsorship and strategic organizational mandate for adoption.',
    bestFor: 'Enterprise rollouts where employees perceive tool adoption as optional or unsupported.',
    typicalImpact: 'High',
    typicalEffort: 'Low',
    solutionType: 'campaign',
    defaultSuccessMetric: 'Department-wide initial login rate (> 65%)',
    behaviorToChange: 'Perceived optionality → clear organizational priority',
    wireframeSpec: {
      componentName: 'ExecutiveSponsorshipMemo',
      badge: 'LEADERSHIP BRIEFING',
      headline: 'Strategic AI Enablement: Elevating Team Productivity',
      subheadline: 'Message from VP of Operations on new workflow acceleration standards.',
      contextItems: ['✓ Executive mandate', '✓ Allocated learning time approved'],
      actionOptions: [
        { label: 'Read Strategic Vision', isPrimary: true },
        { label: 'Register for Townhall Demo', isPrimary: false },
      ],
      primaryCtaText: 'Access Executive Toolkit →',
    },
  },
  'Micro-Content/Short-Form Video': {
    name: 'Micro-Content/Short-Form Video',
    stage: 'AWARE',
    objective: 'Deliver 15-30 second digestible teaser video clips showing tangible before/after wins.',
    bestFor: 'Time-constrained users who ignore long email newsletters and formal documentation.',
    typicalImpact: 'Medium',
    typicalEffort: 'Low',
    solutionType: 'ux_intervention',
    defaultSuccessMetric: 'Video completion rate (> 72%) and direct click-through to try',
    behaviorToChange: 'Passive scrolling → instant 30-second trial intent',
    wireframeSpec: {
      componentName: 'MicroVideoTeaserPlayer',
      badge: '30-SEC DEMO',
      headline: 'Watch: How to Summarize 40 Pages in 5 Seconds',
      subheadline: 'Side-by-side comparison of manual copy-paste vs 1-click Copilot workflow.',
      contextItems: ['⏱️ 28 seconds total duration', '⚡ Instant runnable prompt template'],
      actionOptions: [
        { label: 'Play Video', isPrimary: true, icon: 'Play' },
        { label: 'Copy Prompt Template', isPrimary: false },
      ],
      primaryCtaText: 'Try This in Your Account →',
    },
  },

  // DESIRE
  'Landing page': {
    name: 'Landing page',
    stage: 'DESIRE',
    objective: 'Showcase concrete value propositions, social proof, and role-based outcomes.',
    bestFor: 'Inbound evaluation and internal promotional hubs targeting hesitant teams.',
    typicalImpact: 'High',
    typicalEffort: 'Medium',
    solutionType: 'ux_intervention',
    defaultSuccessMetric: 'Landing page visitor-to-trial conversion (> 12%)',
    behaviorToChange: 'Ambiguous value perception → high-intent trial registration',
    wireframeSpec: {
      componentName: 'RoleBasedValueLandingPage',
      badge: 'VALUE HUB',
      headline: 'Built Specifically for Enterprise Sales & Operations Teams',
      subheadline: 'Eliminate 6+ hours of manual administrative reporting every week.',
      contextItems: ['✓ 94% user satisfaction in pilot cohort', '✓ Instant setup with SSO'],
      actionOptions: [
        { label: 'Start 1-Click Interactive Demo', isPrimary: true },
        { label: 'Read Case Studies', isPrimary: false },
      ],
      primaryCtaText: 'Start Free Trial Now →',
    },
  },
  'Take a tour sliders': {
    name: 'Take a tour sliders',
    stage: 'DESIRE',
    objective: 'Provide a lightweight, self-paced 3-slide visual preview of high-impact outcomes.',
    bestFor: 'Curious visitors who want to understand product capabilities without reading heavy docs.',
    typicalImpact: 'Medium',
    typicalEffort: 'Low',
    solutionType: 'ux_intervention',
    defaultSuccessMetric: 'Tour slide completion (> 65%) and CTA click rate',
    behaviorToChange: 'Feature skepticism → clear mental model of outcome',
    wireframeSpec: {
      componentName: 'InteractiveTourSliderWidget',
      badge: '3-STEP TOUR',
      headline: 'Step 1: Connect CRM in 1-Click',
      subheadline: 'Zero API keys required. Automatic data grounding in your daily tools.',
      contextItems: ['Slide 1 of 3: Connect', 'Slide 2 of 3: Generate', 'Slide 3 of 3: Ship'],
      actionOptions: [
        { label: 'Next: See AI Generation', isPrimary: true },
        { label: 'Skip to Workspace', isPrimary: false },
      ],
      primaryCtaText: 'Next Step →',
    },
  },
  'Benefit-Oriented Messaging': {
    name: 'Benefit-Oriented Messaging',
    stage: 'DESIRE',
    objective: 'Replace feature-first descriptions with tangible, role-tailored time-savings and accuracy metrics.',
    bestFor: 'Products whose marketing is too technical or generic.',
    typicalImpact: 'High',
    typicalEffort: 'Low',
    solutionType: 'campaign',
    defaultSuccessMetric: 'CTA click-through rate lift (+45%)',
    behaviorToChange: 'Generic indifference → urgent desire for time-savings',
    wireframeSpec: {
      componentName: 'BenefitOrientedHeroCallout',
      badge: 'PROVEN ROI',
      headline: 'Spend 80% Less Time Writing Routine Deal Summaries',
      subheadline: 'Tested across 40,000 reps: Turn 45-minute memo writing into a 2-minute review.',
      contextItems: ['⏱️ 43 minutes saved per deal', '🎯 98% data citation accuracy'],
      actionOptions: [
        { label: 'Calculate Your Team Savings', isPrimary: true },
        { label: 'See Live Example', isPrimary: false },
      ],
      primaryCtaText: 'Unlock Benefit Now →',
    },
  },
  'User Testimonials/Case Studies': {
    name: 'User Testimonials/Case Studies',
    stage: 'DESIRE',
    objective: 'Leverage peer social proof and authentic peer success stories to conquer status quo bias.',
    bestFor: 'Skeptical teams that need validation from recognized colleagues or industry peers.',
    typicalImpact: 'High',
    typicalEffort: 'Medium',
    solutionType: 'campaign',
    defaultSuccessMetric: 'Social proof engagement and subsequent trial activation (+35%)',
    behaviorToChange: 'Risk aversion → peer confidence & FOMO',
    wireframeSpec: {
      componentName: 'PeerCaseStudySpotlight',
      badge: 'PEER PROOF',
      headline: '"This cut our quarterly close cycle by 4 full days."',
      subheadline: 'Sarah Lin · Senior Account Executive, Enterprise Commercial Pod',
      contextItems: ['⭐ 120+ team runs in Month 1', '🏆 Top performer recommended'],
      actionOptions: [
        { label: 'Read Sarah’s 3 Top Prompts', isPrimary: true },
        { label: 'Watch 60s Interview', isPrimary: false },
      ],
      primaryCtaText: 'Adopt Sarah’s Template →',
    },
  },
  'Interactive Demos/Simulations': {
    name: 'Interactive Demos/Simulations',
    stage: 'DESIRE',
    objective: 'Provide a zero-auth, live interactive sandbox demonstrating real time-savings on sample data.',
    bestFor: 'Users with high switching costs or hesitation who want proof of value before committing to setup.',
    typicalImpact: 'High',
    typicalEffort: 'Medium',
    solutionType: 'ux_intervention',
    defaultSuccessMetric: 'Simulator completion rate (> 75%) and trial conversion (> 25%)',
    behaviorToChange: 'Ambiguous ROI skepticism → verified time-savings confidence',
    wireframeSpec: {
      componentName: 'ZeroAuthInteractiveSimulator',
      badge: 'LIVE SIMULATOR',
      headline: 'Test Your Daily Tasks in a 60-Second Sandbox',
      subheadline: 'Select your role and drag a sample deal record to see instant AI synthesis.',
      contextItems: ['✓ Zero signup required', '✓ Instant before/after comparison'],
      actionOptions: [
        { label: '⚡ Run Account Review Simulation', isPrimary: true },
        { label: '⚠️ Run Deal Risk Analysis', isPrimary: false },
      ],
      primaryCtaText: 'Experience Live Simulation →',
    },
  },

  // OPEN
  'FRE & Guided Tours': {
    name: 'FRE & Guided Tours',
    stage: 'OPEN',
    objective: 'Deliver a streamlined First-Run Experience (FRE) that guarantees a successful first output in < 60s.',
    bestFor: 'Users dropping off immediately after signup due to blank-canvas paralysis.',
    typicalImpact: 'High',
    typicalEffort: 'Medium',
    solutionType: 'onboarding',
    defaultSuccessMetric: 'FRE completion rate (> 80%) and Day-1 first value achieved',
    behaviorToChange: 'Blank-canvas dread → guided immediate first success',
    wireframeSpec: {
      componentName: 'GuidedFirstRunExperience',
      badge: 'STEP 1 OF 3',
      headline: 'Let’s Generate Your First AI Output Together',
      subheadline: 'We pre-loaded a sample project. Click "Run" to test prompt synthesis.',
      contextItems: ['✓ Sample data pre-seeded', '✓ Takes < 30 seconds'],
      actionOptions: [
        { label: 'Run Guided Analysis Now', isPrimary: true },
        { label: 'Choose Different Role Template', isPrimary: false },
      ],
      primaryCtaText: 'Generate First Result (1-Click) →',
    },
  },
  'Quick Start Guides/Cheat Sheets': {
    name: 'Quick Start Guides/Cheat Sheets',
    stage: 'OPEN',
    objective: 'Provide compact 1-page cheatsheets and actionable keyboard shortcut references.',
    bestFor: 'Users who prefer self-directed, scannable quick references over interactive walkthroughs.',
    typicalImpact: 'Medium',
    typicalEffort: 'Low',
    solutionType: 'onboarding',
    defaultSuccessMetric: 'Cheatsheet download/pin rate and D1 task initiation',
    behaviorToChange: 'Setup confusion → instant reference confidence',
    wireframeSpec: {
      componentName: 'QuickStartCheatSheetDock',
      badge: '1-PAGE CHEATSHEET',
      headline: 'Essential Copilot Shortcuts & Prompt Syntax',
      subheadline: 'The 5 essential prompt structures used by top performers.',
      contextItems: ['📄 Printable 1-pager', '⌨️ Top 4 keyboard shortcuts'],
      actionOptions: [
        { label: 'Download PDF Cheatsheet', isPrimary: true },
        { label: 'Pin to Workspace Dock', isPrimary: false },
      ],
      primaryCtaText: 'Pin Cheatsheet to Sidebar →',
    },
  },
  'AI-Powered Onboarding Bots': {
    name: 'AI-Powered Onboarding Bots',
    stage: 'OPEN',
    objective: 'Interactive conversational assistant that configures user settings and walks through first task.',
    bestFor: 'Complex products with multiple configuration options and roles.',
    typicalImpact: 'High',
    typicalEffort: 'High',
    solutionType: 'onboarding',
    defaultSuccessMetric: 'Bot-assisted onboarding completion rate (> 85%)',
    behaviorToChange: 'Configuration fatigue → interactive conversational setup',
    wireframeSpec: {
      componentName: 'ConversationalOnboardingBot',
      badge: 'AI SETUP CONCIERGE',
      headline: 'Hi! What is your top focus this week?',
      subheadline: 'I will auto-configure your workspace templates based on your answers.',
      contextItems: ['🤖 2 quick questions', '⚡ Auto-seeds your workspace'],
      actionOptions: [
        { label: 'Closing Q3 Enterprise Deals', isPrimary: true },
        { label: 'Quarterly Financial Planning', isPrimary: false },
      ],
      primaryCtaText: 'Auto-Configure Workspace →',
    },
  },
  'Single Sign-On (SSO) & Pre-configuration': {
    name: 'Single Sign-On (SSO) & Pre-configuration',
    stage: 'OPEN',
    objective: 'Eliminate account creation, permission requests, and configuration barriers.',
    bestFor: 'Enterprise environments where password fatigue and admin approval block activation.',
    typicalImpact: 'High',
    typicalEffort: 'Medium',
    solutionType: 'onboarding',
    defaultSuccessMetric: 'Zero-friction launch conversion (> 95%)',
    behaviorToChange: 'Access friction & approval delays → instant 1-click entry',
    wireframeSpec: {
      componentName: 'PreConfiguredSSOPortal',
      badge: 'ZERO CONFIGURATION',
      headline: 'Single Sign-On Active · Workspace Pre-Configured',
      subheadline: 'Your corporate credentials and role permissions have already been verified.',
      contextItems: ['✓ Enterprise Okta SSO linked', '✓ Sales pod permissions verified'],
      actionOptions: [
        { label: 'Enter Pre-Configured Workspace', isPrimary: true },
      ],
      primaryCtaText: 'Launch Instant Workspace →',
    },
  },
  'In-Product Help & Tooltips': {
    name: 'In-Product Help & Tooltips',
    stage: 'OPEN',
    objective: 'Provide contextual micro-hints on UI buttons and inputs to prevent dead ends.',
    bestFor: 'Users getting stuck on specific form inputs or ambiguous terminology.',
    typicalImpact: 'Medium',
    typicalEffort: 'Low',
    solutionType: 'ux_intervention',
    defaultSuccessMetric: 'Tooltip hover resolution rate and form completion lift (+30%)',
    behaviorToChange: 'Form hesitation → confident action execution',
    wireframeSpec: {
      componentName: 'ContextualTooltipHelper',
      badge: 'PRO TIP',
      headline: 'Type "/" to Insert CRM Variables',
      subheadline: 'Dynamically pull customer name, opportunity ARR, and contract terms directly into prompt.',
      contextItems: ['💡 1-click variable auto-complete', '⚡ Speeds up prompt writing by 4x'],
      actionOptions: [
        { label: 'Try Typing "/" Now', isPrimary: true },
      ],
      primaryCtaText: 'Got It →',
    },
  },
  'Contextual Help': {
    name: 'Contextual Help',
    stage: 'OPEN',
    objective: 'Dynamically surface relevant troubleshooting tips matching the user’s current screen state.',
    bestFor: 'First-time users experiencing unexpected errors or empty state confusion.',
    typicalImpact: 'Medium',
    typicalEffort: 'Low',
    solutionType: 'ux_intervention',
    defaultSuccessMetric: 'Self-serve issue resolution rate (> 78%)',
    behaviorToChange: 'Session abandonment upon error → immediate self-serve recovery',
    wireframeSpec: {
      componentName: 'ContextualHelpFlyout',
      badge: 'INSTANT ASSIST',
      headline: 'Need Help Connecting Your Data Source?',
      subheadline: 'Here are the 2 most common questions for your role.',
      contextItems: ['✓ Connecting Outlook Calendars', '✓ Linking Salesforce Opportunities'],
      actionOptions: [
        { label: '1-Click Reconnect Data', isPrimary: true },
        { label: 'Chat with Support', isPrimary: false },
      ],
      primaryCtaText: 'Auto-Fix Connection →',
    },
  },

  // PROFICIENT
  'Automated Task Support': {
    name: 'Automated Task Support',
    stage: 'PROFICIENT',
    objective: 'Provide inline scaffolding, 1-click contextual prompt recipes, and verification trust markers.',
    bestFor: 'Users who tried the product but struggle with prompt phrasing and verifying unpredictable outputs.',
    typicalImpact: 'High',
    typicalEffort: 'Medium',
    solutionType: 'prompt_workflow',
    defaultSuccessMetric: 'Task completion rate without manual fallback (> 80%)',
    behaviorToChange: 'Manual verification burden → confident habitual completion',
    wireframeSpec: {
      componentName: 'OutputConfidenceVerificationWidget',
      badge: 'INLINE VERIFICATION ACTIVE',
      headline: 'Account Executive Briefing Ready',
      subheadline: 'All 4 deal risk factors verified against Salesforce Opportunity #8821.',
      contextItems: [
        '✓ Opportunity Stage: Negotiation (Verified via CRM)',
        '✓ Primary Objection: Budget cap mentioned in thread #4',
        '✓ Recommended Pricing Floor: $140,000 ARR',
      ],
      actionOptions: [
        { label: '⚡ Summarize Account History', isPrimary: true, icon: 'FileText' },
        { label: '⚠️ Identify Key Deal Risks', isPrimary: false, icon: 'AlertTriangle' },
        { label: '❓ Generate Executive Questions', isPrimary: false, icon: 'HelpCircle' },
      ],
      primaryCtaText: 'Accept & Insert into CRM (1-Click) →',
      previewSnippet: 'Confidence badge (96% Certainty) with hoverable source citations guarantees trust.',
    },
  },
  'Advanced Tutorials': {
    name: 'Advanced Tutorials',
    stage: 'PROFICIENT',
    objective: 'Interactive modules teaching multi-turn prompt chains and advanced parameter tuning.',
    bestFor: 'Intermediate users seeking to unlock complex, high-value multi-step automations.',
    typicalImpact: 'Medium',
    typicalEffort: 'Medium',
    solutionType: 'prompt_workflow',
    defaultSuccessMetric: 'Advanced module graduation rate and complex query volume lift',
    behaviorToChange: 'Basic 1-line queries → complex high-leverage prompt workflows',
    wireframeSpec: {
      componentName: 'MasteryTutorialModule',
      badge: 'PRO TRACK',
      headline: 'Mastering Multi-Document Synthesis',
      subheadline: 'Learn how to compare 3 RFP contracts in a single prompt chain.',
      contextItems: ['🎓 5-minute interactive lesson', '🏆 Earn Pro Badge upon completion'],
      actionOptions: [
        { label: 'Start Interactive Lesson', isPrimary: true },
        { label: 'Browse Code Recipes', isPrimary: false },
      ],
      primaryCtaText: 'Launch Tutorial Sandbox →',
    },
  },
  'User Forums/Communities': {
    name: 'User Forums/Communities',
    stage: 'PROFICIENT',
    objective: 'Internal peer discussion channels for troubleshooting and workflow exchange.',
    bestFor: 'Enterprise teams facing domain-specific edge cases not covered in general docs.',
    typicalImpact: 'Medium',
    typicalEffort: 'Low',
    solutionType: 'champion_program',
    defaultSuccessMetric: 'Community Q&A answer rate (< 2 hr response time) and active contributors',
    behaviorToChange: 'Silent struggling → open peer collaboration',
    wireframeSpec: {
      componentName: 'InternalCommunityForumWidget',
      badge: 'COMMUNITY FEED',
      headline: 'Recent Discussions in #ai-champions-sales',
      subheadline: 'How colleagues solved contract analysis and custom CRM filters.',
      contextItems: ['💬 14 new answers today', '⭐ Vetted by power users'],
      actionOptions: [
        { label: 'Ask a Question in Slack', isPrimary: true },
        { label: 'Search Solved Answers', isPrimary: false },
      ],
      primaryCtaText: 'Join Slack Community →',
    },
  },
  'Knowledge Base/FAQs': {
    name: 'Knowledge Base/FAQs',
    stage: 'PROFICIENT',
    objective: 'Searchable repository of vetted prompt recipes, FAQs, and integration guides.',
    bestFor: 'Users looking for quick answers to specific technical questions or policy limits.',
    typicalImpact: 'Medium',
    typicalEffort: 'Low',
    solutionType: 'prompt_workflow',
    defaultSuccessMetric: 'Search deflection rate (> 60%) and positive article ratings',
    behaviorToChange: 'Ticket submission → self-serve instant lookup',
    wireframeSpec: {
      componentName: 'SearchableKnowledgeBaseHub',
      badge: 'VERIFIED REPO',
      headline: 'Enterprise Prompt & FAQ Knowledge Base',
      subheadline: 'Search 250+ tested prompts across Sales, Legal, and Marketing.',
      contextItems: ['🔍 Instant typeahead search', '✓ Legal-approved templates'],
      actionOptions: [
        { label: 'Top 10 Sales Prompts', isPrimary: true },
        { label: 'Security & Compliance FAQ', isPrimary: false },
      ],
      primaryCtaText: 'Search Knowledge Base →',
    },
  },
  'In-App Surveys/Feedback Prompts': {
    name: 'In-App Surveys/Feedback Prompts',
    stage: 'PROFICIENT',
    objective: 'Capture micro-feedback (thumbs up/down with 1-click tags) immediately following generation.',
    bestFor: 'Identifying specific output failure patterns and hallucination hot-spots.',
    typicalImpact: 'High',
    typicalEffort: 'Low',
    solutionType: 'ux_intervention',
    defaultSuccessMetric: 'Survey response rate (> 15%) and actionable friction tagging',
    behaviorToChange: 'Silent task abandonment → actionable feedback telemetry',
    wireframeSpec: {
      componentName: 'InlineOutputFeedbackWidget',
      badge: 'MICRO FEEDBACK',
      headline: 'Was this output helpful and accurate?',
      subheadline: 'Click thumbs up/down to help us fine-tune models for your pod.',
      contextItems: ['👍 Accurate & ready', '👎 Needed manual edit', '⚠️ Sourced wrong data'],
      actionOptions: [
        { label: '👍 Looks great', isPrimary: true },
        { label: '👎 Needed manual edit', isPrimary: false },
      ],
      primaryCtaText: 'Submit Quick Feedback →',
    },
  },
  'Usage Analytics': {
    name: 'Usage Analytics',
    stage: 'PROFICIENT',
    objective: 'Provide managers and individual users with transparency into time-saved metrics and habits.',
    bestFor: 'Reinforcing positive habits and identifying teams falling behind in weekly usage.',
    typicalImpact: 'High',
    typicalEffort: 'Medium',
    solutionType: 'ux_intervention',
    defaultSuccessMetric: 'Weekly analytics dashboard engagement and sustained WAU/MAU (> 45%)',
    behaviorToChange: 'Uncertain habit progress → visible quantified productivity score',
    wireframeSpec: {
      componentName: 'PersonalProductivityAnalytics',
      badge: 'WEEKLY IMPACT',
      headline: 'You Saved 4.2 Hours This Week with Copilot',
      subheadline: '18 workflows executed · 94% task completion without manual fallback.',
      contextItems: ['⏱️ 4.2 hrs saved this week', '📈 +18% vs last week'],
      actionOptions: [
        { label: 'View Time-Saved Breakdown', isPrimary: true },
        { label: 'Share Report with Manager', isPrimary: false },
      ],
      primaryCtaText: 'Explore Personal Analytics →',
    },
  },
  'Personalized Learning Paths': {
    name: 'Personalized Learning Paths',
    stage: 'PROFICIENT',
    objective: 'Deliver adaptive learning modules tailored to the specific tools and workflows used by each role.',
    bestFor: 'Organizations with diverse roles (e.g. Sales vs Engineers vs Support) needing tailored training.',
    typicalImpact: 'High',
    typicalEffort: 'Medium',
    solutionType: 'prompt_workflow',
    defaultSuccessMetric: 'Path milestone completion rate (> 70%)',
    behaviorToChange: 'One-size-fits-all training fatigue → role-specific mastery',
    wireframeSpec: {
      componentName: 'AdaptiveLearningPathWidget',
      badge: 'CUSTOM CURRICULUM',
      headline: 'Your Tailored Enterprise Sales Mastery Path',
      subheadline: '3 quick missions designed for Account Executives managing $100k+ pipelines.',
      contextItems: ['Mission 1: Meeting Prep (Completed)', 'Mission 2: Objection Handling (Up Next)'],
      actionOptions: [
        { label: 'Start Mission 2 (3 mins)', isPrimary: true },
        { label: 'View Full Roadmap', isPrimary: false },
      ],
      primaryCtaText: 'Continue Learning Path →',
    },
  },

  // TRANSFORM
  'Champions Programs': {
    name: 'Champions Programs',
    stage: 'TRANSFORM',
    objective: 'Empower departmental power users as certified coaches with dedicated badges and sharing tools.',
    bestFor: 'Scaling adoption organically across teams without requiring central IT intervention.',
    typicalImpact: 'High',
    typicalEffort: 'Medium',
    solutionType: 'champion_program',
    defaultSuccessMetric: 'Champions active per department and peer template multiplier (> 2.5x)',
    behaviorToChange: 'Isolated power-user silos → peer-led organizational transformation',
    wireframeSpec: {
      componentName: 'DepartmentChampionNetworkHub',
      badge: 'CHAMPIONS NETWORK',
      headline: 'Certified AI Champions · Sales & Operations Pod',
      subheadline: 'Meet the 12 certified power users helping teams build custom workflows.',
      contextItems: ['⭐ 48 team runs this week', '🏆 Certified Champion status'],
      actionOptions: [
        { label: 'Book 15-Min Champion Office Hours', isPrimary: true },
        { label: 'Apply to Become a Champion', isPrimary: false },
      ],
      primaryCtaText: 'Join Champions Guild →',
    },
  },
  'User-Led Success Stories': {
    name: 'User-Led Success Stories',
    stage: 'TRANSFORM',
    objective: 'Highlight real employee achievements and workflow breakdowns in team townhalls and newsletters.',
    bestFor: 'Creating viral FOMO and celebrating colleagues who transformed their daily tasks.',
    typicalImpact: 'High',
    typicalEffort: 'Low',
    solutionType: 'campaign',
    defaultSuccessMetric: 'Story readership and template forks from featured spotlights (+50%)',
    behaviorToChange: 'Abstract AI skepticism → tangible colleague admiration & emulation',
    wireframeSpec: {
      componentName: 'EmployeeSuccessStorySpotlight',
      badge: 'STORY SPOTLIGHT',
      headline: 'How Marcus Automated 15 Weekly RFP Submissions',
      subheadline: 'Marcus shares his 3-step prompt formula that saved 12 hours every sprint.',
      contextItems: ['🏆 Pod Impact Award Winner', '⚡ 1-click forkable blueprint included'],
      actionOptions: [
        { label: 'Fork Marcus’s RFP Blueprint', isPrimary: true },
        { label: 'Watch 2-Min Walkthrough', isPrimary: false },
      ],
      primaryCtaText: 'Fork This Blueprint (1-Click) →',
    },
  },
  'Idea Submission': {
    name: 'Idea Submission',
    stage: 'TRANSFORM',
    objective: 'Crowdsource high-impact automation ideas and custom tool requests directly from end users.',
    bestFor: 'Identifying the next high-ROI use cases directly from frontline workflows.',
    typicalImpact: 'Medium',
    typicalEffort: 'Low',
    solutionType: 'champion_program',
    defaultSuccessMetric: 'Ideas submitted per month and implementation rate (> 20%)',
    behaviorToChange: 'Passive tool consumption → active innovation co-creation',
    wireframeSpec: {
      componentName: 'WorkflowIdeaSubmissionPortal',
      badge: 'CO-INNOVATION',
      headline: 'Submit a Workflow Idea for Copilot Acceleration',
      subheadline: 'What manual task takes your team the most time each week?',
      contextItems: ['💡 Top voted ideas receive engineering build support', '🎁 $500 team innovation prize'],
      actionOptions: [
        { label: 'Submit New Workflow Idea', isPrimary: true },
        { label: 'Upvote Existing Ideas', isPrimary: false },
      ],
      primaryCtaText: 'Submit Workflow Idea →',
    },
  },
  'Community Spotlights': {
    name: 'Community Spotlights',
    stage: 'TRANSFORM',
    objective: 'Celebrate departmental achievements and rank teams on adoption milestones.',
    bestFor: 'Driving friendly cross-departmental competition and mutual learning.',
    typicalImpact: 'Medium',
    typicalEffort: 'Low',
    solutionType: 'champion_program',
    defaultSuccessMetric: 'Department participation rate and inter-pod workflow sharing (+40%)',
    behaviorToChange: 'Isolated silo performance → healthy cross-departmental benchmark pride',
    wireframeSpec: {
      componentName: 'DepartmentLeaderboardSpotlight',
      badge: 'POD LEADERBOARD',
      headline: 'Top Adopting Teams This Month',
      subheadline: 'Enterprise Sales Pod #2 achieved 88% repeat workflow adoption.',
      contextItems: ['🥇 1st Place: Sales Pod 2 (88%)', '🥈 2nd Place: Customer Success (79%)'],
      actionOptions: [
        { label: 'View Department Recipes', isPrimary: true },
        { label: 'Challenge Pod Benchmark', isPrimary: false },
      ],
      primaryCtaText: 'See Pod Strategies →',
    },
  },
  'Community-Driven Content': {
    name: 'Community-Driven Content',
    stage: 'TRANSFORM',
    objective: 'Enable users to publish, rate, and curate custom prompt templates and workflow recipes.',
    bestFor: 'Creating a self-sustaining internal ecosystem of specialized prompt recipes.',
    typicalImpact: 'High',
    typicalEffort: 'Medium',
    solutionType: 'champion_program',
    defaultSuccessMetric: 'Templates published monthly (> 50) and template fork velocity',
    behaviorToChange: 'Private prompt hoarding → open team template repository',
    wireframeSpec: {
      componentName: 'CommunityTemplateGallery',
      badge: 'COMMUNITY REPO',
      headline: 'Community-Vetted Sales & Ops Recipes',
      subheadline: 'Explore 80+ recipes authored and maintained by your colleagues.',
      contextItems: ['⭐ 4.9 average user rating', '🔄 Auto-updates with latest model changes'],
      actionOptions: [
        { label: 'Publish My Recipe to Gallery', isPrimary: true },
        { label: 'Browse by Department', isPrimary: false },
      ],
      primaryCtaText: 'Browse 80+ Recipes →',
    },
  },
  'Recognition & Rewards': {
    name: 'Recognition & Rewards',
    stage: 'TRANSFORM',
    objective: 'Recognize top adopting employees with verifiable LinkedIn badges, internal perks, and awards.',
    bestFor: 'Gamifying adoption and establishing high status around prompt literacy.',
    typicalImpact: 'High',
    typicalEffort: 'Low',
    solutionType: 'champion_program',
    defaultSuccessMetric: 'Champion badge claim rate and ongoing retention (+30%)',
    behaviorToChange: 'Unrecognized effort → high-status peer recognition',
    wireframeSpec: {
      componentName: 'ChampionRecognitionBadgeModal',
      badge: 'OFFICIAL CERTIFICATION',
      headline: 'Congratulations! You Earned Master Copilot Status',
      subheadline: 'Top 5% productivity score across the entire organization.',
      contextItems: ['🏆 Official Certified Prompt Master Badge', '🎖️ Shareable on LinkedIn & Slack'],
      actionOptions: [
        { label: 'Add Badge to Slack Profile', isPrimary: true },
        { label: 'Claim Champion Swag Kit', isPrimary: false },
      ],
      primaryCtaText: 'Share Achievement with Team →',
    },
  },
  'Copilot-Generated Impact Reports': {
    name: 'Copilot-Generated Impact Reports',
    stage: 'TRANSFORM',
    objective: 'Automatically generate executive-ready ROI and time-saved summary slide decks.',
    bestFor: 'Demonstrating business impact to C-suite stakeholders and securing license expansions.',
    typicalImpact: 'High',
    typicalEffort: 'Low',
    solutionType: 'champion_program',
    defaultSuccessMetric: 'Executive report generation frequency and stakeholder approval',
    behaviorToChange: 'Invisible ROI → executive-verified business value transformation',
    wireframeSpec: {
      componentName: 'ExecutiveImpactReportGenerator',
      badge: 'EXECUTIVE ROI',
      headline: 'Q3 Enterprise Copilot Impact Report',
      subheadline: 'Aggregate analysis: 14,200 hours saved across 40,000 employees.',
      contextItems: ['📊 $1.4M estimated annualized cost efficiency', '📈 3.4x faster RFP turnaround'],
      actionOptions: [
        { label: 'Export 1-Click Executive PDF Slide Deck', isPrimary: true },
        { label: 'Schedule Leadership Presentation', isPrimary: false },
      ],
      primaryCtaText: 'Download Executive Report →',
    },
  },
};

/**
 * Returns the official playbook interventions for a specific ADOPT stage.
 */
export function getPlaybookForStage(stage: AdoptStageKey): readonly string[] {
  return OFFICIAL_ADOPT_PLAYBOOK[stage] || [];
}

/**
 * Returns a flat array of all official playbook interventions across all stages.
 */
export function getAllPlaybookInterventions(): string[] {
  return Object.values(OFFICIAL_ADOPT_PLAYBOOK).flat();
}

/**
 * Checks if a given intervention title matches or starts with an official playbook intervention name.
 */
export function isPlaybookInitiative(title: string): boolean {
  if (!title) return false;
  const allPlays = getAllPlaybookInterventions();
  const normalizedTitle = title.trim().toLowerCase();
  return allPlays.some((play) => {
    const normPlay = play.toLowerCase();
    return (
      normalizedTitle === normPlay ||
      normalizedTitle.startsWith(normPlay) ||
      normPlay.startsWith(normalizedTitle) ||
      normalizedTitle.includes(normPlay) ||
      normPlay.includes(normalizedTitle)
    );
  });
}

/**
 * Finds the closest official playbook intervention name matching a given title.
 */
export function findPlaybookMatch(title: string, stage?: AdoptStageKey): string | null {
  if (!title) return null;
  const candidatePlays = stage ? getPlaybookForStage(stage) : getAllPlaybookInterventions();
  const normalizedTitle = title.trim().toLowerCase();
  
  // Exact match
  for (const play of candidatePlays) {
    if (normalizedTitle === play.toLowerCase()) {
      return play;
    }
  }
  // Starts with or includes
  for (const play of candidatePlays) {
    const normPlay = play.toLowerCase();
    if (normalizedTitle.startsWith(normPlay) || normPlay.startsWith(normalizedTitle) || normalizedTitle.includes(normPlay) || normPlay.includes(normalizedTitle)) {
      return play;
    }
  }
  return null;
}

/**
 * Returns detailed metadata for an intervention by name.
 */
export function getPlaybookInterventionMeta(name: string, stage?: AdoptStageKey): PlaybookInterventionMeta | null {
  const match = findPlaybookMatch(name, stage) || name;
  return PLAYBOOK_INTERVENTION_DETAILS[match] || null;
}

/**
 * Formats the official ADOPT playbook into structured text for injection into LLM system prompts.
 */
export function formatPlaybookForSystemPrompt(focusStage?: AdoptStageKey): string {
  let promptText = `=======================================================
OFFICIAL ADOPT PLAYBOOK INTERVENTION REGISTRY
=======================================================\n`;

  if (focusStage && OFFICIAL_ADOPT_PLAYBOOK[focusStage]) {
    const plays = OFFICIAL_ADOPT_PLAYBOOK[focusStage];
    const principles = ADOPT_STAGE_PRINCIPLES[focusStage];
    promptText += `PRIMARY FOCUS STAGE [${focusStage}]:
- Core Principle: ${principles.corePrinciple}
- Failure Mechanism: ${principles.failureMechanism}
- Design Tone: ${principles.designTone}
- Key Rule: ${principles.keyRule}
- Official Playbook Interventions for [${focusStage}]:
${plays.map((p, idx) => `  ${idx + 1}. "${p}"`).join('\n')}\n\n`;
  }

  promptText += `COMPLETE 5-STAGE ADOPT PLAYBOOK TAXONOMY:
[AWARE]:
${OFFICIAL_ADOPT_PLAYBOOK.AWARE.map(p => `  - "${p}"`).join('\n')}

[DESIRE]:
${OFFICIAL_ADOPT_PLAYBOOK.DESIRE.map(p => `  - "${p}"`).join('\n')}

[OPEN]:
${OFFICIAL_ADOPT_PLAYBOOK.OPEN.map(p => `  - "${p}"`).join('\n')}

[PROFICIENT]:
${OFFICIAL_ADOPT_PLAYBOOK.PROFICIENT.map(p => `  - "${p}"`).join('\n')}

[TRANSFORM]:
${OFFICIAL_ADOPT_PLAYBOOK.TRANSFORM.map(p => `  - "${p}"`).join('\n')}
=======================================================`;

  return promptText;
}

/**
 * Synthesizes a complete RecommendationInitiative object from a playbook intervention or custom title.
 */
export function buildInitiativeFromRegistry(
  title: string,
  stage: AdoptStageKey,
  priority: 'P0' | 'P1' | 'P2',
  index: number,
  persona: string = 'Users',
  product: string = 'the product',
  customOverrides?: Partial<RecommendationInitiative>
): RecommendationInitiative {
  const matchedPlaybookTitle = findPlaybookMatch(title, stage);
  const isPlaybook = !!matchedPlaybookTitle;
  const canonicalTitle = matchedPlaybookTitle || title;
  const meta = PLAYBOOK_INTERVENTION_DETAILS[canonicalTitle];

  const pNum = index === 0 ? '01 — P0' : `0${index + 1} — ${priority}`;
  const isHero = index === 0;
  const heroBadge = isHero ? 'P0 · START HERE' : `${pNum.slice(0, 2)} · ${priority}`;
  const rootCauseRef = `RC0${Math.min(3, index + 1)}`;
  const rootCauseBadge = `Addresses ${rootCauseRef}`;

  const impact = meta?.typicalImpact || (priority === 'P0' ? 'High' : 'Medium');
  const effort = meta?.typicalEffort || (index === 0 ? 'Medium' : 'Low');
  const solutionType = meta?.solutionType || (stage === 'PROFICIENT' ? 'prompt_workflow' : stage === 'OPEN' ? 'onboarding' : stage === 'TRANSFORM' ? 'champion_program' : 'ux_intervention');
  const shortDescription = meta?.objective 
    ? `${meta.objective.replace(/user/gi, persona)}` 
    : `Targeted UX intervention designed to accelerate adoption in the ${stage} stage for ${persona}.`;

  const wireframe = meta?.wireframeSpec || {
    componentName: `${canonicalTitle.replace(/[^a-zA-Z0-9]/g, '')}Widget`,
    badge: isPlaybook ? 'PLAYBOOK INTERVENTION' : 'CUSTOM AI INTERVENTION',
    headline: canonicalTitle,
    subheadline: `Accelerate ${stage.toLowerCase()} conversion for ${persona}.`,
    contextItems: [`✓ Grounded in ${product}`, '✓ 1-click execution'],
    actionOptions: [
      { label: `Launch ${canonicalTitle}`, isPrimary: true },
      { label: 'View Details', isPrimary: false },
    ],
    primaryCtaText: `Execute ${canonicalTitle} →`,
  };

  const solutionAsset: SolutionAssetSpec = {
    conceptTitle: wireframe.headline || canonicalTitle,
    behavioralObjective: meta?.objective || `Eliminate behavioral friction in ${stage}.`,
    trigger: `User engages with ${product} during relevant workflow.`,
    solutionType,
    journeySteps: [
      { step: 1, title: 'Context Detection', description: `System detects ${persona} is in ${stage.toLowerCase()} milestone.` },
      { step: 2, title: 'Intervention Surface', description: `${canonicalTitle} is presented inline.` },
      { step: 3, title: 'Action Completion', description: `User executes recommendation with 1-click verification.` },
    ],
    wireframe: {
      componentName: wireframe.componentName,
      badge: wireframe.badge,
      headline: wireframe.headline,
      subheadline: wireframe.subheadline,
      contextItems: wireframe.contextItems,
      actionOptions: wireframe.actionOptions,
      primaryCtaText: wireframe.primaryCtaText,
      interactiveStateExample: wireframe.previewSnippet || '',
    },
    states: [{ name: 'Active', description: `Rendered inline for ${persona}.` }],
    interactionLogic: [`Trigger when ${stage} bottleneck detected.`],
    exampleCopy: [{ element: 'Header', text: canonicalTitle }],
    edgeCases: ['Fallback to standard workflow if dismissed.'],
    instrumentationEvents: [{ eventName: `adopt_${canonicalTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}_executed`, trigger: 'User clicked CTA', properties: ['user_id', 'stage'] }],
    successCriteria: [`Over 60% completion rate for ${canonicalTitle}.`],
  };

  const measurementPlan: MeasurementPlan = {
    primaryMetric: {
      name: meta?.defaultSuccessMetric || `${canonicalTitle} Completion Rate`,
      baseline: '0%',
      target: '65%',
    },
    leadingIndicators: [
      `${canonicalTitle} engagement rate`,
      'Time to completion (< 45s)',
      'Dismissal rate < 12%',
    ],
    behavioralMetric: `${persona} completes task using ${canonicalTitle} rather than manual fallback.`,
    laggingMetric: `D30 Retention Lift in ${stage} (+35%)`,
    guardrails: ['User satisfaction score > 4.5/5'],
  };

  const initiative: RecommendationInitiative = {
    id: `init-${stage.toLowerCase()}-${index + 1}`,
    priority,
    priorityLabel: pNum,
    isPrimaryHero: isHero,
    heroBadge,
    title: canonicalTitle,
    shortDescription,
    targetedStages: [stage],
    whyThis: `Directly addresses the diagnosed ${stage} bottleneck (${rootCauseRef}).`,
    whyThisFirst: `Directly addresses the strongest root cause: ${stage} friction (${rootCauseRef}).`,
    behaviorToChange: meta?.behaviorToChange || `Hesitation / friction in ${stage} → confident habitual completion`,
    movesStage: stage,
    successMetric: meta?.defaultSuccessMetric || `${canonicalTitle} Completion Rate`,
    rootCauseRef,
    rootCauseBadge,
    behavioralObjective: meta?.objective || `Accelerate ${stage} conversion for ${persona}.`,
    impact,
    effort,
    evidenceStrength: 'Strong',
    priorityScore: isHero ? 94 : Math.max(70, 90 - index * 6),
    solutionType,
    isPlaybookMatch: isPlaybook,
    playbookTitle: matchedPlaybookTitle || undefined,
    reasoningChain: {
      evidence: `Observed friction in ${stage} stage for ${persona}`,
      behavioralCause: `${stage} bottleneck: ${ADOPT_STAGE_PRINCIPLES[stage]?.failureMechanism || 'adoption barrier'}`,
      adoptStage: stage,
      targetBehavior: `Achieve mastery in ${stage}`,
      intervention: canonicalTitle,
    },
    measurementPlan,
    solutionAsset,
    ...customOverrides,
  };

  return initiative;
}
