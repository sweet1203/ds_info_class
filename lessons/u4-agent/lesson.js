
/* 0 나의 학습 준비 · 중학교에서 배운 것 */
flipCards('prepCards',[
  {ic:'🧠',f:'인공지능의 개념',s:'인공지능의 이해',b:'인간의 지능을 모방한 컴퓨터 기술이나 학문'},
  {ic:'🤖',f:'인공지능의 특성',s:'인공지능의 이해',b:'자율적이며 외부 환경과 상호 작용해요. 에이전트',x:'인공지능 기술로 구현된 에이전트는 복잡하고 어려운 문제를 해결하는 데 활용'},
  {ic:'🧩',f:'인공지능 시스템의 구성',s:'인공지능의 이해',b:'모델, 학습, 데이터'},
  {ic:'💿',f:'인공지능 소프트웨어',s:'인공지능의 이해',b:'자율적이고 유연하게 문제를 해결해요.'},
  {ic:'📊',f:'데이터의 중요성',s:'인공지능 시스템',b:'인공지능은 데이터를 기반으로 학습하므로 데이터의 질과 양이 중요해요.',x:'데이터를 활용한 인공지능 시스템: 엑스레이 영상 분석, 인공지능 스피커, 스팸 메일 분류 등'},
  {ic:'⚖️',f:'윤리적 문제 해결 방안',s:'인공지능 시스템',b:'사회적 편향을 제거한 데이터와 알고리즘의 투명성',x:'인공지능에 사용되는 데이터는 윤리적으로 편향성이 없도록 하는 것이 중요'},
]);

/* 01 에이전트일까, 지능 에이전트일까? */
sorter('kindGame',{
  cats:[{n:'⚙️ 에이전트',k:'#8a94a3'},{n:'🧠 지능 에이전트',k:'#5a5fc8'}],
  items:[
    {t:'<b>복도 조명</b> 사람이 지나가면 센서가 움직임을 감지해 30초 동안 불을 켠다.',c:0,ic:'💡',short:'복도 조명',w:'움직임을 감지하면 불을 켜는, 미리 정한 규칙대로 반응해요. 학습이나 추론은 없어요.'},
    {t:'<b>자동 손 소독기</b> 손을 내밀면 정해진 양의 소독제를 뿌린다.',c:0,ic:'🧴',short:'자동 손 소독기',w:'센서가 손을 감지하면 정해 둔 행동을 해요.'},
    {t:'<b>화재경보기</b> 연기 농도가 기준값을 넘으면 경보를 울린다.',c:0,ic:'🚨',short:'화재경보기',w:'기준값과 비교하는 규칙으로 작동해요. 경보를 울린 경험으로 기준을 바꾸지는 않아요.'},
    {t:'<b>엘리베이터 문</b> 닫히는 문 사이에 물체가 감지되면 문을 다시 연다.',c:0,ic:'🛗',short:'엘리베이터 문',w:'감지하면 문을 여는 단순한 반응이에요.'},
    {t:'<b>메일 앱</b> 사용자가 「스팸 아님」으로 옮긴 메일을 반영해 점점 더 정확하게 스팸을 거른다.',c:1,ic:'📧',short:'메일 앱',w:'사용자의 피드백으로 학습해 판단을 고쳐 나가요.'},
    {t:'<b>번역 앱</b> 많은 문장 데이터로 익힌 뒤 처음 보는 문장도 문맥에 맞게 옮긴다.',c:1,ic:'🌐',short:'번역 앱',w:'학습한 지식으로 새로운 상황을 추론해요.'},
    {t:'<b>운동 앱</b> 달리기 기록이 쌓일수록 그날 컨디션에 맞는 코스와 속도를 제안한다.',c:1,ic:'🏃',short:'운동 앱',w:'사용자의 패턴을 학습해 개인화된 제안을 해요.'},
    {t:'<b>게임 속 상대 캐릭터</b> 내가 자주 쓰는 공격 방식을 기억해 다음 판에서 막는 방법을 바꾼다.',c:1,ic:'🎮',short:'게임 속 상대',w:'경험에서 배우고 전략을 바꿔 환경(나의 플레이)에 적응해요.'},
  ],
  end:'구분의 열쇠는 <b>학습과 추론이 있는지</b>예요. 센서가 있다고 해서 지능 에이전트인 것은 아니에요.'
});

