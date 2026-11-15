
/* 01 장치와 역할 짝짓기 */
(function(){
  const P=[
    ['🔌','랜 카드','외부 네트워크와 제일 먼저 접속하고, 본체의 확장 슬롯에 꽂아 써요.'],
    ['🔀','스위치','소규모 네트워크에서 여러 기기를 서로 연결하고 패킷을 효율적으로 전송해요.'],
    ['🌐','라우터','패킷이 목적지까지 갈 수 있는 길을 검사해 가장 적절한 길을 정해요.'],
    ['🧠','중앙 처리 장치','프로그램을 실행(연산)하고 각 장치를 제어하는 두뇌예요.'],
    ['💾','기억 장치','프로그램과 데이터를 저장해 둬요.'],
    ['⌨️','입출력 장치','처리할 데이터를 입력하고 처리 결과를 출력해요.'],
  ];
  const K=['#2f6fd0','#1f9d74','#e0702b','#d64535','#9b4fc4','#8a94a3'];
  const B=$('matchGame');
  function start(){
    const R=shuffle(P.map((_,i)=>i)); let sel=-1, done=new Set(), miss=0;
    B.innerHTML=`<div class="ns-match"><div class="l">${P.map((p,i)=>`<button data-l="${i}"><span>${p[0]}</span>${p[1]}</button>`).join('')}</div><div class="r">${R.map(i=>`<button data-r="${i}">${P[i][2]}</button>`).join('')}</div></div><div class="ns-mmsg">장치를 먼저 골라요.</div>`;
    const msg=B.querySelector('.ns-mmsg'), L=[...B.querySelectorAll('[data-l]')], RB=[...B.querySelectorAll('[data-r]')];
    L.forEach(b=>b.onclick=()=>{const i=+b.dataset.l; if(done.has(i)) return; sel=i; L.forEach(x=>x.classList.toggle('sel',x===b)); msg.innerHTML=`<b>${P[i][1]}</b>의 역할을 오른쪽에서 골라요.`;});
    RB.forEach(b=>b.onclick=()=>{const j=+b.dataset.r; if(done.has(j)) return; if(sel<0){msg.textContent='왼쪽에서 장치를 먼저 골라요.';return;}
      if(j===sel){done.add(j); const n=done.size; [L[sel],b].forEach(x=>{x.classList.remove('sel'); x.classList.add('done'); x.style.setProperty('--k',K[sel]); x.dataset.n=n;});
        msg.innerHTML=`<span class="ok">맞아요!</span> <b>${P[sel][1]}</b> — ${P[sel][2]}`; sel=-1;
        if(done.size===P.length){msg.innerHTML=`🎉 ${P.length}쌍을 모두 짝지었어요. 틀린 횟수 <b>${miss}</b>번. 네트워크 장치 셋(랜 카드·스위치·라우터)이 하는 일을 다시 말해 봐요. <button class="btn ghost sm">처음부터 다시</button>`; msg.querySelector('button').onclick=start;}}
      else{miss++; b.classList.remove('ng'); void b.offsetWidth; b.classList.add('ng'); msg.innerHTML=`<span class="ng">아쉬워요.</span> <b>${P[sel][1]}</b>의 역할이 아니에요. 다시 골라 봐요.`;}});
  }
  start();
})();

/* 02 어떤 방법으로 공유할까? */
sorter('wayGame',{
  cats:[{n:'📁 공유 폴더',k:'#2f6fd0'},{n:'📲 블루투스·에어드랍',k:'#1f9d74'},{n:'☁️ 클라우드',k:'#e0702b'}],
  items:[
    {t:'같은 컴퓨터실의 컴퓨터들이 네트워크로 연결되어 있고, 모둠원이 한 폴더에 사진을 모으려고 해요.',c:0,ic:'🏫',w:'같은 네트워크의 컴퓨터끼리는 공유 폴더를 자기 컴퓨터의 폴더처럼 볼 수 있어요.'},
    {t:'옆자리 친구와 나는 둘 다 아이폰을 써요. 방금 찍은 사진 한 장을 보내려고 해요.',c:1,ic:'📸',w:'운영체제가 같고 가까이 있으니 에어드랍이 간단해요.'},
    {t:'옆자리 친구와 나는 둘 다 안드로이드 휴대폰을 써요. 파일 하나를 바로 보내려고 해요.',c:1,ic:'📄',w:'‘공유 - 블루투스’로 기기를 고르고, 친구가 수락하면 전송돼요.'},
    {t:'나는 안드로이드, 다른 반이 된 친구는 아이폰을 써요. 체험 학습 사진을 나누려고 해요.',c:2,ic:'🔄',w:'운영체제가 다르고 멀리 있으니 클라우드가 알맞아요.'},
    {t:'외국에 사는 친구에게 내가 그린 그림 파일을 보내려고 해요.',c:2,ic:'🌏',w:'거리에 상관없이 인터넷으로 열 수 있는 클라우드를 써요.'},
    {t:'학교에서 만든 발표 자료를 집에서도, 휴대폰에서도 열어 보고 싶어요.',c:2,ic:'🏠',w:'클라우드는 언제 어디서든 이용할 수 있는 환경이에요.'},
  ],
  end:'<b>생각해 보기</b> 세 방법을 고른 기준은 무엇이었나요? 거리, 운영체제, 같은 네트워크인지를 떠올려 봐요.'
});

