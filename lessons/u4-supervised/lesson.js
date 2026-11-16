/* 공통 */
function svSave(){store.set(MK,MEMO);}
function svJoin(old,item,n){const a=(old||'').split(' / ').filter(Boolean).filter(x=>x!==item); a.push(item); return a.slice(-n).join(' / ');}
function svPt(svg,e){const p=svg.createSVGPoint(); p.x=e.clientX; p.y=e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse());}
const svR=(v,d)=>{const m=Math.pow(10,d); return Math.round(v*m)/m;};
const svB=(v,d)=>(v<0?'− ':'+ ')+Math.abs(v).toFixed(d);

/* 성취도 평가 · 학습 목표 점검 */
chips('ck1','ck1',['지도학습의 분류와 회귀 문제를 구별할 수 있다'],true);
chips('ck2','ck2',['분류 알고리즘과 회귀 알고리즘의 방법을 설명할 수 있다'],true);
chips('colabChk','colabChk',['노트북을 열었다','셀을 차례대로 실행했다','그래프를 확인했다','스스로 해결하기를 채웠다','더 해 보기(선택)를 했다'],true);

/* 01 같은 입력, 다른 종속변수 */
(function(){
  const X=[[12,9,20,6],[9,8,35,7],[25,12,30,5],[13,10,22,8]];
  const M=[
    {b:'종속변수: 식물 종류',h:'식물 종류',v:['상추','깻잎','배추','상추'],t:'종속변수 ‘식물 종류’는 상추, 깻잎, 배추처럼 <b>명확하게 구별되는 값</b>이에요. 이런 값을 <b>이산적인 값</b>이라고 하고, 미리 정한 몇 가지 범주로 나뉘는 <b>범주형</b> 값이 대표적이에요. → 지도학습 <b>분류</b><br><small>범주형 예: 성별, 지역 · 이산적인 값 예: 한 달 동안 읽은 책의 수</small>'},
    {b:'종속변수: 한 달 수확량',h:'한 달 수확량(g)',v:['85.4','62.7','310.5','91.2'],t:'종속변수 ‘한 달 수확량’은 일정 범위 안에서 <b>어떤 값이든 가질 수 있는 수칫값</b>이에요. 이런 값을 <b>연속적인 값</b>이라고 하고, 실수형의 수칫값을 가져요. → 지도학습 <b>회귀</b><br><small>연속적인 값 예: 온도, 길이, 무게</small>'}];
  let m=0;
  $('dvBtns').innerHTML=M.map((x,i)=>`<button class="btn sm" data-i="${i}">${x.b}</button>`).join('');
  const bs=[...$('dvBtns').querySelectorAll('button')];
  function draw(){
    bs.forEach((b,i)=>b.classList.toggle('ghost',i!==m));
    $('dvTbl').innerHTML=`<tr><th colspan="4">독립 변수</th><th class="dv">종속변수(레이블)</th></tr><tr><th>잎 길이(cm)</th><th>잎 폭(cm)</th><th>줄기 높이(cm)</th><th>하루 햇빛(시간)</th><th class="dv">${M[m].h}</th></tr>`+
      X.map((r,i)=>`<tr>${r.map(v=>`<td>${v}</td>`).join('')}<td class="dv"><b>${M[m].v[i]}</b></td></tr>`).join('');
    $('dvTxt').innerHTML=M[m].t;
  }
  bs.forEach(b=>b.onclick=()=>{m=+b.dataset.i; draw();});
  draw();
})();

