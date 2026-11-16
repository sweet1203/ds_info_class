/* ===== 코드 추적기: 한 줄씩 실행하며 실행한 줄·변수 값·실행 결과를 보여 줌 (이 차시 공통) ===== */
const pyS=v=>v&&typeof v==='object'&&!Array.isArray(v)&&'f' in v?(Number.isInteger(v.f)?v.f.toFixed(1):String(v.f)):Array.isArray(v)?'['+v.map(pyR).join(', ')+']':v===true?'True':v===false?'False':v==null?'None':String(v);
const pyR=v=>typeof v==='string'?`'${v}'`:pyS(v);
function PyErr(m){this.m=m;}
const pyInt=s=>{if(/^\s*[-+]?\d+\s*$/.test(String(s))) return parseInt(s,10); throw new PyErr(`ValueError: invalid literal for int() with base 10: '${s}'`);};
const KW=o=>Object.assign({__kw:1},o);
function Rec(){this.st=[];this.v={};this.L=null;this.fn='';this.out='';}
Rec.prototype={
  fin(){const s=this.st[this.st.length-1]; if(s){s.v=Object.assign({},this.v); s.L=this.L?Object.assign({},this.L):null; s.fn=this.fn; s.out=this.out;}},
  at(n,note){this.fin(); this.st.push({n,note:note||''}); if(this.st.length>600) throw new PyErr('(단계가 너무 많아 여기서 멈췄어요)');},
  set(k,v){if(this.L) this.L[k]=v; else this.v[k]=v;},
  g(k,v){this.v[k]=v;},
  get(k){return this.L&&k in this.L?this.L[k]:this.v[k];},
  p(...a){let o={}; if(a.length&&a[a.length-1]&&a[a.length-1].__kw) o=a.pop(); const sep=o.sep!=null?o.sep:' ', end=o.end!=null?o.end:'\n'; this.out+=esc(a.map(pyS).join(sep)+end);},
  inp(prompt,val){this.out+=esc(prompt)+`<b class="u">${esc(val)}</b>\n`; return String(val);},
  call(fn){this.fn=fn; this.L={};},
  ret(){this.fn=''; this.L=null;}
};
const TRKW=new Set('if elif else for in while break continue def return True False import and or not global'.split(' '));
function trHl(c){
  return c.replace(/(#.*$)|([fF]?'[^']*'|"[^"]*")|([A-Za-z_\uAC00-\uD7A3][\w\uAC00-\uD7A3]*)|(\d+)|([^#'"A-Za-z_\d\uAC00-\uD7A3]+)/g,(m,cm,st,id,nu,ot)=>{
    if(cm) return `<span class="c">${esc(cm)}</span>`;
    if(st) return `<span class="s">${esc(st)}</span>`;
    if(id) return TRKW.has(id)?`<span class="k">${id}</span>`:/^(print|input|int|len|range|map|str|random|randint|split|append|items)$/.test(id)?`<span class="f">${id}</span>`:esc(id);
    if(nu) return `<span class="n">${nu}</span>`;
    return esc(ot);
  });
}
function tracer(id,cfg){
  const B=$(id); B.classList.add('tr');
  const val={}; (cfg.inputs||[]).forEach(x=>val[x.k]=x.v);
  let code=[], lines=[]; const neu=n=>/^\s*else\s*:/.test(code[n-1]||''); const blank=n=>!code[n-1]||!code[n-1].trim()||/^\s*#/.test(code[n-1]);
  B.innerHTML=`${cfg.inputs?'<div class="tr-in"></div>':''}${cfg.pick?`<p class="tr-pickh">${cfg.pickMsg||'<b>먼저 예측해요.</b> 입력값을 정한 뒤 <b>실행될 줄</b>을 모두 눌러 표시하고 「예측 확인」을 눌러요.'}</p>`:''}
    <div class="tr-grid${cfg.wide?' wide':''}"><div class="tr-codew"><pre class="tr-code${cfg.pick?' pickable':''}"></pre></div>
    <div class="tr-side">${cfg.vars||cfg.scopes?'<div class="tr-vars"></div>':''}<div class="tr-outw"><b>실행 결과</b><pre class="tr-out"></pre></div></div></div>
    <div class="tr-note"></div>
    <div class="tr-ctl">${cfg.pick?'<button class="btn sm tr-chk">✔ 예측 확인</button>':''}<button class="btn sm tr-step">▶ 한 줄 실행</button><button class="btn sm ghost tr-auto">⏯ 자동 실행</button>${cfg.skip?`<button class="btn sm ghost tr-skip">${cfg.skip.label}</button>`:''}<button class="btn sm ghost tr-end">⏩ 끝까지</button><button class="btn sm ghost tr-reset">↺ 처음부터</button>${cfg.pick?'<button class="btn sm ghost tr-again">✎ 다시 예측</button>':''}<span class="tr-cnt muted"></span></div>
    ${cfg.table?'<div class="tr-tblw"><table class="tr-tbl"></table></div>':''}`;
  const q=s=>B.querySelector(s), preE=q('.tr-code'), outE=q('.tr-out'), noteE=q('.tr-note'), cntE=q('.tr-cnt'), varE=q('.tr-vars'), tblE=q('.tr-tbl');
  let S=[], cur=0, timer=null, checked=!cfg.pick, picks=new Set(), msg='';
  /* 입력 칸 */
  if(cfg.inputs){
    const I=q('.tr-in');
    I.innerHTML=(cfg.inLabel?`<b>${cfg.inLabel}</b>`:'')+cfg.inputs.map(x=>x.opts?`<span class="tr-opt" data-k="${x.k}">${esc(x.label)} ${x.opts.map(o=>`<button type="button" data-o="${esc(o)}">${esc(o)}</button>`).join('')}</span>`
      :`<label>${esc(x.label)} <input type="text" data-k="${x.k}" value="${esc(x.v)}" style="width:${x.w||110}px" autocomplete="off" spellcheck="false"></label>`).join('');
    I.querySelectorAll('.tr-opt').forEach(g=>{const k=g.dataset.k, bs=[...g.querySelectorAll('button')], draw=()=>bs.forEach(b=>b.classList.toggle('on',b.dataset.o===val[k]));
      bs.forEach(b=>b.onclick=()=>{val[k]=b.dataset.o; draw(); build();}); draw();});
    I.querySelectorAll('input').forEach(t=>{let tm; t.addEventListener('input',()=>{val[t.dataset.k]=t.value; clearTimeout(tm); tm=setTimeout(build,350);});});
  }
  function renderCode(){
    const nc=typeof cfg.code==='function'?cfg.code(val):cfg.code; if(nc.join('\n')===code.join('\n')&&lines.length) return; code=nc;
    preE.innerHTML=code.map((c,i)=>`<span class="ln" data-n="${i+1}"><i>${i+1}</i>${trHl(c)||' '}</span>`).join(''); lines=[...preE.querySelectorAll('.ln')];
    if(cfg.pick) lines.forEach((l,i)=>l.onclick=()=>{if(checked||blank(i+1)) return; const n=i+1; picks.has(n)?picks.delete(n):picks.add(n); draw();});
  }
  function build(){
    stop(); renderCode(); const R=new Rec(); msg='';
    try{cfg.run(R,val);}catch(e){if(e instanceof PyErr){msg=e.m;} else throw e;}
    R.fin(); S=R.st;
    if(msg&&S.length){S[S.length-1].out+=`<span class="er">${esc(msg)}</span>\n`;}
    cur=0; if(cfg.pick){checked=false; picks.clear();} draw();
  }
  function ran(k){const s=new Set(); for(let i=0;i<k;i++) s.add(S[i].n); return s;}
  function fmtv(o,prev,keys){
    if(!o) return '';
    const ks=keys||Object.keys(o);
    return ks.map(k=>{const has=k in o, v=has?pyR(o[k]):'', ch=has&&(!prev||!(k in prev)||pyR(prev[k])!==v);
      return `<tr class="${ch?'ch':''}"><th>${esc(k)}</th><td>${has?esc(v):'<span class="muted">-</span>'}</td></tr>`;}).join('');
  }
  function draw(){
    const done=cur>=S.length, R=ran(cur), all=ran(S.length), s=cur?S[cur-1]:null, p=cur>1?S[cur-2]:null;
    lines.forEach((l,i)=>{const n=i+1; l.className='ln'+(R.has(n)?' done':'')+(s&&s.n===n?' cur':'')+(done&&checked&&!all.has(n)&&!blank(n)?' skip':'')+(picks.has(n)?' pk':'');
      if(cfg.pick&&checked&&picks.size&&!neu(n)){if(picks.has(n)&&all.has(n)) l.classList.add('ok'); else if(picks.has(n)) l.classList.add('ng'); else if(all.has(n)) l.classList.add('miss');}});
    outE.innerHTML=s?s.out:(msg&&!S.length?`<span class="er">${esc(msg)}</span>`:'');
    noteE.innerHTML=!checked?'':s?`<b>${s.n}행</b> 실행${s.fn?` <span class="tr-fn">함수 ${esc(s.fn)} 안</span>`:''}${s.note?' · '+s.note:''}`:'<span class="muted">「▶ 한 줄 실행」을 누르면 1행부터 실행해요.</span>';
    cntE.textContent=checked?`${cur} / ${S.length}단계${done&&S.length?' · 끝':''}`:'';
    if(varE){
      if(cfg.scopes){const gk=Object.keys(s?s.v:{}), lk=s&&s.L?Object.keys(s.L):[];
        varE.innerHTML=`<div class="tr-sc"><b>전역 변수</b><table>${gk.length?fmtv(s.v,p&&p.v):'<tr><td class="muted">아직 없음</td></tr>'}</table></div><div class="tr-sc l"><b>지역 변수${s&&s.fn?` · ${esc(s.fn)}()`:''}</b><table>${s&&s.L?(lk.length?fmtv(s.L,p&&p.L):'<tr><td class="muted">(함수 시작)</td></tr>'):`<tr><td class="muted">${p&&p.L?'함수가 끝나 사라졌어요':'함수 밖이라 없음'}</td></tr>`}</table></div>`;}
      else varE.innerHTML=`<b>변수</b><table>${fmtv(s?s.v:{},p&&p.v,cfg.vars)}</table>`;
    }
    if(tblE){const N=Math.max(S.length,cfg.tableMin||0), cols=[...Array(N).keys()];
      tblE.innerHTML=`<tr><th>단계</th>${cols.map(i=>`<th>${i+1}</th>`).join('')}</tr><tr><th>행 번호</th>${cols.map(i=>`<td class="${i===cur-1?'cur':''}">${i<cur?S[i].n:''}</td>`).join('')}</tr>`+
        (cfg.tvars||cfg.vars).map(k=>`<tr><th>${esc(k)}</th>${cols.map(i=>{const v=i<cur&&k in S[i].v?pyR(S[i].v[k]):''; const pv=i>0&&i<cur&&k in S[i-1].v?pyR(S[i-1].v[k]):null; return `<td class="${i===cur-1?'cur':''}${v!==''&&v!==pv?' ch':''}">${esc(v)}</td>`;}).join('')}</tr>`).join('');}
    q('.tr-step').disabled=!checked||done; q('.tr-end').disabled=!checked||done; q('.tr-auto').disabled=!checked||done; if(q('.tr-skip')) q('.tr-skip').disabled=!checked||done;
    if(q('.tr-chk')) q('.tr-chk').style.display=checked?'none':''; if(q('.tr-again')) q('.tr-again').style.display=checked?'':'none';
    q('.tr-step').style.display=q('.tr-auto').style.display=q('.tr-end').style.display=checked?'':'none';
    if(done&&cfg.onEnd&&checked) cfg.onEnd(val,S);
  }
  function stop(){clearInterval(timer); timer=null; const a=q('.tr-auto'); if(a) a.textContent='⏯ 자동 실행';}
  q('.tr-step').onclick=()=>{stop(); if(cur<S.length){cur++; draw();}};
  q('.tr-end').onclick=()=>{stop(); cur=S.length; draw();};
  if(cfg.skip) q('.tr-skip').onclick=()=>{stop(); do{cur++;}while(cur<S.length&&!cfg.skip.stop(S,cur)); draw();};
  q('.tr-reset').onclick=()=>{stop(); cur=0; draw();};
  q('.tr-auto').onclick=()=>{if(timer){stop();return;} q('.tr-auto').textContent='⏸ 멈춤'; timer=setInterval(()=>{if(cur>=S.length){stop(); return;} cur++; draw(); if(cur>=S.length) stop();},cfg.speed||650);};
  if(cfg.pick){
    q('.tr-again').onclick=()=>{stop(); cur=0; checked=false; picks.clear(); draw();};
    q('.tr-chk').onclick=()=>{if(!picks.size){alert('실행될 줄을 먼저 눌러 표시해요.'); return;} checked=true; cur=S.length; draw();
      const all=new Set([...ran(S.length)].filter(n=>!neu(n))); let ok=0, ng=0, miss=0; picks.forEach(n=>{if(neu(n)) return; all.has(n)?ok++:ng++;}); all.forEach(n=>{if(!picks.has(n)) miss++;});
      noteE.innerHTML=(ng||miss?`<span class="ng">다시 살펴봐요.</span> `:'<span class="ok">모두 맞았어요!</span> ')+`실행된 줄 ${all.size}개 중 <b>${ok}개</b>를 맞혔어요.${ng?` 실행되지 않은 줄을 ${ng}개 골랐어요(✗).`:''}${miss?` 놓친 줄이 ${miss}개 있어요(놓침).`:''} 「↺ 처음부터」로 한 줄씩 다시 따라가 보거나, 「다시 예측」으로 같은 입력값에서 다시 예측할 수 있어요.`;
      if(cfg.onPick) cfg.onPick(val,{ok,ng,miss,all:all.size});};
  }
  build();
  return {rebuild:build, val};
}
/* 읽기용 코드 상자: <div data-code="키"> 에 CODE[키]를 줄 번호와 함께 그림. ____ 는 빈칸 */
function codeBoxes(map){document.querySelectorAll('[data-code]').forEach(d=>{const c=map[d.dataset.code]; if(!c) return; const nn=d.hasAttribute('data-nonum'); d.classList.add('cbox'); d.innerHTML=`<pre>${c.map((l,i)=>`<span class="ln">${nn?'':`<i>${i+1}</i>`}${trHl(l).replace(/____/g,'<span class="bl"></span>')||' '}</span>`).join('')}</pre>`;});}

