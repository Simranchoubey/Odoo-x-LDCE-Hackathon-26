import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe2, Eye, EyeOff, MapPin, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PrimaryButton } from '../components/Button';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const validate = () => {
    const errs = {};
    if (!form.username.trim()) errs.username = 'Username is required';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoginError('');
    setLoading(true);
    const result = await login(form);
    setLoading(false);
    if (result.success) navigate('/');
    else setLoginError(result.error || 'Invalid credentials.');
  };

  const handleChange = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary)]/5 via-[var(--color-background)] to-[var(--color-primary-fixed)]/20 flex items-center justify-center p-4">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[var(--color-primary-container)]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm relative">
        {/* Card */}
        <div className="bg-[var(--color-surface-container-lowest)] rounded-3xl p-8 shadow-2xl border border-[var(--color-outline-variant)]/30">
          {/* Avatar placeholder */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-container)] flex items-center justify-center mb-4 shadow-lg primary-shadow">
              <Globe2 size={36} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--color-on-surface)]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Welcome Back
            </h1>
            <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Sign in to continue your journey</p>
          </div>

          {loginError && (
            <div className="flex items-center gap-2 bg-[var(--color-error-container)] text-[var(--color-error)] rounded-xl px-4 py-3 mb-4 text-sm">
              <AlertCircle size={16} />
              {loginError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1.5">
                Username or Email
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={form.username}
                onChange={handleChange('username')}
                placeholder="Enter your username"
                className={`w-full bg-[var(--color-surface-container)] border rounded-xl px-4 py-3 text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/40 focus:outline-none focus:ring-2 transition-all ${
                  errors.username
                    ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]/30'
                    : 'border-[var(--color-outline-variant)]/40 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]/50'
                }`}
              />
              {errors.username && (
                <p className="text-xs text-[var(--color-error)] mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.username}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange('password')}
                  placeholder="Enter your password"
                  className={`w-full bg-[var(--color-surface-container)] border rounded-xl px-4 py-3 pr-12 text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/40 focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]/30'
                      : 'border-[var(--color-outline-variant)]/40 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]/50'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]/60 hover:text-[var(--color-on-surface)] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-[var(--color-error)] mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.password}
                </p>
              )}
            </div>

            <PrimaryButton
              type="submit"
              size="lg"
              loading={loading}
              className="w-full mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </PrimaryButton>
          </form>

          <p className="text-center text-sm text-[var(--color-on-surface-variant)] mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-[var(--color-primary)] hover:underline">
              Register
            </Link>
          </p>
        </div>

        {/* Demo hint */}
        <p className="text-center text-xs text-[var(--color-on-surface-variant)] mt-4 opacity-60">
          Demo: any username + password (min 6 chars)
        </p>
      </div>
    </div>
  );
}
