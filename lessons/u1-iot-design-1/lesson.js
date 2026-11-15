/* 코드 상자: 줄 사이 빈 글자 마디를 지워 한 줄씩 깔끔하게 */
document.querySelectorAll('pre.code').forEach(p=>[...p.childNodes].forEach(n=>{ if(n.nodeType===3&&!n.textContent.trim()) n.remove(); }));
/* 코드 상자에서 줄 강조 (0부터 센 줄 번호 목록) */
function d1hl(id,rows){ document.querySelectorAll('#'+id+' .l').forEach((l,i)=>l.classList.toggle('on',rows.includes(i))); }
/* 지금 보이는 화면에 있는지 */
const d1vis=id=>{ const e=document.getElementById(id); return !!(e&&e.offsetParent); };

/* 회로 그림: 피코 H(위 줄 핀 40→21, 아래 줄 핀 1→20)와 LED·버튼 */
function d1circuit(withBtn){
  const s=22,x0=60,by=50,yT=by+14,yB=by+90;
  const X=n=>n<=20?x0+(n-1)*s:x0+(40-n)*s, Y=n=>n<=20?yB:yT;
  const used={19:'#e0702b',18:'#33393f'}; if(withBtn){used[20]='#9b4fc4';used[36]='#d64535';}
  const W=(pts,c)=>`<polyline class="wire ${c}" points="${pts.map(p=>p.join(',')).join(' ')}"/>`;
  let g=`<rect x="40" y="${by}" width="458" height="104" rx="8" class="pc-b"/><rect x="22" y="${by+38}" width="26" height="28" rx="3" class="pc-usb"/>`
    +`<text x="269" y="${by+57}" class="pc-nm">Raspberry Pi Pico H</text><text x="16" y="${by+84}" class="cl s">USB</text>`;
  for(let n=1;n<=40;n++){ const u=used[n];
    g+=`<circle cx="${X(n)}" cy="${Y(n)}" r="${u?6.5:4}" class="pc-p${u?' on':''}"${u?` style="fill:${u}"`:''}/>`;
    if(u||[1,20,21,40].includes(n)) g+=`<text x="${X(n)}" y="${n<=20?yB-11:yT+19}" class="pc-n">${n}</text>`; }
  /* LED 줄: GP14(핀 19) → 저항 → LED + / LED − → GND(핀 18) */
  const yc=265, yg=310;
  g+=W([[X(19),yB],[X(19),yc],[476,yc]],'w-14')+W([[520,yc],[552,yc]],'w-14');
  g+=`<rect x="476" y="${yc-7}" width="44" height="14" rx="6" class="res"/><rect x="486" y="${yc-7}" width="4" height="14" class="res-b"/><rect x="496" y="${yc-7}" width="4" height="14" class="res-b"/><rect x="506" y="${yc-7}" width="4" height="14" class="res-b"/>`;
  g+=`<text x="498" y="${yc+22}" class="cl m">저항 220Ω</text>`;
  g+=`<line x1="552" y1="226" x2="552" y2="${yc}" class="leg"/><line x1="568" y1="226" x2="568" y2="255" class="leg"/>`
    +`<path d="M544 221v-14a16 16 0 0 1 32 0v14z" class="led-d"/><rect x="540" y="221" width="40" height="5" rx="2" class="led-d"/>`
    +`<text x="586" y="206" class="cl">LED</text><text x="586" y="222" class="cl s">긴 다리가 +</text><text x="546" y="248" class="cl e">+</text><text x="574" y="248" class="cl">−</text>`;
  g+=W([[568,255],[568,yg],[X(18),yg],[X(18),yB]],'w-gnd');
  g+=`<text x="${X(18)-6}" y="${yg-6}" class="cl e">GND (핀 18)</text><text x="${X(19)+6}" y="${yc-25}" class="cl">GP14 (핀 19)</text>`;
  if(withBtn){
    const yb=175;
    g+=W([[X(20),yB],[X(20),yb],[588,yb]],'w-15')+W([[620,yb],[672,yb],[672,22],[X(36),22],[X(36),yT]],'w-pwr');
    g+=`<rect x="588" y="${yb-16}" width="32" height="32" rx="4" class="btn-b"/><circle cx="604" cy="${yb}" r="9" class="btn-c"/><text x="604" y="${yb-22}" class="cl m">버튼</text>`;
    g+=`<text x="${X(20)+8}" y="${yb-6}" class="cl">GP15 (핀 20)</text><text x="${X(36)+8}" y="16" class="cl">3V3 (핀 36)</text>`;
  }
  return `<svg viewBox="0 0 690 330" role="img" aria-label="피코 H와 ${withBtn?'LED·버튼':'LED'} 연결 그림">${g}</svg>`;
}
$('cirLed').innerHTML=d1circuit(false);
$('cirBtn').innerHTML=d1circuit(true);

