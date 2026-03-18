/**
 * Generate Play Store Feature Graphic (1024x500) for Vietlott 6/45
 * Usage: node store-assets/generate-feature-graphic.js
 * Output: store-assets/feature-graphic.png
 */

const sharp = require('../node_modules/sharp');
const path = require('path');

const WIDTH = 1024;
const HEIGHT = 500;
const OUTPUT = path.join(__dirname, 'feature-graphic.png');

// Build an SVG with a gradient background and text overlay.
// sharp renders SVG natively via librsvg.
const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Main diagonal gradient: orange → dark navy -->
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#e8722a"/>
      <stop offset="55%"  stop-color="#b84e12"/>
      <stop offset="100%" stop-color="#111a24"/>
    </linearGradient>

    <!-- Subtle radial glow behind the title -->
    <radialGradient id="glow" cx="50%" cy="48%" r="35%">
      <stop offset="0%"   stop-color="#ffffff" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>

    <!-- Drop-shadow filter for text -->
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000000" flood-opacity="0.55"/>
    </filter>
  </defs>

  <!-- Background gradient -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>

  <!-- Glow overlay -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>

  <!-- Decorative circle accents -->
  <circle cx="80"  cy="80"  r="120" fill="#ffffff" fill-opacity="0.04"/>
  <circle cx="944" cy="420" r="160" fill="#ffffff" fill-opacity="0.04"/>
  <circle cx="512" cy="250" r="260" fill="#ffffff" fill-opacity="0.03"/>

  <!-- Horizontal rule above subtitle -->
  <line x1="312" y1="330" x2="712" y2="330"
        stroke="#ffffff" stroke-opacity="0.30" stroke-width="1.5"/>

  <!-- Main title: 6/45 -->
  <text
    x="512" y="285"
    font-family="'Arial Black', 'Arial', sans-serif"
    font-size="160"
    font-weight="900"
    fill="#ffffff"
    text-anchor="middle"
    dominant-baseline="auto"
    letter-spacing="-4"
    filter="url(#shadow)"
  >6/45</text>

  <!-- Subtitle -->
  <text
    x="512" y="378"
    font-family="'Arial', sans-serif"
    font-size="32"
    font-weight="400"
    fill="#ffe0c8"
    text-anchor="middle"
    dominant-baseline="auto"
    letter-spacing="2"
    filter="url(#shadow)"
  >Thống kê &amp; Phân tích Vietlott</text>

  <!-- Small badge / tagline at bottom -->
  <text
    x="512" y="450"
    font-family="'Arial', sans-serif"
    font-size="18"
    font-weight="400"
    fill="#ffffff"
    fill-opacity="0.55"
    text-anchor="middle"
    dominant-baseline="auto"
    letter-spacing="1"
  >Phân tích tần suất · Gợi ý bộ số · Kết quả trực tiếp</text>
</svg>
`.trim();

async function generate() {
  try {
    await sharp(Buffer.from(svg))
      .png({ compressionLevel: 9 })
      .toFile(OUTPUT);

    console.log(`Feature graphic generated successfully: ${OUTPUT}`);
    console.log(`Dimensions: ${WIDTH}x${HEIGHT} px`);
  } catch (err) {
    console.error('Error generating feature graphic:', err);
    process.exit(1);
  }
}

generate();
