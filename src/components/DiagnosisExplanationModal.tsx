import React from 'react';
import { X, Sparkles, ShieldCheck, CheckCircle2, AlertCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { ADOPT_META } from '../services/behavioralEngine';

interface DiagnosisExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  primaryDiagnosis: any;
  context?: any;
  signals?: any[];
}

export function DiagnosisExplanationModal({
  isOpen,
  onClose,
  primaryDiagnosis,
  context,
  signals = [],
}: DiagnosisExplanationModalProps) {
  if (!isOpen || !primaryDiagnosis) return null;

  const stageKey = (primaryDiagnosis.primaryStage || 'PROFICIENT').toUpperCase();
  const meta = ADOPT_META[stageKey as keyof typeof ADOPT_META] || {
    letter: 'P',
    name: 'Proficient',
    question: 'Can users reliably achieve repeatable task success?',
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content modal-content--wide" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header__left">
            <div className="modal-badge">
              <Sparkles size={14} />
              <span>DIAGNOSTIC AUDIT & BEHAVIORAL EXPLANATION</span>
            </div>
            <h3>Why This Diagnosis: {primaryDiagnosis.title}</h3>
            <p className="modal-subtitle">
              Detailed audit trail showing how observable signals led to isolating the{' '}
              <strong>{meta.name} stage bottleneck</strong>.
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Executive Summary Card */}
          <div className="diagnosis-audit-hero">
            <div className="audit-hero-header">
              <span className="audit-stage-pill">
                Primary Stage: <strong>{meta.letter} · {meta.name}</strong>
              </span>
              <span className="audit-confidence-badge">
                Confidence: {primaryDiagnosis.confidenceScore || 92}% ({primaryDiagnosis.confidenceLevel || 'Strong'})
              </span>
            </div>
            <p className="audit-summary-text">{primaryDiagnosis.summary}</p>

            {primaryDiagnosis.behavioralBarrier && (
              <div className="audit-barrier-box">
                <span className="audit-barrier-label">IDENTIFIED USER MINDSET:</span>
                <p className="audit-barrier-quote">"{primaryDiagnosis.behavioralBarrier}"</p>
              </div>
            )}
          </div>

          {/* 3-Column Diagnostic Logic Grid */}
          <div className="diagnosis-audit-grid">
            {/* 1. Supporting Signals */}
            <div className="audit-grid-column">
              <div className="audit-col-header">
                <CheckCircle2 size={16} className="text-emerald" />
                <h4>Observed Telemetry Signals</h4>
              </div>
              <ul className="audit-list">
                {(primaryDiagnosis.supportingEvidence || signals || []).slice(0, 4).map((sig: any, idx: number) => {
                  const text = typeof sig === 'string' ? sig : sig.label ? `${sig.label}: ${sig.detail}` : sig.title;
                  return (
                    <li key={idx} className="audit-list-item">
                      <span className="audit-item-dot" />
                      <span>{text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* 2. Competing Hypotheses Evaluated */}
            <div className="audit-grid-column">
              <div className="audit-col-header">
                <ShieldCheck size={16} className="text-violet" />
                <h4>Competing Stages Evaluated</h4>
              </div>
              <div className="competing-stages-box">
                <p style={{ fontSize: '12.5px', color: '#475569', margin: '0 0 8px' }}>
                  The diagnostic critic checked upstream & downstream explanations:
                </p>
                {(primaryDiagnosis.competingStagesConsidered || [
                  'AWARE stage ruled out: 94% awareness confirmed with high top-of-funnel reach.',
                  'DESIRE stage ruled out: 62% trial initiation proves initial motivation was healthy.',
                  'OPEN stage evaluated: First-session setup completed, but drop-off occurs on repeat usage.',
                ]).map((note: string, nIdx: number) => (
                  <div key={nIdx} className="competing-note">
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Actionable Remediations */}
            <div className="audit-grid-column">
              <div className="audit-col-header">
                <AlertCircle size={16} className="text-amber" />
                <h4>Root Cause Remediation Path</h4>
              </div>
              <div className="audit-remediation-box">
                <p style={{ fontSize: '12.5px', color: '#334155', lineHeight: 1.5, margin: 0 }}>
                  Because drop-off occurs during daily execution rather than initial trial, interventions must focus on{' '}
                  <strong>automated workflow recipes, inline validation badges, and habit reinforcement</strong> rather than marketing or generic training webinars.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-modal-primary" onClick={onClose}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
