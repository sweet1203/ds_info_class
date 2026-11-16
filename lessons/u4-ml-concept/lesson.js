/* 공통 */
function mcSave(){store.set(MK,MEMO);}

/* 성취도 평가 */
chips('ck1','ck1',['전통적인 프로그래밍과 기계학습의 차이를 설명할 수 있다'],true);

/* 01 기계처럼 규칙 찾기 · 곤충일까, 거미일까? */
(function(){
  const B=$('bugLab');
  const ATT=[['leg','다리의 수'],['ant','더듬이'],['seg','몸의 마디'],['col','몸 색깔']];
  const DATA=[
    {n:'개미',ic:'🐜',lab:'곤충',f:{leg:'6개',ant:'있음',seg:'3마디',col:'검은색'}},
    {n:'나비',ic:'🦋',lab:'곤충',f:{leg:'6개',ant:'있음',seg:'3마디',col:'노란색'}},
    {n:'깡충거미',ic:'🕷️',lab:'거미',f:{leg:'8개',ant:'없음',seg:'2마디',col:'검은색'}},
    {n:'무당거미',ic:'🕸️',lab:'거미',f:{leg:'8개',ant:'없음',seg:'2마디',col:'노란색'}}];
  const NEW=[
    {n:'메뚜기',ic:'🦗',lab:'곤충',f:{leg:'6개',ant:'있음',seg:'3마디',col:'초록색'}},
    {n:'늑대거미',ic:'🕷️',lab:'거미',f:{leg:'8개',ant:'없음',seg:'2마디',col:'갈색'}}];
  const tried={}; const pred={};
  const splits=k=>{const a=new Set(DATA.filter(d=>d.lab==='곤충').map(d=>d.f[k])), b=DATA.filter(d=>d.lab==='거미').map(d=>d.f[k]); return b.every(v=>!a.has(v));};
  B.innerHTML=`<div style="overflow-x:auto"><table class="mc-tbl" id="bugTbl"></table></div>
    <div class="mc-fb" id="bugFb">속성 이름을 눌러 확인해요.</div>
    <h4 style="margin:14px 0 6px">🔮 새로운 데이터 예측하기 <span class="muted" style="font-weight:400;font-size:.85rem">레이블이 없는 새 데이터예요. 찾은 규칙으로 예측해요.</span></h4>
    <div class="mc-new" id="bugNew"></div>`;
  function table(){
    let h=`<tr><th>속성 ＼ 데이터</th>${DATA.map(d=>`<th><span class="mc-ic">${d.ic}</span>${d.n}</th>`).join('')}</tr>`;
    h+=ATT.map(([k,nm])=>`<tr class="${tried[k]?(splits(k)?'good':'bad'):''}"><th><button class="mc-att" data-k="${k}">${nm}</button></th>${DATA.map(d=>`<td>${d.f[k]}</td>`).join('')}</tr>`).join('');
    h+=`<tr class="lab"><th>레이블(정답)</th>${DATA.map(d=>`<td><span class="mc-lab ${d.lab==='곤충'?'a':'b'}">${d.lab}</span></td>`).join('')}</tr>`;
    $('bugTbl').innerHTML=h;
    $('bugTbl').querySelectorAll('.mc-att').forEach(b=>b.onclick=()=>{const k=b.dataset.k; tried[k]=1; table();
      const nm=ATT.find(a=>a[0]===k)[1];
      $('bugFb').innerHTML=splits(k)?`<span class="ok">✔ 「${nm}」</span>은(는) 곤충과 거미를 깔끔하게 갈라요. 곤충끼리 값이 같고, 거미와는 값이 달라요.`:`<span class="ng">✗ 「${nm}」</span>은(는) 같은 값이 곤충과 거미에 모두 있어서 둘을 가를 수 없어요. 규칙에 쓰기 어려운 속성이에요.`;
      const n=ATT.filter(a=>tried[a[0]]).length; if(n===ATT.length) $('bugFb').innerHTML+=' <b>네 속성을 모두 확인했어요.</b> 가를 수 있는 속성으로 규칙을 정리해 아래에 적어 봐요.';});
  }
  function news(){
    $('bugNew').innerHTML=NEW.map((d,i)=>`<div class="mc-nc"><div class="t"><span class="mc-ic">${d.ic}</span><b>새로운 데이터 ${i+1}</b></div>
      <ul>${ATT.map(([k,nm])=>`<li>${nm}: ${d.f[k]}</li>`).join('')}</ul>
      <div class="row">${['곤충','거미'].map(l=>`<button class="btn sm ${pred[i]===l?'':'ghost'}" data-i="${i}" data-l="${l}">${l}</button>`).join('')}</div>
      <div class="fb">${pred[i]?(pred[i]===d.lab?`<span class="ok">맞아요!</span> 정답은 <b>${d.n}</b>(${d.lab})예요.`:`<span class="ng">다시 생각해 봐요.</span> 가를 수 있는 속성만 보고 판단해요.`):''}</div></div>`).join('');
    $('bugNew').querySelectorAll('button').forEach(b=>b.onclick=()=>{const i=+b.dataset.i; pred[i]=b.dataset.l; news();
      if(NEW.every((d,j)=>pred[j])){MEMO.bugPred=NEW.map((d,j)=>`새로운 데이터 ${j+1}(${d.n}) → ${pred[j]}로 예측`+(pred[j]===d.lab?'(맞음)':'(틀림)')).join(' / '); mcSave();}});
  }
  table(); news();
})();