/* 01 입력·출력·마이크로컨트롤러 분류 */
sorter('devSort',{
  cats:[{n:'입력 장치',k:'#2f6fd0'},{n:'출력 장치',k:'#e0702b'},{n:'마이크로컨트롤러',k:'#9b4fc4'}],
  items:[
    {t:'인체 감지 센서',ic:'🚶',c:0,w:'사람의 움직임을 감지해 값을 보내요.'},
    {t:'조도 센서',ic:'🌗',c:0,w:'빛의 밝기를 측정해요.'},
    {t:'토양 수분 센서',ic:'🪴',c:0,w:'흙의 수분을 측정해요.'},
    {t:'버튼',ic:'🔘',c:0,w:'누르면 1, 떼면 0을 보내요. 오늘 실습에서 써요.'},
    {t:'LED',ic:'💡',c:1,w:'빛을 내서 전등을 켜고 꺼요.'},
    {t:'모터',ic:'🌀',c:1,w:'속도와 회전 방향을 제어해 선풍기를 돌려요.'},
    {t:'부저',ic:'🔔',c:1,w:'소리를 내서 알려 줘요. 다음 시간에 써 볼 수 있어요.'},
    {t:'라즈베리파이 피코',ic:'🟩',c:2,w:'입출력 장치를 연결해 제어하는 작은 컴퓨터예요.'},
    {t:'ESP32',ic:'🟦',c:2,w:'교과서가 쓰는 마이크로컨트롤러예요. 와이파이와 블루투스가 들어 있어요.'}
  ],
  end:'입력 장치는 <b>값을 받아들이고</b>, 출력 장치는 <b>결과를 내보내요</b>. 마이크로컨트롤러는 그 사이에서 판단하고 제어해요.'
});

/* 체크리스트 · 고르기 */
chips('chkBoard','chkBoardPick',['셸에 >>>가 보였다','코드를 직접 입력했다','온보드 LED가 켜졌다','0으로 바꿔 꺼 봤다'],true);
chips('chkLed','chkLedPick',['LED 다리 방향을 확인했다','회로를 연결했다','1초마다 깜박였다','기다리는 시간을 바꿔 봤다','■ 정지로 멈췄다'],true);
chips('chkBtn','chkBtnPick',['시뮬레이션으로 if·else 줄을 확인했다','1과 0을 바꾼 결과를 예측했다','(실물) 대각선 두 다리로 버튼을 꽂았다','(실물) 누르는 동안 LED가 켜졌다'],true);
chips('fanIn','fanInPick',['인체 감지 센서','조도 센서','온습도 센서','초음파 센서','버튼'],false);
chips('fanOut','fanOutPick',['LED','모터','부저'],false);
chips('selfCheck','selfCheckPick',['문제에 맞는 입력·출력 장치를 고를 수 있다','LED를 극성에 맞게 연결할 수 있다','Thonny로 피코에 코드를 실행할 수 있다','버튼 입력으로 LED를 제어할 수 있다'],true);

