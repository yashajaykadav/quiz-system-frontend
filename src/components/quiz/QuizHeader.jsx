import Timer from '../common/Timer';

/**
 * Props:
 *  quizMeta  – { title, subjectName, topicName, durationMinutes }
 *  startedAt – ISO string  e.g. "2025-01-15T10:30:00Z"
 *  onTimeUp  – () => void
 */
const QuizHeader = ({ quizMeta, startedAt, onTimeUp }) => (
    <div className="
    bg-white border-4 border-black p-5 mb-6
    shadow-[6px_6px_0px_0px_#000]
    flex flex-col md:flex-row justify-between items-start md:items-center gap-4
  ">
        {/* Identity */}
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black flex items-center justify-center text-white font-black text-xl uppercase">
                {quizMeta?.subjectName?.charAt(0) || 'Q'}
            </div>
            <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-yellow-400 border-2 border-black px-2 py-0.5">
                        {quizMeta?.subjectName}
                    </span>
                    <span className="text-[10px] font-black uppercase text-gray-500">
                        · {quizMeta?.topicName}
                    </span>
                </div>
                <h1 className="text-xl font-black text-black leading-tight">
                    {quizMeta?.title}
                </h1>
            </div>
        </div>

        {/* Timer — receives startedAt for wall-clock calculation */}
        <Timer
            durationMinutes={quizMeta?.durationMinutes}
            startedAt={startedAt}
            onTimeUp={onTimeUp}
        />
    </div>
);

export default QuizHeader;