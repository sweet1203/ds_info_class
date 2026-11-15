/* 01 어떤 전처리일까? — 카드 문장에 작업 이름(정리·통합·정규화)을 넣지 않음 */
sorter('ppGame',{
  cats:[{n:'🧽 데이터 정리',k:'#2f6fd0'},{n:'🔗 데이터 통합',k:'#1f9d74'},{n:'📐 데이터 정규화',k:'#e0702b'}],
  items:[
    {t:'설문 응답을 보니 같은 학생이 두 번 제출한 줄이 있어 하나만 남긴다',short:'두 번 낸 응답 하나만 남기기',c:0,ic:'🧾',w:'데이터 하나 안에서 잘못 들어간 중복 줄을 없애는 일이라 데이터 정리예요. 여러 데이터를 하나로 모으는 통합과는 달라요.'},
    {t:'지역 이름 칸에 「서울」, 「서을」, 「서울시」처럼 제각각 적힌 것을 바르게 고친다',short:'잘못 적힌 지역 이름 고치기',c:0,ic:'✏️',w:'맞춤법 오류나 불일치를 수정하는 것은 데이터 정리예요.'},
    {t:'키 칸이 비어 있는 몇몇 학생 기록을 찾아 지우거나 알맞은 값으로 채운다',short:'빈 키 칸 처리하기',c:0,ic:'🕳️',w:'누락된 데이터를 제거하거나 채우는 것은 데이터 정리예요. 02에서 직접 해 봐요.'},
    {t:'같은 학생들의 체력 측정 기록 파일과 급식 설문 파일을 학번을 기준으로 하나의 표로 만든다',short:'두 파일을 학번 기준으로 하나로',c:1,ic:'🧩',w:'동질성을 가진 데이터를 하나의 데이터로 합하는 데이터 통합이에요. 04의 칼로리 데이터 합치기와 같은 일이에요.'},
    {t:'학교 도서관과 동네 공공 도서관에서 따로 받은 대출 기록 파일을 한 표로 모아 우리 동네 학생들의 독서량을 살펴본다',short:'두 도서관 대출 기록을 한 표로',c:1,ic:'📚',w:'서로 다른 곳에서 모은 비슷한 데이터를 하나로 합하는 데이터 통합이에요. 한 데이터 안의 잘못을 고치면 정리, 여러 데이터를 하나로 모으면 통합이에요.'},
    {t:'100점 만점 시험 점수와 10점 만점 수행 점수를 둘 다 0에서 1 사이의 값으로 바꾸어 비교한다',short:'점수를 0~1 사이로 바꾸기',c:2,ic:'💯',w:'속성값을 일정한 범위에 속하도록 조정하는 데이터 정규화예요.'},
    {t:'단위가 서로 다른 키(cm)와 몸무게(kg)를 같은 범위의 값으로 바꾸어 함께 분석한다',short:'키·몸무게를 같은 범위로',c:2,ic:'📏',w:'분석하기 쉽게 공통 척도나 일정 범위로 바꾸는 데이터 정규화예요.'},
  ],
  end:'<b>정리</b> 틀리거나 빠진 것을 고치면 <b>데이터 정리</b>, 여러 데이터를 하나로 합하면 <b>데이터 통합</b>, 값의 척도나 범위를 맞추면 <b>데이터 정규화</b>예요. 정규화는 교과서 뒷부분(182쪽)에서 다시 만나요.'
});

