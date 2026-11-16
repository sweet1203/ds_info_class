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
function lpSave(){store.set(MK,MEMO);}
codeBoxes({
  forForm:['for 변수 in 반복 범위:','  명령'],
  rangeEx:["for i in range(3):","  print('i의 값: ', i)"],
  whileForm:['while 조건:','  명령1','  명령2'],
  randomEx:['# 랜덤 모듈 불러오기','import random','# 0~1 사이의 실수','random.random()','# 1~100 사이의 정수','random.randint(1, 100)','# 0~9 중 3개의 숫자','random.sample(range(10), 3)'],
});

/* 01 헌혈 조건 (중첩 제어 구조) */
tracer('trBlood',{
  code:["age = int(input('나이를 입력하세요: '))","sex = input('성별을 입력하세요: ')","weight = int(input('몸무게를 입력하세요: '))","","if 16 <= age <= 69:","  if ('남' in sex) and (weight >= 50):","    print('이 남성분은 헌혈할 수 있습니다.')","  elif ('여' in sex ) and (weight >= 45):","    print('이 여성분은 헌혈할 수 있습니다.')","  else:","    print('헌혈할 수 없습니다.')","else:","  print('헌혈할 수 없습니다.')"],
  inputs:[{k:'age',label:'나이',v:'22',w:70},{k:'sex',label:'성별',v:'여',w:70},{k:'w',label:'몸무게',v:'44',w:70}],
  vars:['age','sex','weight'], pick:true, wide:true,
  pickMsg:'<b>먼저 예측해요.</b> 입력값을 정한 뒤 <b>실행될 줄</b>을 모두 눌러 표시하고 「예측 확인」을 눌러요. <span class="muted">조건을 확인하는 if·elif 줄도 실행되는 줄로 세요. else: 줄은 골라도 안 골라도 채점하지 않아요.</span>',
  run(R,v){
    R.at(1); const age=pyInt(R.inp('나이를 입력하세요: ',v.age)); R.set('age',age);
    R.at(2); const sex=R.inp('성별을 입력하세요: ',v.sex); R.set('sex',sex);
    R.at(3); const w=pyInt(R.inp('몸무게를 입력하세요: ',v.w)); R.set('weight',w);
    const c1=16<=age&&age<=69; R.at(5,`바깥쪽 if · <code>16 <= ${age} <= 69</code> → ${TF(c1)}`);
    if(c1){
      const m=sex.includes('남'), c2=m&&w>=50; R.at(6,`안쪽 if · <code>'남' in sex</code> → ${TF(m)}${m?`, <code>${w} >= 50</code> → ${TF(w>=50)}`:''} · and의 결과 ${TF(c2)}`);
      if(c2){R.at(7); R.p('이 남성분은 헌혈할 수 있습니다.');}
      else{const f=sex.includes('여'), c3=f&&w>=45; R.at(8,`안쪽 elif · <code>'여' in sex</code> → ${TF(f)}${f?`, <code>${w} >= 45</code> → ${TF(w>=45)}`:''} · and의 결과 ${TF(c3)}`);
        if(c3){R.at(9); R.p('이 여성분은 헌혈할 수 있습니다.');}
        else{R.at(10,'안쪽 조건이 모두 거짓이라 안쪽 else로'); R.at(11); R.p('헌혈할 수 없습니다.');}}
    } else {R.at(12,'바깥쪽 if의 조건이 거짓이라 안쪽은 모두 건너뛰고 바깥쪽 else로'); R.at(13); R.p('헌혈할 수 없습니다.');}
  }
});

/* 02 과일 for문 */
tracer('trFruit',{
  code:["for i in ['사과', '수박', '참외', '딸기']:","  print(i,'는 맛있다.')"], vars:['i'],
  run(R){
    for(const x of ['사과','수박','참외','딸기']){R.at(1,`반복 범위에서 다음 값 <code>'${x}'</code>를 꺼내 변수 i에 넣어요`); R.set('i',x); R.at(2,'for문에 속한(들여쓴) 명령 실행'); R.p(x,'는 맛있다.');}
    R.at(1,'더 꺼낼 값이 없어 반복을 끝내요');
  }
});

