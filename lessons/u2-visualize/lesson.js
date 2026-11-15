/* ===== 작은 그래프 그리기 (SVG, 이 차시 전용) ===== */
const VW=600, VH=300, PL=58, PR=18, PT=18, PB=50;
const VC=['#2f6fd0','#e0702b','#1f9d74','#9b4fc4','#d64535','#f2a516','#5b6776','#0f9fb0','#b5527a','#7a8b2a','#8a5a2b','#3b4a8f'];
const vzF=v=>Math.abs(v)>=1000?Math.round(v).toLocaleString('ko-KR'):String(+(+v).toFixed(1));
const vzLin=(d0,d1,r0,r1)=>v=>r0+(v-d0)/((d1-d0)||1)*(r1-r0);
function vzTicks(lo,hi,n){
  n=n||5; if(hi===lo){hi=lo+1;}
  const raw=(hi-lo)/n, mag=Math.pow(10,Math.floor(Math.log10(raw)));
  const st=[1,2,5,10].map(k=>k*mag).find(k=>(hi-lo)/k<=n)||10*mag;
  const a=Math.floor(lo/st)*st, b=Math.ceil(hi/st)*st, t=[];
  for(let v=a; v<=b+st/2; v+=st) t.push(+v.toFixed(6));
  return t;
}
const vzSvg=(inner,label)=>`<svg viewBox="0 0 ${VW} ${VH}" class="vz-svg" role="img" aria-label="${esc(label||'그래프')}">${inner}</svg>`;
function vzYAxis(t,y,lab){
  const mid=PT+(VH-PT-PB)/2;
  return t.map(v=>`<line x1="${PL}" x2="${VW-PR}" y1="${y(v)}" y2="${y(v)}" class="vz-grid"/><text x="${PL-7}" y="${y(v)+4}" class="vz-tk e">${vzF(v)}</text>`).join('')
    +`<text x="15" y="${mid}" class="vz-al" transform="rotate(-90 15 ${mid})">${esc(lab)}</text>`;
}
function vzXNum(t,x,lab){
  return t.map(v=>`<line x1="${x(v)}" x2="${x(v)}" y1="${VH-PB}" y2="${VH-PB+5}" class="vz-axl"/><text x="${x(v)}" y="${VH-PB+19}" class="vz-tk m">${vzF(v)}</text>`).join('')
    +`<line x1="${PL}" x2="${VW-PR}" y1="${VH-PB}" y2="${VH-PB}" class="vz-axl"/><text x="${PL+(VW-PL-PR)/2}" y="${VH-8}" class="vz-al m">${esc(lab)}</text>`;
}
function vzXCat(labels,cx,lab){
  const every=Math.ceil(labels.length/14);
  return labels.map((l,i)=>i%every?'':`<text x="${cx(i)}" y="${VH-PB+19}" class="vz-tk m">${esc(l)}</text>`).join('')
    +`<line x1="${PL}" x2="${VW-PR}" y1="${VH-PB}" y2="${VH-PB}" class="vz-axl"/><text x="${PL+(VW-PL-PR)/2}" y="${VH-8}" class="vz-al m">${esc(lab)}</text>`;
}
/* 막대그래프 */
function vzBar(labels,vals,o){
  const t=vzTicks(0,Math.max(...vals)), y=vzLin(0,t[t.length-1],VH-PB,PT), bw=(VW-PL-PR)/labels.length, cx=i=>PL+bw*(i+.5);
  const w=Math.max(1.5,bw*.7);
  return vzSvg(vzYAxis(t,y,o.yl)+labels.map((l,i)=>`<rect x="${cx(i)-w/2}" y="${y(vals[i])}" width="${w}" height="${VH-PB-y(vals[i])}" rx="2" style="fill:${o.c||VC[0]}"><title>${esc(l)}: ${vzF(vals[i])}</title></rect>`).join('')+vzXCat(labels,cx,o.xl),'막대그래프');
}
/* 선그래프 */
function vzLine(labels,vals,o){
  const t=vzTicks(0,Math.max(...vals)), y=vzLin(0,t[t.length-1],VH-PB,PT), bw=(VW-PL-PR)/labels.length, cx=i=>PL+bw*(i+.5);
  const pts=vals.map((v,i)=>`${cx(i)},${y(v)}`).join(' ');
  const dots=labels.length<=40?vals.map((v,i)=>`<circle cx="${cx(i)}" cy="${y(v)}" r="3.5" style="fill:${o.c||VC[1]}"><title>${esc(labels[i])}: ${vzF(v)}</title></circle>`).join(''):'';
  return vzSvg(vzYAxis(t,y,o.yl)+`<polyline points="${pts}" class="vz-ln" style="stroke:${o.c||VC[1]}"/>`+dots+vzXCat(labels,cx,o.xl),'선그래프');
}
/* 원그래프 */
function vzPie(labels,vals){
  const sum=vals.reduce((a,b)=>a+b,0), cx=170, cy=150, r=118; let a0=-Math.PI/2, s='';
  vals.forEach((v,i)=>{
    const a1=a0+v/sum*Math.PI*2, big=a1-a0>Math.PI?1:0;
    const p=(a)=>`${cx+r*Math.cos(a)},${cy+r*Math.sin(a)}`;
    s+= vals.length===1?`<circle cx="${cx}" cy="${cy}" r="${r}" style="fill:${VC[0]}"/>`:`<path d="M${cx},${cy} L${p(a0)} A${r},${r} 0 ${big} 1 ${p(a1)} Z" style="fill:${VC[i%VC.length]}" class="vz-sl"><title>${esc(labels[i])}: ${vzF(v)}</title></path>`;
    a0=a1;
  });
  const rows=labels.length, gap=Math.min(26,250/rows);
  s+=labels.map((l,i)=>`<rect x="330" y="${30+i*gap}" width="14" height="14" rx="3" style="fill:${VC[i%VC.length]}"/><text x="352" y="${42+i*gap}" class="vz-lg">${esc(l)} · ${Math.round(vals[i]/sum*100)}%</text>`).join('');
  return vzSvg(s,'원그래프');
}
/* 히스토그램 · 분포도 (집단 여럿이면 겹쳐 그림) */
function vzHist(groups,bwid,o){
  const all=groups.flatMap(g=>g.v), lo=Math.floor(Math.min(...all)/bwid)*bwid, hi=Math.ceil((Math.max(...all)+1e-9)/bwid)*bwid;
  const nb=Math.max(1,Math.round((hi-lo)/bwid));
  const cnt=groups.map(g=>{const c=Array(nb).fill(0); g.v.forEach(v=>c[Math.min(nb-1,Math.floor((v-lo)/bwid))]++); return c;});
  const t=vzTicks(0,Math.max(...cnt.flat())), y=vzLin(0,t[t.length-1],VH-PB,PT), x=vzLin(lo,hi,PL+6,VW-PR-6), xt=vzTicks(lo,hi,8).filter(v=>v>=lo&&v<=hi);
  let s=vzYAxis(t,y,'개수');
  cnt.forEach((c,gi)=>c.forEach((n,i)=>{ if(!n) return; s+=`<rect x="${x(lo+i*bwid)+.5}" y="${y(n)}" width="${Math.max(1,x(lo+(i+1)*bwid)-x(lo+i*bwid)-1)}" height="${VH-PB-y(n)}" style="fill:${groups[gi].c||VC[2]};opacity:${groups.length>1?.55:.85}"><title>${vzF(lo+i*bwid)}~${vzF(lo+(i+1)*bwid)}: ${n}</title></rect>`;}));
  s+=vzXNum(xt,x,o.xl);
  if(groups.length>1) s+=groups.map((g,i)=>`<rect x="${VW-PR-110}" y="${PT+4+i*20}" width="12" height="12" rx="3" style="fill:${g.c}"/><text x="${VW-PR-92}" y="${PT+15+i*20}" class="vz-lg">${esc(g.n)}</text>`).join('');
  return vzSvg(s,'히스토그램');
}
/* 박스 플롯 (세로) */
function vzQ(a,p){const s=[...a].sort((x,y)=>x-y), i=(s.length-1)*p, f=Math.floor(i); return s[f]+(s[Math.min(f+1,s.length-1)]-s[f])*(i-f);}
function vzBox(groups,o){
  const all=groups.flatMap(g=>g.v), t=vzTicks(Math.min(...all),Math.max(...all)), y=vzLin(t[0],t[t.length-1],VH-PB,PT);
  const bw=(VW-PL-PR)/groups.length, cx=i=>PL+bw*(i+.5), w=Math.min(90,bw*.45);
  let s=vzYAxis(t,y,o.yl);
  groups.forEach((g,i)=>{
    const mn=Math.min(...g.v), mx=Math.max(...g.v), q1=vzQ(g.v,.25), md=vzQ(g.v,.5), q3=vzQ(g.v,.75), c=g.c||VC[i];
    s+=`<line x1="${cx(i)}" x2="${cx(i)}" y1="${y(mx)}" y2="${y(mn)}" class="vz-wk"/>`
      +`<line x1="${cx(i)-w/4}" x2="${cx(i)+w/4}" y1="${y(mx)}" y2="${y(mx)}" class="vz-wk"/><line x1="${cx(i)-w/4}" x2="${cx(i)+w/4}" y1="${y(mn)}" y2="${y(mn)}" class="vz-wk"/>`
      +`<rect x="${cx(i)-w/2}" y="${y(q3)}" width="${w}" height="${Math.max(2,y(q1)-y(q3))}" rx="3" style="fill:${c};opacity:.8"><title>${esc(g.n)} 가운데 절반: ${vzF(q1)}~${vzF(q3)}</title></rect>`
      +`<line x1="${cx(i)-w/2}" x2="${cx(i)+w/2}" y1="${y(md)}" y2="${y(md)}" class="vz-md"/>`
      +`<text x="${cx(i)+w/2+6}" y="${y(md)+4}" class="vz-tk">중앙값 ${vzF(md)}</text>`;
  });
  s+=vzXCat(groups.map(g=>g.n),cx,o.xl||'');
  return vzSvg(s,'박스 플롯');
}
/* 산점도 (+회귀선) */
function vzScatter(pts,o){
  const xs=pts.map(p=>p.x), ys=pts.map(p=>p.y), xt=vzTicks(Math.min(...xs),Math.max(...xs)), yt=vzTicks(Math.min(0,...ys),Math.max(...ys));
  const x=vzLin(xt[0],xt[xt.length-1],PL+6,VW-PR-6), y=vzLin(yt[0],yt[yt.length-1],VH-PB,PT);
  let s=vzYAxis(yt,y,o.yl)+vzXNum(xt,x,o.xl);
  s+=pts.map(p=>`<circle cx="${x(p.x)}" cy="${y(p.y)}" r="4" style="fill:${p.c||VC[0]};opacity:.75"><title>${vzF(p.x)}, ${vzF(p.y)}</title></circle>`).join('');
  if(o.reg){
    const n=pts.length, mx=xs.reduce((a,b)=>a+b,0)/n, my=ys.reduce((a,b)=>a+b,0)/n;
    const b=pts.reduce((a,p)=>a+(p.x-mx)*(p.y-my),0)/(pts.reduce((a,p)=>a+(p.x-mx)**2,0)||1), a=my-b*mx;
    const x0=Math.min(...xs), x1=Math.max(...xs);
    s+=`<line x1="${x(x0)}" y1="${y(a+b*x0)}" x2="${x(x1)}" y2="${y(a+b*x1)}" class="vz-rg2"/><text x="${x(x1)-4}" y="${y(a+b*x1)-8}" class="vz-tk e">회귀선</text>`;
  }
  return vzSvg(s,'산점도');
}
const vzMsg=t=>`<div class="vz-none">🚫 ${t}</div>`;

