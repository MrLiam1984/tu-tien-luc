import cv2,numpy as np,json,glob
from PIL import Image
D='/tmp/claude-chrome-screenshots-nTg1wA/'
def P(n):return glob.glob(D+'screenshot-*-%d.png'%n)[0]
SH={
'A':(12,"Hồi khí đan|Phá Khóa đan|Ngộ Đạo Đan|Tục Mạch Đan|Đại Hồi Nguyên đan|Đột phá đan|Tẩy Tủy đan|Diên Thọ đan|Trúc Cơ Đan|Kết Tinh Đan|Ngưng Kim Đan|Cụ Linh Đan|Hóa Anh Đan|Hóa Thần Đan|Vũ Hóa Đan|Đăng Tiên Đan"),
'B':(24,"Lang Huyết|Mãng Huyết|Giao Huyết|Hổ Vương Huyết|Huyền Vũ Huyết|Bạch Trạch Huyết|Kỳ Lân Huyết|Phượng Huyết|Định Tâm Đan|Giải Độc đan|Nanh thú|Lang Bì|Huyền Quy Giáp|Kỳ Lân Giác|Hổ Cốt|Ưng Vũ"),
'C':(23,"Phượng Linh|Giao Lân|Long Cốt|Hàn Thiết|Thiết Tinh|Xích Đồng|Tử Kim|Huyền Thiết|Thiên Ngoại Vẫn Thiết|Tinh Ngân|Long Văn Thiết|Hỗn Độn Thạch|Hoàng Linh Sa|Hắc Tinh Sa|Xích Viêm Sa|Băng Phách Sa"),
'D':(18,"Tinh Thần Sa|Thái Dương Kim Sa|Thái Âm Ngân Sa|Hư Không Tinh Sa|Thanh Linh Ngọc|Bạch Linh Ngọc|Huyết Linh Ngọc|Mặc Linh Ngọc|Tử Tinh Ngọc|Côn Luân Ngọc|Hòa Thị Bích|Ngũ Sắc Thạch|Hỗn Nguyên Ngọc|Ngọc bội cũ|Ngọc giản di ngôn|Bản đồ cổ"),
'E':(14,"Sơn Tuyền Thủy|Vô Căn Thủy|Huyền Âm Thủy|Thiên Nhất Chân Thủy|Cửu U Hàn Tuyền|Bích Lạc Linh Dịch|Tam Quang Thần Thủy|Nhược Thủy Tinh|Hỗn Độn Nguyên Dịch|Linh Chi|Huyết Sâm|Băng Tâm Thảo|Tử Linh Chi|Hỏa Long Quả|Cửu Diệp Liên|Tuyết Liên Ngàn Năm"),
'F':(13,"Bất Tử Thảo|Thiên Đạo Quả|Thanh Mộc|Thiết Hoa Mộc|Xích Tùng Chi|Âm Trầm Mộc|Long Huyết Mộc|Phù Tang Chi|Kiến Mộc Chi|Ngô Đồng Tâm|Thế Giới Thụ Diệp|Tránh Lôi Châu|Lôi Báo Gân|Lôi Văn Sa|Thanh Đồng Đan Lô|Tử Kim Đan Lô"),
'G':(17,"Cửu Long Đan Lô|Thần Hành Phù|Liệt Hỏa Phù|Ngũ Lôi Phù|Độn Không Phù|Thiên Lôi Phù|Hộ Mệnh Phù|Tĩnh Tâm Phù|Kim Cang Phù|Thái Thượng Hộ Mệnh Phù|Thiên Cơ Bàn|Tụ Linh Trận Bàn|Hộ Thân Trận Bàn|Mê Tung Trận|Bế Quan Trận Bàn|Chu Thiên Tinh Đấu Trận"),
'H':(16,"Thế Kiếp Khôi Lỗi|Định Nhạc Kỳ|Quỷ Cốc lệnh bài|Mảnh ấn phong|Yêu đan|Yêu đan nhất giai|Yêu đan nhị giai|Yêu đan tam giai|Yêu đan tứ giai|Yêu đan ngũ giai|Yêu đan lục giai|Yêu đan thất giai|Yêu đan bát giai|Yêu đan cửu giai|Linh châu hoàn mỹ|Linh châu vỡ")}
S=128;COLS=16
names=[];tiles=[]
def cell(img,r,c,ins=10):
    H,W=img.shape[:2];cw=W/4
    x0=int(c*cw+ins);y0=int(r*cw+ins);x1=int((c+1)*cw-ins);y1=int((r+1)*cw-ins)
    cell=img[y0:y1,x0:x1].copy()
    # nền: lấy màu trung vị 6px viền trong cùng
    cf=cell.astype(np.float32)
    ring=np.concatenate([cf[:5].reshape(-1,3),cf[-5:].reshape(-1,3),cf[:,:5].reshape(-1,3),cf[:,-5:].reshape(-1,3)])
    bg=np.median(ring,0);dist=np.sqrt(((cf-bg)**2).sum(2))
    fg=(dist>26).astype(np.uint8)
    fg=cv2.morphologyEx(fg,cv2.MORPH_OPEN,np.ones((3,3),np.uint8))
    inv=(1-fg).astype(np.uint8);nl,lab=cv2.connectedComponents(inv,connectivity=4)
    border=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
    bgm=np.isin(lab,list(border))
    alpha=np.where(bgm,0,255).astype(np.uint8)
    # bỏ các mảnh nhỏ sát viền (khung ô còn sót)
    nl2,lab2,st,_=cv2.connectedComponentsWithStats((alpha>0).astype(np.uint8),connectivity=8)
    keep=np.zeros_like(alpha)
    Hc,Wc=cell.shape[:2];big=max([st[k][4] for k in range(1,nl2)] or [1])
    for k in range(1,nl2):
        x,y,w,h,a=st[k]
        if a<60:continue
        cx,cy=x+w/2,y+h/2
        touch=x<=1 or y<=1 or x+w>=Wc-1 or y+h>=Hc-1
        if a<big*.3 and (touch or not(.15*Wc<cx<.85*Wc and .15*Hc<cy<.85*Hc)):continue
        if touch and a<big*.9:continue
        keep[lab2==k]=255
    alpha=cv2.GaussianBlur(keep,(3,3),0)
    ys,xs=np.where(alpha>40)
    if len(xs)==0:ys,xs=np.array([0,cell.shape[0]-1]),np.array([0,cell.shape[1]-1])
    x0,x1,y0,y1=xs.min(),xs.max()+1,ys.min(),ys.max()+1
    rgba=np.dstack([cell[...,::-1],alpha])[y0:y1,x0:x1]
    h,w=rgba.shape[:2];m=max(h,w);sc=(S-12)/m
    im=Image.fromarray(rgba).resize((max(1,round(w*sc)),max(1,round(h*sc))),Image.LANCZOS)
    t=Image.new('RGBA',(S,S),(0,0,0,0));t.paste(im,((S-im.width)//2,(S-im.height)//2),im)
    return t
for key,(n,nm) in SH.items():
    img=cv2.imread(P(n));L=nm.split('|')
    for i,name in enumerate(L):
        r,c=divmod(i,4);tiles.append(cell(img,r,c,10 if key in 'AH' else 17));names.append(name)
rows=(len(tiles)+COLS-1)//COLS
at=Image.new('RGBA',(COLS*S,rows*S),(0,0,0,0))
for i,t in enumerate(tiles):at.paste(t,((i%COLS)*S,(i//COLS)*S))
at.save('/home/claude/gen/ic2/ic2_atlas.webp',quality=88,method=6)
json.dump(names,open('/home/claude/gen/ic2/names.json','w'),ensure_ascii=False)
# contact sheet kiểm tra trên nền giấy
bgp=Image.new('RGBA',at.size,(244,236,214,255));bgp.alpha_composite(at);bgp.convert('RGB').resize((at.width//2,at.height//2)).save('/tmp/fx/ic2_sheet.png')
print(len(names),at.size)
