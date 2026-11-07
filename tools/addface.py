# python3 addface.py <pose> id:shotnum:Tên:tag1/tag2 ...   (ảnh Flow đổi biểu cảm, cùng khung với base)
import sys,json,glob,os
sys.path.insert(0,'/home/claude/doll')
import numpy as np
from PIL import Image,ImageFilter,ImageDraw
import build_doll as B
pose=sys.argv[1];OUT='/home/claude/doll/out_Nam' if pose.startswith('nam') else '/home/claude/doll/out_B1'
man=json.load(open(f'{OUT}/{pose}.json'))
bi=[i for i in man['items'] if i['kind']=='outfit' and i['id']=='base'][0]
def headref(al):
    ys,xs=np.where(al>128);top=ys.min();band=(ys<top+110);return top,xs[band].mean(),ys.max()
ba=np.asarray(Image.open(f"{OUT}/{bi['file']}").convert('RGBA'))[...,3]
BT,BX,BB=headref(ba);BT+=bi['y'];BX+=bi['x'];BB+=bi['y']
FX,FY,FW,FH=int(round(BX-50)),int(BT+60),100,135
D='/tmp/claude-chrome-screenshots-nTg1wA/'
for spec in sys.argv[2:]:
    oid,n,name,tags=spec.split(':')
    p=glob.glob(D+'screenshot-*-%s.png'%n)[0]
    im=Image.open(p).convert('RGB')
    if im.size!=(896,1200):im=im.resize((896,1200),Image.LANCZOS)
    a=np.asarray(im).copy();bgc=np.median(np.concatenate([a[5:30].reshape(-1,3),a[:,5:30].reshape(-1,3)]),0).astype(np.uint8)
    bk,al=B.key(Image.fromarray(a));img=B.rgba(bk,al)
    A=np.asarray(img)[...,3];T,X,Bo=headref(A)
    sc=(BB-BT)/(Bo-T);W2,H2=round(896*sc),round(1200*sc);im2=im.resize((W2,H2),Image.LANCZOS)
    ox=round(BX-X*sc);oy=round(BT-T*sc)
    can=Image.new('RGB',(896,1200),tuple(int(v) for v in bgc));can.paste(im2,(ox,oy))
    bk2,al2=B.key(can);al2=np.asarray(al2) if not isinstance(al2,np.ndarray) else al2
    kal=Image.fromarray(np.asarray(B.rgba(bk2,al2))[...,3]).crop((FX,FY,FX+FW,FY+FH)).filter(ImageFilter.MinFilter(3))
    crop=can.crop((FX,FY,FX+FW,FY+FH)).convert('RGBA')
    m=Image.new('L',(FW*4,FH*4),0);ImageDraw.Draw(m).ellipse((6,10,FW*4-6,FH*4-6),fill=255)
    m=m.filter(ImageFilter.GaussianBlur(14)).resize((FW,FH),Image.LANCZOS);crop.putalpha(Image.fromarray((np.asarray(m).astype(float)*np.asarray(kal).astype(float)/255).astype('uint8')))
    fn=f'{pose}_face_{oid}.webp';crop.save(os.path.join(OUT,fn),'WEBP',quality=90)
    it={'kind':'face','id':oid,'name':name,'file':fn,'x':FX,'y':FY,'w':FW,'h':FH,'tags':tags.split('/') if tags else []}
    man['items']=[i for i in man['items'] if not(i['kind']=='face' and i['id']==oid)]+[it];print('ok',oid)
json.dump(man,open(f'{OUT}/{pose}.json','w'),ensure_ascii=False)
