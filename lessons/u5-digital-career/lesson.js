
/* 01 기존 직업의 디지털화 */
const JOBS=[
  {n:'간호사',ic:'🧑‍⚕️',p:'아날로그 신장 측정기와 체중계에 올라서면, 사람이 직접 수치를 재서 기록해요.',c:'신체 계측 자동화 시스템을 사용해 신체 정보 데이터를 처리해요.'},
  {n:'심판',ic:'🧑‍⚖️',p:'축구, 야구 경기 중에 잘못된 판정을 내릴 수 있어요.',c:'초고속 카메라로 다시 보거나 인공지능이 인식한 결과를 바탕으로 판정해요.'},
  {n:'만화 작가',ic:'🎨',p:'종이에 그림을 그려요.',c:'태블릿을 사용해 자유롭게 그림을 그리고 색칠해요.'},
];
tabs('jobBtns','jobView',JOBS,j=>`<div class="flow2 dc-pc"><div style="--k:#8a94a6"><b>⏪ 과거</b>${j.p}</div><div class="dc-to">▶</div><div style="--k:#2f6fd0"><b>💻 디지털화</b>${j.c}</div></div>`);

/* 01 누가 맡는 일일까? */
sorter('roleGame',{
  cats:[{n:'🤖 디지털 기술이 맡는 일',k:'#2f6fd0'},{n:'🙋 사람이 맡는 일',k:'#e0702b'}],
  items:[
    {t:'경기장 곳곳에서 공과 선수의 움직임을 초고속으로 촬영해 저장하는 일',c:0,ic:'🎥',short:'공과 선수 움직임 촬영',w:'빠르고 정확하게 기록하는 일은 디지털 기술이 잘해요.'},
    {t:'다시 보기 화면과 인식 결과를 살핀 뒤, 경기 규칙에 비추어 최종 판정을 내리는 일',c:1,ic:'🧑‍⚖️',short:'규칙에 비추어 최종 판정',w:'기술이 준 결과를 경기 규칙이라는 전문 지식으로 해석하고 책임지는 것은 사람의 몫이에요.'},
    {t:'몸에 지닌 칩을 인식해 키와 몸무게를 재고, 의료 정보 시스템으로 보내는 일',c:0,ic:'📏',short:'키, 몸무게 측정과 전송',w:'측정하고 기록하고 필요한 곳에 보내는 과정은 디지털화되었어요.'},
    {t:'측정 결과에서 걱정되는 부분을 찾아, 환자에게 알맞은 돌봄을 계획하는 일',c:1,ic:'🩺',short:'환자에게 알맞은 돌봄 계획',w:'데이터를 보고 환자에게 무엇이 필요한지 판단하려면 간호의 전문 지식이 필요해요.'},
    {t:'선으로 둘러싸인 넓은 영역을 고른 색으로 한 번에 빈틈없이 칠하는 일',c:0,ic:'🖌️',short:'영역 한 번에 색칠',w:'반복되는 채색 작업은 태블릿 그림 프로그램이 빠르게 처리해 줘요.'},
    {t:'독자에게 전할 이야기와 인물의 감정이 잘 드러나는 장면 구성을 정하는 일',c:1,ic:'📖',short:'이야기와 장면 구성',w:'무엇을 어떻게 표현할지 정하는 창작의 중심은 여전히 작가에게 있어요.'},
  ],
  end:'측정 · 기록 · 전송처럼 <b>데이터를 모으고 처리하는 일</b>은 기술이 맡고, 사람은 <b>전문 지식으로 판단하고, 목적에 맞는 기술을 골라 쓰는 일</b>에 더 집중하게 되었어요.'
});

