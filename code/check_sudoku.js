// 검산: node code/check_sudoku.js
const SD=require('../build/sudoku/sudoku.js');const P=require('../build/sudoku/puzzles.json');let fail=0;
function ok(c,m){console.log((c?'OK  ':'FAIL')+' '+m);if(!c)fail++;}
// 1) 문제마다 정답이 하나뿐인지, 들어 있는 정답이 맞는지
for(const [k,v] of Object.entries(P.puzzles)){const p=SD.parse(v.p),s=SD.solve(p,v.n,2);ok(s.length===1&&s[0].join('')===v.s,k+' 정답 하나·일치 (힌트 '+p.filter(x=>x).length+'개)');}
// 2) 짝 수
ok(SD.B(4).pairs.length===56,'4×4 서로 지켜야 하는 짝 56개');ok(SD.B(9).pairs.length===810,'9×9 서로 지켜야 하는 짝 810개');
ok(81*80/2===3240&&3240*81+81*9===263169,'논문 표 1의 26만 3천 개 = 자리 짝 3,240 × 81 + 729');
// 3) 숫자로 한 번 해 보기 예시
const ex=SD.parse(P.example.g);ok(SD.energy(ex,4)===P.example.E,'예시 판 벌점 = '+P.example.E);
// 4) 그릇: 빈자리 k개 → 벌점 0은 정답 하나뿐, 평균 벌점은 다른 자리 수가 늘수록 커짐
const B=P.bowl,sol=SD.parse(B.s);for(const k of [2,3,4,5,6]){const pz=sol.slice();B.order.slice(0,k).forEach(i=>pz[i]=0);const L=SD.landscape(pz,sol,4);
 const zero=L.list.filter(x=>x.e===0).length;const mean=[];for(let d=0;d<=k;d++){const a=L.list.filter(x=>x.d===d);mean.push(a.reduce((s,x)=>s+x.e,0)/a.length);}
 let inc=true;for(let d=1;d<=k;d++)if(mean[d]<mean[d-1])inc=false;ok(zero===1&&inc,'빈자리 '+k+'개: 답안 '+L.list.length+'개, 벌점 0 = '+zero+'개, 평균 벌점 '+mean.map(x=>x.toFixed(2)).join(' → '));}
// 5) 벌점표 배우기: 같은 줄 짝은 같은 숫자 +1, 다른 숫자 약 −1/3 / 상관없는 짝은 0 근처
function learn(a,b){const L=SD.Learner(a,b,4,SD.RNG(11));L.show(20000);return L.W();}
let w=learn(0,1),d=[0,1,2,3].map(i=>w[i][i]),o=[];for(let i=0;i<4;i++)for(let j=0;j<4;j++)if(i!==j)o.push(w[i][j]);
ok(d.every(x=>Math.abs(x-1)<0.12)&&o.every(x=>Math.abs(x+1/3)<0.15),'같은 줄 짝: 같은 숫자 '+d.map(x=>x.toFixed(2)).join(' ')+' / 다른 숫자 평균 '+(o.reduce((s,x)=>s+x,0)/12).toFixed(2));
w=learn(0,10);ok(w.flat().every(x=>Math.abs(x)<0.25),'상관없는 짝: 최댓값 '+Math.max(...w.flat().map(Math.abs)).toFixed(2));
// 6) 레이스: 흔들기 없음은 갇히고, 적당히는 풀고, 너무 세면 못 푼다
const race=SD.parse(P.puzzles.p9a.p);const R={};for(const [nm,sh] of Object.entries(P.race)){let s=0,st=0,stuck=0;for(let t=0;t<40;t++){const W=SD.run(race,9,sh,P.raceMax,900+t);if(W.E===0){s++;st+=W.steps;}if(W.stuck)stuck++;}R[nm]=[s,stuck,s?Math.round(st/s):0];}
console.log(JSON.stringify(R));ok(R.haru[1]===40&&R.sia[0]>=36&&R.moa[0]<=6,'레이스 40판: 하루 갇힘 '+R.haru[1]+', 시아 성공 '+R.sia[0]+'(평균 '+R.sia[2]+'걸음), 모아 성공 '+R.moa[0]);
process.exit(fail?1:0);
