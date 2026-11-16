
/* 0 처음 생각 */
vote('firstVote','firstView',[['⚔️ 경쟁하는 관계',''],['🤝 협력하는 관계',''],['🤔 둘 다 있다',''],['❓ 잘 모르겠다','']]);

/* 01 시기별 역할 */
(function(){
  const ERAS=[
    {n:'1950~1970년대',ic:'📏',k:'#2f6fd0',sub:'규칙 기반 인공지능 · 초기: ‘인간의 지능’을 기계에 투입',
     H:[['규칙 생성','지식과 경험을 바탕으로 규칙을 만들어 인공지능에 입력한다. 예: ‘만약 비가 오면 우산을 들고 나간다.’'],['시스템 설계','인공지능의 구조와 작동 방식을 설계해 어떤 순서로 규칙을 적용하고 어떤 정보가 필요한지 결정한다.'],['시스템 유지 및 관리','인공지능이 예상치 못하게 작동하거나 잘못된 결론을 내면 오류를 파악하고 규칙을 수정하거나 추가한다.'],['규칙 업데이트','새로운 지식이나 정보가 생기면 이를 반영해 규칙을 업데이트한다.']],
     A:[['규칙 실행','사전에 정의된 규칙과 알고리즘을 기반으로 작동하며 주어진 정보로 결론을 도출한다.'],['추론','논리 체계를 이용해 새로운 정보나 결론을 추론한다. 예: 「모든 인간은 죽는다. 소크라테스는 인간이다.」 → 「소크라테스는 죽는다.」'],['대표적 응용 분야','전문가 시스템 — 특정 분야의 전문 지식을 가진 사람들처럼 작동하는 컴퓨터 기반 시스템']],
     note:'규칙 기반 인공지능에서는 인간의 역할이 매우 중요하며, 인간의 지식과 경험으로 규칙을 생성하고 관리하는 것이 핵심이에요.'},
    {n:'1980~1990년대',ic:'📊',k:'#1f9d74',sub:'데이터 기반 인공지능 · 도약: 기계학습의 활용',
     H:[['데이터 준비 및 전처리','데이터를 수집, 정제, 라벨링하며 필요한 경우에는 특징을 수동으로 추출한다.'],['모델 평가 및 조정','모델의 성능을 평가하고, 성능이 만족스럽지 않으면 알고리즘의 파라미터*를 조정하거나 다른 알고리즘을 시도한다.'],['윤리적 고려','데이터 편향, 개인 정보 보호 등의 윤리적 문제를 고려한다.']],
     A:[['데이터 처리','제공된 데이터를 기반으로 자동으로 패턴을 학습하고, 간단한 알고리즘을 사용해 모델을 학습한다.'],['모델 학습','학습된 모델을 사용해 새로운 데이터에 대한 예측이나 분류를 수행한다.']],
     note:'* 파라미터: 최적의 훈련 모델을 구현하기 위해 학습하는 데 사용하는 조절 가능한 값'},
    {n:'2000년대 이후',ic:'✨',k:'#9b4fc4',sub:'데이터 기반 인공지능 · 현재: 딥러닝 및 생성형 인공지능의 발전',
     H:[['데이터 제공','인공지능이 학습할 수 있는 적절한 데이터를 수집하고 준비한다.'],['윤리적 고려','인공지능 서비스와 생성된 콘텐츠가 사회적, 문화적, 윤리적으로 적절한지 평가하고, 필요한 규제나 지침을 제정한다.'],['인간 중심의 가치 유지','기술의 발전으로 인간의 존재 가치와 중요성이 훼손되지 않도록 유지하고 강조한다.'],['인공지능과의 공존','인간과 인공지능이 어떻게 통합하고, 인공지능이 인간에게 도움이 될 수 있는 방안은 무엇인지 논의한다.']],
     A:[['자동 특징 추출 및 학습','딥러닝을 이용해 데이터에서 자동으로 특징을 추출하고 복잡한 패턴을 학습한다.'],['모델 학습','학습된 모델을 사용해 새로운 데이터에 대한 예측이나 분류를 수행한다.'],['콘텐츠 생성','학습된 데이터를 기반으로 텍스트 작성, 이미지 생성, 음악 작곡 등의 작업을 수행한다.']],
     note:'인공지능이 인간의 개입 없이 스스로 행동하고 창의적 결과물을 만드는 사례가 늘면서, 인공지능과의 공존 문제가 중요한 윤리적 이슈로 떠오르고 있어요.'},
  ];
  const SH=['규칙 만들기 · 시스템 설계와 관리','데이터 준비 · 모델 성능 관리','협력 · 윤리적 고려 · 인간 가치 지키기'];
  const bs=$('eraBtns'), v=$('eraView'), sh=$('eraShare');
  bs.innerHTML=ERAS.map((e,i)=>`<button data-i="${i}">${e.ic} ${e.n}</button>`).join('');
  const it=a=>a.map(x=>`<p class="it"><b>${x[0]}</b>${x[1]}</p>`).join('');
  function pick(i){
    const e=ERAS[i];
    [...bs.children].forEach((b,j)=>b.classList.toggle('on',i===j));
    v.innerHTML=`<p class="ha-era" style="--k:${e.k}">${e.sub}</p><div class="tlv"><div style="--k:${e.k}"><h4>🙋 인간의 역할</h4>${it(e.H)}</div><div style="--k:${e.k}"><h4>🤖 인공지능의 역할</h4>${it(e.A)}</div></div><p class="note">${e.note}</p>`;
    sh.innerHTML=`<span class="lb">인간 역할의 중심</span>`+SH.map((s,j)=>`<span class="${j===i?'on':j<i?'past':''}" style="--k:${ERAS[j].k}">${s}</span>`).join('<i>→</i>');
  }
  [...bs.children].forEach(b=>b.onclick=()=>pick(+b.dataset.i));
  pick(0);
})();