/* 01 스스로 해결하기 · 분류일까, 회귀일까? */
sorter('crGame',{
  cats:[{n:'🗂️ 분류',k:'#2f6fd0'},{n:'📈 회귀',k:'#e0702b'}],
  items:[
    {t:'사진 속 과일이 잘 익었는지, 덜 익었는지 예측해요.',c:0,ic:'🍑',w:'‘잘 익음’, ‘덜 익음’처럼 명확하게 나뉘는 범주를 고르는 문제예요.'},
    {t:'집의 넓이와 층수로 집값이 얼마일지 알아내요.',c:1,ic:'🏠',w:'집값은 어떤 값이든 가질 수 있는 연속적인 수칫값이에요.'},
    {t:'하루 걸음 수로 소모한 열량(kcal)을 예측해요.',c:1,ic:'👟',w:'열량은 연속적인 값이에요. 걸음 수 하나로 예측하니 단순 선형 회귀로 풀 수 있어요.'},
    {t:'손글씨 글자가 ㄱ~ㅎ 가운데 어떤 자음인지 알아내요.',c:0,ic:'✍️',w:'14개 자음 가운데 하나를 고르는 이산적인 값이에요.'},
    {t:'내일 미세 먼지 농도(㎍/㎥)를 예측해요.',c:1,ic:'🌫️',w:'농도는 일정 범위 안의 어떤 값이든 될 수 있는 연속적인 값이에요.'},
    {t:'동물 울음소리를 듣고 어떤 동물인지 예측해요.',c:0,ic:'🐾',w:'동물 이름은 미리 정해진 몇 가지 범주 가운데 하나예요.'},
  ],
  end:'<b>생각해 보기</b> 똑같이 「예측해요」라고 써도, 예측하려는 값(종속변수)이 <b>범주</b>이면 분류, <b>연속적인 수칫값</b>이면 회귀예요.'
});