/* 02 구현 과정 단계 보기 */
const STEPS=[
  {n:'인식',ic:'👀',k:'#2f6fd0',h:()=>`<h4>① 인식 · 문제 이해</h4><p style="margin-top:0">지능 에이전트는 <b>센서 정보, 외부 정보, 배경 정보</b>를 활용해 주변 환경을 파악하고 이해해요. 이 정보들은 현재 상황과 문제를 해결하는 데 필요한 정보예요.</p>
    <div class="ag-scroll"><table class="tbl"><tr><th>정보의 유형</th><th>인식 <small>(표 Ⅳ-2)</small></th></tr>
    <tr><td><b>센서 정보</b></td><td>센서를 통해 환경의 현재 상태를 파악한 정보</td></tr>
    <tr><td><b>외부 정보</b></td><td>인터넷이나 데이터베이스 등 외부로부터 얻은 정보</td></tr>
    <tr><td><b>배경 정보</b></td><td>시간, 위치 등을 통해 상황을 이해하고 반응하는 데 필요한 맥락적 정보</td></tr></table></div>`},
  {n:'학습',ic:'📚',k:'#1f9d74',h:()=>`<h4>② 학습 · 목표 설정</h4><p style="margin-top:0">지능 에이전트의 학습은 <b>목표를 이루기 위해 지식, 패턴, 방법 등을 배우고 개선하는 과정</b>이에요. 인간의 학습 능력을 모방하거나 스스로 일정한 작업을 하며 학습할 수 있어요. 예를 들어 인터넷 사용자의 목표에 맞게 학습해 맞춤형 정보를 줄 수 있어요.</p>
    <div class="ag-scroll"><table class="tbl"><tr><th>목표</th><th>학습 <small>(표 Ⅳ-3)</small></th></tr>
    <tr><td>사용자의 선호도를 찾아라.</td><td>인터넷에서 어떤 주제를 검색하고 어떤 내용에서 오래 머물렀는지 학습해 사용자의 선호도를 파악한다.</td></tr>
    <tr><td>가격 대비 성능이 좋은 상품을 찾아라.</td><td>인터넷에 등록된 상품의 가격, 상품의 평을 지속적으로 비교 분석해 최적의 상품이 무엇인지 파악한다.</td></tr></table></div>`},
  {n:'추론',ic:'🤔',k:'#e0702b',h:()=>`<h4>③ 추론 · 의사 결정</h4><p style="margin-top:0"><b>추론</b>은 이전에 학습한 지식을 기반으로 <b>새로운 상황에 대한 판단과 결론을 도출하는 과정</b>이에요. 논리적으로 정해진 규칙을 기반으로 추론하는 방법과, 사전에 학습된 확률을 기반으로 추론하는 방법이 있어요.</p>
    <div class="ag-scroll"><table class="tbl"><tr><th>구분</th><th>논리적(규칙) 방법</th><th>확률적 방법</th></tr>
    <tr><td><b>주어진 지식</b></td><td>A &lt; B이고 B &lt; C이면</td><td>오렌지 주스를 → 마시다(80%) · 먹다(10%) · 타다(10%)</td></tr>
    <tr><td><b>추론</b></td><td>A &lt; C</td><td>오렌지 주스를 마시다.</td></tr>
    <tr><td><b>설명</b></td><td>정해진 규칙(지식)으로 정보를 해석해 새로운 결론을 도출</td><td>‘오렌지 주스를’ 다음에 ‘마시다’가 나올 확률(지식)이 높다는 점을 기반으로 추론</td></tr></table></div>
    <p class="note">표 Ⅳ-4 지능 에이전트의 추론</p>`},
  {n:'행동',ic:'🏃',k:'#d64535',h:()=>`<h4>④ 행동 · 실행 및 평가</h4><p style="margin-top:0">행동은 <b>인식, 학습, 추론의 결과가 나타나는 단계</b>예요. 행동이 합리적인지 판단하려면 목표를 어느 정도 달성했는지 분석해 <b>성능을 평가</b>해야 해요. 이때 행동 결과와 목푯값의 차이를 재는 <b>승률</b>이나 <b>평균 점수</b> 같은 지표를 쓸 수 있어요.</p>
    <div class="callout" style="margin-bottom:0">모든 상황에서 목표 달성 정도를 평가하기는 쉽지 않아요. 목표가 명확하지 않거나, 차이를 알아내기 어려울 수 있기 때문이에요.</div>`},
];
tabs('stepBtns','stepView',STEPS,c=>`<div class="card ag-stepcard" style="margin:0;--k:${c.k}">${c.h()}</div>`);

