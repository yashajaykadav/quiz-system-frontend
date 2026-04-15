import { AlertTriangle } from 'lucide-react';

/**
 * Props:
 *  warningCount – number
 *  maxWarnings  – number
 */
const WarningBadge = ({ warningCount, maxWarnings }) => {
  if (warningCount === 0) return null;

  return (
    <div className="fixed top-24 right-6 z-50">
      <div
        className={`
          flex items-center gap-2 px-4 py-2 border-4 border-black font-black text-sm
          shadow-[4px_4px_0px_0px_#000]
          ${warningCount >= 2 ? 'bg-red-500 text-white' : 'bg-yellow-400 text-black'}
        `}
      >
        <AlertTriangle size={16} />
        {warningCount}/{maxWarnings} Warnings
      </div>
    </div>
  );
};

export default WarningBadge;