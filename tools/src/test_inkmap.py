from playwright.sync_api import sync_playwright
import json
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':1300,'height':900});pg.set_default_timeout(20000)
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type in('error','warning') and 'ERR_TUNNEL' not in m.text else None)
    pg.goto('http://localhost:8765/index.html',wait_until='commit');pg.wait_for_timeout(3500)
    pg.get_by_text('Bắt đầu kiếp mới').first.click();pg.wait_for_timeout(600)
    pg.locator('#modal input').first.fill('Han Phong');pg.wait_for_timeout(500)
    pg.get_by_text('Tiếp theo').last.click();pg.wait_for_timeout(800)
    pg.evaluate("if(document.querySelector('#modal [onclick^=\"crSect\"]'))crSect(7)");pg.wait_for_timeout(3000)
    pg.evaluate("setTimeout(()=>closeModal(),0)");pg.wait_for_timeout(500)
    for i in (0,5):
        pg.evaluate(f"setTimeout(()=>{{S.loc={i};try{{CM.lay={{}}}}catch(e){{}};openChauMap()}},0)");pg.wait_for_timeout(2500)
        pg.screenshot(path=f'/tmp/fx/vm_{i}.png')
        pg.evaluate("setTimeout(()=>{CM.sel='t0';cmRender()},0)");pg.wait_for_timeout(1000)
        pg.screenshot(path=f'/tmp/fx/vm_{i}s.png')
        pg.evaluate("closeChauMap()");pg.wait_for_timeout(300)
    pg.evaluate("setTimeout(()=>{S.loc=0;openChauMap()},0)");pg.wait_for_timeout(1500)
    pg.evaluate("setTimeout(()=>{closeChauMap();S.loc=0;openTown('t0')},0)");pg.wait_for_timeout(2500)
    pg.screenshot(path='/tmp/fx/vm_town.png')
    print(errs[:10])
    b.close()
