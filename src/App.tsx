import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowUp,
  ArrowUpRight,
  ArrowRight,
  CirclePlus,
  Sparkles,
  TrendingDown,
  Activity,
  Zap,
  RotateCcw,
  Download,
  Share2,
  Check,
  BarChart2,
  BarChart3,
  MessageSquareQuote,
  Users,
  ShieldAlert,
  Clock3,
  Layers,
  ChevronRight,
  FileCheck,
  Sliders,
  ExternalLink,
  Target,
  Compass,
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  PlusCircle,
  Plus,
  Layout,
  FileText,
} from 'lucide-react';
import { CanvasSiriWave, WaveState } from './components/CanvasSiriWave';
import { SkeletonDashboard } from './components/SkeletonDashboard';
import { IntermediateLoader } from './components/IntermediateLoader';
import { SolutionPackModal } from './components/SolutionPackModal';
import { ImpactModelModal } from './components/ImpactModelModal';
import { StageDrilldownModal } from './components/StageDrilldownModal';
import { DiagnosisExplanationModal } from './components/DiagnosisExplanationModal';
import { WhyRecommendedModal } from './components/WhyRecommendedModal';
import { StrengthenDiagnosisModal } from './components/StrengthenDiagnosisModal';
import {
  BehavioralDiagnosisResult,
  RecommendationInitiative,
  StageHealthItem,
  generateEnterpriseDashboard,
  fallbackDatasets,
  classifyQueryStage,
} from './services/aiDiagnosis';
import { runBehavioralDiagnosis, ADOPT_META } from './services/behavioralEngine';
import { isPlaybookInitiative } from './lib/adoptPlaybookRegistry';

type EngineState = 'diagnose' | 'analyzing' | 'results';

const suggestions = [
  { text: 'We launched a new workflow dashboard 3 months ago. 85% of Finance Managers have never visited or know it exists.', stage: 'AWARE' },
  { text: 'The Skills Gap: Teams lack the specific literacy or confidence required to write effective prompts or manage AI outputs correctly.', stage: 'PROFICIENT' },
  { text: 'Users visit the landing page for our automation add-on, but less than 2% click to begin a trial because ROI is ambiguous.', stage: 'DESIRE' },
];

const analysisPhases = [
  'Ingesting raw adoption signals & classifying provenance...',
  'Executing 12-stage behavioral journey mapping...',
  'Evaluating 5-stage ADOPT health degradation curve...',
  'Running diagnostic critic pass & evaluating competing hypotheses...',
  'Synthesizing root causes & prioritizing P0/P1 UX plays...',
];

function getDeliverablesForInitiative(init?: RecommendationInitiative | null) {
  if (!init) {
    return [
      { key: 'ux_concept', label: 'UX concept', detail: 'Interactive UI wireframe & component spec' },
      { key: 'interaction_flow', label: 'Interaction flow', detail: 'State transitions & trigger logic' },
      { key: 'experiment_plan', label: 'Experiment plan', detail: 'A/B test design & variant hypotheses' },
      { key: 'measurement_plan', label: 'Measurement plan', detail: 'Leading & lagging behavioral metrics' },
    ];
  }
  switch (init.solutionType) {
    case 'ux_intervention':
      return [
        { key: 'ux_concept', label: 'UX concept', detail: 'Interactive UI wireframe & component spec' },
        { key: 'interaction_flow', label: 'Interaction flow', detail: 'State transitions & trigger logic' },
        { key: 'experiment_plan', label: 'Experiment plan', detail: 'A/B test design & variant hypotheses' },
        { key: 'measurement_plan', label: 'Measurement plan', detail: 'Leading & lagging behavioral metrics' },
      ];
    case 'prompt_workflow':
      return [
        { key: 'workflow_model', label: 'Workflow model', detail: '1-click prompt scaffolding & recipe logic' },
        { key: 'trigger_logic', label: 'Trigger logic', detail: 'Context detection & event listeners' },
        { key: 'starting_ui', label: 'Starting UI', detail: 'In-workflow dock & autocomplete spec' },
        { key: 'measurement_plan', label: 'Measurement plan', detail: 'Recipe completion & WAU tracking' },
      ];
    case 'campaign':
      return [
        { key: 'campaign_brief', label: 'Campaign brief', detail: 'Executive strategy & ROI positioning' },
        { key: 'messaging', label: 'Role messaging', detail: 'Before/after time savings by persona' },
        { key: 'sequence', label: 'Sequence', detail: '3-stage drip cadence' },
        { key: 'measurement_plan', label: 'Measurement plan', detail: 'Trial conversion & CTR' },
      ];
    case 'champion_program':
      return [
        { key: 'rollout_plan', label: 'Rollout plan', detail: 'Departmental template hub & champion network' },
        { key: 'template_library', label: 'Template library', detail: 'Vetted blueprint registry & sharing spec' },
        { key: 'champion_badges', label: 'Champion badges', detail: 'Recognition & viral coefficient tracking' },
        { key: 'measurement_plan', label: 'Measurement plan', detail: 'Cross-pod template multiplier' },
      ];
    default:
      return [
        { key: 'onboarding_flow', label: 'Onboarding flow', detail: '1-click seeded starter canvases' },
        { key: 'starting_ui', label: 'Starting UI', detail: 'Zero-state templates & prompt samples' },
        { key: 'experiment_plan', label: 'Experiment plan', detail: 'Activation funnel A/B test' },
        { key: 'measurement_plan', label: 'Measurement plan', detail: 'Time-to-first-value & D7 retention' },
      ];
  }
}

