import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Shield } from 'lucide-react';

const HealthScoreCard = ({ score = 0 }) => {
  const getColor = () => {
    if (score >= 75) return '#059669';
    if (score >= 50) return '#0891b2';
    if (score >= 25) return '#d97706';
    return '#ef4444';
  };
  const getLabel = () => {
    if (score >= 75) return 'Excellent';
    if (score >= 50) return 'Good';
    if (score >= 25) return 'Fair';
    return 'Needs Work';
  };
  const color = getColor();

  return (
    <div className="rounded-2xl p-6 h-full flex flex-col"
      style={{ background: '#FFFFFF', border: '1px solid #E5EDE9' }}>
      <div className="flex items-center gap-2 mb-4">
        <Shield size={17} style={{ color: '#059669' }}/>
        <h3 className="font-black" style={{ color: '#111827' }}>Health Score</h3>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-36 h-36 mb-4">
          <CircularProgressbar value={score} text={`${score}`}
            styles={buildStyles({
              textSize: '22px',
              textColor: color,
              pathColor: color,
              trailColor: '#E5EDE9',
              pathTransitionDuration: 1,
            })}
          />
        </div>
        <span className="text-lg font-black" style={{ color }}>{getLabel()}</span>
        <p className="text-xs text-center mt-2" style={{ color: '#9CA3AF' }}>
          Based on savings rate and budget adherence
        </p>
      </div>
    </div>
  );
};

export default HealthScoreCard;