# Tách lớp nhân vật nhiều lớp (paper-doll) từ ảnh Flow đã chụp. Dùng: python3 build_doll.py manifest.json outdir
import sys,json,glob,os
import numpy as np
import cv2
from PIL import Image,ImageFilter
from scipy import ndimage as ndi
D='/tmp/claude-chrome-screenshots-6iC0Nb/'
W,H=896,1200
ROBUST=False
def shot(n):
    p=glob.glob(D+f'*-{n}.png')
    return Image.open(p[0]).convert('RGB') if p else None
BASE=None
def load(spec):
    """spec: đường dẫn ảnh | {"t":số ảnh chụp nửa trên,"b":nửa dưới hoặc null (lấy từ nền)}"""
    if isinstance(spec,str):
        im=Image.open(spec).convert('RGB')
        if im.height==600 and BASE is not None:
            f=BASE.copy();f.paste(im,(0,0));return f
        return im
    im=BASE.copy() if BASE is not None else Image.new('RGB',(W,H))
    im.paste(shot(spec['t']),(0,0))
    if spec.get('b') is not None:im.paste(shot(spec['b']),(0,600))
    return im
def bgcolor(a):
    # nền magenta gần phẳng: ước lượng từ các mép
    e=np.concatenate([a[:40,:].reshape(-1,3),a[:, :40].reshape(-1,3),a[:,-40:].reshape(-1,3)])
    return np.median(e,0)

def star_fix(a,bg):
    """xóa ngôi sao watermark của Flow (hồng nhạt sáng) ở góc dưới phải bằng inpaint"""
    a=np.ascontiguousarray(a.astype(np.uint8));y0,y1,x0,x1=1050,1150,745,845
    r=a[y0:y1,x0:x1];yy,xx=np.mgrid[y0:y1,x0:x1]
    disc=((xx-795)**2+(yy-1100)**2)<=30**2
    R,G,B=[r[...,k].astype(int) for k in range(3)]
    m=(disc&(R>135)&(G>100)&(B>120)).astype(np.uint8)*255
    m=cv2.dilate(m,np.ones((3,3),np.uint8),iterations=3)
    a[y0:y1,x0:x1]=cv2.inpaint(r.copy(),m,6,cv2.INPAINT_TELEA);return a
def key(img,bg=None):
    a=np.asarray(img).astype(np.float32)
    bg=bgcolor(a) if bg is None else bg
    if a.shape[0]>=1170:a=star_fix(a,bg).astype(np.float32)
    d=np.sqrt(((a-bg)**2).sum(2))
    al=np.clip((d-46)/(105-46),0,1)
    if ROBUST:
        lab,n=ndi.label(d<82)
        sz=ndi.sum(np.ones_like(d),lab,range(1,n+1))
        edge_l=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
        keep=[i+1 for i in range(n) if (i+1) in edge_l or sz[i]>400]
        bgc=np.isin(lab,keep)
        band=ndi.binary_dilation(bgc,iterations=3)
        al=np.where(band,al,1.0).astype(np.float32)
    # co nhẹ 1px để bỏ viền hồng, giữ nét mảnh
    al=0.5*al+0.5*ndi.minimum_filter(al,size=3)
    interior=al>0.97
    out=a.copy()
    edge=(~interior)
    idx=ndi.distance_transform_edt(edge,return_distances=False,return_indices=True)
    near=a[idx[0],idx[1]]
    # pixel viền lấy màu của pixel đặc gần nhất (khử hoàn toàn màu nền)
    out[edge]=near[edge]
    return np.clip(out,0,255).astype(np.uint8),al
def rgba(rgb,al):
    return Image.fromarray(np.dstack([rgb,(al*255).astype(np.uint8)]),'RGBA')
def crop(im):
    bb=im.getchannel('A').point(lambda v:255 if v>8 else 0).getbbox()
    return (im.crop(bb),bb) if bb else (None,None)
def diffmask(a,b,thr=60,dil=2,box=None):
    d=np.abs(a.astype(int)-b.astype(int)).sum(2)
    m=d>thr
    if box:
        z=np.zeros_like(m);x0,y0,x1,y1=box;z[y0:y1,x0:x1]=m[y0:y1,x0:x1];m=z
    m[1040:1160,740:860]=False
    m=ndi.binary_opening(m,iterations=1)
    m=ndi.binary_closing(m,iterations=3)
    m=ndi.binary_fill_holes(m)
    m=ndi.binary_dilation(m,iterations=dil)
    return m
def save(im,path,q=90):
    im.save(path,'WEBP',quality=q,method=6)
