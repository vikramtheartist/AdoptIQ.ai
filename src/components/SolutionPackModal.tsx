import React, { useState } from 'react';
import {
  X,
  Check,
  Copy,
  Download,
  Sparkles,
  Layers,
  FileText,
  Activity,
  Compass,
  Zap,
  Target,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { AdoptIQDashboardData } from '../services/aiDiagnosis';
import { RecommendationInitiative as EnhancedInitiative } from '../services/behavioralEngine';

interface SolutionPackModalProps {
  isOpen: boolean;
  onClose: () => void;
  dashboardData: AdoptIQDashboardData;
  activeInitiative?: EnhancedInitiative | null;
}

export function SolutionPackModal({
  isOpen,
  onClose,
  dashboardData,
  activeInitiative,
}: SolutionPackModalProps) {
  const [activeTab, setActiveTab] = useState<'wireframe' | 'blueprint' | 'measurement' | 'recipes'>('wireframe');
  const [copied, setCopied] = useState(false);
  const [selectedMockOption, setSelectedMockOption] = useState<number | null>(0);
  const [isGeneratedPreviewVisible, setIsGeneratedPreviewVisible] = useState(false);

  if (!isOpen) return null;

  const currentInitiative: any =
    activeInitiative || dashboardData.initiatives[0];

  if (!currentInitiative) return null;

  const asset = currentInitiative.generatedAsset || currentInitiative.solutionAsset || {};
  const measurement = currentInitiative.measurementPlan || {};
  const chain = currentInitiative.whyRecommendedChain || {
    observedEvidence: currentInitiative.reasoningChain?.evidence || currentInitiative.whyThisFirst || 'Reported adoption friction in workflow',
    behavioralRootCause: currentInitiative.reasoningChain?.behavioralCause || currentInitiative.rootCauseBadge || 'Cognitive friction and workflow verification burden',
    adoptStage: currentInitiative.reasoningChain?.adoptStage || currentInitiative.movesStage || (currentInitiative.targetedStages && currentInitiative.targetedStages[0]) || 'ADOPT Framework',
    targetBehavior: currentInitiative.reasoningChain?.targetBehavior || currentInitiative.behaviorToChange || 'Confident, habitual workflow execution',
    chosenIntervention: currentInitiative.reasoningChain?.intervention || currentInitiative.title,
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const fullText = `# AdoptIQ Executable Solution Pack
Generated: ${new Date().toLocaleDateString()}
Diagnosis: ${dashboardData.primaryDiagnosis.title}
Initiative: [${currentInitiative.priorityTier || currentInitiative.priority || 'P0'}] ${currentInitiative.title}

## 1. Executive Concept & Behavioral Objective
- Concept Name: ${asset.conceptName || asset.conceptTitle || currentInitiative.title}
- Target Behavioral Objective: ${currentInitiative.behavioralObjective || 'Accelerate feature adoption'}
- Priority Tier: ${currentInitiative.priorityTier || currentInitiative.priority || 'P0'} (Expected Impact: ${currentInitiative.impactBarValue || currentInitiative.priorityScore || 92}/100)
- Targeted ADOPT Stages: ${(currentInitiative.targetedStages || ['PROFICIENT']).join(', ')}

## 2. Behavioral Reasoning Chain (Why Recommended)
1. Observed Signal / Evidence: ${chain.observedEvidence}
2. Behavioral Root Cause: ${chain.behavioralRootCause}
3. ADOPT Framework Focus: ${chain.adoptStage}
4. Targeted Desired Behavior: ${chain.targetBehavior}
5. Chosen Intervention Concept: ${chain.chosenIntervention}

## 3. Step-by-Step User Experience Journey
${((asset.userJourneySteps || (asset.journeySteps ? asset.journeySteps.map((s: any) => typeof s === 'string' ? s : `${s.title}: ${s.description}`) : [])) || []).map((step: string, idx: number) => `${idx + 1}. ${step}`).join('\n')}

## 4. Measurement & Experimentation Plan
- Primary Success Metric: ${measurement.primarySuccessMetric || measurement.primaryMetric?.name || 'Task completion'}
- Leading Indicators:
${(measurement.leadingIndicators || []).map((ind: string) => `  * ${ind}`).join('\n')}
- Behavioral Habit Metric: ${measurement.behavioralMetric || 'Repeat usage'}
- Lagging Cohort Metric: ${measurement.laggingMetric || 'Retention'}
- Guardrail Metrics:
${(measurement.guardrailMetrics || []).map((g: string) => `  * ${g}`).join('\n')}

## 5. Generated Prompt Recipes & Trigger Specs
${asset.promptRecipes ? asset.promptRecipes.map((r: any, i: number) => `### Recipe ${i + 1}: ${r.task}\nPrompt Template: "${r.prompt}"\nNotes: ${r.variableNotes}\n`).join('\n') : 'N/A for this intervention type.'}
`;

    const blob = new Blob([fullText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AdoptIQ-Solution-Pack-${currentInitiative.id}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content modal-content--wide" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header__left">
            <div className="modal-badge">
              <Sparkles size={14} />
              <span>AI SOLUTION PACK GENERATOR · EXECUTABLE DELIVERABLES</span>
            </div>
            <h3>{currentInitiative.title}</h3>
            <p className="modal-subtitle">
              Interactive starting prototype, behavioral reasoning chain, prompt syntax scaffolding, and measurement blueprint.
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="modal-tabs">
          <button
            className={`modal-tab ${activeTab === 'wireframe' ? 'modal-tab--active' : ''}`}
            onClick={() => setActiveTab('wireframe')}
          >
            <Layers size={15} />
            <span>Interactive UX Prototype</span>
          </button>
          <button
            className={`modal-tab ${activeTab === 'blueprint' ? 'modal-tab--active' : ''}`}
            onClick={() => setActiveTab('blueprint')}
          >
            <FileText size={15} />
            <span>Behavioral Reasoning & Journey</span>
          </button>
          <button
            className={`modal-tab ${activeTab === 'measurement' ? 'modal-tab--active' : ''}`}
            onClick={() => setActiveTab('measurement')}
          >
            <Target size={15} />
            <span>Measurement Plan</span>
          </button>
          <button
            className={`modal-tab ${activeTab === 'recipes' ? 'modal-tab--active' : ''}`}
            onClick={() => setActiveTab('recipes')}
          >
            <Zap size={15} />
            <span>Prompt & Nudge Specs</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* TAB 1: INTERACTIVE PROTOTYPE & WIREFRAME */}
          {activeTab === 'wireframe' && (
            <div className="modal-panel">
              <div className="wireframe-studio">
                <div className="wireframe-studio__canvas">
                  <div className="studio-canvas-header">
                    <div className="window-dots">
                      <span className="dot dot--red" />
                      <span className="dot dot--yellow" />
                      <span className="dot dot--green" />
                    </div>
                    <span className="studio-canvas-url">app.salesforce.com/lightning/r/Opportunity/8842/view</span>
                  </div>

                  {/* Interactive Mock Container */}
                  <div className="studio-mock-viewport">
                    <div className="proto-ai-widget">
                      <div className="proto-widget-header">
                        <div className="proto-widget-title-row">
                          <Sparkles size={16} className="text-violet" />
                          <strong>{asset.wireframe?.title || '✦ Prepare 1-Click Client Meeting Briefing'}</strong>
                        </div>
                        <span className="proto-widget-badge">
                          {asset.wireframe?.badge || 'CONTEXT DETECTED'}
                        </span>
                      </div>

                      <p className="proto-widget-subtitle">
                        {asset.wireframe?.subtitle || 'Contoso Enterprise Deal · Active Opportunity'}
                      </p>

                      {/* Context Pills */}
                      <div className="proto-context-pills">
                        {(asset.wireframe?.contextPills || [
                          '✓ CRM Opportunity ($240k)',
                          '✓ 3 Meeting Transcripts',
                          '✓ 4 Email Threads',
                        ]).map((pill: string, pIdx: number) => (
                          <span key={pIdx} className="proto-context-pill">
                            {pill}
                          </span>
                        ))}
                      </div>

                      {/* Action Options */}
                      <div className="proto-action-list">
                        {(asset.wireframe?.actionOptions || [
                          '📋 1-Click Executive Account Summary',
                          '⚠️ Identify Key Deal Blockers & Risks',
                          '💡 Generate High-Impact Discovery Questions',
                        ]).map((opt: string, oIdx: number) => (
                          <button
                            key={oIdx}
                            type="button"
                            className={`proto-action-btn ${
                              selectedMockOption === oIdx ? 'proto-action-btn--selected' : ''
                            }`}
                            onClick={() => setSelectedMockOption(oIdx)}
                          >
                            <span>{opt}</span>
                            {selectedMockOption === oIdx && <CheckCircle2 size={16} className="text-emerald" />}
                          </button>
                        ))}
                      </div>

                      {/* CTA Button */}
                      <div className="proto-widget-footer">
                        <button
                          type="button"
                          className="proto-cta-button"
                          onClick={() => setIsGeneratedPreviewVisible(!isGeneratedPreviewVisible)}
                        >
                          <span>{asset.wireframe?.ctaText || 'Generate Instant Briefing →'}</span>
                        </button>
                      </div>

                      {/* Generated Output Preview */}
                      {isGeneratedPreviewVisible && (
                        <div className="proto-generated-output-box">
                          <div className="proto-output-tag">
                            <ShieldCheck size={14} className="text-emerald" />
                            <strong>100% Sourced from Salesforce CRM & Outlook Transcript</strong>
                          </div>
                          <p>
                            {asset.wireframe?.previewSnippet ||
                              'Executive Summary: Contoso is migrating 1,200 seats in Q3. Key decision maker requested confirmation on SLA terms by Thursday.'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BEHAVIORAL BLUEPRINT & JOURNEY */}
          {activeTab === 'blueprint' && (
            <div className="modal-panel">
              <div className="panel-kicker">BEHAVIORAL REASONING & JOURNEY MAPPING</div>
              <h4 className="panel-title">Why This Intervention Was Selected</h4>
              <p className="panel-description">
                AdoptIQ connects raw behavioral evidence directly to psychological mechanisms and targeted UX interventions.
              </p>

              {/* 5-Step Why Recommended Chain */}
              <div className="why-recommended-flow-card">
                <div className="flow-step-item">
                  <span className="flow-step-kicker">1. OBSERVED EVIDENCE</span>
                  <p>{chain.observedEvidence}</p>
                </div>
                <div className="flow-arrow-divider">↓</div>
                <div className="flow-step-item">
                  <span className="flow-step-kicker">2. BEHAVIORAL ROOT CAUSE</span>
                  <p>{chain.behavioralRootCause}</p>
                </div>
                <div className="flow-arrow-divider">↓</div>
                <div className="flow-step-item">
                  <span className="flow-step-kicker">3. ADOPT STAGE FOCUS</span>
                  <p><strong>{chain.adoptStage}</strong></p>
                </div>
                <div className="flow-arrow-divider">↓</div>
                <div className="flow-step-item">
                  <span className="flow-step-kicker">4. TARGET DESIRED BEHAVIOR</span>
                  <p>{chain.targetBehavior}</p>
                </div>
                <div className="flow-arrow-divider">↓</div>
                <div className="flow-step-item flow-step-item--highlight">
                  <span className="flow-step-kicker">5. CHOSEN INTERVENTION</span>
                  <p><strong>{chain.chosenIntervention}</strong></p>
                </div>
              </div>

              <div className="rollout-roadmap">
                <h5>End-to-End User Experience Journey</h5>
                {((asset.userJourneySteps || (asset.journeySteps ? asset.journeySteps.map((s: any) => typeof s === 'string' ? s : `${s.title}: ${s.description}`) : [])) || []).map((step: string, idx: number) => (
                  <div key={idx} className="roadmap-step">
                    <span className="step-num">0{idx + 1}</span>
                    <p>{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MEASUREMENT PLAN */}
          {activeTab === 'measurement' && (
            <div className="modal-panel">
              <div className="panel-kicker">EXPERIMENTATION & VALIDATION DESIGN</div>
              <h4 className="panel-title">Measurement & Evaluation Architecture</h4>
              <p className="panel-description">
                Quantify behavioral shift with leading and lagging indicators rather than simple vanity clicks.
              </p>

              <div className="spec-grid">
                <div className="spec-box">
                  <span className="spec-label">Primary Success Metric</span>
                  <strong className="spec-value text-emerald">{measurement.primarySuccessMetric || measurement.primaryMetric?.name || 'Task completion'}</strong>
                </div>
                <div className="spec-box">
                  <span className="spec-label">Target Habituation Metric</span>
                  <strong className="spec-value text-blue">{measurement.behavioralMetric || 'Repeat usage'}</strong>
                </div>
                <div className="spec-box">
                  <span className="spec-label">Lagging Cohort Metric</span>
                  <strong className="spec-value">{measurement.laggingMetric || 'WAU retention'}</strong>
                </div>
                <div className="spec-box">
                  <span className="spec-label">Implementation Effort</span>
                  <strong className="spec-value">{currentInitiative.effort} Effort</strong>
                </div>
              </div>

              <div className="metrics-detail-block">
                <h5>Leading Behavioral Indicators (Week 1–2)</h5>
                <ul className="styled-bullet-list">
                  {(measurement.leadingIndicators || []).map((item: string, idx: number) => (
                    <li key={idx}>
                      <CheckCircle2 size={14} className="text-emerald" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <h5 style={{ marginTop: '16px' }}>Guardrail Metrics (Protect Quality & Retention)</h5>
                <ul className="styled-bullet-list">
                  {(measurement.guardrailMetrics || []).map((item: string, idx: number) => (
                    <li key={idx}>
                      <ShieldCheck size={14} className="text-blue" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 4: PROMPT & NUDGE SPECS */}
          {activeTab === 'recipes' && (
            <div className="modal-panel">
              <div className="panel-kicker">PROMPT RECIPES & NUDGE SPECIFICATIONS</div>
              <h4 className="panel-title">Scaffolding Templates & Context Triggers</h4>

              {asset.promptRecipes && asset.promptRecipes.length > 0 ? (
                <div className="recipes-spec-list">
                  {asset.promptRecipes.map((r: any, idx: number) => (
                    <div key={idx} className="recipe-spec-card">
                      <div className="recipe-spec-header">
                        <strong>Task: {r.task}</strong>
                        <span className="recipe-spec-tag">Verified Template</span>
                      </div>
                      <div className="code-box">
                        <pre>{r.prompt}</pre>
                      </div>
                      <span className="recipe-spec-notes">Trigger Logic: {r.variableNotes}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="nudge-card">
                  <h4>Contextual In-Workflow Nudge</h4>
                  <p>Triggered when user cursor stalls on open input field for &gt; 6 seconds without typing.</p>
                  <div className="code-box">
                    <pre>{`// Nudge event dispatcher
emitNudge({
  trigger: 'blank_canvas_dwell',
  timeoutMs: 6000,
  recommendedAction: '${currentInitiative.title}'
});`}</pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="btn-secondary" onClick={() => handleCopy(JSON.stringify(currentInitiative, null, 2))}>
            {copied ? <Check size={16} className="text-emerald" /> : <Copy size={16} />}
            <span>{copied ? 'Copied Specification' : 'Copy Spec JSON'}</span>
          </button>
          <button className="btn-primary-glow" onClick={handleDownload}>
            <Download size={16} />
            <span>Download Solution Pack (.md)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
