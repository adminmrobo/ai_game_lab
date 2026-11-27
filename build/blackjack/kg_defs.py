"""④ 블랙잭 지식 색인(kg.json)·참고문헌(refs.json)·서지(meta.json). 실행: python3 build/blackjack/kg_defs.py → node build/build.js"""
import sys, pathlib
B = pathlib.Path(__file__).resolve().parent; sys.path.insert(0, str(B.parent))
from kgcommon import KG, ref, write, meta
URL = "https://adminmrobo.github.io/ai_game_lab/blackjack/"
g = KG("ai_game_lab_blackjack", URL, "rl"); n, e = g.n, g.e
game = n("lab:concept/blackjack-hit-stand", "Concept", "블랙잭(받기·서기만)", "Blackjack with hit/stand", "#c1", 1, "21에 가깝게, 넘지 않게. 딜러는 17 이상이면 선다.")
soft = n("lab:concept/soft-hand", "Concept", "소프트(A를 11로 세는 손패)", "Soft hand", "#c1", 1, "받아도 A를 1로 바꾸면 되니 잘 안 터진다.")
dd = n("lab:concept/dealer-outcome-distribution", "Concept", "딜러 최종 결과 분포", "Dealer outcome distribution", "#c3", 2, "딜러의 보이는 카드만 알면 17~21·터짐의 확률을 끝까지 따질 수 있다.")
ev = n("lab:concept/expected-value", "Concept", "기댓값", "Expected value", "#c4", 1, "결과마다 몫 × 확률을 더한 값.")
pol = n("lab:concept/policy-table", "Concept", "정책(받기·서기 표)", "Policy table", "#c4", 2, "상황 200개마다 받기·서기를 정한 표.")
val = n("lab:concept/state-value", "Concept", "가치", "Value", "#c4", 2, "그 상황에서 앞으로 가장 잘했을 때 얻을 기댓값.")
bell = n("lab:method/expected-value-recursion", "Method", "기댓값 계산(벨만 방정식)", "Expected-value recursion (Bellman)", "#c4", 2, "받기의 기댓값 = 카드 확률 × 다음 상황의 가장 좋은 기댓값의 합.")
mc = n("lab:method/monte-carlo-control", "Method", "몬테카를로 학습(탐험 시작)", "Monte Carlo control with exploring starts", "#c5", 2, "해 보고 상황·행동마다 결과를 평균 내서 표를 배운다.")
inc = n("lab:concept/incremental-mean", "Concept", "평균 고치기(1 ÷ 횟수)", "Incremental mean", "#c5", 1, "새 평균 = 옛 평균 + (결과 − 옛 평균) ÷ 횟수.")
es = n("lab:concept/exploring-starts", "Concept", "탐험 시작", "Exploring starts", "#c5", 2, "판마다 무작위 상황·행동에서 시작해 모든 경우를 겪게 한다.")
he = n("lab:concept/house-edge", "Concept", "딜러의 우위", "House edge", "#duel", 1, "플레이어가 먼저 두어 먼저 터지므로, 가장 좋은 표도 한 판 평균 약 2.4%를 잃는다.")
L1 = n("lab:limitation/infinite-deck", "Limitation", "카드 뭉치를 끝없이 많다고 봄", "Infinite-deck assumption", "#c1", 2)
L2 = n("lab:limitation/model-needed", "Limitation", "계산에는 확률 모형이 필요", "Exact computation needs a model", "#c5", 2)
L3 = n("lab:limitation/many-episodes", "Limitation", "해 보며 배우기는 수만~수십만 판이 필요", "Needs many episodes", "#c5", 2)
for k, ko, en, anc, tgt in [("one-more-feature", "마감 직전 기능을 하나 더 넣을까", "One more feature before the deadline", "#c1", game), ("commute-time", "늘 같은 길로 퇴근하는 사람의 도착 시각", "Commute time of a creature of habit", "#c3", dd),
                            ("lottery-ev", "복권은 확률 × 상금으로", "Lottery: probability × prize", "#c4", ev), ("menu-average", "여러 메뉴를 먹어 보고 단골 메뉴 정하기", "Pick a usual dish by tasting", "#c5", mc)]:
    a = n("lab:analogy/" + k, "Analogy", ko, en, anc, 1); e(a, "analogyOf", tgt, anc)
