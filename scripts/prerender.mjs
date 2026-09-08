// ─────────────────────────────────────────────────────────────────────────────
// DERLEME SONRASI ÖN İŞLEME
//
// Tek sayfa uygulamalarda arama motoru ve sosyal medya botları ilk isteği
// aldığında yalnızca boş bir index.html görür. Bu betik her rota için ayrı bir
// index.html üreterek şunları çözer:
//
//   · Her sayfanın kendi <title>, description ve canonical etiketi olur
//   · WhatsApp/Facebook paylaşımlarında doğru başlık ve açıklama çıkar
//   · JavaScript çalıştırmayan botlar sayfanın gerçek içeriğini okuyabilir
//   · Botlar <noscript> içindeki bağlantılarla siteyi gezebilir
//
// Ayrıca sitemap.xml'i güncel tarihle yeniden üretir.
//
// npm run build içinde otomatik çalışır.
// ─────────────────────────────────────────────────────────────────────────────

import { build } from 'esbuild';
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const DIST = 'dist';
const TMP = 'node_modules/.seo-routes.mjs';

/** SEO rota listesi TypeScript — Node'un okuyabilmesi için önce derliyoruz. */
async function loadRoutes() {
  await build({
    entryPoints: ['src/seo/routes.ts'],
    outfile: TMP,
    bundle: true,
    format: 'esm',
    platform: 'node',
    logLevel: 'silent',
  });
  const mod = await import(pathToFileURL(TMP).href + `?t=${Date.now()}`);
  return mod.SEO_ROUTES;
}

/** legal-entity.ts içindeki eksik alanları okur. */
async function loadMissingLegalFields() {
  const out = 'node_modules/.legal-entity.mjs';
  await build({
    entryPoints: ['src/data/legal-entity.ts'],
    outfile: out,
    bundle: true,
    format: 'esm',
    platform: 'node',
    logLevel: 'silent',
  });
  const mod = await import(pathToFileURL(out).href + `?t=${Date.now()}`);
  await rm(out, { force: true });
  return mod.missingLegalFields();
}

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Etiketi varsa değiştirir, yoksa </head> öncesine ekler. */
function setTag(html, pattern, replacement) {
  return pattern.test(html)
    ? html.replace(pattern, replacement)
    : html.replace('</head>', `  ${replacement}\n  </head>`);
}

/** Bot ve JavaScript kapalı ziyaretçiler için okunabilir içerik. */
function noscriptBlock(r, origin) {
  const facts = r.facts?.length
    ? `<h2>Öne çıkanlar</h2><ul>${r.facts.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>`
    : '';
  const links = r.links?.length
    ? `<h2>Site haritası</h2><ul>${r.links
        .map((l) => `<li><a href="${esc(l.href)}">${esc(l.label)}</a></li>`)
        .join('')}</ul>`
    : '';
  return `<noscript><div id="seo-icerik">
      <h1>${esc(r.h1)}</h1>
      <p>${esc(r.summary)}</p>
      ${facts}
      ${links}
      <p>Hype Academia — 8–17 yaş online yazılım, robotik ve yapay zeka eğitimi.
      Ücretsiz deneme dersi için <a href="${origin}/iletisim">iletişim sayfamıza</a> göz atın.</p>
    </div></noscript>`;
}

