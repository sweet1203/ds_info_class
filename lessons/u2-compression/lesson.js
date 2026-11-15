/* 공통 계산 */
const czRuns=s=>{const r=[];for(let i=0;i<s.length;){let j=i;while(j<s.length&&s[j]===s[i])j++;r.push([s[i],j-i]);i=j;}return r;};
const czRle=s=>czRuns(s).map(([c,n])=>c+n).join('');
const czRateTxt=(a,b)=>{const v=a/b, r=Math.round(v*100)/100; return (Math.abs(v-r)<1e-9?'= ':'≒ ')+r;};
const czClean=v=>v.toUpperCase().replace(/[^A-Z]/g,'');
const CZK=['#2f6fd0','#1f9d74','#e0702b','#9b4fc4','#d64535','#0f8fa6','#b8860b','#5b6776'];
function czSave(){store.set(MK,MEMO);}

/* 0 시작 · 알고 있나요 */
chips('readyChips','readyPick',['아스키 코드','유니코드','표본화','양자화','부호화','화소(픽셀)','해상도','프레임'],true);

/* 성취도 평가 */
chips('ck1','ck1',['디지털 데이터 압축의 필요성을 설명할 수 있다'],true);
chips('ck2','ck2',['데이터에 압축 기법을 적용하여 압축의 효율성을 분석하고 평가할 수 있다'],true);
chips('ck3','ck3',['기본적인 압축 원리를 이해하고 간단한 데이터에 적용할 수 있다'],true);
chips('ck4','ck4',['원본과 압축 데이터의 품질 및 용량을 분석하고, 압축 방법 간의 효율성을 평가할 수 있다'],true);

/* 01 무손실일까, 손실일까? */
sorter('lossGame',{
  cats:[{n:'🧾 무손실 압축',k:'#1f9d74'},{n:'🎞️ 손실 압축',k:'#e0702b'}],
  items:[
    {t:'반 학생들의 과제 점수가 적힌 표 파일을 선생님께 보내요.',c:0,ic:'📊',w:'숫자 하나만 바뀌어도 문제가 되니 원본 그대로 되돌릴 수 있어야 해요.'},
    {t:'수련회에서 찍은 사진 수백 장을 SNS에 올려요. 눈으로 보기에 차이만 없으면 돼요.',c:1,ic:'📸',w:'사진은 사람이 잘 알아차리지 못하는 부분을 줄여 용량을 크게 줄일 수 있어요(JPEG).'},
    {t:'음악 스트리밍 앱으로 이어폰을 끼고 노래를 들어요.',c:1,ic:'🎧',w:'잘 들리지 않는 부분을 줄여 용량을 줄인 소리 파일(MP3 등)을 써요.'},
    {t:'은행이 고객의 입출금 기록을 보관해요.',c:0,ic:'🏦',w:'금액이 조금이라도 달라지면 큰 문제가 돼요.'},
    {t:'휴대폰으로 온라인 수업 영상을 데이터 걱정 없이 보고 싶어요.',c:1,ic:'📱',w:'영상은 용량이 커서 연속된 프레임의 차이만 저장하는 방식(MPEG)으로 크게 줄여요.'},
  ],
  end:'<b>생각해 보기</b> 무엇을 기준으로 골랐나요? 「손실이 생기면 문제가 되는가」와 「용량을 얼마나 줄여야 하는가」를 함께 떠올려 봐요.'
});