/* ===== 연습용 가상 데이터 (교과서 데이터가 아님) ===== */
function vzRng(seed){return ()=>{seed|=0; seed=seed+0x6D2B79F5|0; let t=Math.imul(seed^seed>>>15,1|seed); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296;};}
const vzR=vzRng(76);
const vzN=(m,s)=>{let u=0,v=0; while(!u)u=vzR(); while(!v)v=vzR(); return m+s*Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);};
const VP=[...Array(80)].map((_,i)=>{const m=i%2===1, d=1+Math.floor(vzR()*30);
  return {g:m?'남':'여', h:Math.round(m?vzN(176,6.5):vzN(163,6)), w:Math.round(m?vzN(74,8):vzN(58,7)), d, c:Math.max(5,Math.round(d*7+vzN(0,14)))};});
const MONTHS=['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'], ICE=[38,42,61,85,118,164,203,196,131,74,45,36];
const SURVEY=[['매우 만족',18],['만족',34],['보통',27],['불만족',14],['매우 불만족',7]];
const GC={'여':'#e0702b','남':'#2f6fd0'};

const VTYPES=[['bar','막대그래프','📊'],['line','선그래프','📈'],['pie','원그래프','🥧'],['hist','히스토그램 · 분포도','📶'],['box','박스 플롯','📦'],['scatter','산점도','⁘']];
const VNAME=Object.fromEntries(VTYPES.map(t=>[t[0],t[1]]));
const VMIS=[
  {k:'rel',n:'운동 시간과 열량',q:'운동 시간이 길수록 소모한 열량도 많을까?',d:'가상의 학생 80명 · 한 사람마다 운동 시간(분)과 소모한 열량(kcal)',
   v:{
    scatter:['best',()=>vzScatter(VP.map(p=>({x:p.d,y:p.c})),{xl:'운동 시간(분)',yl:'열량(kcal)',reg:true}),'점 하나가 한 사람이에요. 오른쪽으로 갈수록(운동 시간이 길수록) 점이 위로 올라가서 두 속성의 관계가 한눈에 보여요. 회귀선이 그 방향을 알려 줘요.'],
    bar:['ok',()=>{const L=['1~5','6~10','11~15','16~20','21~25','26~30'];const v=L.map((_,i)=>{const s=VP.filter(p=>Math.floor((p.d-1)/5)===i);return Math.round(s.reduce((a,p)=>a+p.c,0)/(s.length||1));});return vzBar(L,v,{xl:'운동 시간 구간(분)',yl:'평균 열량(kcal)',c:VC[2]});},'운동 시간을 구간으로 나누어 평균 열량을 막대로 그렸어요. 늘어나는 경향은 보이지만 한 사람 한 사람의 값은 사라져요.'],
    line:['no',()=>{const s=[...VP].sort((a,b)=>a.d-b.d);return vzLine(s.map(p=>p.d+'분'),s.map(p=>p.c),{xl:'운동 시간 순서로 늘어놓은 학생',yl:'열량(kcal)'});},'사람마다 따로 잰 값을 선으로 이으니 지그재그가 생겨 읽기 어려워요. 선은 이어지는 흐름이 있을 때 어울려요.'],
    pie:['no',null,'원그래프는 전체에서 각 부분이 차지하는 비율을 보여 줘요. 두 수치의 관계는 나타낼 수 없어요.'],
    hist:['no',()=>vzHist([{n:'열량',v:VP.map(p=>p.c),c:VC[2]}],20,{xl:'열량(kcal)'}),'열량 하나만 구간으로 나누어 퍼진 모양을 보여 줘요. 운동 시간과의 관계는 보이지 않아요.'],
    box:['no',()=>vzBox([{n:'전체',v:VP.map(p=>p.c),c:VC[2]}],{yl:'열량(kcal)'}),'열량 하나의 중앙값과 범위는 보이지만, 운동 시간과의 관계는 보이지 않아요.']}},
  {k:'spread',n:'몸무게 분포',q:'학생 80명의 몸무게는 어느 범위에 많이 몰려 있을까?',d:'가상의 학생 80명 · 몸무게(kg)',
   v:{
    hist:['best',()=>vzHist([{n:'몸무게',v:VP.map(p=>p.w),c:VC[2]}],4,{xl:'몸무게(kg)'}),'구간마다 몇 명인지 막대 높이로 보여서, 어느 범위에 많이 몰려 있고 양 끝으로 갈수록 어떻게 줄어드는지 보여요.'],
    box:['ok',()=>vzBox([{n:'전체',v:VP.map(p=>p.w),c:VC[2]}],{yl:'몸무게(kg)'}),'중앙값과 가장 가벼운·무거운 값은 잘 보이지만, 구간마다 몇 명이 있는지는 알 수 없어요.'],
    bar:['no',()=>vzBar(VP.map((_,i)=>String(i+1)),VP.map(p=>p.w),{xl:'학생 번호',yl:'몸무게(kg)'}),'80명을 막대 80개로 세우니 어느 범위에 많은지 찾기 어려워요.'],
    line:['no',()=>vzLine(VP.map((_,i)=>String(i+1)),VP.map(p=>p.w),{xl:'학생 번호',yl:'몸무게(kg)'}),'번호 순서에는 의미가 없어서, 선으로 이으면 의미 없는 오르내림이 생겨요.'],
    pie:['no',null,'몸무게는 전체를 나눈 부분이 아니어서 원그래프로 나타내기 어려워요.'],
    scatter:['no',null,'산점도는 수치형 변수 두 개가 필요해요. 몸무게 하나만으로는 관계를 볼 수 없어요.']}},
  {k:'cmp',n:'남녀 키 비교',q:'남학생과 여학생의 키를 중앙값 · 최솟값 · 최댓값으로 한꺼번에 비교하려면?',d:'가상의 학생 80명 · 성별과 키(cm)',
   v:{
    box:['best',()=>vzBox(['여','남'].map(g=>({n:g,v:VP.filter(p=>p.g===g).map(p=>p.h),c:GC[g]})),{yl:'키(cm)',xl:'성별'}),'두 상자를 나란히 놓으니 중앙값, 가장 작은 값과 큰 값, 가운데에 몰린 범위를 한 번에 비교할 수 있어요.'],
    hist:['ok',()=>vzHist(['여','남'].map(g=>({n:g,v:VP.filter(p=>p.g===g).map(p=>p.h),c:GC[g]})),3,{xl:'키(cm)'}),'두 집단의 분포가 겹쳐 보여서 차이는 보이지만, 중앙값을 정확히 읽기는 어려워요.'],
    bar:['no',()=>vzBar(['여','남'],['여','남'].map(g=>{const s=VP.filter(p=>p.g===g);return Math.round(s.reduce((a,p)=>a+p.h,0)/s.length*10)/10;}),{xl:'성별',yl:'평균 키(cm)',c:VC[3]}),'막대 두 개로 평균만 보여요. 가장 작은 값과 큰 값, 퍼진 정도는 알 수 없어요.'],
    line:['no',()=>vzLine(['여','남'],['여','남'].map(g=>{const s=VP.filter(p=>p.g===g);return Math.round(s.reduce((a,p)=>a+p.h,0)/s.length*10)/10;}),{xl:'성별',yl:'평균 키(cm)'}),'성별 두 값을 선으로 이으면 마치 시간에 따라 변한 것처럼 보여 오해할 수 있어요.'],
    pie:['no',null,'키를 모두 더해 비율로 나누는 것은 의미가 없어요.'],
    scatter:['no',null,'성별은 수치형이 아니어서 산점도의 축으로 쓰기 어려워요.']}},
  {k:'trend',n:'달마다 판매량',q:'1년 동안 매점 아이스크림 판매량은 달마다 어떻게 오르내렸을까?',d:'가상의 매점 기록 · 달마다 판매 개수',
   v:{
    line:['best',()=>vzLine(MONTHS,ICE,{xl:'달',yl:'판매 개수'}),'달의 순서대로 점을 이어서 언제 오르고 언제 내리는지 흐름이 또렷하게 보여요.'],
    bar:['ok',()=>vzBar(MONTHS,ICE,{xl:'달',yl:'판매 개수',c:VC[1]}),'달마다 크기를 비교하기는 쉬워요. 오르내리는 흐름은 선그래프가 더 또렷해요.'],
    scatter:['ok',()=>vzScatter(ICE.map((v,i)=>({x:i+1,y:v,c:VC[1]})),{xl:'달',yl:'판매 개수'}),'달(x)과 판매량(y)으로 점을 찍으면 흐름이 보이긴 해요. 순서대로 이은 선그래프가 더 쉽게 읽혀요.'],
    pie:['no',()=>vzPie(MONTHS,ICE),'열두 달을 조각으로 나누면 어느 달이 큰지는 보이지만 시간의 흐름은 사라져요.'],
    hist:['no',()=>vzHist([{n:'판매 개수',v:ICE,c:VC[1]}],40,{xl:'판매 개수'}),'판매량이 어느 구간에 몇 달 있었는지만 보여요. 달의 순서가 사라져요.'],
    box:['no',()=>vzBox([{n:'1년',v:ICE,c:VC[1]}],{yl:'판매 개수'}),'1년 판매량의 범위는 보이지만 어느 달에 늘었는지는 알 수 없어요.']}},
  {k:'share',n:'설문 응답 비율',q:'급식 만족도 설문에서 각 답이 전체의 몇 %를 차지할까?',d:'가상의 설문 100명 · 답마다 고른 사람 수',
   v:{
    pie:['best',()=>vzPie(SURVEY.map(s=>s[0]),SURVEY.map(s=>s[1])),'전체(100%) 가운데 각 답이 차지하는 비율이 조각 크기로 바로 보여요.'],
    bar:['ok',()=>vzBar(SURVEY.map(s=>s[0]),SURVEY.map(s=>s[1]),{xl:'답',yl:'사람 수',c:VC[3]}),'답마다 크기 비교는 쉬워요. 다만 전체에 대한 비율은 따로 계산해야 해요.'],
    line:['no',()=>vzLine(SURVEY.map(s=>s[0]),SURVEY.map(s=>s[1]),{xl:'답',yl:'사람 수'}),'답 사이에는 시간의 흐름이 없어서, 선으로 이으면 변화처럼 오해할 수 있어요.'],
    hist:['no',null,'설문 답은 수치가 아니라 항목이에요. 수치를 구간으로 나누는 히스토그램과 맞지 않아요.'],
    box:['no',null,'답마다 사람 수가 하나씩뿐이라 중앙값이나 범위를 볼 것이 없어요.'],
    scatter:['no',null,'수치형 변수 두 개가 없어서 산점도를 그릴 수 없어요.']}}
];
const GRADE={best:['✔ 메시지가 잘 전해져요','ok'],ok:['△ 전할 수는 있어요','mid'],no:['✕ 메시지가 잘 안 보여요','ng']};

