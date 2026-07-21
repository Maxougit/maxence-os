import React from 'react';

// Icônes d'applications façon macOS : squircle + dégradé + glyphe.
// Tout est en SVG/CSS inline pour rester net à toutes les tailles (Dock magnifié).

const Squircle = ({ gradient, children, border = true }) => (
  <div
    aria-hidden
    style={{
      width: '100%',
      height: '100%',
      borderRadius: '24%',
      background: gradient,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: border
        ? 'inset 0 1px 1px rgba(255,255,255,0.35), inset 0 -1px 2px rgba(0,0,0,0.18), 0 1px 2px rgba(0,0,0,0.28)'
        : '0 1px 2px rgba(0,0,0,0.28)',
      overflow: 'hidden',
    }}
  >
    {children}
  </div>
);

export const FinderIcon = () => (
  <Squircle gradient="linear-gradient(180deg,#8ed0fb 0%,#4aa8f0 100%)">
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
      <path d="M0 0h54c-8 16-12 32-12 50s4 34 12 50H0z" fill="#57b1f5" />
      <path d="M54 0h46v100H54c-8-16-12-32-12-50s4-34 12-50z" fill="#1e7de0" />
      <path
        d="M30 34v12M70 34v12"
        stroke="#0b3f77"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      <path
        d="M24 66c17 12 35 12 52 0"
        fill="none"
        stroke="#0b3f77"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
    </svg>
  </Squircle>
);

export const LaunchpadIcon = () => (
  <Squircle gradient="linear-gradient(180deg,#4a4a52 0%,#26262c 100%)">
    <svg viewBox="0 0 100 100" style={{ width: '62%', height: '62%' }}>
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={6 + col * 32}
            y={6 + row * 32}
            width="24"
            height="24"
            rx="6"
            fill={
              ['#ff5f57', '#febc2e', '#28c840', '#0a84ff', '#bf5af2', '#ff9f0a', '#64d2ff', '#ff375f', '#30d158'][
                row * 3 + col
              ]
            }
          />
        ))
      )}
    </svg>
  </Squircle>
);

export const TerminalAppIcon = () => (
  <Squircle gradient="linear-gradient(180deg,#3b3b41 0%,#111114 100%)">
    <svg viewBox="0 0 100 100" style={{ width: '70%', height: '70%' }}>
      <path
        d="M18 30l22 18-22 18"
        fill="none"
        stroke="#fff"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M50 70h32" stroke="#fff" strokeWidth="9" strokeLinecap="round" />
    </svg>
  </Squircle>
);

export const PreviewIcon = () => (
  <Squircle gradient="linear-gradient(180deg,#ffffff 0%,#e8e8ee 100%)">
    <svg viewBox="0 0 100 100" style={{ width: '72%', height: '72%' }}>
      <rect x="14" y="6" width="72" height="88" rx="10" fill="#fff" stroke="#d0d0d8" strokeWidth="2" />
      <text
        x="50"
        y="52"
        textAnchor="middle"
        fontSize="30"
        fontWeight="700"
        fill="#e0383e"
        fontFamily="inherit"
      >
        PDF
      </text>
      <path d="M26 68h48M26 78h34" stroke="#c4c4cc" strokeWidth="4" strokeLinecap="round" />
    </svg>
  </Squircle>
);

export const NotesIcon = () => (
  <Squircle gradient="linear-gradient(180deg,#fdfdf8 0%,#f2f2ea 100%)">
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
      <rect x="0" y="0" width="100" height="26" fill="#fdbe2e" />
      <circle cx="22" cy="13" r="4" fill="#fff8" />
      <circle cx="50" cy="13" r="4" fill="#fff8" />
      <circle cx="78" cy="13" r="4" fill="#fff8" />
      <path d="M16 44h68M16 60h68M16 76h44" stroke="#c9c9c2" strokeWidth="5" strokeLinecap="round" />
    </svg>
  </Squircle>
);

