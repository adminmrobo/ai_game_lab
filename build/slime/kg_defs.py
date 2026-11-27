"""⑤ 슬라임 레이스 지식 색인(kg.json)·참고문헌(refs.json)·서지(meta.json). 실행: python3 build/slime/kg_defs.py → node build/build.js"""
import sys, pathlib
B = pathlib.Path(__file__).resolve().parent; sys.path.insert(0, str(B.parent))
from kgcommon import KG, ref, write, meta
URL = "https://adminmrobo.github.io/ai_game_lab/slime/"
g = KG("ai_game_lab_slime", URL, "rl"); n, e = g.n, g.e
game = n("lab:concept/slime-race", "Concept", "연구실 슬라임 레이스", "Lab slime race", "#c1", 1, "슬라임 다섯 마리, 그날의 상태, 고정 배당. 1등을 맞히면 배당만큼 쿠키.")
band = n("lab:concept/multi-armed-bandit", "Concept", "다중 슬롯머신 문제(밴딧)", "Multi-armed bandit", "#c1", 2, "보상 확률을 모르는 선택지 중 하나를 고르고, 결과를 보고 다시 고르는 문제.")
rew = n("lab:concept/expected-return-per-ticket", "Concept", "돌려받는 몫(확률 × 배당)", "Expected return per ticket", "#c3", 1, "1보다 작으면 길게 할수록 잃는다.")
ee = n("lab:concept/exploration-exploitation", "Concept", "탐험과 활용", "Exploration vs exploitation", "#c3", 2, "아는 것을 쓸지, 덜 알려진 것을 해 볼지의 줄다리기.")
eg = n("lab:method/epsilon-greedy", "Method", "ε-탐욕", "Epsilon-greedy", "#c3", 2, "대개는 평균이 가장 높은 것, ε 비율로는 아무거나.")
ucb = n("lab:method/ucb1", "Method", "UCB(덜 해 본 쪽에 덤)", "UCB1", "#c4", 2, "평균 + k × √(ln 전체 횟수 ÷ 그 선택 횟수).")
ctx = n("lab:method/contextual-bandit", "Method", "맥락 밴딧(상태 보고 고르기)", "Contextual bandit", "#c5", 2, "(슬라임 × 상태)마다 평균을 따로 적어 그날 상태로 고른다.")
inc = n("lab:concept/sample-average", "Concept", "평균으로 어림하기", "Sample-average estimate", "#c3", 1, "응원해 본 결과의 평균으로 진짜 몫을 어림한다.")
L1 = n("lab:limitation/noisy-rewards-slow", "Limitation", "운이 섞인 보상은 배우는 데 오래 걸린다", "Noisy rewards slow learning", "#c4", 2)
L2 = n("lab:limitation/more-cells-more-exploration", "Limitation", "나눠 배울수록 처음엔 더 헤맨다", "More contexts need more exploration", "#c5", 2)
L3 = n("lab:limitation/odds-fixed-by-design", "Limitation", "배당은 일부러 틈을 남긴 연구실 설정", "Odds fixed with a gap by design", "#c1", 2)
for k, ko, en, anc, tgt in [("new-lunch-place", "새 동네 점심 식당 고르기", "Choosing a lunch place in a new town", "#c1", band), ("usual-vs-new", "단골집과 새 식당", "Usual place vs new place", "#c3", ee),
                            ("benefit-of-doubt", "한 번 가 본 집은 후하게", "Benefit of the doubt", "#c4", ucb), ("rainy-day-noodles", "비 오는 날엔 그 집 칼국수", "Noodles on rainy days", "#c5", ctx)]:
    a = n("lab:analogy/" + k, "Analogy", ko, en, anc, 1); e(a, "analogyOf", tgt, anc)
for a, b in [(band, ee), (inc, eg), (ee, eg), (eg, ucb), (ucb, ctx), (rew, inc)]: e(a, "prerequisiteOf", b, "#sum")
e(band, "partOf", game, "#c1"); e(eg, "solves", band, "#c3"); e(ucb, "solves", band, "#c4"); e(ctx, "solves", game, "#c5"); e(ucb, "contrastsWith", eg, "#c4")
e(eg, "hasLimitation", L1, "#c4"); e(L1, "addressedBy", ucb, "#c4"); e(ctx, "hasLimitation", L2, "#c5"); e(game, "hasLimitation", L3, "#c1")
for sid, ko, en, anc, tgt in [("slime-play", "직접 응원하기", "Cheer a slime", "#c2", game), ("slime-eps", "ε-탐욕 AI", "Epsilon-greedy agent", "#c3", eg), ("slime-fav", "말랑이만 1,000번", "Always the favorite", "#c3", rew),
                              ("slime-ucb", "세 가지 탐험 방법 비교", "Comparing exploration", "#c4", ucb), ("slime-ctx", "상태 보고 고르는 AI", "Contextual agent", "#c5", ctx), ("slime-duel", "세 가지 응원 습관", "Three cheering habits", "#duel", ctx)]:
    n("lab:sim/" + sid, "Simulation", ko, en, anc, 1); e(tgt, "demonstratedBy", "lab:sim/" + sid, anc)
