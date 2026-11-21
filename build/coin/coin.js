/* 코인 게임 엔진 — 동전 1개 남기기(뒤에서부터 따지기·스스로 두며 배우기)와 동전 옮기기(모든 수 찾기)
   페이지와 code/check_coin.js가 함께 쓴다. 외부 라이브러리 없음. */
var CG=(function(){
'use strict';
var MAXN=25;
function RNG(seed){var s=(seed>>>0)||1;return function(){s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296;};}
/* ── 동전 1개 남기기 ── 규칙: 한 번에 1~3개 가져간다. 마지막 동전을 가져가는 사람(자기 차례에 1개가 남은 사람)이 진다. */
function legal(n){var o=[];for(var a=1;a<=3&&a<=n;a++)o.push(a);return o;}
/* 뒤에서부터 따지기: win[n] = 동전 n개 앞에서 차례인 사람이 이길 수 있는가 */
function table(N){N=N||MAXN;var win=[null],why=[null];
  for(var n=1;n<=N;n++){var good=null;legal(n).forEach(function(a){if(good!=null)return;var r=n-a;if(r===0)return; // 다 가져가면 진다
      if(!win[r])good=a;});
    win.push(good!=null);why.push(good);}
  return {win:win,best:why};}
/* 필승 공식대로 두는 쪽(주판봇): 상대 차례에 1+4N개가 남게 가져간다. 그럴 수 없으면 아무거나 */
function perfect(n,R){var a=(n-1)%4;if(a>=1&&a<=3)return a;var L=legal(n).filter(function(x){return x<n;});if(!L.length)return n;return L[Math.floor((R||Math.random)()*L.length)];}
/* 스스로 두며 배우기(Q 학습, 같은 표로 양쪽을 둔다)
   Q[n][a] = 동전 n개 앞에서 a개 가져갈 때의 기대 점수(+1 이김, −1 짐).
   목표값: a = n(마지막을 가져감)이면 −1, 아니면 −(상대 자리에서의 가장 좋은 Q) */
function Learner(o){o=o||{};var R=o.rng||Math.random,alpha=o.alpha||0.5,eps=o.eps==null?0.3:o.eps,N=o.N||21;
  var Q=[];for(var n=0;n<=N;n++)Q.push([0,0,0,0]);
  var L={Q:Q,games:0,N:N};
  function best(n){var b=-9;legal(n).forEach(function(a){if(Q[n][a]>b)b=Q[n][a];});return b;}
  function pick(n,greedy){var as=legal(n);if(!greedy&&R()<eps)return as[Math.floor(R()*as.length)];var b=-9,bs=[];as.forEach(function(a){if(Q[n][a]>b+1e-9){b=Q[n][a];bs=[a];}else if(Math.abs(Q[n][a]-b)<1e-9)bs.push(a);});return bs[Math.floor(R()*bs.length)];}
  L.best=best;L.pick=pick;
  L.play=function(start){var n=start||(2+Math.floor(R()*(N-1)));while(n>0){var a=pick(n,false),r=n-a,t=r===0?-1:-best(r);Q[n][a]+=alpha*(t-Q[n][a]);n=r;}L.games++;};
  L.train=function(k){for(var i=0;i<k;i++)L.play();};
  L.found=function(){var lose=[];for(var n=1;n<=N;n++)if(best(n)<0)lose.push(n);return lose;};
  return L;}
/* 배운 AI(욕심껏 가장 좋은 수) 대 주판봇(필승 공식). 배운 AI가 먼저, 이길 수 있는 시작 개수에서만 */
function match(L,games,R){R=R||Math.random;var w=0;for(var g=0;g<games;g++){var n;do{n=6+Math.floor(R()*(L.N-5));}while((n-1)%4===0);
    var turn=0;while(true){var a=turn===0?L.pick(n,true):perfect(n,R);n-=a;if(n===0){if(turn===1)w++;break;}turn=1-turn;}}return w;}
/* ── 동전 옮기기 ── 규칙: 이웃한 동전 2개를 순서 그대로 줄의 맨 왼쪽 또는 맨 오른쪽 끝으로 옮긴다. 같은 색끼리 모으면 끝. */
function moves(s){var o=[];for(var i=0;i<s.length-1;i++){var p=s.slice(i,i+2),r=s.slice(0,i)+s.slice(i+2);o.push({i:i+1,d:'L',to:p+r});o.push({i:i+1,d:'R',to:r+p});}return o;}
function solved(s){return s==='GGGSS'||s==='SSGGG';}
function bfs(start){var dist={},prev={},q=[start],lv=[[start]];dist[start]=0;
  while(q.length){var s=q.shift();moves(s).forEach(function(m){if(!(m.to in dist)){dist[m.to]=dist[s]+1;prev[m.to]={from:s,m:m};q.push(m.to);(lv[dist[m.to]]=lv[dist[m.to]]||[]).push(m.to);}});}
  function path(goal){var p=[],c=goal;while(prev[c]){p.unshift({from:prev[c].from,m:prev[c].m,to:c});c=prev[c].from;}return p;}
  return {dist:dist,levels:lv,path:path};}
function apply(s,i,d){var m=moves(s).filter(function(x){return x.i===i&&x.d===d;})[0];return m?m.to:s;}
return {MAXN:MAXN,RNG:RNG,legal:legal,table:table,perfect:perfect,Learner:Learner,match:match,moves:moves,solved:solved,bfs:bfs,apply:apply};
})();
if(typeof module!=='undefined')module.exports=CG;
