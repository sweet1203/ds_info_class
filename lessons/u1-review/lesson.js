/* 01 문제 발견 */
chips('placePick','placePickName',['교실','도서관','급식실','복도·계단','운동장·체육관','화장실','과학실·특별실','기타'],false);
chips('topicPick','topicPickName',['학생','교사','교실','안전','알림','학교 환경'],true);

/* 02 시스템 설계: 고르기 */
chips('dSensor','dSensorPick',['인체 감지 센서','조도 센서','온습도 센서','초음파 센서','가스 센서','토양 수분 센서','이미지 센서(카메라)','압력 센서','버튼'],true);
chips('dOut','dOutPick',['LED','모터','부저','디스플레이','스피커','따로 없음(앱 알림)'],true);
chips('nPick','nPickName',['와이파이','블루투스','RFID','NFC','ZigBee(지그비)','Beacon(비콘)','유선'],false);

/* 02 설계 카드: 적은 메모로 바로 채우기 */
function rvCard(){
  const v=k=>(MEMO[k]||'').trim();
  const t=(k,ph)=>v(k)?esc(v(k)):`<span class="e">${ph}</span>`;
  const team=v('team')||'우리 모둠', place=v('placePickName');
  $('designCard').innerHTML=`<div class="rv-card">
    <div class="rv-hd"><b>${esc(team)}${place?' · '+esc(place):''}</b><small>미래의 학교 공간 설계 카드</small></div>
    <div class="pb"><b>문제</b> ${t('why','01 화면에서 불편한 이유를 적어요')}<br><b>주요 기능</b> ${t('func','01 화면에서 해결 방안을 적어요')}</div>
    <div class="rv-dnpc">
      <div style="--k:#2f6fd0"><h5>D 디바이스</h5>${t('dSensorPick','센서 고르기')}${v('dOutPick')?' → '+esc(v('dOutPick')):''}<br>${t('dHow','')}</div>
      <div style="--k:#1f9d74"><h5>N 네트워크</h5>${t('nPickName','네트워크 고르기')}</div>
      <div style="--k:#9b4fc4"><h5>P 플랫폼</h5>${t('pHow','무엇을 저장·분석할까')}</div>
      <div style="--k:#e0702b"><h5>C 서비스</h5>${t('cHow','누구에게 무엇을')}</div>
    </div>
    <div class="fl"><div><h5>동작 과정</h5>${t('flow','수집 → 전달 → 처리 및 분석 → 서비스 제공')}</div><div><h5>기대 효과 · 주의할 점</h5>${t('effect','기대 효과')}<br>${t('caution','주의할 점')}</div></div>
  </div>`;
}
document.addEventListener('input',e=>{ if(e.target.matches&&e.target.matches('[data-memo]')) rvCard(); });
['dSensor','dOut','nPick','placePick'].forEach(id=>$(id).addEventListener('memo',rvCard));
onShow[2]=rvCard;

/* 04 발표 준비 · 평가 */
chips('selfEval','selfEvalPick',['해결 가능한 주제를 골랐다','모둠원의 역할을 나누었다','초기 상태와 목표 상태를 파악했다','동작 과정에 맞게 설계했다','다른 학교에도 쓸 수 있는 설계다'],true);
chips('compPick','compPickName',['지식 정보 처리','창의적 사고','협력적 소통','공동체 역량'],true);

/* 03 진로: 인터뷰 카드 (교과서 44쪽 내용을 줄여서) */
flipCards('careerCards',[
  {ic:'🛠️',f:'어떤 일을 하시나요?',s:'눌러서 답 보기',b:'전자 제품 제조 회사에서 일해요. 전자 제품을 멀리서 작동할 수 있게 하는 <b>원격 제어 프로그램</b>을 개발해요.'},
  {ic:'📚',f:'무엇을 준비해야 하나요?',s:'눌러서 답 보기',b:'전자 기술, 데이터 과학, 네트워크, 인공지능 같은 첨단 기술을 쓰는 분야라 새 기술을 계속 익혀야 해요. <b>새로운 지식을 배우려는 열정</b>이 필요해요.'},
  {ic:'🔭',f:'앞으로의 전망은?',s:'눌러서 답 보기',b:'예전에는 사람과 사람을 잇는 통신 기술이 중심이었다면, 앞으로는 사람과 다양한 사물이 연결되는 <b>초연결 시대</b>예요. 그래서 전망이 밝다고 해요.'},
  {ic:'💬',f:'청소년에게 한마디',s:'눌러서 답 보기',b:'주변 전자 기기의 기능과 쓰임을 <b>주의 깊게 관찰</b>하고, 과학 기술로 삶을 더 편리하게 만들 방법을 생각해 보세요.'},
  {ic:'🏫',f:'오늘 우리가 한 일은?',s:'눌러서 보기',b:'학교 공간의 문제를 찾고 D·N·P·C로 시스템을 설계했어요. 사물 인터넷 개발자가 하는 일의 <b>첫 단계</b>와 같아요.'}
]);
chips('careerSkill','careerSkillPick',['새로운 지식을 배우려는 열정','주변 기기를 관찰하는 습관','프로그래밍','네트워크 이해','데이터 분석','협업과 소통'],true);

