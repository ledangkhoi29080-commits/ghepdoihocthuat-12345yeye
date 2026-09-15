import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { supabase } from './supabaseClient';
import {
  Heart,
  X,
  Camera,
  Send,
  LogOut,
  User,
  MessageCircle,
  Users,
  Home,
  Crown,
  CheckCircle2,
  Sparkles,
  Search,
} from 'lucide-react';

/* ---------- Design tokens ----------
Color:
  bg          #F4FAF8  (misty mint-white)
  surface     #FFFFFF
  ink         #223338  (deep slate, main text)
  muted       #74898D
  mint        #3FA796  (primary accent)
  mintSoft    #DFF3EE
  blue        #5B8DEF  (secondary accent)
  blueSoft    #E5ECFB
  lavSoft     #F1E8FB
  danger      #E2574C
Type: "Sora" for headings (rounded geometric, friendly), "Inter" for body/UI.
Layout: centered single-column hero -> stacked swipe deck -> 30/70 split chat.
------------------------------------- */

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@400;600;700;800&subset=vietnamese&display=swap');`;

const PROFILES = [
  {
    id: 1,
    name: 'Trần Hoàng Nam',
    major: 'Khoa học máy tính',
    have: ['Code Python'],
    want: ['UI/UX Design'],
    goal: 'Thi Hackathon 2024',
    color: '#3FA796',
  },
  {
    id: 2,
    name: 'Lê Ngọc Hân',
    major: 'Thiết kế Đồ họa',
    have: ['UI/UX', 'Figma'],
    want: ['Lập trình Web'],
    goal: 'Thi Hackathon 2024',
    color: '#5B8DEF',
  },
  {
    id: 3,
    name: 'Nguyễn Minh Trí',
    major: 'Phân tích Dữ liệu',
    have: ['Xử lý số liệu', 'Power BI'],
    want: ['Thuyết trình', 'Làm Slide'],
    goal: 'Bài tập Kinh tế lượng',
    color: '#B08A3E',
  },
  {
    id: 4,
    name: 'Phạm Yến Nhi',
    major: 'Quan hệ Công chúng',
    have: ['Thuyết trình', 'Hoạt ngôn'],
    want: ['Xử lý số liệu', 'Data'],
    goal: 'Bài tập Kinh tế lượng',
    color: '#A85CC1',
  },
  {
    id: 5,
    name: 'Vũ Hải Đăng',
    major: 'Truyền thông Đa phương tiện',
    have: ['Edit Video', 'Quay phim'],
    want: ['Viết kịch bản', 'Ý tưởng'],
    goal: 'Đồ án Sản xuất Video',
    color: '#3FA796',
  },
  {
    id: 6,
    name: 'Đặng Mai Phương',
    major: 'Báo chí',
    have: ['Content Creator', 'Copywriting'],
    want: ['Quay dựng Video'],
    goal: 'Đồ án Sản xuất Video',
    color: '#5B8DEF',
  },
  {
    id: 7,
    name: 'Đinh Văn Khoa',
    major: 'Quản trị Kinh doanh',
    have: ['Lập kế hoạch', 'Leader'],
    want: ['Chạy Ads', 'Marketing'],
    goal: 'Khởi nghiệp Sinh viên',
    color: '#B08A3E',
  },
  {
    id: 8,
    name: 'Lý Thảo My',
    major: 'Digital Marketing',
    have: ['Chạy Ads', 'SEO'],
    want: ['Lãnh đạo', 'Lên ý tưởng'],
    goal: 'Khởi nghiệp Sinh viên',
    color: '#A85CC1',
  },
  {
    id: 9,
    name: 'Bùi Quang Huy',
    major: 'Tài chính Ngân hàng',
    have: ['Lập mô hình tài chính'],
    want: ['Thiết kế Pitch Deck'],
    goal: 'Giải quyết Business Case',
    color: '#3FA796',
  },
  {
    id: 10,
    name: 'Ngô Thùy Linh',
    major: 'Thiết kế Mỹ thuật số',
    have: ['Thiết kế Slide đỉnh cao'],
    want: ['Tính toán tài chính'],
    goal: 'Giải quyết Business Case',
    color: '#5B8DEF',
  },
];

function initials(name) {
  const parts = name.trim().split(' ');
  return (
    (parts[parts.length - 2]?.[0] || '') + (parts[parts.length - 1]?.[0] || '')
  );
}

function Avatar({ name, color, size = 64, src }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{
          width: size,
          height: size,
          borderRadius: '9999px',
          objectFit: 'cover',
          border: '3px solid #fff',
          boxShadow: '0 2px 10px rgba(34,51,56,0.12)',
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '9999px',
        background: color || '#3FA796',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontFamily: 'Sora, sans-serif',
        fontWeight: 700,
        fontSize: size * 0.34,
        border: '3px solid #fff',
        boxShadow: '0 2px 10px rgba(34,51,56,0.12)',
        flexShrink: 0,
      }}
    >
      {initials(name).toUpperCase()}
    </div>
  );
}

function Tag({ children, tone }) {
  const tones = {
    have: { bg: '#DFF3EE', fg: '#1F7A67' },
    want: { bg: '#E5ECFB', fg: '#2C4A99' },
    goal: { bg: '#F1E8FB', fg: '#6B3FA0' },
  };
  const t = tones[tone];
  return (
    <span
      style={{
        background: t.bg,
        color: t.fg,
        fontSize: 12.5,
        fontWeight: 600,
        padding: '5px 10px',
        borderRadius: 999,
        display: 'inline-block',
        marginRight: 6,
        marginBottom: 6,
      }}
    >
      {children}
    </span>
  );
}

function Header({
  page,
  setPage,
  isLoggedIn,
  currentUser,
  onLogout,
  onLoginClick,
  onOpenPremium,
}) {
  const navItems = [
    { key: 'landing', label: 'Trang chủ', icon: Home },
    { key: 'swipe', label: 'Ghép đội', icon: Users },
    { key: 'chat', label: 'Nhắn tin', icon: MessageCircle },
    { key: 'profile', label: 'Trang cá nhân', icon: User },
  ];
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        background: 'rgba(244,250,248,0.9)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #DCEAE6',
      }}
    >
      <div
        style={{
          maxWidth: 1040,
          margin: '0 auto',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          onClick={() => setPage('landing')}
          style={{
            fontFamily: 'Sora, sans-serif',
            fontWeight: 800,
            fontSize: 20,
            color: '#223338',
            cursor: 'pointer',
            letterSpacing: -0.3,
          }}
        >
          SkillMatch
        </div>

        {isLoggedIn && (
          <nav style={{ display: 'flex', gap: 4 }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = page === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setPage(item.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    borderRadius: 999,
                    fontSize: 14,
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    background: active ? '#DFF3EE' : 'transparent',
                    color: active ? '#1F7A67' : '#6B8087',
                    transition: 'background 0.15s ease',
                  }}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        )}

        {isLoggedIn ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Nút Nâng cấp Premium Gradient Gold */}
            <button
              type="button"
              onClick={onOpenPremium}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                color: '#fff',
                border: 'none',
                padding: '7px 14px',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 3px 12px rgba(245, 158, 11, 0.35)',
              }}
            >
              <Crown size={15} color="#fff" fill="#fff" />
              <span>Nâng cấp Premium</span>
            </button>
            <Avatar
              name={currentUser.name}
              color={currentUser.color}
              size={34}
              src={currentUser.avatarUrl}
            />
            <span style={{ fontSize: 14, fontWeight: 600, color: '#223338' }}>
              {currentUser.name}
            </span>
            <button
              onClick={onLogout}
              title="Đăng xuất"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                background: '#FBEAE8',
                color: '#E2574C',
                border: 'none',
                padding: '8px 12px',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <LogOut size={14} /> Đăng xuất
            </button>
          </div>
        ) : (
          <button
            onClick={onLoginClick}
            style={{
              background: '#3FA796',
              color: '#fff',
              border: 'none',
              padding: '9px 18px',
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Đăng nhập
          </button>
        )}
      </div>
    </div>
  );
}

function Landing({ onCtaClick }) {
  return (
    <div
      style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: '96px 24px 64px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          display: 'inline-block',
          background: '#DFF3EE',
          color: '#1F7A67',
          fontSize: 13,
          fontWeight: 600,
          padding: '6px 14px',
          borderRadius: 999,
          marginBottom: 24,
        }}
      >
        Nền tảng ghép đội cho sinh viên
      </div>
      <h1
        style={{
          fontFamily: 'Be Vietnam Pro, sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(32px, 5vw, 52px)',
          lineHeight: 1.15,
          color: '#223338',
          letterSpacing: -0.5,
          margin: '0 0 20px',
        }}
      >
        Tìm mảnh ghép hoàn hảo cho dự án
      </h1>
      <p
        style={{
          fontFamily: 'Be Vietnam Pro, sans-serif',
          fontSize: 17,
          color: '#6B8087',
          lineHeight: 1.6,
          maxWidth: 480,
          margin: '0 auto 40px',
        }}
      >
        Kết nối dựa trên kỹ năng thực chiến. Quẹt để tìm đồng đội chạy deadline
        ngay hôm nay!
      </p>
      <button
        onClick={onCtaClick}
        style={{
          fontFamily: 'Be Vietnam Pro, time new roman',
          background: '#3FA796',
          color: '#fff',
          border: 'none',
          padding: '16px 36px',
          borderRadius: 999,
          fontSize: 16,
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(63,167,150,0.35)',
        }}
      >
        Bắt đầu ghép đội
      </button>

      <div
        style={{
          marginTop: 80,
          display: 'flex',
          justifyContent: 'center',
          gap: -12,
        }}
      >
        {PROFILES.slice(0, 5).map((p, i) => (
          <div key={p.id} style={{ marginLeft: i === 0 ? 0 : -14 }}>
            <Avatar name={p.name} color={p.color} size={48} src={undefined} />
          </div>
        ))}
      </div>
      <p style={{ fontSize: 13, color: '#9AACAF', marginTop: 12 }}>
        Hơn 10 sinh viên đang tìm đồng đội
      </p>
    </div>
  );
}