q = n("lab:question/learn-unknown-probabilities", "Question", "강화학습은 모르는 확률을 어떻게 배울까?", "How does RL learn unknown probabilities?", "#top", 1); e(band, "raises", q, "#top")
W = {k: n("lab:work/" + k, "Work", ko, en, "#top", 2) for k, ko, en in [("inven_lineage_race", "인벤 리니지 경기장의 추억", "Inven: Lineage race tracks"), ("dailygame_lineage_race", "데일리게임 슬경·개경장", "Dailygame: Lineage slime/dog races"),
    ("sutton2018rl", "Sutton·Barto 2018", "Sutton & Barto 2018"), ("auer2002ucb", "Auer 외 2002", "Auer et al. 2002"), ("alphabiz_lineage_classic", "알파경제 리니지 클래식 슬라임 경주장 논란", "Alphabiz: Lineage Classic slime race controversy")]}
for cid, ko, en, anc, tgt, wk in [("lab:claim/lineage-slime-race-tickets", "리니지 슬라임 경주는 승률·상태를 보고 표를 사서 1등을 맞히는 방식이었다", "Lineage slime race: buy tickets after seeing win rates and condition", "#c1", game, "inven_lineage_race"),
                                  ("lab:claim/lineage-race-closed", "리니지의 경주장은 사행성 우려로 폐쇄됐다", "Lineage race tracks were closed over gambling concerns", "#sum", L3, "dailygame_lineage_race"),
                                  ("lab:claim/bandit-first-chapter", "다중 슬롯머신 문제는 탐험과 활용을 가장 단순하게 보여 준다", "Bandits isolate exploration vs exploitation", "#c1", band, "sutton2018rl"),
                                  ("lab:claim/ucb1-log-regret", "UCB1의 손해는 로그만큼만 늘어난다", "UCB1 achieves logarithmic regret", "#sum", ucb, "auer2002ucb"),
                                  ("lab:claim/lineage-classic-controversy", "리니지 클래식에 다시 도입된 슬라임 경주장이 논란 끝에 운영 중단됐다", "Slime race in Lineage Classic was halted after controversy", "#sum", L3, "alphabiz_lineage_classic")]:
    n(cid, "Claim", ko, en, anc, 2, source=[{"ref": wk, "loc": "본문"}]); e(cid, "supports", tgt, anc); e(cid, "assertedIn", W[wk], anc)
for c, t in [(band, "lab:topic/reward"), (ee, "lab:topic/exploration"), (eg, "lab:topic/exploration"), (ucb, "lab:topic/exploration"), (inc, "lab:topic/value-function"), (rew, "lab:topic/probability-statistics")]: e(c, "broader", t, "#sum")
g.quiz("slime", [("c1", 1, band), ("c1", 2, rew), ("c2", 1, inc), ("c3", 1, ee), ("c3", 2, rew), ("c4", 1, ucb), ("c4", 2, ucb), ("c5", 1, L2), ("c5", 2, ctx), ("duel", 1, ctx)])
refs = [ref("inven_lineage_race", "webpage", "[기획] 슬라임부터 버그베어까지, 울고 웃게 만들었던 리니지 경기장의 추억", [{"literal": "인벤"}], None, {"URL": "https://www.inven.co.kr/webzine/news/?news=177414"}, "primary", [game], {"title": True, "url": True}, "웹 검색 2026-11-27"),
        ref("dailygame_lineage_race", "webpage", "[게.이.머] 리니지, 서민에게 로또 같았던 '슬경·개경장'", [{"literal": "데일리게임"}], 2015, {"URL": "https://www.dailygame.co.kr/view.php?ud=2015100217513448041_26"}, "primary", [game], {"title": True, "url": True}, "웹 검색 2026-11-27"),
        ref("sutton2018rl", "book", "Reinforcement Learning: An Introduction", [{"family": "Sutton", "given": "Richard S."}, {"family": "Barto", "given": "Andrew G."}], 2018, {"edition": "2", "publisher": "MIT Press"}, "background", [band, eg], {"title": True, "author": True, "year": True}, "서지 기억값"),
        ref("auer2002ucb", "article-journal", "Finite-time Analysis of the Multiarmed Bandit Problem", [{"family": "Auer", "given": "Peter"}, {"family": "Cesa-Bianchi", "given": "Nicolò"}, {"family": "Fischer", "given": "Paul"}], 2002, {"container-title": "Machine Learning", "volume": "47", "page": "235-256", "DOI": "10.1023/A:1013689704352"}, "background", [ucb], {"title": True, "author": True, "year": True}, "서지 기억값, 원문 대조 필요"),
        ref("alphabiz_lineage_classic", "webpage", "엔씨 리니지 클래식 슬라임 경주장 논란…게임이용자협회 \"운영 경위 설명해야\"", [{"literal": "알파경제(인베스팅닷컴 전재)"}], 2026, {"URL": "https://kr.investing.com/news/stock-market-news/article-2009975"}, "background", [L3], {"title": True, "url": True}, "웹 검색 2026-11-27")]
write(B, g, refs, meta("AI로 풀어보는 게임 시리즈 ⑤ 슬라임 레이스 — 강화학습은 모르는 확률을 어떻게 배울까?", "5", URL, [band, eg, ucb, ctx], refs))
