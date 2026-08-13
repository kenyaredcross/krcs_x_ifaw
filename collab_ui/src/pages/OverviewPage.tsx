import { useState, useEffect } from 'react';
import { Topbar } from '../components/Topbar';
import { CATEGORIES } from '../constants/categories';
import type { UserInfo, EntryData, StorageData } from '../types';

interface OverviewPageProps {
  userInfo: UserInfo;
  sessionCode: string;
  sessionData: StorageData;
  participantCount: number;
}

interface ContributionData {
  categoryTitle: string;
  categoryNum: string;
  categoryId: string;
  categoryColor: string;
  subTitle: string;
  entry: EntryData;
}

// Helper functions
const initials = (name: string): string => {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getOrgColor = (org: string): string => {
  const isKRCS = org.toLowerCase().includes('krcs') || org.toLowerCase().includes('red cross');
  const isIFAW = org.toLowerCase().includes('ifaw');

  if (isKRCS) return '#A32D2D';
  if (isIFAW) return '#185FA5';
  return '#2D5016'; // Default forest color
};

const getOrgPillColors = (org: string): { bg: string; color: string } => {
  const isKRCS = org.toLowerCase().includes('krcs') || org.toLowerCase().includes('red cross');
  const isIFAW = org.toLowerCase().includes('ifaw');

  if (isKRCS) return { bg: '#FCEBEB', color: '#A32D2D' };
  if (isIFAW) return { bg: '#E6F1FB', color: '#185FA5' };
  return { bg: '#EAF3DE', color: '#2D5016' };
};

export const OverviewPage = ({ userInfo, sessionCode: _sessionCode, sessionData, participantCount: _participantCount }: OverviewPageProps) => {
  const [contributions, setContributions] = useState<ContributionData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const data = sessionData;
    const allContributions: ContributionData[] = [];

    CATEGORIES.forEach((category) => {
      const categoryData = data[category.id];
      if (categoryData) {
        Object.entries(categoryData).forEach(([subIdx, entry]) => {
          const hasLegacyData = entry.drivers || entry.interventions;
          const hasNewData = (entry.driversList && entry.driversList.length > 0) ||
                            (entry.interventionsList && entry.interventionsList.length > 0);
          const hasContent = hasLegacyData || hasNewData || entry.levels.length > 0 || entry.other;

          if (hasContent) {
            allContributions.push({
              categoryTitle: category.title,
              categoryNum: category.num,
              categoryId: category.id,
              categoryColor: category.color,
              subTitle: category.subs[parseInt(subIdx)],
              entry
            });
          }
        });
      }
    });

    setContributions(allContributions);
  }, [sessionData]);

  const filteredContributions = selectedCategory === 'all'
    ? contributions
    : contributions.filter((c) => c.categoryId === selectedCategory);

  return (
    <div className="app active">
      <Topbar userInfo={userInfo} onViewSummary={() => {}} />

      <div className="overview-with-sidebar">
        {/* Sidebar */}
        <div className="overview-sidebar">
          <div className="overview-sidebar-header">
            <div className="overview-sidebar-title">Filter by Category</div>
            <div className="overview-sidebar-subtitle">
              {contributions.length} total entries
            </div>
          </div>

          <nav className="overview-sidebar-nav">
            <div className="overview-sidebar-section">
              <button
                className={`overview-category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                <span className="overview-category-icon">⊞</span>
                <span className="overview-category-label">All Categories</span>
                <span className="overview-category-count">{contributions.length}</span>
              </button>
            </div>

            <div className="overview-sidebar-section">
              <div className="overview-sidebar-section-label">Problem Categories</div>
              {CATEGORIES.map((cat) => {
                const count = contributions.filter((c) => c.categoryId === cat.id).length;
                if (count === 0) return null;

                return (
                  <button
                    key={cat.id}
                    className={`overview-category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <span className="overview-category-icon">{cat.icon}</span>
                    <span className="overview-category-label">{cat.title}</span>
                    <span className="overview-category-count">{count}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        <div className="overview-simple">
          {/* Header */}
          <div className="overview-simple-header">
            <h1>
              {selectedCategory === 'all'
                ? 'All Contributions'
                : CATEGORIES.find(c => c.id === selectedCategory)?.title || 'Overview'}
            </h1>
            <p className="overview-count">
              {filteredContributions.length} contribution{filteredContributions.length !== 1 ? 's' : ''} · Mara, Amboseli & Wildlife Corridors
            </p>
          </div>

          {/* Entries List */}
          {filteredContributions.length === 0 ? (
            <div className="overview-simple-empty">
              <p>No contributions yet for {selectedCategory === 'all' ? 'any category' : 'this category'}</p>
            </div>
          ) : (
            <div className="overview-simple-list">
              {filteredContributions.map((contrib, idx) => {
                const firstContributor = contrib.entry.by?.[0] || 'Unknown';
                const orgColors = getOrgPillColors(userInfo.org);

                return (
                  <div key={idx} className="overview-simple-card">
                    {/* Header with avatar and metadata */}
                    <div className="overview-simple-card-header">
                      <div
                        className="overview-avatar"
                        style={{ background: getOrgColor(userInfo.org) }}
                      >
                        {initials(firstContributor)}
                      </div>
                      <div className="overview-card-meta">
                        <div className="overview-card-author-row">
                          <span className="overview-card-author">{firstContributor === userInfo.name ? 'You' : firstContributor}</span>
                          <span
                            className="overview-org-pill"
                            style={{
                              background: orgColors.bg,
                              color: orgColors.color,
                              border: `0.5px solid ${orgColors.color}44`
                            }}
                          >
                            {userInfo.org}
                          </span>
                        </div>
                        <div className="overview-card-category">{contrib.categoryNum}</div>
                        <div className="overview-card-subtitle">{contrib.subTitle}</div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="overview-simple-content">
                      {/* Show new structured drivers if available, otherwise legacy */}
                      {contrib.entry.driversList && contrib.entry.driversList.length > 0 ? (
                        <div className="overview-content-section">
                          <div className="overview-content-label">Drivers / Root Causes</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {contrib.entry.driversList.map((driver, dIdx) => (
                              <div
                                key={driver.id}
                                style={{
                                  display: 'flex',
                                  gap: '0.5rem',
                                  padding: '0.6rem 0.8rem',
                                  background: 'rgba(200,130,42,0.06)',
                                  border: '1px solid rgba(200,130,42,0.15)',
                                  borderRadius: '4px'
                                }}
                              >
                                <span style={{
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  color: 'var(--ochre)',
                                  minWidth: '20px'
                                }}>
                                  {dIdx + 1}.
                                </span>
                                <span style={{ fontSize: '0.88rem', color: 'var(--deep)' }}>
                                  {driver.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : contrib.entry.drivers ? (
                        <div className="overview-content-section">
                          <div className="overview-content-label">Drivers / Root Causes</div>
                          <div className="overview-content-text">{contrib.entry.drivers}</div>
                        </div>
                      ) : null}

                      {/* Show new structured interventions if available, otherwise legacy */}
                      {contrib.entry.interventionsList && contrib.entry.interventionsList.length > 0 ? (
                        <div className="overview-content-section">
                          <div className="overview-content-label">Proposed Interventions</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {contrib.entry.interventionsList.map((intervention, iIdx) => (
                              <div
                                key={intervention.id}
                                style={{
                                  padding: '0.6rem 0.8rem',
                                  background: 'white',
                                  border: '1px solid rgba(28,40,32,0.12)',
                                  borderRadius: '4px'
                                }}
                              >
                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                  <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    color: 'var(--forest)',
                                    minWidth: '20px'
                                  }}>
                                    {iIdx + 1}.
                                  </span>
                                  <span style={{ fontSize: '0.88rem', color: 'var(--deep)' }}>
                                    {intervention.text}
                                  </span>
                                </div>

                                {/* Show levels for this intervention */}
                                {intervention.levels && intervention.levels.length > 0 && (
                                  <div style={{ paddingLeft: '1.75rem', marginBottom: '0.5rem' }}>
                                    <div style={{
                                      fontSize: '0.7rem',
                                      fontWeight: 600,
                                      color: 'var(--deep)',
                                      marginBottom: '0.25rem',
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.05em'
                                    }}>
                                      Level:
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                                      {intervention.levels.map((level, lIdx) => (
                                        <span
                                          key={lIdx}
                                          style={{
                                            fontSize: '0.7rem',
                                            padding: '0.2rem 0.55rem',
                                            background: 'var(--forest)',
                                            border: '1px solid var(--forest)',
                                            borderRadius: '12px',
                                            color: 'white',
                                            fontWeight: 500
                                          }}
                                        >
                                          {level}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {intervention.linkedDriverIds.length > 0 && contrib.entry.driversList && (
                                  <div style={{ paddingLeft: '1.75rem' }}>
                                    <div style={{
                                      fontSize: '0.7rem',
                                      color: 'var(--ochre)',
                                      fontWeight: 500,
                                      marginBottom: '0.25rem'
                                    }}>
                                      Addresses drivers:
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                                      {intervention.linkedDriverIds.map(driverId => {
                                        const driver = contrib.entry.driversList?.find(d => d.id === driverId);
                                        const driverIndex = contrib.entry.driversList?.findIndex(d => d.id === driverId);
                                        return driver && driverIndex !== undefined && driverIndex !== -1 ? (
                                          <span
                                            key={driverId}
                                            style={{
                                              fontSize: '0.7rem',
                                              padding: '0.2rem 0.5rem',
                                              background: 'rgba(200,130,42,0.15)',
                                              border: '1px solid rgba(200,130,42,0.25)',
                                              borderRadius: '12px',
                                              color: 'var(--ochre)',
                                              fontWeight: 500
                                            }}
                                          >
                                            Driver #{driverIndex + 1}
                                          </span>
                                        ) : null;
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : contrib.entry.interventions ? (
                        <div className="overview-content-section">
                          <div className="overview-content-label">Proposed Interventions</div>
                          <div className="overview-content-text">{contrib.entry.interventions}</div>
                        </div>
                      ) : null}

                      {contrib.entry.other && (
                        <div className="overview-content-section" style={{ gridColumn: '1 / -1' }}>
                          <div className="overview-content-label">Notes</div>
                          <div className="overview-content-text">{contrib.entry.other}</div>
                        </div>
                      )}

                      {contrib.entry.levels && contrib.entry.levels.length > 0 && (
                        <div className="overview-levels">
                          {contrib.entry.levels.map((level, i) => (
                            <span key={i} className="overview-level-tag">
                              {level}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer with all contributors */}
                    {contrib.entry.by && contrib.entry.by.length > 0 && (
                      <div className="overview-simple-footer">
                        <span>Contributors:</span>
                        <div className="overview-contributors-list">
                          {contrib.entry.by.map((name, i) => (
                            <span
                              key={i}
                              className={`overview-contributor ${name === userInfo.name ? 'by-you' : ''}`}
                            >
                              {name === userInfo.name ? 'You' : name}
                              {i < contrib.entry.by.length - 1 ? ',' : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
