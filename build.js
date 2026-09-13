const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
fs.mkdirSync('dist', { recursive: true });

const navy='#061626', slate='#294759', gold='#dfad59', ice='#f5f8fb', white='#ffffff', muted='#b9c7d1';
const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

function heroSvg(){
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="390" viewBox="0 0 1600 390">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${navy}"/><stop offset="1" stop-color="#102c42"/></linearGradient>
    <radialGradient id="glow"><stop stop-color="#ffffff" stop-opacity=".42"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
    <linearGradient id="field" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#183c43"/><stop offset="1" stop-color="#0b242c"/></linearGradient>
    <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="12" flood-opacity=".35"/></filter>
  </defs>
  <rect width="1600" height="390" fill="url(#bg)"/>
  <g opacity=".72"><ellipse cx="185" cy="50" rx="180" ry="120" fill="url(#glow)"/><ellipse cx="1415" cy="50" rx="180" ry="120" fill="url(#glow)"/></g>
  <g opacity=".9"><rect x="0" y="270" width="1600" height="120" fill="url(#field)"/><path d="M0 342 H1600" stroke="#d8e7df" stroke-opacity=".23" stroke-width="3"/><path d="M140 270 L95 390 M380 270 L350 390 M620 270 L605 390 M980 270 L995 390 M1220 270 L1250 390 M1460 270 L1505 390" stroke="#d8e7df" stroke-opacity=".18" stroke-width="2"/></g>
  <g opacity=".35"><path d="M0 255 Q250 180 500 245 T1000 245 T1600 255 V300 H0Z" fill="#020a10"/></g>
  <g filter="url(#shadow)"><rect x="112" y="62" width="1376" height="222" rx="28" fill="#071421" fill-opacity=".86" stroke="${gold}" stroke-width="3"/></g>
  <text x="800" y="135" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="34" font-weight="700" letter-spacing="8" fill="${gold}">MONDAY NIGHT LIGHTS</text>
  <text x="800" y="208" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="66" font-weight="800" fill="${white}">LEAGUE RULES</text>
  <text x="800" y="250" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="24" font-weight="600" letter-spacing="2" fill="${muted}">DYNASTY FOOTBALL • CONTRACTS • CAP • COMPETITION</text>
  <circle cx="800" cy="318" r="30" fill="${gold}"/><path d="M785 300 q18 18 30 0 M785 336 q18-18 30 0 M800 289 v58" fill="none" stroke="${navy}" stroke-width="4" stroke-linecap="round"/>
</svg>`;
}

function glanceSvg(){
  const cards=[
    ['10 TEAMS','Head-to-head dynasty'],['$302 CAP','Tracks NFL salary cap'],['1–4 YEARS','Contract terms'],['90% MINIMUM','Spend after Fall FA'],
    ['$0 / $1','Non-guaranteed'],['$2+','Guaranteed'],['3 PRACTICE','Squad maximum'],['WEEK 11','Trade deadline']
  ];
  let cardMarkup='';
  const w=334,h=142,gap=26,startX=89,startY=118;
  cards.forEach((c,i)=>{ const col=i%4,row=Math.floor(i/4),x=startX+col*(w+gap),y=startY+row*(h+gap);
    cardMarkup += `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="#f7fafc" stroke="#d7e1e8" stroke-width="2"/><rect x="${x}" y="${y}" width="9" height="${h}" rx="4" fill="${gold}"/><text x="${x+34}" y="${y+54}" font-family="Arial,Helvetica,sans-serif" font-size="31" font-weight="800" fill="${navy}">${esc(c[0])}</text><text x="${x+34}" y="${y+94}" font-family="Arial,Helvetica,sans-serif" font-size="21" font-weight="500" fill="${slate}">${esc(c[1])}</text></g>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="520" viewBox="0 0 1600 520">
  <defs><linearGradient id="top" x1="0" x2="1"><stop stop-color="${navy}"/><stop offset="1" stop-color="#16364d"/></linearGradient><filter id="s"><feDropShadow dx="0" dy="6" stdDeviation="10" flood-opacity=".12"/></filter></defs>
  <rect width="1600" height="520" fill="${ice}"/><rect width="1600" height="88" fill="url(#top)"/><rect y="84" width="1600" height="4" fill="${gold}"/>
  <text x="80" y="57" font-family="Arial,Helvetica,sans-serif" font-size="34" font-weight="800" letter-spacing="3" fill="${white}">LEAGUE AT A GLANCE</text>
  <g filter="url(#s)">${cardMarkup}</g>
  <g transform="translate(90 462)"><text font-family="Arial,Helvetica,sans-serif" font-size="20" font-weight="700" fill="${navy}">STARTING LINEUP</text><text x="205" font-family="Arial,Helvetica,sans-serif" font-size="20" fill="${slate}">1 QB • 2 RB • 2 WR • 2 FLEX • 1 TE • 1 DEF</text></g>
  <g transform="translate(1085 462)"><text font-family="Arial,Helvetica,sans-serif" font-size="20" font-weight="700" fill="${navy}">2026 DEADLINE</text><text x="175" font-family="Arial,Helvetica,sans-serif" font-size="20" fill="${slate}">NOV 23</text></g>
  </svg>`;
}

async function main(){
  await sharp(Buffer.from(heroSvg())).png({compressionLevel:9,palette:true}).toFile('dist/mnl-header.png');
  await sharp(Buffer.from(glanceSvg())).png({compressionLevel:9,palette:true}).toFile('dist/mnl-glance.png');
  for (const name of ['schism-overview-final.jpg','schism-glance-final.jpg']) {
    if (fs.existsSync(name)) fs.copyFileSync(name, path.join('dist', name));
  }
  fs.writeFileSync('dist/index.html', `<!doctype html><meta charset="utf-8"><title>Fantasy Football Assets</title><body style="font-family:system-ui;background:#061626;color:white;padding:40px"><h1>Fantasy Football Assets</h1><p>Fantasy football image assets.</p></body>`);
}
main().catch(e=>{console.error(e);process.exit(1)});
