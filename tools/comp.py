import json,sys
from PIL import Image
def comp(out,pose,outfit,face,hair,bgc=(60,50,70)):
    M=json.load(open(f'{out}/{pose}.json'));I={(i['kind'],i['id']):i for i in M['items']}
    cv=Image.new('RGBA',(M['W'],M['H']),bgc+(255,))
    def lay(it):
        return Image.open(f"{out}/{it['file']}").convert('RGBA')
    o=I[('outfit',outfit)];cv.alpha_composite(lay(o),(o['x'],o['y']))
    h=I.get(('hair',hair))
    if h and h.get('er'):
        er=Image.open(f"{out}/{h['er']}").convert('RGBA').getchannel('A')
        base=cv.copy();hole=Image.new('RGBA',cv.size,(0,0,0,0));hole.paste(Image.new('RGBA',er.size,bgc+(255,)),(h['ex'],h['ey']),er);cv.alpha_composite(hole)
    f=I[('face',face)];cv.alpha_composite(lay(f),(f['x'],f['y']))
    if h:cv.alpha_composite(lay(h),(h['x'],h['y']))
    return cv
if __name__=='__main__':
    out='out_A';combos=[('base','quyen','bun'),('phuong','lanh','xoa'),('tien','diu','haibui'),('phuong','anhkhi','ngua'),('tien','quyen','bac'),('base','lanh','do'),('phuong','quyen','do'),('tien','anhkhi','bun')]
    tiles=[comp(out,'nu1',*c).convert('RGB').resize((336,450)) for c in combos]
    S=Image.new('RGB',(336*4,450*2));[S.paste(t,((i%4)*336,(i//4)*450)) for i,t in enumerate(tiles)];S.save('combo_A.png');print(S.size)