/* ===== 이 차시 코드 ===== */
const TF=c=>c?'<b class="ok">True(참)</b>':'<b class="ng">False(거짓)</b>';
const addRec=(old,item,n)=>{const a=(old||'').split(' / ').filter(Boolean); a.push(item); return a.slice(-(n||3)).join(' / ');};
function fnSave(){store.set(MK,MEMO);}
const rint=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
codeBoxes({
  splitEx:["numbers = '1 3 5'","print(numbers.split())"],
  mapEx:["a = ['1', '3', '5']","x, y, z = map(int, a)","print(x, y, z)"],
  defForm:['def 함수명(매개 변수):','  명령1','  명령2','  return 반환값'],
  callForm:['함수명(인수)'],
});
/* 줄 번호가 있는 코드 상자(직접 만든 체험용) */
function codePre(box,code){box.innerHTML=`<div class="tr-codew"><pre class="tr-code">${code.map((c,i)=>`<span class="ln" data-n="${i+1}"><i>${i+1}</i>${trHl(c)||' '}</span>`).join('')}</pre></div>`; return [...box.querySelectorAll('.ln')];}
function mark(lines,done,cur){lines.forEach((l,i)=>{const n=i+1; l.className='ln'+(done.includes(n)?' done':'')+(n===cur?' cur':'');});}

