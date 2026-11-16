/* 01 스토리: SDGs 목표 */
chips('sdgPick','sdgPickName',['1 빈곤층 감소와 사회 안전망 강화','2 식량 안보와 지속 가능한 농업','3 건강하고 행복한 삶','4 모두를 위한 양질의 교육','5 성평등 보장','6 건강하고 안전한 물 관리','7 에너지의 친환경적 생산과 소비','8 좋은 일자리 확대와 경제 성장','9 산업 혁신과 사회 기반 시설 확충','10 모든 종류의 불평등 해소','11 지속 가능한 도시와 주거지','12 지속 가능한 생산과 소비','13 기후 변화 대응','14 해양 생태계 보전','15 육상 생태계 보전','16 인권, 정의, 평화','17 지구촌 협력 확대'],true);

/* 02 유형 · 알고리즘 선정 */
chips('typePick','typePickName',['지도학습(분류)','지도학습(회귀)','비지도학습(군집)'],false);
chips('algoPick','algoPickName',['k-최근접 이웃','의사결정트리','로지스틱 회귀','선형 회귀','k-평균'],false);

/* 02 위젯 연결 흐름도 */
function r4Flow(svgId,tblId,W,H,nodes,edges){
  const col={D:'#f2b84b',T:'#f0875a',M:'#e58fc4',E:'#6cc3cf'}, BW=166, BH=48, N={};
  nodes.forEach(n=>N[n.s]=n);
  let g=`<defs><marker id="${svgId}A" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#8a94a3"/></marker></defs>`;
  edges.forEach(([a,b,lab,dy])=>{
    const p=N[a], q=N[b], x1=p.x+BW, y1=p.y+BH/2, x2=q.x-2, y2=q.y+BH/2+(dy||0);
    g+=`<path d="M${x1} ${y1}C${x1+50} ${y1} ${x2-50} ${y2} ${x2} ${y2}" class="fe" marker-end="url(#${svgId}A)"/>`;
    if(lab) g+=`<text x="${x2-10}" y="${dy>0?y2+16:y2-8}" class="fl">${lab}</text>`;
  });
  nodes.forEach(n=>{
    const c=col[n.c];
    g+=`<g class="fn" data-s="${n.s}" tabindex="0"><rect x="${n.x}" y="${n.y}" width="${BW}" height="${BH}" rx="10" class="fb" style="stroke:${c}"/><rect x="${n.x}" y="${n.y}" width="28" height="${BH}" rx="10" fill="${c}"/><rect x="${n.x+18}" y="${n.y}" width="10" height="${BH}" fill="${c}"/><text x="${n.x+14}" y="${n.y+29}" class="fnum">${n.s}</text><text x="${n.x+36}" y="${n.y+(n.sub?20:29)}" class="ft">${n.t}</text>${n.sub?`<text x="${n.x+36}" y="${n.y+37}" class="fs">${n.sub}</text>`:''}</g>`;
  });
  const S=$(svgId); S.setAttribute('viewBox',`0 0 ${W} ${H}`); S.innerHTML=g;
  const pick=s=>{
    S.querySelectorAll('.fn').forEach(x=>x.classList.toggle('on',x.dataset.s===s));
    $(tblId).querySelectorAll('tr[data-s]').forEach(tr=>tr.classList.toggle('hl',tr.dataset.s===s));
    const tr=$(tblId).querySelector(`tr[data-s="${s}"]`); if(tr) tr.scrollIntoView({behavior:'smooth',block:'nearest'});
  };
  S.querySelectorAll('.fn').forEach(x=>{x.onclick=()=>pick(x.dataset.s); x.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(x.dataset.s);}};});
  $(tblId).querySelectorAll('tr[data-s]').forEach(tr=>tr.onclick=()=>pick(tr.dataset.s));
}
r4Flow('pmFlow','pmSet',1000,200,[
  {s:'1',t:'File',sub:'서울시 데이터(최종).csv',c:'D',x:10,y:76},
  {s:'2',t:'Impute',sub:'결측치 제거',c:'T',x:210,y:76},
  {s:'3',t:'Data Sampler',sub:'85% : 15%',c:'T',x:410,y:76},
  {s:'4',t:'Linear Regression',sub:'선형 회귀로 학습',c:'M',x:640,y:8},
  {s:'5',t:'Predictions',sub:'예측값 · 평가 지표',c:'E',x:825,y:140}
],[['1','2'],['2','3'],['3','4','Data Sample → Data'],['4','5','Model → Predictors',-10],['3','5','Remaining Data → Data',10]]);
chips('pmDone','pmDonePick',['파일 불러오기','Role 정하기(skip, target, feature)','Impute로 결측치 제거','Data Sampler 85%','Linear Regression 연결','Predictions에 Remaining Data 연결','R2와 MAE 확인'],true);

