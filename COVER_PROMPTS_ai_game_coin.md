# 그림 지시문 — AI로 풀어보는 게임 시리즈 ② 대항해시대 4 코인 게임

- 화풍: 연구실 시리즈 공통 **16비트 SNES 시대 픽셀아트**, 낮의 연구실(흰 배경·밝은 조명)
- **게임 그림을 쓰지 않습니다**: 원작 게임의 화면·인물(페르난도 디아스 등)·로고·지도 그림을 흉내 내지 않고, 연구실 식구들이 동전 게임을 하는 새 장면으로 그립니다.
- 캐릭터 기준 그림: adminmrobo/fruitfly-lab-expressions (하루·시아·모아·주판봇 E13을 참고 그림으로 함께 올림)
- 저장 이름과 크기: `coin/img/coin_cover.webp` 1600×900, `coin/img/coin_cover_960.webp`(표지에서 축소), `coin/img/coin_scene_qtable.webp`·`coin/img/coin_scene_duel.webp` 1200×800. 한 편 합계 600KB 이하.
- 그림 안에는 글자를 넣지 않습니다(말풍선 글자는 페이지에서 얹음).

## ① 표지 `coin_cover` (16:9)

```
16-bit SNES-era pixel art, bright daytime research lab with a small nautical touch: a ship's wheel and an old sea chart pinned on the white wall, warm sunlight.
On a wooden lab table: a row of thirteen shiny gold coins, and below it a separate short row of five coins alternating gold and silver.
A small square robot with a green screen face and abacus beads on its chest (AbaBot) sits across the table as the opponent, confidently holding up three fingers.
Three anime-style girls on the near side of the table:
(1) Haru — pink hair in twin buns with a navy blue streak, blue eyes, lavender hoodie under a white lab coat, thinking with a finger on her chin;
(2) Sia — long straight black hair, grey eyes, black-and-white maid dress, no headpiece, calmly counting coins;
(3) Moa — light brown hair, amber eyes, white headband, beige cardigan with checkered ribbon, excited sparkling eyes, reaching for a coin.
Leave empty space at the upper middle for a speech bubble. Crisp pixels, limited palette, no text, no letters, no logos.
```
네거티브: `text, letters, numbers, watermark, logo, game UI, video game screenshot, Koei, historical game characters, dark night scene, photorealistic, 3D render, blurry`

## ② 장면 `coin_scene_qtable` (3:2) — 스스로 두며 배우기

```
16-bit SNES-era pixel art, daytime lab. A tiny holographic copy of AbaBot plays coins against itself on a glowing table, hundreds of faint ghost coins piling up behind it to show many practice games.
A large board on the wall shows a grid of small colored squares, green and red, with every fourth row glowing red.
Moa (light brown hair, white headband) points at the glowing red rows with sparkling eyes; Sia (long black hair, maid dress) takes notes.
No text, no letters, no numbers.
```

## ③ 장면 `coin_scene_duel` (3:2) — 연습량이 다른 세 AI

```
16-bit SNES-era pixel art, daytime lab, playful tournament. Three small helper robots of different sizes stand at three tables, each facing AbaBot's coin table: a tiny wobbly one, a medium one, and a confident one with a little trophy.
Haru (pink twin buns, navy streak) looks sweaty beside the tiny robot, Sia (black hair, maid dress) nods beside the medium robot, Moa (light brown hair, white headband) cheers beside the confident robot.
A doctor character in a white coat with glasses and thick black eyebrows raises a judge flag.
No text, no letters, no numbers.
```

## 반영 체크리스트
- [ ] 표지 받으면 `build/coin/src.html`의 표지 블록(`<!-- lab-cover -->`)을 `<picture>`로 교체, og:image 확인
- [ ] 장면 2장은 4단계 끝·대결 머리에 넣고 alt 작성
- [ ] 원작 게임 그림·인물과 닮은 요소가 없는지 확인
