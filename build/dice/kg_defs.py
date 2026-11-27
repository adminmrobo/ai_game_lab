"""③ 다이스 지식 색인(kg.json)·참고문헌(refs.json)·서지(meta.json). 실행: python3 build/dice/kg_defs.py → node build/build.js"""
import sys, pathlib
B = pathlib.Path(__file__).resolve().parent; sys.path.insert(0, str(B.parent))
from kgcommon import KG, ref, write, meta
URL = "https://adminmrobo.github.io/ai_game_lab/dice/"
g = KG("ai_game_lab_dice", URL, "probability"); n, e = g.n, g.e
game = n("lab:concept/poker-dice", "Concept", "다섯 주사위 포커(다이스)", "Poker dice", "#c1", 1, "주사위 다섯 개를 굴리고 한 번 다시 굴려 족보로 겨룬다.")
hand = n("lab:concept/poker-dice-hands", "Concept", "족보", "Hand ranking", "#c1", 1, "파이브다이스·포다이스·풀하우스·스트레이트·트리플·투페어·원페어·노페어.")
cnt = n("lab:concept/counting-outcomes", "Concept", "경우의 수(7,776)", "Counting outcomes", "#c3", 1, "주사위 다섯 개의 모든 결과는 6을 다섯 번 곱한 7,776가지.")
prob = n("lab:concept/classical-probability", "Concept", "확률 = 경우 수 ÷ 모든 경우", "Classical probability", "#c3", 1, "모든 결과가 똑같이 잘 나올 때의 확률.")
enum = n("lab:method/exhaustive-enumeration", "Method", "모든 경우 세기(완전 열거)", "Exhaustive enumeration", "#c4", 2, "다시 굴릴 주사위의 결과를 빠짐없이 늘어놓고 이기는 비율을 센다.")
winp = n("lab:concept/win-probability-choice", "Concept", "이길 확률로 고르기", "Choosing by win probability", "#c4", 2, "남기기마다 상대 패를 넘을 확률을 구해 가장 높은 것을 고른다.")
mc = n("lab:method/monte-carlo", "Method", "몬테카를로 방법(굴려 보며 어림하기)", "Monte Carlo method", "#c5", 2, "무작위로 많이 시험해 보고 이긴 비율로 확률을 어림한다.")
lln = n("lab:concept/law-of-large-numbers", "Concept", "큰수의 법칙", "Law of large numbers", "#c5", 2, "시험 횟수가 늘수록 비율이 진짜 확률에 가까워진다. 흔들림은 횟수의 제곱근에 반비례.")
gut = n("lab:concept/gut-heuristic", "Concept", "감(같은 숫자 남기기)", "Keep-the-most-common heuristic", "#c4", 1, "상대를 보지 않고 가장 많이 나온 숫자만 남기는 규칙.")
ew = n("lab:concept/expected-win-rate", "Concept", "기대 승률", "Expected win rate", "#duel", 2, "고른 선택의 이길 확률을 여러 판 평균한 값. 운을 걸러 낸 선택의 질.")
L1 = n("lab:limitation/enumeration-blows-up", "Limitation", "경우가 많아지면 다 셀 수 없다", "Enumeration blows up", "#c5", 2)
L2 = n("lab:limitation/few-samples-noisy", "Limitation", "적게 굴려 보면 엉뚱한 선택", "Few samples are noisy", "#c5", 2)
L3 = n("lab:limitation/rules-adapted", "Limitation", "원작 세부 규칙은 각색", "Original rules adapted", "#c1", 2)
for k, ko, en, anc, tgt in [("retake-subjects", "잘하는 과목은 두고 몇 과목만 다시 공부하기", "Restudy a few subjects", "#c1", winp), ("count-roster", "출석부를 처음부터 끝까지 세기", "Counting the roster", "#c3", enum),
                            ("taste-soup", "국을 저어 한 숟가락씩 여러 번 맛보기", "Tasting soup spoon by spoon", "#c5", mc), ("race-just-enough", "앞사람을 이길 만큼만 무리하기", "Push just enough to win", "#c4", winp)]:
    a = n("lab:analogy/" + k, "Analogy", ko, en, anc, 1); e(a, "analogyOf", tgt, anc)
