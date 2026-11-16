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
const pyMod=(a,b)=>((a%b)+b)%b;
const TF=c=>c?'<b class="ok">True(참)</b>':'<b class="ng">False(거짓)</b>';
const CODE={
  ifForm:['if 조건:','  명령1','  명령2','명령3'],
  elseForm:['if 조건:','  명령1','else:','  명령2'],
  elifForm:['if 조건1:','  명령1','elif 조건2:','  명령2','elif 조건3:','  명령3','else:','  명령4'],
};
codeBoxes(CODE);
function selSave(){store.set(MK,MEMO);}
const addRec=(old,item,n)=>{const a=(old||'').split(' / ').filter(Boolean); a.push(item); return a.slice(-(n||3)).join(' / ');};

/* 01 어떤 제어 구조일까? */
sorter('ctlGame',{
  cats:[{n:'⬇️ 순차 구조',k:'#2f6fd0'},{n:'🔀 선택 구조',k:'#1f9d74'},{n:'🔁 반복 구조',k:'#e0702b'}],
  items:[
    {t:'라면 봉지를 뜯고, 물을 끓이고, 면과 수프를 넣는다.',c:0,ic:'🍜',w:'정해진 일을 위에서 아래로 차례차례 해요.'},
    {t:'비가 오면 우산을 챙기고, 비가 오지 않으면 모자를 쓴다.',c:1,ic:'☔',w:'비가 오는지(조건)에 따라 할 일이 둘로 갈라져요.'},
    {t:'줄넘기 100개를 다 넘을 때까지 같은 동작을 계속한다.',c:2,ic:'🪢',w:'횟수를 채울 때까지 같은 동작을 되풀이해요.'},
    {t:'아침에 일어나 세수하고, 옷을 입고, 가방을 멘다.',c:0,ic:'🌅',w:'갈라지거나 되돌아가는 곳 없이 차례대로 진행돼요.'},
    {t:'놀이기구 앞에서 키가 120cm 이상인 사람만 줄을 서고, 나머지는 다른 기구로 간다.',c:1,ic:'🎢',w:'키가 기준 이상인지(조건)에 따라 하는 일이 달라져요.'},
    {t:'설거지할 그릇이 남아 있는 동안 그릇을 하나씩 씻는다.',c:2,ic:'🍽️',w:'그릇이 남아 있는(조건을 만족하는) 동안 같은 일을 되풀이해요.'},
  ],
  end:'<b>생각해 보기</b> 무엇을 보고 골랐나요? 「갈라지는 곳이 있는가」, 「다시 돌아가는 곳이 있는가」를 떠올리면 구분하기 쉬워요.'
});

/* 02 ① 버스 하차 안내 */
tracer('trBus',{
  code:["print('이번 정거장은 서울역입니다.')","bus = input('하차하시겠습니까?(y/n)')","if bus == 'y':","  print('문이 열립니다. 하차하세요.')","print('다음 정거장은 시청역입니다.')"],
  inputs:[{k:'bus',label:'입력값',v:'y',opts:['y','n']}], vars:['bus'], pick:true, pickMsg:'<b>먼저 예측해요.</b> 입력값을 정한 뒤 <b>실행될 줄</b>을 모두 눌러 표시하고 「예측 확인」을 눌러요. <span class="muted">조건을 확인하는 if 줄도 실행되는 줄로 세요.</span>',
  run(R,v){
    R.at(1); R.p('이번 정거장은 서울역입니다.');
    R.at(2,'입력받은 값을 변수 bus에 저장'); R.set('bus',R.inp('하차하시겠습니까?(y/n)',v.bus));
    const c=v.bus==='y'; R.at(3,`조건 <code>bus == 'y'</code> → ${TF(c)}`);
    if(c){R.at(4,'조건이 참이라 들여쓴 명령을 실행'); R.p('문이 열립니다. 하차하세요.');}
    R.at(5,c?'들여쓰기가 없어 if문 밖의 명령':'조건이 거짓이라 들여쓴 명령을 건너뛰고 들여쓰기 없는 명령부터 실행'); R.p('다음 정거장은 시청역입니다.');
  }
});

/* 02 ② 짝수·홀수 */
tracer('trEven',{
  code:["number = int(input('숫자를 입력하세요.'))","if number % 2 == 0:","  print(number,'는 짝수입니다.')","else:","  print(number,'는 홀수입니다.')"],
  inputs:[{k:'n',label:'입력할 숫자',v:'7',w:90}], vars:['number'], pick:true, pickMsg:'<b>먼저 예측해요.</b> 입력값을 정한 뒤 <b>실행될 줄</b>을 모두 눌러 표시하고 「예측 확인」을 눌러요. <span class="muted">조건을 확인하는 if·elif 줄도 실행되는 줄로 세요. else: 줄은 골라도 안 골라도 채점하지 않아요.</span>',
  run(R,v){
    R.at(1,'입력받은 문자열을 int()로 정수로 바꿔 저장'); const s=R.inp('숫자를 입력하세요.',v.n); const n=pyInt(s); R.set('number',n);
    const m=pyMod(n,2), c=m===0; R.at(2,`<code>${n} % 2</code>는 ${m} → <code>${m} == 0</code> → ${TF(c)}`);
    if(c){R.at(3); R.p(n,'는 짝수입니다.');}
    else{R.at(4,'if의 조건이 거짓이라 else로'); R.at(5); R.p(n,'는 홀수입니다.');}
  },
  onPick(v,r){MEMO.evenPick=addRec(MEMO.evenPick,`입력 ${v.n}: 실행된 줄 ${r.all}개 중 ${r.ok}개 맞힘${r.ng?`, 잘못 고른 줄 ${r.ng}개`:''}`); selSave();}
});