export default function App() {
  const [engineState, setEngineState] = useState<EngineState>('results');
  const [waveState, setWaveState] = useState<WaveState>('idle');
  const [input, setInput] = useState('');
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [isMultiLine, setIsMultiLine] = useState(false);
  const [isSkeletonResolving, setIsSkeletonResolving] = useState(false);

  // Dashboard state
  const [dashboardData, setDashboardData] = useState<BehavioralDiagnosisResult>(fallbackDatasets.PROFICIENT);
  const [selectedStageDrilldown, setSelectedStageDrilldown] = useState<StageHealthItem | null>(null);
  const [activeInitiative, setActiveInitiative] = useState<RecommendationInitiative | null>(null);
  const [reasoningInitiative, setReasoningInitiative] = useState<RecommendationInitiative | null>(null);

  // Modals
  const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
  const [isImpactModalOpen, setIsImpactModalOpen] = useState(false);
  const [isStageDrilldownOpen, setIsStageDrilldownOpen] = useState(false);
  const [isDiagnosisExplanationOpen, setIsDiagnosisExplanationOpen] = useState(false);
  const [isWhyRecommendedOpen, setIsWhyRecommendedOpen] = useState(false);
  const [isStrengthenModalOpen, setIsStrengthenModalOpen] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [solutionStudioDropdownOpen, setSolutionStudioDropdownOpen] = useState<string | null>(null);
  const [studioToast, setStudioToast] = useState<string | null>(null);

  const triggerStudioToast = (optionTitle: string) => {
    setSolutionStudioDropdownOpen(null);
    setStudioToast('Coming Soon — Solution Studio Artifact Generator');
    setTimeout(() => setStudioToast(null), 3500);
  };

  // Selected Checklist items for Solution Dock
  const [selectedAssets, setSelectedAssets] = useState<string[]>([
    'ux_concept',
    'campaign_brief',
    'in_app_nudges',
    'email_sequence',
    'measurement_plan',
  ]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = '24px';
    const isMulti = el.scrollHeight > 30 || input.includes('\n');
    if (isMulti) {
      el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
    }
    setIsMultiLine(isMulti);
  }, [input]);

  useEffect(() => {
    adjustHeight();
  }, [input, adjustHeight]);

  // Phase timer during analyzing state
  useEffect(() => {
    if (engineState !== 'analyzing') return;
    const phaseTimer = window.setInterval(() => {
      setPhaseIndex((index) => (index + 1) % analysisPhases.length);
    }, 450);
    return () => window.clearInterval(phaseTimer);
  }, [engineState]);

  // Close solution studio dropdown on document click
  useEffect(() => {
    const handleDocumentClick = () => {
      setSolutionStudioDropdownOpen(null);
    };
    if (solutionStudioDropdownOpen) {
      document.addEventListener('click', handleDocumentClick);
    }
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [solutionStudioDropdownOpen]);

  const runDiagnosis = async (customQuery?: string) => {
    const textToAnalyze = customQuery || input;
    if (!textToAnalyze.trim()) return;

    setWaveState('submitting');
    setEngineState('analyzing');
    setPhaseIndex(0);

    const startTime = Date.now();
    try {
      const data = await generateEnterpriseDashboard(textToAnalyze);
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 1800 - elapsed);
      setTimeout(() => {
        setDashboardData(data);
        setEngineState('results');
        setIsSkeletonResolving(true);
        setWaveState('results');
        setTimeout(() => {
          setIsSkeletonResolving(false);
        }, 600);
      }, remaining);
    } catch (e) {
      console.warn('Dashboard synthesis fallback:', e);
      const data = runBehavioralDiagnosis(textToAnalyze);
      setDashboardData(data);
      setEngineState('results');
      setIsSkeletonResolving(true);
      setWaveState('results');
      setTimeout(() => {
        setIsSkeletonResolving(false);
      }, 600);
    }
  };

  const reset = () => {
    setEngineState('diagnose');
    setWaveState('idle');
    setIsSkeletonResolving(false);
    setInput('');
    setIsFocused(false);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2200);
  };

  const handleExport = () => {
    const exportText = `# AdoptIQ Executive Behavioral Brief: ${dashboardData.dashboardTitle}
Generated: ${new Date().toLocaleDateString()}
Report Mode: ${dashboardData.reportMode.toUpperCase()}
Primary Diagnosis: ${dashboardData.primaryDiagnosis.title}
Key Behavioral Barrier: ${dashboardData.primaryDiagnosis.behavioralBarrier} (${dashboardData.primaryDiagnosis.barrierProvenance})
Diagnostic Confidence: ${dashboardData.primaryDiagnosis.confidenceScore}% (${dashboardData.primaryDiagnosis.confidenceLevel})

## AI Synthesis
${dashboardData.primaryDiagnosis.summary}

## 5-Stage ADOPT Health Matrix:
${dashboardData.healthScoresList.map((h) => `- ${h.name} (${h.letter}): ${h.percentageString} - ${h.insightText} ${h.isBottleneck ? '[PRIMARY BOTTLENECK]' : h.isSecondary ? '[SECONDARY BOTTLENECK]' : ''}`).join('\n')}

${dashboardData.largestBehavioralDrop ? `## Largest Behavioral Break:\n${dashboardData.largestBehavioralDrop.fromStage} -> ${dashboardData.largestBehavioralDrop.toStage} (${dashboardData.largestBehavioralDrop.delta} pts)\n${dashboardData.largestBehavioralDrop.explanation}\n` : ''}

## Why Adoption Is Breaking (Ranked Root Causes):
${dashboardData.rootCauses.map((rc, i) => `${i + 1}. ${rc.cause} [${rc.adoptImpact}] (Strength: ${rc.evidenceStrength})\n   ${rc.explanation}\n   Evidence: ${rc.evidence.join('; ')}`).join('\n\n')}

## Recommended Initiatives (Prioritized):
${dashboardData.initiatives.map((init) => `### ${init.priorityLabel}: ${init.title}
${init.shortDescription}
- Why This: ${init.whyThis}
- Target Behavior: ${init.behavioralObjective}
- Impact: ${init.impact} | Effort: ${init.effort} | Strength: ${init.evidenceStrength}
- Primary Metric: ${init.measurementPlan?.primaryMetric?.name || init.successMetric || 'Task completion'} (${init.measurementPlan?.primaryMetric?.baseline || 'Baseline'} -> ${init.measurementPlan?.primaryMetric?.target || 'Target'})
`).join('\n')}

## 90-Day Projected Business Outcomes:
${dashboardData.outcomes.map((o) => `- ${o.metricLabel}: ${o.projectedLift} (Current: ${o.currentValue} -> Target: ${o.targetValue}) [${o.directionalImpact}]`).join('\n')}
`;

    const blob = new Blob([exportText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AdoptIQ-Behavioral-Brief-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleAssetCheck = (assetKey: string) => {
    setSelectedAssets((prev) =>
      prev.includes(assetKey) ? prev.filter((k) => k !== assetKey) : [...prev, assetKey]
    );
  };

  const openStageDrilldown = (stageItem: StageHealthItem) => {
    setSelectedStageDrilldown(stageItem);
    setIsStageDrilldownOpen(true);
  };

  const getModeBadge = (mode: string) => {
    switch (mode) {
      case 'intelligence':
        return { label: 'Mode C — Intelligence Mode', bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' };
      case 'diagnostic':
        return { label: 'Mode B — Diagnostic Mode', bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' };
      default:
        return { label: 'Mode A — Hypothesis Mode', bg: '#fff7ed', text: '#c2410c', border: '#fed7aa' };
    }
  };

  const modeBadge = getModeBadge(dashboardData.reportMode);

  return (
    <main className={`app-shell app-shell--${engineState}`}>
      {/* Toast Notifications */}
      {copiedToast && (
        <div className="toast-notification">
          <Check size={16} className="text-emerald" />
          <span>Dashboard share link copied to clipboard!</span>
        </div>
      )}
      {studioToast && (
        <div className="toast-notification toast-notification--studio">
          <Sparkles size={16} style={{ color: '#a78bfa' }} />
          <span>{studioToast}</span>
        </div>
      )}

      {/* Top Bar Header */}
      <header className="topbar">
        <div className="topbar__left" onClick={reset} style={{ cursor: 'pointer' }}>
          <div className="brand-mark" aria-label="AdoptIQ">
            <span className="brand-mark__shape" />
            <span className="brand-mark__shape brand-mark__shape--second" />
          </div>
          <div className="brand-identity">
            <span className="brand-title">AdoptIQ<span className="brand-dot">.ai</span></span>
            <span className="brand-tagline">Behavioral Intelligence Engine</span>
          </div>
        </div>

        <div className="topbar__right">
          {engineState === 'results' && (
            <button
              type="button"
              className="btn-dashboard-action"
              onClick={reset}
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '12.5px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(124, 58, 237, 0.25)',
              }}
            >
              <Plus size={14} strokeWidth={2.5} />
              <span>New Diagnosis</span>
            </button>
          )}
          <div className="topbar__status">
            <span className="status-dot" />
            <span className="status-label">Behavioral Reasoning Active</span>
          </div>
          <div className="topbar__divider" />
          <span className="topbar__edition">Enterprise Strategic Edition</span>
        </div>
      </header>

      {/* 1. Initial State: Diagnose / Search Bar */}
      {engineState === 'diagnose' && (
        <section className="diagnose-view" aria-labelledby="page-title">
          <div className="hero-copy">
            <p className="eyebrow">ADOPT FRAMEWORK <span>·</span> BEHAVIORAL INTELLIGENCE</p>
            <h1 id="page-title">Diagnose your <strong>product adoption</strong></h1>
            <p className="hero-subtitle">
              Tell AdoptIQ what is happening. It determines where adoption is breaking, why it happens, and creates a starting solution your team can execute.
            </p>
          </div>

          <div className="input-stage" style={{ position: 'relative' }}>
            <CanvasSiriWave state={waveState} activity={input.length > 0 ? 1.2 : 1.0} />

            <div
              className={`command-bar ${isFocused ? 'command-bar--focused' : ''} ${isMultiLine ? 'command-bar--multiline' : ''}`}
              style={{ position: 'relative', zIndex: 10 }}
            >
              <CirclePlus size={22} strokeWidth={1.7} className="command-bar__plus" />
              <textarea
                ref={textareaRef}
                value={input}
                rows={1}
                onChange={(event) => {
                  setInput(event.target.value);
                  setWaveState(event.target.value ? 'listening' : 'idle');
                }}
                onFocus={() => {
                  setIsFocused(true);
                  setWaveState('listening');
                }}
                onBlur={() => setIsFocused(false)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    runDiagnosis();
                  }
                }}
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
            Describe a friction point, telemetry drop-off, or adoption use case. The ADOPT Engine will extrapolate the 5 stages and generate high-impact interventions.
          </p>

          <div className="suggestions" aria-label="Suggested problems">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.text}
                type="button"
                className="suggestion-card"
                onClick={() => {
                  setInput(suggestion.text);
                  runDiagnosis(suggestion.text);
                }}
              >
                <span>{suggestion.text}</span>
                <ArrowUpRight size={15} />
              </button>
            ))}
          </div>

          <div className="hero-footer">
            <span>Structured around the 5 ADOPT stages</span>
            <div>
              <span>Aware</span>
              <span>·</span>
              <span>Desire</span>
              <span>·</span>
              <span>Open</span>
              <span>·</span>
              <span>Proficient</span>
              <span>·</span>
              <span>Transform</span>
            </div>
          </div>
        </section>
      )}

      {/* 2. Intermediate Loading State: Dedicated Wave Loader Page (Image 2) */}
      {engineState === 'analyzing' && (
        <IntermediateLoader phaseIndex={phaseIndex} waveState={waveState} />
      )}

      {/* 3. Populated Results: Autonomous Behavioral Intelligence Dashboard */}
      {engineState === 'results' && (
        isSkeletonResolving ? (
          <div className="results-skeleton-container" aria-label="Loading diagnostic results">
            <SkeletonDashboard />
          </div>
        ) : (
          <div className="results-dashboard-wrapper">
            <section className="results-dashboard fadeInUp" aria-labelledby="dashboard-heading">
            {/* A. PAGE CONTEXT & HEADER */}
            <header className="dashboard-zone-1">
              <div className="zone-1-header-row">
                <div className="zone-1-header-left">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: '999px',
                        background: modeBadge.bg,
                        color: modeBadge.text,
                        border: `1px solid ${modeBadge.border}`,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {modeBadge.label}
                    </span>
                    {dashboardData.context.persona && (
                      <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
                        Target: <strong>{dashboardData.context.persona}</strong>
                      </span>
                    )}
                  </div>
                  <h1 id="dashboard-heading" className="dashboard-h1">
                    {dashboardData.dashboardTitle}
                  </h1>
                </div>

                <div className="zone-1-actions">
                  <button className="btn-dashboard-action" onClick={reset} title="Start a new diagnosis">
                    <RotateCcw size={15} />
                    <span>New Diagnosis</span>
                  </button>
                  <button className="btn-dashboard-action" onClick={handleShare} title="Share link to this dashboard">
                    <Share2 size={15} />
                    <span>Share</span>
                  </button>
                  <button className="btn-dashboard-action btn-dashboard-action--export" onClick={handleExport} title="Download executive summary markdown">
                    <Download size={15} />
                    <span>Export Brief</span>
                  </button>
                </div>
              </div>
            </header>

            {/* B. PRIMARY DIAGNOSIS HERO (FULL WIDTH) */}
            <section className="primary-diagnosis-hero" aria-label="Primary Diagnosis">
              <div className="ai-summary-ambient-glow" aria-hidden="true" />

              {/* Card Header: Title on Left, Add Evidence Pill on Right */}
              <div className="primary-diagnosis-hero__header">
                <h2 className="primary-diagnosis-hero__title">
                  <Sparkles size={20} className="primary-diagnosis-sparkle-inline" />
                  <span>{dashboardData.primaryDiagnosis.title}</span>
                </h2>

                <button
                  type="button"
                  className="btn-add-evidence-hero-pill"
                  onClick={() => setIsStrengthenModalOpen(true)}
                  title="Click to add evidence and improve diagnostic confidence"
                >
                  <span className="btn-add-evidence-icon-circle">
                    <Plus size={13} strokeWidth={2.5} />
                  </span>
                  <span>Add evidence to improve confidence</span>
                </button>
              </div>

              {/* Side-by-Side 2-Column Grid */}
              <div className="primary-diagnosis-top-grid">
                {/* Left Column: Problem Summary */}
                <div className="primary-diagnosis-col-left">
                  <span className="primary-diagnosis-kicker">DIAGNOSTIC SUMMARY</span>
                  <p className="primary-diagnosis-hero__summary">
                    {dashboardData.primaryDiagnosis.summary}
                  </p>
                </div>

                {/* Right Column: Recommended Focus Inset Card */}
                <div className="primary-diagnosis-col-right">
                  <div className="primary-diagnosis-focus-box">
                    <span className="recommended-focus-kicker">RECOMMENDED FOCUS</span>

                    <h3 className="recommended-focus-headline">
                      {dashboardData.strategyBridge?.headline || 'Move users from experimentation → trusted, repeatable workflows'}
                    </h3>

                    <p className="recommended-focus-desc">
                      {dashboardData.strategyBridge?.description || 'Prioritize interventions that reduce verification effort, guide users into recurring tasks, and make successful workflows easy to repeat.'}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* C. ADOPT BEHAVIORAL JOURNEY (5 STAGES LEFT-TO-RIGHT) */}
            <section className="adopt-journey-section" aria-label="ADOPT Behavioral Journey">
              <div className="adoption-health-grid">
                {dashboardData.healthScoresList.map((stageItem) => {
                  const isPrimary = stageItem.role === 'PRIMARY FOCUS' || stageItem.isBottleneck;
                  const isHealthy = stageItem.role === 'HEALTHY UPSTREAM';
                  const isNullScore = stageItem.score === null || stageItem.percentageString === '—';
                  const scoreNum = stageItem.score ?? (stageItem.percentageString ? parseInt(stageItem.percentageString) : 50);
                  const percentColor = isNullScore ? '#94a3b8' : scoreNum >= 60 ? '#16a34a' : scoreNum >= 25 ? '#ea580c' : '#ef4444';
                  const letterBadgeClass = isPrimary
                    ? 'stage-letter-badge--bottleneck'
                    : (isHealthy || (!isNullScore && scoreNum >= 60))
                    ? 'stage-letter-badge--healthy'
                    : 'stage-letter-badge--inactive';

                  return (
                    <div
                      key={stageItem.stage}
                      className={`adoption-stage-card ${isPrimary ? 'adoption-stage-card--primary-focus' : ''}`}
                      onClick={() => openStageDrilldown(stageItem)}
                      style={{ cursor: 'pointer', position: 'relative' }}
                      title="Click to inspect behavioral breakdown"
                    >
                      <div className="adoption-stage-card__header">
                        <div className="adoption-stage-card__title-group">
                          <span className={`stage-letter-badge ${letterBadgeClass}`}>
                            {stageItem.letter}
                          </span>
                          <span className="stage-card-name">{stageItem.name}</span>
                        </div>
                        {isNullScore ? (
                          <button
                            type="button"
                            className="stage-card-btn-add-telemetry"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsStrengthenModalOpen(true);
                            }}
                            title="Add evidence to evaluate stage"
                          >
                            <Plus size={13} strokeWidth={2.5} />
                          </button>
                        ) : (
                          <strong className="stage-card-percentage" style={{ color: percentColor }}>
                            {stageItem.percentageString || `${scoreNum}%`}
                          </strong>
                        )}
                      </div>

                      <p className="adoption-stage-card__insight" style={{ minHeight: '38px', marginTop: '10px' }}>
                        {stageItem.specificMeaning || stageItem.insightText || (
                          isNullScore ? 'Awaiting observed telemetry or survey signals...' :
                          stageItem.stage === 'AWARE' ? 'High awareness through comms & campaigns' :
                          stageItem.stage === 'DESIRE' ? 'Users see limited personal value' :
                          stageItem.stage === 'OPEN' ? 'Willing to try but inconsistent' :
                          stageItem.stage === 'PROFICIENT' ? 'Struggle with getting good outcomes' :
                          'Not yet part of daily workflow'
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Largest Behavioral Break Callout */}
              {dashboardData.largestBehavioralDrop && (
                <div className="largest-break-connector-banner" style={{ marginTop: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '6px 8px', background: '#ffedd5', borderRadius: '10px', color: '#ea580c' }}>
                      <TrendingDown size={18} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#c2410c', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          Largest Adoption Break
                        </span>
                        <strong style={{ fontSize: '13.5px', color: '#9a3412' }}>
                          {ADOPT_META[dashboardData.largestBehavioralDrop.fromStage].name} {dashboardData.healthScoresList.find(s => s.stage === dashboardData.largestBehavioralDrop?.fromStage)?.percentageString} → {ADOPT_META[dashboardData.largestBehavioralDrop.toStage].name} {dashboardData.healthScoresList.find(s => s.stage === dashboardData.largestBehavioralDrop?.toStage)?.percentageString} ({dashboardData.largestBehavioralDrop.delta} pts)
                        </strong>
                      </div>
                      <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: '#7c2d12' }}>
                        {dashboardData.largestBehavioralDrop.explanation}
                      </p>
                    </div>
                  </div>

                  <button
                    className="btn-dashboard-action"
                    onClick={() => setIsDiagnosisExplanationOpen(true)}
                    style={{ background: '#ffffff', borderColor: '#fed7aa', color: '#c2410c', flexShrink: 0, height: '32px', fontSize: '11.5px' }}
                  >
                    <span>Inspect breakdown</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              )}
            </section>

            {/* SECTIONS D, E, F: 2-COLUMN MAIN HIERARCHY */}
            <div className="dashboard-zone-2">
              {/* LEFT COLUMN (32% width): D. ROOT CAUSES / EVIDENCE */}
              <div className="zone-2-column zone-2-column--evidence">
                {/* D. EVIDENCE BEHIND PROBLEM / ROOT CAUSES */}
                <div className="column-header">
                  <div>
                    <h3 className="column-title">Evidence Behind Problem</h3>
                    <p className="column-subtitle" style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
                      Identified behavioral &amp; telemetry signals
                    </p>
                  </div>
                  <span className="count-badge">{dashboardData.rootCauses?.length || 3} Signals</span>
                </div>

                <div className="evidence-alerts-stack">
                  {dashboardData.rootCauses.map((rc, idx) => {
                    const rawCrit = ((rc as any).criticality || '').toUpperCase();
                    const variant = rawCrit === 'HIGH' ? 'critical' : rawCrit === 'MEDIUM' ? 'warning' : rawCrit === 'LOW' ? 'info' : (idx === 0 ? 'critical' : idx === 1 ? 'warning' : 'info');
                    return (
                      <article
                        key={rc.id}
                        className={`evidence-alert-card evidence-alert-card--${variant}`}
                      >
                        <div className={`evidence-alert-icon-circle evidence-alert-icon-circle--${variant}`}>
                          <AlertCircle size={16} strokeWidth={2.5} />
                        </div>
                        <div className="evidence-alert-content">
                          <h4 className="evidence-alert-title" style={{ margin: '0 0 3px', fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>
                            {rc.cause}
                          </h4>
                          <p className="evidence-alert-subtext" style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: 1.45 }}>
                            {rc.explanation}
                          </p>
                        </div>
                      </article>
                    );
                  })}

                  {/* Greyed Empty Cards to fill 5 total slots and match Prioritized Initiatives height */}
                  {Array.from({ length: Math.max(1, 5 - (dashboardData.rootCauses?.length || 0)) }).map((_, emptyIdx) => (
                    <article
                      key={`empty-evidence-slot-${emptyIdx}`}
                      className="evidence-alert-card evidence-alert-card--empty"
                      onClick={() => setIsStrengthenModalOpen(true)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setIsStrengthenModalOpen(true);
                        }
                      }}
                      title="Click to add evidence and uncover more insights"
                    >
                      <div className="evidence-alert-icon-circle evidence-alert-icon-circle--empty">
                        <Plus size={16} strokeWidth={2.5} />
                      </div>
                      <div className="evidence-alert-content">
                        <h4 className="evidence-alert-title" style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
                          Add evidence for more insights
                        </h4>
                        <p className="evidence-alert-subtext" style={{ margin: 0, fontSize: '11.5px', color: '#94a3b8' }}>
                          Uncover additional telemetry &amp; behavioral signals
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* RIGHT COLUMN (68% width): F. PRIORITIZED INITIATIVES */}
              <div className="zone-2-column zone-2-column--initiatives">
                <div className="column-header">
                  <div>
                    <h3 className="column-title">Prioritized Initiatives</h3>
                    <p className="column-subtitle">Targeted UX interventions ordered by root-cause remediation</p>
                  </div>
                  <span className="count-badge count-badge--primary">{dashboardData.initiatives.length} High-Impact Plays</span>
                </div>

                <div className="initiatives-list">
                  {/* Primary Hero Recommendation (P0 · START HERE) */}
                  {dashboardData.initiatives[0] && (
                    <article className="initiative-hero-card">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="initiative-hero-badge">
                            <Sparkles size={12} />
                            <span>{dashboardData.initiatives[0].heroBadge || 'P0 · START HERE'}</span>
                          </span>
                          {(dashboardData.initiatives[0].isPlaybookMatch !== false && (dashboardData.initiatives[0].isPlaybookMatch || isPlaybookInitiative(dashboardData.initiatives[0].title))) ? (
                            <span className="playbook-proven-badge" title="Selected from official ADOPT Playbook Registry">
                              <BookOpen size={11} />
                              <span>ADOPT Playbook</span>
                            </span>
                          ) : (
                            <span className="ai-custom-badge" title="Dynamic edge-case intervention tailored by Gemini AI">
                              <Sparkles size={11} />
                              <span>AI Custom Play</span>
                            </span>
                          )}
                        </div>
                        <span className="root-cause-ref-pill">
                          {dashboardData.initiatives[0].rootCauseBadge || 'Addresses RC01'}
                        </span>
                      </div>

                      <div>
                        <h4 className="initiative-hero-title">
                          {dashboardData.initiatives[0].title}
                        </h4>
                        <p className="initiative-hero-desc" style={{ marginTop: '4px' }}>
                          {dashboardData.initiatives[0].shortDescription}
                        </p>
                      </div>

                      {/* Footer Actions */}
                      <div className="initiative-hero-footer" style={{ marginTop: '12px' }}>
                        <div className="initiative-hero-meta">
                          <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                            Impact: <strong style={{ color: '#0f172a' }}>{dashboardData.initiatives[0].impact}</strong>
                          </span>
                          <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                            Effort: <strong style={{ color: '#0f172a' }}>{dashboardData.initiatives[0].effort}</strong>
                          </span>
                          <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                            Evidence: <strong style={{ color: '#15803d' }}>{dashboardData.initiatives[0].evidenceStrength}</strong>
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
                          <button
                            type="button"
                            className="btn-why-recommended"
                            onClick={() => {
                              setReasoningInitiative(dashboardData.initiatives[0]);
                              setIsWhyRecommendedOpen(true);
                            }}
                          >
                            <span>Why recommended?</span>
                            <ArrowRight size={12} />
                          </button>

                          <div style={{ position: 'relative' }}>
                            <button
                              type="button"
                              className="btn-hero-create-solution"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSolutionStudioDropdownOpen(
                                  solutionStudioDropdownOpen === dashboardData.initiatives[0].id
                                    ? null
                                    : dashboardData.initiatives[0].id
                                );
                              }}
                            >
                              <span>Create solution</span>
                              <ArrowRight size={14} />
                            </button>

                            {/* Dropdown Menu */}
                            {solutionStudioDropdownOpen === dashboardData.initiatives[0].id && (
                              <div className="solution-studio-dropdown">
                                <button
                                  type="button"
                                  className="solution-studio-dropdown-item"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    triggerStudioToast('Create User Flow');
                                  }}
                                >
                                  <Layers size={14} />
                                  <span>Create User Flow</span>
                                </button>
                                <button
                                  type="button"
                                  className="solution-studio-dropdown-item"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    triggerStudioToast('Create UX Design');
                                  }}
                                >
                                  <Layout size={14} />
                                  <span>Create UX Design</span>
                                </button>
                                <button
                                  type="button"
                                  className="solution-studio-dropdown-item"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    triggerStudioToast('Create Recommendation Deck');
                                  }}
                                >
                                  <FileText size={14} />
                                  <span>Create Recommendation Deck</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  )}

                  {/* Secondary Quieter Initiatives (Cards 2 to 6) */}
                  {dashboardData.initiatives.slice(1, 6).map((init, i) => (
                    <article
                      key={init.id}
                      className="initiative-row-card"
                      onClick={() => setActiveInitiative(init)}
                      style={{
                        cursor: 'pointer',
                        borderColor: activeInitiative?.id === init.id ? '#8b5cf6' : undefined,
                      }}
                    >
                      <span className="initiative-number">0{i + 2}</span>

                      <div className="initiative-main-content">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <h4 className="initiative-title">{init.title}</h4>
                          {(init.isPlaybookMatch !== false && (init.isPlaybookMatch || isPlaybookInitiative(init.title))) ? (
                            <span className="playbook-proven-badge" style={{ fontSize: '9.5px', padding: '1px 6px' }}>
                              <BookOpen size={9} />
                              <span>Playbook</span>
                            </span>
                          ) : (
                            <span className="ai-custom-badge" style={{ fontSize: '9.5px', padding: '1px 6px' }}>
                              <Sparkles size={9} />
                              <span>AI Custom</span>
                            </span>
                          )}
                          <span className="root-cause-ref-pill" style={{ fontSize: '10px', padding: '1px 6px' }}>
                            {init.rootCauseBadge || `Addresses RC0${Math.min(3, i + 2)}`}
                          </span>
                        </div>
                        <p className="initiative-description">{init.shortDescription}</p>

                        <div className="stage-tags-group">
                          {init.targetedStages.map((st) => {
                            const stLower = st.toLowerCase();
                            return (
                              <span
                                key={st}
                                className={`targeted-stage-pill targeted-stage-pill--${stLower}`}
                              >
                                {st.charAt(0).toUpperCase() + st.slice(1).toLowerCase()}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <div className="initiative-impact-meter">
                        <span className="impact-meter-label">Impact</span>
                        <div className="impact-meter-row">
                          <div className="impact-meter-track">
                            <div
                              className="impact-meter-fill"
                              style={{ width: `${init.priorityScore}%` }}
                            />
                          </div>
                          <span className="impact-meter-val">
                            {init.impact === 'High' ? 'High' : init.impact === 'Medium' ? 'Med' : 'Low'}
                          </span>
                        </div>
                      </div>

                      <div className="initiative-action-area" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', position: 'relative' }}>
                        <div style={{ position: 'relative' }}>
                          <button
                            type="button"
                            className="btn-create-solution-pill"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSolutionStudioDropdownOpen(
                                solutionStudioDropdownOpen === init.id ? null : init.id
                              );
                            }}
                          >
                            Create solution
                          </button>

                          {/* Dropdown Menu */}
                          {solutionStudioDropdownOpen === init.id && (
                            <div className="solution-studio-dropdown">
                              <button
                                type="button"
                                className="solution-studio-dropdown-item"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  triggerStudioToast('Create User Flow');
                                }}
                              >
                                <Layers size={14} />
                                <span>Create User Flow</span>
                              </button>
                              <button
                                type="button"
                                className="solution-studio-dropdown-item"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  triggerStudioToast('Create UX Design');
                                }}
                              >
                                <Layout size={14} />
                                <span>Create UX Design</span>
                              </button>
                              <button
                                type="button"
                                className="solution-studio-dropdown-item"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  triggerStudioToast('Create Recommendation Deck');
                                }}
                              >
                                <FileText size={14} />
                                <span>Create Recommendation Deck</span>
                              </button>
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          className="btn-why-recommended"
                          style={{ fontSize: '11px', color: '#64748b' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setReasoningInitiative(init);
                            setIsWhyRecommendedOpen(true);
                          }}
                        >
                          Why recommended?
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            {/* H. EXPECTED OUTCOME STRIP */}
            <section className="expected-outcome-strip" aria-label="Expected Behavioral Outcome">
              <div className="expected-outcome-strip__left">
                <span className="expected-outcome-kicker">EXPECTED OUTCOME</span>
                <p className="expected-outcome-desc">
                  Based on similar organizations, these initiatives can improve WAU from 11% → 35–45% in 90 days.
                </p>
              </div>

              <div className="expected-outcome-strip__metrics">
                <div className="expected-outcome-metric-item">
                  <div className="expected-outcome-metric-icon-pod">
                    <Activity size={15} />
                  </div>
                  <div className="expected-outcome-metric-data">
                    <span className="expected-outcome-metric-val">
                      {dashboardData.northStarMetric?.lift && dashboardData.northStarMetric.lift !== 'Directional lift'
                        ? dashboardData.northStarMetric.lift
                        : '+24–34%'}
                    </span>
                    <span className="expected-outcome-metric-lbl">Increase in WAU</span>
                  </div>
                </div>

                <div className="expected-outcome-metric-item">
                  <div className="expected-outcome-metric-icon-pod">
                    <Zap size={15} />
                  </div>
                  <div className="expected-outcome-metric-data">
                    <span className="expected-outcome-metric-val">
                      {dashboardData.outcomes?.[0]?.projectedLift || '+2.1x'}
                    </span>
                    <span className="expected-outcome-metric-lbl">Repeat usage rate</span>
                  </div>
                </div>

                <div className="expected-outcome-metric-item">
                  <div className="expected-outcome-metric-icon-pod">
                    <Clock3 size={15} />
                  </div>
                  <div className="expected-outcome-metric-data">
                    <span className="expected-outcome-metric-val">
                      {dashboardData.outcomes?.[1]?.projectedLift || '-35%'}
                    </span>
                    <span className="expected-outcome-metric-lbl">Time to first value</span>
                  </div>
                </div>

                <div className="expected-outcome-metric-item">
                  <div className="expected-outcome-metric-icon-pod">
                    <CheckCircle2 size={15} />
                  </div>
                  <div className="expected-outcome-metric-data">
                    <span className="expected-outcome-metric-val">
                      {dashboardData.outcomes?.[2]?.projectedLift || '+28%'}
                    </span>
                    <span className="expected-outcome-metric-lbl">Task success rate</span>
                  </div>
                </div>
              </div>

              <div className="expected-outcome-strip__right">
                <button
                  type="button"
                  className="btn-view-impact-model-strip"
                  onClick={() => setIsImpactModalOpen(true)}
                >
                  <span>View impact model</span>
                </button>
              </div>
            </section>
          </section>

          {/* G. STICKY BOTTOM DOCK: AI SOLUTION CREATOR */}
          <aside className="sticky-ai-solution-creator-dock" aria-label="AI Solution Creator Dock">
            <div className="creator-dock-inner">
              <div className="creator-dock-left">
                <div className="creator-dock-badge">
                  <Sparkles size={13} />
                  <span>AI SOLUTION CREATOR</span>
                </div>
                <h4 className="creator-dock-title" style={{ fontSize: '13px', margin: '2px 0 0', fontWeight: 600, color: '#0f172a' }}>
                  Selected: <strong style={{ color: '#7c3aed' }}>{activeInitiative?.title || dashboardData.initiatives[0]?.title || 'Inline Verification & Confidence'}</strong>
                </h4>
              </div>

              {/* Dynamic Deliverable Toggles */}
              <div className="creator-dock-checklist">
                {getDeliverablesForInitiative(activeInitiative || dashboardData.initiatives[0]).map((item) => {
                  const isChecked = selectedAssets.includes(item.key) || true;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      className={`dock-check-chip ${isChecked ? 'dock-check-chip--active' : ''}`}
                      onClick={() => toggleAssetCheck(item.key)}
                      title={item.detail}
                      aria-pressed={isChecked}
                    >
                      <span className={`dock-checkbox ${isChecked ? 'dock-checkbox--checked' : ''}`}>
                        {isChecked && <Check size={11} strokeWidth={3.5} />}
                      </span>
                      <span className="dock-check-label">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="creator-dock-right">
                <button
                  className="btn-dock-generate-pack"
                  onClick={() => {
                    if (!activeInitiative && dashboardData.initiatives[0]) {
                      setActiveInitiative(dashboardData.initiatives[0]);
                    }
                    setIsSolutionModalOpen(true);
                  }}
                >
                  <Sparkles size={15} />
                  <span>✦ Generate solution</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </aside>
        </div>
        )
      )}

      {/* Solution Pack Modal */}
      <SolutionPackModal
        isOpen={isSolutionModalOpen}
        onClose={() => setIsSolutionModalOpen(false)}
        dashboardData={dashboardData}
        activeInitiative={activeInitiative}
      />

      {/* Impact Model Simulation Modal */}
      <ImpactModelModal
        isOpen={isImpactModalOpen}
        onClose={() => setIsImpactModalOpen(false)}
        dashboardData={dashboardData}
      />

      {/* Stage Drilldown Modal ("Why this score?") */}
      <StageDrilldownModal
        isOpen={isStageDrilldownOpen}
        onClose={() => setIsStageDrilldownOpen(false)}
        stageItem={selectedStageDrilldown}
      />

      {/* Diagnosis Explanation Modal ("Why this diagnosis?") */}
      <DiagnosisExplanationModal
        isOpen={isDiagnosisExplanationOpen}
        onClose={() => setIsDiagnosisExplanationOpen(false)}
        primaryDiagnosis={dashboardData.primaryDiagnosis}
        context={dashboardData.context}
        signals={dashboardData.signals}
      />

      {/* Why Recommended Modal (Reasoning Chain) */}
      <WhyRecommendedModal
        isOpen={isWhyRecommendedOpen}
        onClose={() => setIsWhyRecommendedOpen(false)}
        initiative={reasoningInitiative}
      />

      {/* Strengthen Diagnosis Modal */}
      <StrengthenDiagnosisModal
        isOpen={isStrengthenModalOpen}
        onClose={() => setIsStrengthenModalOpen(false)}
        missingEvidence={dashboardData.missingEvidence}
        context={dashboardData.context}
        onReDiagnoseWithEvidence={(newQuery) => runDiagnosis(newQuery)}
      />
    </main>
  );
}