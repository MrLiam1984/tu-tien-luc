import json,glob,os,shutil
SRCS=['/home/claude/doll/out_B1','/home/claude/doll/out_Nam']   # thư mục lớp đã tách (mỗi tư thế một file .json)
man={}
for SRC in SRCS:
    for f in sorted(glob.glob(SRC+'/*.json')):
        man[os.path.basename(f)[:-5]]=json.load(open(f))
t=open('/home/claude/v8a.tpl.js',encoding='utf8').read()
open('/home/claude/v8a.js','w',encoding='utf8').write(t.replace('/*@@MAN@@*/{}',json.dumps(man,ensure_ascii=False,separators=(',',':'))))
os.makedirs('/home/claude/site/doll',exist_ok=True)
for SRC in SRCS:
    for f in os.listdir(SRC):
        if not f.endswith('.json'):shutil.copy(SRC+'/'+f,'/home/claude/site/doll/'+f)
print('poses',list(man),'files',len(os.listdir('/home/claude/site/doll')))
shutil.copy('/home/claude/pd/map_ink.webp','/home/claude/site/doll/map_ink.webp')