/* 02 · 03 프로젝트 카드: 적은 메모로 바로 채우기 */
function r4Card(){
  const v=k=>(MEMO[k]||'').trim();
  const t=(k,ph)=>v(k)?esc(v(k)):`<span class="e">${ph}</span>`;
  const html=`<div class="r4-card">
    <div class="r4-hd"><b>${esc(v('team')||'우리 모둠')}</b><small>초미세 먼지 농도는 얼마일까?</small></div>
    <div class="pb"><b>SDGs</b> ${t('sdgPickName','01에서 목표 고르기')}<br><b>발생할 문제</b> ${t('storyProblem','01에서 적기')}<br><b>해결할 아이디어</b> ${t('storyIdea','01에서 적기')}</div>
    <div class="r4-steps">
      <div style="--k:#1f9d74"><h5>데이터</h5>${t('relData','01에서 연관된 데이터 적기')}</div>
      <div style="--k:#e0702b"><h5>모델</h5>${t('typePickName','유형 고르기')}<br>${t('algoPickName','알고리즘 고르기')}</div>
      <div style="--k:#2f6fd0"><h5>평가</h5>${t('pmRes','R2 · MAE 적기')}</div>
      <div style="--k:#9b4fc4"><h5>성찰</h5>${t('reflectImpact','사회에 미칠 영향')}<br>${t('reflectEffort','')}</div>
    </div>
  </div>`;
  $('projCard').innerHTML=html; $('projCard2').innerHTML=html;
}
document.addEventListener('input',e=>{ if(e.target.matches&&e.target.matches('[data-memo]')) setTimeout(r4Card,350); });
['sdgPick','typePick','algoPick'].forEach(id=>$(id).addEventListener('memo',r4Card));
onShow[2]=r4Card;
onShow[3]=r4Card;

/* 03 평가하기 (203쪽 평가 기준을 줄여서) */
chips('selfEval','selfEvalPick',['SDGs 달성에 알맞은 주제를 골랐다','알맞은 데이터를 모으고 전처리했다','모둠원과 힘을 합쳐 해결했다','만든 모델로 문제를 해결했다','배우고 느낀 점을 정리했다'],true);
chips('compPick','compPickName',['지식 정보 처리','창의적 사고','협력적 소통','공동체 역량'],true);

/* 04 진로: 인터뷰 카드 (교과서 204쪽 내용을 줄여서) */
flipCards('careerCards',[
  {ic:'💬',f:'어떤 일을 하나요?',s:'눌러서 답 보기',b:'사람의 언어를 컴퓨터가 이해하고 처리하게 하는 <b>자연어 처리</b> 기술을 연구하고 개발해요. 챗봇이 더 똑똑하게 대화하도록 돕고, 챗봇 말고도 여러 영역에서 중요한 역할을 해요.'},
  {ic:'🧪',f:'처음 프로젝트와 지금 프로젝트',s:'눌러서 답 보기',b:'처음에는 텍스트 데이터를 <b>주제별로 나누고 분석하는</b> 간단한 알고리즘을 만들며 기초 기술을 익혔어요. 지금은 사용자와 자연스럽게 대화하며 상호 작용하는 <b>대화형 인공지능 챗봇</b>을 개발하고 있어요.'},
  {ic:'🌱',f:'인공지능 분야를 추천하는 까닭',s:'눌러서 답 보기',b:'인공지능은 <b>다양한 분야</b>에 쓰여서 관심사와 진로에 따라 여러 곳에서 일할 수 있어요. <b>복잡한 문제를 해결하는 능력</b>을 키울 수 있고, 이 능력은 다른 분야에서도 쓸모 있어요.'},
]);
chips('careerSkill','careerSkillPick',['글쓰기와 언어에 대한 관심','언어 데이터 다루기','프로그래밍','복잡한 문제를 해결하는 능력','협력과 소통'],true);

