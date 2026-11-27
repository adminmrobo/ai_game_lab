"""Genspark 그림(PNG)을 페이지용 WebP로 줄여 <게임>/img/에 넣는다. 실행: python3 build/import_art.py <PNG 폴더들…>
표지 1600×900(+960×540), 배경 1600×900, 결과 장면 1200×675, 스프라이트는 아래 크기(투명 유지)."""
import sys, pathlib
from PIL import Image
R = pathlib.Path(__file__).resolve().parent.parent
SIZE = {'cover': (1600, 900), 'bg': (1600, 900), 'scene': (1200, 675), 'die': (256, 256), 'slime': (256, 256), 'robo': (400, 400), 'card': (300, 450)}
def kind(n):
    for k in ['cover', 'bg', 'scene', 'die', 'slime', 'robo', 'card']:
        if k in n: return k
for src in sys.argv[1:]:
    for f in sorted(pathlib.Path(src).rglob('*.png')):
        game = f.parent.parent.name; n = f.stem; k = kind(n)
        if n == 'robo_booth': print('건너뜀(창 안에 가짜 투명 격자):', f.name); continue
        im = Image.open(f); im = im.convert('RGBA' if im.mode in ('RGBA', 'LA', 'P') else 'RGB')
        out = R / game / 'img'; out.mkdir(parents=True, exist_ok=True)
        im.resize(SIZE[k], Image.LANCZOS).save(out / (n + '.webp'), 'WEBP', quality=74, method=6)
        if k == 'cover': im.resize((960, 540), Image.LANCZOS).save(out / (n + '_960.webp'), 'WEBP', quality=72, method=6)
for g in ['dice', 'blackjack', 'slime']:
    fs = list((R / g / 'img').glob('*.webp')); print(g, len(fs), '장', sum(x.stat().st_size for x in fs) // 1024, 'KB')
