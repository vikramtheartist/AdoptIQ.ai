import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { ArrowUp, ArrowUpRight, Check, CirclePlus, Clock3, MousePointer2, Sparkles, TrendingDown, Activity, Zap } from 'lucide-react';
import { GoogleGenAI, Type, Schema } from '@google/genai';

type AdoptStage = 'AWARE' | 'DESIRE' | 'OPEN' | 'PROFICIENT' | 'TRANSFORM';
type EngineState = 'diagnose' | 'analyzing' | 'results';
type WaveState = 'idle' | 'listening' | 'submitting' | 'analyzing' | 'transitioning' | 'results';

type Intervention = {
  title: string;
  description: string;
  impact: 'High' | 'Medium';
  effort: 'Low' | 'Medium';
  priority: 'P0' | 'P1';
};

type Diagnosis = {
  stageLabel: string;
  stageSubtext: string;
  confidence: number;
  behavioralPattern: string;
  psychologicalDriver: string;
  strategicPrescription: string;
  metricAtRisk: string;
  expectedLift: string;
  diagnosis: string;
  signals: { label: string; detail: string; tone: 'coral' | 'blue' | 'lavender' }[];
  interventions: Intervention[];
  takeaway: string;
};

const stages: { key: AdoptStage; label: string; definition: string; funnelIndex: string }[] = [
  { key: 'AWARE', label: 'Aware', definition: 'Know about product / community', funnelIndex: '01 / AWARE' },
  { key: 'DESIRE', label: 'Desire', definition: 'Ignite Interest to explore', funnelIndex: '02 / DESIRE' },
  { key: 'OPEN', label: 'Open', definition: 'Start getting value', funnelIndex: '03 / OPEN' },
  { key: 'PROFICIENT', label: 'Proficient', definition: 'Engage in the community / workflow', funnelIndex: '04 / PROFICIENT' },
  { key: 'TRANSFORM', label: 'Transform', definition: 'Pillar for the community', funnelIndex: '05 / TRANSFORM' },
];

