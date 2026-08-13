import type { Category, StorageData } from '../types';
import { CategoryCard } from './CategoryCard';

interface CategoryGridProps {
  categories: Category[];
  sessionCode: string;
  sessionData: StorageData;
  onCategoryClick: (index: number) => void;
}

export const CategoryGrid = ({ categories, sessionCode: _sessionCode, sessionData: data, onCategoryClick }: CategoryGridProps) => {

  const getStats = () => {
    let totalEntries = 0;
    let categoriesWithData = 0;

    categories.forEach((cat) => {
      const catData = data[cat.id] || {};
      const count = Object.keys(catData).length;
      if (count > 0) {
        categoriesWithData++;
        totalEntries += count;
      }
    });

    return { totalEntries, categoriesWithData };
  };

  const stats = getStats();

  return (
    <div className="workspace">
      <div className="workspace-header">
        <div>
          <h2>Problem Areas</h2>
          <p>Select a category to explore sub-components and add your inputs</p>
        </div>
        <div className="progress-summary">
          <div className="prog-item">
            <strong>{stats.totalEntries}</strong>
            inputs
          </div>
          <div className="prog-item">
            <strong>{stats.categoriesWithData}</strong>
            categories
          </div>
        </div>
      </div>

      <div className="categories-grid">
        {categories.map((cat, index) => {
          const catData = data[cat.id] || {};
          const filledCount = Object.keys(catData).length;

          return (
            <CategoryCard
              key={cat.id}
              category={cat}
              index={index}
              filledCount={filledCount}
              onClick={() => onCategoryClick(index)}
            />
          );
        })}
      </div>
    </div>
  );
};