/* 02 런 길이 부호화 압축기 */
(function(){
  const B=$('rleLab');
  B.innerHTML=`<div class="cz-in"><input type="text" id="rleIn" maxlength="40" value="AAADDBOOOO" autocomplete="off" spellcheck="false" aria-label="압축할 문자열"><span class="muted" style="font-size:.85rem">영문자만 · 30자까지 · 소문자는 대문자로 바꿔요</span></div>
    <div class="cz-runs" id="rleRuns"></div>
    <div class="cz-stat" id="rleStat"></div>
    <div class="cz-mis"><div data-m="hi"><b>미션 ①</b> 압축률이 <b>2 이상</b>인 문자열 만들기 <span></span></div><div data-m="lo"><b>미션 ②</b> 압축률이 <b>1보다 작은</b> 문자열 만들기 <span></span></div></div>`;
  const inp=$('rleIn'), R=$('rleRuns'), S=$('rleStat');
  const mis={hi:B.querySelector('[data-m=hi] span'), lo:B.querySelector('[data-m=lo] span')};
  function showMis(){
    mis.hi.innerHTML=MEMO.rleHi?`<span class="ok">✔ 기록됨</span> <span class="mono">${esc(MEMO.rleHi)}</span>`:'<span class="muted">아직</span>';
    mis.lo.innerHTML=MEMO.rleLo?`<span class="ok">✔ 기록됨</span> <span class="mono">${esc(MEMO.rleLo)}</span>`:'<span class="muted">아직</span>';
    B.querySelector('[data-m=hi]').classList.toggle('done',!!MEMO.rleHi); B.querySelector('[data-m=lo]').classList.toggle('done',!!MEMO.rleLo);
  }
  function run(){
    const raw=inp.value, s=czClean(raw).slice(0,30);
    const warn=(raw.replace(/[a-zA-Z]/g,'').length||czClean(raw).length>30)?'<small class="ng"> 영문자가 아닌 글자와 30자를 넘는 글자는 빼고 압축했어요.</small>':'';
    if(!s){R.innerHTML=''; S.innerHTML='영문자를 입력해 보세요.'+warn; return;}
    const rs=czRuns(s), enc=czRle(s);
    R.innerHTML=rs.map(([c,n],i)=>`<span class="run" style="--k:${CZK[i%CZK.length]}"><span class="ch">${c.repeat(n)}</span><b>${c}${n}</b></span>`).join('');
    const r=s.length/enc.length;
    S.innerHTML=`<span class="mono">${s}</span> (${s.length}bytes) → <span class="mono">${enc}</span> (${enc.length}bytes) · 압축률 ${s.length} / ${enc.length} <b>${czRateTxt(s.length,enc.length)}</b> ${r<1?'<span class="ng">압축했더니 더 길어졌어요!</span>':r>=2?'<span class="ok">잘 줄었어요!</span>':''}${warn}`;
    clearTimeout(tm);
    if(s.length>=4&&s!=='AAADDBOOOO'&&(r>=2||r<1)) tm=setTimeout(()=>{const rec=`${s} → ${enc} (압축률 ${czRateTxt(s.length,enc.length).replace(/^[=≒] /,'')})`;
      if(r>=2) MEMO.rleHi=rec; else MEMO.rleLo=rec; czSave(); showMis();},700);
    showMis();
  }
  let tm; inp.addEventListener('input',run); run();
})();

/* 02 복원하기 */
(function(){
  const P=[['W1O6W1','WOOOOOOW'],['B1A1N1A1N1A1','BANANA']];
  const B=$('rleRestore');
  B.innerHTML=P.map((p,i)=>`<div class="cz-rs" data-i="${i}"><span class="lab">압축 후 데이터</span><span class="mono code">${p[0]}</span><span class="lab">→ 압축 전 데이터</span><input type="text" maxlength="20" autocomplete="off" spellcheck="false" aria-label="압축 전 데이터"><button class="btn sm">확인</button><div class="fb"></div></div>`).join('');
  B.querySelectorAll('.cz-rs').forEach(d=>{const p=P[+d.dataset.i], inp=d.querySelector('input'), fb=d.querySelector('.fb');
    const chk=()=>{const v=czClean(inp.value);
      if(v===p[1]) fb.innerHTML=`<span class="ok">맞아요!</span> 압축 전 ${p[1].length}bytes, 압축 후 ${p[0].length}bytes → 압축률 ${czRateTxt(p[1].length,p[0].length)}. ${p[1].length<p[0].length?'<b>압축한 쪽이 오히려 더 길어요.</b> 반복이 없으면 횟수 「1」이 계속 붙기 때문이에요.':'반복이 많을수록 잘 줄어요.'}`;
      else fb.innerHTML=`<span class="ng">다시 해 봐요.</span> 문자 뒤의 숫자만큼 그 문자를 이어서 써요. 지금 적은 것은 ${v.length}글자예요.`;};
    d.querySelector('button').onclick=chk; inp.addEventListener('keydown',e=>{if(e.key==='Enter') chk();});});
})();

