import { useNavigate } from 'react-router-dom';
import type { UserInfo } from '../types';

interface TopbarProps {
  userInfo: UserInfo;
  onViewSummary: () => void;
}

export const Topbar = ({ userInfo, onViewSummary }: TopbarProps) => {
  const navigate = useNavigate();

  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="topbar-title">
          One <span>Health</span> Ideation
        </div>
      </div>
      <div className="topbar-right">
        <div className="user-chip">
          <span className="user-dot"></span>
          <span>
            {userInfo.name} · {userInfo.email} · {userInfo.org}
          </span>
        </div>
        <button className="btn-export" onClick={() => navigate('/dashboard')}>
          Dashboard
        </button>
        <button className="btn-export" onClick={() => navigate('/overview')}>
          Overview
        </button>
        <button className="btn-export" onClick={onViewSummary}>
          View Summary
        </button>
      </div>
    </div>
  );
};
