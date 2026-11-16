/* 공통 */
function usSave(){store.set(MK,MEMO);}
function usJoin(old,item,n){const a=(old||'').split(' / ').filter(Boolean).filter(x=>x!==item); a.push(item); return a.slice(-n).join(' / ');}
function usPt(svg,e){const p=svg.createSVGPoint(); p.x=e.clientX; p.y=e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse());}
const usF=v=>(Math.round(v*10)/10).toString();

/* 학습 목표 점검 */
chips('ck1','ck1',['비지도학습의 특징을 설명할 수 있다','군집 알고리즘의 원리를 설명할 수 있다'],true);

/* 01 레이블이 있을 때와 없을 때 */
(function(){
  const R=[[232,88,'S'],[251,96,'M'],[268,104,'L']];
  let on=true;
  $('labBtns').innerHTML='<button class="btn sm" data-v="1">🏷️ 레이블 붙이기 (지도학습)</button><button class="btn sm" data-v="0">🧽 레이블 지우기 (비지도학습)</button>';
  const bs=[...$('labBtns').querySelectorAll('button')];
  function draw(){
    bs.forEach(b=>b.classList.toggle('ghost',(b.dataset.v==='1')!==on));
    $('labTbl').innerHTML=`<tr><th>발 길이(mm)</th><th>발볼 너비(mm)</th>${on?'<th class="lb">실내화 크기(레이블)</th>':''}</tr>`+R.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td>${on?`<td class="lb"><b>${r[2]}</b></td>`:''}</tr>`).join('');
    $('labTxt').innerHTML=on?'<b>지도학습의 예</b> · ‘실내화 크기’라는 레이블이 있으므로 예측하고 싶은 속성이 무엇인지 <b>명확한 기준</b>이 있어요. 새 학생의 발을 재면 실내화 크기를 예측(분류)할 수 있어요.'
      :'<b>비지도학습의 예</b> · 레이블이 없으므로 예측하고 싶은 <b>명확한 기준이 없어요</b>. 대신 발 길이와 발볼 너비가 비슷한 학생끼리 묶는 <b>군집 분석</b>을 하면, 실내화를 몇 가지 크기로 만들면 좋을지 같은 <b>크기의 패턴</b>을 찾을 수 있어요.';
  }
  bs.forEach(b=>b.onclick=()=>{on=b.dataset.v==='1'; draw();});
  draw();
})();

/* 01 기준을 바꿔 묶어 보기 */
(function(){
  const MV=[['별빛 고양이','🐱','애니메이션',88],['로봇 친구 삐삐','🤖','애니메이션',125],['한밤의 추격','🚓','액션',98],['마지막 미션','💥','액션',135],
            ['숲속 요정','🧚','애니메이션',92],['바다의 전설','🌊','애니메이션',128],['도시 탈출','🏃','액션',95],['불꽃 영웅','🔥','액션',140]];
  const C=[{b:'묶지 않고 보기',f:null},{b:'장르로 묶기',f:m=>m[2]==='애니메이션'?0:1,n:['군집 1 · 애니메이션','군집 2 · 액션']},{b:'상영 시간으로 묶기',f:m=>m[3]<=100?0:1,n:['군집 1 · 100분 이하','군집 2 · 120분 이상']}];
  let c=0;
  $('grpBtns').innerHTML=C.map((x,i)=>`<button class="btn sm" data-i="${i}">${x.b}</button>`).join('');
  const bs=[...$('grpBtns').querySelectorAll('button')];
  const card=m=>`<span class="us-mv"><i>${m[1]}</i><b>${m[0]}</b><small>${m[2]} · ${m[3]}분</small></span>`;
  function draw(){
    bs.forEach((b,i)=>b.classList.toggle('ghost',i!==c));
    const x=C[c];
    if(!x.f){$('grpView').innerHTML=`<div class="us-box all">${MV.map(card).join('')}</div>`; return;}
    $('grpView').innerHTML=[0,1].map(g=>`<div class="us-box g${g}"><h4>${x.n[g]}</h4>${MV.filter(m=>x.f(m)===g).map(card).join('')}</div>`).join('')+
      `<p class="note" style="grid-column:1/-1;margin:0">같은 영화 8편인데 ${c===1?'장르':'상영 시간'}을 기준으로 묶으니 ${c===1?'「별빛 고양이」와 「로봇 친구 삐삐」가 같은 군집이에요.':'「별빛 고양이」와 「한밤의 추격」이 같은 군집이에요.'} 기준을 바꿔 비교해 보세요.</p>`;
  }
  bs.forEach(b=>b.onclick=()=>{c=+b.dataset.i; draw();});
  draw();
})();

/* 01 활용 사례 카드 */
flipCards('useCards',[
  {ic:'🎞️',f:'영화 추천',s:'눌러서 보기',b:'장르, 감독, 배우, 키워드 등을 기준으로 비슷한 특성을 가진 영화끼리 묶으면 <b>취향에 맞는 영화를 추천</b>하는 데 도움이 돼요.'},
  {ic:'📰',f:'주제별 뉴스 그룹 서비스',s:'눌러서 보기',b:'뉴스 기사의 제목, 내용, 키워드를 분석해 주제가 비슷한 기사끼리 묶으면 사용자가 관심 있는 내용을 쉽게 접하는 <b>맞춤형 서비스</b>를 만들 수 있어요.'},
  {ic:'🛒',f:'마케팅 전략',s:'눌러서 보기',b:'구매 이력, 선호하는 상품, 방문 빈도 같은 데이터를 분석해 특성에 따라 고객 그룹을 만들면 <b>세밀하고 효율적인 마케팅 전략</b>을 세울 수 있어요.'}]);

/* 02 k-평균 한 단계씩 해 보기 */
(function(){
  const P=[[45,8],[50,14],[40,4],[54,6],[8,42],[12,52],[4,46],[16,38],[10,10],[16,4],[6,16],[20,14]];
  const COL=['#d64535','#2f6fd0','#1f9d74','#9b4fc4'];
  const EX={2:[[30,30],[40,20]],3:[[30,30],[40,20],[20,40]],4:[[30,30],[40,20],[20,40],[55,5]]};
  const X0=50,Y0=345,S=330,M=60, px=v=>X0+v/M*S, py=v=>Y0-v/M*S;
  let k=2, C=[], A=null, phase='place', moves=0, trail=[], log=[], start='', timer=null;
  const B=$('kmLab');
  B.innerHTML=`<div class="us-km"><div class="plot"><svg id="kmSvg" viewBox="0 0 400 392" role="img" aria-label="게임 영상과 요리 영상 시청 시간 그래프. 누르면 중심점을 찍어요."></svg></div>
    <div class="side"><div class="row" id="kmK"></div>
      <div class="us-steps" id="kmSteps"><span data-s="1">1 초기화</span><span data-s="2">2 배정</span><span data-s="3">3 재설정</span><span data-s="4">4 종료</span></div>
      <div class="us-msg" id="kmMsg"></div>
      <div class="row"><button class="btn sm ghost" id="kmEx">예시 시작점</button><button class="btn sm ghost" id="kmRnd">무작위로 찍기</button></div>
      <div class="row" style="margin-top:6px"><button class="btn sm" id="kmNext">다음 단계 ▶</button><button class="btn sm ghost" id="kmAll">끝까지 진행 ⏩</button><button class="btn sm ghost" id="kmReset">다시 시작</button></div>
      <div style="overflow-x:auto;margin-top:8px"><table class="us-tbl sm" id="kmTbl"></table></div>
      <ol class="us-log" id="kmLog"></ol>
      <div class="us-recs" id="kmRecs"></div></div></div>`;
  const svg=$('kmSvg');
  $('kmK').innerHTML='<b>k =</b> '+[2,3,4].map(v=>`<button class="btn sm" data-k="${v}">${v}</button>`).join('');
  const kbs=[...$('kmK').querySelectorAll('button')];
  const ptxt=c=>`(${usF(c[0])}, ${usF(c[1])})`;
  function assign(){return P.map(p=>{let b=0,bd=Infinity; C.forEach((c,j)=>{const d=Math.hypot(p[0]-c[0],p[1]-c[1]); if(d<bd-1e-9){bd=d;b=j;}}); return b;});}
  function stop(){if(timer){clearInterval(timer); timer=null;}}
  function reset(){stop(); C=[]; A=null; phase='place'; moves=0; trail=[]; log=[]; start=''; draw();}
  function begin(){start=C.map(ptxt).join('·'); phase='ready'; log.push(`1단계 초기화: k = ${k}, 중심점 ${C.map(ptxt).join(', ')}`);}
  function step(){
    if(phase==='ready'||phase==='moved'){
      const first=phase==='ready'; A=assign(); phase='assigned';
      const cnt=C.map((_,j)=>A.filter(a=>a===j).length);
      log.push(`${first?'2단계 배정':'3단계 재설정'}: ${first?'가까운 중심점으로':'업데이트된 중심점과의 거리로 다시'} 군집 만들기 → ${cnt.map((n,j)=>`군집 ${j+1}: ${n}개`).join(', ')}`);
    } else if(phase==='assigned'){
      const N=C.map((c,j)=>{const m=P.filter((_,i)=>A[i]===j); return m.length?[m.reduce((s,p)=>s+p[0],0)/m.length, m.reduce((s,p)=>s+p[1],0)/m.length]:c;});
      const same=N.every((n,j)=>Math.hypot(n[0]-C[j][0],n[1]-C[j][1])<1e-9);
      if(same){phase='done'; stop(); log.push(`4단계 종료: 평균 위치를 다시 구해도 중심점이 바뀌지 않아요 (중심점 이동 ${moves}번)`);
        const cnt=C.map((_,j)=>A.filter(a=>a===j).length);
        MEMO.kmRes=usJoin(MEMO.kmRes,`k=${k}, 시작 중심점 ${start} → 중심점 이동 ${moves}번 뒤 종료, 마지막 중심점 ${C.map(ptxt).join('·')}, 군집 크기 ${cnt.join('·')}`,3); usSave(); showRecs();}
      else{trail.push(C.map(c=>c.slice())); moves++;
        log.push(`${moves===1?'2단계 배정':'2, 3단계 반복'}: 중심점을 각 군집의 평균 위치로 이동 → ${N.map((n,j)=>`${j+1}번 ${ptxt(C[j])}→${ptxt(n)}`).join(', ')}`+(N.some((n,j)=>!P.some((_,i)=>A[i]===j))?' (데이터가 없는 군집의 중심점은 그대로)':''));
        C=N; phase='moved';}
    }
    draw();
  }
  function draw(){
    kbs.forEach(b=>b.classList.toggle('ghost',+b.dataset.k!==k));
    svg.innerHTML='';
    for(let v=0;v<=60;v+=10){el('line',{x1:px(v),y1:Y0,x2:px(v),y2:Y0-S,stroke:'#e6e1d8'},svg); el('text',{x:px(v),y:Y0+16,'text-anchor':'middle','font-size':11,fill:'#5b6776'},svg,v);
      el('line',{x1:X0,y1:py(v),x2:X0+S,y2:py(v),stroke:'#e6e1d8'},svg); el('text',{x:X0-8,y:py(v)+4,'text-anchor':'end','font-size':11,fill:'#5b6776'},svg,v);}
    el('rect',{x:X0,y:Y0-S,width:S,height:S,fill:'none',stroke:'#8a94a3'},svg);
    el('text',{x:X0+S/2,y:Y0+38,'text-anchor':'middle','font-size':12,'font-weight':700,fill:'#0f2742'},svg,'게임 영상 시청 시간(분)');
    el('text',{x:14,y:Y0-S/2,'text-anchor':'middle','font-size':12,'font-weight':700,fill:'#0f2742',transform:`rotate(-90 14 ${Y0-S/2})`},svg,'요리 영상 시청 시간(분)');
    if(A&&phase!=='place') P.forEach((p,i)=>el('line',{x1:px(p[0]),y1:py(p[1]),x2:px(C[A[i]][0]),y2:py(C[A[i]][1]),stroke:COL[A[i]],'stroke-opacity':.25},svg));
    trail.forEach((T,t)=>T.forEach((c,j)=>{const nx=(trail[t+1]||C)[j]; el('line',{x1:px(c[0]),y1:py(c[1]),x2:px(nx[0]),y2:py(nx[1]),stroke:COL[j],'stroke-dasharray':'4 3','stroke-width':1.5},svg); el('circle',{cx:px(c[0]),cy:py(c[1]),r:3,fill:COL[j],'fill-opacity':.5},svg);}));
    P.forEach((p,i)=>el('circle',{cx:px(p[0]),cy:py(p[1]),r:7,fill:A?COL[A[i]]:'#5b6776',stroke:'#fff','stroke-width':1.5},svg));
    C.forEach((c,j)=>{const x=px(c[0]),y=py(c[1]); el('line',{x1:x-9,y1:y-9,x2:x+9,y2:y+9,stroke:'#fff','stroke-width':7},svg); el('line',{x1:x-9,y1:y+9,x2:x+9,y2:y-9,stroke:'#fff','stroke-width':7},svg);
      el('line',{x1:x-9,y1:y-9,x2:x+9,y2:y+9,stroke:COL[j],'stroke-width':4},svg); el('line',{x1:x-9,y1:y+9,x2:x+9,y2:y-9,stroke:COL[j],'stroke-width':4},svg);});
    const cur={place:1,ready:1,assigned:A&&moves===0?2:3,moved:2,done:4}[phase];
    $('kmSteps').querySelectorAll('span').forEach(s=>s.classList.toggle('on',+s.dataset.s===cur));
    $('kmMsg').innerHTML={place:`그래프를 눌러 중심점 <b>${k}개</b>를 아무 곳에나 찍어요. (${C.length} / ${k})`,ready:'중심점을 다 찍었어요. 「다음 단계 ▶」를 눌러요.',assigned:moves===0?'각 데이터가 더 가까운 중심점의 군집이 되었어요. 다음은 중심점을 평균 위치로 옮겨요.':'업데이트된 중심점으로 군집을 다시 만들었어요. 중심점을 다시 평균 위치로 옮겨 봐요.',moved:'중심점이 군집의 평균 위치로 옮겨졌어요(점선은 움직인 길). 다시 군집을 만들어 봐요.',done:'<span class="ok">🎉 종료!</span> 중심점이 더 이상 바뀌지 않아요. 시작 중심점이나 k를 바꿔 다시 해 보세요.'}[phase];
    $('kmNext').disabled=phase==='place'||phase==='done'; $('kmAll').disabled=phase==='place'||phase==='done';
    $('kmEx').disabled=phase!=='place'; $('kmRnd').disabled=phase!=='place';
    $('kmTbl').innerHTML=C.length?`<tr><th>군집</th><th>중심점 (게임, 요리)</th><th>데이터 수</th></tr>`+C.map((c,j)=>`<tr><td><b style="color:${COL[j]}">✕ ${j+1}</b></td><td>${ptxt(c)}</td><td>${A?A.filter(a=>a===j).length+'개':'–'}</td></tr>`).join(''):'';
    $('kmLog').innerHTML=log.map(x=>`<li>${esc(x)}</li>`).join('');
  }
  function showRecs(){$('kmRecs').innerHTML=MEMO.kmRes?`<b>내 기록</b> <small class="muted">(종료할 때마다 자동으로 남아요)</small><ul>${MEMO.kmRes.split(' / ').map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'';}
  svg.addEventListener('click',e=>{if(phase!=='place') return; const p=usPt(svg,e); if(p.x<X0||p.x>X0+S||p.y<Y0-S||p.y>Y0) return;
    C.push([Math.round((p.x-X0)/S*M), Math.round((Y0-p.y)/S*M)]); if(C.length===k) begin(); draw();});
  kbs.forEach(b=>b.onclick=()=>{k=+b.dataset.k; reset();});
  $('kmEx').onclick=()=>{C=EX[k].map(c=>c.slice()); begin(); draw();};
  $('kmRnd').onclick=()=>{C=shuffle(P).slice(0,k).map(p=>p.slice()); begin(); draw();}; /* 빈 군집이 생기지 않게 데이터 12개 가운데 서로 다른 k개 위치에서 시작 */
  $('kmNext').onclick=()=>{stop(); step();};
  $('kmAll').onclick=()=>{stop(); timer=setInterval(()=>{if(phase==='done'||phase==='place'){stop(); return;} step();},700);};
  $('kmReset').onclick=reset;
  reset(); showRecs();
})();

/* 03 어떤 알고리즘이 알맞을까? */
sorter('algGame',{
  cats:[{n:'🧭 k-최근접 이웃',k:'#e0702b'},{n:'✖️ k-평균',k:'#2f6fd0'}],
  items:[
    {t:'‘정상’, ‘고장’ 기록이 붙은 기계 소리 데이터를 바탕으로, 새로 녹음한 소리가 어느 쪽인지 정해요.',c:0,ic:'⚙️',w:'레이블(정상·고장)이 있는 데이터에서 새 소리와 가까운 이웃을 보고 분류하는 지도학습이에요.'},
    {t:'이름표가 없는 학생 300명의 운동 기록을 보고, 운동 습관이 닮은 학생들을 찾아 그룹을 정해요.',c:1,ic:'🏃',w:'레이블 없이 비슷한 학생끼리 군집으로 묶는 비지도학습이에요.'},
    {t:'이름이 적힌 과일 사진들을 바탕으로, 새로 찍은 과일 사진의 이름을 찾아요.',c:0,ic:'🍇',w:'이름(레이블)이 있는 사진 가운데 가장 비슷한 사진들의 이름으로 정하는 분류예요.'},
    {t:'편의점 3곳의 자리를 정하려고, 손님들의 집 위치에서 사람이 몰린 곳을 찾아요.',c:1,ic:'🏪',w:'정답 없이 집 위치를 3개 군집으로 묶고, 각 군집의 평균 위치(중심점)를 찾는 문제예요.'},
    {t:'음악 앱 사용자들의 듣기 기록만으로, 취향이 닮은 사용자 무리를 알아봐요.',c:1,ic:'🎧',w:'레이블이 없는 데이터를 군집으로 묶어 취향의 패턴을 찾아요.'},
    {t:'‘스팸’, ‘정상’이 표시된 메일들을 바탕으로, 새로 온 메일이 어느 쪽인지 알아봐요.',c:0,ic:'📧',w:'레이블이 있는 메일들과의 거리로 가까운 이웃을 보고 분류하는 방법이에요.'},
  ],
  end:'<b>생각해 보기</b> 레이블이 있고 새 데이터의 클래스를 정하고 싶으면 k-최근접 이웃(지도학습), 레이블이 없고 비슷한 것끼리 묶고 싶으면 k-평균(비지도학습)이에요.'
});

/* 03 개념 정리하기 빈칸 */
document.querySelectorAll('.us-blank').forEach(b=>b.onclick=()=>{const on=!b.classList.contains('on'); b.textContent=on?b.dataset.a:'?'; b.classList.toggle('on',on);});

/* 04 마무리 */
const MEMOLIST=[['planUS','처음 생각 · 내 시청 기록으로 할 수 있는 일'],['grpWhy','영화를 묶을 기준과 까닭'],['usIdea','군집 분석으로 얻을 새로운 정보'],['kmRes','k-평균 실행 기록'],['kmWhy','시작 중심점이나 k를 바꿨을 때 달라진 점'],['ck1','학습 목표 점검'],['keyQ','오늘의 질문에 대한 내 답'],['newLearn','새롭게 알게 된 점']];
onShow[4]=()=>{const p=(MEMO.planUS||'').trim(); $('prevPlan').innerHTML=`<b>처음 생각</b> ${p?esc(p):'<span class="muted">(시작 화면에 아직 안 씀)</span>'}`; memoSummary('msum',MEMOLIST);};
