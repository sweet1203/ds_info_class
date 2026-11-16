/* 01 사례 속 개인 정보 찾기 (새로 지은 가상의 사례) */
const R5_STORY=[
  '고등학생 ㄱ 학생은 체육 대회 날 반 친구들과 찍은 사진을 SNS에 <b>전체 공개</b>로 올렸다. 사진에는 ㄱ 학생의 ',
  {t:'얼굴',p:1,w:'얼굴을 보면 ㄱ 학생을 바로 알아볼 수 있어요.'},
  '이 또렷하게 나오고, 체육복에 붙인 ',
  {t:'이름표',p:1,w:'이름은 ㄱ 학생을 가리키는 대표적인 개인 정보예요.'},
  '도 읽을 수 있었다. 반 티셔츠 등에는 ',
  {t:'학교 이름',p:1,w:'얼굴, 이름과 합쳐지면 ㄱ 학생이 어디에 다니는지 알 수 있어요.'},
  '이 크게 적혀 있었다. 설명란에는 우리 반 ',
  {t:'응원 구호',p:0,w:'반 응원 구호만으로는 ㄱ 학생을 알아볼 수 없어요.'},
  '와 함께 「사진 원본이 필요하면 문자 주세요」라는 말과 ',
  {t:'휴대 전화 번호',p:1,w:'모르는 사람이 ㄱ 학생에게 바로 연락할 수 있게 돼요.'},
  '를 남겼다. 「다음엔 언제 만나?」라는 댓글에는 「매주 화요일 ',
  {t:'저녁 7시 ○○학원 앞',p:1,w:'그 시간에 그곳에 가면 ㄱ 학생을 만날 수 있게 돼요.'},
  '에 있어」라고 답했다. 게시물은 하루 만에 ',
  {t:'좋아요 3천 개',p:0,w:'좋아요 수는 ㄱ 학생에 관한 정보가 아니에요.'},
  '를 넘었고, ',
  {t:'응원 댓글 수십 개',p:0,w:'댓글 개수만으로는 ㄱ 학생을 알아볼 수 없어요.'},
  '가 달렸다.'
];
function r5Story(){
  const B=$('findStory');
  B.innerHTML=R5_STORY.map((s,i)=>typeof s==='string'?s:`<button type="button" class="r5-tok" data-i="${i}">${esc(s.t)}</button>`).join('');
  B.querySelectorAll('.r5-tok').forEach(b=>b.onclick=()=>{ if(B.classList.contains('done')) return; b.classList.toggle('on'); });
  B.classList.remove('done'); $('findRes').innerHTML='';
}
$('findCheck').onclick=()=>{
  const B=$('findStory'); if(B.classList.contains('done')) return;
  const toks=[...B.querySelectorAll('.r5-tok')]; let hit=0, total=0, wrong=0;
  const notes=[];
  toks.forEach(b=>{
    const s=R5_STORY[+b.dataset.i], on=b.classList.contains('on');
    if(s.p) total++;
    if(s.p&&on){hit++; b.classList.add('ok');}
    else if(s.p&&!on){b.classList.add('miss'); notes.push(`<li><b>${esc(s.t)}</b> · ${s.w}</li>`);}
    else if(!s.p&&on){wrong++; b.classList.add('ng'); notes.push(`<li><b>${esc(s.t)}</b> · ${s.w}</li>`);}
  });
  B.classList.add('done');
  $('findRes').innerHTML=`<p><b>ㄱ 학생을 알아보거나, 연락하거나, 있는 곳을 알 수 있게 하는 정보 ${total}개 가운데 ${hit}개</b>를 찾았어요.${wrong?` 개인 정보가 아닌 것을 ${wrong}개 골랐어요.`:''}</p>`+
    (notes.length?`<ul>${notes.join('')}</ul>`:'')+
    `<div class="r5-after">📱 며칠 뒤, ㄱ 학생에게 모르는 번호로 「화요일 저녁에 학원 앞에서 기다릴게」라는 문자가 왔다.</div>`+
    `<p class="muted" style="margin:6px 0 0">하나하나는 사소해 보여도, 여러 정보가 합쳐지면 낯선 사람도 ㄱ 학생이 <b>언제, 어디에</b> 있는지 알 수 있어요.</p>`;
};
$('findReset').onclick=r5Story;
r5Story();
chips('rightPick','rightPickName',['언제','누구에게','어느 범위까지'],true);

