// src/components/common/ConfirmModal.jsx
/**
 * Props:
 *  message    – string
 *  onConfirm  – () => void
 *  onCancel   – () => void
 *  confirmLabel – string  (default "Confirm")
 *  cancelLabel  – string  (default "Cancel")
 */
const ConfirmModal = ({
    message,
    onConfirm,
    onCancel,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
}) => (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70">
        <div className="
      w-full max-w-sm mx-4 bg-white
      border-4 border-black shadow-[8px_8px_0px_0px_#000]
    ">
            {/* Accent bar */}
            <div className="h-3 bg-yellow-400 border-b-4 border-black" />

            <div className="p-8 text-center">
                <p className="text-lg font-black text-black mb-8 leading-snug">
                    {message}
                </p>

                <div className="flex gap-4">
                    <button
                        onClick={onCancel}
                        className="
              flex-1 py-3 border-4 border-black font-black uppercase text-sm
              bg-white hover:bg-gray-100
              shadow-[4px_4px_0px_0px_#000] transition-all
              hover:-translate-x-0.5 hover:-translate-y-0.5
            "
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="
              flex-1 py-3 border-4 border-black font-black uppercase text-sm
              bg-black text-white hover:bg-yellow-400 hover:text-black
              shadow-[4px_4px_0px_0px_#000] transition-all
              hover:-translate-x-0.5 hover:-translate-y-0.5
            "
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    </div>
);

export default ConfirmModal;