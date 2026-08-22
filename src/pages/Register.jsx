import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, Globe2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PrimaryButton } from '../components/Button';

const FIELDS = [
  { id: 'firstName', label: 'First Name', type: 'text', placeholder: 'Arjun', required: true, col: 1 },
  { id: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Mehta', required: true, col: 2 },
  { id: 'email', label: 'Email Address', type: 'email', placeholder: 'arjun@email.com', required: true, col: 1 },
  { id: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+91 98765 43210', required: false, col: 2 },
  { id: 'city', label: 'City', type: 'text', placeholder: 'Mumbai', required: false, col: 1 },
  { id: 'country', label: 'Country', type: 'text', placeholder: 'India', required: false, col: 2 },
];

export default function Register() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', city: '', country: '', additionalInfo: '', password: '', confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = 'Required';
    if (!form.lastName.trim()) errs.lastName = 'Required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required';
    if (!form.password || form.password.length < 6) errs.password = 'Min 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleChange = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    const result = await register({
      name: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email,
      password: form.password,
    });
    if (!result.success) {
      setLoading(false);
      setErrors({ email: result.error || 'Registration failed' });
      return;
    }
    setLoading(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary)]/5 via-[var(--color-background)] to-[var(--color-primary-fixed)]/20 flex items-center justify-center p-4 py-12">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg relative">
        <div className="bg-[var(--color-surface-container-lowest)] rounded-3xl p-8 shadow-2xl border border-[var(--color-outline-variant)]/30">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            {/* Photo Upload */}
            <label htmlFor="avatar-upload" className="relative cursor-pointer group mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-primary-container)]/30 border-2 border-dashed border-[var(--color-primary)]/40 flex items-center justify-center overflow-hidden group-hover:border-[var(--color-primary)] transition-all">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-[var(--color-primary)]/60 group-hover:text-[var(--color-primary)] transition-colors">
                    <Camera size={24} />
                    <span className="text-xs mt-1 font-medium">Upload</span>
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[var(--color-primary)] flex items-center justify-center border-2 border-white">
                <Camera size={12} className="text-white" />
              </div>
            </label>
            <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />

            <h1 className="text-2xl font-bold text-[var(--color-on-surface)]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Create Account
            </h1>
            <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Start your travel journey today</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Two-column fields */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              {FIELDS.map(({ id, label, type, placeholder, required }) => (
                <FormField
                  key={id}
                  id={id}
                  label={label}
                  type={type}
                  placeholder={placeholder}
                  required={required}
                  value={form[id]}
                  onChange={handleChange(id)}
                  error={errors[id]}
                />
              ))}
            </div>

            {/* Password row */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <FormField
                id="password"
                label="Password"
                type="password"
                placeholder="Min 6 characters"
                required
                value={form.password}
                onChange={handleChange('password')}
                error={errors.password}
              />
              <FormField
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Repeat password"
                required
                value={form.confirmPassword}
                onChange={handleChange('confirmPassword')}
                error={errors.confirmPassword}
              />
            </div>

            {/* Additional info */}
            <div className="mb-6">
              <label htmlFor="additionalInfo" className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1.5">
                Additional Information
              </label>
              <textarea
                id="additionalInfo"
                value={form.additionalInfo}
                onChange={handleChange('additionalInfo')}
                placeholder="Tell us about your travel style, favourite destinations, bucket list..."
                rows={3}
                className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)]/40 rounded-xl px-4 py-3 text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 resize-none transition-all"
              />
            </div>

            <PrimaryButton type="submit" size="lg" loading={loading} className="w-full">
              {loading ? 'Creating Account...' : 'Create Account'}
            </PrimaryButton>
          </form>

          <p className="text-center text-sm text-[var(--color-on-surface-variant)] mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[var(--color-primary)] hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function FormField({ id, label, type, placeholder, required, value, onChange, error }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1.5">
        {label}{required && <span className="text-[var(--color-error)] ml-0.5">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-[var(--color-surface-container)] border rounded-xl px-3 py-2.5 text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/40 focus:outline-none focus:ring-2 transition-all ${
          error
            ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]/30'
            : 'border-[var(--color-outline-variant)]/40 focus:ring-[var(--color-primary)]/30'
        }`}
      />
      {error && (
        <p className="text-xs text-[var(--color-error)] mt-1 flex items-center gap-1">
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}