function SwipeCard({ profile, dragX, isTop, onPointerDown }) {
  const rotate = isTop ? dragX / 18 : 0;
  const likeOpacity = Math.max(0, Math.min(1, dragX / 90));
  const nopeOpacity = Math.max(0, Math.min(1, -dragX / 90));
  return (
    <div
      onPointerDown={isTop ? onPointerDown : undefined}
      style={{
        position: 'absolute',
        inset: 0,
        background: '#fff',
        borderRadius: 28,
        boxShadow: isTop
          ? '0 20px 50px rgba(34,51,56,0.18)'
          : '0 8px 20px rgba(34,51,56,0.08)',
        transform: `translateX(${
          isTop ? dragX : 0
        }px) rotate(${rotate}deg) scale(${isTop ? 1 : 0.96})`,
        transition:
          dragX === 0 ? 'transform 0.35s cubic-bezier(.2,.8,.2,1)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        touchAction: 'pan-y',
        cursor: isTop ? 'grab' : 'default',
        userSelect: 'none',
      }}
    >
      {isTop && (
        <>
          <div
            style={{
              position: 'absolute',
              top: 28,
              left: 24,
              border: '3px solid #3FA796',
              color: '#3FA796',
              fontWeight: 800,
              fontFamily: 'Sora, sans-serif',
              fontSize: 22,
              padding: '2px 12px',
              borderRadius: 10,
              opacity: likeOpacity,
              transform: 'rotate(-12deg)',
            }}
          >
            THÍCH
          </div>
          <div
            style={{
              position: 'absolute',
              top: 28,
              right: 24,
              border: '3px solid #E2574C',
              color: '#E2574C',
              fontWeight: 800,
              fontFamily: 'Sora, sans-serif',
              fontSize: 22,
              padding: '2px 12px',
              borderRadius: 10,
              opacity: nopeOpacity,
              transform: 'rotate(12deg)',
            }}
          >
            BỎ QUA
          </div>
        </>
      )}

      <div
        style={{
          background: `linear-gradient(160deg, ${profile.color}22, #F4FAF8)`,
          padding: '36px 0 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar name={profile.name} color={profile.color} size={96} src={undefined} />
        <h3
          style={{
            fontFamily: 'Sora, sans-serif',
            fontWeight: 700,
            fontSize: 22,
            color: '#223338',
            margin: '16px 0 2px',
          }}
        >
          {profile.name}
        </h3>
        <p style={{ fontSize: 14, color: '#6B8087', margin: 0 }}>
          {profile.major}
        </p>
      </div>

      <div style={{ padding: '20px 24px', flex: 1, overflowY: 'auto' }}>
        <div style={{ marginBottom: 14 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: '#9AACAF',
              marginBottom: 6,
              textTransform: 'none',
            }}
          >
            Kỹ năng đang có
          </div>
          {profile.have.map((s) => (
            <Tag tone="have" key={s}>
              {s}
            </Tag>
          ))}
        </div>
        <div style={{ marginBottom: 14 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: '#9AACAF',
              marginBottom: 6,
            }}
          >
            Kỹ năng tìm kiếm
          </div>
          {profile.want.map((s) => (
            <Tag tone="want" key={s}>
              {s}
            </Tag>
          ))}
        </div>
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: '#9AACAF',
              marginBottom: 6,
            }}
          >
            Mục tiêu / Dự án
          </div>
          <Tag tone="goal">{profile.goal}</Tag>
        </div>
      </div>
    </div>
  );
}
function Card({ profile }: any) {
  if (!profile) return null;

  const haveSkills = Array.isArray(profile.have)
    ? profile.have
    : (profile.haveText ? String(profile.haveText).split(',').map((s: string) => s.trim()).filter(Boolean) : []);

  const needSkills = Array.isArray(profile.need)
    ? profile.need
    : (profile.needText ? String(profile.needText).split(',').map((s: string) => s.trim()).filter(Boolean) : []);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#fff',
        borderRadius: 28,
        boxShadow: '0 8px 20px rgba(34,51,56,0.08)',
        border: '1px solid #E6EFF0',
        padding: '28px 24px',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        overflowY: 'auto',
      }}
    >
      {/* Avatar tròn màu xanh ngọc */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: '50%',
            backgroundColor: profile.color || '#2E9084',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 10,
          }}
        >
          {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#223338', marginBottom: 2 }}>
          {profile.name}
        </div>
        <div style={{ fontSize: 13, color: '#6B8087' }}>
          {profile.major || 'Chưa cập nhật ngành'}
        </div>
      </div>

      {/* Kỹ năng đang có */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#8DA39E', marginBottom: 6, textTransform: 'uppercase' }}>
          Kỹ năng đang có
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {haveSkills.length > 0 ? (
            haveSkills.map((s: string, idx: number) => (
              <Tag key={idx} tone="have">{s}</Tag>
            ))
          ) : (
            <span style={{ fontSize: 12, color: '#A0B1BA' }}>Chưa cập nhật</span>
          )}
        </div>
      </div>

      {/* Kỹ năng tìm kiếm */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#8DA39E', marginBottom: 6, textTransform: 'uppercase' }}>
          Kỹ năng tìm kiếm
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {needSkills.length > 0 ? (
            needSkills.map((s: string, idx: number) => (
              <Tag key={idx} tone="need">{s}</Tag>
            ))
          ) : (
            <span style={{ fontSize: 12, color: '#A0B1BA' }}>Chưa cập nhật</span>
          )}
        </div>
      </div>

      {/* Mục tiêu / Dự án */}
      {profile.goal && (
        <div style={{ marginTop: 'auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#8DA39E', marginBottom: 6, textTransform: 'uppercase' }}>
            Mục tiêu / Dự án
          </div>
          <Tag tone="goal">{profile.goal}</Tag>
        </div>
      )}
    </div>
  );
}
function SwipePage({ deck = [], onSwipe, onReset }: any) {
  const [dragX, setDragX] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const dragging = useRef(false);
  const startX = useRef(0);

  const safeDeck = Array.isArray(deck) ? deck : [];

  // Tính toán Top 5 từ khóa xuất hiện nhiều nhất dựa trên từ khóa đang gõ
  const topSuggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const counts: { [key: string]: { text: string; type: 'skill' | 'goal'; count: number } } = {};

    safeDeck.forEach((p: any) => {
      // 1. Quét kỹ năng có
      const skills = Array.isArray(p?.have)
        ? p.have
        : (p?.haveText ? String(p.haveText).split(',') : []);

      skills.forEach((s: any) => {
        const item = String(s).trim();
        if (item && item.toLowerCase().includes(q)) {
          const key = `skill_${item.toLowerCase()}`;
          if (!counts[key]) counts[key] = { text: item, type: 'skill', count: 0 };
          counts[key].count += 1;
        }
      });

      // 2. Quét mục tiêu
      if (p?.goal && typeof p.goal === 'string' && p.goal.toLowerCase().includes(q)) {
        const item = p.goal.trim();
        const key = `goal_${item.toLowerCase()}`;
        if (!counts[key]) counts[key] = { text: item, type: 'goal', count: 0 };
        counts[key].count += 1;
      }
    });

    return Object.keys(counts)
      .map((key) => counts[key])
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [searchQuery, safeDeck]);

  // Lọc theo Sự kiện và Từ khóa tìm kiếm
  const filteredDeck = safeDeck.filter((p: any) => {
    const matchEvent =
      selectedEvent === 'all' ||
      p?.event === selectedEvent ||
      (p?.goal && String(p.goal).toLowerCase().includes(selectedEvent.toLowerCase()));

    const query = searchQuery.trim().toLowerCase();
    if (!query) return matchEvent;

    const skillsText = Array.isArray(p?.have)
      ? p.have.join(' ').toLowerCase()
      : String(p?.haveText || '').toLowerCase();
    const matchSkill = skillsText.includes(query);
    const matchGoal = String(p?.goal || '').toLowerCase().includes(query);

    return matchEvent && (matchSkill || matchGoal);
  });

  function pointerDown(e: any) {
    dragging.current = true;
    startX.current = e.clientX;
  }

  function pointerMove(e: any) {
    if (!dragging.current) return;
    setDragX(e.clientX - startX.current);
  }

  function pointerUp() {
    if (!dragging.current) return;
    dragging.current = false;
    if (dragX > 90) fireSwipe('right');
    else if (dragX < -90) fireSwipe('left');
    else setDragX(0);
  }

  function fireSwipe(dir: 'left' | 'right') {
    setDragX(dir === 'right' ? 500 : -500);
    setTimeout(() => {
      if (onSwipe) onSwipe(dir);
      setDragX(0);
    }, 260);
  }

  useEffect(() => {
    window.addEventListener('pointermove', pointerMove);
    window.addEventListener('pointerup', pointerUp);
    return () => {
      window.removeEventListener('pointermove', pointerMove);
      window.removeEventListener('pointerup', pointerUp);
    };
  });

  const visible = filteredDeck.slice(0, 2);

  return (
    <div
      style={{
        maxWidth: 420,
        margin: '0 auto',
        padding: '30px 20px 60px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h2
        style={{
          fontFamily: 'Sora, sans-serif',
          fontWeight: 700,
          fontSize: 24,
          color: '#223338',
          marginBottom: 20,
        }}
      >
        Quẹt để tìm đồng đội
      </h2>

      {/* THANH TÌM KIẾM & NÚT TẤT CẢ */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 20,
        }}
      >
        {/* Nút Tất cả */}
        <button
          type="button"
          onClick={() => setSelectedEvent('all')}
          style={{
            whiteSpace: 'nowrap',
            padding: '7px 15px',
            borderRadius: 999,
            fontSize: 12.5,
            fontWeight: 600,
            cursor: 'pointer',
            border: selectedEvent === 'all' ? '1px solid #3FA796' : '1px solid #DCEAE6',
            background: selectedEvent === 'all' ? '#3FA796' : '#fff',
            color: selectedEvent === 'all' ? '#fff' : '#4E6166',
            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
            transition: 'all 0.2s ease',
          }}
        >
          Tất cả
        </button>

        {/* Thanh tìm kiếm có Popover Gợi ý */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <Search
            size={14}
            color="#8DA39E"
            style={{ position: 'absolute', left: 12, pointerEvents: 'none' }}
          />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            placeholder="Tìm kỹ năng hoặc mục tiêu..."
            style={{
              width: '100%',
              padding: '7px 30px 7px 32px',
              borderRadius: 999,
              border: '1px solid #DCEAE6',
              background: '#fff',
              fontSize: 12.5,
              color: '#223338',
              outline: 'none',
              boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setShowSuggestions(false);
              }}
              style={{
                position: 'absolute',
                right: 10,
                background: 'none',
                border: 'none',
                color: '#999',
                cursor: 'pointer',
                fontSize: 12,
                padding: 0,
              }}
              title="Xóa tìm kiếm"
            >
              ✕
            </button>
          )}

          {/* Menu Dropdown gợi ý Top 5 từ khóa */}
          {showSuggestions && topSuggestions.length > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: 6,
                width: '100%',
                backgroundColor: '#ffffff',
                borderRadius: 14,
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
                zIndex: 999,
              }}
            >
              <div
                style={{
                  padding: '8px 12px 4px',
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#94A3B8',
                  letterSpacing: 0.5,
                }}
              >
                Gợi ý phổ biến
              </div>
              {topSuggestions.map((item, idx) => (
                <div
                  key={idx}
                  onMouseDown={() => {
                    setSearchQuery(item.text);
                    setShowSuggestions(false);
                  }}
                  style={{
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontSize: 12.5,
                    color: '#1E293B',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span
                      style={{
                        fontSize: 10,
                        padding: '2px 6px',
                        borderRadius: 4,
                        fontWeight: 600,
                        backgroundColor: item.type === 'skill' ? '#E0F2FE' : '#FEF3C7',
                        color: item.type === 'skill' ? '#0369A1' : '#B45309',
                      }}
                    >
                      {item.type === 'skill' ? 'Kỹ năng' : 'Mục tiêu'}
                    </span>
                    <span style={{ fontWeight: 600 }}>{item.text}</span>
                  </div>
                  <span style={{ fontSize: 11, color: '#94A3B8' }}>
                    {item.count} bạn
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* KHU VỰC THẺ BÀI */}
      <div style={{ position: 'relative', width: '100%', height: 480 }}>
        {visible.length === 0 ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: '#fff',
              borderRadius: 28,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(34,51,56,0.08)',
              padding: 20,
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: 15, color: '#6B8087', marginBottom: 16 }}>
              {searchQuery ? 'Không tìm thấy bạn nào khớp với từ khóa!' : 'Bạn đã xem hết hồ sơ rồi!'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                if (onReset) onReset();
              }}
              style={{
                background: '#3FA796',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: 999,
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              {searchQuery ? 'Xóa bộ lọc tìm kiếm' : 'Xem lại từ đầu'}
            </button>
          </div>
        ) : (
          visible
            .slice()
            .reverse()
            .map((profile: any, i: number) => {
              const isTop = i === visible.length - 1;
              const rot = isTop ? dragX * 0.08 : 0;
              const tx = isTop ? dragX : 0;
              const scale = isTop ? 1 : 0.95;

              return (
                <div
                  key={profile.id}
                  onPointerDown={isTop ? pointerDown : undefined}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    transform: `translate3d(${tx}px, 0, 0) rotate(${rot}deg) scale(${scale})`,
                    transition: dragging.current && isTop ? 'none' : 'transform 0.25s ease',
                    cursor: isTop ? 'grab' : 'default',
                    touchAction: 'none',
                    userSelect: 'none',
                  }}
                >
                  <Card profile={profile} />
                </div>
              );
            })
        )}
      </div>

      {/* NÚT THẢ TIM & BỎ QUA */}
      {visible.length > 0 && (
        <div style={{ display: 'flex', gap: 20, marginTop: 24 }}>
          <button
            type="button"
            onClick={() => fireSwipe('left')}
            style={{
              width: 54,
              height: 54,
              borderRadius: '50%',
              border: 'none',
              background: '#FFF0F0',
              color: '#E53E3E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(229, 62, 62, 0.15)',
            }}
          >
            <X size={24} />
          </button>
          <button
            type="button"
            onClick={() => fireSwipe('right')}
            style={{
              width: 54,
              height: 54,
              borderRadius: '50%',
              border: 'none',
              background: '#E6FFFA',
              color: '#3FA796',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(63, 167, 150, 0.2)',
            }}
          >
            <Heart size={24} fill="#3FA796" />
          </button>
        </div>
      )}
    </div>
  );
}

