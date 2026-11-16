/* 01 어떤 원칙이 깨졌을까? */
sorter('ruleGame',{
  cats:[{n:'🕒 가용성',k:'#2f6fd0'},{n:'🧩 무결성',k:'#1f9d74'},{n:'🤫 기밀성',k:'#d64535'}],
  items:[
    {t:'수강 신청 날, 학교 누리집 서버가 멈춰 신청 시간 내내 아무도 접속하지 못했다.',c:0,ic:'🖥️',short:'서버가 멈춰 접속 불가',w:'필요한 때에 정보에 접근할 수 없게 되었어요.'},
    {t:'동아리 사진 폴더가 갑자기 열리지 않아 발표 시간에 사진을 하나도 쓰지 못했다.',c:0,ic:'🗂️',short:'필요할 때 폴더가 안 열림',w:'정보가 있어도 쓰려는 순간 쓸 수 없으면 이 원칙이 깨진 거예요.'},
    {t:'누군가 몰래 들어와 온라인 성적표의 점수를 바꾸어 놓았다.',c:1,ic:'📝',short:'성적표 점수가 바뀜',w:'허가되지 않은 사람이 정보를 바꾸었어요.'},
    {t:'전송 도중 송금 금액의 숫자가 바뀌어 원래와 다른 금액이 보내졌다.',c:1,ic:'💸',short:'전송 중 금액이 바뀜',w:'정보가 원래 내용 그대로 지켜지지 못했어요.'},
    {t:'잠금이 안 된 휴대폰을 주운 사람이 주인의 대화 내용을 훑어보았다.',c:2,ic:'📱',short:'남이 대화 내용을 봄',w:'허가되지 않은 사람이 정보를 보았어요.'},
    {t:'고객 명단 파일이 볼 필요가 없는 아르바이트생에게까지 열려 있었다.',c:2,ic:'📇',short:'명단이 아무에게나 열림',w:'정보를 볼 수 있는 사람이 허가된 사람으로 한정되지 않았어요.'},
  ],
  end:'<b>필요할 때 쓸 수 있고(가용성)</b>, <b>함부로 바뀌지 않고(무결성)</b>, <b>허가된 사람만 볼 수 있어야(기밀성)</b> 정보 보안이 유지돼요.'
});

/* 02 악성 코드 카드 */
flipCards('malCards',[
  {ic:'🦠',f:'바이러스',b:'정상적인 프로그램에 특정 코드를 삽입하여 감염시키는 프로그램이에요.'},
  {ic:'🐛',f:'웜',b:'단말기를 감염시킨 뒤, 단말기가 연결된 네트워크에서 자가 복제하여 통신망 속도를 느리게 만드는 악성 코드예요.'},
  {ic:'🐴',f:'트로이 목마',b:'정상적인 프로그램으로 위장하여 숨겨진 악성 코드를 실행하는 악성 코드예요.'},
  {ic:'🕶️',f:'스파이웨어',b:'사용자 몰래 설치되어 개인 정보를 수집하고 공격자의 서버로 전송하는 악성 코드예요.'},
  {ic:'💰',f:'랜섬웨어',b:'몸값(ransom)과 소프트웨어(software)의 합성어로, 사용자의 파일을 무단으로 모두 암호화하여 인질로 삼고 금전적 보상을 요구하는 악성 코드예요.'},
]);

