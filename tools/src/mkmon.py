import sys,numpy as np
from PIL import Image
def key(src,dst,H=640,lo=60,hi=150):
    im=Image.open(src).convert('RGB');a=np.array(im).astype(np.float32)
    # xoá ngôi sao watermark góc phải dưới
    sub=a[900:1060,900:1060];msk=(sub[...,1]>140)&(sub[...,0]>200);sub[msk]=a[20,20];a[900:1060,900:1060]=sub
    bg=np.median(a[5:40,5:40].reshape(-1,3),axis=0)
    d=np.sqrt(((a-bg)**2).sum(-1))
    R,G,B=a[...,0],a[...,1],a[...,2]
    m=np.minimum(R,B)-G
    # alpha: xa nền thì đặc; gần nền thì trong
    al=np.clip((d-lo)/(hi-lo),0,1)
    # vùng còn hồng (m>0) mà không quá xa nền: giảm thêm
    al=np.minimum(al,1-np.clip((m-110)/60,0,1)*(d<170))
    # despill
    k=np.clip(m,0,None)*0.8*(al>0)
    R2=np.clip(R-k,0,255);B2=np.clip(B-k,0,255)
    out=np.dstack([R2,G,B2,al*255]).astype(np.uint8)
    img=Image.fromarray(out,'RGBA')
    bb=img.getchannel('A').point(lambda v:255 if v>50 else 0).getbbox()
    img=img.crop(bb)
    w=int(img.width*H/img.height)
    img=img.resize((w,H),Image.LANCZOS)
    img.save(dst,'WEBP',quality=86,method=6)
    return img.size
if __name__=='__main__':print(key(sys.argv[1],sys.argv[2]))
