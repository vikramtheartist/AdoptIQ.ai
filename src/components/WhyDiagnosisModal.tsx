import React from 'react';
import { X, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';
import { PrimaryDiagnosisSynthesis as PrimaryDiagnosisData, RecommendationInitiative as EnhancedInitiative } from '../services/behavioralEngine';

interface WhyDiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
  diagnosis: PrimaryDiagnosisData;
  activeInitiative?: EnhancedInitiative | null;
}

export function WhyDiagnosisModal({
  isOpen,
  onClose,
  diagnosis,
  activeInitiative,
}: WhyDiagnosisModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header__left">
            <div className="modal-badge">
              <Sparkles size={14} />
              <span>BEHAVIORAL REASONING TRANSPARENCY</span>
            </div>
            <h3>
              {activeInitiative ? `Why "${activeInitiative.title}"?` : `Why "${diagnosis.title}"?`}
            </h3>
            <p className="modal-subtitle">
              Audit the AI evidence chain, confidence model, and rejected counter-hypotheses
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {activeInitiative ? (
            /* Initiative-Specific Why Chain */
            <div className="modal-panel">
              <div className="panel-kicker">5-STEP CAUSAL INTERVENTION CHAIN</div>
              <div className="why-recommended-flow-card">
                <div className="flow-step-item">
                  <span className="flow-step-kicker">1. OBSERVED EVIDENCE</span>
                  <p>{activeInitiative.whyRecommendedChain?.observedEvidence || activeInitiative.whyThis}</p>
                </div>
                <div className="flow-arrow-divider">↓</div>
                <div className="flow-step-item">
                  <span className="flow-step-kicker">2. BEHAVIORAL ROOT CAUSE</span>
                  <p>{activeInitiative.whyRecommendedChain?.behavioralRootCause || activeInitiative.behaviorToChange}</p>
                </div>
                <div className="flow-arrow-divider">↓</div>
                <div className="flow-step-item">
                  <span className="flow-step-kicker">3. ADOPT STAGE FOCUS</span>
                  <p><strong>{activeInitiative.whyRecommendedChain?.adoptStage || activeInitiative.targetedStages.join(', ')}</strong></p>
                </div>
                <div className="flow-arrow-divider">↓</div>
                <div className="flow-step-item">
                  <span className="flow-step-kicker">4. TARGETED DESIRED BEHAVIOR</span>
                  <p>{activeInitiative.whyRecommendedChain?.targetBehavior || activeInitiative.behavioralObjective}</p>
                </div>
                <div className="flow-arrow-divider">↓</div>
                <div className="flow-step-item flow-step-item--highlight">
                  <span className="flow-step-kicker">5. CHOSEN INTERVENTION</span>
                  <p><strong>{activeInitiative.whyRecommendedChain?.chosenIntervention || activeInitiative.title}</strong></p>
                </div>
              </div>
            </div>
          ) : (
            /* Global Diagnosis Reasoning */
            <>
              {/* Confidence Calculation */}
              <div className="modal-panel">
                <div className="panel-kicker">CONFIDENCE SCORE CALCULATION</div>
                <div className="confidence-calc-box">
                  <div className="confidence-score-badge-large">
                    <strong>{diagnosis.confidenceScore}%</strong>
                    <span>{diagnosis.confidenceLevel.toUpperCase()} CERTAINTY</span>
                  </div>
                  <ul className="styled-bullet-list">
                    {(diagnosis.confidenceReasons || []).map((r: string, idx: number) => (
                      <li key={idx}>
                        <ShieldCheck size={15} className="text-emerald" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Supporting Evidence */}
              <div className="modal-panel">
                <div className="panel-kicker">BEHAVIORAL SUMMARY & EVIDENCE</div>
                <p style={{ fontSize: '13px', lineHeight: 1.5, color: '#334155', margin: '0 0 12px' }}>
                  {diagnosis.summary}
                </p>
                {diagnosis.userQuote && (
                  <blockquote style={{ fontSize: '13px', fontStyle: 'italic', borderLeft: '3px solid #6366f1', paddingLeft: '10px', color: '#475569', margin: 0 }}>
                    "{diagnosis.userQuote}"
                  </blockquote>
                )}
              </div>

              {/* Competing Explanations Rejected */}
              {diagnosis.competingStagesEvaluated && diagnosis.competingStagesEvaluated.length > 0 && (
                <div className="modal-panel">
                  <div className="panel-kicker">COMPETING HYPOTHESES EVALUATED & DISPROVED</div>
                  <ul className="styled-bullet-list">
                    {diagnosis.competingStagesEvaluated.map((comp, idx: number) => (
                      <li key={idx}>
                        <AlertTriangle size={15} className="text-amber-500" />
                        <span><strong>{comp.stage} ({comp.probability}%):</strong> {comp.rejectionReason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