for a, b in [(dd, ev), (ev, bell), (bell, pol), (val, bell), (inc, mc), (es, mc), (mc, pol)]: e(a, "prerequisiteOf", b, "#sum")
e(soft, "partOf", game, "#c1"); e(bell, "solves", game, "#c4"); e(mc, "solves", game, "#c5"); e(mc, "contrastsWith", bell, "#sum"); e(he, "partOf", game, "#duel")
e(bell, "hasLimitation", L2, "#c5"); e(L2, "addressedBy", mc, "#c5"); e(mc, "hasLimitation", L3, "#c5"); e(game, "hasLimitation", L1, "#c1")
for sid, ko, en, anc, tgt in [("bj-play", "딜러 주판봇과 한 판", "Play against dealer AbaBot", "#c2", game), ("bj-dealer", "딜러 카드별 결과 분포", "Dealer distribution by up card", "#c3", dd),
                              ("bj-table", "받기·서기 표", "Hit/stand table", "#c4", pol), ("bj-mc", "해 보고 배운 표", "Learned table", "#c5", mc), ("bj-duel", "세 가지 습관, 2만 판", "Three habits, 20,000 hands", "#duel", he)]:
    n("lab:sim/" + sid, "Simulation", ko, en, anc, 1); e(tgt, "demonstratedBy", "lab:sim/" + sid, anc)
q = n("lab:question/hit-or-stand", "Question", "AI는 받을지 설지 어떻게 정할까?", "How does AI decide to hit or stand?", "#top", 1); e(game, "raises", q, "#top")
W = {k: n("lab:work/" + k, "Work", ko, en, "#top", 2) for k, ko, en in [("namu_uw2", "나무위키 「대항해시대 2」", "Namuwiki: Uncharted Waters II"), ("sutton2018rl", "Sutton·Barto 2018", "Sutton & Barto 2018"), ("thorp1962", "Thorp 1962", "Thorp 1962")]}
for cid, ko, en, anc, tgt, wk in [("lab:claim/uw2-blackjack", "대항해시대 2의 술집에서 블랙잭을 할 수 있었고 규칙은 일반 블랙잭과 같다", "UW2 taverns offered standard blackjack", "#c1", game, "namu_uw2"),
                                  ("lab:claim/mc-blackjack-example", "블랙잭은 몬테카를로 학습의 대표 예제다", "Blackjack is the classic Monte Carlo example", "#c5", mc, "sutton2018rl"),
                                  ("lab:claim/basic-strategy-computed", "컴퓨터 계산으로 블랙잭의 기본 전략을 구할 수 있다", "Basic strategy can be computed", "#sum", pol, "thorp1962")]:
    n(cid, "Claim", ko, en, anc, 2, source=[{"ref": wk, "loc": "본문"}]); e(cid, "supports", tgt, anc); e(cid, "assertedIn", W[wk], anc)
for c, t in [(ev, "lab:topic/probability-statistics"), (val, "lab:topic/value-function"), (bell, "lab:topic/mdp"), (mc, "lab:topic/value-function"), (es, "lab:topic/exploration"), (pol, "lab:topic/reward")]: e(c, "broader", t, "#sum")
g.quiz("bj", [("c1", 1, soft), ("c1", 2, game), ("c2", 1, he), ("c3", 1, dd), ("c3", 2, dd), ("c4", 1, ev), ("c4", 2, pol), ("c5", 1, mc), ("c5", 2, inc), ("duel", 1, he)])
refs = [ref("namu_uw2", "webpage", "대항해시대 2", [{"literal": "나무위키"}], None, {"URL": "https://namu.wiki/w/%EB%8C%80%ED%95%AD%ED%95%B4%EC%8B%9C%EB%8C%80%202"}, "primary", [game], {"title": True, "url": True}, "웹 검색 2026-11-27"),
        ref("sutton2018rl", "book", "Reinforcement Learning: An Introduction", [{"family": "Sutton", "given": "Richard S."}, {"family": "Barto", "given": "Andrew G."}], 2018, {"edition": "2", "publisher": "MIT Press"}, "background", [mc], {"title": True, "author": True, "year": True}, "서지 기억값"),
        ref("thorp1962", "book", "Beat the Dealer", [{"family": "Thorp", "given": "Edward O."}], 1962, {"publisher": "Random House"}, "background", [pol], {"title": True, "author": True, "year": True}, "서지 기억값")]
write(B, g, refs, meta("AI로 풀어보는 게임 시리즈 ④ 대항해시대 2 블랙잭 — AI는 받을지 설지 어떻게 정할까?", "4", URL, [bell, mc, ev, pol], refs))
