/* 공통 */
function dmSave(){store.set(MK,MEMO);}
const DMK=['#9b4fc4','#2f6fd0','#e0702b','#1f9d74','#d64535','#0f8fa6','#b8860b','#5b6776'];

/* 0 시작 · 알고 있나요 */
chips('readyChips','readyPick',['문제 상태(초기, 현재, 목표)','핵심 요소 추출','자연어, 의사 코드, 순서도','시행착오 방법','욕심쟁이 방법','디버깅','리스트','중첩 제어 구조','함수'],true);

/* 성취도 평가 */
chips('ck1','ck1',['복잡한 문제를 해결 가능한 작은 문제로 분해하여 해결할 수 있다'],true);
chips('ck2','ck2',['복잡한 문제를 해결 가능한 작은 문제로 분해하고 모델링할 수 있다'],true);

/* 01 로봇이 파란 타일에 불을 켜는 문제 */
const RB={W:5,H:5,start:{c:0,r:4,d:0},goal:{c:4,r:1},box:['0,2','2,1','4,3','2,3']};
const RDIR=[[0,-1],[1,0],[0,1],[-1,0]]; // 위, 오른쪽, 아래, 왼쪽
function rbSvg(st,size){
  const s=size||46, W=RB.W*s, H=RB.H*s;
  let g=`<svg viewBox="0 0 ${W} ${H}" class="dm-rbsvg" role="img" aria-label="로봇 격자">`;
  for(let r=0;r<RB.H;r++) for(let c=0;c<RB.W;c++){
    const k=c+','+r, isG=c===RB.goal.c&&r===RB.goal.r;
    g+=`<rect x="${c*s+1}" y="${r*s+1}" width="${s-2}" height="${s-2}" rx="5" fill="${isG?(st.lit?'#ffd84d':'#3b7be0'):'#eef1f5'}" stroke="${isG&&st.lit?'#f2a516':'#d5dbe3'}" stroke-width="${isG&&st.lit?3:1}"/>`;
    if(RB.box.includes(k)) g+=`<rect x="${c*s+s*.18}" y="${r*s+s*.18}" width="${s*.64}" height="${s*.64}" rx="4" fill="#b98a55" stroke="#8a5a2b" stroke-width="2"/><line x1="${c*s+s*.18}" y1="${r*s+s*.18}" x2="${c*s+s*.82}" y2="${r*s+s*.82}" stroke="#8a5a2b" stroke-width="2"/>`;
  }
  const cx=st.c*s+s/2, cy=st.r*s+s/2, rot=st.d*90;
  g+=`<g transform="translate(${cx} ${cy}) rotate(${rot})"><circle r="${s*.34}" fill="#9b4fc4" stroke="#fff" stroke-width="2"/><path d="M0 ${-s*.26} L${s*.17} ${s*.08} L${-s*.17} ${s*.08} Z" fill="#fff"/></g>`;
  return g+'</svg>';
}
(function(){
  const B=$('dmStates');
  const scenes=[{c:0,r:1,d:1,lit:false},{c:4,r:1,d:1,lit:true},{c:0,r:4,d:0,lit:false}];
  const ans={init:2,goal:1};
  B.innerHTML=`<div class="dm-scenes">${scenes.map((s,i)=>`<div class="dm-scene"><b>장면 ${i+1}</b>${rbSvg(s,26)}</div>`).join('')}</div>
    <div class="dm-askrow"><span><b>초기 상태</b>는?</span>${scenes.map((_,i)=>`<button class="btn sm ghost" data-q="init" data-i="${i}">장면 ${i+1}</button>`).join('')}<span class="dm-fb" data-f="init"></span></div>
    <div class="dm-askrow"><span><b>목표 상태</b>는?</span>${scenes.map((_,i)=>`<button class="btn sm ghost" data-q="goal" data-i="${i}">장면 ${i+1}</button>`).join('')}<span class="dm-fb" data-f="goal"></span></div>`;
  B.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{
    const q=b.dataset.q, i=+b.dataset.i, f=B.querySelector(`[data-f="${q}"]`);
    B.querySelectorAll(`[data-q="${q}"]`).forEach(x=>x.classList.toggle('ghost',x!==b));
    if(i===ans[q]) f.innerHTML=q==='init'?'<span class="ok">맞아요!</span> 로봇이 파란 타일과 떨어진 곳에 있는, 문제가 발생한 최초의 상태예요.':'<span class="ok">맞아요!</span> 파란 타일로 이동해 불을 켠, 문제가 해결된 상태예요.';
    else f.innerHTML=scenes[i].lit?'<span class="ng">다시 생각해요.</span> 이미 불이 켜졌으니 문제가 해결된 상태예요.':(i===0?'<span class="ng">다시 생각해요.</span> 로봇이 이동하는 중인 장면이에요. 해결하면서 변화되고 있는 상태를 무엇이라고 했나요?':'<span class="ng">다시 생각해요.</span> 아직 출발하지 않은 장면이에요.');
  });
})();
(function(){
  const B=$('dmRobot'), CMD={F:'직진',L:'좌회전',R:'우회전',J:'한 칸 점프',O:'불 켜기'};
  B.innerHTML=`<div class="dm-rb">
    <div class="dm-rbboard" id="rbBoard"></div>
    <div class="dm-rbside">
      <div class="dm-rbinfo"><div><b>초기 상태</b> 파란 타일과 떨어진 곳(왼쪽 아래)에 로봇이 위를 보고 있는 상태</div><div><b>목표 상태</b> 파란 타일로 이동하여 불을 켠 상태</div><div><b>수행 과정</b> 파란 타일 위치로 이동하기, 불 켜기</div><div><b>조건</b> 5개의 명령(직진, 좌회전, 우회전, 한 칸 점프, 불 켜기)만 사용할 수 있음. 상자(🟫) 칸으로는 직진할 수 없고, 한 칸 점프는 앞의 한 칸을 건너뛰어 두 칸 앞에 내려요.</div></div>
      <div class="row dm-cmds">${Object.entries(CMD).map(([k,v])=>`<button class="btn sm" data-c="${k}">${v}</button>`).join('')}</div>
      <div class="dm-prog" id="rbProg"></div>
      <div class="row"><button class="btn sm" id="rbRun">▶ 실행</button><button class="btn sm ghost" id="rbUndo">↩ 마지막 명령 지우기</button><button class="btn sm ghost" id="rbClear">모두 지우기</button></div>
      <div class="dm-rbmsg" id="rbMsg">명령 버튼을 눌러 순서대로 쌓은 뒤 <b>실행</b>을 눌러요.</div>
    </div></div>`;
  let prog=[], st, busy=false;
  const reset=()=>{st={...RB.start,lit:false}; $('rbBoard').innerHTML=rbSvg(st);};
  const showProg=(cur)=>{$('rbProg').innerHTML=prog.length?prog.map((c,i)=>`<span class="${i===cur?'on':''}">${i+1}. ${CMD[c]}</span>`).join(''):'<span class="muted">(아직 명령이 없어요)</span>';};
  B.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{if(busy)return; if(prog.length>=14){$('rbMsg').textContent='명령은 14개까지 쌓을 수 있어요.';return;} prog.push(b.dataset.c); showProg(); reset();});
  $('rbUndo').onclick=()=>{if(busy)return; prog.pop(); showProg(); reset();};
  $('rbClear').onclick=()=>{if(busy)return; prog=[]; showProg(); reset(); $('rbMsg').innerHTML='명령 버튼을 눌러 순서대로 쌓은 뒤 <b>실행</b>을 눌러요.';};
  const free=(c,r)=>c>=0&&r>=0&&c<RB.W&&r<RB.H&&!RB.box.includes(c+','+r);
  $('rbRun').onclick=async()=>{
    if(busy||!prog.length) return; busy=true; reset(); const M=$('rbMsg'); M.textContent='실행 중…'; let err='';
    for(let i=0;i<prog.length;i++){
      showProg(i); const c=prog[i], [dx,dy]=RDIR[st.d];
      if(c==='L') st.d=(st.d+3)%4; else if(c==='R') st.d=(st.d+1)%4;
      else if(c==='F'){ if(free(st.c+dx,st.r+dy)){st.c+=dx;st.r+=dy;} else err=`${i+1}번째 명령: 앞이 막혀서 직진할 수 없어요.`; }
      else if(c==='J'){ if(free(st.c+2*dx,st.r+2*dy)){st.c+=2*dx;st.r+=2*dy;} else err=`${i+1}번째 명령: 내려앉을 칸이 없어서 점프할 수 없어요.`; }
      else if(c==='O'){ if(st.c===RB.goal.c&&st.r===RB.goal.r) st.lit=true; else err=`${i+1}번째 명령: 여기는 파란 타일이 아니라서 불을 켤 수 없어요.`; }
      $('rbBoard').innerHTML=rbSvg(st); if(err) break; await sleep(420);
    }
    showProg();
    if(err) M.innerHTML=`<span class="ng">멈췄어요.</span> ${err} 명령을 고쳐 다시 실행해요.`;
    else if(st.lit){ const rec=`명령 ${prog.length}개: ${prog.map(c=>CMD[c]).join(' → ')}`; MEMO.robotRun=rec; dmSave();
      M.innerHTML=`<span class="ok">🎉 목표 상태에 도착했어요!</span> 명령 ${prog.length}개로 해결했어요(기록됨). 더 적은 명령으로도 해결할 수 있을까요?`; }
    else M.innerHTML='<span class="ng">아직 목표 상태가 아니에요.</span> 로봇이 파란 타일 위에서 불을 켜야 해요.';
    busy=false;
  };
  reset(); showProg();
  if(MEMO.robotRun) $('rbMsg').innerHTML=`<span class="ok">지난 기록</span> ${esc(MEMO.robotRun)}`;
})();

