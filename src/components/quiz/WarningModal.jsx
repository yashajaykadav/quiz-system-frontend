import { AlertTriangle, ShieldAlert } from 'lucide-react';

const MAX_WARNINGS = 3;

/**
 * Props:
 *  warningCount   – number
 *  autoSubmitted  – boolean
 *  onDismiss      – () => void
 */
const WarningModal = ({ warningCount, autoSubmitted, onDismiss }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70">
        <div
            className={`
        w-full max-w-md mx-4 border-4 border-black
        shadow-[8px_8px_0px_0px_#000]
        ${autoSubmitted ? 'bg-red-500' : 'bg-white'}
      `}
        >
            {/* Top accent bar */}
            <div className={`h-3 w-full ${autoSubmitted ? 'bg-black' : 'bg-yellow-400 border-b-4 border-black'}`} />

            <div className="p-8 text-center">
                {autoSubmitted ? (
                    <>
                        <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-6">
                            <ShieldAlert className="text-red-400" size={36} />
                        </div>
                        <h2 className="text-3xl font-black text-white mb-3 uppercase tracking-tight">
                            Quiz Auto-Submitted
                        </h2>
                        <p className="text-red-100 font-bold mb-8 leading-relaxed">
                            You left the quiz screen{' '}
                            <span className="text-white underline underline-offset-2">{warningCount} times</span>.
                            Your quiz has been submitted automatically.
                        </p>
                        <button
                            onClick={onDismiss}
                            className="
                w-full bg-black text-white py-4 font-black uppercase tracking-widest
                border-4 border-white
                hover:bg-white hover:text-black transition-colors
              "
                        >
                            View My Results →
                        </button>
                    </>
                ) : (
                    <>
                        <div className="w-16 h-16 bg-yellow-400 border-4 border-black flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="text-black" size={32} />
                        </div>
                        <h2 className="text-3xl font-black text-black mb-2 uppercase">
                            Warning #{warningCount}
                        </h2>
                        <p className="text-gray-700 font-bold mb-6 leading-relaxed">
                            You switched away from the quiz tab.
                            This is <span className="underline">not allowed</span> during an exam.
                        </p>

                        {/* Warning pip indicators */}
                        <div className="flex items-center justify-center gap-3 mb-6">
                            {Array.from({ length: MAX_WARNINGS }).map((_, i) => (
                                <div key={i} className="flex flex-col items-center gap-1">
                                    <div
                                        className={`
                      w-10 h-10 border-4 border-black flex items-center justify-center
                      font-black text-sm
                      ${i < warningCount ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-400'}
                    `}
                                    >
                                        {i + 1}
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">
                                        {i < warningCount ? 'Used' : 'Left'}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="bg-red-100 border-4 border-red-500 p-4 mb-6 text-left">
                            <p className="text-red-800 text-sm font-black">
                                ⚠ {MAX_WARNINGS - warningCount} warning
                                {MAX_WARNINGS - warningCount !== 1 ? 's' : ''} remaining before auto-submit.
                            </p>
                        </div>

                        <button
                            onClick={onDismiss}
                            className="
                w-full bg-black text-white py-4 font-black uppercase tracking-widest
                border-4 border-black
                hover:bg-yellow-400 hover:text-black transition-colors
              "
                        >
                            I Understand — Continue Quiz
                        </button>
                    </>
                )}
            </div>
        </div>
    </div>
);

export default WarningModal;