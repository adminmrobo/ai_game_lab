/* 다이스 엔진 — 주사위 다섯 개 포커(세 사람, 한 번 다시 굴리기)
   족보 판정 · 모든 경우 세기(정확한 확률) · 굴려 보며 어림하기(몬테카를로) · 상대들의 고정 전략
   페이지와 code/check_dice.js가 함께 쓴다. 외부 라이브러리 없음. */
var DG=(function(){
'use strict';
function RNG(seed){var s=(seed>>>0)||1;return function(){s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296;};}
var NAMES=['노페어','원페어','투페어','트리플','스트레이트','풀하우스','포다이스','파이브다이스'];
/* 족보: 숫자별 개수를 세어 정한다. score가 클수록 센 패 (족보 × 7^5 + 같은 족보 안의 비교값) */
function rank(h){var c=[0,0,0,0,0,0,0];h.forEach(function(v){c[v]++;});
  var g=[];for(var v=6;v>=1;v--)if(c[v])g.push([c[v],v]);g.sort(function(a,b){return b[0]-a[0]||b[1]-a[1];});
  var sh=g.map(function(x){return x[0];}).join(''),cat;
  if(sh==='5')cat=7;else if(sh==='41')cat=6;else if(sh==='32')cat=5;
  else if(sh==='11111'&&(c[1]===0||c[6]===0))cat=4;else if(sh==='311')cat=3;else if(sh==='221')cat=2;else if(sh==='2111')cat=1;else cat=0;
  var key=0;g.forEach(function(x){for(var i=0;i<x[0];i++)key=key*7+x[1];});
  return {cat:cat,name:NAMES[cat],score:cat*16807+key};}
/* 주사위 k개의 모든 결과(6^k가지)를 하나씩 돌려준다 */
function each(k,fn){var a=[];for(var i=0;i<k;i++)a.push(1);if(k===0){fn([]);return;}
  while(true){fn(a.slice());var j=k-1;while(j>=0&&a[j]===6){a[j]=1;j--;}if(j<0)break;a[j]++;}}
/* 첫 굴림의 족보별 경우의 수 (7776가지 중) */
function firstTable(){var t=[0,0,0,0,0,0,0,0];each(5,function(h){t[rank(h).cat]++;});return t;}
/* 남길 주사위(mask: 5비트)를 고르면, 다시 굴린 뒤 target 점수를 넘을 정확한 확률 */
function keepOf(h,m){var k=[];for(var i=0;i<5;i++)if(m>>i&1)k.push(h[i]);return k;}
function exactWin(h,m,target){var k=keepOf(h,m),n=5-k.length,w=0,tot=0;each(n,function(r){tot++;if(rank(k.concat(r)).score>target)w++;});return w/tot;}
/* 같은 남기기를 몇 번만 굴려 보고 어림한 확률 */
function mcWin(h,m,target,N,R){R=R||Math.random;var k=keepOf(h,m),n=5-k.length,w=0;for(var t=0;t<N;t++){var r=[];for(var i=0;i<n;i++)r.push(1+Math.floor(R()*6));if(rank(k.concat(r)).score>target)w++;}return w/N;}
/* 서로 다른 남기기만 추린다(같은 숫자 조합은 결과가 같다) */
function masks(h){var seen={},out=[];for(var m=0;m<32;m++){var key=keepOf(h,m).slice().sort().join('');if(seen[key]!=null)continue;seen[key]=m;out.push(m);}return out;}
/* AI ① 모든 경우 세기: 확률이 가장 높은 남기기 */
function bestExact(h,target){var best=null;masks(h).forEach(function(m){var p=exactWin(h,m,target);if(!best||p>best.p+1e-12)best={m:m,p:p};});return best;}
/* AI ② 굴려 보며 어림하기: 남기기마다 N번씩 굴려 본 비율이 가장 높은 것 */
function bestMC(h,target,N,R){var best=null;masks(h).forEach(function(m){var p=mcWin(h,m,target,N,R);if(!best||p>best.p)best={m:m,p:p};});return best;}
/* 감(하루·주판봇·초파리): 스트레이트 이상이면 그대로. 아니면 가장 많이 나온 숫자만(투페어면 두 쌍) 남긴다. 같은 개수면 큰 숫자, 모두 다르면 가장 큰 숫자 하나 */
function gut(h){var r=rank(h);if(r.cat>=4)return 31;
  var c=[0,0,0,0,0,0,0];h.forEach(function(v){c[v]++;});var bv=0,bc=0;for(var v=6;v>=1;v--)if(c[v]>bc){bc=c[v];bv=v;}
  if(r.cat===2){var pv=[];for(v=6;v>=1;v--)if(c[v]===2)pv.push(v);var m2=0;h.forEach(function(x,i){if(pv.indexOf(x)>=0)m2|=1<<i;});return m2;}
  var m=0,done=0;h.forEach(function(x,i){if(x===bv&&(bc>1||!done)){m|=1<<i;done=1;}});return m;}
function roll(n,R){var a=[];for(var i=0;i<n;i++)a.push(1+Math.floor((R||Math.random)()*6));return a;}
function reroll(h,m,R){return h.map(function(v,i){return (m>>i&1)?v:1+Math.floor((R||Math.random)()*6);});}
/* 한 판: 주판봇·초파리가 먼저 굴리고(감으로 한 번 다시 굴림), 플레이어는 두 사람의 결과를 보고 고른다 */
function round(strategy,R,opt){opt=opt||{};var a=roll(5,R);a=reroll(a,gut(a),R);var b=roll(5,R);b=reroll(b,gut(b),R);
  var target=Math.max(rank(a).score,rank(b).score),h=roll(5,R),m;
  if(strategy==='exact')m=bestExact(h,target).m;else if(strategy==='mc')m=bestMC(h,target,opt.N||30,R).m;else m=gut(h);
  var f=reroll(h,m,R),s=rank(f).score;return {win:s>target,tie:s===target,me:f,robo:a,fly:b};}
return {RNG:RNG,NAMES:NAMES,rank:rank,each:each,firstTable:firstTable,keepOf:keepOf,exactWin:exactWin,mcWin:mcWin,masks:masks,bestExact:bestExact,bestMC:bestMC,gut:gut,roll:roll,reroll:reroll,round:round};
})();
if(typeof module!=='undefined')module.exports=DG;