/* 02 주목받는 직업 카드 */
const CAREERS=[
  {ic:'🧠',f:'인공지능 전문가',b:'인공지능 지식과 기술을 바탕으로 다양한 분야에서 필요한 인공지능 관련 프로그램을 개발해요.',x:'관련 학과 · 인공지능학, 컴퓨터 공학, 뇌인지 공학, 뇌 과학, 수학, 심리학 등'},
  {ic:'🔐',f:'클라우드 시스템 정보 보안 전문가',b:'클라우드의 보안을 강화하기 위해 각종 보안 문제를 수집, 분석해 대책을 마련하고 예방 프로그램을 개발해요.',x:'관련 학과 · 컴퓨터 공학, 소프트웨어학, 정보 보안, 사이버 보안 등'},
  {ic:'🌫️',f:'지능형 오염 물질 측정 장치 개발자',b:'사물 인터넷에 기반을 둔 대기질, 수질, 토양 등의 모니터링 장비를 개발해요.',x:'관련 학과 · 전자, 전기, 기계, 화학 공학, 생명 공학, 물리, 컴퓨터 공학 등'},
  {ic:'🌱',f:'환경 빅데이터 전문가',b:'환경 관련 빅데이터를 구축하고, 수집한 데이터를 바탕으로 의사 결정을 해요.',x:'관련 학과 · 환경 공학, 컴퓨터 공학, 통계학, 빅데이터 등'},
  {ic:'🛢️',f:'데이터 엔지니어',b:'데이터를 어떻게 수집, 저장, 관리할 것인지 고민하여 필요한 플랫폼을 개발해요.',x:'관련 학과 · 컴퓨터 공학, 빅데이터, 인공지능학 등'},
  {ic:'🦺',f:'스마트 안전 관리사',b:'인공지능, VR, AR, 드론 등을 사용해 건설 현장의 안전을 관리하고 사고를 예방하기 위한 전략을 짜요.',x:'관련 학과 · 건축, 토목, 정보 통신, 드론, 자원 공학, 건설 안전 공학, 빅데이터 등'},
  {ic:'🥽',f:'VR·AR 콘텐츠 기획가',b:'직업 훈련, 군사, 관광, 전시 안전, 예술 등 다양한 분야에서 필요한 VR·AR 콘텐츠를 기획해요.',x:'관련 학과 · 게임 개발, 게임 기획, 교육학, 3D 그래픽 등'},
  {ic:'🚗',f:'미래 자동차 전문가',b:'전기차, 커넥티드카, 자율주행 자동차 등 정보 통신 기술 기반의 친환경 자동차를 연구해요.',x:'관련 학과 · 자동차 공학, 전기·전자 공학, 컴퓨터 공학, 화학 및 재료 공학, 반도체 등'},
];
flipCards('jobCards',CAREERS.map(c=>({...c,s:'눌러서 하는 일 보기'})));
chips('jobPick','jobPick',[...CAREERS.map(c=>c.f),'목록에 없는 직업'],false);