/* 02 카드 뉴스 초안: 적는 대로 카드에 나타내기 */
const R5_THEME={'바다 파랑':['#1d4f91','#e8f1fc'],'숲 초록':['#17694f','#e6f5ee'],'노을 주황':['#b8551b','#fdf0e5'],'밤하늘 보라':['#5b2f86','#f2eafa']};
if(!MEMO.cnThemePick) MEMO.cnThemePick='바다 파랑';
chips('cnTheme','cnThemePick',Object.keys(R5_THEME),false);
const R5_CV=[
  {k:'cn1',ic:'📣',h:''},
  {k:'cn2',ic:'📰',h:'이런 일이 있었어요'},
  {k:'cn3',ic:'⚠️',h:'왜 문제일까요?'},
  {k:'cn4',ic:'🛡️',h:'이렇게 지켜요'},
  {k:'cn5',ic:'🤝',h:'함께 지켜요'}
];
function r5CN(){
  const v=k=>(MEMO[k]||'').trim();
  const th=R5_THEME[v('cnThemePick')]||R5_THEME['바다 파랑'];
  R5_CV.forEach((c,i)=>{
    const box=$('cv'+(i+1)); if(!box) return;
    const txt=v(c.k), n=txt.length;
    box.style.setProperty('--c1',th[0]); box.style.setProperty('--c2',th[1]);
    let body;
    if(i===0){
      body=`<div class="r5-cover"><i>${c.ic}</i><b${v('cnTitle').length>16?' class="sm"':''}>${v('cnTitle')?esc(v('cnTitle')):'<span class="e">제목을 적어요</span>'}</b><p>${txt?esc(txt):'<span class="e">한 줄 질문이나 문구</span>'}</p></div>`;
    }else{
      body=`<div class="r5-in"><h5>${c.ic} ${c.h}</h5><p>${txt?esc(txt):'<span class="e">아직 비어 있어요</span>'}</p>${i===4&&v('cnSource')?`<small class="src">출처 ${esc(v('cnSource'))}</small>`:''}</div>`;
    }
    box.innerHTML=body+`<span class="pg">${i+1} / 5</span>`+(n>(i===0?30:70)?`<span class="long">글이 길어요 (${n}자)</span>`:'');
  });
}
chips('cnCheck','cnCheckPick',['장면이 이야기처럼 이어진다','한 장에 한 가지만 담았다','폰트와 이미지의 이용 조건을 확인했다','마지막 장에 출처를 적었다','실제 개인 정보가 들어가지 않았다'],true);

/* 03 배포 계획 · 프로젝트 카드 */
chips('distKind','distKindPick',['온라인','오프라인'],true);
function r5Card(){
  const v=k=>(MEMO[k]||'').trim();
  const t=(k,ph)=>v(k)?esc(v(k)):`<span class="e">${ph}</span>`;
  const filled=R5_CV.filter(c=>v(c.k)).length;
  $('projCard').innerHTML=`<div class="r5-pc">
    <div class="r5-hd"><b>${esc(v('team')||'우리 모둠')}</b><small>내 개인 정보는 어떻게 지킬까?</small></div>
    <div class="pb"><b>사례</b> ${t('caseNote','01에서 적기')}<br><b>지켜지지 못한 것</b> ${t('caseRight','01에서 적기')}</div>
    <div class="r5-steps">
      <div style="--k:#d64535"><h5>해결 방안</h5>${t('solution','01에서 적기')}</div>
      <div style="--k:#e0702b"><h5>카드 뉴스</h5>${t('cnTitle','02에서 제목 적기')}<br><small class="muted">초안 ${filled} / 5장</small></div>
      <div style="--k:#1f9d74"><h5>배포 계획</h5>${t('distKindPick','구분 고르기')}<br>${t('distWhere','게시할 곳')}<br>${t('distWhen','게시 기간')}</div>
      <div style="--k:#2f6fd0"><h5>반응 확인</h5>${t('distReact','반응 정리 방법')}</div>
    </div>
  </div>`;
}
let r5T;
document.addEventListener('input',e=>{ if(e.target.matches&&e.target.matches('[data-memo]')){ clearTimeout(r5T); r5T=setTimeout(()=>{r5CN(); r5Card();},350); } });
['cnTheme','distKind'].forEach(id=>$(id).addEventListener('memo',()=>{r5CN(); r5Card();}));
r5CN();
onShow[2]=r5CN;
onShow[3]=r5Card;