/* 01 무한 루프 · 곱셈 문제 */
(function(){
  const R=[[1,9,'1~9 (교과서)'],[1,5,'1~5'],[2,19,'2~19']]; let ri=0;
  const B=$('mulLab');
  B.innerHTML=`<div class="tr-in"><span class="tr-opt">난수의 범위 ${R.map((r,i)=>`<button type="button" data-r="${i}">${r[2]}</button>`).join('')}</span><button class="btn sm ghost" id="mulNew">↺ 처음부터 실행</button></div>
    <div class="tr-grid wide"><div id="mulCode"></div><div class="tr-side"><div class="tr-vars"><b>변수</b><table id="mulVar"></table></div><div class="tr-outw"><b>실행 결과</b><pre class="tr-out" id="mulOut"></pre></div>
    <div class="fn-ans"><input id="mulIn" inputmode="numeric" placeholder="정답 입력" autocomplete="off"><button class="btn sm" id="mulGo">입력</button></div></div></div>
    <div class="tr-note" id="mulNote"></div>`;
  let lines, a, b, num, round, out, over, wrong, wait=false, tmr=null;
  const code=()=>["import random","while True:",`  a = random.randint(${R[ri][0]}, ${R[ri][1]})`,`  b = random.randint(${R[ri][0]}, ${R[ri][1]})`,"  print(a, '*', b, '= ?')","  num = int(input('정답 입력:'))","","  if num == a * b:","    print('정답입니다!')","    break","","  print(f'틀렸습니다. 정답은 {a * b}입니다.')"];
  function vars(){$('mulVar').innerHTML=[['a',a],['b',b],['num',num]].map(([k,v])=>`<tr><th>${k}</th><td>${v==null?'<span class="muted">-</span>':v}</td></tr>`).join('');}
  function ask(prev){wait=false; round++; a=rint(R[ri][0],R[ri][1]); b=rint(R[ri][0],R[ri][1]); num=null; out+=`${a} * ${b} = ?\n정답 입력:`;
    mark(lines,[...(prev||[]),2,3,4,5],6);
    $('mulNote').innerHTML=`<b>반복 ${round}번째</b> · 2행 <code>while True:</code> 조건은 늘 ${TF(true)}라 반복 안으로 들어와요. 6행에서 <b>입력을 기다려요.</b>`;
    show(); setTimeout(()=>$('mulIn').focus(),0);}
  function show(){$('mulOut').innerHTML=out; $('mulOut').scrollTop=1e6; vars(); $('mulGo').disabled=over||wait; $('mulIn').disabled=over||wait;}
  function start(){clearTimeout(tmr); tmr=null; wait=false; lines=codePre($('mulCode'),code()); B.querySelectorAll('[data-r]').forEach(x=>x.classList.toggle('on',+x.dataset.r===ri)); round=0; out=''; over=false; wrong=0; mark(lines,[1],0); ask([1]);}
  function answer(){if(over||wait) return; const t=$('mulIn').value.trim(); if(!t){$('mulIn').focus(); return;}
    out+=`<b class="u">${esc(t)}</b>\n`; $('mulIn').value='';
    if(!/^\s*[-+]?\d+\s*$/.test(t)){out+=`<span class="er">ValueError: invalid literal for int() with base 10: '${esc(t)}'</span>\n`; over=true; mark(lines,[1,2,3,4,5,6],6);
      $('mulNote').innerHTML='<span class="ng">숫자가 아닌 값을 넣어 6행의 int()에서 오류가 나 프로그램이 멈췄어요.</span> 「↺ 처음부터 실행」을 눌러요.'; show(); return;}
    num=parseInt(t,10); const ok=num===a*b;
    if(ok){out+='정답입니다!\n'; over=true; mark(lines,[1,2,3,4,5,6,8,9,10],10);
      $('mulNote').innerHTML=`8행 <code>${num} == ${a} * ${b}</code> → ${TF(true)} · 9행 출력 뒤 <b>10행 break</b>로 무한 루프를 빠져나와 프로그램이 끝나요. (반복 ${round}번, 틀린 횟수 ${wrong}번)`;
      MEMO.mulTry=addRec(MEMO.mulTry,`반복 ${round}번째에 정답(틀린 횟수 ${wrong}번, 난수 범위 ${R[ri][0]}~${R[ri][1]})`); fnSave(); show();}
    else{wrong++; out+=`틀렸습니다. 정답은 ${a*b}입니다.\n`; const prevDone=[1,2,3,4,5,6,8,12]; mark(lines,prevDone,12);
      $('mulNote').innerHTML=`8행 <code>${num} == ${a} * ${b}</code> → ${TF(false)} · if문을 건너뛰고 12행을 실행한 뒤 <b>다시 2행으로</b> 돌아가요.`; wait=true; show();
      tmr=setTimeout(()=>{tmr=null; if(!over) ask([1]);},900);}
  }
  B.querySelectorAll('[data-r]').forEach(x=>x.onclick=()=>{ri=+x.dataset.r; start();});
  $('mulNew').onclick=start; $('mulGo').onclick=answer; $('mulIn').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault(); answer();}});
  start();
})();