/* 03 ③ 양수·음수·0 */
tracer('trSign',{
  code:["number = int(input('숫자를 입력하세요: '))","if number > 0:","  print('양수', end = '')","elif number < 0:","  print('음수', end = '')","else:","  print('0', end = '')","print('입니다.')"],
  inputs:[{k:'n',label:'입력할 숫자',v:'55',w:90}], vars:['number'], pick:true, pickMsg:'<b>먼저 예측해요.</b> 입력값을 정한 뒤 <b>실행될 줄</b>을 모두 눌러 표시하고 「예측 확인」을 눌러요. <span class="muted">조건을 확인하는 if·elif 줄도 실행되는 줄로 세요. else: 줄은 골라도 안 골라도 채점하지 않아요.</span>',
  run(R,v){
    R.at(1); const n=pyInt(R.inp('숫자를 입력하세요: ',v.n)); R.set('number',n);
    const e='<code>end = \'\'</code>이라 출력 뒤에 줄을 바꾸지 않아요';
    R.at(2,`<code>${n} > 0</code> → ${TF(n>0)}`);
    if(n>0){R.at(3,e); R.p('양수',KW({end:''}));}
    else{R.at(4,`앞 조건이 거짓이라 elif 확인 · <code>${n} < 0</code> → ${TF(n<0)}`);
      if(n<0){R.at(5,e); R.p('음수',KW({end:''}));}
      else{R.at(6,'앞의 조건이 모두 거짓이라 else로'); R.at(7,e); R.p('0',KW({end:''}));}}
    R.at(8,'선택 구조가 끝나고 들여쓰기 없는 명령 실행 · 앞의 출력에 바로 이어져요'); R.p('입니다.');
  }
});

/* 03 스스로 해결하기 · 선택 구조 형식 */
(function(){
  const F=[
    {c:["if temp >= 30","  print('덥다')"],ok:0,w:'if 조건 뒤에 콜론(:)이 빠졌어요. <span class="mono">if temp >= 30:</span>처럼 써야 해요.'},
    {c:["if temp >= 30:","    print('덥다')","  print('물을 마셔요')"],ok:0,w:'if문에 실행될 명령들의 들여쓰기 위치가 서로 달라요. 두 명령을 같은 위치로 맞추거나, if문 밖의 명령이라면 들여쓰기를 지워야 해요.'},
    {c:["if temp >= 30:","  print('덥다')","else:","  print('덥지 않다')"],ok:1,w:'else 뒤에는 조건식 없이 콜론만 붙이고, 각 명령을 들여썼어요.'},
    {c:["if temp >= 30:","  print('덥다')","elif temp >= 20:","  print('따뜻하다')","elif temp >= 10:","  print('선선하다')","else:","  print('춥다')"],ok:1,w:'elif는 필요한 조건만큼 추가할 수 있고, 마지막에 조건 없는 else를 둘 수 있어요.'},
  ];
  const B=$('formLab'); let pick=new Set(), done=false;
  B.innerHTML=`<div class="sel-fl">${F.map((f,i)=>`<div class="sel-fc" data-i="${i}"><div class="sel-fh"><b>코드 ${'ⓐⓑⓒⓓ'[i]}</b><button class="btn sm ghost" data-t="${i}">✔ 문법에 맞음</button></div><div data-code="fm${i}"></div><div class="sel-fw"></div></div>`).join('')}</div>
    <div class="row" style="margin-top:10px"><button class="btn" id="formChk">확인</button><button class="btn ghost" id="formAgain">다시 하기</button><span id="formMsg"></span></div>`;
  const map={}; F.forEach((f,i)=>map['fm'+i]=f.c); codeBoxes(map);
  const cards=[...B.querySelectorAll('.sel-fc')];
  function draw(){cards.forEach((c,i)=>{const b=c.querySelector('[data-t]'); b.classList.toggle('ghost',!pick.has(i)); b.disabled=done;
    c.classList.remove('good','bad'); const w=c.querySelector('.sel-fw');
    if(done){const right=pick.has(i)===!!F[i].ok; c.classList.add(right?'good':'bad'); w.innerHTML=`${right?'<span class="ok">판단 맞음</span>':'<span class="ng">판단 다름</span>'} · <b>${F[i].ok?'문법에 맞아요.':'문법에 맞지 않아요.'}</b> ${F[i].w}`;} else w.innerHTML='';});
    $('formChk').disabled=done;}
  B.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{const i=+b.dataset.t; pick.has(i)?pick.delete(i):pick.add(i); draw();});
  $('formChk').onclick=()=>{done=true; draw(); const n=F.filter((f,i)=>pick.has(i)===!!f.ok).length;
    $('formMsg').innerHTML=n===F.length?`<span class="ok">${F.length}개 모두 바르게 판단했어요!</span>`:`${F.length}개 중 <b>${n}개</b>를 바르게 판단했어요. 판단이 다른 카드의 설명을 읽어 보세요.`;
    MEMO.formRes=`${F.length}개 중 ${n}개 바르게 판단 (문법에 맞다고 고른 것: ${[...pick].sort().map(i=>'ⓐⓑⓒⓓ'[i]).join(', ')||'없음'})`; selSave();};
  $('formAgain').onclick=()=>{done=false; pick.clear(); $('formMsg').innerHTML=''; draw();};
  draw();
})();

