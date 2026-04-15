import { ShieldAlert } from 'lucide-react';

/**
 * Props:
 *  warningCount – number
 *  maxWarnings  – number
 */
const ExamRulesCard = ({ warningCount, maxWarnings }) => {
    const isDanger = warningCount >= 2;

    return (
        <div
            className={`
        border-4 border-black p-5
        shadow-[6px_6px_0px_0px_#000]
        ${isDanger ? 'bg-red-500 text-white' : 'bg-black text-white'}
      `}
        >
            <h4 className="font-black text-base uppercase mb-3 flex items-center gap-2">
                <ShieldAlert size={18} /> Exam Rules
            </h4>
            <ul className="text-sm font-bold space-y-2 mb-4 opacity-90">
                <li>→ Do NOT switch tabs or windows</li>
                <li>→ {maxWarnings} warnings = auto-submit</li>
                <li>→ Progress saved in real-time</li>
            </ul>

            {warningCount > 0 && (
                <div className="bg-white text-black border-4 border-black p-3 text-center">
                    <span className="text-xs font-black uppercase tracking-widest">
                        {warningCount}/{maxWarnings} Warnings Used
                    </span>
                </div>
            )}
        </div>
    );
};

export default ExamRulesCard;