export const DatabaseIcon = () => (
  <Squircle gradient="linear-gradient(180deg,#3fd0c9 0%,#0a84c0 100%)">
    <svg viewBox="0 0 100 100" style={{ width: '58%', height: '58%' }}>
      <ellipse cx="50" cy="20" rx="38" ry="14" fill="#fff" />
      <path d="M12 20v28c0 8 17 14 38 14s38-6 38-14V20" fill="none" stroke="#fff" strokeWidth="8" />
      <path d="M12 48v28c0 8 17 14 38 14s38-6 38-14V48" fill="none" stroke="#fff" strokeWidth="8" />
    </svg>
  </Squircle>
);

export const GameIcon = () => (
  <Squircle gradient="linear-gradient(180deg,#ff9f4a 0%,#f04a3e 100%)">
    <svg viewBox="0 0 100 100" style={{ width: '64%', height: '64%' }}>
      <circle cx="50" cy="50" r="34" fill="none" stroke="#fff" strokeWidth="7" />
      <circle cx="50" cy="50" r="10" fill="#fff" />
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <line
          key={angle}
          x1={50 + 12 * Math.cos((angle * Math.PI) / 180)}
          y1={50 + 12 * Math.sin((angle * Math.PI) / 180)}
          x2={50 + 32 * Math.cos((angle * Math.PI) / 180)}
          y2={50 + 32 * Math.sin((angle * Math.PI) / 180)}
          stroke="#fff"
          strokeWidth="6"
          strokeLinecap="round"
        />
      ))}
    </svg>
  </Squircle>
);

export const MailIcon = () => (
  <Squircle gradient="linear-gradient(180deg,#6db9ff 0%,#1668e3 100%)">
    <svg viewBox="0 0 100 100" style={{ width: '66%', height: '66%' }}>
      <rect x="8" y="22" width="84" height="56" rx="10" fill="#fff" />
      <path
        d="M12 30l38 28 38-28"
        fill="none"
        stroke="#1668e3"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </Squircle>
);

export const LinkedInIcon = () => (
  <Squircle gradient="linear-gradient(180deg,#0a78d0 0%,#0a66c2 100%)">
    <svg viewBox="0 0 100 100" style={{ width: '58%', height: '58%' }}>
      <rect x="10" y="34" width="16" height="56" rx="3" fill="#fff" />
      <circle cx="18" cy="16" r="10" fill="#fff" />
      <path
        d="M38 34h15v8c4-6 11-10 20-10 15 0 21 9 21 26v32H79V62c0-10-3-15-11-15-8 0-13 6-13 15v28H38z"
        fill="#fff"
      />
    </svg>
  </Squircle>
);

export const SafariIcon = () => (
  <Squircle gradient="linear-gradient(180deg,#f8f8fc 0%,#e4e4ec 100%)">
    <svg viewBox="0 0 100 100" style={{ width: '82%', height: '82%' }}>
      <defs>
        <linearGradient id="safariBlue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3fbbfd" />
          <stop offset="1" stopColor="#1c6ff1" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="42" fill="url(#safariBlue)" />
      {Array.from({ length: 12 }).map((_, i) => (
        <line
          key={i}
          x1={50 + 34 * Math.cos((i * 30 * Math.PI) / 180)}
          y1={50 + 34 * Math.sin((i * 30 * Math.PI) / 180)}
          x2={50 + 39 * Math.cos((i * 30 * Math.PI) / 180)}
          y2={50 + 39 * Math.sin((i * 30 * Math.PI) / 180)}
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      ))}
      <path d="M62 30L44 44 34 68l18-14z" fill="#fff" />
      <path d="M62 30L44 44l9 7z" fill="#ff4b40" />
    </svg>
  </Squircle>
);

