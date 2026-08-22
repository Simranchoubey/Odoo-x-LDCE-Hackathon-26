import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Globe2,
  MapPin,
  CalendarDays,
  Users,
  LayoutDashboard,
  Search,
  Bell,
  Menu,
  X,
  LogOut,
  User,
  Settings,
  Shield,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import Modal from './Modal';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/trips', label: 'My Trips', icon: MapPin },
  { to: '/search', label: 'Explore', icon: Search },
  { to: '/community', label: 'Community', icon: Users },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
];

export default function TopBar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setLogoutModal(false);
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 glass border-b border-[var(--color-outline-variant)]/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 lg:px-16 h-16 flex items-center gap-4">
          {/* Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-container)] flex items-center justify-center shadow-sm">
              <Globe2 size={18} className="text-white" />
            </div>
            <span className="hidden sm:block font-bold text-xl tracking-tight" style={{ fontFamily: 'Montserrat, sans-serif', color: 'var(--color-primary)' }}>
              GlobeTrotter
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 ml-6">
            {navLinks.map(({ to, label, icon: Icon, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                      : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] hover:text-[var(--color-on-surface)]'
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Admin link (admins only) */}
          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)]'
                }`
              }
            >
              <Shield size={14} />
              Admin
            </NavLink>
          )}

          {/* Currency selector */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            aria-label="Display currency"
            className="hidden sm:block text-xs font-semibold px-2 py-2 rounded-xl bg-[var(--color-surface-container)] text-[var(--color-on-surface)] border border-[var(--color-outline-variant)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 cursor-pointer"
          >
            {['USD', 'INR', 'EUR', 'GBP', 'JPY', 'AED'].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Notifications */}
          <button
            className="hidden sm:flex w-9 h-9 rounded-xl items-center justify-center text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] hover:text-[var(--color-on-surface)] transition-all"
            aria-label="Notifications"
          >
            <Bell size={18} />
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((p) => !p)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-[var(--color-surface-container)] transition-all"
              aria-label="Profile menu"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[var(--color-primary)]/20 bg-[var(--color-primary-fixed)]">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm font-bold text-[var(--color-primary)]">
                    {user?.name?.[0]}
                  </div>
                )}
              </div>
              <span className="hidden lg:block text-sm font-medium text-[var(--color-on-surface)]">
                {user?.name}
              </span>
              <ChevronDown size={14} className={`hidden lg:block text-[var(--color-on-surface-variant)] transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-[var(--color-surface-container-lowest)] rounded-2xl shadow-lg border border-[var(--color-outline-variant)]/50 overflow-hidden z-50">
                <div className="p-3 border-b border-[var(--color-surface-container)]">
                  <p className="text-sm font-semibold text-[var(--color-on-surface)]">{user?.name}</p>
                  <p className="text-xs text-[var(--color-on-surface-variant)] truncate">{user?.email}</p>
                </div>
                <div className="p-1.5">
                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] hover:text-[var(--color-on-surface)] transition-all"
                  >
                    <User size={15} /> My Profile
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] hover:text-[var(--color-on-surface)] transition-all"
                  >
                    <Settings size={15} /> Settings
                  </Link>
                  <button
                    onClick={() => { setProfileOpen(false); setLogoutModal(true); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-[var(--color-error)] hover:bg-[var(--color-error-container)]/50 transition-all"
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] transition-all"
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Toggle mobile menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="md:hidden bg-[var(--color-surface-container-lowest)] border-t border-[var(--color-outline-variant)]/30 px-4 py-3">
            <nav className="flex flex-col gap-1">
              {navLinks.map(({ to, label, icon: Icon, exact }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={exact}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)]'
                    }`
                  }
                >
                  <Icon size={18} />
                  {label}
                </NavLink>
              ))}
              {user?.role === 'admin' && (
                <NavLink
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)]'}`
                  }
                >
                  <Shield size={18} /> Admin
                </NavLink>
              )}
              <NavLink
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] transition-all"
              >
                <User size={18} /> Profile
              </NavLink>
              <button
                onClick={() => { setMenuOpen(false); setLogoutModal(true); }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[var(--color-error)] hover:bg-[var(--color-error-container)]/50 transition-all"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </nav>
          </div>
        )}
      </header>

      <Modal
        isOpen={logoutModal}
        onClose={() => setLogoutModal(false)}
        title="Sign Out"
        description="Are you sure you want to sign out of GlobeTrotter?"
        confirmLabel="Sign Out"
        confirmVariant="danger"
        onConfirm={handleLogout}
      />
    </>
  );
}
