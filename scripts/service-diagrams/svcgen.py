import sys,math,json; sys.path.insert(0,'/workspace/marketing/thumbs')
from overlay_logo import overlay
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np
S=2; W,H=1280*S,720*S
FB='/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'; FR='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
def F(s,b=True): return ImageFont.truetype(FB if b else FR,int(s*S),index=0)
TEAL=(24,138,140); DEEP=(20,110,118); MINT=(222,242,238); LINE=(170,215,208); TXT=(40,60,64); SUB=(90,110,112); GRAYC=(150,165,168)
LOG=[]
def P(*a): return [v*S for v in a]
class C:
    def __init__(s,title,w,h,ty):
        global W,H; W,H=w*S,h*S; s.w,s.h=w,h
        s.im=Image.new('RGBA',(W,H),(246,249,248,255))
        for cx,cy,r,c in [(w-160,120,260,(214,239,233)),(160,h-60,240,(216,236,244))]:
            m=Image.new('L',(W,H),0); ImageDraw.Draw(m).ellipse(P(cx-r,cy-r,cx+r,cy+r),fill=255)
            l=Image.new('RGBA',(W,H),c+(255,)); l.putalpha(m.filter(ImageFilter.GaussianBlur(90*S))); s.im.alpha_composite(l)
        s.text(w/2,ty,title,F(40 if w>1000 else 38),DEEP)
    @property
    def d(s): return ImageDraw.Draw(s.im)
    def ink(s,t,f):
        m=Image.new('L',(int(f.size*len(t)*1.5)+40,f.size*3),0); ImageDraw.Draw(m).text((20,f.size),t,font=f,fill=255)
        b=m.getbbox(); return b[0]-20,b[1]-f.size,b[2]-20,b[3]-f.size
    def text(s,cx,cy,t,f,fill=TXT,gap=1.45):
        lines=t.split('\n'); lh=f.size*gap; y0=cy*S-lh*(len(lines)-1)/2
        for i,ln in enumerate(lines):
            b=s.ink(ln,f); x=round(cx*S-(b[0]+b[2])/2); y=round(y0+i*lh-(b[1]+b[3])/2); s.d.text((x,y),ln,font=f,fill=fill)
    def ltext(s,x,cy,t,f,fill=TXT):
        b=s.ink(t,f); s.d.text((round(x*S-b[0]),round(cy*S-(b[1]+b[3])/2)),t,font=f,fill=fill)
    def card(s,box,fill=(255,255,255),outline=LINE,r=22):
        box=P(*box); m=Image.new('L',(W,H),0); ImageDraw.Draw(m).rounded_rectangle(box,r*S,fill=255)
        sh=Image.new('RGBA',(W,H),(20,80,90,255)); sh.putalpha(m.filter(ImageFilter.GaussianBlur(14*S)).point(lambda v:int(v*.12))); s.im.alpha_composite(sh,(0,8*S))
        s.d.rounded_rectangle(box,r*S,fill=fill,outline=outline,width=3*S)
    def circle(s,cx,cy,r,c,t,f,name):
        cx,cy=round(cx*S)/S,round(cy*S)/S; ox=oy=0
        for it in range(4):
            bak=s.im.copy(); s.d.ellipse(P(cx-r,cy-r,cx+r,cy+r),fill=c)
            s.text(cx+ox/S,cy+oy/S,t,f,'white')
            p=r*S+6; X,Y=int(cx*S),int(cy*S); sub=np.array(s.im.convert('RGB'))[Y-p:Y+p,X-p:X+p].astype(int)
            teal=(abs(sub-list(c)).sum(2)<60); yy,xx=np.nonzero(teal); cc=((xx.min()+xx.max())/2,(yy.min()+yy.max())/2)
            I=np.indices(teal.shape); wh=(sub.min(2)>200)&(((I[1]-cc[0])**2+(I[0]-cc[1])**2)<(r*S-3)**2)
            yy,xx=np.nonzero(wh); ic=((xx.min()+xx.max())/2,(yy.min()+yy.max())/2); dx,dy=ic[0]-cc[0],ic[1]-cc[1]
            if (abs(dx)<=0.5 and abs(dy)<=0.5) or it==3: LOG.append((name,t,dx,dy)); return
            s.im=bak; ox-=round(dx); oy-=round(dy)
    def arrow(s,x1,y1,x2,y2,c=TEAL,w=6):
        x1,y1,x2,y2=P(x1,y1,x2,y2); a=math.atan2(y2-y1,x2-x1); L=18*S
        s.d.line((x1,y1,x2-L*0.7*math.cos(a),y2-L*0.7*math.sin(a)),fill=c,width=w*S)
        s.d.polygon([(x2,y2),(x2-L*math.cos(a-0.5),y2-L*math.sin(a-0.5)),(x2-L*math.cos(a+0.5),y2-L*math.sin(a+0.5))],fill=c)
    def check(s,x,y,col=TEAL):
        s.d.ellipse(P(x-13,y-13,x+13,y+13),fill=col); s.d.line(P(x-7,y,x-2,y+6,x+7,y-6),fill='white',width=4*S,joint='curve')
    def dot(s,x,y): s.d.ellipse(P(x-7,y-7,x+7,y+7),fill=GRAYC)
    def save(s,n): overlay(s.im.convert('RGB'),glow=False).save(n,optimize=True)