/* ===== 01 그래프 고르기 실험실 ===== */
let labM=0, labT='bar';
const LABK='ds-u2-visualize-lab'+WHO.sfx;
let LAB=store.get(LABK,{});
function labRecord(){
  MEMO.vizLab=VMIS.filter(m=>LAB[m.k]).map(m=>`${m.n} → ${VNAME[LAB[m.k]]}(${GRADE[m.v[LAB[m.k]][0]][0].slice(2)})`).join(' / ');
  store.set(MK,MEMO);
}
function labDraw(){
  const m=VMIS[labM];
  $('labMis').innerHTML=VMIS.map((x,i)=>`<button class="${i===labM?'on':''}" data-i="${i}">${LAB[x.k]?(x.v[LAB[x.k]][0]==='best'?'✔ ':'· '):''}${esc(x.n)}</button>`).join('');
  $('labMis').querySelectorAll('button').forEach(b=>b.onclick=()=>{labM=+b.dataset.i; labT='bar'; $('labFb').innerHTML=''; labDraw();});
  $('labQ').innerHTML=`<b>미션 ${labM+1}.</b> ${esc(m.q)}<small>${esc(m.d)}</small>`;
  $('labTypes').innerHTML=VTYPES.map(t=>`<button class="${t[0]===labT?'on':''}" data-t="${t[0]}"><i>${t[2]}</i>${t[1]}</button>`).join('');
  $('labTypes').querySelectorAll('button').forEach(b=>b.onclick=()=>{labT=b.dataset.t; $('labFb').innerHTML=''; labDraw();});
  const v=m.v[labT];
  $('labChart').innerHTML=v[1]?v[1]():vzMsg('이 데이터는 '+VNAME[labT]+'(으)로 그리기 어려워요.');
  const done=VMIS.filter(x=>LAB[x.k]);
  $('labLog').innerHTML=done.length?`<b>내가 고른 그래프 (${done.length}/5)</b> `+done.map(x=>`<span class="${GRADE[x.v[LAB[x.k]][0]][1]}">${esc(x.n)} → ${VNAME[LAB[x.k]]}</span>`).join(''):'';
}
$('labPick').onclick=()=>{
  const m=VMIS[labM], v=m.v[labT], g=GRADE[v[0]];
  LAB[m.k]=labT; store.set(LABK,LAB); labRecord();
  $('labFb').innerHTML=`<b class="${g[1]}">${g[0]}</b> ${v[2]}`+(v[0]==='best'?'':' <span class="muted">다른 그래프로도 바꿔 보고 다시 골라도 돼요.</span>');
  labDraw();
};
labDraw();