/* 02 k-최근접 이웃 체험 */
(function(){
  const DATA=[[75,5.2,'귤'],[72,6.0,'귤'],[95,5.7,'귤'],[95,6.0,'귤'],[88,6.4,'귤'],[107,5.5,'귤'],[70,6.0,'귤'],
              [118,8.4,'레몬'],[126,7.2,'레몬'],[128,8.8,'레몬'],[97,7.5,'레몬'],[133,7.4,'레몬'],[115,9.2,'레몬'],[94,8.1,'레몬']];
  const W0=60,W1=160,L0=4,L1=10, X0=50,Y0=345,S=330;
  const px=w=>X0+(w-W0)/(W1-W0)*S, py=l=>Y0-(l-L0)/(L1-L0)*S;
  const nz=(w,l)=>[(w-W0)/(W1-W0),(l-L0)/(L1-L0)];
  let k=3, q=null;
  const B=$('knnLab');
  B.innerHTML=`<div class="sv-knn"><div class="plot"><svg id="knnSvg" viewBox="0 0 400 392" role="img" aria-label="무게와 길이로 그린 귤과 레몬 데이터 그래프. 누르면 새로운 데이터를 놓아요."></svg>
      <div class="sv-leg"><span><i class="g"></i>귤</span><span><i class="l"></i>레몬</span><span>★ 새로운 데이터</span></div></div>
    <div class="side"><div class="row" id="knnK"></div>
      <label class="sv-tg"><input type="checkbox" id="knnRaw"> 정규화하지 않고 거리 재기 <small>(더 해 보기)</small></label>
      <div id="knnOut"><p class="muted">그래프 안을 눌러 새로운 데이터(★)를 놓아요.</p></div>
      <div class="row" style="margin-top:8px"><button class="btn sm ghost" id="knnRec" disabled>이 결과 기록하기</button></div>
      <div class="sv-recs" id="knnRecs"></div></div></div>`;
  const svg=$('knnSvg');
  $('knnK').innerHTML='<b>k =</b> '+[1,3,5,7].map(v=>`<button class="btn sm" data-k="${v}">${v}</button>`).join('');
  const kbs=[...$('knnK').querySelectorAll('button')];
  kbs.forEach(b=>b.onclick=()=>{k=+b.dataset.k; draw();});
  $('knnRaw').onchange=()=>draw();
  function near(qq,raw){
    const f=raw?(w,l)=>[w,l]:nz, a=f(qq[0],qq[1]);
    return DATA.map(d=>{const b=f(d[0],d[1]); return {d, dist:Math.hypot(a[0]-b[0],a[1]-b[1])};}).sort((x,y)=>Math.abs(x.dist-y.dist)<1e-9?0:x.dist-y.dist); /* 거리가 같으면 표의 순서대로 */
  }
  function vote(list,kk){const g=list.slice(0,kk).filter(x=>x.d[2]==='귤').length; return {g, l:kk-g, r:g>kk-g?'귤':'레몬'};}
  const ro=c=>c==='귤'?'귤로':'레몬으로';
  function draw(){
    kbs.forEach(b=>b.classList.toggle('ghost',+b.dataset.k!==k));
    const raw=$('knnRaw').checked;
    svg.innerHTML='';
    for(let w=60;w<=160;w+=20){el('line',{x1:px(w),y1:Y0,x2:px(w),y2:Y0-S,stroke:'#e6e1d8'},svg); el('text',{x:px(w),y:Y0+16,'text-anchor':'middle','font-size':11,fill:'#5b6776'},svg,w);}
    for(let l=4;l<=10;l++){el('line',{x1:X0,y1:py(l),x2:X0+S,y2:py(l),stroke:'#e6e1d8'},svg); el('text',{x:X0-8,y:py(l)+4,'text-anchor':'end','font-size':11,fill:'#5b6776'},svg,l);}
    el('rect',{x:X0,y:Y0-S,width:S,height:S,fill:'none',stroke:'#8a94a3'},svg);
    el('text',{x:X0+S/2,y:Y0+38,'text-anchor':'middle','font-size':12,'font-weight':700,fill:'#0f2742'},svg,'무게(g)');
    el('text',{x:14,y:Y0-S/2,'text-anchor':'middle','font-size':12,'font-weight':700,fill:'#0f2742',transform:`rotate(-90 14 ${Y0-S/2})`},svg,'길이(cm)');
    let list=null;
    if(q){
      list=near(q,raw);
      if(!raw){const r=list[k-1].dist*S; el('circle',{cx:px(q[0]),cy:py(q[1]),r,fill:'rgba(15,39,66,.05)',stroke:'#0f2742','stroke-dasharray':'4 4'},svg);}
      list.slice(0,k).forEach(x=>el('line',{x1:px(q[0]),y1:py(q[1]),x2:px(x.d[0]),y2:py(x.d[1]),stroke:'#0f2742','stroke-width':1.5},svg));
    }
    const top=list?new Set(list.slice(0,k).map(x=>x.d)):new Set();
    DATA.forEach(d=>{const x=px(d[0]),y=py(d[1]), on=top.has(d);
      if(d[2]==='귤') el('circle',{cx:x,cy:y,r:on?9:7,fill:'#e0702b',stroke:on?'#0f2742':'#fff','stroke-width':on?2.5:1.5},svg);
      else el('rect',{x:x-(on?8:6),y:y-(on?8:6),width:on?16:12,height:on?16:12,fill:'#e6b800',stroke:on?'#0f2742':'#8a6d00','stroke-width':on?2.5:1.5},svg);});
    if(!q){$('knnRec').disabled=true; return;}
    el('text',{x:px(q[0]),y:py(q[1])+8,'text-anchor':'middle','font-size':24,fill:'#0f2742'},svg,'★');
    const v=vote(list,k), dd=x=>raw?x.dist.toFixed(2):x.dist.toFixed(3);
    $('knnOut').innerHTML=`<div class="sv-res"><b>새로운 데이터</b> 무게 ${q[0]}g, 길이 ${q[1]}cm<br>가까운 ${k}개: 귤 ${v.g}개, 레몬 ${v.l}개 → <b class="big2">${ro(v.r)} 분류</b></div>
      <div style="overflow-x:auto"><table class="sv-tbl sm"><tr><th>순서</th><th>클래스</th><th>무게(g)</th><th>길이(cm)</th><th>거리</th></tr>${list.slice(0,7).map((x,i)=>`<tr class="${i<k?'on':''}"><td>${i+1}</td><td>${x.d[2]}</td><td>${x.d[0]}</td><td>${x.d[1]}</td><td>${dd(x)}</td></tr>`).join('')}</table></div>
      <p class="note" style="margin:4px 0 0">${raw?'정규화하지 않은 거리예요. 무게 차이(g)가 길이 차이(cm)보다 훨씬 커서 거리가 거의 <b>무게로만</b> 정해져요. 정규화했을 때와 결과를 비교해 보세요.':'거리는 무게(60~160g)와 길이(4~10cm)를 각각 0~1로 <b>정규화</b>한 뒤 잰 값이에요. 가까운 순서(오름차순) 7개까지 보여요.'}</p>`;
    $('knnRec').disabled=false;
    if(raw){$('knnMisOk').innerHTML=(MEMO.knnMis?`<br>✔ 기록됨 ${esc(MEMO.knnMis)}`:'')+'<br><small class="muted">지금은 정규화하지 않은 거리라 미션 판정을 쉬어요. 미션은 정규화를 다시 켜고 해요.</small>'; return;}
    showMis(false);
    const L=near(q,false), a=vote(L,3), b=vote(L,5);
    if(a.r!==b.r){MEMO.knnMis=`새로운 데이터(무게 ${q[0]}g, 길이 ${q[1]}cm): k=3이면 ${ro(a.r)} 분류(귤 ${a.g} : 레몬 ${a.l}), k=5이면 ${ro(b.r)} 분류(귤 ${b.g} : 레몬 ${b.l})`; svSave(); showMis(true);}
  }
  function showMis(now){$('knnMisOk').innerHTML=MEMO.knnMis?`<br><span class="ok">${now?'🎉 찾았어요!':'✔ 기록됨'}</span> ${esc(MEMO.knnMis)}`:''; $('knnMisBox').classList.toggle('done',!!MEMO.knnMis);}
  function showRecs(){$('knnRecs').innerHTML=MEMO.knnRes?`<b>내 기록</b><ul>${MEMO.knnRes.split(' / ').map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'';}
  svg.addEventListener('click',e=>{const p=svPt(svg,e); if(p.x<X0||p.x>X0+S||p.y<Y0-S||p.y>Y0) return;
    q=[Math.round(W0+(p.x-X0)/S*(W1-W0)), svR(L0+(Y0-p.y)/S*(L1-L0),1)]; draw();});
  $('knnRec').onclick=()=>{if(!q) return; const raw=$('knnRaw').checked, v=vote(near(q,raw),k);
    MEMO.knnRes=svJoin(MEMO.knnRes,`무게 ${q[0]}g, 길이 ${q[1]}cm, k=${k}, 귤 ${v.g} : 레몬 ${v.l} → ${ro(v.r)} 분류${raw?'(정규화 안 함)':''}`,3); svSave(); showRecs();};
  draw(); showMis(false); showRecs();
})();

/* 03 의사결정트리 직접 만들기 */
(function(){
  const IT=[{n:'자전거',ic:'🚲',c:'자전거'},{n:'산악자전거',ic:'🚵',c:'자전거'},{n:'승용차',ic:'🚗',c:'자동차'},{n:'승합차',ic:'🚐',c:'자동차'},{n:'여객기',ic:'✈️',c:'비행기'},{n:'경비행기',ic:'🛩️',c:'비행기'}];
  const Q=[{t:'날 수 있는가?',v:[0,0,0,0,1,1]},{t:'엔진이 있는가?',v:[0,0,1,1,1,1]},{t:'바퀴가 있는가?',v:[1,1,1,1,1,1]},{t:'바퀴가 2개인가?',v:[1,1,0,0,0,0]},{t:'10명 넘게 탈 수 있는가?',v:[0,0,0,1,1,0]}];
  const B=$('treeLab');
  let N=[];
  const mk=(ids,used)=>{const n={id:N.length,ids,used,q:null,y:null,no:null,msg:'',sel:null}; N.push(n); return n;};
  const cls=n=>[...new Set(n.ids.map(i=>IT[i].c))];
  function reset(){N=[]; mk([0,1,2,3,4,5],[]); draw();}
  function html(n,root){
    const c=cls(n), leaf=c.length===1;
    const tag=root?'루트 노드':(leaf?'리프 노드':'노드');
    const st=leaf?`클래스 1개 · ${c[0]}`:`클래스 ${c.length}개가 섞여 있음 · 분할 필요`;
    const pick=`<div class="pick"><select data-n="${n.id}" aria-label="나눌 질문 고르기">${Q.map((q,i)=>n.used.includes(i)?'':`<option value="${i}"${n.sel===i?' selected':''}>${q.t}</option>`).join('')}</select><button class="btn sm" data-split="${n.id}">이 질문으로 나누기</button></div>${n.msg?`<div class="msg">${n.msg}</div>`:''}`;
    return `<div class="tn"><div class="box ${leaf?'leaf':''}"><small class="tg">${tag}</small><div class="pics">${n.ids.map(i=>`<span title="${IT[i].n}">${IT[i].ic}<em>${IT[i].n}</em></span>`).join('')}</div><small>${st}</small>${n.q!=null?`<div class="q">❓ ${Q[n.q].t}</div>`:(leaf?'':pick)}</div>${n.q!=null?`<div class="kids"><div><span class="yn y">예</span>${html(n.y,false)}</div><div><span class="yn n">아니요</span>${html(n.no,false)}</div></div>`:''}</div>`;
  }
  function order(n,a){if(n.q!=null){a.push(Q[n.q].t); order(n.y,a); order(n.no,a);} return a;}
  function draw(){
    const mixed=N.filter(n=>n.q==null&&cls(n).length>1).length, qs=order(N[0],[]);
    B.innerHTML=`<div class="sv-tree">${html(N[0],true)}</div><div class="sv-tstat">${mixed?`섞여 있는 노드가 <b>${mixed}개</b> 남았어요. 질문을 골라 나눠요.`:`<span class="ok">🎉 완성!</span> 질문 <b>${qs.length}개</b>로 모든 리프 노드에 클래스가 1개씩 남았어요. 옆 친구의 트리와 <b>첫 질문</b>과 <b>질문 수</b>를 비교해 봐요. 먼저 고른 속성에 따라 트리가 달라질 수 있어요.`}</div>
      <div class="row"><button class="btn sm ghost" id="treeReset">처음부터 다시</button></div><div class="sv-recs" id="treeRecs"></div>`;
    B.querySelectorAll('[data-split]').forEach(b=>b.onclick=()=>{
      const n=N[+b.dataset.split], q=+B.querySelector(`select[data-n="${n.id}"]`).value;
      const y=n.ids.filter(i=>Q[q].v[i]), no=n.ids.filter(i=>!Q[q].v[i]);
      n.sel=q; if(!y.length||!no.length){n.msg=`「${Q[q].t}」에는 이 노드의 데이터가 모두 같은 답을 해서 나뉘지 않아요. 다른 질문을 골라요.`; draw(); return;}
      n.msg=''; n.q=q; n.y=mk(y,[...n.used,q]); n.no=mk(no,[...n.used,q]); draw();});
    $('treeReset').onclick=reset;
    if(!mixed){MEMO.treeRes=svJoin(MEMO.treeRes,`질문 ${qs.length}개: ${qs.join(' → ')}`,3); svSave();}
    $('treeRecs').innerHTML=MEMO.treeRes?`<b>내가 만든 트리</b><ul>${MEMO.treeRes.split(' / ').map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'';
  }
  reset();
})();

/* 03 로지스틱 회귀 */
(function(){
  const B=$('logiLab'), sig=x=>1/(1+Math.exp(-1.2*(x-11)));
  const X0=50,X1=440,Y1=20,Y0=200, x2p=x=>X0+(x-4)/14*(X1-X0), y2p=y=>Y0-y*(Y0-Y1);
  const D=[[6,0],[7.5,0],[8.5,0],[10,0],[12,1],[13,1],[14.5,1],[16,1]];
  B.innerHTML=`<svg id="logiSvg" viewBox="0 0 460 250" role="img" aria-label="당도에 따른 로지스틱 함수 S자 곡선"></svg>
    <div class="ctrl sv-ctrl"><label for="logiX">당도</label><input type="range" id="logiX" min="4" max="18" step="0.5" value="8"><output id="logiV"></output></div><div class="sv-res" id="logiOut"></div>`;
  const svg=$('logiSvg');
  function draw(){
    const x=+$('logiX').value, p=sig(x); svg.innerHTML='';
    for(let t=4;t<=18;t+=2){el('line',{x1:x2p(t),y1:Y0,x2:x2p(t),y2:Y1,stroke:'#eee9e0'},svg); el('text',{x:x2p(t),y:Y0+16,'text-anchor':'middle','font-size':11,fill:'#5b6776'},svg,t);}
    [0,0.5,1].forEach(v=>el('text',{x:X0-6,y:y2p(v)+4,'text-anchor':'end','font-size':10,fill:'#5b6776'},svg,v));
    el('line',{x1:X0,y1:y2p(.5),x2:X1,y2:y2p(.5),stroke:'#d64535','stroke-dasharray':'5 4'},svg);
    el('text',{x:X1,y:y2p(.5)-6,'text-anchor':'end','font-size':11,fill:'#d64535'},svg,'기준값 0.5');
    el('line',{x1:X0,y1:Y0,x2:X1,y2:Y0,stroke:'#8a94a3'},svg); el('line',{x1:X0,y1:Y0,x2:X0,y2:Y1,stroke:'#8a94a3'},svg);
    let d=''; for(let t=4;t<=18.001;t+=0.1) d+=(d?'L':'M')+x2p(t).toFixed(1)+' '+y2p(sig(t)).toFixed(1);
    el('path',{d,fill:'none',stroke:'#9b4fc4','stroke-width':3},svg);
    D.forEach(([t,c])=>el('circle',{cx:x2p(t),cy:y2p(c),r:6,fill:c?'#1f9d74':'#8a94a3',stroke:'#fff','stroke-width':1.5},svg));
    el('line',{x1:x2p(x),y1:Y0,x2:x2p(x),y2:y2p(p),stroke:'#0f2742','stroke-dasharray':'3 3'},svg);
    el('circle',{cx:x2p(x),cy:y2p(p),r:8,fill:p>=.5?'#1f9d74':'#8a94a3',stroke:'#0f2742','stroke-width':2.5},svg);
    el('text',{x:(X0+X1)/2,y:Y0+40,'text-anchor':'middle','font-size':12,'font-weight':700,fill:'#0f2742'},svg,'과일의 당도(Brix) → 입력값 x');
    $('logiV').textContent=x;
    $('logiOut').innerHTML=`당도 <b>${x}</b> → 로지스틱 함수의 출력값 <b>${p.toFixed(2)}</b> → ${p>=.5?'0.5 이상이므로 <b class="ok">‘수확 가능(1)’</b>로 분류':'0.5보다 작으므로 <b>‘수확 보류(0)’</b>로 분류'}<br><small class="muted">회색 점은 수확 보류(0), 초록 점은 수확 가능(1)로 레이블이 붙은 학습 데이터예요. 출력값은 언제나 0과 1 사이예요.</small>`;
  }
  $('logiX').oninput=draw; draw();
})();

/* 04 선형 회귀 · 직선 맞추기 */
(function(){
  const X=[18,20,22,24,26,28,30,32], Y=[41,50,52,61,64,73,75,84], n=X.length;
  const mx=X.reduce((a,b)=>a+b)/n, my=Y.reduce((a,b)=>a+b)/n;
  const sxx=X.reduce((a,x)=>a+(x-mx)**2,0), sxy=X.reduce((a,x,i)=>a+(x-mx)*(Y[i]-my),0);
  const WB=sxy/sxx, bOf=w=>my-w*mx, mse=w=>{const b=bOf(w); return X.reduce((a,x,i)=>a+(Y[i]-(w*x+b))**2,0)/n;};
  const A={x0:50,x1:380,y0:260,y1:20, X0:16,X1:34, V0:30,V1:100};
  const ax=x=>A.x0+(x-A.X0)/(A.X1-A.X0)*(A.x1-A.x0), ay=v=>A.y0-(v-A.V0)/(A.V1-A.V0)*(A.y0-A.y1);
  const E={x0:40,x1:245,y0:260,y1:20, W1:6, M1:210};
  const ex=w=>E.x0+w/E.W1*(E.x1-E.x0), ey=m=>E.y0-Math.min(m,E.M1)/E.M1*(E.y0-E.y1);
  let best=false;
  const B=$('lrLab');
  B.innerHTML=`<div class="sv-lr"><div><svg id="lrSvg" viewBox="0 0 400 300" role="img" aria-label="기온과 아이스크림 판매량 데이터와 회귀 직선"></svg><small class="muted">(A) 회귀 직선 · 빨간 점선 = 오차(실젯값 − 예측값)</small></div>
      <div><svg id="lrErr" viewBox="0 0 260 300" role="img" aria-label="기울기에 따른 오차 그래프"></svg><small class="muted">(B) 기울기(w)에 따른 오차</small></div></div>
    <div class="ctrl sv-ctrl"><label for="lrW">기울기 w</label><input type="range" id="lrW" min="0" max="6" step="0.1" value="1"><output id="lrWv"></output></div>
    <div class="sv-res" id="lrOut"></div>
    <div class="row" style="margin-top:8px"><button class="btn sm" id="lrRec">내 직선 기록하기</button><button class="btn sm ghost" id="lrBest">오차가 가장 작은 직선 보기</button></div>
    <div class="sv-pred"><label for="lrX">이 직선으로 예측하기 · 기온</label><input type="number" id="lrX" value="27" min="0" max="45" step="1"><span>℃ →</span><b id="lrPred"></b></div>
    <div class="sv-recs" id="lrRecs"></div>`;
  const S1=$('lrSvg'), S2=$('lrErr');
  function frame(){
    S1.innerHTML='';
    const cp=el('clipPath',{id:'lrClip'},S1); el('rect',{x:A.x0,y:A.y1,width:A.x1-A.x0,height:A.y0-A.y1},cp);
    for(let x=16;x<=34;x+=2){el('line',{x1:ax(x),y1:A.y0,x2:ax(x),y2:A.y1,stroke:'#eee9e0'},S1); el('text',{x:ax(x),y:A.y0+15,'text-anchor':'middle','font-size':11,fill:'#5b6776'},S1,x);}
    for(let v=30;v<=100;v+=10){el('line',{x1:A.x0,y1:ay(v),x2:A.x1,y2:ay(v),stroke:'#eee9e0'},S1); el('text',{x:A.x0-6,y:ay(v)+4,'text-anchor':'end','font-size':11,fill:'#5b6776'},S1,v);}
    el('rect',{x:A.x0,y:A.y1,width:A.x1-A.x0,height:A.y0-A.y1,fill:'none',stroke:'#8a94a3'},S1);
    el('text',{x:(A.x0+A.x1)/2,y:A.y0+34,'text-anchor':'middle','font-size':12,'font-weight':700,fill:'#0f2742'},S1,'하루 최고 기온(℃)');
    el('text',{x:14,y:(A.y0+A.y1)/2,'text-anchor':'middle','font-size':12,'font-weight':700,fill:'#0f2742',transform:`rotate(-90 14 ${(A.y0+A.y1)/2})`},S1,'판매량(개)');
  }
  function draw(){
    const w=+$('lrW').value, b=bOf(w), m=mse(w);
    frame();
    const ln=(ww,col,dash,wd)=>{const bb=bOf(ww); el('line',{x1:ax(A.X0),y1:ay(ww*A.X0+bb),x2:ax(A.X1),y2:ay(ww*A.X1+bb),stroke:col,'stroke-width':wd,'stroke-dasharray':dash||'','clip-path':'url(#lrClip)'},S1);};
    X.forEach((x,i)=>el('line',{x1:ax(x),y1:ay(Y[i]),x2:ax(x),y2:ay(w*x+b),stroke:'#d64535','stroke-width':1.5,'stroke-dasharray':'3 3','clip-path':'url(#lrClip)'},S1));
    if(best) ln(WB,'#1f9d74','6 4',2.5);
    ln(w,'#0f2742','',2.5);
    X.forEach((x,i)=>el('circle',{cx:ax(x),cy:ay(Y[i]),r:6,fill:'#2f6fd0',stroke:'#fff','stroke-width':1.5},S1));
    S2.innerHTML='';
    for(let t=0;t<=6;t++){el('line',{x1:ex(t),y1:E.y0,x2:ex(t),y2:E.y1,stroke:'#eee9e0'},S2); el('text',{x:ex(t),y:E.y0+15,'text-anchor':'middle','font-size':11,fill:'#5b6776'},S2,t);}
    for(let v=0;v<=200;v+=50){el('text',{x:E.x0-5,y:ey(v)+4,'text-anchor':'end','font-size':10,fill:'#5b6776'},S2,v);}
    el('rect',{x:E.x0,y:E.y1,width:E.x1-E.x0,height:E.y0-E.y1,fill:'none',stroke:'#8a94a3'},S2);
    let d=''; for(let t=0;t<=6.001;t+=0.05) d+=(d?'L':'M')+ex(t).toFixed(1)+' '+ey(mse(t)).toFixed(1);
    el('path',{d,fill:'none',stroke:'#9b4fc4','stroke-width':2.5},S2);
    if(best){el('circle',{cx:ex(WB),cy:ey(mse(WB)),r:6,fill:'#1f9d74'},S2); el('text',{x:ex(WB),y:ey(mse(WB))-12,'text-anchor':'middle','font-size':10,'font-weight':700,fill:'#1f9d74'},S2,'오차가 가장 작은 곳');}
    el('line',{x1:ex(w),y1:E.y0,x2:ex(w),y2:ey(m),stroke:'#0f2742','stroke-dasharray':'3 3'},S2);
    el('circle',{cx:ex(w),cy:ey(m),r:7,fill:'#0f2742'},S2);
    el('text',{x:(E.x0+E.x1)/2,y:E.y0+34,'text-anchor':'middle','font-size':12,'font-weight':700,fill:'#0f2742'},S2,'기울기 w');
    el('text',{x:12,y:(E.y0+E.y1)/2,'text-anchor':'middle','font-size':12,'font-weight':700,fill:'#0f2742',transform:`rotate(-90 12 ${(E.y0+E.y1)/2})`},S2,'오차');
    $('lrWv').textContent=w.toFixed(1);
    $('lrOut').innerHTML=`내 직선: <b>y = ${w.toFixed(1)}x ${svB(b,1)}</b> · 오차 <b>${m.toFixed(2)}</b><br><small class="muted">오차는 8일 각각의 (실젯값 − 예측값)을 제곱해 평균 낸 값(평균 제곱 오차)이에요. 직선이 데이터의 가운데(평균 기온 ${mx}℃, 평균 판매량 ${my}개)를 지나도록 하고 기울기만 바꿔요.</small>`+
      (best?`<br><span class="ok">오차가 가장 작은 직선</span>(초록 점선): y = ${WB.toFixed(2)}x ${svB(bOf(WB),2)} · 오차 ${mse(WB).toFixed(2)}`:'');
    const t=parseFloat($('lrX').value); $('lrPred').textContent=isNaN(t)?'':`약 ${Math.round(w*t+b)}개`;
  }
  function showRecs(){$('lrRecs').innerHTML=MEMO.lrRes?`<b>내 기록</b><ul>${MEMO.lrRes.split(' / ').map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'';}
  $('lrW').oninput=draw; $('lrX').oninput=draw;
  $('lrBest').onclick=()=>{best=!best; $('lrBest').textContent=best?'오차가 가장 작은 직선 숨기기':'오차가 가장 작은 직선 보기'; draw();};
  $('lrRec').onclick=()=>{const w=+$('lrW').value; MEMO.lrRes=svJoin(MEMO.lrRes,`기울기 ${w.toFixed(1)}, 절편 ${bOf(w).toFixed(1)}일 때 오차 ${mse(w).toFixed(2)}`,3); svSave(); showRecs();};
  draw(); showRecs();
})();

/* 04 개념 정리하기 빈칸(접힘) */
document.querySelectorAll('.sv-blank').forEach(b=>b.onclick=()=>{const on=!b.classList.contains('on'); b.textContent=on?b.dataset.a:'?'; b.classList.toggle('on',on);});

/* 05 마무리 */
const MEMOLIST=[['planSV','처음 생각 · 꽃 사진 앱은 어떻게 맞힐까'],['myEx','우리 주변의 분류·회귀 문제'],['ck1','성취도 · 분류와 회귀 구별'],['knnMis','미션 · k=3과 k=5가 달라지는 자리'],['knnRes','k-최근접 이웃 기록'],['knnWhy','k값에 따라 결과가 달라진 까닭'],['treeRes','내가 만든 의사결정트리'],['lrRes','선형 회귀 직선 기록'],['lrWhy','내 직선과 오차가 가장 작은 직선 비교'],['colabChk','(선택) 코랩 실습 점검'],['lrSteps','(선택) 선형 회귀 모델 실행 방법'],['lrOut','(선택) 코랩 실행 결과'],['ck2','학습 목표 점검 · 알고리즘의 방법 설명'],['keyQ','오늘의 질문에 대한 내 답'],['newLearn','새롭게 알게 된 점']];
onShow[5]=()=>{const p=(MEMO.planSV||'').trim(); $('prevPlan').innerHTML=`<b>처음 생각</b> ${p?esc(p):'<span class="muted">(시작 화면에 아직 안 씀)</span>'}`; memoSummary('msum',MEMOLIST);};