/* 03 평가하기 (235쪽 평가 기준을 줄여서) */
chips('selfEval','selfEvalPick',['주제에 맞는 사례를 골랐다','구체적인 해결 방안을 세웠다','내용이 잘 전달되게 카드 뉴스를 구성했다','다른 모둠의 의견을 받아 반영했다'],true);
chips('compPick','compPickName',['지식 정보 처리','창의적 사고','협력적 소통','공동체 역량'],true);

/* 04 진로: 인터뷰 카드 (교과서 236쪽 내용을 줄여서) */
flipCards('careerCards',[
  {ic:'🛡️',f:'어떤 일을 하나요?',s:'눌러서 답 보기',b:'불법적인 의도로 정보를 빼앗으려는 <b>블랙 해커</b>의 위협으로부터 시스템을 보호하고 안전을 유지해요. <b>모의 해킹</b>을 하거나 <b>사전 방어 시스템</b>을 구축해요.'},
  {ic:'📚',f:'무엇을 준비해야 하나요?',s:'눌러서 답 보기',b:'개발 언어, 클라우드 같은 새로운 환경과 해킹 기술에 관심을 갖고 <b>꾸준히 공부</b>해요. 두려움 대신 <b>호기심</b>으로 끈질기게 탐구하고, 같은 관심사를 가진 사람들과 의견을 나누며 스스로 배울 것을 찾아요.'},
  {ic:'🔭',f:'전망은 어떤가요?',s:'눌러서 답 보기',b:'국가와 기업에서는 정보가 곧 <b>경제적 가치</b>예요. 사물 인터넷, 클라우드 컴퓨팅, 모바일 기기 사용이 크게 늘어나는 <b>초연결 사회</b>일수록 정보 보안이 더 중요해져서, 화이트 해커의 수요가 늘어날 것으로 봐요.'},
  {ic:'🧭',f:'청소년에게 건네는 조언',s:'눌러서 답 보기',b:'화이트 해커와 블랙 해커를 가르는 가장 중요한 기준은 <b>높은 윤리 의식</b>이에요. 불법적인 유혹에 흔들리지 않아야 해요. 작은 목표와 작은 성공을 쌓아 가고, <b>개인으로서도</b> 보안을 지키는 방법을 꾸준히 실천해요.'}
]);
chips('careerSkill','careerSkillPick',['새로운 기술에 대한 호기심','끈기 있게 탐구하는 자세','함께 배우고 의견 나누기','프로그래밍','도덕적 가치를 지키는 태도'],true);