/* 02 내가 규칙을 만드는 스팸 필터 */
(function(){
  const B=$('spamLab');
  const MAIL=[
    {t:'[광고] 축하합니다! 경품 당첨 안내',s:1},
    {t:'무료 쿠폰 지금 바로 받으세요',s:1},
    {t:'동아리 회의 시간이 바뀌었어요',s:0},
    {t:'선착순 이벤트 참여하고 상품 받기',s:1},
    {t:'학교 축제 이벤트 부스 신청 안내',s:0},
    {t:'가족 여행 사진 보낼게',s:0},
    {t:'한정 특가! 90% 할인 마지막 기회',s:1},
    {t:'도서관 책 반납 날짜 알림',s:0},
    {t:'무.료 체험 신청하세요',s:1,nw:1},
    {t:'고객님을 위한 깜짝 혜택 도착',s:1,nw:1},
    {t:'FREE 기프티콘 증정',s:1,nw:1},
    {t:'무료 급식 신청서 제출 안내',s:0,nw:1}];
  let round=1, words=[];
  B.innerHTML=`<div class="mc-in"><label for="spamRule"><b>스팸 단어</b></label><input type="text" id="spamRule" placeholder="예: 당첨, 무료" autocomplete="off" spellcheck="false"><button class="btn sm" id="spamGo">규칙 적용</button><button class="btn sm ghost" id="spamNew" disabled>📬 새 이메일 4통 도착</button></div>
    <div style="overflow-x:auto"><table class="mc-tbl mc-mail" id="spamTbl"></table></div><div class="mc-fb" id="spamFb">단어를 적고 「규칙 적용」을 눌러요.</div>`;
  const has=(t,w)=>w.some(x=>t.toLowerCase().includes(x.toLowerCase()));
  function draw(){
    const list=MAIL.filter(m=>round===2||!m.nw); let ok=0, okOld=0;
    $('spamTbl').innerHTML=`<tr><th>이메일 제목</th><th>내 규칙의 결과</th><th>레이블(실제)</th><th></th></tr>`+list.map(m=>{
      const r=words.length?(has(m.t,words)?1:0):null, right=r===m.s; if(right){ok++; if(!m.nw) okOld++;}
      return `<tr class="${m.nw?'nw':''}"><td class="l">${m.nw?'<span class="mc-newb">새</span> ':''}${esc(m.t)}</td><td>${r==null?'<span class="muted">–</span>':(r?'🚫 스팸':'✅ 정상')}</td><td>${m.s?'스팸':'정상'}</td><td>${r==null?'':(right?'<span class="ok">✔</span>':'<span class="ng">✗</span>')}</td></tr>`;}).join('');
    if(!words.length) return;
    if(round===1) $('spamFb').innerHTML=`규칙 「${esc(words.join(', '))}」로 <b>8통 중 ${ok}통</b>을 맞혔어요. ${ok===8?'이제 「새 이메일 4통 도착」을 눌러 봐요.':'틀린 이메일을 보고 단어를 고쳐 다시 적용해 봐요. 다 맞히지 못해도 「새 이메일 4통 도착」을 눌러도 돼요.'}`;
    else $('spamFb').innerHTML=`규칙 「${esc(words.join(', '))}」로 처음 8통 중 ${okOld}통, 새 이메일까지 <b>12통 중 ${ok}통</b>을 맞혔어요. ${ok<12?'새 이메일에 맞춰 규칙을 다시 고쳐 봐요. 고친 규칙이 처음 이메일을 틀리게 만들지는 않나요?':'모두 맞혔지만, 내일 또 다른 스팸이 오면 어떻게 될까요?'}`;
    MEMO.spamRes=`규칙 「${words.join(', ')}」 · `+(round===1?`8통 중 ${ok}통 맞음`:`처음 8통 중 ${okOld}통, 새 이메일 포함 12통 중 ${ok}통 맞음`); mcSave();
  }
  $('spamGo').onclick=()=>{words=$('spamRule').value.split(/[,，]/).map(s=>s.trim()).filter(Boolean); if(!words.length){$('spamFb').textContent='스팸으로 볼 단어를 한 개 이상 적어요.'; return;} $('spamNew').disabled=false; draw();};
  $('spamRule').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();$('spamGo').click();}};
  $('spamNew').onclick=()=>{round=2; $('spamNew').disabled=true; $('spamNew').textContent='📬 새 이메일 4통 도착함'; draw();};
  draw();
})();

