import { Topbar } from '../components/Topbar';
import { DetailView } from '../components/DetailView';
import { SummaryPanel } from '../components/SummaryPanel';
import { CATEGORIES } from '../constants/categories';
import type { UserInfo, StorageData, EntryData } from '../types';

interface DetailPageProps {
  userInfo: UserInfo;
  sessionCode: string;
  sessionData: StorageData;
  participantCount: number;
  categoryIndex: number;
  onBack: () => void;
  showSummary: boolean;
  onOpenSummary: () => void;
  onCloseSummary: () => void;
  onSaveEntry: (catId: string, subIndex: number, entry: EntryData) => Promise<void>;
}

export const DetailPage = ({
  userInfo,
  sessionCode,
  sessionData,
  participantCount: _participantCount,
  categoryIndex,
  onBack,
  showSummary,
  onOpenSummary,
  onCloseSummary,
  onSaveEntry
}: DetailPageProps) => {
  const category = CATEGORIES[categoryIndex];

  return (
    <div className="app active">
      <Topbar userInfo={userInfo} onViewSummary={onOpenSummary} />

      <DetailView
        category={category}
        sessionCode={sessionCode}
        sessionData={sessionData}
        currentUser={userInfo.name}
        onBack={onBack}
        onSaveEntry={onSaveEntry}
      />

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