/* ===== 오렌지3 위젯 흐름도 ===== */
const OWC={data:'#f2a516',tf:'#e0702b',vis:'#d64535',geo:'#1f9d74',time:'#2f6fd0',img:'#a39213',txt:'#9b4fc4'};
function owFlow(box,cfg){
  const cw=cfg.cw||165, rh=cfg.rh||92, ox=62, oy=34, N={};
  cfg.nodes.forEach(n=>N[n.id]=n);
  const X=n=>ox+n.x*cw, Y=n=>oy+n.y*rh;
  const W=ox*2+Math.max(...cfg.nodes.map(n=>n.x))*cw, H=oy+Math.max(...cfg.nodes.map(n=>n.y))*rh+56;
  const mk='owa-'+box;
  let s=`<defs><marker id="${mk}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="ow-ah"/></marker></defs>`;
  cfg.links.forEach(([a,b,lab])=>{
    const A=N[a], B=N[b], x1=X(A)+27, y1=Y(A), x2=X(B)-29, y2=Y(B), dx=(x2-x1)/2;
    const cls=(A.old&&B.old)?'ow-l old':(B.opt||A.opt?'ow-l opt':'ow-l');
    s+=`<path d="M${x1},${y1} C${x1+dx},${y1} ${x2-dx},${y2} ${x2},${y2}" class="${cls}" marker-end="url(#${mk})"/>`;
    if(lab) s+=`<text x="${(x1+x2)/2}" y="${(y1+y2)/2-6}" class="ow-lt">${esc(lab)}</text>`;
  });
  cfg.nodes.forEach(n=>{
    const cls='ow-n'+(n.old?' old':'')+(n.opt?' opt':'');
    s+=`<g class="${cls}"><circle cx="${X(n)}" cy="${Y(n)}" r="25" style="fill:${OWC[n.c]}"/><text x="${X(n)}" y="${Y(n)+7}" class="ow-ic">${n.ic}</text><text x="${X(n)}" y="${Y(n)+42}" class="ow-t">${esc(n.t)}</text>${n.k?`<text x="${X(n)}" y="${Y(n)+56}" class="ow-k">${esc(n.k)}</text>`:''}</g>`;
  });
  $(box).innerHTML=`<svg viewBox="0 0 ${W} ${H}" class="ow-svg" style="max-width:${W}px" role="img" aria-label="오렌지3 위젯 연결 순서">${s}</svg>`;
}
owFlow('flowCal',{nodes:[
  {id:'a',t:'calories',k:'File',ic:'📄',c:'data',x:0,y:0,old:1},
  {id:'b',t:'exercise',k:'File',ic:'📄',c:'data',x:0,y:2,old:1},
  {id:'m',t:'Merge Data',k:'데이터 합치기',ic:'🔗',c:'tf',x:1,y:1,old:1},
  {id:'bx',t:'Box Plot',k:'박스 플롯 · 실습 ①-가',ic:'📦',c:'vis',x:2,y:0},
  {id:'ds',t:'Distributions',k:'분포도 · 선택',ic:'📶',c:'vis',x:2,y:1,opt:1},
  {id:'dz',t:'Discretize',k:'나이 세 구간',ic:'📏',c:'tf',x:2,y:2,old:1},
  {id:'sc',t:'Scatter Plot',k:'산점도 · 실습 ①-나',ic:'⁘',c:'vis',x:3,y:2}],
 links:[['a','m','Data'],['b','m','Extra Data'],['m','bx'],['m','ds'],['m','dz'],['dz','sc']]});
