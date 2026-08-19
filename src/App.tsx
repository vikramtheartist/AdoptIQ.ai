import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { ArrowUp, ArrowUpRight, Check, CirclePlus, Clock3, MousePointer2, Sparkles, TrendingDown } from 'lucide-react';
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
  confidence: number;
  behavioralPattern: string;
  psychologicalDriver: string;
  strategicPrescription: string;
  diagnosis: string;
  signals: { label: string; detail: string; tone: 'coral' | 'blue' | 'lavender' }[];
  interventions: Intervention[];
  takeaway: string;
};

const stages: { key: AdoptStage; label: string }[] = [
  { key: 'AWARE', label: 'Aware' },
  { key: 'DESIRE', label: 'Desire' },
  { key: 'OPEN', label: 'Open' },
  { key: 'PROFICIENT', label: 'Proficient' },
  { key: 'TRANSFORM', label: 'Transform' },
];

const fallbackDiagnoses: Record<AdoptStage, Diagnosis> = {
  AWARE: {
    stageLabel: 'Discovery breakdown',
    confidence: 88,
    behavioralPattern: 'Invisible value',
    psychologicalDriver: 'Attentional blindness',
    strategicPrescription: 'Embed non-intrusive contextual cues within core daily workflows and launch targeted in-app banners to drive high-intent discovery.',
    diagnosis: 'Users are not encountering the capability at the moment they have a relevant need, so its value never enters their consideration set.',
    signals: [
      { label: 'Feature discovery is under 5%', detail: 'Low exposure across high-intent sessions.', tone: 'coral' },
      { label: 'Low navigation reach', detail: 'Users rarely enter the feature surface.', tone: 'blue' },
      { label: 'Search intent is unserved', detail: 'Relevant queries end without a next action.', tone: 'lavender' },
    ],
    interventions: [
      { title: 'In-Product Banners', description: 'Non-intrusive banners placed within primary daily workspaces.', impact: 'High', effort: 'Low', priority: 'P0' },
      { title: 'Email Marketing', description: 'Segmented campaigns highlighting concrete ROI and new features.', impact: 'High', effort: 'Medium', priority: 'P0' },
      { title: 'Leadership Communications', description: 'Top-down announcements from organizational leads.', impact: 'High', effort: 'Low', priority: 'P0' },
      { title: 'Micro-Content / Short-Form Video', description: '15-30 second clips demonstrating fast tactical wins.', impact: 'Medium', effort: 'Low', priority: 'P1' },
    ],
    takeaway: 'Cut through the noise with targeted, compelling messaging. Leverage multiple touchpoints where your users already are.',
  },
  DESIRE: {
    stageLabel: 'Motivation breakdown',
    confidence: 85,
    behavioralPattern: 'Value ambiguity',
    psychologicalDriver: 'Unclear reward',
    strategicPrescription: 'Shift landing copy from abstract feature descriptions to quantified before/after outcomes, and add an interactive ROI calculator above the fold.',
    diagnosis: 'Users understand that the capability exists, but the path from trying it to a meaningful outcome is not compelling enough to create intent.',
    signals: [
      { label: 'High awareness, low intent', detail: 'Recognition does not translate into active trial.', tone: 'coral' },
      { label: 'Abstract value perception', detail: 'Users cannot anticipate a concrete workflow win.', tone: 'blue' },
      { label: 'Pre-trial drop-off', detail: 'Evaluation intent fades before the first action.', tone: 'lavender' },
    ],
    interventions: [
      { title: 'Interactive ROI Calculator', description: 'Quantify exact hours and dollars saved above the fold.', impact: 'High', effort: 'Medium', priority: 'P0' },
      { title: 'Side-by-Side Workflow Comparison', description: 'Contrast manual steps vs. automated flows to prove speed.', impact: 'High', effort: 'Low', priority: 'P0' },
      { title: 'Instant Sandbox Preview', description: 'Let users test automations on sample data without sign-up friction.', impact: 'High', effort: 'Medium', priority: 'P0' },
      { title: 'Quantified Metric Testimonials', description: 'Surface concrete metrics (e.g., "Reclaimed 18.5 hrs/week").', impact: 'Medium', effort: 'Low', priority: 'P1' },
    ],
    takeaway: 'Focus on benefits, not just features. Show, don’t just tell. Appeal to their immediate needs and aspirations.',
  },
  OPEN: {
    stageLabel: 'Activation breakdown',
    confidence: 89,
    behavioralPattern: 'Blank-canvas paralysis',
    psychologicalDriver: 'Cognitive overload',
    strategicPrescription: 'Eliminate zero-state anxiety with pre-seeded templates and replace multi-step modals with progressive single-click setup cues.',
    diagnosis: 'Users successfully discover the core value proposition, but activation breaks before the first meaningful engagement.',
    signals: [
      { label: '42% activation rate drop-off', detail: 'Measured between generic landing and first input engagement.', tone: 'coral' },
      { label: 'Time-to-first-value > 45s', detail: 'Exceeds expected setup threshold by 30s.', tone: 'blue' },
      { label: 'Erratic cursor movement', detail: 'Detected hovering over empty canvas areas.', tone: 'lavender' },
    ],
    interventions: [
      { title: 'FRE & Guided Tours', description: 'Step-by-step guides breaking down complex tasks into intuitive sub-actions.', impact: 'High', effort: 'Medium', priority: 'P0' },
      { title: 'AI-Powered Onboarding Bots', description: 'Smart assistants resolving setup questions in real-time.', impact: 'High', effort: 'Medium', priority: 'P0' },
      { title: 'Single Sign-On (SSO) & Pre-configuration', description: 'Fast setup with pre-filled user data.', impact: 'High', effort: 'Low', priority: 'P0' },
      { title: 'In-Product Help & Tooltips', description: 'Contextual tips explaining features at the exact moment of need.', impact: 'Medium', effort: 'Low', priority: 'P1' },
    ],
    takeaway: 'Simplicity, clarity, and immediate gratification. Reduce cognitive load and provide clear pathways.',
  },
  PROFICIENT: {
    stageLabel: 'Mastery breakdown',
    confidence: 94,
    behavioralPattern: 'Habit interruption',
    psychologicalDriver: 'High operational friction',
    strategicPrescription: 'Default to a visual UI, enable a plain-text command palette (Cmd+K) with inline shortcut hints, and introduce advanced syntax gradually via contextual micro-prompts.',
    diagnosis: 'Users try the capability but revert to manual routines because multi-step rules and complex syntax create high cognitive load during habituation.',
    signals: [
      { label: 'Reverted to manual clicks', detail: 'High task completion drop-off due to multi-step rule complexity.', tone: 'coral' },
      { label: 'Week-two retention drop-off', detail: 'Repeat habits failing to form after first successful use.', tone: 'blue' },
      { label: 'Lack of automated assistance', detail: 'Users exit to manual routines when friction spikes.', tone: 'lavender' },
    ],
    interventions: [
      { title: 'Automated Task Support', description: 'Copilot suggests shortcuts and automation flows based on usage patterns.', impact: 'High', effort: 'Medium', priority: 'P0' },
      { title: 'Inline Visual Rule-Builder', description: 'Replace complex multi-step rules with natural-language visual blocks.', impact: 'High', effort: 'Low', priority: 'P0' },
      { title: 'Contextual Keystroke Cues', description: 'Surface non-intrusive micro-hints showing faster actions during manual clicks.', impact: 'High', effort: 'Low', priority: 'P0' },
      { title: 'Personalized Habit Loops', description: 'Prompt one-click automation for repetitive multi-click sequences.', impact: 'Medium', effort: 'Low', priority: 'P1' },
    ],
    takeaway: 'Continuous learning, reinforcement, and addressing pain points. Encourage deeper engagement.',
  },
  TRANSFORM: {
    stageLabel: 'Advocacy breakdown',
    confidence: 92,
    behavioralPattern: 'Unshared expertise',
    psychologicalDriver: 'Low social leverage',
    strategicPrescription: 'Launch a 1-click workspace blueprint publisher and recognize power users through public spotlight galleries.',
    diagnosis: 'Power users have developed productive behaviors, but the product gives them no clear way to scale that expertise across their organization.',
    signals: [
      { label: 'Power users are isolated', detail: 'Successful patterns stay within individual accounts.', tone: 'coral' },
      { label: 'Few shared workflows', detail: 'Teams cannot see, replicate, or reuse proven patterns.', tone: 'blue' },
      { label: 'Mentorship is manual', detail: 'Advocacy depends on one-to-one manual explanation.', tone: 'lavender' },
    ],
    interventions: [
      { title: 'Champions Programs', description: 'Empower power users to lead, mentor, and advocate for the product.', impact: 'High', effort: 'Low', priority: 'P0' },
      { title: 'User-Led Success Stories', description: 'Encourage users to share real impact through posts or videos.', impact: 'High', effort: 'Low', priority: 'P0' },
      { title: 'Community-Driven Content', description: 'Let users share their own templates, blueprints, and tips.', impact: 'High', effort: 'Low', priority: 'P0' },
      { title: 'Recognition & Rewards', description: 'Celebrate top contributors and innovators publicly.', impact: 'High', effort: 'Low', priority: 'P0' },
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
  'Mapping psychological barriers',
  'Quantifying evidence telemetry',
  'Customizing intervention blueprints',
  'Finalizing adoption strategy',
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

  const classifyInput = useCallback((text: string): AdoptStage => {
    const q = text.toLowerCase();

    // 1. PROFICIENT MUST take priority over broad terms like "teams" or "users"
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

    // 2. TRANSFORM: Sharing templates, mentoring, advocacy
    if (
      q.includes('share') ||
      q.includes('scale') ||
      q.includes('collaborat') ||
      q.includes('champion') ||
      q.includes('advoca') ||
      q.includes('mentor') ||
      q.includes('transform')
    ) {
      return 'TRANSFORM';
    }

    // 3. DESIRE: Value clarity, ROI, motivation, trial conversion
    if (
      q.includes('why') ||
      q.includes('roi') ||
      q.includes('value') ||
      q.includes('benefit') ||
      q.includes('landing') ||
      q.includes('trial') ||
      q.includes('convert') ||
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
      q.includes('exposure')
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

    // 1. Determine the correct heuristic stage first
    const heuristicStage = classifyInput(textToAnalyze);
    setActiveStage(heuristicStage);

    setWaveState('submitting');
    setEngineState('analyzing');
    setPhaseIndex(0);

    // 2. Call Gemini API
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const systemInstruction = `
You are the ADOPT Intelligence Engine. Classify user adoption problems strictly into one of the 5 ADOPT stages:
- AWARE: Feature discovery, visibility, exposure, banners.
- DESIRE: Value clarity, motivation, ROI calculation, trial conversion.
- OPEN: Activation, onboarding, blank canvas, setup friction.
- PROFICIENT: Habit formation, keyboard shortcuts, advanced syntax, complex rules, week-2 retention drop-offs, slow/hard friction, reverting to manual clicks.
- TRANSFORM: Team sharing, collaboration, champion programs, scaling internal blueprints.

STRICT RULES:
1. If the problem describes users or teams trying something once, finding rules hard/slow, lacking automated task support, or reverting to manual clicks, you MUST return stage = "PROFICIENT".
2. Do NOT classify as TRANSFORM merely because the word "Teams" or "Users" appears.
3. Provide strategicPrescription as exactly 2 actionable sentences detailing the exact UX changes to make.
`;
        const responseSchema: Schema = {
          type: Type.OBJECT,
          properties: {
            stage: { type: Type.STRING, enum: ['AWARE', 'DESIRE', 'OPEN', 'PROFICIENT', 'TRANSFORM'] },
            stageLabel: { type: Type.STRING },
            confidence: { type: Type.INTEGER },
            behavioralPattern: { type: Type.STRING },
            psychologicalDriver: { type: Type.STRING },
            strategicPrescription: { type: Type.STRING },
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
            'confidence',
            'behavioralPattern',
            'psychologicalDriver',
            'strategicPrescription',
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

  return (
    <main className={`app-shell app-shell--${engineState}`}>
      <header className="topbar">
        <div className="brand-mark" aria-label="ADOPT Engine">
          <span className="brand-mark__shape" />
          <span className="brand-mark__shape brand-mark__shape--second" />
        </div>
        <div className="topbar__right">
          <span className="topbar__status">
            <span className="status-dot" /> AI Engine Online
          </span>
          <span className="topbar__divider" />
          <span className="topbar__edition">Behavioral intelligence / 01</span>
        </div>
      </header>

      {engineState === 'diagnose' && (
        <section className="diagnose-view" aria-labelledby="page-title">
          <div className="hero-copy">
            <p className="eyebrow">ADOPT ENGINE <span>·</span> BEHAVIORAL INTELLIGENCE</p>
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
            Describe a friction point, user feedback, or telemetry drop-off. The ADOPT Engine will generate
            <br className="desktop-only" /> strategic solutions tailored to your exact vocabulary and metrics.
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
            <span>Structured around five behavioral stages</span>
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
          <p className="analysis-caption">The AI engine is synthesizing your signal into concrete UX moves.</p>
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
                AI Strategic Direction • {stages.find((s) => s.key === activeStage)?.label} Playbook
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
              <article className="diagnosis-card reveal reveal--one">
                <div className="card-kicker">
                  <span className="kicker-dot" /> Primary diagnosis{' '}
                  <span className="card-kicker__stage">
                    {stages.find((stage) => stage.key === activeStage)?.label}
                  </span>
                </div>
                <div className="diagnosis-card__title-row">
                  <h3>{diagnosis.stageLabel}</h3>
                  <div className="confidence">
                    <strong>{diagnosis.confidence}%</strong>
                    <span>Confidence<br />score</span>
                  </div>
                </div>
                <p>{diagnosis.diagnosis}</p>
                <div className="diagnosis-meta">
                  <span>Pattern <strong>{diagnosis.behavioralPattern}</strong></span>
                  <span>Driver <strong>{diagnosis.psychologicalDriver}</strong></span>
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
                <div className="section-label">Executive takeaway & Key Principles</div>
                <p>“{diagnosis.takeaway}”</p>
                <div className="takeaway-grid">
                  <span><small>Behavioral bottleneck</small><strong>{stages.find((stage) => stage.key === activeStage)?.label}</strong></span>
                  <span><small>Primary driver</small><strong>{diagnosis.psychologicalDriver}</strong></span>
                  <span><small>Recommended move</small><strong>Execute Interventions</strong></span>
                  <span><small>Expected outcome</small><strong>Accelerated Lift</strong></span>
                </div>
              </article>
            </div>

            <div className="interventions-column">
              <div className="intervention-heading reveal reveal--one">
                <div>
                  <p className="eyebrow">FROM DIAGNOSIS TO DESIGN</p>
                  <h3>Tailored <strong>interventions</strong></h3>
                </div>
                <span className="intervention-count">{diagnosis.interventions.length < 10 ? `0${diagnosis.interventions.length}` : diagnosis.interventions.length} moves</span>
              </div>
              <p className="intervention-intro reveal reveal--one">High-impact UX recommendations synthesized specifically for this workflow problem.</p>
              {diagnosis.interventions.map((intervention, index) => (
                <article className={`intervention-card reveal reveal--${index + 2}`} key={intervention.title}>
                  <div className="intervention-card__top">
                    <span>{index + 1 < 10 ? `0${index + 1}` : index + 1} — {intervention.priority}</span>
                    <span>{intervention.impact} impact</span>
                  </div>
                  <h4>{intervention.title}</h4>
                  <p>{generated === index ? `Generated blueprint for ${intervention.title}: Interaction pattern reducing cognitive friction with direct contextual defaults.` : intervention.description}</p>
                  <div className="intervention-card__footer">
                    <div className="chips">
                      <span>{intervention.impact} impact</span>
                      <span>{intervention.effort} effort</span>
                    </div>
                    <button onClick={() => setGenerated(index)} className={generated === index ? 'is-generated' : ''}>
                      {generated === index ? <><Check size={15} /> Concept ready</> : <>Generate UX concept <ArrowUpRight size={15} /></>}
                    </button>
                  </div>
                  {generated === index && (
                    <div className="concept-note">
                      <Sparkles size={14} /> Interaction model ready · expected stage lift +22%
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="page-footer">
        <span>ADOPT Engine</span>
        <span>Listen · Interpret · Diagnose · Recommend</span>
        <span>© 2026</span>
      </footer>
    </main>
  );
}