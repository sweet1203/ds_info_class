/* 공통 */
function soSave(){store.set(MK,MEMO);}
const soList=a=>'['+a.join(', ')+']';

/* 성취도 평가 */
chips('ck1','ck1',['데이터를 정렬하는 다양한 알고리즘의 수행 과정과 특징을 비교할 수 있다'],true);

/* ── 정렬 과정 기록(trace) 만들기 ──
   각 단계: {a:배열(단계 뒤), hl:[강조 위치], sw:교환했나, fixed:[고정 위치], msg, cmp, swp, pv, lo, hi, reg:[l,r], sortedTo, key, ask:예측 질문 여부} */
function soBubble(src){
  const a=src.slice(), n=a.length, S=[]; let cmp=0, swp=0; const fixed=[];
  S.push({a:a.slice(),hl:[],fixed:[],msg:'정렬 전 상태',cmp,swp});
  for(let k=1;k<n;k++){
    for(let j=0;j<n-k;j++){
      const x=a[j], y=a[j+1], will=x>y; cmp++;
      S.push({pre:a.slice(),a:null,hl:[j,j+1],fixed:fixed.slice(),ask:true,will,stage:k,msg:'',cmp,swp});
      if(will){[a[j],a[j+1]]=[a[j+1],a[j]]; swp++;}
      Object.assign(S[S.length-1],{a:a.slice(),sw:will,swp,msg:`${k}단계 · ${x}, ${y} 비교${will?' & 교환':''}`});
    }
    fixed.push(n-k); if(k===n-1) fixed.push(0);
    S.push({a:a.slice(),hl:[],fixed:fixed.slice(),msg:k<n-1?`${k}단계 끝 · ‘${a[n-k]}’ 정렬(자리 확정)`:'정렬 완료 상태',cmp,swp,stageEnd:true});
  }
  if(n<2) S.push({a:a.slice(),hl:[],fixed:[0],msg:'정렬 완료 상태',cmp,swp});
  return S;
}
function soInsert(src){
  const a=src.slice(), n=a.length, S=[]; let cmp=0, swp=0;
  S.push({a:a.slice(),hl:[],sortedTo:0,msg:'정렬 전 상태 · 첫 번째 요소를 정렬된 영역으로 정해요',cmp,swp});
  for(let i=1;i<n;i++){
    const key=a[i]; S.push({a:a.slice(),hl:[],key:i,sortedTo:i-1,msg:`‘${key}’을(를) 삽입 정렬`,cmp,swp});
    let j=i;
    while(j>0){
      const x=a[j-1], will=x>a[j]; cmp++;
      S.push({pre:a.slice(),a:null,hl:[j-1,j],key:j,preKey:j,sortedTo:i-1,ask:true,will,msg:'',cmp,swp});
      if(will){[a[j-1],a[j]]=[a[j],a[j-1]]; swp++;}
      Object.assign(S[S.length-1],{a:a.slice(),sw:will,swp,key:will?j-1:j,msg:will?`${x}, ${key} 비교 → ${x}이(가) 더 커서 교환(앞으로 이동)`:`${x}, ${key} 비교 → ${x}이(가) ${key}보다 크지 않아 제자리`});
      if(!will) break; j--;
    }
  }
  S.push({a:a.slice(),hl:[],sortedTo:n-1,msg:'정렬 완료',cmp,swp});
  return S;
}
function soQuick(src){
  const a=src.slice(), N=a.length, S=[], fixed=[]; let cmp=0, swp=0;
  const push=o=>S.push(Object.assign({a:a.slice(),hl:[],fixed:fixed.slice(),cmp,swp},o));
  push({msg:'정렬 전 상태'});
  (function q(l,r){
    if(l>r) return;
    if(l===r){fixed.push(l); push({reg:[l,r],hl:[l],msg:`영역의 크기가 1개이므로 ‘${a[l]}’ 고정`}); return;}
    const p=l, pv=a[p]; let lo=l+1, hi=r;
    push({reg:[l,r],pv:p,lo,hi,msg:`pivot, low, high 지정 · pivot = ${pv}`});
    for(;;){
      while(lo<=hi&&lo<N-1){cmp++; if(a[lo]<=pv) lo++; else break;}
      while(true){cmp++; if(a[hi]>pv) hi--; else break;}
      if(lo<hi){const x=a[lo], y=a[hi]; push({reg:[l,r],pv:p,lo,hi,hl:[lo,hi],msg:`low = ${x}, high = ${y} 교환`}); [a[lo],a[hi]]=[a[hi],a[lo]]; swp++; push({reg:[l,r],pv:p,lo,hi,hl:[lo,hi],sw:true,msg:`교환 결과 · ${x}, ${y}의 자리가 바뀌었어요`});}
      else{
        push({reg:[l,r],pv:p,lo,hi,msg:lo===hi?'low와 high가 같아짐.':'low가 high보다 커짐.'});
        if(hi!==p){[a[p],a[hi]]=[a[hi],a[p]]; swp++;}
        fixed.push(hi); push({reg:[l,r],pv:hi,hl:hi!==p?[p,hi]:[hi],sw:hi!==p,msg:hi!==p?`pivot과 high 교환 · pivot ‘${pv}’ 고정`:`pivot이 이미 제자리 · ‘${pv}’ 고정`});
        q(l,hi-1); q(hi+1,r); return;
      }
    }
  })(0,N-1);
  push({msg:'정렬 완료',done:true,fixed:[...Array(N).keys()]});
  return S;
}
const SO_ALG={bubble:soBubble,insert:soInsert,quick:soQuick};
const soCount=(alg,arr)=>{const S=SO_ALG[alg](arr), L=S[S.length-1]; return {cmp:L.cmp,swp:L.swp};};

