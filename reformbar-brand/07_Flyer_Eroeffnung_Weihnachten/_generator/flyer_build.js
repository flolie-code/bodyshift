const fs=require('fs');const {chromium}=require('playwright');
const B='/home/user/bodyshift/reformbar-brand',D=B+'/07_Flyer_Eroeffnung_Weihnachten',OUT=process.env.OUT||__dirname;
const logo=fs.readFileSync(B+'/01_Hauptlogo/SVG_Vektor/reformbar_hauptlogo_blau.svg','utf8').replace(/<\?xml[^>]*>/,'').replace(/<title>.*?<\/title>/,'').replace(/<svg [^>]*>/,'').replace('</svg>','');
const b64=f=>'data:image/png;base64,'+fs.readFileSync(f).toString('base64');
const imgF=b64(D+'/Bilder/Vorderseite_Reformer_mit_Verlauf.png'),imgB=b64(D+'/Bilder/Rueckseite_Geschenkbox_mit_Verlauf.png');
// QR
const QD='/opt/node22/lib/node_modules/npm/node_modules/qrcode-terminal/vendor/QRCode';const QR=require(QD),EC=require(QD+'/QRErrorCorrectLevel');
const q=new QR(-1,EC.M);q.addData('https://reformbar.at');q.make();const n=q.getModuleCount();let r='';for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(q.isDark(y,x))r+=`<rect x="${x}" y="${y}" width="1.03" height="1.03"/>`;
const qr=`<svg viewBox="-1.5 -1.5 ${n+3} ${n+3}" style="width:100%;height:auto;display:block"><rect x="-1.5" y="-1.5" width="${n+3}" height="${n+3}" rx="1.2" fill="#fff"/><g fill="#1A2DB8">${r}</g></svg>`;
const G=5.5; // Absatzabstand mm (Vorderseite)
const css=`@page{size:154mm 216mm;margin:0}*{margin:0;padding:0;box-sizing:border-box}
html,body{-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:154mm;height:216mm;position:relative;overflow:hidden;background:#FBF5EC;color:#1A2DB8;font-family:Inter,sans-serif;page-break-after:always}
.t{position:absolute;left:3mm;top:3mm;width:148mm;height:210mm}
.abs{position:absolute}.tr{text-box:trim-both cap alphabetic}
.ey{font-family:Montserrat;font-weight:700;font-size:6.4pt;letter-spacing:.3em}
.h1{font-family:Montserrat;font-weight:800;letter-spacing:-.04em}
.pill{background:transparent;box-shadow:inset 0 0 0 .6mm #1A2DB8;color:#1A2DB8;border-radius:6mm;height:10.3mm;display:inline-flex;align-self:flex-start;align-items:center;padding:0 5mm;gap:3.4mm;font-family:Montserrat;font-weight:800;font-size:10.4pt;letter-spacing:.01em;white-space:nowrap}
.pill i{width:1mm;height:1mm;border-radius:50%;background:#8C95DD;display:inline-block}
.para{font-size:8.4pt;line-height:4.72mm;color:#4B59C4}
.chips{display:flex;flex-wrap:wrap;gap:1.7mm;width:110mm}
.chips span{height:6.2mm;border:.3mm solid #CCCEE8;background:#FDFBF6;border-radius:3.1mm;padding:0 3.1mm;display:flex;align-items:center;font-family:Montserrat;font-weight:600;font-size:7.1pt}
.pillars{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:3mm;margin-top:0}
.pc{background:#fff;border-radius:3.2mm;padding:4.6mm 4mm 4mm;display:flex;flex-direction:column;gap:2.4mm;position:relative}
.pc .pn{font-family:Montserrat;font-weight:800;font-size:8.8pt;letter-spacing:-.02em;white-space:nowrap}
.pc .pd{font-size:7pt;line-height:3.5mm;color:#4B59C4}
.pc.hot{background:#1A2DB8;color:#fff}.pc.hot .pd{color:#F8E1C5}.pc.warm{background:#fff;box-shadow:inset 0 0 0 .55mm #1A2DB8}.pc.warm .pd{color:#1A2DB8}
.more{display:flex;align-items:center;gap:3.4mm}.more b{font-family:Montserrat;font-weight:800;font-size:5.6pt;letter-spacing:.24em;white-space:nowrap}
.more .chips{width:auto}
.rule{left:8mm;right:8mm;height:.25mm;background:#CCCEE8;top:190mm}
.f1{font-family:Montserrat;font-weight:800;font-size:9.6pt}.f2{font-size:7.9pt;color:#4B59C4;margin-top:2.2mm}
.stack{position:absolute;left:8mm;right:8mm;display:flex;flex-direction:column}
.pair{display:flex;flex-direction:column;gap:4.5mm}
.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:3.2mm;position:relative;z-index:2}
.card{background:#fff;border-radius:3.5mm;padding:5mm 4.6mm;display:flex;flex-direction:column}
.card .k{font-family:Montserrat;font-weight:700;font-size:5.6pt;letter-spacing:.28em}
.card .n{font-family:Montserrat;font-weight:800;font-size:11pt;margin-top:3mm}
.card .d{font-size:7.3pt;line-height:3.6mm;color:#4B59C4;margin-top:3mm;flex:1}
.card .l{height:.25mm;background:#CCCEE8;margin:4mm 0}
.card.hot{background:#1A2DB8;color:#fff;position:relative}.card.hot .d{color:#F8E1C5}.card.hot .k{color:#F8E1C5}
.star{position:absolute;top:-2.6mm;left:4.6mm;background:#F8E1C5;color:#1A2DB8;font-family:Montserrat;font-weight:800;font-size:5.4pt;letter-spacing:.12em;padding:1.4mm 2.4mm;border-radius:2mm;white-space:nowrap}
.card .p{font-family:Montserrat;font-weight:800;font-size:8pt}
.ord{display:grid;grid-template-columns:22mm 1fr;row-gap:3.4mm;align-items:baseline}
.ord b{font-family:Montserrat;font-weight:800;font-size:6pt;letter-spacing:.28em}.ord span{font-size:8.4pt;color:#4B59C4}
.qr{position:absolute;right:8mm;top:7.6mm;width:23mm;text-align:center}.qr div{font-family:Montserrat;font-weight:700;font-size:5.2pt;letter-spacing:.2em;margin-top:1.4mm}
`;
const footer=`<div class="abs rule"></div>
<div class="abs" style="left:8mm;top:194.5mm"><div class="f1 tr">Ungarstraße 2–4</div><div class="f2 tr">8330 Feldbach</div></div>
<div class="abs" style="right:8mm;top:194.5mm;text-align:right"><div class="f1 tr">reformbar.at</div><div class="f2 tr">0676 30 73 860 · studio@reformbar.at</div></div>`;
// --- Vorderseite: Claim-Logo
const s1=58/8368,X0=8,CAP1=9,cap1=1000*s1,fs1=cap1/.7,rt1=CAP1+cap1+.32*cap1,base1=rt1+cap1;
const t1=`<text x="${X0}" y="${CAP1+cap1}" font-family="Montserrat" font-weight="800" font-size="${fs1}" letter-spacing="${-.02*fs1}"`;
const front=`<div class="page" id="front"><img class="abs" id="imgF" style="left:0;width:154mm" src="${imgF}"><div class="t">
<svg class="abs" style="left:0;top:0;width:148mm;height:40mm;overflow:visible" viewBox="0 0 148 40">
 <defs><mask id="ai" maskUnits="userSpaceOnUse" x="-10" y="-10" width="170" height="60"><rect x="-10" y="-10" width="170" height="60" fill="#fff"/>${t1} fill="#000">ALLES IST</text></mask></defs>
 ${t1} fill="none" stroke="#1A2DB8" stroke-width="0.4" stroke-linejoin="round" mask="url(#ai)">ALLES IST</text>
 <g transform="translate(${X0-523*s1} ${rt1-733.5*s1}) scale(${s1})">${logo}</g></svg>
<div class="abs ey tr" style="left:8mm;top:${base1+6}mm">REFORMER PILATES · BODYFORMING &amp; MEHR</div>
<div class="stack" id="fs" style="bottom:${210-190+G}mm;gap:${G}mm">
 <div class="h1 tr" id="fh" style="font-size:14.5mm;line-height:1.05;margin-left:-.5mm">NEU-<br>ERÖFFNUNG</div>
 <div class="pill">FREITAG<i></i>15. JÄNNER 2027<i></i>18 UHR</div>
 <div class="pillars">
  <div class="pc hot"><div class="pn tr">Reformer Pilates</div><div class="pd tr">Ganzkörpertraining in kleinen Gruppen.</div></div>
  <div class="pc warm"><div class="pn tr">Bodyforming</div><div class="pd tr">Gezielte Körperformung &amp; Abnehmen – mit modernster Technologie und persönlichem Plan.</div></div>
  <div class="pc"><div class="pn tr">Beckenbodentraining</div><div class="pd tr">Beckenboden stärken – entspannt im Sitzen.</div></div>
 </div>
 <div class="more"><b class="tr">AUSSERDEM</b><div class="chips"><span>Yoga</span><span>Matten-Pilates</span><span>Gruppenkurse</span><span>1:1 Coaching</span></div></div>
</div>${footer}</div></div>`;
// --- Rückseite: nur Logo + QR
const s2=50/8368,cap2=1000*s2,CAP2=8.9,base2=CAP2+cap2;
const back=`<div class="page" id="back"><img class="abs" id="imgB" style="width:90.6mm" src="${imgB}"><div class="t">
<svg class="abs" style="left:0;top:0;width:148mm;height:40mm;overflow:visible" viewBox="0 0 148 40"><g transform="translate(${8-523*s2} ${CAP2-733.5*s2}) scale(${s2})">${logo}</g></svg>
<div class="qr">${qr}<div class="tr">SCANNEN &amp; MEHR</div></div>
<div class="stack" id="bs" style="top:${base2}mm;height:${190-base2}mm;justify-content:space-evenly">
 <div class="pair"><div class="ey tr">WEIHNACHTEN 2026</div><div class="h1 tr" style="font-size:13mm;line-height:1.0;margin-left:-.5mm">SCHENK<br>BEWEGUNG.</div></div>
 <div class="pair"><div class="ey tr">GESCHENKIDEEN &amp; GESCHENKBOXEN</div><div class="para tr" style="width:68mm">Gutscheine, Kombipakete oder unsere fixfertige Geschenkbox – liebevoll verpackt und individuell auf Wunsch abgestimmt.</div></div>
 <div class="pill" style="position:relative;z-index:2">ERHÄLTLICH AB 15. DEZEMBER</div>
 <div class="cards" id="cards">
  <div class="card hot"><div class="star tr">★ BELIEBTESTES GESCHENK</div><div class="k tr">GESCHENKBOX</div><div class="n tr">Fixfertig</div><div class="d tr">Schön verpackt mit Trinkflasche, Pilates-Socken &amp; Goodies – bereit zum Verschenken.</div></div>
  <div class="card"><div class="k tr">GUTSCHEINE</div><div class="n tr">Probetraining</div><div class="d tr">Gutscheine für Probetrainings und Probeeinheiten – Reformer Pilates, Bodyforming, Yoga &amp; mehr.</div></div>
  <div class="card"><div class="k tr">KOMBIPAKETE</div><div class="n tr">Nach Wunsch</div><div class="d tr">Verschiedene Kombipakete – individuell zusammengestellt für jedes Budget.</div></div>
 </div>
 <div class="ord"><b class="tr">BESTELLEN</b><span class="tr">telefonisch unter 0676 30 73 860 oder per Mail an studio@reformbar.at</span><b class="tr">ABHOLEN</b><span class="tr">in unserem Studio in der Ungarstraße 2–4, 8330 Feldbach</span></div>
</div>${footer}</div></div>`;
const head=`<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Inter:wght@400;500&display=block" rel="stylesheet"><style>${css}</style></head><body>`;
const fix=`<script>
const mm=v=>v*96/25.4;
function place(){
 const P=id=>document.getElementById(id);
 const fh=P('fh').getBoundingClientRect(), fp=P('front').getBoundingClientRect();
 P('imgF').style.top=(fh.top-fp.top-mm(3+((0.88-0.10)/0.90)*154*1629/2400))+'px';
 const c=P('cards').getBoundingClientRect(), bp=P('back').getBoundingClientRect();
 const iw=mm(90.6), k=iw/1792; const ib=P('imgB');
 ib.style.left=(mm(3+73.6))+'px'; ib.style.top=(c.top-bp.top-1893*k+mm(1))+'px';
}
</script>`;
(async()=>{const br=await chromium.launch();
const html=head+front+back+fix+'</body></html>';fs.writeFileSync(OUT+'/flyer.html',html);
const p=await br.newPage();await p.setContent(html,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.evaluate(()=>place());
// report gaps
console.log((await p.evaluate(()=>[...document.querySelectorAll('#fs>*,#bs>*')].map(e=>{const r=e.getBoundingClientRect();return e.parentNode.id+' '+(r.top*25.4/96).toFixed(1)+'-'+(r.bottom*25.4/96).toFixed(1)}))).join('\n'));
await p.pdf({path:OUT+'/Reformbar_Flyer_A5_beidseitig_DRUCK_3mm-Beschnitt.pdf',width:'154mm',height:'216mm',printBackground:true});
const dsf=1789/(148/25.4*96);const v=await br.newPage({deviceScaleFactor:dsf,viewport:{width:600,height:900}});
await v.setContent(html,{waitUntil:'networkidle'});await v.evaluate(()=>document.fonts.ready);await v.evaluate(()=>place());
for(const [id,name] of [['front','Vorderseite'],['back','Rueckseite']]){const r=await v.evaluate(id=>{const b=document.getElementById(id).getBoundingClientRect();return {x:b.left+b.width*0+3*96/25.4,y:b.top+window.scrollY+3*96/25.4}},id);
 await v.screenshot({path:`${OUT}/Reformbar_Flyer_${name}_digital.png`,clip:{x:r.x,y:r.y,width:148*96/25.4,height:210*96/25.4},fullPage:true});}
await br.close();})();
