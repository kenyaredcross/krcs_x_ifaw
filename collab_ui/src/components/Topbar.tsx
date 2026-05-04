import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserInfo } from '../types';

interface TopbarProps {
  userInfo: UserInfo;
  onViewSummary: () => void;
}

export const Topbar = ({ userInfo, onViewSummary }: TopbarProps) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="topbar-title">
          One <span>Health</span> Ideation
        </div>
      </div>

      <button
        className="mobile-menu-toggle"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`topbar-right ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="user-chip">
          <span className="user-dot"></span>
          <span>
            {userInfo.name} · {userInfo.email} · {userInfo.org}
          </span>
        </div>
        <button className="btn-export" onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }}>
          Dashboard
        </button>
        <button className="btn-export" onClick={() => { navigate('/overview'); setMobileMenuOpen(false); }}>
          Overview
        </button>
        <button className="btn-export" onClick={() => { onViewSummary(); setMobileMenuOpen(false); }}>
          View Summary
        </button>
      </div>
    </div>
  );
};
