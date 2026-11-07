import glob,re,cv2,numpy as np,json,sys
from PIL import Image
d='/tmp/claude-chrome-screenshots-HAUwYM/'
by={}
for f in glob.glob(d+'screenshot-*.png'):
    m=re.search(r'-(\d+)-(\d+)\.png$',f)
    if m:by[int(m.group(2))]=f
sheets=[(23,14,['sword','hat','robe','armor','cloak','bracers','belt','boots','necklace','ring','jade','saber','spear','fan','staff','bow']),
 (22,10,['bottle','pill_red','pill_gold','talis_gold','talis_blue','plate','furnace','orb','map','book','slip','token','stone','shard','gourd','tea']),
 (21,10,['herb','lingzhi','ginseng','ore','crystal','meteor','core','fang','pelt','bone','pearl_kim','pearl_moc','pearl_thuy','pearl_hoa','pearl_tho','pearl_loi'])]
S=128;names=[];tiles=[]
for n,inset,nm in sheets:
    img=cv2.imread(by[n]);H,W=img.shape[:2]
    if n in (21,22):
        m=np.zeros(img.shape[:2],np.uint8);cv2.rectangle(m,(262,90),(300,128),255,-1);img=cv2.inpaint(img,m,4,cv2.INPAINT_TELEA)
    cw=W/4
    for i,name in enumerate(nm):
        r,c=divmod(i,4);x0=int(c*cw)+inset;y0=int(r*cw)+inset;x1=int((c+1)*cw)-inset;y1=int((r+1)*cw)-inset
        cell=img[y0:y1,x0:x1].copy();cf=cell.astype(np.float32)
        ring=np.concatenate([cf[:4].reshape(-1,3),cf[-4:].reshape(-1,3),cf[:,:4].reshape(-1,3),cf[:,-4:].reshape(-1,3)])
        bg=np.median(ring,0);dist=np.sqrt(((cf-bg)**2).sum(2))
        hsv=cv2.cvtColor(cell,cv2.COLOR_BGR2HSV)
        mag=(hsv[...,0]>=140)&(hsv[...,0]<=168)&(hsv[...,1]>24)&(hsv[...,2]>110) if n!=23 else np.zeros(dist.shape,bool)
        fg=((dist>34)&~mag).astype(np.uint8)
        fg=cv2.morphologyEx(fg,cv2.MORPH_OPEN,np.ones((2,2),np.uint8))
        inv=(1-fg).astype(np.uint8);nl,lab=cv2.connectedComponents(inv,connectivity=4)
        border=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
        bgm=np.isin(lab,list(border))
        for k in range(1,nl):  # enclosed holes that look like background
            if k in border:continue
            mk=lab==k
            if mk.sum()>25 and (dist[mk]<(14 if n!=23 else 16)).mean()>(0.9 if n!=23 else 0.75) or (mag[mk].mean()>0.8 and mk.sum()>25):bgm|=mk
        a=np.where(bgm,0.0,1.0).astype(np.float32)
        edge=cv2.dilate(bgm.astype(np.uint8),np.ones((3,3),np.uint8)).astype(bool)&~bgm
        a=np.where(edge,np.clip((dist-14)/40,0.25,1),a)
        a=cv2.GaussianBlur(a,(0,0),0.6)
        # keep the largest connected foreground blob (+ nearby pieces)
        m8=(a>0.3).astype(np.uint8);nl2,lab2,st,_=cv2.connectedComponentsWithStats(m8,connectivity=8)
        if nl2>1:
            keep=np.zeros_like(m8);big=max(st[1:,4])
            for k in range(1,nl2):
                if st[k,4]>=0.04*big:keep[lab2==k]=1
            a=a*cv2.dilate(keep,np.ones((3,3),np.uint8))
        al=np.clip(a,0.001,1)[...,None]
        col=np.clip((cf-(1-al)*bg)/al,0,255)
        rgba=np.dstack([col,a*255]).astype(np.uint8)
        ys,xs=np.where(a>0.1)
        bb=rgba[ys.min():ys.max()+1,xs.min():xs.max()+1];h,w=bb.shape[:2];sc=(S-8)/max(h,w)
        bb=cv2.resize(bb,(max(1,int(w*sc)),max(1,int(h*sc))),interpolation=cv2.INTER_AREA)
        t=np.zeros((S,S,4),np.uint8);oy=(S-bb.shape[0])//2;ox=(S-bb.shape[1])//2;t[oy:oy+bb.shape[0],ox:ox+bb.shape[1]]=bb
        tiles.append(t);names.append(name)
cols=8;rows=(len(tiles)+cols-1)//cols
atlas=np.zeros((rows*S,cols*S,4),np.uint8)
for i,t in enumerate(tiles):
    r,c=divmod(i,cols);atlas[r*S:(r+1)*S,c*S:(c+1)*S]=t
rgb=atlas[...,[2,1,0,3]]
Image.fromarray(rgb,'RGBA').save('site/doll/ic_atlas.webp','WEBP',quality=88,method=6)
json.dump({'cols':cols,'S':S,'names':names},open('ic_manifest.json','w'))
bgp=Image.new('RGBA',(cols*S,rows*S),(232,224,200,255));bgp.alpha_composite(Image.fromarray(rgb,'RGBA'));bgp.convert('RGB').save('ic_prev.png')