/* 02 split()·map() 실험실 */
(function(){
  const SEP=[['생략',null],["','",','],["'-'",'-']];
  const B=$('smLab');
  B.innerHTML=`<div class="tr-in"><label>a = input() 에 넣은 값 <input type="text" id="smIn" value="2 0" style="width:150px" autocomplete="off" spellcheck="false"></label><span class="tr-opt">구분자 ${SEP.map((s,i)=>`<button type="button" data-s="${i}">${s[0]}</button>`).join('')}</span></div><div class="fn-steps" id="smOut"></div>`;
  let si=0;
  function run(){
    B.querySelectorAll('[data-s]').forEach(x=>x.classList.toggle('on',+x.dataset.s===si));
    const raw=$('smIn').value, sep=SEP[si][1], call=sep?`a.split('${sep}')`:'a.split()';
    const parts=sep?raw.split(sep):(raw.trim()?raw.trim().split(/\s+/):[]);
    const ok=parts.map(p=>/^\s*[-+]?\d+\s*$/.test(p)), bad=parts.findIndex((p,i)=>!ok[i]);
    let h=`<div class="fn-st"><span class="lb">입력값 a</span><code>'${esc(raw)}'</code><small>문자열 하나</small></div>`;
    h+=`<div class="fn-st"><span class="lb">${esc(call)}</span><span class="fn-chips">${parts.length?parts.map(p=>`<i class="s">'${esc(p)}'</i>`).join(''):'<i class="s">(빈 리스트)</i>'}</span><small>리스트 · 요소 ${parts.length}개(모두 문자열)</small></div>`;
    if(bad>=0) h+=`<div class="fn-st"><span class="lb">map(int, ${esc(call)})</span><span class="ng">ValueError: invalid literal for int() with base 10: '${esc(parts[bad])}'</span><small>int()로 바꿀 수 없는 요소가 있어요</small></div>`;
    else{h+=`<div class="fn-st"><span class="lb">map(int, ${esc(call)})</span><span class="fn-chips">${parts.map(p=>`<i class="n">${parseInt(p,10)}</i>`).join('')||'<i class="n">(없음)</i>'}</span><small>각 요소에 int()를 적용 → 정수</small></div>`;
      h+=`<div class="fn-st"><span class="lb">x, y = map(int, ${esc(call)})</span>${parts.length===2?`<span class="fn-chips"><i class="n">x = ${parseInt(parts[0],10)}</i><i class="n">y = ${parseInt(parts[1],10)}</i></span><small>값 2개가 x, y에 차례로</small>`:`<span class="ng">ValueError: ${parts.length>2?'too many values to unpack (expected 2)':`not enough values to unpack (expected 2, got ${parts.length})`}</span><small>변수는 2개인데 값이 ${parts.length}개예요</small>`}</div>`;}
    $('smOut').innerHTML=h;
  }
  $('smIn').addEventListener('input',run); B.querySelectorAll('[data-s]').forEach(x=>x.onclick=()=>{si=+x.dataset.s; run();}); run();
})();