/* 01 해결할 수 있을까? */
sorter('solveGame',{
  cats:[{n:'💻 해결할 수 있다',k:'#2f6fd0'},{n:'🤔 해결하기 어렵다',k:'#e0702b'}],
  items:[
    {t:'1부터 200까지의 자연수 중 7의 배수가 몇 개인지 구하기',c:0,ic:'🔢',w:'처음(1~200의 수), 끝(개수), 하는 일(7로 나누어떨어지는지 확인하며 세기)이 분명해요.'},
    {t:'우리 반 학생 30명을 키가 작은 순서대로 줄 세우기',c:0,ic:'📏',w:'키라는 기준이 숫자로 정해져 있어 순서대로 비교하는 과정을 명확하게 표현할 수 있어요.'},
    {t:'실내 온도가 28도보다 높아지면 에어컨 켜기',c:0,ic:'🌡️',w:'조건(28도)과 동작(켜기)이 분명해서 자동으로 제어할 수 있어요.'},
    {t:'이번 주말에 볼 가장 재미있는 영화 고르기',c:1,ic:'🎬',w:'「재미있다」는 사람마다 달라 목표 상태를 명확하게 정하기 어려워요.'},
    {t:'짝꿍에게 어울리는 생일 선물 정하기',c:1,ic:'🎁',w:'「어울린다」의 기준이 분명하지 않아 수행 과정을 명확하게 표현하기 어려워요.'},
    {t:'동아리 홍보 포스터를 가장 멋지게 꾸미기',c:1,ic:'🎨',w:'「멋지다」는 판단이 사람마다 달라 문제가 해결된 상태를 정하기 어려워요.'},
  ],
  end:'<b>생각해 보기</b> 「해결하기 어렵다」로 고른 문제도 기준을 숫자나 조건으로 정하면(예: 관람객 평점이 가장 높은 영화) 컴퓨팅 시스템으로 해결할 수 있는 문제로 바뀌어요.'
});