/* 02 스스로 해결하기 · 프로그램 실행 순서 */
const parseList=s=>{const t=String(s).replace(/^\s*\[|\]\s*$/g,'').split(',').map(x=>x.trim()).filter(x=>x!==''); if(t.length<2||t.length>6||!t.every(x=>/^[-+]?\d+$/.test(x))) return null; return t.map(x=>parseInt(x,10));};
tracer('trScore',{
  code:v=>{const a=parseList(v.s); return ["sum = 0",`score = [${a?a.join(', '):'?'}]`,"for i in score:","  sum += i","print('점수의 총합은', sum, '입니다.')","print('평균은', sum / len(score), '입니다.')"];},
  inputs:[{k:'s',label:'점수 리스트',v:'60, 85, 95',w:200}], inLabel:'', vars:['score','i','sum'], tvars:['i','sum'], table:true,
  run(R,v){
    const a=parseList(v.s); if(!a) throw new PyErr('점수 리스트에는 정수를 쉼표로 구분해 2~6개 넣어요. 예: 88, 70, 94');
    let sum=0; R.at(1); R.set('sum',0); R.at(2); R.set('score',a);
    for(const x of a){R.at(3,`score에서 다음 값 ${x}를 꺼내 i에 넣어요`); R.set('i',x); R.at(4,`<code>sum += i</code> → ${sum} + ${x} = ${sum+x}`); sum+=x; R.set('sum',sum);}
    R.at(3,'더 꺼낼 값이 없어 반복을 끝내요(i는 마지막 값 그대로)'); R.at(5); R.p('점수의 총합은',sum,'입니다.');
    R.at(6,`<code>len(score)</code>는 ${a.length} → ${sum} / ${a.length}`); R.p('평균은',{f:sum/a.length},'입니다.');
  }
});

/* 03 range() 탐험기 */
(function(){
  const M=[{t:[0,1,2,3,4],l:'0, 1, 2, 3, 4'},{t:[1,2,3,4,5,6,7,8,9],l:'1, 2, 3, …, 9'},{t:[10,8,6,4,2],l:'10, 8, 6, 4, 2'},{t:[3,6,9,12,15,18,21,24,27,30],l:'3, 6, 9, …, 30'}];
  const B=$('rangeLab');
  B.innerHTML=`<div class="lp-rin"><span class="mono">range(</span><input id="rgA" placeholder="시작" autocomplete="off"><span class="mono">,</span><input id="rgB" placeholder="끝" value="8" autocomplete="off"><span class="mono">,</span><input id="rgC" placeholder="간격" autocomplete="off"><span class="mono">)</span></div>
    <div class="lp-rcode" id="rgCode"></div><div class="lp-rnums" id="rgNums"></div>
    <div class="lp-mis" id="rgMis">${M.map((m,i)=>`<div data-m="${i}"><b>미션 ${'①②③④'[i]}</b> <span class="mono">${m.l}</span> <span class="r"></span></div>`).join('')}</div>`;
  const ia=$('rgA'), ib=$('rgB'), ic=$('rgC');
  let rec={}; (MEMO.rangeMis||'').split(' / ').forEach(x=>{const k='①②③④'.indexOf(x[0]); if(k>=0) rec[k]=x.slice(2);});
  function showMis(){B.querySelectorAll('[data-m]').forEach(d=>{const i=+d.dataset.m; d.classList.toggle('done',!!rec[i]); d.querySelector('.r').innerHTML=rec[i]?`<span class="ok">✔</span> <span class="mono">${esc(rec[i])}</span>`:'<span class="muted">아직</span>';});}
  function run(){
    const a=ia.value.trim(), b=ib.value.trim(), c=ic.value.trim(), isI=x=>/^[-+]?\d+$/.test(x);
    let code='', err='', nums=[];
    if(!b) err='끝 값은 생략할 수 없어요.';
    else if(c&&!a) err='간격을 쓰려면 시작 값도 써야 해요. 예: range(0, 10, 2)';
    else if(![a,b,c].every(x=>!x||isI(x))) err='정수만 넣을 수 있어요.';
    code=a||c?`range(${a||' '}, ${b}${c?', '+c:''})`:`range(${b})`;
    if(!err){const s=a?+a:0, e=+b, d=c?+c:1;
      if(d===0) err='ValueError: range() arg 3 must not be zero (간격은 0이 될 수 없어요)';
      else for(let x=s; d>0?x<e:x>e; x+=d){nums.push(x); if(nums.length>200) break;}}
    $('rgCode').innerHTML=`<span class="mono">${esc(code)}</span> ${err?'':`<span class="muted">→ ${nums.length>200?'200개가 넘어요':nums.length+'개'}</span>`}`;
    $('rgNums').innerHTML=err?`<span class="ng">${esc(err)}</span>`:nums.length?nums.slice(0,60).map(x=>`<span>${x}</span>`).join('')+(nums.length>60?'<i>…</i>':''):'<span class="muted">만들어지는 정수가 없어요. 시작·끝·간격의 방향을 확인해요.</span>';
    if(!err) M.forEach((m,i)=>{if(m.t.length===nums.length&&m.t.every((x,j)=>x===nums[j])&&rec[i]!==code){rec[i]=code; MEMO.rangeMis=M.map((_,k)=>rec[k]?`${'①②③④'[k]} ${rec[k]}`:'').filter(Boolean).join(' / '); lpSave();}});
    showMis();
  }
  [ia,ib,ic].forEach(x=>x.addEventListener('input',run)); run();
})();

