const fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const B='/home/user/bodyshift/reformbar-brand';
const OUT=B+'/08_Visitenkarten';fs.mkdirSync(OUT,{recursive:true});
const svg=f=>fs.readFileSync(f,'utf8').replace(/<\?xml[^>]*>/,'').replace(/<title>.*?<\/title>/,'').replace(/ width="\d+" height="\d+"/,' ');
const logoW=svg(B+'/01_Hauptlogo/SVG_Vektor/reformbar_hauptlogo_weiss-champagner.svg');
const logoB=svg(B+'/01_Hauptlogo/SVG_Vektor/reformbar_hauptlogo_blau.svg');
const css=`@page{size:91mm 61mm;margin:0}*{box-sizing:border-box;margin:0;padding:0}
html,body{-webkit-print-color-adjust:exact;print-color-adjust:exact}
.p{width:91mm;height:61mm;position:relative;overflow:hidden;page-break-after:always;font-family:Inter,sans-serif}
.front{background:#1A2DB8;color:#F8E1C5}
.front .logo{position:absolute;left:50%;top:44%;transform:translate(-50%,-50%);width:66mm}
.front .logo svg{width:100%;height:auto;display:block}
.front .tag{position:absolute;left:0;right:0;bottom:12mm;text-align:center;font-family:Montserrat;font-weight:700;font-size:5.6pt;letter-spacing:.32em;color:#F8E1C5}
.back{background:#FBF5EC;color:#1A2DB8}
.back .logo{position:absolute;left:5.6mm;top:5.2mm;width:34mm}.back .logo svg{width:100%;height:auto;display:block}
.back .bar{position:absolute;right:0;top:0;bottom:0;width:10mm;background:#1A2DB8}
.back .claim{position:absolute;right:0;top:0;bottom:0;width:10mm;display:flex;align-items:center;justify-content:center}
.back .claim span{writing-mode:vertical-rl;transform:rotate(180deg);font-family:Montserrat;font-weight:800;font-size:6pt;letter-spacing:.18em;color:#F8E1C5;white-space:nowrap}
.who{position:absolute;left:8mm;top:22.5mm}
.who .n{font-family:Montserrat;font-weight:800;font-size:10.5pt;letter-spacing:-.01em;line-height:1.1}
.who .r{font-size:6.6pt;font-weight:500;color:#4a58c8;margin-top:.8mm;letter-spacing:.02em}
.who .ey{font-family:Montserrat;font-weight:700;font-size:5.4pt;letter-spacing:.28em;color:#4a58c8}
.who .studio{font-family:Montserrat;font-weight:800;font-size:9pt;line-height:1.15;margin-top:1.4mm}
.c{position:absolute;left:8mm;bottom:7.5mm;font-size:6.6pt;line-height:1.6;font-weight:500}
.c b{font-weight:700}.c .l{color:#4a58c8}
.rule{position:absolute;left:8mm;width:10mm;height:.5mm;background:#1A2DB8;top:20mm}
`;
const contact=`<div class="c"><div><b>0676 30 73 860</b></div><div>studio@reformbar.at</div><div><b>reformbar.at</b></div><div class="l">Ungarstraße 2–4 · 8330 Feldbach</div></div>`;
const front=`<div class="p front"><div class="logo">${logoW}</div><div class="tag">BOUTIQUE STUDIO · FELDBACH</div></div>`;
const back=who=>`<div class="p back"><div class="logo">${logoB}</div><div class="rule"></div>${who}${contact}<div class="bar"></div><div class="claim"><span>ALLES IST REFORMBAR</span></div></div>`;
const whoF=`<div class="who"><div class="n">Florian Lienhart</div><div class="r">Gründer &amp; Geschäftsführer</div></div>`;
const whoS=`<div class="who"><div class="ey">BOUTIQUE STUDIO</div><div class="studio">Reformer Pilates · Bodyforming<br>Yoga · 1:1 Coaching</div></div>`;
const head=`<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&family=Inter:wght@500;700&display=block" rel="stylesheet"><style>${css}</style></head><body>`;
const variants={Florian:whoF,Studio:whoS};
(async()=>{const br=await chromium.launch();const pg=await br.newPage();
for(const [k,w] of Object.entries(variants)){
 await pg.setContent(head+front+back(w)+'</body></html>',{waitUntil:'networkidle'});await pg.evaluate(()=>document.fonts.ready);
 await pg.pdf({path:`${OUT}/Reformbar_Visitenkarte_${k}_85x55_DRUCK_3mm-Beschnitt.pdf`,width:'91mm',height:'61mm',printBackground:true});
}
// previews (trimmed, 85x55)
const prev=await br.newPage({deviceScaleFactor:2});
const mk=async(html,file)=>{await prev.setContent(head+`<style>body{background:#fff}.wrap{width:85mm;height:55mm;overflow:hidden;position:relative}.wrap .p{position:absolute;left:-3mm;top:-3mm}</style><div class="wrap">${html}</div></body></html>`,{waitUntil:'networkidle'});await prev.evaluate(()=>document.fonts.ready);await prev.locator('.wrap').screenshot({path:file});};
await mk(front,`${OUT}/Vorschau_Vorderseite.png`);
await mk(back(whoF),`${OUT}/Vorschau_Rueckseite_Florian.png`);
await mk(back(whoS),`${OUT}/Vorschau_Rueckseite_Studio.png`);
await br.close();})();
