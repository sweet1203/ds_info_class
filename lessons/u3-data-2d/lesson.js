/* ── 공통: 파이썬 코드 상자 · 한 줄씩 실행하기 ── */
const PYKW=new Set(['if','else','elif','for','while','in','def','return','import','as','from','with','try','except','True','False','None','and','or','not','class']);
const PYBI=new Set(['print','input','type','int','float','str','list','tuple','open','len','range','abs','max','divmod']);
function pyHL(s){let o='',i=0;while(i<s.length){const c=s[i],r=s.slice(i);
  if(c==='#'){o+=`<i class="c">${esc(r)}</i>`;break;}
  if(c==="'"||c==='"'){let j=i+1;while(j<s.length&&s[j]!==c)j++;o+=`<i class="s">${esc(s.slice(i,j+1))}</i>`;i=j+1;continue;}
  let m=/^[A-Za-z_가-힣][\w가-힣]*/.exec(r);
  if(m){const w=m[0];o+=PYKW.has(w)?`<i class="k">${w}</i>`:(PYBI.has(w)&&s[i+w.length]==='(')?`<i class="b">${w}</i>`:esc(w);i+=w.length;continue;}
  m=/^\d+(\.\d+)?/.exec(r);if(m){o+=`<i class="n">${m[0]}</i>`;i+=m[0].length;continue;}
  o+=esc(c);i++;}return o;}
