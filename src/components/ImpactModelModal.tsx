import React, { useState } from 'react';
import { X, TrendingUp, DollarSign, Users, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { AdoptIQDashboardData } from '../services/aiDiagnosis';

interface ImpactModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  dashboardData: AdoptIQDashboardData;
}

export function ImpactModelModal({ isOpen, onClose, dashboardData }: ImpactModelModalProps) {
  const [teamSeats, setTeamSeats] = useState(250);
  const [hourlyValue, setHourlyValue] = useState(85);

  if (!isOpen) return null;

  const hoursSavedPerWeek = Math.round(teamSeats * 2.4);
  const annualSavings = Math.round(hoursSavedPerWeek * 50 * hourlyValue);
  const formatCurrency = (val: number) => `$${val.toLocaleString()}`;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content modal-content--wide" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header__left">
            <div className="modal-badge">
              <TrendingUp size={14} />
              <span>BEHAVIORAL ROI & 90-DAY FORECAST SIMULATOR</span>
            </div>
            <h3>Enterprise Impact Model</h3>
            <p className="modal-subtitle">Projected business case extrapolation for {dashboardData.dashboardTitle}</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Top 4 KPI Metrics */}
          <div className="outcomes-summary-grid">
            {dashboardData.outcomes.map((outcome, idx) => (
              <div key={idx} className="outcome-highlight-card">
                <span className="outcome-highlight-label">{outcome.metricLabel}</span>
                <strong className="outcome-highlight-value">{outcome.projectedLift}</strong>
                <span className="outcome-highlight-timeline">90-Day Forecast · P90 Confidence</span>
              </div>
            ))}
          </div>

          {/* ROI Interactive Calculator Controls */}
          <div className="roi-calculator-container">
            <div className="roi-controls">
              <h4>Interactive Financial Modeling</h4>
              <p>Adjust your organization parameters to forecast measurable ARR risk mitigation and productivity gains:</p>

              <div className="roi-sliders-grid">
                <div className="slider-group">
                  <div className="slider-label-row">
                    <span>Target Active Seats:</span>
                    <strong>{teamSeats} users</strong>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="2500"
                    step="50"
                    value={teamSeats}
                    onChange={(e) => setTeamSeats(Number(e.target.value))}
                    className="roi-slider"
                  />
                </div>

                <div className="slider-group">
                  <div className="slider-label-row">
                    <span>Blended Hourly Cost:</span>
                    <strong>${hourlyValue}/hr</strong>
                  </div>
                  <input
                    type="range"
                    min="45"
                    max="250"
                    step="5"
                    value={hourlyValue}
                    onChange={(e) => setHourlyValue(Number(e.target.value))}
                    className="roi-slider"
                  />
                </div>
              </div>
            </div>

            <div className="roi-metrics-result">
              <div className="roi-stat-box">
                <span className="roi-stat-label">Estimated Annual Time Recaptured</span>
                <strong className="roi-stat-number">{hoursSavedPerWeek * 50} hours / yr</strong>
              </div>
              <div className="roi-stat-box roi-stat-box--primary">
                <span className="roi-stat-label">Projected Productivity Value Created</span>
                <strong className="roi-stat-number">{formatCurrency(annualSavings)} / yr</strong>
              </div>
            </div>
          </div>

          {/* Funnel Health Lift Comparison */}
          <div className="funnel-lift-comparison">
            <h5>Funnel Conversion: Baseline vs. With AdoptIQ Playbook</h5>
            <div className="funnel-bars-list">
              {dashboardData.healthScoresList.map((h, i) => {
                const scoreVal = h.score ?? 15;
                const targetScore = Math.min(100, scoreVal + (h.isBottleneck ? 34 : 12));
                return (
                  <div key={i} className="funnel-bar-row">
                    <span className="funnel-stage-name">{h.stage}</span>
                    <div className="funnel-bar-track">
                      <div
                        className={`funnel-bar-fill ${h.isBottleneck ? 'funnel-bar-fill--bottleneck' : ''}`}
                        style={{ width: `${scoreVal}%` }}
                      >
                        <span>Current: {h.percentageString}</span>
                      </div>
                    </div>
                    <span className="funnel-lift-target">
                      Target: {h.score !== null ? `${targetScore}%` : 'Benchmark'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            <span>Close Model</span>
          </button>
          <button className="btn-primary-glow" onClick={onClose}>
            <ShieldCheck size={16} />
            <span>Lock Strategic Targets</span>
          </button>
        </div>
      </div>
    </div>
  );
}
