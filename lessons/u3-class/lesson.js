/* 공통: 코드 상자(줄 번호) · 예측하기 */
function clCode(id,lines){
  $(id).innerHTML=lines.map((l,i)=>{
    let h=esc(l); const c=h.indexOf('#'); if(c>=0) h=h.slice(0,c)+'<i>'+h.slice(c)+'</i>';
    return `<span class="ln" data-n="${i+1}">${h||' '}</span>`;
  }).join('');
}
function clHl(id,nums){ $(id).querySelectorAll('.ln').forEach(s=>s.classList.toggle('hl',nums.includes(+s.dataset.n))); }
function clPred(box,items){
  $(box).innerHTML=items.map((it,i)=>`<div class="cl-pred" data-i="${i}">${it.code?`<pre class="cl-code cl-plain">${esc(it.code.join('\n'))}</pre>`:''}<div class="q">${it.q}</div><div class="row">${it.o.map((o,j)=>`<button class="btn ghost sm" data-j="${j}">${esc(o)}</button>`).join('')}</div><div class="fb"></div></div>`).join('');
  $(box).querySelectorAll('.cl-pred').forEach(d=>{
    const it=items[+d.dataset.i];
    d.querySelectorAll('button').forEach(b=>b.onclick=()=>{
      const j=+b.dataset.j, ok=j===it.a;
      d.querySelectorAll('button').forEach(x=>{x.classList.remove('ok','ng'); if(+x.dataset.j===it.a) x.classList.add('ok');});
      if(!ok) b.classList.add('ng');
      d.querySelector('.fb').innerHTML=(ok?'<span class="ok">예측 성공!</span> ':'<span class="ng">다시 보기:</span> ')+it.w;
    });
  });
}

/* 01 자동차 클래스로 객체 찍어 내기 */
const CAR_COL={'검은색':'#2b2f36','파란색':'#2f6fd0','주황색':'#e0702b','갈색':'#8a5a2b','빨간색':'#d64535','초록색':'#1f9d74'};
const CAR_SHAPE={
  '컨버터블':'M6 44 L6 32 L40 30 L54 22 L60 22 L58 30 L154 32 L154 44 Z',
  '세단':'M6 44 L6 32 L38 30 L56 16 L104 16 L122 30 L154 34 L154 44 Z',
  'SUV':'M6 44 L6 22 L28 20 L42 8 L130 8 L138 20 L154 24 L154 44 Z',
  '픽업트럭':'M6 44 L6 28 L64 28 L66 10 L98 10 L110 26 L154 28 L154 44 Z'
};
let cars=[], carN=0, carRaf=null, carT=0;
const carSvg=c=>`<svg viewBox="0 0 160 60" class="cl-car" aria-label="${esc(c.color)} ${esc(c.kind)}"><path d="${CAR_SHAPE[c.kind]}" style="fill:${CAR_COL[c.color]}"/><circle cx="40" cy="46" r="9" class="w"/><circle cx="122" cy="46" r="9" class="w"/><circle cx="40" cy="46" r="3.5" class="h"/><circle cx="122" cy="46" r="3.5" class="h"/></svg>`;
function carLog(s){ const L=$('carLog'); const a=(L.textContent?L.textContent.split('\n'):[]).concat(s).slice(-6); L.textContent=a.join('\n'); }
function carSave(){ if(!cars.length) return; MEMO.carMade=cars.map(c=>`${c.name}(${c.kind}, ${c.color}, ${c.speed}km)`).join(', '); store.set(MK,MEMO); }
function carDraw(){
  $('carCount').textContent=cars.length?`클래스 1개 → 객체 ${cars.length}개`:'아직 객체가 없어요';
  $('carList').innerHTML=cars.length?cars.map((c,i)=>`<div class="cl-carobj" data-i="${i}">
    <div class="hd"><b class="mono">${c.name}</b><span class="mono">kind='${esc(c.kind)}' · color='${esc(c.color)}' · speed=${c.speed}</span><span class="st">${c.dir>0?'전진 중':c.dir<0?'후진 중':'정지'}</span></div>
    <div class="road"><div class="pos" style="left:${c.x}%">${carSvg(c)}</div></div>
    <div class="row"><button class="btn sm" data-m="1">전진</button><button class="btn sm" data-m="-1">후진</button><button class="btn ghost sm" data-m="0">정지</button></div>
  </div>`).join(''):'<div class="cl-empty">왼쪽에서 속성 값을 고르고 「객체 만들기」를 눌러요.</div>';
  $('carList').querySelectorAll('.cl-carobj').forEach(d=>d.querySelectorAll('button').forEach(b=>b.onclick=()=>{
    const c=cars[+d.dataset.i], m=+b.dataset.m; c.dir=m;
    carLog(`${c.name}.${m>0?'forward()':m<0?'backward()':'stop()'}   # ${m>0?'전진':m<0?'후진':'정지'}`);
    d.querySelector('.st').textContent=m>0?'전진 중':m<0?'후진 중':'정지'; carGo();
  }));
  const tip=$('carTip');
  if(cars.length>=3){ tip.style.display=''; tip.innerHTML=`틀(Car 클래스)은 <b>1개</b>, 객체는 <b>${cars.length}개</b>예요. 모든 객체가 <b>같은 메소드</b>(전진 · 후진 · 정지)를 쓰지만, 종류 · 색상 · 속도 같은 <b>속성 값은 저마다</b> 달라요. 속도 속성이 큰 객체일수록 전진할 때 더 빨리 움직여요.`; }
  else tip.style.display='none';
}
function carGo(){
  if(carRaf) return;
  carT=performance.now();
  const step=t=>{
    const dt=Math.min(60,t-carT); carT=t; let moving=false;
    cars.forEach((c,i)=>{ if(!c.dir) return; moving=true;
      c.x+=c.dir*c.speed/30*dt/1000;
      if(c.x>80||c.x<0){ c.x=Math.max(0,Math.min(80,c.x)); c.dir=0; const st=document.querySelector(`.cl-carobj[data-i="${i}"] .st`); if(st) st.textContent='정지(길 끝)'; }
      const p=document.querySelector(`.cl-carobj[data-i="${i}"] .pos`); if(p) p.style.left=c.x+'%';
    });
    carRaf=moving?requestAnimationFrame(step):null;
  };
  carRaf=requestAnimationFrame(step);
}
$('carSpeed').oninput=()=>$('carSpeedV').textContent=$('carSpeed').value+'km';
$('carMake').onclick=()=>{
  if(cars.length>=5){ carLog('# 객체는 5개까지 만들 수 있어요. 「모두 지우기」 뒤 다시 만들어 보세요.'); return; }
  carN++; const c={name:'car'+carN, kind:$('carKind').value, color:$('carColor').value, speed:+$('carSpeed').value, x:2, dir:0};
  cars.push(c); carLog(`${c.name} = Car('${c.kind}', '${c.color}', ${c.speed})   # 02에서 배우는 모양`); carDraw(); carSave();
};
$('carClear').onclick=()=>{ cars=[]; carN=0; $('carLog').textContent=''; carDraw(); };
carDraw();

