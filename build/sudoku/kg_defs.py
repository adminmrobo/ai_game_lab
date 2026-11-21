"""지식 색인(kg.json)·참고문헌(refs.json)·페이지 서지(meta.json)를 만든다.
실행: python3 build/sudoku/kg_defs.py → node build/build.js"""
import json, pathlib
B = pathlib.Path(__file__).resolve().parent
TODAY = "2026-11-21"
URL = "https://adminmrobo.github.io/ai_game_lab/sudoku/"
PAGE = "ai_game_lab_sudoku"

def ref(id_, type_, title, authors, year, container=None, extra=None, role="background", supports=(), verified=None, checked=""):
    r = {"id": id_, "type": type_, "title": title, "author": authors, "issued": {"date-parts": [[year]]}}
    if container: r["container-title"] = container
    r.update(extra or {})
    r["accessed"] = {"date-parts": [[2026, 11, 21]]}
    r["lab"] = {"work": "lab:work/" + id_, "role": role, "supports": list(supports), "locs": [], "verified": verified or {}, "checkedBy": checked}
    return r

nodes, edges, ids = [], [], set()
def n(id_, type_, ko, en, anchor, level=1, definition=None, source=None, alt=None):
    if id_ in ids: return id_
    d = {"id": id_, "type": type_, "label": {"ko": ko, "en": en}, "page": PAGE, "anchor": anchor, "level": level,
         "status": "known", "confidence": "high", "coverage": "explained", "family": "optimization", "domain": ["ai"], "match": []}
    if definition: d["definition"] = {"ko": definition}
    if source: d["source"] = source
    if alt: d["altLabel"] = {"ko": alt}
    nodes.append(d); ids.add(id_); return id_
def e(a, p, b, anchor): edges.append({"s": a, "p": "lab:" + p, "o": b, "anchor": anchor, "confidence": "high"})

rules = n("lab:concept/sudoku-rules", "Concept", "스도쿠 규칙", "Sudoku rules", "#g1", 1, "가로줄·세로줄·굵은 선 묶음 안에 숫자가 한 번씩만 들어간다. 힌트는 바꿀 수 없다.")
csp = n("lab:concept/constraint-satisfaction", "Concept", "규칙을 지키는 배치 찾기", "Constraint satisfaction", "#g1", 2, "여러 규칙을 한꺼번에 지키는 배치를 찾는 문제. 시간표·근무표도 같은 모양.")
pen = n("lab:concept/conflict-penalty", "Concept", "벌점(부딪힌 짝의 수)", "Conflict penalty", "#g2", 1, "같은 줄·같은 묶음에서 같은 숫자인 짝 하나당 1점. 정답만 0.")
energy = n("lab:concept/energy-function", "Concept", "에너지", "Energy function", "#g2", 1, "답안마다 매기는 높이. 낮을수록 좋은 답.", alt=["에너지 함수"])
land = n("lab:concept/energy-landscape", "Concept", "에너지 그릇(지형)", "Energy landscape", "#g3", 1, "모든 답안을 벌점 높이로 세운 땅. 정답이 바닥.")
dip = n("lab:concept/local-minimum", "Concept", "작은 웅덩이(국소 최솟값)", "Local minimum", "#g3", 2, "정답은 아닌데 한 자리만 바꿔서는 벌점이 줄지 않는 곳.")
ebm = n("lab:concept/energy-based-model", "Concept", "에너지 모델", "Energy-based model", "#g4", 2, "답마다 에너지를 매기고, 학습으로 정답 자리를 깊게 만든 뒤 추론 때 에너지를 내려가 답을 찾는 모델.")
opt = n("lab:concept/optimization", "Concept", "최적화(최솟값 찾기)", "Optimization", "#g4", 1, "가장 좋은(여기서는 가장 낮은) 곳을 찾는 일.")
looped = n("lab:concept/looped-model", "Concept", "반복형 모델", "Looped model", "#g4", 2, "같은 계산 덩어리를 여러 번 되풀이해 답을 통째로 그려 내는 AI.")
table = n("lab:concept/pairwise-penalty-table", "Concept", "벌점표(자리 짝 가중치)", "Pairwise weights", "#g5", 2, "자리 두 개마다 숫자 짝의 벌점을 적은 표. 논문은 약 26만 개 숫자.")
learn = n("lab:method/contrastive-energy-learning", "Method", "그릇 빚기(정답은 낮추고 가짜 답은 올리기)", "Lowering energy of solutions, raising negatives", "#g5", 2, "정답 예시의 에너지는 낮추고 가짜 답의 에너지는 올려 벌점표를 배운다.")
infer = n("lab:method/energy-descent", "Method", "공 굴리기(에너지 내려가기)", "Energy descent inference", "#g6", 1, "힌트 고정 → 빈자리 아무 숫자 → 벌점이 큰 자리를 벌점이 줄어드는 숫자로 → 가끔 흔들기 → 멈춤선에서 멈춤.")
shake = n("lab:concept/noise-temperature", "Concept", "흔들기(온도)", "Noise / temperature", "#g6", 2, "가끔 일부러 아무 숫자로 바꿔 작은 웅덩이를 빠져나오는 것.")
stop = n("lab:concept/stopping-threshold", "Concept", "멈춤선", "Stopping threshold", "#g6", 1, "이 아래로 내려오면 다 풀었다고 스스로 멈추는 에너지 높이.")
clamp = n("lab:concept/clamped-clues", "Concept", "힌트 고정", "Clamped clues", "#g6", 1, "문제로 주어진 숫자는 추론 내내 바꾸지 않는다.")
L1 = n("lab:limitation/rule-penalty-simplified", "Limitation", "이 페이지는 규칙 벌점·비율 차이로 단순화", "Simplified energy and learning on this page", "#g5", 2)
L2 = n("lab:limitation/easy-benchmarks", "Limitation", "쉬운 시험(스도쿠·미로)에서 얻은 결과", "Results on easy benchmarks", "#sum", 2)
L3 = n("lab:limitation/landscape-1d-view", "Limitation", "그릇 그림은 한 방향으로만 본 단면", "Bowl drawn along one direction only", "#g3", 2)

