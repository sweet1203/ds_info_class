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
function vrSave(){store.set(MK,MEMO);}
pyBoxes(); blanks();

/* 0 시작 · 프로그래밍을 배워야 하는 이유 */
vote('whyVote','whyProg',[['사고하는 방법을 배울 수 있어서','스티브 잡스'],['주변 사람들과 함께 재미있게 할 무언가를 만들 수 있어서','마크 저커버그'],['기본적인 이해력으로 비판적 사고력을 기를 수 있어서','빌 게이츠']]);

/* 성취도 평가 */
chips('ckVar','ckVar',['변수와 연산자를 사용하여 프로그램을 작성할 수 있다','자료형을 적합하게 활용하여 프로그램을 작성할 수 있다'],true);

/* 01 변수 상자 따라가기 */
pyTrace('trCoin',{
  code:['coin = 500','snack = 300','coin = coin + 100','coin = coin - snack','snack = 0','print(coin, snack)'],
  steps:[
    {l:0,set:{coin:500}},
    {l:1,set:{snack:300}},
    {l:2,set:{coin:600},ask:{q:'3번 줄을 실행하면 coin에는 어떤 값이 저장될까요?',o:['100','500','600'],a:2,w:'우변 coin + 100을 먼저 계산(500 + 100)한 뒤, 그 값을 좌변 coin에 다시 저장해요.'}},
    {l:3,set:{coin:300},ask:{q:'4번 줄을 실행하면 coin은?',o:['0','300','600'],a:1,w:'지금 coin(600)에서 snack(300)을 뺀 300이 coin에 저장돼요.'}},
    {l:4,set:{snack:0}},
    {l:5,out:'300 0',ask:{o:['300 0','300 300','600 0'],a:0,w:'snack을 0으로 바꿔도 coin은 그대로예요. coin에는 계산식이 아니라 계산이 끝난 값 300이 저장되어 있으니까요. print()에 콤마로 여러 값을 주면 띄어 쓴 채로 출력돼요.'}}
  ],
  end:'아래 메모에 = 기호가 하는 일을 정리해요.',
  onEnd:s=>{MEMO.trCoin=s; vrSave();}
});

/* 01 변수 이름 분류 */
sorter('nameGame',{
  cats:[{n:'⭕ 쓸 수 있어요',k:'#1f9d74'},{n:'❌ 쓸 수 없어요',k:'#d64535'}],
  items:[
    {t:'<span class="mono">total_score</span>',short:'total_score',c:0,ic:'🏷️',w:'영문과 _(언더바)로만 이루어졌어요.'},
    {t:'<span class="mono">2반점수</span>',short:'2반점수',c:1,ic:'🏷️',w:'숫자로 시작할 수 없어요(규칙 ❷).'},
    {t:'<span class="mono">학생 수</span>',short:'학생 수',c:1,ic:'🏷️',w:'이름 가운데에 공백이 있어요(규칙 ❸).'},
    {t:'<span class="mono">for</span>',short:'for',c:1,ic:'🏷️',w:'for는 파이썬에서 미리 정의된 예약어예요(규칙 ❺).'},
    {t:'<span class="mono">점수1</span>',short:'점수1',c:0,ic:'🏷️',w:'한글과 숫자로 이루어졌고, 숫자로 시작하지 않아요.'},
    {t:'<span class="mono">best-time</span>',short:'best-time',c:1,ic:'🏷️',w:'-는 특수 문자예요. 한글, 영문, 숫자, _만 쓸 수 있어요(규칙 ❸ ❹).'},
    {t:'<span class="mono">Score</span>',short:'Score',c:0,ic:'🏷️',w:'쓸 수 있어요. 대소문자를 구별하므로 Score와 score는 서로 다른 변수예요(규칙 ❶).'}
  ],
  end:'<b>생각해 보기</b> 쓸 수 없는 이름은 어떤 규칙에 걸렸나요? 숫자로 시작, 공백, 특수 문자, 예약어를 떠올려 봐요.'
});

