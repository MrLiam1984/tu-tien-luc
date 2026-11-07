# Đưa ảnh "nhân vật trọn bộ" (một pose + trang phục + mặt/tóc, nền magenta) thành một mục outfit của bộ pose.
# Dùng: python3 mkfig.py <nu2..nu7|nam2..> <thư mục ảnh> <plan.json>   (plan: {id:{name,tags}})
import sys,json,os
sys.path.insert(0,'/home/claude/doll')
import numpy as np
from PIL import Image
import build_doll as B
pose,src,plan=sys.argv[1],sys.argv[2],json.load(open(sys.argv[3]))
OUT='/home/claude/doll/out_B1' if pose.startswith('nu') else '/home/claude/doll/out_Nam'
fn_json=f'{OUT}/{pose}.json'
man=json.load(open(fn_json)) if os.path.exists(fn_json) else {'W':896,'H':1200,'pose':{},'items':[]}
HEADTOP,HEADX=94,450
for k,v in plan.items():
    p=f'{src}/{k}.png'
    if not os.path.exists(p):print('thiếu',p);continue
    im=Image.open(p).convert('RGB')
    a=np.asarray(im).copy()
    e=np.concatenate([a[10:40,:].reshape(-1,3),a[:,10:40].reshape(-1,3),a[:,-40:-10].reshape(-1,3)]);bgc=np.median(e,0).astype(np.uint8)
    for sl in (np.s_[:6,:],np.s_[-6:,:],np.s_[:,:6],np.s_[:,-6:]):a[sl]=bgc
    h,w=a.shape[:2]
    a[int(h*.89):,int(w*.84):]=bgc          # bỏ biểu tượng ✦ góc phải dưới
    im=Image.fromarray(a).resize((896,1200),Image.LANCZOS)
    bk,al=B.key(im);img=B.rgba(bk,al)
    q=np.asarray(img).astype(int);R,G,Bl=q[:,:,0],q[:,:,1],q[:,:,2]
    mg=(R>110)&(Bl>110)&(G<np.minimum(R,Bl)*0.62)
    gm=(R>80)&(Bl>80)&(G<np.minimum(R,Bl)*0.78);gm[:int(1200*.9)]=False   # vệt mực tím dưới chân
    mg=mg|gm
    q[:,:,3][mg]=0;img=Image.fromarray(q.astype('uint8'),'RGBA')
    arr=np.asarray(img)[:,:,3]
    cen=arr[:,int(896*.3):int(896*.62)];ys=np.where(cen.max(1)>40)[0];top=int(ys[0])
    band=arr[top:top+90,int(896*.3):int(896*.62)];xs=np.where(band.max(0)>40)[0];cx=int(896*.3)+int((xs[0]+xs[-1])/2)
    dx,dy=HEADX-cx,HEADTOP-top
    can=Image.new('RGBA',(896,1200),(0,0,0,0));can.paste(img,(dx,dy),img)
    c,bb=B.crop(can)
    fn=f'{pose}_outfit_{k}.webp';B.save(c,os.path.join(OUT,fn),q=90)
    it={'kind':'outfit','id':k,'name':v['name'],'file':fn,'x':bb[0],'y':bb[1],'w':c.width,'h':c.height,'tags':v.get('tags',[])}
    man['items']=[i for i in man['items'] if not(i['kind']=='outfit' and i['id']==k)]+[it]
    print('ok',pose,k,bb,'dx,dy',dx,dy)
json.dump(man,open(fn_json,'w'),ensure_ascii=False)