/* 03 사전 압축 · 허프만 부호화 */
function czDict(s){const order=[];for(const c of s) if(!order.includes(c)) order.push(c);
  const w=Math.max(3,order.length.toString(2).length), code={}; order.forEach((c,i)=>code[c]=(i+1).toString(2).padStart(w,'0'));
  return {order,code,w,bits:s.length*w};}
function czHuff(s){
  const order=[],cnt={}; for(const c of s){if(!(c in cnt)){cnt[c]=0;order.push(c);} cnt[c]++;}
  let k=0; const srt=a=>a.sort((x,y)=>y.v-x.v||x.o-y.o), lb=n=>n.c?`${n.c}:${n.v}`:`${n.v}`;
  const list=srt(order.map(c=>({c,v:cnt[c],o:k++})));
  const sorted=list.slice(), steps=[];
  while(list.length>1){const b=list.pop(), a=list.pop(), n={v:a.v+b.v,l:a,r:b,o:k++};
    steps.push(`<b>${lb(a)}</b> · <b>${lb(b)}</b> 묶기 → 합 <b>${n.v}</b> <span class="muted">(${lb(a)} 쪽 0, ${lb(b)} 쪽 1)</span> → 남은 것: ${[...list,n].sort((x,y)=>y.v-x.v||x.o-y.o).map(lb).join(', ')}`);
    list.push(n); srt(list);}
  const root=list[0], code={};
  (function walk(n,p){if(n.c){code[n.c]=p;return;} walk(n.l,p+'0'); walk(n.r,p+'1');})(root,'');
  return {root,code,cnt,sorted,steps,bits:[...s].reduce((t,c)=>t+code[c].length,0)};
}
function czTree(root){
  let leaf=0, maxD=0;
  (function pos(n,d){n.d=d; maxD=Math.max(maxD,d); if(n.c){n.x=leaf++; return;} pos(n.l,d+1); pos(n.r,d+1); n.x=(n.l.x+n.r.x)/2;})(root,0);
  const G=70, W=leaf*G+20, H=maxD*62+78, X=n=>n.x*G+45, Y=n=>n.d*62+28;
  let e='', v='';
  (function draw(n){ if(n.c){
      v+=`<rect x="${X(n)-28}" y="${Y(n)-15}" width="56" height="30" rx="15" class="lf"/><text x="${X(n)}" y="${Y(n)+5}" class="lt">${n.c}:${n.cnt}</text><text x="${X(n)}" y="${Y(n)+34}" class="cd">${n.code}</text>`; return;}
    [[n.l,'0'],[n.r,'1']].forEach(([m,b])=>{e+=`<line x1="${X(n)}" y1="${Y(n)}" x2="${X(m)}" y2="${Y(m)}"/><text x="${(X(n)+X(m))/2+(b==='0'?-9:9)}" y="${(Y(n)+Y(m))/2}" class="bt">${b}</text>`; draw(m);});
    v+=`<circle cx="${X(n)}" cy="${Y(n)}" r="16" class="in"/><text x="${X(n)}" y="${Y(n)+5}" class="it">${n.v}</text>`;})(root);
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="허프만 트리">${e}${v}</svg>`;
}
(function(){
  const B=$('cmpLab');
  B.innerHTML=`<div class="cz-in"><input type="text" id="cmpIn" maxlength="40" value="AAADDBOOOO" autocomplete="off" spellcheck="false" aria-label="비교할 문자열"><button class="btn ghost sm" data-p="AAADDBOOOO">교과서 예로</button><button class="btn ghost sm" data-p="rle">02 미션 ① 문자열로</button><span class="muted" style="font-size:.85rem">영문자 · 24자까지</span></div>
    <div class="cz-hint">💡 이런 문자열도 넣어 봐요 — 같은 문자가 길게 이어지는 것 / 여러 문자가 섞였지만 자주 나오는 문자가 있는 것 / 모든 글자가 한 번씩만 나오는 것</div>
    <div id="cmpOut"></div>
    <div class="row" style="margin-top:10px"><button class="btn sm" id="cmpRec">이 결과 기록하기</button><span class="muted" style="font-size:.85rem">기록은 마무리 화면의 메모 모아 보기에 남아요(최근 3개).</span></div>
    <div class="cz-recs" id="cmpRecs"></div>`;
  const inp=$('cmpIn'), O=$('cmpOut'); let last=null;
  B.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{const p=b.dataset.p==='rle'?(MEMO.rleHi||'').split(' ')[0]:b.dataset.p; if(!p){alert('02 화면의 미션 ①을 먼저 해 보세요.');return;} inp.value=p; run();});
  function run(){
    const raw=inp.value, s=czClean(raw).slice(0,24), over=(raw.replace(/[a-zA-Z]/g,'').length||czClean(raw).length>24)?'<p class="ng" style="margin:0 0 6px;font-size:.9rem">영문자가 아닌 글자와 24자를 넘는 글자는 빼고 비교했어요.</p>':'';
    if(s.length<2||new Set(s).size<2){O.innerHTML='<p class="muted">서로 다른 문자가 두 종류 이상 들어간 문자열을 입력해 보세요.</p>'; last=null; return;}
    const n=s.length, ob=n*8, enc=czRle(s), rb=enc.length*8, D=czDict(s), Hf=czHuff(s);
    last={s,r:czRateTxt(ob,rb).replace(/^[=≒] /,''),d:czRateTxt(ob,D.bits).replace(/^[=≒] /,''),h:czRateTxt(ob,Hf.bits).replace(/^[=≒] /,'')};
    const rows=[['런 길이 부호화','#2f6fd0',enc,`${enc.length}bytes = ${rb}bits`,rb],['사전 압축','#9b4fc4',[...s].map(c=>D.code[c]).join(' '),`${D.bits}bits`,D.bits],['허프만 부호화','#1f9d74',[...s].map(c=>Hf.code[c]).join(' '),`${Hf.bits}bits`,Hf.bits]];
    const best=Math.min(rb,D.bits,Hf.bits), mx=Math.max(...rows.map(r=>ob/r[4]));
    (function mark(n){if(n.c){n.cnt=Hf.cnt[n.c]; n.code=Hf.code[n.c]; return;} mark(n.l); mark(n.r);})(Hf.root);
    O.innerHTML=`${over}<div style="overflow-x:auto"><table class="cz-tbl cz-cmp">
      <tr><th>방법</th><th>압축 결과</th><th>크기</th><th>압축률</th><th style="min-width:150px"></th></tr>
      <tr><th>원본</th><td class="mono l">${s}</td><td>${n}bytes = ${ob}bits</td><td>–</td><td></td></tr>
      ${rows.map(r=>`<tr class="${r[4]===best?'best':''}"><th style="color:${r[1]}">${r[0]}</th><td class="mono l sm">${r[2]}</td><td>${r[3]}</td><td><b>${ob} / ${r[4]}</b><br>${czRateTxt(ob,r[4])}</td><td><div class="bar"><i style="width:${Math.max(4,ob/r[4]/mx*100)}%;background:${r[1]}"></i></div></td></tr>`).join('')}
    </table></div>
    <div class="grid2 even" style="margin-top:12px">
      <div class="cz-sub"><h4>📖 사전 <small class="muted">(등장하는 순서대로 코드를 붙여요 · 사전 자체의 크기는 교과서처럼 빼고 계산)</small></h4>
        <table class="cz-tbl"><tr><th>데이터</th>${D.order.map(c=>`<td class="mono">${c}</td>`).join('')}</tr><tr><th>코드</th>${D.order.map(c=>`<td class="mono">${D.code[c]}</td>`).join('')}</tr></table>
        <p class="note">문자 ${n}개 × ${D.w}비트 = ${D.bits}bits</p></div>
      <div class="cz-sub"><h4>🌳 허프만 · 빈도와 코드</h4>
        <table class="cz-tbl"><tr><th>빈도</th>${Hf.sorted.map(x=>`<td>${x.v}</td>`).join('')}</tr><tr><th>데이터</th>${Hf.sorted.map(x=>`<td class="mono">${x.c}</td>`).join('')}</tr><tr><th>허프만 코드</th>${Hf.sorted.map(x=>`<td class="mono">${Hf.code[x.c]}</td>`).join('')}</tr></table>
        <p class="note">${Hf.sorted.map(x=>`${x.c} ${x.v}번 × ${Hf.code[x.c].length}비트`).join(' + ')} = ${Hf.bits}bits</p></div>
    </div>
    <details class="cz-more" open><summary>🌳 허프만 트리를 만드는 과정 보기</summary>
      <ol class="cz-steps"><li>빈도수를 구해 내림차순으로 정렬해요 → ${Hf.sorted.map(x=>`${x.c}:${x.v}`).join(', ')}</li>${Hf.steps.map(t=>`<li>${t}</li>`).join('')}<li>위에서 아래로 내려가며 왼쪽은 0, 오른쪽은 1을 이어 붙이면 코드가 돼요.</li></ol>
      <div class="cz-tree">${czTree(Hf.root)}</div>
    </details>`;
  }
  function showRecs(){$('cmpRecs').innerHTML=MEMO.cmpResult?`<b>내 기록</b><ul>${MEMO.cmpResult.split(' / ').map(x=>`<li class="mono">${esc(x)}</li>`).join('')}</ul>`:'';}
  $('cmpRec').onclick=()=>{if(!last){alert('먼저 문자열을 입력해 보세요.');return;} if(last.s==='AAADDBOOOO'){alert('교과서 예는 확인용이에요. 내 문자열로 바꾼 뒤 기록해 보세요.');return;}
    const item=`${last.s}: 런 길이 ${last.r} · 사전 ${last.d} · 허프만 ${last.h}`;
    const arr=(MEMO.cmpResult||'').split(' / ').filter(x=>x&&x!==item); arr.push(item); MEMO.cmpResult=arr.slice(-3).join(' / '); czSave(); showRecs();};
  inp.addEventListener('input',run); run(); showRecs();
})();

/* 04 영상 압축의 원리 · 달라진 격자 찾기 */
(function(){
  const F1=['🐦','','','','☀️', '','🐝','','','', '','','','','', '🌷','','','🌱','', '🌿','🌿','🌿','🌿','🌿'];
  const F2=F1.slice(); F2[6]=''; F2[7]='🐝';
  const F3=F2.slice(); F3[7]=''; F3[13]='🐝'; F3[18]='🌼'; F3[0]=''; F3[1]='🐦';
  const FR=[F1,F2,F3], ANS=[null,[6,7],[0,1,6,13,18]], ok=[true,false,false], mk=[null,new Set(),new Set()];
  const B=$('frameLab');
  B.innerHTML=`<div class="cz-frames">${FR.map((f,i)=>`<div class="fr" data-i="${i}"><b>${['첫 번째','두 번째','세 번째'][i]} 프레임</b><small>${i?'첫 번째 프레임과 달라진 격자를 눌러요':'기준 · 25칸 모두 저장'}</small><div class="grid ${i?'can':''}">${f.map((c,j)=>`<button data-j="${j}" ${i?'':'disabled'} aria-label="${i+1}번 프레임 ${j+1}번 칸">${c}</button>`).join('')}</div>${i?'<div class="row"><button class="btn sm" data-c>확인</button><span class="cnt"></span></div><div class="fb"></div>':'<div class="fb muted">달라진 부분이 없으니 기준이 돼요.</div>'}</div>`).join('')}</div>
    <div class="cz-calc" id="frameCalc">
      <p style="margin:0 0 6px"><b>저장 공간 계산하기</b> <span class="muted" style="font-size:.88rem">(격자 1개 = 10bytes)</span></p>
      <div class="cz-eq">모든 격자를 저장할 때 · 10bytes × 25개 × 3장 = <input type="number" data-k="all" min="0"> bytes</div>
      <div class="cz-eq">달라진 격자만 저장할 때 · 10bytes × (25개 + <input type="number" data-k="a" min="0">개 + <input type="number" data-k="b" min="0">개) = <input type="number" data-k="sum" min="0"> bytes</div>
      <div class="row"><button class="btn sm" id="frameChk">계산 확인</button></div><div class="fb" id="frameFb"></div>
    </div>`;
  B.querySelectorAll('.fr').forEach(fr=>{const i=+fr.dataset.i; if(!i) return;
    fr.querySelectorAll('.grid button').forEach(b=>b.onclick=()=>{const j=+b.dataset.j; if(ok[i]) return; mk[i].has(j)?mk[i].delete(j):mk[i].add(j); b.classList.toggle('mk'); fr.querySelector('.cnt').textContent=`고른 칸 ${mk[i].size}개`;});
    fr.querySelector('[data-c]').onclick=()=>{const A=new Set(ANS[i]), miss=[...A].filter(x=>!mk[i].has(x)).length, wrong=[...mk[i]].filter(x=>!A.has(x)).length, fb=fr.querySelector('.fb');
      if(!miss&&!wrong){ok[i]=true; fr.classList.add('done'); fb.innerHTML=`<span class="ok">맞아요!</span> 달라진 격자는 <b>${A.size}개</b>예요. 이 프레임은 ${A.size}칸만 저장하면 돼요.`;}
      else fb.innerHTML=`<span class="ng">다시 살펴봐요.</span> ${miss?`빠진 칸이 ${miss}개 있어요. `:''}${wrong?`달라지지 않은 칸을 ${wrong}개 골랐어요. `:''}<small>첫 번째 프레임과 견주어 무언가 사라진 칸과 새로 나타난 칸을 모두 세요.</small>`;};});
  $('frameChk').onclick=()=>{const g=k=>+(B.querySelector(`[data-k=${k}]`).value||-1), fb=$('frameFb'), h=[];
    if(g('all')!==750) h.push('모든 격자: 10 × 25 × 3을 다시 계산해 봐요.');
    if(g('a')!==2||g('b')!==5) h.push('괄호 안의 두 칸에는 두 번째·세 번째 프레임이 첫 번째 프레임과 달라진 격자 수를 적어요. 위에서 확인해 봐요.');
    if(g('sum')!==320) h.push('달라진 격자만 저장할 때의 합을 다시 계산해 봐요.');
    if(h.length){fb.innerHTML=`<span class="ng">아직이에요.</span><ul>${h.map(x=>`<li>${x}</li>`).join('')}</ul>`; return;}
    MEMO.frameRes='모든 격자 저장 750bytes · 달라진 격자만 저장 10 × (25 + 2 + 5) = 320bytes (430bytes 절약)'; czSave();
    fb.innerHTML=`<span class="ok">맞아요!</span> <div class="cz-bars"><div><span>모든 격자</span><i style="width:100%"></i><b>750bytes</b></div><div><span>달라진 격자만</span><i style="width:${320/750*100}%"></i><b>320bytes</b></div></div> 달라진 부분만 저장했더니 저장 공간이 절반보다 적게 들었어요. 프레임이 수천 장인 영상이라면 어떨까요?`;};
})();

/* 05 이미지 압축 비교 */
(function(){
  const B=$('imgLab');
  B.innerHTML=`<div class="row cz-src"><button class="btn sm" data-s="photo">🌸 색이 많은 그림</button><button class="btn ghost sm" data-s="logo">🔷 단색 로고</button><label class="btn ghost sm cz-file">📷 내 사진 열기<input type="file" accept="image/*" hidden></label><span class="muted cz-srcname"></span></div>
    <div class="cz-q"><label for="jqR">JPEG 품질 <b id="jqV">80</b>%</label><input type="range" min="5" max="100" step="5" value="80" id="jqR"></div>
    <div class="cz-imgs">
      <figure data-f="bmp"><div class="pic"></div><figcaption><b>BMP</b> <span>…</span></figcaption></figure>
      <figure data-f="png"><div class="pic"><img alt="PNG로 저장한 그림"></div><figcaption><b>PNG</b> <span>…</span></figcaption></figure>
      <figure data-f="jpg"><div class="pic"><img alt="JPEG로 저장한 그림"></div><figcaption><b>JPEG</b> <span>…</span></figcaption></figure>
    </div>
    <div class="row" style="margin-top:8px"><button class="btn ghost sm" id="imgZoom">🔍 확대해서 보기</button><button class="btn sm" id="imgRec">이 결과 기록하기</button><span class="muted" style="font-size:.85rem">파일 크기는 이 브라우저가 저장한 크기예요.</span></div>
    <div class="cz-recs" id="imgRecs"></div>`;
  const cv=document.createElement('canvas'); B.querySelector('[data-f=bmp] .pic').appendChild(cv);
  const imgP=B.querySelector('[data-f=png] img'), imgJ=B.querySelector('[data-f=jpg] img'), capB=B.querySelector('[data-f=bmp] span'), capP=B.querySelector('[data-f=png] span'), capJ=B.querySelector('[data-f=jpg] span');
  let srcName='색이 많은 그림', sz={}, tok=0, urls=[];
  const rnd=seed=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0; return seed/4294967296;};
  function photo(){const W=360,H=240; cv.width=W; cv.height=H; const x=cv.getContext('2d'), r=rnd(20261115);
    const g=x.createLinearGradient(0,0,0,H); g.addColorStop(0,'#2f6fc4'); g.addColorStop(1,'#b7dcf7'); x.fillStyle=g; x.fillRect(0,0,W,H);
    x.strokeStyle='#4a3426'; x.lineCap='round'; [[0,220,140,120,10],[140,120,260,60,7],[140,120,200,30,5],[260,60,360,40,5],[90,170,40,90,5]].forEach(([a,b,c,d,w])=>{x.lineWidth=w; x.beginPath(); x.moveTo(a,b); x.quadraticCurveTo((a+c)/2,(b+d)/2-12,c,d); x.stroke();});
    for(let i=0;i<320;i++){const px=r()*W, py=20+r()*190, rad=3+r()*9; x.fillStyle=`hsl(${330+r()*28},${50+r()*35}%,${78+r()*16}%)`; x.beginPath(); x.arc(px,py,rad,0,7); x.fill();}
    const im=x.getImageData(0,0,W,H), d=im.data; for(let i=0;i<d.length;i+=4){const n=(r()-.5)*26; d[i]+=n; d[i+1]+=n; d[i+2]+=n;} x.putImageData(im,0,0);}
  function logo(){const W=360,H=240; cv.width=W; cv.height=H; const x=cv.getContext('2d');
    x.fillStyle='#ffffff'; x.fillRect(0,0,W,H); x.fillStyle='#1f9d74'; x.fillRect(0,0,W,36);
    x.fillStyle='#2f6fd0'; x.beginPath(); x.arc(120,135,62,0,7); x.fill();
    x.fillStyle='#f2a516'; x.fillRect(190,85,110,100); x.fillStyle='#ffffff'; x.fillRect(215,110,60,50);
    x.fillStyle='#0f2742'; x.fillRect(40,205,280,14);}
  function own(file){const u=URL.createObjectURL(file), im=new Image();
    im.onload=()=>{const s=Math.min(1,360/im.width,360/im.height), W=Math.max(1,Math.round(im.width*s)), H=Math.max(1,Math.round(im.height*s)); cv.width=W; cv.height=H; const x=cv.getContext('2d'); x.fillStyle='#fff'; x.fillRect(0,0,W,H); x.drawImage(im,0,0,W,H); URL.revokeObjectURL(u); srcName='내 사진'; mark('own'); measure();};
    im.onerror=()=>{URL.revokeObjectURL(u); alert('이 파일은 열 수 없어요. 다른 사진을 골라 보세요.');}; im.src=u;}
  const kb=n=>`${fmt(n)}bytes (${(n/1024).toFixed(1)}KB)`;
  function measure(){const my=++tok, q=+$('jqR').value/100; urls.forEach(u=>URL.revokeObjectURL(u)); urls=[]; sz={};
    sz.bmp=54+(((24*cv.width+31)>>5)<<2)*cv.height; capB.innerHTML=`${kb(sz.bmp)}<br><small>압축률 1 (기준) · ${cv.width}×${cv.height}</small>`;
    capP.textContent='저장하는 중…'; capJ.textContent='저장하는 중…';
    cv.toBlob(b=>{if(my!==tok||!b) return; sz.png=b.size; const u=URL.createObjectURL(b); urls.push(u); imgP.src=u; capP.innerHTML=`${kb(b.size)}<br><small>압축률 ${czRateTxt(sz.bmp,b.size)} · 무손실</small>`;},'image/png');
    cv.toBlob(b=>{if(my!==tok||!b) return; sz.jpg=b.size; sz.q=Math.round(q*100); const u=URL.createObjectURL(b); urls.push(u); imgJ.src=u; capJ.innerHTML=`${kb(b.size)}<br><small>압축률 ${czRateTxt(sz.bmp,b.size)} · 손실 · 품질 ${Math.round(q*100)}%</small>`;},'image/jpeg',q);}
  function mark(k){B.querySelectorAll('.cz-src .btn').forEach(b=>{const on=(b.dataset.s||'own')===k; b.classList.toggle('ghost',!on);}); B.querySelector('.cz-srcname').textContent='';}
  B.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{(b.dataset.s==='photo'?photo:logo)(); srcName=b.dataset.s==='photo'?'색이 많은 그림':'단색 로고'; mark(b.dataset.s); measure();});
  B.querySelector('input[type=file]').onchange=e=>{const f=e.target.files&&e.target.files[0]; if(f) own(f); e.target.value='';};
  let tm; $('jqR').oninput=()=>{$('jqV').textContent=$('jqR').value; clearTimeout(tm); tm=setTimeout(measure,150);};
  $('imgZoom').onclick=()=>{const z=B.querySelector('.cz-imgs').classList.toggle('zoom'); $('imgZoom').textContent=z?'↩︎ 원래 크기로':'🔍 확대해서 보기';};
  function showRecs(){$('imgRecs').innerHTML=MEMO.imgRes?`<b>내 기록</b><ul>${MEMO.imgRes.split(' / ').map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'';}
  $('imgRec').onclick=()=>{if(!sz.png||!sz.jpg){alert('파일 크기를 계산하는 중이에요. 잠시 뒤 다시 눌러 보세요.');return;}
    const r=n=>czRateTxt(sz.bmp,n).replace(/^[=≒] /,''), item=`${srcName}: BMP ${fmt(sz.bmp)}B · PNG ${fmt(sz.png)}B(압축률 ${r(sz.png)}) · JPEG 품질 ${sz.q}% ${fmt(sz.jpg)}B(압축률 ${r(sz.jpg)})`;
    const arr=(MEMO.imgRes||'').split(' / ').filter(Boolean); arr.push(item); MEMO.imgRes=arr.slice(-3).join(' / '); czSave(); showRecs();};
  photo(); mark('photo'); showRecs();
  onShow[5]=()=>{if(!sz.png) measure();};
})();