/* 02 스스로 해결하기 · 어떤 방법으로 해결할까? */
sorter('progGame',{
  cats:[{n:'💻 전통적인 프로그래밍',k:'#5b6776'},{n:'🧠 기계학습',k:'#e0702b'}],
  items:[
    {t:'시험 점수 다섯 개의 평균을 알아내요.',c:0,ic:'🧮',w:'모두 더해 개수로 나누는 분명한 규칙이 있어 사람이 바로 코드로 쓸 수 있어요.'},
    {t:'사진 속 사람이 웃고 있는지 판단해요.',c:1,ic:'😊',w:'웃는 얼굴의 모양은 사람마다 달라 규칙을 직접 쓰기 어려워요. 많은 사진으로 학습하는 편이 알맞아요.'},
    {t:'섭씨온도를 화씨온도로 바꿔요.',c:0,ic:'🌡️',w:'정해진 공식대로 계산하면 되는 문제예요.'},
    {t:'지난 판매 기록으로 다음 주에 빵이 몇 개 팔릴지 구해요.',c:1,ic:'🥐',w:'과거 데이터에서 패턴을 찾아 새로운 결과를 예측하는 문제예요.'},
    {t:'목소리를 듣고 누가 말했는지 알아내요.',c:1,ic:'🎙️',w:'목소리의 특징을 사람이 규칙으로 정리하기 어려워 데이터로 학습해요.'},
    {t:'원의 반지름이 주어지면 넓이를 알려 줘요.',c:0,ic:'⭕',w:'반지름×반지름×원주율이라는 공식이 분명해요.'},
  ],
  end:'<b>생각해 보기</b> 무엇을 기준으로 골랐나요? 「사람이 규칙(공식)을 분명하게 쓸 수 있는가」, 「데이터에서 패턴을 찾아야 하는가」를 떠올려 봐요.'
});

/* 03 세 가지 유형 살펴보기 */
(function(){
  const F=['🌻','🌷','🌻','🌷','🌷','🌻'];
  const lab=f=>f==='🌻'?'해바라기':'튤립';
  const T=[
    {n:'지도학습',ic:'🏷️',k:'#2f6fd0',h:()=>`<p style="margin-top:0"><b>지도학습</b>은 입력 데이터와 그에 맞는 <b>레이블</b>이 있어 입력값과 레이블을 함께 학습하는 방식이에요. 새로운 데이터가 주어지면 그에 대한 예측값을 출력해요. 아래는 지도학습 <b>분류</b>의 예예요.</p>
      <div class="mc-flow"><div class="mc-set">${F.map(f=>`<span class="mc-pic">${f}<em>${lab(f)}</em></span>`).join('')}</div><div class="mc-ar">학습 →</div><div class="mc-model">분류 모델</div><div class="mc-ar">예측 →</div><div class="mc-set one"><span class="mc-pic q">🌻<em>새로운 데이터</em></span><b>→ 해바라기</b></div></div>
      <p class="note">꽃 사진과 이름표(레이블)를 함께 학습해 규칙을 찾고, 학습을 마치면 새 사진을 예측해 분류해요. 활용: 질병 유무 판단, 스팸 메일 분류, 특정일의 날씨 예측</p>`},
    {n:'비지도학습',ic:'🧺',k:'#1f9d74',h:()=>`<p style="margin-top:0"><b>비지도학습</b>은 <b>레이블이 없는</b> 데이터를 이용해 그 데이터의 숨은 의도나 패턴을 찾아내는 방식이에요. 데이터를 비슷한 특성을 갖는 그룹끼리 묶어 데이터의 구조와 특성을 더 잘 파악해요. 아래는 비지도학습 <b>군집화</b>의 예예요.</p>
      <div class="mc-flow"><div class="mc-set">${F.map(f=>`<span class="mc-pic">${f}<em>?</em></span>`).join('')}</div><div class="mc-ar">학습 →</div><div class="mc-model">군집 모델</div><div class="mc-ar">→</div><div class="mc-set two"><span class="mc-grp">군집 1 ${F.filter(f=>f==='🌻').join('')}</span><span class="mc-grp">군집 2 ${F.filter(f=>f==='🌷').join('')}</span></div></div>
      <p class="note">이름표 없이 입력된 사진을 학습해 비슷한 특징을 가진 두 군집으로 묶어요. 모델은 「해바라기」라는 이름은 몰라요. 활용: 고객의 구매 패턴을 분석한 상품 추천, 비슷한 그룹이나 범주를 발견해 새로운 아이디어 얻기</p>`},
    {n:'강화 학습',ic:'🎮',k:'#e0702b',h:()=>`<p style="margin-top:0">지도학습과 비지도학습은 <b>훈련 데이터가 주어진 정적인 환경</b>에서 이루어져요. 반면 <b>강화 학습</b>은 <b>변화되는 환경</b>에서 에이전트가 선택할 수 있는 <b>행동</b>(action) 가운데 가장 큰 <b>보상</b>(reward)을 가져다주는 행동이 무엇인지 학습해요.</p>
      <div class="mc-loop"><span class="a">🤖 에이전트</span><span class="ar">행동 →</span><span class="e">🌍 환경</span><span class="ar">← 보상</span><span class="muted">… 이 과정을 되풀이하며 보상이 큰 행동을 익혀요</span></div>
      <p class="note">선생님이 알려 주는 사이트에서 장애물을 피하는 게임으로 강화 학습을 체험해 볼 수 있어요.</p>`}];
  tabs('typeBtns','typeView',T,c=>`<div class="card" style="margin:0;border-top:6px solid ${c.k}">${c.h()}</div>`);
})();

