# 그림 지시문 v2 — AI로 풀어보는 게임 시리즈 ② 대항해시대 4 코인 게임 (게임 화면판)

## 0. 화면 구성 — "연구실 식구가 직접 두는 동전 게임"

옛 16비트 RPG의 대화 장면 **형식**(배경 · 상대 인물 · 탁자 위 동전 · 아래 대화창과 얼굴 그림)만 빌립니다. 원작 게임의 화면 틀, 인물(페르난도 디아스 등), 글꼴, 로고는 닮지 않게 그립니다.

```
┌─────────────────────────── 16:9 게임 화면 ───────────────────────────┐
│  배경: 낮의 항구 술집 (bg_tavern)                                     │
│                     [주판봇 앉은 모습 · 표정 3종]                      │
│        ● ● ● ● ● ● ● ● ● ● ● ● ●   ← 탁자 위 금화(동전 그림)         │
│ ┌──────┐ ┌──────────────────────────────────────┐ ┌──────────────┐ │
│ │얼굴  │ │ 대화창: "동전 13개. 몇 개 가져갈까요?" │ │ ▶ 1개        │ │
│ │그림  │ │ (플레이어 = 하루/시아/모아 중 선택)    │ │   2개 / 3개  │ │
│ └──────┘ └──────────────────────────────────────┘ └──────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

- **플레이어 고르기**: 하루(플레이어 1) · 시아(플레이어 2) · 모아(플레이어 3). 고른 사람의 얼굴 그림이 대화창에 나오고, 이길 때·질 때 표정이 바뀝니다(캐릭터 저장소의 E01·E12·E20·E24 등 재사용).
- **상대**: 주판봇이 탁자 건너편에 앉아 있고, 상황에 따라 표정 그림 3종(기본·자신만만·당황)이 바뀝니다.
- **동전 옮기기**: 같은 술집의 탁자를 위에서 내려다본 배경(bg_table) 위에 금화·은화 다섯 개를 놓고, 집은 두 개가 맨 끝으로 미끄러지는 연출.
- **결과 장면**: 이겼을 때·졌을 때 한 장씩 짧게 띄웁니다.
- 대화창·선택 메뉴 테두리는 그림 없이 CSS로 그립니다(흰 바탕 둥근 상자, 시리즈 색).
- 페이지 바탕은 지금처럼 흰색, 게임 화면 상자 안만 술집 그림입니다.

## 1. 공통

- 화풍: 연구실 시리즈 공통 **16비트 SNES 시대 픽셀아트**, 밝은 낮 조명(어두운 밤 술집 아님)
- 참고 그림(대화마다 함께 올림): adminmrobo/fruitfly-lab-expressions의 하루·시아·모아·주판봇 E13 기준 그림. 두 번째 대화부터는 먼저 받은 표지도 함께 올려 그림체를 맞춥니다.
- 그림 안 글자 금지(대사·숫자는 페이지에서 얹음)
- 공통 네거티브: `text, letters, numbers, watermark, logo, game UI frame, video game screenshot, Koei, existing game characters, dark night, neon, photorealistic, 3D render, blurry, extra fingers`

## 2. 요청 순서와 저장 이름

| 대화 | 비율 | 저장 이름 | 크기 | 쓰는 곳 |
|---|---|---|---|---|
| A | 16:9 | `coin/img/coin_cover.webp` | 1600×900 | 표지 |
| A | 16:9 | `coin/img/bg_tavern.webp` | 1600×900 | 동전 1개 남기기 화면 배경 |
| A | 16:9 | `coin/img/bg_table.webp` | 1600×900 | 동전 옮기기 화면 배경 |
| B | 1:1 투명 | `coin/img/robo_seat_e13.png` · `robo_seat_e16.png` · `robo_seat_e20.png` | 600×600 | 상대 주판봇(기본·자신만만·당황) |
| B | 1:1 투명 | `coin/img/coin_gold.png` · `coin_silver.png` | 256×256 | 동전 그림 |
| C | 16:9 | `coin/img/scene_win.webp` · `scene_lose.webp` | 1200×675 | 결과 장면 |

받으신 파일은 원본(PNG) 그대로 주시면 제가 WebP로 줄이고(한 편 600KB 안), 960px 썸네일과 공유 미리보기를 잘라 넣겠습니다.

## 3. 대화 A — 표지와 배경 (16:9)

### A-1 표지 `coin_cover`
```
16-bit SNES-era pixel art, bright daytime harbor tavern with large windows showing blue sea and white sails outside, warm wooden interior, cheerful and clean palette.
Center: a round wooden table seen at a slight top-down angle, a row of thirteen shiny gold coins on it.
Across the table sits AbaBot — a small square robot with a green screen face showing mint pixel eyes, pink pixel cheeks, abacus beads on its chest and tank treads — confidently holding up three fingers.
On the near side, three anime-style girls shown from the waist up, facing the table:
(1) Haru — pink hair in two round buns with a navy blue streak, blue eyes, lavender hoodie under a white lab coat, finger on chin, thinking;
(2) Sia — long straight black hair, grey eyes, black-and-white maid dress, no headpiece, calm;
(3) Moa — light brown hair, amber eyes, white headband, beige cardigan with checkered ribbon, sparkling excited eyes, reaching for a coin.
Leave clear empty space at the upper left for a title and a speech bubble. Crisp pixels, no text.
```

### A-2 배경 `bg_tavern` (동전 1개 남기기)
```
16-bit SNES-era pixel art background, bright daytime harbor tavern interior, first-person view from the player's seat looking across a wide wooden table.
Behind the table: one empty wooden chair (the opponent's seat), a counter with barrels and hanging lanterns, a window with sea and ships.
The table surface in the lower-middle area is EMPTY and wide (coins will be placed by the program).
The lowest 25% of the image is calm and simple (a dialogue window will cover it). No people, no robots, no coins, no text.
```

### A-3 배경 `bg_table` (동전 옮기기)
```
16-bit SNES-era pixel art background, top-down view of a wooden tavern table covered with a dark green felt cloth, a few nautical props at the edges (a brass compass, a rolled sea chart, a small candle), soft daylight.
The center band of the felt is EMPTY and wide enough for a row of five large coins.
No people, no coins, no text.
```

## 4. 대화 B — 투명 배경 스프라이트 (1:1)

### B-1 주판봇 앉은 모습 3종 `robo_seat_e13` / `e16` / `e20`
```
16-bit SNES-era pixel art sprite on a transparent background, AbaBot — a small square robot with a green screen face, abacus beads across its chest, tank treads — sitting behind the edge of a wooden table, seen from the front, upper body and arms visible above the table edge.
Three versions with the same pose and size, only the screen face and arms change:
(e13) neutral: mint pixel eyes and small smile, hands resting on the table;
(e16) proud and confident: closed happy eyes, arms crossed, one finger raised;
(e20) flustered: wide eyes with a sweat-drop pixel, hands up, abacus beads scattered.
Match the reference AbaBot image exactly. Transparent background, no text.
```

### B-2 동전 `coin_gold` / `coin_silver`
```
16-bit SNES-era pixel art icon on a transparent background, a single round coin seen from the front, thick rim, simple star emblem in the center (no letters, no real currency design), soft highlight at the upper left.
Two versions: (gold) warm yellow-gold with dark gold rim; (silver) cool grey-white with dark grey rim.
Same size and shape for both. No text.
```

## 5. 대화 C — 결과 장면 (16:9)

### C-1 이겼을 때 `scene_win`
```
16-bit SNES-era pixel art, bright daytime harbor tavern, celebration moment. Haru (pink twin buns, navy streak, white lab coat), Sia (long black hair, maid dress) and Moa (light brown hair, white headband, cardigan) jump and cheer around the wooden table, a single gold coin left in front of AbaBot.
AbaBot (square robot, green screen face, abacus beads) slumps in its chair with spiral pixel eyes and a sweat drop.
Confetti-like pixel sparkles. No text.
```

### C-2 졌을 때 `scene_lose`
```
16-bit SNES-era pixel art, bright daytime harbor tavern, comic defeat moment. AbaBot (square robot, green screen face, abacus beads) stands on its chair triumphantly holding up an abacus, beads glowing.
Haru (pink twin buns, navy streak) holds the last gold coin with teary comic eyes, Sia (long black hair, maid dress) sighs with a hand on her forehead, Moa (light brown hair, white headband) pouts with puffed cheeks.
Lighthearted, not sad. No text.
```

## 6. 받은 뒤 할 일 (제가 맡음)
- [x] 2단계 게임 화면 반영(2026-11-21): 플레이어 고르기, 대화창 대사, 주판봇 표정, 결과 장면 — 단 robo_seat_e13은 단체 그림으로 잘못 나와 쓰지 않음(e16을 기본으로 사용). 주판봇 혼자 앉은 무표정 그림으로 다시 요청
- [x] 5단계 탁자 위 연출 반영(동전이 미끄러져 이동)
- [x] 표지 반영, og:image 확인
- [ ] 원작 게임 그림·인물과 닮은 요소가 없는지 확인