/* 02 스마트 화분 시뮬레이션 */
(function(){
  const WT={s:{n:'맑음',ic:'☀️',p:10,d:-15},c:{n:'흐림',ic:'☁️',p:30,d:-8},r:{n:'비',ic:'🌧️',p:80,d:25}};
  const DAYS='ssrsssrrsscsrs'.split('');   /* 14일의 날씨(예보와 같다고 봄) */
  const LO=40, HI=70, START=50, N=DAYS.length;
  const cl=m=>Math.max(0,Math.min(100,m));
  const leaf=m=>m<LO?'wilt':m>HI?'wet':'ok';
  const LF={ok:['🌿','싱싱'],wilt:['🥀','시듦'],wet:['🍂','과습']};
  const B=$('plantSim');
  let th=30, t, R, S, busy=false, timers=[];
  B.innerHTML=`<div class="ag-ctrl">
      <label>⚙️ 규칙 화분의 기준 <input type="range" min="20" max="60" step="5" value="30" id="agTh"> <b id="agThV">30%</b></label>
      <span class="ag-day" id="agDay"></span>
      <span class="row"><button class="btn sm" id="agNext">하루 보내기 ▶</button><button class="btn ghost sm" id="agAll">끝까지 ⏩</button><button class="btn ghost sm" id="agReset">처음부터</button></span>
    </div>
    <div class="ag-wx" id="agWx"></div>
    <div class="ag-pots">
      <div class="ag-pot" style="--k:#8a94a3"><h4>⚙️ 규칙 화분</h4><div class="ag-potv" id="agRv"></div><ol class="ag-stage" id="agRs"></ol><div class="ag-hist" id="agRh"></div></div>
      <div class="ag-pot" style="--k:#1f9d74"><h4>🧠 지능 화분</h4><div class="ag-potv" id="agSv"></div><ol class="ag-stage" id="agSs"></ol><div class="ag-hist" id="agSh"></div></div>
    </div>
    <div class="ag-res" id="agRes"></div>`;
  $('agWx').innerHTML=DAYS.map((d,i)=>`<span data-i="${i}"><small>${i+1}일</small>${WT[d].ic}</span>`).join('');
  const bar=(m0,m1)=>`<div class="ag-bar"><i class="band" style="left:${LO}%;width:${HI-LO}%"></i><i class="fill" style="width:${m1}%"></i><i class="was" style="left:${m0}%"></i></div><div class="ag-bart"><span>흙 습도</span><b>${m0}% → ${m1}%</b></div>`;
  const potv=(P,st)=>`<span class="ag-big">${st?LF[st][0]:'🪴'}</span><div style="flex:1">${bar(P.m0,P.m)}<div class="ag-cnt">🌿 싱싱 <b>${P.cnt.ok}</b> · 🥀 시듦 <b>${P.cnt.wilt}</b> · 🍂 과습 <b>${P.cnt.wet}</b></div></div>`;
  const stg=rows=>rows.map(r=>`<li style="--k:${r[1]}"><b>${r[0]}</b><span>${r[2]}</span></li>`).join('');
  function reset(){
    timers.forEach(clearTimeout); timers=[]; t=0; busy=false;
    R={m:START,m0:START,cnt:{ok:0,wilt:0,wet:0},h:[]};
    S={m:START,m0:START,cnt:{ok:0,wilt:0,wet:0},h:[],lo:30,hi:100,fb:null};
    $('agRv').innerHTML=potv(R,null); $('agSv').innerHTML=potv(S,null);
    $('agRs').innerHTML=stg([['인식','#2f6fd0','흙 습도 센서'],['규칙','#8a94a3',`습도가 ${th}%보다 낮으면 물 많이(+30%)`],['행동','#d64535','규칙이 시키는 대로']]);
    $('agSs').innerHTML=stg([['인식','#2f6fd0','흙 습도 · 일기 예보 · 계절'],['학습','#1f9d74','어제 잎의 상태로 기준 고치기'],['추론','#e0702b','저녁 습도를 예측해 결정'],['행동','#d64535','물 주기 · 덮개 · 평가']]);
    $('agRh').innerHTML=$('agSh').innerHTML=''; $('agRes').innerHTML='';
    $('agTh').disabled=false; upd();
  }
  function upd(){
    /* t는 지금까지 보낸 날 수: 화면에는 방금 보낸 날(t일째)의 결과를 보여 줌 */
    $('agDay').innerHTML=t===0?`<b>1일째</b>를 시작해요 / ${N}일 · 여름`:t<N?`<b>${t}일째 결과</b> / ${N}일 · 여름`:`<b>${N}일째 결과 · 끝</b>`;
    [...$('agWx').children].forEach((s,i)=>{s.classList.toggle('on',i===Math.max(0,t-1)); s.classList.toggle('past',i<t-1);});
    $('agNext').disabled=$('agAll').disabled=t>=N||busy;
  }
  function day(){
    const w=WT[DAYS[t]];
    /* 규칙 화분 */
    const rw=R.m<th?30:0, re=cl(R.m+rw+w.d), rs=leaf(re);
    const rRows=[['인식','#2f6fd0',`아침 흙 습도 <b>${R.m}%</b>`],['규칙','#8a94a3',`${R.m}% &lt; ${th}% ? ${rw?'<b>예</b> → 물 많이':'아니요 → 아무것도 안 함'}`],['행동','#d64535',`${rw?'💧 물 많이(+30%)':'—'} · 날씨 ${w.ic} ${w.n} → 저녁 <b>${re}%</b> ${LF[rs][0]} ${LF[rs][1]}`]];
    R.m0=R.m; R.m=re; R.cnt[rs]++; R.h.push(rs);
    /* 지능 화분: 인식 → 학습 → 추론 → 행동 */
    const pRain=w.p>=60;
    let learn;
    if(!S.fb) learn='아직 경험이 없어요. 처음 기준: 습도 30% 이상';
    else if(S.fb.s==='wilt'){const v=Math.max(S.lo,S.fb.m+10); learn=`어제 저녁 ${S.fb.m}%에서 잎이 시들었어요 → 최소 기준을 <b>${v}%</b>로 올려요`; S.lo=v;}
    else if(S.fb.s==='wet'){const v=Math.min(S.hi,S.fb.m-10); learn=`어제 저녁 ${S.fb.m}%에서 잎이 누레졌어요 → 최대 기준을 <b>${v}%</b>로 정해요`; S.hi=v;}
    else learn=`어제 저녁 ${S.fb.m}%에서 잎이 싱싱했어요 → 지금 기준을 유지해요`;
    const pred=cl(S.m+w.d); let sw=0, cover=false, why;
    const rng=`${S.lo}~${S.hi>=100?'?':S.hi}%`;
    if(pred<S.lo){ sw=cl(S.m+15+w.d)>=S.lo?15:30; why=`그대로 두면 저녁 ${pred}% 예상 → 기준(${rng})보다 낮음 → <b>물 ${sw===15?'조금(+15%)':'많이(+30%)'}</b>`; }
    else if(pRain&&pred>S.hi){ cover=true; why=`비가 오면 저녁 ${pred}% 예상 → 기준(${rng})보다 높음 → <b>덮개 덮기</b>`; }
    else why=`그대로 두면 저녁 ${pred}% 예상 → 기준(${rng}) 안 → <b>아무것도 안 함</b>`;
    const se=cl(S.m+sw+(cover?0:w.d)), ss=leaf(se);
    const sRows=[['인식','#2f6fd0',`흙 습도 <b>${S.m}%</b> · 예보 ${w.ic} ${w.n}(비 올 확률 ${w.p}%) · 여름이라 맑으면 빨리 마름`],['학습','#1f9d74',learn],['추론','#e0702b',why],['행동','#d64535',`${sw?'💧 물 '+(sw===15?'조금':'많이'):cover?'☂️ 덮개':'—'} → 저녁 <b>${se}%</b> ${LF[ss][0]} ${LF[ss][1]} · 평가: ${ss==='ok'?'목표 달성':'목표 못 이룸'}`]];
    S.m0=S.m; S.m=se; S.cnt[ss]++; S.h.push(ss); S.fb={m:se,s:ss};
    t++;
    return [rRows,rs,sRows,ss];
  }
  function draw(r,anim){
    const [rRows,rs,sRows,ss]=r;
    $('agRv').innerHTML=potv(R,rs); $('agSv').innerHTML=potv(S,ss);
    $('agRs').innerHTML=stg(rRows); $('agSs').innerHTML=stg(sRows);
    $('agRh').innerHTML=R.h.map((s,i)=>`<span title="${i+1}일">${LF[s][0]}</span>`).join('');
    $('agSh').innerHTML=S.h.map((s,i)=>`<span title="${i+1}일">${LF[s][0]}</span>`).join('');
    if(anim){ busy=true; const li=[...$('agSs').children]; li.forEach(x=>x.classList.add('wait')); li.forEach((x,i)=>timers.push(setTimeout(()=>{x.classList.remove('wait'); x.classList.add('lit'); if(i===li.length-1){busy=false; upd();}},250+i*380))); }
    upd();
    if(t>=N) finish();
  }
  function finish(){
    $('agTh').disabled=false;
    const txt=`규칙 화분(기준 ${th}%) 싱싱 ${R.cnt.ok}일·시듦 ${R.cnt.wilt}일·과습 ${R.cnt.wet}일 / 지능 화분 싱싱 ${S.cnt.ok}일·시듦 ${S.cnt.wilt}일·과습 ${S.cnt.wet}일`;
    MEMO.plantRes=txt; store.set(MK,MEMO);
    $('agRes').innerHTML=`<b>14일 결과</b> ${txt}<br><small>지능 화분이 처음 며칠 동안 실수한 뒤 어떻게 달라졌는지, 아래 날짜별 잎을 살펴봐요. 규칙 화분의 기준을 바꿔 다시 해 봐도 좋아요. (결과는 메모에 저장돼요)</small>`;
  }
  $('agTh').oninput=e=>{th=+e.target.value; $('agThV').textContent=th+'%'; $('ruleTh').textContent=th; reset();};
  $('agNext').onclick=()=>{ if(t<N&&!busy){ timers=[]; $('agTh').disabled=true; draw(day(),true);} };
  $('agAll').onclick=()=>{ if(busy||t>=N) return; $('agTh').disabled=true; let r; while(t<N) r=day(); draw(r,false); };
  $('agReset').onclick=reset;
  reset();
})();

