import { Topbar } from '../components/Topbar';
import { DetailView } from '../components/DetailView';
import { SummaryPanel } from '../components/SummaryPanel';
import { CATEGORIES } from '../constants/categories';
import type { UserInfo } from '../types';

interface DetailPageProps {
  userInfo: UserInfo;
  sessionCode: string;
  categoryIndex: number;
  onBack: () => void;
  showSummary: boolean;
  onOpenSummary: () => void;
  onCloseSummary: () => void;
}

export const DetailPage = ({
  userInfo,
  sessionCode,
  categoryIndex,
  onBack,
  showSummary,
  onOpenSummary,
  onCloseSummary
}: DetailPageProps) => {
  const category = CATEGORIES[categoryIndex];

  return (
    <div className="app active">
      <Topbar userInfo={userInfo} onViewSummary={onOpenSummary} />

      <DetailView
        category={category}
        sessionCode={sessionCode}
        currentUser={userInfo.name}
        onBack={onBack}
      />

      <SummaryPanel
        categories={CATEGORIES}
        sessionCode={sessionCode}
        isOpen={showSummary}
        onClose={onCloseSummary}
      />
    </div>
  );
};
