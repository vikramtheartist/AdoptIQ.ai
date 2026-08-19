import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { ArrowUp, ArrowUpRight, Check, ChevronRight, CirclePlus, Clock3, MousePointer2, Sparkles, TrendingDown, X } from 'lucide-react';

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

const diagnoses: Record<AdoptStage, Diagnosis> = {
  AAWARE: {
    stageLabel: 'Discovery breakdown',
    confidence: 88,
    behavioralPattern: 'Invisible value',
    psychologicalDriver: 'Attentional blindness',
    diagnosis: 'Users are not encountering the capability at the moment they have a relevant need, so its value never enters their consideration set.',
    signals: [
      { label: 'Feature discovery is under 5%', detail: 'Low exposure across high-intent sessions.', tone: 'coral' },
      { label: 'Low navigation reach', detail: 'Users rarely enter the feature surface.', tone: 'blue' },
      { label: 'Search intent is unserved', detail: 'Relevant queries end without a next action.', tone: 'lavender' },
    ],
    interventions: [
      {
        title: 'In-Product Banners',
        description: 'Non-intrusive banners placed directly within relevant applications and active workflows.',
        impact: 'High',
        effort: 'Low',
        priority: 'P0',
      },
      {
        title: 'Email Marketing',
        description: 'Segmented campaigns with personalized subject lines, highlighting immediate benefits and new features.',
        impact: 'High',
        effort: 'Medium',
        priority: 'P0',
      },
      {
        title: 'Leadership Communications',
        description: 'Top-down announcements and endorsements from organizational leaders to establish priority.',
        impact: 'High',
        effort: 'Low',
        priority: 'P0',
      },
      {
        title: 'Micro-Content / Short-Form Video',
        description: '15–30 second visual clips demonstrating quick wins on internal platforms and community channels.',
        impact: 'Medium',
        effort: 'Low',
        priority: 'P1',
      },
    ],
    takeaway: 'Cut through the noise with targeted, compelling messaging. Leverage multiple touchpoints where your users already are.',
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

const suggestions = [
  'Users are trying once but not returning',
  'High awareness but low activation',
  'Feature discovery is under 5%'
];
const analysisPhases = ['Analyzing signals', 'Mapping adoption friction', 'Evaluating behavioral evidence', 'Identifying adoption stage', 'Generating interventions'];

function SignalWave({ state, activity }: { state: WaveState; activity: number }) {
  const paths = useMemo(() => [
    'M0 90 C105 90 130 90 190 80 C245 70 260 110 325 93 C390 76 410 32 468 72 C525 112 545 121 608 86 C670 50 690 46 748 83 C800 116 825 109 880 80 C935 51 960 68 1015 83 C1070 98 1100 91 1200 90',
    'M0 90 C120 90 150 92 207 84 C264 76 290 100 350 88 C408 77 437 45 488 75 C537 105 565 127 624 83 C683 39 720 53 765 82 C810 111 845 116 900 83 C955 50 986 66 1033 82 C1080 98 1120 91 1200 90',
    'M0 90 C110 90 150 89 215 83 C280 77 299 99 357 90 C415 81 445 27 503 69 C560 111 588 128 645 83 C702 38 730 49 778 85 C826 121 852 111 912 79 C972 47 1000 62 1045 81 C1090 100 1135 91 1200 90',
    'M0 90 C100 90 142 90 208 87 C274 84 302 95 366 90 C430 85 455 53 510 78 C565 103 595 112 650 85 C705 58 742 59 790 84 C838 109 870 105 920 82 C970 59 1008 69 1050 84 C1092 99 1138 91 1200 90',
  ], []);

  return (
    <div className={`signal-wave signal-wave--${state}`} style={{ '--wave-activity': activity } as React.CSSProperties} aria-hidden="true">
      <svg viewBox="0 0 1200 180" preserveAspectRatio="none">
        <defs>
          <linearGradient id="waveLavender" x1="0" x2="1"><stop stopColor="#d9c8ff" stopOpacity="0" /><stop offset=".22" stopColor="#bfa1ff" stopOpacity=".52" /><stop offset=".54" stopColor="#7c8ff0" stopOpacity=".68" /><stop offset=".82" stopColor="#91d9ff" stopOpacity=".5" /><stop offset="1" stopColor="#a9efff" stopOpacity="0" /></linearGradient>
          <filter id="softWave"><feGaussianBlur stdDeviation="7" /></filter>
          <filter id="softWaveSmall"><feGaussianBlur stdDeviation="2.5" /></filter>
        </defs>
        {paths.map((path, index) => <path key={path} className={`wave-line wave-line--${index + 1}`} d={path} fill="none" stroke="url(#waveLavender)" strokeWidth={index === 0 ? 20 : index === 1 ? 13 : index === 2 ? 8 : 4} filter={`url(#${index < 2 ? 'softWave' : 'softWaveSmall'})`} />)}
        <path className="wave-core" d={paths[2]} fill="none" stroke="url(#waveLavender)" strokeWidth="2" />
      </svg>
    </div>
  );
}

function App() {
  const [engineState, setEngineState] = useState<EngineState>('diagnose');
  const [waveState, setWaveState] = useState<WaveState>('idle');
  const [input, setInput] = useState('');
  const [activeStage, setActiveStage] = useState<AdoptStage>('OPEN');
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [generated, setGenerated] = useState<number | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const diagnosis = diagnoses[activeStage];
  const activity = input.length > 0 ? Math.min(1.25, 0.85 + input.length / 90) : isFocused ? 1.08 : 1;

 const classifyPrompt = useCallback((text: string): AdoptStage => {
    const q = text.toLowerCase();
    
    // TRANSFORM
    if (q.includes('share') || q.includes('team') || q.includes('collaborate') || q.includes('scale') || q.includes('champion') || q.includes('advocacy') || q.includes('transform')) {
      return 'TRANSFORM';
    }
    // PROFICIENT
    if (q.includes('shortcut') || q.includes('master') || q.includes('syntax') || q.includes('day 7') || q.includes('habit') || q.includes('repeat') || q.includes('returning') || q.includes('proficient')) {
      return 'PROFICIENT';
    }
    // DESIRE
    if (q.includes('why') || q.includes('value') || q.includes('benefit') || q.includes('roi') || q.includes('motivation') || q.includes('desire')) {
      return 'DESIRE';
    }
    // AWARE (Matches exposure, awareness, discovery, visibility, banners, etc.)
    if (
      q.includes('find') || 
      q.includes('discover') || 
      q.includes('see') || 
      q.includes('aware') || 
      q.includes('5%') || 
      q.includes('visibility') || 
      q.includes('exposure') || 
      q.includes('know') ||
      q.includes('traffic')
    ) {
      return 'AWARE';
    }
    return 'OPEN';
  }, []);

  useEffect(() => {
    if (engineState !== 'analyzing') return;
    const phaseTimer = window.setInterval(() => setPhaseIndex((index) => (index + 1) % analysisPhases.length), 1050);
    const resultTimer = window.setTimeout(() => {
      setEngineState('results');
      setWaveState('results');
    }, 5850);
    return () => { window.clearInterval(phaseTimer); window.clearTimeout(resultTimer); };
  }, [engineState]);

  const startDiagnosis = (customQuery?: string) => {
    const textToAnalyze = customQuery || input;
    if (!textToAnalyze.trim() || engineState !== 'diagnose') return;
    
    const detectedStage = classifyPrompt(textToAnalyze);
    setActiveStage(detectedStage);

    setWaveState('submitting');
    window.setTimeout(() => {
      setEngineState('analyzing');
      setWaveState('analyzing');
      setPhaseIndex(0);
    }, 650);
  };

  const reset = () => {
    setEngineState('diagnose');
    setWaveState('idle');
    setInput('');
    setGenerated(null);
    setActiveStage('OPEN');
    setIsFocused(false);
  };

  const selectSuggestion = (suggestion: string) => {
    setInput(suggestion);
    setWaveState('listening');
    startDiagnosis(suggestion);
  };

  return (
    <main className={`app-shell app-shell--${engineState}`}>
      <header className="topbar">
        <div className="brand-mark" aria-label="ADOPT Engine"><span className="brand-mark__shape" /><span className="brand-mark__shape brand-mark__shape--second" /></div>
        <div className="topbar__right"><span className="topbar__status"><span className="status-dot" /> Engine online</span><span className="topbar__divider" /><span className="topbar__edition">Behavioral intelligence / 01</span></div>
      </header>

      {engineState === 'diagnose' && <section className="diagnose-view" aria-labelledby="page-title">
        <div className="hero-copy"><p className="eyebrow">ADOPT ENGINE <span>·</span> BEHAVIORAL INTELLIGENCE</p><h1 id="page-title">Diagnose your <strong>product adoption</strong></h1><p className="hero-subtitle">Give the engine messy signals. Get the behavioral reason — and the next best move.</p></div>
        <div className="input-stage">
          <SignalWave state={waveState} activity={activity} />
          <div className={`command-bar ${isFocused ? 'command-bar--focused' : ''}`}>
            <CirclePlus size={22} strokeWidth={1.7} className="command-bar__plus" />
            <input ref={inputRef} value={input} onChange={(event) => { setInput(event.target.value); setWaveState(event.target.value ? 'listening' : 'idle'); }} onFocus={() => { setIsFocused(true); setWaveState('listening'); }} onBlur={() => setIsFocused(false)} onKeyDown={(event) => { if (event.key === 'Enter') startDiagnosis(); }} placeholder="Enter user problem, telemetry, user feedback, funnel drop-offs" aria-label="Describe your adoption problem" />
            <button className="submit-button" onClick={() => startDiagnosis()} aria-label="Run diagnosis"><ArrowUp size={22} strokeWidth={1.9} /></button>
          </div>
        </div>
        <p className="hero-description">Describe a friction point, user feedback, or telemetry drop-off. The ADOPT Engine will generate<br className="desktop-only" /> strategic solutions based on your enterprise library.</p>
        <div className="suggestions" aria-label="Suggested problems">{suggestions.map((suggestion, index) => <button key={suggestion} className="suggestion-card" onClick={() => selectSuggestion(suggestion)}><span className="suggestion-card__index">0{index + 1}</span><span>{suggestion}</span><ArrowUpRight size={15} /></button>)}</div>
        <div className="hero-footer"><span>Structured around five behavioral stages</span><div>{stages.map((stage) => <span key={stage.key}>{stage.label}</span>)}</div></div>
      </section>}

      {engineState === 'analyzing' && <section className="analysis-view" aria-live="polite"><div className="analysis-orbit"><span /><span /><span /></div><SignalWave state={waveState} activity={1.35} /><div className="analysis-status"><span className="analysis-status__pulse" /><span>{analysisPhases[phaseIndex]}</span></div><p className="analysis-caption">The engine is turning fragmented signals into a behavioral point of view.</p><div className="analysis-progress"><span style={{ width: `${(phaseIndex + 1) * 20}%` }} /></div></section>}

      {engineState === 'results' && <section className="results-view" aria-labelledby="results-title">
        <div className="results-heading"><div><p className="eyebrow">DIAGNOSIS COMPLETE <span>·</span> SIGNAL RESOLVED</p><h2 id="results-title">The adoption story, <strong>made actionable.</strong></h2></div><button className="reset-button" onClick={reset}>Run another diagnosis <ArrowUpRight size={16} /></button></div>
        <div className="stage-nav" role="tablist" aria-label="Adoption stages">{stages.map((stage) => <button key={stage.key} role="tab" aria-selected={activeStage === stage.key} className={activeStage === stage.key ? 'is-active' : ''} onClick={() => { setActiveStage(stage.key); setGenerated(null); }}>{stage.label}</button>)}</div>
        <div className="results-grid">
          <div className="results-left">
            <article className="diagnosis-card reveal reveal--one"><div className="card-kicker"><span className="kicker-dot" /> Primary diagnosis <span className="card-kicker__stage">{stages.find((stage) => stage.key === activeStage)?.label}</span></div><div className="diagnosis-card__title-row"><h3>{diagnosis.stageLabel}</h3><div className="confidence"><strong>{diagnosis.confidence}%</strong><span>Confidence<br />score</span></div></div><p>{diagnosis.diagnosis}</p><div className="diagnosis-meta"><span>Pattern <strong>{diagnosis.behavioralPattern}</strong></span><span>Driver <strong>{diagnosis.psychologicalDriver}</strong></span></div></article>
            <article className="evidence-card reveal reveal--two"><div className="section-label">Evidence signals <span>· {diagnosis.signals.length} found</span></div><div className="signal-list">{diagnosis.signals.map((signal, index) => <div className={`evidence-row evidence-row--${signal.tone}`} key={signal.label}><div className="evidence-icon">{index === 0 ? <TrendingDown size={16} /> : index === 1 ? <Clock3 size={16} /> : <MousePointer2 size={15} />}</div><div><strong>{signal.label}</strong><span>{signal.detail}</span></div></div>)}</div><button className="telemetry-link">View raw telemetry logs <ArrowUpRight size={15} /></button></article>
            <article className="takeaway-card reveal reveal--three"><div className="section-label">Executive takeaway</div><p>“{diagnosis.takeaway}”</p><div className="takeaway-grid"><span><small>Behavioral bottleneck</small><strong>{stages.find((stage) => stage.key === activeStage)?.label}</strong></span><span><small>Primary driver</small><strong>{diagnosis.psychologicalDriver}</strong></span><span><small>Recommended move</small><strong>Reduce friction</strong></span><span><small>Expected outcome</small><strong>Faster habit formation</strong></span></div></article>
          </div>
          <div className="interventions-column"><div className="intervention-heading reveal reveal--one"><div><p className="eyebrow">FROM DIAGNOSIS TO DESIGN</p><h3>Recommended <strong>interventions</strong></h3></div><span className="intervention-count">0{diagnosis.interventions.length} moves</span></div><p className="intervention-intro reveal reveal--one">High-impact UX changes mapped to the diagnosed behavioral barrier.</p>{diagnosis.interventions.map((intervention, index) => <article className={`intervention-card reveal reveal--${index + 2}`} key={intervention.title}><div className="intervention-card__top"><span>0{index + 1} — {intervention.priority}</span><span>{intervention.impact} impact</span></div><h4>{intervention.title}</h4><p>{generated === index ? 'A guided first-run experience with contextual prompts, seeded examples, and a visible next step that reduces uncertainty before the first input.' : intervention.description}</p><div className="intervention-card__footer"><div className="chips"><span>{intervention.impact} impact</span><span>{intervention.effort} effort</span></div><button onClick={() => setGenerated(index)} className={generated === index ? 'is-generated' : ''}>{generated === index ? <><Check size={15} /> Concept ready</> : <>Generate UX concept <ArrowUpRight size={15} /></>}</button></div>{generated === index && <div className="concept-note"><Sparkles size={14} /> Interaction model ready · expected activation lift +18%</div>}</article>)}</div>
        </div>
      </section>}

      <footer className="page-footer"><span>ADOPT Engine</span><span>Listen · Interpret · Diagnose · Recommend</span><span>© 2024</span></footer>
    </main>
  );
}

export default App;