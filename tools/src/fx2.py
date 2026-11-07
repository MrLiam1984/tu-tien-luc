import sys,json
from playwright.sync_api import sync_playwright
from PIL import Image
cases=json.loads(sys.argv[1])  # list of [name, kind, he, g, weaponName]
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':1000,'height':800});pg.set_default_timeout(15000)
    errs=[];pg.on('console',lambda m:print('CON',m.text[:120],flush=True) if m.text.startswith('GATE') else None);pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
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
    pg.evaluate("S.eq.vo[0]=Object.assign(genManualV50('vo',2,'Thổ','quyen'),{learned:true});S.eq.vo[1]=Object.assign(genManualV50('vo',3,'Hỏa','dao'),{learned:true,affix:['dot','lien']});S.eq.tuyet=Object.assign(genManualV50('tuyet',3,'Lôi'),{learned:true,name:'Lôi Trảm Thiên'});renderCombat()");pg.wait_for_timeout(800)
    print('menu2',pg.evaluate("[...document.querySelectorAll('#modal button')].map(b=>b.textContent.trim().slice(0,28))"),flush=True)
    pg.evaluate("window.__fx.slow(6);window.__ev=[];setTimeout(()=>{combatAct('sk',0)},0)")
    for i in range(12):
        pg.wait_for_timeout(100);st=pg.query_selector('#modal .cstage')
        try:
            if st:st.screenshot(path=f'/tmp/fx/c_{i}.png',timeout=3000)
        except Exception as ex:print('shot fail',i,flush=True)
    pg.evaluate("window.__fx.slow(1)");pg.wait_for_timeout(5000)
    print('after sk0',pg.evaluate("[C.e.hp,C.e.hpMax,S.hp,!!document.querySelector('.pkend')]"),flush=True)
    print('moves',pg.evaluate("(()=>{const b=[...document.querySelectorAll('#modal button')].find(b=>/Chiến đấu/.test(b.textContent));if(b)b.click();return [...document.querySelectorAll('#modal button')].map(b=>b.textContent.trim().replace(/\\s+/g,' ').slice(0,34))})()"),flush=True)
    pg.wait_for_timeout(500)
    for t in range(8):
        if pg.evaluate("!!document.querySelector('.pkend')"):break
        pg.evaluate("setTimeout(()=>{C.e.hp=1;C.e.he='Kim';S.hp=S.hpMax;combatAct('atk')},0)");pg.wait_for_timeout(4500)
    print('gate',pg.evaluate("[!!document.querySelector('.pkend'),(document.querySelector('.pkend-t')||{}).textContent,(document.querySelector('.cfoe')||{}).className,C&&C.done]"),flush=True)
    st=pg.query_selector('#modal .cstage')
    try:
        if st:st.screenshot(path='/tmp/fx/gate.png',timeout=3000)
    except Exception:print('gate shot fail',flush=True)
    print('overlay shown',pg.evaluate("document.getElementById('overlay').classList.contains('show')"),flush=True)
    pg.evaluate("document.querySelector('.pkend-b').click()");pg.wait_for_timeout(3000)
    print('after click',pg.evaluate("[!!document.querySelector('.pkend'),document.getElementById('overlay').classList.contains('show'),document.querySelector('#modal')?document.querySelector('#modal').innerText.slice(0,80):'']"),flush=True)
    from PIL import Image
    import os;fr=[Image.open(f'/tmp/fx/c_{i}.png') for i in range(12) if os.path.exists(f'/tmp/fx/c_{i}.png')];w,h=fr[0].size;sc=.5
    sh=Image.new('RGB',(int(w*sc)*4,int(h*sc)*3))
    for i,im in enumerate(fr):sh.paste(im.resize((int(w*sc),int(h*sc))),((i%4)*int(w*sc),(i//4)*int(h*sc)))
    sh.save('/tmp/fx/sheet_c.png')
    print(errs[:6]);b.close()
