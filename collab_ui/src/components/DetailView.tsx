import type { Category, EntryData, StorageData } from '../types';
import { SubComponentEnhanced } from './SubComponentEnhanced';

const EMPTY_ENTRY: EntryData = {
  drivers: '',
  interventions: '',
  driversList: [],
  interventionsList: [],
  levels: [],
  other: '',
  by: [],
};

interface DetailViewProps {
  category: Category;
  sessionCode: string;
  sessionData: StorageData;
  currentUser: string;
  onBack: () => void;
  onSaveEntry: (catId: string, subIndex: number, entry: EntryData) => Promise<void>;
}

export const DetailView = ({ category, sessionCode: _sessionCode, sessionData, currentUser: _currentUser, onBack, onSaveEntry }: DetailViewProps) => {
  return (
    <div className="detail-view active">
      <div className="detail-header" data-icon={category.icon}>
        <button className="back-btn" onClick={onBack}>
          ← Back to Categories
        </button>
        <div className="detail-cat-num">{category.num}</div>
        <div className="detail-title">{category.title}</div>
      </div>
      <div className="subcomponents">
        {category.subs.map((sub, index) => {
          const entry = sessionData[category.id]?.[index] ?? { ...EMPTY_ENTRY };
          const isOther = sub.includes('Other');

          return (
            <SubComponentEnhanced
              key={index}
              subTitle={sub}
              subIndex={index}
              entry={entry}
              onSave={(updatedEntry) => onSaveEntry(category.id, index, updatedEntry)}
              isOther={isOther}
            />
          );
        })}
      </div>
    </div>
  );
};