/* 03 정보 보안 위협 사례 */
const CASES=[
  {n:'해킹',ic:'🏢',k:'#d64535',t:'사례 1. 해킹 · 아파트 월 패드',
   txt:'개인용 컴퓨터나 서버를 노리던 해킹이 스마트폰과 스마트 기기로 퍼지고 있어요. 2021년 12월, 전국 638개 아파트 단지의 월 패드를 관리하는 중앙 관리 서버와 아파트 총 40만 4,847 세대에 설치된 월 패드가 해킹되는 사건이 일어났어요.',
   dmg:'유출된 개인 정보로 사생활 침해, 경제적 피해 등 2차 피해를 입어요.'},
  {n:'악성 코드',ic:'📧',k:'#e0702b',t:'사례 2. 악성 코드 · 가짜 챗GPT 앱',
   txt:'2023년 챗GPT를 만든 오픈AI(OpenAI)가 유료 서비스를 발표하자, 「무료로 챗GPT의 유료 버전을 쓸 수 있다」는 유혹적인 메시지를 보내 가짜 앱이나 피싱 메일을 누르게 했어요. 그렇게 악성 코드를 설치하게 하거나 피싱 웹 페이지로 접속하게 만들었어요.',
   dmg:'개인 정보 수집 및 유출로 사생활 침해, 기업 성장 방해 등이 생겨요.'},
  {n:'디도스 공격',ic:'🌊',k:'#2f6fd0',t:'사례 3. 디도스 공격 · 통신망 장애',
   txt:'국내 인터넷 통신 업체의 통신망에 대용량 데이터로 인터넷 장애를 일으킨 뒤 시스템에 침입해 고객 정보를 빼냈어요. 18만 명이 넘는 사람의 성명, 생년월일, 전화번호가 유출되어, 회사는 2차 피해를 막으려고 고객에게 이 사실을 안내했어요.',
   term:'디도스(DDoS) 공격: 서버, 서비스, 네트워크에 일시적으로 인터넷 트래픽을 폭주시켜서 정상적 작동을 방해하는 사이버 공격 기법',
   dmg:'항상 켜져 있는 스마트폰이 디도스에 이용되면 인터넷망과 국가의 주요 기관망이 마비될 수 있어요.'},
  {n:'파밍',ic:'🎣',k:'#9b4fc4',t:'사례 4. 파밍 · 가짜 사이트',
   txt:'사이버 수사팀 수사관을 사칭한 사람이 A 씨에게 접근해, A 씨 이름의 계좌가 대포 통장으로 쓰였는지 확인하겠다며 가짜 사이트에 접속하게 했어요. A 씨가 가짜 사이트에 입력한 비밀번호, 공동 인증서 번호 같은 금융 정보를 빼낸 뒤, A 씨 계좌에서 4,000여만 원을 대포 통장으로 보내고 사라졌어요.',
   term:'파밍: 인터넷 주소창에 방문하려는 사이트의 주소를 입력했을 때 가짜 사이트(fake site)로 이동시키는 공격 기법',
   dmg:'금융 거래 내역이 노출되어 금전적 피해를 입어요.'},
];
tabs('caseBtns','caseView',CASES,c=>`<div class="is-case" style="--k:${c.k}"><div><b class="tt">${c.t}</b><p>${c.txt}</p>${c.term?`<p class="note">* ${c.term}</p>`:''}</div><div class="dmg"><span>피해</span>${c.dmg}</div></div>`);
chips('casePick','casePick',['월 패드 해킹','가짜 챗GPT 앱','통신망 디도스 공격','파밍'],false);

/* 04 어떤 보안 기술일까? */
sorter('techGame',{
  cats:[{n:'🔏 암호화',k:'#2f6fd0'},{n:'🧱 방화벽',k:'#e0702b'},{n:'✍️ 전자 서명',k:'#9b4fc4'}],
  items:[
    {t:'메신저로 보낸 내용이 중간에 가로채여도, 엉뚱한 기호와 숫자의 줄로만 보이게 바뀌어 전송된다.',c:0,ic:'💬',short:'내용을 바꿔서 전송',w:'데이터를 남이 알아볼 수 없는 암호문 형태로 변환해 보내는 방법이에요.'},
    {t:'외부에서 학교 내부 네트워크로 들어오려는 수상한 접속 시도를 막고, 허락된 접속만 들여보낸다.',c:1,ic:'🚧',short:'수상한 접속 차단',w:'외부의 불법적 침입을 막고 정상 접근만 허용해요.'},
    {t:'온라인으로 서류를 낼 때, 인증서를 써서 내가 보낸 것임을 증명했다.',c:2,ic:'📜',short:'인증서로 신원 증명',w:'인터넷에서 신원을 확인하는 증명서 역할을 해요.'},
    {t:'휴대폰에 지문을 대어 본인임을 밝힌 뒤 결제를 마쳤다.',c:2,ic:'🖐️',short:'지문으로 본인 인증',w:'교과서는 생체 신호 인증 기술을 쓰임이 넓어지는 전자 서명 방법으로 소개해요.'},
  ],
  end:'<b>암호화</b>는 내용을 숨기고, <b>방화벽</b>은 들어오는 길을 지키고, <b>전자 서명</b>은 누구인지 확인해 줘요.'
});
chips('techPick','techPick',['암호화','방화벽','전자 서명'],true);