owFlow('flowGeo',{nodes:[
  {id:'f',t:'File',k:'학교 위치 데이터',ic:'📄',c:'data',x:0,y:1},
  {id:'s',t:'Scatter Plot',k:'산점도',ic:'⁘',c:'vis',x:1,y:0},
  {id:'g',t:'Geo Map',k:'지도',ic:'🗺️',c:'geo',x:1,y:1},
  {id:'t',t:'Time Slice',k:'시간 흐름',ic:'⏱️',c:'time',x:1,y:2},
  {id:'g2',t:'Geo Map (1)',k:'연도별 지도',ic:'🗺️',c:'geo',x:2,y:2}],
 links:[['f','s'],['f','g'],['f','t'],['t','g2','Subset → Data']]});
owFlow('flowText',{cw:150,nodes:[
  {id:'c',t:'Corpus',k:'윤동주 시.csv',ic:'📚',c:'txt',x:0,y:0.5},
  {id:'v',t:'Corpus Viewer',k:'데이터 확인',ic:'🔍',c:'txt',x:1,y:0},
  {id:'p',t:'Preprocess Text',k:'텍스트 전처리',ic:'🧹',c:'txt',x:1,y:1.2},
  {id:'w',t:'Word Cloud',k:'워드 클라우드',ic:'☁️',c:'txt',x:2,y:1.2}],
 links:[['c','v'],['c','p'],['p','w']]});