/* 02 폭탄 맵 체험 */
(function(){
  const B=$('bombLab');
  B.innerHTML=`<div class="fn-bomb"><div><div class="fn-ans"><input id="bmIn" placeholder="예: 2 0 (끝: n)" autocomplete="off" spellcheck="false"><button class="btn sm" id="bmGo">입력</button><button class="btn sm ghost" id="bmNew">↺ 처음부터</button></div><pre class="tr-out fn-bout" id="bmOut"></pre></div>
    <div><b class="fn-cap">처리 과정</b><ol class="fn-chk" id="bmChk"></ol><b class="fn-cap">게임 맵 maps (x = 행, y = 열)</b><div class="fn-grid" id="bmGrid"></div></div></div>`;
  let maps, out, over, last, inputs;
  const P='폭탄을 놓고 싶은 좌표(종료: n): ';
  function grid(){let h='<span></span>'+[0,1,2,3,4,5].map(j=>`<span class="h">${j}</span>`).join('');
    for(let i=0;i<6;i++){h+=`<span class="h">${i}</span>`; for(let j=0;j<6;j++) h+=`<span class="c${maps[i][j]?' on':''}${last&&last[0]===i&&last[1]===j?' new':''}">${maps[i][j]?'★':''}</span>`;}
    $('bmGrid').innerHTML=h;}
  function chk(items){$('bmChk').innerHTML=items.map(([t,s])=>`<li class="${s||''}">${t}</li>`).join('');}
  function show(){$('bmOut').innerHTML=out+(over?'':esc(P)); $('bmOut').scrollTop=1e6; grid(); $('bmGo').disabled=over; $('bmIn').disabled=over;}
  function start(){maps=[...Array(6)].map(()=>Array(6).fill(0)); out=''; over=false; last=null; inputs=[]; chk([['좌표를 입력하면 처리 과정이 여기에 나타나요.','muted']]); show();}
  function go(){if(over) return; const a=$('bmIn').value; $('bmIn').value=''; inputs.push(a); out+=esc(P)+`<b class="u">${esc(a)}</b>\n`; last=null;
    if(a==='n'){const c=[[`입력이 'n'인가요? → 예 · <b>break</b>로 반복을 끝내요`,'ok'],['중첩 for문으로 맵을 출력해요(폭탄 ★, 빈칸 □)','ok']];
      for(let i=0;i<6;i++){out+=maps[i].map(v=>v?' ★ ':' □ ').join('')+'\n';} over=true; const k=maps.flat().filter(Boolean).length;
      MEMO.bombLog=`입력: ${inputs.map(x=>`「${x}」`).join(' → ')} · 폭탄 ${k}개`; fnSave(); chk(c); show(); return;}
    const c=[[`입력이 'n'인가요? → 아니요`,'']];
    const parts=a.trim()?a.trim().split(/\s+/):[];
    c.push([`a.split() → [${parts.map(p=>`'${esc(p)}'`).join(', ')}]`,'']);
    if(!parts.every(p=>/^[-+]?\d+$/.test(p))||parts.length!==2){
      const msg=!parts.every(p=>/^[-+]?\d+$/.test(p))?`ValueError: invalid literal for int() with base 10: '${esc(parts.find(p=>!/^[-+]?\d+$/.test(p)))}'`:parts.length>2?'ValueError: too many values to unpack (expected 2)':`ValueError: not enough values to unpack (expected 2, got ${parts.length})`;
      out+=`<span class="er">${msg}</span>\n`; c.push([`map(int, …)으로 x, y를 만들 때 오류 → <b>프로그램이 멈춰요</b>`,'ng']); over=true; chk(c); show(); return;}
    const x=+parts[0], y=+parts[1]; c.push([`map(int, a.split()) → x = ${x}, y = ${y}`,'']);
    const okr=0<=x&&x<=5&&0<=y&&y<=5; c.push([`범위 확인: x와 y가 모두 0~5 안에 있나요? → ${okr?'예':'아니요'}`,okr?'':'ng']);
    if(!okr){out+='올바른 범위가 아닙니다.\n'; c.push(['「올바른 범위가 아닙니다.」를 출력하고, 맵은 바꾸지 않은 채 반복의 처음으로 돌아가 다시 입력받아요','ng']);}
    else{maps[x][y]=1; last=[x,y]; c.push([`<code>maps[${x}][${y}] = 1</code> · ${x}행 ${y}열에 폭탄`,'ok']);}
    chk(c); show(); $('bmIn').focus();}
  $('bmGo').onclick=go; $('bmIn').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault(); go();}}); $('bmNew').onclick=start;
  start();
})();

