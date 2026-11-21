# 화면에 바로 보이는(접기 상자 밖) 글에서 수식 표시를 센다
import sys,re
from playwright.sync_api import sync_playwright
JS="""()=>{const w=document.createTreeWalker(document.querySelector('main'),NodeFilter.SHOW_TEXT);let t='';
 while(w.nextNode()){const n=w.currentNode,p=n.parentElement;if(p.closest('details')||p.closest('script')||p.closest('.quiz')||p.closest('.glog'))continue;
 if(p.closest('[hidden]'))continue;t+=n.textContent+' ';}return t;}"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome')
    for page in sys.argv[1:]:
        pg=b.new_page();pg.goto(f'file:///home/claude/ai_game_lab/{page}/index.html');pg.wait_for_timeout(600)
        t=pg.evaluate(JS)
        t=re.sub(r'\d\s*×\s*\d\s*(판|묶음|연습판|쉬움|보통)?','',t);sym=len(re.findall(r'[Σ×÷₅₂]|\d+\s*/\s*\d+|−\s*\(|\b[nN]\b|E\s*=|=\s*[−\d+]',t))
        mathb=pg.evaluate("[...document.querySelectorAll('.mathb')].map(b=>{const c=b.cloneNode(true);c.querySelectorAll('details').forEach(d=>d.remove());return c.innerText.length})")
        print(page,'수식 표시',sym,'· 조수 수식 상자 글자 수',mathb)
        pg.close()
    b.close()
