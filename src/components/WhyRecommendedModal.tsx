import React from 'react';
import { X, Sparkles, ArrowRight, CheckCircle2, TrendingUp, ShieldAlert, Target } from 'lucide-react';

interface WhyRecommendedModalProps {
  isOpen: boolean;
  onClose: () => void;
  initiative: any | null;
}

export function WhyRecommendedModal({ isOpen, onClose, initiative }: WhyRecommendedModalProps) {
  if (!isOpen || !initiative) return null;

  const chain = initiative.whyRecommendedChain || {
    observedEvidence: initiative.whyThisFirst || 'High task abandonment during output validation and prompt iteration.',
    behavioralRootCause: initiative.rootCauseBadge || 'Cognitive verification fatigue and blank-canvas hesitation.',
    adoptStage: initiative.movesStage || (initiative.targetedStages && initiative.targetedStages[0]) || 'PROFICIENT',
    targetBehavior: initiative.behaviorToChange || 'Move from manual trial fallback to confident, habitual workflow completion.',
    chosenIntervention: initiative.title || 'Automated Task Support & Scaffolding',
  };

  const metric = initiative.measurementPlan?.primaryMetric?.name || initiative.measurementPlan?.primarySuccessMetric || initiative.successMetric || 'First-Attempt Task Completion Rate (> 80%)';

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content modal-content--wide" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header__left">
            <div className="modal-badge">
              <Sparkles size={14} />
              <span>CAUSAL REASONING CHAIN</span>
            </div>
            <h3>Why Recommended: {initiative.title}</h3>
            <p className="modal-subtitle">
              How AdoptIQ mapped from raw telemetry to this specific UX intervention.
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Body: 5-Step Causal Reasoning Chain */}
        <div className="modal-body">
          <div className="causal-chain-timeline">
            {/* Step 1: Observed Evidence */}
            <div className="chain-step-card">
              <div className="chain-step-badge">1. OBSERVED EVIDENCE</div>
              <p className="chain-step-text">{chain.observedEvidence}</p>
            </div>

            <div className="chain-arrow-separator">↓</div>

            {/* Step 2: Behavioral Root Cause */}
            <div className="chain-step-card">
              <div className="chain-step-badge">2. BEHAVIORAL MECHANISM</div>
              <p className="chain-step-text">{chain.behavioralRootCause}</p>
            </div>

            <div className="chain-arrow-separator">↓</div>

            {/* Step 3: ADOPT Framework Bottleneck */}
            <div className="chain-step-card">
              <div className="chain-step-badge">3. ADOPT STAGE BOTTLENECK</div>
              <p className="chain-step-text">
                Targeting <strong>{chain.adoptStage}</strong> stage where habituation breaks.
              </p>
            </div>

            <div className="chain-arrow-separator">↓</div>

            {/* Step 4: Target Behavior Change */}
            <div className="chain-step-card">
              <div className="chain-step-badge">4. BEHAVIORAL OBJECTIVE</div>
              <p className="chain-step-text">{chain.targetBehavior}</p>
            </div>

            <div className="chain-arrow-separator">↓</div>

            {/* Step 5: Chosen Playbook Intervention */}
            <div className="chain-step-card chain-step-card--highlight">
              <div className="chain-step-badge chain-step-badge--primary">5. SELECTED INTERVENTION</div>
              <h4 style={{ margin: '4px 0 6px', fontSize: '14px', color: '#1e1b4b' }}>
                {chain.chosenIntervention}
              </h4>
              <p className="chain-step-text" style={{ color: '#4338ca' }}>
                Primary Success Metric: <strong>{metric}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-modal-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