/* 03 이렇게 공유해도 될까? */
sorter('careGame',{
  cats:[{n:'✅ 괜찮아요',k:'#1f9d74'},{n:'✋ 멈추고 다시 생각해요',k:'#d64535'}],
  items:[
    {t:'모둠 과제 폴더를 모둠원에게는 편집, 선생님께는 보기만 되도록 공유했어요.',c:0,ic:'🔑',w:'④ 접근 권한을 사람마다 다르게 주었어요.'},
    {t:'친구들의 이름과 전화번호가 적힌 명단 파일을 반 전체 사진 폴더에 함께 넣었어요.',c:1,ic:'🪪',w:'③ 개인 정보가 여러 사람에게 퍼질 수 있어요.'},
    {t:'인터넷에서 받은 출처를 모르는 프로그램 파일을 검사하지 않고 반 대화방에 올렸어요.',c:1,ic:'🦠',w:'② 공유하기 전에 악성 프로그램이 들어 있는지 검사해야 해요.'},
    {t:'친구가 보고 싶다고 해서 영화 파일을 통째로 공유 폴더에 올렸어요.',c:1,ic:'🎬',w:'⑤ 저작권 문제가 생길 수 있으면 다른 사람에게 보내지 않아요.'},
    {t:'친구 얼굴이 크게 나온 사진을 친구에게 먼저 물어보고, 허락받은 뒤 공유했어요.',c:0,ic:'🙋',w:'③ 사진 속 사람의 개인 정보와 초상도 존중했어요.'},
    {t:'과제에 필요한 사진 한 장을 보내려다 사진첩 폴더 전체를 공유했어요.',c:1,ic:'🗂️',w:'① 꼭 필요한 데이터만 공유해요.'},
    {t:'내가 그린 그림 파일을 검사해 문제가 없는 것을 확인한 뒤 친구에게 보냈어요.',c:0,ic:'🎨',w:'② 직접 만든 파일이고, 보내기 전에 검사도 했어요.'},
    {t:'반 공유 폴더를 링크만 있으면 누구나 고칠 수 있게 열어 두었어요.',c:1,ic:'🔓',w:'④ 필요 이상으로 공유되고, 누구나 내용을 바꿀 수 있어요.'},
  ],
  end:'<b>정리</b> 보내기 전에 ① 꼭 필요한가 ② 안전한가 ③ 개인 정보는 없나 ④ 누구까지 볼 수 있나 ⑤ 보내도 되는 것인가를 확인해요.'
});

/* 04 클라우드 실습 */
chips('cloudSteps','cloudDone',['① 선생님이 알려 주는 구글 아이디로 로그인한다','② 오른쪽 위 메뉴에서 드라이브를 연다','③ 내 드라이브에 연습용 새 폴더를 만든다','④ 새 폴더에서 마우스 오른쪽 버튼을 눌러 공유를 설정한다','⑤ 공유 링크를 만들어 복사한다','⑥ 선생님이 정한 곳에 공유 링크를 안내한다','⑦ 확인이 끝나면 폴더 공유를 해제한다'],true);
chips('cloudPerm','cloudPerm',['보기만 가능','댓글까지 가능','편집까지 가능']);
chips('cloudWho','cloudWho',['지정한 사람만','우리 학교 계정 사용자','링크가 있는 사람 누구나']);

