import React, { useState } from 'react';
import { X, PlusCircle, HelpCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface StrengthenDiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
  missingEvidence?: any[];
  context?: any;
  onReDiagnoseWithEvidence: (newQuery: string) => void;
}

export function StrengthenDiagnosisModal({
  isOpen,
  onClose,
  missingEvidence = [],
  context,
  onReDiagnoseWithEvidence,
}: StrengthenDiagnosisModalProps) {
  const [customInput, setCustomInput] = useState('');

  if (!isOpen) return null;

  const defaultMissing = [
    {
      signalName: 'Day-7 and Day-30 Repeat Task Telemetry',
      rationale: 'Clarifies if users fail to return due to output distrust vs lack of recurring use cases.',
      suggestedValue: 'D7 repeat usage is 12%, and D30 repeat usage is 4%.',
    },
    {
      signalName: 'Output Acceptance & Edit Distance Data',
      rationale: 'Measures how much manual editing users perform before using AI output in daily work.',
      suggestedValue: 'Users rewrite 70% of generated content before inserting into CRM.',
    },
    {
      signalName: 'Top Performer Prompt Syntax Patterns',
      rationale: 'Determines if high WAU reps use different templates or prompt syntax structures.',
      suggestedValue: 'Top 5% reps use saved meeting prep prompt templates 4x per week.',
    },
  ];

  const evidenceItems = missingEvidence.length > 0 ? missingEvidence : defaultMissing;

  const handleAddSignal = (item: any) => {
    const textToAdd = item.suggestedValue || item.rationale || item.signalName;
    const base = context?.persona ? `For ${context.persona}: ` : '';
    const updatedQuery = `${base}${textToAdd}`;
    onClose();
    onReDiagnoseWithEvidence(updatedQuery);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    onClose();
    onReDiagnoseWithEvidence(customInput.trim());
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content modal-content--wide" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header__left">
            <div className="modal-badge">
              <PlusCircle size={14} />
              <span>STRENGTHEN DIAGNOSTIC CERTAINTY</span>
            </div>
            <h3>Add Observational Telemetry & Feedback</h3>
            <p className="modal-subtitle">
              Adding missing telemetry signals increases AI confidence and narrows down sub-workflow causes.
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#334155', margin: '0 0 10px' }}>
            Recommended Signals to Add:
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {evidenceItems.map((item: any, idx: number) => {
              const name = item.signalName || item.name || `Signal ${idx + 1}`;
              const rationale = item.rationale || item.whyItHelps || 'Increases diagnosis precision.';
              const suggested = item.suggestedValue || '';

              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    gap: '12px',
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block' }}>
                      + {name}
                    </strong>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{rationale}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddSignal(item)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      background: '#7c3aed',
                      color: '#ffffff',
                      fontSize: '12px',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      flexShrink: 0,
                    }}
                  >
                    <span>Add Signal</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Custom Input */}
          <form onSubmit={handleCustomSubmit} style={{ marginTop: '20px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#334155', margin: '0 0 8px' }}>
              Or type custom data / user quotes:
            </h4>
            <textarea
              rows={2}
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="e.g. In customer support surveys, 42% stated they don't trust the AI for client-facing notes..."
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                fontFamily: 'inherit',
                resize: 'none',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button
                type="submit"
                disabled={!customInput.trim()}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  background: customInput.trim() ? '#7c3aed' : '#cbd5e1',
                  color: '#ffffff',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: customInput.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                Re-diagnose with Signal
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-modal-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
