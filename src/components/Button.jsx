import { Loader2 } from 'lucide-react';

const BASE = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

const SIZES = {
  sm: 'px-3.5 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-base',
};

const VARIANTS = {
  primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-on-primary-fixed-variant)] primary-shadow hover:shadow-[0_12px_32px_rgba(172,53,9,0.3)]',
  secondary: 'bg-[var(--color-surface-container)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)] border border-[var(--color-outline-variant)]/50',
  outline: 'border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white',
  ghost: 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] hover:text-[var(--color-on-surface)]',
  danger: 'bg-[var(--color-error)] text-white hover:bg-[var(--color-on-error-container)] shadow-md hover:shadow-lg',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg',
};

export function PrimaryButton({
  children,
  size = 'md',
  loading = false,
  className = '',
  ...props
}) {
  return (
    <button
      className={`${BASE} ${SIZES[size]} ${VARIANTS.primary} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  size = 'md',
  loading = false,
  className = '',
  ...props
}) {
  return (
    <button
      className={`${BASE} ${SIZES[size]} ${VARIANTS.secondary} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  ...props
}) {
  return (
    <button
      className={`${BASE} ${SIZES[size]} ${VARIANTS[variant] || VARIANTS.primary} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}

export default Button;
