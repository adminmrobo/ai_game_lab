"""③~⑤ 임시 표지(픽셀 SVG + 캐릭터). 픽셀아트 그림(<게임>/img/<게임>_cover.webp)이 오면 build.js가 그림을 대신 쓴다. 실행: python3 build/make_temp_covers.py"""
import pathlib
B = pathlib.Path(__file__).resolve().parent
def svg(body, bg): return '<svg class="scene" viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="160" height="90" fill="%s"/>%s</svg>' % (bg, body)
def r(x, y, w, h, c): return '<rect x="%d" y="%d" width="%d" height="%d" fill="%s"/>' % (x, y, w, h, c)
def die(x, y, v, s=9):
    P = {1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8]}[v]
    o = r(x, y + s, s, 1, '#b9ad8f') + r(x, y, s, s, '#16212b') + r(x + 1, y + 1, s - 2, s - 2, '#fffdf6')
    for i in P: o += r(x + 2 + (i % 3) * 2, y + 2 + (i // 3) * 2, 1, 1, '#c9302c' if v in (1, 6) else '#16212b')
    return o
def wall(c1, c2):
    o = r(0, 0, 160, 40, c1)
    for y in range(0, 40, 6):
        for x in range((y // 6 % 2) * 8, 160, 16): o += r(x, y, 15, 5, c2)
    return o
def window(x): return r(x, 6, 30, 22, '#7fb6e0') + r(x, 6, 30, 1, '#5b3a1f') + r(x + 14, 6, 1, 22, '#5b3a1f') + r(x, 17, 30, 1, '#5b3a1f')
def cast(moods): return '<div class="cast4">' + ''.join('<img data-mood="%s" alt="">' % m for m in moods) + '</div><span class="tmp">임시 표지 · 픽셀아트 준비 중</span>'
# ③ 다이스
b = wall('#e9d3ad', '#f3e2c4') + window(10) + window(120) + r(0, 40, 160, 50, '#8a5a2f') + r(14, 44, 132, 40, '#6b4423') + r(18, 47, 124, 34, '#2f7d4f') + r(20, 49, 120, 30, '#3a8f5c')
for i, v in enumerate([6, 6, 6, 3, 1]): b += die(52 + i * 12, 50 + (i % 2) * 3, v)
b += r(118, 48, 14, 3, '#5b3a1f') + r(120, 50, 10, 12, '#c9a36a') + r(121, 51, 8, 10, '#e8c88f')
(B / 'dice/cover.html').write_text(svg(b, '#e9d3ad') + cast(['robo_e16', 'moa_e19', 'asst_e12', 'sia_e09', 'fly_e09']))
# ④ 블랙잭
def card(x, y, red):
    c = '#c9302c' if red else '#16212b'
    return r(x + 1, y + 1, 14, 20, '#00000033') + r(x, y, 14, 20, '#16212b') + r(x + 1, y + 1, 12, 18, '#ffffff') + r(x + 3, y + 3, 2, 3, c) + r(x + 6, y + 8, 3, 4, c) + r(x + 9, y + 14, 2, 3, c)
def back(x, y):
    o = r(x + 1, y + 1, 14, 20, '#00000033') + r(x, y, 14, 20, '#16212b') + r(x + 1, y + 1, 12, 18, '#2b4fa3')
    for yy in range(y + 3, y + 18, 3): o += r(x + 3, yy, 8, 1, '#7f9ce0')
    return o
b = wall('#d9c3e8', '#e6d4f0') + window(10) + window(120) + r(0, 40, 160, 50, '#5b3a1f') + r(8, 42, 144, 46, '#6b4423') + r(12, 45, 136, 40, '#1f6b4a') + r(14, 47, 132, 36, '#27805a') + r(40, 60, 80, 1, '#e7c76b')
b += card(62, 46, True) + back(78, 46) + card(48, 58, False) + card(64, 58, True)
for i in range(5): b += r(110 + i * 2, 70 - i * 2, 8, 2, ['#c9302c', '#2b4fa3', '#e7c76b', '#13733a', '#ffffff'][i])
(B / 'blackjack/cover.html').write_text(svg(b, '#d9c3e8') + cast(['asst_e09', 'robo_e16', 'sia_e07', 'moa_e12']))
# ⑤ 슬라임 레이스
def slime(x, y, c, d):
    return r(x + 1, y + 8, 12, 2, '#00000022') + r(x + 3, y, 8, 1, c) + r(x + 1, y + 1, 12, 1, c) + r(x, y + 2, 14, 6, c) + r(x + 2, y + 2, 3, 2, '#ffffff88') + r(x + 4, y + 4, 2, 2, '#16212b') + r(x + 9, y + 4, 2, 2, '#16212b') + r(x + 5, y + 7, 4, 1, d)
b = r(0, 0, 160, 30, '#9fd3f2') + r(0, 24, 160, 8, '#7cbf5a') + ''.join(r(x + 4, 18, 10, 8, '#5aa64a') for x in range(0, 160, 20)) + r(0, 32, 160, 58, '#d9b27a')
cols = [('#57c46a', '#2f8a3f'), ('#4f8fe0', '#2a5aa8'), ('#ef7fb4', '#b84a80'), ('#f2c230', '#a37d00'), ('#9b6fd6', '#6a42a8')]
for i, (c, d) in enumerate(cols):
    y = 34 + i * 8; b += r(0, y + 9, 160, 1, '#ffffffaa') + slime(14 + [40, 22, 58, 30, 12][i], y - 1, c, d)
b += r(138, 33, 3, 55, '#ffffff') + ''.join(r(141, 33 + k * 4, 3, 2, '#16212b') for k in range(14))
(B / 'slime/cover.html').write_text(svg(b, '#9fd3f2') + cast(['robo_e16', 'moa_e19', 'asst_e19', 'sia_e07']))
# 목차 카드용 썸네일(그림만)
for g in ['dice', 'blackjack', 'slime']:
    s = (B / g / 'cover.html').read_text(); (B / g / 'thumb.svg.html').write_text(s[:s.index('</svg>') + 6].replace('class="scene"', 'class="scene" style="width:100%;height:100%"'))
print('ok')