const pyLines=lines=>lines.map(l=>`<span class="l">${pyHL(l)||' '}</span>`).join('');
function pyBoxes(){document.querySelectorAll('pre.py-code:not([data-done])').forEach(p=>{p.innerHTML=pyLines(p.textContent.replace(/^\n+|\s+$/g,'').split('\n'));p.dataset.done='1';});}
/* 값 표현: 실수는 F(), 튜플은 T(), 숫자 키·넣은 순서를 지킬 딕셔너리는 DK([키,값],…) */
const F=x=>({f:x}), T=(...a)=>({t:a}), DK=(...p)=>({__d:p});
const pyIsDict=v=>v&&typeof v==='object'&&!Array.isArray(v)&&v.f===undefined&&!v.t;
const pyItems=v=>v.__d||Object.entries(v);
function pyStr(s){s=s.replace(/\\/g,'\\\\').replace(/\n/g,'\\n'); return (s.includes("'")&&!s.includes('"'))?'"'+s+'"':"'"+s.replace(/'/g,"\\'")+"'";}
const pyKey=k=>typeof k==='number'?String(k):pyStr(String(k));
function pyRepr(v){
  if(v&&v.f!==undefined) return Number.isInteger(v.f)?v.f.toFixed(1):String(v.f);
  if(v&&v.t) return '('+v.t.map(pyRepr).join(', ')+')';
  if(typeof v==='string') return pyStr(v);
  if(typeof v==='boolean') return v?'True':'False';
  if(typeof v==='number') return String(v);
  if(Array.isArray(v)) return '['+v.map(pyRepr).join(', ')+']';
  if(pyIsDict(v)) return '{'+pyItems(v).map(([k,x])=>pyKey(k)+': '+pyRepr(x)).join(', ')+'}';
  return String(v);}
function pyType(v){if(v&&v.f!==undefined)return 'float';if(v&&v.t)return 'tuple';if(typeof v==='string')return 'str';if(typeof v==='boolean')return 'bool';if(typeof v==='number')return 'int';if(Array.isArray(v))return 'list';return 'dict';}
function pyVal(v){
  if(Array.isArray(v)&&v.length&&v.every(Array.isArray))
    return `<div class="py-scroll"><table class="py-grid"><tr><th></th>${v[0].map((_,j)=>`<th>${j}열</th>`).join('')}</tr>${v.map((r,i)=>`<tr><th>${i}행</th>${r.map(x=>`<td>${esc(pyRepr(x))}</td>`).join('')}</tr>`).join('')}</table></div>`;
  if(Array.isArray(v)) return `<div class="py-list">${v.map((x,i)=>`<span><b>${esc(pyRepr(x))}</b><small>[${i}]</small></span>`).join('')}</div>`;
  if(pyIsDict(v)){const E=pyItems(v);
    if(E.length&&E.every(([,x])=>pyIsDict(x))) return `<div class="py-dict2">${E.map(([k,x])=>`<div><small>${esc(pyKey(k))}</small>${pyVal(x)}</div>`).join('')}</div>`;
    return `<div class="py-dict">${E.map(([k,x])=>`<span><small>${esc(pyKey(k))}</small><b>${esc(pyRepr(x))}</b></span>`).join('')}</div>`;}
  return `<code class="py-sc">${esc(pyRepr(v))}</code>`;}
/* 한 줄씩 실행: steps=[{l:줄(0부터) 또는 [시작,끝], set:{변수:값}, out:'출력', err:'오류', ask:{q,o,a,w}}] */
function pyTrace(box,cfg){
  const B=$(box);
  B.innerHTML=`<div class="py-tr"><div class="py-left"><div class="py-hd">코드</div><pre class="py-code py-live"></pre><div class="row py-ctl"><button class="btn sm py-run">▶ 한 줄 실행</button><button class="btn ghost sm py-re">↺ 처음부터</button><span class="py-cnt"></span></div><div class="py-ask"></div></div><div class="py-right"><div class="py-hd">변수</div><table class="py-vars"><thead><tr><th>이름</th><th>값</th><th>자료형</th></tr></thead><tbody></tbody></table><div class="py-hd">실행 결과</div><pre class="py-con"></pre></div></div>`;
  const C=B.querySelector('.py-live'), V=B.querySelector('tbody'), O=B.querySelector('.py-con'), A=B.querySelector('.py-ask'), run=B.querySelector('.py-run'), cnt=B.querySelector('.py-cnt');
  C.innerHTML=pyLines(cfg.code); const L=[...C.children];
  const nAsk=cfg.steps.filter(s=>s.ask).length;
  let pos,vars,outs,ok,chg,busy;
  const inL=(l,i)=>Array.isArray(l)?(i>=l[0]&&i<=l[1]):i===l;
  function draw(){
    const nx=cfg.steps[pos], pv=pos>0?cfg.steps[pos-1]:null;
    L.forEach((el,i)=>{el.classList.toggle('next',!!nx&&inL(nx.l,i)); el.classList.toggle('cur',!!pv&&inL(pv.l,i));});
    const ns=Object.keys(vars);
    V.innerHTML=ns.length?ns.map(n=>`<tr class="${chg.includes(n)?'chg':''}"><td class="mono">${esc(n)}</td><td>${pyVal(vars[n])}</td><td class="mono">${pyType(vars[n])}</td></tr>`).join(''):'<tr><td colspan="3" class="muted">아직 저장된 변수가 없어요.</td></tr>';
    O.innerHTML=outs.length?outs.map(o=>o.err?`<span class="err">${esc(o.t)}</span>`:esc(o.t)).join('\n'):'<span class="muted">(아직 출력 없음)</span>';
    cnt.textContent=nAsk?`예측 ${ok} / ${nAsk}`:'';
    run.disabled=busy||pos>=cfg.steps.length;
    run.textContent=pos===0?'▶ 첫 줄 실행':'▶ 다음 줄 실행';
  }
  function finish(){A.insertAdjacentHTML('beforeend',`<div class="py-end">✅ 끝까지 실행했어요.${nAsk?` 예측 ${nAsk}개 가운데 <b>${ok}개</b>를 맞혔어요.`:''} ${cfg.end||''}</div>`); if(cfg.onEnd) cfg.onEnd(`예측 ${ok}/${nAsk} 맞힘`);}
  function exec(){const st=cfg.steps[pos]; chg=[];
    if(st.set) for(const k in st.set){vars[k]=st.set[k]; chg.push(k);}
    if(st.out!=null) outs.push({t:st.out});
    if(st.err) outs.push({t:st.err,err:1});
    pos=st.err?cfg.steps.length:pos+1; draw();
    if(pos>=cfg.steps.length) finish();}
  function step(){if(busy||pos>=cfg.steps.length) return; const st=cfg.steps[pos]; A.innerHTML='';
    if(!st.ask){exec(); return;}
    busy=true; draw();
    const q=st.ask.q||`${(Array.isArray(st.l)?st.l[0]:st.l)+1}번 줄을 실행하면 무엇이 출력될까요?`;
    A.innerHTML=`<div class="py-q"><b>🤔 ${q}</b><div class="row">${st.ask.o.map((o,j)=>`<button class="btn ghost sm mono" data-j="${j}">${esc(o)}</button>`).join('')}</div><div class="fb"></div></div>`;
    A.querySelectorAll('button').forEach(b=>b.onclick=()=>{const j=+b.dataset.j, r=j===st.ask.a; if(r) ok++;
      A.querySelectorAll('button').forEach(x=>{x.disabled=true; if(+x.dataset.j===st.ask.a) x.classList.add('right'); else if(x===b) x.classList.add('wrong');});
      A.querySelector('.fb').innerHTML=(r?'<span class="ok">맞아요!</span> ':'<span class="ng">아쉬워요.</span> ')+(st.ask.w||''); busy=false; exec();});
  }
  function reset(){pos=0;vars={};outs=[];ok=0;chg=[];busy=false;A.innerHTML='';draw();}
  run.onclick=step; B.querySelector('.py-re').onclick=reset; reset();
}
/* 성취도 평가·개념 정리 빈칸 */
function blanks(){document.querySelectorAll('.py-blank').forEach(b=>b.onclick=()=>{const on=!b.classList.contains('on'); b.textContent=on?b.dataset.a:'?'; b.classList.toggle('on',on);});}

/* ── 이 차시 ── */
function d2Save(){store.set(MK,MEMO);}
pyBoxes(); blanks();
const D2N=['내빈','미송','민수','준서','지환'], D2C=['상의','신발','하의'], D2V=[[95,250,'M'],[85,230,'S'],[100,270,'XL'],[95,235,'L'],[90,250,'L']];

/* 성취도 평가 */
chips('ckData2','ckData2',['2차원 딕셔너리를 활용하여 데이터를 표현할 수 있다','문제를 해결하기 위해 적절한 다차원 데이터로 표현할 수 있다'],true);

/* 01 행과 열 찾기 */
(function(){
  const B=$('gridLab');
  B.innerHTML=`<div class="row d2-mode"><button class="btn sm" data-m="free">자유롭게 눌러 보기</button><button class="btn sm ghost" data-m="quiz">도전 3문제</button></div>
    <div class="d2-gl"><div class="py-scroll"><table class="d2-grid"><tr><th></th>${D2C.map((c,j)=>`<th>${j}열<small>${c}</small></th>`).join('')}</tr>
    ${D2V.map((r,i)=>`<tr><th><button data-r="${i}">${i}행<small>${D2N[i]}</small></button></th>${r.map((v,j)=>`<td><button data-r="${i}" data-c="${j}">${esc(String(v))}</button></td>`).join('')}</tr>`).join('')}</table></div>
    <div class="d2-out"></div></div>`;
  const OUT=B.querySelector('.d2-out'); let mode='free', Q=[], qi=0, ok=0, lock=false;
  const expr=(r,c)=>c==null?`class1[${r}]`:`class1[${r}][${c}]`;
  const val=(r,c)=>c==null?pyRepr(D2V[r]):pyRepr(D2V[r][c]);
  function mark(r,c,cls){B.querySelectorAll('.d2-grid button').forEach(b=>b.classList.remove('on','hit','miss'));
    B.querySelectorAll(c==null?`[data-r="${r}"]`:`[data-r="${r}"][data-c="${c}"]`).forEach(b=>b.classList.add(cls||'on'));}
  function free(r,c){mark(r,c); OUT.innerHTML=`<div class="py-hd">코드</div><div class="d2-expr">${expr(r,c)}</div><div class="py-hd">꺼낸 값</div><div class="d2-val">${esc(val(r,c))}</div><p class="note">${c==null?`대괄호 한 개 → ${r}행 전체(${D2N[r]}의 의복 치수)`:`${r}행(${D2N[r]})의 ${c}열(${D2C[c]})`}</p>`;}
  function newQ(){const cells=[]; for(let r=0;r<5;r++) for(let c=0;c<3;c++) cells.push([r,c]);
    const pick=shuffle(cells).slice(0,2); pick.splice(Math.floor(Math.random()*3),0,[Math.floor(Math.random()*5),null]); return pick;}
  function ask(){lock=false; mark(-1,-1);
    if(qi>=Q.length){OUT.innerHTML=`<div class="py-end">🎉 3문제 가운데 <b>${ok}개</b>를 한 번에 찾았어요.</div><button class="btn ghost sm" style="margin-top:8px">다시 도전</button>`; OUT.querySelector('button').onclick=start; MEMO.gridRes=`도전 ${ok}/3`; d2Save(); return;}
    const [r,c]=Q[qi]; OUT.innerHTML=`<div class="py-hd">도전 ${qi+1} / ${Q.length}</div><div class="d2-expr">${expr(r,c)}</div><p>이 코드가 가리키는 ${c==null?'<b>행 이름</b>':'<b>칸</b>'}을 눌러요.</p><div class="fb"></div>`;}
  function start(){Q=newQ(); qi=0; ok=0; ask();}
  function quizClick(r,c){if(lock||qi>=Q.length) return; const [tr,tc]=Q[qi], right=(r===tr&&c===tc); lock=true; if(right) ok++;
    mark(tr,tc,'hit'); if(!right) B.querySelectorAll(c==null?`th [data-r="${r}"]`:`[data-r="${r}"][data-c="${c}"]`).forEach(b=>b.classList.add('miss'));
    OUT.querySelector('.fb').innerHTML=(right?'<span class="ok">맞아요!</span> ':`<span class="ng">아쉬워요.</span> `)+`${expr(tr,tc)} → <span class="mono">${esc(val(tr,tc))}</span> <button class="btn sm" style="margin-left:6px">다음 →</button>`;
    OUT.querySelector('.fb button').onclick=()=>{qi++; ask();};}
  B.querySelectorAll('.d2-grid button').forEach(b=>b.onclick=()=>{const r=+b.dataset.r, c=b.dataset.c==null?null:+b.dataset.c; mode==='free'?free(r,c):quizClick(r,c);});
  B.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{mode=b.dataset.m; B.querySelectorAll('[data-m]').forEach(x=>x.classList.toggle('ghost',x!==b)); if(mode==='quiz') start(); else {mark(-1,-1); OUT.innerHTML='<p class="muted">칸이나 행 이름을 눌러 보세요.</p>';}});
  OUT.innerHTML='<p class="muted">칸이나 행 이름을 눌러 보세요.</p>';
})();

/* 01 자리 배치표 */
pyTrace('trSeat',{
  code:["seat = [['가온', '나래', '다솜'],","        ['라온', '마루', '바다']]",'print(seat[1][0])',"seat[0][2] = '보라'",'print(seat[0])',"seat[1] = '빈자리'",'print(seat)'],
  steps:[
    {l:[0,1],set:{seat:[['가온','나래','다솜'],['라온','마루','바다']]}},
    {l:2,out:'라온',ask:{o:['나래','다솜','라온'],a:2,w:'[1]은 1행(두 번째 줄), [0]은 0열(첫 번째 칸)이에요.'}},
    {l:3,set:{seat:[['가온','나래','보라'],['라온','마루','바다']]},ask:{q:"4번 줄 seat[0][2] = '보라' 는 어느 칸을 바꿀까요?",o:['2행 0열','0행 2열의 다솜','1행 2열의 바다'],a:1,w:'앞의 번호가 행, 뒤의 번호가 열이에요. 0행 2열의 다솜이 보라로 바뀌어요.'}},
    {l:4,out:"['가온', '나래', '보라']"},
    {l:5,set:{seat:[['가온','나래','보라'],'빈자리']},ask:{q:"6번 줄처럼 대괄호를 한 개만 써서 seat[1] = '빈자리' 를 실행하면?",o:['오류가 난다',"1행 0열 값이 '빈자리'가 된다","1행 전체가 '빈자리' 하나가 된다"],a:2,w:"대괄호 한 개는 행 전체를 가리켜요. 1행의 리스트가 통째로 문자열 '빈자리'로 바뀌어요."}},
    {l:6,out:"[['가온', '나래', '보라'], '빈자리']"}
  ],
  end:'대괄호 한 개와 두 개가 가리키는 것이 어떻게 다른지 아래 메모에 정리해요.',
  onEnd:s=>{MEMO.trSeat=s; d2Save();}
});

/* 02 키 두 개로 찾아가기 */
(function(){
  const B=$('dictLab');
  const T=[{t:'준서의 신발 치수',o:'준서',n:'신발'},{t:'지환의 하의 치수',o:'지환',n:'하의'},{t:'미송이의 의복 치수 전체',o:'미송',n:null}];
  B.innerHTML=`<div class="row d2-mode"><button class="btn sm" data-m="free">자유롭게 만들기</button><button class="btn sm ghost" data-m="quiz">도전 3문제</button></div>
    <div class="d2-dl"><div><div class="py-hd">① 바깥쪽 키 · 학생 이름</div><div class="row d2-keys" data-k="o">${D2N.map(n=>`<button class="btn sm ghost" data-v="${n}">'${n}'</button>`).join('')}</div>
      <div class="py-hd" style="margin-top:8px">② 안쪽 키 · 종류 <small class="muted">(누르지 않으면 대괄호 한 개)</small></div><div class="row d2-keys" data-k="n">${D2C.map(n=>`<button class="btn sm ghost" data-v="${n}">'${n}'</button>`).join('')}</div></div>
      <div class="d2-out"></div></div>`;
  const OUT=B.querySelector('.d2-out'); let o=null,n=null,mode='free',qi=0,ok=0,tried=false,solved=false,res=[];
  const rec=()=>{MEMO.dictRes=`도전 ${ok}/3 (`+T.map((t,i)=>`${t.t} ${res[i]||'-'}`).join(', ')+')'; d2Save();};
  function body(){if(!o) return '<p class="muted">바깥쪽 키(이름)를 먼저 골라요.</p>';
    const i=D2N.indexOf(o), j=n?D2C.indexOf(n):null, v=n?D2V[i][j]:Object.fromEntries(D2C.map((c,k)=>[c,D2V[i][k]]));
    return `<div class="py-hd">코드</div><div class="d2-expr">class1['${o}']${n?`['${n}']`:''}</div><div class="py-hd">꺼낸 값</div><div class="d2-val">${esc(pyRepr(v))}</div><p class="note">2차원 리스트였다면 <span class="mono">class1[${i}]${n?`[${j}]`:''}</span> — 번호를 기억해야 해요.</p>`;}
  function draw(){B.querySelectorAll('[data-k] button').forEach(b=>b.classList.toggle('ghost',b.dataset.v!==(b.parentElement.dataset.k==='o'?o:n)));
    if(mode==='free'){OUT.innerHTML=body(); return;}
    if(qi>=T.length){OUT.innerHTML=`<div class="py-end">🎉 3문제 가운데 <b>${ok}개</b>를 한 번에 만들었어요.</div><button class="btn ghost sm" style="margin-top:8px">다시 도전</button>`; OUT.querySelector('button').onclick=()=>{qi=0;ok=0;o=null;n=null;tried=false;solved=false;res=[];draw();}; return;}
    OUT.innerHTML=`<div class="py-hd">도전 ${qi+1} / 3</div><p style="margin:2px 0 6px"><b>${T[qi].t}</b>를 꺼내는 코드를 만들어요.</p>${body()}<div class="row"><button class="btn sm d2-chk">이 코드로 꺼내기</button></div><div class="fb"></div>`;
    OUT.querySelector('.d2-chk').onclick=()=>{const t=T[qi], right=o===t.o&&n===t.n; const fb=OUT.querySelector('.fb');
      if(right){if(!tried) ok++; res[qi]=tried?'다시 해서 맞힘':'한 번에 맞힘'; rec(); solved=true; OUT.querySelector('.d2-chk').disabled=true; fb.innerHTML='<span class="ok">맞아요!</span> <button class="btn sm">다음 →</button>'; fb.querySelector('button').onclick=()=>{qi++;o=null;n=null;tried=false;solved=false;draw();};}
      else {tried=true; fb.innerHTML=`<span class="ng">다시 해 봐요.</span> ${o!==t.o?'바깥쪽 키(이름)를 확인해요.':(t.n?'안쪽 키(종류)를 확인해요.':'전체를 꺼낼 때는 안쪽 키를 고르지 않아요. 고른 키를 한 번 더 누르면 풀려요.')}`;}};}
  B.querySelectorAll('[data-k] button').forEach(b=>b.onclick=()=>{if(mode==='quiz'&&solved) return; const k=b.parentElement.dataset.k, v=b.dataset.v; if(k==='o') o=(o===v?null:v); else n=(n===v?null:v); if(k==='n'&&!o) n=null; draw();});
  B.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{mode=b.dataset.m; B.querySelectorAll('[data-m]').forEach(x=>x.classList.toggle('ghost',x!==b)); o=null;n=null;qi=0;ok=0;tried=false;solved=false;res=[]; draw();});
  draw();
})();

