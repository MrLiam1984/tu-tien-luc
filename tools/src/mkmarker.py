import cv2,numpy as np,glob
from PIL import Image
D='/tmp/claude-chrome-screenshots-nTg1wA/'
def P(n):return glob.glob(D+'screenshot-*-%d.png'%n)[0]
S=192
K1='thon tran huyen thanh dedo tong gate cave zone fortune boss secret portal quest _ _'.split()
K2='yeuvuong chientruong huyettri kiemtrung duocvien thapco maicung longmach bandit hermit ruins teahouse shrine dock mine tomb'.split()
tiles=[];names=[]
def cell(img,r,c,ins=22):
    W=img.shape[1];cw=W/4
    x0=int(c*cw+ins);y0=int(r*cw+ins);x1=int((c+1)*cw-ins);y1=int((r+1)*cw-ins)
    cell=img[y0:y1,x0:x1].copy();cf=cell.astype(np.float32)
    ring=np.concatenate([cf[:4].reshape(-1,3),cf[-4:].reshape(-1,3),cf[:,:4].reshape(-1,3),cf[:,-4:].reshape(-1,3)])
    bg=np.median(ring,0);dist=np.sqrt(((cf-bg)**2).sum(2))
    fg=(dist>22).astype(np.uint8);fg=cv2.morphologyEx(fg,cv2.MORPH_OPEN,np.ones((3,3),np.uint8))
    inv=(1-fg).astype(np.uint8);nl,lab=cv2.connectedComponents(inv,connectivity=4)
    border=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
    a=np.where(np.isin(lab,list(border)),0,255).astype(np.uint8)
    nl2,lab2,st,_=cv2.connectedComponentsWithStats((a>0).astype(np.uint8),connectivity=8)
    big=max([st[k][4] for k in range(1,nl2)] or [1]);keep=np.zeros_like(a)
    for k in range(1,nl2):
        if st[k][4]>=big*.04:keep[lab2==k]=255
    a=cv2.GaussianBlur(keep,(5,5),0).astype(np.float32)
    h,w=a.shape;yy,xx=np.mgrid[0:h,0:w];e=np.minimum.reduce([xx,yy,w-1-xx,h-1-yy]).astype(np.float32)
    if (a>128).mean()>.72:
        el=np.sqrt(((xx-w/2)/(w*.5))**2+((yy-h/2)/(h*.5))**2)
        a=a*np.clip((1-el)/.28,0,1)
    a=a*np.clip(e/14,0,1)
    rgba=np.dstack([cell[...,::-1],a.astype(np.uint8)])
    im=Image.fromarray(rgba).resize((S,S),Image.LANCZOS);return im
for n,K in [(47,K1),(46,K2)]:
    img=cv2.imread(P(n))
    for i,k in enumerate(K):
        if k=='_':continue
        r,c=divmod(i,4);tiles.append(cell(img,r,c));names.append(k)
COLS=8;rows=(len(tiles)+COLS-1)//COLS
at=Image.new('RGBA',(COLS*S,rows*S),(0,0,0,0))
for i,t in enumerate(tiles):at.paste(t,((i%COLS)*S,(i//COLS)*S))
at.save('mk_atlas.webp',quality=86,method=6)
bgp=Image.new('RGBA',at.size,(236,226,200,255));bgp.alpha_composite(at);bgp.convert('RGB').resize((at.width//2,at.height//2)).save('/tmp/fx/mk_sheet.png')
print(names,len(names),at.size)
import json;json.dump(names,open('mk_names.json','w'))