/* 05 개념 정리하기 빈칸 */
document.querySelectorAll('.cz-blank').forEach(b=>b.onclick=()=>{const on=!b.classList.contains('on'); b.textContent=on?b.dataset.a:'?'; b.classList.toggle('on',on);});

/* 06 마무리 */
const MEMOLIST=[['planComp','처음 생각 · 데이터 크기를 줄이는 방법'],['readyPick','기억나는 디지털 데이터 표현 방법'],['ecoIdea','탄소 중립을 위해 할 수 있는 일'],['ck1','성취도 · 압축의 필요성'],['rleHi','미션 ① 압축률 2 이상 문자열'],['rleLo','미션 ② 압축률 1 미만 문자열'],['rleLimit','런 길이 부호화의 한계'],['cmpResult','세 방법 압축률 비교 기록'],['cmpWhy','가장 효율적인 방법과 까닭'],['ck2','성취도 · 압축 효율 분석'],['frameRes','영상 프레임 저장 공간 비교'],['mpegWhy','달라진 격자만 저장하면 효과적인 까닭'],['ck3','성취도 · 기본 압축 원리'],['imgRes','이미지 압축 비교 기록'],['imgBest','가장 효율적인 이미지 압축 방법'],['colabRes','(선택) 코랩 실행 결과'],['ck4','성취도 · 품질과 용량 분석'],['keyQ','핵심 질문에 대한 내 답'],['newLearn','새롭게 알게 된 점']];
onShow[6]=()=>{const p=(MEMO.planComp||'').trim(); $('prevPlan').innerHTML=`<b>처음 생각</b> ${p?esc(p):'<span class="muted">(시작 화면에 아직 안 씀)</span>'}`; memoSummary('msum',MEMOLIST);};
