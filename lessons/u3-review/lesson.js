/* 01 추상화: 관련 요소 고르기 */
chips('factorPick','factorPickName',['행성의 공전 주기','행성으로부터 태양까지의 평균 거리','출발 행성','도착 행성','우주선의 속도','출발 날짜','여행 시간','우주선의 색깔','승무원의 이름','기내식 메뉴'],true);

/* 01 데이터 탐색: 교과서 156쪽 데이터 */
const PLANETS=[['수성',88,57910000,'#9a8f84'],['금성',225,108200000,'#d9a55b'],['지구',365,149600000,'#2f6fd0'],['화성',687,227900000,'#d64535'],['목성',4380,778600000,'#c98d5a'],['토성',10767,1433500000,'#d8b56a'],['천왕성',30660,2872500000,'#5fb8c9'],['해왕성',60152,4495100000,'#3b5bbf']];
const r3N=n=>n.toLocaleString('ko-KR');
function r3Km(d){ const e=Math.floor(d/1e8), m=Math.round(d%1e8/1e4); return (e?e+'억 ':'')+(m?r3N(m)+'만 ':'')+'km'; }
let planetSel=3;
function r3Planets(){
  $('planetTbl').innerHTML='<tr><th class="l">행성</th><th>공전 주기(일)</th><th>태양까지 평균 거리(km)</th></tr>'+PLANETS.map((p,i)=>`<tr class="${i===planetSel?'on':''}" data-i="${i}" tabindex="0"><td class="l"><i style="background:${p[3]}"></i>${p[0]}</td><td>${r3N(p[1])}</td><td>${r3N(p[2])}</td></tr>`).join('');
  $('planetTbl').querySelectorAll('tr[data-i]').forEach(r=>{ const f=()=>{planetSel=+r.dataset.i; r3Planets();}; r.onclick=f; r.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();f();}}; });
  const mx=Math.sqrt(PLANETS[7][2]), sx=18, sy=96, W=370;
  let s=`<circle cx="${sx}" cy="${sy}" r="12" style="fill:#f2a516"/><text x="${sx}" y="${sy+30}" class="r3-ol m">태양</text>`;
  PLANETS.forEach((p,i)=>{ const r=W*Math.sqrt(p[2])/mx;
    s+=`<circle cx="${sx}" cy="${sy}" r="${r}" class="r3-ring ${i===planetSel?'on':''}"/><circle cx="${sx+r}" cy="${sy}" r="${i===planetSel?7:5}" style="fill:${p[3]}" class="r3-dot" data-i="${i}"/>`;
    s+=`<text x="${sx+r}" y="${sy+[22,-14,36,-28,22,-14,22,-14][i]}" class="r3-ol m ${i===planetSel?'b':''}">${p[0]}</text>`; });
  s+=`<text x="${sx}" y="200" class="r3-ol">먼 행성까지 화면에 들어가도록 거리를 줄여 그렸어요(실제 비율과 달라요).</text>`;
  $('orbitSvg').innerHTML=s;
  $('orbitSvg').querySelectorAll('.r3-dot').forEach(c=>c.onclick=()=>{planetSel=+c.dataset.i; r3Planets();});
  const p=PLANETS[planetSel];
  $('planetInfo').innerHTML=`<b style="color:${p[3]}">${p[0]}</b> · 태양까지 평균 <b>${r3Km(p[2])}</b> · 공전 주기 <b>${r3N(p[1])}일</b>${p[0]==='지구'?'':` (지구의 약 ${(p[1]/365).toFixed(p[1]<365*10?1:0)}배)`}`;
}
r3Planets();