/* 02 작은 태양광 발전 표 체험 (교과서 데이터를 본떠 새로 만든 값) */
(function(){
  const ORIG=[
    [1,8,60,2.1,78,8],[2,9,110,2.4,70,18],[3,10,160,null,62,31],[4,11,190,3.0,55,42],
    [5,12,210,3.2,48,50],[6,13,null,2.8,45,52],[7,14,180,2.6,50,44],[8,15,140,2.2,58,30],
    [9,16,90,1.9,66,16],[10,11,200,3.4,92,66],[11,12,150,2.0,74,28],[12,13,170,2.5,60,38],
    [13,10,190,3.1,88,69],[14,14,120,2.3,83,20],[15,9,70,1.8,90,6],[16,15,100,2.0,71,22]];
  const K=['n','h','sd','ws','hu','pw'], NAMES=['번호','시','산란일사량','풍속','습도','태양광 발전량(kW)'], NUM=['sd','ws','hu','pw'];
  const STEPS=['① 살펴보기 · Feature Statistics','② 결측치 처리 · Impute','③ 이상치 찾기 · Scatter Plot + Formula','④ 이상치 제거 · Select Rows'];
  let S;
  const reset=()=>{S={done:0,cur:0,imp:null,rule:false,cut:false,marks:new Set(),sel:null,rows:ORIG.map(r=>{const o={fill:{},gone:false,out:null,cut:false};K.forEach((k,i)=>o[k]=r[i]);return o;})};};
  const live=()=>S.rows.filter(r=>!r.gone&&!r.cut);
  const f1=v=>Math.round(v*10)/10;
  const stat=k=>{const v=live().map(r=>r[k]).filter(x=>x!=null);return {min:Math.min(...v),max:Math.max(...v),mean:v.reduce((a,b)=>a+b,0)/v.length,miss:live().filter(r=>r[k]==null).length};};

  function drawSteps(){
    $('labSteps').innerHTML=STEPS.map((t,i)=>`<button class="${S.cur===i+1?'on':''} ${S.done>i?'ok':''}" data-i="${i+1}" ${i+1>S.done+1?'disabled':''}>${t}</button>`).join('');
    $('labSteps').querySelectorAll('button').forEach(b=>b.onclick=()=>step(+b.dataset.i));
  }
  function drawTable(){
    const head=`<tr>${NAMES.map(n=>`<th>${n}</th>`).join('')}${S.rule?'<th>이상치</th>':''}</tr>`;
    const body=S.rows.map(r=>`<tr data-n="${r.n}" class="${r.gone||r.cut?'gone':''} ${S.sel===r.n?'sel':''}">${K.map(k=>{
      const v=r[k];
      if(v==null) return `<td class="${S.done>=1?'miss':''}">?</td>`;
      if(r.fill[k]) return `<td class="fill">${f1(v)}</td>`;
      return `<td>${k==='ws'?v.toFixed(1):v}</td>`;}).join('')}${S.rule?`<td class="${r.out==='Y'?'oy':''}">${r.out||''}</td>`:''}</tr>`).join('');
    let foot='';
    if(S.done>=1){
      const st={}; NUM.forEach(k=>st[k]=stat(k));
      const row=(lab,fn)=>`<tr class="st"><th>${lab}</th><td>–</td>${NUM.map(k=>`<td>${fn(st[k])}</td>`).join('')}${S.rule?'<td></td>':''}</tr>`;
      foot=row('최소',s=>f1(s.min))+row('최대',s=>f1(s.max))+row('평균',s=>f1(s.mean))+row('Missing',s=>`<b class="${s.miss?'mm':''}">${s.miss}</b>`);
    }
    $('labTbl').innerHTML=head+body+foot;
    $('labTbl').querySelectorAll('tr[data-n]').forEach(tr=>tr.onclick=()=>{S.sel=+tr.dataset.n;drawTable();drawPlot();});
  }
  const sx=h=>50+(h-40)/60*360, sy=p=>280-p/80*260;
  function drawPlot(){
    let g='';
    for(let h=40;h<=100;h+=10) g+=`<line x1="${sx(h)}" y1="20" x2="${sx(h)}" y2="280" class="gl"/><text x="${sx(h)}" y="298" class="tk">${h}</text>`;
    for(let p=0;p<=80;p+=20) g+=`<line x1="50" y1="${sy(p)}" x2="410" y2="${sy(p)}" class="gl"/><text x="42" y="${sy(p)+4}" class="tk" style="text-anchor:end">${p}</text>`;
    g+=`<text x="230" y="322" class="ax">습도</text><text x="14" y="150" class="ax" transform="rotate(-90 14 150)">태양광 발전량(kW)</text>`;
    if(S.rule) g+=`<line x1="${sx(70)}" y1="${sy(80)}" x2="${sx(100)}" y2="${sy(50)}" class="rl"/><text x="${sx(71)}" y="${sy(80)-6}" class="rt">습도 + 발전량 = 150</text>`;
    live().forEach(r=>{
      const cls=['pt',r.out==='Y'?'y':'',S.marks.has(r.n)?'mk':'',S.sel===r.n?'sel':''].join(' ');
      g+=`<circle cx="${sx(r.hu)}" cy="${sy(r.pw)}" r="${S.sel===r.n?9:7}" class="${cls}" data-n="${r.n}"><title>번호 ${r.n} · 습도 ${r.hu} · 발전량 ${r.pw}</title></circle>`;
    });
    $('labPlot').innerHTML=g;
    $('labPlot').querySelectorAll('circle').forEach(c=>c.onclick=()=>{
      const n=+c.dataset.n; S.sel=n;
      if(S.cur===3&&!S.rule){S.marks.has(n)?S.marks.delete(n):S.marks.add(n); msg(`고른 점 <b>${S.marks.size}개</b>. 다 골랐으면 아래 <b>규칙으로 확인하기</b>를 눌러요.`);}
      drawTable(); drawPlot();
    });
  }
  const msg=h=>$('labMsg').innerHTML=h;
  function sum(){
    const a=S.rows.filter(r=>!r.gone).length, b=live().length;
    $('labSum').innerHTML=S.done>=2?`<span>처음 <b>16줄</b></span><i>→</i><span>결측치 처리 후 <b>${a}줄</b></span>${S.cut?`<i>→</i><span>이상치 제거 후 <b>${b}줄</b></span>`:''}`:'';
  }
  function impute(kind){
    S.rows.forEach(r=>{r.gone=false;NUM.forEach(k=>{if(r.fill[k]){r[k]=null;delete r.fill[k];}});});
    if(kind==='avg'){
      const m={}; NUM.forEach(k=>{const v=S.rows.map(r=>r[k]).filter(x=>x!=null);m[k]=v.reduce((x,y)=>x+y,0)/v.length;});
      S.rows.forEach(r=>NUM.forEach(k=>{if(r[k]==null){r[k]=f1(m[k]);r.fill[k]=true;}}));
      msg(`<b>평균으로 채우기</b> 16줄이 그대로 남고, 빈칸에 그 속성의 평균(기울어진 글씨)이 들어갔어요. 줄은 지키지만, 채운 값은 실제로 잰 값이 아니에요. 다른 방법도 눌러 비교해 봐요.`);
    } else {
      S.rows.forEach(r=>{if(NUM.some(k=>r[k]==null)) r.gone=true;});
      msg(`<b>빈칸 있는 줄 지우기</b> 빈칸이 있던 2줄이 지워져 14줄이 남았어요. 교과서도 결측치가 <b>2개뿐</b>이라 이 방법을 골랐어요. 5만 줄이 넘는 데이터에서 2줄은 아주 적은 양이에요. 다른 방법도 눌러 비교해 봐요.`);
    }
    S.imp=kind; S.marks.clear(); S.done=Math.max(S.done,2); $('labCtl').querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.k===kind));
    drawSteps(); drawTable(); drawPlot(); sum();
  }
  function step(i){
    S.cur=i; const C=$('labCtl'); C.innerHTML='';
    if(i===1){
      S.done=Math.max(S.done,1);
      msg('표 아래에 속성마다 <b>최소 · 최대 · 평균 · Missing</b>이 나왔어요. Missing은 빈칸 수예요. <b>Missing이 0이 아닌 속성</b>은 무엇인가요? 빨간 칸이 결측치예요. 다 찾았으면 ②로 가요.');
    } else if(i===2&&S.rule){
      msg('이미 이상치 단계로 넘어갔어요. 결측치 처리 방법을 다시 비교하려면 아래 「처음부터 다시」를 눌러요.');
    } else if(i===2){
      C.innerHTML='<button class="btn sm" data-k="avg">평균으로 채우기 <small>Average/Most frequent</small></button><button class="btn sm" data-k="rm">빈칸 있는 줄 지우기 <small>Remove instances with unknown values</small></button>';
      C.querySelectorAll('button').forEach(b=>{b.onclick=()=>impute(b.dataset.k); b.classList.toggle('on',b.dataset.k===S.imp);});
      msg(S.imp?'두 방법을 모두 눌러 비교해 봐요. 마지막에 누른 방법으로 다음 단계를 해요.':'결측치를 어떻게 처리할까요? 두 버튼을 차례로 눌러 표와 줄 수가 어떻게 바뀌는지 비교해요.');
    } else if(i===3){
      if(!S.rule){
        C.innerHTML='<button class="btn sm" id="labRule">규칙으로 확인하기 <small>Formula: 습도 + 발전량 &gt; 150 이면 Y</small></button>';
        $('labRule').onclick=()=>{
          S.rule=true; live().forEach(r=>r.out=r.hu+r.pw>150?'Y':'N'); S.rows.filter(r=>r.gone).forEach(r=>r.out=null);
          const ys=live().filter(r=>r.out==='Y').map(r=>r.n), hit=ys.filter(n=>S.marks.has(n)).length;
          S.done=Math.max(S.done,3); C.innerHTML='';
          msg(`규칙으로 찾은 이상치는 <b>${ys.length}개</b>(빨간 점, 표의 Y)예요. 내가 고른 점 ${S.marks.size}개 가운데 <b>${hit}개</b>가 같아요. 습도가 높은데 발전량도 높은, 다른 점들과 반대로 가는 점이에요. 이제 ④로 가요.`);
          drawSteps(); drawTable(); drawPlot();
        };
        msg('산점도에서 <b>다른 점들과 동떨어진 점</b>을 눌러 표시해 보세요(다시 누르면 취소). 대부분의 점은 습도가 높을수록 발전량이 낮아요. 그 흐름에서 벗어난 점은 무엇일까요?');
      } else if(S.cut) msg('이상치는 ④에서 이미 제거했어요. 산점도에 남은 점은 N(정상치)이에요. 처음부터 다시 해 보려면 아래 「처음부터 다시」를 눌러요.');
      else msg('규칙으로 찾은 이상치가 빨간 점과 표의 Y로 표시되어 있어요. ④로 가요.');
    } else if(i===4){
      if(!S.cut){
        C.innerHTML='<button class="btn sm" id="labCut">이상치가 N인 줄만 남기기 <small>Select Rows: 이상치 is N</small></button>';
        $('labCut').onclick=()=>{
          S.cut=true; S.rows.forEach(r=>{if(r.out==='Y') r.cut=true;}); S.done=4; C.innerHTML='';
          msg(`이상치 줄이 빠지고 <b>${live().length}줄</b>이 남았어요. 산점도에서 동떨어진 점이 사라졌는지 보세요. 이렇게 <b>살펴보기 → 결측치 처리 → 이상치 찾기 → 이상치 제거</b>를 마쳤어요. 이 순서를 03에서 오렌지3로 똑같이 해요.`);
          drawSteps(); drawTable(); drawPlot(); sum();
        };
        msg('Select Rows처럼 <b>조건에 맞는 줄만</b> 남겨요. 이상치가 N(정상치)인 줄만 남기면 이상치가 제거돼요.');
      } else msg(`전처리를 마쳤어요. ${live().length}줄이 남았어요. 다시 해 보려면 「처음부터 다시」를 눌러요.`);
    }
    drawSteps(); drawTable(); drawPlot(); sum();
  }
  $('labReset').onclick=()=>{reset(); $('labCtl').innerHTML=''; msg('① 살펴보기부터 눌러 시작해요. 표에서 <b>?</b>는 비어 있는 칸이에요.'); drawSteps(); drawTable(); drawPlot(); sum();};
  $('labReset').onclick();
})();