/* 05 단원 정리: 어떤 방법일까? (새로 만든 상황) */
sorter('unitSort',{
  cats:[{n:'k-최근접 이웃',k:'#2f6fd0'},{n:'로지스틱 회귀',k:'#e0702b'},{n:'선형 회귀',k:'#1f9d74'},{n:'k-평균',k:'#9b4fc4'},{n:'앙상블',k:'#d64535'}],
  items:[
    {t:'처음 보는 과일의 무게와 색을 재고, 그와 가장 가까운 과일 3개 가운데 많은 쪽의 종류로 정한다',ic:'🍎',c:0,short:'가장 가까운 과일 3개',w:'새 데이터와 거리가 가까운 이웃 몇 개를 보고 분류해요.'},
    {t:'메일마다 스팸일 확률을 0과 1 사이 값으로 구해, 0.5를 넘으면 스팸으로 나눈다',ic:'📧',c:1,short:'스팸일 확률',w:'확률을 구해 두 가지 가운데 하나로 나누는 이진 분류에 많이 써요.'},
    {t:'광고비와 판매량 기록에 오차가 가장 작은 직선을 그어 다음 달 판매량을 예측한다',ic:'📈',c:2,short:'광고비와 판매량 직선',w:'오차를 최소화하는 직선으로 연속적인 값을 예측해요.'},
    {t:'키와 신발 크기 데이터를 가장 잘 나타내는 직선으로 키에 맞는 신발 크기를 계산해 알려 준다',ic:'👟',c:2,short:'키와 신발 크기 직선',w:'독립 변수와 종속변수의 관계를 직선으로 나타내요.'},
    {t:'이름표 없는 배달 주소를 4묶음으로 나누고, 묶음마다 중심을 다시 구해 가며 묶음을 고친다',ic:'🛵',c:3,short:'배달 주소 4묶음',w:'중심을 옮겨 가며 거리가 가까운 것끼리 묶는 군집 방법이에요.'},
    {t:'의사결정트리 여러 개가 각각 낸 답을 모아 다수결로 최종 답을 정한다',ic:'🌳',c:4,short:'트리 여러 개의 다수결',w:'여러 모델을 결합해 성능을 높여요.'},
  ],
  end:'거리로 <b>분류</b>하면 k-최근접 이웃, 확률 곡선으로 <b>두 범주</b>를 가르면 로지스틱 회귀, 오차가 가장 작은 <b>직선</b>은 선형 회귀, 거리로 <b>군집</b>을 만들면 k-평균, 여러 모델을 <b>합치면</b> 앙상블이에요.'
});
chips('unitComp','unitCompPick',['컴퓨팅 사고력','추상화 능력','자동화 능력','창의·융합 능력','디지털 문화 소양','디지털 의사소통·협업 능력','디지털 윤리 의식','디지털 기술 활용 능력','인공지능 소양','인공지능 문제 해결력','데이터 문해력','인공지능 윤리 의식'],true);

const MEMOLIST=[['team','모둠명'],['roles','모둠원과 역할'],['harm','미세 먼지의 피해와 위험성'],['relData','미세 먼지 예측과 연관된 데이터'],['sdgPickName','고른 SDGs 목표'],['storyProblem','발생할 문제'],['storyIdea','해결할 아이디어'],['typePickName','기계학습 유형'],['algoPickName','알고리즘'],['algoWhy','유형과 알고리즘을 고른 까닭'],['pmDonePick','실습 진행 체크'],['pmRes','우리 모델의 R2와 MAE'],['pmRead','평가와 개선 아이디어'],['reflectImpact','성찰: 사회에 미칠 영향'],['reflectEffort','성찰: 우리가 노력해야 할 점'],['applyRes','(선택) 응용하기 결과'],['selfEvalPick','자기 평가'],['compPickName','길러진 역량'],['peer','동료 평가: 좋았던 모둠과 까닭'],['peerAsk','동료 평가: 질문이나 제안'],['career','진로 카드: 풀어 보고 싶은 문제와 데이터'],['careerSkillPick','진로 카드: 기르고 싶은 역량'],['unitCompPick','역량 Check'],['keyQ','단원 핵심 질문(기계학습)에 대한 내 답']];
onShow[6]=()=>memoSummary('msum',MEMOLIST);
