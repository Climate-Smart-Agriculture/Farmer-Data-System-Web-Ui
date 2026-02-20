import React from "react";

interface SriLankaMapProps {
  selectedDistrict: string | null;

  districtData: Map<string, number>; // district name -> farmer count for color intensity

  onDistrictClick: (district: string) => void;
}

// SVG path data for each Sri Lankan district.
// Coordinate transform:  x = (lon - 79.4) * 88 + 80,  y = (10.0 - lat) * 96 + 12
// Reference anchors: lon80→x133, lon80.5→x177, lon81→x221 | lat9.5→y60, lat8→y204, lat7→y300, lat6→y396

const DISTRICT_PATHS: Record<
  string,
  { path: string; labelX: number; labelY: number }
> = {
  // ── Northern Province ──────────────────────────────────────────────────────
  Jaffna: {
    path: "M 104,40 L 118,20 L 150,18 L 168,30 L 165,48 L 154,60 L 133,60 L 107,54 Z",
    labelX: 133,
    labelY: 40,
  },
  Kilinochchi: {
    path: "M 133,60 L 154,60 L 178,60 L 178,84 L 172,96 L 148,96 L 130,80 Z",
    labelX: 155,
    labelY: 79,
  },
  Mannar: {
    path: "M 107,54 L 133,60 L 130,80 L 122,104 L 96,126 L 82,126 L 80,104 L 82,80 L 91,60 Z",
    labelX: 101,
    labelY: 92,
  },
  Mullaitivu: {
    path: "M 178,60 L 178,84 L 172,96 L 202,122 L 222,110 L 228,84 L 210,62 Z",
    labelX: 202,
    labelY: 90,
  },
  Vavuniya: {
    path: "M 96,126 L 122,104 L 148,96 L 172,96 L 202,122 L 198,154 L 172,163 L 128,163 L 96,126 Z",
    labelX: 152,
    labelY: 131,
  },

  // ── North Central Province ─────────────────────────────────────────────────
  Trincomalee: {
    path: "M 198,154 L 202,122 L 222,110 L 240,120 L 248,154 L 234,194 L 210,206 L 198,206 L 181,196 L 181,168 Z",
    labelX: 224,
    labelY: 163,
  },
  Anuradhapura: {
    path: "M 95,157 L 128,163 L 172,163 L 198,154 L 181,168 L 181,196 L 194,222 L 172,248 L 150,250 L 129,242 L 110,230 L 104,206 L 96,186 Z",
    labelX: 150,
    labelY: 204,
  },

  // ── North Western Province ─────────────────────────────────────────────────
  Puttalam: {
    path: "M 82,126 L 96,126 L 128,163 L 95,157 L 104,206 L 90,220 L 78,218 L 75,196 L 74,170 L 77,146 L 80,132 Z",
    labelX: 91,
    labelY: 185,
  },
  Kurunegala: {
    path: "M 110,230 L 129,242 L 150,250 L 172,252 L 194,252 L 190,278 L 170,294 L 147,298 L 123,288 L 105,272 L 104,252 L 100,236 Z",
    labelX: 148,
    labelY: 267,
  },

  // ── Eastern Province ───────────────────────────────────────────────────────
  Polonnaruwa: {
    path: "M 198,206 L 210,206 L 234,194 L 252,210 L 262,232 L 253,260 L 229,270 L 204,260 L 194,242 L 194,222 Z",
    labelX: 228,
    labelY: 234,
  },
  Batticaloa: {
    path: "M 253,260 L 276,256 L 291,274 L 284,310 L 268,324 L 249,320 L 238,304 L 239,276 Z",
    labelX: 265,
    labelY: 290,
  },
  Ampara: {
    path: "M 249,320 L 268,324 L 284,340 L 289,368 L 273,384 L 250,390 L 228,380 L 226,358 L 232,336 Z",
    labelX: 259,
    labelY: 357,
  },

  // ── Central Province ───────────────────────────────────────────────────────
  Matale: {
    path: "M 172,252 L 194,252 L 204,260 L 229,270 L 228,292 L 215,308 L 194,312 L 174,308 L 165,292 L 168,272 Z",
    labelX: 200,
    labelY: 282,
  },
  Kandy: {
    path: "M 170,298 L 194,312 L 215,312 L 234,326 L 232,348 L 217,360 L 197,365 L 176,358 L 167,342 L 168,322 Z",
    labelX: 201,
    labelY: 334,
  },
  "Nuwara Eliya": {
    path: "M 168,322 L 176,308 L 194,312 L 215,312 L 218,330 L 216,352 L 212,368 L 195,376 L 175,368 L 165,352 Z",
    labelX: 194,
    labelY: 346,
  },

  // ── Western Province ───────────────────────────────────────────────────────
  Gampaha: {
    path: "M 88,252 L 108,248 L 124,252 L 136,266 L 132,284 L 124,294 L 108,298 L 90,292 L 85,276 Z",
    labelX: 110,
    labelY: 273,
  },
  Colombo: {
    path: "M 90,292 L 108,298 L 114,316 L 108,336 L 94,340 L 79,332 L 78,315 Z",
    labelX: 97,
    labelY: 316,
  },
  Kalutara: {
    path: "M 79,332 L 94,340 L 108,336 L 117,352 L 116,372 L 104,388 L 87,386 L 76,374 L 75,355 Z",
    labelX: 95,
    labelY: 360,
  },

  // ── Sabaragamuwa Province ──────────────────────────────────────────────────
  Kegalle: {
    path: "M 123,288 L 147,298 L 170,298 L 178,314 L 167,338 L 143,344 L 120,334 L 108,318 L 108,298 Z",
    labelX: 143,
    labelY: 317,
  },
  Ratnapura: {
    path: "M 120,334 L 143,344 L 167,338 L 178,354 L 184,378 L 169,398 L 148,402 L 128,394 L 115,378 L 113,357 Z",
    labelX: 148,
    labelY: 370,
  },

  // ── Uva Province ───────────────────────────────────────────────────────────
  Badulla: {
    path: "M 215,312 L 234,326 L 252,336 L 259,358 L 252,378 L 229,388 L 209,378 L 204,360 L 208,338 L 215,328 Z",
    labelX: 231,
    labelY: 354,
  },
  Monaragala: {
    path: "M 209,378 L 229,388 L 250,390 L 271,384 L 280,400 L 265,414 L 241,418 L 219,412 L 203,398 L 201,382 Z",
    labelX: 238,
    labelY: 400,
  },

  // ── Southern Province ──────────────────────────────────────────────────────
  Galle: {
    path: "M 104,388 L 116,378 L 134,376 L 150,382 L 165,392 L 168,406 L 155,420 L 131,424 L 110,418 L 97,405 Z",
    labelX: 133,
    labelY: 402,
  },
  Matara: {
    path: "M 165,392 L 184,382 L 201,382 L 214,388 L 220,402 L 209,416 L 186,420 L 165,414 L 157,404 Z",
    labelX: 192,
    labelY: 402,
  },
  Hambantota: {
    path: "M 203,360 L 228,350 L 249,352 L 268,358 L 280,370 L 280,388 L 265,402 L 241,408 L 219,404 L 214,390 L 212,374 Z",
    labelX: 248,
    labelY: 380,
  },
};

