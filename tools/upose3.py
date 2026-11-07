from playwright.sync_api import sync_playwright
import sys
pose=sys.argv[1]
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':1500,'height':420})
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8765/index.html');pg.wait_for_timeout(2500)
    pg.evaluate("""(pose)=>{let h='';const ids=DOLL.opts('outfit',pose).map(o=>o.id);for(const id of ids){const L={pose,face:'',hair:'',outfit:id,acc:[],fxb:'',fxf:''};const u=DOLL.url(L,'full');h+=`<div style="display:inline-block;text-align:center;color:#fff;font:12px sans-serif"><img src="${u}" style="height:330px;background:#556"><br>${id}</div>`}
      document.body.innerHTML='<div style="background:#334;padding:6px">'+h+'</div>'}""",pose)
    pg.wait_for_timeout(800);pg.screenshot(path='/home/claude/sc_pose_%s.png'%pose)
    print(errs)
