/* 공통 */
function ecSave(){store.set(MK,MEMO);}
const ecNorm=s=>String(s).toUpperCase().replace(/\s+/g,'');
const ecShift=(t,k)=>t.replace(/[A-Za-z]/g,c=>{const b=c<='Z'?65:97; return String.fromCharCode(((c.charCodeAt(0)-b+k)%26+26)%26+b);});
/* 단순 전치: 공백은 제자리에 두고, 글자를 키 길이만큼 묶어 재배치(짧은 마지막 묶음은 묶음 길이보다 큰 키 숫자를 건너뜀 — 교과서 64쪽과 같은 방식) */
function ecTrans(text,key,dec){
  const pos=[],letters=[]; [...text].forEach((c,i)=>{if(c!==' '){pos.push(i);letters.push(c);}});
  const k=key.length, out=[], blocks=[];
  for(let s=0;s<letters.length;s+=k){const blk=letters.slice(s,s+k), p=key.filter(d=>d<=blk.length); let res;
    if(!dec) res=p.map(d=>blk[d-1]); else {res=new Array(blk.length); p.forEach((d,i)=>res[d-1]=blk[i]);}
    blocks.push([blk,res,p]); out.push(...res);}
  const arr=[...text]; pos.forEach((pi,j)=>arr[pi]=out[j]); return {res:arr.join(''),blocks};
}
const ecKeyOk=s=>{if(!/^[1-9]{2,9}$/.test(s)) return null; const a=[...s].map(Number); return a.slice().sort().every((d,i)=>d===i+1)?a:null;};
const ecInv=key=>{const v=[]; key.forEach((d,i)=>v[d-1]=i+1); return v.join('');};
/* 스키테일: 암호문을 한 바퀴 k글자씩 세로(열)로 채우고 가로(행)로 읽기 */
function ecScyOrder(n,k){const o=[]; for(let j=0;j<n;j++) o.push(j); return o.sort((a,b)=>(a%k)-(b%k)||a-b);}
function ecScyEnc(p,k){const ch=[...p], o=ecScyOrder(ch.length,k), c=[]; o.forEach((j,t)=>c[j]=ch[t]); return c.join('');}

/* SHA-256 (UTF-8) */
function ecSha256(str){
  const b=new TextEncoder().encode(str), K=[], H=[]; let n=2;
  const frac=x=>(x-Math.floor(x))*4294967296|0;
  for(let c=0;c<64;n++){let p=true;for(let d=2;d*d<=n;d++) if(n%d===0){p=false;break;} if(p){if(c<8) H[c]=frac(Math.pow(n,1/2)); K[c++]=frac(Math.pow(n,1/3));}}
  const L=b.length, total=((L+9+63)>>6)<<6, m=new Uint8Array(total); m.set(b); m[L]=0x80;
  const bits=L*8; m[total-4]=bits>>>24; m[total-3]=bits>>>16; m[total-2]=bits>>>8; m[total-1]=bits; m[total-5]=Math.floor(bits/4294967296);
  const W=new Array(64), r=(x,k)=>(x>>>k)|(x<<(32-k));
  for(let o=0;o<total;o+=64){
    for(let i=0;i<16;i++) W[i]=(m[o+4*i]<<24)|(m[o+4*i+1]<<16)|(m[o+4*i+2]<<8)|m[o+4*i+3];
    for(let i=16;i<64;i++){const a=W[i-15], c=W[i-2]; W[i]=(W[i-16]+(r(a,7)^r(a,18)^(a>>>3))+W[i-7]+(r(c,17)^r(c,19)^(c>>>10)))|0;}
    let [a,bb,c,d,e,f,g,h]=H;
    for(let i=0;i<64;i++){const t1=(h+(r(e,6)^r(e,11)^r(e,25))+((e&f)^(~e&g))+K[i]+W[i])|0, t2=((r(a,2)^r(a,13)^r(a,22))+((a&bb)^(a&c)^(bb&c)))|0; h=g; g=f; f=e; e=(d+t1)|0; d=c; c=bb; bb=a; a=(t1+t2)|0;}
    H[0]=(H[0]+a)|0; H[1]=(H[1]+bb)|0; H[2]=(H[2]+c)|0; H[3]=(H[3]+d)|0; H[4]=(H[4]+e)|0; H[5]=(H[5]+f)|0; H[6]=(H[6]+g)|0; H[7]=(H[7]+h)|0;
  }
  return H.map(x=>(x>>>0).toString(16).padStart(8,'0')).join('');
}

/* 성취도 평가 */
chips('ck1','ck1',['치환형 암호화 방법과 그 효율성을 설명할 수 있다'],true);
chips('ck2','ck2',['전치형 암호화 방법과 그 효율성을 설명할 수 있다'],true);
chips('ck3','ck3',['단방향 암호화 방법과 그 효율성을 설명할 수 있다'],true);
chips('ck4','ck4',['대칭 암호화를 사용하는 이유와 그 안전성을 설명할 수 있다','비대칭 암호화의 중요성과 필요성을 설명할 수 있다'],true);

