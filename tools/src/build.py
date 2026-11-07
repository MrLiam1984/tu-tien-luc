import json,re,sys
w=open('/home/claude/work.html',encoding='utf8').read()
js='\n'.join(open('/home/claude/'+f,encoding='utf8').read() for f in ['v6a.js','v6b.js','v6c.js','v6d.js','v6e.js','v6f.js','v6g.js','v6h.js','v6i.js','v6j.js','v6k.js','v6l.js','v6m.js','v6n.js','v6o.js','v6p.js','v6q.js','v6r.js','v6s.js','v6w.js','v6x.js','v6y.js','v6z.js','v7data.js','v7b.js','v7c.js','v7d.js','v7e.js','v7f.js','v7g.js','v7h.js','v7i.js','v8a.js','v8b.js','v9a.js','v9b.js','v9c.js','v10a.js','v10b.js','v10c.js','v10d.js','v10e.js','v10g.js','v10f.js','v10h.js','v10i.js','v10j.js','v10k.js','v10l.js'])
i=w.rindex('</script>');w=w[:i]+'\n'+js+'\n'+w[i:]
imgs=json.load(open('/home/claude/imgs.json'))
open('/home/claude/'+sys.argv[1],'w',encoding='utf8').write(re.sub(r'@@IMG(\d+)@@',lambda m:imgs[int(m.group(1))],w))
