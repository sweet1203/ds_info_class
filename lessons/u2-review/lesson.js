/* 01 문제 상황 이해 */
chips('accidentPick','accidentPickName',['교통사고','익사','미아','안전 불감증','기타'],false);

/* 02 데이터 분석 계획: 고르기 */
chips('collectPick','collectPickName',['공공 데이터','민간 데이터','웹크롤링','직접 수집(설문, 촬영, 센서)'],true);
chips('prepPick','prepPickName',['결측치 처리','이상치 제거','중복 항목 제거','데이터 합치기','구간 나누기','필요 없는 속성 빼기'],true);
chips('vizPick','vizPickName',['박스 플롯','히스토그램(분포도)','산점도','막대그래프','선그래프','원그래프','지도','워드 클라우드'],true);
chips('sketchType','sketchTypePick',['막대그래프','선그래프','원그래프'],false);

/* 02 시각화 스케치: 「항목: 값」 줄을 읽어 작은 그래프 그리기 */
const SW=520, SH=280, SL=50, SR=14, ST=16, SB=46;
const SC=['#2f6fd0','#e0702b','#1f9d74','#9b4fc4','#d64535','#f2a516','#5b6776','#0f9fb0','#b5527a','#7a8b2a','#8a5a2b','#3b4a8f'];
const r2F=v=>Math.abs(v)>=1000?Math.round(v).toLocaleString('ko-KR'):String(+(+v).toFixed(1));
function r2Ticks(hi){ if(hi<=0) hi=1; const raw=hi/5, mag=Math.pow(10,Math.floor(Math.log10(raw))), st=[1,2,5,10].map(k=>k*mag).find(k=>hi/k<=5)||10*mag, t=[]; for(let v=0; v<=Math.ceil(hi/st)*st+st/2; v+=st) t.push(+v.toFixed(6)); return t; }
function r2Parse(s){
  return String(s||'').split('\n').map(l=>l.trim()).filter(Boolean).map(l=>{
    const m=l.match(/^(.*?)[\s:：,=]+(-?[\d,]+(?:\.\d+)?)\s*[^\d]*$/); if(!m) return null;
    const v=parseFloat(m[2].replace(/,/g,'')); return m[1].trim()&&isFinite(v)&&v>=0?[m[1].trim().slice(0,12),v]:null;
  }).filter(Boolean).slice(0,12);
}
function r2Chart(rows,type){
  if(rows.length<2) return '<div class="r2-empty">「항목: 값」을 두 줄 이상 적으면 그래프가 나타나요.</div>';
  const L=rows.map(r=>r[0]), V=rows.map(r=>r[1]); let s='';
  if(type==='원그래프'){
    const sum=V.reduce((a,b)=>a+b,0)||1, cx=140, cy=140, r=110; let a0=-Math.PI/2;
    const p=a=>`${cx+r*Math.cos(a)},${cy+r*Math.sin(a)}`;
    V.forEach((v,i)=>{const a1=a0+v/sum*Math.PI*2; s+=`<path d="M${cx},${cy} L${p(a0)} A${r},${r} 0 ${a1-a0>Math.PI?1:0} 1 ${p(Math.min(a1,a0+Math.PI*2-1e-4))} Z" style="fill:${SC[i%SC.length]};stroke:#fff;stroke-width:2"/>`; a0=a1;});
    const gap=Math.min(24,240/L.length);
    s+=L.map((l,i)=>`<rect x="290" y="${24+i*gap}" width="13" height="13" rx="3" style="fill:${SC[i%SC.length]}"/><text x="310" y="${35+i*gap}" class="r2-lg">${esc(l)} · ${Math.round(V[i]/sum*100)}%</text>`).join('');
  } else {
    const t=r2Ticks(Math.max(...V)), top=t[t.length-1], y=v=>SH-SB-(v/top)*(SH-SB-ST), bw=(SW-SL-SR)/L.length, cx=i=>SL+bw*(i+.5);
    s+=t.map(v=>`<line x1="${SL}" x2="${SW-SR}" y1="${y(v)}" y2="${y(v)}" class="r2-grid"/><text x="${SL-6}" y="${y(v)+4}" class="r2-tk e">${r2F(v)}</text>`).join('');
    if(type==='선그래프') s+=`<polyline points="${V.map((v,i)=>cx(i)+','+y(v)).join(' ')}" style="fill:none;stroke:${SC[1]};stroke-width:2.5"/>`+V.map((v,i)=>`<circle cx="${cx(i)}" cy="${y(v)}" r="4" style="fill:${SC[1]}"/>`).join('');
    else s+=V.map((v,i)=>`<rect x="${cx(i)-bw*.33}" y="${y(v)}" width="${bw*.66}" height="${SH-SB-y(v)}" rx="2" style="fill:${SC[0]}"/>`).join('');
    s+=`<line x1="${SL}" x2="${SW-SR}" y1="${SH-SB}" y2="${SH-SB}" class="r2-axl"/>`+L.map((l,i)=>(L.length>9&&i%2)?'':`<text x="${cx(i)}" y="${SH-SB+18}" class="r2-tk m">${esc(L.length>6&&l.length>4?l.slice(0,4)+'…':l)}</text>`).join('');
  }
  return `<svg viewBox="0 0 ${SW} ${SH}" class="r2-svg" role="img" aria-label="${esc(type)} 스케치">${s}</svg>`;
}
function r2SketchSvg(){ return r2Chart(r2Parse(MEMO.sketchData), MEMO.sketchTypePick||'막대그래프'); }
function r2Sketch(){ $('sketchView').innerHTML=r2SketchSvg(); }

