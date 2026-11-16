const fs=require('fs');const {chromium}=require('playwright');
const B='/home/user/bodyshift/reformbar-brand',D=B+'/07_Flyer_Eroeffnung_Weihnachten';
const SHIFT=+(process.env.SHIFT||16);
const logo=fs.readFileSync(B+'/01_Hauptlogo/SVG_Vektor/reformbar_hauptlogo_blau.svg','utf8').replace(/<\?xml[^>]*>/,'').replace(/<title>.*?<\/title>/,'').replace(/<svg [^>]*>/,'').replace('</svg>','');
const img='data:image/png;base64,'+fs.readFileSync(D+'/Bilder/Vorderseite_Bild_mit_Verlauf.png').toString('base64');
// logo units -> mm
const s=58/8368; // visible width 58mm
const X0=8, CAP1=9; // trim coords
const cap=1000*s, fs1=cap/0.7;
const reformTop=CAP1+cap+0.32*cap;
const logoX=X0-523*s, logoY=reformTop-733.5*s;
const y=v=>v+SHIFT;
const html=`<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Inter:wght@400;500&display=block" rel="stylesheet">
<style>@page{size:154mm 216mm;margin:0}*{margin:0;padding:0;box-sizing:border-box}
html,body{-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:154mm;height:216mm;position:relative;overflow:hidden;background:#FBF5EC;color:#1A2DB8;font-family:Inter,sans-serif}
.t{position:absolute;left:3mm;top:3mm;width:148mm;height:210mm}
.abs{position:absolute}
.img{position:absolute;left:0;width:154mm;top:${SHIFT}mm}
.ey{font-family:Montserrat;font-weight:700;font-size:6.4pt;letter-spacing:.3em}
.h1{font-family:Montserrat;font-weight:800;font-size:17.6mm;line-height:15.8mm;letter-spacing:-.04em}
.pill{background:#1A2DB8;color:#fff;border-radius:6mm;height:10.3mm;display:flex;align-items:center;padding:0 5mm;gap:3.4mm;font-family:Montserrat;font-weight:800;font-size:10.4pt;letter-spacing:.01em;white-space:nowrap}
.pill i{width:1mm;height:1mm;border-radius:50%;background:#8C95DD;display:inline-block}
.para{font-size:8.4pt;line-height:4.72mm;color:#4B59C4;width:118mm}
.chips{display:flex;flex-wrap:wrap;gap:1.7mm;width:110mm}
.chips span{height:6.2mm;border:.3mm solid #CCCEE8;background:#FDFBF6;border-radius:3.1mm;padding:0 3.1mm;display:flex;align-items:center;font-family:Montserrat;font-weight:600;font-size:7.1pt}
.rule{left:8mm;right:8mm;height:.25mm;background:#CCCEE8}
.f1{font-family:Montserrat;font-weight:800;font-size:9.6pt}.f2{font-size:7.9pt;color:#4B59C4;margin-top:1.2mm}
</style></head><body><div class="page"><img class="img" src="${img}">
<div class="t">
<svg class="abs" style="left:0;top:0;width:148mm;height:40mm;overflow:visible" viewBox="0 0 148 40">
<text x="${X0}" y="${CAP1+cap}" font-family="Montserrat" font-weight="800" font-size="${fs1}" letter-spacing="${-0.02*fs1}" fill="none" stroke="#1A2DB8" stroke-width="0.62" stroke-linejoin="round">ALLES IST</text>
 <text x="${X0}" y="${CAP1+cap}" font-family="Montserrat" font-weight="800" font-size="${fs1}" letter-spacing="${-0.02*fs1}" fill="#FBF5EC">ALLES IST</text>
 <g transform="translate(${logoX} ${logoY}) scale(${s})">${logo}</g>
</svg>
<div class="abs ey" style="left:8mm;top:${reformTop+cap+9}mm">REFORMER PILATES · BODYFORMING &amp; MORE</div>
<div class="abs h1" style="left:7.3mm;top:${y(73.4)}mm">NEU-<br>ERÖFFNUNG</div>
<div class="abs pill" style="left:8mm;top:${y(114)}mm">FREITAG<i></i>15. JÄNNER 2027<i></i>18 UHR</div>
<div class="abs para" style="left:8mm;top:${y(128.6)}mm">Komm vorbei und lerne unser neues Studio kennen. Kleine Gruppen, persönliche Betreuung, ein Ort zum Wohlfühlen.</div>
<div class="abs chips" style="left:8mm;top:${y(142.4)}mm"><span>Reformer Pilates</span><span>Bodyforming</span><span>Yoga</span><span>Matten-Pilates</span><span>Beckenbodentraining</span><span>1:1 Coaching</span></div>
<div class="abs rule" style="top:190mm"></div>
<div class="abs" style="left:8mm;top:194mm"><div class="f1">Ungarstraße 2–4</div><div class="f2">8330 Feldbach</div></div>
<div class="abs" style="right:8mm;top:194mm;text-align:right"><div class="f1">reformbar.at</div><div class="f2">0676 30 73 860 · studio@reformbar.at</div></div>
</div></div></body></html>`;
fs.writeFileSync(__dirname+'/front.html',html);
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:582,height:816},deviceScaleFactor:1789/148*25.4/96/ (1)});
await p.setContent(html,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
await p.pdf({path:__dirname+'/front.pdf',width:'154mm',height:'216mm',printBackground:true});
const q=await b.newPage({deviceScaleFactor:1789/(148/25.4*96)});await q.setContent(html.replace('<body>','<body style="margin:0"><div style="width:148mm;height:210mm;overflow:hidden;position:relative"><div style="position:absolute;left:-3mm;top:-3mm">')+'</div></div>',{waitUntil:'networkidle'});await q.evaluate(()=>document.fonts.ready);
await q.locator('body > div').first().screenshot({path:__dirname+'/front.png'});
await b.close();})();
