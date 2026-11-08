# Dùng: python3 addout.py <pose> id:shotnum:Tên:tag1/tag2 ...
import sys,json,glob,os
sys.path.insert(0,'/home/claude/doll')
import numpy as np
from PIL import Image
import build_doll as B
pose=sys.argv[1];OUT='/home/claude/doll/out_Nam' if pose.startswith('nam') else '/home/claude/doll/out_B1'
man=json.load(open(f'{OUT}/{pose}.json'))
bi=[i for i in man['items'] if i['kind']=='outfit' and i['id']=='base'][0]
def headref(al,ox,oy):
    ys,xs=np.where(al>128);top=ys.min();band=(ys<top+110);return top,xs[band].mean(),ys.max()
ba=np.asarray(Image.open(f"{OUT}/{bi['file']}").convert('RGBA'))[...,3]
BT,BX,BB=headref(ba,0,0);BT+=bi['y'];BX+=bi['x'];BB+=bi['y']
D='/tmp/claude-chrome-screenshots-nTg1wA/'
for spec in sys.argv[2:]:
    oid,n,name,tags=spec.split(':')
    p=glob.glob(D+'screenshot-*-%s.png'%n)[0]
    im=Image.open(p).convert('RGB')
    if im.size!=(896,1200):im=im.resize((896,1200),Image.LANCZOS)
    a=np.asarray(im).copy()
    bgc=np.median(np.concatenate([a[5:30].reshape(-1,3),a[:,5:30].reshape(-1,3)]),0).astype(np.uint8)
    yy,xx=np.ogrid[:1200,:896];a[((xx-795)**2+(yy-1100)**2)<34**2]=bgc
    for sl in (np.s_[:4,:],np.s_[-4:,:],np.s_[:,:4],np.s_[:,-4:]):a[sl]=bgc
    bk,al=B.key(Image.fromarray(a))
    img=B.rgba(bk,al)
    A=np.asarray(img)[...,3];T,X,Bo=headref(A,0,0)
    sc=(BB-BT)/(Bo-T);W2,H2=round(896*sc),round(1200*sc);im2=img.resize((W2,H2),Image.LANCZOS)
    ox=round(BX-X*sc);oy=round(BT-T*sc);can=Image.new('RGBA',(896,1200),(0,0,0,0));can.alpha_composite(im2,(0,0)) if False else can.paste(im2,(ox,oy),im2)
    img=can;c,bb=B.crop(img)
    fn=f'{pose}_outfit_{oid}.webp';B.save(c,os.path.join(OUT,fn),q=88)
    it={'kind':'outfit','id':oid,'name':name,'file':fn,'x':bb[0],'y':bb[1],'w':c.width,'h':c.height,'tags':tags.split('/') if tags else []}
    man['items']=[i for i in man['items'] if not(i['kind']=='outfit' and i['id']==oid)]+[it]
    print('ok',oid,bb,c.size)
json.dump(man,open(f'{OUT}/{pose}.json','w'),ensure_ascii=False)
