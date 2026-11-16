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
const M=6.5,s2=30/8368,cap2=1000*s2,base2=M+cap2;
const row=(k,v)=>`<div class="row"><b class="tr">${k}</b><span class="tr">${v}</span></div>`;
const back=`<div class="p" style="background:${CR}"><svg viewBox="0 0 91 61" style="position:absolute;inset:0;width:91mm;height:61mm"><g transform="translate(${M+3-523*s2} ${M+3-733.5*s2}) scale(${s2})">${logoB}</g></svg>
<div class="qr" style="right:${M+3}mm;top:${M+3}mm">${qr}<div class="tr">SCANNEN &amp; MEHR</div></div>
<div class="list" style="left:${M+3}mm;top:${base2+3}mm;height:${55-M-base2}mm">${row('TELEFON','0676 30 73 860')}${row('E-MAIL','studio@reformbar.at')}${row('WEB','reformbar.at')}${row('STUDIO','Ungarstraße 2–4, 8330 Feldbach')}</div></div>`;
const css=`@page{size:91mm 61mm;margin:0}*{box-sizing:border-box;margin:0;padding:0}html,body{-webkit-print-color-adjust:exact;print-color-adjust:exact}
.p{width:91mm;height:61mm;position:relative;overflow:hidden;page-break-after:always;font-family:Inter,sans-serif;color:${BLUE}}
.tr{text-box:trim-both cap alphabetic}
.tag{position:absolute;left:0;right:0;text-align:center;font-family:Montserrat;font-weight:700;font-size:5.3pt;letter-spacing:.26em;color:${CH}}
.list{position:absolute;display:flex;flex-direction:column;justify-content:space-between;padding-top:7.6mm}
.row{display:grid;grid-template-columns:14mm auto;align-items:baseline}
.row b{font-family:Montserrat;font-weight:700;font-size:4.6pt;letter-spacing:.22em;color:#4B59C4}
.row span{font-size:7pt;font-weight:600}
.qr{position:absolute;width:17mm;text-align:center}.qr div{font-family:Montserrat;font-weight:700;font-size:4pt;letter-spacing:.08em;margin-top:2mm;white-space:nowrap}`;
const head=`<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&family=Inter:wght@400;600&display=block" rel="stylesheet"><style>${css}</style></head><body>`;
(async()=>{const br=await chromium.launch();const pg=await br.newPage();
await pg.setContent(head+front+back+'</body></html>',{waitUntil:'networkidle'});await pg.evaluate(()=>document.fonts.ready);
await pg.pdf({path:`${OUT}/Reformbar_Visitenkarte_85x55_DRUCK_3mm-Beschnitt.pdf`,width:'91mm',height:'61mm',printBackground:true});
const v=await br.newPage({deviceScaleFactor:600/96});
for(const [h,name,crop] of [[front,'Vorderseite',1],[back,'Rueckseite',1],[front,'Canva_Vorderseite_mit_Beschnitt',0],[back,'Canva_Rueckseite_mit_Beschnitt',0]]){
 await v.setContent(head+`<div class="w" style="width:${crop?85:91}mm;height:${crop?55:61}mm;overflow:hidden;position:relative"><div style="position:absolute;left:${crop?-3:0}mm;top:${crop?-3:0}mm">${h}</div></div></body></html>`,{waitUntil:'networkidle'});await v.evaluate(()=>document.fonts.ready);
 await v.locator('.w').screenshot({path:`${OUT}/${crop?'Vorschau_'+name:name}.png`});}
await br.close();})();
