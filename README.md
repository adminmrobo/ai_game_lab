# AI로 풀어보는 게임 시리즈

연구실 식구 하루·시아·모아가 플레이어로 나서서 게임을 직접 풀어 보고, AI가 같은 게임을 어떻게 푸는지 따라가는 연구실 해설 시리즈입니다.

- 시리즈 목차: https://adminmrobo.github.io/ai_game_lab/
- 글: 안상선 ((주)M-Robo 대표) · [저자 소개](https://adminmrobo.github.io/who_am_i/who_am_i.html)

| 편 | 게임 | 주제 | 페이지 |
|---|---|---|---|
| ① | 스도쿠 | AI는 스도쿠를 어떻게 풀까? — 에너지 모델(그릇 만들기·공 굴리기) | [sudoku/](https://adminmrobo.github.io/ai_game_lab/sudoku/) |
| ② | 미로 | 준비 중 | — |

## 폴더
```
index.html              시리즈 목차 (빌드 결과)
sudoku/index.html       ① 스도쿠 (빌드 결과)
build/                  공통: common.css · common.js · sprites.js(캐릭터 96px) · kgx.js(지식 색인) · backbone.json · build.js
build/series/           시리즈 목차 원본
build/sudoku/           ① 원본: src.html · sudoku.js(엔진) · puzzles.json · kg_defs.py
code/check_sudoku.js    ① 검산
COVER_PROMPTS_*.md      픽셀아트 표지·장면 지시문
```

## 빌드와 검산
```
python3 build/sudoku/kg_defs.py   # ① 지식 색인·참고문헌·서지
node build/build.js               # 목차와 모든 게임 페이지
node code/check_sudoku.js         # ① 정답 유일성, 짝 수, 그릇 모양, 벌점표 학습, 레이스 40판
```
새 게임을 더할 때는 `build/<게임>/`에 원본을 두고 `build/build.js`의 게임 목록과 `build/series/index.src.html`의 카드를 함께 고칩니다.

## ① 스도쿠 — 구성
| 단계 | 내용 | 직접 해 보기 |
|---|---|---|
| 1 | 스도쿠는 어떤 게임일까 | 4×4 연습판, 9×9 쉬움·보통 |
| 2 | 벌점 세기 | 벌점 돋보기 |
| 3 | 그릇 모양으로 만들기 | 빈자리 2~6개 판의 모든 답안을 벌점 높이로 세우기 |
| 4 | 왜 "에너지"인가 | 공 놓아 보기 |
| 5 | 그릇 빚기(학습) | 벌점표 배우기 |
| 6 | 공 굴리기(추론) | 흔들기 조절, AI 판단 코너 |
| 레이스 | 하루 0 · 시아 0.45 · 모아 0.9 | 예측, 레이스, 10판씩 돌려 보기 |

바탕 논문: Hoover, Blayney, Whittington (2026). *Classical Energies Learn to Reason 1,000x Faster than Looped Models*. arXiv:2611.17309

검산(씨앗 고정 40판): 하루 40판 모두 작은 웅덩이에 갇힘 · 시아 40/40 성공(평균 959걸음) · 모아 0/40

## 고친 내역
- v1.0 (2026-11-21): 시리즈 목차와 ① 스도쿠 첫 공개. 표지는 임시(HTML), 픽셀아트 표지는 준비 중.