// Map normalized district names to handle variations in DB data

const DISTRICT_NAME_MAP: Record<string, string> = {
  colombo: "Colombo",

  gampaha: "Gampaha",

  kalutara: "Kalutara",

  kandy: "Kandy",

  matale: "Matale",

  "nuwara eliya": "Nuwara Eliya",

  nuwaraeliya: "Nuwara Eliya",

  nuwara_eliya: "Nuwara Eliya",

  galle: "Galle",

  matara: "Matara",

  hambantota: "Hambantota",

  jaffna: "Jaffna",

  kilinochchi: "Kilinochchi",

  mannar: "Mannar",

  mullaitivu: "Mullaitivu",

  vavuniya: "Vavuniya",

  batticaloa: "Batticaloa",

  ampara: "Ampara",

  trincomalee: "Trincomalee",

  kurunegala: "Kurunegala",

  puttalam: "Puttalam",

  anuradhapura: "Anuradhapura",

  polonnaruwa: "Polonnaruwa",

  badulla: "Badulla",

  monaragala: "Monaragala",

  ratnapura: "Ratnapura",

  kegalle: "Kegalle",
};

/**

 * Normalize a district name from the DB to match our SVG map keys.

 */

export function normalizeDistrictName(name: string): string {
  const lower = name.trim().toLowerCase();

  return DISTRICT_NAME_MAP[lower] || name;
}