/* 01 어느 시기의 모습일까? */
sorter('eraGame',{
  cats:[{n:'📏 1950~1970년대',k:'#2f6fd0'},{n:'📊 1980~1990년대',k:'#1f9d74'},{n:'✨ 2000년대 이후',k:'#9b4fc4'}],
  items:[
    {t:'의사 여러 명의 진단 경험을 「열이 38도 이상이고 기침을 하면 ○○을 의심한다」 같은 문장으로 하나씩 입력한다.',c:0,ic:'🩺',short:'진단 경험을 문장으로 입력',w:'사람이 지식과 경험을 바탕으로 규칙을 만들어 넣는 규칙 기반 인공지능 시기의 모습이에요.'},
    {t:'프로그램이 잘못된 결론을 내자, 사람이 어느 문장이 틀렸는지 찾아내 직접 고쳐 넣는다.',c:0,ic:'🔧',short:'틀린 문장을 찾아 고침',w:'오류를 파악하고 규칙을 수정하는 시스템 유지 및 관리 역할이에요.'},
    {t:'사과 사진 수천 장에 「정상」, 「흠집」 이름표를 달고, 색과 크기 같은 특징을 사람이 직접 골라 준다.',c:1,ic:'🍎',short:'이름표 달기, 특징 직접 고르기',w:'데이터를 라벨링하고 필요하면 특징을 수동으로 추출하던 기계학습 활용 시기의 모습이에요.'},
    {t:'모델의 정확도가 낮게 나오자 사람이 파라미터를 조정하거나 다른 알고리즘으로 바꿔 본다.',c:1,ic:'🎛️',short:'파라미터 조정',w:'모델 평가 및 조정은 기계학습을 활용하던 시기에 인간이 맡은 역할이에요.'},
    {t:'인공지능이 만든 그림과 글이 사회적·문화적으로 적절한지 살피고, 필요한 규제와 지침을 만든다.',c:2,ic:'📜',short:'만든 콘텐츠 평가, 지침 마련',w:'생성된 콘텐츠를 평가하고 지침을 만드는 일은 딥러닝·생성형 인공지능 시기 인간의 윤리적 고려예요.'},
    {t:'인공지능이 수많은 음악에서 스스로 특징을 찾아 배우고, 이를 바탕으로 새로운 곡을 만든다.',c:2,ic:'🎵',short:'스스로 특징 추출, 작곡',w:'자동 특징 추출과 콘텐츠 생성은 딥러닝·생성형 인공지능 시기 인공지능의 역할이에요.'},
  ],
  end:'시기가 지날수록 인공지능이 스스로 하는 일이 늘고, 인간의 역할은 <b>규칙 만들기 → 데이터와 성능 관리 → 협력·윤리·인간 가치</b>로 옮겨 가요.'
});

