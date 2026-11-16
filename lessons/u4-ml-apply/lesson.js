/* 01 기계학습으로 풀 수 있을까? (새로 만든 상황) */
sorter('solveSort',{
  cats:[{n:'풀 수 있어요',k:'#1f9d74'},{n:'풀기 어려워요',k:'#d64535'}],
  items:[
    {t:'지난 5년 동안의 날씨, 요일, 행사 기록과 매점 빵 판매량으로 다음 주 빵 판매량을 예측한다',ic:'🥐',c:0,short:'다음 주 빵 판매량',w:'날씨나 요일에 따라 판매량이 오르내리는 패턴이 있고, 5년 치 기록이 넉넉해요.'},
    {t:'공정한 주사위를 던졌을 때 다음에 나올 눈을 지난 1,000번의 기록으로 맞힌다',ic:'🎲',c:1,short:'주사위의 다음 눈',w:'기록이 아무리 많아도 눈은 무작위로 나와서 학습할 패턴이 없어요.'},
    {t:'「병든 잎」 「건강한 잎」 이름표가 붙은 잎 사진 수만 장으로 새 잎 사진을 판별한다',ic:'🌿',c:0,short:'잎 사진 판별',w:'이름표가 붙은 사진이 많아서, 병든 잎의 색과 무늬 패턴을 학습할 수 있어요.'},
    {t:'오늘 처음 문을 연 가게의 하루 치 매출 기록만으로 내년 한 해 매출을 예측한다',ic:'🏪',c:1,short:'하루 치로 1년 예측',w:'학습할 데이터가 하루 치뿐이라 충분하지 않아요. 기록이 더 쌓여야 해요.'},
    {t:'도서관 이용자들의 대출 기록을 보고 읽는 책의 취향이 비슷한 이용자끼리 무리를 찾는다',ic:'📚',c:0,short:'비슷한 독자 무리',w:'대출 기록에 취향의 패턴이 담겨 있어서, 비슷한 이용자를 묶을 수 있어요.'},
    {t:'잘 섞은 카드 묶음에서 맨 위에 올 카드를 지난번 순서들로 맞힌다',ic:'🃏',c:1,short:'섞은 카드 맞히기',w:'잘 섞은 카드의 순서는 무작위라서 지난 순서에서 배울 패턴이 없어요.'}
  ],
  end:'<b>패턴</b>이 있고 학습할 <b>데이터가 충분</b>하면 기계학습으로 풀 수 있어요. 무작위로 정해지거나 데이터가 모자라면 풀기 어려워요.'
});

/* 02 함께 해결하기: SDGs 목표 고르기 */
chips('sdgPick','sdgPickName',['1 빈곤층 감소와 사회 안전망 강화','2 식량 안보와 지속 가능한 농업','3 건강하고 행복한 삶','4 모두를 위한 양질의 교육','5 성평등 보장','6 건강하고 안전한 물 관리','7 에너지의 친환경적 생산과 소비','8 좋은 일자리 확대와 경제 성장','9 산업 혁신과 사회 기반 시설 확충','10 모든 종류의 불평등 해소','11 지속 가능한 도시와 주거지','12 지속 가능한 생산과 소비','13 기후 변화 대응','14 해양 생태계 보전','15 육상 생태계 보전','16 인권, 정의, 평화','17 지구촌 협력 확대'],false);
chips('sdgType','sdgTypePick',['분류','회귀','군집'],false);