/* 03 누적 합 함수 */
const fnStop={label:'⏭ 함수 실행을 한 번에',stop:(S,k)=>k>=2&&!S[k-1].fn&&!!S[k-2].fn};
tracer('trTotal',{
  code:["def total(number):","    sum = 0","    for i in range(1, number + 1):","      sum +=i","    return sum","num = int(input('수: '))","print(total(num))"],
  inputs:[{k:'n',label:'입력할 수',v:'5',w:80}], scopes:true, skip:fnStop,
  run(R,v){
    R.at(1,'<b>def</b> · 함수 total을 정의해 기억해 둬요. 안의 명령은 <b>호출될 때</b> 실행돼요');
    R.at(6); const n=pyInt(R.inp('수: ',v.n)); R.set('num',n);
    if(n>20) throw new PyErr('(이 화면에서는 20 이하의 수로 따라가 봐요. 코랩에서는 큰 수도 돼요.)');
    R.at(7,`<code>total(num)</code> 호출 · 인수 ${n}을(를) 들고 함수 안으로 이동해요`);
    R.at(2,`매개 변수 number가 인수 ${n}을(를) 전달받았어요`); R.call('total'); R.set('number',n); R.set('sum',0);
    let s=0; for(let i=1;i<=n;i++){R.at(3,`i = ${i}`); R.set('i',i); R.at(4,`sum += i → ${s} + ${i} = ${s+i}`); s+=i; R.set('sum',s);}
    R.at(3,'반복 범위가 끝나 반복을 마쳐요');
    R.at(5,`<b>return</b> · 반환값 ${s}을(를) 들고 호출한 곳(7행)으로 돌아가요`);
    R.at(7,`7행으로 돌아와 <code>total(num)</code> 자리에 반환값 ${s}이(가) 들어가 출력돼요 · 지역 변수는 사라졌어요`); R.ret(); R.p(s);
  }
});