/* 02 알고리즘: 한 줄 한 단계 → 순서도 */
function r3Steps(){
  return String($('algoIn').value||'').split('\n').map(l=>l.trim().replace(/^([①-⑳]|\d+\s*[.)]|[-•*])\s*/,'').trim()).filter(Boolean).slice(0,14).map(t=>{
    const k=/함수/.test(t)?'fn':/입력|출력/.test(t)?'io':(/^(만약|반복)/.test(t)||/[?？]$/.test(t))?'if':'pr';
    return {t,k};
  });
}
function r3Wrap(t,n){ const out=[]; let cur=''; for(const w of t.split(' ')){ if((cur+' '+w).trim().length>n&&cur){out.push(cur);cur=w;} else cur=(cur+' '+w).trim(); while(cur.length>n){out.push(cur.slice(0,n));cur=cur.slice(n);} } if(cur) out.push(cur); return out.slice(0,4); }
function r3Flow(small){
  const st=r3Steps(), W=360, cx=180, nw=250, gap=24; let y=10, s='', nodes=[];
  const oval=(y,t)=>`<rect x="${cx-55}" y="${y}" width="110" height="30" rx="15" class="r3-fe"/><text x="${cx}" y="${y+20}" class="r3-ft w">${t}</text>`;
  s+=oval(y,'시작'); y+=30;
  st.forEach((n,i)=>{
    const L=r3Wrap(n.t,n.k==='if'?14:18), h=n.k==='if'?Math.max(56,28+L.length*17):Math.max(36,14+L.length*17);
    s+=`<line x1="${cx}" y1="${y}" x2="${cx}" y2="${y+gap-3}" class="r3-fa"/><path d="M${cx-5} ${y+gap-8} L${cx} ${y+gap-1} L${cx+5} ${y+gap-8}" class="r3-fh"/>`;
    if(i>0&&st[i-1].k==='if') s+=`<text x="${cx+8}" y="${y+15}" class="r3-ft s">예</text>`;
    y+=gap; const x=cx-nw/2;
    if(n.k==='io') s+=`<polygon points="${x+14},${y} ${x+nw},${y} ${x+nw-14},${y+h} ${x},${y+h}" class="r3-fio"/>`;
    else if(n.k==='if') s+=`<polygon points="${cx},${y} ${x+nw},${y+h/2} ${cx},${y+h} ${x},${y+h/2}" class="r3-fif"/>`;
    else if(n.k==='fn') s+=`<rect x="${x}" y="${y}" width="${nw}" height="${h}" class="r3-ffn"/><line x1="${x+10}" y1="${y}" x2="${x+10}" y2="${y+h}" class="r3-ffn"/><line x1="${x+nw-10}" y1="${y}" x2="${x+nw-10}" y2="${y+h}" class="r3-ffn"/>`;
    else s+=`<rect x="${x}" y="${y}" width="${nw}" height="${h}" rx="4" class="r3-fpr"/>`;
    const t0=y+h/2-(L.length-1)*8.5+5;
    s+=L.map((l,j)=>`<text x="${cx}" y="${t0+j*17}" class="r3-ft">${esc(l)}</text>`).join('');
    if(n.k==='if') s+=`<text x="${x+nw-4}" y="${y+h/2-6}" class="r3-ft s">아니요 →</text>`;
    y+=h;
  });
  s+=`<line x1="${cx}" y1="${y}" x2="${cx}" y2="${y+gap-3}" class="r3-fa"/><path d="M${cx-5} ${y+gap-8} L${cx} ${y+gap-1} L${cx+5} ${y+gap-8}" class="r3-fh"/>`; y+=gap;
  s+=oval(y,'끝'); y+=40;
  return `<svg viewBox="0 0 ${W} ${y}" class="r3-fsvg ${small?'sm':''}" role="img" aria-label="알고리즘 순서도">${s}</svg>`;
}
function r3FlowDraw(){ $('flowView').innerHTML=r3Steps().length>2?r3Flow():r3Flow()+'<p class="note" style="text-align:center">③부터 이어 쓰면 순서도가 길어져요.</p>'; }