/* 02 태양열 에너지 시스템 예시 */
const SOLAR=[
  {n:'창의성과 혁신',ic:'💡',k:'#e0702b',h:'에너지 문제를 인식하고 문제의 본질을 이해하며, 기존 에너지 시스템에 대한 경험과 지식을 바탕으로 새로운 아이디어나 해결책을 제안한다.',a:'기존 에너지 시스템의 문제를 분석하고 시뮬레이션해 인간의 사고 과정을 확장하고 창의적인 생각을 하도록 돕는다.'},
  {n:'의사 결정 지원',ic:'🧭',k:'#2f6fd0',h:'새로운 에너지 시스템이 성공하기 위한 전략과 계획을 최종 결정하고, 윤리적·사회적 문제가 없는지 검토한다.',a:'데이터 기반 예측 모델을 만들어 발생 또는 절차상의 문제가 없는지 예측하고, 객관적인 정보를 주어 인간의 의사 결정을 돕는다.'},
  {n:'노동력 분배',ic:'🛠️',k:'#1f9d74',h:'문제 해결에 참여하는 사람들 사이에서 전체적인 설계와 계획을 세우고 의견을 조율한다.',a:'에너지 시스템을 모니터링하고 효율을 분석하는 등 반복적이고 단순한 일을 도맡는다.'},
];
tabs('solarBtns','solarView',SOLAR,c=>`<div class="cards2 ha-solar" style="--k:${c.k}"><div class="kc" style="--k:${c.k}"><h4>🙋 인간의 역할</h4><p>${c.h}</p></div><div class="kc" style="--k:${c.k}"><h4>🤖 인공지능의 역할</h4><p>${c.a}</p></div></div>`);

/* 02 공공 자전거 대여소 · 누가 맡을까? */
sorter('bikeGame',{
  cats:[{n:'🙋 인간',k:'#2f6fd0'},{n:'🤖 인공지능',k:'#e0702b'}],
  items:[
    {t:'주민 간담회에서 들은 불편을 바탕으로 「대여소를 버스 정류장 바로 옆에 두자」는 새 아이디어를 낸다.',c:0,ic:'💬',short:'새 아이디어 제안',w:'창의성과 혁신 측면: 문제의 본질을 이해하고 새로운 아이디어를 내는 일은 인간이 잘해요.'},
    {t:'지난 3년의 대여·반납 기록으로 여러 배치안을 시뮬레이션해, 사람이 미처 떠올리지 못한 위치 후보까지 보여 준다.',c:1,ic:'🗺️',short:'배치안 시뮬레이션',w:'창의성과 혁신 측면: 분석과 시뮬레이션으로 인간의 생각을 넓혀 줘요.'},
    {t:'시간대·날씨별 대여 수요를 예측해 위치마다 예상 이용자 수를 객관적인 수치로 알려 준다.',c:1,ic:'📈',short:'수요 예측 정보 제공',w:'의사 결정 지원 측면: 대량의 데이터를 빠르게 분석해 결정에 필요한 정보를 줘요.'},
    {t:'여러 후보 가운데 어느 곳에 설치할지 최종 결정하고, 보행자 안전이나 특정 동네 소외 같은 문제가 없는지 검토한다.',c:0,ic:'⚖️',short:'최종 결정, 사회적 문제 검토',w:'의사 결정 지원 측면: 최종 결정과 윤리적·사회적 검토는 인간의 몫이에요.'},
    {t:'대여소마다 남은 자전거 수를 24시간 확인하고, 한쪽에 몰리면 옮길 대수를 날마다 계산한다.',c:1,ic:'🔁',short:'24시간 모니터링, 반복 계산',w:'노동력 분배 측면: 반복적이고 단순한 작업을 맡아 인간의 부담을 줄여요.'},
    {t:'구청 담당자, 정비 업체, 주민 대표 사이의 일정과 역할을 조율한다.',c:0,ic:'🤝',short:'참여자 사이 조율',w:'노동력 분배 측면: 참여하는 사람들 사이의 계획을 세우고 의견을 조율하는 일은 인간이 해요.'},
  ],
  end:'인간은 <b>아이디어 · 최종 결정 · 조율</b>을, 인공지능은 <b>분석 · 예측 · 반복 작업</b>을 맡으면 서로의 강점이 살아나요.'
});

