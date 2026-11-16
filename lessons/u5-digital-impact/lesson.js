
/* 0 나의 학습 준비 · 디지털 사회의 특성 */
chips('featPick','featPick',['온라인 의사소통','편리한 정보 접근','빅데이터 사용','로봇에 의한 자동화','빠른 속도의 기술 발전','새롭게 생겨나는 직업','디지털 기술로 대체되어 사라지는 직업'],true);

/* 01 스마트폰 속 디지털 기술의 흐름 */
(function(){
  const ST=[
    {ic:'📡',n:'센서가 알아차리기',t:'스마트폰에 들어 있는 여러 가지 <b>센서</b>가 주변 환경을 알아차려요.'},
    {ic:'📶',n:'통신하기',t:'스마트폰이 다른 사물과 <b>통신</b>해서 실시간으로 우리에게 정보를 알려 줘요.'},
    {ic:'🗄️',n:'빅데이터로 쌓이기',t:'이렇게 모인 정보가 계속 쌓이면 <b>빅데이터</b>가 돼요.'},
    {ic:'🤖',n:'인공지능이 분석하기',t:'<b>인공지능</b>은 이 방대한 양의 데이터 가운데 <b>의미 있는 정보</b>가 무엇인지 분석해요.'},
    {ic:'😊',n:'편리한 삶',t:'디지털 기술이 적용된 <b>기기와 서비스</b> 덕분에 우리는 편리하고 쾌적한 삶을 살 수 있게 되었어요.'},
  ];
  const bs=$('phoneFlow'), v=$('phoneView');
  bs.innerHTML=ST.map((s,i)=>`<button data-i="${i}"><i>${s.ic}</i><b>${i+1}. ${s.n}</b></button>`).join('<span class="di-ar">→</span>');
  const btns=[...bs.querySelectorAll('button')];
  function pick(i){
    btns.forEach((b,j)=>{b.classList.toggle('on',j===i); b.classList.toggle('past',j<i);});
    v.innerHTML=`<p>${ST[i].ic} ${ST[i].t}</p>`+(i<ST.length-1?`<button class="btn sm" id="phoneNext">다음 단계 →</button>`:'<p class="note" style="margin:0">센서 → 통신 → 빅데이터 → 인공지능 → 편리한 서비스. 오늘 배울 기술들이 이렇게 이어져 있어요.</p>');
    const n=$('phoneNext'); if(n) n.onclick=()=>pick(i+1);
  }
  btns.forEach(b=>b.onclick=()=>pick(+b.dataset.i));
  pick(0);
})();

/* 01 생각해 보기 · 어제 한 일 */
chips('dayPick','dayPick',['온라인 쇼핑','영상 통화','지도 앱으로 길 찾기','음악 스트리밍','교통 카드로 버스 타기','키오스크로 주문','온라인 수업 듣기','번역 앱 쓰기','메신저로 숙제 공유'],true);

/* 02 과거와 지금 */
const TECH=[
  {n:'사물 인터넷',ic:'📶',k:'#2f6fd0',link:'Ⅰ단원 사물 인터넷(교과서 25쪽)',
   d:'일상생활에서 쓰는 여러 가지 사물이 사물 인터넷을 통해 일종의 단말기가 되어, <b>사물끼리 네트워크</b>를 만들 수 있게 되었어요. 농업, 도시 설계, 가전제품 제작 등 다양한 분야에서 활용돼요.',
   p:'의약품을 멀리 옮기는 사람이 「가는 동안 온도, 습도를 어떻게 유지하지?」 하고 걱정했어요.',
   c:'센서가 온도, 습도를 감지해 알맞게 맞춰 주어 의약품을 옮기기가 편리해졌어요.'},
  {n:'클라우드',ic:'☁️',k:'#9b4fc4',link:'Ⅰ단원 클라우드(교과서 19쪽)',
   d:'외장 하드 디스크, USB 같은 <b>이동형 저장 장치</b>로 데이터를 전달하던 방식을 바꾸어 놓았어요. 여러 기업이 클라우드를 써서 <b>적은 자본</b>으로 사업을 시작할 수 있게 되었어요.',
   p:'문서를 이동형 저장 장치에 넣어 직접 건네주어야 했어요.',
   c:'공유할 문서를 클라우드에 올리면 멀리 있어도 받아 볼 수 있어요. 언제 어디서든 쓸 수 있고 비용도 줄어요.'},
  {n:'빅데이터',ic:'📊',k:'#e0702b',link:'Ⅱ단원 빅데이터(교과서 67쪽)',
   d:'일상의 다양한 활동을 디지털 데이터로 기록할 수 있게 되면서, <b>빅데이터를 기반으로 문제를 해결</b>하는 사례가 늘고 있어요. 특정 질환을 앓는 사람들의 행동 데이터를 분석해 병의 원인을 찾는 것이 대표적인 예예요.',
   p:'의사가 환자들의 기록과 처방을 하나하나 꼼꼼히 적어 두어야 했어요.',
   c:'쌓인 데이터를 분석해 원인을 찾고 해결 방안을 모색할 수 있어요.'},
  {n:'인공지능',ic:'🤖',k:'#d64535',link:'Ⅳ단원 인공지능(교과서 165쪽)',
   d:'사람만 할 수 있다고 여겨졌던 일을 <b>컴퓨터도 할 수 있다</b>는 가능성을 보여 주고 있어요. 특히 뛰어난 성능의 <b>딥러닝</b> 기술은 환경, 의료, 제조, 교육 등 다양한 분야에서 활용돼요.',
   p:'산불이 나면 사람이 헬기를 타고 날아가 불이 난 지역을 찾았어요.',
   c:'사람이 직접 가지 않고도 드론으로 산불이 난 지역을 찾아낼 수 있어요.'},
];
tabs('techBtns','techView',TECH,t=>`<p style="margin-top:0">${t.d}</p><div class="flow2 di-pc"><div style="--k:#8a94a6"><b>⏪ 과거</b>${t.p}</div><div class="di-to">▶</div><div style="--k:${t.k}"><b>${t.ic} 지금</b>${t.c}</div></div><p class="note">앞에서 배운 곳 · ${t.link}</p>`);