A = {k: n("lab:analogy/" + k, "Analogy", ko, en, anc, 1) for k, ko, en, anc in [
    ("name-tags", "이름표 자리 배치", "Seating name tags", "#g1"), ("dictation-score", "받아쓰기 틀린 개수", "Counting dictation mistakes", "#g2"),
    ("playground-blocks", "운동장의 답안지 블록 탑", "Answer sheets stacked as blocks", "#g3"), ("ball-valley", "골짜기로 굴러가는 공", "A ball rolling into a valley", "#g4"),
    ("soap-bubble", "동그래지는 비눗방울", "A soap bubble becoming round", "#g4"), ("seating-photos", "자리 배치 사진으로 규칙 알아채기", "Learning rules from seating photos", "#g5")]}
for a, t in [("name-tags", csp), ("dictation-score", pen), ("playground-blocks", land), ("ball-valley", energy), ("soap-bubble", energy), ("seating-photos", learn)]:
    e(A[a], "analogyOf", t, [x for x in nodes if x["id"] == A[a]][0]["anchor"])

for a, b in [(rules, pen), (pen, energy), (energy, land), (land, opt), (opt, infer), (table, learn), (learn, land), (land, infer), (dip, shake)]:
    e(a, "prerequisiteOf", b, "#sum")
e(rules, "partOf", csp, "#g1"); e(pen, "relatedTo", energy, "#g2"); e(ebm, "relatedTo", opt, "#g4"); e(ebm, "contrastsWith", looped, "#g4")
e(table, "partOf", ebm, "#g5"); e(learn, "partOf", ebm, "#g5"); e(infer, "partOf", ebm, "#g6"); e(stop, "partOf", infer, "#g6"); e(clamp, "partOf", infer, "#g6"); e(shake, "partOf", infer, "#g6")
e(dip, "hasLimitation", L3, "#g3"); e(infer, "hasLimitation", dip, "#g6"); e(dip, "addressedBy", shake, "#race"); e(learn, "hasLimitation", L1, "#g5"); e(ebm, "hasLimitation", L2, "#sum")
for sid, ko, en, anc, tgt in [("sdk-play", "직접 해 보기", "Play sudoku", "#g1", rules), ("sdk-penalty", "벌점 돋보기", "Penalty magnifier", "#g2", pen),
                              ("sdk-bowl", "그릇 만들기", "Building the bowl", "#g3", land), ("sdk-ball", "공 놓아 보기", "Dropping a ball", "#g4", dip),
                              ("sdk-learn", "벌점표 배우기", "Learning the penalty table", "#g5", learn), ("sdk-roll", "공 굴리기", "Rolling the ball", "#g6", infer),
                              ("sdk-race", "세 플레이어 레이스", "Three-player race", "#race", shake)]:
    n("lab:sim/" + sid, "Simulation", ko, en, anc, 1); e(tgt, "demonstratedBy", "lab:sim/" + sid, anc)
