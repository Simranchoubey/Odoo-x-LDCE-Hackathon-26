import { useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend,
  BarChart, Bar,
} from 'recharts';
import {
  Users, MapPin, Activity, TrendingUp, Shield, Info,
  MoreVertical, UserCheck, UserX, Trash2, Edit,
} from 'lucide-react';
import TopBar from '../components/TopBar';
import SearchFilterBar from '../components/SearchFilterBar';
import { analyticsData } from '../data/trips';
import { users } from '../data/users';

const TABS = [
  { id: 'analytics', label: 'User Trends & Analytics', icon: TrendingUp },
  { id: 'users', label: 'Manage Users', icon: Users },
  { id: 'cities', label: 'Popular Cities', icon: MapPin },
  { id: 'activities', label: 'Popular Activities', icon: Activity },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [search, setSearch] = useState('');

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
              {activeTab === 'analytics' && <AnalyticsTab />}
              {activeTab === 'users' && <UsersTab search={search} />}
              {activeTab === 'cities' && <CitiesTab />}
              {activeTab === 'activities' && <ActivitiesTab />}
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
                    {[
                      { label: 'Total Users', value: '2,847', delta: '+8%' },
                      { label: 'Active Trips', value: '1,203', delta: '+12%' },
                      { label: 'Cities', value: '148', delta: '+3%' },
                      { label: 'Activities', value: '892', delta: '+5%' },
                    ].map(({ label, value, delta }) => (
                      <div key={label} className="bg-[var(--color-surface-container)] rounded-xl p-3">
                        <p className="text-lg font-black text-[var(--color-primary)]" style={{ fontFamily: 'Montserrat, sans-serif' }}>{value}</p>
                        <p className="text-xs text-[var(--color-on-surface-variant)]">{label}</p>
                        <p className="text-xs text-emerald-600 font-semibold mt-0.5">{delta} this month</p>
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
                        {activeTab === 'analytics' ? 'Track user growth, trip trends, and popular destinations over time to make data-driven decisions.' :
                         activeTab === 'users' ? 'Manage user accounts, update status, and view activity data for all registered travelers.' :
                         activeTab === 'cities' ? 'Monitor which destinations are trending and how many trips are planned to each city.' :
                         'Discover which activities are most popular and adjust recommendations accordingly.'}
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

function AnalyticsTab() {
  return (
    <div className="flex flex-col gap-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'New Users (Aug)', value: '350', color: 'text-[var(--color-primary)]' },
          { label: 'Trips Created', value: '891', color: 'text-teal-600' },
          { label: 'Avg Trips/User', value: '3.2', color: 'text-purple-600' },
          { label: 'Revenue', value: '$48K', color: 'text-amber-600' },
        ].map(({ label, value, color }) => (
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
        <ChartCard title="🌍 Trip Categories">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={analyticsData.tripsByCategory} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                {analyticsData.tripsByCategory.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e0bfb6', fontSize: 12 }} formatter={(v, n) => [`${v}%`, n]} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Bar Chart */}
        <ChartCard title="🎯 Popular Activities">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analyticsData.popularActivities} layout="vertical" margin={{ left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9e8e5" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#59413a' }} />
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
          {analyticsData.topCities.map(({ city, trips, growth }, i) => (
            <div key={city} className="flex items-center gap-3">
              <span className="text-xs font-bold text-[var(--color-on-surface-variant)]/60 w-4">{i + 1}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-[var(--color-on-surface)]">{city}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-emerald-600 font-semibold">{growth}</span>
                    <span className="text-sm font-bold text-[var(--color-primary)]">{trips}</span>
                  </div>
                </div>
                <div className="h-1.5 bg-[var(--color-surface-container)] rounded-full">
                  <div
                    className="h-full bg-[var(--color-primary)] rounded-full"
                    style={{ width: `${(trips / analyticsData.topCities[0].trips) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}

function UsersTab({ search }) {
  const [userList, setUserList] = useState(users);

  const filtered = userList.filter(
    (u) =>
      !search ||
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id) => {
    setUserList((prev) =>
      prev.map((u) => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u)
    );
  };

  return (
    <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl border border-[var(--color-outline-variant)]/30 card-shadow overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-3 px-5 py-3 border-b border-[var(--color-surface-container)] bg-[var(--color-surface-container-low)]">
        <div className="col-span-4 text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider">User</div>
        <div className="col-span-3 text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider hidden sm:block">Location</div>
        <div className="col-span-2 text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider">Status</div>
        <div className="col-span-2 text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider hidden md:block">Role</div>
        <div className="col-span-1 text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider">•••</div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-12 text-center text-sm text-[var(--color-on-surface-variant)]">No users found</div>
      ) : (
        filtered.map((user) => (
          <div key={user.id} className="grid grid-cols-12 gap-3 px-5 py-4 border-b border-[var(--color-surface-container)] last:border-b-0 hover:bg-[var(--color-surface-container-low)] transition-colors items-center">
            <div className="col-span-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-[var(--color-surface-container)]">
                <img src={user.avatar} alt={user.firstName} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--color-on-surface)] truncate">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-[var(--color-on-surface-variant)] truncate">{user.email}</p>
              </div>
            </div>
            <div className="col-span-3 hidden sm:block text-sm text-[var(--color-on-surface-variant)] truncate">
              {user.city}, {user.country}
            </div>
            <div className="col-span-2">
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                user.status === 'active'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] border border-[var(--color-outline-variant)]/50'
              }`}>
                {user.status}
              </span>
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
            <div className="col-span-1 flex items-center gap-1">
              <button
                onClick={() => toggleStatus(user.id)}
                className="p-1.5 rounded-lg hover:bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-all"
                aria-label={user.status === 'active' ? 'Deactivate user' : 'Activate user'}
              >
                {user.status === 'active' ? <UserX size={14} /> : <UserCheck size={14} />}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function CitiesTab() {
  const { topCities } = analyticsData;
  return (
    <div className="flex flex-col gap-3">
      {topCities.map(({ city, trips, growth }, i) => (
        <div key={city} className="flex items-center gap-4 bg-[var(--color-surface-container-lowest)] rounded-2xl p-4 card-shadow border border-[var(--color-outline-variant)]/30">
          <div className="w-8 h-8 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] font-bold text-sm shrink-0">
            {i + 1}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-[var(--color-on-surface)]" style={{ fontFamily: 'Montserrat, sans-serif' }}>{city}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-2 bg-[var(--color-surface-container)] rounded-full">
                <div
                  className="h-full bg-[var(--color-primary)] rounded-full"
                  style={{ width: `${(trips / topCities[0].trips) * 100}%` }}
                />
              </div>
              <span className="text-xs text-[var(--color-on-surface-variant)] shrink-0">{trips} trips</span>
            </div>
          </div>
          <span className="text-sm font-bold text-emerald-600 shrink-0">{growth}</span>
        </div>
      ))}
    </div>
  );
}

function ActivitiesTab() {
  const { popularActivities } = analyticsData;
  const max = popularActivities[0].count;
  return (
    <div className="flex flex-col gap-3">
      {popularActivities.map(({ name, count }, i) => (
        <div key={name} className="flex items-center gap-4 bg-[var(--color-surface-container-lowest)] rounded-2xl p-4 card-shadow border border-[var(--color-outline-variant)]/30">
          <div className="w-8 h-8 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] font-bold text-sm shrink-0">
            {i + 1}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-[var(--color-on-surface)]" style={{ fontFamily: 'Montserrat, sans-serif' }}>{name}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-2 bg-[var(--color-surface-container)] rounded-full">
                <div
                  className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-container)] rounded-full"
                  style={{ width: `${(count / max) * 100}%` }}
                />
              </div>
              <span className="text-xs text-[var(--color-on-surface-variant)] shrink-0">{count.toLocaleString()}</span>
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
