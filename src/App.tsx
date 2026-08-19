import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { ArrowUp, ArrowUpRight, Check, CirclePlus, Clock3, MousePointer2, Sparkles, TrendingDown, Activity, Zap, Compass } from 'lucide-react';
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
  aiSummary: string;
  stageFocusPrescription: string;
  metricAtRisk: string;
  expectedLift: string;
  signals: { label: string; detail: string; tone: 'coral' | 'blue' | 'lavender' }[];
  interventions: Intervention[];
  takeaway: string;
};

const stages: { key: AdoptStage; label: string; definition: string; funnelIndex: string }[] = [
  { key: 'AWARE', label: 'Aware', definition: 'Know about product / community', funnelIndex: '01 / AWARE' },
  { key: 'DESIRE', label: 'Desire', definition: 'Ignite interest to explore', funnelIndex: '02 / DESIRE' },
  { key: 'OPEN', label: 'Open', definition: 'Start getting value', funnelIndex: '03 / OPEN' },
  { key: 'PROFICIENT', label: 'Proficient', definition: 'Engage in community & daily workflow', funnelIndex: '04 / PROFICIENT' },
  { key: 'TRANSFORM', label: 'Transform', definition: 'Pillar for the community', funnelIndex: '05 / TRANSFORM' },
];

