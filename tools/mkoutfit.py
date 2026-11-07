# Đưa ảnh trang phục (ảnh đã chụp từ Flow, nền magenta) thành lớp 'outfit' trong manifest.
# Dùng: python3 mkoutfit.py <pose:nu1|nam1> <thư mục ảnh> <plan.json>   (plan: {id:{name,tags}})
import sys,json,os
sys.path.insert(0,'/home/claude/doll')
import numpy as np
from PIL import Image
import build_doll as B
pose,src,plan=sys.argv[1],sys.argv[2],json.load(open(sys.argv[3]))
OUT={'nu1':'/home/claude/doll/out_B1','nam1':'/home/claude/doll/out_Nam'}[pose]
BASEPNG={'nu1':'/home/claude/pd/NU_B1.png','nam1':None}[pose]
man=json.load(open(f'{OUT}/{pose}.json'))
base=np.asarray(Image.open(BASEPNG).convert('RGB')).copy() if BASEPNG else None
HEAD_Y=int(os.environ.get('HEAD_Y','248'))
for k,v in plan.items():
    p=f'{src}/{k}.png'
    if not os.path.exists(p):print('thiếu',p);continue
    im=np.asarray(Image.open(p).convert('RGB')).copy()
    e=np.concatenate([im[10:40,:].reshape(-1,3),im[:,10:40].reshape(-1,3),im[:,-40:-10].reshape(-1,3)]);bgc=np.median(e,0).astype(np.uint8)
    for sl in (np.s_[:6,:],np.s_[-6:,:],np.s_[:,:6],np.s_[:,-6:]):im[sl]=bgc   # bỏ viền chụp màn hình
    if base is not None:im[:HEAD_Y]=base[:HEAD_Y]          # đầu/tóc luôn lấy từ nền gốc
    bk,al=B.key(Image.fromarray(im))
    img=B.rgba(bk,al);c,bb=B.crop(img)
    fn=f'{pose}_outfit_{k}.webp';B.save(c,os.path.join(OUT,fn),q=90)
    it={'kind':'outfit','id':k,'name':v['name'],'file':fn,'x':bb[0],'y':bb[1],'w':c.width,'h':c.height,'tags':v.get('tags',[])}
    man['items']=[i for i in man['items'] if not(i['kind']=='outfit' and i['id']==k)]+[it]
    print('ok',k,bb)
json.dump(man,open(f'{OUT}/{pose}.json','w'),ensure_ascii=False)
