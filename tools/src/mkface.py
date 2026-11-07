# Tạo lớp mặt nam từ ảnh đầy đủ đã chụp. Dùng: python3 mkface.py <pose> <thư mục ảnh> <plan.json>
import sys,json,os
sys.path.insert(0,'/home/claude/doll')
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
import build_doll as B
pose,src,plan=sys.argv[1],sys.argv[2],json.load(open(sys.argv[3]))
OUT='/home/claude/doll/out_Nam'
cx,cy,rx,ry=[450,205,46,64]
man=json.load(open(f'{OUT}/{pose}.json'))
B.ROBUST=True
yy,xx=np.mgrid[0:B.H,0:B.W]
el=(((xx-cx)/rx)**2+((yy-cy)/ry)**2)<=1
al0=ndi.gaussian_filter(el.astype(np.float32),2.5)
for k,v in plan.items():
    p=f'{src}/{k}.png'
    f=Image.open(p).convert('RGB');fa=np.asarray(f)
    fk,fal=B.key(f);al=al0*np.clip(fal,0,1)
    c,bb=B.crop(B.rgba(fa,al))
    fn=f'{pose}_face_{k}.webp';B.save(c,os.path.join(OUT,fn))
    it={'kind':'face','id':k,'name':v['name'],'file':fn,'x':bb[0],'y':bb[1],'w':c.width,'h':c.height,'tags':v.get('tags',[])}
    man['items']=[i for i in man['items'] if not(i['kind']=='face' and i['id']==k)]+[it]
    print('ok',k,bb,c.size)
json.dump(man,open(f'{OUT}/{pose}.json','w'),ensure_ascii=False)
