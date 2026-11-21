"""② 코인 게임 지식 색인(kg.json)·참고문헌(refs.json)·서지(meta.json). 실행: python3 build/coin/kg_defs.py → node build/build.js"""
import json, pathlib
B = pathlib.Path(__file__).resolve().parent
PAGE = "ai_game_lab_coin"; URL = "https://adminmrobo.github.io/ai_game_lab/coin/"
nodes, edges, ids = [], [], set()
def n(id_, t, ko, en, anc, lv=1, d=None, source=None):
    if id_ in ids: return id_
    x = {"id": id_, "type": t, "label": {"ko": ko, "en": en}, "page": PAGE, "anchor": anc, "level": lv, "status": "known", "confidence": "high", "coverage": "explained", "family": "optimization", "domain": ["ai"], "match": []}
    if d: x["definition"] = {"ko": d}
    if source: x["source"] = source
    nodes.append(x); ids.add(id_); return id_
def e(a, p, b, anc): edges.append({"s": a, "p": "lab:" + p, "o": b, "anchor": anc, "confidence": "high"})
take = n("lab:concept/take-away-game", "Concept", "동전 1개 남기기(가져가기 게임)", "Misère subtraction game", "#c1", 1, "번갈아 1~3개를 가져가고, 마지막 동전을 가져가는 사람이 진다.")
slide = n("lab:concept/coin-sliding-puzzle", "Concept", "동전 옮기기 퍼즐", "Coin-sliding puzzle", "#c1", 1, "이웃한 동전 2개를 순서 그대로 줄의 맨 끝으로 옮겨 같은 색끼리 모은다.")
pos = n("lab:concept/winning-losing-position", "Concept", "이기는 자리·지는 자리", "Winning and losing positions", "#c3", 1, "지금 차례인 사람이 이길 수 있는 개수와 무엇을 해도 지는 개수.")
rule = n("lab:concept/one-plus-4n", "Concept", "1 + 4N 필승 공식", "Leave 1 + 4N", "#c3", 1, "상대 차례에 1, 5, 9, 13…개를 남기고, 두 사람 몫의 합을 4로 맞춘다.")
tree = n("lab:concept/game-tree", "Concept", "게임 나무", "Game tree", "#c3", 1, "둘 수 있는 수를 나뭇가지처럼 펼친 그림.")
bi = n("lab:method/backward-induction", "Method", "뒤에서부터 따지기(역진 귀납)", "Backward induction", "#c3", 2, "끝의 승패부터 거꾸로 올라가며 자리마다 승패를 정한다.")
dp = n("lab:method/dynamic-programming", "Method", "동적 계획법", "Dynamic programming", "#c3", 2, "작은 답을 적어 두고 큰 답을 만든다.")
rl = n("lab:method/q-learning-selfplay", "Method", "스스로 두며 배우기(Q 학습)", "Self-play Q-learning", "#c4", 2, "자기 자신과 두며 수마다 점수를 고쳐 간다.")
lr = n("lab:concept/learning-rate", "Concept", "학습률", "Learning rate", "#c4", 1, "한 번에 점수를 얼마나 고칠지.")
ex = n("lab:concept/exploration", "Concept", "탐험", "Exploration", "#c4", 2, "가끔 일부러 아무 수나 둬서 새 길을 알아본다.")
bfs = n("lab:method/breadth-first-search", "Method", "넓이 우선 탐색", "Breadth-first search", "#c5", 1, "가까운 배치부터 빠짐없이 훑어 가장 짧은 길을 찾는다.")
sp = n("lab:concept/shortest-solution", "Concept", "가장 짧은 풀이(2수)", "Shortest solution", "#c5", 1, "금은금은금 → 1·2번 오른쪽 → 3·4번 왼쪽.")
L1 = n("lab:limitation/small-games-only", "Limitation", "끝까지 따지기는 작은 게임에서만", "Exhaustive analysis needs small games", "#c4", 2)
L2 = n("lab:limitation/rule-inferred-from-guides", "Limitation", "동전 옮기기 규칙은 공략글 단계로 확인", "Sliding rule inferred from guides", "#c5", 2)
L3 = n("lab:limitation/tabular-only", "Limitation", "점수표 방식은 작은 게임에서만", "Tabular learning only for small games", "#c4", 2)
A = {}
for k, ko, en, anc, tgt in [("last-snack", "마지막 과자 한 조각 내기", "Last snack bet", "#c1", take), ("maze-backward", "출구에서 거꾸로 따라가는 미로", "Solving a maze backward", "#c3", bi),
                            ("learn-by-losing", "수없이 져 보며 익히기", "Learning by losing", "#c4", rl), ("search-room", "가까운 곳부터 빙 둘러 열쇠 찾기", "Searching a room ring by ring", "#c5", bfs)]:
    A[k] = n("lab:analogy/" + k, "Analogy", ko, en, anc, 1); e(A[k], "analogyOf", tgt, anc)