/* 03 위젯 연결 흐름도 */
function maFlow(svgId,tblId,W,H,nodes,edges){
  const col={D:'#f2b84b',T:'#f0875a',M:'#e58fc4',E:'#6cc3cf',O:'#c3c9d2'}, BW=166, BH=48, N={};
  nodes.forEach(n=>N[n.id]=n);
  let g=`<defs><marker id="${svgId}A" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#8a94a3"/></marker></defs>`;
  edges.forEach(([a,b,lab,dy])=>{
    const p=N[a], q=N[b], x1=p.x+BW, y1=p.y+BH/2, x2=q.x-2, y2=q.y+BH/2+(dy||0);
    g+=`<path d="M${x1} ${y1}C${x1+50} ${y1} ${x2-50} ${y2} ${x2} ${y2}" class="fe" marker-end="url(#${svgId}A)"/>`;
    if(lab) g+=`<text x="${x2-10}" y="${dy>0?y2+16:y2-8}" class="fl">${lab}</text>`;
  });
  nodes.forEach(n=>{
    const c=col[n.c], num=n.s?`<text x="${n.x+14}" y="${n.y+29}" class="fnum">${n.s}</text>`:'';
    g+=`<g class="fn${n.s?'':' old'}"${n.s?` data-s="${n.s}" tabindex="0"`:''}><rect x="${n.x}" y="${n.y}" width="${BW}" height="${BH}" rx="10" class="fb" style="stroke:${c}"/><rect x="${n.x}" y="${n.y}" width="28" height="${BH}" rx="10" fill="${c}"/><rect x="${n.x+18}" y="${n.y}" width="10" height="${BH}" fill="${c}"/>${num}<text x="${n.x+36}" y="${n.y+(n.sub?20:29)}" class="ft">${n.t}</text>${n.sub?`<text x="${n.x+36}" y="${n.y+37}" class="fs">${n.sub}</text>`:''}</g>`;
  });
  const S=$(svgId); S.setAttribute('viewBox',`0 0 ${W} ${H}`); S.innerHTML=g;
  const pick=s=>{
    S.querySelectorAll('.fn').forEach(x=>x.classList.toggle('on',x.dataset.s===s));
    $(tblId).querySelectorAll('tr[data-s]').forEach(tr=>tr.classList.toggle('hl',tr.dataset.s===s));
    const tr=$(tblId).querySelector(`tr[data-s="${s}"]`); if(tr) tr.scrollIntoView({behavior:'smooth',block:'nearest'});
  };
  S.querySelectorAll('.fn[data-s]').forEach(x=>{x.onclick=()=>pick(x.dataset.s); x.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(x.dataset.s);}};});
  $(tblId).querySelectorAll('tr[data-s]').forEach(tr=>tr.onclick=()=>pick(tr.dataset.s));
}
maFlow('calFlow','calSet',1130,232,[
  {id:'c',t:'calories',sub:'File · calories.csv',c:'O',x:10,y:20},{id:'e',t:'exercise',sub:'File · exercise.csv',c:'O',x:10,y:150},
  {id:'m',t:'Merge Data',sub:'두 파일 합치기',c:'O',x:200,y:85},
  {id:'1',s:'1',t:'Select Columns',sub:'역할 정하기',c:'T',x:390,y:85},
  {id:'2',s:'2',t:'Data Sampler',sub:'80% : 20%',c:'T',x:580,y:85},
  {id:'3',s:'3',t:'Linear Regression',sub:'선형 회귀로 학습',c:'M',x:780,y:12},
  {id:'4',s:'4',t:'Predictions',sub:'예측값 · 평가 지표',c:'E',x:955,y:150}
],[['c','m','Data',-10],['e','m','Extra Data',10],['m','1'],['1','2'],['2','3','Data Sample → Data'],['3','4','Model → Predictors',-10],['2','4','Remaining Data → Data',10]]);
chips('calDone','calDonePick',['칼로리 데이터 흐름 열기','Select Columns로 역할 정하기','Data Sampler 80%','Linear Regression 연결','Predictions에 Remaining Data 연결','R2와 MAE 확인'],true);

/* 03 평가 지표 미리 보기: 새로 만든 6명 */
(function(){
  const Y=[42,88,135,61,190,104];
  const MODELS=[
    {n:'모델 A',d:'운동 시간 · 심장 박동 수 · 체온 등을 함께 쓴 모델',p:[47,82,140,58,181,110]},
    {n:'모델 B',d:'속성을 일부만 쓴 모델',p:[70,95,105,80,130,100]}
  ];
  const f1=v=>(Math.round(v*10)/10).toFixed(1), f3=v=>(Math.round(v*1000)/1000).toFixed(3);
  function stats(p){
    const err=p.map((v,i)=>v-Y[i]), mae=err.reduce((a,e)=>a+Math.abs(e),0)/Y.length;
    const m=Y.reduce((a,b)=>a+b,0)/Y.length, sr=err.reduce((a,e)=>a+e*e,0), st=Y.reduce((a,y)=>a+(y-m)*(y-m),0);
    return {err,mae,r2:1-sr/st};
  }
  function show(k){
    const M=MODELS[k], s=stats(M.p);
    $('evalBtns').querySelectorAll('button').forEach((b,i)=>b.classList.toggle('on',i===k));
    $('evalTbl').innerHTML=`<table class="tbl ma-ev"><tr><th>사람</th><th>실젯값 (kcal)</th><th>예측값</th><th>오차 (error)</th></tr>${Y.map((y,i)=>`<tr><td>${i+1}</td><td>${y}</td><td>${M.p[i]}</td><td class="${Math.abs(s.err[i])>=20?'big':''}">${s.err[i]>0?'+':''}${s.err[i]}</td></tr>`).join('')}<tr class="st"><td colspan="3">MAE (오차 절댓값의 평균)</td><td><b>${f1(s.mae)}</b></td></tr><tr class="st"><td colspan="3">R2 (결정계수)</td><td><b>${f3(s.r2)}</b></td></tr></table>`;
    const X=v=>40+(v-20)/(200-20)*240, Yp=v=>230-(v-20)/(200-20)*210;
    let g=`<line x1="${X(20)}" y1="${Yp(20)}" x2="${X(200)}" y2="${Yp(200)}" class="dg"/>`;
    [50,100,150,200].forEach(t=>{g+=`<line x1="${X(t)}" y1="${Yp(20)}" x2="${X(t)}" y2="${Yp(200)}" class="gl"/><line x1="${X(20)}" y1="${Yp(t)}" x2="${X(200)}" y2="${Yp(t)}" class="gl"/><text x="${X(t)}" y="246" class="tk">${t}</text><text x="34" y="${Yp(t)+4}" class="tk e">${t}</text>`;});
    g+=`<text x="${X(110)}" y="259" class="ax">실젯값</text><text x="12" y="${Yp(110)}" class="ax" transform="rotate(-90 12 ${Yp(110)})">예측값</text>`;
    Y.forEach((y,i)=>{g+=`<line x1="${X(y)}" y1="${Yp(y)}" x2="${X(y)}" y2="${Yp(M.p[i])}" class="er"/><circle cx="${X(y)}" cy="${Yp(M.p[i])}" r="6" class="pt ${k?'b':''}"/>`;});
    $('evalPlot').innerHTML=g;
    $('evalMsg').innerHTML=k===0
      ?`<b>${M.n}</b>(${M.d}) · 점이 대각선 가까이 모여 있어요. 평균 <b>${f1(s.mae)}kcal</b>쯤 어긋나고, R2가 <b>1에 가까워요</b>.`
      :`<b>${M.n}</b>(${M.d}) · 점이 대각선에서 많이 벗어나요. 평균 <b>${f1(s.mae)}kcal</b>쯤 어긋나고, R2가 모델 A보다 <b>작아요</b>.`;
  }
  $('evalBtns').innerHTML=MODELS.map((M,i)=>`<button class="btn sm ghost" data-i="${i}">${M.n}<small>${M.d}</small></button>`).join('');
  $('evalBtns').querySelectorAll('button').forEach(b=>b.onclick=()=>show(+b.dataset.i));
  show(0);
})();