const fallbackDiagnoses: Record<AdoptStage, Diagnosis> = {
  AWARE: {
    stageLabel: 'Awareness Breakdown',
    stageSubtext: 'Know about product & community',
    confidence: 88,
    behavioralPattern: 'Invisible Value',
    psychologicalDriver: 'Attentional Blindness',
    aiSummary: 'Users are operating without encountering entry points or discovering the solution. To drive discovery, place clear contextual cues directly within their active daily workspaces.',
    stageFocusPrescription: 'Focus on the Aware stage by launching multi-channel discovery touchpoints, non-intrusive in-product banners, and leadership endorsements to enter the user consideration set.',
    metricAtRisk: 'Feature Exposure Rate (< 5%)',
    expectedLift: '+35% Reach & Exploration',
    signals: [
      { label: 'Feature discovery is under 5%', detail: 'Low exposure across high-intent active sessions.', tone: 'coral' },
      { label: 'Low navigation reach', detail: 'Users rarely enter or stumble upon the feature surface.', tone: 'blue' },
      { label: 'Search intent unserved', detail: 'Relevant user queries conclude without a clear next action.', tone: 'lavender' },
    ],
    interventions: [
      { title: 'In-Product Banners', description: 'Non-intrusive banners placed directly within relevant applications and active workflows.', impact: 'High', effort: 'Low', priority: 'P0' },
      { title: 'Email Marketing Campaigns', description: 'Segmented campaigns highlighting immediate value and newly launched capabilities.', impact: 'High', effort: 'Medium', priority: 'P0' },
      { title: 'Leadership Communications', description: 'Top-down announcements and endorsements from organizational leaders to establish priority.', impact: 'High', effort: 'Low', priority: 'P0' },
      { title: 'Micro-Content / Short-Form Video', description: '15-30 second clips demonstrating quick wins on internal platforms and community hubs.', impact: 'Medium', effort: 'Low', priority: 'P1' },
    ],
    takeaway: 'Cut through the noise with targeted, compelling messaging. Leverage multiple touchpoints where your users already work.',
  },
  DESIRE: {
    stageLabel: 'Interest & Motivation Breakdown',
    stageSubtext: 'Ignite interest to explore',
    confidence: 86,
    behavioralPattern: 'Value Ambiguity',
    psychologicalDriver: 'Unclear Reward vs Friction',
    aiSummary: 'Visitors recognize the product exists but fail to see concrete ROI or tangible time savings, preventing trial intent. To convert interest, shift copy from abstract features to measurable before/after outcomes.',
    stageFocusPrescription: 'Focus on the Desire stage by implementing interactive ROI calculators, side-by-side manual vs automated comparisons, and zero-friction sandbox previews.',
    metricAtRisk: 'Landing-to-Trial Conversion (< 2%)',
    expectedLift: '+28% Trial Start Lift',
    signals: [
      { label: 'High awareness, low trial intent', detail: 'Page visits fail to translate into active evaluation.', tone: 'coral' },
      { label: 'Abstract value perception', detail: 'Users cannot anticipate a concrete workflow win from the messaging.', tone: 'blue' },
      { label: 'Drop-off before trial exploration', detail: 'Evaluation intent fades before the first setup action.', tone: 'lavender' },
    ],
    interventions: [
      { title: 'Dedicated Value Landing Page', description: 'Clearly explain community benefits, member stories, and use cases to spark interest.', impact: 'High', effort: 'Low', priority: 'P0' },
      { title: 'Take a Tour Sliders', description: 'Guided walkthroughs highlighting unique benefits tailored to specific user roles.', impact: 'High', effort: 'Low', priority: 'P0' },
      { title: 'Benefit-Oriented Messaging', description: 'Action-driven messages focusing on how the product completes jobs-to-be-done.', impact: 'High', effort: 'Low', priority: 'P0' },
      { title: 'Interactive Demos & Simulations', description: 'Hands-on, low-risk sandbox experiences allowing exploration without sign-up friction.', impact: 'High', effort: 'Medium', priority: 'P0' },
      { title: 'User Testimonials & Case Studies', description: 'Short, relatable stories from early users demonstrating real impact on their work.', impact: 'Medium', effort: 'Low', priority: 'P1' },
    ],
    takeaway: 'Focus on benefits, not just features. Show, don’t just tell. Appeal to their immediate needs and aspirations.',
  },
  OPEN: {
    stageLabel: 'Activation & First-Run Breakdown',
    stageSubtext: 'Start getting value',
    confidence: 89,
    behavioralPattern: 'Blank-Canvas Paralysis',
    psychologicalDriver: 'Cognitive Overload at Setup',
    aiSummary: 'Users initiate onboarding but abandon before completing their first workflow due to setup friction and blank-canvas paralysis. To drive activation, pre-fill workspaces with contextual templates and 1-click defaults.',
    stageFocusPrescription: 'Focus on the Open stage by providing structured First Run Experiences (FRE), SSO pre-configurations, and real-time AI onboarding bots to ensure fast time-to-first-value.',
    metricAtRisk: 'Time-to-First-Value (> 45s)',
    expectedLift: '+42% Completed First Runs',
    signals: [
      { label: '42% activation rate drop-off', detail: 'Measured between initial entry and first meaningful value event.', tone: 'coral' },
      { label: 'Time-to-first-value > 45s', detail: 'Exceeds expected baseline threshold by 30 seconds.', tone: 'blue' },
      { label: 'Erratic cursor movement', detail: 'Detected hovering and stalls over blank setup screens.', tone: 'lavender' },
    ],
    interventions: [
      { title: 'FRE & Guided Tours', description: 'Step-by-step guides breaking down complex tasks into intuitive sub-actions.', impact: 'High', effort: 'Medium', priority: 'P0' },
      { title: 'AI-Powered Onboarding Bots', description: 'Smart assistants answering setup questions and guiding users in real time.', impact: 'High', effort: 'Medium', priority: 'P0' },
      { title: 'Single Sign-On (SSO) & Pre-configuration', description: 'Fast setup with pre-filled user data and 1-click workspace entry.', impact: 'High', effort: 'Low', priority: 'P0' },
      { title: 'Quick Start Guides / Cheat Sheets', description: 'Printable, easy-to-follow instructions for common first-run tasks.', impact: 'Medium', effort: 'Low', priority: 'P1' },
      { title: 'In-Product Help & Contextual Tooltips', description: 'On-screen tips explaining features right at the moment of need.', impact: 'Medium', effort: 'Low', priority: 'P1' },
    ],
    takeaway: 'Simplicity, clarity, and immediate gratification. Reduce cognitive load and provide clear default pathways.',
  },
  PROFICIENT: {
    stageLabel: 'Habituation & Mastery Breakdown',
    stageSubtext: 'Engage in community & daily workflow',
    confidence: 94,
    behavioralPattern: 'Habit Interruption & Skills Gap',
    psychologicalDriver: 'High Operational Friction',
    aiSummary: 'Teams lack prompt literacy and confidence in managing outputs, causing them to stall before operational integration. To bridge the skills gap, replace blank inputs with structured prompt recipes and inline verification loops.',
    stageFocusPrescription: 'Focus entirely on the Proficient stage by introducing automated task support, role-specific prompt templates, peer QA forums, and personalized learning paths to establish mastery.',
    metricAtRisk: 'Workflow Output Accuracy & Habit Formation (-65%)',
    expectedLift: '+38% Self-Sustaining Weekly Usage',
    signals: [
      { label: 'Prompt construction failure', detail: 'Users struggle to articulate instructions leading to low-quality outputs.', tone: 'coral' },
      { label: 'Low output validation confidence', detail: 'Users lack criteria to verify and refine generated results.', tone: 'blue' },
      { label: 'Sporadic task frequency', detail: 'Usage remains ad-hoc rather than integrating into daily workflows.', tone: 'lavender' },
    ],
    interventions: [
      { title: 'Automated Task Support & Prompt Recipes', description: 'Provide structured, one-click prompt templates and inline syntax suggestions to eliminate blank-box anxiety.', impact: 'High', effort: 'Low', priority: 'P0' },
      { title: 'Advanced Output Evaluation Tutorials', description: 'Practical modules teaching teams how to review, verify, and iterate on AI responses safely.', impact: 'High', effort: 'Medium', priority: 'P0' },
      { title: 'Peer Practice Forums & Prompt Libraries', description: 'Searchable internal repositories of proven, high-performing prompts organized by job function.', impact: 'High', effort: 'Low', priority: 'P0' },
      { title: 'Personalized Role-Based Learning Paths', description: 'Step-by-step competency roadmaps to progress users from basic querying to workflow mastery.', impact: 'Medium', effort: 'Medium', priority: 'P1' },
    ],
    takeaway: 'Overcome the skills gap through structural scaffolding. Replace open prompt bars with guided templates and clear evaluation criteria.',
  },
  TRANSFORM: {
    stageLabel: 'Advocacy & Scaling Breakdown',
    stageSubtext: 'Pillar for the community',
    confidence: 92,
    behavioralPattern: 'Unshared Expertise',
    psychologicalDriver: 'Low Social & Network Leverage',
    aiSummary: 'Power users develop highly productive behaviors, but expertise remains isolated without organic peer spread. To scale, build communal showcase libraries and formal recognition loops.',
    stageFocusPrescription: 'Focus on the Transform stage by creating formal Champions Programs, peer-driven template libraries, and public spotlights to turn power users into organizational evangelists.',
    metricAtRisk: 'Internal Viral Expansion (< 1.1x)',
    expectedLift: '+48% Organic Peer Advocacy',
    signals: [
      { label: 'Power users are isolated', detail: 'Successful patterns stay siloed within individual accounts.', tone: 'coral' },
      { label: 'Few shared workflows', detail: 'Teams cannot see, replicate, or reuse proven patterns.', tone: 'blue' },
      { label: 'Mentorship is manual', detail: 'Advocacy depends entirely on one-to-one manual explanation.', tone: 'lavender' },
    ],
    interventions: [
      { title: 'Champions Programs', description: 'Empower power users to lead, mentor, and advocate for the product across the org.', impact: 'High', effort: 'Low', priority: 'P0' },
      { title: 'User-Led Success Stories', description: 'Encourage users to share real impact through video clips and internal showcase posts.', impact: 'High', effort: 'Low', priority: 'P0' },
      { title: 'Community Spotlights', description: 'Highlight top contributors and innovators to inspire peer adoption.', impact: 'High', effort: 'Low', priority: 'P0' },
      { title: 'Community-Driven Content & Templates', description: 'Allow expert users to share their own tutorials, templates, and blueprints.', impact: 'High', effort: 'Low', priority: 'P0' },
      { title: 'Recognition & Rewards', description: 'Publicly celebrate top contributors and champions with badges and leadership perks.', impact: 'High', effort: 'Low', priority: 'P0' },
    ],
    takeaway: 'Recognize power users, encourage sharing, and facilitate organic growth. Turn users into evangelists.',
  },
};