/* 03 약수 개수 · 지역 변수와 전역 변수 */
tracer('trDiv',{
  code:v=>["def divisorCount(n):","  tot = 0","  for i in range(1, n+1):","    if n % i == 0:","      tot += 1","  print('약수 개수:', tot)","  return tot","","tot = 0",`tot += divisorCount(${v.a})`,`tot += divisorCount(${v.b})`,"print('약수 누적 개수:', tot)"],
  inputs:[{k:'a',label:'10행의 인수',v:'10',w:60},{k:'b',label:'11행의 인수',v:'20',w:60}], scopes:true, skip:fnStop, speed:450,
  run(R,v){
    const A=pyInt(v.a), Bv=pyInt(v.b); if(A<1||Bv<1||A>30||Bv>30) throw new PyErr('(이 화면에서는 1~30 사이의 수로 따라가 봐요.)');
    R.at(1,'<b>def</b> · 함수 divisorCount를 정의해 기억해 둬요');
    R.at(9,'함수 밖에서 선언한 <b>전역 변수</b> tot'); R.g('tot',0); let G=0;
    for(const [ln,arg] of [[10,A],[11,Bv]]){
      R.at(ln,`<code>divisorCount(${arg})</code> 호출 · 함수 안으로 이동해요`);
      R.at(2,`매개 변수 n = ${arg} · 함수 안의 tot은 <b>지역 변수</b>(전역 tot과 다른 기억 장소)`); R.call('divisorCount'); R.set('n',arg); R.set('tot',0);
      let t=0; for(let i=1;i<=arg;i++){R.at(3,`i = ${i}`); R.set('i',i); const c=arg%i===0; R.at(4,`<code>${arg} % ${i} == 0</code> → ${TF(c)}`); if(c){R.at(5,`지역 tot → ${t+1}`); t++; R.set('tot',t);}}
      R.at(3,'반복 범위가 끝나 반복을 마쳐요');
      R.at(6); R.p('약수 개수:',t);
      R.at(7,`<b>return</b> · 지역 tot의 값 ${t}을(를) 돌려줘요`);
      R.at(ln,`${ln}행으로 돌아와 전역 tot += ${t} → ${G+t} · 지역 변수는 사라졌어요`); R.ret(); G+=t; R.g('tot',G);
    }
    R.at(12); R.p('약수 누적 개수:',G);
  }
});