/* 05 단원 정리 */
sorter('dnpcSort',{
  cats:[{n:'D 디바이스',k:'#2f6fd0'},{n:'N 네트워크',k:'#1f9d74'},{n:'P 플랫폼',k:'#9b4fc4'},{n:'C 서비스',k:'#e0702b'}],
  items:[
    {t:'교실 창가에 단 미세 먼지 측정기 (센서와 와이파이 모듈, 작은 보드가 들어 있음)',ic:'🌫️',c:0,short:'미세 먼지 측정기',w:'센서로 데이터를 만들어 내고 통신 모듈까지 갖춘 장치예요.'},
    {t:'토양 수분 센서가 달린 화분',ic:'🪴',c:0,w:'센서로 데이터를 수집하는 사물이에요.'},
    {t:'센서가 모은 값을 와이파이로 보낸다',ic:'📶',c:1,short:'와이파이로 값 보내기',w:'유무선 통신으로 데이터를 전달해요.'},
    {t:'RFID 무선 통신이 차량 단말기와 톨게이트 사이에 결제 정보를 실어 나른다',ic:'🚗',c:1,short:'RFID 무선 통신',w:'RFID는 무선 주파수로 사물을 식별하는 통신 기술이에요.'},
    {t:'여러 교실 측정기에서 온 값을 클라우드에 모아 저장하고, 미세 먼지가 많은 교실을 골라낸다',ic:'☁️',c:2,short:'클라우드에 모아 분석',w:'플랫폼은 클라우드에 데이터를 저장하고 분석해요.'},
    {t:'Blynk처럼 장치와 앱 사이에서 명령과 데이터를 이어 주는 곳',ic:'🔗',c:2,short:'Blynk',w:'지난 시간 코드 읽기에서 본 사물 인터넷 플랫폼이에요.'},
    {t:'스마트폰 앱에 화분에 물을 줄 때라고 알려 준다',ic:'📱',c:3,short:'물 주기 알림',w:'분석 결과를 사용자에게 제공하는 서비스예요.'},
    {t:'분석한 결과를 사용자에게 맞춤형으로 제공한다',ic:'🎁',c:3,short:'맞춤형 제공',w:'헬스케어, 스마트 가전처럼 여러 분야의 서비스가 있어요.'}
  ],
  end:'<b>D</b>가 모으고 → <b>N</b>이 보내고 → <b>P</b>가 저장·분석하고 → <b>C</b>가 사용자에게 제공해요.'
});
chips('unitComp','unitCompPick',['컴퓨팅 사고력','추상화 능력','자동화 능력','창의·융합 능력','디지털 문화 소양','디지털 의사소통·협업 능력','디지털 윤리 의식','디지털 기술 활용 능력','인공지능 소양','인공지능 문제 해결력','데이터 문해력','인공지능 윤리 의식'],true);

const MEMOLIST=[['team','모둠명'],['roles','모둠원과 역할'],['placePickName','고른 학교 공간'],['topicPickName','주제'],['why','불편한 원인·개선이 필요한 이유'],['func','해결 방법과 주요 기능'],['dSensorPick','D 센서'],['dOutPick','D 출력 장치'],['dHow','D 감지와 동작'],['nPickName','N 네트워크'],['pHow','P 플랫폼'],['cHow','C 서비스'],['flow','동작 과정'],['effect','기대 효과'],['caution','주의할 점'],['pitch','발표 대본'],['selfEvalPick','자기 평가'],['compPickName','길러진 역량'],['peer','동료 평가: 좋았던 모둠과 까닭'],['peerAsk','동료 평가: 질문이나 제안'],['career','진로 카드: 바꿔 보고 싶은 기기'],['careerSkillPick','진로 카드: 기르고 싶은 역량'],['unitCompPick','역량 Check'],['keyQ','핵심 질문에 대한 내 답']];
onShow[6]=()=>memoSummary('msum',MEMOLIST);