const fallbackDiagnoses: Record<AdoptStage, Diagnosis> = {
  AWARE: {
    stageLabel: 'Awareness Breakdown',
    stageSubtext: 'Know about product & community',
    confidence: 88,
    behavioralPattern: 'Invisible value',
    psychologicalDriver: 'Attentional blindness',
    metricAtRisk: 'Feature exposure rate (< 5%)',
    expectedLift: '+35% Reach & Exploration',
    strategicPrescription: 'Leverage multi-channel touchpoints where users already work: deploy non-intrusive in-app banners, segmented email alerts, and leadership announcements.',
    diagnosis: 'Users are not encountering the capability at moments of relevant need, preventing them from knowing the community/solution exists.',
    signals: [
      { label: 'Feature discovery is under 5%', detail: 'Low exposure across high-intent active sessions.', tone: 'coral' },
      { label: 'Low navigation reach', detail: 'Users rarely enter or stumble upon the feature surface.', tone: 'blue' },
      { label: 'Search intent unserved', detail: 'Relevant user queries conclude without a clear next action.', tone: 'lavender' },
    ],
    interventions: [
      { title: 'In-Product Banners', description: 'Non-intrusive banners placed directly within relevant applications and active workflows.', impact: 'High', effort: 'Low', priority: 'P0' },
      { title: 'Email Marketing Campaigns', description: 'Segmented campaigns with personalized subject lines highlighting benefits and new features.', impact: 'High', effort: 'Medium', priority: 'P0' },
      { title: 'Leadership Communications', description: 'Top-down announcements and endorsements from organizational leaders to establish priority.', impact: 'High', effort: 'Low', priority: 'P0' },
      { title: 'Micro-Content / Short-Form Video', description: '15-30 second clips demonstrating quick wins on internal platforms and community hubs.', impact: 'Medium', effort: 'Low', priority: 'P1' },
    ],
    takeaway: 'Cut through the noise with targeted, compelling messaging. Leverage multiple touchpoints where your users already are.',
  },
  DESIRE: {
    stageLabel: 'Interest & Motivation Breakdown',
    stageSubtext: 'Ignite Interest to explore',
    confidence: 86,
    behavioralPattern: 'Value ambiguity',
    psychologicalDriver: 'Unclear reward vs effort',
    metricAtRisk: 'Landing-to-Trial Conversion (< 2%)',
    expectedLift: '+28% Trial Start Lift',
    strategicPrescription: 'Focus on benefits over features: embed side-by-side workflow comparisons, quantified ROI calculators, and interactive demos above the fold.',
    diagnosis: 'Users are aware the solution exists, but lack the compelling interest or perceived ROI needed to take the leap and explore it.',
    signals: [
      { label: 'High awareness, low trial intent', detail: 'Page visits fail to translate into active evaluation.', tone: 'coral' },
      { label: 'Abstract value perception', detail: 'Users cannot anticipate a concrete workflow win from the copy.', tone: 'blue' },
      { label: 'Drop-off before trial exploration', detail: 'Evaluation intent fades before the first setup action.', tone: 'lavender' },
    ],
    interventions: [
      { title: 'Dedicated Value Landing Page', description: 'Clearly explain community benefits, member stories, and use cases to spark interest.', impact: 'High', effort: 'Low', priority: 'P0' },
      { title: 'Take a Tour Sliders', description: 'Guided walkthroughs highlighting unique benefits tailored to specific user roles.', impact: 'High', effort: 'Low', priority: 'P0' },
      { title: 'Benefit-Oriented Messaging', description: 'Action-driven messages focusing on how the product helps users complete tasks.', impact: 'High', effort: 'Low', priority: 'P0' },
      { title: 'User Testimonials & Case Studies', description: 'Short, relatable stories from early users demonstrating real impact on their work.', impact: 'Medium', effort: 'Low', priority: 'P1' },
      { title: 'Interactive Demos & Simulations', description: 'Hands-on, low-risk sandbox experiences allowing exploration without friction.', impact: 'High', effort: 'Medium', priority: 'P0' },
    ],
    takeaway: 'Focus on benefits, not just features. Show, don’t just tell. Appeal to their immediate needs and aspirations.',
  },
  OPEN: {
    stageLabel: 'First-Value Breakdown',
    stageSubtext: 'Start getting value',
    confidence: 89,
    behavioralPattern: 'Blank-canvas paralysis',
    psychologicalDriver: 'Cognitive overload at setup',
    metricAtRisk: 'Time-to-First-Value (> 45s)',
    expectedLift: '+42% Completed First Runs',
    strategicPrescription: 'Simplify pathways to first gratification: implement First Run Experiences (FRE), pre-configuration SSO, and contextual AI onboarding bots.',
    diagnosis: 'Users enter the product to start getting value, but friction in onboarding and setup prevents them from experiencing immediate gratification.',
    signals: [
      { label: '42% activation rate drop-off', detail: 'Measured between initial entry and first meaningful value event.', tone: 'coral' },
      { label: 'Time-to-first-value > 45s', detail: 'Exceeds expected baseline threshold by 30 seconds.', tone: 'blue' },
      { label: 'Erratic cursor movement', detail: 'Detected hovering and stalls over blank setup screens.', tone: 'lavender' },
    ],
    interventions: [
      { title: 'FRE & Guided Tours', description: 'Step-by-step guides breaking down complex tasks to navigate key features.', impact: 'High', effort: 'Medium', priority: 'P0' },
      { title: 'Quick Start Guides / Cheat Sheets', description: 'Printable, easy-to-follow instructions for common first-run tasks.', impact: 'Medium', effort: 'Low', priority: 'P1' },
      { title: 'AI-Powered Onboarding Bots', description: 'Smart assistants answering setup questions and guiding users in real time.', impact: 'High', effort: 'Medium', priority: 'P0' },
      { title: 'Single Sign-On (SSO) & Pre-configuration', description: 'Fast setup with pre-filled user data and 1-click workspace entry.', impact: 'High', effort: 'Low', priority: 'P0' },
      { title: 'In-Product Help & Contextual Tooltips', description: 'On-screen tips explaining features right at the moment of need.', impact: 'Medium', effort: 'Low', priority: 'P1' },
    ],
    takeaway: 'Simplicity, clarity, and immediate gratification. Reduce cognitive load and provide clear default pathways.',
  },
  PROFICIENT: {
    stageLabel: 'Engagement & Habit Breakdown',
    stageSubtext: 'Engage in the community / workflow',
    confidence: 94,
    behavioralPattern: 'Habit interruption',
    psychologicalDriver: 'High operational friction',
    metricAtRisk: 'Week-2 Habit Retention (-68%)',
    expectedLift: '+31% Habitual Engagement',
    strategicPrescription: 'Reinforce repeatable routines: deploy automated task support, in-app peer Q&A communities, and personalized learning paths.',
    diagnosis: 'Users try the workflow once but revert to manual routines because multi-step rules and complex syntax prevent repeatable habit formation.',
    signals: [
      { label: 'Reverted to manual clicks', detail: 'Drop-off caused by complex, slow, or multi-step execution friction.', tone: 'coral' },
      { label: 'Week-two retention drop-off', detail: 'Repeat behavior is failing to form after first session.', tone: 'blue' },
      { label: 'Workflow fragmentation', detail: 'Users exit to manual tools due to missing task support.', tone: 'lavender' },
    ],
    interventions: [
      { title: 'Automated Task Support', description: 'Copilot suggests shortcuts, templates, or automation flows based on usage patterns.', impact: 'High', effort: 'Medium', priority: 'P0' },
      { title: 'Advanced In-Depth Tutorials', description: 'Targeted sessions covering advanced features, tips, and operational best practices.', impact: 'Medium', effort: 'Low', priority: 'P1' },
      { title: 'User Forums & Peer Communities', description: 'Spaces for peer learning and continuous Q&A (e.g. community adoption channels).', impact: 'High', effort: 'Low', priority: 'P0' },
      { title: 'Searchable Knowledge Base & FAQs', description: 'Self-help articles for fast answers to prevent workflow interruptions.', impact: 'Medium', effort: 'Low', priority: 'P1' },
      { title: 'In-App Surveys & Feedback Prompts', description: 'Quick mechanisms to gather friction feedback and address pain points.', impact: 'Medium', effort: 'Low', priority: 'P1' },
      { title: 'Personalized Learning Paths', description: 'Suggested mastery challenges and content tailored to user role or activity.', impact: 'High', effort: 'Medium', priority: 'P0' },
    ],
    takeaway: 'Continuous learning, reinforcement, and addressing pain points. Encourage deeper engagement.',
  },
  TRANSFORM: {
    stageLabel: 'Advocacy & Scaling Breakdown',
    stageSubtext: 'Pillar for the community',
    confidence: 92,
    behavioralPattern: 'Unshared expertise',
    psychologicalDriver: 'Low social leverage',
    metricAtRisk: 'Internal Viral Expansion (< 1.1x)',
    expectedLift: '+48% Organic Peer Advocacy',
    strategicPrescription: 'Turn power users into evangelists: establish Champions Programs, public recognition rewards, and user-led success story spotlights.',
    diagnosis: 'Power users have mastered the capability, but the product lacks mechanisms to empower them as community pillars and scale expertise.',
    signals: [
      { label: 'Power users are isolated', detail: 'Successful patterns stay siloed within individual accounts.', tone: 'coral' },
      { label: 'Few shared workflows', detail: 'Teams cannot see, replicate, or reuse proven patterns.', tone: 'blue' },
      { label: 'Mentorship is manual', detail: 'Advocacy depends entirely on one-to-one manual explanation.', tone: 'lavender' },
    ],
    interventions: [
      { title: 'Champions Programs', description: 'Empower power users to lead, mentor, and advocate for the product across the org.', impact: 'High', effort: 'Low', priority: 'P0' },
      { title: 'User-Led Success Stories', description: 'Encourage users to share real impact through video clips and internal showcase posts.', impact: 'High', effort: 'Low', priority: 'P0' },
      { title: 'Idea Submission Feedback Loop', description: 'Structured channels for champions to suggest new features and improvements.', impact: 'Medium', effort: 'Low', priority: 'P1' },
      { title: 'Community Spotlights', description: 'Highlight top contributors and innovators to inspire peer adoption.', impact: 'High', effort: 'Low', priority: 'P0' },
      { title: 'Community-Driven Content & Templates', description: 'Allow expert users to share their own tutorials, templates, and blueprints.', impact: 'High', effort: 'Low', priority: 'P0' },
      { title: 'Recognition & Rewards', description: 'Publicly celebrate top contributors and champions with badges and leadership perks.', impact: 'High', effort: 'Low', priority: 'P0' },
      { title: 'Copilot-Generated Impact Reports', description: 'Summarize user contributions and usage highlights for team-wide sharing.', impact: 'High', effort: 'Medium', priority: 'P0' },
    ],
    takeaway: 'Recognize power users, encourage sharing, and facilitate organic growth. Turn users into evangelists.',
  },
};

