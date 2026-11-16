/* 공통 */
function efSave(){store.set(MK,MEMO);}

/* 0 시작 · 예상 */
vote('predVote','predSum',[['거의 같아요',''],['2~3배쯤 차이 나요',''],['30배 넘게 차이 나요','']]);

/* 성취도 평가 */
chips('ck1','ck1',['문제 분해와 모델링을 활용하여 문제를 해결하면서 수행 시간을 비교할 수 있다'],true);

/* 01 알고리즘 2의 짝짓기 */
(function(){
  const draw=()=>{const n=+$('pairN').value; $('pairNV').textContent=n; const a=[...Array(n)].map((_,i)=>i+1), b=a.slice().reverse();
    $('pairBox').innerHTML=`<div class="ef-pair" style="--n:${n}"><div class="r">${a.map(x=>`<span>${x}</span>`).join('')}</div><div class="r rev">${b.map(x=>`<span>${x}</span>`).join('')}</div><div class="r sum">${a.map(()=>`<span>${n+1}</span>`).join('')}</div></div>
      <p class="ef-pairtxt">(${n} + 1)이 ${n}개 → ${n} × ${n+1} = <b>${n*(n+1)}</b> → 같은 수를 두 번 더했으니 ÷ 2 → <b>${n*(n+1)/2}</b> <span class="muted">= 1 + 2 + … + ${n}</span></p>`;};
  $('pairN').oninput=draw; draw();
})();

/* 01 두 알고리즘 연산 횟수 비교 */
const EFR=MK+'-race';
function efRecs(){const r=store.get(EFR,[]); return Array.isArray(r)?r:[];}
(function(){
  const B=$('raceLab');
  B.innerHTML=`<div class="row" style="margin-bottom:10px"><label for="raceN"><b>끝 수 n</b></label><input type="number" id="raceN" min="1" max="1000" value="20" style="width:110px"><button class="btn sm" id="raceGo">▶ 실행</button><span class="muted" style="font-size:.85rem">1부터 1000까지</span><button class="btn sm ghost" id="raceClr" style="margin-left:auto">기록 지우기</button></div>
    <div class="ef-race">
      <div class="lane" style="--k:#1f9d74"><h4>알고리즘 1 · 하나씩 더하기</h4><div class="vars"><span>지금 더한 숫자 = <b id="r1n">–</b></span><span>s = <b id="r1s">–</b></span></div><div class="bar"><i id="r1bar"></i></div><div class="ops">연산 횟수 <b id="r1ops">0</b>번</div></div>
      <div class="lane" style="--k:#d64535"><h4>알고리즘 2 · 짝지어 계산하기</h4><div class="vars"><span id="r2f">s = n × (n + 1) / 2</span><span>s = <b id="r2s">–</b></span></div><div class="bar"><i id="r2bar"></i></div><div class="ops">연산 횟수 <b id="r2ops">0</b>번</div></div>
    </div>
    <div id="raceMsg" class="ef-msg"></div>
    <div style="overflow-x:auto"><table class="ef-tbl" id="raceTbl"></table></div>`;
  let busy=false;
  function table(){const R=efRecs();
    $('raceTbl').innerHTML=`<tr><th>n</th><th>1부터 n까지의 합</th><th>알고리즘 1 연산 횟수</th><th>알고리즘 2 연산 횟수</th></tr>`+(R.length?R.map(r=>`<tr><td>${fmt(r.n)}</td><td>${fmt(r.n*(r.n+1)/2)}</td><td>${fmt(r.n)}</td><td>3</td></tr>`).join(''):'<tr><td colspan="4" class="muted">실행하면 여기에 기록돼요.</td></tr>');}
  function record(n){let R=efRecs().filter(r=>r.n!==n); R.push({n}); R.sort((a,b)=>a.n-b.n); R=R.slice(-6); store.set(EFR,R);
    MEMO.raceRec=R.map(r=>`n=${r.n}: 알고리즘 1 ${r.n}번, 알고리즘 2 3번`).join(' / '); efSave(); table();}
  $('raceGo').onclick=()=>{
    if(busy) return; const n=Math.max(1,Math.min(1000,Math.floor(+$('raceN').value||1))); $('raceN').value=n; busy=true;
    $('r2ops').textContent='0'; $('r2s').textContent='–'; $('r2bar').style.width='0';
    // 알고리즘 2: 곱셈·덧셈·나눗셈 3번
    setTimeout(()=>{$('r2f').innerHTML=`s = ${n} × (${n} + 1) / 2`; $('r2ops').textContent='3'; $('r2s').textContent=fmt(n*(n+1)/2); $('r2bar').style.width=Math.max(3/n*100,2)+'%';},250);
    let i=0, s=0; const per=Math.max(1,Math.ceil(n/90));
    (function tick(){ for(let k=0;k<per&&i<n;k++){i++; s+=i;} $('r1n').textContent=i; $('r1s').textContent=fmt(s); $('r1ops').textContent=fmt(i); $('r1bar').style.width=(i/n*100)+'%';
      if(i<n) setTimeout(tick,22); else { busy=false; record(n);
        $('raceMsg').innerHTML=`n = ${fmt(n)}일 때 두 알고리즘의 결과는 <b>${fmt(s)}</b>로 같아요. 연산 횟수는 알고리즘 1이 <b>${fmt(n)}번</b>, 알고리즘 2가 <b>3번</b>이에요. ${n>3?`알고리즘 1이 ${fmt(n-3)}번 더 계산했어요.`:n<3?'n이 아주 작으면 알고리즘 1이 오히려 적게 계산해요.':''}`; } })();
  };
  $('raceClr').onclick=()=>{if(busy) return; store.set(EFR,[]); MEMO.raceRec=''; efSave(); $('raceMsg').textContent='기록을 지웠어요.'; table();};
  table();
})();

