import { Topbar } from '../components/Topbar';
import { SummaryPanel } from '../components/SummaryPanel';
import { CATEGORIES } from '../constants/categories';
import type { UserInfo } from '../types';

interface DashboardPageProps {
  userInfo: UserInfo;
  sessionCode: string;
  showSummary: boolean;
  onOpenSummary: () => void;
  onCloseSummary: () => void;
  onNavigateToCategory: (index: number) => void;
}

export const DashboardPage = ({
  userInfo,
  sessionCode,
  showSummary,
  onOpenSummary,
  onCloseSummary,
  onNavigateToCategory
}: DashboardPageProps) => {
  return (
    <div className="app active">
      <Topbar userInfo={userInfo} onViewSummary={onOpenSummary} />

      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard Overview</h1>
        </div>

        <div className="dashboard-grid">
          {CATEGORIES.map((category, index) => (
            <div
              key={category.id}
              className="dashboard-card"
              onClick={() => onNavigateToCategory(index)}
            >
              <div className="dashboard-card-header">
                <div
                  className="dashboard-icon"
                  style={{
                    background: `linear-gradient(135deg, ${category.color}22, ${category.color}11)`,
                    border: `2px solid ${category.color}33`,
                    color: category.color
                  }}
                >
                  {category.icon}
                </div>
                <div>
                  <div className="dashboard-card-num">{category.num}</div>
                  <div className="dashboard-card-title">{category.title}</div>
                </div>
              </div>

              <div className="dashboard-card-content">
                <div className="dashboard-stat">
                  <span className="stat-label">Sub-components</span>
                  <span className="stat-value">{category.subs.length}</span>
                </div>
              </div>

              <div className="dashboard-card-footer">
                <span>View details →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SummaryPanel
        categories={CATEGORIES}
        sessionCode={sessionCode}
        isOpen={showSummary}
        onClose={onCloseSummary}
      />
    </div>
  );
};