/* 04 만세 while문 */
tracer('trWhile',{
  code:["print('대한민국')","i = 0","while i < 3:","    print('만세!')","    i += 1"], vars:['i'], table:true,
  run(R){
    R.at(1); R.p('대한민국'); R.at(2); R.set('i',0); let i=0;
    while(true){const c=i<3; R.at(3,`<code>${i} < 3</code> → ${TF(c)}${c?' · 반복 안으로':' · 반복을 끝내요'}`); if(!c) break;
      R.at(4); R.p('만세!'); R.at(5,`<code>i += 1</code> → ${i+1} · 이제 while 뒤의 조건으로 돌아가요`); i++; R.set('i',i);}
  }
});

/* 04 업다운 게임 */
(function(){
  const B=$('udLab');
  B.innerHTML=`<div class="lp-ud"><div><div class="lp-udin"><input id="udIn" inputmode="numeric" placeholder="1~100" autocomplete="off"><button class="btn sm" id="udGo">말하기</button><button class="btn sm ghost" id="udNew">새 게임</button></div><pre class="tr-out lp-udlog" id="udLog"></pre></div>
    <div class="lp-udr"><b>반복 조건 확인</b><div id="udCond" class="lp-cnd"></div><div class="tr-vars"><table id="udVar"></table></div></div></div>`;
  let ans, guess, count, log, checks, over, said;
  function newGame(){ans=1+Math.floor(Math.random()*100); guess=0; count=0; checks=0; over=false; said=[]; log='숫자를 맞혀 보세요!\n'; check(); draw();}
  function check(){checks++; const go=ans!==guess; $('udCond').innerHTML=`<div class="n">${checks}번째 확인</div>아직 정답을 맞히지 못했나요? → ${go?'<b class="ok">예 · True(참)</b><br><small>반복 안으로 들어가 다시 입력받아요</small>':'<b class="ng">아니요 · False(거짓)</b><br><small>반복을 끝내고 다음 줄로 가요</small>'}`; if(!go){over=true; log+=`정답입니다! ${count}번의 시도만에 정답을 맞혔습니다.\n`; MEMO.udTry=addRec(MEMO.udTry,`${count}번 만에 맞힘(말한 수 ${said.join(', ')})`); lpSave();}}
  function draw(){$('udLog').innerHTML=log; $('udLog').scrollTop=1e6; $('udVar').innerHTML=`<tr><th>answer</th><td>${over?ans:'<span class="muted">? (숨김)</span>'}</td></tr><tr><th>guess</th><td>${guess}</td></tr><tr><th>count</th><td>${count}</td></tr>`; $('udGo').disabled=over; $('udIn').disabled=over;}
  function say(){if(over) return; const t=$('udIn').value.trim(); if(!/^[-+]?\d+$/.test(t)){$('udIn').focus(); return;}
    guess=parseInt(t,10); count++; said.push(guess); log+=`숫자는 무엇일까요?: <b class="u">${guess}</b>\n`;
    if(guess>ans) log+='정답보다 크다.\n'; else if(guess<ans) log+='정답보다 작다.\n';
    $('udIn').value=''; check(); draw(); if(!over) $('udIn').focus();}
  $('udGo').onclick=say; $('udIn').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault(); say();}}); $('udNew').onclick=newGame;
  newGame();
})();

