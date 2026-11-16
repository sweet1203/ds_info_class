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
function d1Save(){store.set(MK,MEMO);}
pyBoxes(); blanks();

/* 성취도 평가 */
chips('ckData','ckData',['리스트를 활용해 1차원 데이터를 표현하고 출력할 수 있다','딕셔너리를 활용해 1차원 데이터를 표현하고 출력할 수 있다'],true);

/* 01 변수 여러 개 vs 리스트 하나 */
(function(){
  const B=$('manyLab'), V=[95,85,100,95,90,105,90,100,85,95,110,90,95,100,85,105,95,90,100,95,85,90,105,100,95,90,85,100,95,110];
  B.innerHTML=`<div class="row d1-sl"><label for="manyN">학생 수</label><input type="range" min="3" max="30" value="5" id="manyN"><b id="manyV">5</b>명</div>
    <div class="grid2 even"><div><div class="py-hd">방법 ① 변수를 하나씩 만들기 · <span id="manyA"></span></div><pre class="py-code d1-many" id="manyL"></pre></div>
    <div><div class="py-hd">방법 ② 리스트 하나에 모으기 · <span id="manyB"></span></div><pre class="py-code d1-many d1-wrap" id="manyR"></pre></div></div>
    <div class="callout" id="manyNew" style="margin-bottom:0"></div>`;
  function draw(){const n=+$('manyN').value, v=V.slice(0,n); $('manyV').textContent=n;
    $('manyL').innerHTML=pyLines(v.map((x,i)=>`학생${i+1} = ${x}`));
    $('manyR').innerHTML=pyLines([`T_size = [${v.join(', ')}]`]);
    $('manyA').textContent=`변수 ${n}개 · ${n}줄`; $('manyB').textContent='변수 1개 · 1줄';
    $('manyNew').innerHTML=`<b>새 친구가 전학 오면?</b> 방법 ①은 <span class="mono">학생${n+1} = 95</span>처럼 변수를 또 만들어야 하고, 방법 ②는 같은 리스트에 값을 하나 더 넣으면 돼요(넣는 방법은 02에서 배워요).`;}
  $('manyN').oninput=draw; draw();
})();

/* 01 몇 차원 데이터일까? */
sorter('dimGame',{
  cats:[{n:'1차원',k:'#2f6fd0'},{n:'2차원',k:'#e0702b'},{n:'3차원',k:'#9b4fc4'}],
  items:[
    {t:'하루 동안 1시간마다 잰 교실 온도 24개',c:0,ic:'🌡️',w:'값 24개가 한 줄로 모였어요.'},
    {t:'우리 반 학생들의 국어·수학·영어 점수를 정리한 표',c:1,ic:'📋',w:'학생마다 점수 한 줄(1차원)이 있고, 그 줄이 여러 개 모여 표가 되었어요.'},
    {t:'1학년 1반부터 8반까지, 반마다 학생별 과목 점수 표가 한 장씩',c:2,ic:'🗂️',w:'2차원인 표가 여러 장 겹쳐 있어요.'},
    {t:'마라톤 선수 한 명의 1km 구간별 기록',c:0,ic:'🏃',w:'한 사람의 기록이 구간 순서대로 한 줄로 모였어요.'},
    {t:'요일마다 기온, 습도, 강수량을 적어 둔 일주일 날씨 표',c:1,ic:'🌦️',w:'요일별 한 줄이 7개 모여 표가 되었어요.'},
    {t:'세 학년 각각의 반별, 과목별 평균 점수 표',c:2,ic:'🏫',w:'학년마다 반×과목 표가 하나씩, 표가 세 장이에요.'}
  ],
  end:'<b>정리</b> 값이 한 줄 → 1차원, 줄이 여러 개 모인 표 → 2차원, 표가 여러 장 → 3차원.'
});

/* 02 줄넘기 기록 리스트 */
pyTrace('trList',{
  code:['jump = [52, 75, 61, 48]','print(jump[1])','jump[3] = 50','jump.append(66)','print(jump)','print(jump[4])'],
  steps:[
    {l:0,set:{jump:[52,75,61,48]}},
    {l:1,out:'75',ask:{o:['52','75','61'],a:1,w:'인덱스는 0부터 시작해요. jump[1]은 두 번째 값이에요.'}},
    {l:2,set:{jump:[52,75,61,50]},ask:{q:'3번 줄 jump[3] = 50 은 어느 값을 바꿀까요?',o:['세 번째 값 61','네 번째 값 48','맨 뒤에 50 추가'],a:1,w:'인덱스 3은 네 번째 칸이에요. 그 칸의 48이 50으로 바뀌어요.'}},
    {l:3,set:{jump:[52,75,61,50,66]},ask:{q:'4번 줄 jump.append(66) 을 실행하면?',o:['맨 앞에 66 추가','맨 뒤에 66 추가','50이 66으로 바뀜'],a:1,w:'append()는 리스트의 맨 뒤에 값을 하나 추가해요.'}},
    {l:4,out:'[52, 75, 61, 50, 66]'},
    {l:5,out:'66',ask:{o:['50','61','66'],a:2,w:'값이 5개가 되었으니 인덱스는 0~4예요. 마지막 값 66의 인덱스가 4(총 개수 5 - 1)예요.'}}
  ],
  onEnd:s=>{MEMO.trList=s; d1Save();}
});