/* 05 정보 사용자 실천 점수 */
(function(){
  const IT=[
    ['강력한 비밀번호 설정','정보 시스템에 접속하는 계정을 다른 사람이 쉽게 알 수 없도록 세 가지 종류 이상의 문자를 섞은, 강력하고 고유한 여덟 자리 이상의 비밀번호를 만든다.'],
    ['바이러스 백신 설치 및 최신 업데이트 유지','사용하는 컴퓨터나 스마트폰에 바이러스 백신이나 악성 프로그램 방지 소프트웨어를 설치하고 정기적으로 업데이트한다.'],
    ['보안 무선망 사용 주의','비밀번호가 없는 공공 무선망에서는 민감한 정보 전송을 자제하고 신뢰할 수 있는 무선망을 사용한다.'],
    ['이중 인증','온라인 계정에 2단계 인증을 사용한다. 비밀번호가 노출되더라도 나의 정보를 더 안전하게 보호할 수 있다.'],
    ['의심스러운 링크 클릭 금지','인터넷 검색 결과나 문자를 받았을 때 의심스러운 링크를 누르거나 알 수 없는 파일을 내려받지 않는다.'],
    ['정기적인 데이터 백업','하드웨어 장애, 악성 코드 등 여러 위험으로부터 중요한 정보를 잃지 않도록 정기적으로 데이터를 백업한다.'],
  ];
  const LB=['','매우 미흡','미흡','보통','잘함','아주 잘함'];
  const B=$('userScore'), msg=$('scoreMsg');
  const sc=IT.map(([n])=>{const m=String(MEMO.userScore||'').match(new RegExp(n+' (\\d)점')); return m?+m[1]:0;});
  B.innerHTML=IT.map(([n,d],i)=>`<div class="it"><div class="tx"><b>${n}</b><span>${d}</span></div><div class="st" data-i="${i}">${[1,2,3,4,5].map(v=>`<button data-v="${v}" title="${LB[v]}" aria-label="${n} ${v}점">★</button>`).join('')}<small></small></div></div>`).join('');
  function draw(){
    B.querySelectorAll('.st').forEach(s=>{const i=+s.dataset.i; s.querySelectorAll('button').forEach(b=>b.classList.toggle('on',+b.dataset.v<=sc[i])); s.querySelector('small').textContent=sc[i]?`${sc[i]}점 · ${LB[sc[i]]}`:'';});
    const done=sc.filter(Boolean).length;
    if(!done){msg.textContent='';return;}
    if(done<IT.length){msg.textContent=`${done} / ${IT.length}개 항목에 점수를 매겼어요. 모두 매기면 가장 낮은 항목을 알려 줘요. (같은 별을 다시 누르면 지워져요.)`;return;}
    const low=Math.min(...sc), lows=IT.filter((_,i)=>sc[i]===low).map(x=>x[0]);
    msg.innerHTML=`평균 <b>${(sc.reduce((a,b)=>a+b,0)/IT.length).toFixed(1)}점</b>. 가장 낮은 항목: <b>${lows.join(', ')}</b> (${low}점) → 아래 메모에 실천 방법을 적어요.`;
  }
  B.querySelectorAll('.st button').forEach(b=>b.onclick=()=>{const i=+b.parentElement.dataset.i, v=+b.dataset.v; sc[i]=sc[i]===v?0:v; MEMO.userScore=IT.map(([n],j)=>sc[j]?`${n} ${sc[j]}점`:'').filter(Boolean).join(', '); store.set(MK,MEMO); draw();});
  draw();
})();

