import type { Category, SessionData } from '../types';
import { loadData } from '../utils/storage';

interface SummaryPanelProps {
  categories: Category[];
  sessionCode: string;
  isOpen: boolean;
  onClose: () => void;
}

export const SummaryPanel = ({ categories, sessionCode, isOpen, onClose }: SummaryPanelProps) => {
  const data = loadData(sessionCode);

  const downloadJSON = () => {
    const out: SessionData = {
      session: sessionCode,
      generated: new Date().toISOString(),
      data: {}
    };

    categories.forEach((cat) => {
      out.data[cat.title] = {};
      const catData = data[cat.id] || {};
      cat.subs.forEach((sub, si) => {
        if (catData[si]) {
          out.data[cat.title][sub] = catData[si];
        }
      });
    });

    const blob = new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `onehealth_${sessionCode}_${Date.now()}.json`;
    a.click();
  };

  const renderSummary = () => {
    const entries: React.JSX.Element[] = [];
    let totalEntries = 0;

    categories.forEach((cat) => {
      const catData = data[cat.id] || {};
      cat.subs.forEach((sub, si) => {
        const e = catData[si];
        if (e && (e.drivers || e.interventions || e.other)) {
          totalEntries++;
          entries.push(
            <div key={`${cat.id}-${si}`} className="summary-entry">
              <div className="summary-cat">
                {cat.icon} {cat.num} — {cat.title}
              </div>
              <div className="summary-sub">{sub}</div>
              {e.other && (
                <div className="summary-field">
                  <strong>Challenge:</strong> {e.other}
                </div>
              )}
              {e.drivers && (
                <div className="summary-field">
                  <strong>Drivers:</strong> {e.drivers}
                </div>
              )}
              {e.interventions && (
                <div className="summary-field">
                  <strong>Interventions:</strong> {e.interventions}
                </div>
              )}
              {e.levels && e.levels.length > 0 && (
                <div className="summary-field">
                  <strong>Levels:</strong> {e.levels.join(', ')}
                </div>
              )}
              {e.by && e.by.length > 0 && (
                <div className="summary-field">
                  <strong>Contributors:</strong> {e.by.join(', ')}
                </div>
              )}
            </div>
          );
        }
      });
    });

    if (totalEntries === 0) {
      return (
        <div className="empty-summary">
          No inputs recorded yet. Begin by selecting a problem category and filling in your
          contributions.
        </div>
      );
    }

    return (
      <>
        {entries}
        <button className="btn-download" onClick={downloadJSON}>
          ⬇ Download Session Data (JSON)
        </button>
      </>
    );
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="summary-panel open" onClick={handleBackdropClick}>
      <div className="summary-box">
        <div className="summary-header">
          <h3>Session Summary</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="summary-content">{renderSummary()}</div>
      </div>
    </div>
  );
};
