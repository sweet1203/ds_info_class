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
function ioSave(){store.set(MK,MEMO);}
pyBoxes(); blanks();

/* 성취도 평가 */
chips('ckIO','ckIO',['표준입출력과 파일입출력을 사용하여 프로그램을 작성할 수 있다'],true);

/* 01 입력·처리·출력 분류 */
sorter('ipoGame',{
  cats:[{n:'① 입력',k:'#2f6fd0'},{n:'② 처리',k:'#e0702b'},{n:'③ 출력',k:'#1f9d74'}],
  items:[
    {t:'출발역과 도착역, 날짜를 화면에서 눌러 고른다.',c:0,ic:'🚉',w:'사용자가 앱에 값을 넣어 주는 단계예요.'},
    {t:'고른 날짜에 남은 좌석이 있는 열차를 찾는다.',c:1,ic:'🔎',w:'받은 값으로 앱이 원하는 동작을 하는 단계예요.'},
    {t:'예매가 끝나면 승차권 번호와 좌석을 화면에 보여 준다.',c:2,ic:'🎫',w:'결과를 사용자에게 보여 주는 단계예요.'},
    {t:'키오스크에서 먹고 싶은 메뉴를 누르고 수량을 정한다.',c:0,ic:'🍔',w:'키오스크에 주문 내용을 넣는 단계예요.'},
    {t:'고른 메뉴의 가격과 수량을 곱해 모두 더한다.',c:1,ic:'🧮',w:'계산은 처리 단계예요.'},
    {t:'주문 번호를 종이에 인쇄해 준다.',c:2,ic:'🧾',w:'결과를 사용자에게 내보내는 단계예요(종이로 내보내는 출력).'}
  ],
  end:'<b>생각해 보기</b> 키보드·터치처럼 값을 받는 장치와, 모니터·프린터처럼 결과를 내보내는 장치를 떠올려 봐요.'
});

/* 02 직접 입력하고 실행하기 */
(function(){
  const B=$('ioRun');
  const CODE={int:["name = input('이름을 입력하세요: ')","age = input('나이를 입력하세요: ')","print(name, '님은 내년에', int(age) + 1, '살이 돼요.')"],
              raw:["name = input('이름을 입력하세요: ')","age = input('나이를 입력하세요: ')","print(name, '님은 내년에', age + 1, '살이 돼요.')"]};
  B.innerHTML=`<div class="py-tr"><div class="py-left"><div class="row io-ver"><button class="btn sm" data-v="int">int(age) + 1 로 계산</button><button class="btn sm ghost" data-v="raw">int() 빼고 age + 1</button></div><pre class="py-code py-live"></pre><div class="row py-ctl"><button class="btn sm io-go">▶ 실행</button><span class="py-cnt io-hint"></span></div><div class="io-log"></div></div>
    <div class="py-right"><div class="py-hd">변수</div><table class="py-vars"><thead><tr><th>이름</th><th>값</th><th>자료형</th></tr></thead><tbody></tbody></table><div class="py-hd">실행 화면</div><div class="py-con io-con"></div></div></div>`;
  const C=B.querySelector('.py-live'), V=B.querySelector('tbody'), O=B.querySelector('.io-con'), go1=B.querySelector('.io-go'), log=B.querySelector('.io-log');
  let ver='int', vars={}, res={int:'',raw:''}, busy=false;
  function show(cur){C.innerHTML=pyLines(CODE[ver]); [...C.children].forEach((l,i)=>l.classList.toggle('next',i===cur));
    const ks=Object.keys(vars); V.innerHTML=ks.length?ks.map(k=>`<tr class="chg"><td class="mono">${k}</td><td>${pyVal(vars[k])}</td><td class="mono">${pyType(vars[k])}</td></tr>`).join(''):'<tr><td colspan="3" class="muted">아직 저장된 변수가 없어요.</td></tr>';}
  function line(t,cls){const d=document.createElement('div'); if(cls) d.className=cls; d.textContent=t; O.appendChild(d); return d;}
  function ask(prompt,cb){const d=document.createElement('div'); d.className='io-inl'; d.innerHTML=`<span>${esc(prompt)}</span><input type="text" maxlength="12" autocomplete="off" spellcheck="false" aria-label="${esc(prompt)}">`; O.appendChild(d);
    const inp=d.querySelector('input'); inp.focus();
    inp.onkeydown=e=>{if(e.key!=='Enter'||e.isComposing||e.keyCode===229) return; e.preventDefault(); const v=inp.value; d.textContent=prompt+v; cb(v);};}
  function recLog(){log.innerHTML=(res.int||res.raw)?`<div class="py-end">${res.int?`<b>int(age) + 1</b> → ${esc(res.int)}<br>`:''}${res.raw?`<b>age + 1</b> → ${esc(res.raw)}`:''}</div>`:'';
    MEMO.ioRes=[res.int&&('int() 사용: '+res.int),res.raw&&('int() 없이: '+res.raw)].filter(Boolean).join(' / '); ioSave();}
  const verBtns=[...B.querySelectorAll('[data-v]')], hint=B.querySelector('.io-hint');
  function lockVer(on){verBtns.forEach(b=>b.disabled=on); hint.textContent=on?'실행 화면에 값을 입력하고 Enter를 눌러요(입력이 끝나야 코드를 바꿀 수 있어요)':'age의 자료형을 보세요';}
  function run(){if(busy) return; busy=true; lockVer(true); vars={}; O.innerHTML=''; go1.disabled=true; show(0);
    ask('이름을 입력하세요: ',nm=>{vars.name=nm; show(1);
      ask('나이를 입력하세요: ',ag=>{vars.age=ag; show(2);
        let out;
        if(ver==='raw'){out="TypeError: can only concatenate str (not \"int\") to str"; line(out,'err');}
        else if(/^\s*[+-]?\d+\s*$/.test(ag)){out=`${nm} 님은 내년에 ${parseInt(ag.trim(),10)+1} 살이 돼요.`; line(out);}
        else {out=`ValueError: invalid literal for int() with base 10: '${ag}'`; line(out,'err'); line('→ 숫자가 아닌 글자는 정수로 바꿀 수 없어요. 숫자만 입력해 다시 실행해 봐요.','muted');}
        res[ver]=out; recLog(); show(-1); busy=false; lockVer(false); go1.disabled=false; go1.textContent='▶ 다시 실행';});});}
  B.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{if(busy) return; ver=b.dataset.v; B.querySelectorAll('[data-v]').forEach(x=>x.classList.toggle('ghost',x!==b)); vars={}; O.innerHTML=''; go1.textContent='▶ 실행'; show(-1);});
  go1.onclick=run; show(-1);
  B.querySelector('.io-hint').textContent='age의 자료형을 보세요';
})();

