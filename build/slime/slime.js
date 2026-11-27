/* 슬라임 레이스 엔진 — 슬라임 다섯 마리의 경주와, 모르는 확률을 해 보며 배우는 AI(다중 슬롯머신 문제)
   경주: 결승선 30까지 매 순간 (기본 빠르기 × 상태) × 무작위 뜀(0.1~1.9). 먼저 닿은 슬라임이 1등.
   응원권 1장 = 쿠키 1개. 1등을 맞히면 배당만큼 쿠키를 돌려받는다(못 맞히면 0).
   페이지와 code/check_slime.js가 함께 쓴다. 외부 라이브러리 없음. */
var SR=(function(){
'use strict';
function RNG(seed){var s=(seed>>>0)||1;return function(){s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296;};}
var SL=[ /* 이름, 색, 진한 색, 기본 빠르기(숨김), 배당 */
 {name:'말랑이',c:'#57c46a',d:'#2f8a3f',base:1.00,pay:2.6},
 {name:'퐁당이',c:'#4f8fe0',d:'#2a5aa8',base:0.98,pay:3.6},
 {name:'몽글이',c:'#ef7fb4',d:'#b84a80',base:0.965,pay:5.6},
 {name:'쫀득이',c:'#f2c230',d:'#a37d00',base:0.95,pay:6.2},
 {name:'출렁이',c:'#9b6fd6',d:'#6a42a8',base:0.93,pay:8.4}];
var COND=['좋음','보통','나쁨'],CM=[1.035,1.0,0.965],CP=[0.25,0.5,0.25],LEN=30;
function conds(R){R=R||Math.random;return SL.map(function(){var x=R();return x<CP[0]?0:x<CP[0]+CP[1]?1:2;});}
/* 경주 한 번. track=true면 순간마다 위치를 남긴다(화면용) */
function race(c,R,track){R=R||Math.random;var d=[0,0,0,0,0],hist=track?[d.slice()]:null;
  for(var t=0;t<400;t++){for(var i=0;i<5;i++)d[i]+=SL[i].base*CM[c[i]]*(0.1+1.8*R());if(track)hist.push(d.slice());var m=Math.max.apply(null,d);if(m>=LEN)return {win:d.indexOf(m),hist:hist};}
  return {win:d.indexOf(Math.max.apply(null,d)),hist:hist};}
function reward(i,win){return i===win?SL[i].pay:0;}
/* ── 배우는 AI들 ── 모두 "고르기(choose) → 결과 보기(learn)"를 되풀이한다 */
function argmax(a,R){var b=-Infinity,bs=[];a.forEach(function(v,i){if(v>b+1e-12){b=v;bs=[i];}else if(Math.abs(v-b)<=1e-12)bs.push(i);});return bs[Math.floor((R||Math.random)()*bs.length)];}
/* ① 탐욕 + 가끔 탐험(ε-탐욕): 대개 평균 쿠키가 가장 높은 슬라임, ε 비율로 아무 슬라임 */
function EpsGreedy(eps,R){R=R||Math.random;var A={Q:[0,0,0,0,0],N:[0,0,0,0,0],t:0,eps:eps,kind:'eps'};
  A.choose=function(c){if(R()<A.eps)return Math.floor(R()*5);return argmax(A.Q,R);};
  A.learn=function(i,r,c){A.t++;A.N[i]++;A.Q[i]+=(r-A.Q[i])/A.N[i];};return A;}
/* ② 덜 해 본 쪽에 덤 주기(UCB): 평균 + k × √(ln 전체 횟수 ÷ 그 슬라임 횟수) */
function UCB(k,R){R=R||Math.random;var A={Q:[0,0,0,0,0],N:[0,0,0,0,0],t:0,k:k,kind:'ucb'};
  A.bonus=function(i){return A.N[i]?A.k*Math.sqrt(Math.log(Math.max(1,A.t))/A.N[i]):Infinity;};
  A.choose=function(c){return argmax(A.Q.map(function(q,i){return q+A.bonus(i);}),R);};
  A.learn=function(i,r,c){A.t++;A.N[i]++;A.Q[i]+=(r-A.Q[i])/A.N[i];};return A;}
/* ③ 상태 보고 고르기(맥락 UCB): 평균을 (슬라임, 그 슬라임의 상태) 15가지로 나눠 둔다 */
function CtxUCB(k,R){R=R||Math.random;var A={Q:[],N:[],t:0,k:k,kind:'ctx'};for(var i=0;i<5;i++){A.Q.push([0,0,0]);A.N.push([0,0,0]);}
  A.bonus=function(i,s){return A.N[i][s]?A.k*Math.sqrt(Math.log(Math.max(1,A.t))/A.N[i][s]):Infinity;};
  A.choose=function(c){return argmax(c.map(function(s,i){return A.Q[i][s]+A.bonus(i,s);}),R);};
  A.learn=function(i,r,c){A.t++;A.N[i][c[i]]++;A.Q[i][c[i]]+=(r-A.Q[i][c[i]])/A.N[i][c[i]];};return A;}
/* 늘 같은 슬라임 */
function Fixed(i){return {kind:'fixed',choose:function(){return i;},learn:function(){}};}
/* n번 경주하며 배우기. 쿠키 수지(돌려받은 쿠키 − 응원권 값)를 누적해 돌려준다 */
function run(agent,n,R,every){R=R||Math.random;every=every||0;var net=0,curve=[],picks=[0,0,0,0,0];
  for(var k=0;k<n;k++){var c=conds(R),w=race(c,R).win,i=agent.choose(c),r=reward(i,w);agent.learn(i,r,c);net+=r-1;picks[i]++;if(every&&(k+1)%every===0)curve.push(net);}
  return {net:net,curve:curve,picks:picks};}
return {RNG:RNG,SL:SL,COND:COND,CM:CM,CP:CP,LEN:LEN,conds:conds,race:race,reward:reward,EpsGreedy:EpsGreedy,UCB:UCB,CtxUCB:CtxUCB,Fixed:Fixed,run:run,argmax:argmax};
})();
if(typeof module!=='undefined')module.exports=SR;
