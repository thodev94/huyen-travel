import toursData from '../../src/data/tours.json';

const BASE = process.env.NEXT_PUBLIC_METADATA_BASE ?? 'http://localhost:3000';

export async function GET() {
  const urls = [
    `${BASE}/`,
    ...((toursData as any[]) || []).map(t => `${BASE}/tours/${t.id}`),
  ];

  const lastmod = new Date().toISOString();

  const urlset = urls
    .map((u) => `  <url><loc>${u}</loc><lastmod>${lastmod}</lastmod></url>`)
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlset}\n</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=0, s-maxage=86400'
    }
  });
}