/* 02 프로젝트 카드 */
function r3Card(){
  const v=k=>(MEMO[k]||'').trim();
  const t=(k,ph)=>v(k)?esc(v(k)):`<span class="e">${ph}</span>`;
  const st=r3Steps();
  const html=`<div class="r3-card">
    <div class="r3-hd"><b>${esc(v('team')||'우리 모둠')}</b><small>화성 여행, 얼마나 걸릴까?</small></div>
    <div class="pb"><b>문제</b> ${t('problemDef','01 화면에서 문제를 정의해요')}</div>
    <div class="r3-cols">
      <div style="--k:#9b4fc4"><h5>핵심 요소</h5>${t('factorPickName','관련 요소 고르기')}${v('factorEtc')?'<br>'+esc(v('factorEtc')):''}</div>
      <div style="--k:#2f6fd0"><h5>입력 → 출력</h5><b>입력</b> ${t('inputs','입력 요소')}<br><b>출력</b> ${t('outputs','출력 요소')}</div>
      <div style="--k:#e0702b"><h5>함수</h5>${t('funcPlan','받는 값, 계산 방법, 돌려주는 값')}</div>
    </div>
    <div class="r3-calgo"><div><h5>알고리즘</h5>${st.length?'<ol>'+st.map(n=>`<li>${esc(n.t)}</li>`).join('')+'</ol>':'<span class="e">02 화면에서 단계를 적어요</span>'}</div><div class="r3-cflow">${r3Flow(true)}</div></div>
  </div>`;
  $('projCard').innerHTML=html; $('projCard2').innerHTML=html;
}
function r3Refresh(){ r3FlowDraw(); r3Card(); }
document.addEventListener('input',e=>{ if(e.target.matches&&e.target.matches('[data-memo]')) setTimeout(r3Refresh,350); });
$('factorPick').addEventListener('memo',r3Refresh);
onShow[2]=r3Refresh;
onShow[4]=r3Card;
r3FlowDraw();

/* 03 진로: 인터뷰 카드 (교과서 158쪽 내용을 줄여서) */
flipCards('careerCards',[
  {ic:'💡',f:'프로그래머로 일하게 된 동기는?',s:'눌러서 답 보기',b:'소프트웨어를 만드는 <b>「창조」</b>의 과정이 즐겁고, 여러 사람이 내가 만든 프로그램을 쓰면서 <b>「가치」</b>를 느낄 때 큰 보람을 느껴요.'},
  {ic:'🧗',f:'갖추어야 할 중요한 역량은?',s:'눌러서 답 보기',b:'<b>끈기</b>와 <b>창의성</b>이에요. 전공이 아니어도 포기하지 않고 끈기 있게 공부한 사람들이 개발자로 성장했고, 어떤 프로그램으로 어떤 가치를 전할지 답을 찾으려면 창의성이 필요해요.'},
  {ic:'🛠️',f:'고등학생에게 추천하는 경험은?',s:'눌러서 답 보기',b:'<b>일상의 불편함</b>을 해결하는 프로젝트를 해 보세요. 친구나 가족에게 써 보게 하고 <b>피드백을 반영해 업데이트</b>해 보면, 프로그램이 사람들에게 어떻게 가치를 전하는지 알 수 있어요.'},
  {ic:'🪐',f:'오늘 우리가 한 일은?',s:'눌러서 보기',b:'문제를 정의하고, 추상화하고, 알고리즘을 설계했어요. 프로그래머가 프로그램을 짜기 전에 거치는 <b>첫 단계</b>와 같아요.'}
]);
chips('careerSkill','careerSkillPick',['끈기','창의성','문제 해결력','협력과 소통','피드백을 반영하는 태도','컴퓨팅 사고력'],true);

/* 04 평가 */
chips('selfEval','selfEvalPick',['프로그래밍으로 풀기 알맞은 주제를 골랐다','추상화가 문제 해결에 도움이 됐다','프로그래밍에 맞게 알고리즘을 설계했다','생성형 인공지능을 활용했다','프로그램을 보완할 의견을 냈다','결과가 오류 없이 실행됐다','모둠원과 협력해 해결했다'],true);
chips('compPick','compPickName',['지식 정보 처리','창의적 사고','협력적 소통','공동체 역량'],true);