/* 01 Hero 클래스: 속성일까, 메소드일까? */
sorter('heroSort',{
  cats:[{n:'속성',k:'#9b4fc4'},{n:'메소드',k:'#e0702b'}],
  items:[
    {t:'남은 체력 점수',ic:'❤️',c:0,w:'캐릭터의 지금 상태를 나타내는 데이터예요.'},
    {t:'이동 속도',ic:'🏃',c:0,w:'캐릭터마다 다를 수 있는 값으로, 상태를 나타내요.'},
    {t:'가방에 든 아이템 목록',ic:'🎒',c:0,w:'지금 무엇을 가지고 있는지 나타내는 데이터예요(리스트로 저장할 수 있어요).'},
    {t:'체력 회복',ic:'🧪',c:1,w:'체력 점수를 바꾸는 행동이라 함수로 만들어요.'},
    {t:'점프',ic:'⤴️',c:1,w:'캐릭터가 하는 행동이에요.'},
    {t:'다른 캐릭터에게 말 걸기',ic:'💬',c:1,w:'다른 객체와 주고받는 행동이에요. 객체들이 서로 상호 작용하며 프로그램이 돌아가요.'}
  ],
  end:'속성은 <b>상태(데이터)</b>, 메소드는 <b>행동(함수)</b>이에요. Hero 클래스 하나로 이름과 체력이 다른 캐릭터를 100명 만들 수 있어요.'
});

