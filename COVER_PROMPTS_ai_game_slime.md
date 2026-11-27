# 그림 지시문 (Genspark) — AI로 풀어보는 게임 시리즈 ⑤ 슬라임 레이스

## 0. 화면 구성 — "연구실 앞마당의 슬라임 경주장"

옛 온라인 게임의 슬라임 경주장을 **각색**한 새 경주장입니다. 원작 게임(엔씨소프트 「리니지」)의 슬라임 디자인·마을·NPC(오크 매표원 등)·글꼴·로고는 닮지 않게, 슬라임 다섯 마리는 이 페이지에서 새로 만든 모양(둥근 젤리, 점 두 개 눈, 몸 색만 다름)으로 그립니다.

```
┌──────────────────────── 16:9 ────────────────────────┐
│  맑은 하늘 · 연구실 건물 · 잔디 울타리                  │
│  [매표소 주판봇]                         결승선 ▌      │
│  ─ 말랑이(초록) ──────────●                  ▌      │
│  ─ 퐁당이(파랑) ──────●                      ▌      │
│  ─ 몽글이(분홍) ────────────●                ▌      │
│  ─ 쫀득이(노랑) ─────●                       ▌      │
│  ─ 출렁이(보라) ───●                         ▌      │
│  [하루] [시아] [모아] 응원 깃발                         │
└──────────────────────────────────────────────────────┘
```
- 그림이 오기 전까지 임시 표지로 돌아갑니다. `slime/img/slime_cover.webp`가 생기면 빌드가 자동으로 바꿉니다.
- 슬라임 다섯 마리의 몸 색: 말랑이 #57c46a(초록) · 퐁당이 #4f8fe0(파랑) · 몽글이 #ef7fb4(분홍) · 쫀득이 #f2c230(노랑) · 출렁이 #9b6fd6(보라). 이름표는 페이지가 얹으니 그림에는 넣지 않습니다.

## 1. 공통 (Genspark에 그대로 붙여 넣기)

- 화풍: 연구실 시리즈 공통 **16비트 SNES 시대 픽셀아트**, 밝은 낮 조명
- 참고 그림(대화마다 함께 올림): adminmrobo/fruitfly-lab-expressions의 하루·시아·모아·주판봇·초파리 연구원 E13 기준 그림. 두 번째 대화부터는 먼저 받은 표지도 함께 올려 그림체를 맞춥니다.
- 그림 안 글자 금지(대사·숫자·족보 이름은 페이지가 얹음)
- 공통 네거티브: `text, letters, numbers, watermark, logo, game UI frame, video game screenshot, existing game characters, casino logo, real money, dark night, neon, photorealistic, 3D render, blurry, extra fingers`
- 캐릭터 묘사(프롬프트에 함께 넣기)
  - Haru — pink hair in two round buns with a navy blue streak, blue eyes, lavender hoodie under a white lab coat
  - Sia — long straight black hair, grey eyes, black-and-white maid dress, no headpiece
  - Moa — light brown hair, amber eyes, white headband, beige cardigan with checkered ribbon
  - AbaBot — a small square robot with a green screen face showing mint pixel eyes, pink pixel cheeks, abacus beads on its chest, tank treads
  - Fruit-fly researcher — a fruit fly with big red compound eyes, wearing a tiny white lab coat, sitting on a stool
- 크기: 표지 16:9 1600×900(원본 PNG 그대로 주시면 제가 WebP로 줄이고 960px 썸네일·공유 미리보기를 만듭니다. 한 편 600KB 안)

## 2. 요청 순서와 저장 이름

| 대화 | 비율 | 저장 이름 | 크기 | 쓰는 곳 |
|---|---|---|---|---|
| A | 16:9 | `slime/img/slime_cover.webp` | 1600×900 | 표지·목차 썸네일·공유 미리보기 |
| A | 16:9 | `slime/img/bg_track.webp` | 1600×900 | 2단계 경주 화면 배경 |
| B | 1:1 투명 | `slime/img/slime_1.png` ~ `slime_5.png` (+ `_jump`) | 256×256 | 슬라임 다섯 마리(서 있기·뛰기) |
| B | 1:1 투명 | `slime/img/robo_booth.png` | 600×600 | 매표소의 주판봇 |
| C | 16:9 | `slime/img/scene_win.webp` · `scene_lose.webp` | 1200×675 | 결과 장면 |

## 3. 대화 A — 표지와 배경

### A-1 표지 `slime_cover`
```
16-bit SNES-era pixel art, a sunny outdoor mini race track in front of a small white research lab building, blue sky, green hedge fence, sandy track with five straight lanes and a black-and-white checkered finish line on the right.
Five cute round jelly slimes racing and bouncing mid-hop, each a different body color: green, blue, pink, yellow, purple; simple two-dot eyes, glossy highlight, no other features.
On the left, a tiny wooden ticket booth with AbaBot (small square robot, green screen face with mint pixel eyes, abacus beads on its chest) handing out paper tickets.
In the foreground, waist-up: Haru (pink twin buns with navy streak, lab coat) waving a small pink flag, Sia (long black hair, maid dress) holding a notebook with a tally chart (no readable text), Moa (light brown hair, white headband, cardigan) jumping with excitement.
Leave clear empty space at the upper left for a title. Crisp pixels, no text.
```

### A-2 배경 `bg_track`
```
16-bit SNES-era pixel art, side view of a sandy straight race track with five lanes separated by white dashed lines, a checkered finish line near the right edge, blue sky and hedge at the top, a tiny empty ticket booth at the upper left.
All lanes are EMPTY (slimes will be placed by the program). No people, no slimes, no text.
```

## 4. 대화 B — 투명 배경
### B-1 슬라임 다섯 마리
```
16-bit SNES-era pixel art sprite on a transparent background, a cute round jelly slime seen from the side-front, simple two-dot eyes, small glossy highlight, darker rim at the bottom, soft shadow.
Five versions with identical shape and size, only the body color changes: green #57c46a, blue #4f8fe0, pink #ef7fb4, yellow #f2c230, purple #9b6fd6.
For each color also a "jump" version: squashed tall, lifted off the ground with a tiny dust puff. No text.
```
### B-2 매표소 주판봇 `robo_booth`
```
16-bit SNES-era pixel art sprite on a transparent background, AbaBot (small square robot, green screen face, abacus beads) inside a tiny wooden ticket booth window, holding out a paper ticket, cheerful. No text on the booth.
```

## 5. 대화 C — 결과 장면
### C-1 맞혔을 때 `scene_win`
```
16-bit SNES-era pixel art, the sunny slime race track at the finish line, the pink slime crosses first and bounces happily. Haru, Sia and Moa cheer, Moa holds up a paper ticket. AbaBot in the booth looks surprised. Pixel sparkles. No text.
```
### C-2 못 맞혔을 때 `scene_lose`
```
16-bit SNES-era pixel art, the sunny slime race track, a paper ticket drifts away in the wind. Haru, Sia and Moa watch with comic disappointed faces while the green slime celebrates at the finish line. Lighthearted, not sad. No text.
```

## 6. 받은 뒤 할 일 (제가 맡음)
- [ ] 표지 반영(빌드가 자동 전환), og:image·목차 썸네일 확인
- [ ] 2단계 경주 배경·슬라임 그림 연결(지금은 직접 그린 픽셀 슬라임)
- [ ] 결과 장면 연결
- [ ] 원작 게임의 슬라임·NPC와 닮은 요소가 없는지 확인
