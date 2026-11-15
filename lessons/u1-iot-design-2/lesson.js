/* 코드 상자: 줄 사이 빈 글자 마디를 지워 한 줄씩 깔끔하게 */
document.querySelectorAll('pre.code').forEach(p=>[...p.childNodes].forEach(n=>{ if(n.nodeType===3&&!n.textContent.trim()) n.remove(); }));
function d2hl(id,rows){ document.querySelectorAll('#'+id+' .l').forEach((l,i)=>l.classList.toggle('on',rows.includes(i))); }
const d2vis=id=>{ const e=document.getElementById(id); return !!(e&&e.offsetParent); };

/* 회로 그림: 피코 H(위 줄 핀 40→21, 아래 줄 핀 1→20) + 인체 감지 센서 + LED (+ 부저) */
function d2circuit(withBuz){
  const s=22,x0=60,by=100,yT=by+14,yB=by+90;
  const X=n=>n<=20?x0+(n-1)*s:x0+(40-n)*s, Y=n=>n<=20?yB:yT;
  const used={40:'#d64535',34:'#2f6fd0',28:'#33393f',19:'#e0702b',18:'#33393f'}; if(withBuz) used[20]='#9b4fc4';
  const W=(pts,c)=>`<polyline class="wire ${c}" points="${pts.map(p=>p.join(',')).join(' ')}"/>`;
  let g=`<rect x="40" y="${by}" width="458" height="104" rx="8" class="pc-b"/><rect x="22" y="${by+38}" width="26" height="28" rx="3" class="pc-usb"/>`
    +`<text x="269" y="${by+57}" class="pc-nm">Raspberry Pi Pico H</text><text x="16" y="${by+84}" class="cl s">USB</text>`;
  for(let n=1;n<=40;n++){ const u=used[n];
    g+=`<circle cx="${X(n)}" cy="${Y(n)}" r="${u?6.5:4}" class="pc-p${u?' on':''}"${u?` style="fill:${u}"`:''}/>`;
    if(u||[1,20,21,40].includes(n)) g+=`<text x="${X(n)}" y="${n<=20?yB-11:yT+19}" class="pc-n">${n}</text>`; }
  /* 인체 감지 센서(HC-SR501형): 기판 글자 VCC · OUT · GND, 가운데가 신호 */
  g+=`<rect x="74" y="4" width="146" height="66" rx="6" class="pir-b"/><circle cx="150" cy="28" r="18" class="pir-d"/>`
    +`<text x="100" y="64" class="pir-t">VCC</text><text x="150" y="64" class="pir-t">OUT</text><text x="200" y="64" class="pir-t">GND</text>`;
  g+=W([[100,70],[100,86],[X(40),86],[X(40),yT]],'w-pwr')+W([[150,70],[150,94],[X(34),94],[X(34),yT]],'w-28')+W([[200,70],[200,80],[X(28),80],[X(28),yT]],'w-gnd');
  g+=`<text x="${X(28)+14}" y="18" class="cl">인체 감지 센서 (PIR)</text><text x="${X(28)+14}" y="36" class="cl s">VCC → VBUS (핀 40)</text><text x="${X(28)+14}" y="52" class="cl s">OUT → GP28 (핀 34)</text><text x="${X(28)+14}" y="68" class="cl s">GND → GND (핀 28)</text>`;
  /* LED: GP14(핀 19) → 저항 → LED + / − → GND(핀 18) — 지난 시간과 같은 자리 */
  const yc=315, yg=362;
  g+=W([[X(19),yB],[X(19),yc],[476,yc]],'w-14')+W([[520,yc],[552,yc]],'w-14');
  g+=`<rect x="476" y="${yc-7}" width="44" height="14" rx="6" class="res"/><rect x="486" y="${yc-7}" width="4" height="14" class="res-b"/><rect x="496" y="${yc-7}" width="4" height="14" class="res-b"/><rect x="506" y="${yc-7}" width="4" height="14" class="res-b"/>`;
  g+=`<text x="498" y="${yc+22}" class="cl m">저항 220Ω</text>`;
  g+=`<line x1="552" y1="276" x2="552" y2="${yc}" class="leg"/><line x1="568" y1="276" x2="568" y2="305" class="leg"/>`
    +`<path d="M544 271v-14a16 16 0 0 1 32 0v14z" class="led-d"/><rect x="540" y="271" width="40" height="5" rx="2" class="led-d"/>`
    +`<text x="586" y="256" class="cl">LED</text><text x="586" y="272" class="cl s">긴 다리가 +</text><text x="546" y="298" class="cl e">+</text><text x="574" y="298" class="cl">−</text>`;
  g+=W([[568,305],[568,yg],[X(18),yg],[X(18),yB]],'w-gnd');
  g+=`<text x="${X(18)-6}" y="${yg-6}" class="cl e">GND (핀 18)</text><text x="${X(19)+6}" y="${yc-25}" class="cl">GP14 (핀 19)</text>`;
  if(withBuz){
    const yz=226;
    g+=W([[X(20),yB],[X(20),yz],[634,yz]],'w-15')+W([[650,yz+16],[650,yg],[568,yg]],'w-gnd');
    g+=`<circle cx="650" cy="${yz}" r="16" class="buz"/><circle cx="650" cy="${yz}" r="4" fill="#fff"/><text x="650" y="${yz-22}" class="cl m">부저</text><text x="626" y="${yz-6}" class="cl s e">+ 빨간 선</text>`;
    g+=`<text x="${X(20)+6}" y="${yz-6}" class="cl">GP15 (핀 20)</text>`;
  }
  return `<svg viewBox="0 0 690 380" role="img" aria-label="피코 H와 인체 감지 센서·LED${withBuz?'·부저':''} 연결 그림">${g}</svg>`;
}
$('cirPir').innerHTML=d2circuit(false);
$('cirBuz').innerHTML=d2circuit(true);

