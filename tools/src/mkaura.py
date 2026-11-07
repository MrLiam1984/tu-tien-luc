# Tách hào quang (không có người) khỏi nền magenta -> lớp fxb dùng chung nam/nữ. Dùng: python3 mkaura.py
import json,glob,os,sys
import numpy as np,cv2
from PIL import Image
S='/tmp/claude-chrome-screenshots-X8w7Y2/'
def f(n):return glob.glob(S+f'*-{n}.png')[0]
A={140:'tulinh',141:'tinhha',142:'thaicuc',143:'hukhong',144:'thienco',145:'luanhoi',146:'yeu',147:'ho',148:'dan',149:'kiem',150:'huyet',151:'mama',152:'phuong',153:'nghich',154:'hondon',155:'lei',156:'tukhi',157:'kimquang'}
NAME=json.load(open('/home/claude/gen/aura_names.json'))
OUT='/home/claude/doll/out_B1'
os.makedirs('/home/claude/gen/aura',exist_ok=True)
newitems=[]
for n,k in A.items():
    im=Image.open(f(n)).convert('RGB').resize((896,1200),Image.LANCZOS);im.save(f'/home/claude/gen/aura/{k}.png')
    a=np.asarray(im).astype(np.float32)
    e=np.concatenate([a[:30].reshape(-1,3),a[-30:].reshape(-1,3),a[:,:30].reshape(-1,3),a[:,-30:].reshape(-1,3)])
    q=(e//6).astype(int);keys,cnt=np.unique(q,axis=0,return_counts=True);bg=e[(q==keys[cnt.argmax()]).all(1)].mean(0)
    # xoá ngôi sao watermark (vùng ~ (796,1100) r<=34)
    yy,xx=np.mgrid[0:1200,0:896];disc=(((xx-796)**2+(yy-1100)**2)<=34**2)
    d0=np.sqrt(((a-bg)**2).sum(2))
    R,G,B=a[...,0],a[...,1],a[...,2]
    m=(disc&(d0>12)&(R>=185)&(B>=160)&(G>=30)&(G<=170)).astype(np.uint8)*255
    m=cv2.dilate(m,np.ones((3,3),np.uint8),iterations=2)
    a8=cv2.inpaint(np.ascontiguousarray(a.astype(np.uint8)),m,6,cv2.INPAINT_TELEA)
    a=a8.astype(np.float32)
    d=np.sqrt(((a-bg)**2).sum(2))
    al=np.clip((d-26)/(95-26),0,1)
    mg=np.clip((np.minimum(a[...,0],a[...,2])-a[...,1]-150)/60,0,1)
    al=al*(1-0.85*mg);al=cv2.GaussianBlur(al,(0,0),0.6)
    ac=np.maximum(al,1e-3)[...,None]
    col=np.clip((a-(1-ac)*bg)/ac,0,255)
    img=Image.fromarray(np.dstack([col,al*255]).astype(np.uint8),'RGBA')
    bb=img.getchannel('A').point(lambda v:255 if v>10 else 0).getbbox()
    c=img.crop(bb);fn=f'fxb_{k}.webp';c.save(f'{OUT}/{fn}','WEBP',quality=88,method=6)
    newitems.append({'kind':'fxb','id':k,'name':NAME[k],'file':fn,'x':bb[0],'y':bb[1],'w':c.width,'h':c.height,'tags':[]})
    print(k,[int(x) for x in bg],bb,os.path.getsize(f'{OUT}/{fn}')//1024,'KB')
for mf in ['/home/claude/doll/out_B1/nu1.json','/home/claude/doll/out_Nam/nam1.json']:
    m=json.load(open(mf));ids={i['id'] for i in newitems}
    m['items']=[i for i in m['items'] if not(i['kind']=='fxb' and i['id'] in ids)]+newitems
    json.dump(m,open(mf,'w'),ensure_ascii=False)