/* 03 지식 키우기 · 챗봇 단계 따라가기 */
(function(){
  const QQ=[
    {q:'고양이는 왜 상자를 좋아해?',what:'고양이의 습성',want:'까닭',a:'고양이는 좁고 둘러싸인 곳에 있으면 몸을 숨길 수 있어 안전하다고 느끼기 때문이라는 설명이 많아요.'},
    {q:'파이썬 반복문을 쉽게 설명해 줘.',what:'파이썬 반복문',want:'쉬운 설명',a:'for 문은 정해진 횟수나 목록의 값만큼, while 문은 조건이 참인 동안 같은 코드를 되풀이해요.'},
    {q:'비 오는 날 교실이 눅눅한 이유가 뭐야?',what:'비 오는 날의 습도',want:'까닭',a:'비가 오면 공기 중 수증기가 많아져 습도가 높아지고, 창문을 닫아 두면 습기가 잘 빠져나가지 못해서예요.'},
  ];
  const ST=[
    ['인식','#2f6fd0',q=>`사용자의 질문 「${q.q}」를 <b>텍스트 형태로 입력받아</b> 문장 구조와 의미를 파악해요. → 묻는 대상: <b>${q.what}</b>, 원하는 것: <b>${q.want}</b>`],
    ['학습','#1f9d74',()=>`질문을 받기 전에 이미 <b>대규모 데이터셋으로 사전 학습</b>해 다양한 주제와 맥락의 텍스트 패턴과 지식을 익혀 두었어요. 지속적인 피드백과 추가 데이터로 성능이 좋아지도록 계속 학습해요.`],
    ['추론','#e0702b',()=>`학습한 지식과 패턴을 바탕으로 이 질문에 어울리는 답의 내용을 <b>추론</b>해요. 처음 보는 맥락의 질문이어도 문제를 풀어낼 수 있어요.`],
    ['행동','#d64535',q=>`추론을 바탕으로 질문에 대한 <b>최적의 답변을 생성해 텍스트로 돌려줘요</b>(답변의 맥락, 정확성, 유용성 고려).<div class="ag-bot">🤖 ${q.a}</div>`],
    ['평가','#9b4fc4',()=>`<b>사용자의 피드백</b>으로 모델의 성능을 평가해요. 더 나은 답변을 만들도록 계속 개선해 사용자의 만족도를 높여요. <small class="muted">(교과서 166~167쪽의 4단계에서는 평가가 ‘행동(실행 및 평가)’ 안에 들어 있어요.)</small> 이 답변은 어땠나요? <span class="ag-fb"><button class="btn ghost sm">👍 도움이 됐어요</button><button class="btn ghost sm">👎 아쉬워요</button></span><span class="ag-fbm"></span>`],
  ];
  const B=$('chatSim'); let qi=-1, si=-1;
  B.innerHTML=`<div class="ag-chatq">${QQ.map((x,i)=>`<button data-i="${i}">💬 ${x.q}</button>`).join('')}</div><div class="ag-chatst">${ST.map((s,i)=>`<span style="--k:${s[1]}" data-i="${i}">${s[0]}</span>`).join('<i>→</i>')}</div><div class="ag-chatv"><p class="muted" style="margin:0">위에서 질문을 하나 골라요.</p></div><div class="row"><button class="btn sm" id="agChatNext" disabled>다음 단계 →</button></div>`;
  const qb=[...B.querySelectorAll('.ag-chatq button')], sb=[...B.querySelectorAll('.ag-chatst span')], v=B.querySelector('.ag-chatv'), nx=$('agChatNext');
  function show(){
    sb.forEach((s,i)=>{s.classList.toggle('on',i===si); s.classList.toggle('past',i<si);});
    const s=ST[si]; v.style.setProperty('--k',s[1]); v.innerHTML=`<b class="ag-chatk">${s[0]}</b> ${s[2](QQ[qi])}`;
    nx.disabled=false; nx.textContent=si<ST.length-1?'다음 단계 →':'처음 단계부터 다시';
    const f=v.querySelector('.ag-fb'); if(f) f.querySelectorAll('button').forEach((b,j)=>b.onclick=()=>{v.querySelector('.ag-fbm').textContent=j?' → 이런 피드백이 모이면 다음 답변을 고치는 데 쓰여요.':' → 좋은 답변이라는 신호로 성능 평가에 쓰여요.';});
  }
  qb.forEach(b=>b.onclick=()=>{qi=+b.dataset.i; qb.forEach(x=>x.classList.toggle('on',x===b)); si=0; show();});
  nx.onclick=()=>{ if(qi<0) return; si=si<ST.length-1?si+1:0; show(); };
})();