/* 04 실행 결과 예측하기 · 배송비 */
(function(){
  const C=[['y',30000],['n',55000],['n',40000],['n',50000]];
  const run=(m,t)=>{const o=[]; if(m==='y') o.push('정기 회원으로 배송비가 면제됩니다.'); else if(t>=50000) o.push('50000원 이상 주문으로 배송비가 면제됩니다.'); else {o.push('배송비 3000원이 부과됩니다.'); t+=3000;} o.push(`총금액은 ${t} 원입니다.`); return {o,t};};
  const B=$('shipLab');
  B.innerHTML=`<div style="overflow-x:auto"><table class="tbl2 sel-ship"><tr><th>정기 회원 입력</th><th>주문 금액 입력</th><th>예측한 총금액</th><th>확인</th></tr>${C.map(([m,t],i)=>`<tr><td class="mono">${m}</td><td class="mono">${t}</td><td><input type="text" inputmode="numeric" data-i="${i}" placeholder="숫자" autocomplete="off"> 원</td><td class="l sel-res" data-r="${i}"></td></tr>`).join('')}</table></div>
    <div class="row" style="margin-top:8px"><button class="btn" id="shipChk">예측 확인</button><button class="btn ghost" id="shipAgain">다시 하기</button><span id="shipMsg"></span></div>`;
  const ins=[...B.querySelectorAll('input')];
  $('shipChk').onclick=()=>{let ok=0, empty=0;
    C.forEach(([m,t],i)=>{const v=ins[i].value.replace(/[^\d]/g,''), r=run(m,t), cell=B.querySelector(`[data-r="${i}"]`);
      if(!v){empty++; cell.innerHTML='<span class="muted">먼저 예측해요</span>'; return;}
      const right=+v===r.t; if(right) ok++;
      cell.innerHTML=`${right?'<span class="ok">✔ 맞음</span>':'<span class="ng">✗ 다름</span>'}<div class="sel-o">${r.o.map(esc).join('<br>')}</div>`;});
    if(empty){$('shipMsg').innerHTML=`<span class="ng">빈 칸 ${empty}개를 먼저 채워요.</span>`; return;}
    $('shipMsg').innerHTML=ok===C.length?'<span class="ok">모두 맞았어요! 코랩에서 직접 확인해 봐요.</span>':`4개 중 <b>${ok}개</b>를 맞혔어요. 어떤 조건을 먼저 확인하는지 다시 생각해 봐요.`;
    MEMO.shipPred=`4개 중 ${ok}개 맞힘 · 내 예측: ${C.map(([m,t],i)=>`${m}/${t}→${ins[i].value.trim()}`).join(', ')}`; selSave();};
  $('shipAgain').onclick=()=>{ins.forEach(x=>x.value=''); B.querySelectorAll('.sel-res').forEach(c=>c.innerHTML=''); $('shipMsg').innerHTML='';};
})();

/* 성취도 평가 */
chips('ck1','ck1',['선택 구조 형식을 이해하고 표현할 수 있다'],true);
chips('ck2','ck2',['선택 구조 형식에 맞게 프로그램을 작성할 수 있다'],true);

/* 05 마무리 */
const MEMOLIST=[['planSel','처음 생각 · 상황에 따라 다른 일을 하게 하려면'],['evenPick','짝수·홀수 프로그램 예측 기록'],['evenWhy','입력값에 따라 실행되는 줄'],['formRes','선택 구조 형식 판단 결과'],['formFix','문법에 맞지 않은 코드와 고칠 점'],['ck1','성취도 · 선택 구조 형식'],['shipPred','배송비 총금액 예측 결과'],['ship50','50000원일 때의 예측과 까닭'],['shipFix','2번에서 추가한 조건과 위치'],['ck2','성취도 · 선택 구조 프로그램 작성'],['keyQ','핵심 질문에 대한 내 답'],['newLearn','새롭게 알게 된 점']];
onShow[5]=()=>{const p=(MEMO.planSel||'').trim(); $('prevPlan').innerHTML=`<b>처음 생각</b> ${p?esc(p):'<span class="muted">(시작 화면에 아직 안 씀)</span>'}`; memoSummary('msum',MEMOLIST);};