/* 04 분식집 메뉴 주문 */
(function(){
  const MENU={'떡볶이':5000,'라면':3000,'순대':4000,'콜라':1500};
  const B=$('shopLab');
  B.innerHTML=`<div class="fn-shop"><div><pre class="tr-out fn-sout" id="shOut"></pre><div class="fn-ans"><input id="shIn" autocomplete="off" spellcheck="false" placeholder="입력"><button class="btn sm" id="shGo">입력</button><button class="btn sm ghost" id="shNew">↺ 처음부터</button></div><div class="row" id="shQuick" style="margin-top:6px"></div></div>
    <div><b class="fn-cap">지금 실행 중</b><div class="fn-funcs" id="shFn">${[['main','메인 반복 · 선택 화면'],['show_menu','show_menu() · 메뉴판 보기'],['order','order() · 주문하기'],['pay','pay() · 결제하기']].map(([k,t])=>`<div data-f="${k}">${t}</div>`).join('')}</div>
    <b class="fn-cap">전역 변수</b><div class="tr-vars"><table id="shVar"></table></div><p class="muted" style="font-size:.85rem;margin:6px 0 0" id="shMsg"></p></div></div>`;
  let out, mode, total, ordered, over;
  const MAINP='1. 메뉴판 보기\n2. 주문하기\n3. 결제하기\n4. 이용 종료\n\n무엇을 하시겠습니까?\n', ORDP='메뉴를 선택해 주세요.(주문 끝(n))';
  function fn(k){B.querySelectorAll('[data-f]').forEach(d=>d.classList.toggle('on',d.dataset.f===k));}
  function quick(){const q=over?[]:mode==='main'?['1','2','3','4']:mode==='order'?[...Object.keys(MENU),'김밥','n']:[];
    $('shQuick').innerHTML=q.map(x=>`<button class="btn sm ghost" data-q="${esc(x)}">${esc(x)}</button>`).join(''); $('shQuick').querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{$('shIn').value=b.dataset.q; step();});}
  function show(){$('shOut').innerHTML=out+(over?'':esc(mode==='main'?MAINP:ORDP)); $('shOut').scrollTop=1e6;
    $('shVar').innerHTML=`<tr><th>total</th><td>${total}</td></tr><tr><th>menu_pan</th><td style="font-size:.8rem">{'떡볶이': 5000, '라면': 3000, '순대': 4000, '콜라': 1500}</td></tr>`;
    $('shGo').disabled=over; $('shIn').disabled=over; quick();}
  function start(){out=''; mode='main'; total=0; ordered=[]; over=false; fn('main'); $('shMsg').innerHTML='번호를 입력하거나 아래 버튼을 눌러요.'; show();}
  function step(){if(over) return; const t=$('shIn').value; $('shIn').value='';
    if(mode==='main'){out+=esc(MAINP)+`<b class="u">${esc(t)}</b>\n`;
      if(!/^\s*[-+]?\d+\s*$/.test(t)){out+=`<span class="er">ValueError: invalid literal for int() with base 10: '${esc(t)}'</span>\n`; over=true; fn(''); $('shMsg').innerHTML='<span class="ng">번호가 아닌 값을 넣어 int()에서 오류가 나 프로그램이 멈췄어요.</span>'; show(); return;}
      const a=parseInt(t,10);
      if(a===1){fn('show_menu'); out+='====<메뉴판>====\n'+Object.entries(MENU).map(([m,p])=>`${m}: ${p}\n\n`).join(''); $('shMsg').innerHTML='<code>show_menu()</code>를 호출해 딕셔너리의 메뉴와 가격을 출력하고 돌아왔어요.'; setTimeout(()=>{if(!over&&mode==='main') fn('main');},900);}
      else if(a===2){mode='order'; fn('order'); $('shMsg').innerHTML='<code>order()</code> 안의 <b>while True</b>가 돌고 있어요. 메뉴 이름을 넣거나, 끝내려면 n을 넣어요.';}
      else if(a===3){fn('pay'); out+=`주문하신 금액은 총 ${total}입니다.\n\n`; MEMO.shopLog=`주문: ${ordered.join(', ')||'없음'} · 결제 금액 ${total}원`; fnSave(); $('shMsg').innerHTML=`<code>pay()</code>가 전역 변수 total(${total})을 불러와 출력했어요.`; setTimeout(()=>{if(!over&&mode==='main') fn('main');},900);}
      else if(a===4){out+='이용해 주셔서 감사합니다.\n'; over=true; fn(''); $('shMsg').innerHTML='<b>break</b>로 무한 루프를 끝내고 프로그램이 끝났어요.';}
      else {fn('main'); $('shMsg').innerHTML=`${a}에 해당하는 조건이 없어 아무 일 없이 다시 선택 화면이 나와요.`;}
    } else {out+=esc(ORDP)+`<b class="u">${esc(t)}</b>\n`;
      if(t==='n'){mode='main'; fn('main'); $('shMsg').innerHTML='n을 입력해 order() 안의 반복을 <b>break</b>로 끝내고 선택 화면으로 돌아왔어요.';}
      else if(Object.hasOwn(MENU,t)){out+=`${t} 주문하셔서 ${MENU[t]}원 추가됩니다.\n`; total+=MENU[t]; ordered.push(t); $('shMsg').innerHTML=`<code>global total</code> 덕분에 함수 안에서 전역 변수 total을 ${total}(으)로 바꿨어요.`;}
      else {out+=`<span class="er">KeyError: '${esc(t)}'</span>\n`; over=true; fn(''); $('shMsg').innerHTML=`<span class="ng">메뉴판 딕셔너리에 「${esc(t)}」(이)라는 키가 없어 <code>menu_pan[menu]</code>에서 오류가 나 프로그램이 멈췄어요.</span> 코랩 「더 해 보기」에서 고쳐 봐요.`;}
    }
    show(); if(!over) $('shIn').focus();}
  $('shGo').onclick=step; $('shIn').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault(); step();}}); $('shNew').onclick=start;
  start();
})();

/* 04 개념 정리하기 빈칸 */
document.querySelectorAll('.blank').forEach(b=>b.onclick=()=>{const on=!b.classList.contains('on'); b.textContent=on?b.dataset.a:'?'; b.classList.toggle('on',on);});

/* 성취도 평가 */
chips('ck1','ck1',['map() 함수와 split() 메소드를 적절하게 사용할 수 있다'],true);
chips('ck2','ck2',['함수와 중첩 제어 구조를 사용하여 프로그램을 작성할 수 있다'],true);

/* 05 마무리 */
const MEMOLIST=[['planFunc','처음 생각 · 같은 기능을 여러 번 쓰려면'],['mulTry','곱셈 문제 무한 루프 기록'],['loopWhy','무한 루프가 끝나는 까닭'],['bombLog','폭탄 맵 체험 기록'],['bombWhy','범위를 벗어난 좌표를 처리한 흐름'],['ck1','성취도 · map()과 split()'],['sameName','이름이 같은 지역 변수와 전역 변수'],['shopLog','분식집 주문 기록'],['shopFunc','함수로 나눈 좋은 점과 global'],['ck2','성취도 · 함수와 중첩 제어 구조'],['keyQ','핵심 질문에 대한 내 답'],['unitQ','제어 구조의 응용을 마치며'],['newLearn','새롭게 알게 된 점']];
onShow[5]=()=>{const p=(MEMO.planFunc||'').trim(); $('prevPlan').innerHTML=`<b>처음 생각</b> ${p?esc(p):'<span class="muted">(시작 화면에 아직 안 씀)</span>'}`; memoSummary('msum',MEMOLIST);};