/* 02 프로젝트 카드: 적은 메모로 바로 채우기 */
function r2Card(){
  const v=k=>(MEMO[k]||'').trim();
  const t=(k,ph)=>v(k)?esc(v(k)):`<span class="e">${ph}</span>`;
  const team=v('team')||'우리 모둠', acc=v('accidentPickName');
  const rows=r2Parse(MEMO.sketchData);
  const html=`<div class="r2-card">
    <div class="r2-hd"><b>${esc(team)}${acc?' · '+esc(acc):''}</b><small>안전 문제, 빅데이터로 해결해 볼까?</small></div>
    <div class="pb"><b>문제</b> ${t('problem','01 화면에서 해결할 문제를 적어요')}<br><b>필요한 데이터</b> ${t('needData','01 화면에서 필요한 데이터를 적어요')}</div>
    <div class="r2-steps">
      <div style="--k:#1f9d74"><h5>수집</h5>${t('collectPickName','수집 방법 고르기')}<br>${t('collectHow','')}</div>
      <div style="--k:#2f6fd0"><h5>전처리</h5>${t('prepPickName','전처리할 부분 고르기')}<br>${t('prepHow','')}</div>
      <div style="--k:#9b4fc4"><h5>시각화</h5>${t('vizPickName','시각화 방법 고르기')}<br>${t('vizHow','')}</div>
      <div style="--k:#e0702b"><h5>기대 효과</h5>${t('effect','확인할 사실과 누가 어떻게 더 안전해질까')}</div>
    </div>
    ${rows.length>=2?`<div class="r2-mini">${r2SketchSvg()}</div>`:''}
  </div>`;
  $('projCard').innerHTML=html; $('projCard2').innerHTML=html;
}
function r2Refresh(){ r2Card(); r2Sketch(); }
document.addEventListener('input',e=>{ if(e.target.matches&&e.target.matches('[data-memo]')) setTimeout(r2Refresh,350); });
['accidentPick','collectPick','prepPick','vizPick','sketchType'].forEach(id=>$(id).addEventListener('memo',r2Refresh));
onShow[2]=r2Refresh;
onShow[4]=r2Card;

/* 03 진로: 인터뷰 카드 (교과서 86쪽 내용을 줄여서) */
flipCards('careerCards',[
  {ic:'👕',f:'어떤 일을 하시나요?',s:'눌러서 답 보기',b:'의류 회사에서 소비자들의 <b>구매 데이터</b>를 분석해 마케팅 전략을 짜요. 사람들이 필요로 하거나 좋아할 아이템을 데이터로 예측해 제품을 기획하고, 홍보 방법을 팀원들과 의논해요.'},
  {ic:'📚',f:'무엇을 준비해야 하나요?',s:'눌러서 답 보기',b:'데이터를 분석하려면 <b>수리력과 논리력</b>이 필요해서 통계와 컴퓨터 프로그래밍에 관심을 가지면 도움이 돼요. 특정 분야의 <b>전문 지식</b>을 갖추면 의미 있는 통찰을 할 수 있어요.'},
  {ic:'🔭',f:'앞으로의 전망은?',s:'눌러서 답 보기',b:'빅데이터 시장이 커질수록 데이터의 연관성을 찾고 유용한 정보를 발굴하는 사람이 필요해요. 활동 분야가 다양하고, 국내외에서 <b>수요가 계속 높아지고</b> 있어요.'},
  {ic:'💬',f:'청소년에게 한마디',s:'눌러서 답 보기',b:'<b>관심 분야의 문제를 하나 정해</b> 데이터를 모아 분석해 보세요. 모둠으로 정보를 공유하고 소통하며 <b>협력해 문제를 해결하는 경험</b>도 좋아요.'},
  {ic:'🏖️',f:'오늘 우리가 한 일은?',s:'눌러서 보기',b:'안전 문제를 정하고 필요한 데이터 · 수집 · 전처리 · 시각화를 계획했어요. 데이터 마이너가 하는 일의 <b>첫 단계</b>와 같아요.'}
]);
chips('careerSkill','careerSkillPick',['수리력','논리력','통계','컴퓨터 프로그래밍','특정 분야의 전문 지식','협력과 소통'],true);

/* 04 발표 준비 · 평가 */
chips('selfEval','selfEvalPick',['해결할 수 있는 주제를 골랐다','주제에 맞는 데이터를 찾았다','단계별로 논리적으로 계획했다','주제에 맞게 문제를 해결했다','결과물이 창의적이고 쓸모 있다','단계마다 맡은 역할을 다했다'],true);
chips('compPick','compPickName',['지식 정보 처리','창의적 사고','협력적 소통','공동체 역량'],true);