/* 02 어떤 디지털 기술일까? */
sorter('techGame',{
  cats:[{n:'📶 사물 인터넷',k:'#2f6fd0'},{n:'☁️ 클라우드',k:'#9b4fc4'},{n:'📊 빅데이터',k:'#e0702b'},{n:'🤖 인공지능',k:'#d64535'}],
  items:[
    {t:'화분 흙에 꽂아 둔 장치가 흙이 마르면 스스로 알아차리고 스마트폰으로 물 줄 때를 알려 준다.',c:0,ic:'🪴',short:'화분 흙 마름 알림',w:'사물에 붙은 센서가 상태를 알아차리고 네트워크로 알려 주는 모습이에요.'},
    {t:'우리 집 보일러가 내 스마트폰의 위치 정보를 받아, 내가 집 근처에 오면 미리 난방을 켠다.',c:0,ic:'🔥',short:'보일러가 미리 난방',w:'집 안의 사물이 네트워크로 정보를 주고받으며 스스로 움직이는 모습이에요.'},
    {t:'모둠 발표 자료를 온라인 저장 공간에 올려 두고, 친구들이 각자 집에서 같은 파일을 함께 고친다.',c:1,ic:'📝',short:'온라인 저장 공간에서 함께 고치기',w:'이동형 저장 장치 없이 언제 어디서든 같은 파일을 쓰는 모습이에요.'},

    {t:'교통 카드 이용 기록 수백만 건을 살펴 사람이 몰리는 시간과 구간에 버스를 더 배치한다.',c:2,ic:'🚌',short:'교통 카드 기록으로 버스 배치',w:'일상 활동이 남긴 많은 데이터를 분석해 문제를 해결하는 모습이에요.'},

    {t:'과일 공장의 컴퓨터가 컨베이어 벨트 위 과일 사진을 보고, 상처 난 과일을 스스로 골라낸다.',c:3,ic:'🍑',short:'상처 난 과일 골라내기',w:'사람만 할 수 있다고 여겨졌던 판단을 컴퓨터가 해내는 모습이에요.'},
    {t:'온라인 강의 프로그램이 외국어 강의를 알아듣고, 실시간으로 우리말 자막을 만들어 보여 준다.',c:3,ic:'🌏',short:'실시간 자막 만들기',w:'말을 알아듣고 다른 언어로 옮기는 일은 딥러닝이 활용되는 대표적인 분야예요.'},
  ],
  end:'여러 기술이 함께 쓰이는 경우도 많아요. 예를 들어 센서가 모은 정보가 <b>빅데이터</b>로 쌓이고, <b>클라우드</b>에 저장되어, <b>인공지능</b>이 분석하기도 해요.'
});