chips('chkPir','chkPirPick',['버튼을 뺐다','기판 글자를 보고 VCC·OUT·GND를 연결했다','코드를 입력해 실행했다','손을 넣으면 LED가 켜졌다','꺼질 때까지 시간을 재 봤다','부저도 더해 봤다'],true);

/* 01 인체 감지 시뮬레이션: 지나간 뒤에도 유지 시간 동안 값 1 */
(function(){
  let hold=3, until=0, beepUntil=0, timer=null;
  const man=$('pirMan'), range=$('pirHold'), walk=$('pirWalk');
  range.oninput=()=>{ hold=+range.value; $('pirHoldV').textContent=hold+'초'; };
  walk.onclick=()=>{
    walk.disabled=true;
    man.classList.remove('go'); void man.offsetWidth; man.classList.add('go');
    /* 사람이 센서 앞(가운데)을 지날 무렵 감지: 꺼져 있다가 켜지는 순간에만 부저가 짧게 */
    setTimeout(()=>{ const now=Date.now(); if(until<=now) beepUntil=now+100; until=now+hold*1000; },1100);
    setTimeout(()=>{ man.style.transition='none'; man.classList.remove('go'); void man.offsetWidth; man.style.transition=''; walk.disabled=false; },2500);
  };
  function tick(){
    if(!d2vis('pirRoom')){ clearInterval(timer); timer=null; d2hl('codePir',[]); return; }
    const now=Date.now(), left=until-now, v=left>0?1:0;
    d2hl('codePir', v?[5,6]:[7,8]);
    $('pirVal').textContent=v; $('pirLedVal').textContent=v;
    $('pirLed').classList.toggle('on',!!v);
    $('pirBuz').classList.toggle('on',beepUntil>now&&$('pirBuzOn').checked);
    $('pirBar').style.width=v?Math.min(100,left/(hold*10))+'%':'0';
    $('pirMsg').innerHTML=v?`<b>6·7줄</b> · 센서 값이 1이에요. LED가 켜져요. 유지 시간이 <b>${(left/1000).toFixed(1)}초</b> 남았어요.`
      :'<b>8·9줄</b> · 센서 값이 0이에요. LED가 꺼져 있어요. 센서 앞을 지나가 보세요.';
  }
  onShow[1]=()=>{ if(!timer) timer=setInterval(tick,50); };
})();