/* 01 어떤 기능일까? */
sorter('funcGame',{
  cats:[{n:'🙈 기밀성',k:'#2f6fd0'},{n:'🧩 무결성',k:'#1f9d74'},{n:'🪪 인증',k:'#e0702b'}],
  items:[
    {t:'내 성적표 파일은 나와 담임 선생님만 열어 볼 수 있어요.',c:0,ic:'📑',w:'권한이 있는 사람만 정보를 볼 수 있게 해요.'},
    {t:'메신저 대화를 중간에서 가로챈 사람이 내용을 읽지 못해요.',c:0,ic:'💬',w:'가로채도 읽을 수 없으니 정보가 보호돼요.'},
    {t:'선생님이 올린 공지 파일이 누군가에 의해 고쳐지지 않았는지 확인해요.',c:1,ic:'📢',w:'내용이 임의로 바뀌지 않았는지, 원본과 같은지 확인해요.'},
    {t:'내려받은 프로그램 파일에 빠지거나 덧붙은 부분이 없는지 검사해요.',c:1,ic:'💿',w:'생성·변경·삭제가 일어나지 않았는지 확인해요.'},
    {t:'학교 누리집에 접속한 사람이 정말 그 학생 본인인지 확인해요.',c:2,ic:'🏫',w:'권한이 있는 사용자인지 식별해요.'},
    {t:'온라인 시험 화면에 들어온 사람이 응시자 본인이 맞는지 확인해요.',c:2,ic:'📝',w:'접근한 사람이 실제 그 사람인지 확인해요.'},
  ],
  end:'<b>정리</b> 볼 수 있는 사람을 제한하면 기밀성, 내용이 그대로인지 보면 무결성, 누구인지 확인하면 인증이에요.'
});

/* 02 카이사르 암호 원판 */
(function(){
  const MA=ecShift('SEE YOU AT THE LIBRARY',3), MB=ecShift('KEEP YOUR PASSWORD SAFE',11);
  const B=$('caesarLab'); let mode='enc', tried=new Set(), bOn=false;
  B.innerHTML=`<div class="row ec-ctl"><div class="ec-mode"><button data-m="enc" class="on">🔒 암호화</button><button data-m="dec">🔓 복호화</button></div>
      <div class="ec-key"><button class="btn ghost sm" data-k="-1" aria-label="키 1 줄이기">◀</button><input type="range" min="0" max="25" value="3" id="cKey" aria-label="키"><button class="btn ghost sm" data-k="1" aria-label="키 1 늘리기">▶</button><span>키 <b id="cKeyV">3</b></span></div></div>
    <div class="ec-wheel" id="cWheel"></div>
    <div class="grid2 even" style="margin-top:10px"><div><label class="ec-lab" id="cInL">평문 입력</label><textarea id="cIn" rows="2" spellcheck="false">HELLO DATA</textarea></div><div><label class="ec-lab" id="cOutL">암호문</label><div class="ec-out mono" id="cOut"></div></div></div>
    <div class="ec-mis">
      <div><b>미션 A · 키를 알 때</b> 선생님이 보낸 암호문이에요. 키는 <b>3</b>이에요.<div class="mono ec-code">${MA}</div>
        <div class="row"><button class="btn ghost sm" data-load="A">입력 칸에 넣기</button><input type="text" id="cAnsA" placeholder="해독한 평문" aria-label="미션 A 평문"><button class="btn sm" id="cChkA">확인</button></div><div class="fb" id="cFbA"></div></div>
      <div><b>미션 B · 키를 모를 때</b> 누군가 보낸 암호문이에요. 「입력 칸에 넣기」를 누르면 <b>복호화 모드</b>로 바뀌어요. 키를 0부터 ▶로 하나씩 올리며 오른쪽 결과가 영어 문장으로 읽히는 키를 찾아요.<div class="mono ec-code">${MB}</div>
        <div class="row"><button class="btn ghost sm" data-load="B">입력 칸에 넣기</button><input type="number" id="cAnsB" min="0" max="25" placeholder="찾은 키" aria-label="미션 B 키"><button class="btn sm" id="cChkB">확인</button></div><div class="fb" id="cFbB"></div></div>
    </div>`;
  const key=$('cKey'), inp=$('cIn');
  function draw(){const k=+key.value; $('cKeyV').textContent=k; const A='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if(mode==='dec'&&bOn) tried.add(k);
    $('cWheel').innerHTML=`<div class="r"><small>평문</small>${[...A].map(c=>`<span>${c}</span>`).join('')}</div><div class="r"><small>암호문</small>${[...A].map(c=>`<span class="s">${ecShift(c,k)}</span>`).join('')}</div>`;
    $('cInL').textContent=mode==='enc'?'평문 입력':'암호문 입력'; $('cOutL').textContent=mode==='enc'?'암호문 (위 줄 글자 → 아래 줄 글자)':'평문 (아래 줄 글자 → 위 줄 글자)';
    $('cOut').textContent=ecShift(inp.value,mode==='enc'?k:-k)||' ';}
  function setMode(m){mode=m; B.querySelectorAll('.ec-mode button').forEach(b=>b.classList.toggle('on',b.dataset.m===m)); draw();}
  B.querySelectorAll('.ec-mode button').forEach(b=>b.onclick=()=>setMode(b.dataset.m));
  B.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{key.value=(+key.value+ +b.dataset.k+26)%26; draw();});
  key.oninput=draw; inp.oninput=()=>{bOn=ecNorm(inp.value)===ecNorm(MB); draw();};
  B.querySelectorAll('[data-load]').forEach(b=>b.onclick=()=>{const A=b.dataset.load==='A'; inp.value=A?MA:MB; bOn=!A; if(!A){tried=new Set(); key.value=0;} setMode('dec');});
  $('cChkA').onclick=()=>{const ok=ecNorm($('cAnsA').value)==='SEEYOUATTHELIBRARY';
    $('cFbA').innerHTML=ok?'<span class="ok">맞아요!</span> 키를 알면 복호화는 간단해요.':'<span class="ng">다시 해 봐요.</span> 「입력 칸에 넣기」를 누르고 키를 3에 맞춘 뒤 복호화 결과를 읽어요.';};
  $('cChkB').onclick=()=>{const v=+$('cAnsB').value, ok=$('cAnsB').value!==''&&v===11;
    if(ok){MEMO.caesarKey=`미션 B · 키 11을 찾음 (키를 바꿔 본 횟수 ${Math.max(1,tried.size)}번)`; ecSave();}
    $('cFbB').innerHTML=ok?`<span class="ok">맞아요!</span> 키를 몰라도 <b>${Math.max(1,tried.size)}번</b> 바꿔 보고 찾았어요. 키가 될 수 있는 수는 몇 가지뿐일까요?`:'<span class="ng">아직이에요.</span> 복호화 모드에서 키를 0부터 하나씩 바꾸며 영어 문장으로 읽히는 키를 찾아요.';};
  draw();
})();