/* 04 패킷 경로 찾기 */
(function(){
  const NODE={A:[60,175,'서울'],B:[190,55],C:[215,150],D:[165,250],E:[305,252],F:[360,140,'보스턴']};
  const EDGE=[['A','B',2],['B','C',1],['C','F',2],['A','D',3],['D','C',1],['C','E',4],['D','E',2],['E','F',1]];
  const EX=[['B','A'],['C','B'],['C','E'],['E','C'],['E','D'],['E','F']];
  const L='ABCDEF', w=(a,b)=>{const e=EDGE.find(e=>(e[0]===a&&e[1]===b)||(e[0]===b&&e[1]===a)); return e?e[2]:null;};
  const B=$('routeSim'); let path=['A'], found=[], used=new Set();
  B.innerHTML=`<div class="ns-route"><div class="map"><svg viewBox="0 0 420 300" role="img" aria-label="도시 A부터 F까지의 네트워크 경로 그림"></svg></div>
    <div class="side"><div class="ns-now"></div><div class="row"><button class="btn ghost sm" data-k="u">한 칸 되돌리기</button><button class="btn ghost sm" data-k="r">A에서 다시</button><button class="btn ghost sm" data-k="c">기록 지우기</button></div>
    <div style="overflow-x:auto"><table class="ns-mx"><tr><th class="hd">출발↓ 도착→</th>${[...L].map(c=>`<th>${c}</th>`).join('')}</tr>${[...L].map(r=>`<tr><th>${r}</th>${[...L].map(c=>`<td data-c="${r}${c}" class="${r===c?'x':''}"></td>`).join('')}</tr>`).join('')}</table></div>
    <small class="muted">회색 숫자는 교과서 표의 예시, 파란 숫자는 내가 지나간 구간이에요(오가는 두 방향 칸을 함께 채워요).</small>
    <div class="ns-found"></div></div></div>`;
  const svg=B.querySelector('svg');
  EDGE.forEach(([a,b,t])=>{const [x1,y1]=NODE[a],[x2,y2]=NODE[b]; el('line',{x1,y1,x2,y2,class:'e','data-e':a+b},svg);
    const mx=(x1+x2)/2, my=(y1+y2)/2; el('circle',{cx:mx,cy:my,r:11,class:'wb'},svg); el('text',{x:mx,y:my+5,class:'wt'},svg,t);});
  for(const k in NODE){const [x,y,nm]=NODE[k]; const g=el('g',{class:'n','data-n':k,tabindex:0,role:'button','aria-label':`도시 ${k}`},svg);
    el('circle',{cx:x,cy:y,r:22},g); el('text',{x,y:y+7,class:'l'},g,k); if(nm) el('text',{x,y:y+40,class:'nm'},g,nm);
    const f=()=>step(k); g.addEventListener('click',f); g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();f();}});}
  EX.forEach(([r,c])=>{const td=B.querySelector(`[data-c="${r}${c}"]`); td.textContent=w(r,c); td.classList.add('ex');});
  const sum=p=>p.slice(1).reduce((s,c,i)=>s+w(p[i],c),0), str=p=>p.join('→');
  function step(k){const last=path[path.length-1];
    if(last==='F'){say('F에 도착했어요. <b>A에서 다시</b>를 눌러 다른 경로를 찾아봐요.');return;}
    if(path.includes(k)){say('이미 지나온 도시예요. 같은 도시를 두 번 지나지 않아요.');return;}
    if(w(last,k)==null){say(`${last}와 ${k}는 바로 이어져 있지 않아요. ${last}와 선으로 이어진 도시를 골라요.`);return;}
    path.push(k); used.add(last+k); used.add(k+last); draw();}
  function say(h){B.querySelector('.ns-now').innerHTML=`<b>지금 경로</b> ${str(path)} · 시간 합 <b>${sum(path)}</b><br>${h}`;}
  function draw(){const last=path[path.length-1]; store.set(MK+'|route',path);
    svg.querySelectorAll('line.e').forEach(l=>{const a=l.dataset.e[0],b=l.dataset.e[1]; const on=path.some((c,i)=>i&&((path[i-1]===a&&c===b)||(path[i-1]===b&&c===a))); l.classList.toggle('on',on);});
    svg.querySelectorAll('g.n').forEach(g=>{const k=g.dataset.n; g.classList.toggle('in',path.includes(k)); g.classList.toggle('cur',k===last); g.classList.toggle('can',last!=='F'&&!path.includes(k)&&w(last,k)!=null);});
    used.forEach(rc=>{const td=B.querySelector(`[data-c="${rc}"]`); td.textContent=w(rc[0],rc[1]); td.classList.remove('ex'); td.classList.add('me');});
    if(last==='F'){const s=str(path); if(!found.some(f=>f[0]===s)){found.push([s,sum(path)]); MEMO.routeTried=found.map(f=>`${f[0]}(${f[1]})`).join(' / '); store.set(MK,MEMO);}
      say(`🎉 F 도착! 이 경로에서 걸린 시간을 모두 더하면 <b>${sum(path)}</b>.`);}
    else if(![...L].some(k=>!path.includes(k)&&w(last,k)!=null)) say('더 갈 수 있는 도시가 없어요. <b>한 칸 되돌리기</b>를 눌러요.');
    else say('점선 테두리 도시 중 하나를 눌러 다음으로 가요.');
    const best=found.slice().sort((a,b)=>a[1]-b[1])[0];
    B.querySelector('.ns-found').innerHTML=found.length?`<b>내가 찾은 경로 (${found.length}개)</b><ul>${found.map(f=>`<li class="mono">${f[0]} · 합 ${f[1]}</li>`).join('')}</ul>${found.length>=2?`지금까지 찾은 것 중 가장 빠른 경로는 <b class="mono">${best[0]}</b> (합 ${best[1]}). 다른 경로는 더 없을까요?`:'다른 경로도 찾아 비교해 봐요.'}`:'';
  }
  B.querySelector('[data-k=u]').onclick=()=>{if(path.length>1){path.pop(); draw();}};
  B.querySelector('[data-k=r]').onclick=()=>{path=['A']; draw();};
  B.querySelector('[data-k=c]').onclick=()=>{found=[]; used=new Set(); path=['A']; delete MEMO.routeTried; store.set(MK,MEMO);
    B.querySelectorAll('.ns-mx td.me').forEach(td=>{td.classList.remove('me'); td.textContent='';});
    EX.forEach(([r,c])=>{const td=B.querySelector(`[data-c="${r}${c}"]`); td.textContent=w(r,c); td.classList.add('ex');}); draw();};
  if(MEMO.routeTried) MEMO.routeTried.split(' / ').forEach(x=>{const m=x.match(/^(.*)\((\d+)\)$/); if(!m) return; found.push([m[1],+m[2]]);
    const q=m[1].split('→'); q.slice(1).forEach((c,i)=>{if(w(q[i],c)!=null){used.add(q[i]+c); used.add(c+q[i]);}});});
  const sp=store.get(MK+'|route',null);
  if(Array.isArray(sp)&&sp[0]==='A'&&sp.every((c,i)=>!i||(w(sp[i-1],c)!=null&&sp.indexOf(c)===i))){path=sp; sp.slice(1).forEach((c,i)=>{used.add(sp[i]+c); used.add(c+sp[i]);});}
  draw();
})();