def main(mf,out):
    M=json.load(open(mf));os.makedirs(out,exist_ok=True)
    global BASE,ROBUST
    ROBUST=bool(M.get('robust'))
    base=load(M['base']);BASE=base;A0=np.asarray(base)
    bk,bal=key(base)
    man={'W':W,'H':H,'pose':{},'items':[]}
    # lớp nền (thân + đầu cơ sở, trang phục trắng)
    def put(kind,id,name,im,bb,extra=None):
        fn=f'{M["pose"]}_{kind}_{id}.webp';save(im,os.path.join(out,fn))
        it={'kind':kind,'id':id,'name':name,'file':fn,'x':bb[0],'y':bb[1],'w':im.width,'h':im.height}
        if extra:it.update(extra)
        man['items'].append(it);return it
    img=rgba(bk,bal);c,bb=crop(img);put('outfit','base',M.get('base_name','Áo trắng'),c,bb,{'tags':M.get('base_tags',[])})
    for k,v in M.get('outfits',{}).items():
        o=load(v['src']);ok,oal=key(o);c,bb=crop(rgba(ok,oal));put('outfit',k,v['name'],c,bb,{'tags':v.get('tags',[])})
    box_face=tuple(M.get('face_box',[380,110,520,270]))
    for k,v in M.get('faces',{}).items():
        f=load(v['src']);fa=np.asarray(f)
        cx,cy,rx,ry=M.get('face_ell',[451,196,42,58])
        yy,xx=np.mgrid[0:H,0:W]
        el=(((xx-cx)/rx)**2+((yy-cy)/ry)**2)<=1
        al=ndi.gaussian_filter(el.astype(np.float32),2.5)
        if ROBUST:
            fk,fal=key(f);al=al*np.clip(fal*1.0,0,1)
        img=rgba(fa,al);c,bb=crop(img);put('face',k,v['name'],c,bb,{'tags':v.get('tags',[])})
    for k,v in M.get('hairs',{}).items():
        h=load(v['src']);ha=np.asarray(h)
        if M.get('hair_raw'):
            m=(np.abs(ha.astype(int)-A0.astype(int)).sum(2)>M.get('hair_thr',60));m[1040:1160,740:860]=False
            m=ndi.binary_opening(m,iterations=1);m=ndi.binary_dilation(m,iterations=M.get('hair_dil',1))
        else:m=diffmask(ha,A0,thr=M.get('hair_thr',60),dil=M.get('hair_dil',3))
        # bỏ vùng mặt ra khỏi lớp tóc (mặt do lớp mặt đảm nhiệm)
        hk,hal=key(h)
        add=m&(hal>0.05)
        # vùng bị xóa: nền gốc có hình nhưng tóc mới là nền
        er=m&(bal>0.3)&(hal<0.2)
        al=np.where(add,hal,0).astype(np.float32)
        al=np.maximum(al,ndi.binary_dilation(add&(hal>0.9),iterations=0)*0.0)
        if v.get('color'):
            hc=np.array(v['color'],np.float32);ha_f=ha.astype(np.float32);A0f=A0.astype(np.float32)
            db=np.sqrt(((ha_f-A0f)**2).sum(2));dh=np.sqrt(((hc-A0f)**2).sum(2))
            a2=np.clip(db/np.maximum(dh,1)*1.15,0,1);a2=np.where(m,a2,0)
            a2=np.where(a2<0.12,0,a2)
            # giữ nét tóc đặc từ ảnh gốc; viền thì dùng màu tóc
            hk=np.where((a2<0.85)[...,None],hc,hk).astype(np.uint8)
            al=np.maximum(np.where(add,hal,0)*(hal>0.9)*(a2>0.85),a2*(hal>0.05)).astype(np.float32)
        img=rgba(hk,al);c,bb=crop(img)
        ex={'tags':v.get('tags',[])}
        if er.any():
            ei=Image.fromarray((ndi.binary_dilation(er,iterations=5)*255).astype(np.uint8),'L')
            ec,ebb=crop(Image.merge('RGBA',[ei,ei,ei,ei]))
            if ec is not None:
                fn=f'{M["pose"]}_hairer_{k}.webp';ec.save(os.path.join(out,fn.replace('.webp','.png')),optimize=True)
                ex.update({'er':fn.replace('.webp','.png'),'ex':ebb[0],'ey':ebb[1]})
        if c is not None:put('hair',k,v['name'],c,bb,ex)
    json.dump(man,open(os.path.join(out,M['pose']+'.json'),'w'),ensure_ascii=False)
    tot=sum(os.path.getsize(os.path.join(out,f)) for f in os.listdir(out))
    print('items',len(man['items']),'bytes',tot)
if __name__=='__main__':main(sys.argv[1],sys.argv[2])
