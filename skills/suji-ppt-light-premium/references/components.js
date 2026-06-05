// suji-ppt-light-premium — 컴포넌트 라이브러리 + 실행 예시 (dark-premium 동일 구조, 라이트 토큰)
// 사용: cd <skill dir> && npm i pptxgenjs && node references/components.js  (→ ~/Desktop/light-premium-sample.pptx)
const pptxgen = require("pptxgenjs");
const os = require("os"), path = require("path");
const pres = new pptxgen(); pres.layout = "LAYOUT_WIDE";
const PW = 13.33, PH = 7.5, F = "Pretendard";
const RC = pres.shapes.RECTANGLE, RR = pres.shapes.ROUNDED_RECTANGLE, LN = pres.shapes.LINE, OV = pres.shapes.OVAL;
const A = path.join(__dirname, "..", "assets");
const bgL = path.join(A, "bg_L.png"), bgR = path.join(A, "bg_R.png");
// ===== LIGHT TOKENS =====
const TXT="16181D",SUB="5A6470",DIM="9CA3AF",DIM2="C2C7CF",ACC="5B63D6",ACC2="9197E8",CARD="FBFCFD",CARDB="E6E9ED",TRK="EEF1F4",LINEC="E6E9ED";
const SH = () => ({type:"outer",color:"1A2A4A",opacity:0.06,blur:8,offset:2,angle:90});

