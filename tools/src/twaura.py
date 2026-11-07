from playwright.sync_api import sync_playwright
import base64,io,json
from PIL import Image,ImageDraw
TH=['tulinh','tinhha','thaicuc','hukhong','thienco','luanhoi','yeu','ho','dan','kiem','huyet','mama','phuong','nghich','hondon','lei','tukhi','kimquang','thanhquang','lienhoa','thiendao']
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':1100,'height':860})
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8765/index.html');pg.wait_for_timeout(3500)
    pg.get_by_text('Bắt đầu kiếp mới').first.click();pg.wait_for_timeout(600)
    pg.locator('#modal input').first.fill('Han Phong');pg.wait_for_timeout(500)
    pg.get_by_text('Tiếp theo').last.click();pg.wait_for_timeout(800)
    pg.evaluate("closeModal();render()");pg.wait_for_timeout(600)
    pg.evaluate("Object.values(DOLL.man).forEach(m=>m.items.forEach(i=>{const x=new Image();x.src='doll/'+i.file}))");pg.wait_for_timeout(5000)
    for pose,face,out,fn in [('nam1','hien','thanh','a_nam.png'),('nu1','hien','thanh','a_nu.png')]:
        tiles=[]
        for t in TH:
            u=None
            for k in range(3):
                pg.wait_for_timeout(300)
                u=pg.evaluate("""([po,t])=>{DOLL.memo.clear();return DOLL.url({pose:po,face:'%s',hair:'ngua',outfit:'%s',acc:[],fxb:t,fxf:'',wp:''},'full')}"""%(face,''),[pose,t])
            im=Image.open(io.BytesIO(base64.b64decode(u.split(',')[1].split('#')[0]))).convert('RGBA')
            bg=Image.new('RGBA',im.size,(224,214,192,255));bg.alpha_composite(im);tt=bg.convert('RGB').resize((224,300))
            d=ImageDraw.Draw(tt);d.rectangle((0,0,224,14),fill=(0,0,0));d.text((3,1),t,fill=(255,255,0));tiles.append(tt)
        sh=Image.new('RGB',(224*7,300*3))
        for i,t in enumerate(tiles):sh.paste(t,((i%7)*224,(i//7)*300))
        sh.save('/home/claude/'+fn)
    print(errs[:3]);b.close()
