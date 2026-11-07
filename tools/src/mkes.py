import cv2,glob,numpy as np
from PIL import Image
N=['huyetma','anvo','diettoc','tamsu','ketlieu','thiendao','ngaymua','como','ondich','quithi','tolinh','thuyendam','xactusi','baytran','tiensu','tieuthegioi','thiencoc','vandao','thoroi','kylan','linhmach','kiemlinh','kentrom','giaolong','tienphu','treem','gaicon','caylei','buthu','huyette','honma','thuvuong','kiemkhach','lodan','hoyeu','thienthach','anmay']
FR={0,2,5,7,8,9,21,22,29,31,34}
def path(i):
    if i<25: return glob.glob('/tmp/claude-chrome-screenshots-8yJPRW/screenshot-*-%d.png'%(91+i))[0]
    return glob.glob('/tmp/claude-chrome-screenshots-nTg1wA/screenshot-*-%d.png'%(i-25))[0]
for i,n in enumerate(N):
    im=cv2.imread(path(i))
    mask=np.zeros(im.shape[:2],np.uint8)
    cx,cy=1005,531
    cv2.fillConvexPoly(mask,np.array([[cx,cy-28],[cx+24,cy],[cx,cy+28],[cx-24,cy]]),255)
    mask=cv2.dilate(mask,np.ones((5,5),np.uint8))
    if i in FR:
        sub=im[0:607,0:1080]
    out=cv2.inpaint(im,mask,5,cv2.INPAINT_TELEA)
    if i in FR: out=out[32:582,50:1030]; out=cv2.resize(out,(1080,607),interpolation=cv2.INTER_CUBIC)
    Image.fromarray(cv2.cvtColor(out,cv2.COLOR_BGR2RGB)).save('/home/claude/site/doll/es_%s.webp'%n,quality=84,method=6)
print(len(N))
