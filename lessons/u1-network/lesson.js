
/* 0 시작 · 2030 학교 */
vote('unitVote','unitPick',[['🏀 자동 실내 환경 시스템','강당'],['🚪 자동 출석 확인 시스템','교실'],['📚 열람실 현황 시스템','도서관'],['🍱 자동 급식 확인 시스템','급식실']]);

/* 01 이 주소는 무엇일까? */
sorter('addrGame',{
  cats:[{n:'IPv4 주소',k:'#2f6fd0'},{n:'IPv6 주소',k:'#9b4fc4'},{n:'도메인 이름',k:'#1f9d74'},{n:'IPv4 규칙에 어긋남',k:'#d64535'}],
  items:[
    {t:'<span class="mono">192.168.1.130</span>',c:0,ic:'🔢',w:'0~255 사이 숫자 4개를 마침표로 구분했어요.'},
    {t:'<span class="mono">110.165.22.169</span>',c:0,ic:'🔢',w:'영역 4개, 모두 0~255예요. 교과서에서 도메인 이름이 연결된 IP 주소예요.'},
    {t:'<span class="mono">2001:0DB8:0000:0000:0000:0000:1428:57AB</span>',c:1,ic:'🔣',w:'16진수 8개 영역을 콜론(:)으로 구분했어요.'},
    {t:'<span class="mono">FE80:0000:0000:0000:0202:B3FF:FE1E:8329</span>',c:1,ic:'🔣',w:'0~9와 A~F로 쓴 16진수 8개 영역, 콜론 구분이에요.'},
    {t:'<span class="mono">www.○○○.go.kr</span>',c:2,ic:'🏷️',w:'go는 정부, kr은 대한민국이에요. DNS 서버가 IP 주소로 바꿔 줘요.'},
    {t:'<span class="mono">www.○○○.ac.kr</span>',c:2,ic:'🏷️',w:'ac는 교육 기관이에요. 사람이 기억하기 쉬운 이름이지요.'},
    {t:'<span class="mono">192.168.1.300</span>',c:3,ic:'⚠️',w:'300은 한 영역에 들어갈 수 있는 0~255를 벗어나요.'},
    {t:'<span class="mono">10.20.30</span>',c:3,ic:'⚠️',w:'영역이 3개뿐이에요. IPv4는 4개 영역이어야 해요.'},
  ],
  end:'<b>정리</b> IPv4는 <b>0~255 숫자 4개 + 마침표</b>, IPv6는 <b>16진수 8개 + 콜론</b>, 도메인 이름은 <b>사람이 읽는 이름</b>이에요.'
});

/* 02 유선일까, 무선일까? */
sorter('wireGame',{
  cats:[{n:'🔌 유선',k:'#e0702b'},{n:'📶 무선',k:'#2f6fd0'}],
  items:[
    {t:'신뢰도가 높다',c:0,ic:'👍',w:'케이블로 직접 이어져 있어 안정적이에요.'},
    {t:'속도가 빠르다',c:0,ic:'⚡',w:'유선의 장점이에요. 무선은 유선에 비해 느릴 수 있어요.'},
    {t:'이동이 어렵다',c:0,ic:'🪢',w:'선에 묶여 있으니 자리를 옮기기 어려워요.'},
    {t:'모든 컴퓨터를 선으로 이어야 해서 회선이 복잡하다',c:0,ic:'🧶',w:'기기가 많아질수록 케이블이 늘어나요.'},
    {t:'광섬유 케이블',c:0,ic:'🧵',w:'UTP 케이블과 함께 대표적인 유선 매체예요.'},
    {t:'이동이 자유롭다',c:1,ic:'🚶',w:'선이 없으니 들고 다니며 쓸 수 있어요.'},
    {t:'많은 사용자가 동시에 이용할 수 있다',c:1,ic:'👥',w:'같은 무선 주파수를 여러 기기가 함께 써요.'},
    {t:'보안이 취약하다',c:1,ic:'🔓',w:'전파는 주변으로 퍼지기 때문에 보안에 더 신경 써야 해요.'},
    {t:'전송 범위를 벗어나면 연결이 어렵다',c:1,ic:'📉',w:'신호 감쇄가 심해서 멀어지면 연결이 약해져요.'},
    {t:'블루투스',c:1,ic:'🎧',w:'와이파이, NFC, RFID와 함께 무선 매체예요.'},
  ],
  end:'<b>생각해 보기</b> 우리 교실에서 유선으로 연결된 기기와 무선으로 연결된 기기는 각각 무엇인가요? 왜 그렇게 연결했을까요?'
});