/* 02 나무 그리기 · 거북이 */
function dmTreeLines(depth,ratio){ // 교과서 알고리즘을 같은 규칙으로 되풀이
  const L=[]; let x=0,y=0,h=90;
  const fw=len=>{const nx=x+len*Math.cos(h*Math.PI/180), ny=y+len*Math.sin(h*Math.PI/180); L.push([x,y,nx,ny]); x=nx; y=ny;};
  const bw=len=>{x-=len*Math.cos(h*Math.PI/180); y-=len*Math.sin(h*Math.PI/180);};
  const sub=(len,d)=>{h+=30; fw(len); if(d>1) sub(len*ratio,d-1); bw(len); h-=60; fw(len); if(d>1) sub(len*ratio,d-1); bw(len); h+=30;};
  fw(100); sub(100*ratio,depth); return L;
}
function dmTreeSvg(svg,depth,ratio,stroke){
  const L=dmTreeLines(depth,ratio); let mnx=1e9,mxx=-1e9,mny=1e9,mxy=-1e9;
  L.forEach(([a,b,c,d])=>{mnx=Math.min(mnx,a,c);mxx=Math.max(mxx,a,c);mny=Math.min(mny,b,d);mxy=Math.max(mxy,b,d);});
  const w=mxx-mnx||1, hh=mxy-mny||1, s=Math.min(150/w,140/hh), ox=80-(mnx+w/2)*s, oy=146;
  svg.innerHTML=L.map(([a,b,c,d])=>`<line x1="${(ox+a*s).toFixed(1)}" y1="${(oy-b*s).toFixed(1)}" x2="${(ox+c*s).toFixed(1)}" y2="${(oy-d*s).toFixed(1)}"/>`).join('');
  svg.setAttribute('stroke',stroke||'#16202c'); svg.setAttribute('stroke-width','2'); svg.setAttribute('stroke-linecap','round');
}
dmTreeSvg($('dmAbsTree'),6,.7,'#2e7d38');
(function(){
  const B=$('dmTree');
  const ALG=['반시계 방향으로 90도 회전하기','기본 선 길이 정하기(100픽셀)','선 길이만큼 앞으로 이동하며 선 그리기','선 길이를 70%로 줄이기(0.7배)','반시계 방향으로 30도 회전하기','선 길이만큼 앞으로 이동하며 선 그리기','선 길이만큼 뒤로 이동하기','시계 방향으로 60도 회전하기','선 길이만큼 앞으로 이동하며 선 그리기','선 길이만큼 뒤로 이동하기'];
  const CODE=['from turtle import *','','left(90)','len = 100','forward(len)','len = len * 0.7','left(30)','forward(len)','backward(len)','right(60)','forward(len)','backward(len)'];
  B.innerHTML=`<div class="dm-tt">
    <div><b class="dm-cap">(라) 알고리즘 설계</b><ol class="dm-alg" id="ttAlg">${ALG.map((a,i)=>`<li data-i="${i}">${i+1}단계: ${a}</li>`).join('')}</ol></div>
    <div><b class="dm-cap">(마) 프로그래밍</b><pre class="dm-code" id="ttCode">${CODE.map((c,i)=>`<span data-l="${i}"><i>${i+1}</i>${esc(c)||' '}</span>`).join('')}</pre>
      <div class="dm-vars" id="ttVars"></div></div>
    <div><b class="dm-cap">실행 결과</b><svg viewBox="0 0 220 220" class="dm-turtle" id="ttSvg"></svg></div>
  </div>
  <div class="row" style="margin-top:8px"><button class="btn sm" id="ttStep">한 단계 ▶</button><button class="btn sm ghost" id="ttAll">끝까지 실행 ▶▶</button><button class="btn sm ghost" id="ttReset">처음부터</button><span class="muted" style="font-size:.85rem" id="ttMsg"></span></div>
  <div class="dm-grow" id="ttGrow" hidden>
    <p style="margin:0 0 6px"><b>같은 규칙 되풀이하기</b> 가지 끝마다 「길이를 줄이고, 왼쪽 가지·오른쪽 가지 그리기」를 되풀이하면 (나)처럼 나무 모양이 나와요.</p>
    <div class="ctrl"><label for="ttDep">되풀이</label><input type="range" id="ttDep" min="1" max="7" value="1"><output id="ttDepV">1</output></div>
    <div class="ctrl"><label for="ttRat">줄이는 비율</label><input type="range" id="ttRat" min="50" max="80" step="5" value="70"><output id="ttRatV">0.7</output></div>
    <svg viewBox="0 0 160 150" class="dm-turtle sm" id="ttGrowSvg"></svg>
  </div>`;
  const svg=$('ttSvg'); let i, st;
  const X=x=>110+x, Y=y=>205-y;
  function draw(){
    const rad=st.h*Math.PI/180, tx=X(st.x), ty=Y(st.y);
    svg.innerHTML=st.lines.map(([a,b,c,d])=>`<line x1="${X(a)}" y1="${Y(b)}" x2="${X(c)}" y2="${Y(d)}" stroke="#16202c" stroke-width="3" stroke-linecap="round"/>`).join('')+
      `<g transform="translate(${tx} ${ty}) rotate(${-st.h+90})"><path d="M0 -9 L7 6 L-7 6 Z" fill="#9b4fc4"/></g>`;
    $('ttVars').innerHTML=`<span>len = <b>${st.len==null?'?':Math.round(st.len*10)/10}</b></span><span>거북이가 보는 방향 <b>${((st.h%360)+360)%360}°</b> <small>(오른쪽 0°, 위쪽 90°)</small></span>`;
    B.querySelectorAll('#ttAlg li').forEach(li=>li.classList.toggle('on',+li.dataset.i===i-1));
    B.querySelectorAll('#ttCode span').forEach(s=>s.classList.toggle('on',+s.dataset.l===i+1&&i>0));
    $('ttMsg').textContent=i===0?'한 단계 ▶를 눌러 1단계부터 실행해요.':i>=ALG.length?'끝! (다)처럼 줄기 한 개와 두 가지가 그려졌어요.':`${i}단계까지 실행했어요.`;
    $('ttGrow').hidden=i<ALG.length;
  }
  function reset(){i=0; st={x:0,y:0,h:0,len:null,lines:[]}; draw();}
  function step(){
    if(i>=ALG.length) return; const k=i, rad=()=>st.h*Math.PI/180;
    const fw=()=>{const nx=st.x+st.len*Math.cos(rad()), ny=st.y+st.len*Math.sin(rad()); st.lines.push([st.x,st.y,nx,ny]); st.x=nx; st.y=ny;};
    const bw=()=>{st.x-=st.len*Math.cos(rad()); st.y-=st.len*Math.sin(rad());};
    if(k===0) st.h+=90; else if(k===1) st.len=100; else if(k===3) st.len*=.7; else if(k===4) st.h+=30; else if(k===7) st.h-=60;
    else if(k===2||k===5||k===8) fw(); else bw();
    i++; draw();
  }
  $('ttStep').onclick=step; $('ttReset').onclick=reset;
  $('ttAll').onclick=async()=>{while(i<ALG.length){step(); await sleep(260);}};
  const grow=()=>{const d=+$('ttDep').value, r=+$('ttRat').value/100; $('ttDepV').textContent=d; $('ttRatV').textContent=r; dmTreeSvg($('ttGrowSvg'),d,r);};
  $('ttDep').oninput=grow; $('ttRat').oninput=grow; grow();
  reset();
})();