/* 02 장치 프로그램 묶음 읽기 */
(function(){
  const G=[
    {n:'모듈 준비',r:[0,2],k:'#5b6776',t:'Blynk 플랫폼과 통신하는 BlynkLib, 와이파이를 다루는 network, 핀을 다루는 Pin을 준비해요.'},
    {n:'Ⓐ 직접 넣을 값',r:[3,5],k:'#d64535',t:'와이파이 이름(SSID)·비밀번호, Blynk에서 받은 인증 키를 넣는 자리예요. 실행하는 곳에 맞게 직접 입력해요.'},
    {n:'와이파이 연결',r:[6,13],k:'#1f9d74',t:'보드를 와이파이에 연결해요. 연결되지 않았다면 연결을 시작하고(11줄), 연결될 때까지 기다린 뒤(12~13줄) 받은 IP 주소를 출력해요.'},
    {n:'플랫폼 연결 · LED 핀',r:[14,15],k:'#9b4fc4',t:'인증 키로 Blynk 플랫폼에 접속하고, ESP32의 2번 핀을 LED 출력으로 정해요. 우리 회로라면 14번이겠지요.'},
    {n:'연결 상태 알림',r:[16,21],k:'#2f6fd0',t:'Blynk와 연결되거나 끊어질 때 셸에 알림 문장을 출력해요.'},
    {n:'앱 명령 받기',r:[22,25],k:'#e0702b',t:'앱이 데이터스트림 <b>V2</b>로 값을 보내면 실행돼요. 받은 값(0 또는 1)을 정수로 바꿔 LED 핀의 값으로 정해요. 버튼 코드의 if 문 대신 앱이 보낸 값이 LED를 정해요.'},
    {n:'계속 실행',r:[26,27],k:'#0f2742',t:'끝없이 반복하며 플랫폼에서 오는 명령을 확인해요.'}];
  const B=$('grpBtns'), V=$('grpView');
  B.innerHTML=G.map((g,i)=>`<button style="--k:${g.k}" data-i="${i}">${g.n}<small>${g.r[0]+1}~${g.r[1]+1}줄</small></button>`).join('');
  const bs=[...B.querySelectorAll('button')];
  const pick=i=>{ const g=G[i]; bs.forEach((b,j)=>b.classList.toggle('on',i===j)); const rows=[]; for(let r=g.r[0];r<=g.r[1];r++) rows.push(r); d2hl('codeBlynk',rows); V.innerHTML=`<b>${g.r[0]+1}~${g.r[1]+1}줄 · ${g.n}</b><br>${g.t}`; };
  bs.forEach(b=>b.onclick=()=>pick(+b.dataset.i));
  V.innerHTML='왼쪽 코드를 일곱 묶음으로 나누었어요. 묶음을 누르면 해당 줄이 표시되고 하는 일을 알려 줘요.';
})();

