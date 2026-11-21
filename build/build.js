// 페이지 조립: node build/build.js
// 시리즈 목차(build/series) → index.html, 게임별 페이지(build/<게임>/src.html) → <게임>/index.html. 공통: common.css·common.js·sprites.js·kgx.js
// 그다음 꼬리표 조립기(ahnboat_lab_explainer/packs/task/onto-retrofit/tools/assembler.html)의 build()와 같은 방식으로
// 지식 색인(#kg)·온톨로지·서지 꾸러미(#export)와 데이터 블록 네 개를 붙인다.
const fs=require('fs'),path=require('path'),vm=require('vm');
const B=__dirname,R=path.join(B,'..');
const rd=f=>fs.readFileSync(path.join(B,f),'utf8');
const css=rd('common.css'),sprites=rd('sprites.js'),common=rd('common.js');
const kgx=rd('kgx.js');  // ai-lab-explainer v1.14 판 (흰 배경 기본색)
const BB=JSON.parse(rd('backbone.json'));
// KGX.toJsonLd를 쓰려고 브라우저 없이 모듈을 띄운다
const ctx={document:{readyState:'loading',addEventListener(){},getElementById(){return null;}},window:{},navigator:{},console};
vm.createContext(ctx);vm.runInContext(kgx+';this.KGX=KGX;',ctx);
const MK={head:['<!-- lab-kg:head -->','<!-- /lab-kg:head -->'],body:['<!-- lab-kg:body -->','<!-- /lab-kg:body -->'],script:['<!-- lab-kg:script -->','<!-- /lab-kg:script -->']};
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const js=o=>JSON.stringify(o).replace(/<\//g,'<\\/');
const sec=(i,t,sub,m)=>'<section class="kgx kgx-sec" id="'+i+'"><div class="kgx-wrap">\n<h2>'+t+'</h2>\n<p class="kgx-sub">'+sub+'</p>\n<div id="'+m+'"></div>\n</div></section>\n';
function attach(H,kg,refs,meta){
  kg=JSON.parse(JSON.stringify(kg));kg.topicLabels={};BB.nodes.forEach(n=>{kg.topicLabels[n.id]=n.label.ko;});
  const ld=ctx.KGX.toJsonLd(kg,meta),t=meta.title||'';
  const head=['<meta name="citation_title" content="'+esc(t)+'">','<meta name="dc.title" content="'+esc(t)+'">','<meta name="dc.date" content="'+esc(meta.date||'')+'">','<meta name="dc.language" content="ko">','<meta name="dc.type" content="InteractiveResource">'];
  (meta.creator||[]).forEach(c=>{if(c.name)head.push('<meta name="citation_author" content="'+esc(c.name)+'">');});
  if(meta.series)head.push('<meta name="dcterms.isPartOf" content="'+esc(meta.series)+'">');
  refs.forEach(r=>{if(r.DOI)head.push('<meta name="dc.source" content="doi:'+esc(r.DOI)+'">');});
  const bh=MK.head[0]+'\n'+head.join('\n')+'\n'+MK.head[1]+'\n';
  const body=MK.body[0]+'\n'+sec('kg','지식 색인 — 이 페이지에서 찾아보기','이 페이지에 나온 개념, 방법, 주장, 비유, 열린 질문을 한곳에 모았다. 검색하고, 항목을 눌러 이웃 관계를 보고, "설명 보러 가기"로 본문에 돌아간다.','kg-mount')+
    sec('export','온톨로지·서지 꾸러미 — 이 페이지의 지식을 가져가기','지식 색인을 출처와 함께 파일로 내려받는다. Zotero(BibTeX·RIS), Protégé(Turtle), Neo4j·Gephi(CSV), 여러 페이지 합치기(kg.json)에 쓴다.','export-mount')+
    '<script type="application/json" id="kg-raw">'+js(kg)+'</'+'script>\n<script type="application/ld+json" id="kg-ld">'+js(ld)+'</'+'script>\n'+
    '<script type="application/json" id="refs-csl">'+js(refs)+'</'+'script>\n<script type="application/json" id="page-meta">'+js(meta)+'</'+'script>\n'+MK.body[1]+'\n';
  const sc=MK.script[0]+'\n<script>\n'+kgx+'\n</'+'script>\n'+MK.script[1]+'\n';
  H=H.replace('</head>',bh+'</head>');
  let i=H.lastIndexOf('<footer'),j=H.lastIndexOf('</body>'),p=(i>=0&&i<j)?i:j;H=H.slice(0,p)+body+H.slice(p);
  j=H.lastIndexOf('</body>');H=H.slice(0,j)+sc+H.slice(j);return H;}
const fill=s=>s.replace('<!--@@CSS@@-->',()=>'<style>\n'+css+'\n</style>').replace('/*@@SPRITES@@*/',()=>sprites).replace('/*@@COMMON@@*/',()=>common);
function out(rel,H){const f=path.join(R,rel);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,H);console.log(rel,(Buffer.byteLength(H)/1024).toFixed(0)+' KB');}
// 시리즈 목차
out('index.html',fill(rd('series/index.src.html')));
// 게임 페이지
const pagecss=rd('page.css'),sfx=rd('sfx.js');
const GAMES=[['sudoku','sudoku.js'],['coin','coin.js']];
for(const [game,engine] of GAMES){const d=game+'/';
  let H=fill(rd(d+'src.html')).replace('/*@@PAGECSS@@*/',()=>pagecss).replace('/*@@ENGINE@@*/',()=>rd(d+engine)).replace('/*@@SUDOKU@@*/',()=>rd(d+engine)).replace('/*@@SFX@@*/',()=>sfx);
  if(fs.existsSync(path.join(B,d+'puzzles.json')))H=H.replace('/*@@PUZZLES@@*/null',()=>JSON.stringify(JSON.parse(rd(d+'puzzles.json'))));
  H=attach(H,JSON.parse(rd(d+'kg.json')),JSON.parse(rd(d+'refs.json')),JSON.parse(rd(d+'meta.json')));
  out(game+'/index.html',H);}