/* 05 비밀번호 규칙 점검기 (입력값은 저장하거나 보내지 않음) */
(function(){
  const EX=['qwer1234','sky2009','dalgona!!','Banana!!!!1','Rain#Bus7Tree'];
  const inp=$('pwIn'), chk=$('pwChk'), bar=$('pwBar'), msg=$('pwMsg');
  $('pwEx').innerHTML='<span class="muted" style="font-size:.88rem">예시:</span>'+EX.map(e=>`<button class="btn ghost sm" data-e="${esc(e)}">${esc(e)}</button>`).join('');
  $('pwEx').querySelectorAll('button').forEach(b=>b.onclick=()=>{inp.value=b.dataset.e; judge();});
  const ROWS=['qwertyuiop','asdfghjkl','zxcvbnm','1234567890'], WORDS=['password','passwd','admin','qwerty','iloveyou','letmein','welcome','1q2w3e'];
  function seq(s){ const t=s.toLowerCase();
    for(let i=0;i+4<=t.length;i++){ const u=t.slice(i,i+4); let up=true, dn=true;
      for(let j=1;j<4;j++){ const d=u.charCodeAt(j)-u.charCodeAt(j-1); if(d!==1) up=false; if(d!==-1) dn=false; }
      if((up||dn)&&/^[a-z0-9]+$/.test(u)) return u;
      if(ROWS.some(r=>r.includes(u)||[...r].reverse().join('').includes(u))) return u; }
    return null; }
  function judge(){
    const s=inp.value;
    if(!s){chk.innerHTML=''; bar.style.width='0'; msg.textContent=''; return;}
    const kinds=[/[A-Z]/,/[a-z]/,/[0-9]/,/[!-\/:-@\[-\x60{-~]/].filter(r=>r.test(s)).length;
    let easy=null; const sq=seq(s), w=WORDS.find(x=>s.toLowerCase().includes(x));
    if(w) easy=`누구나 떠올리는 낱말(${esc(w)})이 들어 있어요`;
    else if(sq) easy=`자판이나 순서대로 이어지는 글자(${esc(sq)})가 있어요`;
    else if(/(.)\1\1/.test(s)) easy='같은 글자를 세 번 이상 이어 썼어요';
    else if(/\d{6,}/.test(s)) easy='숫자가 여섯 개 이상 이어져 생일이나 전화번호처럼 보여요';
    else if(/(19|20)\d\d/.test(s)) easy=`연도처럼 보이는 숫자(${s.match(/(19|20)\d\d/)[0]})가 있어요`;
    const R=[[s.length>=8,`여덟 자리 이상 (지금 ${s.length}자리)`],[kinds>=3,`세 가지 종류 이상의 문자 섞기 (지금 ${kinds}종류 · 영문 대문자, 영문 소문자, 숫자, 특수 문자 중)`],[!easy,easy?`쉽게 알 수 없는가 → ${easy}`:'쉽게 알 수 없는가 → 흔한 낱말이나 이어지는 패턴이 보이지 않아요']];
    chk.innerHTML=R.map(([ok,t])=>`<li class="${ok?'ok':'ng'}">${ok?'✔':'✖'} ${t}</li>`).join('');
    const n=R.filter(r=>r[0]).length; bar.style.width=(n/3*100)+'%'; bar.className=['w0','w1','w2','w3'][n];
    msg.innerHTML=n===3?'<b>세 조건을 모두 만족해요.</b> 그래도 다른 사이트와 같은 비밀번호를 쓰면 한 곳이 뚫릴 때 모두 위험해져요.':`${3-n}개 조건이 부족해요. 예시를 고쳐 세 조건을 모두 만족하게 만들어 봐요.`;
    if(n===3&&!MEMO.pwTry){MEMO.pwTry='세 조건을 모두 만족하는 예시 비밀번호를 만들어 봄(입력값은 저장하지 않음)'; store.set(MK,MEMO);}
  }
  inp.addEventListener('input',judge);
})();
vote('ck3Vote','ck3',[['예','실천할 수 있어요'],['아니요','04·05를 다시 봐요']]);

/* 05 개념 정리하기 빈칸 */
document.querySelectorAll('.is-blank').forEach(b=>b.onclick=()=>{const on=!b.classList.contains('on'); b.textContent=on?b.dataset.a:'?'; b.classList.toggle('on',on);});

/* 06 정리 · 맞춤 활동 */
chips('selfCheck','selfCheckPick',['사용자와 공급자 입장에서 정보 보호와 보안이 왜 중요한지 말할 수 있다','사례에 알맞은 정보 보호와 보안 방법을 제시할 수 있다','정보 보호 방법을 알고 생활에서 실천하려고 한다'],true);
vote('extraVote','extraPick',[['보충','보호할 정보와 공유할 정보 구분'],['심화','앱 사용 권한 점검']],i=>{$('extraBasic').classList.toggle('on',i===0); $('extraDeep').classList.toggle('on',i===1);});

/* 06 보충 · 보호할 정보와 공유할 정보 */
sorter('extraSort',{
  cats:[{n:'🔒 보호할 정보',k:'#d64535'},{n:'🤝 공유할 정보',k:'#1f9d74'}],
  items:[
    {t:'훈련 중인 부대가 이동할 경로',c:0,ic:'🪖',short:'부대 이동 경로',w:'군사 정보는 국가 안보와 연결되어 지켜야 해요.'},
    {t:'내 휴대폰에 남은 하루 동안의 이동 기록',c:0,ic:'📍',short:'하루 이동 기록',w:'위치 정보는 사생활을 드러내므로 지켜야 해요.'},
    {t:'학원 CCTV에 찍힌 내 모습이 담긴 영상',c:0,ic:'🎥',short:'CCTV 속 내 모습',w:'얼굴이 담긴 영상은 개인을 알아볼 수 있게 해 줘서 지켜야 해요.'},
    {t:'독감으로 병원에서 받은 진료 기록',c:0,ic:'🩺',short:'진료 기록',w:'의료 정보는 보호해야 할 정보예요.'},
    {t:'시청 앞에 새로 생긴 식당들의 목록과 후기',c:1,ic:'🍜',short:'새 식당 목록',w:'맛집 정보는 나누면 여러 사람에게 도움이 돼요.'},
    {t:'손 씻기 같은 감기 예방 수칙',c:1,ic:'🧼',short:'감기 예방 수칙',w:'건강 상식은 공공의 이익을 위해 나누는 정보예요.'},
    {t:'연휴에 고속도로가 막히는 구간 안내',c:1,ic:'🛣️',short:'정체 구간 안내',w:'교통 정보는 많은 사람이 알수록 좋아요.'},
    {t:'해외 여행지의 치안과 안전 수칙 안내',c:1,ic:'🧳',short:'여행지 안전 안내',w:'여행 정보는 공유하면 다른 사람의 안전에도 도움이 돼요.'},
  ],
  end:'<b>개인 정보와 저작권이 있는 저작물</b>, 그리고 안보와 관련된 정보는 보호하고, <b>개인과 공공의 이익</b>이 되는 정보는 공유해요.'
});

/* 06 심화 · 앱 사용 권한 점검(가상의 앱) */
(function(){
  const APPS=[
    {n:'손전등 앱',ic:'🔦',job:'카메라 플래시를 켜서 불을 밝혀요.',p:[['카메라(플래시)',1],['연락처',0],['위치',0],['마이크',0]]},
    {n:'길 찾기 앱',ic:'🗺️',job:'지금 있는 곳에서 목적지까지 길을 알려 줘요.',p:[['위치',1],['연락처',0],['통화 기록',0]]},
    {n:'사진 꾸미기 앱',ic:'🎨',job:'갤러리에서 사진을 골라 스티커를 붙여 꾸며요.',p:[['사진',1],['연락처',0],['위치',0],['통화 기록',0]]},
  ];
  const B=$('permSim'), msg=$('permMsg'); let done=false;
  B.innerHTML=APPS.map(a=>`<div class="is-app"><div class="hd"><span>${a.ic}</span><div><b>${a.n}</b><small>${a.job}</small></div></div><div class="ps">${a.p.map(([p,need])=>`<button data-need="${need}">${p}</button>`).join('')}</div></div>`).join('');
  const bs=[...B.querySelectorAll('.ps button')];
  bs.forEach(b=>b.onclick=()=>{ if(done) return; b.classList.toggle('off'); });
  $('permCheck').onclick=()=>{
    done=true; let hit=0, miss=0, bad=0;
    bs.forEach(b=>{const need=b.dataset.need==='1', off=b.classList.contains('off'); b.classList.remove('ok','ng','miss');
      if(!need&&off){hit++; b.classList.add('ok');} else if(!need){miss++; b.classList.add('miss');} else if(off){bad++; b.classList.add('ng');}});
    const all=bs.filter(b=>b.dataset.need==='0').length;
    msg.innerHTML=`필요 없는 권한 ${all}개 가운데 <b>${hit}개</b>를 찾았어요.`+(miss?' 점선은 놓친 권한이에요.':'')+(bad?' 빨간색은 앱이 제 일을 하는 데 필요한 권한이에요.':'')+' 앱이 <b>하는 일</b>과 관계없는 권한을 요청하면 의심해 봐요.';
    MEMO.permRes=`가상 앱 권한 점검: 필요 없는 권한 ${all}개 중 ${hit}개 찾음`; store.set(MK,MEMO);
  };
  $('permReset').onclick=()=>{ done=false; bs.forEach(b=>b.classList.remove('off','ok','ng','miss')); msg.textContent=''; };
})();

/* 06 03에서 고른 사례 보여 주기 */
onShow[6]=()=>{const c=String(MEMO.casePick||'').trim(), w=String(MEMO.caseWhy||'').trim(); $('caseRecall').innerHTML=c?`고른 사례: <b>${esc(c)}</b>`+(w?`<br><span class="muted">${esc(w)}</span>`:''):'아직 03에서 사례를 고르지 않았어요. 03으로 돌아가 하나 골라요.';};

/* 07 마무리 */
const MEMOLIST=[['firstGuess','처음 짐작(스마트폰에 생긴 문제)'],['ruleBreak','원칙이 깨지는 생활 속 상황'],['symptomWhy','처음의 스마트폰 다시 보기'],['casePick','고른 위협 사례'],['caseWhy','사례의 위협 요소와 피해'],['techPick','사례에 도움이 될 보안 기술'],['techWhy','그 기술이 도움이 되는 까닭'],['userScore','정보 사용자 실천 점수'],['weakPlan','가장 낮은 항목의 실천 계획'],['pwTry','비밀번호 점검기'],['ck3','성취도 평가(정보 보안 기술 활용)'],['fitUser','원인 · 사용자 측면'],['fitSupp','원인 · 공급자 측면'],['fitWhen','가장 중요한 시점과 방법'],['ruleUser','실천 규칙 · 사용자'],['ruleSupp','실천 규칙 · 공급자'],['selfCheckPick','학업 성취도 점검'],['extraPick','고른 선택 활동'],['permRes','심화 · 앱 권한 점검 결과'],['permWhy','심화 · 필요 없는 권한'],['keyQ','핵심 질문에 대한 내 답'],['newLearn','새롭게 알게 된 점']];
/* 접어 둔 활동과 선택 활동 메모는 쓴 것만 모아 보기에 보여 줌 */
const OPT=[['pwTry'],['fitUser','fitSupp','fitWhen','ruleUser','ruleSupp'],['selfCheckPick','extraPick'],['permRes','permWhy']];
onShow[7]=()=>{const hide=OPT.filter(g=>!g.some(k=>String(MEMO[k]||'').trim())).flat(); memoSummary('msum',MEMOLIST.filter(([k])=>!hide.includes(k)));};