/* 02 한 줄씩 실행해 보기 */
const RUN=[
  {n:'예제 ② 생성자를 이용한 초기화',
   code:["class Book:","    def __init__(self, title, author, year):","        self.title = title","        self.author = author","        self.year = year","","book1 = Book('톰 소여의 모험', '마크 트웨인', 1876)","book2 = Book('데미안', '헤르만 헤세', 1919)","","print(book1.title, book1.author, book1.year)","print(book2.title, book2.author, book2.year)"],
   steps:[
    {hl:[1,2,3,4,5],cls:'Book · 생성자 __init__(self, title, author, year)',note:'Book 클래스와 생성자 __init__()을 정의해요. 정의만 했을 뿐, 아직 실행되지는 않아요.'},
    {hl:[7,2],self:'book1',set:{book1:{}},note:'Book(...)을 호출하면 새 객체가 만들어지면서 생성자 __init__()이 <b>자동으로</b> 호출돼요. self는 지금 만들어지는 book1을 가리켜요.'},
    {hl:[3],self:'book1',set:{book1:{title:"'톰 소여의 모험'"}},note:'self.title = title → book1의 title 속성에 받은 값을 저장해요.'},
    {hl:[4],self:'book1',set:{book1:{author:"'마크 트웨인'"}},note:'self.author = author'},
    {hl:[5],self:'book1',set:{book1:{year:'1876'}},note:'생성자가 끝나면 속성이 모두 채워진 book1이 완성돼요.'},
    {hl:[8,2,3,4,5],self:'book2',set:{book2:{title:"'데미안'",author:"'헤르만 헤세'",year:'1919'}},note:'book2를 만들 때도 같은 생성자가 자동으로 호출돼요. 이번에는 self가 book2를 가리켜요. 한 줄로 속성이 모두 저장됐어요.'},
    {hl:[10],ask:{q:'10번 줄은 무엇을 출력할까?',o:['도서명 저자 0','데미안 헤르만 헤세 1919','톰 소여의 모험 마크 트웨인 1876'],a:2},out:'톰 소여의 모험 마크 트웨인 1876',note:'book1의 속성을 출력해요.'},
    {hl:[11],out:'데미안 헤르만 헤세 1919',note:'클래스 하나로 속성이 다른 책 객체 두 개가 만들어졌어요. 객체를 생성하면서 속성도 함께 저장했어요.'}
   ]},
  {n:'예제 ① 클래스 정의 및 객체 생성 (선택)',
   code:["class Book:","    title = '도서명'","    author = '저자'","    year = 0","","book1 = Book()","print(book1.title, book1.author, book1.year)","","book1.title = '톰 소여의 모험'","book1.author = '마크 트웨인'","book1.year = 1876","print(book1.title, book1.author, book1.year)"],
   steps:[
    {hl:[1,2,3,4],cls:"Book · title='도서명', author='저자', year=0",note:'Book 클래스(설계도)를 정의해요. 아직 객체는 하나도 없어요.'},
    {hl:[6],set:{book1:{title:"'도서명'",author:"'저자'",year:'0'}},note:'Book()으로 객체 book1을 만들어요(인스턴스화). 클래스에 적힌 속성값을 그대로 가지고 만들어져요.'},
    {hl:[7],ask:{q:'7번 줄은 무엇을 출력할까?',o:['도서명 저자 0','오류가 난다','톰 소여의 모험 마크 트웨인 1876'],a:0},out:'도서명 저자 0',note:'book1.title처럼 . 연산자로 속성값에 접근해요.'},
    {hl:[9],set:{book1:{title:"'톰 소여의 모험'"}},note:'book1의 title 속성만 바뀌어요.'},
    {hl:[10],set:{book1:{author:"'마크 트웨인'"}},note:'author 속성도 바꿔요.'},
    {hl:[11],set:{book1:{year:'1876'}},note:'year 속성까지 바꿨어요.'},
    {hl:[12],ask:{q:'12번 줄은 무엇을 출력할까?',o:['도서명 저자 0','도서명 마크 트웨인 1876','톰 소여의 모험 마크 트웨인 1876'],a:2},out:'톰 소여의 모험 마크 트웨인 1876',note:'객체를 만든 뒤 속성을 한 줄씩 바꿔 저장했어요. 책이 많아지면 이런 줄도 그만큼 늘어나요.'}
   ]}
];
let runI=0, runPos=-1, runAsk=false;
function runState(){
  const R=RUN[runI], objs={}, out=[]; let cls='', self='', note='', hl=[];
  for(let k=0;k<=runPos;k++){ const s=R.steps[k];
    if(s.cls) cls=s.cls; if(s.set) for(const o in s.set){ objs[o]=Object.assign(objs[o]||{}, s.set[o]); }
    if(s.out) out.push(s.out); self=s.self||''; note=s.note||''; hl=s.hl; }
  return {cls,objs,out,self,note,hl};
}
function runDraw(chg){
  const R=RUN[runI], S=runState(), nx=R.steps[runPos+1];
  const objs=Object.keys(S.objs).map(o=>`<div class="cl-obj ${S.self===o?'self':''}"><b class="mono">${o}</b>${S.self===o?'<span class="slf">← self</span>':''}${Object.keys(S.objs[o]).length?Object.entries(S.objs[o]).map(([k,v])=>`<div class="mono ${chg&&chg[o]&&k in chg[o]?'chg':''}">.${k} = ${esc(v)}</div>`).join(''):'<div class="muted" style="font-size:.85rem">(속성이 아직 없음)</div>'}</div>`).join('');
  $('runBox').innerHTML=`<div class="cl-run">
    <pre class="cl-code" id="runCode"></pre>
    <div class="cl-state">
      <div class="cl-sec"><span class="cl-chd">클래스</span><div class="mono" style="font-size:.88rem">${S.cls?esc(S.cls):'<span class="muted">(아직 없음)</span>'}</div></div>
      <div class="cl-sec"><span class="cl-chd">객체 상자</span><div class="cl-objrow">${objs||'<span class="muted" style="font-size:.88rem">(아직 없음)</span>'}</div></div>
      <div class="cl-console"><span class="cl-chd">출력</span><div>${S.out.map(esc).join('<br>')||'<span class="muted">(아직 없음)</span>'}</div></div>
      <div class="cl-note">${runPos<0?'「다음 줄」을 눌러 시작해요.':S.note}</div>
      <div id="runAskBox"></div>
      <div class="row"><button class="btn sm" id="runNext" ${nx?'':'disabled'}>${nx?'다음 줄 ▶':'끝까지 실행했어요'}</button><button class="btn ghost sm" id="runReset">처음부터</button></div>
    </div></div>`;
  clCode('runCode',R.code); clHl('runCode',S.hl);
  $('runReset').onclick=()=>{runPos=-1;runAsk=false;runDraw();};
  $('runNext').onclick=()=>{
    if(!nx) return;
    if(nx.ask&&!runAsk){
      runAsk=true; clHl('runCode',nx.hl); $('runNext').disabled=true;
      $('runAskBox').innerHTML=`<div class="cl-pred"><div class="q">🔮 ${nx.ask.q}</div><div class="row">${nx.ask.o.map((o,j)=>`<button class="btn ghost sm" data-j="${j}">${esc(o)}</button>`).join('')}</div><div class="fb"></div></div>`;
      $('runAskBox').querySelectorAll('button').forEach(b=>b.onclick=()=>{
        const ok=+b.dataset.j===nx.ask.a;
        $('runAskBox').querySelectorAll('button').forEach(x=>{x.disabled=true; if(+x.dataset.j===nx.ask.a) x.classList.add('ok');}); if(!ok) b.classList.add('ng');
        $('runAskBox').querySelector('.fb').innerHTML=(ok?'<span class="ok">예측 성공!</span>':'<span class="ng">아쉬워요.</span>')+' 「다음 줄」을 눌러 실행해 확인해요.';
        $('runNext').disabled=false;
      });
      return;
    }
    runAsk=false; runPos++; runDraw(nx.set);
  };
}
tabs('runTabs','runTabsView',RUN.map(r=>({n:r.n,ic:'▶'})),(it,i)=>{ runI=i; runPos=-1; runAsk=false; setTimeout(runDraw,0); return ''; });