/* 05 네트워크 정리 */
chips('myParts','myPartsPick',['랜 카드','스위치','라우터(공유기)','AP','UTP 케이블','광섬유 케이블','와이파이','블루투스'],true);
(function(){
  const S={'①':'사진이 많고 친구가 멀리 있으니, 어떤 방법으로 보낼지 정한다.','②':'동네를 돌며 찍은 사진 가운데 보낼 사진을 골라 한 폴더에 모은다.','③':'공유 링크를 친구에게 보내고, 친구가 잘 열었는지 답장을 받는다.','④':'메시지로 물어 친구가 아이패드를 쓴다는 것을 확인한다.','⑤':'윈도와 아이패드에서 모두 열 수 있는 클라우드에 공유 폴더를 만들고 사진을 올린다.'};
  const B=$('orderGame'); let seq=['②'];
  const saved=(MEMO.shareOrder||'').split('→'); if(saved.length>1&&saved[0]==='②') seq=saved.filter(x=>S[x]);
  function check(){const at=x=>seq.indexOf(x), h=[];
    if(at('⑤')<at('④')) h.push('「윈도와 아이패드에서 모두 열 수 있는」 폴더를 만들려면, 친구가 쓰는 기기(④)를 먼저 알아야 하지 않을까요?');
    if(at('⑤')<at('①')) h.push('보낼 방법을 정하기(①) 전에 클라우드 폴더(⑤)부터 만들었어요. 방법을 먼저 정해야 하지 않을까요?');
    if(at('③')<at('⑤')) h.push('아직 만들지 않은 폴더의 링크를 보낼 수 있을까요? ③과 ⑤의 순서를 살펴봐요.');
    return h;}
  function draw(){
    const left=Object.keys(S).filter(k=>!seq.includes(k));
    B.innerHTML=`<div class="ns-seq">${seq.map((k,i)=>`<span class="${i?'':'fix'}">${k}</span>`).join('<i>→</i>')}${left.map(()=>'<i>→</i><span class="emp">?</span>').join('')}</div>
      <div class="ns-opts">${Object.keys(S).map(k=>`<button data-k="${k}" ${seq.includes(k)?'disabled':''}><b>${k}</b> ${S[k]}</button>`).join('')}</div>
      <div class="row" style="margin-top:8px"><button class="btn ghost sm" data-u="1">한 칸 지우기</button><button class="btn ghost sm" data-r="1">처음부터</button></div><div class="ns-ofb"></div>`;
    B.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{seq.push(b.dataset.k); save(); draw();});
    B.querySelector('[data-u]').onclick=()=>{if(seq.length>1){seq.pop(); save(); draw();}};
    B.querySelector('[data-r]').onclick=()=>{seq=['②']; save(); draw();};
    const fb=B.querySelector('.ns-ofb');
    if(!left.length){const h=check(); fb.innerHTML=h.length?`<span class="ng">다시 생각해 봐요.</span><ul>${h.map(x=>`<li>${x}</li>`).join('')}</ul>`:'<span class="ok">앞뒤가 맞는 순서예요.</span> 각 단계가 왜 그 자리에 와야 하는지 짝에게 설명해 봐요.';}
    else fb.innerHTML='<span class="muted">남은 단계를 순서대로 눌러요.</span>';
  }
  function save(){MEMO.shareOrder=seq.join('→'); store.set(MK,MEMO);}
  draw();
})();
document.querySelectorAll('.ns-blank').forEach(b=>b.onclick=()=>{const on=!b.classList.contains('on'); b.textContent=on?b.dataset.a:'?'; b.classList.toggle('on',on);});
chips('selfCheck','selfCheckPick',['컴퓨팅 시스템에서 네트워크 구성 요소를 찾을 수 있다','컴퓨팅 시스템을 활용하여 공유 폴더를 만들 수 있다','데이터를 공유할 때의 주의할 점을 서술할 수 있다','컴퓨팅 시스템 간 네트워크 환경을 구성할 수 있다'],true);
vote('extraVote','extraPick',[['보충','내 컴퓨팅 시스템의 구성 요소 적기'],['심화','두 집의 네트워크 공유 환경 구성하기']],i=>{$('extraBasic').classList.toggle('on',i===0); $('extraDeep').classList.toggle('on',i===1);});

