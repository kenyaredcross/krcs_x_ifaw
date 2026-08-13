import { useState } from 'react';

interface HeroProps {
  onEnter: (org: string) => void;
  frappeUser?: { name: string; email: string };
}

const ORGS = [
  'KRCS – DRR',
  'KRCS – MEAL',
  'KRCS – HNSS',
  'KRCS – DMOPs',
  'KRCS – RPCs',
  'IFAW',
  'Other',
];

export const Hero = ({ onEnter, frappeUser }: HeroProps) => {
  const [org, setOrg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!org) return;
    onEnter(org);
  };

  return (
    <div className="hero">
      <div className="hero-bg"></div>
      <div className="hero-content">
        <div className="org-badges">
          <span className="badge badge-krcs">KRCS</span>
          <span className="badge-sep"></span>
          <span className="badge badge-ifaw">IFAW</span>
        </div>
        <h1 className="hero-title">
          One <em>Health</em>
          <br />
          Ideation
        </h1>
        <p className="hero-subtitle">Mara · Amboseli · Wildlife Corridors</p>
        <p className="hero-desc">
          A shared space for KRCS and IFAW technical teams to collaboratively map
          challenges, drivers, and interventions for our joint One Health programme.
        </p>

        <form className="session-panel" onSubmit={handleSubmit}>
          <div className="session-label">Join the shared workspace</div>

          {frappeUser && (
            <div style={{
              padding: '0.75rem 1rem',
              background: 'rgba(28,40,32,0.06)',
              borderRadius: '6px',
              marginBottom: '1rem',
              fontSize: '0.88rem',
              color: 'var(--deep)',
            }}>
              Signed in as <strong>{frappeUser.name}</strong>
              <span style={{ opacity: 0.6, marginLeft: '0.4rem' }}>({frappeUser.email})</span>
            </div>
          )}

          <div className="input-group">
            <label>Organisation</label>
            <select value={org} onChange={(e) => setOrg(e.target.value)}>
              <option value="">Select…</option>
              {ORGS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <button type="submit" className="btn-enter" disabled={!org}>
            Enter Workspace →
          </button>
        </form>
      </div>
    </div>
  );
};