clPred('pred2',[
  {code:["class Pet:","    def __init__(self, name, age):","        self.name = name","        self.age = age","","p1 = Pet('콩이', 3)","p2 = Pet('보리', 5)","p1.age = p1.age + 1","print(p1.name, p1.age, p2.age)"],
   q:'① 이 코드의 출력은?',o:['콩이 3 5','콩이 4 5','콩이 4 6'],a:1,w:'p1.age만 1 늘었어요. p2는 같은 클래스로 만들었어도 따로 있는 객체라서 그대로 5예요.'},
  {code:["class Pet:","    def __init__(name, age):","        self.name = name","        self.age = age","","p1 = Pet('콩이', 3)"],
   q:'② 이 코드를 실행하면?',o:['오류가 난다','아무것도 출력되지 않는다','콩이 3이 출력된다'],a:0,w:'생성자의 첫 번째 매개 변수 self를 빠뜨렸어요. 파이썬은 만들어지는 객체를 첫 번째 자리에 넘겨주므로, 받을 자리가 모자라 오류(TypeError)가 나요.'}
]);

/* 03 메소드: 출판된 지 몇 년? */
clCode('yearCode',["from datetime import date","","class Book:","    def __init__(self, title, author, publish_year):","        self.title = title","        self.author = author","        self.publish_year = publish_year","","    def get_years_since_publication(self):","        current_year = date.today().year","        return current_year - self.publish_year","","book = Book('데미안', '헤르만 헤세', 1919)","print(book.get_years_since_publication())"]);
const THIS_YEAR=new Date().getFullYear();
$('yearOut').innerHTML=`<b>${THIS_YEAR-1919}</b> <span class="muted" style="font-size:.85rem">← 올해(${THIS_YEAR}년)에 실행한 결과예요. 교과서는 2024년 기준이라 105가 나와요.</span>`;
function yearCalc(){ const y=Math.round(+$('yearIn').value);
  $('yearRes').innerHTML=!isFinite(y)||!$('yearIn').value?'':(y>THIS_YEAR?`출판 연도가 올해보다 뒤라 결과가 ${THIS_YEAR-y}(음수)가 돼요.`:`<span class="mono">Book(…, ${y}).get_years_since_publication()</span> → <b>${THIS_YEAR-y}</b>`); }