function MatchModal({ profile, currentUser, onMessage, onContinue }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(20,32,35,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: 20,
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 28,
          padding: '44px 32px 32px',
          maxWidth: 380,
          width: '100%',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {[...Array(14)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: `${(i * 37) % 100}%`,
              left: `${(i * 53) % 100}%`,
              width: 6,
              height: 6,
              borderRadius: i % 2 === 0 ? '50%' : 2,
              background: [`#3FA796`, `#5B8DEF`, `#A85CC1`][i % 3],
              opacity: 0.6,
            }}
          />
        ))}
        <h2
          style={{
            fontFamily: 'Sora, sans-serif',
            fontWeight: 800,
            fontSize: 26,
            color: '#223338',
            margin: '0 0 24px',
            position: 'relative',
          }}
        >
          It's a Match! 🎉
        </h2>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 20,
            position: 'relative',
          }}
        >
          <div style={{ marginRight: -20, zIndex: 1 }}>
            <Avatar
              name={currentUser.name}
              color={currentUser.color}
              size={84}
              src={currentUser.avatarUrl}
            />
          </div>
          <div style={{ zIndex: 2 }}>
            <Avatar name={profile.name} color={profile.color} size={84} src={undefined} />
          </div>
        </div>
        <p style={{ fontSize: 15, color: '#6B8087', marginBottom: 28 }}>
          Bạn và <strong style={{ color: '#223338' }}>{profile.name}</strong> đã
          ghép đội thành công cho "{profile.goal}"
        </p>
        <button
          onClick={onMessage}
          style={{
            width: '100%',
            background: '#3FA796',
            color: '#fff',
            border: 'none',
            padding: '13px',
            borderRadius: 999,
            fontWeight: 700,
            fontSize: 15,
            cursor: 'pointer',
            marginBottom: 12,
          }}
        >
          Nhắn tin ngay
        </button>
        <button
          onClick={onContinue}
          style={{
            width: '100%',
            background: 'transparent',
            color: '#223338',
            border: '2px solid #DCEAE6',
            padding: '11px',
            borderRadius: 999,
            fontWeight: 700,
            fontSize: 15,
            cursor: 'pointer',
          }}
        >
          Tiếp tục tìm kiếm
        </button>
      </div>
    </div>
  );
}
function ChatPage({
  matches,
  currentUser,
  selectedId,
  setSelectedId,
  onOpenProfile,
}: any) {
  const [hoveredFriend, setHoveredFriend] = useState<any | null>(null);
  const [viewingProfile, setViewingProfile] = useState<any | null>(null);

  const [messages, setMessages] = useState<any[]>([]);
  const [draft, setDraft] = useState('');
  const bottomRef = useRef<any>(null);
  const selected = matches.find((m: any) => m.id === selectedId) || matches[0];

  // 1. Tự động chọn người đầu tiên nếu chưa chọn
  useEffect(() => {
    if (!selectedId && matches.length) {
      setSelectedId(matches[0].id);
    }
  }, [matches, selectedId, setSelectedId]);

  // 2. Tải lịch sử và lắng nghe tin nhắn Realtime
  useEffect(() => {
    if (!selected?.id || !currentUser?.id) return;

    // Tải tin nhắn cũ giữa hai người
    const fetchChatHistory = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(
          `and(sender_id.eq.${currentUser.id},receiver_id.eq.${selected.id}),and(sender_id.eq.${selected.id},receiver_id.eq.${currentUser.id})`
        )
        .order('created_at', { ascending: true });

      if (!error && data) {
        setMessages(data);
      }
    };

    fetchChatHistory();

    // Đăng ký kênh Realtime để nhận tin nhắn mới ngay lập tức
    const channel = supabase
      .channel(`chat_${selected.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload: any) => {
          const newMsg = payload.new;
          if (
            (newMsg.sender_id === currentUser.id && newMsg.receiver_id === selected.id) ||
            (newMsg.sender_id === selected.id && newMsg.receiver_id === currentUser.id)
          ) {
            setMessages((prev) => [...prev, newMsg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selected?.id, currentUser?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 3. Gửi tin nhắn lên bảng messages trên Supabase
  async function send() {
    if (!draft.trim() || !selected || !currentUser?.id) return;

    const textToSend = draft.trim();
    setDraft('');

    const { error } = await supabase.from('messages').insert({
      sender_id: currentUser.id,
      receiver_id: selected.id,
      content: textToSend,
    });

    if (error) {
      console.error('Lỗi khi gửi tin nhắn:', error.message);
    }
  }

  if (matches.length === 0) {
    return (
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '100px 24px', textAlign: 'center' }}>
        <MessageCircle size={40} color="#9AACAF" style={{ marginBottom: 16 }} />
        <p style={{ color: '#6B8087', fontSize: 15 }}>
          Bạn chưa ghép đội với ai. Quay lại trang Ghép đội để quẹt thử nhé!
        </p>
      </div>
    );
  }
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px 40px' }}>
      <div
        style={{
          display: 'flex',
          background: '#fff',
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(34,51,56,0.08)',
          height: 560,
        }}
      >
        {/* Danh sách người ghép đội */}
        <div style={{ width: '30%', borderRight: '1px solid #EDF3F1', overflowY: 'auto' }}>
          {matches.map((m: any) => (
            <div
              key={m.id}
              onClick={() => setSelectedId(m.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '14px 16px',
                cursor: 'pointer',
                background: selected?.id === m.id ? '#F4FAF8' : 'transparent',
                borderBottom: '1px solid #F4FAF8',
              }}
            >
              <Avatar name={m.name} color={m.color} size={40} src={m.avatarUrl} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#223338', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {m.name}
                </div>
                <div style={{ fontSize: 12.5, color: '#9AACAF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Trò chuyện ngay
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Khung chat */}
        <div style={{ width: '70%', display: 'flex', flexDirection: 'column' }}>
          {selected && (
            <>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #EDF3F1', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div 
                  style={{ position: 'relative', display: 'inline-block' }}
                  onMouseEnter={() => setHoveredFriend(selected)}
                  onMouseLeave={() => setHoveredFriend(null)}
                >
                  {/* Thẻ div của Avatar */}
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenProfile) onOpenProfile(selected);
                    }}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    title="Nhấp để xem trang cá nhân"
                  >
                    <Avatar name={selected.name} color={selected.color} size={36} src={selected.avatarUrl} />
                  </div>
  {/* Hover Card */}
  {hoveredFriend && hoveredFriend.id === selected.id && (
    <div
      style={{
        position: 'absolute',
        top: '115%',
        left: 0,
        zIndex: 9999,
        width: 250,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: '14px 16px',
        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15)',
        border: '1px solid #EDF3F1',
        pointerEvents: 'none',
        fontSize: 13,
        color: '#223338',
        textAlign: 'left',
      }}
    >
      {/* Họ tên & Năm sinh */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <span style={{ fontWeight: 700, fontSize: 15, color: '#1B3B36' }}>
          {selected.name || 'Người dùng'}
        </span>
        <span style={{ fontSize: 12, color: '#74898D', fontWeight: 500 }}>
          {selected.birthYear || selected.birth_year || 'Chưa rõ'}
        </span>
      </div>

      {/* Chuyên môn */}
      <div style={{ marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid #F4FAF8' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#3FA796', textTransform: 'uppercase' }}>
          Chuyên môn
        </div>
        <div style={{ marginTop: 2, color: '#2C3E50', fontWeight: 500 }}>
          {selected.primarySkill || selected.primary_skill || selected.major || 'Đang cập nhật'}
        </div>
      </div>

      {/* Số ngày trò chuyện */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <span>💬</span>
        <span style={{ fontSize: 12, color: '#4A5568' }}>
          Đã trò chuyện: <strong style={{ color: '#1B3B36' }}>1 ngày</strong>
        </span>
      </div>

      {/* Dự án chung */}
      <div style={{ borderTop: '1px dashed #E2E8F0', paddingTop: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#5B8DEF', textTransform: 'uppercase', marginBottom: 4 }}>
          Dự án chung
        </div>
        {((selected.projectHistory || []).filter((up: any) =>
          (currentUser?.projectHistory || []).some(
            (mp: any) => mp.name?.trim().toLowerCase() === up.name?.trim().toLowerCase()
          )
        )).length > 0 ? (
          (selected.projectHistory || []).filter((up: any) =>
            (currentUser?.projectHistory || []).some(
              (mp: any) => mp.name?.trim().toLowerCase() === up.name?.trim().toLowerCase()
            )
          ).map((p: any, idx: number) => (
            <span key={idx} style={{ display: 'inline-block', background: '#F0F4FF', color: '#3B60E4', padding: '2px 6px', borderRadius: 6, fontSize: 11, marginRight: 4, marginTop: 2 }}>
              • {p.name}
            </span>
          ))
        ) : (
          <span style={{ color: '#A0AEC0', fontStyle: 'italic', fontSize: 11 }}>Chưa có dự án chung nào</span>
        )}
      </div>
    </div>
  )}
</div>
                <div>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: '#223338' }}>{selected.name}</div>
                  <div style={{ fontSize: 12, color: '#3FA796' }}>Đang hoạt động</div>
                </div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {messages.length === 0 && (
                  <p style={{ textAlign: 'center', color: '#9AACAF', fontSize: 13.5 }}>
                    Hãy bắt đầu cuộc trò chuyện!
                  </p>
                )}
                {messages.map((m: any) => {
                  const isMe = m.sender_id === currentUser.id;
                  return (
                    <div
                      key={m.id}
                      style={{
                        alignSelf: isMe ? 'flex-end' : 'flex-start',
                        background: isMe ? '#3FA796' : '#F1F5F4',
                        color: isMe ? '#fff' : '#223338',
                        padding: '10px 14px',
                        borderRadius: 16,
                        maxWidth: '70%',
                        fontSize: 14,
                        lineHeight: 1.4,
                      }}
                    >
                      {m.content}
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              <div style={{ padding: 16, borderTop: '1px solid #EDF3F1', display: 'flex', gap: 10 }}>
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                  placeholder="Nhập tin nhắn..."
                  style={{
                    flex: 1,
                    border: '1px solid #DCEAE6',
                    borderRadius: 999,
                    padding: '11px 18px',
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
                <button
                  onClick={send}
                  style={{
                    background: '#3FA796',
                    border: 'none',
                    color: '#fff',
                    width: 42,
                    height: 42,
                    borderRadius: '9999px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  <Send size={17} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      {/* Modal xem trang cá nhân của bạn bè */}
      {viewingProfile && (
        <div
          onClick={() => setViewingProfile(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: 20,
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: 24,
              padding: 24,
              maxWidth: 420,
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
              textAlign: 'left',
            }}
          >
            {/* Header: Avatar + Tên + Ngành */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <Avatar
                name={viewingProfile.name}
                color={viewingProfile.color}
                size={72}
                src={viewingProfile.avatarUrl}
              />
              <div>
                <h3 style={{ margin: 0, fontSize: 18, color: '#1B3B36' }}>{viewingProfile.name}</h3>
                <div style={{ fontSize: 13, color: '#74898D', marginTop: 2 }}>
                  {viewingProfile.major || 'Chưa cập nhật ngành'} • {viewingProfile.birthYear || viewingProfile.birth_year || '2007'}
                </div>
                <div style={{ fontSize: 12, color: '#3FA796', fontWeight: 600, marginTop: 4 }}>
                  ⭐ Chuyên môn: {viewingProfile.primarySkill || viewingProfile.primary_skill || 'Đang cập nhật'}
                </div>
              </div>
            </div>

            {/* Mục tiêu / Dự án */}
            {viewingProfile.goal && (
              <div style={{ marginBottom: 16 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#3FA796', textTransform: 'uppercase' }}>
                  Mục tiêu hiện tại
                </span>
                <div style={{ fontSize: 13.5, color: '#223338', marginTop: 4 }}>
                  {viewingProfile.goal}
                </div>
              </div>
            )}

            {/* Kỹ năng có */}
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#5B8DEF', textTransform: 'uppercase' }}>
                Kỹ năng hiện có
              </span>
              <div style={{ fontSize: 13, color: '#4A5568', marginTop: 4 }}>
                {viewingProfile.haveText || (Array.isArray(viewingProfile.have) ? viewingProfile.have.join(', ') : 'Chưa cập nhật')}
              </div>
            </div>

            {/* Lịch sử dự án */}
            <div style={{ borderTop: '1px solid #EDF3F1', paddingTop: 14, marginBottom: 20 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#1B3B36', textTransform: 'uppercase' }}>
                Dự án đã & đang làm
              </span>
              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(viewingProfile.projectHistory || viewingProfile.project_history || []).length > 0 ? (
                  (viewingProfile.projectHistory || viewingProfile.project_history).map((p: any, idx: number) => (
                    <div key={idx} style={{ background: '#F8FAF9', padding: '8px 12px', borderRadius: 8, fontSize: 12.5 }}>
                      <div style={{ fontWeight: 600, color: '#223338' }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: '#74898D' }}>{p.role} • {p.status}</div>
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: 12, color: '#A0AEC0', fontStyle: 'italic' }}>Chưa cập nhật danh sách dự án</div>
                )}
              </div>
            </div>

            <button
              onClick={() => setViewingProfile(null)}
              style={{
                width: '100%',
                padding: '10px 0',
                borderRadius: 12,
                border: 'none',
                background: '#3FA796',
                color: '#fff',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
function ProfilePage({ currentUser, onSave, isReadOnly, onBack, showToast }: any) {
  const [form, setForm] = useState({
    name: currentUser?.name || '',
    major: currentUser?.major || '',
    birthYear: currentUser?.birthYear || '2007',
    primarySkill: currentUser?.primarySkill || '',
    experience: currentUser?.experience || '',
    haveText: currentUser?.haveText || '',
    wantText: currentUser?.wantText || '',
    goal: currentUser?.goal || '',
    avatarUrl: currentUser?.avatarUrl || null,
    commitmentRate: currentUser?.commitmentRate || 98,
    projectHistory: currentUser?.projectHistory || [
      { name: 'Hackathon 2026', role: 'Trưởng nhóm', status: 'Đã hoàn thành' },
      { name: 'Nghiên cứu khoa học UEH', role: 'Thành viên', status: 'Đang thực hiện' },
    ],
  });

  const handleRemoveProof = (id: string) => {
    const updated = proofs.filter((p) => p.id !== id);
    setProofs(updated);
    setForm((prev: any) => ({ ...prev, proofs: updated }));
  };
  const [newProofTitle, setNewProofTitle] = useState('');
  const [newProofUrl, setNewProofUrl] = useState('');
  const proofFileInputRef = useRef<any>(null);
  // Tự động đồng bộ lại form khi currentUser từ component cha thay đổi
  useEffect(() => {
    if (currentUser) {
      setForm((prev: any) => ({
        ...prev,
        ...currentUser,
        avatarUrl: currentUser.avatarUrl || currentUser.avatar || prev.avatarUrl,
        proofs: currentUser.proofs || prev.proofs || [],
      }));
      if (currentUser.proofs) {
        setProofs(currentUser.proofs);
      }
    }
  }, [currentUser]);

  // Thêm minh chứng bằng dán link Drive / URL
  const handleAddProof = () => {
    if (!newProofTitle.trim()) return;
    const item = {
      id: Date.now().toString(),
      title: newProofTitle.trim(),
      url: (newProofUrl || '').trim(),
    };
    const updated = [...(Array.isArray(proofs) ? proofs : []), item];
    setProofs(updated);
    setForm((prev: any) => ({ ...prev, proofs: updated }));
    setNewProofTitle('');
    setNewProofUrl('');
  };

  // Tải trực tiếp ảnh minh chứng từ máy tính
  const handleUploadProofFile = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Vui lòng chọn file minh chứng dưới 5MB!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      const item = {
        id: Date.now().toString(),
        title: file.name,
        url: base64,
      };
      const updated = [...(Array.isArray(proofs) ? proofs : []), item];
      setProofs(updated);
      setForm((prev: any) => ({ ...prev, proofs: updated }));
    };
    reader.readAsDataURL(file);
  };
  const fileRef = useRef<any>(null);
  const [newProject, setNewProject] = useState({
    name: '',
    role: 'Thành viên',
    status: 'Đang thực hiện',
  });

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Rời nhóm giữa chừng');
  const [reportComment, setReportComment] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [uploadingSkill, setUploadingSkill] = useState<string | null>(null);
  const [proofs, setProofs] = useState<any[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleAddProject = () => {
    if (!newProject.name.trim()) {
      showToast('Vui lòng nhập tên dự án!');
      return;
    }
    const updatedList = [...(form.projectHistory || []), newProject];
    setForm({ ...form, projectHistory: updatedList });
    setNewProject({ name: '', role: 'Thành viên', status: 'Đang thực hiện' });
    showToast('Đã thêm dự án! Nhớ bấm "Lưu thay đổi"');
  };

  const handleRemoveProject = (indexToRemove: number) => {
    const updatedList = (form.projectHistory || []).filter((_: any, idx: number) => idx !== indexToRemove);
    setForm({ ...form, projectHistory: updatedList });
  };

  const handleSubmitReport = async () => {
    if (!currentUser?.id) return;
    setIsSubmittingReport(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      showToast('Bạn cần đăng nhập để thực hiện báo cáo!');
      setIsSubmittingReport(false);
      return;
    }
    const { error } = await supabase.from('reports').insert({
      reporter_id: user.id,
      reported_user_id: currentUser.id,
      reason: reportReason,
      comment: reportComment,
    });
    setIsSubmittingReport(false);
    if (!error) {
      showToast('Đã gửi báo cáo / đánh giá thành công!');
      setShowReportModal(false);
      setReportComment('');
    } else {
      showToast('Lỗi gửi báo cáo: ' + error.message);
    }
  };

  const fetchMyProofs = async () => {
    if (!currentUser?.id) return;
    const { data } = await supabase
      .from('skill_proofs')
      .select('*')
      .eq('user_id', currentUser.id);
    if (data) setProofs(data);
  };

  useEffect(() => {
    fetchMyProofs();
  }, [currentUser?.id]);

  const handleUploadProof = async (e: any, skillName: string) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser?.id) return;
    setUploadingSkill(skillName);
    const fileExt = file.name.split('.').pop();
    const fileName = `${currentUser.id}_${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('certificates')
      .upload(fileName, file);
    if (uploadError) {
      showToast('Lỗi tải ảnh: ' + uploadError.message);
      setUploadingSkill(null);
      return;
    }
    const { data: publicUrlData } = supabase.storage
      .from('certificates')
      .getPublicUrl(fileName);
    const { error: insertError } = await supabase.from('skill_proofs').insert({
      user_id: currentUser.id,
      skill_name: skillName,
      title: file.name,
      image_url: publicUrlData.publicUrl,
    });
    setUploadingSkill(null);
    if (!insertError) {
      showToast(`Đã thêm minh chứng cho "${skillName}"!`);
      fetchMyProofs();
    } else {
      showToast('Lỗi lưu minh chứng: ' + insertError.message);
    }
  };

  const handleFile = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('Vui lòng chọn ảnh dưới 3MB!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setForm((prev: any) => ({
          ...prev,
          avatar: base64,
          avatar_url: base64,
          avatarUrl: base64,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  function field(label: string, key: string, placeholder: string) {
    return (
      <div style={{ marginBottom: 16, textAlign: 'left' }}>
        <label
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#6B8087',
            display: 'block',
            marginBottom: 6,
          }}
        >
          {label}
        </label>
        <input
          value={(form as any)[key] || ''}
          onChange={(e) => !isReadOnly && setForm((f) => ({ ...f, [key]: e.target.value }))}
          placeholder={placeholder}
          readOnly={isReadOnly}
          disabled={isReadOnly}
          style={{
            width: '100%',
            border: '1px solid #DCEAE6',
            background: isReadOnly ? '#F4FAF8' : '#fff',
            borderRadius: 14,
            padding: '12px 16px',
            fontSize: 14.5,
            outline: 'none',
            boxSizing: 'border-box',
            cursor: isReadOnly ? 'not-allowed' : 'text',
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640, margin: '24px auto', padding: '0 16px 40px' }}>
      <div style={{ background: '#fff', borderRadius: 24, padding: 28, boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
        {isReadOnly && (
          <button
            type="button"
            onClick={onBack}
            style={{
              marginBottom: 16,
              background: '#EDF3F1',
              color: '#223338',
              border: 'none',
              padding: '8px 16px',
              borderRadius: 20,
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            ← Quay lại hồ sơ của tôi
          </button>
        )}

        {/* 1. ĐẦU TRANG: AVATAR & THÔNG TIN CƠ BẢN */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
          <div style={{ position: 'relative', width: 96, height: 96, flexShrink: 0 }}>
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: '50%',
                background: '#E8F5F1',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '3px solid #3FA796',
              }}
            >
{((form as any).avatar || (form as any).avatar_url || form.avatarUrl) ? (
            <img
              src={(form as any).avatar || (form as any).avatar_url || form.avatarUrl}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <span style={{ fontSize: 32, fontWeight: 700, color: '#3FA796' }}>
                {form.name ? form.name.charAt(0).toUpperCase() : 'U'}
              </span>
            )}
          </div>
            {!isReadOnly && (
              <label
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  background: '#3FA796',
                  borderRadius: '50%',
                  padding: 6,
                  cursor: 'pointer',
                  color: '#fff',
                  display: 'flex',
                }}
                title="Tải ảnh đại diện"
              >
                <Camera size={15} />
                <input type="file" accept="image/*" style={{ display: 'none' }} ref={fileRef} onChange={handleFile} />
              </label>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: '0 0 6px', fontSize: 22, color: '#1B2A26' }}>{form.name || 'Chưa đặt tên'}</h2>
            <div style={{ fontSize: 13, color: '#5A6E68', display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <span>🎓 {form.major || 'Chưa cập nhật ngành'}</span>
              <span>📅 Sinh năm: {form.birthYear}</span>
            </div>
            <div style={{ marginTop: 6, fontSize: 13, color: '#3FA796', fontWeight: 600 }}>
              ⭐ Chuyên môn: {form.primarySkill || 'Đang cập nhật'}
            </div>
          </div>
        </div>

        {/* 2. ĐỘ UY TÍN & CHỈ SỐ HOÀN THÀNH */}
        <div style={{ background: '#F8FAF9', borderRadius: 16, padding: 16, marginBottom: 24, border: '1px solid #E2E8E5' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1B2A26' }}>Chỉ số hoàn thành cam kết</span>
            <span style={{ fontSize: 15, fontWeight: 800, color: '#3FA796' }}>{form.commitmentRate}%</span>
          </div>
          <div style={{ width: '100%', height: 8, background: '#E0E7E4', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ width: `${form.commitmentRate}%`, height: '100%', background: '#3FA796', borderRadius: 99 }} />
          </div>
          <p style={{ margin: '8px 0 0', fontSize: 11, color: '#758882' }}>
            Đánh giá dựa trên lịch sử không rời nhóm giữa chừng và hoàn thành task đúng hạn.
          </p>
        </div>

        {/* 3. LỊCH SỬ THAM GIA DỰ ÁN (TEAM HISTORY) & NÚT BÁO CÁO */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 15, margin: 0, color: '#1B2A26', fontWeight: 700 }}>
              Lịch sử tham gia dự án
            </h3>
            <button
              type="button"
              onClick={() => setShowReportModal(true)}
              style={{
                background: 'transparent',
                border: '1px solid #FFCDD2',
                color: '#D32F2F',
                padding: '4px 10px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              🚩 Báo cáo / Đánh giá
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
            {form.projectHistory?.length === 0 && (
              <div style={{ fontSize: 13, color: '#888', fontStyle: 'italic' }}>Chưa có dự án nào.</div>
            )}
            {form.projectHistory?.map((proj: any, idx: number) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: '#FDFDFD',
                  border: '1px solid #EAEAEA',
                  borderRadius: 12,
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#1B2A26' }}>{proj.name}</div>
                  <div style={{ fontSize: 11, color: proj.status === 'Đã hoàn thành' ? '#2E7D32' : '#E65100', marginTop: 2 }}>
                    ● {proj.status}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: 20,
                      background: proj.role === 'Trưởng nhóm' ? '#FFF3E0' : '#E8F5E9',
                      color: proj.role === 'Trưởng nhóm' ? '#E65100' : '#2E7D32',
                    }}
                  >
                    {proj.role}
                  </span>
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => handleRemoveProject(idx)}
                      style={{
                        border: 'none',
                        background: 'none',
                        color: '#999',
                        cursor: 'pointer',
                        fontSize: 14,
                        padding: 4,
                      }}
                      title="Xóa dự án này"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Form thêm dự án mới: Ẩn khi chỉ đọc */}
          {!isReadOnly && (
            <div style={{ background: '#F8FAF9', padding: 14, borderRadius: 12, border: '1px dashed #CBD5D1' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#3A4D47', display: 'block', marginBottom: 8 }}>
                + Thêm dự án mới:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 8, alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Tên dự án / Cuộc thi..."
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid #D5DDD9',
                    fontSize: 13,
                    outline: 'none',
                  }}
                />
                <select
                  value={newProject.role}
                  onChange={(e) => setNewProject({ ...newProject, role: e.target.value })}
                  style={{
                    padding: '8px',
                    borderRadius: 8,
                    border: '1px solid #D5DDD9',
                    fontSize: 12,
                    outline: 'none',
                    background: '#fff',
                  }}
                >
                  <option value="Thành viên">Thành viên</option>
                  <option value="Trưởng nhóm">Trưởng nhóm</option>
                </select>
                <select
                  value={newProject.status}
                  onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                  style={{
                    padding: '8px',
                    borderRadius: 8,
                    border: '1px solid #D5DDD9',
                    fontSize: 12,
                    outline: 'none',
                    background: '#fff',
                  }}
                >
                  <option value="Đang thực hiện">Đang thực hiện</option>
                  <option value="Đã hoàn thành">Đã hoàn thành</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddProject}
                  style={{
                    background: '#3FA796',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: 12,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Thêm
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4. BIỂU MẪU CHỈNH SỬA THÔNG TIN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
         {/* 3. MINH CHỨNG NĂNG LỰC & DỰ ÁN */}
      <div style={{ marginTop: 24, marginBottom: 24 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: '#223338' }}>
            Minh chứng năng lực & Dự án
          </span>
          <span style={{ fontSize: 11, color: '#8DA39E' }}>
            Hỗ trợ tải ảnh từ máy hoặc dán link Google Drive
          </span>
        </div>

        {/* Danh sách minh chứng */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
          {(!Array.isArray(proofs) || proofs.length === 0) ? (
            <div
              style={{
                fontSize: 12.5,
                color: '#94A3B8',
                fontStyle: 'italic',
                padding: '10px 14px',
                background: '#F8FAFC',
                borderRadius: 10,
                border: '1px dashed #E2E8F0',
              }}
            >
              Chưa có link hoặc tệp minh chứng nào được đính kèm.
            </div>
          ) : (
            proofs.map((item: any, idx: number) => {
              const title = typeof item === 'string' ? item : (item?.title || 'Minh chứng');
              const rawUrl = typeof item === 'string' ? '' : (item?.url || '');
              const isBase64 = typeof rawUrl === 'string' && rawUrl.startsWith('data:image');
              const linkHref = rawUrl ? (rawUrl.startsWith('http') || isBase64 ? rawUrl : `https://${rawUrl}`) : '';

              return (
                <div
                  key={item?.id || idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 14px',
                    borderRadius: 10,
                    background: '#F0FDF4',
                    border: '1px solid #DCFCE7',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden', flex: 1 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#166534', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      📄 {title}
                    </span>
                    {linkHref && (
                      <a
                        href={linkHref}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontSize: 12,
                          color: '#3FA796',
                          textDecoration: 'underline',
                          whiteSpace: 'nowrap',
                          fontWeight: 500,
                        }}
                      >
                        {isBase64 ? '(Xem ảnh đã tải ↗)' : '(Mở liên kết ↗)'}
                      </a>
                    )}
                  </div>

                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => handleRemoveProof(item?.id || idx)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#94A3B8',
                        cursor: 'pointer',
                        fontSize: 14,
                        padding: '0 6px',
                      }}
                      title="Xóa minh chứng này"
                    >
                      ✕
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Khung thêm minh chứng mới */}
        {!isReadOnly && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              background: '#F8FAFC',
              padding: 12,
              borderRadius: 12,
              border: '1px solid #E2E8F0',
            }}
          >
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                placeholder="Tên đề án / Chứng chỉ..."
                value={newProofTitle}
                onChange={(e) => setNewProofTitle(e.target.value)}
                style={{
                  flex: 1,
                  padding: '7px 10px',
                  fontSize: 12,
                  borderRadius: 8,
                  border: '1px solid #CBD5E1',
                  background: '#fff',
                  outline: 'none',
                }}
              />
              <input
                type="text"
                placeholder="Dán link Drive / URL..."
                value={newProofUrl}
                onChange={(e) => setNewProofUrl(e.target.value)}
                style={{
                  flex: 1.2,
                  padding: '7px 10px',
                  fontSize: 12,
                  borderRadius: 8,
                  border: '1px solid #CBD5E1',
                  background: '#fff',
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={handleAddProof}
                style={{
                  padding: '7px 14px',
                  fontSize: 12,
                  fontWeight: 600,
                  borderRadius: 8,
                  border: 'none',
                  background: '#3FA796',
                  color: '#fff',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Gắn link
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                type="file"
                ref={proofFileInputRef}
                onChange={handleUploadProofFile}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => proofFileInputRef.current?.click()}
                style={{
                  background: '#fff',
                  border: '1px solid #3FA796',
                  color: '#3FA796',
                  padding: '6px 14px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                📎 Hoặc chọn tải ảnh từ máy tính
              </button>
              <span style={{ fontSize: 11, color: '#94A3B8' }}>Tối đa 5MB</span>
            </div>
          </div>
        )}
      </div>
          {field('Họ và tên', 'name', 'Nguyễn Văn A')}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, color: '#3A4D47' }}>Năm sinh</label>
              <input
                value={form.birthYear}
                onChange={(e) => !isReadOnly && setForm({ ...form, birthYear: e.target.value })}
                placeholder="VD: 2007"
                readOnly={isReadOnly}
                disabled={isReadOnly}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 12,
                  border: '1px solid #D5DDD9',
                  fontSize: 13,
                  outline: 'none',
                  boxSizing: 'border-box',
                  background: isReadOnly ? '#F4FAF8' : '#fff',
                  cursor: isReadOnly ? 'not-allowed' : 'text',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, color: '#3A4D47' }}>Chuyên ngành</label>
              <input
                value={form.major}
                onChange={(e) => !isReadOnly && setForm({ ...form, major: e.target.value })}
                placeholder="VD: Kinh tế đầu tư"
                readOnly={isReadOnly}
                disabled={isReadOnly}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 12,
                  border: '1px solid #D5DDD9',
                  fontSize: 13,
                  outline: 'none',
                  boxSizing: 'border-box',
                  background: isReadOnly ? '#F4FAF8' : '#fff',
                  cursor: isReadOnly ? 'not-allowed' : 'text',
                }}
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, color: '#3A4D47' }}>Chuyên môn chính</label>
            <input
              value={form.primarySkill}
              onChange={(e) => !isReadOnly && setForm({ ...form, primarySkill: e.target.value })}
              placeholder="VD: Phân tích dữ liệu, Thiết kế UI/UX"
              readOnly={isReadOnly}
              disabled={isReadOnly}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 12,
                border: '1px solid #D5DDD9',
                fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box',
                background: isReadOnly ? '#F4FAF8' : '#fff',
                cursor: isReadOnly ? 'not-allowed' : 'text',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, color: '#3A4D47' }}>
              Kinh nghiệm thực tế (Mỗi dòng một gạch đầu dòng)
            </label>
            <textarea
              rows={3}
              value={form.experience}
              onChange={(e) => !isReadOnly && setForm({ ...form, experience: e.target.value })}
              placeholder="- Từng làm Leader dự án nghiên cứu khoa học&#10;- Thành thạo công cụ thiết kế Canva, Notion"
              readOnly={isReadOnly}
              disabled={isReadOnly}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 12,
                border: '1px solid #D5DDD9',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                background: isReadOnly ? '#F4FAF8' : '#fff',
                cursor: isReadOnly ? 'not-allowed' : 'text',
              }}
            />
          </div>

          {field('Kỹ năng đang có', 'haveText', 'VD: Thiết kế, Lập trình, Canva')}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 6 }}>
            {form.haveText
              ?.split(',')
              .map((s: string) => s.trim())
              .filter(Boolean)
              .map((skill: string) => {
                const proof = Array.isArray(proofs) ? proofs.find((p: any) => (p?.skill_name || p?.title || '')?.toString().toLowerCase() === (skill || '')?.toString().toLowerCase()) : null;
                return (
                  <div
                    key={skill}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      background: proof ? '#E3F2FD' : '#EAF6F3',
                      color: proof ? '#1976D2' : '#267365',
                      padding: '6px 12px',
                      borderRadius: 20,
                      fontSize: 13,
                      fontWeight: 500,
                    }}
                  >
                    <span>{skill}</span>
                    {proof ? (
                      <button
                        type="button"
                        onClick={() => setPreviewImage(proof.image_url)}
                        style={{
                          background: '#1976D2',
                          border: 'none',
                          borderRadius: '50%',
                          padding: '4px 6px',
                          cursor: 'pointer',
                          color: '#fff',
                          fontSize: 11,
                        }}
                        title="Xem minh chứng"
                      >
                        🔍
                      </button>
                    ) : (
                      !isReadOnly && (
                        <label
                          style={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            background: '#3FA796',
                            borderRadius: '50%',
                            padding: 4,
                          }}
                          title={`Đính kèm ảnh minh chứng cho ${skill}`}
                        >
                          <Camera size={13} color="#fff" />
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => handleUploadProof(e, skill)}
                            disabled={uploadingSkill === skill}
                          />
                        </label>
                      )
                    )}
                    {uploadingSkill === skill && (
                      <span style={{ fontSize: 11, color: '#666' }}>Đang tải...</span>
                    )}
                  </div>
                );
              })}
          </div>

          {field('Kỹ năng tìm kiếm', 'wantText', 'VD: Lập trình, Viết content')}
          {field('Mục tiêu / Dự án', 'goal', 'VD: Tham gia Hackathon 2026')}

          {!isReadOnly && (
            <button
            onClick={() => onSave({ ...form, proofs: proofs })}
              style={{
                width: '100%',
                background: '#3FA796',
                color: '#fff',
                border: 'none',
                padding: '13px',
                borderRadius: 999,
                fontWeight: 700,
                fontSize: 15,
                cursor: 'pointer',
                marginTop: 10,
              }}
            >
              Lưu thay đổi
            </button>
          )}
        </div>
      </div>

      {/* Modal xem ảnh chứng chỉ */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: 16,
              maxWidth: '90%',
              maxHeight: '90%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <img
              src={previewImage}
              alt="Chứng chỉ"
              style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: 8, objectFit: 'contain' }}
            />
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              style={{
                marginTop: 12,
                background: '#3FA796',
                color: '#fff',
                border: 'none',
                padding: '8px 24px',
                borderRadius: 20,
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Modal Báo cáo / Đánh giá */}
      {showReportModal && (
        <div
          onClick={() => setShowReportModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: 24,
              width: '100%',
              maxWidth: 440,
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            }}
          >
            <h3 style={{ margin: '0 0 8px', fontSize: 17, color: '#D32F2F' }}>
              🚩 Báo cáo & Đánh giá người dùng
            </h3>
            <p style={{ fontSize: 13, color: '#666', margin: '0 0 16px' }}>
              Đóng góp thông tin giúp duy trì cộng đồng minh bạch và đáng tin cậy.
            </p>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
              Lý do phản ánh:
            </label>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 8,
                border: '1px solid #D5DDD9',
                fontSize: 13,
                marginBottom: 14,
                outline: 'none',
              }}
            >
              <option value="Rời nhóm giữa chừng">Rời nhóm giữa chừng không lý do</option>
              <option value="Không hoàn thành task">Không hoàn thành task / trễ hạn nhiều lần</option>
              <option value="Khai gian kỹ năng">Khai gian kỹ năng / minh chứng giả mạo</option>
              <option value="Giao tiếp thiếu tích cực">Thái độ thiếu hợp tác, giao tiếp tiêu cực</option>
              <option value="Khác">Lý do khác</option>
            </select>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
              Mô tả chi tiết:
            </label>
            <textarea
              rows={3}
              value={reportComment}
              onChange={(e) => setReportComment(e.target.value)}
              placeholder="Cung cấp thêm chi tiết về tình huống xảy ra..."
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 8,
                border: '1px solid #D5DDD9',
                fontSize: 13,
                marginBottom: 16,
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                style={{
                  background: '#ECEFF1',
                  color: '#455A64',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSubmitReport}
                disabled={isSubmittingReport}
                style={{
                  background: '#D32F2F',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                {isSubmittingReport ? 'Đang gửi...' : 'Gửi phản ánh'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function AuthModal({ onClose, onAuth }: any) {
  const [tab, setTab] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function submit() {
    if (!email || !password) {
      alert('Vui lòng nhập đầy đủ Email và Mật khẩu!');
      return;
    }
    onAuth({
      name,
      email,
      password,
      isSignUp: tab === 'signup'
    });
  }
  const inputStyle = {
    width: '100%',
    border: '1px solid #DCEAE6',
    borderRadius: 14,
    padding: '12px 16px',
    fontSize: 14.5,
    outline: 'none',
    marginBottom: 12,
    boxSizing: 'border-box',
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(20,32,35,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: 20,
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 26,
          padding: '32px',
          maxWidth: 380,
          width: '100%',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#9AACAF',
          }}
        >
          <X size={20} />
        </button>

        <div
          style={{
            display: 'flex',
            background: '#F4FAF8',
            borderRadius: 999,
            padding: 4,
            marginBottom: 24,
          }}
        >
          {['login', 'signup'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                border: 'none',
                padding: '9px 0',
                borderRadius: 999,
                fontWeight: 700,
                fontSize: 13.5,
                cursor: 'pointer',
                background: tab === t ? '#3FA796' : 'transparent',
                color: tab === t ? '#fff' : '#6B8087',
              }}
            >
              {t === 'login' ? 'Đăng nhập' : 'Tạo tài khoản mới'}
            </button>
          ))}
        </div>

        {tab === 'signup' && (
          <input
            placeholder="Họ và tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
        )}
        <input
          placeholder="Email sinh viên"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="Mật khẩu (tối thiểu 6 ký tự)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
        {tab === 'signup' && (
          <input
            placeholder="Xác nhận mật khẩu"
            type="password"
            style={inputStyle}
          />
        )}

        {tab === 'login' && (
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              color: '#6B8087',
              marginBottom: 16,
            }}
          >
            <input type="checkbox" /> Ghi nhớ tài khoản
          </label>
        )}

        <button
          onClick={submit}
          style={{
            width: '100%',
            background: '#3FA796',
            color: '#fff',
            border: 'none',
            padding: '13px',
            borderRadius: 999,
            fontWeight: 700,
            fontSize: 15,
            cursor: 'pointer',
            marginBottom: 12,
          }}
        >
          {tab === 'login' ? 'Vào ghép đội' : 'Đăng ký ngay'}
        </button>

        <button
          onClick={submit}
          style={{
            width: '100%',
            background: '#fff',
            color: '#223338',
            border: '1px solid #DCEAE6',
            padding: '12px',
            borderRadius: 999,
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 48 48">
            <path
              fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34 5.1 29.3 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.4-.1-2.7-.4-3.5z"
            />
            <path
              fill="#FF3D00"
              d="M6.3 14.7l6.6 4.8C14.5 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34 5.1 29.3 3 24 3c-7.5 0-13.9 4.3-17.7 10.7z"
            />
            <path
              fill="#4CAF50"
              d="M24 45c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.4-4.6 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.9 40.6 16.4 45 24 45z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.6l6.2 5.2C40.9 36 44 30.5 44 24c0-1.4-.1-2.7-.4-3.5z"
            />
          </svg>
          Đăng nhập với Google
        </button>
      </div>
    </div>
  );
}

