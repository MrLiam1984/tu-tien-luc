import cv2,glob,numpy as np
from PIL import Image
names={53:'kham_lair',54:'kham_portal',55:'kham_map',56:'kham_city',57:'kham_wild',58:'kham_hub'}
for n,k in names.items():
    f=glob.glob('/tmp/claude-chrome-screenshots-8yJPRW/screenshot-*-%d.png'%n)[0]
    im=cv2.imread(f)
    g=cv2.cvtColor(im,cv2.COLOR_BGR2GRAY).astype(np.float32)
    med=cv2.medianBlur(im,31); mg=cv2.cvtColor(med,cv2.COLOR_BGR2GRAY).astype(np.float32)
    cx,cy=1005,531
    mask=np.zeros(g.shape,np.uint8)
    cv2.fillConvexPoly(mask,np.array([[cx,cy-27],[cx+23,cy],[cx,cy+27],[cx-23,cy]]),255)
    mask=cv2.dilate(mask,np.ones((5,5),np.uint8))
    out=cv2.inpaint(im,mask,5,cv2.INPAINT_TELEA)
    Image.fromarray(cv2.cvtColor(out,cv2.COLOR_BGR2RGB)).save('/home/claude/site/doll/%s.webp'%k,quality=85)
    print(k,cx,cy)