$('yearIn').oninput=yearCalc; yearCalc();

/* 03 학급 문고 대여 프로그램 */
clCode('rentCode',["class Book:","    def __init__(self, title, author):","        self.title = title","        self.author = author","        self.is_rented = False","    def __str__(self):","        return f'{self.title}'","","class Student:","    def __init__(self, id, name):","        self.id = id","        self.name = name","        self.rented_books = []","    def rent_book(self, book):","        if not book.is_rented:","            book.is_rented = True","            self.rented_books.append(book)","            return f'{self.name}에게 {book.title} 대여함.'","        else:","            return f'{book.title} 대여 중.'","","b1 = Book('어린 왕자', '생텍쥐페리')","b2 = Book('홍길동전', '허균')","s1 = Student(1, '김하늘')","s2 = Student(2, '박바다')"]);
clPred('pred3',[
  {q:'🔮 <span class="mono">s1.rent_book(b1)</span>을 실행한 뒤 <span class="mono">print(s2.rent_book(b1))</span>을 실행하면?',o:['어린 왕자 대여 중.','박바다에게 어린 왕자 대여함.','김하늘에게 어린 왕자 대여함.'],a:0,w:'b1의 is_rented가 이미 True라서 if not book.is_rented가 거짓이 되고, else 쪽이 실행돼요.'},
  {q:'🔮 <span class="mono">print(b1)</span>을 실행하면?',o:['b1','어린 왕자','생텍쥐페리'],a:1,w:'Book 클래스에 __str__ 메소드가 title을 돌려주도록 정의되어 있어서, print(객체)를 쓰면 책 제목이 출력돼요.'}
]);
const RENT0=()=>({b1:{title:'어린 왕자',author:'생텍쥐페리',is_rented:false},b2:{title:'홍길동전',author:'허균',is_rented:false},s1:{id:1,name:'김하늘',rented_books:[]},s2:{id:2,name:'박바다',rented_books:[]}});
let RS=RENT0(), rentOut=[];
const rentPy=v=>Array.isArray(v)?'['+v.join(', ')+']':typeof v==='boolean'?(v?'True':'False'):typeof v==='number'?String(v):`'${v}'`;
function rentDraw(chg){
  $('rentObjs').innerHTML=Object.keys(RS).map(o=>`<div class="cl-obj"><b class="mono">${o}</b> <small class="muted">${o[0]==='b'?'Book':'Student'} 객체</small>${Object.entries(RS[o]).map(([k,v])=>`<div class="mono ${chg&&chg.includes(o+'.'+k)?'chg':''}">.${k} = ${esc(rentPy(v))}</div>`).join('')}</div>`).join('');
  $('rentOut').innerHTML=rentOut.length?rentOut.map(esc).join('<br>'):'<span class="muted">(버튼을 눌러 실행해요)</span>';
}
function rentBook(s,b){ const S=RS[s], B=RS[b];
  if(!B.is_rented){ B.is_rented=true; S.rented_books.push(b); return [`${S.name}에게 ${B.title} 대여함.`,[b+'.is_rented',s+'.rented_books']]; }
  return [`${B.title} 대여 중.`,[]]; }
const RCALLS=[
  ['print(s1.rent_book(b1))',()=>rentBook('s1','b1')],
  ['print(s2.rent_book(b1))',()=>rentBook('s2','b1')],
  ['print(s2.rent_book(b2))',()=>rentBook('s2','b2')],
  ['print(b1)',()=>[RS.b1.title,[]]],
  ['print(len(s2.rented_books))',()=>[String(RS.s2.rented_books.length),[]]]
];
$('rentCalls').innerHTML=RCALLS.map((c,i)=>`<button class="btn sm mono" data-i="${i}">${esc(c[0])}</button>`).join('')+'<button class="btn ghost sm" id="rentReset">처음부터</button>';
$('rentCalls').querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{ const [o,ch]=RCALLS[+b.dataset.i][1](); rentOut.push('>>> '+RCALLS[+b.dataset.i][0]); rentOut.push(o); rentOut=rentOut.slice(-10); rentDraw(ch); });
$('rentReset').onclick=()=>{ RS=RENT0(); rentOut=[]; rentDraw(); };
rentDraw();