/* 03 깜박이기 시뮬레이션: 코드 줄을 따라 LED 켜고 끄기 */
(function(){
  let t=1, pc=0, timer=null, loops=0, on=0;
  const tb=$('blinkT');
  tb.innerHTML=['1','0.5','0.2'].map(v=>`<button class="chip${v==='1'?' on':''}" data-v="${v}">${v}초</button>`).join('');
  tb.querySelectorAll('button').forEach(b=>b.onclick=()=>{ t=+b.dataset.v; tb.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b)); document.querySelectorAll('#codeBlink .d1-t').forEach(i=>i.textContent=b.dataset.v); });
  const msg=[ 'machine 모듈에서 Pin을 준비해요.','time 모듈을 준비해요.','14번 핀을 LED의 출력으로 정해요.',
    'while True: 아래 들여 쓴 줄을 끝없이 반복해요.','LED.value(1) → LED가 <b>켜져요</b>.','', 'LED.value(0) → LED가 <b>꺼져요</b>.','' ];
  function show(){
    d1hl('codeBlink',[pc]);
    if(pc===4) on=1; if(pc===6) on=0; if(pc===3) loops++;
    $('blinkLed').classList.toggle('on',!!on); $('blinkVal').textContent='LED.value = '+on;
    const m=(pc===5||pc===7)?`${t}초 기다려요. 그동안 LED는 ${on?'켜진':'꺼진'} 채로 있어요.`:msg[pc];
    $('blinkMsg').innerHTML=`<b>${pc+1}줄</b> · ${m}${loops?` <span class="muted">(반복 ${loops}번째)</span>`:''}`;
  }
  function next(){ pc = pc<7 ? pc+1 : 3; }
  function tick(){
    if(!d1vis('blinkSim')){ stop(); return; }
    show(); const wait=(pc===5||pc===7)?t*1000:450; next(); timer=setTimeout(tick,wait);
  }
  function stop(){ clearTimeout(timer); timer=null; }
  $('blinkRun').onclick=()=>{ if(timer) return; tick(); };
  $('blinkStep').onclick=()=>{ stop(); show(); next(); };
  $('blinkStop').onclick=()=>{ stop(); pc=0; loops=0; d1hl('codeBlink',[]); $('blinkMsg').innerHTML='■ 정지했어요. 다시 ▶ 실행하면 1줄부터 시작해요. (실제 보드에서는 멈춘 순간의 LED 상태가 남아 있을 수 있어요.)'; };
})();

/* 04 버튼 시뮬레이션: 누르고 있는 동안 if 쪽, 떼면 else 쪽 */
(function(){
  let pressed=0, timer=null;
  const push=$('btnPush');
  const down=e=>{ if(e) e.preventDefault(); pressed=1; push.classList.add('on'); };
  const up=()=>{ pressed=0; push.classList.remove('on'); };
  push.addEventListener('pointerdown',down); ['pointerup','pointerleave','pointercancel'].forEach(ev=>push.addEventListener(ev,up));
  push.addEventListener('keydown',e=>{ if(e.key===' '||e.key==='Enter'){ e.preventDefault(); e.stopPropagation(); down(); } });
  push.addEventListener('keyup',e=>{ if(e.key===' '||e.key==='Enter') up(); });
  push.addEventListener('blur',up); window.addEventListener('blur',up);
  function tick(){
    if(!d1vis('btnPush')){ clearInterval(timer); timer=null; d1hl('codeBtn',[]); return; }
    d1hl('codeBtn', pressed?[5,6]:[7,8]);
    $('btnVal').textContent=pressed; $('btnLedVal').textContent=pressed;
    $('btnLed').classList.toggle('on',!!pressed);
    $('btnMsg').innerHTML=pressed?'<b>6·7줄</b> · BTN.value()가 1이라 if 아래 줄이 실행돼요. LED가 켜져요.':'<b>8·9줄</b> · BTN.value()가 0이라 else 아래 줄이 실행돼요. LED가 꺼져요.';
  }
  onShow[4]=()=>{ if(!timer) timer=setInterval(tick,120); };
})();

/* 05 빈칸 확인 */
document.querySelectorAll('.d1-blank').forEach(b=>b.onclick=()=>{ b.textContent=b.dataset.a; b.classList.add('on'); });

const MEMOLIST=[['planLight','빈 교실 전등을 끄려면 필요한 장치'],['chkBoardPick','실습 ① 온보드 LED: 해낸 것'],['boardMemo','실습 ① 일어난 일과 막혔던 점'],['chkLedPick','실습 ② LED 깜박이기: 해낸 것'],['ledMemo','실습 ② 기다리는 시간: 예측 → 결과'],['chkBtnPick','실습 ③ 버튼: 해낸 것'],['btnMemo','실습 ③ 입력과 출력, 센서로 바꾼다면'],['fanInPick','스마트 선풍기: 입력 장치'],['fanOutPick','스마트 선풍기: 출력 장치'],['fanWhy','스마트 선풍기: 까닭과 동작 순서'],['selfCheckPick','성취도 평가: 할 수 있게 된 것'],['keyQ','오늘의 질문에 대한 내 답']];
onShow[6]=()=>memoSummary('msum',MEMOLIST);