const suggestions = [
  { text: 'Users visit the landing page for our automation add-on, but less than 2% click to begin a trial because the ROI and concrete benefits are ambiguous.', stage: 'DESIRE' as AdoptStage },
  { text: 'Teams try the new automation rules once, but revert to manual clicks because they found the multi-step rules slow, hard, and lacking automated task support.', stage: 'PROFICIENT' as AdoptStage },
  { text: 'Feature discovery is under 5%', stage: 'AWARE' as AdoptStage },
];

const analysisPhases = [
  'Synthesizing problem context',
  'Mapping ADOPT stage barrier',
  'Quantifying evidence telemetry',
  'Customizing intervention blueprints',
  'Finalizing strategic playbook',
];

function SignalWave({ state, activity }: { state: WaveState; activity: number }) {
  const paths = useMemo(
    () => [
      'M0 90 C105 90 130 90 190 80 C245 70 260 110 325 93 C390 76 410 32 468 72 C525 112 545 121 608 86 C670 50 690 46 748 83 C800 116 825 109 880 80 C935 51 960 68 1015 83 C1070 98 1100 91 1200 90',
      'M0 90 C120 90 150 92 207 84 C264 76 290 100 350 88 C408 77 437 45 488 75 C537 105 565 127 624 83 C683 39 720 53 765 82 C810 111 845 116 900 83 C955 50 986 66 1033 82 C1080 98 1120 91 1200 90',
      'M0 90 C110 90 150 89 215 83 C280 77 299 99 357 90 C415 81 445 27 503 69 C560 111 588 128 645 83 C702 38 730 49 778 85 C826 121 852 111 912 79 C972 47 1000 62 1045 81 C1090 100 1135 91 1200 90',
      'M0 90 C100 90 142 90 208 87 C274 84 302 95 366 90 C430 85 455 53 510 78 C565 103 595 112 650 85 C705 58 742 59 790 84 C838 109 870 105 920 82 C970 59 1008 69 1050 84 C1092 99 1138 91 1200 90',
    ],
    []
  );

  return (
    <div className={`signal-wave signal-wave--${state}`} style={{ '--wave-activity': activity } as React.CSSProperties} aria-hidden="true">
      <svg viewBox="0 0 1200 180" preserveAspectRatio="none">
        <defs>
          <linearGradient id="waveLavender" x1="0" x2="1">
            <stop stopColor="#d9c8ff" stopOpacity="0" />
            <stop offset=".22" stopColor="#bfa1ff" stopOpacity=".52" />
            <stop offset=".54" stopColor="#7c8ff0" stopOpacity=".68" />
            <stop offset=".82" stopColor="#91d9ff" stopOpacity=".5" />
            <stop offset="1" stopColor="#a9efff" stopOpacity="0" />
          </linearGradient>
          <filter id="softWave"><feGaussianBlur stdDeviation="7" /></filter>
          <filter id="softWaveSmall"><feGaussianBlur stdDeviation="2.5" /></filter>
        </defs>
        {paths.map((path, index) => (
          <path
            key={path}
            className={`wave-line wave-line--${index + 1}`}
            d={path}
            fill="none"
            stroke="url(#waveLavender)"
            strokeWidth={index === 0 ? 20 : index === 1 ? 13 : index === 2 ? 8 : 4}
            filter={`url(#${index < 2 ? 'softWave' : 'softWaveSmall'})`}
          />
        ))}
        <path className="wave-core" d={paths[2]} fill="none" stroke="url(#waveLavender)" strokeWidth="2" />
      </svg>
    </div>
  );
}