/* 기록 저장(메모 키를 드러내 적음) */
function soSetRec(k,v){if(k==='bubbleRec') MEMO.bubbleRec=v; else if(k==='insertRec') MEMO.insertRec=v; else MEMO.quickRec=v; soSave();}

/* ── 막대 시뮬레이터 ── */
function soSim(box,alg,cfg){
  const B=$(box);
  B.innerHTML=`<div class="so-presets">${cfg.presets.map((p,i)=>`<button class="btn sm ghost" data-i="${i}">${p[0]}</button>`).join('')}<span class="so-own"><input type="text" placeholder="직접 입력: 숫자를 띄어 쓰기" aria-label="직접 입력할 숫자"><button class="btn sm ghost" data-own>넣기</button></span></div>
    <div class="so-stage"><div class="so-bars"></div><div class="so-idx"></div></div>
    <div class="so-msg"></div>
    <div class="so-ask" hidden><b>예측</b> 두 막대의 자리를 바꿀까요? <button class="btn sm" data-ans="1">바꾼다</button><button class="btn sm" data-ans="0">그대로</button></div>
    <div class="row so-ctrl"><button class="btn sm ghost" data-c="first">⏮ 처음</button><button class="btn sm ghost" data-c="prev">◀ 이전</button><button class="btn sm" data-c="next">다음 ▶</button><button class="btn sm ghost" data-c="play">▶▶ 자동</button><button class="btn sm ghost" data-c="end">끝까지 ⏭</button>
      ${cfg.predict?'<label class="so-pred"><input type="checkbox"> 예측하며 진행</label>':''}<span class="so-cnt">비교 <b data-k="cmp">0</b>번 · 교환 <b data-k="swp">0</b>번</span></div>
    <div class="so-done"></div>`;
  const bars=B.querySelector('.so-bars'), idx=B.querySelector('.so-idx'), msg=B.querySelector('.so-msg'), ask=B.querySelector('.so-ask'), done=B.querySelector('.so-done');
  let arr, S, k, timer=null, predOn=false, pOk=0, pAll=0, answered=-1;
  function load(a){arr=a.slice(); S=SO_ALG[alg](arr); k=0; stop(); pOk=0; pAll=0; answered=-1; draw();}
  function stop(){if(timer){clearInterval(timer); timer=null; B.querySelector('[data-c=play]').textContent='▶▶ 자동';}}
  function draw(){
    const s=S[k], showPre=predOn&&s.ask&&answered!==k, A=showPre?s.pre:s.a, mx=Math.max(...arr,1), n=A.length;
    bars.style.setProperty('--n',n); idx.style.setProperty('--n',n);
    bars.innerHTML=A.map((v,i)=>{
      const c=[]; if(s.hl.includes(i)) c.push(showPre?'cmp':s.sw?'sw':'cmp');
      if(alg==='insert'){ const kk=showPre&&s.preKey!=null?s.preKey:s.key; if(s.sortedTo!=null&&i<=s.sortedTo&&kk!==i) c.push('area'); if(kk===i) c.push('key'); if(k===S.length-1) c.push('fix'); }
      else { if((s.fixed||[]).includes(i)) c.push('fix'); }
      if(alg==='quick'){ if(s.pv===i) c.push('pv'); if(s.reg&&(i<s.reg[0]||i>s.reg[1])&&!(s.fixed||[]).includes(i)) c.push('out'); }
      return `<div class="b ${c.join(' ')}" style="height:${26+v/mx*150}px"><span>${v}</span></div>`;}).join('');
    idx.innerHTML=A.map((_,i)=>{let t=''; if(alg==='quick'){const L=[]; if(s.pv===i&&s.lo!=null) L.push('pivot'); if(s.lo===i) L.push('low'); if(s.hi===i) L.push('high'); t=L.join(', ');} return `<span>${t}</span>`;}).join('');
    msg.innerHTML=showPre?`<b>${s.stage?s.stage+'단계 · ':''}${s.pre[s.hl[0]]}, ${s.pre[s.hl[1]]} 비교</b> — 바꿀지 먼저 예측해요.`:`<b>${esc(s.msg)}</b> <span class="muted">(${k+1} / ${S.length})</span>`;
    ask.hidden=!showPre;
    const cs=showPre?S[k-1]||{cmp:0,swp:0}:s;
    B.querySelector('[data-k=cmp]').textContent=cs.cmp; B.querySelector('[data-k=swp]').textContent=cs.swp;
    B.querySelector('[data-c=next]').disabled=k>=S.length-1&&!showPre; B.querySelector('[data-c=prev]').disabled=k===0;
    if(k===S.length-1){ const L=S[k]; done.innerHTML=`<span class="ok">정렬 완료!</span> ${soList(arr)} → ${soList(L.a)} · 비교 <b>${L.cmp}</b>번 · 교환 <b>${L.swp}</b>번${pAll?` · 예측 ${pAll}번 중 ${pOk}번 맞힘`:''} <button class="btn sm" data-rec>이 결과 기록하기</button>`;
      done.querySelector('[data-rec]').onclick=()=>{const item=`${soList(arr)} 비교 ${L.cmp}번, 교환 ${L.swp}번`; const list=(MEMO[cfg.rec]||'').split(' / ').filter(x=>x&&x!==item); list.push(item); soSetRec(cfg.rec,list.slice(-4).join(' / ')); showRecs();};
    } else done.innerHTML='';
    showRecs();
  }
  function showRecs(){const r=(MEMO[cfg.rec]||'').split(' / ').filter(Boolean); let el=B.querySelector('.so-recs'); if(!el){el=document.createElement('div'); el.className='so-recs'; B.appendChild(el);} el.innerHTML=r.length?`<b>내 기록</b><ul>${r.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'';}
  function next(){const s=S[k]; if(predOn&&s.ask&&answered!==k) return false; if(k<S.length-1){k++; draw(); return true;} return false;}
  B.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{B.querySelectorAll('[data-i]').forEach(x=>x.classList.toggle('ghost',x!==b)); load(cfg.presets[+b.dataset.i][1]);});
  const own=B.querySelector('.so-own input');
  B.querySelector('[data-own]').onclick=()=>{const v=own.value.split(/[^0-9]+/).filter(Boolean).map(Number).filter(x=>x>=1&&x<=99).slice(0,10);
    if(v.length<2){msg.innerHTML='<span class="ng">1부터 99까지의 숫자를 2개 이상(10개까지) 띄어 써서 넣어요.</span>'; return;} B.querySelectorAll('[data-i]').forEach(x=>x.classList.add('ghost')); load(v);};
  own.addEventListener('keydown',e=>{if(e.key==='Enter') B.querySelector('[data-own]').click();});
  B.querySelector('[data-c=first]').onclick=()=>{stop(); k=0; answered=-1; draw();};
  B.querySelector('[data-c=prev]').onclick=()=>{stop(); if(k>0){k--; answered=k; draw();}};
  B.querySelector('[data-c=next]').onclick=()=>{stop(); next();};
  B.querySelector('[data-c=end]').onclick=()=>{stop(); k=S.length-1; draw();};
  B.querySelector('[data-c=play]').onclick=()=>{ if(timer){stop(); return;} if(predOn){const c=B.querySelector('.so-pred input'); c.checked=false; predOn=false;} B.querySelector('[data-c=play]').textContent='⏸ 멈춤'; timer=setInterval(()=>{if(!next()) stop();},alg==='quick'?900:650);};
  const pc=B.querySelector('.so-pred input'); if(pc) pc.onchange=()=>{predOn=pc.checked; stop(); draw();};
  ask.querySelectorAll('[data-ans]').forEach(b=>b.onclick=()=>{const s=S[k], ok=(b.dataset.ans==='1')===s.will; pAll++; if(ok) pOk++; answered=k; draw();
    msg.innerHTML=(ok?'<span class="ok">예측 성공!</span> ':'<span class="ng">아쉬워요.</span> ')+msg.innerHTML;});
  load(cfg.presets[0][1]); B.querySelector('[data-i="0"]').classList.remove('ghost');
}

soSim('simBubble','bubble',{rec:'bubbleRec',predict:true,presets:[['교과서 예',[10,6,2,4,3]],['새 리스트',[8,3,5,1,9,2]],['정렬된 리스트',[1,2,3,4,5]],['역순 리스트',[5,4,3,2,1]]]});
soSim('simInsert','insert',{rec:'insertRec',predict:true,presets:[['교과서 예',[10,6,4,2,3,1,7]],['새 리스트',[8,3,5,1,9,2]],['정렬된 리스트',[1,2,3,4,5]],['역순 리스트',[5,4,3,2,1]],['거의 정렬된 리스트',[1,2,4,3,5,6,7]]]});
soSim('simQuick','quick',{rec:'quickRec',predict:false,presets:[['교과서 예',[4,6,10,2,3,1,7]],['새 리스트',[5,8,2,9,1,7,3]],['정렬된 리스트',[1,2,3,4,5,6,7]],['가운데 값이 먼저',[4,2,6,1,3,5,7]]]});

/* 01 키를 바꿔 정렬하기 */
(function(){
  const F=['대출 번호','이름','책 제목','반납 예정일'];
  const R=[['L-0104','윤가온','별을 세는 밤','11-28'],['L-0101','서다인','바다로 간 고래','11-21'],['L-0105','하로운','시간 여행 안내서','11-19'],['L-0102','민채율','작은 정원','12-02'],['L-0103','고은찬','로봇과 나','11-25']];
  const B=$('keyTable'); let key=-1, asc=true;
  const cmpv=(x,y,c)=>c===3?(()=>{const [m1,d1]=x.split('-').map(Number),[m2,d2]=y.split('-').map(Number); return m1-m2||d1-d2;})():x.localeCompare(y,'ko');
  function draw(){
    const rows=R.slice(); if(key>=0) rows.sort((p,q)=>(asc?1:-1)*cmpv(p[key],q[key],key));
    B.innerHTML=`<div style="overflow-x:auto"><table class="so-ktbl"><tr>${F.map((f,i)=>`<th><button data-f="${i}" class="${i===key?'on':''}">${f} ${i===key?(asc?'▲':'▼'):'⇅'}</button></th>`).join('')}</tr>${rows.map((r,ri)=>`<tr class="${ri===0?'rec':''}">${r.map((v,i)=>`<td class="${i===key?'key':''}">${v}</td>`).join('')}</tr>`).join('')}</table></div>
      <div class="so-kmsg">${key<0?'지금은 정렬하지 않은 상태예요. 필드 이름을 눌러 보세요.':`키: <b>${F[key]}</b> 필드 · <b>${asc?'오름차순':'내림차순'}</b> 정렬 <span class="muted">(첫 번째 줄처럼 가로 한 줄이 레코드, 세로 한 칸 묶음이 필드예요)</span>`}</div>`;
    B.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{const f=+b.dataset.f; if(f===key) asc=!asc; else {key=f; asc=true;} draw();});
  }
  draw();
})();

/* 01 대출자·미납자 목록 맞춰 보기 */
(function(){
  const A=['김하늘','박도윤','이서아','최준호','정민지','강예린','윤지호','한소율'];
  const Bn=['윤지호','강예린','김하늘','한소율','이서아','최준우','박도윤','정민지'];
  const box=$('libLab');
  box.innerHTML=`<div class="so-lib"><div><b>대출자 목록</b><ol id="libA"></ol></div><div><b>미납자 목록</b><ol id="libB"></ol></div>
    <div class="so-libside"><button class="btn sm" id="libRaw">① 정렬하지 않고 확인</button><button class="btn sm" id="libSort">② 정렬한 뒤 확인</button><button class="btn sm ghost" id="libReset">처음 목록으로</button>
    <div class="so-libcnt"><div>① 비교 <b id="libC1">–</b>번</div><div>② 비교 <b id="libC2">–</b>번</div></div><div class="so-libmsg" id="libMsg"></div></div></div>`;
  let busy=false;
  const show=(a,b,hA=-1,hB=-1,bad=[])=>{$('libA').innerHTML=a.map((x,i)=>`<li class="${i===hA?'h':''} ${bad.includes('A'+i)?'x':''}">${x}</li>`).join(''); $('libB').innerHTML=b.map((x,i)=>`<li class="${i===hB?'h':''} ${bad.includes('B'+i)?'x':''}">${x}</li>`).join('');};
  const setRec=()=>{const c1=$('libC1').textContent, c2=$('libC2').textContent; MEMO.libRec=`정렬하지 않고 확인: 비교 ${c1}번 / 정렬한 뒤 확인: 비교 ${c2}번`; soSave();};
  $('libRaw').onclick=async()=>{
    if(busy) return; busy=true; let c=0; show(A,Bn); let miss='';
    for(let i=0;i<A.length;i++){ let found=false;
      for(let j=0;j<Bn.length;j++){ c++; $('libC1').textContent=c; show(A,Bn,i,j); await sleep(110); if(Bn[j]===A[i]){found=true; break;} }
      if(!found){miss=A[i];}
    }
    show(A,Bn,-1,-1,miss?['A'+A.indexOf(miss)]:[]); $('libMsg').innerHTML=`대출자 이름마다 미납자 목록을 처음부터 훑었어요. <b>${miss}</b>은(는) 미납자 목록에 없어요.`; busy=false; setRec();
  };
  $('libSort').onclick=async()=>{
    if(busy) return; busy=true; const a=A.slice().sort((x,y)=>x.localeCompare(y,'ko')), b=Bn.slice().sort((x,y)=>x.localeCompare(y,'ko'));
    $('libMsg').textContent='두 목록을 가나다순으로 정렬했어요. 이제 같은 위치끼리 비교해요.'; show(a,b); await sleep(700); let c=0, bad=-1;
    for(let i=0;i<a.length;i++){ c++; $('libC2').textContent=c; show(a,b,i,i); await sleep(260); if(a[i]!==b[i]){bad=i; break;} }
    show(a,b,-1,-1,bad>=0?['A'+bad,'B'+bad]:[]);
    $('libMsg').innerHTML=bad>=0?`${bad+1}번째 자리에서 <b>${a[bad]}</b>과(와) <b>${b[bad]}</b>이(가) 달라 바로 찾았어요. <span class="muted">정렬하는 데에도 연산이 필요하지만, 한 번 정렬해 두면 확인이 훨씬 빨라져요.</span>`:'두 목록이 같아요.'; busy=false; setRec();
  };
  $('libReset').onclick=()=>{if(!busy){show(A,Bn); $('libMsg').textContent='';}};
  show(A,Bn);
})();

/* 05 세 정렬 한꺼번에 비교 */
(function(){
  const B=$('raceSort');
  B.innerHTML=`<div class="row"><b>리스트 종류</b><span class="so-seg" data-g="kind"><button class="on" data-v="rand">무작위</button><button data-v="sorted">정렬된</button><button data-v="rev">역순</button><button data-v="near">거의 정렬된</button></span>
    <b style="margin-left:8px">크기 n</b><span class="so-seg" data-g="n"><button class="on" data-v="8">8</button><button data-v="16">16</button><button data-v="32">32</button></span><button class="btn sm" id="rsGo">비교하기</button></div>
    <div class="so-rlist" id="rsList"></div><div id="rsOut"></div><div class="so-recs" id="rsRecs"></div>`;
  const st={kind:'rand',n:8};
  B.querySelectorAll('.so-seg').forEach(g=>g.querySelectorAll('button').forEach(b=>b.onclick=()=>{g.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b)); st[g.dataset.g]=g.dataset.g==='n'?+b.dataset.v:b.dataset.v;}));
  const NM={rand:'무작위',sorted:'정렬된',rev:'역순',near:'거의 정렬된'};
  function make(){const n=st.n, a=[...Array(n)].map((_,i)=>i+1);
    if(st.kind==='rand'){for(let i=n-1;i>0;i--){const j=Math.random()*(i+1)|0; [a[i],a[j]]=[a[j],a[i]];} return a;}
    if(st.kind==='rev') return a.reverse();
    if(st.kind==='near'){for(let t=0;t<Math.max(1,n/8);t++){const i=1+(Math.random()*(n-2)|0); [a[i],a[i+1]]=[a[i+1],a[i]];} return a;}
    return a;}
  function recs(){$('rsRecs').innerHTML=MEMO.cmpRec?`<b>내 기록</b><ul>${MEMO.cmpRec.split(' / ').map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'';}
  $('rsGo').onclick=()=>{
    const a=make(), R=[['버블 정렬','bubble','#1f9d74'],['삽입 정렬','insert','#b8860b'],['퀵 정렬','quick','#d64535']].map(([nm,k,c])=>({nm,c,...soCount(k,a)}));
    const mx=Math.max(...R.map(r=>Math.max(r.cmp,r.swp)),1);
    $('rsList').innerHTML=`<b>${NM[st.kind]} 리스트 (n = ${st.n})</b> <span class="mono">${soList(a)}</span>`;
    $('rsOut').innerHTML=`<div class="so-rbars">${R.map(r=>`<div class="r"><b style="color:${r.c}">${r.nm}</b><div><div class="ln"><i style="width:${r.cmp/mx*100}%;background:${r.c}"></i><span>비교 ${r.cmp}</span></div><div class="ln sw"><i style="width:${r.swp/mx*100}%;background:${r.c}"></i><span>교환 ${r.swp}</span></div></div></div>`).join('')}</div>`;
    const item=`${NM[st.kind]} n=${st.n}: 버블 ${R[0].cmp}/${R[0].swp}, 삽입 ${R[1].cmp}/${R[1].swp}, 퀵 ${R[2].cmp}/${R[2].swp} (비교/교환)`;
    const list=(MEMO.cmpRec||'').split(' / ').filter(Boolean); list.push(item); MEMO.cmpRec=list.slice(-5).join(' / '); soSave(); recs();
  };
  recs();
})();

