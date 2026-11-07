# Tách lớp hiệu ứng (rồng, sen, hào quang, khói mực) khỏi nền magenta, gộp vào nu1.json. Chạy SAU build_doll.py
import json,glob,os,sys
import numpy as np,cv2
from PIL import Image
D='/tmp/claude-chrome-screenshots-h5LuDQ/'
OUT='out_B1'
def shot(n):return Image.open(glob.glob(D+f'*-{n}.png')[0]).convert('RGB')
FX=[('fxb','rong','Rồng vàng bên mình',26,27,['noble','high','evil']),
    ('fxb','sen','Liên hoa sau lưng',28,29,['good','immortal','gentle']),
    ('fxb','haoquang','Hào quang tiên nhân',30,31,['immortal','high','good']),
    ('fxf','muc','Khói mực kiếm khí',32,33,['evil','brave'])]
def inpaint_star(a):
    r=a[1030:1170,730:870].astype(np.uint8)
    m=((r[...,0]>225)&(r[...,1]>140)&(r[...,2]>190)).astype(np.uint8)*255
    m=cv2.dilate(m,np.ones((5,5),np.uint8),iterations=2)
    a[1030:1170,730:870]=cv2.inpaint(r,m,5,cv2.INPAINT_TELEA)
    return a
man=json.load(open(f'{OUT}/nu1.json'))
man['items']=[i for i in man['items'] if i['kind'] not in('fxb','fxf')]
for kind,id,name,t,b,tags in FX:
    im=Image.new('RGB',(896,1200));im.paste(shot(t),(0,0));im.paste(shot(b),(0,600))
    a=np.asarray(im).astype(np.float32)
    e=np.concatenate([a[:30].reshape(-1,3),a[-30:].reshape(-1,3),a[:,:30].reshape(-1,3),a[:,-30:].reshape(-1,3)])
    q=(e//6).astype(int);keys,cnt=np.unique(q,axis=0,return_counts=True);bg=e[(q==keys[cnt.argmax()]).all(1)].mean(0)
    from build_doll import star_fix
    a=star_fix(a,bg)
    if id in('muc','sen'):
        yy,xx=np.mgrid[0:1200,0:896];m=((((xx-795)**2+(yy-1100)**2)<=27**2)*255).astype(np.uint8)
        a=cv2.inpaint(np.ascontiguousarray(a),m,7,cv2.INPAINT_TELEA)
    a=a.astype(np.float32)
    d=np.sqrt(((a-bg)**2).sum(2))
    al=np.clip((d-16)/(80-16),0,1)
    al=cv2.GaussianBlur(al,(0,0),0.6)
    ac=np.maximum(al,1e-3)[...,None]
    col=np.clip((a-(1-ac)*bg)/ac,0,255)
    rgba=np.dstack([col,al*255]).astype(np.uint8)
    img=Image.fromarray(rgba,'RGBA')
    bb=img.getchannel('A').point(lambda v:255 if v>10 else 0).getbbox()
    c=img.crop(bb);fn=f'nu1_{kind}_{id}.webp';c.save(f'{OUT}/{fn}','WEBP',quality=88,method=6)
    man['items'].append({'kind':kind,'id':id,'name':name,'file':fn,'x':bb[0],'y':bb[1],'w':c.width,'h':c.height,'tags':tags})
    print(id,[int(x) for x in bg],bb,os.path.getsize(f'{OUT}/{fn}')//1024,'KB')
json.dump(man,open(f'{OUT}/nu1.json','w'),ensure_ascii=False)