/* 03 전치 암호 */
(function(){
  const TP='SAVE THE EARTH', TK=[3,1,4,2], TC=ecTrans(TP,TK,false).res, SP='정보를안전하게지켜요', SC=ecScyEnc(SP,4);
  document.querySelectorAll('#txTabs button').forEach(b=>b.onclick=()=>{document.querySelectorAll('#txTabs button').forEach(x=>x.classList.toggle('on',x===b)); $('txLab').hidden=b.dataset.t!=='0'; $('scyLab').hidden=b.dataset.t!=='1';});
  const B=$('txLab'); let mode='enc';
  B.innerHTML=`<div class="row ec-ctl"><div class="ec-mode"><button data-m="enc" class="on">🔒 암호화</button><button data-m="dec">🔓 복호화</button></div>
      <label class="ec-lab" style="margin:0">키 <input type="text" id="tKey" value="312" maxlength="9" style="width:110px" aria-label="키"></label><button class="btn ghost sm" id="tEx">교과서 예제 1 불러오기</button></div>
    <label class="ec-lab" id="tInL">평문 입력</label><input type="text" id="tIn" value="roma at six" spellcheck="false" style="width:100%">
    <div class="ec-blocks" id="tBlocks"></div>
    <div class="ec-res"><span id="tOutL">암호문</span> <b class="mono" id="tOut"></b> <small class="muted" id="tInv"></small></div>
    <div class="ec-mis one"><div><b>미션 · 전치 암호문 해독하기</b> 키 <b class="mono">${TK.join('')}</b>로 암호화한 암호문이에요.<div class="mono ec-code">${TC}</div>
      <div class="row"><button class="btn ghost sm" id="tLoad">입력 칸에 넣기</button><input type="text" id="tAns" placeholder="해독한 평문" aria-label="해독한 평문"><button class="btn sm" id="tChk">확인</button></div><div class="fb" id="tFb"></div></div></div>`;
  function draw(){const ks=$('tKey').value.trim(), key=ecKeyOk(ks), t=$('tIn').value;
    $('tInL').textContent=mode==='enc'?'평문 입력':'암호문 입력'; $('tOutL').textContent=mode==='enc'?'암호문':'평문';
    if(!key){$('tBlocks').innerHTML='<p class="ng" style="margin:6px 0">키는 1부터 키 길이까지의 숫자를 한 번씩 써요. 예: 312, 2413</p>'; $('tOut').textContent=''; $('tInv').textContent=''; return;}
    const R=ecTrans(t,key,mode==='dec');
    $('tBlocks').innerHTML=R.blocks.map(([blk,res,p])=>`<div class="bk"><div class="r">${blk.map((c,i)=>`<span><i>${i+1}</i>${esc(c)}</span>`).join('')}</div><div class="ar">${mode==='enc'?`키 ${p.join('')} 순서로 가져오기`:`암호문 글자 → 평문 자리: ${p.map((d,i)=>`${i+1}번째→${d}번째`).join(', ')}`} ↓</div><div class="r">${res.map((c,i)=>`<span class="o"><i>${mode==='enc'?p[i]:i+1}</i>${esc(c==null?'':c)}</span>`).join('')}</div></div>`).join('')||'<p class="muted">글자를 입력해 보세요.</p>';
    $('tOut').textContent=R.res; $('tInv').textContent=`· 복호화할 때는 ${ecInv(key)} 순서로 재배열하는 것과 같아요`;}
  B.querySelectorAll('.ec-mode button').forEach(b=>b.onclick=()=>{mode=b.dataset.m; B.querySelectorAll('.ec-mode button').forEach(x=>x.classList.toggle('on',x===b)); draw();});
  $('tKey').oninput=draw; $('tIn').oninput=draw;
  $('tEx').onclick=()=>{$('tKey').value='312'; $('tIn').value='roma at six'; B.querySelector('[data-m=enc]').click();};
  $('tLoad').onclick=()=>{$('tKey').value=TK.join(''); $('tIn').value=TC; B.querySelector('[data-m=dec]').click();};
  $('tChk').onclick=()=>{const ok=ecNorm($('tAns').value)===ecNorm(TP);
    if(ok){MEMO.transDone=`단순 전치 미션 해독 성공 (키 ${TK.join('')})`; ecSave();}
    $('tFb').innerHTML=ok?'<span class="ok">맞아요!</span> 키를 알면 글자를 원래 자리로 되돌릴 수 있어요.':'<span class="ng">다시 해 봐요.</span> 「입력 칸에 넣기」를 누르면 복호화 모드로 바뀌어요. 결과를 읽어 적어요.';};
  draw();

  const S=$('scyLab');
  S.innerHTML=`<p class="muted" style="margin-top:0">막대에 감았던 종이 띠를 펼쳤더니 아래처럼 보여요. 막대 굵기(한 바퀴에 감기는 글자 수)를 바꿔 다시 감아 보고, 읽을 수 있는 굵기를 찾아요.</p>
    <div class="ec-strip">${[...SC].map(c=>`<span>${c}</span>`).join('')}</div>
    <div class="ec-key" style="margin:10px 0"><span>한 바퀴에 감기는 글자 수</span><input type="range" min="2" max="6" value="2" id="sK" aria-label="막대 굵기"><b id="sKV">2</b></div>
    <div class="ec-rod" id="sRod"></div>
    <div class="ec-res">가로로 읽으면 <b id="sOut"></b></div>
    <div class="row"><input type="number" id="sAns" min="2" max="6" placeholder="찾은 글자 수" aria-label="찾은 글자 수"><button class="btn sm" id="sChk">확인</button></div><div class="fb" id="sFb"></div>`;
  function drawS(){const k=+$('sK').value, ch=[...SC], n=ch.length, C=Math.ceil(n/k); $('sKV').textContent=k;
    let h=''; const rows=[]; for(let r=0;r<k;r++){let row=''; let t=''; for(let c=0;c<C;c++){const j=c*k+r; if(j<n){row+=`<span style="--d:${c}">${ch[j]}</span>`; t+=ch[j];} else row+='<span class="e"></span>';} rows.push(t); h+=`<div class="r">${row}</div>`;}
    $('sRod').innerHTML=h; $('sOut').textContent=rows.join('');}
  $('sK').oninput=drawS;
  $('sChk').onclick=()=>{const ok=+$('sAns').value===4; if(ok){MEMO.scyKey='스키테일 · 읽히는 막대 굵기를 찾음'; ecSave();}
    $('sFb').innerHTML=ok?'<span class="ok">맞아요!</span> 같은 굵기의 막대가 있어야 읽혀요. 그런데 굵기는 몇 가지만 해 보면 찾을 수 있었지요?':'<span class="ng">아직이에요.</span> 막대 굵기를 바꾸며 가로로 읽은 문장이 자연스러운 굵기를 찾아요.';};
  drawS();
})();

