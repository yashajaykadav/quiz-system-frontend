// src/components/common/InfoModal.jsx
/**
 * Props:
 *  message  – string
 *  type     – 'info' | 'error' | 'success'
 *  onClose  – () => void
 */
const BG = {
    info: 'bg-white',
    error: 'bg-red-500',
    success: 'bg-green-500',
};

const TEXT = {
    info: 'text-black',
    error: 'text-white',
    success: 'text-white',
};

const InfoModal = ({ message, type = 'info', onClose }) => (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70">
        <div className={`
      w-full max-w-sm mx-4 border-4 border-black
      shadow-[8px_8px_0px_0px_#000] ${BG[type]}
    `}>
            <div className="h-3 bg-yellow-400 border-b-4 border-black" />

            <div className="p-8 text-center">
                <p className={`text-lg font-black mb-8 leading-snug ${TEXT[type]}`}>
                    {message}
                </p>
                <button
                    onClick={onClose}
                    className={`
            w-full py-3 border-4 border-black font-black uppercase text-sm
            shadow-[4px_4px_0px_0px_#000] transition-all
            hover:-translate-x-0.5 hover:-translate-y-0.5
            ${type === 'info'
                            ? 'bg-black text-white hover:bg-yellow-400 hover:text-black'
                            : 'bg-white text-black hover:bg-gray-100'
                        }
          `}
                >
                    OK
                </button>
            </div>
        </div>
    </div>
);

export default InfoModal;