/* 03 어떤 특성이 가장 잘 드러날까? */
sorter('traitGame',{
  cats:[{n:'🚀 자율성',k:'#d64535'},{n:'🤝 협력성',k:'#2f6fd0'},{n:'🎯 목표 지향성',k:'#1f9d74'}],
  items:[
    {t:'농업용 드론이 사람이 조종하지 않아도 밭의 모양을 파악해 비행 경로를 정하고 약을 뿌린다.',c:0,ic:'🚁',short:'농업용 드론',w:'인간의 개입 없이 독립적으로 인식하고 판단해 행동해요.'},
    {t:'물류 창고 로봇이 지시를 기다리지 않고 장애물을 피해 가며 물건을 옮긴다.',c:0,ic:'📦',short:'물류 창고 로봇',w:'사람이 하나하나 지시하지 않아도 경로를 판단해 움직여요.'},
    {t:'배달 로봇 여러 대가 서로 위치를 알려 주며 같은 길이 막히지 않게 나누어 간다.',c:1,ic:'🛵',short:'배달 로봇 여러 대',w:'다른 에이전트와 정보를 나누며 공동으로 작업해요.'},
    {t:'환자 영상을 분석한 인공지능이 의사에게 의견을 주고, 의사와 함께 치료 계획을 세운다.',c:1,ic:'🩺',short:'의료 영상 인공지능',w:'사람과 상호 작용하며 혼자 풀기 힘든 문제를 함께 해결해요.'},
    {t:'에너지 관리 인공지능이 「이번 달 전기 요금 10% 줄이기」를 기준으로 냉난방 시간을 정한다.',c:2,ic:'⚡',short:'에너지 관리 인공지능',w:'정해 둔 목표가 행동과 결정의 방향이 돼요.'},
    {t:'단어 학습 앱이 「한 달에 300단어 외우기」에 맞춰 날마다 복습할 단어 수를 조절한다.',c:2,ic:'📚',short:'단어 학습 앱',w:'이루려는 목표에 맞춰 학습과 결정을 관리해요.'},
  ],
  end:'한 지능 에이전트에 여러 특성이 함께 있어요. 상황이나 응용 분야에 따라 <b>강조되는 특성</b>이 달라요.'
});