/* 04 해시 함수 실험실 */
(function(){
  const B=$('hashLab'), D='우리 반 단합 대회는 금요일입니다.';
  B.innerHTML=`<p style="margin-top:0"><b>① 메시지를 아주 조금만 고쳐 보기</b> <span class="muted" style="font-size:.88rem">아래 칸의 마침표를 지우거나 글자 하나만 바꿔 보세요.</span></p>
    <div class="grid2 even"><div><label class="ec-lab">원본 메시지</label><textarea id="hA" rows="2">${D}</textarea><div class="ec-hash mono" id="hAH"></div></div>
      <div><label class="ec-lab">고친 메시지</label><textarea id="hB" rows="2">${D}</textarea><div class="ec-hash mono" id="hBH"></div></div></div>
    <div class="ec-res" id="hRes"></div>
    <div class="row"><button class="btn sm" id="hRec">결과 기록하기</button></div><div class="fb" id="hRecFb"></div>
    <hr class="ec-hr">
    <p><b>② 비밀번호를 해시값으로 저장하는 웹 사이트 흉내</b> <span class="ng" style="font-size:.88rem">실제로 쓰는 비밀번호는 넣지 마세요.</span> <span class="muted" style="font-size:.85rem">입력한 값은 어디에도 저장되지 않아요.</span></p>
    <div class="grid2 even"><div class="ec-site"><b>회원 가입</b><div class="row"><input type="text" id="pJoin" placeholder="연습용 비밀번호" autocomplete="off" aria-label="가입할 비밀번호"><button class="btn sm" id="pJoinB">가입</button></div><div class="ec-db" id="pDb">서버에 저장된 값: (아직 없음)</div></div>
      <div class="ec-site"><b>로그인</b><div class="row"><input type="text" id="pLog" placeholder="비밀번호 입력" autocomplete="off" aria-label="로그인 비밀번호"><button class="btn sm" id="pLogB">로그인</button></div><div class="fb" id="pFb"></div></div></div>`;
  function draw(){const a=$('hA').value, b=$('hB').value, ha=ecSha256(a), hb=ecSha256(b); let n=0;
    $('hAH').textContent=ha; $('hBH').innerHTML=[...hb].map((c,i)=>c===ha[i]?c:(n++,`<mark>${c}</mark>`)).join('');
    $('hRes').innerHTML=a===b?'두 메시지가 <b>같아서</b> 해시값도 똑같아요. 오른쪽 메시지를 조금만 고쳐 보세요.':`메시지는 조금 달라졌는데 해시값은 64자리 가운데 <b>${n}자리</b>가 달라졌어요(노란 칸). 메시지 길이가 달라도 해시값은 늘 64자리예요.`;
    return n;}
  $('hA').oninput=draw; $('hB').oninput=draw;
  $('hRec').onclick=()=>{const a=$('hA').value, b=$('hB').value; if(a===b){$('hRecFb').innerHTML='<span class="ng">먼저 오른쪽 메시지를 조금 고쳐 보세요.</span>'; return;}
    const n=draw(); MEMO.hashTry=`「${a.slice(0,30)}」 → 「${b.slice(0,30)}」: 해시값 64자리 중 ${n}자리가 달라짐`; ecSave(); $('hRecFb').innerHTML='<span class="ok">기록했어요.</span> 마무리 화면의 메모 모아 보기에서 볼 수 있어요.';};
  let saved=null;
  $('pJoinB').onclick=()=>{const v=$('pJoin').value; if(!v){$('pDb').textContent='비밀번호를 입력해요.'; return;} saved=ecSha256(v); $('pJoin').value=''; $('pDb').innerHTML=`서버에 저장된 값(해시값): <span class="mono">${saved}</span><br><small class="muted">서버는 비밀번호 원문을 저장하지 않아요. 이 값으로 원래 비밀번호를 알아낼 수 있을까요?</small>`;};
  $('pLogB').onclick=()=>{if(!saved){$('pFb').innerHTML='<span class="ng">먼저 회원 가입을 해요.</span>'; return;} const h=ecSha256($('pLog').value), ok=h===saved;
    $('pFb').innerHTML=`입력값의 해시값: <span class="mono">${h.slice(0,16)}…</span><br>${ok?'<span class="ok">저장된 해시값과 같아요 → 로그인 성공!</span>':'<span class="ng">저장된 해시값과 달라요 → 로그인 실패</span>'} <small class="muted">비밀번호를 되돌리지 않고 해시값끼리 비교했어요.</small>`;};
  draw();
})();