/* 02 핵심 요소 고르기 */
(function(){
  const B=$('dmAbs');
  const IT=[
    {t:'정문 위치',e:1,w:'출발하는 곳이에요.'},
    {t:'부스의 위치',e:1,w:'도착해야 하는 곳이에요.'},
    {t:'부스 이름',e:1,w:'손님이 원하는 부스를 고르려면 필요해요.'},
    {t:'걸어서 지나갈 수 있는 길',e:1,w:'어디로 갈 수 있는지 알아야 경로를 찾을 수 있어요.'},
    {t:'건물 외벽의 색깔',e:0,w:'길을 찾는 데 영향을 주지 않아요.'},
    {t:'하늘의 구름 모양',e:0,w:'문제와 관계없는 정보예요.'},
    {t:'교문 옆 나무의 종류',e:0,w:'경로를 정하는 데 쓰이지 않아요.'},
    {t:'운동장 잔디의 길이',e:0,w:'길 안내와 관계없어요.'},
  ];
  const order=[2,6,0,4,3,7,1,5];
  B.innerHTML=`<div class="dm-pick">${order.map(i=>`<button data-i="${i}">${IT[i].t}</button>`).join('')}</div><div class="row"><button class="btn sm" id="absChk">확인</button><button class="btn sm ghost" id="absRe">다시 고르기</button></div><div class="dm-absfb" id="absFb"></div>`;
  const bs=[...B.querySelectorAll('.dm-pick button')];
  bs.forEach(b=>b.onclick=()=>{if(B.classList.contains('done'))return; b.classList.toggle('on');});
  $('absChk').onclick=()=>{
    let ok=0; const picked=[];
    bs.forEach(b=>{const it=IT[+b.dataset.i], on=b.classList.contains('on'); if(on) picked.push(it.t); const right=on===!!it.e; if(right) ok++; b.classList.add(right?'r':'x'); b.title=it.w;});
    B.classList.add('done');
    $('absFb').innerHTML=`8개 중 <b>${ok}개</b>를 알맞게 판단했어요. <span class="muted">초록 테두리는 알맞은 판단, 빨간 테두리는 다시 생각할 것이에요.</span><ul>${IT.map(it=>`<li><b>${it.t}</b> · ${it.e?'핵심 요소':'불필요한 요소'} — ${it.w}</li>`).join('')}</ul>`;
    MEMO.absPick=`고른 핵심 요소: ${picked.join(', ')||'(없음)'} (8개 중 ${ok}개 알맞음)`; dmSave();
  };
  $('absRe').onclick=()=>{B.classList.remove('done'); bs.forEach(b=>{b.classList.remove('on','r','x'); b.title='';}); $('absFb').innerHTML='';};
})();

/* 03 날짜 상자 분할 정복 */
(function(){
  const B=$('dmDates');
  const cmp=(a,b)=>{const [m1,d1]=a.split('-').map(Number),[m2,d2]=b.split('-').map(Number); return m1-m2||d1-d2;};
  let dates, stages, k;
  function build(){
    stages=[]; const lv=[[dates]];
    while(lv[lv.length-1].some(g=>g.length>1)) lv.push(lv[lv.length-1].flatMap(g=>g.length>1?[g.slice(0,g.length/2),g.slice(g.length/2)]:[g]));
    stages.push({t:'처음 상태',d:'날짜가 뒤섞인 상자 8개예요. 이 큰 문제를 작은 문제로 나눠 봐요.',g:lv[0],cut:true});
    for(let i=1;i<lv.length;i++) stages.push({t:`분할 ${i}`,d:i<lv.length-1?'두 그룹으로 나누어요. 아직 더 나눌 수 있어요.':'더 이상 나눌 수 없는 작은 문제(상자 1개) 8개가 되었어요.',g:lv[i],cut:true});
    let cur=lv[lv.length-1], n=1;
    while(cur.length>1){
      const nx=[], log=[];
      for(let j=0;j<cur.length;j+=2){
        const a=cur[j].slice(), b=cur[j+1].slice(), m=[];
        while(a.length&&b.length){ const pick=cmp(a[0],b[0])<=0?a:b, other=pick===a?b:a; if(j===0) log.push(`‘${a[0]}’와 ‘${b[0]}’ 비교 → ‘${pick[0]}’를 앞에`); m.push(pick.shift()); }
        if(j===0&&(a.length||b.length)) log.push(`비교할 대상이 없으니 남은 ‘${a.concat(b).join('’, ‘')}’는 그대로 뒤에`);
        nx.push(m.concat(a,b));
      }
      const sz=nx[0].length;
      stages.push({t:`정복 ${n}단계`,d:`작은 문제 두 개씩, 각 문제의 첫 번째 데이터끼리 비교하며 합쳐 데이터 ${sz}개로 이루어진 작은 문제 ${nx.length}개를 만들어요.`,log,g:nx});
      cur=nx; n++;
    }
    stages[stages.length-1].t='완료'; stages[stages.length-1].d='데이터 8개로 이루어진 문제 1개가 날짜순으로 정리되었어요. 작은 문제를 해결해 합치니 전체 문제가 해결됐어요.';
  }
  function show(){
    const s=stages[k];
    B.querySelector('.dm-dstage').innerHTML=`<b>${s.t}</b> <span>${s.d}</span>${s.log&&s.log.length?`<div class="dm-dlog"><small>첫 번째 묶음에서 한 일</small> ${s.log.map(esc).join(' · ')}</div>`:''}`;
    B.querySelector('.dm-drow').innerHTML=s.g.map((g,gi)=>`${gi&&s.cut?'<i class="cut">✂️</i>':''}<div class="dm-dgrp ${g.length===1?'one':''}">${g.map(x=>`<span>${x}</span>`).join('')}</div>`).join('');
    B.querySelector('.dm-dnav').textContent=`${k+1} / ${stages.length}`;
    $('dtPrev').disabled=k===0; $('dtNext').disabled=k===stages.length-1;
  }
  function fresh(list){dates=list; build(); k=0; show();}
  B.innerHTML=`<div class="dm-dstage"></div><div class="dm-drow"></div><div class="row"><button class="btn sm ghost" id="dtPrev">◀ 이전</button><button class="btn sm" id="dtNext">다음 ▶</button><span class="dm-dnav muted"></span><button class="btn sm ghost" id="dtNew" style="margin-left:auto">🔀 다른 날짜로 해 보기</button></div>`;
  $('dtPrev').onclick=()=>{if(k>0){k--;show();}}; $('dtNext').onclick=()=>{if(k<stages.length-1){k++;show();}};
  $('dtNew').onclick=()=>{const set=new Set(); while(set.size<8){const m=1+Math.floor(Math.random()*12), d=1+Math.floor(Math.random()*28); set.add(m+'-'+d);} fresh([...set]);};
  fresh(['7-14','3-9','11-2','4-27','9-30','1-18','12-5','6-1']);
})();

