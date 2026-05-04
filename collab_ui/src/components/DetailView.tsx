import type { Category, EntryData } from '../types';
import { SubComponentEnhanced } from './SubComponentEnhanced';
import { getEntry, saveEntry } from '../utils/storage';

interface DetailViewProps {
  category: Category;
  sessionCode: string;
  currentUser: string;
  onBack: () => void;
}

export const DetailView = ({ category, sessionCode, currentUser, onBack }: DetailViewProps) => {
  const handleSaveEntry = (subIndex: number, entry: EntryData) => {
    saveEntry(sessionCode, category.id, subIndex, entry, currentUser);
  };

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
          const entry = getEntry(sessionCode, category.id, index);
          const isOther = sub.includes('Other');

          return (
            <SubComponentEnhanced
              key={index}
              subTitle={sub}
              subIndex={index}
              entry={entry}
              onSave={(updatedEntry) => handleSaveEntry(index, updatedEntry)}
              isOther={isOther}
            />
          );
        })}
      </div>
    </div>
  );
};
