/* 스도쿠 엔진 — 벌점(에너지) 세기, 정답 찾기, 공 굴리기(흔들기 섞인 내리막), 벌점표 배우기
   페이지와 code/check_sudoku.js가 함께 쓴다. 외부 라이브러리 없음. */
var SD=(function(){
'use strict';
function Board(n){ // n = 4 또는 9
  var b=n===4?2:3,peers=[],pairs=[],i,j;
  function rc(k){return [Math.floor(k/n),k%n];}
  function same(a,c){var A=rc(a),C=rc(c);return A[0]===C[0]||A[1]===C[1]||(Math.floor(A[0]/b)===Math.floor(C[0]/b)&&Math.floor(A[1]/b)===Math.floor(C[1]/b));}
  for(i=0;i<n*n;i++){peers.push([]);}
  for(i=0;i<n*n;i++)for(j=i+1;j<n*n;j++)if(same(i,j)){peers[i].push(j);peers[j].push(i);pairs.push([i,j]);}
  return {n:n,b:b,N:n*n,peers:peers,pairs:pairs,rc:rc,same:same};
}
var B4=Board(4),B9=Board(9);
function B(n){return n===4?B4:B9;}
function parse(s){return s.split('').map(function(c){return c==='.'||c==='0'?0:+c;});}
/* 벌점(에너지): 같은 줄·같은 묶음 안에서 같은 숫자인 짝 하나당 1점 */
function energy(g,n){var bd=B(n),e=0;bd.pairs.forEach(function(p){if(g[p[0]]&&g[p[0]]===g[p[1]])e++;});return e;}
function conflictPairs(g,n){return B(n).pairs.filter(function(p){return g[p[0]]&&g[p[0]]===g[p[1]];});}
function local(g,n,k,v){var c=0,P=B(n).peers[k];v=v==null?g[k]:v;if(!v)return 0;for(var i=0;i<P.length;i++)if(g[P[i]]===v)c++;return c;}
/* 정답 찾기(검산용, 되돌아가기 탐색) */
function solve(g0,n,limit){var g=g0.slice(),bd=B(n),sols=[],lim=limit||2;
  function ok(k,v){var P=bd.peers[k];for(var i=0;i<P.length;i++)if(g[P[i]]===v)return false;return true;}
  (function go(){if(sols.length>=lim)return;var k=-1,best=99,cand=null;
    for(var i=0;i<bd.N;i++)if(!g[i]){var c=[];for(var v=1;v<=n;v++)if(ok(i,v))c.push(v);if(c.length<best){best=c.length;k=i;cand=c;if(!best)break;}}
    if(k<0){sols.push(g.slice());return;}
    for(var j=0;j<cand.length;j++){g[k]=cand[j];go();g[k]=0;}})();
  return sols;}
/* 난수(씨앗 고정 가능) */
function RNG(seed){var s=(seed>>>0)||1;return function(){s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296;};}
/* 공 굴리기 한 판: 힌트 고정 → 빈자리는 아무 숫자 → 벌점이 큰 자리를 골라 벌점이 가장 작아지는 숫자로 → 가끔 흔들기 */
function Walker(puz,n,shake,rnd){
  var bd=B(n),g=puz.slice(),free=[],i,R=rnd||Math.random;
  for(i=0;i<bd.N;i++)if(!puz[i]){free.push(i);g[i]=1+Math.floor(R()*n);}
  var W={g:g,n:n,free:free,shake:shake,steps:0,E:energy(g,n),hist:[],last:-1,done:false,moved:-1};
  W.hist.push(W.E);
  W.stuck=false;
  W.step=function(){if(W.done)return;var bad=[],k,v,j,c;
    for(j=0;j<free.length;j++){k=free[j];c=local(g,n,k);if(c>0)bad.push([k,c]);}
    if(!bad.length){W.done=true;return;}
    var mv=null;
    if(R()<W.shake){k=bad[Math.floor(R()*bad.length)][0];v=1+Math.floor(R()*n);mv=[k,v,'shake'];}
    else{ // 내리막: 벌점이 큰 자리부터, 그 자리의 벌점을 줄이는 숫자가 있으면 바꾼다
      bad.sort(function(x,y){return y[1]-x[1]||R()-0.5;});
      for(j=0;j<bad.length&&!mv;j++){k=bad[j][0];var cur=bad[j][1],bv=[],bc=cur;
        for(v=1;v<=n;v++){if(v===g[k])continue;var c2=local(g,n,k,v);if(c2<bc){bc=c2;bv=[v];}else if(c2===bc&&bc<cur)bv.push(v);}
        if(bv.length)mv=[k,bv[Math.floor(R()*bv.length)],'down'];}
      if(!mv){ // 작은 웅덩이: 어느 자리를 바꿔도 벌점이 줄지 않음
        if(W.shake>0){k=bad[Math.floor(R()*bad.length)][0];v=1+Math.floor(R()*n);mv=[k,v,'shake'];}
        else{W.stuck=true;W.done=true;return;}}
    }
    var o=local(g,n,mv[0]);g[mv[0]]=mv[1];W.E+=local(g,n,mv[0])-o;W.moved=mv[0];W.kind=mv[2];W.steps++;W.hist.push(W.E);if(W.E===0)W.done=true;};
  return W;}
function run(puz,n,shake,maxSteps,seed){var W=Walker(puz,n,shake,seed?RNG(seed):null);while(!W.done&&W.steps<maxSteps)W.step();return W;}
/* 무작위 정답판 만들기 (4×4 학습 예시용) */
function randomSolution(n,R){var g=new Array(n*n).fill(0),bd=B(n);R=R||Math.random;
  (function go(k){if(k===bd.N)return true;var vs=[];for(var v=1;v<=n;v++)vs.push(v);for(var i=vs.length-1;i>0;i--){var j=Math.floor(R()*(i+1)),t=vs[i];vs[i]=vs[j];vs[j]=t;}
    for(var a=0;a<vs.length;a++){var ok=true,P=bd.peers[k];for(var p=0;p<P.length;p++)if(g[P[p]]===vs[a]){ok=false;break;}if(ok){g[k]=vs[a];if(go(k+1))return true;g[k]=0;}}return false;})(0);
  return g;}
/* 벌점표 배우기(대조 학습을 단순하게): 정답 예시에 나온 숫자 짝은 낮추고, 아무렇게나 채운 가짜 답에 나온 짝은 올린다.
   W[a][b] = 16 × (가짜 답에서 본 비율 − 정답에서 본 비율). 같은 줄 짝이면 같은 숫자 짝이 +1로, 다른 숫자 짝이 −1/3로 간다. */
function Learner(k1,k2,n,R){R=R||Math.random;var L={pos:[],neg:[],seen:0,k1:k1,k2:k2};var i,j;
  for(i=0;i<n;i++){L.pos.push(new Array(n).fill(0));L.neg.push(new Array(n).fill(0));}
  L.show=function(m){for(var t=0;t<m;t++){var s=randomSolution(n,R);L.pos[s[k1]-1][s[k2]-1]++;var a=1+Math.floor(R()*n),b=1+Math.floor(R()*n);L.neg[a-1][b-1]++;L.seen++;}};
  L.W=function(){var o=[];for(var a=0;a<n;a++){o.push([]);for(var b=0;b<n;b++)o[a].push(L.seen?n*n*(L.neg[a][b]-L.pos[a][b])/L.seen:0);}return o;};
  return L;}
/* 그릇 만들기: 빈자리 k개짜리 판의 모든 답안 → (정답과 다른 자리 수, 벌점) */
function landscape(puz,sol,n){var free=[],i;for(i=0;i<puz.length;i++)if(!puz[i])free.push(i);
  var m=free.length,tot=Math.pow(n,m),out=[],g=puz.slice();
  for(var c=0;c<tot;c++){var x=c,d=0;for(i=0;i<m;i++){var v=1+x%n;x=Math.floor(x/n);g[free[i]]=v;if(v!==sol[free[i]])d++;}out.push({d:d,e:energy(g,n),code:c});}
  return {free:free,m:m,list:out};}
function fill(puz,free,code,n){var g=puz.slice(),x=code;for(var i=0;i<free.length;i++){g[free[i]]=1+x%n;x=Math.floor(x/n);}return g;}
return {Board:Board,B:B,parse:parse,energy:energy,conflictPairs:conflictPairs,local:local,solve:solve,RNG:RNG,Walker:Walker,run:run,randomSolution:randomSolution,Learner:Learner,landscape:landscape,fill:fill};
})();
if(typeof module!=='undefined')module.exports=SD;
