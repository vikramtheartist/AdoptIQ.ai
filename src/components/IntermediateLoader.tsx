import React from 'react';
import { CanvasSiriWave, WaveState } from './CanvasSiriWave';

interface IntermediateLoaderProps {
  phaseIndex: number;
  waveState?: WaveState;
}

const analysisPhases = [
  'Ingesting behavioral telemetry signals...',
  'Evaluating 5-stage ADOPT drop-off cliffs...',
  'Deconstructing multi-signal root causes...',
  'Mapping targeted initiatives from ADOPT Playbook...',
  'Calibrating executive trajectory and ROI...',
];

const pillLabels = [
  'Ingesting adoption signals',
  'Evaluating behavioral funnels',
  'Deconstructing root causes',
  'Mapping targeted initiatives',
  'Synthesizing executive brief',
];

export function IntermediateLoader({ phaseIndex, waveState = 'analyzing' }: IntermediateLoaderProps) {
  const currentPillText = pillLabels[phaseIndex % pillLabels.length];

  return (
    <section className="intermediate-loader-page" aria-live="polite">
      {/* Background Decorative Orbital Ring & Satellite Dots */}
      <div className="loader-ambient-orbit" aria-hidden="true">
        <div className="loader-orbit-ring" />
        <span className="loader-satellite loader-satellite--top" />
        <span className="loader-satellite loader-satellite--bottom" />
        <span className="loader-satellite loader-satellite--right" />
      </div>

      {/* Centered Layered Flowing Wave Canvas */}
      <div className="loader-wave-wrapper">
        <CanvasSiriWave state={waveState} activity={1.5} />
      </div>

      {/* Floating Center Card / Dark Pill & Subtext */}
      <div className="loader-center-content">
        <div className="loader-dark-pill">
          <span className="loader-pill-dot" />
          <span className="loader-pill-text">{currentPillText}</span>
        </div>

        <p className="loader-subtext">
          The AI engine is synthesizing your signal into concrete ADOPT initiatives.
        </p>

        <div className="loader-progress-track">
          <div
            className="loader-progress-fill"
            style={{ width: `${Math.min(100, (phaseIndex + 1) * 22)}%` }}
          />
        </div>
      </div>

      {/* Minimal Bottom Footer */}
      <footer className="loader-footer">
        <div className="loader-footer-left">ADOPT Framework Engine</div>
        <div className="loader-footer-center">
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
        <div className="loader-footer-right">© 2026</div>
      </footer>
    </section>
  );
}
