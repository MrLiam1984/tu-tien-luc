import json
from PIL import Image
out='out_Nam'
m=json.load(open(f'{out}/nam1.json'))
Image.new('RGBA',(1,1),(0,0,0,0)).save(f'{out}/nam1_hair_bui.webp','WEBP',lossless=True)
m['items'].append({'kind':'hair','id':'bui','name':'Búi tóc thường','file':'nam1_hair_bui.webp','x':0,'y':0,'w':1,'h':1,'tags':['plain','poor']})
json.dump(m,open(f'{out}/nam1.json','w'),ensure_ascii=False)
