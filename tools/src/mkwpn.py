import sys,glob,numpy as np
from PIL import Image
def key(src,dst,H=900,lo=45,hi=120):
    a=np.array(Image.open(src).convert('RGB')).astype(np.float32)
    h,w=a.shape[:2]
    sub=a[int(h*.89):,int(w*.80):]; bg0=a[8:40,8:40].reshape(-1,3).mean(0)
    dd=np.sqrt(((sub-bg0)**2).sum(-1));sub[dd<120]=bg0;a[int(h*.89):,int(w*.80):]=sub   # ngôi sao watermark
    bg=np.median(a[8:60,8:60].reshape(-1,3),axis=0)
    d=np.sqrt(((a-bg)**2).sum(-1))
    al=np.clip((d-lo)/(hi-lo),0,1)
    R,G,B=a[...,0],a[...,1],a[...,2];m=np.minimum(R,B)-G
    bgm=min(bg[0],bg[2])-bg[1]
    k=np.clip(m-max(0,bgm*0.0),0,None)*0.0
    over=(al>0)&(al<1)
    R2=np.where(over,np.clip(R-(R-bg[0]*0.0)*0.0,0,255),R)
    out=np.dstack([R,G,B,al*255]).astype(np.uint8)
    img=Image.fromarray(out,'RGBA')
    bb=img.getchannel('A').point(lambda v:255 if v>50 else 0).getbbox();img=img.crop(bb)
    s=H/img.height;img=img.resize((max(1,int(img.width*s)),H),Image.LANCZOS)
    img.save(dst,'WEBP',quality=86,method=6);return img.size