/* 03 데이터 전송 단계별 보기 */
(function(){
  const STOPS=[['💻','A 컴퓨터'],['🌐','라우터'],['🏙️','서울 MAN'],['🌏','WAN'],['🏙️','보스턴 MAN'],['🏛️','하버드 LAN'],['🖥️','B 컴퓨터']];
  const STEP=[
    {t:'사진을 패킷으로 나누기',d:'사진이 너무 커서 한 번에 보내기 어려워요. <i>「너무 크니까 주소를 주고 1,500byte씩 나누자.」</i> 사진을 작은 패킷으로 나누고, 패킷마다 받는 사람(B)의 주소를 붙여요.',pk:'split'},
    {t:'유선 케이블 → 라우터',d:'A의 컴퓨터에 연결된 유선 케이블을 통해 패킷이 라우터로 가요. 라우터는 서로 다른 네트워크를 연결하고 효율적인 길을 알려 주는 장치예요.',pk:'go'},
    {t:'서울 MAN',d:'가정·학교·회사의 여러 LAN이 모여 이룬 도시 안 네트워크(MAN)를 지나요.',pk:'go'},
    {t:'WAN · 패킷마다 다른 길',d:'도시의 범위를 넘어 WAN으로 들어가요. 통신 매체의 용량 제한과 네트워크의 혼잡도에 따라 <b>패킷마다 다른 경로</b>로 전송돼요.',pk:'routes'},
    {t:'보스턴 MAN',d:'<i>「보스턴을 거쳐서 하버드 대학으로 가세요.」</i> 패킷에 붙은 수신자 주소를 보고 목적지 쪽으로 찾아가요.',pk:'routes'},
    {t:'하버드 대학교 LAN에 도착',d:'<i>「어서 오세요. 이곳이 하버드 대학입니다.」</i> 서로 다른 길로 온 패킷들이 해당 지역의 LAN으로 모여요. 도착한 순서는 보낸 순서와 다를 수 있어요.',pk:'arrive'},
    {t:'B 컴퓨터 · 다시 합치기',d:'<i>「도착한 패킷들을 다시 합쳐 보자.」</i> B의 컴퓨터는 <b>주소를 뺀 데이터</b>를 원래 순서대로 조합해 사진을 다시 만들어 읽어요.',pk:'merge'},
  ];
  const C=['#d64535','#2f6fd0','#1f9d74','#f2a516'], N='①②③④';
  const pk=(i,addr)=>`<span class="pk" style="--c:${C[i]}">${addr?'<i>B</i>':''}${N[i]}</span>`;
  const B=$('sendSim'); let s=0;
  B.innerHTML=`<div class="nw-track">${STOPS.map((x,i)=>`<span data-i="${i}"><i>${x[0]}</i>${x[1]}</span>`).join('')}</div>
    <div class="nw-step"><div class="nw-st-h"></div><p class="nw-st-d"></p><div class="nw-tray"></div></div>
    <div class="row" style="margin-top:10px"><button class="btn ghost sm" data-k="p">← 이전</button><button class="btn sm" data-k="n">다음 →</button><button class="btn ghost sm" data-k="r">처음부터</button><span class="muted nw-cnt"></span></div>`;
  const stops=[...B.querySelectorAll('.nw-track span')];
  function tray(k){
    if(k==='split') return `<div class="nw-row"><span class="pic">🖼️ 사진</span><b class="ar">✂️ →</b>${[0,1,2,3].map(i=>pk(i,1)).join('')}</div><small class="muted">흰 칸 <b>B</b> = 패킷마다 붙은 수신자 주소</small>`;
    if(k==='go') return `<div class="nw-row"><b class="ar">🚚</b>${[0,1,2,3].map(i=>pk(i,1)).join('')}<b class="ar">→</b></div>`;
    if(k==='routes') return `<div class="nw-lane"><small>경로 ㉮</small>${pk(0,1)}${pk(2,1)}<b class="ar">→</b></div><div class="nw-lane busy"><small>경로 ㉯ (붐빔)</small>${pk(1,1)}<b class="ar">→</b></div><div class="nw-lane"><small>경로 ㉰</small>${pk(3,1)}<b class="ar">→</b></div>`;
    if(k==='arrive') return `<div class="nw-row"><small class="muted">도착한 순서</small>${[2,0,3,1].map(i=>pk(i,1)).join('')}</div>`;
    return `<div class="nw-row"><small class="muted">주소를 떼고 순서대로</small>${[0,1,2,3].map(i=>pk(i,0)).join('')}<b class="ar">→</b><span class="pic">🖼️ 사진 완성!</span></div>`;
  }
  function draw(){
    stops.forEach((x,i)=>{x.classList.toggle('on',i===s); x.classList.toggle('done',i<s);});
    const st=STEP[s]; B.querySelector('.nw-st-h').innerHTML=`<i>${STOPS[s][0]}</i> <b>${s+1}. ${st.t}</b>`;
    B.querySelector('.nw-st-d').innerHTML=st.d; B.querySelector('.nw-tray').innerHTML=tray(st.pk);
    B.querySelector('.nw-cnt').textContent=`${s+1} / ${STEP.length}`;
    B.querySelector('[data-k=p]').disabled=s===0; B.querySelector('[data-k=n]').disabled=s===STEP.length-1;
    const tr=B.querySelector('.nw-track'), on=stops[s]; tr.scrollLeft=on.offsetLeft-tr.clientWidth/2+on.clientWidth/2;
  }
  B.querySelector('[data-k=p]').onclick=()=>{if(s>0){s--;draw();}};
  B.querySelector('[data-k=n]').onclick=()=>{if(s<STEP.length-1){s++;draw();}};
  B.querySelector('[data-k=r]').onclick=()=>{s=0;draw();};
  stops.forEach((x,i)=>x.onclick=()=>{s=i;draw();});
  draw();
})();