/* 04 숫자 야구 한 판 */
const BN=['하늘','바다','구름'];
let BG=null;
function ballNames(){ const n=+$('ballN').value; $('ballNames').innerHTML=Array.from({length:n},(_,i)=>`<label>${i+1}번째 이름 <input type="text" class="bnm" maxlength="6" value="${BN[i]}" style="width:80px"></label>`).join(''); }
$('ballN').onchange=ballNames; ballNames();
function ballSample(){ const a=[0,1,2,3,4,5,6,7,8,9]; for(let i=9;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];} return a.slice(0,3); }
function ballLog(s){ $('ballLog').textContent+=s+'\n'; $('ballLog').scrollTop=1e6; }
function ballDraw(){
  if(!BG){ $('ballObjs').innerHTML='<div class="cl-empty">게임을 시작하면 객체가 여기에 나타나요.</div>'; return; }
  const pl=BG.players.map((p,i)=>`<div class="cl-obj ${!BG.over&&i===BG.turn?'self':''}"><b class="mono">players[${i}]</b> <small class="muted">Player 객체</small><div class="mono">.name = '${esc(p.name)}'</div><div class="mono">.numbers = ${BG.over||p.show?'['+p.numbers.join(', ')+']':'[?, ?, ?]'}</div></div>`).join('');
  const gr=x=>'['+x.map(v=>v?'True':'False').join(', ')+']';
  $('ballObjs').innerHTML=`<div class="cl-obj"><b class="mono">game</b> <small class="muted">Game 객체</small><div class="mono">.players = [${BG.players.map((_,i)=>'players['+i+']').join(', ')}]</div></div>
    <div class="cl-objs2">${pl}</div>
    <div class="cl-obj cl-local"><b>play() 안에서 쓰는 변수</b><div class="mono">game_round = ${BG.round}</div><div class="mono">game_result = ${gr(BG.result)}</div>${BG.last?`<div class="mono muted">지난 라운드 결과 = ${gr(BG.last)}</div>`:''}</div>`;
}
$('ballStart').onclick=()=>{
  const names=[...document.querySelectorAll('.bnm')].map((x,i)=>x.value.trim()||BN[i]);
  BG={players:names.map(n=>({name:n,numbers:ballSample()})),round:1,turn:0,result:[],last:null,over:false};
  $('ballLog').textContent=''; ballLog('       <NUMERIC BASEBALL GAME>'); ballLog(`게임 참가자 숫자는?${names.length}`); names.forEach((n,i)=>ballLog(`${i+1}번째 참가자 이름 입력: ${n}`));
  ballLog(`\n${'*'.repeat(15)} Round 1 ${'*'.repeat(15)}`);
  $('ballTurn').style.display=''; $('ballWho').textContent=BG.players[0].name; $('ballIn').value=''; $('ballIn').focus(); ballDraw();
};
function ballGuess(){
  if(!BG||BG.over) return;
  const d=$('ballIn').value.replace(/[^0-9]/g,'');
  if(d.length!==3){ $('ballIn').value=''; $('ballIn').placeholder='숫자 3개!'; return; }
  const g=[...d].map(Number), P=BG.players[BG.turn]; let s=0,b=0;
  for(let i=0;i<3;i++){ if(g[i]===P.numbers[i]) s++; else if(P.numbers.includes(g[i])) b++; }
  ballLog(`${P.name}'s turn :  ${g.join(' ')}`); ballLog(`${s} Strike, ${b} Ball\n`); BG.lastJ=`${P.name} ${s} Strike, ${b} Ball`;
  BG.result.push(s===3); BG.turn++;
  if(BG.turn===BG.players.length){
    if(BG.result.some(Boolean)){
      BG.over=true; const w=BG.players.filter((_,i)=>BG.result[i]).map(p=>p.name);
      ballLog('\n              <GAME OVER>'); ballLog('='.repeat(40)); w.forEach(n=>ballLog(`${n} Win!`)); ballLog('='.repeat(40));
      MEMO.ballLog=`참가자 ${BG.players.length}명 · ${BG.round}라운드에 ${w.join(', ')} 승리`; store.set(MK,MEMO);
      $('ballTurn').style.display='none';
    } else { BG.last=BG.result; BG.result=[]; BG.turn=0; BG.round++; ballLog(`${'*'.repeat(15)} Round ${BG.round} ${'*'.repeat(15)}`); }
  }
  if(!BG.over) $('ballWho').textContent=BG.players[BG.turn].name;
  $('ballIn').value=''; $('ballIn').focus(); ballDraw();
}
$('ballGo').onclick=ballGuess;
$('ballIn').addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); ballGuess(); } });
$('ballGive').onclick=()=>{ if(!BG||BG.over) return; BG.over=true; MEMO.ballLog=`참가자 ${BG.players.length}명 · ${BG.round}라운드까지 · 정답 보기로 끝냄 · 마지막 판정 ${BG.lastJ||'없음'}`; store.set(MK,MEMO); ballLog('정답 공개: '+BG.players.map(p=>`${p.name} [${p.numbers.join(', ')}]`).join(' / ')); $('ballTurn').style.display='none'; ballDraw(); };
ballDraw();