/* 03 어떤 역량이 보일까? */
sorter('compGame',{
  cats:[{n:'📚 지식 정보 처리',k:'#2f6fd0'},{n:'💻 컴퓨팅 사고',k:'#1f9d74'},{n:'💡 창의적 사고',k:'#e0702b'},{n:'🗣️ 협력적 소통',k:'#d64535'},{n:'🌍 공동체 역량',k:'#0f8a9d'}],
  items:[
    {t:'같은 사건을 다룬 기사 세 개를 비교하고 출처를 확인한 뒤, 믿을 수 있는 내용을 골라 보고서에 쓴다.',c:0,ic:'📰',short:'기사 비교, 출처 확인',w:'여러 정보를 깊이 이해하고 따져 보며 활용하는 모습이에요.'},
    {t:'생성형 인공지능이 알려 준 답을 그대로 옮기지 않고, 교과서와 다른 자료로 사실인지 확인한다.',c:0,ic:'🔎',short:'인공지능 답 사실 확인',w:'인공지능 기술을 이해하고 그 결과를 비판적으로 탐구하며 활용하는 능력이에요.'},
    {t:'급식 잔반 기록을 표 계산 프로그램으로 정리해 많이 남는 메뉴의 규칙을 찾고, 줄일 방법을 제안한다.',c:1,ic:'🍱',short:'잔반 기록으로 규칙 찾기',w:'데이터를 빠르고 정확하게 처리하는 도구로 생활 속 문제를 발견, 분석하고 해결 방법을 제시했어요.'},

    {t:'음악 시간에 배운 리듬과 코딩 경험을 합쳐, 손뼉 소리에 맞춰 불빛이 바뀌는 작품을 만든다.',c:2,ic:'🎶',short:'리듬과 코딩을 합친 작품',w:'서로 다른 분야의 지식과 경험을 합쳐 새로운 것을 만들어 냈어요.'},
    {t:'모둠 회의에서 나와 다른 의견을 끝까지 듣고, 내 생각을 차분히 설명해 함께 역할을 나눈다.',c:3,ic:'👂',short:'다른 의견 듣고 역할 나누기',w:'다른 관점을 존중하며 경청하고 내 생각을 표현해 공동의 목적을 이루는 모습이에요.'},
    {t:'동네 어르신들이 무인 주문기를 쉽게 쓸 수 있도록 사용법 안내 봉사에 꾸준히 나간다.',c:4,ic:'🤝',short:'어르신 주문기 사용 안내 봉사',w:'내가 속한 지역의 구성원으로서 함께 발전하는 데 책임감 있게 참여하는 모습이에요.'},

  ],
  end:'한 장면에 여러 역량이 함께 쓰일 때도 많아요. 내 희망 직업에는 어떤 역량이 특히 중요할지 다음 화면에서 점수로 매겨 봐요.'
});

/* 04 희망 직업 이름 표시 */
(function(){
  const inp=document.querySelector('[data-memo="myJob"]'), lb=$('jobLabel');
  const draw=()=>lb.textContent=(inp.value||MEMO.myJob||'').trim()||'나의 희망 직업';
  inp.addEventListener('input',draw); draw();
})();

/* 04 역량 중요도 그래프 (오각형) */
(function(){
  const sl=[...$('compSliders').querySelectorAll('input[type=range]')];
  const names=['창의적 사고','지식 정보 처리','컴퓨팅 사고','공동체 역량','협력적 소통'];
  const cx=150, cy=140, R=96, ang=i=>(-90+72*i)*Math.PI/180;
  const pt=(i,r)=>[cx+r*Math.cos(ang(i)), cy+r*Math.sin(ang(i))];
  const svg=$('compRadar');
  const val=s=>{const v=MEMO[s.dataset.memo]; return +(v!=null&&v!==''?v:s.value);};
  function draw(){
    const v=sl.map(val);
    sl.forEach((s,i)=>s.nextElementSibling.textContent=v[i]);
    let h='';
    for(let k=1;k<=5;k++) h+=`<polygon points="${names.map((_,i)=>pt(i,R*k/5).join(',')).join(' ')}" fill="none" stroke="#d9dee7" stroke-width="1"/>`;
    names.forEach((_,i)=>{const [x,y]=pt(i,R); h+=`<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#d9dee7"/>`;});
    h+=`<polygon points="${v.map((x,i)=>pt(i,R*x/5).join(',')).join(' ')}" fill="rgba(224,112,43,.25)" stroke="#e0702b" stroke-width="2.5"/>`;
    v.forEach((x,i)=>{const [px,py]=pt(i,R*x/5); h+=`<circle cx="${px}" cy="${py}" r="4" fill="#e0702b"/>`;});
    names.forEach((n,i)=>{const [x,y]=pt(i,R+18); const a=Math.abs(x-cx)<4?'middle':(x>cx?'start':'end'); h+=`<text x="${x}" y="${y+4}" text-anchor="${a}" font-size="12.5" font-weight="700" fill="#33404f">${n}</text>`;});
    svg.innerHTML=h;
    const sum=v.reduce((a,b)=>a+b,0), set=sl.some(s=>MEMO[s.dataset.memo]!=null&&MEMO[s.dataset.memo]!=='');
    $('compTotal').innerHTML=set?`합계 <b>${sum}점</b> / 25점`:'<span class="muted">슬라이더를 움직여 점수를 매겨 봐요.</span>';
  }
  sl.forEach(s=>s.addEventListener('input',()=>{sl.forEach(x=>{if(x===s||MEMO[x.dataset.memo]==null||MEMO[x.dataset.memo]==='') MEMO[x.dataset.memo]=x.value;}); store.set(MK,MEMO); draw();}));
  draw();
})();
chips('needPick','needPick',['지식 정보 처리','컴퓨팅 사고','창의적 사고','협력적 소통','공동체 역량'],false);
document.querySelectorAll('.dc-blank').forEach(b=>b.onclick=()=>{const on=!b.classList.contains('on'); b.textContent=on?b.dataset.a:'?'; b.classList.toggle('on',on);});
vote('selfVote','careerCheck',[['예','진로를 설계할 수 있어요'],['아니요','01~03을 다시 봐요']]);