/* 02 값을 보고 자료형 고르기 */
sorter('typeGame',{
  cats:[{n:'정수형(int)',k:'#2f6fd0'},{n:'실수형(float)',k:'#1f9d74'},{n:'문자열형(str)',k:'#e0702b'},{n:'불형(bool)',k:'#9b4fc4'}],
  items:[
    {t:'<span class="vr-v">2026</span>',short:'2026',c:0,w:'소수점이 없는 정수예요.'},
    {t:'<span class="vr-v">3.0</span>',short:'3.0',c:1,w:'소수점 아래가 0이어도 소수점이 있으면 실수형이에요.'},
    {t:'<span class="vr-v">-0.5</span>',short:'-0.5',c:1,w:'음수여도 소수점이 있으면 실수형이에요.'},
    {t:'<span class="vr-v">\'3\'</span>',short:"'3'",c:2,w:'숫자처럼 보여도 따옴표로 감쌌으니 문자열형이에요.'},
    {t:'<span class="vr-v">"True"</span>',short:'"True"',c:2,w:'큰따옴표로 감쌌으니 글자 True예요. 문자열형이에요.'},
    {t:'<span class="vr-v">False</span>',short:'False',c:3,w:'따옴표 없이 첫 글자를 대문자로 쓴 False는 거짓을 나타내는 불형이에요.'},
    {t:'<span class="vr-v">-15</span>',short:'-15',c:0,w:'음수여도 소수점이 없으면 정수형이에요.'},
    {t:'<span class="vr-v">True</span>',short:'True',c:3,w:'따옴표 없는 True는 참을 나타내는 불형이에요.'}
  ],
  end:'<b>정리</b> 따옴표가 있으면 → 문자열형, 따옴표 없이 True/False → 불형, 소수점이 있으면 → 실수형, 없으면 → 정수형.'
});

/* 03 자료형이 바뀌는 순간 */
pyTrace('trType',{
  code:['a = 7','b = 2.5','c = a * b','print(c, type(c))',"a = '칠'",'print(a, type(a))'],
  steps:[
    {l:0,set:{a:7}},
    {l:1,set:{b:F(2.5)}},
    {l:2,set:{c:F(17.5)},ask:{q:'3번 줄을 실행하면 c의 자료형은 무엇이 될까요?',o:['int','str','float'],a:2,w:'7 × 2.5 = 17.5로 소수점이 있는 값이 c에 저장되니 실수형(float)이에요.'}},
    {l:3,out:"17.5 <class 'float'>"},
    {l:4,set:{a:'칠'},ask:{q:"5번 줄 a = '칠' 을 실행하면 a는 어떻게 될까요?",o:['오류가 난다','int 그대로다','str로 바뀐다'],a:2,w:'기존 값 7은 지워지고 새 값 \'칠\'이 저장돼요. 자료형도 새 값에 맞게 문자열형(str)으로 바뀌어요.'}},
    {l:5,out:"칠 <class 'str'>"}
  ],
  onEnd:s=>{MEMO.trType=s; vrSave();}
});

/* 03 숫자 20과 문자열 '20' */
pyTrace('trAdd',{
  code:['n = 20',"s = '20'",'print(n + n)','print(s + s)','print(n + s)'],
  steps:[
    {l:0,set:{n:20}},
    {l:1,set:{s:'20'}},
    {l:2,out:'40',ask:{o:['40','2020','오류'],a:0,w:'정수형끼리 더하면 수의 덧셈을 해요.'}},
    {l:3,out:'2020',ask:{o:['40','2020','오류'],a:1,w:'문자열형끼리 +로 연산하면 글자가 이어 붙어요.'}},
    {l:4,err:"TypeError: unsupported operand type(s) for +: 'int' and 'str'",ask:{o:['40','2020','오류'],a:2,w:'정수형과 문자열형은 +로 연산할 수 없어서 TypeError가 생겨요. 오류가 난 줄에서 프로그램이 멈춰요.'}}
  ],
  end:'시작 화면에 적은 처음 생각과 같았나요?',
  onEnd:s=>{MEMO.trAdd=s; vrSave();}
});

/* 05 마무리 */
const MEMOLIST=[['planVar','처음 생각 · 20과 \'20\'을 더하면'],['whyProg','가장 공감한 프로그래밍을 배우는 이유'],['trCoin','변수 상자 따라가기 예측'],['varWhy','= 기호가 하는 일'],['typeHard','헷갈렸던 값과 판단 기준'],['trType','자료형이 바뀌는 순간 예측'],['trAdd','20과 \'20\' 더하기 예측'],['addWhy','세 결과가 다른 까닭'],['selfPred','스스로 해결하기 예측'],['selfCheck','실행 결과와 예측 비교'],['stuType','학생 정보의 자료형과 까닭'],['areaWhy','(선택) area의 자료형과 까닭'],['sumWhy','sum1과 sum2가 다른 까닭'],['ckVar','성취도 평가'],['keyQ','오늘의 질문에 대한 내 답'],['newLearn','새롭게 알게 된 점']];
onShow[5]=()=>{const p=(MEMO.planVar||'').trim(); $('prevPlan').innerHTML=`<b>처음 생각</b> ${p?esc(p):'<span class="muted">(시작 화면에 아직 안 씀)</span>'}`; memoSummary('msum',MEMOLIST);};