export default function App() {
  const [engineState, setEngineState] = useState<EngineState>('diagnose');
  const [waveState, setWaveState] = useState<WaveState>('idle');
  const [input, setInput] = useState('');
  const [activeStage, setActiveStage] = useState<AdoptStage>('PROFICIENT');
  const [dynamicData, setDynamicData] = useState<Record<AdoptStage, Diagnosis>>(fallbackDiagnoses);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [generated, setGenerated] = useState<number | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const diagnosis = dynamicData[activeStage] || fallbackDiagnoses[activeStage];
  const activity = input.length > 0 ? Math.min(1.25, 0.85 + input.length / 90) : isFocused ? 1.08 : 1;

  // Strict Stage Prioritization
  const classifyInput = useCallback((text: string): AdoptStage => {
    const q = text.toLowerCase();

    // 1. PROFICIENT: Operational friction & habit formation drop-offs take top priority
    if (
      q.includes('shortcut') ||
      q.includes('syntax') ||
      q.includes('rule') ||
      q.includes('slow') ||
      q.includes('hard') ||
      q.includes('complex') ||
      q.includes('habit') ||
      q.includes('manual') ||
      q.includes('revert') ||
      q.includes('retention') ||
      q.includes('once') ||
      q.includes('repeat') ||
      q.includes('task support') ||
      q.includes('proficient')
    ) {
      return 'PROFICIENT';
    }

    // 2. TRANSFORM: Scaling expertise, champion advocacy, community templates
    if (
      q.includes('champion') ||
      q.includes('advoca') ||
      q.includes('mentor') ||
      q.includes('pillar') ||
      q.includes('transform') ||
      q.includes('spotlight') ||
      (q.includes('share') && q.includes('team')) ||
      q.includes('scale across')
    ) {
      return 'TRANSFORM';
    }

    // 3. DESIRE: Value clarity, ROI, motivation, trial exploration
    if (
      q.includes('why') ||
      q.includes('roi') ||
      q.includes('value') ||
      q.includes('benefit') ||
      q.includes('landing') ||
      q.includes('trial') ||
      q.includes('convert') ||
      q.includes('ignite') ||
      q.includes('desire')
    ) {
      return 'DESIRE';
    }

    // 4. AWARE: Discovery, awareness, visibility, banners
    if (
      q.includes('discover') ||
      q.includes('aware') ||
      q.includes('5%') ||
      q.includes('find') ||
      q.includes('visibility') ||
      q.includes('banner') ||
      q.includes('exposure') ||
      q.includes('know about')
    ) {
      return 'AWARE';
    }

    return 'OPEN';
  }, []);

  useEffect(() => {
    if (engineState !== 'analyzing') return;
    const phaseTimer = window.setInterval(() => {
      setPhaseIndex((index) => (index + 1) % analysisPhases.length);
    }, 450);
    return () => window.clearInterval(phaseTimer);
  }, [engineState]);

  const runDiagnosis = async (customQuery?: string) => {
    const textToAnalyze = customQuery || input;
    if (!textToAnalyze.trim()) return;

    // Determine deterministic stage
    const detectedStage = classifyInput(textToAnalyze);
    setActiveStage(detectedStage);

    setWaveState('submitting');
    setEngineState('analyzing');
    setPhaseIndex(0);

    // Call Gemini with the complete ADOPT Framework prompt
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const systemInstruction = `
You are the ADOPT Intelligence Engine, mapping product adoption problems to the 5 ADOPT stages:
1. AWARE ("Know about community / product"): Feature discovery, exposure, awareness, banners, announcements.
2. DESIRE ("Ignite Interest to explore"): Value clarity, motivation, ROI calculation, trial conversion, landing pages, interactive demos.
3. OPEN ("Start getting value"): Activation, first-run experiences (FRE), guided tours, AI onboarding bots, SSO pre-configuration.
4. PROFICIENT ("Engage in the community / workflow"): Habit formation, automated task support, advanced tutorials, forums/communities, personalized learning paths, week-2 retention.
5. TRANSFORM ("Pillar for the community"): Champions programs, user-led success stories, community spotlights, recognition & rewards, organic scaling.

CRITICAL CLASSIFICATION RULE:
- If users/teams try something once, find rules hard/slow, revert to manual clicks, or lack automated task support, you MUST return stage = "PROFICIENT". Do NOT classify as TRANSFORM simply because "teams" or "users" is in the prompt.
- Provide strategicPrescription as exactly 2 crisp, actionable sentences detailing what UX/product interventions to build.
`;
        const responseSchema: Schema = {
          type: Type.OBJECT,
          properties: {
            stage: { type: Type.STRING, enum: ['AWARE', 'DESIRE', 'OPEN', 'PROFICIENT', 'TRANSFORM'] },
            stageLabel: { type: Type.STRING },
            stageSubtext: { type: Type.STRING },
            confidence: { type: Type.INTEGER },
            behavioralPattern: { type: Type.STRING },
            psychologicalDriver: { type: Type.STRING },
            strategicPrescription: { type: Type.STRING },
            metricAtRisk: { type: Type.STRING },
            expectedLift: { type: Type.STRING },
            diagnosis: { type: Type.STRING },
            takeaway: { type: Type.STRING },
            signals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  detail: { type: Type.STRING },
                  tone: { type: Type.STRING, enum: ['coral', 'blue', 'lavender'] },
                },
                required: ['label', 'detail', 'tone'],
              },
            },
            interventions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  impact: { type: Type.STRING, enum: ['High', 'Medium'] },
                  effort: { type: Type.STRING, enum: ['Low', 'Medium'] },
                  priority: { type: Type.STRING, enum: ['P0', 'P1'] },
                },
                required: ['title', 'description', 'impact', 'effort', 'priority'],
              },
            },
          },
          required: [
            'stage',
            'stageLabel',
            'stageSubtext',
            'confidence',
            'behavioralPattern',
            'psychologicalDriver',
            'strategicPrescription',
            'metricAtRisk',
            'expectedLift',
            'diagnosis',
            'takeaway',
            'signals',
            'interventions',
          ],
        };

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: textToAnalyze,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema,
            temperature: 0.1,
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          setDynamicData((prev) => ({
            ...prev,
            [parsed.stage]: parsed,
          }));
          setActiveStage(parsed.stage);
        }
      } catch (e) {
        console.warn('AI API fallback used:', e);
      }
    }

    setTimeout(() => {
      setEngineState('results');
      setWaveState('results');
    }, 1200);
  };

  const reset = () => {
    setEngineState('diagnose');
    setWaveState('idle');
    setInput('');
    setGenerated(null);
    setIsFocused(false);
  };

  const currentStageInfo = stages.find((s) => s.key === activeStage) || stages[3];

  return (
    <main className={`app-shell app-shell--${engineState}`}>
      <header className="topbar">
        <div className="brand-mark" aria-label="ADOPT Engine">
          <span className="brand-mark__shape" />
          <span className="brand-mark__shape brand-mark__shape--second" />
        </div>
        <div className="topbar__right">
          <span className="topbar__status">
            <span className="status-dot" /> ADOPT Framework Online
          </span>
          <span className="topbar__divider" />
          <span className="topbar__edition">Behavioral intelligence / 01</span>
        </div>
      </header>

      {engineState === 'diagnose' && (
        <section className="diagnose-view" aria-labelledby="page-title">
          <div className="hero-copy">
            <p className="eyebrow">ADOPT FRAMEWORK <span>·</span> BEHAVIORAL INTELLIGENCE</p>
            <h1 id="page-title">Diagnose your <strong>product adoption</strong></h1>
            <p className="hero-subtitle">Give the engine messy signals. Get the behavioral reason — and the tailored next move.</p>
          </div>

          <div className="input-stage">
            <SignalWave state={waveState} activity={activity} />
            <div className={`command-bar ${isFocused ? 'command-bar--focused' : ''}`}>
              <CirclePlus size={22} strokeWidth={1.7} className="command-bar__plus" />
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                  setWaveState(event.target.value ? 'listening' : 'idle');
                }}
                onFocus={() => {
                  setIsFocused(true);
                  setWaveState('listening');
                }}
                onBlur={() => setIsFocused(false)}
                onKeyDown={(event) => event.key === 'Enter' && runDiagnosis()}
                placeholder="Enter user problem, telemetry, user feedback, funnel drop-offs"
                aria-label="Describe your adoption problem"
              />
              <button
                className="submit-button"
                onClick={() => runDiagnosis()}
                disabled={!input.trim()}
                aria-label="Run diagnosis"
              >
                <ArrowUp size={22} strokeWidth={1.9} />
              </button>
            </div>
          </div>

          <p className="hero-description">
            Describe a friction point, user feedback, or telemetry drop-off. The ADOPT Engine maps it across the 5 behavioral stages and generates targeted initiatives.
          </p>

          <div className="suggestions" aria-label="Suggested problems">
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion.text}
                type="button"
                className="suggestion-card"
                onClick={() => {
                  setInput(suggestion.text);
                  runDiagnosis(suggestion.text);
                }}
              >
                <span className="suggestion-card__index">0{index + 1}</span>
                <span>{suggestion.text}</span>
                <ArrowUpRight size={15} />
              </button>
            ))}
          </div>

          <div className="hero-footer">
            <span>Structured around the 5 ADOPT stages</span>
            <div>{stages.map((stage) => <span key={stage.key}>{stage.label}</span>)}</div>
          </div>
        </section>
      )}

      {engineState === 'analyzing' && (
        <section className="analysis-view" aria-live="polite">
          <div className="analysis-orbit"><span /><span /><span /></div>
          <SignalWave state={waveState} activity={1.35} />
          <div className="analysis-status">
            <span className="analysis-status__pulse" />
            <span>{analysisPhases[phaseIndex]}</span>
          </div>
          <p className="analysis-caption">The AI engine is synthesizing your signal into concrete ADOPT initiatives.</p>
          <div className="analysis-progress">
            <span style={{ width: `${(phaseIndex + 1) * 20}%` }} />
          </div>
        </section>
      )}

      {engineState === 'results' && (
        <section className="results-view" aria-labelledby="results-title">
          <div className="results-heading">
            <div>
              <p className="eyebrow">DIAGNOSIS COMPLETE <span>·</span> SIGNAL RESOLVED</p>
              <h2 id="results-title">The adoption story, <strong>made actionable.</strong></h2>
            </div>
            <button className="reset-button" onClick={reset}>
              Run another diagnosis <ArrowUpRight size={16} />
            </button>
          </div>

          {/* AI Strategic Prescription Banner */}
          <div style={{ margin: '0 0 2rem 0', padding: '1.25rem 1.5rem', borderRadius: '1rem', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08), rgba(99, 102, 241, 0.08))', border: '1px solid rgba(99, 102, 241, 0.25)', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', background: '#6366f1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
              <Sparkles size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#4f46e5', fontWeight: 600, marginBottom: '0.25rem' }}>
                AI Strategic Direction • {currentStageInfo.label} Playbook ({currentStageInfo.definition})
              </div>
              <p style={{ margin: 0, fontSize: '0.92rem', fontWeight: 500, color: '#1e293b', lineHeight: 1.6 }}>
                {diagnosis.strategicPrescription || diagnosis.takeaway}
              </p>
            </div>
          </div>

          <div className="stage-nav" role="tablist" aria-label="Adoption stages">
            {stages.map((stage) => (
              <button
                key={stage.key}
                role="tab"
                aria-selected={activeStage === stage.key}
                className={activeStage === stage.key ? 'is-active' : ''}
                onClick={() => {
                  setActiveStage(stage.key);
                  setGenerated(null);
                }}
              >
                {stage.label}
              </button>
            ))}
          </div>

          <div className="results-grid">
            <div className="results-left">
              {/* PRIMARY DIAGNOSIS CARD */}
              <article className="diagnosis-card reveal reveal--one" style={{ padding: '1.5rem', borderRadius: '1.25rem', background: '#131722', color: '#f8fafc', border: '1px solid #232936' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', fontFamily: 'monospace', letterSpacing: '0.06em', color: '#94a3b8', textTransform: 'uppercase' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
                    PRIMARY DIAGNOSIS
                  </div>
                  <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', letterSpacing: '0.08em', color: '#818cf8', background: 'rgba(99, 102, 241, 0.15)', padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: 600 }}>
                    {currentStageInfo.funnelIndex}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#ffffff', margin: '0 0 0.25rem 0', letterSpacing: '-0.02em' }}>
                      {diagnosis.stageLabel}
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                      State: <strong style={{ color: '#e2e8f0', fontWeight: 600 }}>{currentStageInfo.definition}</strong>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#93c5fd', lineHeight: 1 }}>
                      {diagnosis.confidence}%
                    </div>
                    <span style={{ fontSize: '0.62rem', color: '#64748b', textTransform: 'uppercase', fontFamily: 'monospace' }}>Confidence</span>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.55, margin: '0 0 1.25rem 0', fontWeight: 400 }}>
                  {diagnosis.diagnosis}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', padding: '0.85rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.65rem', color: '#f87171', fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                      <Activity size={12} /> Metric At Risk
                    </span>
                    <strong style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 600, display: 'block' }}>
                      {diagnosis.metricAtRisk}
                    </strong>
                  </div>
                  <div>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.65rem', color: '#34d399', fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                      <Zap size={12} /> Expected Lift
                    </span>
                    <strong style={{ fontSize: '0.82rem', color: '#34d399', fontWeight: 600, display: 'block' }}>
                      {diagnosis.expectedLift}
                    </strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span>Psychological Driver:</span>
                  <strong style={{ color: '#e2e8f0' }}>{diagnosis.psychologicalDriver}</strong>
                </div>
              </article>

              <article className="evidence-card reveal reveal--two">
                <div className="section-label">Evidence signals <span>· {diagnosis.signals.length} found</span></div>
                <div className="signal-list">
                  {diagnosis.signals.map((signal, index) => (
                    <div className={`evidence-row evidence-row--${signal.tone}`} key={signal.label}>
                      <div className="evidence-icon">
                        {index === 0 ? <TrendingDown size={16} /> : index === 1 ? <Clock3 size={16} /> : <MousePointer2 size={15} />}
                      </div>
                      <div>
                        <strong>{signal.label}</strong>
                        <span>{signal.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="telemetry-link">View raw telemetry logs <ArrowUpRight size={15} /></button>
              </article>

              <article className="takeaway-card reveal reveal--three">
                <div className="section-label">Executive Takeaway & Key Principles</div>
                <p>“{diagnosis.takeaway}”</p>
                <div className="takeaway-grid">
                  <span><small>Behavioral bottleneck</small><strong>{stages.find((stage) => stage.key === activeStage)?.label}</strong></span>
                  <span><small>Primary driver</small><strong>{diagnosis.psychologicalDriver}</strong></span>
                  <span><small>Recommended move</small><strong>Deploy Initiatives</strong></span>
                  <span><small>Expected outcome</small><strong>Accelerated Adoption</strong></span>
                </div>
              </article>
            </div>

            <div className="interventions-column">
              <div className="intervention-heading reveal reveal--one">
                <div>
                  <p className="eyebrow">FROM DIAGNOSIS TO INITIATIVES</p>
                  <h3>Recommended <strong>Initiatives</strong></h3>
                </div>
                <span className="intervention-count">{diagnosis.interventions.length < 10 ? `0${diagnosis.interventions.length}` : diagnosis.interventions.length} moves</span>
              </div>
              <p className="intervention-intro reveal reveal--one">
                Proven ADOPT framework initiatives to move users from {currentStageInfo.label} to the next behavioral milestone.
              </p>
              {diagnosis.interventions.map((intervention, index) => (
                <article className={`intervention-card reveal reveal--${index + 2}`} key={intervention.title}>
                  <div className="intervention-card__top">
                    <span>{index + 1 < 10 ? `0${index + 1}` : index + 1} — {intervention.priority}</span>
                    <span>{intervention.impact} impact</span>
                  </div>
                  <h4>{intervention.title}</h4>
                  <p>{generated === index ? `Generated implementation spec for ${intervention.title}: Tailored interaction blueprint to resolve ${diagnosis.behavioralPattern.toLowerCase()} and drive ${currentStageInfo.definition.toLowerCase()}.` : intervention.description}</p>
                  <div className="intervention-card__footer">
                    <div className="chips">
                      <span>{intervention.impact} impact</span>
                      <span>{intervention.effort} effort</span>
                    </div>
                    <button onClick={() => setGenerated(index)} className={generated === index ? 'is-generated' : ''}>
                      {generated === index ? <><Check size={15} /> Blueprint ready</> : <>Generate concept <ArrowUpRight size={15} /></>}
                    </button>
                  </div>
                  {generated === index && (
                    <div className="concept-note">
                      <Sparkles size={14} /> Blueprint ready · expected stage lift {diagnosis.expectedLift}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="page-footer">
        <span>ADOPT Framework Engine</span>
        <span>Aware · Desire · Open · Proficient · Transform</span>
        <span>© 2026</span>
      </footer>
    </main>
  );
}