clCode('strikeCode',["def check_strike(self, guessed_nums):  # strike와 ball 결과","    strike_count = ball_count = 0","    for i in range(3):","        if guessed_nums[i] == self.numbers[i]:  # 같은 위치끼리 비교","            strike_count += 1","        elif guessed_nums[i] in self.numbers:   # 정답에 있는지 검사","            ball_count += 1","    print(f'{strike_count} Strike, {ball_count} Ball')","    return strike_count == 3"]);
clPred('pred4',[
  {q:'① <span class="mono">self.numbers</span>가 <span class="mono">[4, 8, 6]</span>일 때 <span class="mono">check_strike([6, 8, 1])</span>이 출력하는 것은?',o:['1 Strike, 1 Ball','2 Strike, 0 Ball','0 Strike, 2 Ball'],a:0,w:'i=1에서 8과 8이 같은 자리라 스트라이크예요. i=0의 6은 자리는 다르지만 정답에 있어서 볼, 1은 정답에 없어요.'},
  {q:'② <span class="mono">self.numbers</span>가 <span class="mono">[2, 7, 0]</span>일 때 <span class="mono">check_strike([0, 2, 7])</span>이 반환하는 값은?',o:['3','True','False'],a:2,w:'같은 자리의 숫자가 하나도 없어서 strike_count는 0이에요(0 Strike, 3 Ball). strike_count == 3이 아니므로 False를 반환해요.'}
]);

/* 04 (가) play() 순서 맞추기 */
const PSTEP=['라운드 번호를 1로 정한다','게임이 끝날 때까지 아래 일을 되풀이한다','이번 라운드의 결과를 담을 빈 리스트를 만든다','「Round 1」처럼 라운드 번호를 출력한다','참가자마다 숫자 3개를 입력받아 check_strike()로 판정하고, 그 결과를 리스트에 넣는다','라운드 번호를 1 늘린다','check_gameover()로 끝났는지 확인하고, 끝났으면 반복을 멈춘다'];
const PMIX=[4,1,6,0,3,5,2];
let pSeq=[], pTry=0;
function pOk(seq){ /* 1·2 처음, 3·4는 서로 바꿔도 됨, 5, 6·7은 서로 바꿔도 됨 */
  const want=[[0],[1],[2,3],[2,3],[4],[5,6],[5,6]];
  for(let i=0;i<seq.length;i++) if(!want[i].includes(seq[i])) return i;
  return -1;
}
function pDraw(msg){
  const box=$('playOrder');
  box.innerHTML=`<div class="cl-order">
    <div class="pool">${PMIX.map(k=>`<button class="cl-card" data-k="${k}" ${pSeq.includes(k)?'disabled':''}>${esc(PSTEP[k])}</button>`).join('')}</div>
    <ol class="seq">${pSeq.map((k,i)=>`<li class="${i>=2?'in':''}">${esc(PSTEP[k])}</li>`).join('')||'<li class="e">카드를 눌러 순서대로 놓아요</li>'}</ol>
    <div class="row"><button class="btn sm" id="pCheck" ${pSeq.length<7?'disabled':''}>순서 확인</button><button class="btn ghost sm" id="pUndo">하나 빼기</button><button class="btn ghost sm" id="pReset">다시</button></div>
    <div class="fb">${msg||''}</div></div>`;
  box.querySelectorAll('.cl-card').forEach(b=>b.onclick=()=>{ pSeq.push(+b.dataset.k); pDraw(); });
  $('pUndo').onclick=()=>{ pSeq.pop(); pDraw(); };
  $('pReset').onclick=()=>{ pSeq=[]; pDraw(); };
  $('pCheck').onclick=()=>{
    pTry++; const bad=pOk(pSeq);
    if(bad<0){ MEMO.playOrderRes=`순서 맞추기 성공(${pTry}번째 시도)`; store.set(MK,MEMO);
      pDraw('<span class="ok">맞아요!</span> 두 번째 카드(되풀이) 뒤의 일은 모두 <b>while 반복 안쪽</b>에 들여 써요. 빈 리스트 만들기와 라운드 출력, 라운드 번호 늘리기와 끝났는지 확인하기는 서로 순서를 바꿔도 결과가 같아요(교과서 코드에서는 라운드 번호 늘리기 → 끝났는지 확인하기 순서예요). 이제 이 순서를 주석 삼아 코랩에서 (가)를 채워 보세요.'); }
    else pDraw(`<span class="ng">${bad+1}번째 카드부터 다시 생각해 봐요.</span> ${bad<2?'게임을 되풀이하기 전에 무엇을 준비해야 할까요?':bad<5?'라운드가 시작될 때 할 일과, 참가자들이 추측하는 일 가운데 무엇이 먼저일까요?':'한 라운드가 끝난 뒤에 할 일을 생각해 봐요.'}`);
  };
}
pDraw();
chips('ckClass','ckClass',['클래스와 객체를 생성하여 프로그램을 작성할 수 있다'],true);