/* 03 캐릭터 능력치 그림 */
(function(){
  const cx=160, cy=128, R=96, AX=[['공격력',150,-120],['스피드',100,-60],['충성심',200,0],['경험치',150,60],['체력',100,120],['방어력',50,180]];
  const pt=(r,a)=>[cx+r*Math.cos(a*Math.PI/180), cy+r*Math.sin(a*Math.PI/180)];
  const poly=f=>AX.map(([,v,a])=>pt(f(v),a).map(x=>x.toFixed(1)).join(',')).join(' ');
  let s=`<svg viewBox="0 0 320 256" class="d2-svg" role="img" aria-label="교과서 131쪽 캐릭터 gogo의 능력치 그림">`;
  [50,100,150,200].forEach(v=>{s+=`<polygon points="${poly(()=>v/200*R)}" fill="${v===200?'#f1f3f6':'none'}" stroke="#c9cfd8" stroke-width="1"/>`;});
  AX.forEach(([,,a])=>{const [x,y]=pt(R,a); s+=`<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#c9cfd8"/>`;});
  [50,100,150,200].forEach(v=>{const y=cy-(v/200*R)*Math.cos(Math.PI/6); s+=`<text x="${cx}" y="${(y+4).toFixed(1)}" class="d2-ring">${v}</text>`;});
  s+=`<polygon points="${poly(v=>v/200*R)}" fill="rgba(242,165,22,.45)" stroke="#e0902b" stroke-width="2"/>`;
  AX.forEach(([n,,a])=>{const [x,y]=pt(R+20,a); s+=`<text x="${x.toFixed(1)}" y="${(y+5).toFixed(1)}" class="d2-ax">${n}</text>`;});
  $('gogoChart').innerHTML=s+'</svg>';
})();