/* 02 내 기록 그래프 */
function efGraph(){
  const R=efRecs(), mx=Math.max(10,...R.map(r=>r.n)), W=520, H=240, L=46, Bm=34, T=12, Rr=16;
  const x=v=>L+v/mx*(W-L-Rr), y=v=>H-Bm-v/mx*(H-Bm-T);
  let g=`<svg viewBox="0 0 ${W} ${H}" class="ef-chart2" aria-label="n에 따른 연산 횟수 그래프">`;
  g+=`<line x1="${L}" y1="${H-Bm}" x2="${W-Rr}" y2="${H-Bm}" stroke="#5b6776"/><line x1="${L}" y1="${T}" x2="${L}" y2="${H-Bm}" stroke="#5b6776"/>`;
  g+=`<text x="${W-Rr}" y="${H-10}" text-anchor="end" font-size="12" fill="#5b6776">n(입력 크기) → ${fmt(mx)}</text><text x="${L-6}" y="${T+10}" text-anchor="end" font-size="11" fill="#5b6776">${fmt(mx)}</text><text x="${L+4}" y="${T+10}" font-size="12" fill="#5b6776">연산 횟수</text>`;
  g+=`<line x1="${x(0)}" y1="${y(0)}" x2="${x(mx)}" y2="${y(mx)}" stroke="#1f9d74" stroke-width="3"/><line x1="${x(0)}" y1="${y(3)}" x2="${x(mx)}" y2="${y(3)}" stroke="#d64535" stroke-width="3"/>`;
  g+=`<text x="${x(mx*.62)}" y="${y(mx*.62)-10}" font-size="13" font-weight="700" fill="#1f9d74">알고리즘 1 · 정비례</text><text x="${x(mx*.62)}" y="${y(3)-8}" font-size="13" font-weight="700" fill="#d64535">알고리즘 2 · 상수</text>`;
  R.forEach(r=>{g+=`<circle cx="${x(r.n)}" cy="${y(r.n)}" r="5" fill="#1f9d74" stroke="#fff" stroke-width="2"/><circle cx="${x(r.n)}" cy="${y(3)}" r="5" fill="#d64535" stroke="#fff" stroke-width="2"/><text x="${x(r.n)}" y="${H-Bm+16}" text-anchor="middle" font-size="11" fill="#16202c">${r.n}</text>`;});
  $('myGraph').innerHTML=g+'</svg>'+(R.length?'':'<p class="note">01에서 실행한 기록이 아직 없어요. 01로 돌아가 n을 바꿔 실행해 보세요.</p>');
}