/* 03 숫자 퍼즐 (구역 = 2행 × 3열) */
(function(){
  const B=$('dmPuzzle');
  const SOL=[[2,5,3,6,1,4],[6,1,4,2,3,5],[1,6,2,4,5,3],[4,3,5,1,2,6],[3,2,6,5,4,1],[5,4,1,3,6,2]];
  const GIV=[[0,5,3,0,1,4],[6,1,0,0,3,5],[0,0,2,4,0,0],[0,3,5,0,2,6],[0,2,0,5,0,0],[5,4,0,0,6,2]];
  const PK=MK+'-puzzle';
  let saved=store.get(PK,null); if(typeof saved!=='string'||saved.length!==36) saved='';
  let html='<div class="dm-pz" id="pzGrid">';
  for(let r=0;r<6;r++) for(let c=0;c<6;c++){
    const g=GIV[r][c], v=saved?saved[r*6+c]:'0', cls=`${c===2?'br':''} ${r%2===1&&r<5?'bb':''}`;
    html+=g?`<div class="cell giv ${cls}" data-r="${r}" data-c="${c}">${g}</div>`:`<div class="cell ${cls}" data-r="${r}" data-c="${c}"><input inputmode="numeric" maxlength="1" aria-label="${r+1}행 ${c+1}열" value="${v!=='0'?v:''}"></div>`;
  }
  html+='</div>';
  B.innerHTML=`<div class="dm-pzwrap">${html}<div class="dm-pzside">
    <div class="row"><button class="btn sm ghost" data-m="box">구역으로 나누기</button><button class="btn sm ghost" data-m="row">행으로 나누기</button><button class="btn sm ghost" data-m="col">열로 나누기</button></div>
    <div class="row"><button class="btn sm ghost" id="pzNext" disabled>다음 작은 문제 ▶</button><button class="btn sm ghost" id="pzAll">전체 보기</button></div>
    <div class="dm-pzmsg" id="pzMsg">버튼을 눌러 작은 문제 하나만 밝게 보고, 그 안에서 빠진 숫자를 찾아요.</div>
    <div class="row"><button class="btn sm" id="pzChk">확인</button><button class="btn sm ghost" id="pzClr">입력 지우기</button></div>
    <div class="dm-pzfb" id="pzFb"></div></div></div>`;
  const cells=[...B.querySelectorAll('.cell')];
  const val=(r,c)=>GIV[r][c]||+((cells[r*6+c].querySelector('input')||{}).value||0);
  let mode='', idx=0;
  const inUnit=(r,c)=>mode==='row'?r===idx:mode==='col'?c===idx:(Math.floor(r/2)*2+Math.floor(c/3))===idx;
  function hl(){
    cells.forEach(e=>{const r=+e.dataset.r,c=+e.dataset.c; e.classList.toggle('dim',!!mode&&!inUnit(r,c)); e.classList.toggle('hl',!!mode&&inUnit(r,c));});
    $('pzNext').disabled=!mode;
    if(mode){const nm={box:'구역',row:'행',col:'열'}[mode]; const miss=[1,2,3,4,5,6].filter(v=>{for(let r=0;r<6;r++)for(let c=0;c<6;c++) if(inUnit(r,c)&&val(r,c)===v) return false; return true;});
      $('pzMsg').innerHTML=`<b>${nm} ${idx+1}</b>만 보고 있어요. 이 작은 문제에 아직 없는 숫자: <b>${miss.join(', ')||'없음 (완성!)'}</b>`;}
    else $('pzMsg').textContent='버튼을 눌러 작은 문제 하나만 밝게 보고, 그 안에서 빠진 숫자를 찾아요.';
  }
  B.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{mode=b.dataset.m; idx=0; B.querySelectorAll('[data-m]').forEach(x=>x.classList.toggle('ghost',x!==b)); hl();});
  $('pzNext').onclick=()=>{idx=(idx+1)%6; hl();};
  $('pzAll').onclick=()=>{mode=''; B.querySelectorAll('[data-m]').forEach(x=>x.classList.add('ghost')); hl();};
  const save=()=>{let s=''; for(let r=0;r<6;r++)for(let c=0;c<6;c++) s+=GIV[r][c]?'0':String(val(r,c)||0); store.set(PK,s);};
  B.querySelectorAll('input').forEach(inp=>inp.addEventListener('input',()=>{inp.value=inp.value.replace(/[^1-6]/g,'').slice(-1); inp.parentElement.classList.remove('bad','good'); save(); hl();}));
  $('pzChk').onclick=()=>{
    let empty=0, bad=0;
    cells.forEach(e=>{const r=+e.dataset.r,c=+e.dataset.c; if(GIV[r][c]) return; const v=val(r,c); e.classList.remove('bad','good'); if(!v){empty++;return;} if(v!==SOL[r][c]){bad++; e.classList.add('bad');} else e.classList.add('good');});
    let req=true; for(let r=0;r<2;r++) for(let c=0;c<6;c++) if(!GIV[r][c]&&val(r,c)!==SOL[r][c]) req=false;
    if(!empty&&!bad){ $('pzFb').innerHTML='<span class="ok">🎉 퍼즐 완성!</span> 작은 문제를 하나씩 해결해 전체 문제를 해결했어요.'; MEMO.puzzleDone='숫자 퍼즐 전체 완성'; dmSave(); }
    else { if(req&&MEMO.puzzleDone!=='숫자 퍼즐 전체 완성'){MEMO.puzzleDone='필수 구역 1·2 완성'; dmSave();}
      $('pzFb').innerHTML=(req?'<span class="ok">필수 구역 1·2 완성!</span> 나머지 구역은 선택이에요. ':'')+(bad?`<span class="ng">빨간 칸 ${bad}개</span>는 그 행·열·구역에 이미 있는 숫자와 겹치지 않는지 다시 확인해요. `:'')+(empty&&!req?`필수 구역에 빈칸이 남았어요.`:''); }
  };
  $('pzClr').onclick=()=>{B.querySelectorAll('input').forEach(i=>{i.value=''; i.parentElement.classList.remove('bad','good');}); save(); hl(); $('pzFb').textContent='';};
})();