/* 03 그래프 그림 */
function d2Graph(box,cfg){
  const R=17, mk=box+'Ar';
  let s=`<svg viewBox="0 0 ${cfg.w} ${cfg.h}" class="d2-svg" role="img" aria-label="${esc(cfg.label)}"><defs><marker id="${mk}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#3d4a5c"/></marker></defs>`;
  cfg.edges.forEach(([a,b,lab,off,t,kk])=>{const [x1,y1]=cfg.nodes[a],[x2,y2]=cfg.nodes[b], dx=x2-x1, dy=y2-y1, L=Math.hypot(dx,dy), ux=dx/L, uy=dy/L, px=-uy, py=ux, o=off||0;
    const sx=x1+ux*R+px*o, sy=y1+uy*R+py*o, ex=x2-ux*(R+(cfg.dir?3:0))+px*o, ey=y2-uy*(R+(cfg.dir?3:0))+py*o;
    s+=`<line x1="${sx.toFixed(1)}" y1="${sy.toFixed(1)}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" stroke="#3d4a5c" stroke-width="2"${cfg.dir?` marker-end="url(#${mk})"`:''}/>`;
    if(lab!=null){const f=t==null?.5:t, k=kk!=null?kk:(o?o+9:11), mx=sx+(ex-sx)*f+px*k, my=sy+(ey-sy)*f+py*k; s+=`<text x="${mx.toFixed(1)}" y="${(my+5).toFixed(1)}" class="d2-el">${lab}</text>`;}});
  Object.entries(cfg.nodes).forEach(([n,[x,y]])=>{s+=`<circle cx="${x}" cy="${y}" r="${R}" fill="#fde9dc" stroke="#e0702b" stroke-width="2.5"/><text x="${x}" y="${y+6}" class="d2-nd">${n}</text>`;});
  $(box).innerHTML=s+'</svg>';
}
d2Graph('tg1',{w:320,h:190,label:'교과서 131쪽 그래프 ①',nodes:{0:[160,28],1:[55,95],3:[265,95],2:[160,162]},edges:[[0,1],[0,3],[1,2],[1,3]]});
d2Graph('tg2',{w:320,h:210,dir:true,label:'교과서 131쪽 그래프 ②',nodes:{A:[160,26],B:[48,96],E:[272,96],C:[80,184],D:[232,184]},edges:[['A','B',5],['A','D',7,6,.2],['D','A',9,6,.8],['B','E',6,0,.25,-11],['C','B',3],['C','D',5],['E','D',2]]});