for a, b in [(pos, bi), (bi, rule), (tree, bi), (dp, bi), (lr, rl), (ex, rl), (pos, rl), (slide, bfs), (bfs, sp)]: e(a, "prerequisiteOf", b, "#sum")
e(rule, "partOf", take, "#c3"); e(bi, "solves", take, "#c3"); e(rl, "solves", take, "#c4"); e(bfs, "solves", slide, "#c5"); e(rl, "contrastsWith", bi, "#sum"); e(bfs, "contrastsWith", bi, "#sum")
e(bi, "hasLimitation", L1, "#c4"); e(L1, "addressedBy", rl, "#c4"); e(rl, "hasLimitation", L3, "#c4"); e(slide, "hasLimitation", L2, "#c5")
for sid, ko, en, anc, tgt in [("coin-play", "주판봇과 동전 1개 남기기", "Play against AbaBot", "#c2", rule), ("coin-backward", "뒤에서부터 따지기 표", "Backward induction table", "#c3", bi),
                              ("coin-qlearn", "스스로 두며 배우기 점수표", "Q-table self-play", "#c4", rl), ("coin-slide", "동전 옮기기", "Coin sliding", "#c5", slide),
                              ("coin-bfs", "넓이 우선 탐색", "BFS levels", "#c5", bfs), ("coin-duel", "연습량이 다른 세 AI", "Three AIs with different practice", "#duel", rl)]:
    n("lab:sim/" + sid, "Simulation", ko, en, anc, 1); e(tgt, "demonstratedBy", "lab:sim/" + sid, anc)
q = n("lab:question/how-ai-finds-winning-strategy", "Question", "AI는 필승법을 어떻게 찾을까?", "How does AI find a winning strategy?", "#top", 1); e(rule, "raises", q, "#top")
W = {k: n("lab:work/" + k, "Work", ko, en, "#top", 2) for k, ko, en in [("daum_uw4_minigame", "다음 카페 대항해시대4 PK 미니게임 공략", "Daum cafe UW4 PK mini-game guide"), ("ggemguide_uw4_maria", "껨가이드 대항해시대4 PK 마리아 리 공략", "Ggemguide UW4 PK guide"),
    ("aacii_uw4_tial", "blog.aacii.net 대항해시대4 HD 공략", "aacii UW4 HD guide"), ("baike_uw4", "Baidu Baike: Uncharted Waters IV", "Baidu Baike: Uncharted Waters IV"),
    ("bouton1901nim", "Bouton 1901", "Bouton 1901"), ("sutton2018rl", "Sutton·Barto 2018", "Sutton & Barto 2018")]}
for cid, ko, en, anc, tgt, wk, loc in [("lab:claim/uw4-coin-rule", "자기 차례에 1개가 남으면 지며, 상대에게 1 + 4N개를 남기면 이긴다", "Leave 1 + 4N to win", "#c1", rule, "daum_uw4_minigame", "본문"),
    ("lab:claim/first-player-13-17-21", "선공일 때 13·17·21개면 이길 수 없다", "First player loses at 13/17/21", "#c3", pos, "ggemguide_uw4_maria", "본문"),
    ("lab:claim/nim-theory-1901", "님 게임은 완전한 수학 이론을 갖는다", "Nim has a complete mathematical theory", "#sum", take, "bouton1901nim", "논문 전체")]:
    n(cid, "Claim", ko, en, anc, 2, source=[{"ref": wk, "loc": loc}]); e(cid, "supports", tgt, anc); e(cid, "assertedIn", W[wk], anc)