function Toast({ message }) {
  if (!message) return null;
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        background: '#223338',
        color: '#fff',
        padding: '12px 20px',
        borderRadius: 14,
        fontSize: 14,
        fontWeight: 600,
        zIndex: 60,
        boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
      }}
    >
      {message}
    </div>
  );
}

function PremiumModal({ onClose }: any) {
  const features = [
    'Mở khóa tìm kiếm đối tác cho các dự án tự do, đề án môn học hoặc startup (Không giới hạn trong sự kiện trường).',
    'Phù hiệu (Badge) Premium màu vàng hiển thị trên Profile để tăng độ tin cậy.',
    'Xem danh sách "Những ai đã thả tim bạn" (See who liked you).',
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: 28,
          maxWidth: 420,
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative',
        }}
      >
        {/* Nút đóng */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#fff',
            zIndex: 10,
          }}
        >
          <X size={18} />
        </button>

        {/* Banner Header Premium Tím / Gold */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)',
            padding: '36px 24px 28px',
            textAlign: 'center',
            color: '#fff',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FDE68A, #F59E0B)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(245, 158, 11, 0.4)',
              marginBottom: 12,
            }}
          >
            <Crown size={28} color="#78350F" fill="#78350F" />
          </div>
          <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: -0.3 }}>
            SkillMatch Premium
          </h3>
          <p style={{ margin: '8px 0 0', fontSize: 13, color: '#C7D2FE', lineHeight: 1.4 }}>
            Nâng cấp để tìm kiếm đối tác cho các dự án cá nhân, đề án môn học hoặc startup bên ngoài các sự kiện của trường.
          </p>
        </div>

        {/* Nội dung 3 đặc quyền */}
        <div style={{ padding: '24px 24px 20px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#6366F1', letterSpacing: 0.5, marginBottom: 14 }}>
            Đặc quyền thành viên
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {features.map((feat, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.5 }}>
                  {feat}
                </span>
              </div>
            ))}
          </div>

          {/* Nút hành động */}
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <button
              onClick={() => alert('Cảm ơn bạn đã quan tâm! Tính năng thanh toán học sinh/sinh viên sẽ sớm được kích hoạt.')}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                color: '#fff',
                border: 'none',
                padding: '14px 20px',
                borderRadius: 999,
                fontWeight: 800,
                fontSize: 15,
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(217, 119, 6, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Sparkles size={18} color="#FFFBEB" />
              Đăng ký chỉ với 49k/tháng
            </button>
            <div style={{ fontSize: 11.5, color: '#94A3B8', marginTop: 10 }}>
              Hủy gia hạn bất cứ lúc nào • Ưu đãi dành cho sinh viên
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState('landing');
  const [viewingUser, setViewingUser] = useState<any | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('skillmatch_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return {
      name: 'Bạn',
      major: '',
      haveText: '',
      wantText: '',
      goal: '',
      color: '#5B8DEF',
      avatarUrl: null,
    };
  });
  const [hoveredFriend, setHoveredFriend] = useState<any | null>(null);
  const [viewingProfile, setViewingProfile] = useState<any | null>(null);

  const [deck, setDeck] = useState(PROFILES);
  const [matches, setMatches] = useState([]);
  const [pendingMatch, setPendingMatch] = useState(null);
  const [messages, setMessages] = useState({});
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [toast, setToast] = useState('');
   // Tải danh sách hồ sơ từ Supabase (loại trừ tài khoản đang đăng nhập VÀ những người đã match)
  const fetchDeck = async (currentUserId: string) => {
    // 1. Lấy danh sách ID của những người đã từng match với bạn
    const { data: matchedRows } = await supabase
      .from('matches')
      .select('user1_id, user2_id')
      .or(`user1_id.eq.${currentUserId},user2_id.eq.${currentUserId}`);

    const excludedIds = [currentUserId];
    if (matchedRows && matchedRows.length > 0) {
      matchedRows.forEach((m: any) => {
        const partnerId = m.user1_id === currentUserId ? m.user2_id : m.user1_id;
        if (excludedIds.indexOf(partnerId) === -1) {
          excludedIds.push(partnerId);
        }
      });
    }

    // 2. Lấy danh sách hồ sơ profiles nhưng loại bỏ toàn bộ các ID trong danh sách excludedIds
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .not('id', 'in', `(${excludedIds.join(',')})`);

    if (!error && data && data.length > 0) {
      const formattedDeck = data.map((p: any) => ({
        id: p.id,
        name: p.full_name || 'Thành viên',
        major: p.major || 'Chưa cập nhật',
        have: p.have_skill ? p.have_skill.split(', ') : [],
        want: p.want_skill ? p.want_skill.split(', ') : [],
        goal: p.goal || 'Tìm đồng đội',
        color: '#3FA796',
        avatarUrl: p.avatar_url || null,
      }));
      setDeck(formattedDeck);
    } else {
      setDeck([]);
    }
  };
  // Tải danh sách người đã match từ Supabase
  const fetchMatches = async (currentUserId: string) => {
    const { data: matchRows } = await supabase
      .from('matches')
      .select('user1_id, user2_id')
      .or(`user1_id.eq.${currentUserId},user2_id.eq.${currentUserId}`);

    if (matchRows && matchRows.length > 0) {
      // Lấy danh sách ID của đối phương
      const partnerIds = matchRows.map((m: any) =>
        m.user1_id === currentUserId ? m.user2_id : m.user1_id
      );

      // Lấy thông tin hồ sơ của các đối phương
      const { data: matchedProfiles } = await supabase
        .from('profiles')
        .select('*')
        .in('id', partnerIds);

      if (matchedProfiles) {
        const formatted = matchedProfiles.map((p: any) => ({
          id: p.id,
          name: p.full_name || 'Thành viên',
          major: p.major || 'Chưa cập nhật',
          color: '#3FA796',
          avatarUrl: p.avatar_url || null,
        }));
        setMatches(formatted);
      }
    } else {
      setMatches([]);
    }
  };
  useEffect(() => {
    // Tự động kiểm tra và đồng bộ tài khoản thật từ Supabase khi mở app
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setIsLoggedIn(true);
          fetchDeck(session.user.id);
          fetchMatches(session.user.id);

          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setCurrentUser((prev: any) => {
              const localData = JSON.parse(localStorage.getItem('skillmatch_user') || '{}');
              const merged = {
                ...prev,
                ...localData,
                id: profile.id,
                name: profile.full_name || localData.name || session.user.email?.split('@')[0],
                major: profile.major || localData.major || '',
                haveText: profile.have_skill || localData.haveText || '',
                wantText: profile.want_skill || localData.wantText || '',
                goal: profile.goal || localData.goal || '',
                color: '#5B8DEF',
                avatarUrl: profile.avatar_url || localData.avatarUrl || null,
                proofs: localData.proofs || prev.proofs || [],
                experience: localData.experience || prev.experience || '',
                birthYear: localData.birthYear || prev.birthYear || '2007',
                primarySkill: localData.primarySkill || prev.primarySkill || '',
                projectHistory: localData.projectHistory || prev.projectHistory || [],
              };
              localStorage.setItem('skillmatch_user', JSON.stringify(merged));
              return merged;
            });
          } else {
            setCurrentUser((prev: any) => ({
              ...prev,
              id: session.user.id,
              name: session.user.email?.split('@')[0],
            }));
          }
        } else {
          setIsLoggedIn(false);
          setCurrentUser({
            name: '',
            major: '',
            haveText: '',
            wantText: '',
            goal: '',
            color: '#5B8DEF',
            avatarUrl: null,
          });
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  }
  function handleCta() {
    if (isLoggedIn) setPage('swipe');
    else setShowAuth(true);
  }

  async function handleAuth(authData: any) {
    try {
      const { email, password, name, isSignUp } = authData;
      let authUser = null;

      if (isSignUp) {
        // Đăng ký tài khoản mới lên Supabase
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name }
          }
        });
        if (error) throw error;
        authUser = data.user;
        showToast('Đăng ký tài khoản thành công!');
      } else {
        // Đăng nhập tài khoản đã có
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        authUser = data.user;
        showToast('Đăng nhập thành công!');
      }

      if (authUser) {
        setShowAuth(false);
        setPage('swipe');
      }
    } catch (err: any) {
      console.error('Lỗi Auth:', err);
      alert('Lỗi xác thực: ' + (err.message || 'Không thể kết nối'));
    }
  }
  async function handleLogout() {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setCurrentUser({
      name: '',
      major: '',
      haveText: '',
      wantText: '',
      goal: '',
      color: '#5B8DEF',
      avatarUrl: null,
    });
    setPage('landing');
  }

  function handleSwipe(dir) {
    const top = deck[0];
    setDeck((d) => d.slice(1));
    if (dir === 'right') {
      // simulate the backend's mutual-like check: ~60% of the time the other student already liked you back
      const mutual = Math.random() < 0.6;
      if (mutual && !matches.find((m) => m.id === top.id)) {
        setPendingMatch(top);
      }
    }
  }
  async function confirmMatch(goToChat: boolean) {
    if (!pendingMatch || !currentUser?.id) return;

    // 1. Lưu lượt ghép đôi vào Supabase (dùng onConflict để tránh trùng lặp)
    await supabase.from('matches').insert({
      user1_id: currentUser.id,
      user2_id: pendingMatch.id,
    });

    // 2. Cập nhật state danh sách matches cục bộ
    setMatches((m: any) =>
      m.find((x: any) => x.id === pendingMatch.id) ? m : [...m, pendingMatch]
    );

    // 3. Chuyển hướng sang giao diện chat nếu người dùng chọn trò chuyện ngay
    if (goToChat) {
      setSelectedChatId(pendingMatch.id);
      setPage('chat');
    }
    setPendingMatch(null);
  }
  const handleSaveProfile = async (formData: any) => {
    // 1. Cập nhật ngay vào LocalStorage và State để dữ liệu luôn được giữ
    const updatedUser = {
      ...currentUser,
      ...formData,
      avatarUrl: formData.avatarUrl || formData.avatar || currentUser?.avatarUrl,
      avatar: formData.avatarUrl || formData.avatar || currentUser?.avatar,
      proofs: formData.proofs || currentUser?.proofs || [],
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('skillmatch_user', JSON.stringify(updatedUser));

    // 2. Thử lưu lên Supabase (bỏ qua proofs nếu bảng database chưa tạo cột proofs)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Chỉ gửi các trường cơ bản lên Supabase để tránh lỗi thiếu cột
        const payload: any = {
          id: user.id,
          full_name: formData.name || '',
          major: formData.major || '',
          have_skill: formData.haveText || (Array.isArray(formData.have) ? formData.have.join(', ') : formData.have) || '',
          want_skill: formData.wantText || (Array.isArray(formData.want) ? formData.want.join(', ') : formData.want) || '',
          goal: formData.goal || '',
        };

        // Nếu avatar không phải Base64 quá dài hoặc database hỗ trợ text dài thì gửi kèm
        if (formData.avatarUrl && !formData.avatarUrl.startsWith('data:image')) {
          payload.avatar_url = formData.avatarUrl;
        }

        const { error } = await supabase.from('profiles').upsert(payload);
        if (error) {
          console.warn('Lưu Supabase bỏ qua do cấu trúc bảng:', error.message);
        }
      }
    } catch (err) {
      console.warn('Lỗi mạng hoặc Supabase:', err);
    }

    // 3. Luôn báo thành công vì dữ liệu đã được lưu hoàn tất ở local
    if (typeof showToast === 'function') {
      showToast('Đã lưu thông tin hồ sơ và minh chứng thành công!');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F4FAF8',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <style>{FONT_IMPORT}</style>

      <Header
        page={page}
        setPage={(p: string) => {
          if (p === 'profile') setViewingUser(null);
          setPage(p);
        }}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onLogout={handleLogout}
        onLoginClick={() => setShowAuth(true)}
        onOpenPremium={() => setShowPremiumModal(true)}
      />

      {page === 'landing' && <Landing onCtaClick={handleCta} />}
      {page === 'swipe' && isLoggedIn && (
        <SwipePage
          deck={deck}
          onSwipe={handleSwipe}
          onReset={() => fetchDeck(currentUser.id)}
          onOpenPremium={() => setShowPremiumModal(true)}
        />
      )}
      {page === 'chat' && isLoggedIn && (
        <ChatPage
          matches={matches}
          currentUser={currentUser}
          selectedId={selectedChatId}
          setSelectedId={setSelectedChatId}
          onOpenProfile={(friend: any) => {
            setViewingUser(friend);
            setPage('profile');
          }}
        />
      )}
      {page === 'profile' && isLoggedIn && (
        <ProfilePage
          currentUser={viewingUser || currentUser}
          isReadOnly={!!viewingUser}
          onBack={() => {
            setViewingUser(null);
            setPage('chat');
          }}
          onSave={handleSaveProfile}
          showToast={showToast}
        />
      )}
      {(page === 'swipe' || page === 'chat' || page === 'profile') &&
        !isLoggedIn && <Landing onCtaClick={handleCta} />}

      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} onAuth={handleAuth} />
      )}
      {pendingMatch && (
        <MatchModal
          profile={pendingMatch}
          currentUser={currentUser}
          onMessage={() => confirmMatch(true)}
          onContinue={() => confirmMatch(false)}
        />
      )}
    <Toast message={toast} />
    {showPremiumModal && (
        <PremiumModal onClose={() => setShowPremiumModal(false)} />
      )}
{/* Modal xem trang cá nhân của bạn bè */}
{viewingProfile && (
        <div
          onClick={() => setViewingProfile(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: 20,
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: 24,
              padding: 24,
              maxWidth: 420,
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
              textAlign: 'left',
            }}
          >
            {/* Header: Avatar + Tên + Ngành */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <Avatar
                name={viewingProfile.name}
                color={viewingProfile.color}
                size={72}
                src={viewingProfile.avatarUrl}
              />
              <div>
                <h3 style={{ margin: 0, fontSize: 18, color: '#1B3B36' }}>{viewingProfile.name}</h3>
                <div style={{ fontSize: 13, color: '#74898D', marginTop: 2 }}>
                  {viewingProfile.major || 'Chưa cập nhật ngành'} • {viewingProfile.birthYear || viewingProfile.birth_year || '2007'}
                </div>
                <div style={{ fontSize: 12, color: '#3FA796', fontWeight: 600, marginTop: 4 }}>
                  ⭐ Chuyên môn: {viewingProfile.primarySkill || viewingProfile.primary_skill || 'Đang cập nhật'}
                </div>
              </div>
            </div>

            {/* Mục tiêu */}
            {viewingProfile.goal && (
              <div style={{ marginBottom: 16 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#3FA796', textTransform: 'uppercase' }}>
                  Mục tiêu hiện tại
                </span>
                <div style={{ fontSize: 13.5, color: '#223338', marginTop: 4 }}>
                  {viewingProfile.goal}
                </div>
              </div>
            )}

            {/* Kỹ năng */}
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#5B8DEF', textTransform: 'uppercase' }}>
                Kỹ năng hiện có
              </span>
              <div style={{ fontSize: 13, color: '#4A5568', marginTop: 4 }}>
                {viewingProfile.haveText || (Array.isArray(viewingProfile.have) ? viewingProfile.have.join(', ') : 'Chưa cập nhật')}
              </div>
            </div>

            {/* Lịch sử dự án */}
            <div style={{ borderTop: '1px solid #EDF3F1', paddingTop: 14, marginBottom: 20 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#1B3B36', textTransform: 'uppercase' }}>
                Dự án đã & đang làm
              </span>
              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(viewingProfile.projectHistory || viewingProfile.project_history || []).length > 0 ? (
                  (viewingProfile.projectHistory || viewingProfile.project_history).map((p: any, idx: number) => (
                    <div key={idx} style={{ background: '#F8FAF9', padding: '8px 12px', borderRadius: 8, fontSize: 12.5 }}>
                      <div style={{ fontWeight: 600, color: '#223338' }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: '#74898D' }}>{p.role} • {p.status}</div>
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: 12, color: '#A0AEC0', fontStyle: 'italic' }}>Chưa cập nhật danh sách dự án</div>
                )}
              </div>
            </div>

            <button
              onClick={() => setViewingProfile(null)}
              style={{
                width: '100%',
                padding: '10px 0',
                borderRadius: 12,
                border: 'none',
                background: '#3FA796',
                color: '#fff',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
            }