def ba_wide(slug,title,center,before,after):
    c=C(title,1280,720,195)
    for k,(x,hd,items,fill) in enumerate([(60,'いまのお悩み',before,(255,255,255)),(820,'相談したあと',after,MINT)]):
        c.card((x,260,x+400,660),fill=fill); c.text(x+200,305,hd,F(28),SUB if k==0 else DEEP)
        for j,t in enumerate(items):
            yy=385+j*95
            if k==0: c.dot(x+40,yy)
            else: c.check(x+44,yy)
            c.ltext(x+70,yy,t,F(23,k==1))
    c.arrow(470,460,530,460); c.arrow(750,460,810,460)
    c.circle(640,460,98,TEAL,center,F(30),f'{slug}-ba-wide')
    c.save(f'{slug}-ba-wide.png')
def ba_tall(slug,title,center,before,after):
    c=C(title,720,1080,170)
    for k,(y,hd,items,fill) in enumerate([(240,'いまのお悩み',before,(255,255,255)),(720,'相談したあと',after,MINT)]):
        c.card((60,y,660,y+300),fill=fill); c.text(360,y+45,hd,F(30),SUB if k==0 else DEEP)
        for j,t in enumerate(items):
            yy=y+115+j*68
            if k==0: c.dot(110,yy)
            else: c.check(114,yy)
            c.ltext(145,yy,t,F(27,k==1))
    c.arrow(360,548,360,566); c.arrow(360,692,360,712)
    c.circle(360,629,62,TEAL,center,F(26),f'{slug}-ba-tall')
    c.save(f'{slug}-ba-tall.png')
def steps_wide(slug,title,steps):
    c=C(title,1280,720,195); n=len(steps); m=50; g=34 if n<5 else 26; cw=(1280-2*m-g*(n-1))/n; y=290; h=320
    for i,(hd,sub) in enumerate(steps):
        x=m+i*(cw+g); c.card((x,y,x+cw,y+h),fill=MINT if i==n-1 else (255,255,255)); cx=x+cw/2
        c.circle(cx,y+58,30,TEAL,str(i+1),F(32),f'{slug}-st-wide#{i+1}')
        c.text(cx,y+145,hd,F(26 if n<5 else 24),DEEP); c.text(cx,y+245,sub,F(20,False),SUB)
        if i<n-1: c.arrow(x+cw+4,y+h/2,x+cw+g-4,y+h/2,w=5)
    c.save(f'{slug}-steps-wide.png')
def steps_tall(slug,title,steps):
    n=len(steps); h=150; g=34; top=240; Ht=top+n*h+(n-1)*g+70
    c=C(title,720,Ht,170)
    for i,(hd,sub) in enumerate(steps):
        y=top+i*(h+g); c.card((60,y,660,y+h),fill=MINT if i==n-1 else (255,255,255))
        c.circle(130,y+h/2,36,TEAL,str(i+1),F(38),f'{slug}-st-tall#{i+1}')
        c.ltext(200,y+50,hd,F(30),DEEP); c.ltext(200,y+105,sub.replace('\n',''),F(22,False),SUB)
        if i<n-1: c.arrow(130,y+h+4,130,y+h+g-4,w=5)
    c.save(f'{slug}-steps-tall.png')
