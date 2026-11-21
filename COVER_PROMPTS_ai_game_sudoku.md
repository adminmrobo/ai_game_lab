# 그림 지시문 — AI로 풀어보는 게임 시리즈 ① 스도쿠

- 화풍: 연구실 시리즈 공통 **16비트 SNES 시대 픽셀아트**, 낮의 연구실(흰 배경·밝은 조명)
- 캐릭터 기준 그림: adminmrobo/fruitfly-lab-expressions (하루·시아·모아 E13을 참고 그림으로 함께 올림)
- 만드는 순서: ① 표지 → 그림체 확인 → ② 장면 2장(표지를 참고 그림으로 같이 올림)
- 저장 이름과 크기: `sudoku/img/sdk_cover.webp` 1600×900, `sudoku/img/sdk_cover_960.webp`(표지에서 축소), `sudoku/img/sdk_scene_bowl.webp`·`sudoku/img/sdk_scene_race.webp` 1200×800. 한 편 합계 600KB 이하.
- 그림 안에는 글자를 넣지 않습니다(말풍선 글자는 페이지에서 얹음).

## ① 표지 `sdk_cover` (16:9)

```
16-bit SNES-era pixel art, bright daytime research lab with white walls and soft sunlight, clean light palette.
Center-left: a large 9x9 number-puzzle board drawn on a whiteboard, thick dark lines around each 3x3 block, some digits filled in dark ink, a few blank spots.
Center-right: a big smooth teal bowl-shaped curve floating like a glowing hologram above the lab table, a small magenta ball rolling down the curve toward the glowing green bottom point.
Three anime-style girls watching the ball together, bust-to-waist framing, cheerful:
(1) Haru — pink hair in twin buns with a navy blue streak, blue eyes, lavender hoodie under a white lab coat, sparkling excited eyes, pointing at the ball;
(2) Sia — long straight black hair, grey eyes, black-and-white maid dress, no headpiece, hand on chin, thinking;
(3) Moa — light brown hair, amber eyes, white headband, beige cardigan with checkered ribbon, surprised open mouth.
Leave an empty space at the upper middle for a speech bubble. Crisp pixels, limited palette, no text, no letters, no logos.
```
네거티브: `text, letters, watermark, logo, dark night scene, neon, photorealistic, 3D render, blurry, extra fingers, real sudoku app UI`

## ② 장면 `sdk_scene_bowl` (3:2) — 그릇 만들기

```
16-bit SNES-era pixel art, daytime lab. Many tiny answer-sheet cards lined up on a long table; behind each card a stack of small colored blocks whose height varies, low in the middle and higher toward both ends, together forming a bowl shape.
The single card in the very middle has no blocks and glows green.
Haru (pink twin buns, navy streak, white lab coat) places a block on a stack; Moa (light brown hair, white headband, cardigan) looks amazed with sparkling eyes.
Clean light background, no text, no letters.
```

## ③ 장면 `sdk_scene_race` (3:2) — 세 플레이어 레이스

```
16-bit SNES-era pixel art, daytime lab, playful race scene. Three glowing bowl-shaped tracks side by side, each with a small ball.
Left track: Haru (pink twin buns, navy streak) looks worried, her ball stuck in a small dip halfway down.
Middle track: Sia (long black hair, maid dress) calmly gives her track a gentle shake, her ball reaching the green glowing bottom.
Right track: Moa (light brown hair, white headband) shakes her track wildly, her ball bouncing high in the air.
A doctor character in a white coat with glasses and thick black eyebrows holds a judge flag at the side.
No text, no letters, no numbers.
```

## 반영 체크리스트
- [ ] 표지 받으면 `build/sudoku/src.html`의 표지 블록(`<!-- lab-cover -->`)을 `<picture>`로 교체, og:image 확인
- [ ] 장면 2장은 3단계 끝·레이스 머리에 넣고 alt 작성
- [ ] 하루의 머리 모양(둥근 번 두 개·남색 줄), 시아 머리 장식 없음, 모아 흰 머리띠 확인