function logo(s){ s.addText([{text:"HANCOM",options:{color:"3A3F4A"}},{text:".",options:{color:ACC}}],{x:10.9,y:0.5,w:1.9,h:0.3,fontFace:F,fontSize:14,bold:true,align:"right",margin:0}); }
function foot(s,no){ s.addText("ODL Enterprise 가격 결정 요청 · 제안 · 대외비",{x:0.7,y:7.04,w:9,h:0.24,fontFace:F,fontSize:9,color:DIM2,margin:0}); s.addText(no,{x:12.2,y:7.02,w:0.5,h:0.26,fontFace:F,fontSize:11,bold:true,color:"B5BBC4",align:"right",margin:0}); }
function chead(s,no,label,tag){ s.addText(no,{x:0.7,y:0.62,w:0.5,h:0.28,fontFace:F,fontSize:13,bold:true,color:DIM,valign:"middle",margin:0}); s.addText(label.toUpperCase(),{x:1.12,y:0.62,w:7.5,h:0.28,fontFace:F,fontSize:11,color:DIM,charSpacing:2.5,valign:"middle",margin:0}); if(tag) s.addText(tag,{x:9.0,y:0.62,w:3.6,h:0.28,fontFace:F,fontSize:11,bold:true,color:ACC,align:"right",valign:"middle",margin:0}); }
function h2(s,t){ s.addText(t,{x:0.7,y:0.92,w:11,h:0.6,fontFace:F,fontSize:36,bold:true,color:TXT,charSpacing:-0.5,margin:0}); }
function lead(s,t){ s.addText(t,{x:0.72,y:1.6,w:11.6,h:0.34,fontFace:F,fontSize:14,color:SUB,margin:0}); }
function card(s,x,y,w,h,title){ s.addShape(RR,{x,y,w,h,fill:{color:CARD},line:{color:CARDB,width:1},rectRadius:0.09,shadow:SH()}); if(title) s.addText(title.toUpperCase(),{x:x+0.34,y:y+0.26,w:w-0.6,h:0.3,fontFace:F,fontSize:11,color:DIM,charSpacing:1.4,margin:0}); }
function stat(s,v,cap,x,y,w){ s.addText(v,{x,y,w,h:0.85,fontFace:F,fontSize:48,bold:true,color:TXT,charSpacing:-1.5,margin:0}); s.addText(cap,{x:x+0.02,y:y+0.86,w,h:0.3,fontFace:F,fontSize:10.5,color:DIM,margin:0}); }
function bar(s,x,y,w,frac,label,val,hi){ s.addText(label,{x,y:y-0.02,w:3,h:0.26,fontFace:F,fontSize:12.5,color:SUB,margin:0}); s.addText(val,{x:x+w-3,y:y-0.02,w:3,h:0.26,fontFace:F,fontSize:13,bold:true,color:hi?ACC:TXT,align:"right",margin:0}); s.addShape(RR,{x,y:y+0.32,w,h:0.16,fill:{color:TRK},line:{type:"none"},rectRadius:0.08}); s.addShape(RR,{x,y:y+0.32,w:Math.max(0.2,w*frac),h:0.16,fill:{color:hi?ACC:ACC2},line:{type:"none"},rectRadius:0.08}); }
function note(s,t){ s.addText(t,{x:0.7,y:6.5,w:11.9,h:0.4,fontFace:F,fontSize:11,color:"8B92A0",valign:"middle",margin:0}); }
function divln(s,x,y,w){ s.addShape(LN,{x,y,w,h:0,line:{color:LINEC,width:1}}); }
function waterfall(s,x,y,w,h,items,maxV){ const n=items.length,gap=0.18,bw=(w-gap*(n-1))/n; items.forEach((it,i)=>{ const bx=x+i*(bw+gap),bh=(h-0.5)*(it[1]/maxV); s.addText((it[2]==='neg'?'−$':'$')+Math.abs(it[1])+"K",{x:bx,y:y+(h-0.5-bh)-0.28,w:bw,h:0.26,fontFace:F,fontSize:13,bold:true,color:it[2]==='hi'?ACC:(it[2]==='neg'?SUB:TXT),align:"center",margin:0}); s.addShape(RR,{x:bx,y:y+(h-0.5-bh),w:bw,h:bh,fill:{color:it[2]==='hi'?ACC:(it[2]==='neg'?"C2C7CF":"AEB4BE")},line:{type:"none"},rectRadius:0.04}); s.addText(it[0],{x:bx,y:y+h-0.42,w:bw,h:0.3,fontFace:F,fontSize:11,color:SUB,align:"center",margin:0}); }); }
function ladder(s,x,y,w,pts){ s.addShape(LN,{x,y,w,h:0,line:{color:"D7DBE2",width:1}}); pts.forEach(p=>{ const cx=x+w*p[1],me=p[3]; s.addShape(OV,{x:cx-(me?0.13:0.07),y:y-(me?0.13:0.07),w:me?0.26:0.14,h:me?0.26:0.14,fill:{color:me?ACC:"C2C7CF"},line:{type:"none"}}); const above=(pts.indexOf(p)%2===0)||me; s.addText(p[0],{x:cx-1,y:above?y-0.62:y+0.28,w:2,h:0.26,fontFace:F,fontSize:me?16:13,bold:true,color:me?ACC:TXT,align:"center",margin:0}); s.addText(p[2],{x:cx-1,y:above?y-0.34:y+0.54,w:2,h:0.24,fontFace:F,fontSize:me?10:9.5,color:me?SUB:DIM,align:"center",margin:0}); }); }
function table(s,rows,x,y,cols){ let yy=y; rows.forEach((r,ri)=>{ let xx=x; const isH=ri===0; r.forEach((c,ci)=>{ const o=typeof c==="object"?c:{t:c}; s.addText(o.t,{x:xx,y:yy,w:cols[ci],h:0.42,fontFace:F,fontSize:isH?11:13.5,bold:isH||o.b,color:isH?DIM:(o.c||TXT),charSpacing:isH?1:0,align:o.a||"left",valign:"middle",margin:0}); xx+=cols[ci]; }); s.addShape(LN,{x,y:yy+0.44,w:cols.reduce((a,b)=>a+b,0),h:0,line:{color:LINEC,width:isH?1.2:0.75}}); yy+=0.55; }); }

