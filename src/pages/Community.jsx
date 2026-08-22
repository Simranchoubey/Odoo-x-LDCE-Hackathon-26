import { useState } from 'react';
import { Heart, MessageCircle, Share2, Globe, Users, Compass, Info } from 'lucide-react';
import TopBar from '../components/TopBar';
import SearchFilterBar from '../components/SearchFilterBar';
import { communityPosts } from '../data/trips';

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Most Liked' },
];

function timeAgo(timestamp) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function Community() {
  const [posts, setPosts] = useState(communityPosts);
  const [search, setSearch] = useState('');
  const [sortValue, setSortValue] = useState('latest');

  const handleLike = (id) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  let filtered = posts.filter(
    (p) =>
      !search ||
      p.content.toLowerCase().includes(search.toLowerCase()) ||
      p.destination?.toLowerCase().includes(search.toLowerCase()) ||
      p.userName.toLowerCase().includes(search.toLowerCase())
  );

  if (sortValue === 'popular') filtered = [...filtered].sort((a, b) => b.likes - a.likes);
  if (sortValue === 'latest') filtered = [...filtered].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <TopBar />
      <main className="pt-16">
        <div className="max-w-5xl mx-auto px-5 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Feed */}
            <div className="lg:col-span-2">
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-3xl font-black text-[var(--color-on-surface)]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  🌐 Community
                </h1>
                <p className="text-[var(--color-on-surface-variant)] mt-1">Travel experiences and stories from the community</p>
              </div>

              {/* Search + Sort */}
              <div className="mb-6">
                <SearchFilterBar
                  searchValue={search}
                  onSearchChange={setSearch}
                  sortOptions={SORT_OPTIONS}
                  sortValue={sortValue}
                  onSortChange={setSortValue}
                  placeholder="Search posts, destinations..."
                />
              </div>

              {/* Posts */}
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center bg-[var(--color-surface-container-lowest)] rounded-2xl border border-dashed border-[var(--color-outline-variant)]/40">
                  <Users size={40} className="text-[var(--color-on-surface-variant)]/30 mb-3" />
                  <h3 className="text-base font-bold text-[var(--color-on-surface-variant)] mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    No posts found
                  </h3>
                  <p className="text-sm text-[var(--color-on-surface-variant)]/70">Try a different search</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {filtered.map((post) => (
                    <PostCard key={post.id} post={post} onLike={() => handleLike(post.id)} />
                  ))}
                </div>
              )}
            </div>

            {/* Right Info Panel */}
            <aside className="hidden lg:block">
              <div className="sticky top-20 flex flex-col gap-4">
                {/* About panel */}
                <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-5 card-shadow border border-[var(--color-outline-variant)]/30">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                      <Globe size={16} className="text-[var(--color-primary)]" />
                    </div>
                    <h3 className="text-base font-bold text-[var(--color-on-surface)]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      About Community
                    </h3>
                  </div>
                  <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                    Share your travel stories, tips, and hidden gems with fellow adventurers. Inspire and be inspired — together we explore more of the world.
                  </p>
                </div>

                {/* Stats */}
                <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-5 card-shadow border border-[var(--color-outline-variant)]/30">
                  <h3 className="text-sm font-bold text-[var(--color-on-surface)] mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Community Stats
                  </h3>
                  <div className="flex flex-col gap-3">
                    {[
                      { label: 'Active Travelers', value: '2,847', icon: <Users size={14} /> },
                      { label: 'Stories Shared', value: '12,431', icon: <Globe size={14} /> },
                      { label: 'Destinations', value: '148', icon: <Compass size={14} /> },
                    ].map(({ label, value, icon }) => (
                      <div key={label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-[var(--color-on-surface-variant)]">
                          <span className="text-[var(--color-primary)]">{icon}</span>
                          {label}
                        </div>
                        <span className="text-sm font-bold text-[var(--color-on-surface)]">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Guidelines */}
                <div className="bg-[var(--color-primary)]/5 rounded-2xl p-4 border border-[var(--color-primary)]/15">
                  <div className="flex items-start gap-2">
                    <Info size={14} className="text-[var(--color-primary)] mt-0.5 shrink-0" />
                    <p className="text-xs text-[var(--color-on-surface-variant)] leading-relaxed">
                      Keep it respectful and inspiring! Share authentic experiences, useful tips, and beautiful memories from your journeys.
                    </p>
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

function PostCard({ post, onLike }) {
  const [showFull, setShowFull] = useState(false);
  const isLong = post.content.length > 200;

  return (
    <article className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-5 card-shadow border border-[var(--color-outline-variant)]/30 hover:card-shadow-hover transition-all duration-200">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-[var(--color-surface-container)]">
          <img src={post.userAvatar || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=100&q=80'} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=100&q=80'; }} alt={post.userName} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[var(--color-on-surface)]">{post.userName}</p>
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-on-surface-variant)]">
            <span>📍 {post.destination}</span>
            <span>·</span>
            <span>{timeAgo(post.timestamp)}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <p className="text-sm text-[var(--color-on-surface)] leading-relaxed mb-3">
        {isLong && !showFull ? post.content.slice(0, 200) + '...' : post.content}
        {isLong && (
          <button
            onClick={() => setShowFull((p) => !p)}
            className="text-[var(--color-primary)] font-semibold ml-1 hover:underline"
          >
            {showFull ? 'less' : 'more'}
          </button>
        )}
      </p>

      {/* Image */}
      {post.image && (
        <div className="rounded-xl overflow-hidden mb-4 max-h-64">
          <img src={post.image} alt="Post" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80'; }} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-3 border-t border-[var(--color-surface-container)]">
        <button
          onClick={onLike}
          className={`flex items-center gap-1.5 text-sm font-medium transition-all ${post.liked ? 'text-red-500' : 'text-[var(--color-on-surface-variant)] hover:text-red-500'}`}
        >
          <Heart size={16} fill={post.liked ? 'currentColor' : 'none'} />
          {post.likes}
        </button>
        <button className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">
          <MessageCircle size={16} />
          {post.comments}
        </button>
        <button className="ml-auto flex items-center gap-1.5 text-sm font-medium text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">
          <Share2 size={16} />
          Share
        </button>
      </div>
    </article>
  );
}
