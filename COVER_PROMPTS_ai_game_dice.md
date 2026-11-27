# 그림 지시문 (Genspark) — AI로 풀어보는 게임 시리즈 ③ 대항해시대 2 다이스

## 0. 화면 구성 — "항구 술집의 주사위 탁자, 세 사람"

옛 16비트 RPG의 술집 장면 **형식**만 빌립니다. 원작 게임(KOEI 「대항해시대 2」)의 화면 틀·인물·글꼴·로고는 닮지 않게 그립니다.

```
┌──────────────────────── 16:9 ────────────────────────┐
│  낮의 항구 술집(창밖 바다와 돛)                        │
│      [주판봇]        [초파리 연구원]                    │
│   ┌──── 초록 펠트 탁자 ────┐   주사위 컵·주사위 다섯 개  │
│   │  ⚀ ⚃ ⚅ ⚅ ⚅             │                          │
│   └────────────────────────┘                          │
│  [하루]  [시아]  [모아]  ← 앞쪽, 허리 위                │
└──────────────────────────────────────────────────────┘
```
- 지금 페이지는 이 그림이 오기 전까지 임시 표지(픽셀 SVG + 캐릭터 그림)로 돌아갑니다. `dice/img/dice_cover.webp`가 생기면 빌드가 자동으로 그림으로 바꿉니다(목차 카드 썸네일 포함).

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
| A | 16:9 | `dice/img/dice_cover.webp` | 1600×900 | 표지·목차 썸네일·공유 미리보기 |
| A | 16:9 | `dice/img/bg_felt.webp` | 1600×900 | 2단계 게임 화면 탁자 배경 |
| B | 1:1 투명 | `dice/img/die_1.png` ~ `die_6.png` | 256×256 | 주사위 눈 여섯 가지 |
| C | 16:9 | `dice/img/scene_win.webp` · `scene_lose.webp` | 1200×675 | 결과 장면 |

## 3. 대화 A — 표지와 배경

### A-1 표지 `dice_cover`
```
16-bit SNES-era pixel art, bright daytime harbor tavern with large windows showing blue sea and white sails, warm wooden interior, cheerful clean palette.
Center: a round wooden table covered with green felt, five white dice tumbling in mid-air above a leather dice cup, two of them showing six pips.
Across the table: AbaBot (small square robot, green screen face with mint pixel eyes, abacus beads on its chest, tank treads) proudly holding a dice cup, and the fruit-fly researcher (big red compound eyes, tiny white lab coat) on a stool, peeking at its own dice.
Near side, waist-up, facing the table: Haru (pink twin buns with navy streak, lab coat) cheering with a fist, Sia (long black hair, maid dress) calmly counting on her fingers, Moa (light brown hair, white headband, beige cardigan) leaning forward with sparkling eyes.
Leave clear empty space at the upper left for a title. Crisp pixels, no text.
```

### A-2 배경 `bg_felt`
```
16-bit SNES-era pixel art, top-down view of a tavern table covered with dark green felt, wooden rim around it, a leather dice cup and a brass candle holder at the edges, soft daylight.
The center of the felt is EMPTY and wide (three rows of five dice will be placed by the program). No people, no dice, no text.
```

## 4. 대화 B — 주사위 (투명 배경)
```
16-bit SNES-era pixel art icon on a transparent background, one ivory-white die seen straight from the top, rounded corners, thick dark outline, small shadow below.
Six versions with the same size and angle: 1 pip, 2 pips, 3 pips, 4 pips, 5 pips, 6 pips in the standard layout. Pips for 1 and 6 are red, others dark navy.
No text.
```

## 5. 대화 C — 결과 장면

### C-1 이겼을 때 `scene_win`
```
16-bit SNES-era pixel art, bright daytime harbor tavern, celebration. Haru, Sia and Moa cheer around the green felt table where five dice show a full house.
AbaBot slumps with spiral pixel eyes and a sweat drop, the fruit-fly researcher claps with its tiny hands. Pixel sparkles. No text.
```

### C-2 졌을 때 `scene_lose`
```
16-bit SNES-era pixel art, bright daytime harbor tavern, comic defeat. AbaBot stands on its stool holding up a dice cup triumphantly, its dice showing four of a kind.
Haru holds a single die with comic teary eyes, Sia sighs with a hand on her forehead, Moa pouts with puffed cheeks. Lighthearted, not sad. No text.
```

## 6. 받은 뒤 할 일 (제가 맡음)
- [x] 표지 반영(2026-11-27), og:image·목차 썸네일 자동 전환 확인
- [x] 2단계 탁자 배경(bg_felt)·주사위 그림(die_1~6) 연결 — 4·5단계 표와 족보 표의 작은 주사위도 같은 그림
- [x] 결과 장면 연결(scene_win_d · scene_lose_d, "탁자 보기"로 닫기)
- [x] 원작 게임 그림·인물과 닮은 요소 없음 확인
