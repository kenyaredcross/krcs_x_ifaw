import type { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  index: number;
  filledCount: number;
  onClick: () => void;
}

export const CategoryCard = ({ category, index, filledCount, onClick }: CategoryCardProps) => {
  const progressPercentage = category.subs.length
    ? (filledCount / category.subs.length * 100).toFixed(0)
    : 0;

  const pillsToShow = category.subs.slice(0, 4);
  const remaining = category.subs.length - 4;

  return (
    <div className="cat-card" onClick={onClick} style={{ ['--cat-index' as any]: index }}>
      <div className="cat-header">
        <div className="cat-icon">{category.icon}</div>
        <div>
          <div className="cat-num">{category.num}</div>
          <div className="cat-title">{category.title}</div>
        </div>
      </div>
      <div className="cat-subs">
        {pillsToShow.map((sub, i) => (
          <span key={i} className="cat-sub-pill">
            {sub.replace(' – Specify', '')}
          </span>
        ))}
        {remaining > 0 && (
          <span className="cat-sub-pill">+{remaining} more</span>
        )}
      </div>
      <div className="contributions-bar">
        <div className="contributions-fill" style={{ width: `${progressPercentage}%` }}></div>
      </div>
      <div className="cat-footer">
        <span className="cat-count">
          <strong>{filledCount}</strong>/{category.subs.length} sub-areas filled
        </span>
        <span className="cat-arrow">Explore →</span>
      </div>
    </div>
  );
};