/* 03 어떤 유형일까? */
sorter('typeGame',{
  cats:[{n:'🏷️ 지도학습',k:'#2f6fd0'},{n:'🧺 비지도학습',k:'#1f9d74'},{n:'🎮 강화 학습',k:'#e0702b'}],
  items:[
    {t:'사진마다 ‘정상’, ‘불량’이 표시된 부품 사진으로 학습해, 새로 만든 부품 가운데 불량품을 골라내요.',c:0,ic:'🔩',w:'사진마다 정답(레이블)이 붙어 있어 입력과 레이블을 함께 학습해요.'},
    {t:'정답 없이 학생들의 도서 대출 기록만 보고, 독서 취향이 비슷한 학생들을 찾아내요.',c:1,ic:'📚',w:'레이블 없이 비슷한 특성을 가진 그룹으로 묶는 군집화예요.'},
    {t:'로봇 청소기가 여러 번 움직여 보며, 먼지를 많이 치울수록 점수가 올라가는 길을 찾아내요.',c:2,ic:'🧹',w:'행동을 해 보고 받는 보상(점수)이 가장 큰 행동을 학습해요.'},
    {t:'날짜별 자전거 대여 수 기록으로 학습해, 다음 주 토요일의 대여 수를 미리 알아봐요.',c:0,ic:'🚲',w:'과거 기록마다 실제 대여 수(정답)가 있어 이를 함께 학습해 예측해요.'},
    {t:'노래의 빠르기와 악기 구성 같은 특징만으로, 분위기가 비슷한 노래들을 골라내요.',c:1,ic:'🎵',w:'노래에 장르 이름표가 없어도 특징이 비슷한 것끼리 묶어 패턴을 찾아요.'},
    {t:'게임 캐릭터가 장애물에 부딪히면 점수가 깎이고 오래 버티면 점수가 오르는 판을 되풀이하며, 움직이는 법을 알아봐요.',c:2,ic:'🕹️',w:'변화하는 게임 환경에서 보상을 가장 크게 하는 행동을 배워요.'},
  ],
  end:'<b>생각해 보기</b> 「데이터에 정답(레이블)이 붙어 있는가」, 「행동한 뒤 보상을 받는가」로 세 유형을 나눌 수 있어요.'
});

/* 03 개념 정리하기 빈칸 */
document.querySelectorAll('.mc-blank').forEach(b=>b.onclick=()=>{const on=!b.classList.contains('on'); b.textContent=on?b.dataset.a:'?'; b.classList.toggle('on',on);});

/* 04 마무리 */
const MEMOLIST=[['planML','처음 생각 · 기계는 무엇으로 배울까'],['mlRule','내가 찾은 곤충과 거미의 규칙'],['bugPred','새로운 데이터 예측 결과'],['spamRes','내 스팸 규칙의 결과'],['ruleProblem','새 이메일이 왔을 때 생긴 문제'],['progWhy','해결 방법을 고른 까닭'],['ck1','성취도 · 전통적인 프로그래밍과 기계학습'],['typeWhy','기계학습 유형으로 나눈 까닭'],['keyQ','오늘의 질문에 대한 내 답'],['newLearn','새롭게 알게 된 점']];
onShow[4]=()=>{const p=(MEMO.planML||'').trim(); $('prevPlan').innerHTML=`<b>처음 생각</b> ${p?esc(p):'<span class="muted">(시작 화면에 아직 안 씀)</span>'}`; memoSummary('msum',MEMOLIST);};