owFlow('flowImg',{cw:190,nodes:[
  {id:'i',t:'Import Images',k:'은하 이미지 폴더',ic:'🖼️',c:'img',x:0,y:0},
  {id:'v',t:'Image Viewer',k:'이미지 보기',ic:'👁️',c:'img',x:1,y:0}],
 links:[['i','v','Data']]});
owFlow('flowFifa',{cw:150,nodes:[
  {id:'f',t:'File',k:'FIFA 2023',ic:'📄',c:'data',x:0,y:0},
  {id:'d',t:'Distributions',k:'선수 가치',ic:'📶',c:'vis',x:1,y:0},
  {id:'v',t:'Image Viewer',k:'Photo',ic:'👁️',c:'img',x:2,y:0}],
 links:[['f','d'],['d','v','Selected Data']]});

/* 02 박스 플롯 읽는 법 (그림 설명) */
$('boxGuide').innerHTML=`<svg viewBox="0 0 520 120" class="vz-bg" role="img" aria-label="박스 플롯 읽는 법">
  <line x1="60" y1="60" x2="460" y2="60" class="vz-wk"/><line x1="60" y1="45" x2="60" y2="75" class="vz-wk"/><line x1="460" y1="45" x2="460" y2="75" class="vz-wk"/>
  <rect x="180" y="40" width="160" height="40" rx="4" style="fill:#2f6fd0;opacity:.75"/><line x1="250" y1="36" x2="250" y2="84" class="vz-md"/>
  <text x="60" y="100" class="vz-tk m">최솟값</text><text x="460" y="100" class="vz-tk m">최댓값</text><text x="250" y="28" class="vz-tk m">중앙값 (가운데 값)</text>
  <text x="260" y="108" class="vz-tk m">상자: 가운데에 모인 절반의 값</text></svg>`;

