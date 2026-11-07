import cv2,numpy as np,glob,sys
from PIL import Image
D='/tmp/claude-chrome-screenshots-nTg1wA/'
def P(n):return glob.glob(D+'screenshot-*-%d.png'%n)[0]
M=dict(a.split(':') for a in sys.argv[1:])
for k,v in M.items():
    a,b=map(int,v.split(','))
    t1=cv2.imread(P(a));t2=cv2.imread(P(b))
    H=min(t1.shape[0],t2.shape[0],768)
    can=np.zeros((H,1376,3),np.uint8);can[:,296:296+t2.shape[1]]=t2[:H,:1080];can[:,:1080]=t1[:H,:1080]
    # xóa dấu ✦ góc dưới phải
    m=np.zeros(can.shape[:2],np.uint8);cv2.circle(m,(1281,665),24,255,-1);can=cv2.inpaint(can,m,6,cv2.INPAINT_TELEA)
    can=can[12:H-10,24:1352]
    im=Image.fromarray(can[...,::-1]).resize((1600,1000),Image.LANCZOS)
    im.save(f'cm_{k}.webp',quality=80,method=6);im.resize((480,300)).save(f'/tmp/fx/cm_{k}.png')
    print(k,im.size)
