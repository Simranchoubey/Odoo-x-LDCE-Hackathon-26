import { useEffect, useRef } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from './Button';

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'primary',
  onConfirm,
  size = 'sm',
  showFooter = true,
}) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeMap = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => e.target === overlayRef.current && onClose?.()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={`relative w-full ${sizeMap[size]} bg-[var(--color-surface-container-lowest)] rounded-3xl shadow-2xl border border-[var(--color-outline-variant)]/30 overflow-hidden`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex items-start gap-3">
            {confirmVariant === 'danger' && (
              <div className="w-10 h-10 rounded-xl bg-[var(--color-error-container)] flex items-center justify-center shrink-0">
                <AlertTriangle size={20} className="text-[var(--color-error)]" />
              </div>
            )}
            <div>
              <h2 id="modal-title" className="text-lg font-bold text-[var(--color-on-surface)]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {title}
              </h2>
              {description && (
                <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">{description}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--color-on-surface-variant)]/60 hover:bg-[var(--color-surface-container)] hover:text-[var(--color-on-surface)] transition-all shrink-0"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        {children && (
          <div className="px-6 pb-4">
            {children}
          </div>
        )}

        {/* Footer */}
        {showFooter && (
          <div className="flex justify-end gap-3 p-6 pt-4 border-t border-[var(--color-surface-container)]">
            <Button variant="secondary" size="md" onClick={onClose}>
              {cancelLabel}
            </Button>
            {onConfirm && (
              <Button variant={confirmVariant} size="md" onClick={onConfirm}>
                {confirmLabel}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
