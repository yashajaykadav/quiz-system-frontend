/**
 * Props:
 *  questions           – array
 *  getQuestionStatus   – (index) => 'current' | 'attempted' | 'not-attempted'
 *  onNavigate          – (index) => void
 *  currentIndex        – number
 */

const STATUS_STYLES = {
    current: 'bg-yellow-400 text-black border-black ring-4 ring-yellow-200',
    attempted: 'bg-green-500 text-white border-black',
    'not-attempted': 'bg-red-400 text-white border-black',
};

const QuestionNavigator = ({ questions, getQuestionStatus, onNavigate, currentIndex }) => (
    <div className="bg-white border-4 border-black p-5 shadow-[6px_6px_0px_0px_#000]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b-4 border-black">
            <h3 className="text-base font-black uppercase tracking-tight text-black">
                Questions
            </h3>
            <span className="bg-black text-yellow-400 text-xs font-black px-2 py-1 uppercase">
                {questions.length} Total
            </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-4 gap-2 mb-6">
            {questions.map((_, index) => {
                const status = getQuestionStatus(index);
                return (
                    <button
                        key={index}
                        onClick={() => onNavigate(index)}
                        className={`
              h-10 w-full border-4 font-black text-sm
              shadow-[3px_3px_0px_0px_#000]
              hover:-translate-x-0.5 hover:-translate-y-0.5
              transition-all duration-150
              ${STATUS_STYLES[status]}
            `}
                    >
                        {index + 1}
                    </button>
                );
            })}
        </div>

        {/* Legend */}
        <div className="pt-4 border-t-4 border-black">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-3">Legend</p>
            <div className="grid grid-cols-2 gap-2">
                {[
                    { color: 'bg-green-500', label: 'Attempted' },
                    { color: 'bg-red-400', label: 'Not Attempted' },
                    { color: 'bg-yellow-400 border-2 border-black', label: 'Current' },
                ].map(({ color, label }) => (
                    <div key={label} className="flex items-center gap-2">
                        <div className={`w-3 h-3 border-2 border-black ${color}`} />
                        <span className="text-[10px] font-black text-gray-700">{label}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default QuestionNavigator;