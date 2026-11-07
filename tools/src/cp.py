# dùng: python3 gen/cp.py <pose> <start_n> id1 id2 ...  -> chép screenshot-*-<n>.png vào gen/pose_<pose>/<id>.png
import sys,glob,shutil,re
pose,n0,ids=sys.argv[1],int(sys.argv[2]),sys.argv[3:]
fs={}
for f in glob.glob('/tmp/claude-chrome-screenshots-8yJPRW/*.png'):
    m=re.search(r'-(\d+)\.png$',f)
    if m:fs[int(m.group(1))]=f
for i,k in enumerate(ids):
    shutil.copy(fs[n0+i],f'/home/claude/gen/pose_{pose}/{k}.png');print(pose,k,fs[n0+i][-18:])