/* 05 단원 정리: 어떤 용어일까? (새로 만든 상황) */
sorter('unitSort',{
  cats:[{n:'웨어러블',k:'#2f6fd0'},{n:'메타버스',k:'#1f9d74'},{n:'데이터 엔지니어',k:'#e0702b'},{n:'악성 코드',k:'#d64535'},{n:'해킹',k:'#9b4fc4'}],
  items:[
    {t:'안경처럼 쓰는 기기가 길을 걸을 때 눈앞에 화살표를 띄워 갈 길을 알려 준다',ic:'👓',c:0,short:'길을 알려 주는 안경',w:'눈앞에 화면이 떠도 가상 세계에 들어간 것은 아니에요. 안경처럼 쓰고 다니는 기기라는 점이 핵심이에요.'},
    {t:'할머니가 손가락에 낀 반지가 밤사이 맥박이 갑자기 빨라진 것을 알아채 가족 휴대폰에 알림을 보냈다',ic:'💍',c:0,short:'맥박을 재는 반지',w:'반지처럼 늘 끼고 다니는 기기가 몸 상태를 재고 있었기 때문이에요.'},
    {t:'졸업한 선배들과 각자 고른 캐릭터로 온라인 속 학교 운동장에 모여 함께 축제 부스를 열었다',ic:'🎪',c:1,short:'온라인 속 학교 축제',w:'실제로 만나지 않고 캐릭터로 온라인 속 공간에 모여 축제라는 활동을 함께 했기 때문이에요.'},
    {t:'하루 수백만 건씩 들어오는 주문 기록이 끊기지 않고 서버에 쌓이도록 통로를 짓고, 분석하는 사람이 바로 꺼내 쓸 수 있게 기록 창고를 정리한다',ic:'🧰',c:2,short:'주문 기록이 다니는 통로 짓기',w:'주문 기록이 흘러 들어갈 길과 쌓아 둘 곳을 마련하는 것이 이 사람의 일이기 때문이에요.'},
    {t:'메일에 붙은 파일을 연 뒤부터 컴퓨터가 눈에 띄게 느려지고, 같은 메일이 주소록의 친구들에게 저절로 퍼져 나간다',ic:'🧨',c:3,short:'저절로 퍼지는 메일 파일',w:'누가 직접 들어온 것이 아니라 파일 속 프로그램이 스스로 퍼지며 피해를 주고 있기 때문이에요.'},
    {t:'출처를 모르는 게임 설치 파일을 열자 휴대폰 속 사진이 모두 잠기고, 풀어 주는 대가로 돈을 요구하는 창이 떴다',ic:'🔒',c:3,short:'사진을 잠그는 설치 파일',w:'설치 파일 속 프로그램이 사진을 잠가 돈을 요구하는 피해를 주었기 때문이에요.'},
    {t:'누군가 학교 누리집 관리자의 비밀번호를 여러 번 추측해 알아낸 뒤, 그 계정으로 서버에 몰래 들어가 학생 명단을 내려받는다',ic:'🕵️',c:4,short:'관리자 비밀번호를 알아내 접속',w:'프로그램이 아니라 사람이 비밀번호를 알아내 허락 없이 들어가는 행동이 문제이기 때문이에요.'}
  ],
  end:'헷갈릴 때는 <b>무엇이</b> 일을 하는지 보세요. 몸에 지닌 기기인지, 여럿이 모이는 온라인 속 공간인지, 기록이 다닐 길을 짓는 사람인지, 스스로 움직이는 프로그램인지, 몰래 들어오는 사람인지에 따라 갈려요.'
});
chips('unitComp','unitCompPick',['컴퓨팅 사고력','추상화 능력','자동화 능력','창의·융합 능력','디지털 문화 소양','디지털 의사소통·협업 능력','디지털 윤리 의식','디지털 기술 활용 능력','인공지능 소양','인공지능 문제 해결력','데이터 문해력','인공지능 윤리 의식'],true);

const MEMOLIST=[['team','모둠명'],['roles','역할 나누기'],['rightPickName','ㄱ 학생이 스스로 정하지 못한 것'],['caseNote','청소년의 개인 정보 침해 사례'],['caseRight','사례에서 지켜지지 못한 것'],['solution','구체적인 해결 방안'],['cnTitle','카드 뉴스 제목'],['cnThemePick','색 묶음'],['cn1','1장 표지'],['cn2','2장 이런 일이 있었어요'],['cn3','3장 왜 문제일까요?'],['cn4','4장 이렇게 지켜요'],['cn5','5장 함께 지켜요'],['cnSource','폰트, 이미지와 출처'],['cnCheckPick','초안 점검'],['distKindPick','배포 구분'],['distWhere','게시할 곳'],['distWhen','게시 기간'],['distReact','친구들의 반응 정리 방법'],['distCare','배포 시 유의할 점'],['distGuess','예상되는 친구들의 반응'],['selfEvalPick','자기 평가'],['compPickName','길러진 역량'],['peer','동료 평가: 좋았던 모둠과 까닭'],['peerAsk','동료 평가: 건넬 의견'],['career','진로 카드: 지키고 싶은 정보와 할 수 있는 일'],['careerSkillPick','진로 카드: 기르고 싶은 역량'],['unitCompPick','역량 Check'],['keyQ','단원 핵심 질문(정보 보호와 보안)에 대한 내 답']];
onShow[6]=()=>memoSummary('msum',MEMOLIST);
