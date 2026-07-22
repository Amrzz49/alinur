export function Goalkeeper() {
  return (
    <svg className="keeper-svg" viewBox="0 0 160 190" role="img" aria-label="Вратарь">
      <defs>
        <linearGradient id="keeper-shirt" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#31c5dc" /><stop offset=".48" stopColor="#0877b8" /><stop offset="1" stopColor="#06427f" />
        </linearGradient>
        <linearGradient id="keeper-skin" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#f0bc8f" /><stop offset=".55" stopColor="#c67b50" /><stop offset="1" stopColor="#8e4d32" />
        </linearGradient>
        <linearGradient id="keeper-glove" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fff7a6" /><stop offset=".5" stopColor="#f2ca28" /><stop offset="1" stopColor="#ae7104" />
        </linearGradient>
        <filter id="keeper-shadow"><feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity=".4" /></filter>
      </defs>
      <g filter="url(#keeper-shadow)">
        <ellipse cx="80" cy="184" rx="47" ry="5" fill="#00152d" opacity=".46" />

        <path d="M57 111 C62 107 72 106 79 111 L75 156 C70 161 60 160 54 155 Z" fill="#123d79" />
        <path d="M81 111 C89 106 99 107 104 112 L108 155 C102 161 92 161 86 156 Z" fill="#10366c" />
        <path d="M54 151 L75 151 L73 171 L50 171 Z M87 151 L108 151 L112 171 L89 171 Z" fill="#e8f5fa" />
        <path d="M50 158 L73 158 M89 158 L109 158" stroke="#2b9bc1" strokeWidth="4" />
        <path d="M48 168 C57 165 68 167 74 173 L70 181 L41 181 C39 176 42 171 48 168 Z" fill="#0b1425" />
        <path d="M89 173 C97 166 108 166 115 171 L122 179 C113 182 97 182 87 180 Z" fill="#0b1425" />
        <path d="M42 101 C62 94 99 94 119 101 L110 122 C91 129 69 129 50 122 Z" fill="#082d62" />

        <path d="M52 50 C66 43 94 43 108 50 L116 105 C97 117 63 117 44 105 Z" fill="url(#keeper-shirt)" stroke="#c8f4ff" strokeWidth="2" />
        <path d="M58 51 C66 59 94 59 102 51" fill="none" stroke="#d9f8ff" strokeWidth="3" />
        <path d="M47 56 C37 57 30 64 24 75 L10 96" fill="none" stroke="#1587b5" strokeWidth="18" strokeLinecap="round" />
        <path d="M113 56 C123 57 130 64 136 75 L150 96" fill="none" stroke="#0d72a4" strokeWidth="18" strokeLinecap="round" />
        <path d="M30 66 L18 84 M130 66 L142 84" stroke="#bfeeff" strokeWidth="2" opacity=".7" />

        <g fill="url(#keeper-glove)" stroke="#fff2a4" strokeWidth="2">
          <path d="M4 87 C-2 91 0 104 8 110 C16 113 24 108 25 100 L21 88 C18 82 13 81 10 88 C8 83 5 83 4 87 Z" />
          <path d="M156 87 C162 91 160 104 152 110 C144 113 136 108 135 100 L139 88 C142 82 147 81 150 88 C152 83 155 83 156 87 Z" />
        </g>
        <path d="M5 92 L14 104 M10 87 L18 100 M155 92 L146 104 M150 87 L142 100" stroke="#a36c06" strokeWidth="1.5" />

        <path d="M69 42 L69 51 C73 56 87 56 91 51 L91 42" fill="url(#keeper-skin)" />
        <ellipse cx="80" cy="27" rx="20" ry="24" fill="url(#keeper-skin)" stroke="#70402c" strokeWidth="1.5" />
        <path d="M60 26 C58 7 68 1 81 2 C96 3 102 14 99 29 C92 18 76 13 62 20 Z" fill="#17181d" />
        <path d="M62 19 C69 9 88 8 98 21" fill="none" stroke="#30323a" strokeWidth="3" />
        <path d="M66 26 Q71 22 76 26 M84 26 Q90 22 95 27" fill="none" stroke="#5c3527" strokeWidth="1.5" />
        <ellipse cx="71" cy="29" rx="2" ry="1.7" fill="#17191d" /><ellipse cx="90" cy="29" rx="2" ry="1.7" fill="#17191d" />
        <path d="M80 29 L77 36 L82 37 M71 42 Q80 47 90 41" fill="none" stroke="#754431" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M63 35 C65 47 71 52 80 52 C89 52 96 46 98 35 C92 43 88 47 80 47 C72 47 68 43 63 35 Z" fill="#3b2621" opacity=".8" />

        <path d="M48 91 C67 97 93 97 112 91" fill="none" stroke="#6fe4ef" strokeWidth="2" />
        <path d="M58 62 L102 62" stroke="#d8f8ff" strokeWidth="1" opacity=".35" />
        <text x="80" y="91" fill="white" fontSize="29" fontWeight="900" textAnchor="middle">1</text>
      </g>
    </svg>
  );
}