// ============ 예시 (dark와 동일 5장, 라이트) ============
let s=pres.addSlide(); s.background={path:bgL}; logo(s);
s.addText("PRICING DECISION · 2026",{x:0.74,y:3.05,w:8,h:0.3,fontFace:F,fontSize:13,bold:true,color:DIM,charSpacing:3,margin:0});
s.addText("ODL Enterprise\n가격·제품 제안",{x:0.66,y:3.5,w:11.5,h:1.7,fontFace:F,fontSize:46,bold:true,color:TXT,charSpacing:-0.5,lineSpacingMultiple:1.05,margin:0});
s.addShape(RC,{x:0.74,y:5.35,w:0.62,h:0.05,fill:{color:ACC},line:{type:"none"}});
s.addText("가격 결정 요청 보고",{x:0.72,y:5.5,w:10,h:0.4,fontFace:F,fontSize:18,color:SUB,margin:0});
s.addText("2026 · 06     전략기획 조수지",{x:0.72,y:6.5,w:10,h:0.34,fontFace:F,fontSize:13,color:DIM,margin:0});

s=pres.addSlide(); s.background={path:bgR}; logo(s); chead(s,"03","시장 · Market"); h2(s,"시장 규모"); lead(s,"$826M 시장 × OSS→유료 전환 = ODL 도달 매출 $4M ~ $25M"); foot(s,"03");
card(s,0.7,2.35,5.75,3.95,"Inputs · 입력");
s.addText("$826M",{x:1.0,y:2.78,w:5.2,h:0.85,fontFace:F,fontSize:48,bold:true,color:TXT,charSpacing:-1.5,margin:0}); s.addText("글로벌 PDF 접근성 시장 · 연 +13.2%  [Dataintelo]",{x:1.02,y:3.66,w:5.2,h:0.3,fontFace:F,fontSize:10.5,color:DIM,margin:0});
divln(s,1.0,4.3,5.15); s.addText("OSS → 유료 전환율",{x:1.0,y:4.45,w:5.2,h:0.28,fontFace:F,fontSize:11,color:SUB,margin:0});
s.addText([{text:"0.5 ",options:{color:DIM}},{text:"/ 1.5 ",options:{color:SUB}},{text:"/ 3.0%",options:{bold:true,color:ACC}}],{x:1.0,y:4.74,w:5.2,h:0.4,fontFace:F,fontSize:19,bold:true,margin:0});
divln(s,1.0,5.4,5.15); s.addText("의무 대상 entity",{x:1.0,y:5.55,w:5.2,h:0.28,fontFace:F,fontSize:11,color:SUB,margin:0});
s.addText([{text:"미국 ",options:{color:SUB}},{text:"13만+",options:{bold:true,color:TXT}},{text:"    EU ",options:{color:SUB}},{text:"10만+",options:{bold:true,color:TXT}}],{x:1.0,y:5.84,w:5.2,h:0.34,fontFace:F,fontSize:17,margin:0});
card(s,6.85,2.35,5.78,3.95,"SOM · 도달 매출 (시장 × 전환율)");
bar(s,7.2,3.05,5.1,0.17,"보수 0.5%","$4.13M",false); bar(s,7.2,3.95,5.1,0.50,"표준 1.5%","$12.39M",false); bar(s,7.2,4.85,5.1,1.0,"적극 3.0%","$24.78M",true);
s.addText("기준 — ODL Enterprise 점유분 · ARPU 가정 [확인필요]",{x:7.2,y:5.75,w:5.1,h:0.4,fontFace:F,fontSize:10,color:DIM,margin:0});

