# 그림 지시문 (Genspark) — AI로 풀어보는 게임 시리즈 ④ 대항해시대 2 블랙잭

## 0. 화면 구성 — "같은 술집의 카드 탁자, 딜러는 주판봇"

③편 다이스와 같은 항구 술집입니다(표지끼리 이어지게 같은 창·같은 나무 벽). 원작 게임(KOEI 「대항해시대 2」)의 화면 틀·인물·글꼴·로고, 실제 카지노 로고는 닮지 않게 그립니다.

```
┌──────────────────────── 16:9 ────────────────────────┐
│  낮의 항구 술집                                        │
│            [딜러 주판봇]  카드 뭉치                     │
│   ╭──── 반달 모양 초록 카드 탁자 ────╮                  │
│   │   🂡 🂠      🂷 🂨     칩 더미      │                  │
│   ╰────────────────────────────────╯                  │
│  [하루]  [시아]  [모아]  ← 앞쪽, 허리 위                │
└──────────────────────────────────────────────────────┘
```
- 그림이 오기 전까지 임시 표지로 돌아갑니다. `blackjack/img/blackjack_cover.webp`가 생기면 빌드가 자동으로 바꿉니다.

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
| A | 16:9 | `blackjack/img/blackjack_cover.webp` | 1600×900 | 표지·목차 썸네일·공유 미리보기 |
| A | 16:9 | `blackjack/img/bg_table.webp` | 1600×900 | 2단계 카드 탁자 배경 |
| B | 1:1 투명 | `blackjack/img/robo_dealer_e13.png` · `e16` · `e20` | 600×600 | 딜러 주판봇(기본·자신만만·당황) |
| B | 2:3 투명 | `blackjack/img/card_back.png` | 400×600 | 카드 뒷면 |
| C | 16:9 | `blackjack/img/scene_win.webp` · `scene_lose.webp` | 1200×675 | 결과 장면 |

## 3. 대화 A — 표지와 배경

### A-1 표지 `blackjack_cover`
```
16-bit SNES-era pixel art, bright daytime harbor tavern (same wooden walls and sea-view windows as the dice cover), a half-moon green felt card table with a thin gold line.
Behind the table: AbaBot as the dealer (small square robot, green screen face with mint pixel eyes, abacus beads on its chest, a tiny black bow tie) dealing a playing card with a confident wink, a neat deck beside it.
On the felt: two face-up cards in front of the dealer (one face-down), two face-up cards in front of the players, small stacks of plain colored chips without any symbols.
Near side, waist-up: Haru (pink twin buns with navy streak, lab coat) with a finger on her chin, thinking; Sia (long black hair, maid dress) calmly pointing at the dealer's card; Moa (light brown hair, white headband, cardigan) holding her cards close with excited eyes.
Leave clear empty space at the upper left for a title. Crisp pixels, no text, no letters or numbers on cards (use simple pip shapes only).
```

### A-2 배경 `bg_table`
```
16-bit SNES-era pixel art, a half-moon green felt card table seen from the player's seat, wooden rim, a thin gold arc line, a card shoe on the right edge, soft daylight from tavern windows.
Upper area of the felt (dealer cards) and lower area (player cards) are EMPTY. No people, no cards, no text.
```

## 4. 대화 B — 투명 배경
### B-1 딜러 주판봇 3종
```
16-bit SNES-era pixel art sprite on a transparent background, AbaBot — small square robot, green screen face, abacus beads on its chest, tiny black bow tie — standing behind a table edge as a card dealer, upper body visible.
Three versions with the same pose and size: (e13) neutral, holding a card; (e16) confident, closed happy eyes, one card raised; (e20) flustered, wide eyes with a sweat drop, cards scattering.
Transparent background, no text.
```
### B-2 카드 뒷면 `card_back`
```
16-bit SNES-era pixel art, the back of a playing card, rounded corners, royal blue with a simple white anchor-and-compass pattern (original design, no logo), thick dark outline. Transparent background, no text.
```

## 5. 대화 C — 결과 장면
### C-1 이겼을 때 `scene_win`
```
16-bit SNES-era pixel art, bright daytime harbor tavern, celebration. AbaBot the dealer has busted — its cards spill over the table and it has spiral pixel eyes. Haru, Sia and Moa cheer with raised hands. Pixel sparkles. No text.
```
### C-2 졌을 때 `scene_lose`
```
16-bit SNES-era pixel art, bright daytime harbor tavern, comic defeat. AbaBot the dealer proudly sweeps a small pile of plain chips toward itself. Haru stares at her cards with comic teary eyes, Sia sighs, Moa pouts. Lighthearted, not sad. No text.
```

## 6. 받은 뒤 할 일 (제가 맡음)
- [x] 표지 반영(2026-11-27), og:image·목차 썸네일 자동 전환 확인
- [x] 2단계 탁자 배경(bg_table)·딜러 주판봇 표정 3종(기본·질 때 자신만만·이길 때 당황)·카드 뒷면 연결
- [x] 결과 장면 연결(scene_win_b · scene_lose_b, 비기면 장면 없음)
- [x] 원작 게임·실제 카지노 디자인과 닮은 요소 없음 확인