/* 03 개념 정리하기 빈칸 · 성취도 평가 */
document.querySelectorAll('.ha-blank').forEach(b=>b.onclick=()=>{const on=!b.classList.contains('on'); b.textContent=on?b.dataset.a:'?'; b.classList.toggle('on',on);});
vote('selfVote','collabCheck',[['예','설명할 수 있어요'],['아니요','01·02를 다시 봐요']]);

/* 04 맞춤 활동 */
chips('fitPick','fitPick',['길 안내 앱','번역 앱','스마트 스피커','학습 도우미 앱','스팸 메일 필터','직접 정하기'],false);
chips('selfCheck','selfCheckPick',['지능 에이전트의 개념과 특성을 이해하고 인간과 인공지능의 관계를 설명할 수 있다','인공지능과 지능 에이전트의 관계를 이해하고 인간과 인공지능의 역할을 분석할 수 있다','지능 에이전트를 일상생활과 연결 짓고 그 가치를 표현할 수 있다'],true);
vote('extraVote','extraPick',[['보충','Frozen Lake 관찰하기'],['심화','로봇 고양이 설계하기']],i=>{$('extraBasic').classList.toggle('on',i===0); $('extraDeep').classList.toggle('on',i===1);});

/* 04 보충 · Frozen Lake 직접 건너 보기 */
(function(){
  const MAP=['SFFF','FHFH','FFFH','HFFG'].join('').split(''), NC=4;
  const DIR=[['←',0,-1],['↓',1,0],['→',0,1],['↑',-1,0]];   /* 0 왼쪽 1 아래 2 오른쪽 3 위 (교과서 노트북과 같은 번호) */
  const move=(s,a)=>{const r=Math.floor(s/NC)+DIR[a][1], c=s%NC+DIR[a][2]; return (r<0||r>=NC||c<0||c>=NC)?s:r*NC+c;};
  const slip=a=>[(a+3)%4,a,(a+1)%4][Math.floor(Math.random()*3)];   /* 미끄러운 얼음: 원하는 방향 또는 양옆으로 1/3씩 */
  const B=$('lakeGame'); let pos=0, steps=0, tries=0, goals=0, over=false, rnd=null;   /* tries: 한 번이라도 움직인 시도 수 */
  B.innerHTML=`<div class="ha-lake"></div><div class="ha-lakepad">${[3,0,1,2].map(a=>`<button class="btn ghost sm" data-a="${a}">${DIR[a][0]}</button>`).join('')}</div><div class="ha-lakemsg"></div><div class="row"><button class="btn ghost sm" id="lakeAgain">처음 자리로</button><button class="btn ghost sm" id="lakeRand">🎲 무작위 에이전트 100판</button></div><div class="ha-lakemsg" id="lakeRandMsg"></div>`;
  const G=B.querySelector('.ha-lake'), msg=B.querySelector('.ha-lakemsg');
  const ICON={S:'🚩',F:'🧊',H:'🕳️',G:'🎁'};
  function draw(){ G.innerHTML=MAP.map((m,i)=>`<span class="${m}">${i===pos?(MAP[i]==='H'?'💦':'🧍'):ICON[m]}</span>`).join(''); }
  function rec(){ MEMO.lakeRes=`직접 건너기 ${tries}번 시도 중 ${goals}번 도착`+(rnd!=null?` · 무작위 에이전트 100판 중 ${rnd}번 도착`:''); store.set(MK,MEMO); }
  B.querySelectorAll('.ha-lakepad button').forEach(b=>b.onclick=()=>{
    if(over){msg.innerHTML='「처음 자리로」를 눌러 다시 출발해요.';return;}
    const a=+b.dataset.a, real=slip(a); if(steps===0) tries++; pos=move(pos,real); steps++;
    let t=real===a?`${DIR[a][0]} 쪽으로 움직였어요.`:`${DIR[a][0]}를 눌렀는데 얼음이 미끄러워 <b>${DIR[real][0]}</b> 쪽으로 미끄러졌어요.`;
    if(MAP[pos]==='H'){over=true; t+=' <span class="ng">구멍에 빠졌어요!</span>';}
    else if(MAP[pos]==='G'){over=true; goals++; t+=` <span class="ok">도착했어요! (${steps}번 움직임)</span>`;}
    msg.innerHTML=t; draw(); rec();
  });
  $('lakeAgain').onclick=()=>{ pos=0; steps=0; over=false; msg.textContent='출발점에서 다시 시작해요.'; draw(); };
  $('lakeRand').onclick=()=>{
    let ok=0;
    for(let e=0;e<100;e++){ let s=0; for(let k=0;k<100;k++){ s=move(s,slip(Math.floor(Math.random()*4))); if(MAP[s]==='H') break; if(MAP[s]==='G'){ok++;break;} } }
    rnd=ok; $('lakeRandMsg').innerHTML=`무작위로 움직이는 에이전트가 100판 중 <b>${ok}판</b> 도착했어요. 학습하지 않고 아무렇게나 움직이면 어떤지, 다시 눌러 비교해 봐요.`; rec();
  };
  draw(); msg.textContent='🚩에서 🎁까지 가요. 🕳️에 빠지면 실패예요.';
})();