/* 04 개념 정리하기 빈칸 · 성취도 평가 */
document.querySelectorAll('.ag-blank').forEach(b=>b.onclick=()=>{const on=!b.classList.contains('on'); b.textContent=on?b.dataset.a:'?'; b.classList.toggle('on',on);});
vote('selfVote','selfCheck',[['예','구분할 수 있어요'],['아니요','01의 비교 표와 분류 게임을 다시 봐요']]);

/* 05 마무리 */
const MEMOLIST=[['myAgent','명령하지 않아도 알아서 움직이는 것'],['myAgentSort','내 주변의 에이전트와 지능 에이전트'],['plantRes','스마트 화분 14일 결과'],['plantWhy','두 화분의 결과가 달랐던 까닭'],['traitPick','가장 강조되는 특성과 까닭'],['rcA1','일반 로봇 청소기 · 인식'],['rcA2','일반 로봇 청소기 · 학습'],['rcA3','일반 로봇 청소기 · 추론'],['rcA4','일반 로봇 청소기 · 행동'],['rcI1','인공지능 로봇 청소기 · 인식'],['rcI2','인공지능 로봇 청소기 · 학습'],['rcI3','인공지능 로봇 청소기 · 추론'],['rcI4','인공지능 로봇 청소기 · 행동'],['selfCheck','성취도 평가'],['keyQ','오늘의 질문에 대한 내 답'],['newLearn','새롭게 알게 된 점']];
onShow[5]=()=>memoSummary('msum',MEMOLIST);
