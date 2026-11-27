/* 블랙잭 엔진 — 받기(히트)·서기(스탠드)만 있는 단순 규칙
   카드 뭉치는 끝없이 많다고 본다(무한 덱: A~9는 13분의 1, 10·J·Q·K는 합쳐 13분의 4).
   딜러는 17 이상(A를 11로 센 17 포함)이면 서고, 처음 두 장이 21(블랙잭)이면 1.5배, 딜러는 블랙잭을 먼저 확인한다.
   정확한 계산(기댓값)과 해 보고 평균 내기(몬테카를로 학습)를 함께 담는다. 페이지와 code/check_blackjack.js가 함께 쓴다. */
var BJ=(function(){
'use strict';
function RNG(seed){var s=(seed>>>0)||1;return function(){s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296;};}
var P=[0,1/13,1/13,1/13,1/13,1/13,1/13,1/13,1/13,1/13,4/13]; /* 카드 값 1(A)~10의 확률 */
function draw(R){var x=Math.floor((R||Math.random)()*13)+1;return x>10?10:x;}
/* 손패 값: 합(A를 1로) + A가 있고 10을 더해도 21 이하면 10을 더한다(소프트) */
function val(tot,ace){return ace&&tot+10<=21?tot+10:tot;}
function soft(tot,ace){return ace&&tot+10<=21;}
function handVal(cards){var t=0,a=false;cards.forEach(function(c){t+=c;if(c===1)a=true;});return val(t,a);}
function isBJ(cards){return cards.length===2&&handVal(cards)===21;}
/* 딜러: 보이는 카드 up에서 끝까지 뽑았을 때 최종 결과 분포 (17~21, 22=터짐), 딜러 블랙잭은 따로 */
var DM={};
function dealerFrom(tot,ace){var k=tot+'|'+ace;if(DM[k])return DM[k];var v=val(tot,ace),d={17:0,18:0,19:0,20:0,21:0,22:0};
  if(tot>21){d[22]=1;}else if(v>=17){d[v]=1;}else{for(var c=1;c<=10;c++){var s=dealerFrom(tot+c,ace||c===1);for(var x in s)d[x]+=P[c]*s[x];}}
  return (DM[k]=d);}
var DU={};
function dealer(up){if(DU[up])return DU[up];var bj=0,d={17:0,18:0,19:0,20:0,21:0,22:0};
  for(var h=1;h<=10;h++){if((up===1&&h===10)||(up===10&&h===1)){bj+=P[h];continue;}var s=dealerFrom(up+h,up===1||h===1);for(var x in s)d[x]+=P[h]*s[x];}
  for(var y in d)d[y]/=(1-bj);return (DU[up]={bj:bj,d:d});}
/* 서면 얻는 기댓값(딜러 블랙잭이 아닌 것이 확인된 뒤) */
function standEV(v,up){if(v>21)return -1;var d=dealer(up).d,e=0;for(var x in d){x=+x;e+=d[x]*(x===22||x<v?1:x===v?0:-1);}return e;}
/* 정책 pol(tot,ace,up) → 'H' 또는 'S'. 정책을 주지 않으면 가장 좋은 쪽(기댓값이 큰 쪽)을 고른다 */
function makeV(pol){var M={};
  function V(tot,ace,up){if(tot>21)return -1;var k=tot+'|'+ace+'|'+up;if(M[k]!=null)return M[k];var s=standEV(val(tot,ace),up),h=hitEV(tot,ace,up),a;
    if(pol)a=pol(tot,ace,up)==='H'?h:s;else a=Math.max(s,h);return (M[k]=a);}
  function hitEV(tot,ace,up){if(val(tot,ace)>=21&&!pol)return -1;var e=0;for(var c=1;c<=10;c++){var t=tot+c;e+=P[c]*(t>21?-1:V(t,ace||c===1,up));}return e;}
  return {V:V,hit:hitEV};}
var OPT=makeV(null);
function best(tot,ace,up){var s=standEV(val(tot,ace),up),h=OPT.hit(tot,ace,up);return {a:h>s+1e-12?'H':'S',stand:s,hit:h};}
var POL={
  basic:function(t,a,u){return best(t,a,u).a;},
  dealer:function(t,a,u){return val(t,a)<17?'H':'S';},       /* 딜러 흉내: 17 미만이면 받기 */
  safe:function(t,a,u){return t<=11?'H':'S';}                  /* 절대 안 터지기: 다음 카드로 터질 수 있으면(합 12 이상) 서기 */
};
/* 정책의 한 판 평균 수익(정확한 값): 첫 두 장·딜러 카드를 모두 따진다 */
function policyEV(pol){var V=makeV(pol).V,e=0;
  for(var u=1;u<=10;u++){var D=dealer(u);for(var a=1;a<=10;a++)for(var b=1;b<=10;b++){var p=P[u]*P[a]*P[b],pbj=(a===1&&b===10)||(a===10&&b===1);
    e+=p*(D.bj*(pbj?0:-1)+(1-D.bj)*(pbj?1.5:V(a+b,a===1||b===1,u)));}}return e;}
/* 한 판 직접 두기 (시뮬레이션) */
function playHand(pol,R,learned){var pc=[draw(R),draw(R)],up=draw(R),hole=draw(R),dc=[up,hole];
  if(isBJ(dc))return isBJ(pc)?0:-1;if(isBJ(pc))return 1.5;
  var t=pc[0]+pc[1],ace=pc[0]===1||pc[1]===1;
  while(t<=21){var act=learned?learned(t,ace,up):pol(t,ace,up);if(val(t,ace)>=21)act='S';if(act!=='H')break;var c=draw(R);t+=c;if(c===1)ace=true;}
  if(t>21)return -1;var v=val(t,ace),dt=up+hole,da=up===1||hole===1;while(val(dt,da)<17){var c2=draw(R);dt+=c2;if(c2===1)da=true;}
  var dv=dt>21?22:val(dt,da);return dv===22||dv<v?1:dv===v?0:-1;}
/* 해 보고 평균 내기(몬테카를로 학습, 탐험 시작): 상태 = (내 합 12~21, 쓸 수 있는 A, 딜러 카드 1~10)
   판마다 무작위 상태·무작위 첫 행동에서 시작하고, 그 뒤엔 지금까지의 평균이 높은 쪽으로 둔다. 판이 끝나면 거쳐 간 (상태, 행동)에 결과를 더해 평균을 고친다. */
function MC(R){R=R||Math.random;var Q={},N={},eps=0;
  function key(v,s,u){return v+'|'+(s?1:0)+'|'+u;}
  function init(k){if(!Q[k]){Q[k]={H:0,S:0};N[k]={H:0,S:0};}}
  function greedy(v,s,u){var k=key(v,s,u);init(k);return Q[k].H>Q[k].S?'H':'S';}
  function episode(){var v=12+Math.floor(R()*10),s=R()<0.5,tot=s?v-10:v,ace=s,u=draw(R),hole;do{hole=draw(R);}while((u===1&&hole===10)||(u===10&&hole===1));
    var seen=[],a=R()<0.5?'H':'S';
    while(true){seen.push([key(val(tot,ace),soft(tot,ace),u),a]);if(a!=='H')break;var c=draw(R);tot+=c;if(c===1)ace=true;if(tot>21)break;a=val(tot,ace)===21?'S':greedy(val(tot,ace),soft(tot,ace),u);}
    var r;if(tot>21)r=-1;else{var pv=val(tot,ace),dt=u+hole,da=u===1||hole===1;while(val(dt,da)<17){var c2=draw(R);dt+=c2;if(c2===1)da=true;}var dv=dt>21?22:val(dt,da);r=dv===22||dv<pv?1:dv===pv?0:-1;}
    var done={};seen.forEach(function(x){var k=x[0],act=x[1],id=k+act;if(done[id])return;done[id]=1;init(k);N[k][act]++;Q[k][act]+=(r-Q[k][act])/N[k][act];});}
  var L={Q:Q,N:N,games:0};
  L.train=function(n){for(var i=0;i<n;i++)episode();L.games+=n;};
  L.act=function(v,s,u){var k=key(v,s,u);if(!Q[k])return 'S';return Q[k].H>Q[k].S?'H':'S';};
  L.pol=function(t,a,u){var v=val(t,a);if(v<12)return 'H';return L.act(v,soft(t,a),u);};
  /* 가장 좋은 표(정확한 계산)와 같은 상황 수 — 상태 200개(합 12~21 × A 있음/없음 × 딜러 카드 10) */
  L.agree=function(){var same=0,tot=0;for(var v=12;v<=21;v++)for(var s=0;s<2;s++)for(var u=1;u<=10;u++){var t=s?v-10:v;if(s&&t<2)continue;tot++;if(L.act(v,!!s,u)===best(t,!!s,u).a)same++;}return {same:same,tot:tot};};
  return L;}
return {RNG:RNG,P:P,draw:draw,val:val,soft:soft,handVal:handVal,isBJ:isBJ,dealer:dealer,standEV:standEV,best:best,makeV:makeV,POL:POL,policyEV:policyEV,playHand:playHand,MC:MC};
})();
if(typeof module!=='undefined')module.exports=BJ;
