// 검산: node code/check_slime.js  (결과 숫자를 build/slime/nums.json에 적는다)
const SR=require('../build/slime/slime.js'),fs=require('fs');let fail=0;
function ok(c,m){console.log((c?'OK  ':'FAIL')+' '+m);if(!c)fail++;}
// 진짜 확률(20만 번)
const R=SR.RNG(11),N=200000,W=[0,0,0,0,0],WC=SR.SL.map(()=>[0,0,0]),NC=SR.SL.map(()=>[0,0,0]);
for(let k=0;k<N;k++){const c=SR.conds(R),w=SR.race(c,R).win;W[w]++;c.forEach((s,i)=>{NC[i][s]++;if(w===i)WC[i][s]++;});}
const p=W.map(x=>x/N),pc=WC.map((r,i)=>r.map((x,j)=>x/NC[i][j])),EV=p.map((x,i)=>x*SR.SL[i].pay),EC=pc.map((r,i)=>r.map(x=>x*SR.SL[i].pay));
console.log('  확률',p.map(x=>x.toFixed(3)).join(' '),' 몫',EV.map(x=>x.toFixed(3)).join(' '));
ok(p[0]>p[1]&&p[1]>p[2]&&p[2]>p[3]&&p[3]>p[4],'1등 확률 순서: 말랑이 > 퐁당이 > 몽글이 > 쫀득이 > 출렁이');
ok(SR.argmax(EV)===2&&EV[2]>1&&EV.filter(x=>x<1).length===4,'돌려받는 몫: 몽글이만 1보다 큼(가장 좋음), 나머지 넷은 1보다 작음');
ok(EV[0]<1,'인기 1위 말랑이의 몫 < 1 (자주 이겨도 잃음)');
ok(EC.every(r=>r[0]>r[1]&&r[1]>r[2]),'모든 슬라임: 좋음 > 보통 > 나쁨');
ok(EC[2][2]<1&&EC[4][0]>1&&EC[3][0]>EC[2][2],'몽글이 나쁨 < 1, 출렁이 좋음 > 1, 쫀득이 좋음 > 몽글이 나쁨');
// 이상적 선택(상태를 다 알 때, 상태별 몫 표로)
const R2=SR.RNG(3);let so=0;for(let k=0;k<100000;k++){const c=SR.conds(R2);so+=Math.max(...c.map((x,i)=>EC[i][x]));}const oracle=so/100000-1;
// UCB 덤 예시
const bonus=n=>Math.sqrt(Math.log(100)/n);ok(Math.abs(bonus(4)-1.073)<0.01&&Math.abs(bonus(16)-0.536)<0.01&&Math.abs(bonus(64)-0.268)<0.01,'UCB 덤: 4번 1.07, 16번 0.54, 64번 0.27 (전체 100번, k=1)');
// 탐험 방법 비교: 씨앗 20개 × 1,000번
const F={},NET={};for(const [k,mk] of [['eps0',r=>SR.EpsGreedy(0,r)],['eps',r=>SR.EpsGreedy(0.1,r)],['ucb',r=>SR.UCB(1,r)],['ctx',r=>SR.CtxUCB(1,r)],['fav',r=>SR.Fixed(0)]]){
  let f=0,net=0;for(let s=1;s<=20;s++){const r=SR.RNG(s*7919),A=mk(r),o=SR.run(A,1000,r);if(A.Q&&!Array.isArray(A.Q[0])&&SR.argmax(A.Q)===2)f++;net+=o.net;}F[k]=f;NET[k]=net/20;}
console.log('  찾음',F,' 수지',NET);
ok(F.ucb>F.eps&&F.eps>F.eps0,'몽글이 찾은 횟수: UCB > ε-탐욕 > 탐험 없음');
ok(NET.ctx>0&&NET.ctx>NET.ucb&&NET.ucb>NET.eps&&NET.eps>NET.fav,'쿠키 수지: 상태 보기 > UCB > ε-탐욕 > 말랑이만, 상태 보기만 확실히 플러스');
const sg=x=>(x>=0?'+':'−')+Math.abs(Math.round(x));
fs.writeFileSync(__dirname+'/../build/slime/nums.json',JSON.stringify({TRUTH_JSON:JSON.stringify({p:p.map(x=>+x.toFixed(4)),pc:pc.map(r=>r.map(x=>+x.toFixed(4)))}),
  EV_FAV:EV[0].toFixed(2),EV_BEST:EV[2].toFixed(2),P_FAV:(p[0]*100).toFixed(1)+'%',P_BEST:(p[2]*100).toFixed(1)+'%',EV_BEST_BAD:EC[2][2].toFixed(2),EV_LAST_GOOD:EC[4][0].toFixed(2),EV_4_GOOD:EC[3][0].toFixed(2),
  FOUND_UCB:F.ucb*5+'%',FOUND_EPS:F.eps*5+'%',CTX_NET:sg(NET.ctx)+'개',CTX_ORACLE:'+'+oracle.toFixed(2),DUEL_FAV:sg(NET.fav),DUEL_EPS:sg(NET.eps),DUEL_CTX:sg(NET.ctx)},null,1));
console.log('nums.json 기록');process.exit(fail?1:0);