/* 05 마무리 */
const MEMOLIST=[['firstView','처음 생각(경쟁 또는 협력)'],['firstWhy','처음 생각의 까닭'],['roleChange','시기별 인간의 역할 변화'],['bikeWhy','자전거 대여소 일을 나눈 까닭'],['goodPts','협력의 이로운 점'],['badPts','협력의 부정적인 점과 줄이는 방법'],['caseName','내가 찾은 협력 사례'],['caseCH','사례 · 창의성과 혁신(인간)'],['caseCA','사례 · 창의성과 혁신(인공지능)'],['caseDH','사례 · 의사 결정 지원(인간)'],['caseDA','사례 · 의사 결정 지원(인공지능)'],['caseLH','사례 · 노동력 분배(인간)'],['caseLA','사례 · 노동력 분배(인공지능)'],['collabCheck','성취도 평가'],['fitPick','분석한 지능 에이전트'],['fitName','지능 에이전트의 종류'],['fitP','맞춤 활동 · 인식'],['fitL','맞춤 활동 · 학습'],['fitR','맞춤 활동 · 추론'],['fitA','맞춤 활동 · 행동'],['devCH','개발 · 창의성과 혁신(인간)'],['devCA','개발 · 창의성과 혁신(인공지능)'],['devDH','개발 · 의사 결정 지원(인간)'],['devDA','개발 · 의사 결정 지원(인공지능)'],['devLH','개발 · 노동력 분배(인간)'],['devLA','개발 · 노동력 분배(인공지능)'],['fitValue','지능 에이전트가 필요한 이유와 가치'],['selfCheckPick','학업 성취도 점검'],['extraPick','고른 선택 활동'],['lakeRes','Frozen Lake 결과'],['flP','보충 · Frozen Lake 인식'],['flL','보충 · Frozen Lake 학습'],['flR','보충 · Frozen Lake 추론'],['flA','보충 · Frozen Lake 행동'],['catP','심화 · 로봇 고양이 인식'],['catL','심화 · 로봇 고양이 학습'],['catR','심화 · 로봇 고양이 추론'],['catA','심화 · 로봇 고양이 행동'],['keyQ','핵심 질문에 대한 내 답'],['newLearn','새롭게 알게 된 점']];
/* 접어 둔 표와 선택 활동(보충·심화) 메모는 쓴 묶음만 모아 보기에 보여 줌 */
const OPT=[['caseName','caseCH','caseCA','caseDH','caseDA','caseLH','caseLA'],['devCH','devCA','devDH','devDA','devLH','devLA'],['lakeRes','flP','flL','flR','flA'],['catP','catL','catR','catA']];
onShow[5]=()=>{const hide=OPT.filter(g=>!g.some(k=>String(MEMO[k]||'').trim())).flat(); memoSummary('msum',MEMOLIST.filter(([k])=>!hide.includes(k)));};
