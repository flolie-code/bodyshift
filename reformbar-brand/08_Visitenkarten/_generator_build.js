const fs=require('fs');const {chromium}=require('playwright');
const B='/home/user/bodyshift/reformbar-brand',OUT=B+'/08_Visitenkarten';
const QD='/opt/node22/lib/node_modules/npm/node_modules/qrcode-terminal/vendor/QRCode';const QR=require(QD),EC=require(QD+'/QRErrorCorrectLevel');
const q=new QR(-1,EC.M);q.addData('https://reformbar.at');q.make();const n=q.getModuleCount();let r='';for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(q.isDark(y,x))r+=`<rect x="${x}" y="${y}" width="1.03" height="1.03"/>`;
const qr=`<svg viewBox="0 0 ${n} ${n}" style="width:100%;height:auto;display:block"><g fill="#1A2DB8">${r}</g></svg>`;
const inner=f=>fs.readFileSync(B+'/01_Hauptlogo/SVG_Vektor/'+f,'utf8').replace(/<\?xml[^>]*>/,'').replace(/<title>.*?<\/title>/,'').replace(/<svg [^>]*>/,'').replace('</svg>','');
const logoW=inner('reformbar_hauptlogo_weiss-champagner.svg'),logoB=inner('reformbar_hauptlogo_blau.svg');
const BLUE='#1A2DB8',CH='#F8E1C5',CR='#FBF5EC';
// Vorderseite: Claim-Logo zentriert (Trim-Koordinaten 85x55, +3mm Beschnitt)
const s=52/8368,cap=1000*s,fsz=cap/.7,x0=(85-52)/2,top=13.5;
const rt=top+cap+.32*cap,base=rt+cap,barB=rt+(2132-733.5)*s;
const T=`x="${x0+3}" y="${top+cap+3}" font-family="Montserrat" font-weight="800" font-size="${fsz}" letter-spacing="${-.02*fsz}"`;
const tagTop=barB+8.2;
const front=`<div class="p" style="background:${BLUE}"><svg viewBox="0 0 91 61" style="position:absolute;inset:0;width:91mm;height:61mm">
<text ${T} fill="none" stroke="#FFFFFF" stroke-width="0.5" stroke-linejoin="round">ALLES IST</text>
<text ${T} fill="${BLUE}">ALLES IST</text>
<g transform="translate(${x0+3-523*s} ${rt+3-733.5*s}) scale(${s})">${logoW}</g></svg>
<div class="tag tr" style="top:${tagTop+3}mm">REFORMER PILATES · BODYFORMING &amp; MORE</div></div>`;
// Rückseite
const M=6.5,s2=30/8368,cap2=1000*s2,base2=M+cap2,BW=26,BX=85-BW;
const barPath=(fs.readFileSync(B+'/01_Hauptlogo/SVG_Vektor/reformbar_hauptlogo_blau.svg','utf8').match(/<path[^>]*d="([^"]+)"/g)[1]).match(/d="([^"]+)"/)[1];
const ic={tel:'<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
mail:'<rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,6 12,13 2,6"/>',
web:'<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
pin:'<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>'};
const row=(k,v)=>`<div class="row"><i><svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${ic[k]}</svg></i><span class="tr">${v}</span></div>`;
const back=`<div class="p" style="background:${CR}">
<div style="position:absolute;left:${BX+3}mm;top:0;right:0;bottom:0;background:${BLUE};overflow:hidden">
 <svg viewBox="6300 400 2700 1900" style="position:absolute;width:44mm;right:-9mm;bottom:-10mm;opacity:.22"><path fill="${CH}" d="${barPath}"/></svg>
</div>
<svg viewBox="0 0 91 61" style="position:absolute;inset:0;width:91mm;height:61mm"><g transform="translate(${M+3-523*s2} ${M+3-733.5*s2}) scale(${s2})">${logoB}</g></svg>
<div class="qr" style="left:${BX+3+(BW-18)/2}mm;top:${3+15.5}mm"><div class="tile">${qr}</div><div class="cap tr">SCANNEN &amp; MEHR</div></div>
<div class="list" style="left:${M+3}mm;top:${base2+3}mm;height:${55-M-base2}mm">${row('tel','0676 30 73 860')}${row('mail','studio@reformbar.at')}${row('web','reformbar.at')}${row('pin','Ungarstraße 2–4, 8330 Feldbach')}</div></div>`;
const css=`@page{size:91mm 61mm;margin:0}*{box-sizing:border-box;margin:0;padding:0}html,body{-webkit-print-color-adjust:exact;print-color-adjust:exact}
.p{width:91mm;height:61mm;position:relative;overflow:hidden;page-break-after:always;font-family:Inter,sans-serif;color:${BLUE}}
.tr{text-box:trim-both cap alphabetic}
.tag{position:absolute;left:0;right:0;text-align:center;font-family:Montserrat;font-weight:700;font-size:5.3pt;letter-spacing:.26em;color:${CH}}
.list{position:absolute;display:flex;flex-direction:column;justify-content:space-between;padding-top:6mm}
.row{display:flex;align-items:center;gap:2.6mm}
.row i{width:3.8mm;height:3.8mm;border-radius:50%;background:${BLUE};display:flex;align-items:center;justify-content:center;flex:none}.row i svg{width:2.1mm;height:2.1mm}
.row span{font-size:6.8pt;font-weight:600}
.qr{position:absolute;width:18mm;text-align:center}.tile{background:#fff;border-radius:1.6mm;padding:1.6mm}.cap{font-family:Montserrat;font-weight:700;font-size:4.2pt;letter-spacing:.14em;color:${CH};margin-top:2.6mm;white-space:nowrap}`;
const head=`<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&family=Inter:wght@400;600&display=block" rel="stylesheet"><style>${css}</style></head><body>`;
(async()=>{const br=await chromium.launch();const pg=await br.newPage();
await pg.setContent(head+front+back+'</body></html>',{waitUntil:'networkidle'});await pg.evaluate(()=>document.fonts.ready);
await pg.pdf({path:`${OUT}/Reformbar_Visitenkarte_85x55_DRUCK_3mm-Beschnitt.pdf`,width:'91mm',height:'61mm',printBackground:true});
const v=await br.newPage({deviceScaleFactor:600/96});
for(const [h,name,crop] of [[front,'Vorderseite',1],[back,'Rueckseite',1],[front,'Canva_Vorderseite_mit_Beschnitt',0],[back,'Canva_Rueckseite_mit_Beschnitt',0]]){
 await v.setContent(head+`<div class="w" style="width:${crop?85:91}mm;height:${crop?55:61}mm;overflow:hidden;position:relative"><div style="position:absolute;left:${crop?-3:0}mm;top:${crop?-3:0}mm">${h}</div></div></body></html>`,{waitUntil:'networkidle'});await v.evaluate(()=>document.fonts.ready);
 await v.locator('.w').screenshot({path:`${OUT}/${crop?'Vorschau_'+name:name}.png`});}
await br.close();})();
