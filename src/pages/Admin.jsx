import { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend,
  BarChart, Bar,
} from 'recharts';
import {
  Users, MapPin, Activity, TrendingUp, Shield, Info,
} from 'lucide-react';
import TopBar from '../components/TopBar';
import SearchFilterBar from '../components/SearchFilterBar';
import { analyticsData } from '../data/trips';
import { api } from '../api/client';

const TABS = [
  { id: 'analytics', label: 'User Trends & Analytics', icon: TrendingUp },
  { id: 'users', label: 'Manage Users', icon: Users },
  { id: 'cities', label: 'Popular Cities', icon: MapPin },
  { id: 'activities', label: 'Popular Activities', icon: Activity },
];

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export default function Admin() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/admin/stats')
      .then(setStats)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <TopBar />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                  <Shield size={16} className="text-[var(--color-primary)]" />
                </div>
                <h1 className="text-3xl font-black text-[var(--color-on-surface)]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Admin Panel
                </h1>
              </div>
              <p className="text-[var(--color-on-surface-variant)]">Manage users, content, and analyze platform trends</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              Failed to load admin data: {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Search */}
              <div className="mb-4">
                <SearchFilterBar
                  searchValue={search}
                  onSearchChange={setSearch}
                  placeholder="Search admin panel..."
                />
              </div>

              {/* Tabs */}
              <div className="flex gap-1 bg-[var(--color-surface-container)] rounded-2xl p-1.5 mb-6 overflow-x-auto scrollbar-hide">
                {TABS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                      activeTab === id
                        ? 'bg-[var(--color-surface-container-lowest)] text-[var(--color-primary)] shadow-sm'
                        : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'
                    }`}
                  >
                    <Icon size={15} />
                    <span className="hidden sm:block">{label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'analytics' && <AnalyticsTab stats={stats} />}
              {activeTab === 'users' && <UsersTab users={stats?.users || []} search={search} />}
              {activeTab === 'cities' && <CitiesTab cities={stats?.topCities || []} />}
              {activeTab === 'activities' && <ActivitiesTab activities={stats?.topActivities || []} />}
            </div>

            {/* Right Info Panel */}
            <aside className="hidden lg:block">
              <div className="sticky top-20 flex flex-col gap-4">
                {/* Quick Stats */}
                <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-5 card-shadow border border-[var(--color-outline-variant)]/30">
                  <h3 className="text-sm font-bold text-[var(--color-on-surface)] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Platform Overview
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {(stats
                      ? [
                          { label: 'Total Users', value: String(stats.totals.users) },
                          { label: 'Total Trips', value: String(stats.totals.trips) },
                          { label: 'Public Trips', value: String(stats.totals.publicTrips) },
                          { label: 'New Users (30d)', value: String(stats.totals.newUsers30d) },
                        ]
                      : [{ label: 'Loading…', value: '—' }]
                    ).map(({ label, value }) => (
                      <div key={label} className="bg-[var(--color-surface-container)] rounded-xl p-3">
                        <p className="text-lg font-black text-[var(--color-primary)]" style={{ fontFamily: 'Montserrat, sans-serif' }}>{value}</p>
                        <p className="text-xs text-[var(--color-on-surface-variant)]">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* About each tab */}
                <div className="bg-[var(--color-primary)]/5 rounded-2xl p-4 border border-[var(--color-primary)]/15">
                  <div className="flex items-start gap-2">
                    <Info size={14} className="text-[var(--color-primary)] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-[var(--color-on-surface)] mb-1">
                        {activeTab === 'analytics' ? 'Analytics Tab' :
                         activeTab === 'users' ? 'User Management' :
                         activeTab === 'cities' ? 'Popular Cities' : 'Popular Activities'}
                      </p>
                      <p className="text-xs text-[var(--color-on-surface-variant)] leading-relaxed">
                        {activeTab === 'analytics' ? 'Track trip trends and popular destinations over time to make data-driven decisions.' :
                         activeTab === 'users' ? 'All registered travelers with their roles, trip counts, and join dates — straight from the database.' :
                         activeTab === 'cities' ? 'Destinations ranked by how many itinerary stops include them.' :
                         'Activities ranked by how often they are added to itineraries.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

function AnalyticsTab({ stats }) {
  const summary = stats
    ? [
        { label: 'New Users (30d)', value: String(stats.totals.newUsers30d), color: 'text-[var(--color-primary)]' },
        { label: 'Trips Created', value: String(stats.totals.trips), color: 'text-teal-600' },
        { label: 'Avg Trips/User', value: String(stats.totals.avgTripsPerUser), color: 'text-purple-600' },
        { label: 'Itinerary Items', value: String(stats.totals.itineraryItems), color: 'text-amber-600' },
      ]
    : [];

  return (
    <div className="flex flex-col gap-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(summary.length ? summary : [{ label: 'Loading…', value: '—', color: '' }]).map(({ label, value, color }) => (
          <div key={label} className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-4 card-shadow border border-[var(--color-outline-variant)]/30">
            <p className={`text-2xl font-black ${color}`} style={{ fontFamily: 'Montserrat, sans-serif' }}>{value}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Line Chart */}
      <ChartCard title="📈 User Growth (2024)">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={analyticsData.userGrowth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e9e8e5" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#59413a' }} />
            <YAxis tick={{ fontSize: 12, fill: '#59413a' }} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e0bfb6', fontSize: 12 }} />
            <Line type="monotone" dataKey="users" stroke="#ac3509" strokeWidth={2.5} dot={{ fill: '#ac3509', r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <ChartCard title="🌍 Trips by Status">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={(stats?.tripsByStatus || []).map((s, i) => ({
                  name: s.status,
                  value: s.count,
                  color: ['#ac3509', '#e0bfb6', '#2dd4bf', '#a78bfa'][i % 4],
                }))}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                paddingAngle={3}
              >
                {(stats?.tripsByStatus || []).map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={['#ac3509', '#e0bfb6', '#2dd4bf', '#a78bfa'][i % 4]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e0bfb6', fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Bar Chart */}
        <ChartCard title="🎯 Popular Activities">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={(stats?.topActivities || []).map((a) => ({ name: a.name.split(' ').slice(0, 2).join(' '), count: a.usage }))}
              layout="vertical"
              margin={{ left: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e9e8e5" horizontal={false} />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#59413a' }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#59413a' }} width={60} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e0bfb6', fontSize: 12 }} />
              <Bar dataKey="count" fill="#ac3509" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Top Cities list */}
      <ChartCard title="🏙 Top Destinations">
        <div className="flex flex-col gap-2">
          {(stats?.topCities || []).map(({ name, country, visits }, i) => (
            <div key={`${name}-${country}`} className="flex items-center gap-3">
              <span className="text-xs font-bold text-[var(--color-on-surface-variant)]/60 w-4">{i + 1}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-[var(--color-on-surface)]">{name}, {country}</span>
                  <span className="text-sm font-bold text-[var(--color-primary)]">{visits}</span>
                </div>
                <div className="h-1.5 bg-[var(--color-surface-container)] rounded-full">
                  <div
                    className="h-full bg-[var(--color-primary)] rounded-full"
                    style={{ width: `${(visits / (stats.topCities[0].visits || 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
          {!stats && <p className="text-sm text-[var(--color-on-surface-variant)]">Loading…</p>}
        </div>
      </ChartCard>
    </div>
  );
}

function UsersTab({ users, search }) {
  const filtered = users.filter(
    (u) =>
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl border border-[var(--color-outline-variant)]/30 card-shadow overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-3 px-5 py-3 border-b border-[var(--color-surface-container)] bg-[var(--color-surface-container-low)]">
        <div className="col-span-5 text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider">User</div>
        <div className="col-span-2 text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider">Trips</div>
        <div className="col-span-3 text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider hidden sm:block">Joined</div>
        <div className="col-span-2 text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider hidden md:block">Role</div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-12 text-center text-sm text-[var(--color-on-surface-variant)]">No users found</div>
      ) : (
        filtered.map((user) => (
          <div key={user.id} className="grid grid-cols-12 gap-3 px-5 py-4 border-b border-[var(--color-surface-container)] last:border-b-0 hover:bg-[var(--color-surface-container-low)] transition-colors items-center">
            <div className="col-span-5 flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-[var(--color-surface-container)] flex items-center justify-center">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-bold text-[var(--color-primary)]">{user.name?.[0]?.toUpperCase()}</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--color-on-surface)] truncate">{user.name}</p>
                <p className="text-xs text-[var(--color-on-surface-variant)] truncate">{user.email}</p>
              </div>
            </div>
            <div className="col-span-2 text-sm font-semibold text-[var(--color-on-surface)]">{user.tripsCount}</div>
            <div className="col-span-3 hidden sm:block text-sm text-[var(--color-on-surface-variant)]">
              {fmtDate(user.joinedAt)}
            </div>
            <div className="col-span-2 hidden md:block">
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                user.role === 'admin'
                  ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20'
                  : 'bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]'
              }`}>
                {user.role}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function CitiesTab({ cities }) {
  return (
    <div className="flex flex-col gap-3">
      {cities.length === 0 && <p className="text-sm text-[var(--color-on-surface-variant)]">Loading…</p>}
      {cities.map(({ name, country, visits }) => (
        <div key={`${name}-${country}`} className="flex items-center gap-4 bg-[var(--color-surface-container-lowest)] rounded-2xl p-4 card-shadow border border-[var(--color-outline-variant)]/30">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] font-bold text-sm shrink-0">
            <MapPin size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-[var(--color-on-surface)]" style={{ fontFamily: 'Montserrat, sans-serif' }}>{name}, {country}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-2 bg-[var(--color-surface-container)] rounded-full">
                <div
                  className="h-full bg-[var(--color-primary)] rounded-full"
                  style={{ width: `${(visits / (cities[0]?.visits || 1)) * 100}%` }}
                />
              </div>
              <span className="text-xs text-[var(--color-on-surface-variant)] shrink-0">{visits} stops</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ActivitiesTab({ activities }) {
  const max = activities[0]?.usage || 1;
  return (
    <div className="flex flex-col gap-3">
      {activities.length === 0 && <p className="text-sm text-[var(--color-on-surface-variant)]">Loading…</p>}
      {activities.map(({ name, category, city, usage }) => (
        <div key={name} className="flex items-center gap-4 bg-[var(--color-surface-container-lowest)] rounded-2xl p-4 card-shadow border border-[var(--color-outline-variant)]/30">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] font-bold text-xs shrink-0 uppercase">
            {category?.slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-[var(--color-on-surface)] truncate" style={{ fontFamily: 'Montserrat, sans-serif' }}>{name}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)]">{city} · {category}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-2 bg-[var(--color-surface-container)] rounded-full">
                <div
                  className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-container)] rounded-full"
                  style={{ width: `${(usage / max) * 100}%` }}
                />
              </div>
              <span className="text-xs text-[var(--color-on-surface-variant)] shrink-0">{usage}×</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-5 card-shadow border border-[var(--color-outline-variant)]/30">
      <h3 className="text-base font-bold text-[var(--color-on-surface)] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        {title}
      </h3>
      {children}
    </div>
  );
}
