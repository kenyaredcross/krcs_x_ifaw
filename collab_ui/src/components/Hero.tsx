import { useState } from 'react';
import type { FormEvent } from 'react';
import type { UserInfo } from '../types';

interface HeroProps {
  onEnter: (userInfo: UserInfo) => void;
}

export const Hero = ({ onEnter }: HeroProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [org, setOrg] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (!email.trim()) return;
    if (!org) return;

    onEnter({
      name: name.trim(),
      email: email.trim(),
      org
    });
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
          <div className="session-label">Begin your session</div>

          <div className="input-group">
            <label>Your Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dr. Amina Wanjiru"
              autoComplete="off"
            />
          </div>

          <div className="input-group">
            <label>Your Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. amina.wanjiru@krcs.org"
              autoComplete="off"
            />
          </div>

          <div className="input-group">
            <label>Organisation</label>
            <select value={org} onChange={(e) => setOrg(e.target.value)}>
              <option value="">Select...</option>
              <option value="KRCS – DRR">KRCS – DRR</option>
              <option value="KRCS – MEAL">KRCS – MEAL</option>
              <option value="KRCS – HNSS">KRCS – HNSS</option>
              <option value="KRCS – DMOPs">KRCS – DMOPs</option>
              <option value="KRCS – RPCs">KRCS – RPCs</option>
              <option value="IFAW">IFAW</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button type="submit" className="btn-enter">
            Enter Workspace →
          </button>
        </form>
      </div>
    </div>
  );
};
