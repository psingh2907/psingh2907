// Builds the profile README's images from the portfolio's own assets:
// a banner with the real app screenshots in phone frames (light and dark),
// rounded app icons, the blog posts' share cards, and a tech strip drawn with
// simple-icons. Run from the repo root: node tools/build.mjs
import fs from 'node:fs';
import path from 'node:path';

import puppeteer from 'puppeteer-core';
import * as icons from 'simple-icons';

// The portfolio checkout, for its screenshots and app icons.
const SITE = process.env.SITE ?? path.join(process.env.HOME, 'Desktop/Projects/Next/praveensingh');

const OUT = path.resolve('assets');
fs.mkdirSync(path.join(OUT, 'apps'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'posts'), { recursive: true });
const dataUrl = (file) => `data:image/webp;base64,${fs.readFileSync(path.join(SITE, 'public', file)).toString('base64')}`;

const themes = {
  light: {
    bg: '#dde3f0', w: ['rgb(127 178 255 / 0.9)', 'rgb(201 179 255 / 0.85)', 'rgb(255 195 160 / 0.85)', 'rgb(159 227 214 / 0.8)'],
    text: '#1d1d1f', muted: '#4a4a52', chip: 'rgb(255 255 255 / 0.62)', chipBorder: 'rgb(0 0 0 / 0.06)', accent: '#0066cc', frame: '#1d1d1f',
  },
  dark: {
    bg: '#0b1026', w: ['rgb(37 99 235 / 0.55)', 'rgb(124 58 237 / 0.5)', 'rgb(234 88 12 / 0.35)', 'rgb(13 148 136 / 0.4)'],
    text: '#f5f5f7', muted: '#b4b4bd', chip: 'rgb(255 255 255 / 0.08)', chipBorder: 'rgb(255 255 255 / 0.12)', accent: '#2997ff', frame: '#0a0a0a',
  },
};

const banner = (t) => `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=block" rel="stylesheet">
<style>
  * { margin: 0; box-sizing: border-box; }
  body { width: 1280px; height: 400px; overflow: hidden; font-family: Geist, system-ui, sans-serif; color: ${t.text};
    background:
      radial-gradient(55% 60% at 12% 10%, ${t.w[0]}, transparent 70%),
      radial-gradient(45% 55% at 92% 6%, ${t.w[1]}, transparent 70%),
      radial-gradient(60% 65% at 84% 96%, ${t.w[2]}, transparent 70%),
      radial-gradient(55% 60% at 4% 100%, ${t.w[3]}, transparent 70%),
      ${t.bg}; }
  .copy { position: absolute; left: 72px; top: 64px; width: 640px; }
  .eyebrow { font: 600 17px Geist; letter-spacing: 0.02em; color: ${t.accent}; }
  h1 { margin-top: 14px; font-size: 68px; font-weight: 700; letter-spacing: -0.035em; line-height: 1; }
  .role { margin-top: 14px; font-size: 25px; font-weight: 500; letter-spacing: -0.01em; }
  .tag { margin-top: 10px; font-size: 20px; color: ${t.muted}; }
  .chips { margin-top: 26px; display: flex; gap: 10px; flex-wrap: wrap; }
  .chip { padding: 8px 14px; border-radius: 999px; background: ${t.chip}; border: 1px solid ${t.chipBorder}; font-size: 15px; font-weight: 500; backdrop-filter: blur(8px); }
  .chip.open::before { content: ''; display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #30d158; margin-right: 8px; vertical-align: 1px; box-shadow: 0 0 0 3px rgb(48 209 88 / 0.25); }
  .phone { position: absolute; background: ${t.frame}; padding: 7px; box-shadow: 0 30px 60px -18px rgb(15 23 42 / 0.55), 0 0 0 1px rgb(255 255 255 / 0.08) inset; }
  .phone img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: top; }
  .ios { right: 96px; top: 34px; width: 196px; height: 420px; border-radius: 40px; transform: rotate(4deg); z-index: 2; }
  .ios img { border-radius: 33px; }
  .ios::after { content: ''; position: absolute; top: 15px; left: 50%; width: 62px; height: 18px; margin-left: -31px; border-radius: 999px; background: #000; }
  .android { right: 262px; top: 62px; width: 190px; height: 410px; border-radius: 30px; transform: rotate(-6deg); z-index: 1; }
  .android img { border-radius: 23px; }
  .android::after { content: ''; position: absolute; top: 16px; left: 50%; width: 11px; height: 11px; margin-left: -5px; border-radius: 50%; background: #000; }
</style></head><body>
  <div class="copy">
    <div class="eyebrow">React Native · Android &amp; iOS</div>
    <h1>Praveen Singh</h1>
    <div class="role">Senior React Native Engineer</div>
    <div class="tag">I build apps that stay fast in production.</div>
    <div class="chips"><span class="chip">5+ years</span><span class="chip">Fintech · Edtech · Telecom</span><span class="chip open">Open to work</span></div>
  </div>
  <div class="phone android"><img src="${dataUrl('hero/delightree-android.webp')}"></div>
  <div class="phone ios"><img src="${dataUrl('hero/upgrad-iphone.webp')}"></div>
</body></html>`;