/* 03 새 그래프로 연습하기 */
(function(){
  const B=$('adjLab'), A1=[[0,1,1,0],[1,0,0,0],[1,0,0,1],[0,0,1,0]], m=[0,1,2,3].map(()=>[0,0,0,0]);
  const V2=['A','B','C'], A2={A:{B:4},B:{C:2},C:{A:7}}; let t1=0, t2=0;
  B.innerHTML=`<div class="d2-adj"><div><div class="py-hd">연습 ① 연결만 있는 그래프</div><div id="pg1"></div></div>
    <div><div class="py-hd">2차원 리스트 graph (행 = 출발 정점, 열 = 도착 정점)</div><div class="py-scroll"><table class="d2-mx"><tr><th></th>${[0,1,2,3].map(j=>`<th>${j}열</th>`).join('')}</tr>${[0,1,2,3].map(i=>`<tr><th>${i}행</th>${[0,1,2,3].map(j=>`<td><button data-i="${i}" data-j="${j}">0</button></td>`).join('')}</tr>`).join('')}</table></div>
      <div class="row" style="margin-top:8px"><button class="btn sm" id="adjChk">확인</button><button class="btn ghost sm" id="adjClr">모두 0으로</button></div><div class="d2-fb" id="adjFb"></div></div></div>
    <details class="py-more" style="margin-top:12px"><summary>➕ 연습 ② 화살표 방향과 숫자가 있는 그래프 (교과서 그래프 ②를 하기 전에)</summary>
    <div class="d2-adj" style="margin-top:8px"><div><div id="pg2"></div></div>
    <div><div class="py-hd">2차원 리스트 graph · 간선의 숫자를 넣고, 연결되지 않았으면 0 또는 ×</div><div class="py-scroll"><table class="d2-mx d2-mx2"><tr><th></th>${V2.map(v=>`<th>${v}</th>`).join('')}</tr>${V2.map(a=>`<tr><th>${a}</th>${V2.map(b=>`<td><input data-a="${a}" data-b="${b}" maxlength="3" aria-label="${a}에서 ${b}로"></td>`).join('')}</tr>`).join('')}</table></div>
      <div class="row" style="margin-top:8px"><button class="btn sm" id="adjChk2">확인</button></div><div class="d2-fb" id="adjFb2"></div></div></div></details>`;
  d2Graph('pg1',{w:260,h:190,label:'연습 그래프 ①',nodes:{0:[60,40],1:[200,40],2:[60,152],3:[200,152]},edges:[[0,1],[0,2],[2,3]]});
  d2Graph('pg2',{w:260,h:190,dir:true,label:'연습 그래프 ②',nodes:{A:[50,40],B:[210,40],C:[130,155]},edges:[['A','B',4],['B','C',2],['C','A',7]]});
  const cells=[...B.querySelectorAll('.d2-mx button')];
  const paint=()=>cells.forEach(b=>{const v=m[b.dataset.i][b.dataset.j]; b.textContent=v; b.classList.toggle('one',v===1);});
  cells.forEach(b=>b.onclick=()=>{const i=+b.dataset.i,j=+b.dataset.j; m[i][j]=1-m[i][j]; b.classList.remove('bad'); paint();});
  $('adjClr').onclick=()=>{m.forEach(r=>r.fill(0)); cells.forEach(b=>b.classList.remove('bad')); $('adjFb').innerHTML=''; paint();};
  $('adjChk').onclick=()=>{t1++; let bad=0; cells.forEach(b=>{const w=m[b.dataset.i][b.dataset.j]!==A1[b.dataset.i][b.dataset.j]; b.classList.toggle('bad',w); if(w) bad++;});
    if(bad){$('adjFb').innerHTML=`<span class="ng">빨간 칸 ${bad}개를 다시 봐요.</span> 정점 i와 j가 연결되어 있으면 i행 j열과 j행 i열에 모두 1을 넣어요.`; return;}
    $('adjFb').innerHTML=`<span class="ok">맞아요!</span> 같은 그래프를 2차원 딕셔너리(키 = 정점, 값 = 연결된 정점 리스트)로 나타내면:<pre class="py-code d2-ans">graph = {0: [1, 2], 1: [0], 2: [0, 3], 3: [2]}</pre><span class="note">화살표가 없는 그래프라서 표가 대각선을 기준으로 똑같이 접혀요.</span>`;
    pyBoxes(); MEMO.adjRes=`연습 ① 정답(확인 ${t1}번)`; d2Save();};
  const none=v=>['','0','x','X','×'].includes(v.trim());
  $('adjChk2').onclick=()=>{t2++; let bad=0; B.querySelectorAll('.d2-mx2 input').forEach(x=>{const e=(A2[x.dataset.a]||{})[x.dataset.b], v=x.value.trim(), w=e==null?!none(v):String(e)!==v; x.classList.toggle('bad',w); if(w) bad++;});
    if(bad){$('adjFb2').innerHTML=`<span class="ng">빨간 칸 ${bad}개를 다시 봐요.</span> 화살표가 출발하는 정점이 행, 도착하는 정점이 열이에요.`; return;}
    $('adjFb2').innerHTML=`<span class="ok">맞아요!</span> 0을 넣었다면 <span class="mono">graph = [[0, 4, 0], [0, 0, 2], [7, 0, 0]]</span>, 2차원 딕셔너리로는 <span class="mono">{'A': {'B': 4}, 'B': {'C': 2}, 'C': {'A': 7}}</span>`;
    MEMO.adjRes2=`연습 ② 정답(확인 ${t2}번)`; d2Save();};
  paint();
})();

/* 05 마무리 */
const MEMOLIST=[['planData2','처음 생각 · 여러 치수를 한 변수에'],['gridRes','행과 열 찾기 도전'],['trSeat','자리 배치표 예측'],['rcWhy','행 번호·열 번호와 대괄호 한 개'],['dictRes','키 두 개로 찾아가기 도전'],['cmpWhy','2차원 리스트와 2차원 딕셔너리 비교'],['adjRes','그래프 연습 ①'],['adjRes2','그래프 연습 ②(선택)'],['adjWhy','그래프를 2차원 리스트로 나타내는 방법'],['keyErr','class1[\'한준\'] 오류의 까닭'],['searchRes','치수 검색 프로그램 실행 결과'],['gogoRes','캐릭터 체력 수정 결과'],['ckData2','성취도 평가'],['keyQ','오늘의 질문에 대한 내 답'],['newLearn','새롭게 알게 된 점']];
onShow[5]=()=>{const p=(MEMO.planData2||'').trim(); $('prevPlan').innerHTML=`<b>처음 생각</b> ${p?esc(p):'<span class="muted">(시작 화면에 아직 안 씀)</span>'}`; memoSummary('msum',MEMOLIST);};