/* 05 키 흐름 따라가기 */
(function(){
  const KY={sec:['🗝️','비밀키','#1f9d74'],mPub:['🔑','민서의 공개키','#2f6fd0'],mPri:['🔑','민서의 개인키','#d64535'],jPub:['🔑','지우의 공개키','#0f8fa6'],jPri:['🔑','지우의 개인키','#9b4fc4']};
  const SC=[
    {n:'대칭 암호화',mid:'🌐 통신망 · 👀 엿보는 사람',steps:[
      {t:'지우가 민서에게 「내일 3시 도서관」이라는 비밀 메시지를 보내려고 해요. 대칭 암호화는 송수신자가 <b>같은 키</b>를 쓰므로, 먼저 비밀키 하나를 정해요.',s:{j:['sec']},m:['j',null]},
      {t:'민서도 같은 비밀키가 있어야 복호화할 수 있어요. 지우가 비밀키를 민서에게 전달해요. 그런데 전달하는 과정에서 키를 잃어버리거나 엿보는 사람이 가로챌 수도 있어요. 이것이 <b>키 배송 문제</b>예요.',s:{j:['sec'],e:['sec?'],r:['sec']},m:['j',null]},
      {q:'지우는 평문을 무엇으로 암호화할까요?',o:['민서와 나눠 가진 비밀키','지우만 아는 다른 키'],ok:'맞아요. 민서가 가진 키와 같은 키로 잠가야 민서가 풀 수 있어요.',ng:'민서는 그 키를 가지고 있지 않아요. 민서도 풀 수 있는 키를 골라요.',s:{j:['sec'],e:['sec?'],r:['sec']},m:['j','sec']},
      {q:'통신망에서 엿보는 사람이 암호문을 가로챘어요. 이 암호문을 풀려면 무엇이 필요할까요?',o:['같은 비밀키','아무 키나','키 없이도 읽을 수 있다'],ok:'맞아요. 암호문을 도둑맞아도 비밀키가 없으면 복호화할 수 없어요. 하지만 키를 전달할 때 가로챘다면 풀 수 있겠죠?',ng:'암호문은 같은 키가 있어야 풀려요.',s:{j:['sec'],e:['sec?'],r:['sec']},m:['e','sec']},
      {q:'암호문이 민서에게 도착했어요. 민서는 무엇으로 복호화할까요?',o:['같은 비밀키','민서가 새로 만든 키'],ok:'맞아요. 같은 키로 암호화·복호화하니 「대칭」이에요. 암호화 속도가 빨라요.',ng:'잠근 키와 같은 키가 있어야 열려요.',s:{j:['sec'],e:['sec?'],r:['sec']},m:['r','sec'],end:['r',null]},
      {q:'지우가 반 친구 10명과 각각 따로 비밀 메시지를 주고받으려면, 지우가 관리할 비밀키는 몇 개일까요?',o:['1개','10개','100개'],ok:'맞아요. 개인마다 키를 따로 교환해야 해서 관리할 키가 많아져요. 사용자가 10만 명이면 10만 개를 보관해야 해요.',ng:'친구마다 다른 키를 따로 나눠 가져야 해요.',s:{j:['sec'],r:['sec']},m:['r',null]}]},
    {n:'비대칭 · 기밀성 유지',mid:'🌐 통신망 · 👀 엿보는 사람',steps:[
      {t:'이번에는 키를 몰래 주고받지 않아요. 비대칭 암호화는 송수신자가 <b>서로 다른 키</b>를 가져요. 받는 사람인 민서가 한 쌍의 키를 가지고 있어요. 누구에게 보여 줘도 되는 <b>공개키</b>와 민서만 가지는 <b>개인키</b>예요.',s:{r:['mPub','mPri']},m:['j',null]},
      {t:'민서가 공개키를 공개해요. 지우도, 엿보는 사람도 민서의 공개키를 가질 수 있어요.',s:{j:['mPub'],e:['mPub'],r:['mPub','mPri']},m:['j',null]},
      {q:'지우는 「민서야, 너만 봐」 메시지를 무엇으로 암호화할까요?',o:['민서의 공개키','민서의 개인키','지우가 정한 비밀키'],ok:'맞아요. 공개키로 암호화하면 문서에 대한 접근을 통제하고 기밀성을 유지할 수 있어요.',ng:'지우가 가진 키를 살펴봐요. 민서의 개인키는 민서만 가지고 있고, 비밀키는 민서와 나눠 가진 적이 없어요.',s:{j:['mPub'],e:['mPub'],r:['mPub','mPri']},m:['j','mPub']},
      {q:'엿보는 사람이 암호문을 가로챘어요. 엿보는 사람도 민서의 공개키를 가지고 있는데, 이 암호문을 풀 수 있을까요?',o:['풀 수 없다','풀 수 있다'],ok:'맞아요. 공개키로 암호화한 것은 쌍을 이루는 개인키로만 풀 수 있어요. 그래서 공개키는 누구에게 보여 줘도 괜찮아요.',ng:'잠근 키(공개키)와 쌍을 이루는 다른 키가 있어야 열려요.',s:{j:['mPub'],e:['mPub'],r:['mPub','mPri']},m:['e','mPub']},
      {q:'암호문이 민서에게 도착했어요. 민서는 무엇으로 복호화할까요?',o:['민서의 개인키','민서의 공개키'],ok:'맞아요. 개인키는 도장처럼 본인만 가지고 다른 사람에게 노출되지 않게 관리해요. 키를 교환하지 않아도 되지만 처리 속도는 느려요.',ng:'공개키로 잠근 것은 공개키로 열리지 않아요.',s:{j:['mPub'],e:['mPub'],r:['mPub','mPri']},m:['r','mPub'],end:['r',null]}]},
    {n:'비대칭 · 전자 서명',opt:1,mid:'🏛️ 공인 인증 기관 · 🌐 통신망',steps:[
      {t:'지우는 공인 인증 기관(CA)에서 개인키와 공개키 한 쌍을 발급받았어요. 공인 인증 기관은 개인키와 공개키를 생성·발급·관리해요.',s:{j:['jPri','jPub'],e:['jPub']},m:['j',null]},
      {q:'지우가 「이 계약서는 내가 보냈어요」를 증명하려고 해요. 무엇으로 암호화해 전자 서명을 만들까요?',o:['지우의 개인키','지우의 공개키','민서의 공개키'],ok:'맞아요. 전자 서명은 이용자의 개인키로 만들어요. 지우의 개인키는 지우만 가지고 있으니까요.',ng:'누구나 가질 수 있는 키로 서명하면 지우가 보냈다는 증거가 되지 않아요.',s:{j:['jPri','jPub'],e:['jPub']},m:['j','jPri']},
      {t:'서명된 문서가 민서에게 도착했어요. 민서는 공인 인증 기관에 「지우의 공개키를 주세요」라고 요청해 받아요.',s:{j:['jPri','jPub'],e:['jPub'],r:['jPub']},m:['r','jPri']},
      {q:'민서는 무엇으로 복호화해서 지우가 보낸 것인지 확인할까요?',o:['지우의 공개키','지우의 개인키','민서의 개인키'],ok:'맞아요. 「진짜 지우라면 이 공개키로 복호화될 거야.」 풀리면 지우의 개인키로 서명한 것이 맞아요.',ng:'지우의 개인키로 잠근 것은 그와 쌍을 이루는 키로 열려요. 민서가 받은 키를 살펴봐요.',s:{j:['jPri','jPub'],e:['jPub'],r:['jPub']},m:['r','jPri'],end:['r',null]},
      {q:'누군가 지우인 척하며 자기 개인키로 서명한 문서를 보냈어요. 민서가 지우의 공개키로 복호화하면 어떻게 될까요?',o:['풀리지 않아 가짜임을 알 수 있다','풀려서 지우가 보낸 것으로 보인다'],ok:'맞아요. 지우의 공개키는 지우의 개인키와만 쌍을 이루므로, 다른 사람의 서명은 풀리지 않아요. 그래서 본인 확인에 쓰여요.',ng:'공개키는 쌍을 이루는 개인키로 잠근 것만 풀 수 있어요.',s:{j:['jPri','jPub'],e:['jPub'],r:['jPub']},m:['r',null]}]},
  ];
  const B=$('keyFlow'); let sc=0, st=0, miss=0, answered=false; const done=new Set(store.get(MK+'|kf',[]));
  const perm=(n,seed)=>{const a=[...Array(n).keys()]; let h=seed*2654435761>>>0; for(let i=n-1;i>0;i--){h=(Math.imul(h^(h>>>13),1597334677)+i)>>>0; const j=h%(i+1); [a[i],a[j]]=[a[j],a[i]];} return a;};
  const chip=k=>{const q=k.endsWith('?'), id=q?k.slice(0,-1):k; return `<span class="ec-k${q?' maybe':''}" style="--k:${KY[id][2]}">${KY[id][0]} ${KY[id][1]}${q?' (가로챌 수도…)':''}</span>`;};
  let fin=false;
  function render(){const S=SC[sc], P=S.steps[st], m=(fin||answered)&&P.end?P.end:P.m;
    const msg=w=>m[0]===w?`<div class="ec-msg ${m[1]?'lk':''}" style="--k:${m[1]?KY[m[1]][2]:'#8a94a3'}">${m[1]?`🔒 암호문<small>${KY[m[1]][1]}(으)로 잠금</small>`:'📄 평문'}</div>`:'';
    const col=(w,ic,nm)=>`<div class="col"><div class="nm">${ic} ${nm}</div><div class="ks">${(P.s[w]||[]).map(chip).join('')||'<span class="muted" style="font-size:.8rem">열쇠 없음</span>'}</div>${msg(w)}</div>`;
    const ord=P.q?perm(P.o.length,sc*10+st+3):[], need=SC.filter(x=>!x.opt), allNeed=need.every(x=>done.has(x.n));
    let say;
    if(fin){const nx=SC.findIndex(x=>!done.has(x.n));
      say=`<p class="ok">✔ 「${S.n}」 흐름을 마쳤어요.</p>${allNeed?'<p>🎉 꼭 할 두 흐름(① 대칭, ② 기밀성 유지)을 모두 마쳤어요. 아래 비교 표를 채워 봐요.'+(done.size<SC.length?' 시간이 남으면 ③ 전자 서명도 해 봐요(선택).':'')+'</p>':''}
        <div class="row">${nx>=0?`<button class="btn sm" data-go="${nx}">${SC[nx].n}${SC[nx].opt?' (선택)':''} 하러 가기 →</button>`:''}<button class="btn ghost sm" data-go="${sc}">이 흐름 다시 보기</button></div>`;}
    else say=`<span class="muted">장면 ${st+1} / ${S.steps.length}</span><p>${P.t||P.q}</p>${P.q?`<div class="row">${ord.map(i=>`<button class="btn ${answered&&i===0?'':'ghost '}sm" data-o="${i}" ${answered?'disabled':''}>${P.o[i]}</button>`).join('')}</div><div class="fb">${answered?`<span class="ok">${P.ok}</span>`:''}</div>`:''}`;
    B.innerHTML=`<div class="ec-scn">${SC.map((x,i)=>`<button data-s="${i}" class="${i===sc?'on':''}">${done.has(x.n)?'✔ ':''}${['①','②','③'][i]} ${x.n}${x.opt?' (선택)':''}</button>`).join('')}</div>
      <div class="ec-stage">${col('j','👧','지우 · 보내는 사람')}${col('e','',S.mid)}${col('r','🧑','민서 · 받는 사람')}</div>
      <div class="ec-say">${say}</div>
      ${fin?'':`<div class="row"><button class="btn ghost sm" data-nav="-1" ${st?'':'disabled'}>← 이전 장면</button><button class="btn sm" data-nav="1" ${P.q&&!answered?'disabled':''}>${st<S.steps.length-1?'다음 장면 →':'이 흐름 마치기 ✓'}</button></div>`}`;
    const open=i=>{sc=i; st=0; answered=false; fin=false; render();};
    B.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>open(+b.dataset.s));
    B.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>open(+b.dataset.go));
    B.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{if(+b.dataset.o===0){answered=true; render();}
      else{miss++; B.querySelector('.ec-say .fb').innerHTML=`<span class="ng">다시 생각해 봐요.</span> ${P.ng}`;}});
    B.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>{const d=+b.dataset.nav;
      if(d>0&&st===S.steps.length-1){done.add(S.n); store.set(MK+'|kf',[...done]); MEMO.keyFlow=SC.filter(x=>done.has(x.n)).map(x=>x.n+' ✓').join(' · ')+` (다시 고른 횟수 ${miss}번)`; ecSave(); fin=true; render(); return;}
      st=Math.max(0,st+d); answered=false; render();});
  }
  render();
})();