/**

 * Get color for a district based on its farmer count relative to max.

 */

function getDistrictColor(
  count: number,
  maxCount: number,
  isSelected: boolean,
): string {
  if (isSelected) return "#1b5e20";
  if (count === 0 || maxCount === 0) return "#e8eaf6";

  const intensity = Math.min(count / maxCount, 1);

  // White-blue → royal blue → dark navy
  const r = Math.round(232 - intensity * 210);
  const g = Math.round(234 - intensity * 175);
  const b = Math.round(246 - intensity * 120);
  return `rgb(${r},${g},${b})`;
}

const SriLankaMap: React.FC<SriLankaMapProps> = ({
  selectedDistrict,

  districtData,

  onDistrictClick,
}) => {
  const maxCount = Math.max(...Array.from(districtData.values()), 1);

  return (
    <svg
      viewBox="65 8 240 426"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", maxHeight: "540px" }}
    >
      <defs>
        {/* Water radial gradient */}
        <radialGradient id="waterGrad" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#b3d9f5" />
          <stop offset="100%" stopColor="#78b9e6" />
        </radialGradient>
        {/* Drop-shadow filter for selected district */}
        <filter
          id="districtShadow"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feDropShadow
            dx="0"
            dy="1"
            stdDeviation="2"
            floodColor="#0a3280"
            floodOpacity="0.5"
          />
        </filter>
        {/* Gradient for legend bar */}
        <linearGradient id="legendGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e8eaf6" />
          <stop offset="50%" stopColor="#5c8ae6" />
          <stop offset="100%" stopColor="#0d1b6e" />
        </linearGradient>
      </defs>

      {/* Water background */}
      <rect
        x="65"
        y="8"
        width="240"
        height="426"
        fill="url(#waterGrad)"
        rx="10"
      />

      {/* District paths */}
      {Object.entries(DISTRICT_PATHS).map(
        ([name, { path, labelX, labelY }]) => {
          const count = districtData.get(name) || 0;
          const isSelected = selectedDistrict === name;
          const fillColor = getDistrictColor(count, maxCount, isSelected);

          return (
            <g
              key={name}
              onClick={() => onDistrictClick(name)}
              style={{ cursor: "pointer" }}
              className="district-group"
            >
              <path
                d={path}
                fill={fillColor}
                stroke={isSelected ? "#0a3280" : "#1e5fa8"}
                strokeWidth={isSelected ? 1.8 : 0.6}
                strokeLinejoin="round"
                filter={isSelected ? "url(#districtShadow)" : undefined}
                className="district-path"
              />
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={isSelected ? 6.5 : 5.5}
                fontWeight={isSelected ? "bold" : "normal"}
                fill={isSelected ? "#fff" : "#1a237e"}
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {name}
              </text>
            </g>
          );
        },
      )}

      {/* Legend */}
      <g transform="translate(68, 408)">
        <text x="0" y="0" fontSize="6" fill="#1a237e" fontWeight="bold">
          Farmer Density
        </text>
        <rect
          x="0"
          y="5"
          width="90"
          height="7"
          fill="url(#legendGrad)"
          stroke="#90a4ae"
          strokeWidth="0.4"
          rx="1"
        />
        <text x="0" y="18" fontSize="4.5" fill="#444">
          Low
        </text>
        <text x="38" y="18" fontSize="4.5" fill="#444" textAnchor="middle">
          Med
        </text>
        <text x="90" y="18" fontSize="4.5" fill="#444" textAnchor="end">
          High
        </text>
        {/* Selected indicator */}
        <rect
          x="105"
          y="5"
          width="10"
          height="7"
          fill="#2e7d32"
          stroke="#0a3280"
          strokeWidth="0.5"
          rx="1"
        />
        <text x="118" y="11" fontSize="4.5" fill="#444">
          Selected
        </text>
      </g>
    </svg>
  );
};

export { DISTRICT_PATHS };

export default SriLankaMap;
