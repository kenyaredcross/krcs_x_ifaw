import { Topbar } from '../components/Topbar';
import { CategoryGrid } from '../components/CategoryGrid';
import { SummaryPanel } from '../components/SummaryPanel';
import { CATEGORIES } from '../constants/categories';
import type { UserInfo, StorageData } from '../types';

interface ProblemAreasPageProps {
  userInfo: UserInfo;
  sessionCode: string;
  sessionData: StorageData;
  participantCount: number;
  onCategoryClick: (index: number) => void;
  showSummary: boolean;
  onOpenSummary: () => void;
  onCloseSummary: () => void;
}

export const ProblemAreasPage = ({
  userInfo,
  sessionCode,
  sessionData,
  participantCount: _participantCount,
  onCategoryClick,
  showSummary,
  onOpenSummary,
  onCloseSummary
}: ProblemAreasPageProps) => {
  return (
    <div className="app active">
      <Topbar userInfo={userInfo} onViewSummary={onOpenSummary} />

      <div id="gridView">
        <CategoryGrid
          categories={CATEGORIES}
          sessionCode={sessionCode}
          sessionData={sessionData}
          onCategoryClick={onCategoryClick}
        />
      </div>

      <SummaryPanel
        categories={CATEGORIES}
        sessionCode={sessionCode}
        sessionData={sessionData}
        isOpen={showSummary}
        onClose={onCloseSummary}
      />
    </div>
  );
};
