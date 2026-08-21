import React from 'react';

export function SkeletonDashboard() {
  return (
    <div className="skeleton-dashboard" aria-label="Loading diagnostic matrix">
      {/* Zone 1 Header Skeleton */}
      <div className="skeleton-header">
        <div className="skeleton-line skeleton-line--eyebrow" />
        <div className="skeleton-line skeleton-line--title" />
        <div className="skeleton-line skeleton-line--meta" />
      </div>

      {/* Zone 1 Adoption Health by Stage Skeleton (5 columns) */}
      <div className="skeleton-funnel-grid">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`skeleton-card skeleton-stage-card ${i === 4 ? 'skeleton-card--bottleneck' : ''}`}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#e2e8f0' }} />
                <div className="skeleton-line" style={{ width: '65px', height: '14px' }} />
              </div>
              <div className="skeleton-line" style={{ width: '36px', height: '16px' }} />
            </div>
            <div className="skeleton-line skeleton-line--body" style={{ marginTop: '6px' }} />
            <div className="skeleton-line skeleton-line--body-short" />
          </div>
        ))}
      </div>

      {/* Zone 2 Core Analysis Split (3 columns: 30%, 45%, 25%) */}
      <div className="skeleton-zone2-grid">
        {/* Left: Evidence (30%) */}
        <div className="skeleton-column">
          {/* AI Summary Skeleton Card */}
          <div className="skeleton-card" style={{ padding: '16px 18px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="skeleton-line" style={{ width: '80px', height: '18px', borderRadius: '999px' }} />
              <div className="skeleton-line" style={{ width: '70px', height: '18px', borderRadius: '999px' }} />
            </div>
            <div className="skeleton-line skeleton-line--card-title" style={{ width: '75%' }} />
            <div className="skeleton-line skeleton-line--body" />
            <div className="skeleton-line" style={{ width: '90%', height: '24px', borderRadius: '10px', marginTop: '4px' }} />
          </div>

          <div className="skeleton-section-header">
            <div className="skeleton-line skeleton-line--section-title" />
            <div className="skeleton-line" style={{ width: '60px', height: '20px', borderRadius: '999px' }} />
          </div>
          <div className="skeleton-alerts-stack" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2, 3, 4].map((i) => {
              const bgTints = ['#edf5ff', '#fffbeb', '#fef2f2', '#fffbeb'];
              const iconColors = ['#2563eb', '#f59e0b', '#ef4444', '#f59e0b'];
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    padding: '14px 16px',
                    borderRadius: '18px',
                    background: bgTints[(i - 1) % bgTints.length],
                    border: '1.5px solid rgba(0,0,0,0.05)',
                  }}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: iconColors[(i - 1) % iconColors.length], flexShrink: 0, opacity: 0.8 }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '2px' }}>
                    <div className="skeleton-line" style={{ width: '65%', height: '14px' }} />
                    <div className="skeleton-line" style={{ width: '90%', height: '11px' }} />
                  </div>
                  <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: '#cbd5e1', opacity: 0.5 }} />
                </div>
              );
            })}
            <div style={{ height: '38px', borderRadius: '12px', background: '#faf8ff', border: '1px solid #ede9fe' }} />
          </div>
        </div>

        {/* Center: Initiatives (45%) */}
        <div className="skeleton-column">
          <div className="skeleton-section-header">
            <div className="skeleton-line skeleton-line--section-title" />
            <div className="skeleton-line skeleton-line--subtext" style={{ width: '40%' }} />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-card skeleton-initiative-card">
              <div className="skeleton-line skeleton-line--card-title" style={{ width: '70%' }} />
              <div className="skeleton-line skeleton-line--body" />
              <div className="skeleton-line skeleton-line--body-short" />
              <div className="skeleton-initiative-footer">
                <div className="skeleton-progress-bar" />
                <div className="skeleton-btn-ghost" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Static Outcomes Section Skeleton */}
      <div className="skeleton-card" style={{ padding: '24px 28px', borderRadius: '24px', marginTop: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div className="skeleton-line" style={{ width: '160px', height: '14px', borderRadius: '999px' }} />
            <div className="skeleton-line" style={{ width: '220px', height: '18px' }} />
          </div>
          <div className="skeleton-line" style={{ width: '150px', height: '34px', borderRadius: '999px' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '16px' }}>
          {[1, 2, 3, 4].map((k) => (
            <div key={k} style={{ background: '#f8fafc', padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="skeleton-line" style={{ width: '60%', height: '12px' }} />
              <div className="skeleton-line" style={{ width: '50%', height: '22px' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
