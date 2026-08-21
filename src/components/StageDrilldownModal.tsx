import React from 'react';
import { X, Activity, ShieldCheck, AlertTriangle, ArrowRight, HelpCircle, CheckCircle2 } from 'lucide-react';
import { ADOPT_META, StageHealthItem, AdoptStageKey, SignalItem } from '../services/behavioralEngine';
import { getPlaybookForStage } from '../lib/adoptPlaybookRegistry';

interface StageDrilldownModalProps {
  isOpen: boolean;
  onClose: () => void;
  stageItem: StageHealthItem | any | null;
}

export function StageDrilldownModal({ isOpen, onClose, stageItem }: StageDrilldownModalProps) {
  if (!isOpen || !stageItem) return null;

  const stageKey = (stageItem.stage || 'PROFICIENT').toUpperCase() as AdoptStageKey;
  const officialPlays = getPlaybookForStage(stageKey);
  const meta = ADOPT_META[stageKey as keyof typeof ADOPT_META] || {
    letter: stageKey[0] || 'P',
    name: stageItem.name || stageItem.stage,
    question: 'How effectively are users navigating this stage?',
    healthyMeaning: 'Users progress smoothly through this stage.',
    unhealthyMeaning: 'Users encounter friction or drop-off at this stage.',
    primaryMetrics: ['Completion Rate', 'Drop-off Rate', 'Time Spent'],
    candidateInterventions: officialPlays.length > 0 ? Array.from(officialPlays) : ['Automated Guidance', 'Contextual Help'],
  };

  const percentage = stageItem.percentageString || stageItem.percentageDisplay || (stageItem.score ? `${stageItem.score}%` : 'N/A');
  const roleLabel = stageItem.roleLabel || stageItem.role || (stageItem.isBottleneck ? 'PRIMARY BOTTLENECK' : 'HEALTHY');

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content modal-content--wide" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header__left">
            <div className="modal-badge">
              <Activity size={14} />
              <span>ADOPT STAGE DRILLDOWN · {stageKey}</span>
            </div>
            <h3>
              {meta.name} Stage Health Analysis ({percentage})
            </h3>
            <p className="modal-subtitle">{stageItem.stageQuestion || meta.question}</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Health Score & Role Banner */}
          <div className="stage-score-hero-banner">
            <div className="stage-score-number-pod">
              <span className="score-pod-label">Stage Health</span>
              <strong className="score-pod-val" style={{ color: stageItem.isBottleneck ? '#ea580c' : '#16a34a' }}>
                {percentage}
              </strong>
            </div>
            <div className="stage-score-status-info">
              <div className="stage-status-row">
                <span className={`status-pill ${stageItem.isBottleneck ? 'status-pill--critical' : 'status-pill--healthy'}`}>
                  {roleLabel}
                </span>
                {stageItem.isBottleneck && (
                  <span className="bottleneck-tag">🚨 PRIMARY BOTTLENECK</span>
                )}
              </div>
              <p className="stage-status-desc">
                {stageItem.specificMeaning || stageItem.insightText || meta.question}
              </p>
            </div>
          </div>

          {/* 2-Column Detail Grid */}
          <div className="stage-score-grid">
            {/* Left: Behavioral Mechanism */}
            <div className="stage-score-column">
              <div className="score-col-header">
                <ShieldCheck size={16} className="text-violet" />
                <h4>Behavioral Interpretation</h4>
              </div>
              <div className="evidence-summary-box">
                <p style={{ margin: '0 0 10px', fontSize: '13px', lineHeight: 1.5, color: '#334155' }}>
                  {stageItem.behavioralInterpretation || (stageItem.isBottleneck
                    ? meta.failureName
                    : meta.question)}
                </p>
                {stageItem.signalsSupporting && stageItem.signalsSupporting.length > 0 && (
                  <ul className="evidence-points-list">
                    {stageItem.signalsSupporting.map((sig: SignalItem, idx: number) => (
                      <li key={idx}>
                        <CheckCircle2 size={13} className="text-emerald" />
                        <span>{sig.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Right: Metrics & Candidate Interventions */}
            <div className="stage-score-column">
              <div className="score-col-header">
                <HelpCircle size={16} className="text-blue" />
                <h4>Core ADOPT Mechanisms</h4>
              </div>
              <div className="metrics-considered-box">
                <div className="metric-chip-group">
                  {meta.coreMechanisms.map((play: string, pIdx: number) => (
                    <span key={pIdx} className="metric-tag-chip" style={{ background: '#f5f3ff', color: '#6d28d9', borderColor: '#ddd6fe' }}>
                      ✦ {play}
                    </span>
                  ))}
                </div>

                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Standard Telemetry Signals:
                  </span>
                  <div className="metric-chip-group" style={{ marginTop: '6px' }}>
                    {meta.standardMetrics.map((m: string, mIdx: number) => (
                      <span key={mIdx} className="metric-tag-chip">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="btn-modal-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