/* 04 어떤 유형으로 풀까? (새로 만든 상황) */
sorter('typeSort',{
  cats:[{n:'분류',k:'#e0702b'},{n:'회귀',k:'#2f6fd0'},{n:'군집',k:'#9b4fc4'}],
  items:[
    {t:'택배 상자 사진마다 「깨짐」 「멀쩡함」 이름표를 붙여 학습한 뒤, 새 상자 사진의 상태를 가려낸다',ic:'📦',c:0,short:'상자 상태 가려내기',w:'정해진 두 범주 가운데 하나를 고르니 지도학습의 분류예요.'},
    {t:'새 울음소리 녹음 수천 개에 새 이름을 달아 학습하고, 새 녹음이 어느 새인지 정한다',ic:'🐦',c:0,short:'울음소리로 새 이름',w:'새 이름이라는 범주를 고르는 분류예요.'},
    {t:'공공 자전거 대여소의 날씨, 요일, 시간대 기록으로 내일 오후 대여 건수가 몇 건일지 알아본다',ic:'🚲',c:1,short:'내일 대여 건수',w:'대여 건수라는 수치를 예측하니 회귀예요.'},
    {t:'아파트의 넓이, 층수, 지어진 해로 그 집의 가격을 미리 계산해 둔다',ic:'🏢',c:1,short:'아파트 가격',w:'가격처럼 연속적인 값을 예측하는 회귀예요.'},
    {t:'이름표가 없는 음악 재생 기록에서 듣는 곡이 비슷한 이용자 무리를 찾아낸다',ic:'🎧',c:2,short:'음악 취향 무리',w:'레이블 없이 비슷한 것끼리 모으는 비지도학습의 군집이에요.'},
    {t:'가로등 고장 신고 위치를 서로 가까운 곳끼리 몇 개 구역으로 나눠 점검 담당을 정한다',ic:'💡',c:2,short:'고장 신고 구역',w:'위치가 가까운 것끼리 나누는 군집이에요. 선박 위치를 k-평균으로 묶은 것과 같은 생각이에요.'}
  ],
  end:'예측하고자 하는 값이 <b>범주</b>면 분류, <b>연속형 수치</b>면 회귀, <b>레이블 없이</b> 비슷한 것끼리 묶으면 군집이에요.'
});

/* 05 마무리: 처음 생각 다시 보기 */
function maPlan(){
  const v=(MEMO.planQ||'').trim();
  $('planShow').innerHTML=v?`<small>처음에 적은 내 생각</small>${esc(v)}`:'<small>처음에 적은 내 생각</small><span class="muted">(시작 화면에서 적지 않았어요)</span>';
}

const MEMOLIST=[['planQ','처음 생각: 기계학습으로 해결하면 좋을 문제'],['solveWhy','풀기 어려운 문제와 까닭'],['sdgPickName','고른 SDGs 목표'],['sdgIdea','해결할 문제와 기계학습 방법'],['sdgTypePick','알맞은 기계학습 유형'],['calDonePick','칼로리 실습 진행 체크'],['calRes','내 모델의 R2와 MAE'],['calRead','평가 지표로 본 모델 성능'],['calMore','(선택) 독립 변수를 바꿔 본 결과'],['galaxyRes','(선택) 은하 분류 결과'],['shipRes','(선택) 선박 군집화 결과'],['kmRes','(선택) k-평균 노트북 결과'],['keyQ','핵심 질문에 대한 내 답'],['newLearn','새롭게 알게 된 점']];
onShow[5]=()=>{maPlan(); memoSummary('msum',MEMOLIST);};
