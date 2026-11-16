/* 공통 */
function seSave(){store.set(MK,MEMO);}
const seList=a=>'['+a.join(', ')+']';
function seAddRec(key,item,max){const list=(MEMO[key]||'').split(' / ').filter(x=>x&&x!==item); list.push(item); const v=list.slice(-(max||4)).join(' / ');
  if(key==='seqRec') MEMO.seqRec=v; else if(key==='binRec') MEMO.binRec=v; else MEMO.nameRec=v; seSave();}
function seShowRecs(el,key){const r=(MEMO[key]||'').split(' / ').filter(Boolean); el.innerHTML=r.length?`<b>내 기록</b><ul>${r.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'';}

/* 성취도 평가 */
chips('ck1','ck1',['탐색 알고리즘에 적합한 데이터 구조의 종류와 특성을 알고 선택할 수 있다'],true);
chips('ck2','ck2',['순차 탐색과 이진 탐색 알고리즘별 수행 과정과 특징을 비교할 수 있다','실생활에서 순차 탐색과 이진 탐색 사례를 찾을 수 있다'],true);
chips('ck3','ck3',['정렬·탐색 알고리즘의 수행 과정을 설명할 수 있다'],true);
chips('selfCheck','selfCheck',['문제 분해와 모델링을 할 수 있으며 데이터를 정렬·탐색하여 다양한 알고리즘의 특징과 효율을 비교·분석할 수 있다','알고리즘의 수행 과정 및 효율성을 비교·분석할 수 있다','알고리즘 효율의 가치와 영향력을 인식하고 적극적으로 탐구할 수 있다'],true);

/* 01 데이터 구조 카드 */
flipCards('dsCards',[
  {ic:'🧮',f:'배열',s:'선형',b:'같은 유형의 데이터를 연속적인 메모리 공간에 저장해요.',x:'특정 요소에 한 번에 직접 접근할 수 있어요.'},
  {ic:'📃',f:'리스트',s:'선형',b:'여러 개의 데이터를 순서대로 저장하고 관리하는 구조예요.',x:'파이썬 리스트에는 숫자, 문자, 다른 리스트 등을 함께 저장할 수 있어요.'},
  {ic:'🥞',f:'스택(stack)',s:'선형',b:'가장 마지막에 삽입된 데이터가 가장 먼저 삭제되는 후입 선출(LIFO) 구조예요.',x:'접시를 쌓고 맨 위부터 꺼내는 모습과 닮았어요.'},
  {ic:'🚶',f:'큐(queue)',s:'선형',b:'먼저 들어온 데이터가 먼저 나가는 선입 선출(FIFO) 구조예요.',x:'줄을 서서 먼저 온 사람부터 들어가는 모습과 닮았어요.'},
  {ic:'🕸️',f:'그래프(graph)',s:'비선형 · 심화',b:'객체를 나타내는 정점(노드)과 이를 연결하는 간선의 집합이에요.',x:'순환이 허용돼요(한 바퀴 돌아 처음으로 올 수 있어요).'},
  {ic:'🌳',f:'트리(tree)',s:'비선형 · 심화',b:'노드와 간선으로 이루어진 계층 구조예요.',x:'순환이 허용되지 않아요.'},
]);

/* 01 알맞은 데이터 구조 고르기 */
sorter('dsGame',{
  cats:[{n:'📏 선형 데이터 구조',k:'#2f6fd0'},{n:'🕸️ 비선형 데이터 구조',k:'#9b4fc4'}],
  items:[
    {t:'반 학생 30명의 출석부 명단<br><small>목적: 이름으로 학생 찾기</small>',c:0,ic:'📋',w:'학생이 출석 번호에 따라 한 줄로 이어진 1:1 관계라서 리스트에 저장하면 돼요.',short:'출석부 명단'},
    {t:'누가 누구와 친구인지 적은 SNS 친구 관계<br><small>목적: 친구의 친구 추천하기</small>',c:1,ic:'💬',w:'한 사람이 여러 사람과 연결되는 n:n 관계라서 그래프가 알맞아요.',short:'SNS 친구 관계'},
    {t:'사장 → 부장 → 과장 → 사원으로 이어지는 회사 조직도<br><small>목적: 특정 팀의 팀원 찾기</small>',c:1,ic:'🏢',w:'한 사람 아래에 여러 사람이 있는 계층 관계라서 트리가 알맞아요.',short:'회사 조직도'},
    {t:'편의점 상품의 바코드와 가격 목록<br><small>목적: 상품 정보 찾기</small>',c:0,ic:'🏷️',w:'상품 하나하나가 차례대로 나열된 데이터라서 리스트(배열)에 저장해요.',short:'바코드 상품 목록'},
    {t:'버스 정류장과 정류장을 잇는 노선 정보<br><small>목적: 환승 경로 안내하기</small>',c:1,ic:'🚌',w:'한 정류장이 여러 정류장과 이어지고 길이 돌아올 수도 있어 그래프가 알맞아요.',short:'정류장과 노선'},
    {t:'급식실 앞에 늘어선 학생들<br><small>목적: 다음에 받을 학생 찾기</small>',c:0,ic:'🍱',w:'먼저 들어온 데이터가 먼저 나가는 큐 구조예요.',short:'급식 대기 줄'},
  ],
  end:'<b>생각해 보기</b> 무엇을 보고 골랐나요? 데이터 요소 하나가 <b>앞뒤 하나씩</b>과 이어지는지, <b>여러 요소</b>와 이어지는지를 떠올려 봐요.'
});

/* 02 순차 탐색 시뮬레이터 */
(function(){
  const B=$('seqSim');
  const P=[['교과서 예',[4,6,10,2,3,1,7,5]],['새 리스트',[12,7,25,3,18,9,30,14,21,5]]];
  B.innerHTML=`<div class="row" style="margin-bottom:8px">${P.map((p,i)=>`<button class="btn sm ghost" data-p="${i}">${p[0]}</button>`).join('')}</div>
    <div class="se-tgt"><b>찾는 값</b> <span id="sqT"></span></div>
    <div class="se-cells" id="sqCells"></div>
    <div class="se-msg" id="sqMsg"></div>
    <div class="row"><button class="btn sm" id="sqNext">다음 요소 검사 ▶</button><button class="btn sm ghost" id="sqEnd">끝까지 ⏭</button><button class="btn sm ghost" id="sqRe">처음부터</button><span class="se-cnt">비교 <b id="sqC">0</b>번</span></div>
    <div class="se-recs" id="sqRecs"></div>`;
  let L, t, i, cmp, done;
  function tgts(){const miss=Math.max(...L)+1; $('sqT').innerHTML=L.map(v=>`<button class="se-tb ${v===t?'on':''}" data-v="${v}">${v}</button>`).join('')+`<button class="se-tb miss ${t===miss?'on':''}" data-v="${miss}">없는 값(${miss})</button>`;
    $('sqT').querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{t=+b.dataset.v; reset();});}
  function draw(){
    $('sqCells').style.setProperty('--n',L.length);
    $('sqCells').innerHTML=L.map((v,k)=>`<div class="c ${k<i&&!(done&&k===i-1&&L[k]===t)?'pass':''} ${done&&L[k]===t&&k===i-1?'hit':''} ${k===i-1&&!done?'now':''}"><small>${k}</small><b>${v}</b></div>`).join('');
    $('sqC').textContent=cmp; $('sqNext').disabled=done; tgts();
  }
  function reset(){i=0; cmp=0; done=false; $('sqMsg').textContent='「다음 요소 검사 ▶」를 누르면 0번째 요소부터 검사해요.'; draw();}
  function step(){
    if(done) return; const v=L[i]; cmp++; i++;
    if(v===t){done=true; $('sqMsg').innerHTML=`<span class="ok">${i-1}번째 요소 검사 → 찾았어요!</span> 비교 <b>${cmp}</b>번`; seAddRec('seqRec',`${seList(L)}에서 ${t} 찾기: 비교 ${cmp}번`); seShowRecs($('sqRecs'),'seqRec');}
    else if(i>=L.length){done=true; $('sqMsg').innerHTML=`<span class="ng">마지막 요소까지 검사했지만 ${t}은(는) 리스트에 없어요.</span> 비교 <b>${cmp}</b>번`; seAddRec('seqRec',`${seList(L)}에서 ${t}(없는 값) 찾기: 비교 ${cmp}번`); seShowRecs($('sqRecs'),'seqRec');}
    else $('sqMsg').textContent=`${i-1}번째 요소 검사 → ${v}은(는) ${t}이(가) 아니에요. 다음 요소로.`;
    draw();
  }
  $('sqNext').onclick=step; $('sqEnd').onclick=()=>{while(!done) step();}; $('sqRe').onclick=reset;
  B.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{B.querySelectorAll('[data-p]').forEach(x=>x.classList.toggle('ghost',x!==b)); L=P[+b.dataset.p][1].slice(); t=L[L.length-1]; reset();});
  B.querySelector('[data-p="0"]').click(); seShowRecs($('sqRecs'),'seqRec');
})();

/* 03 이진 탐색 시뮬레이터 */
function seBinSteps(L,t,cmpf){
  const c=cmpf||((x,y)=>x-y), S=[]; let lo=0, hi=L.length-1, cmp=0;
  S.push({lo,hi,mid:null,cmp,msg:'첫 번째 요소를 low, 마지막 요소를 high로 설정'});
  while(lo<=hi){
    const mid=Math.floor((lo+hi)/2), v=L[mid]; cmp++;
    S.push({lo,hi,mid,cmp,msg:`(low + high) / 2 = (${lo} + ${hi}) / 2의 몫 → mid = ${mid}, mid값 = ${v}`});
    const r=c(t,v);
    if(r===0){S.push({lo,hi,mid,cmp,found:mid,msg:`찾는 값(${t})과 mid값(${v})이 일치하므로 mid의 위치(${mid})를 반환`}); return S;}
    if(r>0){lo=mid+1; S.push({lo,hi,mid,cmp,msg:`찾는 값(${t})이 mid값(${v})보다 오른쪽에 있으므로 low를 mid + 1 = ${lo}로 변경해 왼쪽 범위를 탐색에서 제외`});}
    else {hi=mid-1; S.push({lo,hi,mid,cmp,msg:`찾는 값(${t})이 mid값(${v})보다 왼쪽에 있으므로 high를 mid − 1 = ${hi}로 변경해 오른쪽 범위를 탐색에서 제외`});}
  }
  S.push({lo,hi,mid:null,cmp,none:true,msg:`low가 high보다 커져서 더 찾을 범위가 없어요. ${t}은(는) 리스트에 없어요.`});
  return S;
}
(function(){
  const B=$('binSim');
  const P=[['교과서 예',[1,2,3,4,5,6,7,10]],['새 리스트',[3,8,11,15,19,24,27,31,36,42,48]]];
  B.innerHTML=`<div class="row" style="margin-bottom:8px">${P.map((p,i)=>`<button class="btn sm ghost" data-p="${i}">${p[0]}</button>`).join('')}</div>
    <div class="se-tgt"><b>찾는 값</b> <span id="bnT"></span></div>
    <div class="se-cells" id="bnCells"></div><div class="se-ptr" id="bnPtr"></div>
    <div class="se-msg" id="bnMsg"></div>
    <div class="row"><button class="btn sm ghost" id="bnPrev">◀ 이전</button><button class="btn sm" id="bnNext">다음 ▶</button><button class="btn sm ghost" id="bnEnd">끝까지 ⏭</button><span class="se-cnt">비교 <b id="bnC">0</b>번</span></div>
    <div class="se-recs" id="bnRecs"></div>`;
  let L, t, S, k;
  function tgts(){const miss=L[L.length-1]+1; $('bnT').innerHTML=L.map(v=>`<button class="se-tb ${v===t?'on':''}" data-v="${v}">${v}</button>`).join('')+`<button class="se-tb miss ${t===miss?'on':''}" data-v="${miss}">없는 값(${miss})</button>`;
    $('bnT').querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{t=+b.dataset.v; load();});}
  function draw(){
    const s=S[k], n=L.length; $('bnCells').style.setProperty('--n',n); $('bnPtr').style.setProperty('--n',n);
    $('bnCells').innerHTML=L.map((v,i)=>{const out=i<s.lo||i>s.hi; return `<div class="c ${out?'x':''} ${s.mid===i?'mid':''} ${s.found===i?'hit':''}"><small>${i}</small><b>${out&&s.found!==i?'×':v}</b></div>`;}).join('');
    $('bnPtr').innerHTML=L.map((_,i)=>{const a=[]; if(i===s.lo) a.push('low'); if(i===s.hi) a.push('high'); if(i===s.mid) a.push('mid'); return `<span>${a.join(', ')}</span>`;}).join('');
    $('bnMsg').innerHTML=`<b>${esc(s.msg)}</b> <span class="muted">(${k+1} / ${S.length})</span>`; $('bnC').textContent=s.cmp;
    $('bnPrev').disabled=k===0; $('bnNext').disabled=k===S.length-1; tgts();
    if(k===S.length-1){seAddRec('binRec',`${seList(L)}에서 ${t}${s.none?'(없는 값)':''} 찾기: 비교 ${s.cmp}번`); seShowRecs($('bnRecs'),'binRec');}
  }
  function load(){S=seBinSteps(L,t); k=0; draw();}
  $('bnPrev').onclick=()=>{if(k>0){k--; draw();}}; $('bnNext').onclick=()=>{if(k<S.length-1){k++; draw();}}; $('bnEnd').onclick=()=>{k=S.length-1; draw();};
  B.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{B.querySelectorAll('[data-p]').forEach(x=>x.classList.toggle('ghost',x!==b)); L=P[+b.dataset.p][1].slice(); t=+b.dataset.p===0?5:L[2]; load();});
  B.querySelector('[data-p="0"]').click(); seShowRecs($('bnRecs'),'binRec');
})();

/* 03 리스트가 커지면? */
(function(){
  const B=$('binScale');
  B.innerHTML=`<div class="row"><b>리스트의 요소 개수</b>${[100,10000,1000000,10000000].map(n=>`<button class="btn sm ghost" data-n="${n}">${fmt(n)}</button>`).join('')}<input type="number" id="bsIn" min="1" max="1000000000" placeholder="직접 입력" style="width:140px"><button class="btn sm" id="bsGo">세어 보기</button></div>
    <div style="overflow-x:auto"><table class="se-tbl" id="bsTbl"></table></div>`;
  const rows=[];
  const worst=n=>{let lo=0, hi=n-1, c=0; while(lo<=hi){const mid=Math.floor((lo+hi)/2); c++; lo=mid+1;} return c;};
  function add(n){n=Math.max(1,Math.min(1e9,Math.floor(n))); if(!rows.includes(n)) rows.push(n); rows.sort((a,b)=>a-b);
    $('bsTbl').innerHTML='<tr><th>리스트의 요소 개수</th><th>최악의 경우(순차 탐색)</th><th>최악의 경우(이진 탐색)</th></tr>'+rows.map(r=>`<tr><td>${fmt(r)}</td><td>${fmt(r)}</td><td><b>${worst(r)}</b></td></tr>`).join('');}
  B.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>add(+b.dataset.n));
  $('bsGo').onclick=()=>{const v=+$('bsIn').value; if(v>=1) add(v);};
  $('bsTbl').innerHTML='<tr><th>리스트의 요소 개수</th><th>최악의 경우(순차 탐색)</th><th>최악의 경우(이진 탐색)</th></tr><tr><td colspan="3" class="muted">버튼을 눌러 세어 보세요.</td></tr>';
})();

/* 04 이름 리스트에서 두 탐색 겨루기 */
(function(){
  const N=['강하준','고서윤','김도현','나은비','문시우','배하린','송지안','오태윤','임채아','조유나','하은솔','홍지민'];
  const B=$('nameRace');
  B.innerHTML=`<div class="se-names" id="nrPick">${N.map(n=>`<button class="se-tb" data-n="${n}">${n}</button>`).join('')}</div>
    <div class="se-race"><div><h4>순차 탐색</h4><table class="se-ntbl" id="nrSeq"></table><div class="se-cnt">비교 <b id="nrSc">0</b>번</div></div><div><h4>이진 탐색</h4><table class="se-ntbl" id="nrBin"></table><div class="se-cnt">비교 <b id="nrBc">0</b>번</div></div></div>
    <div class="se-msg" id="nrMsg">위에서 찾을 이름을 골라요.</div>
    <div class="row"><button class="btn sm" id="nrStep" disabled>한 번씩 비교 ▶</button><button class="btn sm ghost" id="nrEnd" disabled>끝까지 ⏭</button></div>
    <div class="se-recs" id="nrRecs"></div>`;
  let t=null, si=0, sDone=false, bS=[], bk=0;
  function binStates(t){ // 비교 한 번마다 상태 하나
    const R=[{lo:0,hi:N.length-1,mid:null,cmp:0}]; let lo=0, hi=N.length-1, c=0;
    while(lo<=hi){const mid=Math.floor((lo+hi)/2); c++; const r=t.localeCompare(N[mid],'ko');
      R.push({lo,hi,mid,cmp:c,found:r===0?mid:null,msg:r===0?`(${lo} + ${hi}) / 2의 몫 ${mid}번 ‘${N[mid]}’ → 일치!`:`(${lo} + ${hi}) / 2의 몫 ${mid}번 ‘${N[mid]}’ 확인 → ${r>0?'뒤쪽':'앞쪽'} 절반으로`});
      if(r===0) break; if(r>0) lo=mid+1; else hi=mid-1;}
    return R;}
  function draw(){
    $('nrSeq').innerHTML=N.map((n,i)=>`<tr class="${i<si&&!(sDone&&i===si-1)?'pass':''} ${sDone&&i===si-1?'hit':''} ${!sDone&&i===si-1?'now':''}"><td>${i}</td><td>${n}</td></tr>`).join('');
    const s=bS[bk]||{lo:0,hi:N.length-1,mid:null,cmp:0};
    $('nrBin').innerHTML=N.map((n,i)=>{const out=(i<s.lo||i>s.hi)&&s.mid!=null; const tag=s.mid==null?'':[i===s.lo?'low':'',i===s.mid?'mid':'',i===s.hi?'high':''].filter(Boolean).join(', ');
      return `<tr class="${out?'x':''} ${s.mid===i&&s.found==null?'mid':''} ${s.found===i?'hit':''}"><td>${i}</td><td>${out?'×':n}</td><td class="tg">${tag}</td></tr>`;}).join('');
    $('nrSc').textContent=si; $('nrBc').textContent=s.cmp;
    const bDone=bk===bS.length-1; $('nrStep').disabled=!t||(sDone&&bDone); $('nrEnd').disabled=$('nrStep').disabled;
    if(t&&sDone&&bDone){ $('nrMsg').innerHTML=`<span class="ok">‘${t}’ 찾기 끝!</span> 순차 탐색 <b>${si}번</b>, 이진 탐색 <b>${s.cmp}번</b> 비교했어요.`;
      seAddRec('nameRec',`${t}: 순차 ${si}번, 이진 ${s.cmp}번`); seShowRecs($('nrRecs'),'nameRec'); }
  }
  function step(){
    const sWas=sDone, bWas=bk===bS.length-1;
    if(!sDone){ si++; if(N[si-1]===t) sDone=true; }
    if(!bWas) bk++;
    const sm=sWas?'이미 찾았어요':sDone?`${si-1}번 ‘${N[si-1]}’ → 일치!`:`${si-1}번 ‘${N[si-1]}’ 확인 → 아니에요`;
    const bm=bWas?'이미 찾았어요':esc(bS[bk].msg);
    $('nrMsg').innerHTML=`<b>순차</b> ${sm} · <b>이진</b> ${bm}`;
    draw();
  }
  B.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{B.querySelectorAll('[data-n]').forEach(x=>x.classList.toggle('on',x===b)); t=b.dataset.n; si=0; sDone=false; bS=binStates(t); bk=0;
    $('nrMsg').textContent=`‘${t}’을(를) 찾아요. 「한 번씩 비교 ▶」를 눌러요.`; draw();});
  $('nrStep').onclick=step; $('nrEnd').onclick=()=>{let g=0; while(!$('nrStep').disabled&&g++<40) step();};
  draw(); seShowRecs($('nrRecs'),'nameRec');
})();

/* 04 그래프 탐색 (선택) */
(function(){
  const P={A:[210,30],B:[110,100],C:[310,100],D:[50,180],E:[160,180],F:[270,180],G:[370,180],H:[215,235]};
  const E=[['A','B'],['A','C'],['B','D'],['B','E'],['C','F'],['C','G'],['E','H'],['F','H']];
  const nb=v=>E.filter(e=>e.includes(v)).map(e=>e[0]===v?e[1]:e[0]).sort();
  const svg=$('gSvg');
  function draw(vis){svg.innerHTML=E.map(([a,b])=>`<line x1="${P[a][0]}" y1="${P[a][1]}" x2="${P[b][0]}" y2="${P[b][1]}" stroke="#8a94a3" stroke-width="3"/>`).join('')+Object.entries(P).map(([k,[x,y]])=>{const i=vis.indexOf(k); return `<circle cx="${x}" cy="${y}" r="17" fill="${i>=0?'#f2a516':'#fff'}" stroke="#16202c" stroke-width="2"/><text x="${x}" y="${y+5}" text-anchor="middle" font-weight="900">${k}</text>${i>=0?`<text x="${x+20}" y="${y-12}" font-size="12" fill="#d64535" font-weight="700">${i+1}</text>`:''}`;}).join('');}
  const dfs=()=>{const o=[]; (function go(v){o.push(v); nb(v).forEach(w=>{if(!o.includes(w)) go(w);});})('A'); return o;};
  const bfs=()=>{const o=['A'], q=['A']; while(q.length){const v=q.shift(); nb(v).forEach(w=>{if(!o.includes(w)){o.push(w); q.push(w);}});} return o;};
  let run=0;
  document.querySelectorAll('[data-g]').forEach(b=>b.onclick=async()=>{const my=++run, o=b.dataset.g==='dfs'?dfs():bfs(); for(let i=1;i<=o.length;i++){if(my!==run) return; draw(o.slice(0,i)); $('gOrd').innerHTML=`<b>${b.textContent}</b> ${o.slice(0,i).join(' → ')}`; await sleep(450);}});
  draw([]);
})();

/* 05 데이터 정렬·탐색하기 (새 리스트) */
(function(){
  const L=[41,17,8,29,56,12,35], S=L.slice().sort((a,b)=>a-b), T=[12,41,56];
  const bub=a=>{a=a.slice(); let c=0,s=0; for(let k=1;k<a.length;k++) for(let j=0;j<a.length-k;j++){c++; if(a[j]>a[j+1]){[a[j],a[j+1]]=[a[j+1],a[j]]; s++;}} return [c,s];};
  const ins=a=>{a=a.slice(); let c=0,s=0; for(let i=1;i<a.length;i++){let j=i; while(j>0){c++; if(a[j-1]>a[j]){[a[j-1],a[j]]=[a[j],a[j-1]]; s++; j--;} else break;}} return [c,s];};
  const seq=t=>S.indexOf(t)+1, bin=t=>seBinSteps(S,t).slice(-1)[0].cmp;
  const ans={bc:bub(L)[0],bs:bub(L)[1],ic:ins(L)[0],is:ins(L)[1]}; T.forEach(t=>{ans['s'+t]=seq(t); ans['b'+t]=bin(t);});
  const inp=k=>`<input type="number" min="0" data-k="${k}" style="width:70px"> <span class="mk" data-m="${k}"></span>`;
  const B=$('mixLab');
  B.innerHTML=`<div class="se-mix"><div><p style="margin:0 0 6px"><b>1.</b> 리스트 <span class="mono">${seList(L)}</span>을 버블 정렬과 삽입 정렬로 <b>오름차순</b> 정렬할 때의 비교 횟수와 교환 횟수</p>
    <table class="se-tbl"><tr><th>구분</th><th>버블 정렬</th><th>삽입 정렬</th></tr><tr><th>비교 횟수</th><td>${inp('bc')}</td><td>${inp('ic')}</td></tr><tr><th>교환 횟수</th><td>${inp('bs')}</td><td>${inp('is')}</td></tr></table></div>
    <div><p style="margin:0 0 6px"><b>2.</b> 오름차순 정렬된 리스트 <span class="mono">${seList(S)}</span>에서 숫자를 찾을 때의 비교 횟수</p>
    <table class="se-tbl"><tr><th>찾는 숫자</th><th>순차 탐색</th><th>이진 탐색</th></tr>${T.map(t=>`<tr><th>${t}</th><td>${inp('s'+t)}</td><td>${inp('b'+t)}</td></tr>`).join('')}</table></div></div>
    <div class="row" style="margin-top:8px"><button class="btn sm" id="mxChk">확인</button><span id="mxFb" class="se-msg"></span></div>`;
  $('mxChk').onclick=()=>{let ok=0, all=0; const parts=[];
    B.querySelectorAll('[data-k]').forEach(i=>{const k=i.dataset.k, v=i.value.trim(); const m=B.querySelector(`[data-m="${k}"]`); if(v===''){m.textContent=''; return;} all++; const r=+v===ans[k]; if(r) ok++; m.innerHTML=r?'<span class="ok">✔</span>':'<span class="ng">✖</span>'; parts.push(`${k}=${v}${r?'✔':'✖'}`);});
    $('mxFb').innerHTML=all?`${all}칸 중 <b>${ok}칸</b>이 맞았어요. ${ok<all?'✖ 칸은 교과서 103~104쪽(정렬), 110~111쪽(탐색)의 방법대로 다시 세어 봐요.':'모두 맞았어요!'}`:'칸에 숫자를 적고 눌러요.';
    if(all){MEMO.mixRes=`정렬·탐색 ${all}칸 중 ${ok}칸 맞음`; seSave();}};
})();

/* 05 보충 ○× */
(function(){
  const Q=[['큰 문제를 해결하기 쉬운 작은 문제로 나누는 것을 문제 분해라고 한다.',1,'문제 분해의 정의 그대로예요.'],
           ['버블 정렬은 정렬된 영역에 요소를 한 개씩 알맞은 자리에 끼워 넣는 방법이다.',0,'정렬된 영역에 한 개씩 삽입하는 것은 삽입 정렬이에요. 버블 정렬은 인접한 두 요소를 비교해 교환해요.'],
           ['이진 탐색은 정렬된 데이터에서 탐색 범위를 절반씩 줄여 나간다.',1,'중간값과 비교해 왼쪽 또는 오른쪽 절반만 남겨요.'],
           ['순차 탐색은 데이터가 정렬되어 있어야 쓸 수 있다.',0,'순차 탐색은 정렬되어 있지 않아도 상관없어요. 정렬이 필요한 것은 이진 탐색이에요.']];
  const B=$('oxBox');
  B.innerHTML=Q.map((q,i)=>`<div class="se-ox" data-i="${i}"><span>${i+1}. ${q[0]}</span><button class="btn sm ghost" data-a="1">○</button><button class="btn sm ghost" data-a="0">×</button><div class="fb"></div></div>`).join('');
  B.querySelectorAll('.se-ox').forEach(d=>d.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{const q=Q[+d.dataset.i], r=+b.dataset.a===q[1];
    d.querySelectorAll('[data-a]').forEach(x=>x.classList.toggle('ghost',x!==b)); d.querySelector('.fb').innerHTML=(r?'<span class="ok">맞아요.</span> ':'<span class="ng">다시 생각해요.</span> ')+q[2];}));
})();

/* 05 개념 정리 빈칸 */
document.querySelectorAll('.se-blank').forEach(b=>b.onclick=()=>{const on=!b.classList.contains('on'); b.textContent=on?b.dataset.a:'?'; b.classList.toggle('on',on);});

/* 06 마무리 */
const MEMOLIST=[['planSearch','처음 생각 · 원하는 책 찾기'],['ck1','성취도 · 데이터 구조 고르기'],['seqRec','순차 탐색 기록'],['binRec','이진 탐색 기록'],['nameRec','이름 리스트 두 탐색 비교'],['realSeq','실생활 순차 탐색 사례'],['realBin','실생활 이진 탐색 사례'],['ck2','성취도 · 두 탐색 비교와 사례'],['mixRes','데이터 정렬·탐색하기 확인'],['sumDecomp','(선택) 정리 · 문제 분해와 모델링'],['sumSort','(선택) 정리 · 정렬 알고리즘'],['sumSearch','(선택) 정리 · 탐색 알고리즘'],['bookModel','(선택) 서점 · 문제 분해와 모델링'],['bookSort','(선택) 서점 · 정렬 알고리즘'],['bookSearch','(선택) 서점 · 탐색 알고리즘'],['algoValue','(선택) 알고리즘의 중요성'],['selfCheck','(선택) 학업 성취도 점검'],['gameDesign','(선택) 게임 알고리즘 설계'],['ck3','성취도 · 정렬·탐색 과정 설명'],['keyQ','도입 질문에 대한 내 답'],['unitQ','핵심 질문(92쪽)에 대한 내 답'],['newLearn','새롭게 알게 된 점']];
onShow[6]=()=>{const p=(MEMO.planSearch||'').trim(); $('prevPlan').innerHTML=`<b>처음 생각</b> ${p?esc(p):'<span class="muted">(시작 화면에 아직 안 씀)</span>'}`; memoSummary('msum',MEMOLIST);};
