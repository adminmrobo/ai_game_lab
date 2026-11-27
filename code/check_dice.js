// 검산: node code/check_dice.js  (결과 숫자를 build/dice/nums.json에 적는다)
const DG=require('../build/dice/dice.js'),fs=require('fs');let fail=0;
function ok(c,m){console.log((c?'OK  ':'FAIL')+' '+m);if(!c)fail++;}
const FT=DG.firstTable();
ok(FT.join()==='480,3600,1800,1200,240,300,150,6','첫 굴림 족보별 경우 수 '+FT.join(', '));
ok(FT.reduce((a,b)=>a+b)===7776,'합 7,776 = 6^5');
ok((FT[1]/7776*100).toFixed(1)==='46.3'&&(6/7776*100).toFixed(2)==='0.08','원페어 46.3%, 파이브다이스 0.08%');
ok(FT[4]<FT[5]&&FT[0]<FT[1]&&FT[0]<FT[3],'스트레이트 < 풀하우스, 노페어 < 원페어·트리플 (귀한 순서와 어긋남)');
ok(DG.rank([2,3,4,5,6]).cat===4&&DG.rank([1,2,3,4,5]).cat===4&&DG.rank([1,2,3,4,6]).cat===0,'스트레이트 판정');
ok(DG.rank([3,3,3,5,5]).score>DG.rank([2,2,2,6,6]).score&&DG.rank([2,2,2,6,6]).score>DG.rank([2,2,2,5,5]).score,'풀하우스 비교: 세 개짜리 먼저, 그다음 두 개짜리');
// 조수 상자 예시: 상대 22255
const t=DG.rank([2,2,2,5,5]).score,h=[2,2,2,6,1];
ok(Math.abs(DG.exactWin(h,0b01111,t)-2/6)<1e-9,'2·2·2·6 남기기 → 6가지 중 2가지');
ok(Math.abs(DG.exactWin(h,0b00111,t)-12/36)<1e-9,'2·2·2 남기기 → 36가지 중 12가지');
// 4단계 상황
const C={a:[[2,2,5,5,6],[3,3,6,6,1],[4,4,1,2,3]],b:[[2,3,4,5,5],[6,6,6,1,2],[1,1,3,4,6]],c:[[3,3,3,5,1],[2,2,2,4,4],[5,5,2,2,6]]};
for(const k in C){const [me,a,b]=C[k],tt=Math.max(DG.rank(a).score,DG.rank(b).score),be=DG.bestExact(me,tt),g=DG.gut(me);
  console.log('  상황',k,DG.rank(me).name,'최선',DG.keepOf(me,be.m).join(''),(be.p*100).toFixed(1)+'%','감',DG.keepOf(me,g).join(''),(DG.exactWin(me,g,tt)*100).toFixed(1)+'%');}
// 대결 검산: 같은 1,500판, 선택의 기대 승률
const R=DG.RNG(4242),N=1500,S={gut:0,mc30:0,mc300:0,ex:0},W={gut:0,ex:0};
for(let i=0;i<N;i++){let a=DG.roll(5,R);a=DG.reroll(a,DG.gut(a),R);let b=DG.roll(5,R);b=DG.reroll(b,DG.gut(b),R);
  const tt=Math.max(DG.rank(a).score,DG.rank(b).score),me=DG.roll(5,R),be=DG.bestExact(me,tt);
  S.gut+=DG.exactWin(me,DG.gut(me),tt);S.mc30+=DG.exactWin(me,DG.bestMC(me,tt,30,R).m,tt);S.mc300+=DG.exactWin(me,DG.bestMC(me,tt,300,R).m,tt);S.ex+=be.p;}
const P=k=>(S[k]/N*100).toFixed(1)+'%';console.log(' ',{gut:P('gut'),mc30:P('mc30'),mc300:P('mc300'),ex:P('ex')});
ok(S.ex>=S.mc300&&S.mc300>S.gut&&S.ex-S.gut>0.015*N,'세기 ≥ 300번 > 감, 세기−감 > 1.5%p');
ok(Math.abs(S.mc30-S.gut)<0.01*N,'30번 굴려 보기 ≈ 감(차이 1%p 안)');
ok(Math.abs(S.mc300-S.ex)<0.005*N,'300번 굴려 보기 ≈ 세기(차이 0.5%p 안)');
const gap=((S.ex-S.gut)/N*100).toFixed(1);
fs.writeFileSync(__dirname+'/../build/dice/nums.json',JSON.stringify({KPI_GAP:'+'+gap+'%p',GUT:P('gut'),MC30:P('mc30'),MC300:P('mc300'),EXACT:P('ex')},null,1));
console.log('nums.json 기록');process.exit(fail?1:0);