const suggestions = [
  { text: 'The Skills Gap: Teams lack the specific literacy or confidence required to write effective prompts or manage AI outputs correctly.', stage: 'PROFICIENT' as AdoptStage },
  { text: '80% of organizations are experimenting with AI, but only 6 percent successfully scale it into daily workflows.', stage: 'PROFICIENT' as AdoptStage },
  { text: 'Users visit the landing page for our automation add-on, but less than 2% click to begin a trial because ROI is ambiguous.', stage: 'DESIRE' as AdoptStage },
];

const analysisPhases = [
  'Synthesizing problem context',
  'Consulting ADOPT Behavioral Model',
  'Quantifying metric drop-offs',
  'Mapping targeted initiatives',
  'Finalizing strategic counselor playbook',
];

function CanvasSiriWave({ state, activity }: { state: WaveState; activity: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let reqId: number;
    let phase = 0;
    
    let currentAmp = 10;
    let currentSpeed = 1.0;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    window.addEventListener('resize', resize);
    resize();

    const waves = [
      { color: 'rgba(192, 132, 252, 0.55)', speed: 0.04, shift: 0 },       // Lavender
      { color: 'rgba(37, 99, 235, 0.55)', speed: 0.05, shift: 2.1 },        // Deep Blue
      { color: 'rgba(56, 189, 248, 0.55)', speed: 0.06, shift: 4.2 },       // Cyan
    ];

    const draw = () => {
      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;
      ctx.clearRect(0, 0, w, h);

      const isGenerating = state === 'analyzing' || state === 'submitting';
      const isTyping = state === 'listening';
      
      let targetAmp = 8.5; 
      if (isTyping) targetAmp = 43 + (activity * 26);
      if (isGenerating) targetAmp = 120;
      currentAmp += (targetAmp - currentAmp) * 0.08;

      let targetSpeed = 1.0; 
      if (isTyping) targetSpeed = 0.2; 
      if (isGenerating) targetSpeed = 4.0; 
      currentSpeed += (targetSpeed - currentSpeed) * 0.05;

      waves.forEach((wave) => {
        ctx.beginPath();
        
        for (let i = 0; i <= w; i += 3) {
          const x = (i / w) * 4 - 2;
          const attenuation = Math.exp(-Math.pow(x, 2));
          const y = Math.sin(x * 3 + phase * wave.speed + wave.shift) * currentAmp * attenuation;
          ctx.lineTo(i, h / 2 + y);
        }

        for (let i = w; i >= 0; i -= 3) {
          const x = (i / w) * 4 - 2;
          const attenuation = Math.exp(-Math.pow(x, 2));
          const y = Math.sin(x * 3 + phase * wave.speed + wave.shift) * currentAmp * attenuation;
          ctx.lineTo(i, h / 2 - y);
        }

        ctx.closePath();
        ctx.fillStyle = wave.color;
        ctx.fill();
      });

      phase += currentSpeed;
      reqId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', resize);
    };
  }, [state, activity]);

  return (
    <div 
      style={{ 
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '84%', 
        height: '432px',
        zIndex: 0,
        pointerEvents: 'none',
        mixBlendMode: 'multiply',
        opacity: state === 'idle' ? 0.4 : 1,
        transition: 'opacity 0.5s ease'
      }}
    >
      <canvas 
        ref={canvasRef} 
        style={{ width: '100%', height: '100%' }} 
      />
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
    if (
      q.includes('skill') || q.includes('literacy') || q.includes('prompt') ||
      q.includes('confidence') || q.includes('output') || q.includes('daily workflow') ||
      q.includes('scale it into daily') || q.includes('experimenting') || q.includes('shortcut') ||
      q.includes('syntax') || q.includes('rule') || q.includes('slow') ||
      q.includes('hard') || q.includes('complex') || q.includes('habit') ||
      q.includes('manual') || q.includes('revert') || q.includes('retention') ||
      q.includes('proficient')
    ) return 'PROFICIENT';

    if (
      q.includes('champion') || q.includes('advoca') || q.includes('mentor') ||
      q.includes('pillar') || q.includes('transform') || q.includes('spotlight') ||
      (q.includes('share') && q.includes('team')) || q.includes('scale across')
    ) return 'TRANSFORM';

    if (
      q.includes('why') || q.includes('roi') || q.includes('value') ||
      q.includes('benefit') || q.includes('landing') || q.includes('trial') ||
      q.includes('convert') || q.includes('ignite') || q.includes('desire')
    ) return 'DESIRE';

    if (
      q.includes('discover') || q.includes('aware') || q.includes('5%') ||
      q.includes('find') || q.includes('visibility') || q.includes('banner') ||
      q.includes('exposure') || q.includes('know about')
    ) return 'AWARE';

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

    const detectedStage = classifyInput(textToAnalyze);
    setActiveStage(detectedStage);

    setWaveState('submitting');
    setEngineState('analyzing');
    setPhaseIndex(0);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        
        const systemInstruction = `
You are the ADOPT Senior Behavioral Intelligence Counselor.
Map the input to the exact 5 ADOPT stages:
1. AWARE ("Know about community")
2. DESIRE ("Ignite Interest to explore")
3. OPEN ("Start getting value")
4. PROFICIENT ("Engage in the community")
5. TRANSFORM ("Pillar for the community")

CRITICAL RULES:
- If the input involves "skills gap", "prompting literacy", "scaling into daily workflows", or "reverting to manual clicks", you MUST classify as "PROFICIENT". Do NOT classify as TRANSFORM unless the core problem is power users lacking sharing mechanisms.
- aiSummary MUST be 2-3 sentences diagnosing the root behavioral roadblock (e.g., status quo bias, cognitive overload).
- stageFocusPrescription MUST be 1-2 sentences starting with "Focus on the [Stage] stage by..." and detail the exact UX shifts aligned to that stage.
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
            aiSummary: { type: Type.STRING },
            stageFocusPrescription: { type: Type.STRING },
            metricAtRisk: { type: Type.STRING },
            expectedLift: { type: Type.STRING },
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
            'stage', 'stageLabel', 'stageSubtext', 'confidence', 'behavioralPattern', 'psychologicalDriver',
            'aiSummary', 'stageFocusPrescription', 'metricAtRisk', 'expectedLift', 'takeaway', 'signals', 'interventions',
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
          setDynamicData((prev) => ({ ...prev, [parsed.stage]: parsed }));
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
      <header className="topbar" style={{ paddingBottom: '0.5rem' }}>
        <div className="brand-mark" aria-label="ADOPT Engine">
          <span className="brand-mark__shape" />
          <span className="brand-mark__shape brand-mark__shape--second" />
        </div>
      </header>

      {engineState === 'diagnose' && (
        <section className="diagnose-view" aria-labelledby="page-title">
          <div className="hero-copy">
            <p className="eyebrow">ADOPT FRAMEWORK <span>·</span> BEHAVIORAL INTELLIGENCE</p>
            <h1 id="page-title">Diagnose your <strong>product adoption</strong></h1>
            <p className="hero-subtitle">Give the engine messy signals. Get the behavioral reason — and the tailored next move.</p>
          </div>

          <div className="input-stage" style={{ position: 'relative' }}>
            <CanvasSiriWave state={waveState} activity={activity} />
            
            <div className={`command-bar ${isFocused ? 'command-bar--focused' : ''}`} style={{ position: 'relative', zIndex: 10 }}>
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
            Describe a friction point, telemetry drop-off, or adoption use case. The ADOPT Engine will synthesize an AI summary and focus your initiatives across the 5 behavioral stages.
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
          <CanvasSiriWave state={waveState} activity={1.35} />
          <div className="analysis-status" style={{ position: 'relative', zIndex: 10 }}>
            <span className="analysis-status__pulse" />
            <span>{analysisPhases[phaseIndex]}</span>
          </div>
          <p className="analysis-caption" style={{ position: 'relative', zIndex: 10 }}>The AI engine is synthesizing your signal into concrete ADOPT initiatives.</p>
          <div className="analysis-progress" style={{ position: 'relative', zIndex: 10 }}>
            <span style={{ width: `${(phaseIndex + 1) * 20}%` }} />
          </div>
        </section>
      )}

      {engineState === 'results' && (
        <section className="results-view" aria-labelledby="results-title" style={{ marginTop: '0', paddingTop: '0' }}>
          <div className="results-heading" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b' }}>
                DIAGNOSIS COMPLETE <span>·</span> 
                <span style={{ display: 'flex', alignItems: 'center', color: '#10b981', fontWeight: 600 }}>
                  <span style={{ display: 'inline-block', width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%', marginRight: '6px', boxShadow: '0 0 8px rgba(16, 185, 129, 0.4)' }} />
                  ADOPT COUNSELOR ONLINE
                </span>
              </p>
              <h2 id="results-title" style={{ fontSize: '2.2rem', letterSpacing: '-0.02em', fontWeight: 600, color: '#0f172a', margin: '0.2rem 0 0 0' }}>The adoption story, <strong>made actionable.</strong></h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '1.5rem' }}>
              <button 
                className="reset-button" 
                onClick={() => {
                  const el = document.querySelector('.interventions-column');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                style={{ 
                  padding: '0.5rem 1rem', 
                  borderRadius: '999px', 
                  background: '#f8fafc', 
                  border: '1px solid #e2e8f0',
                  color: '#334155', 
                  fontWeight: 500, 
                  fontSize: '0.85rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  cursor: 'pointer', 
                  transition: 'all 0.2s ease'
                }}
              >
                ADOPT playbook
              </button>
              <button 
                className="reset-button" 
                onClick={reset}
                style={{ 
                  padding: '0.5rem 1rem', 
                  borderRadius: '999px', 
                  background: '#f8fafc', 
                  border: '1px solid #e2e8f0',
                  color: '#334155', 
                  fontWeight: 500, 
                  fontSize: '0.85rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.4rem', 
                  cursor: 'pointer', 
                  transition: 'all 0.2s ease'
                }}
              >
                Run another diagnosis <ArrowUpRight size={16} />
              </button>
            </div>
          </div>

          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '1.25rem', marginBottom: '1.5rem', padding: '1px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.4), rgba(217, 70, 239, 0.4))' }}>
            <div className="siri-mesh-bg" />
            
            <div style={{ position: 'relative', zIndex: 1, background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(30px) saturate(180%)', WebkitBackdropFilter: 'blur(30px) saturate(180%)', borderRadius: '1.2rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 4px 24px -4px rgba(31, 38, 135, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #d946ef)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 20px rgba(217, 70, 239, 0.3)', marginTop: '2px' }}>
                  <Sparkles size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4f46e5', fontWeight: 700, marginBottom: '0.5rem' }}>
                    AI SUMMARY & DIAGNOSIS
                  </div>
                  <p style={{ margin: 0, fontSize: '0.98rem', fontWeight: 500, color: '#0f172a', lineHeight: 1.6 }}>
                    {diagnosis.aiSummary}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '1.75rem' }}>
            <div className="stage-nav" role="tablist" aria-label="Adoption stages" style={{ margin: 0 }}>
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
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem'
                  }}
                >
                  <span>{stage.label}</span>
                  {activeStage === stage.key && (
                    <span 
                      aria-label="Focus stage"
                      title="Focus stage"
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: '#fee2e2',
                        color: '#dc2626',
                        border: '1.5px solid #f87171',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 900,
                        lineHeight: 1,
                        boxShadow: '0 2px 8px rgba(220, 38, 38, 0.22)',
                        marginLeft: '4px',
                        flexShrink: 0
                      }}
                    >
                      !
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="results-grid">
            <div className="results-left">
              <article className="diagnosis-card reveal reveal--one" style={{ padding: '1.5rem', borderRadius: '1.25rem', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', color: '#0f172a', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 8px 32px -8px rgba(0,0,0,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', fontFamily: 'monospace', letterSpacing: '0.06em', color: '#64748b', textTransform: 'uppercase' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
                    PRIMARY DIAGNOSIS
                  </div>
                  <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', letterSpacing: '0.08em', color: '#4f46e5', background: 'rgba(99, 102, 241, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: 600 }}>
                    {currentStageInfo.funnelIndex}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#0f172a', margin: '0 0 0.25rem 0', letterSpacing: '-0.02em' }}>
                      {diagnosis.stageLabel}
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>
                      Stage Goal: <strong style={{ color: '#334155', fontWeight: 600 }}>{currentStageInfo.definition}</strong>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#3b82f6', lineHeight: 1 }}>
                      {diagnosis.confidence}%
                    </div>
                    <span style={{ fontSize: '0.62rem', color: '#94a3b8', textTransform: 'uppercase', fontFamily: 'monospace' }}>Confidence</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', padding: '0.85rem', borderRadius: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.65rem', color: '#ef4444', fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                      <Activity size={12} /> Metric At Risk
                    </span>
                    <strong style={{ fontSize: '0.82rem', color: '#0f172a', fontWeight: 600, display: 'block' }}>
                      {diagnosis.metricAtRisk}
                    </strong>
                  </div>
                  <div>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.65rem', color: '#10b981', fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                      <Zap size={12} /> Expected Lift
                    </span>
                    <strong style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: 600, display: 'block' }}>
                      {diagnosis.expectedLift}
                    </strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', paddingTop: '0.75rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                  <span>Psychological Driver:</span>
                  <strong style={{ color: '#334155' }}>{diagnosis.psychologicalDriver}</strong>
                </div>
              </article>

              {/* UPDATED EVIDENCE CARD */}
              <article className="evidence-card reveal reveal--two" style={{ padding: '1.5rem', borderRadius: '1.25rem', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', color: '#0f172a', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 8px 32px -8px rgba(0,0,0,0.08)', marginTop: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', fontFamily: 'monospace', letterSpacing: '0.06em', color: '#64748b', textTransform: 'uppercase' }}>
                    EVIDENCE SIGNALS
                  </div>
                  <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', letterSpacing: '0.08em', color: '#475569', fontWeight: 600 }}>
                    {diagnosis.signals.length} FOUND
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {diagnosis.signals.map((signal, index) => {
                    const waveColors = ['#8b5cf6', '#0ea5e9', '#3b82f6']; // Violet, Sky Blue, Blue
                    const color = waveColors[index % waveColors.length];

                    return (
                      <div key={signal.label} style={{ 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        gap: '1rem', 
                        padding: '1rem', 
                        borderRadius: '0.75rem', 
                        background: '#ffffff', 
                        border: '1px solid #e2e8f0',
                        borderLeft: `3px solid ${color}` 
                      }}>
                        <div style={{ color: color, marginTop: '2px' }}>
                          {index === 0 ? <TrendingDown size={18} /> : index === 1 ? <Clock3 size={18} /> : <MousePointer2 size={18} />}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <strong style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>{signal.label}</strong>
                          <span style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.4 }}>{signal.detail}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                  <button style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#64748b', 
                    fontSize: '0.75rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.35rem', 
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'color 0.2s ease'
                  }}>
                    View raw telemetry logs <ArrowUpRight size={14} />
                  </button>
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
              
              <div className="intervention-intro reveal reveal--one" style={{ padding: '1.25rem', background: 'rgba(99, 102, 241, 0.05)', borderLeft: '4px solid #6366f1', borderRadius: '0 0.5rem 0.5rem 0', marginBottom: '1.5rem' }}>
                <p style={{ margin: 0, color: '#1e293b', fontSize: '0.94rem', lineHeight: 1.6 }}>
                  <strong style={{ color: '#4f46e5' }}>High-impact initiatives mapped to move users through the {currentStageInfo.label} stage ({currentStageInfo.definition}).</strong> {diagnosis.stageFocusPrescription}
                </p>
              </div>

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

      <div style={{ display: 'none' }}>
        <style>
          {`
            @keyframes siriSpin {
              0% { transform: rotate(0deg) scale(1); }
              50% { transform: rotate(180deg) scale(1.15); }
              100% { transform: rotate(360deg) scale(1); }
            }
            @keyframes pillPopDown {
              0% { opacity: 0; transform: translateY(-10px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            .siri-mesh-bg {
              position: absolute;
              top: -50%;
              left: -50%;
              width: 200%;
              height: 200%;
              background: 
                radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15), transparent 40%),
                radial-gradient(circle at 30% 40%, rgba(217, 70, 239, 0.15), transparent 40%),
                radial-gradient(circle at 70% 60%, rgba(168, 85, 247, 0.15), transparent 40%);
              animation: siriSpin 15s linear infinite;
              z-index: 0;
              pointer-events: none;
            }
          `}
        </style>
      </div>
    </main>
  );
}