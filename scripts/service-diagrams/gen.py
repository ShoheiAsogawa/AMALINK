from svcgen import *; from data import D
for slug,d in D.items():
    t1='相談すると、こう変わります'; t2=d['name']+'の進め方'
    ba_wide(slug,t1,d['center'],d['before'],d['after']); ba_tall(slug,t1,d['center'],d['before'],d['after'])
    steps_wide(slug,t2,d['steps']); steps_tall(slug,t2,d['steps'])
json.dump(LOG,open('center-log.json','w'),ensure_ascii=False)
for l in LOG: print(l)