async function main() {
  const base = await readFile(join(DIST, 'index.html'), 'utf8');
  const routes = await loadRoutes();

  const originMatch = base.match(/<link rel="canonical" href="([^"]+)"/);
  const origin = (originMatch?.[1] ?? 'https://hypeacademia.com/').replace(/\/$/, '');

  let written = 0;
  for (const r of routes) {
    const url = `${origin}${r.path === '/' ? '/' : r.path}`;
    let html = base;

    html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(r.title)}</title>`);
    html = setTag(
      html,
      /<meta\s+name="description"[\s\S]*?\/>/,
      `<meta name="description" content="${esc(r.description)}" />`,
    );
    html = setTag(
      html,
      /<link rel="canonical"[^>]*\/>/,
      `<link rel="canonical" href="${url}" />`,
    );
    html = setTag(
      html,
      /<meta property="og:url"[^>]*\/>/,
      `<meta property="og:url" content="${url}" />`,
    );
    html = setTag(
      html,
      /<meta property="og:title"[^>]*\/>/,
      `<meta property="og:title" content="${esc(r.title)}" />`,
    );
    html = setTag(
      html,
      /<meta\s+property="og:description"[\s\S]*?\/>/,
      `<meta property="og:description" content="${esc(r.description)}" />`,
    );
    html = setTag(
      html,
      /<meta name="twitter:title"[^>]*\/>/,
      `<meta name="twitter:title" content="${esc(r.title)}" />`,
    );
    html = setTag(
      html,
      /<meta\s+name="twitter:description"[\s\S]*?\/>/,
      `<meta name="twitter:description" content="${esc(r.description)}" />`,
    );

    // Sayfaya özel paylaşım görseli (kurs sayfalarında o dersin ekranı)
    if (r.image) {
      const img = `${origin}${r.image}`;
      html = setTag(html, /<meta property="og:image"[^>]*\/>/, `<meta property="og:image" content="${img}" />`);
      html = setTag(html, /<meta name="twitter:image"[^>]*\/>/, `<meta name="twitter:image" content="${img}" />`);
      html = html.replace(/<meta property="og:image:width"[^>]*\/>/, '<meta property="og:image:width" content="1200" />');
      html = html.replace(/<meta property="og:image:height"[^>]*\/>/, '<meta property="og:image:height" content="630" />');
      html = setTag(html, /<meta property="og:image:type"[^>]*\/>/, '<meta property="og:image:type" content="image/png" />');
    }

    // İşlevsel ara sayfalar arama sonuçlarına düşmesin
    if (r.noindex) {
      html = setTag(
        html,
        /<meta name="robots"[^>]*\/>/,
        '<meta name="robots" content="noindex, follow" />',
      );
    }

    // Var olan genel noscript bloğunu sayfaya özel olanla değiştir
    html = html.replace(/<noscript>[\s\S]*?<\/noscript>/, noscriptBlock(r, origin));

    const out = r.path === '/' ? join(DIST, 'index.html') : join(DIST, r.path, 'index.html');
    await mkdir(dirname(out), { recursive: true });
    await writeFile(out, html, 'utf8');
    written++;
  }

  // ─── sitemap.xml ───
  const today = new Date().toISOString().slice(0, 10);
  const urls = routes
    .filter((r) => !r.noindex)
    .map((r) => {
      const images = (r.images ?? [])
        .map(
          (im) =>
            `\n    <image:image>\n      <image:loc>${origin}${im.url}</image:loc>\n` +
            `      <image:caption>${esc(im.caption)}</image:caption>\n    </image:image>`,
        )
        .join('');
      return (
        `  <url>\n    <loc>${origin}${r.path}</loc>\n` +
        `    <lastmod>${today}</lastmod>\n` +
        `    <changefreq>monthly</changefreq>\n` +
        `    <priority>${r.priority}</priority>${images}\n  </url>`
      );
    })
    .join('\n');
  const sitemap =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n' +
    '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n' +
    urls +
    '\n</urlset>\n';
  await writeFile(join(DIST, 'sitemap.xml'), sitemap, 'utf8');
  await writeFile('public/sitemap.xml', sitemap, 'utf8');

  await rm(TMP, { force: true });
  console.log(`ön işleme: ${written} sayfa + sitemap.xml (${routes.length} adres)`);

  // Tüzel kişilik bilgisi eksikse yüksek sesle uyar.
  // Eksik alanlar ziyaretçiye gösterilmiyor (sözleşmeden çıkarılıyor) ama
  // iyzico başvurusu için doldurulmaları şart.
  const eksik = await loadMissingLegalFields();
  if (eksik.length > 0) {
    console.warn('');
    console.warn('  ⚠  UYARI — sözleşmelerde doldurulmamış alan var:');
    for (const e of eksik) console.warn(`     · ${e}`);
    console.warn('     Dosya: src/data/legal-entity.ts');
    console.warn('     Ziyaretçi bunları görmüyor — sözleşmeden çıkarılıyorlar.');
    console.warn('     Ama iyzico başvurusu için doldurulmaları ZORUNLU.');
    console.warn('');
  }
}

main().catch((e) => {
  console.error('ön işleme başarısız:', e);
  process.exit(1);
});