/* 03 내 문제 고르기 */
vote('bigPick','bigProblem',[['🏃 학급 체육대회 준비하기','반 대표 정하기부터 응원까지'],['📸 반 졸업 앨범 한 쪽 만들기','사진 모으기부터 꾸미기까지'],['📱 급식 메뉴 알림 앱 만들기','메뉴 모으기부터 알림 보내기까지']]);

/* 04 지하철 그래프 모델링 */
(function(){
  const B=$('dmMetro');
  const ST={S:['학교',70,170],M:['시장',150,262],P:['광장',275,292],R:['강변',410,292],K:['공원',530,262],A:['공항',612,170],L:['도서관',160,78],H:['시청',300,52],T:['터미널',455,62],Bh:['병원',290,172]};
  const LN={g:['초록선','#1f9d74'],b:['파랑선','#2f6fd0'],o:['주황선','#e0702b'],p:['보라선','#9b4fc4']};
  const E=[['S','M','g',4],['M','P','g',4],['P','R','g',4],['R','K','g',4],['K','A','g',4],['S','L','b',3],['L','H','b',3],['H','T','o',3],['T','A','o',4],['P','Bh','p',3],['Bh','H','p',3]];
  const edge=(a,b)=>E.find(e=>(e[0]===a&&e[1]===b)||(e[0]===b&&e[1]===a));
  const noise=`<g class="noise">
    <path d="M0 330 C 120 300, 220 340, 340 318 S 560 300, 700 330 L700 350 L0 350 Z" fill="#cfe6f5"/>
    <g fill="#d9d2c3">${[[20,20,40,30],[110,130,36,24],[200,110,44,30],[350,120,40,40],[380,190,50,28],[500,120,46,36],[560,20,60,30],[600,230,40,26],[40,230,30,40],[210,220,40,30],[460,200,30,30],[640,90,40,40]].map(([x,y,w,h])=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3"/>`).join('')}</g>
    <g fill="#9cc79a">${[[100,40],[240,140],[330,230],[520,180],[640,300],[30,300],[420,20],[180,300],[560,320]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="9"/>`).join('')}</g>
    <g stroke="#c9c3b6" stroke-width="5" fill="none"><path d="M0 120 L700 110"/><path d="M230 0 L250 350"/><path d="M500 0 L470 350"/><path d="M0 210 L700 230"/></g>
    <g font-size="10" fill="#8a8072"><text x="22" y="16">아파트</text><text x="200" y="106">카페</text><text x="352" y="116">은행</text><text x="562" y="16">마트</text><text x="600" y="226">주차장</text><text x="40" y="226">편의점</text></g></g>`;
  const lines=E.map(([a,b,l])=>{const p=ST[a],q=ST[b]; return `<line x1="${p[1]}" y1="${p[2]}" x2="${q[1]}" y2="${q[2]}" stroke="${LN[l][1]}" stroke-width="7" stroke-linecap="round"/>`;}).join('');
  const tms=E.map(([a,b,l,t])=>{const p=ST[a],q=ST[b],mx=(p[1]+q[1])/2,my=(p[2]+q[2])/2; return `<g class="tm"><circle cx="${mx}" cy="${my}" r="11" fill="#fff" stroke="${LN[l][1]}" stroke-width="2"/><text x="${mx}" y="${my+4}" text-anchor="middle" font-size="11" font-weight="700">${t}</text></g>`;}).join('');
  const nodes=Object.entries(ST).map(([k,[n,x,y]])=>`<g class="st" data-s="${k}" tabindex="0" role="button" aria-label="${n}역"><circle cx="${x}" cy="${y}" r="13" fill="#fff" stroke="#16202c" stroke-width="3"/><text x="${x}" y="${y+(y>250?32:-20)}" text-anchor="middle" font-size="14" font-weight="700">${n}</text></g>`).join('');
  B.innerHTML=`<div class="row" style="margin-bottom:8px"><button class="btn sm" id="mtClean">🧹 필요 없는 정보 지우기</button>
    <span class="dm-seg"><button class="on" data-p="few">문제 ① 환승이 가장 적은 경로</button><button data-p="fast">문제 ② 시간이 가장 짧은 경로</button></span></div>
    <div class="dm-metro"><svg viewBox="0 0 700 350" id="mtSvg">${noise}<g>${lines}</g><g id="mtPath"></g><g>${tms}</g>${nodes}</svg></div>
    <div class="dm-legend">${Object.values(LN).map(([n,c])=>`<span><i style="background:${c}"></i>${n}</span>`).join('')}<span class="muted" id="mtLegendT">원 안의 숫자: 역 사이 이동 시간(분)</span></div>
    <div class="dm-mstat" id="mtStat"></div>
    <div class="row"><button class="btn sm ghost" id="mtUndo">↩ 한 역 되돌리기</button><button class="btn sm ghost" id="mtReset">처음부터</button><button class="btn sm" id="mtRec" disabled>이 경로 기록하기</button></div>
    <div class="dm-recs" id="mtRecs"></div>
    <p class="note">환승할 때 걸어서 갈아타는 시간은 생각하지 않아요. 같은 역을 두 번 지나갈 수는 없어요.</p>`;
  const svg=$('mtSvg'); let path=['S'], prob='few';
  function stats(p){let t=0,tr=0,prev=null; for(let i=1;i<p.length;i++){const e=edge(p[i-1],p[i]); t+=e[3]; if(prev&&prev!==e[2]) tr++; prev=e[2];} return {t,tr};}
  // 모든 경로 중 최적값
  const best={few:1e9,fast:1e9};
  (function dfs(p){const last=p[p.length-1]; if(last==='A'){const s=stats(p); best.few=Math.min(best.few,s.tr); best.fast=Math.min(best.fast,s.t); return;}
    E.forEach(e=>{const nx=e[0]===last?e[1]:e[1]===last?e[0]:null; if(nx&&!p.includes(nx)) dfs(p.concat(nx));});})(['S']);
  const names=p=>p.map(k=>ST[k][0]).join(' → ');
  function draw(){
    $('mtPath').innerHTML=path.slice(1).map((k,i)=>{const a=ST[path[i]],b=ST[k]; return `<line x1="${a[1]}" y1="${a[2]}" x2="${b[1]}" y2="${b[2]}" stroke="#16202c" stroke-width="3" stroke-dasharray="7 5"/>`;}).join('');
    svg.querySelectorAll('.st').forEach(g=>{const k=g.dataset.s, c=g.querySelector('circle'); const on=path.includes(k), last=k===path[path.length-1];
      c.setAttribute('fill',last?'#f2a516':on?'#ffe7a8':'#fff'); g.classList.toggle('can',path[path.length-1]!=='A'&&!!edge(path[path.length-1],k)&&!path.includes(k));});
    const s=stats(path), done=path[path.length-1]==='A';
    $('mtStat').innerHTML=`<b>경로</b> ${names(path)} ${done?'<span class="ok">도착!</span>':'<span class="muted">(이웃한 역을 눌러 이어 가요)</span>'}<br><b>환승</b> ${s.tr}번${prob==='fast'?` · <b>걸린 시간</b> ${s.t}분`:''}`;
    $('mtRec').disabled=!done;
    $('mtRec').textContent=prob==='few'?'이 경로를 문제 ①의 답으로 기록':'이 경로를 문제 ②의 답으로 기록';
    $('mtRecs').innerHTML=`<div><b>문제 ① 환승이 가장 적은 경로</b> ${MEMO.routeFew?esc(MEMO.routeFew):'<span class="muted">아직 기록 없음</span>'}</div><div><b>문제 ② 시간이 가장 짧은 경로</b> ${MEMO.routeFast?esc(MEMO.routeFast):'<span class="muted">아직 기록 없음</span>'}</div>`;
  }
  function click(k){
    const last=path[path.length-1];
    if(k===last&&path.length>1){path.pop(); draw(); return;}
    if(last==='A') return;
    if(path.includes(k)) return;
    if(!edge(last,k)){$('mtStat').insertAdjacentHTML('beforeend','<br><span class="ng">선으로 바로 이어진 이웃 역만 고를 수 있어요.</span>'); return;}
    path.push(k); draw();
  }
  svg.querySelectorAll('.st').forEach(g=>{g.onclick=()=>click(g.dataset.s); g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();click(g.dataset.s);}};});
  $('mtUndo').onclick=()=>{if(path.length>1){path.pop(); draw();}};
  $('mtReset').onclick=()=>{path=['S']; draw();};
  $('mtClean').onclick=()=>{const c=svg.classList.toggle('clean'); $('mtClean').textContent=c?'🗺️ 원래 지도 다시 보기':'🧹 필요 없는 정보 지우기';};
  B.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{prob=b.dataset.p; B.querySelectorAll('[data-p]').forEach(x=>x.classList.toggle('on',x===b)); svg.classList.toggle('times',prob==='fast'); $('mtLegendT').hidden=prob!=='fast'; draw();});
  $('mtRec').onclick=()=>{
    const s=stats(path), txt=prob==='few'?`${names(path)} (환승 ${s.tr}번)`:`${names(path)} (환승 ${s.tr}번, ${s.t}분)`;
    let fb;
    if(prob==='few'){MEMO.routeFew=txt; fb=s.tr===best.few?'<span class="ok">환승이 가장 적은 경로예요!</span>':'<span class="ng">환승이 더 적은 경로가 있어요.</span> 다시 찾아 기록해 봐요.';}
    else {MEMO.routeFast=txt; fb=s.t===best.fast?'<span class="ok">시간이 가장 짧은 경로예요!</span>':'<span class="ng">시간이 더 짧은 경로가 있어요.</span> 원 안의 시간을 더해 비교해 봐요.';}
    dmSave(); draw(); $('mtStat').insertAdjacentHTML('beforeend','<br>'+fb);
  };
  $('mtLegendT').hidden=true; draw();
})();

