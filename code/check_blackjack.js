// 검산: node code/check_blackjack.js  (결과 숫자를 build/blackjack/nums.json에 적는다)
const BJ=require('../build/blackjack/bj.js'),fs=require('fs');let fail=0;
function ok(c,m){console.log((c?'OK  ':'FAIL')+' '+m);if(!c)fail++;}
const pct=(x,d=1)=>(x*100).toFixed(d)+'%';
// 카드 확률 합 1
ok(Math.abs(BJ.P.reduce((a,b)=>a+b)-1)<1e-12,'카드 확률 합 = 1 (10짜리 13분의 4)');
// 딜러 분포
let bust=[];for(let u=1;u<=10;u++){const D=BJ.dealer(u),s=Object.values(D.d).reduce((a,b)=>a+b);if(Math.abs(s-1)>1e-9)fail++;bust[u]=D.d[22];}
ok(true,'딜러 분포 합 = 1 (모든 카드)');console.log('  터질 확률',bust.map((b,u)=>b==null?'':u+':'+pct(b)).join(' '));
ok([2,3,4,5,6].every(u=>bust[u]>=0.35&&bust[u]<=0.43)&&[7,8,9,10,1].every(u=>bust[u]>=0.16&&bust[u]<=0.27),'2~6은 35~42%, 7 이상은 17~26%');
ok(bust.indexOf(Math.max(...bust.filter(x=>x!=null)))===6,'가장 잘 터지는 딜러 카드 = 6');
ok(Math.abs(8/13-0.615)<0.001,'딜러 16에서 터질 확률 8/13 ≈ 62%');
// 기본 전략 모양
const B=(t,a,u)=>BJ.best(t,a,u).a;
ok([2,3,4,5,6].every(u=>B(16,false,u)==='S')&&[7,8,9,10,1].every(u=>B(16,false,u)==='H'),'16: 딜러 2~6 서기, 7 이상 받기');
ok([13,14,15].every(t=>[2,3,4,5,6].every(u=>B(t,false,u)==='S')),'13~15: 딜러 2~6 서기');
ok(B(12,false,2)==='H'&&B(12,false,4)==='S','12: 딜러 2·3 받기, 4~6 서기');
ok(B(8,true,9)==='H'&&B(8,true,8)==='S','소프트 18: 딜러 9·10·A 받기');
const b16=BJ.best(16,false,10);ok(Math.abs(b16.hit-b16.stand)<0.005,'16 대 10: 두 기댓값 차이 0.005 안');
const b6=BJ.best(16,false,6);
// 정책 기댓값
const EV={basic:BJ.policyEV(BJ.POL.basic),dealer:BJ.policyEV(BJ.POL.dealer),safe:BJ.policyEV(BJ.POL.safe)};console.log('  ',EV);
ok(EV.basic>EV.dealer&&EV.dealer>EV.safe&&EV.basic<0,'가장 좋은 표 > 딜러 흉내 > 안 터지기, 모두 마이너스');
// 시뮬레이션이 정확한 값과 맞는지
const R=BJ.RNG(5);let s=0,n=400000;for(let i=0;i<n;i++)s+=BJ.playHand(BJ.POL.basic,R);ok(Math.abs(s/n-EV.basic)<0.006,'시뮬레이션 40만 판 '+pct(s/n,2)+' ≈ 정확한 값 '+pct(EV.basic,2));
// 몬테카를로 학습
const AG={};for(const k of [1000,10000,100000]){let a=0,e=0;for(let sd=1;sd<=5;sd++){const L=BJ.MC(BJ.RNG(sd*101));L.train(k);a+=L.agree().same;e+=BJ.policyEV(L.pol);}AG[k]=[a/5,e/5];}
console.log('  학습',JSON.stringify(AG));ok(AG[1000][0]<AG[10000][0]&&AG[10000][0]<AG[100000][0]&&AG[100000][0]>=185,'판이 쌓일수록 정답과 같은 상황이 늘고, 10만 판이면 185개 이상');
ok(Math.abs(AG[100000][1]-EV.basic)<0.005,'10만 판 배운 표의 기댓값이 정답 표와 0.5%p 안');
// 평균 고치기 예시
let m=0;[1,-1,1,-1].forEach((r,i)=>{m+=(r-m)/(i+1);});ok(Math.abs(m)<1e-12,'평균 고치기 예시 +1 −1 +1 −1 → 0');
const f=x=>(x*100).toFixed(2)+'%',sg=x=>(x>=0?'+':'−')+Math.abs(x).toFixed(3);
fs.writeFileSync(__dirname+'/../build/blackjack/nums.json',JSON.stringify({BUST6:pct(bust[6]),EV_BASIC:f(EV.basic).replace('-','−'),EV_BASIC_NUM:(EV.basic*100).toFixed(2),EV_DEALER:f(EV.dealer).replace('-','−'),EV_SAFE:f(EV.safe).replace('-','−'),
  AGREE_100K:Math.round(AG[100000][0]/2)+'%',AGREE_100K_N:String(Math.round(AG[100000][0])),EV16_6S:sg(b6.stand),EV16_6H:sg(b6.hit)},null,1));
console.log('nums.json 기록');process.exit(fail?1:0);
