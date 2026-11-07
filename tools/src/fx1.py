import sys,json
from playwright.sync_api import sync_playwright
from PIL import Image
cases=json.loads(sys.argv[1])  # list of [name, kind, he, g, weaponName]
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':1000,'height':800});pg.set_default_timeout(15000)
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
    print('go',flush=True);pg.goto('http://localhost:8765/index.html',wait_until='commit');pg.wait_for_timeout(3000)
    pg.get_by_text('Bắt đầu kiếp mới').first.click();pg.wait_for_timeout(600)
    print('step',9,flush=True)
    pg.locator('#modal input').first.fill('Han Phong');pg.wait_for_timeout(500)
    print('step',11,flush=True)
    pg.get_by_text('Tiếp theo').last.click();pg.wait_for_timeout(800)
    print('step',13,flush=True)
    pg.evaluate("if(document.querySelector('#modal [onclick^=\"crSect\"]'))crSect(7)");pg.wait_for_timeout(1200)
    print('step',15,flush=True)
    pg.evaluate("closeModal();render()");pg.wait_for_timeout(600)
    print('step',17,flush=True)
    pg.evaluate("setTimeout(()=>{[...document.querySelectorAll('#modal button')].filter(b=>b.textContent.includes('Để sau')).forEach(b=>b.click())},0)");pg.wait_for_timeout(500)
    print('step',19,flush=True)
    pg.wait_for_timeout(3000)
    pg.evaluate("setTimeout(()=>{closeModal();S.ll=S.llMax=500;S.hp=S.hpMax=5000;const e=makeEnemy('beast',2,'Sói Thử');C={e:e,round:1,done:false,guard:false,used:{},flee:0};renderCombat()},0)");pg.wait_for_timeout(2500)
    print('step',21,flush=True)
    print('started',flush=True);print('stage',pg.evaluate("!!document.querySelector('#modal .cstage')"))
    print('menu',pg.evaluate("[...document.querySelectorAll('#modal button')].map(b=>b.textContent.trim().slice(0,30))"))
    for name,kind,he,g,wn in cases:
        pg.evaluate("""([n,k,h,g])=>{window.__t=window.__fx.player('sk',{name:n,type:k,he:h,g:g,affix:[]},h)}""",[wn,kind,he,g])
        frames=[]
        pg.evaluate('window.__fx.slow(%d)'%(7 if kind!='tuyet' else 9))
        for i in range(12):
            pg.wait_for_timeout(100)
            st=pg.query_selector('#modal .cstage')
            if st: st.screenshot(path=f'/tmp/fx/{name}_{i}.png');frames.append(f'/tmp/fx/{name}_{i}.png')
        pg.evaluate('window.__fx.slow(1)');pg.wait_for_timeout(6000)
        ims=[Image.open(f) for f in frames];w,h=ims[0].size;sc=0.5
        sheet=Image.new('RGB',(int(w*sc)*4,int(h*sc)*3))
        for i,im in enumerate(ims):sheet.paste(im.resize((int(w*sc),int(h*sc))),((i%4)*int(w*sc),(i//4)*int(h*sc)))
        sheet.save(f'/tmp/fx/sheet_{name}.png')
    print(errs[:6]);b.close()