/* 04 규칙 모델링 · 타일 무늬 */
(function(){
  const B=$('dmTile');
  const tot=n=>2*n*n-2*n+1;
  B.innerHTML=`<div class="dm-tile">
    <div><div class="ctrl"><label for="tlN">n</label><input type="range" id="tlN" min="1" max="6" value="1"><output id="tlNV">1</output></div>
      <svg viewBox="-6.5 -6.5 13 13" class="dm-tilesvg" id="tlSvg" aria-label="정사각형 타일 무늬"></svg><p class="note" id="tlCnt"></p></div>
    <div><div style="overflow-x:auto"><table class="dm-tbl" id="tlTbl"></table></div>
      <div class="dm-rule"><b>목표 상태(n)의 규칙은?</b> <span class="dm-seg" id="tlRule"><button data-r="0">(n−1)번째 결과 + 4</button><button data-r="1">(n−1)번째 결과 + 4 × (n − 1)</button><button data-r="2">(n−1)번째 결과 + n × n</button></span><div id="tlRuleFb"></div></div>
      <div class="dm-pred" id="tlPred" hidden><b>예측</b> n = 10일 때 타일은 모두 몇 개일까요? <input type="number" id="tlPin" min="1" style="width:90px"> 개 <button class="btn sm" id="tlPchk">확인</button><span id="tlPfb"></span></div>
      <div class="dm-auto" id="tlAuto" hidden><b>💻 자동화하기</b> 규칙을 컴퓨터에게 맡기면 큰 n도 바로 알 수 있어요. n = <input type="number" id="tlAin" value="100" min="1" max="100000" style="width:110px"> <button class="btn sm" id="tlArun">계산</button> <span id="tlAout"></span></div>
    </div></div>`;
  function drawTiles(n){
    let s=''; for(let x=-(n-1);x<=n-1;x++) for(let y=-(n-1);y<=n-1;y++){const k=Math.abs(x)+Math.abs(y); if(k<=n-1) s+=`<rect x="${x-.46}" y="${y-.46}" width=".92" height=".92" rx=".12" fill="${k===n-1&&n>1?'#e0702b':DMK[k%2?1:3]}" opacity="${k===n-1&&n>1?1:.75}"/>`;}
    $('tlSvg').innerHTML=s; $('tlCnt').innerHTML=n>1?`주황색이 n = ${n}이 되면서 <b>새로 붙은 타일</b>이에요.`:'n = 1: 타일 1개에서 시작해요.';
  }
  const ok={};
  function table(){
    let h='<tr><th>상태</th><th>n의 값</th><th>새로 붙은 타일 수</th><th>타일 수</th></tr><tr><td>초기 상태</td><td>1</td><td>–</td><td>1</td></tr>';
    for(let n=2;n<=5;n++) h+=`<tr><td>n = ${n}인 상태</td><td>${n}</td><td><input type="number" min="0" data-n="${n}" style="width:70px" value="${ok[n]?4*(n-1):''}"> <span class="mk" data-m="${n}">${ok[n]?'✔':''}</span></td><td>${ok[n]?`(${tot(n-1)}) + ${4*(n-1)} = <b>${tot(n)}</b>`:'?'}</td></tr>`;
    h+='<tr><td>…</td><td>…</td><td>…</td><td>…</td></tr><tr><td>목표 상태</td><td>n</td><td colspan="2" id="tlGoal">?</td></tr>';
    $('tlTbl').innerHTML=h;
    $('tlTbl').querySelectorAll('input').forEach(inp=>inp.onchange=()=>{const n=+inp.dataset.n, v=+inp.value; if(v===4*(n-1)){ok[n]=1; table();} else {$('tlTbl').querySelector(`[data-m="${n}"]`).innerHTML='<span class="ng">✖ 그림을 다시 세어 봐요</span>';}});
  }
  $('tlN').oninput=()=>{const n=+$('tlN').value; $('tlNV').textContent=n; drawTiles(n);};
  B.querySelectorAll('#tlRule button').forEach(b=>b.onclick=()=>{
    B.querySelectorAll('#tlRule button').forEach(x=>x.classList.toggle('on',x===b));
    if(b.dataset.r==='1'){ $('tlRuleFb').innerHTML='<span class="ok">맞아요!</span> 상태가 하나 바뀔 때마다 4 × (n − 1)개가 붙어요.'; $('tlGoal').textContent='(n−1)번째 결과 + 4 × (n − 1)'; $('tlPred').hidden=false; }
    else $('tlRuleFb').innerHTML='<span class="ng">표의 「새로 붙은 타일 수」 열과 맞는지 n = 2, 3, 4에 넣어 확인해 봐요.</span>';
  });
  $('tlPchk').onclick=()=>{const v=+$('tlPin').value, right=v===tot(10);
    $('tlPfb').innerHTML=right?' <span class="ok">맞아요!</span> 사람이 손으로 하려면 n = 9까지의 결과를 모두 알아야 해요.':' <span class="ng">다시 계산해 봐요.</span> n = 6, 7, 8, 9의 결과를 차례로 구해 보세요.';
    if(right){$('tlAuto').hidden=false;}
    const rule=$('tlGoal').textContent; MEMO.tileRes=`규칙: ${rule} · n = 10 예측 ${v||'?'}개(${right?'맞음':'다시'})`; dmSave();};
  $('tlArun').onclick=()=>{let n=Math.max(1,Math.min(100000,Math.floor(+$('tlAin').value||1))), t=1; for(let k=2;k<=n;k++) t+=4*(k-1);
    $('tlAout').innerHTML=`n = ${fmt(n)}일 때 타일 <b>${fmt(t)}</b>개 <span class="muted">(규칙을 ${fmt(n-1)}번 되풀이한 결과, 눈 깜짝할 사이에 계산)</span>`;};
  drawTiles(1); table();
})();