/* 05 단원 정리: 어떤 일을 하는 걸까? */
sorter('unitSort',{
  cats:[{n:'압축',k:'#2f6fd0'},{n:'암호화',k:'#d64535'},{n:'수집',k:'#1f9d74'},{n:'전처리',k:'#9b4fc4'},{n:'시각화',k:'#e0702b'}],
  items:[
    {t:'체육대회 응원 사진 300장을 눈으로 봐서는 차이를 모를 만큼만 덜어 내 메신저로 보냈다',ic:'📸',c:0,short:'사진 용량 줄이기',w:'사람이 잘 알아차리지 못하는 부분을 덜어 내는 손실 압축이에요.'},
    {t:'자주 나오는 글자에는 짧은 0·1 부호를, 드물게 나오는 글자에는 긴 부호를 붙여 저장했다',ic:'🔤',c:0,short:'짧은 부호 붙이기',w:'사용 빈도가 높을수록 짧은 이진수를 주는 허프만 부호화예요.'},
    {t:'알파벳을 약속한 칸 수만큼 밀어 쓴 쪽지를 친구에게 건넸다',ic:'✉️',c:1,short:'알파벳 밀어 쓰기',w:'문자를 약속된 다른 문자로 바꾸는 치환형 방식이에요.'},
    {t:'웹 사이트가 회원 비밀번호를 원래대로 되돌릴 수 없는 해시값으로 바꿔 저장한다',ic:'🔑',c:1,short:'비밀번호 해시값',w:'되돌릴 수 없는 단방향 방식이에요.'},
    {t:'학교 운동장에 센서를 달아 한 시간마다 기온을 기록했다',ic:'🌡️',c:2,short:'센서로 기온 기록',w:'필요한 데이터를 센서로 직접 얻었어요.'},
    {t:'공공 기관이 누구나 쓰도록 공개한 날씨 기록 파일을 내려받았다',ic:'📥',c:2,short:'공개 기록 내려받기',w:'공공 데이터를 모은 거예요.'},
    {t:'설문 응답 가운데 키를 「1700cm」로 적은 값을 찾아 뺐다',ic:'🧹',c:3,short:'잘못된 키 값 빼기',w:'일반적이지 않은 이상치를 제거했어요.'},
    {t:'학번이 같은 두 표를 학번을 기준으로 하나로 이어 붙였다',ic:'🔗',c:3,short:'두 표 이어 붙이기',w:'공통 속성으로 데이터를 합쳤어요.'},
    {t:'달마다 매점 판매량을 점으로 찍고 선으로 이어 오르내림을 보였다',ic:'📈',c:4,short:'판매량 선으로 잇기',w:'선그래프로 흐름을 그림으로 보였어요.'},
    {t:'시 100편에서 많이 쓰인 낱말일수록 크게 보이게 그렸다',ic:'☁️',c:4,short:'낱말 크게 그리기',w:'워드 클라우드로 텍스트를 그림으로 보였어요.'}
  ],
  end:'데이터를 <b>모으고(수집)</b> → <b>다듬고(전처리)</b> → <b>그림으로 보이고(시각화)</b>, 저장 · 전송할 때는 <b>압축</b>, 보호할 때는 <b>암호화</b>를 해요.'
});
chips('unitComp','unitCompPick',['컴퓨팅 사고력','추상화 능력','자동화 능력','창의·융합 능력','디지털 문화 소양','디지털 의사소통·협업 능력','디지털 윤리 의식','디지털 기술 활용 능력','인공지능 소양','인공지능 문제 해결력','데이터 문해력','인공지능 윤리 의식'],true);

const MEMOLIST=[['team','모둠명'],['roles','모둠원과 역할'],['accidentPickName','고른 안전사고 유형'],['problem','해결할 문제'],['needData','필요한 데이터'],['collectPickName','수집 방법'],['collectHow','어디에서 어떤 데이터를'],['prepPickName','전처리할 부분'],['prepHow','전처리 방법'],['vizPickName','시각화 방법'],['vizHow','시각화로 보여 줄 것'],['effect','확인할 사실과 기대 효과'],['sketchData','시각화 스케치 값'],['sketchTypePick','스케치 그래프 종류'],['career','진로 카드: 관심 분야의 문제와 데이터'],['careerSkillPick','진로 카드: 기르고 싶은 역량'],['pitch','발표: 맡은 칸과 한마디'],['manage','성찰: 압축 · 암호화 관점 데이터 관리'],['selfEvalPick','자기 평가'],['compPickName','길러진 역량'],['peer','동료 평가: 좋았던 모둠과 까닭'],['peerAsk','동료 평가: 질문이나 제안'],['unitCompPick','역량 Check'],['keyQ','핵심 질문에 대한 내 답']];
onShow[6]=()=>memoSummary('msum',MEMOLIST);
