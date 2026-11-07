/* ===== v10.1 · Giao diện mực nho: khung nét cọ, giấy dó, ấn đỏ, nút mực, thanh cọ ===== */
(function(){
const INK='#1c1712',GOLD='#b8923a',PAPER='#f4ead2',RED='#9c2a22',JADE='#2f6f5e';
const uri=s=>'url("data:image/svg+xml;utf8,'+encodeURIComponent(s.replace(/\s+/g,' ').trim())+'")';
// ---- khung nét cọ chín mảnh (9-slice) ----
const frame=(stroke,gold,w)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
<defs><filter id="r" x="-8%" y="-8%" width="116%" height="116%"><feTurbulence type="fractalNoise" baseFrequency=".055" numOctaves="3" seed="7"/><feDisplacementMap in="SourceGraphic" scale="3.4"/></filter></defs>
<g filter="url(#r)"><rect x="5" y="5" width="110" height="110" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round"/></g>
<rect x="15" y="15" width="90" height="90" fill="none" stroke="${gold}" stroke-width="1.6" opacity=".95"/>
<g fill="none" stroke="${gold}" stroke-width="1.6" stroke-linecap="round">
<path d="M5 28 Q5 5 28 5"/><path d="M115 28 Q115 5 92 5"/><path d="M5 92 Q5 115 28 115"/><path d="M115 92 Q115 115 92 115"/></g>
<g fill="${gold}"><circle cx="15" cy="15" r="2.6"/><circle cx="105" cy="15" r="2.6"/><circle cx="15" cy="105" r="2.6"/><circle cx="105" cy="105" r="2.6"/></g></svg>`;
const frameInk=uri(frame(INK,GOLD,7));
const frameGold=uri(frame('#3a2c14','#e8c968',6.4));
// ---- nút mực: nền nét cọ có vết mực ----
const btn=(fill,edge)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 40" preserveAspectRatio="none">
<defs><filter id="b" x="-6%" y="-12%" width="112%" height="124%"><feTurbulence type="fractalNoise" baseFrequency=".09 .22" numOctaves="3" seed="4"/><feDisplacementMap in="SourceGraphic" scale="3"/></filter></defs>
<g filter="url(#b)"><path d="M4 7 Q40 3 76 6 Q78 20 76 34 Q40 38 4 35 Q2 21 4 7Z" fill="${fill}" stroke="${edge}" stroke-width="1.4"/></g></svg>`;
const btnInk=uri(btn(INK,GOLD)),btnRed=uri(btn(RED,'#d9a441')),btnPaper=uri(btn('#f7eed7','#6b5530')),btnJade=uri(btn(JADE,'#d9c27a'));
// ---- giấy dó: nhiễu + mây loang ----
const paper=uri(`<svg xmlns="http://www.w3.org/2000/svg" width="260" height="260"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="2"/><feColorMatrix values="0 0 0 0 .45  0 0 0 0 .34  0 0 0 0 .18  0 0 0 .13 0"/></filter><rect width="260" height="260" filter="url(#n)"/></svg>`);
const wash=uri(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><filter id="w"><feTurbulence type="fractalNoise" baseFrequency=".006 .012" numOctaves="3" seed="11"/><feColorMatrix values="0 0 0 0 .35  0 0 0 0 .27  0 0 0 0 .15  0 0 0 .5 -.12"/></filter><rect width="600" height="400" filter="url(#w)"/></svg>`);
// ---- vạch phân cách nét cọ ----
const rule=uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 8" preserveAspectRatio="none"><path d="M0 4 Q40 1 90 4 T200 4 T300 3.5" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round" opacity=".7"/><path d="M0 5 Q80 7 150 4.5 T300 5" fill="none" stroke="${GOLD}" stroke-width=".8" opacity=".9"/></svg>`);
// ---- ấn đỏ (con dấu) ----
const seal=uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><filter id="s"><feTurbulence type="fractalNoise" baseFrequency=".12" numOctaves="2" seed="5"/><feDisplacementMap in="SourceGraphic" scale="2.2"/></filter><g filter="url(#s)"><rect x="4" y="4" width="32" height="32" rx="3" fill="${RED}"/><rect x="8" y="8" width="24" height="24" fill="none" stroke="#f6d9c8" stroke-width="1.5"/><path d="M14 15h12M14 20h12M14 25h12M20 12v18" stroke="#f6d9c8" stroke-width="1.7" stroke-linecap="round"/></g></svg>`);
const css=`
:root{--ink:${INK};--gold:${GOLD};--paper:${PAPER};--seal:${RED};--jade:${JADE}}
/* ===== cửa sổ lớn (modal) ===== */
#overlay #modal:not(.crmodal):not(.vnmodal){background:${paper},${wash},linear-gradient(#f7eed8,#efe2c2)!important;background-blend-mode:multiply,multiply,normal;border:18px solid transparent!important;border-image:${frameInk} 40 / 18px stretch!important;border-radius:0!important;box-shadow:0 18px 60px rgba(0,0,0,.55)!important;padding:12px 16px!important;background-clip:padding-box,padding-box,padding-box!important}
#overlay #modal h2{font-family:"Noto Serif","Songti SC",serif;letter-spacing:.04em;color:${INK}!important;display:block;margin:0 0 10px!important;padding:0 0 12px;background:${rule} bottom/100% 8px no-repeat;text-shadow:0 1px 0 rgba(255,255,255,.6)}
#overlay #modal h2:before{content:"";display:inline-block;width:22px;height:22px;margin-right:8px;vertical-align:-4px;background:${seal} center/contain no-repeat}
#overlay #modal .close,#overlay #modal [onclick="closeModal()"].x{background:${btnRed} center/100% 100% no-repeat!important;border:0!important;color:#fbe9d0!important}
/* ===== nút ===== */
button:not(.cs-tag):not(.bg-t):not(.vn-o):not(.evc-ok):not(.crd):not(.tg){font-family:inherit}
#app button.mini,#overlay button.mini,#modal button.mini{background:${btnPaper} center/100% 100% no-repeat!important;border:0!important;border-radius:0!important;padding:5px 12px!important;color:${INK}!important;box-shadow:none!important;text-shadow:0 1px 0 rgba(255,255,255,.5)}
#app button.mini:hover,#overlay button.mini:hover{filter:brightness(1.06) drop-shadow(0 2px 3px rgba(0,0,0,.35))}
#app button.mini.primary,#overlay button.mini.primary,#modal .btns button.primary,#overlay button.primary{background:${btnRed} center/100% 100% no-repeat!important;color:#fbe9d0!important;border:0!important;border-radius:0!important;padding:7px 18px!important;text-shadow:0 1px 1px rgba(0,0,0,.5)}
#app button.mini.jade,#overlay button.mini.jade{background:${btnJade} center/100% 100% no-repeat!important;color:#f2ecd0!important;border:0!important}
#app button.mini.ghost,header button.ghost{background:${btnInk} center/100% 100% no-repeat!important;color:#e9d9a8!important;border:0!important;border-radius:0!important}
#overlay #modal .btns button:not(.primary):not(.mini){background:${btnPaper} center/100% 100% no-repeat!important;border:0!important;border-radius:0!important;padding:7px 18px!important;color:${INK}!important}
/* ===== lựa chọn lớn ===== */
#overlay #modal button.choice{background:${paper},linear-gradient(#fbf3de,#f0e4c5)!important;background-blend-mode:multiply,normal;border:10px solid transparent!important;border-image:${uri(frame('#2a2118','#c6a24a',5.4))} 40 / 10px stretch!important;border-radius:0!important;box-shadow:0 1px 0 rgba(255,255,255,.6) inset;padding:4px 8px!important;margin:6px 0!important}
#overlay #modal button.choice:hover:not([disabled]){background:${paper},linear-gradient(#fff8e4,#f6e9c8)!important;filter:drop-shadow(0 3px 5px rgba(0,0,0,.3))}
#overlay #modal button.choice[disabled]{opacity:.55;filter:grayscale(.5)}
#overlay #modal button.choice b{font-family:"Noto Serif",serif}
/* ===== bảng nhân vật (cột phải) ===== */
#sheet{background:${paper},${wash},linear-gradient(#f7eed8,#ead9b4)!important;background-blend-mode:multiply,multiply,normal;border-left:14px solid transparent!important;border-image:${uri(frame(INK,GOLD,7))} 40 / 0 0 0 14px stretch!important;box-shadow:-8px 0 30px rgba(0,0,0,.4)}
#sheet h2{font-family:"Noto Serif",serif!important}
#sheet .sec{border:0!important;background:${rule} top/100% 8px no-repeat!important;padding-top:12px!important;margin-top:6px}
#sheet .sec h4{font-family:"Noto Serif",serif;letter-spacing:.14em;color:${RED}!important;text-transform:none}
#sheet .stat,#sheet .msg>div,.owcard .stat{background:${paper},#fbf4e2!important;background-blend-mode:multiply,normal;border:8px solid transparent!important;border-image:${uri(frame('#3a2c14','#c9a850',5))} 40 / 8px stretch!important;border-radius:0!important}
#sheet .tag,.tag{background:#f9f0d9!important;border:1px solid ${INK}!important;border-radius:2px 8px 2px 8px!important;box-shadow:1px 1px 0 ${GOLD};font-family:"Noto Serif",serif}
/* ===== thanh trạng thái trên cùng ===== */
header{background:linear-gradient(#17120d,#241b13)!important;border:10px solid transparent!important;border-image:${frameGold} 40 / 10px stretch!important;border-radius:0!important;box-shadow:0 6px 24px rgba(0,0,0,.5)}
header .meta{padding:0 4px}
header .chip{border:1px solid ${GOLD}!important;border-radius:2px 10px 2px 10px!important}
.scap{background:${paper},#f7eed6!important;background-blend-mode:multiply,normal;border:8px solid transparent!important;border-image:${uri(frame(INK,GOLD,6))} 40 / 8px stretch!important;border-radius:0!important}
.owcard{background:${paper},${wash},linear-gradient(#f9f0d9,#efe0bd)!important;background-blend-mode:multiply,multiply,normal;border:16px solid transparent!important;border-image:${frameInk} 40 / 16px stretch!important;border-radius:0!important;box-shadow:0 14px 40px rgba(0,0,0,.5)}

/* ===== hộp con trong cửa sổ ===== */
#overlay #modal .crbox,#overlay #modal .sec,#overlay #modal .box,#overlay #modal .card{background:${paper},rgba(255,250,236,.55)!important;background-blend-mode:multiply,normal;border:9px solid transparent!important;border-image:${uri(frame('#3a2c14','#c9a850',5))} 40 / 9px stretch!important;border-radius:0!important;padding:4px 8px!important}
#overlay #modal .btns{margin-top:10px;display:flex;gap:10px;flex-wrap:wrap}
/* ===== HUD dưới trái / phải ===== */
#hud8 .pt{border:0!important;background:radial-gradient(circle at 50% 35%,#645a50,#1b1612)!important;box-shadow:0 0 0 3px #1c1712,0 0 0 5px #d6b262,0 0 0 8px #1c1712,0 6px 16px rgba(0,0,0,.6)!important;margin:6px}
#hud8 .info{background:linear-gradient(#17120d,#241b13)!important;border:10px solid transparent!important;border-image:${frameGold} 40 / 10px stretch!important;border-radius:0!important;padding:3px 8px 5px!important}
#hud8 .b8{border-radius:2px 9px 2px 9px!important;background:rgba(0,0,0,.55)!important;box-shadow:0 0 0 1px #5d4a26 inset}
#hud8 .b8 i{border-radius:2px 9px 2px 9px!important;background-image:linear-gradient(rgba(255,255,255,.22),transparent 45%,rgba(0,0,0,.2)),repeating-linear-gradient(100deg,rgba(255,255,255,.05) 0 2px,transparent 2px 6px)}
#dock8 button{border:0!important;border-radius:46% 54% 50% 50%/52% 46% 54% 48%!important;background:radial-gradient(circle at 50% 28%,#54483c,#15100c 72%)!important;box-shadow:0 0 0 2px #1c1712,0 0 0 4px #c9a850,0 0 0 6px #1c1712,0 6px 14px rgba(0,0,0,.6)!important;margin:6px 3px}
#dock8 button:hover{filter:brightness(1.18)}
#dock8 button.hot{box-shadow:0 0 0 2px #1c1712,0 0 0 4px #ff7a5c,0 0 18px #ff7a5c!important}
#toast8,footer,#tut7,body.h8 footer{background:linear-gradient(#17120d,#241b13)!important;border:10px solid transparent!important;border-image:${frameGold} 40 / 10px stretch!important;border-radius:0!important}
/* ===== thanh (HP, linh lực...) nét cọ ===== */
.bar,.hbar,.meter,.hmeter .track,[class*="barwrap"]{border-radius:0!important}
progress{accent-color:${RED}}
/* ===== thanh cuộn ===== */
*{scrollbar-width:thin;scrollbar-color:#6b5530 transparent}
::-webkit-scrollbar{width:9px;height:9px}::-webkit-scrollbar-thumb{background:linear-gradient(90deg,#4a3a20,#8a6f3a);border-radius:6px;border:1px solid #2a2118}::-webkit-scrollbar-track{background:rgba(60,45,25,.12)}
`;
const st=document.createElement('style');st.id='v10b-css';st.textContent=css;document.head.appendChild(st);
try{PATCH_NOTES.unshift(['v10.1 · 07/11/2026 · Giao diện mực nho',[
 'Khung cửa sổ, bảng nhân vật, thanh trên cùng, nút bấm, lựa chọn, thẻ chữ đều đổi sang khung nét cọ mực viền vàng, nền giấy dó có vân, nút nét cọ, ấn đỏ cạnh tiêu đề; thay cho các khung vuông bo góc.',
 'Thanh cuộn cũng đổi sang màu mực. Phần tranh và khung riêng của từng màn (tạo nhân vật, hội thoại, thẻ sự kiện, túi đồ) giữ nguyên bố cục.']])}catch(e){}
})();
