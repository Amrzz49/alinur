export function Goalkeeper() {
  return <svg className="keeper-svg" viewBox="0 0 140 165" aria-label="Вратарь">
    <defs>
      <linearGradient id="jersey" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#35c8df"/><stop offset="1" stopColor="#0863a8"/></linearGradient>
      <linearGradient id="skin" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#e9a978"/><stop offset="1" stopColor="#a9613d"/></linearGradient>
      <filter id="shadow"><feDropShadow dx="0" dy="3" stdDeviation="2" floodOpacity=".35"/></filter>
    </defs>
    <g filter="url(#shadow)">
      <ellipse cx="70" cy="161" rx="39" ry="4" fill="#06152f" opacity=".45"/>
      <path d="M53 99 L68 99 L64 139 L47 139 Z" fill="#163c78"/>
      <path d="M72 99 L87 99 L93 139 L76 139 Z" fill="#163c78"/>
      <path d="M47 136 L64 136 L62 151 L45 151 Z M76 136 L93 136 L96 151 L79 151 Z" fill="#d8efff"/>
      <path d="M43 148 Q54 145 64 150 L62 158 L39 158 Q37 153 43 148 Z" fill="#11192c"/>
      <path d="M78 150 Q88 145 98 151 L102 157 L78 158 Z" fill="#11192c"/>
      <path d="M48 88 Q70 81 92 88 L88 109 Q70 116 52 109 Z" fill="#092d68"/>
      <path d="M48 42 Q70 34 92 42 L98 91 Q70 102 42 91 Z" fill="url(#jersey)" stroke="#bdefff" strokeWidth="2"/>
      <path d="M48 44 L29 51 L12 76" fill="none" stroke="#1592bd" strokeWidth="15" strokeLinecap="round"/>
      <path d="M92 44 L111 51 L128 76" fill="none" stroke="#1592bd" strokeWidth="15" strokeLinecap="round"/>
      <path d="M31 49 L24 61 M109 49 L116 61" stroke="#d5f7ff" strokeWidth="2"/>
      <path d="M13 67 Q3 66 2 76 Q4 89 15 88 Q24 82 21 72 Z" fill="#f3c432" stroke="#fff3a3" strokeWidth="2"/>
      <path d="M127 67 Q137 66 138 76 Q136 89 125 88 Q116 82 119 72 Z" fill="#f3c432" stroke="#fff3a3" strokeWidth="2"/>
      <path d="M7 72 L13 82 M133 72 L127 82" stroke="#b47b0d" strokeWidth="2"/>
      <rect x="62" y="31" width="16" height="14" rx="6" fill="url(#skin)"/>
      <ellipse cx="70" cy="21" rx="18" ry="21" fill="url(#skin)" stroke="#59331f" strokeWidth="1.5"/>
      <path d="M52 18 Q53 -1 70 0 Q88 1 88 19 Q79 10 55 14 Z" fill="#241a19"/>
      <path d="M56 17 Q63 13 67 18 M74 18 Q79 13 85 18" fill="none" stroke="#4a2b20" strokeWidth="1.5"/>
      <circle cx="62" cy="20" r="1.7" fill="#17171a"/><circle cx="79" cy="20" r="1.7" fill="#17171a"/>
      <path d="M70 21 L68 28 L73 28 M64 33 Q70 37 77 32" fill="none" stroke="#713e2c" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M61 42 Q70 50 79 42" fill="none" stroke="#d7f8ff" strokeWidth="3"/>
      <text x="70" y="75" fill="white" fontSize="25" fontWeight="900" textAnchor="middle">1</text>
      <path d="M52 88 Q70 94 88 88" fill="none" stroke="#72d9ed" strokeWidth="2"/>
    </g>
  </svg>;
}