/* 06 맞춤 활동 · 암호화하고 압축하기 */
(function(){
  const P='BLUEBERRYJAM', K=[4,1,3,2], C=ecTrans(P,K,false).res, ORD=[]; for(const c of C) if(!ORD.includes(c)) ORD.push(c);
  const B=$('mixLab');
  B.innerHTML=`<div class="ec-step"><b>① 암호화</b> 키 4132로 단순 전치 암호화한 결과는? <div class="row"><input type="text" id="mxC" maxlength="20" placeholder="암호문 12글자" aria-label="암호문"><button class="btn sm" id="mxCB">확인</button></div><div class="fb" id="mxCF"></div></div>
    <div class="ec-step"><b>② 사전 만들기</b> 암호문에 등장하는 순서대로 코드에 해당하는 문자를 적어요.
      <table class="ec-tbl ec-dict"><tr><th>코드</th>${ORD.map((_,i)=>`<td class="mono">${(i+1).toString(2).padStart(4,'0')}</td>`).join('')}</tr><tr><th>데이터</th>${ORD.map((_,i)=>`<td><input type="text" maxlength="1" data-d="${i}" aria-label="코드 ${i+1}의 문자"></td>`).join('')}</tr></table>
      <div class="row"><button class="btn sm" id="mxDB">확인</button></div><div class="fb" id="mxDF"></div></div>
    <div class="ec-step"><b>③ 압축률 구하기</b> 원본 <input type="number" id="mxO" style="width:80px" aria-label="원본 비트 수">bits ÷ 압축 데이터 <input type="number" id="mxZ" style="width:80px" aria-label="압축 데이터 비트 수">bits <button class="btn sm" id="mxRB">확인</button><div class="fb" id="mxRF"></div></div>`;
  const st={c:false,d:false,r:false}, rec=()=>{MEMO.mixDone=`암호화 ${st.c?'✓':'–'} · 사전 ${st.d?'✓':'–'} · 압축률 ${st.r?'✓':'–'}`; ecSave();};
  $('mxCB').onclick=()=>{st.c=ecNorm($('mxC').value)===C; $('mxCF').innerHTML=st.c?'<span class="ok">맞아요!</span> 네 글자씩 나눠 키 순서대로 재배치했어요.':'<span class="ng">다시 해 봐요.</span> 네 글자씩 나눈 뒤, 각 묶음에서 4번째·1번째·3번째·2번째 글자 순서로 적어요. 03 화면의 전치 암호기로 확인해도 돼요.'; rec();};
  $('mxDB').onclick=()=>{const v=[...B.querySelectorAll('[data-d]')].map(x=>x.value.toUpperCase()); st.d=v.every((x,i)=>x===ORD[i]);
    $('mxDF').innerHTML=st.d?`<span class="ok">맞아요!</span> 문자가 ${ORD.length}종류라 코드는 4비트예요.`:(st.c?'<span class="ng">다시 해 봐요.</span> 암호문을 앞에서부터 읽으며 처음 나온 문자부터 차례대로 적어요.':'<span class="ng">먼저 ①의 암호문을 맞혀 봐요.</span>'); rec();};
  $('mxRB').onclick=()=>{st.r=+$('mxO').value===P.length*8&&+$('mxZ').value===P.length*4;
    $('mxRF').innerHTML=st.r?`<span class="ok">맞아요!</span> 압축률은 ${P.length*8} / ${P.length*4} = 2. 문자 종류가 많아 코드가 길어지면 압축률이 낮아져요. 암호화해도 글자 수와 종류는 같아서 압축률은 그대로예요.`:'<span class="ng">다시 계산해 봐요.</span> 1byte = 8bits이고, 압축 데이터는 글자 수 × 코드의 비트 수예요.'; rec();};
})();

