import React from 'react';
import { X, Activity, ShieldAlert, CheckCircle2, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';
import { StageHealthItem, RecommendationInitiative as EnhancedInitiative, ADOPT_META } from '../services/behavioralEngine';

interface StageScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  stageItem: StageHealthItem | null;
  initiatives: EnhancedInitiative[];
  onSelectInitiative?: (init: EnhancedInitiative) => void;
}

export function StageScoreModal({
  isOpen,
  onClose,
  stageItem,
  initiatives,
  onSelectInitiative,
}: StageScoreModalProps) {
  if (!isOpen || !stageItem) return null;

  const targetingInitiatives = initiatives.filter((init) =>
    (init.targetedStages || []).map((s: string) => s.toUpperCase()).includes(stageItem.stage.toUpperCase())
  );

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header__left">
            <div className="modal-badge">
              <Activity size={14} />
              <span>ADOPT STAGE DIAGNOSTIC BREAKDOWN</span>
            </div>
            <h3>
              {stageItem.stage} Stage Health Analysis
            </h3>
            <p className="modal-subtitle">{ADOPT_META[stageItem.stage]?.question || ''}</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Status & Score Banner */}
          <div className="stage-score-hero-banner">
            <div className="stage-score-number-pod">
              <span className="score-pod-label">Stage Health</span>
              <strong className="score-pod-val">{stageItem.percentageString}</strong>
            </div>
            <div className="stage-score-status-info">
              <div className="stage-status-row">
                <span className={`status-pill status-pill--${stageItem.status}`}>
                  {stageItem.status.replace('_', ' ').toUpperCase()}
                </span>
                {stageItem.isBottleneck && (
                  <span className="bottleneck-tag">🚨 PRIMARY BOTTLENECK</span>
                )}
                {stageItem.isSecondary && (
                  <span className="secondary-bottleneck-tag">⚠️ SECONDARY BOTTLENECK</span>
                )}
              </div>
              <p className="stage-score-insight-copy">{stageItem.insightText}</p>
            </div>
          </div>

          {/* Behavioral Interpretation */}
          <div className="modal-panel">
            <div className="panel-kicker">BEHAVIORAL INTERPRETATION</div>
            <p className="panel-description">{stageItem.behavioralInterpretation}</p>
          </div>

          {/* Evidence Considered */}
          <div className="modal-panel">
            <div className="panel-kicker">EVIDENCE & TELEMETRY SIGNALS CONSIDERED</div>
            <ul className="styled-bullet-list">
              {stageItem.signalsSupporting && stageItem.signalsSupporting.length > 0 ? (
                stageItem.signalsSupporting.map((item, idx) => (
                  <li key={idx}>
                    <CheckCircle2 size={15} className="text-emerald" />
                    <span>{item.name}</span>
                  </li>
                ))
              ) : (
                <li>
                  <HelpCircle size={15} className="text-slate-400" />
                  <span>No direct telemetry signals supplied for this stage.</span>
                </li>
              )}
            </ul>
          </div>

          {/* Metrics Considered */}
          <div className="modal-panel">
            <div className="panel-kicker">METRICS BENCHMARKED IN CALCULATION</div>
            <div className="metrics-tags-row">
              {stageItem.suggestedMetrics?.map((m, idx) => (
                <span key={idx} className="metric-chip">
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Targeting Recommended Initiatives */}
          {targetingInitiatives.length > 0 && (
            <div className="modal-panel">
              <div className="panel-kicker">RECOMMENDED REMEDIATIONS TARGETING THIS STAGE</div>
              <div className="stage-interventions-list">
                {targetingInitiatives.map((init, iIdx) => (
                  <div key={iIdx} className="stage-intervention-card">
                    <div className="stage-intervention-card__left">
                      <span className="priority-pill-badge">{init.priorityLabel}</span>
                      <strong>{init.title}</strong>
                      <p>{init.shortDescription}</p>
                    </div>
                    {onSelectInitiative && (
                      <button
                        type="button"
                        className="btn-create-solution-glass"
                        onClick={() => {
                          onSelectInitiative(init);
                          onClose();
                        }}
                      >
                        <Sparkles size={13} />
                        <span>Create Solution</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
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