/* 03·04 위젯 연결 흐름도 (오렌지3 화면을 캡처하지 않고 새로 그림) */
function drawFlow(svgId,tblId,W,H,nodes,edges){
  const col={D:'#f2b84b',T:'#f0875a',V:'#ef8fa0'}, BW=174, BH=48, N={};
  nodes.forEach(n=>N[n.s]=n);
  let g=`<defs><marker id="${svgId}A" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#8a94a3"/></marker></defs>`;
  edges.forEach(([a,b,lab,dy])=>{
    const p=N[a], q=N[b], x1=p.x+BW, y1=p.y+BH/2, x2=q.x-2, y2=q.y+BH/2+(dy||0);
    g+=`<path d="M${x1} ${y1}C${x1+40} ${y1} ${x2-40} ${y2} ${x2} ${y2}" class="fe" marker-end="url(#${svgId}A)"/>`;
    if(lab) g+=`<text x="${x2-12}" y="${dy>0?y2+15:y2-7}" class="fl">${lab}</text>`;
  });
  nodes.forEach(n=>{
    g+=`<g class="fn" data-s="${n.s}" tabindex="0"><rect x="${n.x}" y="${n.y}" width="${BW}" height="${BH}" rx="10" class="fb" style="stroke:${col[n.c]}"/><rect x="${n.x}" y="${n.y}" width="28" height="${BH}" rx="10" fill="${col[n.c]}"/><rect x="${n.x+18}" y="${n.y}" width="10" height="${BH}" fill="${col[n.c]}"/><text x="${n.x+14}" y="${n.y+29}" class="fnum">${n.s}</text><text x="${n.x+36}" y="${n.y+(n.sub?20:29)}" class="ft">${n.t}</text>${n.sub?`<text x="${n.x+36}" y="${n.y+37}" class="fs">${n.sub}</text>`:''}</g>`;
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
drawFlow('solarFlow','solarSet',1050,385,[
  {s:1,t:'File',sub:'태양광 발전.xlsx',c:'D',x:10,y:150},
  {s:2,t:'Data Table',c:'D',x:225,y:20},{s:3,t:'Feature Statistics',c:'D',x:225,y:85},{s:4,t:'Impute',sub:'결측치 제거',c:'T',x:225,y:210},
  {s:5,t:'Feature Statistics (1)',sub:'Missing 0 확인',c:'D',x:440,y:130},{s:6,t:'Scatter Plot',sub:'이상치 확인',c:'V',x:440,y:200},{s:7,t:'Formula',sub:'이상치 Y/N 표시',c:'T',x:440,y:280},
  {s:8,t:'Data Table (1)',sub:'Y 5개 확인',c:'D',x:655,y:215},{s:9,t:'Select Rows',sub:'이상치 is N',c:'T',x:655,y:300},
  {s:10,t:'Data Table (2)',c:'D',x:870,y:255},{s:11,t:'Scatter Plot (1)',sub:'제거 확인',c:'V',x:870,y:325},
],[[1,2],[1,3],[1,4],[4,5],[4,6],[4,7],[7,8],[7,9],[9,10],[9,11]]);
drawFlow('calFlow','calSet',720,262,[
  {s:1,t:'calories',sub:'File · calories.csv',c:'D',x:10,y:40},{s:2,t:'exercise',sub:'File · exercise.csv',c:'D',x:10,y:175},
  {s:3,t:'Data Table',c:'D',x:270,y:5},{s:5,t:'Merge Data',sub:'User_ID 기준',c:'T',x:270,y:105},{s:4,t:'Data Table (1)',c:'D',x:270,y:207},
  {s:6,t:'Data Table (2)',c:'D',x:535,y:60},{s:7,t:'Discretize',sub:'Age 3구간',c:'T',x:535,y:150},
],[[1,3],[2,4],[1,5,'Data',-10],[2,5,'Extra Data',10],[5,6],[5,7]]);
chips('solarDone','solarDonePick',['파일 불러오기','결측치 확인','결측치 제거','산점도로 이상치 확인','Formula로 이상치 표시','Select Rows로 이상치 제거'],true);
chips('calDone','calDonePick',['두 파일 불러오기·이름 바꾸기','Gender를 meta로','Merge Data로 합치기','Discretize로 나이 구간 나누기','작업 흐름 저장하기'],true);

/* 04 합치기 먼저 해 보기 (새로 만든 5명) */
(function(){
  const CAL=[[1001,180],[1002,62],[1003,25],[1004,140],[1005,95]];
  const EX=[[1003,'female',23,6],[1001,'male',45,25],[1005,'male',67,15],[1002,'female',38,11],[1004,'female',61,22]];
  const bin=a=>a<40?'< 40':a<60?'40 – 60':'≥ 60';
  let merged=false, binned=false, hi=null;
  const T=(cap,hd,rows,key)=>`<div class="pp-mt"><b>${cap}</b><table><tr>${hd.map(h=>`<th>${h}</th>`).join('')}</tr>${rows.map(r=>`<tr data-id="${r[0]}" class="${hi===r[0]?'hi':''}">${r.map((v,i)=>`<td class="${key&&key[i]||''}">${v}</td>`).join('')}</tr>`).join('')}</table></div>`;
  function draw(){
    let h;
    if(!merged) h=T('📄 calories',['User_ID','Calories'],CAL)+T('📄 exercise',['User_ID','Gender','Age','Duration'],EX,['','meta','','']);
    else{
      const rows=CAL.map(([id,c])=>{const e=EX.find(x=>x[0]===id); const r=[id,c,e[1],e[2],e[3]]; if(binned) r.push(bin(e[2])); return r;});
      h=T('🔗 Merge Data 결과',['User_ID','Calories','Gender','Age','Duration'].concat(binned?['Age 구간']:[]),rows,['','','meta','','','bin']);
    }
    $('mgBox').innerHTML=h;
    $('mgBox').querySelectorAll('tr[data-id]').forEach(tr=>tr.onclick=()=>{hi=+tr.dataset.id;draw();});
  }
  $('mgDo').onclick=()=>{merged=true; $('mgDo').disabled=true; $('mgBin').disabled=false;
    $('mgMsg').innerHTML='두 표가 <b>User_ID가 같은 줄끼리</b> 이어져 한 표가 되었어요. 이제 한 줄에서 한 사람의 소모 칼로리와 나이·운동 시간을 함께 볼 수 있어요. Gender는 meta(참고용)로 함께 붙어 있어요.'; draw();};
  $('mgBin').onclick=()=>{binned=true; $('mgBin').disabled=true;
    $('mgMsg').innerHTML='나이(Age)를 <b>40세 미만 · 40세 이상 60세 미만 · 60세 이상</b>의 세 구간으로 나누었어요. 오렌지3의 Discretize에서 Natural binning, desired bins 3을 고르면 Age 옆에 <b>40, 60</b>이 표시되는 것과 같은 뜻이에요.'; draw();};
  $('mgReset').onclick=()=>{merged=false;binned=false;hi=null;$('mgDo').disabled=false;$('mgBin').disabled=true;
    $('mgMsg').innerHTML='두 표를 보고 User_ID 1003번 사람의 나이와 소모한 칼로리를 찾아보세요. 그다음 합치기 버튼을 눌러요.'; draw();};
  draw();
})();

/* 05 스스로 정리하기 */
chips('selfCheck','selfCheckPick',['데이터 전처리의 뜻을 설명할 수 있다','데이터 정리·통합·정규화를 구분할 수 있다','결측치를 찾아 처리할 수 있다','이상치를 찾아 제거할 수 있다','두 데이터를 공통 속성으로 합칠 수 있다'],true);
document.querySelectorAll('.pp-blanks .blank').forEach(b=>b.onclick=()=>{b.textContent=b.dataset.a; b.classList.add('on');});

/* 06 마무리 */
const MEMOLIST=[['planGuess','처음 생각: 손보지 않고 바로 분석하면 생길 문제'],['ppWhy','헷갈렸던 전처리 상황과 그 까닭'],['missWhy','결측치를 채울 때와 지울 때의 차이'],['outlierHow','이상치를 찾은 방법과 지우는 까닭'],['solarDonePick','실습 ① 태양광 발전 진행'],['solarSteps','태양광 발전 데이터 전처리 과정'],['calDonePick','(선택) 오렌지3 칼로리 실습 진행'],['calorieWork','칼로리 데이터로 한 작업'],['calorieNext','합친 데이터로 더 알아보고 싶은 것'],['beforeAfter','전처리 전과 후 비교'],['selfCheckPick','성취도 평가: 할 수 있게 된 것'],['keyQ','오늘의 질문에 대한 내 답']];
onShow[6]=()=>memoSummary('msum',MEMOLIST);
