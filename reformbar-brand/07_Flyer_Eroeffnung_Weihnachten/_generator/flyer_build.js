const fs=require('fs');const {chromium}=require('playwright');
const B='/home/user/bodyshift/reformbar-brand',D=B+'/07_Flyer_Eroeffnung_Weihnachten',OUT=process.env.OUT||__dirname;
const logo=fs.readFileSync(B+'/01_Hauptlogo/SVG_Vektor/reformbar_hauptlogo_blau.svg','utf8').replace(/<\?xml[^>]*>/,'').replace(/<title>.*?<\/title>/,'').replace(/<svg [^>]*>/,'').replace('</svg>','');
const b64=f=>'data:image/png;base64,'+fs.readFileSync(f).toString('base64');
const imgF=b64(D+'/Bilder/Vorderseite_Reformer_mit_Verlauf.png'),imgB=b64(D+'/Bilder/Rueckseite_Geschenkbox_mit_Verlauf.png');
// QR
const QD='/opt/node22/lib/node_modules/npm/node_modules/qrcode-terminal/vendor/QRCode';const QR=require(QD),EC=require(QD+'/QRErrorCorrectLevel');
const q=new QR(-1,EC.M);q.addData('https://reformbar.at');q.make();const n=q.getModuleCount();let r='';for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(q.isDark(y,x))r+=`<rect x="${x}" y="${y}" width="1.03" height="1.03"/>`;
const qr=`<svg viewBox="-1.5 -1.5 ${n+3} ${n+3}" style="width:100%;height:auto;display:block"><g fill="#1A2DB8">${r}</g></svg>`;
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
.more .chips{gap:2mm;flex-wrap:nowrap}.more .chips span{height:7.4mm;border:.4mm solid #1A2DB8;background:#fff;border-radius:3.7mm;padding:0 3.6mm;font-weight:700;font-size:8.2pt;white-space:nowrap}
.pillars{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:3mm;margin-top:0}
.pc{background:#fff;border-radius:3.2mm;padding:4.6mm 4mm 4mm;display:flex;flex-direction:column;gap:2.4mm;position:relative}
.pc .pn{font-family:Montserrat;font-weight:800;font-size:8.8pt;letter-spacing:-.02em;white-space:nowrap}
.pc .pd{font-size:7pt;line-height:3.5mm;color:#4B59C4}
.pc.hot{background:#1A2DB8;color:#fff}.pc.hot .pd{color:#F8E1C5}.pc.warm{background:#fff;box-shadow:inset 0 0 0 .55mm #1A2DB8}.pc.warm .pd{color:#1A2DB8}
.more{display:flex;align-items:center;gap:4mm}.more b{font-family:Montserrat;font-weight:800;font-size:6.4pt;letter-spacing:.22em;white-space:nowrap}
.more .chips{width:auto}
.rule{left:8mm;right:8mm;height:.25mm;background:#CCCEE8;top:184mm}
.fest{font-size:8.4pt;line-height:4.5mm;color:#1A2DB8;max-width:132mm;display:flex;flex-direction:column;gap:2.6mm}.fest .lp{font-family:Montserrat;font-weight:800;font-size:13pt;letter-spacing:-.02em}
.inv{display:flex;flex-direction:column;gap:3.8mm}.inv .ey{font-size:8.2pt;letter-spacing:.24em}.inv .h1{margin-top:1.4mm}.fest b{font-family:Montserrat;font-weight:800;margin-right:.6mm}
.prow{display:flex;align-items:center;gap:5.5mm}.fb{display:flex;align-items:baseline;gap:6.5mm;font-family:Montserrat;font-weight:800;font-size:11pt;color:#1A2DB8;white-space:nowrap}.fbw{position:relative;padding:0 1mm}.ring{position:absolute;left:-4.2mm;right:-4.2mm;top:-4.4mm;bottom:-4mm;width:calc(100% + 8.4mm);height:calc(100% + 8.4mm);overflow:visible}
.qrf{position:absolute;right:8mm;top:7mm;width:19mm;display:flex;flex-direction:column;align-items:center}.qrf div{font-family:Montserrat;font-weight:700;font-size:4.2pt;letter-spacing:.1em;margin-top:1.6mm;white-space:nowrap}
.fgrid{display:grid;grid-template-columns:1fr 1fr 1fr}.f0{font-family:Montserrat;font-weight:700;font-size:5.4pt;letter-spacing:.24em;color:#4B59C4;margin-bottom:2.6mm}.f1{font-family:Montserrat;font-weight:800;font-size:11.4pt}.f2{font-size:9pt;color:#1A2DB8;margin-top:2.4mm}
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
.gift{background:#1A2DB8;color:#fff;border-radius:4mm;padding:8.5mm 7mm 7.5mm;position:relative;z-index:2;display:flex;flex-direction:column;gap:3.4mm}.gift .k{font-family:Montserrat;font-weight:700;font-size:6pt;letter-spacing:.26em;color:#F8E1C5}.gift .n{font-family:Montserrat;font-weight:800;font-size:17pt;letter-spacing:-.02em}.gift .gl{display:grid;grid-template-columns:1fr 1fr;gap:5mm;margin-top:1.6mm}.gi2{display:flex;flex-direction:column;gap:2.4mm;border-top:.3mm solid rgba(248,225,197,.5);padding-top:3mm}.gi2 b{font-family:Montserrat;font-weight:800;font-size:9.4pt}.gi2 span{font-size:8.3pt;line-height:4.3mm;color:#F8E1C5}.gift .star{left:6mm}.gch{display:flex;flex-wrap:wrap;gap:1.8mm;margin-top:1.6mm}.gch span{border:.3mm solid rgba(248,225,197,.7);color:#F8E1C5;border-radius:3mm;height:6mm;padding:0 2.8mm;display:flex;align-items:center;font-family:Montserrat;font-weight:600;font-size:7.2pt}.star.big{font-size:7.2pt;padding:2mm 3.4mm;top:-3.6mm;border-radius:2.6mm}
.card .p{font-family:Montserrat;font-weight:800;font-size:8pt}
.ord{display:grid;grid-template-columns:22mm 1fr;row-gap:3.4mm;align-items:baseline}
.ord b{font-family:Montserrat;font-weight:800;font-size:6pt;letter-spacing:.28em}.ord span{font-size:8.4pt;color:#4B59C4}
.qr{position:absolute;right:8mm;top:7.6mm;width:23mm;display:flex;flex-direction:column;align-items:center}.qr div{font-family:Montserrat;font-weight:700;font-size:4.6pt;letter-spacing:.1em;margin-top:1.6mm;white-space:nowrap}
`;
const footer=`<div class="abs rule"></div>
<div class="abs fgrid" style="left:8mm;right:8mm;top:191mm"><div><div class="f0 tr">STUDIO</div><div class="f1 tr">Ungarstraße 2–4</div><div class="f2 tr">8330 Feldbach</div></div><div><div class="f0 tr">KONTAKT</div><div class="f1 tr">0676 380 62 22</div><div class="f2 tr">studio@reformbar.at</div></div><div style="text-align:right"><div class="f0 tr">ONLINE</div><div class="f1 tr">reformbar.at</div></div></div>`;
// --- Vorderseite: Claim-Logo
const s1=58/8368,X0=8,CAP1=9,cap1=1000*s1,fs1=cap1/.7,rt1=CAP1+cap1+.32*cap1,base1=rt1+cap1;
const t1=`<text x="${X0}" y="${CAP1+cap1}" font-family="Montserrat" font-weight="800" font-size="${fs1}" letter-spacing="${-.02*fs1}"`;
const front=`<div class="page" id="front"><img class="abs" id="imgF" style="left:0;width:154mm" src="${imgF}"><div class="t">
<svg class="abs" style="left:0;top:0;width:148mm;height:40mm;overflow:visible" viewBox="0 0 148 40">
 __ALLESIST__

 <g transform="translate(${X0-523*s1} ${rt1-733.5*s1}) scale(${s1})">${logo}</g></svg>
<div class="stack" id="fs" style="bottom:9mm;gap:7.6mm">
 <div class="inv"><div class="ey tr">WIR LADEN DICH EIN</div><div class="h1 tr" id="fh" style="font-size:12.6mm;line-height:1.05;margin-left:-.5mm">NEUERÖFFNUNG</div><div class="h1 tr" style="font-size:7.2mm;letter-spacing:-.02em;margin-left:-.3mm;margin-top:1mm">IN FELDBACH</div></div>
 <div class="pill" style="align-self:stretch;justify-content:center;gap:7mm;font-size:11pt">FREITAG<i></i>15. JÄNNER 2027<i></i>18 UHR</div>
 <div class="fest"><div class="lp tr">Dein neuer Lieblingsplatz.</div><div class="tr">Komm vorbei, lern uns kennen – wir freuen uns auf dich!</div></div>
 <div class="pillars">
  <div class="pc hot"><div class="pn tr">Reformer Pilates</div><div class="pd tr">Ganzkörpertraining in kleinen Gruppen.</div></div>
  <div class="pc warm"><div class="pn tr">Bodyforming</div><div class="pd tr">Formen &amp; Abnehmen mit modernster Technologie und individuellem Plan.</div></div>
  <div class="pc"><div class="pn tr">Beckenbodentraining</div><div class="pd tr">Beckenboden stärken – entspannt im Sitzen.</div></div>
 </div>
 <div class="more"><b class="tr">AUSSERDEM</b><div class="chips"><span>Yoga</span><span>Matten-Pilates</span><span>Gruppenkurse</span><span>1:1 Coaching</span></div></div>
</div><div class="qrf">${qr}<div class="tr">WEBSITE &amp; ANGEBOTE</div></div></div></div>`;
// --- Rückseite: nur Logo + QR
const s2=50/8368,cap2=1000*s2,CAP2=8.9,base2=CAP2+cap2;
const back=`<div class="page" id="back"><img class="abs" id="imgB" style="width:78mm" src="${imgB}"><div class="t">
<svg class="abs" style="left:0;top:0;width:148mm;height:40mm;overflow:visible" viewBox="0 0 148 40"><g transform="translate(${8-523*s2} ${CAP2-733.5*s2}) scale(${s2})">${logo}</g></svg>
<div class="qr">${qr}<div class="tr">WEBSITE &amp; ANGEBOTE</div></div>
<div class="stack" id="bs" style="top:${base2+9}mm;bottom:${210-184+7}mm;justify-content:space-between">
 <div class="pair"><div class="ey tr">WEIHNACHTEN 2026</div><div class="h1 tr" style="font-size:15mm;line-height:1.0;margin-left:-.6mm">SCHENK<br>BEWEGUNG.</div></div>
 <div class="pair" style="gap:6mm"><div class="tr" style="font-family:Montserrat;font-weight:800;font-size:13pt;letter-spacing:-.01em">Geschenke &amp; Gutscheine</div><div class="pill" style="height:10.6mm;font-size:11.4pt">ERHÄLTLICH AB 15. DEZEMBER</div><div class="para tr" style="width:76mm;font-size:10pt;line-height:5.6mm">Einfach anrufen, schreiben oder vorbeikommen.</div></div>
 <div class="gift" id="cards"><div class="star big tr">★ ZUM SELBST ZUSAMMENSTELLEN</div>
  
  <div class="n tr">Dein Geschenk – ganz nach Wunsch</div>
  <div class="gl">
   <div class="gi2"><b class="tr">Geschenkboxen &amp; Kombipakete</b><span class="tr">Schön verpackt mit Trinkflasche, Pilates-Socken, Goodies &amp; vielem mehr.</span></div>
   <div class="gi2"><b class="tr">Gutscheine</b><span class="tr">Für all unsere Trainings – vom Probetraining bis zum Kombipaket.</span></div>
  </div>
 </div>
</div>${footer}</div></div>`;
const F=(n,fam,w,fmt)=>`@font-face{font-family:${fam};font-weight:${w};src:url(data:font/${fmt};base64,${fs.readFileSync(__dirname+'/fnt/'+n).toString('base64')}) format("${fmt==='otf'?'opentype':'truetype'}")}`;
const FONTS='<style>'+F('m600.ttf','Montserrat',600,'ttf')+F('m700.ttf','Montserrat',700,'ttf')+F('m800.ttf','Montserrat',800,'ttf')+F('i400.ttf','Inter',400,'ttf')+F('i500.ttf','Inter',500,'ttf')+F('i600.ttf','Inter',600,'ttf')+'</style>';
const head=`<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>${css}</style></head><body>`;
const fix=`<script>
const mm=v=>v*96/25.4;
function place(){
 const P=id=>document.getElementById(id);
 const fh=P('fh').parentNode.getBoundingClientRect(), fp=P('front').getBoundingClientRect();
 P('imgF').style.top=(fh.top-fp.top-mm(3+((0.81-0.10)/0.90)*154*1629/2400))+'px';
 const c=P('cards').getBoundingClientRect(), bp=P('back').getBoundingClientRect();
 const iw=mm(78), k=iw/1792; const ib=P('imgB');
 ib.style.left=(mm(3+90))+'px'; ib.style.top=(c.top-bp.top-1893*k+mm(1))+'px';
}
</script>`;
(async()=>{const br=await chromium.launch();
// "ALLES IST"-Kontur als hochaufgelöstes transparentes PNG (PDF-Viewer stellen SVG-Masken unzuverlässig dar)
const op=await br.newPage({deviceScaleFactor:10});
await op.setContent(head.replace('<body>','<body style="margin:0;background:transparent">')+`<svg id="o" viewBox="6 6 64 12" style="width:64mm;height:12mm;display:block"><defs><mask id="ai" maskUnits="userSpaceOnUse" x="0" y="0" width="80" height="30"><rect x="0" y="0" width="80" height="30" fill="#fff"/>${t1} fill="#000">ALLES IST</text></mask></defs>${t1} fill="none" stroke="#1A2DB8" stroke-width="0.4" stroke-linejoin="round" mask="url(#ai)">ALLES IST</text></svg></body></html>`,{waitUntil:'networkidle'});
await op.evaluate(()=>document.fonts.ready);
const outlinePng=(await op.locator('#o').screenshot({omitBackground:true})).toString('base64');
fs.writeFileSync(OUT+'/alles_ist_kontur.png',Buffer.from(outlinePng,'base64'));
const html=(head+front+back+fix+'</body></html>').replace('__ALLESIST__',`<image href="data:image/png;base64,${outlinePng}" x="6" y="6" width="64" height="12"/>`);fs.writeFileSync(OUT+'/flyer.html',html);
const p=await br.newPage();await p.setContent(html,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.evaluate(()=>place());
// report gaps
console.log((await p.evaluate(()=>[...document.querySelectorAll('#fs>*,#bs>*')].map(e=>{const r=e.getBoundingClientRect();return e.parentNode.id+' '+(r.top*25.4/96).toFixed(1)+'-'+(r.bottom*25.4/96).toFixed(1)}))).join('\n'));
await p.pdf({path:OUT+'/Reformbar_Flyer_A5_beidseitig_DRUCK_3mm-Beschnitt.pdf',width:'154mm',height:'216mm',printBackground:true});
const dsf=1789/(148/25.4*96);const v=await br.newPage({deviceScaleFactor:dsf,viewport:{width:600,height:900}});
await v.setContent(html,{waitUntil:'networkidle'});await v.evaluate(()=>document.fonts.ready);await v.evaluate(()=>place());
for(const [id,name] of [['front','Vorderseite'],['back','Rueckseite']]){const r=await v.evaluate(id=>{const b=document.getElementById(id).getBoundingClientRect();return {x:b.left+b.width*0+3*96/25.4,y:b.top+window.scrollY+3*96/25.4}},id);
 await v.screenshot({path:`${OUT}/Reformbar_Flyer_${name}_digital.png`,clip:{x:r.x,y:r.y,width:148*96/25.4,height:210*96/25.4},fullPage:true});}
// --- A1-Poster: eigene, verdichtete Einseiter-Version (Eröffnung + Angebote + Geschenke), gesetzt in A5-Einheiten, dann x4 skaliert
if(process.env.POSTER){
 const k=594/148;
 const big='data:image/png;base64,'+fs.readFileSync(D+'/Bilder/Vorderseite_Reformer_mit_Verlauf_4K.png').toString('base64');
 const gift='data:image/png;base64,'+fs.readFileSync(D+'/Bilder/Poster_Geschenkbox_auf_Blau.png').toString('base64');
 const pcss=`.gb{position:absolute;left:0;right:0;bottom:0;background:#1A2DB8;color:#fff;padding:7mm 11mm 10mm}
 .gb .row{position:relative;z-index:1;display:grid;grid-template-columns:1fr 34mm;gap:6mm;align-items:center}
 .gb .ey2{display:flex;align-items:center;gap:3mm}.gb .ey2 b{font-family:Montserrat;font-weight:700;font-size:7.5pt;letter-spacing:.3em;color:#F8E1C5}
 .gb .tag{display:inline-block;background:#F8E1C5;color:#1A2DB8;font-family:Montserrat;font-weight:800;font-size:8pt;letter-spacing:.08em;padding:2.2mm 3.6mm;border-radius:4mm;white-space:nowrap}
 .gb .ti{font-family:Montserrat;font-weight:800;font-size:24pt;letter-spacing:-.03em;margin-top:4.6mm;white-space:nowrap}
 .gb .tx{font-size:11pt;line-height:5.6mm;color:#F8E1C5;margin-top:3.6mm;max-width:92mm}
 .gb .tx b{color:#fff;font-weight:600}
 .gb .gi{position:absolute;right:0;top:0;height:34mm;width:auto;display:block;z-index:0}
 .gb .hr{position:relative;z-index:1;height:.25mm;background:rgba(255,255,255,.25);margin:5.5mm 0 4.6mm}
 .gb .ft{position:relative;z-index:1;display:flex;justify-content:space-between;font-size:12pt;font-weight:500}.gb .ft b{font-family:Montserrat;font-weight:800}
 .pmin{display:flex;align-items:center;gap:4mm;font-family:Montserrat;font-weight:800;font-size:13pt;letter-spacing:-.01em;color:#1A2DB8;white-space:nowrap} .pmin i{width:1.6mm;height:1.6mm;border-radius:50%;background:#8C95DD;display:inline-block} .qrp{position:absolute;right:8mm;top:7mm;width:21mm;display:flex;flex-direction:column;align-items:center}.qrp div{font-family:Montserrat;font-weight:700;font-size:5pt;letter-spacing:.1em;margin-top:1.8mm;white-space:nowrap}`;
 const ringP='<svg class="ring" viewBox="0 0 100 40" preserveAspectRatio="none"><path d="M8 22 C 6 8, 42 2, 70 5 C 96 8, 99 26, 80 33 C 60 40, 18 38, 8 27 C 4 22, 9 13, 24 9" fill="none" stroke="#1A2DB8" stroke-width="1.6" stroke-linecap="round"/></svg>';
 const poster=`<div class="page" id="front"><img class="abs" id="imgP" style="left:0;width:154mm" src="${big}"><div class="t">
<svg class="abs" style="left:0;top:0;width:148mm;height:40mm;overflow:visible" viewBox="0 0 148 40">
 <image href="data:image/png;base64,${outlinePng}" x="6" y="6" width="64" height="12"/>
 <g transform="translate(${X0-523*s1} ${rt1-733.5*s1}) scale(${s1})">${logo}</g></svg>
<div class="qrp">${qr}<div class="tr">WEBSITE &amp; ANGEBOTE</div></div>
<div class="stack" id="ps" style="gap:8.5mm">
 <div class="inv" style="gap:4.6mm"><div class="h1 tr" id="ph" style="font-size:15mm;line-height:1.05;margin-left:-.6mm">NEUERÖFFNUNG</div><div class="h1 tr" style="font-size:7.8mm;letter-spacing:-.02em;color:#1A2DB8;margin-left:-.3mm">IN FELDBACH</div></div>
 <div class="pill" style="height:11.8mm;font-size:12.4pt;padding:0 6mm">FREITAG<i></i>15. JÄNNER 2027<i></i>18 UHR</div>
 <div class="pmin"><span class="h">Reformer Pilates</span><i></i><span>Bodyforming</span><i></i><span>Beckenboden</span></div>
</div></div>
<div class="gb" id="gb"><div class="row"><div>
  <span class="tag tr">AB 15. DEZEMBER ERHÄLTLICH</span>
  <div class="ti tr">Schenk Bewegung.</div>
  <div class="tx tr">Geschenkboxen &amp; Gutscheine – individuell zusammengestellt, direkt bei uns im Studio.</div>
 </div><div></div></div><img class="gi" src="${gift}">
 <div class="hr"></div>
 <div class="ft"><span class="tr"><b>reformbar.at</b></span><span class="tr">studio@reformbar.at</span><span class="tr"><b>0676 380 62 22</b></span></div>
</div></div>`;
 const pfix=`<script>const mm=v=>v*96/25.4;function placeP(G){const P=id=>document.getElementById(id);
  const pg=P('front').getBoundingClientRect(),gb=P('gb').getBoundingClientRect(),st=P('ps');
  st.style.bottom=(pg.bottom-gb.top+mm(G)-mm(3))+'px';
  const ph=P('ph').getBoundingClientRect();
  P('imgP').style.top=(ph.top-pg.top-mm(3+((0.845-0.10)/0.90)*154*2781/4096))+'px';
  return {gbTop:(gb.top-pg.top)/96*25.4-3, capTop:(ph.top-pg.top)/96*25.4-3};}</script>`;
 const phtml=(head.replace('</style>',pcss+'</style>')+poster+pfix+'</body></html>');
 fs.writeFileSync(OUT+'/poster.html',phtml);
 const pv=await br.newPage({deviceScaleFactor:1789/(148/25.4*96)});await pv.setContent(phtml,{waitUntil:'networkidle'});await pv.evaluate(()=>document.fonts.ready);
 console.log('poster',JSON.stringify(await pv.evaluate(()=>placeP(8.5))));
 await pv.setViewportSize({width:600,height:900});await pv.screenshot({path:OUT+'/poster_preview.png',fullPage:true,clip:{x:3*96/25.4,y:3*96/25.4,width:148*96/25.4,height:210*96/25.4}});
 const pp=await br.newPage();
 await pp.setContent(phtml.replace('@page{size:154mm 216mm;margin:0}','@page{size:600mm 847mm;margin:0}'),{waitUntil:'networkidle'});
 await pp.evaluate(()=>document.fonts.ready);await pp.evaluate(()=>placeP(8.5));
 await pp.evaluate(k=>{const f=document.getElementById('front');
  const w=document.createElement('div');w.style.cssText='width:600mm;height:847mm;overflow:hidden;position:relative;background:#FBF5EC';
  f.parentNode.insertBefore(w,f);w.appendChild(f);f.style.position='absolute';f.style.left=(3-3*k)+'mm';f.style.top=(3-3*k)+'mm';
  f.style.transformOrigin='0 0';f.style.transform='scale('+k+')';f.style.pageBreakAfter='auto';},k);
 await pp.pdf({path:OUT+'/Reformbar_Poster_A1_DRUCK_3mm-Beschnitt.pdf',width:'600mm',height:'847mm',printBackground:true});
}
await br.close();})();