/* 04 DHCP 서버가 되어 보기 */
(function(){
  const DEV=[['💻','내 노트북'],['📱','친구 휴대폰'],['🖨️','교실 프린터'],['🖥️','선생님 컴퓨터'],['⌚','스마트 워치']];
  const POOL=[100,101,102,103];
  const B=$('dhcpSim'); let mode='auto', ip=DEV.map(()=>null), val=DEV.map(()=>''), typed=0, msg='';
  function conflict(i){return ip[i]!=null && ip.some((v,j)=>j!==i&&v===ip[i]);}
  function draw(){
    const used=new Set(ip.filter(v=>v!=null));
    const anyC=ip.some((_,i)=>conflict(i));
    B.innerHTML=`<div class="nw-mode"><button data-m="auto" class="${mode==='auto'?'on':''}">🤖 자동(DHCP)</button><button data-m="man" class="${mode==='man'?'on':''}">✍️ 직접 입력</button></div>
      ${mode==='auto'?`<div class="nw-pool"><b>DHCP 서버가 가진 IP 주소</b> (4개 · 기기는 5대예요)<div>${POOL.map(p=>`<span class="${used.has(p)?'used':''}">192.168.1.${p}</span>`).join('')}</div></div>`
        :`<div class="nw-pool"><b>직접 입력</b> 기기마다 IP 주소의 마지막 칸을 정해요 (이 활동에서는 2~254). 서브넷 마스크·게이트웨이·DNS 서버도 기기마다 하나씩 입력해야 해요.</div>`}
      <div class="nw-devl">${DEV.map((d,i)=>{const c=conflict(i);
        return `<div class="nw-dv ${ip[i]!=null?'on':''} ${c?'bad':''}"><span class="ic">${d[0]}</span><div class="tx"><b>${d[1]}</b>${ip[i]!=null?`<small class="mono">IP 192.168.1.${ip[i]} · 마스크 255.255.255.0 · 게이트웨이 192.168.1.1</small>${c?'<small class="ng">⚠️ 같은 IP 주소를 쓰는 기기가 있어 충돌!</small>':''}`:'<small class="muted">연결 안 됨</small>'}</div>
        <div class="ac">${ip[i]!=null?`<button class="btn ghost sm" data-out="${i}">나가기</button>`:(mode==='auto'?`<button class="btn sm" data-in="${i}">연결</button>`:`<span class="mono nw-pre">192.168.1.</span><input type="number" min="2" max="254" data-n="${i}" value="${val[i]}" aria-label="${d[1]} IP 주소 마지막 칸"><button class="btn sm" data-in="${i}">연결</button>`)}</div></div>`;}).join('')}</div>
      <div class="nw-stat"><span>직접 입력한 칸 <b>${typed}</b>칸</span><span>충돌 <b class="${anyC?'ng':''}">${anyC?'있음':'없음'}</b></span></div>
      <div class="nw-msg">${msg||(mode==='auto'?'기기의 <b>연결</b>을 눌러 보세요. DHCP 서버가 주소를 알아서 나눠 줘요.':'두 기기에 <b>같은 숫자</b>를 넣으면 어떻게 될까요?')}</div>`;
    B.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{mode=b.dataset.m; ip=DEV.map(()=>null); val=DEV.map(()=>''); typed=0;
      msg=mode==='auto'?'자동(DHCP)으로 바꿨어요. 모든 기기의 연결을 끊고 새로 시작해요.':'직접 입력으로 바꿨어요. 이제 기기마다 주소를 정해 입력해야 해요.'; draw();});
    B.querySelectorAll('[data-n]').forEach(x=>x.oninput=()=>{val[+x.dataset.n]=x.value;});
    B.querySelectorAll('[data-in]').forEach(b=>b.onclick=()=>{const i=+b.dataset.in;
      if(mode==='auto'){const free=POOL.find(p=>!used.has(p)); if(free==null){msg=`<b class="ng">남은 주소가 없어요.</b> DHCP 서버의 주소 4개를 모두 나눠 주었어요. 연결된 기기 하나를 <b>나가기</b>로 내보내면 그 주소를 <b>${DEV[i][1]}</b>에 다시 나눠 줄 수 있어요.`;}
        else{ip[i]=free; msg=`DHCP 서버가 <b>${DEV[i][1]}</b>에 비어 있는 주소 하나(<b>192.168.1.${free}</b>)를 자동으로 할당했어요. 서브넷 마스크·게이트웨이·DNS 서버 주소도 함께 받았어요. 직접 입력한 칸은 없어요.`;}}
      else{const v=+val[i]; if(val[i]==='') {msg='마지막 칸에 넣을 숫자를 먼저 적어요.'; draw(); return;}
        if(!Number.isInteger(v)||v<2||v>254){msg='2~254 사이의 숫자를 넣어 주세요. (192.168.1.1은 게이트웨이인 라우터의 주소예요.)';}
        else{ip[i]=v; val[i]=''; typed+=4; msg=conflict(i)?`<b class="ng">충돌!</b> 같은 주소(192.168.1.${v})를 이미 다른 기기가 쓰고 있어요. 데이터가 어느 기기로 가야 할지 알 수 없어요.`:`<b>${DEV[i][1]}</b>에 주소(192.168.1.${v})를 넣었어요. IP 주소, 서브넷 마스크, 게이트웨이, DNS 서버까지 <b>4칸</b>을 직접 입력했어요.`;}}
      draw();});
    B.querySelectorAll('[data-out]').forEach(b=>b.onclick=()=>{const i=+b.dataset.out, v=ip[i]; ip[i]=null;
      msg=mode==='auto'?`<b>${DEV[i][1]}</b> 연결을 끊었어요. 쓰던 주소(192.168.1.${v})는 DHCP 서버로 돌아가서 다른 기기가 다시 쓸 수 있어요.`:`<b>${DEV[i][1]}</b> 연결을 끊었어요. 다시 연결하려면 주소를 또 입력해야 해요.`; draw();});
  }
  draw();
})();

