import React, { useState, useMemo, useCallback } from 'react';
import { 
  ArrowUp, 
  ArrowUpRight, 
  Plus, 
  RotateCcw, 
  Sparkles, 
  ShieldCheck 
} from 'lucide-react';

export type AdoptStage = 'AWARE' | 'DESIRE' | 'OPEN' | 'PROFICIENT' | 'TRANSFORM';
export type EngineState = 'diagnose' | 'analyzing' | 'results';

export interface Intervention {
  title: string;
  description: string;
  impact: 'High Impact' | 'Medium Impact';
  type: string;
}

export interface StageData {
  stage: AdoptStage;
  title: string;
  confidence: number;
  description: string;
  interventions: Intervention[];
}

const STAGE_DATABASE: Record<AdoptStage, StageData> = {
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

const STAGES_ORDER: AdoptStage[] = ['AWARE', 'DESIRE', 'OPEN', 'PROFICIENT', 'TRANSFORM'];

const SAMPLE_PROMPTS = [
  {
    id: 1,
    tag: '01',
    text: 'Users are trying once but not returning',
    query: 'Users drop off after their first test run and never form a repeat habit'
  },
  {
    id: 2,
    tag: '02',
    text: 'High awareness but low activation',
    query: 'Users know about the tool but stall on the blank screen during setup'
  },
  {
    id: 3,
    tag: '03',
    text: 'Feature discovery is under 5%',
    query: 'Weekly active usage falls off after day 7 because users struggle to master the shortcut commands and advanced query syntax.'
  }
];

export default function App() {
  const [inputText, setInputText] = useState('');
  const [engineState, setEngineState] = useState<EngineState>('diagnose');
  const [activeStage, setActiveStage] = useState<AdoptStage>('PROFICIENT');
  const [analyzingStep, setAnalyzingStep] = useState(0);

  const classifyInput = useCallback((text: string): AdoptStage => {
    const q = text.toLowerCase();

    // PROFICIENT
    if (
      q.includes('shortcut') ||
      q.includes('master') ||
      q.includes('syntax') ||
      q.includes('day 7') ||
      q.includes('habit') ||
      q.includes('hard') ||
      q.includes('slow') ||
      q.includes('proficient')
    ) {
      return 'PROFICIENT';
    }

    // TRANSFORM (Sharing, Collaboration, Team Scale)
    if (
      q.includes('share') ||
      q.includes('team') ||
      q.includes('champion') ||
      q.includes('scale') ||
      q.includes('collaborate') ||
      q.includes('transform')
    ) {
      return 'TRANSFORM';
    }

    // DESIRE
    if (
      q.includes('why') ||
      q.includes('value') ||
      q.includes('benefit') ||
      q.includes('roi') ||
      q.includes('desire')
    ) {
      return 'DESIRE';
    }

    // AWARE
    if (
      q.includes('find') ||
      q.includes('discover') ||
      q.includes('see') ||
      q.includes('aware') ||
      q.includes('under 5%') ||
      q.includes('5%') ||
      q.includes('visibility')
    ) {
      return 'AWARE';
    }

    return 'OPEN';
  }, []);

  const handleRunDiagnosis = (queryText?: string) => {
    const targetText = queryText || inputText;
    if (!targetText.trim()) return;

    if (queryText) {
      setInputText(queryText);
    }

    const resolvedStage = classifyInput(targetText);
    setActiveStage(resolvedStage);
    setEngineState('analyzing');
    setAnalyzingStep(1);

    setTimeout(() => setAnalyzingStep(2), 400);
    setTimeout(() => setAnalyzingStep(3), 800);
    setTimeout(() => {
      setEngineState('results');
    }, 1200);
  };

  const handleReset = () => {
    setInputText('');
    setEngineState('diagnose');
  };

  const currentData = useMemo(() => STAGE_DATABASE[activeStage], [activeStage]);

  return (
    <main className="min-h-screen bg-white text-slate-900 flex flex-col justify-between selection:bg-purple-100 selection:text-purple-900 relative overflow-hidden font-sans">
      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center shadow-sm">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <span className="text-xs font-semibold tracking-wider text-slate-700 uppercase">
            ADOPT Engine
          </span>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            / Behavioral Intelligence
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Engine online
          </div>
          {engineState === 'results' && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition-colors bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              New Diagnosis
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <div className="w-full max-w-5xl mx-auto px-6 py-6 z-10 flex-1 flex flex-col justify-center">
        {/* VIEW 1: Input Screen */}
        {engineState === 'diagnose' && (
          <div className="w-full flex flex-col items-center text-center max-w-3xl mx-auto animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/80 border border-slate-200 text-[11px] font-mono tracking-wider text-slate-500 uppercase mb-6">
              <span>ADOPT ENGINE</span>
              <span>•</span>
              <span>BEHAVIORAL INTELLIGENCE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-slate-900 mb-4">
              Diagnose your product adoption
            </h1>

            <p className="text-slate-500 text-sm sm:text-base mb-12 max-w-xl font-normal">
              Give the engine messy signals. Get the behavioral reason — and the next best move.
            </p>

            <div className="relative w-full max-w-2xl group mb-6">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-400/35 via-blue-400/35 to-teal-300/35 rounded-full blur-xl opacity-90 transition duration-500 pointer-events-none" />
              
              <div className="relative flex items-center bg-white border border-slate-200/90 rounded-full shadow-lg hover:shadow-xl transition-shadow px-4 py-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer transition-colors">
                  <Plus className="w-5 h-5" />
                </div>
                
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRunDiagnosis()}
                  placeholder="Enter user problem, telemetry, user feedback, funnel drop-offs"
                  className="w-full bg-transparent text-sm sm:text-base text-slate-800 placeholder:text-slate-400 focus:outline-none px-3 py-2 font-normal"
                />

                <button
                  type="button"
                  onClick={() => handleRunDiagnosis()}
                  disabled={!inputText.trim()}
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    inputText.trim()
                      ? 'bg-slate-900 text-white hover:bg-slate-800 cursor-pointer shadow-md'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-md mx-auto mb-10 leading-relaxed">
              Describe a friction point, user feedback, or telemetry drop-off. The ADOPT Engine will generate strategic solutions based on your enterprise library.
            </p>

            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
              {SAMPLE_PROMPTS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleRunDiagnosis(item.query)}
                  className="p-5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 shadow-sm hover:shadow-md transition-all text-left group flex flex-col justify-between"
                >
                  <span className="text-[11px] font-mono text-slate-400 block mb-3">
                    {item.tag}
                  </span>
                  <div className="flex items-center justify-between text-xs font-medium text-slate-700 group-hover:text-slate-950">
                    <span>{item.text}</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 2: Analyzing State */}
        {engineState === 'analyzing' && (
          <div className="w-full flex flex-col items-center justify-center text-center py-20 animate-in fade-in duration-300">
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin" />
              <Sparkles className="w-6 h-6 text-indigo-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>

            <h3 className="text-xl font-medium text-slate-800 mb-2">
              {analyzingStep === 1 && 'Ingesting telemetry signals...'}
              {analyzingStep === 2 && 'Evaluating behavioral cognitive load...'}
              {analyzingStep >= 3 && 'Synthesizing prescribed UX interventions...'}
            </h3>
            <p className="text-xs font-mono text-slate-400 max-w-sm">
              Cross-referencing 5-stage ADOPT taxonomy against telemetry heuristics
            </p>
          </div>
        )}

        {/* VIEW 3: Results Display */}
        {engineState === 'results' && (
          <div className="w-full bg-[#0d121f] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl animate-in fade-in duration-300 text-slate-100">
            <div className="flex items-center justify-between pb-6 border-b border-slate-800/80 mb-6">
              <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-slate-400 uppercase">
                <span>02 / BEHAVIORAL DIAGNOSIS</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>DIAGNOSIS COMPLETE</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
              <div className="px-6 py-4 rounded-xl bg-[#141b33] border border-indigo-500/40 text-indigo-300 font-mono font-bold text-sm tracking-widest uppercase shrink-0 text-center">
                {currentData.stage}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1.5">
                  <h2 className="text-xl font-semibold text-white">
                    {currentData.title}
                  </h2>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                    {currentData.confidence}% confidence
                  </span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {currentData.description}
                </p>
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-xs font-mono tracking-wider text-slate-400 uppercase mb-4">
                PRESCRIBED UX INTERVENTIONS
              </h3>

              <div className="space-y-3">
                {currentData.interventions.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#141b33] border border-indigo-500/30 text-indigo-400 flex items-center justify-center text-xs font-mono font-semibold shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-100 group-hover:text-white">
                          {item.title}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {item.description}
                        </div>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono px-3 py-1 rounded-md shrink-0 bg-slate-800/80 text-slate-300 border border-slate-700">
                      {item.impact}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800/80">
              <div className="grid grid-cols-5 gap-3 mb-2">
                {STAGES_ORDER.map((stage) => {
                  const isActive = activeStage === stage;
                  return (
                    <button
                      key={stage}
                      onClick={() => setActiveStage(stage)}
                      className="group flex flex-col items-center text-center cursor-pointer"
                    >
                      <div
                        className={`w-full h-1.5 rounded-full transition-all duration-300 mb-2 ${
                          isActive
                            ? 'bg-indigo-500 shadow-md shadow-indigo-500/50'
                            : 'bg-slate-800 group-hover:bg-slate-700'
                        }`}
                      />
                      <span
                        className={`text-[10px] font-mono tracking-wider transition-colors ${
                          isActive
                            ? 'text-indigo-400 font-bold'
                            : 'text-slate-500 group-hover:text-slate-400'
                        }`}
                      >
                        {stage}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between text-xs text-slate-400 font-mono z-10 border-t border-slate-100">
        <div>Structured around five behavioral stages</div>
        <div className="flex items-center gap-4">
          <span>Listen • Interpret • Diagnose • Recommend</span>
          <span>© 2026</span>
        </div>
      </footer>
    </main>
  );
}