// App icons with the iOS corner radius; Reevo and Invia have no public listing,
// so they get drawn tiles like the portfolio's placeholders.
const appIcon = (inner) => `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@600;700&display=block" rel="stylesheet">
<style>* { margin: 0 } body { width: 128px; height: 128px; background: transparent; }
.i { width: 128px; height: 128px; border-radius: 29px; overflow: hidden; display: grid; place-items: center; font: 700 52px Geist; color: #fff; letter-spacing: -0.04em; }
.i img { width: 100%; height: 100%; object-fit: cover; background: #fff; }</style></head><body><div class="i" ${inner}</div></body></html>`;
const apps = {
  upgrad: `>${`<img src="${dataUrl('work/upgrad/icon.webp')}">`}`,
  'upgrad-living': `>${`<img src="${dataUrl('work/upgrad-living/icon.webp')}">`}`,
  delightree: `>${`<img src="${dataUrl('work/delightree/icon.webp')}">`}`,
  kookoo: `>${`<img src="${dataUrl('work/kookoo/icon.webp')}">`}`,
  reevo: `style="background: linear-gradient(135deg, #0f766e, #134e4a)">Re`,
  invia: `style="background: linear-gradient(135deg, #4f46e5, #312e81)">In`,
};

// The stack as one strip of brand logos with labels, from simple-icons.
const stack = [
  ['siReact', 'React Native'], ['siTypescript', 'TypeScript'], ['siSwift', 'Swift'], ['siKotlin', 'Kotlin'],
  ['siGraphql', 'GraphQL'], ['siApollographql', 'Apollo'], ['siRedux', 'Redux'], ['siReactquery', 'TanStack Query'],
  ['siFirebase', 'Firebase'], ['siFastlane', 'Fastlane'], ['siGithubactions', 'Actions'], ['siSentry', 'Sentry'],
  ['siJest', 'Jest'], ['siXcode', 'Xcode'], ['siAndroidstudio', 'Android Studio'], ['siStripe', 'Stripe'],
];
// WCAG relative luminance of a hex colour, 0 (black) to 1 (white).
function luminance(hex) {
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function strip(theme) {
  const cell = 104, cols = 8, rows = Math.ceil(stack.length / cols), w = cell * cols, h = rows * 96;
  const label = theme === 'dark' ? '#c7c7cc' : '#3a3a3c';
  const tile = theme === 'dark' ? '#1c1c22' : '#ffffff';
  const stroke = theme === 'dark' ? '#2c2c34' : '#e5e5ea';
  const parts = stack.map(([key, text], i) => {
    const icon = icons[key];
    const x = (i % cols) * cell + (cell - 56) / 2, y = Math.floor(i / cols) * 96;
    // Very dark brand colours (Apollo, Sentry) vanish on the dark tile; lift them.
    const fill = theme === 'dark' && luminance(icon.hex) < 0.08 ? '#e5e5ea' : `#${icon.hex}`;
    return `<g transform="translate(${x},${y})"><rect width="56" height="56" rx="14" fill="${tile}" stroke="${stroke}"/>` +
      `<path d="${icon.path}" fill="${fill}" transform="translate(14,14) scale(1.1667)"/></g>` +
      `<text x="${(i % cols) * cell + cell / 2}" y="${y + 76}" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif" font-size="12" font-weight="500" fill="${label}">${text}</text>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="Tech stack: ${stack.map((s) => s[1]).join(', ')}">${parts.join('')}</svg>\n`;
}

const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const page = await browser.newPage();

for (const [name, t] of Object.entries(themes)) {
  await page.setViewport({ width: 1280, height: 400, deviceScaleFactor: 2 });
  await page.setContent(banner(t), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(OUT, `banner-${name}.webp`), type: 'webp', quality: 88 });
  fs.writeFileSync(path.join(OUT, `stack-${name}.svg`), strip(name));
}
for (const [name, inner] of Object.entries(apps)) {
  await page.setViewport({ width: 128, height: 128, deviceScaleFactor: 1 });
  await page.setContent(appIcon(inner), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(OUT, 'apps', `${name}.png`), omitBackground: true });
}
for (const slug of ['coding-agents-drive-the-simulator', 'on-device-ai-react-native-2026', 'react-native-0-87-upgrade']) {
  const res = await fetch(`https://www.praveensingh.co.in/blog/${slug}/opengraph-image`);
  await page.setViewport({ width: 600, height: 315, deviceScaleFactor: 1 });
  await page.setContent(`<body style="margin:0"><img style="width:600px;height:315px;display:block" src="data:image/png;base64,${Buffer.from(await res.arrayBuffer()).toString('base64')}">`, { waitUntil: 'load' });
  await page.screenshot({ path: path.join(OUT, 'posts', `${slug}.webp`), type: 'webp', quality: 90 });
}
await browser.close();
for (const f of fs.readdirSync(OUT, { recursive: true })) {
  const p = path.join(OUT, f);
  if (fs.statSync(p).isFile()) console.log(f, Math.round(fs.statSync(p).size / 1024) + ' KB');
}