s=pres.addSlide(); s.background={path:bgL}; logo(s); chead(s,"13","가격 제안 · Pricing","● 결재 C"); h2(s,"구성 ① 마진"); lead(s,"접근성 SaaS 29%→11% 폭락 → 대응 F로 회복. 파싱은 재판매 구조로 흑자."); foot(s,"13");
card(s,0.7,2.35,6.4,3.95,"Margin Waterfall · SaaS Enterprise");
waterfall(s,1.0,2.9,5.8,3.0,[["고객가",140,"base"],["Semantix",75,"neg"],["우리 운영",50,"neg"],["마진",15,"hi"]],140);
s.addText([{text:"29% ",options:{color:TXT}},{text:"→ ",options:{color:DIM}},{text:"11%",options:{color:ACC}}],{x:1.0,y:5.95,w:5,h:0.4,fontFace:F,fontSize:26,bold:true,margin:0});
card(s,7.3,2.35,5.33,3.95,"Response · 대응");
s.addText("대응 F",{x:7.6,y:2.95,w:4.7,h:0.3,fontFace:F,fontSize:16,bold:true,color:TXT,margin:0}); s.addText("가격 인상 + BYOC + Premium → 25~30% 회복",{x:7.6,y:3.3,w:4.7,h:0.5,fontFace:F,fontSize:13,color:SUB,margin:0});
divln(s,7.6,4.1,4.7); s.addText("파싱 모델",{x:7.6,y:4.25,w:4.7,h:0.3,fontFace:F,fontSize:16,bold:true,color:TXT,margin:0}); s.addText("Semantix 재판매 + 웃돈 → 구조상 흑자. 단 정가가 시장가의 20~40배 = 가격 갭 과제",{x:7.6,y:4.6,w:4.7,h:0.8,fontFace:F,fontSize:13,color:SUB,margin:0});
note(s,"특이 — SaaS floor 위험 · 대응 F 각 요소 [추정] · 파싱 Semantix per-page 단가 [확인필요]");

s=pres.addSlide(); s.background={path:bgR}; logo(s); chead(s,"11","가격 제안 · Pricing"); h2(s,"경쟁사 가격 포지셔닝"); lead(s,"ODL은 $599 데스크톱 도구가 아닌 엔터프라이즈 tier. 차별 = PDF 특화 + OSS + AI."); foot(s,"11");
ladder(s,1.1,3.75,11.1,[["$599",0.04,"PDFix Pro",false],["$1.5K",0.18,"axesPDF·Apryse",false],["$25K",0.42,"Adobe API",false],["$60K",0.6,"Level Access",false],["$140~150K",0.8,"ODL Enterprise",true],["$250K",0.96,"Deque ent.",false]]);
note(s,"출처 1차(PDFix·axesPDF·Adobe)/2차(enterprise) · 특이 — 파싱 경쟁(별도축): Upstage·Google 15원/p · Textract 22~103원/p");

s=pres.addSlide(); s.background={path:bgL}; logo(s); chead(s,"21","Appendix","● 결재"); h2(s,"검토·결재 요청 6건"); lead(s,"본문에서 합리성 설득 → 여기서 결재. 의존관계·기한은 회의 시 제시."); foot(s,"21");
table(s,[[{t:"ID",a:"left"},"요청","권고 / 비고"],[{t:"A",b:true,c:ACC},{t:"SKU Base anchor 승인",b:true},{t:"Self $150K · SaaS $140K · OEM Min $95K+$200/dist",c:SUB}],[{t:"B",b:true,c:ACC},{t:"Semantix 배분",b:true},{t:"60:40 목표 + 본부 협상 위임 (Cost-Plus)",c:SUB}],[{t:"C",b:true,c:ACC},{t:"SaaS 마진 대응",b:true},{t:"옵션 F (가격 인상 + BYOC + Premium)",c:SUB}],[{t:"D",b:true,c:ACC},{t:"BYOC SKU 신설",b:true},{t:"Semantix 라이선스 합의 전제",c:SUB}],[{t:"E",b:true,c:ACC},{t:"인증·법무 예산",b:true},{t:"HIPAA·SOC2 $30~60K / 5계약 $15~30K",c:SUB}],[{t:"F",b:true,c:ACC},{t:"지역 가격 차등 여부",b:true},{t:"권고 — Phase 0 단일 USD",c:SUB}]],0.7,2.55,[1.0,4.0,7.0]);

pres.writeFile({fileName:path.join(os.homedir(),"Desktop","light-premium-sample.pptx")}).then(f=>console.log("SAVED:",f)).catch(e=>console.error(e));