export const TrashIcon = ({ full = false }) => (
  <Squircle gradient="transparent" border={false}>
    <svg viewBox="0 0 100 100" style={{ width: '92%', height: '92%' }}>
      <defs>
        <linearGradient id="trashBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e8e8ee" stopOpacity="0.9" />
          <stop offset="1" stopColor="#9a9aa4" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      {full && (
        <g>
          <rect x="30" y="10" width="18" height="12" rx="2" fill="#c9b458" transform="rotate(-14 39 16)" />
          <rect x="52" y="8" width="16" height="14" rx="2" fill="#7fb069" transform="rotate(10 60 15)" />
        </g>
      )}
      <path d="M26 24h48l-5 66c-.3 4-3 6-6 6H37c-3 0-5.7-2-6-6z" fill="url(#trashBody)" />
      <ellipse cx="50" cy="24" rx="24" ry="6" fill="#f4f4f8" opacity="0.95" />
      {Array.from({ length: 6 }).map((_, i) => (
        <line
          key={i}
          x1={32 + i * 7.2}
          y1="34"
          x2={35 + i * 6}
          y2="86"
          stroke="#71717a"
          strokeWidth="1.6"
          opacity="0.6"
        />
      ))}
    </svg>
  </Squircle>
);

export const SettingsIcon = () => (
  <Squircle gradient="linear-gradient(180deg,#8e8e96 0%,#4c4c54 100%)">
    <svg viewBox="0 0 100 100" style={{ width: '66%', height: '66%' }}>
      <circle cx="50" cy="50" r="16" fill="none" stroke="#e8e8ee" strokeWidth="8" />
      {Array.from({ length: 8 }).map((_, i) => (
        <line
          key={i}
          x1={50 + 26 * Math.cos((i * 45 * Math.PI) / 180)}
          y1={50 + 26 * Math.sin((i * 45 * Math.PI) / 180)}
          x2={50 + 38 * Math.cos((i * 45 * Math.PI) / 180)}
          y2={50 + 38 * Math.sin((i * 45 * Math.PI) / 180)}
          stroke="#e8e8ee"
          strokeWidth="9"
          strokeLinecap="round"
        />
      ))}
    </svg>
  </Squircle>
);

// --------------------------------------------------------------------------
// Icônes de fichiers / dossiers (Finder + Bureau)
// --------------------------------------------------------------------------

export const FolderIcon = () => (
  <svg viewBox="0 0 100 80" style={{ width: '100%', height: '100%' }}>
    <path
      d="M6 14c0-4 3-7 7-7h22l8 8h44c4 0 7 3 7 7v44c0 4-3 7-7 7H13c-4 0-7-3-7-7z"
      fill="#4aa8f0"
    />
    <path
      d="M6 24c0-4 3-6 7-6h74c4 0 7 2 7 6v42c0 4-3 7-7 7H13c-4 0-7-3-7-7z"
      fill="#7cc4fa"
    />
    <path d="M6 26h88v6H6z" fill="#ffffff22" />
  </svg>
);

export const FileIcon = ({ extension }) => {
  const config = {
    pdf: { label: 'PDF', color: '#e0383e' },
    txt: { label: 'TXT', color: '#8e8e96' },
    md: { label: 'MD', color: '#0a84ff' },
    jpg: { label: 'JPG', color: '#28a745' },
    png: { label: 'PNG', color: '#28a745' },
    mp4: { label: 'MP4', color: '#af52de' },
    zip: { label: 'ZIP', color: '#b58900' },
    css: { label: 'CSS', color: '#2965f1' },
  }[extension] || { label: extension?.toUpperCase() || '?', color: '#8e8e96' };

  return (
    <svg viewBox="0 0 76 96" style={{ width: '100%', height: '100%' }}>
      <path
        d="M8 8c0-4 3-7 7-7h34l19 19v68c0 4-3 7-7 7H15c-4 0-7-3-7-7z"
        fill="#fbfbfe"
        stroke="#d4d4dc"
        strokeWidth="1.5"
      />
      <path d="M49 1l19 19H53c-2.2 0-4-1.8-4-4z" fill="#e2e2ea" />
      <path d="M18 40h40M18 50h40M18 60h28" stroke="#d8d8e0" strokeWidth="3.4" strokeLinecap="round" />
      <rect x="14" y="68" width="34" height="16" rx="4" fill={config.color} />
      <text
        x="31"
        y="80"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill="#fff"
        fontFamily="inherit"
      >
        {config.label}
      </text>
    </svg>
  );
};
