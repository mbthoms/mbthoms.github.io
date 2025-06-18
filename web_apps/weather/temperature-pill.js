/* ──────────────────────────────────────────────────────────────
  TemperaturePill – mini one-line temperature gradient bar
  © 2025  (MIT-licensed – edit freely)

  HOW TO USE
  ----------
  1.  Make sure Bootstrap 5 JS is loaded (you already have it).
  2.  Include this script after Bootstrap ( <script src="temperature-pill.js"></script> ).
  3.  Call:

        TemperaturePill.render(
          target,                     // CSS selector or DOM element
          {
            minTemp: Number,          // lowest temp in °C
            maxTemp: Number,          // highest temp in °C
            currentTemp: Number,      // current temp in °C
            width: "100%",            // any CSS length | optional
            height: 12,               // px | optional
            dotSize: 14,              // px | optional
            showDot: true             // boolean | optional
          }
        );

      Example:
        TemperaturePill.render("#weatherResult", {
          minTemp: -5,
          maxTemp: 32,
          currentTemp: 18
        });

  4.  The function appends a pill bar and a dot.  Hover the dot to see
      a Bootstrap tooltip with the exact current temperature.

  Custom styling?  Either tweak the colours array below or override the
  `.tp-track` / `.tp-dot` classes in your CSS.

 ────────────────────────────────────────────────────────────── */