/* 05 개념 정리 빈칸 */
document.querySelectorAll('.cl-blank').forEach(b=>b.onclick=()=>{const on=!b.classList.contains('on'); b.textContent=on?b.dataset.a:'?'; b.classList.toggle('on',on);});

/* 05 런 길이 부호화 함수 따라가기 */
clCode('rleCode',["def run_length_encoding(text):","    a = text[0]","    cnt = 0","    for i in text:","        if i == a[-1]:","            cnt += 1","        else:","            a = a + str(cnt) + i","            cnt = 1","    a = a + str(cnt)","    print(a)","    return a","","run_length_encoding('BBBWWB')"]);
clPred('pred5',[
  {q:"🔮 <span class=\"mono\">run_length_encoding('BBBWWB')</span>가 출력하는 값은?",o:['B3W3','B3W2B1','BWB321'],a:1,w:'같은 문자가 이어지는 동안 cnt를 세고, 다른 문자가 나오면 그때까지의 개수와 새 문자를 a에 붙여요. 마지막 B 하나는 반복이 끝난 뒤 a = a + str(cnt)로 붙어요.'}
]);
let rle=null;
function rleInit(){ const t=$('rleIn').value.replace(/\s/g,''); rle={t,k:0,a:t?t[0]:'',cnt:0,done:false,rows:[]};
  rle.rows.push(t?['시작','–','–','–','a = text[0], cnt = 0',0,rle.a]:['–','–','–','–','문자열을 넣어 주세요','','']); rleDraw(); }
function rleOne(){
  if(!rle||!rle.t||rle.done) return;
  if(rle.k<rle.t.length){ const i=rle.t[rle.k], last=rle.a[rle.a.length-1], same=i===last;
    if(same){ rle.cnt++; rle.rows.push([rle.k+1+'번째',i,last,'같다','cnt += 1',rle.cnt,rle.a]); }
    else { rle.a=rle.a+rle.cnt+i; rle.cnt=1; rle.rows.push([rle.k+1+'번째',i,last,'다르다','a = a + str(cnt) + i, cnt = 1',rle.cnt,rle.a]); }
    rle.k++;
  } else { rle.a=rle.a+rle.cnt; rle.done=true; rle.rows.push(['반복 끝','–','–','–','a = a + str(cnt)',rle.cnt,rle.a]); }
  rleDraw();
}
function rleDraw(){
  $('rleTbl').innerHTML='<tr><th>반복</th><th>i</th><th>a[-1]</th><th>i == a[-1]</th><th class="l">한 일</th><th>cnt</th><th>a</th></tr>'+rle.rows.map((r,j)=>`<tr class="${j===rle.rows.length-1?'now':''}">${r.map((c,x)=>`<td class="${x===4?'l':''} ${x>=5?'mono':''}">${esc(String(c))}</td>`).join('')}</tr>`).join('')+(rle.done?`<tr class="end"><td colspan="7">출력: <b class="mono">${esc(rle.a)}</b></td></tr>`:'');
  $('rleStep').disabled=!rle.t||rle.done; $('rleAll').disabled=!rle.t||rle.done;
}
$('rleStep').onclick=rleOne;
$('rleAll').onclick=()=>{ let g=0; while(rle&&rle.t&&!rle.done&&g++<40) rleOne(); };
$('rleReset').onclick=rleInit;
$('rleIn').oninput=rleInit;
rleInit();
chips('ckProg','ckProg',['프로그래밍으로 해결할 수 있는 문제를 설명할 수 있다','프로그래밍하기 위해 알고리즘을 설계하고 구현할 수 있다','협력적으로 문제를 해결하려는 태도를 평가하는 항목을 나열할 수 있다'],true);

/* 06 마무리 */
const MEMOLIST=[['planClass','처음 생각 · 캐릭터 100명 코드'],['carMade','내가 만든 자동차 객체'],['classWhy','클래스와 객체의 관계'],['initWhy','생성자를 쓰면 달라지는 점'],['methodWhy','s2가 b1을 빌리지 못한 까닭'],['ballLog','숫자 야구 한 판 결과'],['playOrderRes','play() 순서 맞추기'],['playPlan','play()에서 되풀이할 일과 멈추는 조건'],['colabRes','코랩 실행 결과'],['ckClass','성취도 · 클래스와 객체'],['dailyProg','생활 속 프로그래밍으로 해결하는 문제'],['evalAdd','협력 태도 평가 항목과 내 점수'],['ckProg','학업 성취도 점검'],['keyQ','핵심 질문에 대한 내 답'],['newLearn','새롭게 알게 된 점']];
onShow[6]=()=>{ const v=(MEMO.planClass||'').trim(); $('planShow').innerHTML=v?esc(v):'<span class="muted">(시작 화면에 쓴 생각이 없어요)</span>'; memoSummary('msum',MEMOLIST); };