/* 03 파일 모드 실험실 */
(function(){
  const B=$('fileLab');
  const SN={
    w:{n:"쓰기 'w'",txt:true,code:t=>["f = open('todo.txt', 'w')",`f.write('${t}\\n')`,'f.close()']},
    a:{n:"추가 'a'",txt:true,code:t=>["f = open('todo.txt', 'a')",`f.write('${t}\\n')`,'f.close()']},
    r:{n:"읽기 'r' · read()",code:()=>["f = open('todo.txt', 'r')",'a = f.read()','print(a)','f.close()']},
    rl:{n:"읽기 'r' · readlines()",code:()=>["f = open('todo.txt', 'r')",'lines = f.readlines()','print(lines)','f.close()']},
    x:{n:"없는 파일 읽기",code:()=>["f = open('memo.txt', 'r')",'a = f.read()','print(a)','f.close()']}
  };
  const TXT={w:'수학 숙제',a:'정보 노트북 실습'};
  B.innerHTML=`<div class="py-tr"><div class="py-left"><div class="row io-sn">${Object.entries(SN).map(([k,s])=>`<button class="btn sm ghost" data-k="${k}">${s.n}</button>`).join('')}</div>
    <div class="io-txt"><label>쓸 내용 <input type="text" maxlength="20" autocomplete="off" spellcheck="false"></label></div>
    <pre class="py-code py-live"></pre><div class="row py-ctl"><button class="btn sm io-run">▶ 이 코드 실행</button><button class="btn ghost sm io-clr">🗑 폴더 비우기</button></div>
    <div class="io-mis"><div data-m="1"><b>미션 ①</b> todo.txt에 두 줄 이상 저장하기 <span></span></div><div data-m="2"><b>미션 ②</b> 내용이 있는 todo.txt를 'w'로 다시 열어 쓰고 바뀐 점 보기 <span></span></div><div data-m="3"><b>미션 ③</b> 없는 파일을 'r'로 열어 보기 <span></span></div></div></div>
    <div class="py-right"><div class="py-hd">📁 폴더</div><div class="io-folder"></div><div class="py-hd">실행 결과</div><div class="py-con io-con2"></div></div></div>`;
  const C=B.querySelector('.py-live'), inp=B.querySelector('.io-txt input'), txtBox=B.querySelector('.io-txt'), FD=B.querySelector('.io-folder'), O=B.querySelector('.io-con2');
  let k='w', files={}; const done=new Set(), best=new Set((MEMO.fileMis||'').match(/[①②③]/g)||[]);
  const clean=s=>s.replace(/['"\\]/g,'').trim();
  function code(){return SN[k].code(clean(inp.value)||'…');}
  function draw(){C.innerHTML=pyLines(code()); txtBox.style.display=SN[k].txt?'':'none';
    B.querySelectorAll('[data-k]').forEach(b=>b.classList.toggle('ghost',b.dataset.k!==k));
    const fs=Object.keys(files);
    FD.innerHTML=fs.length?fs.map(n=>{const ls=files[n].split('\n'); if(ls[ls.length-1]==='') ls.pop(); return `<div class="io-file"><b>📄 ${esc(n)}</b>${ls.length?`<ol>${ls.map(l=>`<li>${esc(l)}<i>↵</i></li>`).join('')}</ol>`:'<p class="muted">(빈 파일)</p>'}</div>`;}).join(''):'<p class="muted" style="margin:4px 0">파일이 없어요.</p>';
    ['①','②','③'].forEach((m,i)=>{const d=B.querySelector(`[data-m="${i+1}"]`); d.classList.toggle('done',done.has(m)); d.querySelector('span').innerHTML=done.has(m)?'<span class="ok">✔</span>':best.has(m)?'<span class="muted" style="font-size:.8rem">(이전에 해 봄)</span>':'';});}
  function hit(m){done.add(m); if(!best.has(m)){best.add(m); MEMO.fileMis=['①','②','③'].filter(x=>best.has(x)).join('')+' 완료'; ioSave();}}
  function out(t,cls){const d=document.createElement('div'); if(cls) d.className=cls; d.textContent=t; O.appendChild(d); O.scrollTop=O.scrollHeight;}
  function run(){const t=clean(inp.value); if(SN[k].txt&&!t){alert('쓸 내용을 입력해 주세요.');return;}
    out(`── ${SN[k].n} 실행`,'io-sep');
    if(k==='w'){if(files['todo.txt']) hit('②'); files['todo.txt']=t+'\n'; out('(화면에 출력하는 코드는 없어요. 폴더를 보세요.)','muted');}
    else if(k==='a'){files['todo.txt']=(files['todo.txt']||'')+t+'\n'; out('(화면에 출력하는 코드는 없어요. 폴더를 보세요.)','muted');}
    else if(k==='x'){out("FileNotFoundError: [Errno 2] No such file or directory: 'memo.txt'",'err'); hit('③');}
    else if(!files['todo.txt']){out("FileNotFoundError: [Errno 2] No such file or directory: 'todo.txt'",'err'); hit('③');}
    else if(k==='r'){out(files['todo.txt']);}
    else {const ls=files['todo.txt'].split('\n'); ls.pop(); out(pyRepr(ls.map(l=>l+'\n')));}
    const n=(files['todo.txt']||'').split('\n').length-1; if(n>=2) hit('①');
    draw();}
  B.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{k=b.dataset.k; if(SN[k].txt) inp.value=TXT[k]; draw();});
  inp.oninput=()=>{if(SN[k].txt) TXT[k]=inp.value; draw();}; B.querySelector('.io-run').onclick=run;
  B.querySelector('.io-clr').onclick=()=>{files={}; done.clear(); O.innerHTML=''; draw();};
  inp.value=TXT.w; draw();
})();

/* 05 마무리 */
const MEMOLIST=[['planIO','처음 생각 · 키오스크 앱의 순서'],['myApp','내가 쓰는 앱의 입력·처리·출력'],['ioRes','내년에는 몇 살? 실행 결과'],['intWhy','int()를 빼면 오류가 나는 까닭'],['fileMis','파일 모드 실험실 미션'],['modeWhy',"'w'와 'a'의 차이"],['sqRes','정사각형의 넓이 실행 결과'],['reviewRes','한 줄 평 파일에 저장된 내용'],['ckIO','성취도 평가'],['keyQ','오늘의 질문에 대한 내 답'],['newLearn','새롭게 알게 된 점']];
onShow[5]=()=>{const p=(MEMO.planIO||'').trim(); $('prevPlan').innerHTML=`<b>처음 생각</b> ${p?esc(p):'<span class="muted">(시작 화면에 아직 안 씀)</span>'}`; memoSummary('msum',MEMOLIST);};