/* 02 앱 → 플랫폼 → 장치 명령 흐름 시뮬레이션 */
(function(){
  let board='ESP32', busy=false;
  const bb=$('netBoard');
  bb.innerHTML=['ESP32','피코 H'].map((b,i)=>`<button class="chip${i?'':' on'}" data-b="${b}">${b}${i?' (와이파이 없음)':''}</button>`).join('');
  bb.querySelectorAll('button').forEach(b=>b.onclick=()=>{ board=b.dataset.b; bb.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b)); $('netBoardName').textContent=board; $('netWifi').disabled=board!=='ESP32'; $('netWifi').checked=board==='ESP32'; $('netLed').classList.remove('lit'); reset(); });
  const parts=[...document.querySelectorAll('#netFlow [data-s]')];
  const reset=()=>parts.forEach(p=>p.classList.remove('on','bad'));
  const mark=(s,c)=>parts.find(p=>+p.dataset.s===s).classList.add(c);
  const lock=on=>{ busy=on; bb.querySelectorAll('button').forEach(b=>b.disabled=on); $('netWifi').disabled=on||board!=='ESP32'; $('netOn').disabled=on; $('netOff').disabled=on; };
  function send(v){
    if(busy) return; lock(true); reset(); d2hl('codeBlynk',[]);
    const ok=board==='ESP32'&&$('netWifi').checked;
    const seq=[4,3,2,1,0]; let i=0;
    $('netMsg').innerHTML=`앱에서 <b>${v?'ON':'OFF'}</b>을 골랐어요. 명령이 데이터스트림 V2로 출발해요…`;
    const step=()=>{
      const s=seq[i];
      if(s===1&&!ok){ mark(1,'bad'); mark(0,'bad'); lock(false);
        $('netMsg').innerHTML=board!=='ESP32'
          ?'<b class="ng">장치까지 가지 못했어요.</b> 피코 H에는 와이파이 기능이 없어 네트워크에 연결되지 않아요. 플랫폼은 명령을 받았지만 장치에 전달할 길이 없어요.'
          :'<b class="ng">장치까지 가지 못했어요.</b> ESP32가 와이파이에 연결되지 않아 플랫폼의 명령을 받을 수 없어요. 코드 12~13줄에서 연결을 계속 기다리고 있을 거예요.';
        return; }
      mark(s,'on');
      if(s===0){ $('netLed').classList.toggle('lit',!!v); d2hl('codeBlynk',[22,23,24,25]); lock(false);
        $('netMsg').innerHTML=`<b class="ok">LED가 ${v?'켜졌어요':'꺼졌어요'}.</b> 서비스(앱) → 네트워크 → 플랫폼(Blynk) → 네트워크 → 디바이스(ESP32) 순서로 명령이 전달되었어요. 장치 프로그램에서는 23~26줄이 실행되어 <span class="mono">ledPin.value(${v})</span>이 되었어요.`; return; }
      i++; setTimeout(step,450);
    };
    step();
  }
  $('netOn').onclick=()=>send(1); $('netOff').onclick=()=>send(0);
  $('netWifi').onchange=reset;
})();

/* 03 투표 */
vote('iotVote','iotVotePick',[['그렇다','센서와 마이크로컨트롤러가 있으니까'],['아직 아니다','무언가 더 필요할 것 같다']],()=>$('iotReveal').classList.add('on'));

/* 04 정리 */
document.querySelectorAll('.d2-blank').forEach(b=>b.onclick=()=>{ b.textContent=b.dataset.a; b.classList.add('on'); });
chips('sysPick','sysPickName',['스마트워치','스마트 화분','하이패스','로봇 청소기','스마트 가전','스마트 조명(앱)'],false);
chips('selfCheck','selfCheckPick',['사물 인터넷 시스템의 개념과 구성 요소와 동작 원리를 설명할 수 있다','사물 인터넷 시스템의 동작 과정을 설명할 수 있다','사물 인터넷 시스템 사용으로 개인과 사회의 변화를 예측할 수 있다'],true);

const MEMOLIST=[['remotePlan','은서가 멀리서 조명을 끄는 방법'],['chkPirPick','실습 ① 인체 감지 조명: 해낸 것'],['pirMemo','실습 ① 센서 값에 따른 LED 동작'],['predict','앱 조명 코드: 나의 예측'],['iotVotePick','피코 조명은 사물 인터넷 시스템일까?'],['cmpWhy','사물 인터넷 시스템이 되려면 더할 것'],['sumDef','사물 인터넷 시스템의 개념과 구성 요소'],['sysPickName','동작 과정을 설계한 시스템'],['sysFlow','그 시스템의 동작 과정'],['comic','3컷 만화와 느낀 점'],['selfCheckPick','학업 성취도 점검'],['extra','선택 활동'],['keyQ','핵심 질문에 대한 내 답'],['newLearn','새롭게 알게 된 점']];
onShow[5]=()=>memoSummary('msum',MEMOLIST);