/* 05 단원 정리: 어떤 개념일까? */
sorter('unitSort',{
  cats:[{n:'문제 분해',k:'#2f6fd0'},{n:'정렬',k:'#1f9d74'},{n:'탐색',k:'#9b4fc4'},{n:'제어 구조',k:'#e0702b'},{n:'객체와 클래스',k:'#d64535'}],
  items:[
    {t:'학교 축제 준비를 무대, 먹거리, 홍보처럼 작은 일로 나눠 모둠마다 맡겼다',ic:'🎪',c:0,short:'축제 준비 나누기',w:'축제 전체를 한꺼번에 준비하지 않고, 모둠마다 하나씩 맡을 수 있는 크기로 쪼갰어요.'},
    {t:'체육 시간에 옆 사람과 키를 비교해, 더 큰 사람이 뒤로 가도록 자리를 바꾸기를 되풀이했다',ic:'🧍',c:1,short:'옆 사람과 자리 바꾸기',w:'바로 옆 두 사람끼리만 견주어 자리를 바꾸다 보면, 큰 사람이 조금씩 뒤로 밀려나 줄이 키 순서가 돼요.'},
    {t:'카드를 한 장씩 집어, 이미 순서대로 쥔 카드 사이의 알맞은 자리에 끼워 넣었다',ic:'🃏',c:1,short:'카드 끼워 넣기',w:'손에 쥔 카드는 늘 순서가 맞춰져 있고, 새 카드는 그 사이 제자리를 찾아 들어가요.'},
    {t:'번호순으로 놓인 사물함에서 가운데 번호부터 확인해, 살펴볼 범위를 반씩 줄여 나갔다',ic:'🔢',c:2,short:'가운데부터 반씩 줄이기',w:'번호가 차례로 놓여 있어서 가운데 하나만 보고도 절반을 통째로 건너뛸 수 있었어요.'},
    {t:'순서 없이 쌓인 시험지 더미에서 내 이름이 나올 때까지 한 장씩 넘겨 보았다',ic:'📄',c:2,short:'한 장씩 넘겨 찾기',w:'시험지가 아무렇게나 쌓여 있으니 맨 위부터 한 장씩 확인할 수밖에 없어요.'},
    {t:'비가 오면 우산을 챙기고, 그렇지 않으면 모자를 쓰라고 알려 주게 프로그램을 짰다',ic:'☔',c:3,short:'비 오면 우산',w:'비가 오는지에 따라 두 안내 가운데 하나만 실행돼요.'},
    {t:'물이 끓을 때까지 1분마다 온도를 확인하는 명령을 되풀이했다',ic:'♨️',c:3,short:'끓을 때까지 확인',w:'아직 끓지 않았다면 같은 확인을 다시 하고, 끓는 순간 멈춰요.'},
    {t:'「반려 로봇」 설계도 하나로 이름과 색이 서로 다른 로봇 30대를 만들었다',ic:'🐶',c:4,short:'설계도로 로봇 30대',w:'설계도는 하나인데, 그것으로 찍어 낸 로봇은 저마다 이름과 색이 달라요.'}
  ],
  end:'복잡한 문제는 <b>작게 나누고(문제 분해)</b>, 데이터를 <b>정렬</b>하고 <b>탐색</b>하는 알고리즘을 설계한 뒤, <b>제어 구조</b> · 함수 · <b>클래스</b>로 프로그램을 구현해요.'
});
chips('unitComp','unitCompPick',['컴퓨팅 사고력','추상화 능력','자동화 능력','창의·융합 능력','디지털 문화 소양','디지털 의사소통·협업 능력','디지털 윤리 의식','디지털 기술 활용 능력','인공지능 소양','인공지능 문제 해결력','데이터 문해력','인공지능 윤리 의식'],true);

const MEMOLIST=[['team','모둠명'],['roles','모둠원과 역할'],['caseNote','찾은 사례'],['problemDef','문제 정의'],['factorPickName','고른 관련 요소'],['factorEtc','더 떠오른 관련 요소'],['inputs','입력 요소'],['outputs','출력 요소'],['algoSteps','알고리즘 단계'],['funcPlan','여행 시간 함수 설계'],['aiAsk','생성형 인공지능에게 한 질문'],['aiCheck','받은 답 평가'],['career','진로 카드: 해결하고 싶은 불편함과 써 볼 사람'],['careerSkillPick','진로 카드: 기르고 싶은 역량'],['pitch','발표: 맡은 칸과 한마디'],['dateWhy','특정 날짜에 출발하는 이유'],['progRes','(다음 시간) 프로그램 실행 결과'],['selfEvalPick','자기 평가'],['compPickName','길러진 역량'],['peer','동료 평가: 좋았던 모둠과 까닭'],['peerAsk','동료 평가: 질문이나 제안'],['unitCompPick','역량 Check'],['keyQ','핵심 질문에 대한 내 답']];
onShow[6]=()=>memoSummary('msum',MEMOLIST);
