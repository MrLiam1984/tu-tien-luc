from playwright.sync_api import sync_playwright
import base64,sys,io,json
POSE=sys.argv[1]
from PIL import Image,ImageDraw
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':1100,'height':860})
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8765/index.html');pg.wait_for_timeout(3500)
    pg.get_by_text('Bắt đầu kiếp mới').first.click();pg.wait_for_timeout(600)
    pg.locator('#modal input').first.fill('Han Phong');pg.wait_for_timeout(500)
    pg.get_by_text('Tiếp theo').last.click();pg.wait_for_timeout(800)
    pg.evaluate("if(document.querySelector('#modal [onclick^=\"crSect\"]'))crSect(7)");pg.wait_for_timeout(1200)
    pg.evaluate("closeModal();render()");pg.wait_for_timeout(600)
    ids=pg.evaluate("DOLL.man['"+POSE+"'].items.filter(i=>i.kind==='outfit').map(i=>[i.id,i.name])")
    print(len(ids))
    pg.evaluate("DOLL.man['"+POSE+"'].items.forEach(i=>{const m=new Image();m.src='doll/'+i.file})");pg.wait_for_timeout(4000)
    tiles=[]
    for oid,nm in ids:
        u=None
        for t in range(3):
            pg.wait_for_timeout(200)
            u=pg.evaluate("""(a)=>{DOLL.memo.clear();return DOLL.url({pose:a[1],face:'hien',hair:'ngua',outfit:a[0],acc:[],fxb:'',fxf:'',wp:''},'full')}""",[oid,POSE])
        im=Image.open(io.BytesIO(base64.b64decode(u.split(',')[1].split('#')[0]))).convert('RGBA')
        bg=Image.new('RGBA',im.size,(224,214,192,255));bg.alpha_composite(im);t=bg.convert('RGB').resize((224,300))
        d=ImageDraw.Draw(t);d.rectangle((0,0,224,14),fill=(0,0,0));d.text((3,1),oid,fill=(255,255,0));tiles.append(t)
    cols=7;rows=(len(tiles)+cols-1)//cols
    sh=Image.new('RGB',(224*cols,300*rows))
    for i,t in enumerate(tiles):sh.paste(t,((i%cols)*224,(i//cols)*300))
    sh.save('/home/claude/out_sheet_'+POSE+'.png');print(errs[:3],sh.size);b.close()