/* 05 정리 · 학업 성취도 점검과 선택 활동 */
chips('selfCheck','selfCheckPick',['디지털 기술의 발전이 사회에 미치는 영향을 설명할 수 있다','디지털 기술의 발전에 따른 사회 변화와 연계하여 진로를 설계할 수 있다','디지털 기술의 발전으로 변화할 미래 사회를 예측하여 통찰하는 자세를 갖추었다'],true);
vote('extraVote','extraPick',[['보충','새로 생겨난 직업 조사하기'],['심화','미래학자가 되어 예측하기']],i=>{$('extraBasic').classList.toggle('on',i===0); $('extraDeep').classList.toggle('on',i===1);});

/* 06 마무리 */
const MEMOLIST=[['dreamField','나의 희망 진로 분야'],['firstThought','처음 생각(디지털 기술이 더해지면)'],['roleWhy','디지털화로 달라진 사람의 일'],['jobPick','관심 가는 직업'],['jobWhy','관심 직업과 디지털 기술'],['myJob','나의 희망 진로 분야 직업'],['jobIot','희망 직업 · 사물 인터넷'],['jobCloud','희망 직업 · 클라우드'],['jobData','희망 직업 · 빅데이터'],['jobAi','희망 직업 · 인공지능'],['cmpCre','중요도 · 창의적 사고(점)'],['cmpInfo','중요도 · 지식 정보 처리(점)'],['cmpComp','중요도 · 컴퓨팅 사고(점)'],['cmpComu','중요도 · 공동체 역량(점)'],['cmpComm','중요도 · 협력적 소통(점)'],['needPick','나에게 가장 필요한 역량'],['compPlan','역량을 고른 까닭과 실천 계획'],['careerCheck','성취도 평가'],['fitPast','맞춤 활동 · 과거'],['fitNow','맞춤 활동 · 현재'],['fitMajor','진로 희망 학과'],['fitLearn','희망 학과에서 배우는 내용'],['fitFuture','디지털 기술과 융합한 미래 사회'],['rule1','규칙 1'],['rule2','규칙 2'],['selfCheckPick','학업 성취도 점검'],['extraPick','고른 선택 활동'],['newJobName','보충 · 직업명'],['newJobDo','보충 · 하는 일'],['newJobFit','보충 · 필요한 적성 또는 흥미'],['futTech','심화 · 10년간 영향이 클 기술'],['futChange','심화 · 10년 후의 변화'],['keyQ','핵심 질문에 대한 내 답'],['newLearn','새롭게 알게 된 점']];
/* 접어 둔 활동과 선택 활동(보충·심화) 메모는 쓴 묶음만 모아 보기에 보여 줌 */
const OPT=[['jobWhy'],['fitMajor','fitLearn','fitFuture'],['rule2'],['selfCheckPick','extraPick'],['newJobName','newJobDo','newJobFit'],['futTech','futChange']];
onShow[6]=()=>{const hide=OPT.filter(g=>!g.some(k=>String(MEMO[k]||'').trim())).flat(); memoSummary('msum',MEMOLIST.filter(([k])=>!hide.includes(k)));};