/* 04 개념 정리 빈칸 */
document.querySelectorAll('.dm-blank').forEach(b=>b.onclick=()=>{const on=!b.classList.contains('on'); b.textContent=on?b.dataset.a:'?'; b.classList.toggle('on',on);});

/* 05 마무리 */
const MEMOLIST=[['planGame','처음 생각 · 게임을 만드는 단계'],['readyPick','기억나는 중학교 내용'],['robotRun','로봇 문제 · 내가 짠 명령'],['absPick','길 안내 앱 · 고른 핵심 요소'],['puzzleDone','숫자 퍼즐'],['puzzleHow','퍼즐을 작은 문제로 나눈 방법'],['bigProblem','내가 고른 큰 문제'],['decompMine','내가 나눈 작은 문제'],['ck1','성취도 · 문제 분해'],['routeFew','환승이 가장 적은 경로'],['routeFast','시간이 가장 짧은 경로'],['tileRes','(선택) 타일 무늬 규칙 모델링'],['bridgeModel','(선택) 쾨니히스베르크 그래프 모델'],['ck2','성취도 · 분해와 모델링'],['keyQ','핵심 질문에 대한 내 답'],['newLearn','새롭게 알게 된 점']];
onShow[5]=()=>{const p=(MEMO.planGame||'').trim(); $('prevPlan').innerHTML=`<b>처음 생각</b> ${p?esc(p):'<span class="muted">(시작 화면에 아직 안 씀)</span>'}`; memoSummary('msum',MEMOLIST);};