for a, b in [(cnt, prob), (prob, enum), (enum, winp), (prob, mc), (lln, mc), (winp, ew)]: e(a, "prerequisiteOf", b, "#sum")
e(hand, "partOf", game, "#c1"); e(enum, "solves", game, "#c4"); e(mc, "solves", game, "#c5"); e(mc, "contrastsWith", enum, "#sum"); e(winp, "contrastsWith", gut, "#c4")
e(enum, "hasLimitation", L1, "#c5"); e(L1, "addressedBy", mc, "#c5"); e(mc, "hasLimitation", L2, "#c5"); e(game, "hasLimitation", L3, "#c1")
for sid, ko, en, anc, tgt in [("dice-play", "술집 탁자의 세 사람", "Play against two opponents", "#c2", game), ("dice-count", "7,776가지 모두 세기", "Counting all 7,776 rolls", "#c3", cnt),
                              ("dice-keep", "남기기마다 이길 확률", "Win probability per keep", "#c4", enum), ("dice-mc", "굴려 보며 어림하기", "Monte Carlo estimates", "#c5", mc), ("dice-duel", "굴려 보는 횟수가 다른 세 AI", "Three AIs with different sample sizes", "#duel", ew)]:
    n("lab:sim/" + sid, "Simulation", ko, en, anc, 1); e(tgt, "demonstratedBy", "lab:sim/" + sid, anc)
q = n("lab:question/how-ai-chooses-by-probability", "Question", "AI는 확률로 어떻게 고를까?", "How does AI choose by probability?", "#top", 1); e(game, "raises", q, "#top")
W = {k: n("lab:work/" + k, "Work", ko, en, "#top", 2) for k, ko, en in [("namu_uw2", "나무위키 「대항해시대 2」", "Namuwiki: Uncharted Waters II"), ("steemit_uw2", "알티의 인생 게임 대항해시대 2", "Steemit retrospective on UW2"), ("metropolis1949mc", "Metropolis·Ulam 1949", "Metropolis & Ulam 1949")]}
for cid, ko, en, anc, tgt, wk in [("lab:claim/uw2-dice-five-dice-poker", "대항해시대 2의 다이스는 다섯 주사위 포커이고 세 사람이 겨룬다", "UW2 Dice is five-dice poker for three players", "#c1", game, "namu_uw2"),
                                  ("lab:claim/uw2-tavern-gambling", "대항해시대 2의 술집에서 블랙잭과 다이스를 할 수 있었다", "UW2 taverns offered blackjack and dice", "#top", game, "steemit_uw2"),
                                  ("lab:claim/monte-carlo-1949", "계산하기 어려운 문제는 무작위 시험으로 어림할 수 있다", "Hard problems can be estimated by random sampling", "#c5", mc, "metropolis1949mc")]:
    n(cid, "Claim", ko, en, anc, 2, source=[{"ref": wk, "loc": "본문"}]); e(cid, "supports", tgt, anc); e(cid, "assertedIn", W[wk], anc)
for c, t in [(prob, "lab:topic/probability-statistics"), (mc, "lab:topic/probability-statistics"), (lln, "lab:topic/probability-statistics"), (winp, "lab:topic/value-function")]: e(c, "broader", t, "#sum")
g.quiz("dice", [("c1", 1, game), ("c1", 2, hand), ("c2", 1, winp), ("c3", 1, cnt), ("c3", 2, hand), ("c4", 1, winp), ("c4", 2, enum), ("c5", 1, lln), ("c5", 2, L2), ("duel", 1, ew)])
refs = [ref("namu_uw2", "webpage", "대항해시대 2", [{"literal": "나무위키"}], None, {"URL": "https://namu.wiki/w/%EB%8C%80%ED%95%AD%ED%95%B4%EC%8B%9C%EB%8C%80%202"}, "primary", [game], {"title": True, "url": True}, "웹 검색 2026-11-27"),
        ref("steemit_uw2", "webpage", "[알티의 인생 게임] 대항해시대 2", [{"literal": "rt4u (Steemit)"}], None, {"URL": "https://steemit.com/krgame/@rt4u/7yvrjf-2"}, "background", [game], {"title": True, "url": True}, "웹 검색 2026-11-27"),
        ref("metropolis1949mc", "article-journal", "The Monte Carlo Method", [{"family": "Metropolis", "given": "Nicholas"}, {"family": "Ulam", "given": "Stanislaw"}], 1949, {"container-title": "Journal of the American Statistical Association", "volume": "44", "issue": "247", "page": "335-341", "DOI": "10.1080/01621459.1949.10483310"}, "background", [mc], {"title": True, "author": True, "year": True}, "서지 기억값, 원문 대조 필요")]
write(B, g, refs, meta("AI로 풀어보는 게임 시리즈 ③ 대항해시대 2 다이스 — AI는 확률로 어떻게 고를까?", "3", URL, [enum, mc, winp, lln], refs))
