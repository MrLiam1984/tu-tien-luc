from playwright.sync_api import sync_playwright
import json
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':1300,'height':900});pg.set_default_timeout(25000)
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type in('error','warning') and 'ERR_TUNNEL' not in m.text else None)
    pg.goto('http://localhost:8765/index.html',wait_until='commit');pg.wait_for_timeout(3000)
    pg.get_by_text('Bắt đầu kiếp mới').first.click();pg.wait_for_timeout(600)
    pg.locator('#modal input').first.fill('Han Phong');pg.wait_for_timeout(500)
    pg.get_by_text('Tiếp theo').last.click();pg.wait_for_timeout(800)
    pg.evaluate("if(document.querySelector('#modal [onclick^=\"crSect\"]'))crSect(7)");pg.wait_for_timeout(3000)
    pg.evaluate("setTimeout(()=>closeModal(),0)");pg.wait_for_timeout(500)
    code="""async(mode)=>{
      window.choose=async(t,d,opts)=>{const o=opts[mode==='last'?opts.length-1:0];if(o.c){const okF=mode!=='fail';return okF?(o.ok&&await o.ok()):(o.no&&await o.no())}return o.run?await o.run():(o.ok&&await o.ok())};
      window.say=async()=>{};window.titleCard=()=>{};window.sleep=async()=>{};
      window.startCombat=async(e,w)=>{window.__fights=(window.__fights||[]);window.__fights.push(e.name+'@r'+e.realm+(e.boss?'*':''));return 'win'};
      const res={};S.hp=S.hpMax;S.linhThach=99999;
      for(const dom of Object.keys(__v10u.DOM)){window.__fights=[];S.tuvi=0;const ls0=S.linhThach,n0=Object.keys(S.items).length,g0=S.gearBag.length;
        try{await __v10u.run({dom,n:__v10u.DOM[dom].names[0],ck:0,id:'cr0'});res[dom]={ok:1,fights:window.__fights.join('|'),ls:S.linhThach-ls0,items:Object.keys(S.items).length-n0,gear:S.gearBag.length-g0,tv:S.tuvi,hp:Math.round(S.hp)}}catch(e){res[dom]={err:String(e).slice(0,200)+' '+(e.stack||'').split('\\n')[1]}}
        S.hp=S.hpMax;S.dead=false}
      return res}"""
    for mode in ['first','fail','last']:
        r=pg.evaluate(code,mode)
        print(mode);
        for k,v in r.items():print(' ',k,json.dumps(v,ensure_ascii=False)[:230])
    print(errs[:6])
    b.close()
