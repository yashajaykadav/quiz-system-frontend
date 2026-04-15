import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Props:
 *  question            – question object
 *  questionIndex       – number (0-based)
 *  totalQuestions      – number
 *  currentAnswer       – answer object | undefined
 *  onAnswerSelect      – (optionNum: number) => void
 *  onPrev              – () => void
 *  onNext              – () => void
 *  onSubmit            – () => void
 *  isFirst             – boolean
 *  isLast              – boolean
 */
const OPTIONS = [1, 2, 3, 4];

const QuestionCard = ({
    question,
    questionIndex,
    totalQuestions,
    currentAnswer,
    onAnswerSelect,
    onPrev,
    onNext,
    onSubmit,
    isFirst,
    isLast,
}) => {
    const progressPct = ((questionIndex + 1) / totalQuestions) * 100;

    return (
        <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000]">
            {/* Progress bar */}
            <div className="h-2 w-full bg-gray-200 border-b-4 border-black">
                <div
                    className="h-full bg-yellow-400 transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                />
            </div>

            <div className="p-6">
                {/* Meta row */}
                <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-black uppercase tracking-widest text-gray-500">
                        Question {questionIndex + 1} / {totalQuestions}
                    </span>
                    <span className="bg-black text-yellow-400 text-xs font-black px-3 py-1 uppercase tracking-widest">
                        {question.marks || 1} pt{(question.marks || 1) > 1 ? 's' : ''}
                    </span>
                </div>

                {/* Question text */}
                <h2 className="text-xl font-black text-black leading-snug mb-6">
                    {question.questionText}
                </h2>

                {/* Code snippet */}
                {question.codeSnippet && (
                    <pre className="bg-black text-green-400 p-5 mb-6 overflow-x-auto text-sm font-mono border-4 border-black">
                        {question.codeSnippet}
                    </pre>
                )}

                {/* Options */}
                <div className="flex flex-col gap-3 mb-8">
                    {OPTIONS.map((optionNum) => {
                        const isSelected = currentAnswer?.selectedOption === optionNum;
                        return (
                            <button
                                key={optionNum}
                                onClick={() => onAnswerSelect(optionNum)}
                                className={`
                  flex items-center gap-4 p-4 border-4 border-black font-bold text-left
                  transition-all
                  ${isSelected
                                        ? 'bg-yellow-400 shadow-[4px_4px_0px_0px_#000] -translate-x-1 -translate-y-1'
                                        : 'bg-white hover:bg-gray-50 shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5'
                                    }
                `}
                            >
                                {/* Option label */}
                                <div
                                    className={`
                    w-8 h-8 flex items-center justify-center font-black text-sm border-4 border-black flex-shrink-0
                    ${isSelected ? 'bg-black text-yellow-400' : 'bg-gray-100 text-black'}
                  `}
                                >
                                    {String.fromCharCode(64 + optionNum)}
                                </div>
                                <span className="text-black font-bold">
                                    {question[`option${optionNum}`]}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-6 border-t-4 border-black">
                    <button
                        onClick={onPrev}
                        disabled={isFirst}
                        className="
              flex items-center gap-2 px-6 py-3 border-4 border-black font-black uppercase
              bg-white hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed
              shadow-[4px_4px_0px_0px_#000] disabled:shadow-none
              transition-all hover:-translate-x-0.5 hover:-translate-y-0.5
            "
                    >
                        <ChevronLeft size={18} /> Prev
                    </button>

                    {isLast ? (
                        <button
                            onClick={onSubmit}
                            className="
                px-8 py-3 bg-green-500 border-4 border-black font-black uppercase text-white
                shadow-[4px_4px_0px_0px_#000] hover:bg-green-400
                transition-all hover:-translate-x-0.5 hover:-translate-y-0.5
              "
                        >
                            Submit Test ✓
                        </button>
                    ) : (
                        <button
                            onClick={onNext}
                            className="
                flex items-center gap-2 px-8 py-3 bg-black text-white border-4 border-black font-black uppercase
                shadow-[4px_4px_0px_0px_#000] hover:bg-yellow-400 hover:text-black
                transition-all hover:-translate-x-0.5 hover:-translate-y-0.5
              "
                        >
                            Save & Next <ChevronRight size={18} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;