/* 06 마무리 */
const MEMOLIST=[['shareNow','최근 친구와 파일을 주고받은 방법'],['osDiff','운영체제가 다를 때 쓰는 공유 방법'],['cloudDone','클라우드 실습 · 마친 단계'],['cloudPerm','친구들에게 준 권한'],['cloudWho','링크로 열 수 있는 사람'],['cloudWhy','권한을 그렇게 정한 이유'],['routeTried','내가 찾은 A→F 경로'],['fastRoute','가장 빠르다고 판단한 경로와 근거'],['myPartsPick','내가 찾은 네트워크 구성 요소'],['myPartsWhere','어디에서 무엇을 찾았나'],['shareOrder','멀리 사는 친구와 사진 앨범을 공유하는 순서'],['shareCare','멀리 있는 친구와 공유할 때 주의할 점'],['selfCheckPick','학업 성취도 점검'],['extraPick','고른 선택 활동'],['extraBasic','보충 · 내 컴퓨팅 시스템의 구성 요소'],['extraJian','심화 · 지안이네 집 공유 환경'],['extraYeonwoo','심화 · 연우네 집 공유 환경'],['keyQ','핵심 질문에 대한 내 답'],['newLearn','새롭게 알게 된 점']];
onShow[6]=()=>memoSummary('msum',MEMOLIST);