/* 03 동아리 딕셔너리 */
pyTrace('trDict',{
  code:["club = {'지우': '밴드',","        '하린': '코딩',","        '도윤': '미술'}","print(club['하린'])","club['도윤'] = '사진'","club['서아'] = '밴드'",'print(club)'],
  steps:[
    {l:[0,2],set:{club:{'지우':'밴드','하린':'코딩','도윤':'미술'}}},
    {l:3,out:'코딩',ask:{o:['밴드','코딩','미술'],a:1,w:"키 '하린'에 저장된 값을 가져와요."}},
    {l:4,set:{club:{'지우':'밴드','하린':'코딩','도윤':'사진'}},ask:{q:"5번 줄 club['도윤'] = '사진' 을 실행하면?",o:['오류가 난다',"'도윤' 키가 하나 더 생긴다","도윤의 값이 '사진'으로 바뀐다"],a:2,w:'딕셔너리에 중복된 키는 쓸 수 없어요. 이미 있는 키로 저장하면 기존 키의 값이 수정돼요.'}},
    {l:5,set:{club:{'지우':'밴드','하린':'코딩','도윤':'사진','서아':'밴드'}},ask:{q:"6번 줄 club['서아'] = '밴드' 를 실행하면?",o:['오류가 난다','지우의 값이 바뀐다','새 키:값 쌍이 추가된다'],a:2,w:"'서아'는 없던 키라서 새 키:값 쌍이 저장돼요. 값('밴드')은 겹쳐도 괜찮아요."}},
    {l:6,out:"{'지우': '밴드', '하린': '코딩', '도윤': '사진', '서아': '밴드'}"}
  ],
  onEnd:s=>{MEMO.trDict=s; d1Save();}
});

/* 03 리스트가 알맞을까, 딕셔너리가 알맞을까? */
sorter('pickGame',{
  cats:[{n:'🔢 리스트',k:'#e0702b'},{n:'🔑 딕셔너리',k:'#9b4fc4'}],
  items:[
    {t:'점심시간 매점 앞에 줄 선 학생들을 선 차례대로 기록해요.',c:0,ic:'🧍',w:'몇 번째로 섰는지가 중요해요. 차례대로 저장하고 인덱스로 꺼내요.'},
    {t:'영어 단어마다 뜻을 붙여 나만의 단어장을 만들어요.',c:1,ic:'📖',w:'단어가 키, 뜻이 값이에요. 사전에서 단어를 찾듯이 키로 값을 찾아요.'},
    {t:'일주일 동안 날마다 걸은 걸음 수를 차곡차곡 쌓아 두고 싶어요.',c:0,ic:'👟',w:'날짜 순서대로 값이 쌓이고, 새 값은 맨 뒤에 추가하면 돼요.'},
    {t:'친구 이름을 넣으면 생일이 바로 나오면 좋겠어요.',c:1,ic:'🎂',w:'이름이 키, 생일이 값이에요.'},
    {t:'출석 번호 1번부터 30번까지 줄넘기 기록을 모아요.',c:0,ic:'🔢',w:'번호 순서대로 저장하면 n번 학생은 인덱스 n - 1로 꺼낼 수 있어요.'},
    {t:'국어, 수학, 영어… 과목별 이번 주 숙제를 정리해 두고 싶어요.',c:1,ic:'📚',w:'과목 이름이 키, 숙제가 값이에요.'}
  ],
  end:'<b>생각해 보기</b> 몇 번째인지(위치)가 중요하면 리스트, 이름표로 바로 찾고 싶으면 딕셔너리가 편해요.'
});

/* 05 마무리 */
const MEMOLIST=[['planData','처음 생각 · 25명의 치수를 저장하는 방법'],['whyMulti','변수 여러 개와 리스트 하나의 차이'],['trList','줄넘기 기록 리스트 예측'],['idxWhy','3번 친구 기록의 인덱스'],['trDict','동아리 딕셔너리 예측'],['pickWhy','리스트와 딕셔너리를 고른 까닭'],['shoeRes','신발 치수 리스트 실행 결과'],['pantsRes','하의 치수 딕셔너리 실행 결과'],['ckData','성취도 평가'],['keyQ','오늘의 질문에 대한 내 답'],['newLearn','새롭게 알게 된 점']];
onShow[5]=()=>{const p=(MEMO.planData||'').trim(); $('prevPlan').innerHTML=`<b>처음 생각</b> ${p?esc(p):'<span class="muted">(시작 화면에 아직 안 씀)</span>'}`; memoSummary('msum',MEMOLIST);};