/* 05 break와 continue */
tracer('trBc',{
  code:v=>v.kw==='쓰지 않음'?["score = [10, 20, -10, 30, -40, 20]","for i in score:","  print(i)","print('반복문 종료')"]:["score = [10, 20, -10, 30, -40, 20]","for i in score:","  if i < 0:",`    ${v.kw}`,"  print(i)","print('반복문 종료')"],
  inputs:[{k:'kw',label:'프로그램',v:'break',opts:['break','continue','쓰지 않음']}], vars:['i'], wide:true,
  run(R,v){
    const sc=[10,20,-10,30,-40,20]; R.at(1); R.set('score',sc);
    if(v.kw==='쓰지 않음'){for(const x of sc){R.at(2,`i에 ${x}를 넣어요`); R.set('i',x); R.at(3); R.p(x);} R.at(2,'더 꺼낼 값이 없어 반복을 끝내요'); R.at(4); R.p('반복문 종료'); return;}
    for(const x of sc){R.at(2,`i에 ${x}를 넣어요`); R.set('i',x); const c=x<0; R.at(3,`<code>${x} < 0</code> → ${TF(c)}`);
      if(c){if(v.kw==='break'){R.at(4,'<b>break</b> · 반복문을 완전히 끝내고 반복문 다음 명령(6행)으로 이동해요'); R.at(6); R.p('반복문 종료'); return;}
        R.at(4,'<b>continue</b> · 현재 실행만 중단하고 다시 반복문(2행)으로 돌아가요'); continue;}
      R.at(5); R.p(x);}
    R.at(2,'더 꺼낼 값이 없어 반복을 끝내요'); R.at(6); R.p('반복문 종료');
  }
});

/* 성취도 평가 */
chips('ck1','ck1',['반복 구조의 형식과 실행 과정을 설명할 수 있다'],true);
chips('ck2','ck2',['range() 함수와 for문을 사용해서 프로그램을 작성할 수 있다'],true);
chips('ck3','ck3',['while문과 난수의 사용법을 알고 프로그램을 작성할 수 있다'],true);
chips('ck4','ck4',['while문과 break 또는 continue를 사용하여 프로그램을 작성할 수 있다'],true);

/* 06 마무리 */
const MEMOLIST=[['planLoop','처음 생각 · 같은 명령을 여러 번 실행하려면'],['traceWhy','for문 실행 횟수와 요소 개수'],['ck1','성취도 · 반복 구조의 형식과 실행 과정'],['rangeMis','range() 미션 기록'],['ck2','성취도 · range()와 for문'],['udTry','업다운 게임 기록'],['udWhy','반복이 계속된 때와 끝난 때'],['guguFix','구구단 프로그램의 반복 범위와 수정'],['ck3','성취도 · while문과 난수'],['bcPredict','break·continue 출력 예측'],['bcWhy','예측과 실제 출력 비교'],['ck4','성취도 · break와 continue'],['keyQ','핵심 질문에 대한 내 답'],['newLearn','새롭게 알게 된 점']];
onShow[6]=()=>{const p=(MEMO.planLoop||'').trim(); $('prevPlan').innerHTML=`<b>처음 생각</b> ${p?esc(p):'<span class="muted">(시작 화면에 아직 안 씀)</span>'}`; memoSummary('msum',MEMOLIST);};