const TemperaturePill = (() => {
  /** Absolute colour ramp (°C → colour).  Edit freely. */
  const COLOUR_STOPS = [
    { t: -30, c: "#002f6c" }, // very cold deep navy
    { t: 0,   c: "#4fc3ff" }, // 0 °C      light blue
    { t: 5,  c: "#00bcd4" },          // cool cyan (between 0 °C and 10 °C)
    { t: 10,  c: "#4caf50" }, // mild      green
    { t: 15, c: "#ffc107" },          // mild‑warm amber (between 10 °C and 20 °C)
    { t: 20,  c: "#ff9800" }, // warm      orange
    { t: 25,  c: "#f44336" }, // hot       red
    { t: 30, c: "#ff5722" },          // very‑warm deep‑orange (between 25 °C and 40 °C)
    { t: 40,  c: "#b71c1c" }  // extreme   dark red
  ];

  /* Inject base styles once per page. */
  let stylesInserted = false;
  function insertBaseStyles () {
    if (stylesInserted) return;
    stylesInserted = true;
    const style = document.createElement("style");
    style.textContent = `
      /* TemperaturePill – base styles */
      .tp-container {
        /* use flex so labels and track share the width responsively */
        display: flex;
        align-items: center;
        width: 100%;
        box-sizing: border-box;
      }
      .tp-track {
        /* track takes up all available space between labels */
        flex: 1;
        height: 100%;
        margin: 0 0.25em;               /* gap to labels */
        border-radius: 9999px;         /* pill ends */
        background-size: 100% 100%;
      }
      .tp-dot{
        position:absolute;top:50%;
        transform:translate(-50%,-50%);
        border-radius:50%;
        background:#fff;
        border:2px solid rgba(0,0,0,.15);
        cursor:pointer;
      }
      /* min/max labels */
      .tp-label-min,
      .tp-label-max {
        position: static;             /* participate in flex layout */
        color: white;
        font-size: 0.75em;
        user-select: none;
        pointer-events: none;
      }
      .tp-label-min { margin-right: 0.25em; }
      .tp-label-max { margin-left: 0.25em; }
  `;
    document.head.appendChild(style);
  }

  /* Build a CSS gradient string covering the range [min,max]. */
  function buildGradient(min, max) {
    // Filter colour stops that fall inside or at ends
    const inRange = COLOUR_STOPS.filter(s => s.t >= min && s.t <= max);
    // If no predefined stops fall inside the [min, max] span, use the colours
    // immediately below and above the range to create a two‑colour gradient.
    if (inRange.length === 0) {
      const lower = COLOUR_STOPS.findLast(s => s.t < min) ?? null;
      const upper = COLOUR_STOPS.find(s => s.t > max)  ?? null;

      if (lower && upper) {
        // Treat these bracket colours as if they were inside the range so the
        // remainder of the algorithm builds a proper gradient.
        inRange.push(
          { t: min, c: lower.c },
          { t: max, c: upper.c }
        );
      } else {
        // Range sits completely outside the palette; fall back to the nearest
        // extreme so the bar is still visible.
        const extreme = lower ? lower.c
                              : (upper ? upper.c : COLOUR_STOPS[0].c);
        return extreme;
      }
    }
    if (inRange[0].t !== min) {
      const prev = COLOUR_STOPS.findLast(s => s.t < min) || inRange[0];
      inRange.unshift({ t: min, c: prev.c });
    }
    if (inRange[inRange.length - 1].t !== max) {
      const next = COLOUR_STOPS.find(s => s.t > max) || inRange[inRange.length - 1];
      inRange.push({ t: max, c: next.c });
    }
    // Convert to % positions
    const span = max - min;
    const stopsStr = inRange.map(s => {
      const pct = ((s.t - min) / span) * 100;
      return `${s.c} ${pct.toFixed(2)}%`;
    }).join(", ");
    return `linear-gradient(90deg, ${stopsStr})`;
  }

  /* Clamp helper */
  const clamp = (v,min,max)=>Math.min(Math.max(v,min),max);

  /* Main public render function */
  function render(target, opts){
    insertBaseStyles();
    const {
      minTemp, maxTemp, currentTemp,
      width="100%", height=12, dotSize=14,
      showDot=true
    } = opts;

    if (typeof minTemp!=="number"||typeof maxTemp!=="number"||typeof currentTemp!=="number"){
      throw new Error("minTemp, maxTemp & currentTemp must be numbers (°C).");
    }
    if (maxTemp<=minTemp) throw new Error("maxTemp must be greater than minTemp.");

    // Resolve container
    const container = (typeof target==="string")
      ? document.querySelector(target)
      : target;
    if (!container) throw new Error("TemperaturePill: target element not found.");

    /* Build DOM */
    const pill = document.createElement("div");
    pill.className="tp-container";
    pill.style.width = width;
    pill.style.height = height+"px";

    const track=document.createElement("div");
    track.className="tp-track";
    track.style.position = "relative";
    track.style.background = buildGradient(minTemp,maxTemp);

    // Add min/max labels
    const labelMin = document.createElement("span");
    labelMin.className = "tp-label-min";
    labelMin.textContent = `${Math.round(minTemp)}°C`;
    const labelMax = document.createElement("span");
    labelMax.className = "tp-label-max";
    labelMax.textContent = `${Math.round(maxTemp)}°C`;
    // Append in order: labelMin → track → labelMax
    pill.appendChild(labelMin);
    pill.appendChild(track);
    pill.appendChild(labelMax);

    if (showDot) {
      const dot = document.createElement("div");
      dot.className="tp-dot";
      dot.setAttribute("data-bs-toggle","tooltip");
      dot.setAttribute("data-bs-placement","top");
      dot.setAttribute("title", `${currentTemp.toFixed(1)}°C`);
      dot.style.width=dot.style.height = dotSize+"px";

      // Position dot
      const pct = ((clamp(currentTemp,minTemp,maxTemp)-minTemp)/(maxTemp-minTemp))*100;
      dot.style.left = pct+"%";

      // Assemble
      track.appendChild(dot);

      // Activate Bootstrap tooltip
      if (typeof bootstrap!=="undefined" && bootstrap.Tooltip){
        new bootstrap.Tooltip(dot);
      }
    }

    container.appendChild(pill);

    /* Return the created elements in case the caller wants handles */
    return {pill, track};
  }

  return { render };
})();

/* Export for ES modules if desired */
if (typeof module!=="undefined") module.exports = TemperaturePill;