/* 02 지식 키우기 그래프와 막대 */
(function(){
  const svg=document.querySelector('.ef-chart'), W=300, H=220, L=34, Bm=26, T=10, top=40;
  const X=n=>L+n/10*(W-L-14), Y=v=>H-Bm-Math.min(v,top)/top*(H-Bm-T);
  const F=[['O(1)',n=>1,'#1f9d74'],['O(n)',n=>n,'#2f6fd0'],['O(n²)',n=>n*n,'#9b4fc4'],['O(2ⁿ)',n=>Math.pow(2,n),'#d64535']];
  let g=`<line x1="${L}" y1="${H-Bm}" x2="${W-8}" y2="${H-Bm}" stroke="#5b6776"/><line x1="${L}" y1="${T}" x2="${L}" y2="${H-Bm}" stroke="#5b6776"/><text x="${W-8}" y="${H-6}" text-anchor="end" font-size="11" fill="#5b6776">n(입력)</text><text x="${L+4}" y="${T+10}" font-size="11" fill="#5b6776">연산 횟수</text>`;
  F.forEach(([nm,f,c],k)=>{let d='', lx=0, ly=0; for(let i=0;i<=100;i++){const n=i/10, v=f(n); if(v>top&&i){break;} d+=(i?'L':'M')+X(n).toFixed(1)+' '+Y(v).toFixed(1)+' '; lx=X(n); ly=Y(v);} g+=`<path d="${d}" fill="none" stroke="${c}" stroke-width="3"/><text x="${k===3?lx-44:Math.min(lx+4,W-50)}" y="${k===3?T+22:Math.max(ly-(k===0?6:2),T+12)}" font-size="12" font-weight="700" fill="${c}">${nm}</text>`;});
  svg.innerHTML=g+`<text x="${L-4}" y="${Y(top)+4}" text-anchor="end" font-size="10" fill="#5b6776">${top}</text><text x="${X(10)}" y="${H-Bm+14}" text-anchor="middle" font-size="10" fill="#5b6776">10</text>`;
  const draw=()=>{const n=+$('boN').value; $('boNV').textContent=n; const V=[['O(1)',1,'#1f9d74'],['O(n)',n,'#2f6fd0'],['O(n²)',n*n,'#9b4fc4'],['O(2ⁿ)',Math.pow(2,n),'#d64535']], mx=Math.max(...V.map(v=>v[1]));
    $('boBars').innerHTML=`<div class="ef-bars">${V.map(([nm,v,c])=>`<div><b style="color:${c}">${nm}</b><span class="b"><i style="width:${Math.max(v/mx*100,.6)}%;background:${c}"></i></span><span class="v">${fmt(v)}</span></div>`).join('')}</div><p class="note">n = ${n}일 때 O(2ⁿ)의 값은 O(n)의 ${fmt(Math.round(Math.pow(2,n)/n))}배쯤이에요.</p>`;};
  $('boN').oninput=draw; draw();
})();

/* 02 어떤 O 표기법일까? */
sorter('boGame',{
  cats:[{n:'O(1)',k:'#1f9d74'},{n:'O(n)',k:'#2f6fd0'},{n:'O(n²)',k:'#9b4fc4'},{n:'O(2ⁿ)',k:'#d64535'}],
  items:[
    {t:'반 학생 n명의 출석부에서 맨 첫 번째 학생의 이름 읽기',c:0,ic:'📋',w:'학생이 몇 명이든 첫 이름 하나만 읽으면 되므로 연산 횟수가 일정해요.',short:'출석부 첫 이름 읽기'},
    {t:'1부터 n까지의 합을 n × (n + 1) / 2로 한 번에 구하기',c:0,ic:'🧮',w:'n이 커져도 곱셈·덧셈·나눗셈 3번이면 돼요.',short:'합 공식으로 계산'},
    {t:'사물함 n개를 차례로 하나씩 열어 두고 간 우산 찾기',c:1,ic:'☂️',w:'사물함이 2배가 되면 열어 볼 횟수도 2배로 늘어요(정비례).',short:'사물함 하나씩 열기'},
    {t:'1부터 n까지의 수를 하나씩 더해 합 구하기',c:1,ic:'➕',w:'덧셈을 n번 해요.',short:'하나씩 더하기'},
    {t:'n명이 서로 한 번씩 돌아가며 악수하기',c:2,ic:'🤝',w:'한 사람이 다른 사람들과 각각 악수하므로 악수 횟수가 대략 n의 제곱에 비례해 늘어요.',short:'서로 악수하기'},
    {t:'스위치 n개를 켜고 끄는 경우를 하나도 빠짐없이 시험해 보기',c:3,ic:'💡',w:'스위치가 1개 늘 때마다 경우의 수가 2배가 되어 2의 n 제곱만큼 늘어요.',short:'스위치 경우 다 시험'},
  ],
  end:'<b>생각해 보기</b> 같은 「1부터 n까지의 합」 문제도 알고리즘에 따라 O(1)이 되기도 하고 O(n)이 되기도 해요. 그래서 알고리즘을 고르는 일이 중요해요.'
});