/* 03 미래 기술 카드 */
flipCards('futureCards',[
  {ic:'🪟',f:'투명 모니터',s:'눌러서 뜻과 사례 보기',b:'평소에는 모니터처럼 정보를 확인할 수 있으면서, 모니터 뒤의 모습도 비치는 투명한 형태의 액정 기술이에요.',x:'열차 창문에 달면 차 안에서 업무를 쉽게 처리하고, 집 창문을 TV로, 건물 유리창을 광고판으로 쓸 수 있어요.'},
  {ic:'🚜',f:'자율주행',s:'눌러서 뜻과 사례 보기',b:'운전자가 직접 조작하지 않아도 차량의 외부 환경을 인지하고 판단해 스스로 목적지까지 주행하도록 돕는 기술이에요.',x:'자율주행 트랙터는 PC와 스마트폰으로 실시간 관찰할 수 있고, 운전자 없이 농장 일을 해서 농업 인력 문제를 덜어 줘요.'},
  {ic:'⌚',f:'웨어러블',s:'눌러서 뜻과 사례 보기',b:'전자 기기를 손목, 팔, 머리 등 몸에 지니고 다닐 수 있는 기기로 만드는 기술이에요.',x:'디지털 헬스케어 기기(안경, 헤드셋, 반지)가 뇌파, 심전도, 심박수 같은 생체 신호로 환자의 건강 이상을 미리 예측해요.'},
  {ic:'🌐',f:'메타버스',s:'눌러서 뜻과 사례 보기',b:'「메타(meta)」와 「유니버스(universe)」를 합친 말로, 3차원 가상 공간에서 실세계와 같은 사회, 문화 등의 활동이 이루어지게 하는 기술이에요.',x:'임시정부기념관 메타버스에서 문제를 해결하며 상호 작용해요. 가치를 만들어 내는 새로운 산업 분야로 발전하고 있어요.'},
]);
vote('futureVote','futurePick',[['🪟 투명 모니터',''],['🚜 자율주행',''],['⌚ 웨어러블',''],['🌐 메타버스','']]);

/* 04 함께 해결하기 */
chips('myTechPick','myTechPick',['사물 인터넷','클라우드','빅데이터','인공지능','투명 모니터','자율주행','웨어러블','메타버스','직접 조사한 기술'],false);
(function(){
  const box=$('myTechPick'), my=document.querySelector('[data-memo="myTech"]'), fr=document.querySelector('[data-memo="friendTech"]');
  const fa=$('fuseA'), fb=$('fuseB');
  const draw=()=>{fa.textContent=(fr.value||MEMO.friendTech||'').trim()||'친구의 기술'; fb.textContent=(my.value||MEMO.myTech||'').trim()||'나의 기술';};
  const LIST=['사물 인터넷','클라우드','빅데이터','인공지능','투명 모니터','자율주행','웨어러블','메타버스'];
  box.addEventListener('memo',()=>{const t=MEMO.myTechPick||'', cur=my.value.trim(); if(t&&t!=='직접 조사한 기술'&&(!cur||LIST.includes(cur))){my.value=t; my.dispatchEvent(new Event('input'));} draw();});
  [my,fr].forEach(x=>x.addEventListener('input',draw));
  draw();
})();
[['emp1Pct','emp1Out'],['emp2Pct','emp2Out']].forEach(([r,o])=>{
  const R=$(r), O=$(o), show=v=>O.textContent=v+'%'; /* 처음엔 「–」, 움직여야 저장됨 */
  if(MEMO[r]!=null&&MEMO[r]!=='') show(MEMO[r]);
  R.addEventListener('input',()=>show(R.value));
});
document.querySelectorAll('.di-blank').forEach(b=>b.onclick=()=>{const on=!b.classList.contains('on'); b.textContent=on?b.dataset.a:'?'; b.classList.toggle('on',on);});
vote('selfVote','impactCheck',[['예','설명하고 예측할 수 있어요'],['아니요','02·03을 다시 봐요']]);

/* 05 마무리 */
const MEMOLIST=[['planMemo','학습 계획'],['featPick','내가 느끼는 디지털 사회의 특성'],['dayPick','어제 쓴 디지털 기술'],['myDigital','디지털 기술이 없다면'],['hbIot','해 보기 · 사물 인터넷'],['hbCloud','해 보기 · 클라우드'],['hbData','해 보기 · 빅데이터'],['hbAi','해 보기 · 인공지능'],['futurePick','가장 먼저 들어올 기술'],['futureTalk','미래 기술의 변화와 논의할 점'],['myTechPick','고른 기술 카드'],['friendTech','친구가 고른 기술'],['friendUse','친구 기술의 활용 예'],['myTech','내가 고른 기술'],['myUse','내 기술의 활용 예'],['fuseIdea','융합 아이디어'],['emp1Who','친구 1'],['emp1Pct','친구 1 공감(%)'],['emp1Why','친구 1 까닭'],['emp2Who','친구 2'],['emp2Pct','친구 2 공감(%)'],['emp2Why','친구 2 까닭'],['impactCheck','성취도 평가'],['keyQ1','핵심 질문 중간 답'],['newLearn','새롭게 알게 된 점']];
/* 접어 둔 칸은 쓴 묶음만 모아 보기에 보여 줌 */
const OPT=[['myDigital'],['emp2Who','emp2Pct','emp2Why']];
onShow[5]=()=>{const hide=OPT.filter(g=>!g.some(k=>String(MEMO[k]||'').trim())).flat(); memoSummary('msum',MEMOLIST.filter(([k])=>!hide.includes(k)));};