q1 = n("lab:question/how-ai-solves-sudoku", "Question", "AI는 스도쿠를 어떻게 풀까?", "How does AI solve sudoku?", "#top", 1)
e(ebm, "raises", q1, "#top")
W1 = n("lab:work/hoover2026cram", "Work", "Hoover 외 2026 (CRAM)", "Hoover et al. 2026 (CRAM)", "#top", 2)
W2 = n("lab:work/hopfield1985neural", "Work", "Hopfield·Tank 1985", "Hopfield & Tank 1985", "#top", 2)
C = [("lab:claim/cram-learns-energy", "학습은 정답의 에너지를 낮추고 가짜 답의 에너지를 올린다", "Training lowers the energy of solutions and raises it for negatives", "#g5", learn, "hoover2026cram", "본문·그림 1"),
     ("lab:claim/cram-stopping", "추론은 에너지가 정답 예시로 정한 멈춤선 아래로 내려오면 멈춘다", "Inference stops when energy falls below a threshold fitted on training solutions", "#g6", stop, "hoover2026cram", "본문"),
     ("lab:claim/cram-results", "스도쿠 시험 99.996% 풀이, 학습 0.042초(GPU 한 대), 반복형 모델보다 학습 1,000배 이상 빠르고 추론 계산 282배 이상 적음(저자 보고)", "99.996% of Sudoku-Extreme, 42 ms training, ≥1,000x faster training and ≥282x fewer inference FLOPs (as reported)", "#sum", ebm, "hoover2026cram", "초록"),
     ("lab:claim/hopfield-optimization", "에너지를 낮추는 신경망으로 최적화 문제를 풀 수 있다", "Networks descending an energy can solve optimization problems", "#g4", ebm, "hopfield1985neural", "초록")]
for cid, ko, en, anc, tgt, wk, loc in C:
    n(cid, "Claim", ko, en, anc, 2, source=[{"ref": wk, "loc": loc}]); e(cid, "supports", tgt, anc); e(cid, "assertedIn", "lab:work/" + wk, anc)
for c, t in [(energy, "lab:topic/loss-function"), (infer, "lab:topic/gradient-descent"), (learn, "lab:topic/contrastive"), (stop, "lab:topic/early-stopping"), (shake, "lab:topic/exploration"), (opt, "lab:topic/calculus-optimization-math")]:
    e(c, "broader", t, "#sum")
for sec, k, tgt in [("g1", 1, rules), ("g1", 2, csp), ("g2", 1, pen), ("g2", 2, pen), ("g3", 1, land), ("g3", 2, land), ("g4", 1, ebm), ("g4", 2, dip), ("g5", 1, learn), ("g5", 2, table), ("g6", 1, clamp), ("g6", 2, dip), ("race", 1, shake)]:
    qid = f"lab:quiz/sdk-{sec}-{k}"; n(qid, "QuizItem", f"{sec} 문제 {k}", f"Quiz {sec}-{k}", "#" + sec, 1); e(qid, "assesses", tgt, "#" + sec)

(B / "kg.json").write_text(json.dumps({"version": "1.3", "page": PAGE, "nodes": nodes, "edges": edges}, ensure_ascii=False, indent=1))
refs = [ref("hoover2026cram", "article", "Classical Energies Learn to Reason 1,000x Faster than Looped Models",
            [{"family": "Hoover", "given": "Benjamin"}, {"family": "Blayney", "given": "Hugh"}, {"family": "Whittington", "given": "James C. R."}], 2026, None,
            {"number": "arXiv:2611.17309", "URL": "https://arxiv.org/abs/2611.17309"}, role="primary", supports=[ebm, learn, infer, table, stop],
            verified={"title": True, "author": True, "year": True, "url": True}, checked="arXiv 초록·HTML 본문 확인 2026-11-21"),
        ref("hopfield1985neural", "article-journal", "\"Neural\" Computation of Decisions in Optimization Problems",
            [{"family": "Hopfield", "given": "J. J."}, {"family": "Tank", "given": "D. W."}], 1985, "Biological Cybernetics",
            {"volume": "52", "issue": "3", "page": "141-152"}, role="background", supports=[ebm],
            verified={"title": True, "author": True, "year": True, "pages": False}, checked="서지 기억값, 쪽수 원문 대조 필요")]
(B / "refs.json").write_text(json.dumps(refs, ensure_ascii=False, indent=1))
meta = {"title": "AI로 풀어보는 게임 시리즈 ① 스도쿠 — AI는 스도쿠를 어떻게 풀까?", "series": "AI로 풀어보는 게임 시리즈", "number": "1",
        "creator": [{"name": "안상선", "role": "author", "affiliation": "(주)M-Robo"}], "contributor": [{"name": "AI 보조 제작", "role": "assistant"}],
        "date": TODAY, "version": "1.0", "language": ["ko"], "license": "", "url": URL, "about": [ebm, land, learn, infer, pen],
        "basedOn": ["hoover2026cram", "hopfield1985neural"], "educationalLevel": "입문", "learningResourceType": "interactive explainer", "registry": "KG_00_registry 0.2",
        "suggestedCitation": "안상선 (2026). AI로 풀어보는 게임 시리즈 ① 스도쿠 — AI는 스도쿠를 어떻게 풀까? v1.0."}
(B / "meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=1))
print(len(nodes), "nodes", len(edges), "edges")