/* 03 하노이 탑 */
const EFH=MK+'-hanoi';
(function(){
  const B=$('hanoi');
  B.innerHTML=`<div class="row" style="margin-bottom:8px"><b>원반 수</b>${[1,2,3,4,5,6].map(n=>`<button class="btn sm ghost" data-n="${n}">${n}개</button>`).join('')}<button class="btn sm ghost" id="hReset">↺ 처음부터</button></div>
    <div class="ef-hanoi"><svg viewBox="0 0 640 230" id="hSvg" aria-label="하노이 탑"></svg></div>
    <div class="row" style="margin-top:6px">${['A','B','C'].map((p,i)=>`<button class="btn sm" data-p="${i}">${p} 기둥</button>`).join('')}<span class="ef-moves">이동 횟수 <b id="hMoves">0</b>번</span></div>
    <div class="ef-hstate" id="hState"></div>
    <div class="ef-msg" id="hMsg"></div>
    <div class="row"><button class="btn sm ghost" id="hAuto" disabled>🤖 컴퓨터로 옮겨 보기</button><span class="muted" style="font-size:.84rem" id="hAutoTip">지금 고른 원반 수를 직접 옮겨 기록하면, 그 원반 수만 컴퓨터로 다시 볼 수 있어요.</span></div>`;
  const svg=$('hSvg'), PX=[110,320,530], BASE=200;
  let n=1, pegs, sel=null, moves=0, done=false, busy=false;
  const recs=()=>{const r=store.get(EFH,{}); return r&&typeof r==='object'?r:{};};
  function draw(){
    let g=`<rect x="10" y="${BASE}" width="620" height="14" rx="4" fill="#8a5a2b"/>`;
    PX.forEach((x,i)=>{g+=`<rect x="${x-5}" y="40" width="10" height="${BASE-40}" rx="4" fill="#b98a55"/><text x="${x}" y="${BASE+30}" text-anchor="middle" font-size="15" font-weight="900" fill="#16202c">${'ABC'[i]}</text>`;});
    pegs.forEach((p,i)=>p.forEach((d,j)=>{const w=34+d*24, lift=sel===i&&j===p.length-1; const y=lift?14:BASE-20*(j+1);
      g+=`<rect x="${PX[i]-w/2}" y="${y}" width="${w}" height="18" rx="7" fill="hsl(${(d*47)%360} 65% 58%)" stroke="${lift?'#16202c':'#fff'}" stroke-width="2"/><text x="${PX[i]}" y="${y+13}" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">${d}</text>`;}));
    PX.forEach((x,i)=>{g+=`<rect class="hit" data-p="${i}" x="${x-100}" y="0" width="200" height="${BASE+14}" fill="transparent"/>`;});
    svg.innerHTML=g; $('hMoves').textContent=moves;
    $('hState').innerHTML=['A','B','C'].map((p,i)=>`<span><b>${p}</b> ${pegs[i].length?pegs[i].join(', '):'비어 있음'}</span>`).join('')+'<small>(아래 → 위, 숫자가 클수록 큰 원반)</small>';
    svg.querySelectorAll('.hit').forEach(h=>h.onclick=()=>pick(+h.dataset.p));
    B.querySelectorAll('[data-n]').forEach(b=>b.classList.toggle('ghost',+b.dataset.n!==n));
    const R=recs(), mine=R[n]!=null; $('hAuto').disabled=!mine||busy; $('hAutoTip').hidden=mine;
  }
  function start(k){n=k; pegs=[[...Array(n)].map((_,i)=>n-i),[],[]]; sel=null; moves=0; done=false;
    $('hMsg').innerHTML=`<b>초기 상태</b> 원반 ${n}개가 모두 A에 있어요. <b>목표 상태</b>는 원반 ${n}개가 모두 C에 있는 상태예요.`; draw();}
  function pick(i){
    if(done||busy) return; const M=$('hMsg');
    if(sel===null){ if(!pegs[i].length){M.innerHTML='<span class="ng">빈 기둥이에요.</span> 원반이 있는 기둥을 먼저 골라요.'; return;} sel=i; M.innerHTML=`${'ABC'[i]} 기둥의 맨 위 원반(${pegs[i][pegs[i].length-1]})을 골랐어요. 놓을 기둥을 눌러요.`; draw(); return; }
    if(sel===i){sel=null; M.textContent='고르기를 취소했어요.'; draw(); return;}
    const d=pegs[sel][pegs[sel].length-1], t=pegs[i];
    if(t.length&&t[t.length-1]<d){M.innerHTML='<span class="ng">큰 원반을 작은 원반 위로 올릴 수 없어요.</span>'; sel=null; draw(); return;}
    t.push(pegs[sel].pop()); moves++; M.innerHTML=`${d}번 원반을 ${'ABC'[sel]}에서 ${'ABC'[i]}로 옮겼어요. <span class="muted">(현재 상태)</span>`; sel=null;
    if(pegs[2].length===n){ done=true; const R=recs(), best=R[n]?Math.min(R[n],moves):moves; R[n]=best; store.set(EFH,R);
      MEMO.hanoiRec=Object.keys(R).sort((a,b)=>a-b).map(k=>`${k}개: ${R[k]}번`).join(' · '); efSave(); table();
      M.innerHTML=`<span class="ok">🎉 목표 상태!</span> 원반 ${n}개를 <b>${moves}번</b> 만에 모두 C로 옮겼어요(기록됨). `+(moves>Math.pow(2,n)-1?'이 원반 수로는 <b>더 적은 횟수</b>로도 옮길 수 있어요. 다시 도전해 볼까요?':'이 원반 수에서 더 줄일 수 없는 횟수예요. 원반을 하나 늘려 보세요!'); }
    draw();
  }
  function table(){const R=recs(); const ns=[1,2,3,4,5,6];
    $('hTable').innerHTML=`<tr><th>n</th>${ns.map(k=>`<th>${k}</th>`).join('')}<th>…</th><th>n</th></tr><tr><th>단위 연산 횟수<br><small>(내 기록)</small></th>${ns.map(k=>`<td>${R[k]!=null?`<b>${R[k]}</b>`:'<span class="muted">?</span>'}</td>`).join('')}<td>…</td><td><span class="muted">규칙 → 아래 메모</span></td></tr>`;}
  B.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{if(!busy) start(+b.dataset.n);});
  B.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>pick(+b.dataset.p));
  $('hReset').onclick=()=>{if(!busy) start(n);};
  $('hAuto').onclick=async()=>{
    if(busy) return; start(n); busy=true; draw(); const seq=[];
    (function solve(k,a,c,b){if(!k) return; solve(k-1,a,b,c); seq.push([a,c]); solve(k-1,b,c,a);})(n,0,2,1);
    $('hMsg').textContent=`컴퓨터가 원반 ${n}개를 옮기는 중이에요. 위의 원반들이 어디로 모였다가 다시 움직이는지 지켜봐요.`;
    for(const [a,c] of seq){pegs[c].push(pegs[a].pop()); moves++; draw(); await sleep(n>4?160:380);}
    busy=false; done=true; draw(); $('hMsg').innerHTML=`컴퓨터가 원반 ${n}개를 <b>${moves}번</b> 만에 옮겼어요. <span class="muted">(자동 실행은 내 기록에 들어가지 않아요)</span>`;
  };
  start(1); table();
})();