/* 05 개념 정리 빈칸 */
document.querySelectorAll('.so-blank').forEach(b=>b.onclick=()=>{const on=!b.classList.contains('on'); b.textContent=on?b.dataset.a:'?'; b.classList.toggle('on',on);});

/* 06 마무리 */
const MEMOLIST=[['planSort','처음 생각 · 두 목록이 같은지 확인하는 방법'],['libRec','대출자·미납자 목록 비교 횟수'],['libWhy','정렬하면 확인이 쉬워지는 까닭'],['bubbleRec','버블 정렬 기록'],['insertRec','삽입 정렬 기록'],['caseCmp','정렬된·역순 리스트 비교'],['quickRec','퀵 정렬 기록'],['quickPivot','피벗의 위치와 성능'],['handTrace','손으로 쓴 과정과 비교'],['cmpRec','세 정렬 한꺼번에 비교 기록'],['pickSort','상황에 맞는 정렬 고르기'],['ck1','성취도 · 정렬 알고리즘 비교'],['keyQ','도입 질문에 대한 내 답'],['newLearn','새롭게 알게 된 점']];
onShow[6]=()=>{const p=(MEMO.planSort||'').trim(); $('prevPlan').innerHTML=`<b>처음 생각</b> ${p?esc(p):'<span class="muted">(시작 화면에 아직 안 씀)</span>'}`; memoSummary('msum',MEMOLIST);};