/* 05 내 기기의 네트워크 환경 */
const DEVPATH={
  '윈도 컴퓨터':'<b>설정</b> → <b>네트워크 및 인터넷</b> → 연결된 <b>와이파이</b>(또는 <b>이더넷</b>)의 <b>속성</b> → 아래쪽의 IP 할당, IPv4 주소, DNS 서버를 봐요. <span class="muted">명령 프롬프트가 열린다면 <span class="mono">ipconfig</span>를 입력해도 IPv4 주소, 서브넷 마스크, 기본 게이트웨이를 한 번에 볼 수 있어요.</span>',
  '맥':'<b>시스템 설정</b> → <b>Wi-Fi</b>(또는 <b>네트워크</b>) → 연결된 네트워크의 <b>세부 사항</b> → <b>TCP/IP</b>에서 IPv4 구성, IP 주소, 서브넷 마스크, 라우터를 봐요. DNS 서버는 <b>DNS</b> 항목에 있어요.',
  '안드로이드':'<b>설정</b> → <b>연결</b>(또는 네트워크) → <b>Wi-Fi</b> → 연결된 Wi-Fi 옆의 <b>설정(⚙)</b> 버튼 → IP 주소와 IP 설정(DHCP)을 봐요. 기종에 따라 <b>더보기</b>나 <b>자세히</b> 아래에 있어요.',
  '아이폰·아이패드':'<b>설정</b> → <b>Wi-Fi</b> → 연결된 Wi-Fi 옆의 <b>ⓘ</b> → IPv4 주소 아래의 <b>IP 구성</b>, <b>IP 주소</b>, <b>서브넷 마스크</b>, <b>라우터</b>(게이트웨이)를 보고, 아래쪽 <b>DNS 구성</b>도 봐요.',
};
vote('devVote','myDevice',Object.keys(DEVPATH).map(k=>[k]),i=>{$('devPath').innerHTML=`🧭 ${DEVPATH[Object.keys(DEVPATH)[i]]}<br><small class="muted">값은 읽기만 하고, 편집·수동 버튼은 누르지 않아요.</small>`;});
chips('netTypeChips','netType',['유선(이더넷)','무선(와이파이)']);
chips('ipModeChips','ipMode',['자동(DHCP)','수동','잘 모르겠음']);
(function(){
  const box=$('ipCheck'), f=k=>document.querySelector(`[data-memo="${k}"]`);
  function p4(s){s=(s||'').trim(); if(!s) return {e:'empty'}; if(s.includes(':')) return {e:'v6',m:'콜론(:)이 있어요. 마침표(.)로 나뉜 IPv4 형식으로 적어 주세요.'};
    const a=s.split('.'); if(a.length!==4) return {e:`영역이 ${a.length}개예요. IPv4는 마침표로 나뉜 4개 영역이에요.`};
    const n=a.map(x=>/^\d{1,3}$/.test(x.trim())?+x:NaN); const bad=n.findIndex(x=>isNaN(x)||x>255);
    if(bad>=0) return {e:`${bad+1}번째 영역 「${a[bad]}」이 0~255 범위의 숫자가 아니에요.`}; return {n};}
  function draw(){
    const ip=p4(f('myIP').value), mk=p4(f('myMask').value), gw=p4(f('myGw').value);
    if(ip.e==='empty'){box.innerHTML='<span class="muted">IP 주소를 적으면 여기서 구조를 확인해 줘요.</span>';return;}
    if(ip.e==='v6'){box.innerHTML='콜론(:)이 있으니 <b>IPv6 주소</b>예요. 이 칸에는 마침표로 된 <b>IPv4 주소</b>를 찾아 적어 보세요.';return;}
    if(ip.e){box.innerHTML=`<span class="ng">다시 확인해요</span> ${ip.e}`;return;}
    let h='<b class="ok">IPv4 주소예요.</b> 4개 영역, 모두 0~255예요.';
    if(mk.n){
      h+=`<div class="nw-oct">${ip.n.map((v,i)=>`<span class="${mk.n[i]===255?'n':mk.n[i]===0?'h':'m'}">${v}</span>`).join('<i>.</i>')}</div>`;
      const net=ip.n.filter((_,i)=>mk.n[i]===255), host=ip.n.filter((_,i)=>mk.n[i]===0);
      h+=mk.n.every(v=>v===255||v===0)?`<b class="n">네트워크 주소</b> 부분 ${net.join('.')||'-'} · <b class="h">호스트 주소</b> 부분 ${host.join('.')||'-'}`:'서브넷 마스크가 255나 0이 아닌 칸은 그 칸 안에서 네트워크 주소와 호스트 주소가 나뉘어요.';
      if(gw.n){const same=ip.n.every((v,i)=>(v&mk.n[i])===(gw.n[i]&mk.n[i]));
        h+=same?'<br>게이트웨이와 <b>네트워크 주소 부분이 같아요</b>. 내 기기와 라우터가 같은 서브넷에 있어요.':'<br><span class="ng">게이트웨이와 네트워크 주소 부분이 달라요.</span> 숫자를 다시 확인해 보세요.';}
      else if(gw.e && gw.e!=='empty') h+=`<br><span class="ng">게이트웨이 다시 확인</span> ${gw.m||gw.e}`;
    } else if(mk.e && mk.e!=='empty') h+=`<br><span class="ng">서브넷 마스크 다시 확인</span> ${mk.m||mk.e}`;
    else h+=(gw.e && gw.e!=='empty'?`<br><span class="ng">게이트웨이 다시 확인</span> ${gw.m||gw.e}`:'')+'<br><span class="muted">서브넷 마스크가 보이지 않으면 비워 둬도 괜찮아요. 적으면 네트워크 주소와 호스트 주소로 나눠 보여 줘요.</span>';
    box.innerHTML=h;
  }
  ['myIP','myMask','myGw'].forEach(k=>f(k).addEventListener('input',draw));
  onShow[5]=draw;
})();
document.querySelectorAll('.nw-blank').forEach(b=>b.onclick=()=>{const on=!b.classList.contains('on'); b.textContent=on?b.dataset.a:'?'; b.classList.toggle('on',on);});
chips('selfCheck','selfCheckPick',['유무선 네트워크의 특성을 설명할 수 있다','IP 주소와 도메인 이름의 관계를 말할 수 있다','내 기기의 IP 주소와 게이트웨이를 찾을 수 있다','DHCP를 쓰는 까닭을 말할 수 있다'],true);

/* 06 마무리 */
const MEMOLIST=[['planNet','처음 생각 · 친구 컴퓨터로 자료를 보내려면'],['unitPick','2030 학교 · 먼저 생기면 좋겠는 시스템'],['wiredWireless','우리 교실·집의 유선·무선 연결'],['dhcpNote','자동(DHCP)과 직접 입력의 차이'],['pingRes','ping 결과'],['myDevice','확인한 기기'],['netType','연결 방식'],['netName','네트워크 이름'],['myIP','IP 주소'],['myMask','서브넷 마스크'],['myGw','게이트웨이'],['myDns','DNS 서버'],['ipMode','IP 할당 방식'],['selfCheckPick','스스로 점검: 할 수 있게 된 것'],['keyQ','오늘의 질문에 대한 내 답']];
onShow[6]=()=>memoSummary('msum',MEMOLIST);