/* 03 정형 · 비정형 분류 게임 */
sorter('typeSort',{
  cats:[{n:'정형 데이터',k:'#2f6fd0'},{n:'비정형 데이터',k:'#9b4fc4'}],
  items:[
    {t:'학교명 · 설립일자 · 위도 · 경도가 칸마다 들어 있는 1만여 줄의 파일',ic:'🏫',c:0,short:'학교 위치 파일',w:'속성마다 칸이 정해진 일정한 형식이 있어요.'},
    {t:'운동 시간, 심장 박동 수, 체온이 사람마다 한 줄씩 기록된 CSV 파일',ic:'🏃',c:0,short:'운동 기록 CSV',w:'행과 열로 정리된 수치 데이터예요.'},
    {t:'매점의 날짜별 판매 개수를 행과 열로 정리한 스프레드시트',ic:'🧾',c:0,short:'매점 판매 기록',w:'날짜와 수치가 정해진 칸에 들어 있어요.'},
    {t:'축구 선수마다 나이 · 키 · 선수 가치가 숫자로 정리된 목록',ic:'⚽',c:0,short:'선수 정보 목록',w:'선수마다 같은 속성이 같은 자리에 있어요.'},
    {t:'망원경으로 찍은 은하 사진 150장',ic:'🌌',c:1,short:'은하 사진',w:'이미지는 형식이 정해지지 않은 데이터예요.'},
    {t:'한 시인이 쓴 시 50여 편의 본문',ic:'📜',c:1,short:'시 본문',w:'긴 글(텍스트)은 칸으로 나뉜 형식이 없어요.'},
    {t:'점심시간 급식실 소음을 녹음한 파일',ic:'🎙️',c:1,short:'소음 녹음',w:'소리도 형식이 정해지지 않은 데이터예요.'},
    {t:'체육대회 응원 장면을 찍은 동영상',ic:'🎥',c:1,short:'응원 영상',w:'영상은 이미지와 소리로 이루어져 있어요.'}
  ],
  end:'<b>일정한 형식</b>(정해진 속성과 칸)이 있으면 정형 데이터, 형식이 정해지지 않은 <b>이미지 · 텍스트 · 소리</b>는 비정형 데이터예요.'
});

