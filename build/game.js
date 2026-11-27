/* game.js — ③ 다이스 · ④ 블랙잭 · ⑤ 슬라임 레이스가 함께 쓰는 게임 화면 도우미 (common.js 다음에 붙는다) */
var GK=(function(){
'use strict';
var $=U.$,$$=U.$$;
/* 플레이어 셋: 이름, 색, 표정(시작·생각·기쁨·슬픔·귀띔) */
var WHO={asst:['조수 하루','var(--c-asst)',{start:'asst_e12',think:'asst_e09',happy:'asst_e19',sad:'asst_e24',tip:'asst_e07'}],
 sia:['인턴 시아','var(--c-sia)',{start:'sia_e10',think:'sia_e09',happy:'sia_e16',sad:'sia_e20',tip:'sia_e07'}],
 moa:['인턴 모아','var(--c-moa)',{start:'moa_e19',think:'moa_e09',happy:'moa_e19',sad:'moa_e24',tip:'moa_e01'}]};
function tabs(host,list,cur,on){host.innerHTML='';list.forEach(function(it){var b=document.createElement('button');b.type='button';b.className='bt';b.textContent=it[1];b.setAttribute('aria-pressed',String(it[0]===cur));
  b.onclick=function(){$$('button',host).forEach(function(x){x.setAttribute('aria-pressed','false');});b.setAttribute('aria-pressed','true');on(it[0]);};host.appendChild(b);});}
function later(fn,ms){return setTimeout(fn,U.reduce?0:ms);}
/* 등장인물 카드와 방청석 */
function cast(list,secret){$('#castgrid').innerHTML=list.map(function(c){return '<div class="castc" style="--cc:var(--c-'+c[0]+')"><img src="'+U.spr(c[1])+'" alt="" aria-hidden="true"><div><b>'+c[2]+'</b><p>'+c[3]+'</p></div></div>';}).join('');
  $('#secretrow').innerHTML=['x1','x2','x3'].map(function(x,i){return U.say(x,x+'_hint',secret[i]);}).join('');
  $('#secretbtn').onclick=function(){var r=$('#secretrow');r.hidden=!r.hidden;this.setAttribute('aria-expanded',String(!r.hidden));this.textContent=r.hidden?'방청석 보기 (미공개 식구)':'방청석 닫기';};
  U.fillImgs();}
/* 표지: 그림 파일이 아직 없으면 임시 표지(픽셀 SVG + 캐릭터)의 빈 그림을 채운다 */
function cover(){$$('#coverframe img[data-mood]').forEach(function(im){if(!im.getAttribute('src'))im.src=U.spr(im.dataset.mood);});}
/* 누적 곡선 그리기(대결용): series = [{name,color,ys:[...]}] */
function lines(cv,series,o){o=o||{};var S=U.setup(cv),g=S.g,w=S.w,h=S.h,L=44,Rr=12,T=14,B=26;U.grid24(g,w,h);
  var n=0,lo=Infinity,hi=-Infinity;series.forEach(function(s){n=Math.max(n,s.ys.length);s.ys.forEach(function(y){if(y<lo)lo=y;if(y>hi)hi=y;});});
  if(o.zero){lo=Math.min(lo,0);hi=Math.max(hi,0);}if(!isFinite(lo)){lo=0;hi=1;}if(hi-lo<1e-9){hi=lo+1;}var pad=(hi-lo)*0.08;lo-=pad;hi+=pad;
  var X=function(i){return L+(w-L-Rr)*i/Math.max(1,n-1);},Y=function(v){return T+(h-T-B)*(1-(v-lo)/(hi-lo));};
  g.fillStyle='#5b6874';g.font='11px '+U.cssv('--font');g.textAlign='right';g.textBaseline='middle';
  for(var k=0;k<=4;k++){var v=lo+(hi-lo)*k/4;g.fillText(o.fmt?o.fmt(v):v.toFixed(0),L-6,Y(v));}
  g.textAlign='center';g.textBaseline='top';g.fillText(o.xlab||'',L+(w-L-Rr)/2,h-B+8);
  if(o.zero){g.strokeStyle='rgba(22,33,43,.35)';g.setLineDash([4,3]);g.beginPath();g.moveTo(L,Y(0));g.lineTo(w-Rr,Y(0));g.stroke();g.setLineDash([]);}
  series.forEach(function(s){g.strokeStyle=s.color;g.lineWidth=2.2;g.beginPath();s.ys.forEach(function(y,i){if(i)g.lineTo(X(i),Y(y));else g.moveTo(X(i),Y(y));});g.stroke();
    if(s.ys.length){var last=s.ys[s.ys.length-1];U.label(g,Math.min(X(s.ys.length-1),w-60),Y(last)-10,s.name,s.color,'right');}});}
return {WHO:WHO,tabs:tabs,later:later,cast:cast,cover:cover,lines:lines};
})();
