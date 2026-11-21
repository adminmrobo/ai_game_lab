// 검산: node code/check_coin.js
const CG=require('../build/coin/coin.js');let fail=0;
function ok(c,m){console.log((c?'OK  ':'FAIL')+' '+m);if(!c)fail++;}
const T=CG.table(25),lose=T.win.map((w,n)=>w===false?n:null).filter(x=>x);
ok(lose.join()==='1,5,9,13,17,21,25','지는 자리 = '+lose.join(', '));
ok([...Array(25).keys()].slice(1).every(n=>T.win[n]===((n-1)%4!==0)),'모든 n에서 지는 자리 ⇔ (n − 1)을 4로 나눈 나머지 0');
ok(T.best[15]===2&&T.best[10]===1,'예시: 15개 → 2개, 10개 → 1개');
// 주판봇(필승 공식)끼리: 먼저 두는 쪽이 이기는 자리면 반드시 이김
let good=true;for(let n=2;n<=25;n++){let m=n,turn=0;while(true){m-=CG.perfect(m,CG.RNG(n));if(m===0)break;turn=1-turn;}const firstWins=turn===1;if(firstWins!==T.win[n])good=false;}ok(good,'공식끼리 두면 승패가 표와 같다');
// Q 학습 숫자 예: 0 → 0.5 → 0.75
ok(0+0.5*(1-0)===0.5&&0.5+0.5*(1-0.5)===0.75,'Q 갱신 예시 0 → 0.5 → 0.75');
// 학습량에 따른 결과(씨앗 10개)
const R={};for(const k of [10,100,300,1000]){let fw=0,all=0;for(let s=1;s<=10;s++){const L=CG.Learner({rng:CG.RNG(s*31)});L.train(k);if(L.found().join()==='1,5,9,13,17,21')all++;fw+=CG.match(L,100,CG.RNG(s*77));}R[k]=[all,fw/10];}
console.log(JSON.stringify(R));ok(R[10][1]<40&&R[100][1]>=80&&R[300][0]>=8&&R[1000][0]===10&&R[1000][1]===100,'10판 평균 '+R[10][1]+'승, 100판 '+R[100][1]+'승, 300판 규칙 '+R[300][0]+'/10, 1000판 '+R[1000][0]+'/10·'+R[1000][1]+'승');
// 동전 옮기기
const B=CG.bfs('GSGSG');ok(Object.keys(B.dist).length===10,'도달 가능한 배치 10가지(= 5C2)');
ok(B.dist.GGGSS===2&&B.dist.SSGGG===2,'목표까지 가장 짧은 수: 2');
ok(B.levels.map(l=>l.length).join()==='1,2,7','수별 배치 수 1 → 2 → 7');
let s='GSGSG';const seqA=[[1,'R'],[1,'L'],[2,'R'],[3,'L'],[1,'R']].map(([i,d])=>(s=CG.apply(s,i,d)));ok(s==='GGGSS'&&seqA[1]===seqA[0],'다섯 수 풀이: 금금금은은 도착, 2수째 헛수');
s='GSGSG';const seqB=[[4,'L'],[4,'L'],[3,'L']].map(([i,d])=>(s=CG.apply(s,i,d)));ok(seqB[0]==='SGGSG'&&seqB[1]==='SGSGG'&&seqB[2]===seqB[1],'공략글 [3] 1·2단계 배치 일치, 3단계 헛수');
ok(CG.apply(CG.apply('GSGSG',1,'R'),3,'L')==='GGGSS','숫자로 해 보기: 1·2 오른쪽 → 3·4 왼쪽 = 금금금은은');
process.exit(fail?1:0);
