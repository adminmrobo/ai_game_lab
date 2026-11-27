"""③~⑤ 지식 색인 공통 도우미 — ② coin/kg_defs.py와 같은 형식(kg.json · refs.json · meta.json)"""
import json, pathlib
class KG:
    def __init__(s, page, url, family):
        s.PAGE, s.URL, s.family = page, url, family; s.nodes, s.edges, s.ids = [], [], set()
    def n(s, id_, t, ko, en, anc, lv=1, d=None, source=None):
        if id_ in s.ids: return id_
        x = {"id": id_, "type": t, "label": {"ko": ko, "en": en}, "page": s.PAGE, "anchor": anc, "level": lv, "status": "known", "confidence": "high", "coverage": "explained", "family": s.family, "domain": ["ai"], "match": []}
        if d: x["definition"] = {"ko": d}
        if source: x["source"] = source
        s.nodes.append(x); s.ids.add(id_); return id_
    def e(s, a, p, b, anc): s.edges.append({"s": a, "p": "lab:" + p, "o": b, "anchor": anc, "confidence": "high"})
    def quiz(s, prefix, items):
        for sec, k, tgt in items:
            q = f"lab:quiz/{prefix}-{sec}-{k}"; s.n(q, "QuizItem", f"{sec} 문제 {k}", f"Quiz {sec}-{k}", "#" + sec, 1); s.e(q, "assesses", tgt, "#" + sec)
def ref(id_, t, title, au, year, extra=None, role="background", sup=(), ver=None, chk="", acc=(2026, 11, 27)):
    r = {"id": id_, "type": t, "title": title, "author": au}
    if year: r["issued"] = {"date-parts": [[year]]}
    r.update(extra or {}); r["accessed"] = {"date-parts": [list(acc)]}
    r["lab"] = {"work": "lab:work/" + id_, "role": role, "supports": list(sup), "locs": [], "verified": ver or {}, "checkedBy": chk}; return r
def write(B, g, refs, meta):
    B = pathlib.Path(B)
    (B / "kg.json").write_text(json.dumps({"version": "1.3", "page": g.PAGE, "nodes": g.nodes, "edges": g.edges}, ensure_ascii=False, indent=1))
    (B / "refs.json").write_text(json.dumps(refs, ensure_ascii=False, indent=1))
    (B / "meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=1))
    print(len(g.nodes), "nodes", len(g.edges), "edges")
def meta(title, number, url, about, refs):
    return {"title": title, "series": "AI로 풀어보는 게임 시리즈", "number": number,
            "creator": [{"name": "안상선", "role": "author", "affiliation": "(주)M-Robo"}], "contributor": [{"name": "AI 보조 제작", "role": "assistant"}],
            "date": "2026-11-27", "version": "1.0", "language": ["ko"], "license": "", "url": url, "about": about,
            "basedOn": [r["id"] for r in refs], "educationalLevel": "입문", "learningResourceType": "interactive explainer", "registry": "KG_00_registry 0.2",
            "suggestedCitation": "안상선 (2026). " + title + " v1.0."}
