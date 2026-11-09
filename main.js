(function(){
var d=document,root=d.documentElement,pages=[['index','Home'],['about','About'],['work','Work'],['contact','Contact']];
var cur=(location.pathname.split('/').pop()||'index').replace('.html','')||'index';
// shared SVG filters (wobbly pencil lines)
d.body.insertAdjacentHTML('afterbegin','<svg class="defs" aria-hidden="true"><filter id="rough" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="3.5"/></filter><filter id="rough2" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".03" numOctaves="2" seed="11"/><feDisplacementMap in="SourceGraphic" scale="5"/></filter></svg>');
var links=pages.map(function(p){return '<a href="'+p[0]+'.html"'+(p[0]===cur?' aria-current="page"':'')+'>'+p[1]+'</a>'}).join('');
var h=d.getElementById('site-header');
if(h)h.innerHTML='<div class="wrap"><nav class="sketch" aria-label="Main"><a class="logo" href="index.html"><i aria-hidden="true">K</i>Krishna Studio</a><div class="links">'+links+'</div><button class="icon" id="theme" aria-label="Toggle dark mode">🌗</button></nav></div>';
var f=d.getElementById('site-footer');
if(f)f.innerHTML='<div class="wrap"><span>© '+new Date().getFullYear()+' Krishna Studio. Made with ✏️ by five friends.</span><nav aria-label="Footer"><div class="links">'+links+'</div></nav></div>';
try{var s=localStorage.getItem('ks-theme');if(s)root.setAttribute('data-theme',s)}catch(e){}
var t=d.getElementById('theme');
if(t)t.addEventListener('click',function(){
var c=root.getAttribute('data-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'),n=c==='dark'?'light':'dark';
root.setAttribute('data-theme',n);try{localStorage.setItem('ks-theme',n)}catch(e){}});
d.querySelectorAll('.person,.note').forEach(function(e){e.insertAdjacentHTML('beforeend','<i class="tape"></i>')});
// contact form builds a mailto link
var mf=d.getElementById('mailform');
if(mf)mf.addEventListener('submit',function(e){e.preventDefault();var to=d.querySelector('.mail a').textContent.trim();
location.href='mailto:'+to+'?subject='+encodeURIComponent('Hello from '+mf.name.value)+'&body='+encodeURIComponent(mf.msg.value)});
// doodle canvas
var cv=d.getElementById('cv');
if(cv){var g=cv.getContext('2d'),tool='pen',col='ink',S=[],cur=null,W=0,H=0,hint=d.getElementById('cvhint');
var C={brand:'#6965db',red:'#e03131',green:'#2f9e44'};
function R(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;var t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function ln(x1,y1,x2,y2,r){for(var i=0;i<2;i++){var o=function(){return(r()-.5)*3.5};g.beginPath();g.moveTo(x1+o(),y1+o());g.quadraticCurveTo((x1+x2)/2+o()*2,(y1+y2)/2+o()*2,x2+o(),y2+o());g.stroke()}}
function paint(s){var r=R(s.seed);g.strokeStyle=s.col==='ink'?getComputedStyle(root).getPropertyValue('--ink').trim()||'#1b1b1f':C[s.col];g.lineWidth=2.5;g.lineCap=g.lineJoin='round';
var a=s.a,b=s.b;
if(s.t==='pen'){g.beginPath();s.pts.forEach(function(p,i){i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1])});g.stroke()}
else if(s.t==='rect'){ln(a[0],a[1],b[0],a[1],r);ln(b[0],a[1],b[0],b[1],r);ln(b[0],b[1],a[0],b[1],r);ln(a[0],b[1],a[0],a[1],r)}
else if(s.t==='oval'){var cx=(a[0]+b[0])/2,cy=(a[1]+b[1])/2,rx=Math.abs(b[0]-a[0])/2,ry=Math.abs(b[1]-a[1])/2;
for(var k=0;k<2;k++){g.beginPath();for(var i=0;i<=40;i++){var th=i/40*Math.PI*2+k*.4,w=1+(r()-.5)*.05;g.lineTo(cx+Math.cos(th)*rx*w,cy+Math.sin(th)*ry*w)}g.stroke()}}
else if(s.t==='arrow'){ln(a[0],a[1],b[0],b[1],r);var an=Math.atan2(b[1]-a[1],b[0]-a[0]);[.5,-.5].forEach(function(d2){ln(b[0],b[1],b[0]-18*Math.cos(an+d2),b[1]-18*Math.sin(an+d2),r)})}}
function redraw(){g.clearRect(0,0,W,H);S.concat(cur?[cur]:[]).forEach(paint)}
function fit(){var q=cv.getBoundingClientRect(),dp=devicePixelRatio||1;W=q.width;H=q.height;cv.width=W*dp;cv.height=H*dp;g.setTransform(dp,0,0,dp,0,0);redraw()}
function pt(e){var q=cv.getBoundingClientRect();return[e.clientX-q.left,e.clientY-q.top]}
cv.addEventListener('pointerdown',function(e){cv.setPointerCapture(e.pointerId);var p=pt(e);cur={t:tool,col:col,seed:(Math.random()*1e9)|0,a:p,b:p,pts:[p]};hint.classList.add('off')});
cv.addEventListener('pointermove',function(e){if(!cur)return;var p=pt(e);cur.b=p;cur.pts.push(p);redraw()});
function done(){if(cur){S.push(cur);cur=null;redraw()}}
cv.addEventListener('pointerup',done);cv.addEventListener('pointercancel',done);
d.querySelectorAll('[data-tool]').forEach(function(b){b.addEventListener('click',function(){tool=b.dataset.tool;d.querySelectorAll('[data-tool]').forEach(function(x){x.setAttribute('aria-pressed',x===b)})})});
d.querySelectorAll('[data-col]').forEach(function(b){b.addEventListener('click',function(){col=b.dataset.col;d.querySelectorAll('[data-col]').forEach(function(x){x.setAttribute('aria-pressed',x===b)})})});
d.getElementById('undo').addEventListener('click',function(){S.pop();redraw()});
d.getElementById('clear').addEventListener('click',function(){S=[];redraw();hint.classList.remove('off')});
d.getElementById('save').addEventListener('click',function(){var a=d.createElement('a');a.download='krishna-studio-doodle.png';a.href=cv.toDataURL('image/png');a.click()});
addEventListener('resize',fit);new MutationObserver(redraw).observe(root,{attributes:true});fit()}
// draggable team notes
var b=d.getElementById('board');if(!b)return;
var svg=d.getElementById('arrows'),N={};b.querySelectorAll('.note').forEach(function(n){N[n.dataset.id]=n});
var L=[['ram','kee'],['kee','anj'],['ram','usm'],['kee','tal']],P=L.map(function(){var p=d.createElementNS('http://www.w3.org/2000/svg','path');svg.appendChild(p);return p});
function c(n){return{x:n.offsetLeft+n.offsetWidth/2,y:n.offsetTop+n.offsetHeight/2}}
function draw(){L.forEach(function(l,i){var a=c(N[l[0]]),e=c(N[l[1]]);P[i].setAttribute('d','M'+a.x+' '+a.y+' Q'+(a.x+e.x)/2+' '+((a.y+e.y)/2-30)+' '+e.x+' '+e.y)})}
draw();addEventListener('resize',draw);
Object.keys(N).forEach(function(k){var n=N[k],sx,sy,ox,oy;
n.addEventListener('pointerdown',function(e){n.setPointerCapture(e.pointerId);n.classList.add('drag');sx=e.clientX;sy=e.clientY;ox=n.offsetLeft;oy=n.offsetTop});
n.addEventListener('pointermove',function(e){if(!n.classList.contains('drag'))return;
n.style.left=Math.max(0,Math.min(b.clientWidth-n.offsetWidth,ox+e.clientX-sx))+'px';
n.style.top=Math.max(0,Math.min(b.clientHeight-n.offsetHeight,oy+e.clientY-sy))+'px';draw()});
['pointerup','pointercancel'].forEach(function(ev){n.addEventListener(ev,function(){n.classList.remove('drag')})})})
})();