/* 03 모델링 괄호 (이 기기 저장 + 메모 요약) */
(function(){
  const K=MK+'-hmodel', ins=[...document.querySelectorAll('#hModel input')];
  let v=store.get(K,[]); if(!Array.isArray(v)) v=[];
  ins.forEach((inp,i)=>{inp.value=v[i]||''; inp.addEventListener('input',()=>{inp.value=inp.value.toUpperCase().replace(/[^ABC]/g,''); v=ins.map(x=>x.value); store.set(K,v);
    MEMO.hanoiModel=`n=1: 1번 원반 → (${v[0]||' '}) / n≠1: n−1번까지 → (${v[1]||' '}), n번 → (${v[2]||' '}), n−1번까지 (${v[3]||' '}) → (${v[4]||' '})`; efSave();
    $('hModelSaved').textContent='이 기기에 저장됨'; clearTimeout(inp._t); inp._t=setTimeout(()=>$('hModelSaved').textContent='',1400);});});
})();

/* 화면 전환 */
onShow[2]=efGraph;

/* 04 마무리 */
const MEMOLIST=[['planFast','처음 생각 · 더 좋은 방법을 판단하는 기준'],['predSum','예상 · 두 방법의 계산 횟수 차이'],['raceRec','두 알고리즘 연산 횟수 기록'],['hanoiRec','하노이 탑 · 내 이동 횟수 기록'],['hanoiModel','하노이 탑 · 모델링 괄호'],['hanoiRule','하노이 탑 · 내가 찾은 규칙'],['hanoiPred','하노이 탑 · 원반 10개 예측'],['ck1','성취도 · 분해와 모델링으로 수행 시간 비교'],['keyQ','오늘의 질문에 대한 내 답'],['newLearn','새롭게 알게 된 점']];
onShow[4]=()=>{const p=(MEMO.planFast||'').trim(); $('prevPlan').innerHTML=`<b>처음 생각</b> ${p?esc(p):'<span class="muted">(시작 화면에 아직 안 씀)</span>'}`; memoSummary('msum',MEMOLIST);};