for c, t in [(bi, "lab:topic/calculus-optimization-math"), (rl, "lab:topic/q-learning"), (ex, "lab:topic/exploration"), (rl, "lab:topic/reward"), (lr, "lab:topic/learning-rate-schedule")]: e(c, "broader", t, "#sum")
for sec, k, tgt in [("c1", 1, take), ("c1", 2, slide), ("c2", 1, rule), ("c2", 2, rule), ("c3", 1, pos), ("c3", 2, pos), ("c4", 1, rl), ("c4", 2, ex), ("c5", 1, bfs), ("c5", 2, sp), ("duel", 1, rl)]:
    qid = f"lab:quiz/coin-{sec}-{k}"; n(qid, "QuizItem", f"{sec} 문제 {k}", f"Quiz {sec}-{k}", "#" + sec, 1); e(qid, "assesses", tgt, "#" + sec)
(B / "kg.json").write_text(json.dumps({"version": "1.3", "page": PAGE, "nodes": nodes, "edges": edges}, ensure_ascii=False, indent=1))
def ref(id_, t, title, au, year, extra=None, role="background", sup=(), ver=None, chk=""):
    r = {"id": id_, "type": t, "title": title, "author": au}
    if year: r["issued"] = {"date-parts": [[year]]}
    r.update(extra or {}); r["accessed"] = {"date-parts": [[2026, 11, 21]]}
    r["lab"] = {"work": "lab:work/" + id_, "role": role, "supports": list(sup), "locs": [], "verified": ver or {}, "checkedBy": chk}; return r
refs = [ref("daum_uw4_minigame", "webpage", "대항해시대4 파워업키드 미니게임 공략(물 옮기기 제외)", [{"literal": "다음 카페 대항해시대 IV"}], None, {"URL": "https://m.cafe.daum.net/eogkdtleo/FK42/14"}, "primary", [rule], {"title": True, "url": True}, "웹 검색 2026-11-21"),
        ref("ggemguide_uw4_maria", "webpage", "대항해 시대4 PK - 마리아 리 공략", [{"literal": "껨가이드"}], None, {"URL": "http://ggemguide.com/guide_pc_view.htm?no=1224&page=108&uid=1353"}, "primary", [pos], {"title": True, "url": True}, "웹 검색 2026-11-21"),
        ref("aacii_uw4_tial", "webpage", "대항해시대4 HD 티알 와만 챠스카 공략", [{"literal": "삶 가운데 남긴 기록"}], None, {"URL": "https://blog.aacii.net/84"}, "primary", [slide], {"title": True, "url": True}, "본문 확인 2026-11-21"),
        ref("baike_uw4", "webpage", "Uncharted Waters IV", [{"literal": "Baidu Baike"}], None, {"URL": "https://baike.baidu.com/en/item/Uncharted%20Waters%20IV/1482551"}, "background", [take], {"title": True, "url": True}, "웹 검색 2026-11-21"),
        ref("bouton1901nim", "article-journal", "Nim, a game with a complete mathematical theory", [{"family": "Bouton", "given": "Charles L."}], 1901, {"container-title": "Annals of Mathematics", "volume": "3", "issue": "1/4", "page": "35-39"}, "background", [take], {"title": True, "author": True, "year": True, "pages": False}, "서지 기억값, 원문 대조 필요"),
        ref("sutton2018rl", "book", "Reinforcement Learning: An Introduction", [{"family": "Sutton", "given": "Richard S."}, {"family": "Barto", "given": "Andrew G."}], 2018, {"edition": "2", "publisher": "MIT Press"}, "background", [rl], {"title": True, "author": True, "year": True}, "서지 기억값")]
(B / "refs.json").write_text(json.dumps(refs, ensure_ascii=False, indent=1))
meta = {"title": "AI로 풀어보는 게임 시리즈 ② 대항해시대 4 코인 게임 — AI는 필승법을 어떻게 찾을까?", "series": "AI로 풀어보는 게임 시리즈", "number": "2",
        "creator": [{"name": "안상선", "role": "author", "affiliation": "(주)M-Robo"}], "contributor": [{"name": "AI 보조 제작", "role": "assistant"}],
        "date": "2026-11-21", "version": "1.0", "language": ["ko"], "license": "", "url": URL, "about": [rule, bi, rl, bfs],
        "basedOn": [r["id"] for r in refs], "educationalLevel": "입문", "learningResourceType": "interactive explainer", "registry": "KG_00_registry 0.2",
        "suggestedCitation": "안상선 (2026). AI로 풀어보는 게임 시리즈 ② 대항해시대 4 코인 게임 — AI는 필승법을 어떻게 찾을까? v1.0."}
(B / "meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=1))
print(len(nodes), "nodes", len(edges), "edges")