/* 05 빅데이터 정리 */
chips('myVizPick','myVizPickName',['박스 플롯','히스토그램(분포도)','산점도','막대그래프','선그래프','원그래프','지도(Geo Map)','워드 클라우드'],false);
chips('selfCheck','selfCheckPick',['빅데이터의 개념과 세 가지 특성을 설명할 수 있다','수집한 데이터를 목적에 맞게 시각화했다','빅데이터를 분석할 때 시각화의 가치를 생각했다'],true);
vote('extraPick','extraPickName',[['보충','데이터 분석과 시각화의 관계'],['심화','사회적 · 윤리적 가치와 시각화']]);
(function(){
  const opts=['데이터 시각화','정형 데이터','비정형 데이터'];
  const items=[
    {t:'기상청의 10년 치 기온 숫자 표를 선그래프로 바꿨더니 여름마다 기온이 오르는 흐름이 바로 보였다. 이렇게 한 일 → ___',a:'데이터 시각화'},
    {t:'체육대회 응원 영상과 학생들이 쓴 소감 글 → ___',a:'비정형 데이터'},
    {t:'반 친구들의 이름 · 생일 · 키를 칸마다 정리한 명렬표 → ___',a:'정형 데이터'}];
  $('fillBox').innerHTML=items.map((it,i)=>`<li>${it.t.replace('___',`<select data-i="${i}" aria-label="빈칸 ${i+1}"><option value="">고르기</option>${opts.map(o=>`<option>${o}</option>`).join('')}</select>`)} <span class="vz-bk"></span></li>`).join('');
  $('fillBox').querySelectorAll('select').forEach(sel=>sel.onchange=()=>{
    const it=items[+sel.dataset.i], m=sel.parentElement.querySelector('.vz-bk');
    if(!sel.value){m.textContent='';return;}
    const ok=sel.value===it.a; m.className='vz-bk '+(ok?'ok':'ng'); m.textContent=ok?'맞아요!':'다시 생각해 봐요';
  });
})();

const MEMOLIST=[['planGuess','처음에 알고 있던 그래프'],['vizLab','그래프 고르기 실험실: 고른 그래프'],['labWhy','실험실: 고른 까닭과 비교'],['trendTry','선택: 검색어 두 개 비교'],['boxRead','실습 ①-가 박스 플롯: 남녀 키'],['scatterRead','실습 ①-나 산점도: 운동 시간과 열량'],['vizValue','표와 그래프 비교 · 시각화의 가치'],['optRead','선택: 분포도 · 다른 산점도'],['geoRead','선택: 학교 위치 지도'],['wordRead','실습 ② 워드 클라우드'],['imgRead','선택: 이미지 데이터'],['compareViz','정형 · 비정형 시각화 비교'],['bdFeat','맞춤 활동: 빅데이터 특성'],['myField','맞춤 활동: 관심 분야와 두 속성'],['myVizPickName','맞춤 활동: 고른 시각화 방법'],['bdMeaning','맞춤 활동: 빅데이터의 의미 · 시각화의 가치'],['selfCheckPick','학업 성취도 점검'],['extraPickName','선택 활동'],['extraBasic','보충: 분석과 시각화의 관계'],['extraCase','심화: 시각화 사례'],['extraValue','심화: 사회적 · 윤리적 가치'],['keyQ','핵심 질문에 대한 내 답'],['newLearn','새롭게 알게 된 점']];
onShow[6]=()=>memoSummary('msum',MEMOLIST);