/* 06 개념 정리 · 성취도 · 선택 활동 */
document.querySelectorAll('.ec-blank').forEach(b=>b.onclick=()=>{const on=!b.classList.contains('on'); b.textContent=on?b.dataset.a:'?'; b.classList.toggle('on',on);});
chips('selfCheck','selfCheckPick',['압축과 암호화가 왜 필요한지 예를 들어 말할 수 있다','문자열을 직접 암호화하고 압축해 압축률을 구할 수 있다','내 데이터를 안전하게 지키는 습관을 실천하려고 한다'],true);
vote('extraVote','extraPick',[['보충','짝에게 보낼 비밀 쪽지 규칙 만들기'],['심화','인공지능을 쓰는 압축 기술 찾아보기']],i=>{$('extraBasic').classList.toggle('on',i===0); $('extraDeep').classList.toggle('on',i===1);});

/* 07 마무리 */
const MEMOLIST=[['hideIdea','처음 생각 · 내용을 들키지 않게 하는 방법'],['caesarKey','카이사르 미션 B 기록'],['caesarLimit','치환형 암호화의 한계'],['ck1','성취도 · 치환형 암호화'],['transDone','단순 전치 미션 기록'],['scyKey','스키테일 미션 기록'],['transLimit','전치형 암호화의 한계'],['ck2','성취도 · 전치형 암호화'],['hashTry','해시값 비교 기록'],['hashWhy','해시값이 달라진 모습과 비밀번호 저장의 좋은 점'],['ck3','성취도 · 단방향 암호화'],['keyFlow','키 흐름 따라가기 기록'],['cmpSymSend','대칭 · 키 전송 여부'],['cmpAsymSend','비대칭 · 키 전송 여부'],['cmpAsymGood','비대칭 · 장점'],['cmpSymBad','대칭 · 단점'],['symWhy','대칭 암호화를 쓰는 이유와 중요성'],['ck4','성취도 · 대칭·비대칭 암호화'],['whyBoth','압축과 암호화의 중요성·필요성'],['mixDone','암호화하고 압축하기'],['ecoAct1','지속 가능한 데이터 사용 실천 1'],['ecoAct2','지속 가능한 데이터 사용 실천 2'],['selfCheckPick','학업 성취도 점검'],['extraPick','고른 선택 활동'],['myRule','보충 · 나의 암호화 규칙'],['myPlain','보충 · 원본 문장'],['myCipher','보충 · 암호 문장'],['aiTech','심화 · 조사한 압축 기술'],['aiGood','심화 · 기존 코덱보다 좋은 점'],['keyQ','핵심 질문에 대한 내 답'],['newLearn','새롭게 알게 된 점']];
onShow[7]=()=>{const p=(MEMO.hideIdea||'').trim(); $('prevIdea').innerHTML=`<b>처음 생각</b> ${p?esc(p):'<span class="muted">(시작 화면에 아직 안 씀)</span>'}`; memoSummary('msum',MEMOLIST);};
