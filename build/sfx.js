/* 효과음 — 음원 파일 없이 Web Audio로 8비트풍 소리를 만든다. 첫 클릭 뒤에만 소리가 난다(브라우저 정책). */
var SFX=(function(){
'use strict';
var ctx=null,master=null,on=true;
try{on=localStorage.getItem('ai_game_lab_sfx')!=='off';}catch(e){}
function ac(){if(!on)return null;try{if(!ctx){var A=window.AudioContext||window.webkitAudioContext;if(!A)return null;ctx=new A();master=ctx.createGain();master.gain.value=0.55;master.connect(ctx.destination);}if(ctx.state==='suspended')ctx.resume();}catch(e){return null;}return ctx;}
function env(g,t,a,peak,d,end){g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(Math.max(end||0.0001,0.0001),t+a+d);}
/* 음 하나: 파형·주파수·길이·크기, 끝 주파수(미끄러짐), 떨림(비브라토) */
function tone(o){var c=ac();if(!c)return;var t=c.currentTime+(o.at||0),os=c.createOscillator(),g=c.createGain();os.type=o.type||'square';os.frequency.setValueAtTime(o.f,t);
  if(o.to)os.frequency.exponentialRampToValueAtTime(o.to,t+o.d);
  if(o.vib){var l=c.createOscillator(),lg=c.createGain();l.frequency.value=o.vib;lg.gain.value=o.depth||5;l.connect(lg);lg.connect(os.frequency);l.start(t);l.stop(t+o.d+0.05);}
  var node=os;if(o.lp){var f=c.createBiquadFilter();f.type='lowpass';f.frequency.setValueAtTime(o.lp,t);if(o.lpTo)f.frequency.linearRampToValueAtTime(o.lpTo,t+o.d*0.35),f.frequency.linearRampToValueAtTime(o.lp,t+o.d);f.Q.value=o.q||6;os.connect(f);node=f;}
  node.connect(g);g.connect(master);env(g,t,o.a||0.005,o.v||0.2,o.d);os.start(t);os.stop(t+o.d+0.05);}
/* 잡음(쾅·쓱) */
function noise(o){var c=ac();if(!c)return;var t=c.currentTime+(o.at||0),n=Math.floor(c.sampleRate*o.d),b=c.createBuffer(1,n,c.sampleRate),x=b.getChannelData(0);for(var i=0;i<n;i++)x[i]=Math.random()*2-1;
  var s=c.createBufferSource();s.buffer=b;var f=c.createBiquadFilter();f.type=o.hp?'highpass':'lowpass';f.frequency.setValueAtTime(o.f||1200,t);if(o.to)f.frequency.exponentialRampToValueAtTime(o.to,t+o.d);
  var g=c.createGain();s.connect(f);f.connect(g);g.connect(master);env(g,t,o.a||0.004,o.v||0.3,o.d);s.start(t);s.stop(t+o.d+0.02);}
var LIB={
 click:function(){tone({f:880,d:0.05,type:'square',v:0.08});},
 coin:function(k){tone({f:1318+(k||0)*60,d:0.07,type:'square',v:0.11,at:0});tone({f:1976+(k||0)*60,d:0.18,type:'square',v:0.09,at:0.06});},
 take:function(n){for(var i=0;i<n;i++)(function(i){var c=ac();if(!c)return;tone({f:1318+i*120,d:0.07,type:'square',v:0.1,at:i*0.12});tone({f:1976+i*120,d:0.16,type:'square',v:0.08,at:i*0.12+0.06});})(i);},
 think:function(){[0,0.14,0.28].forEach(function(t,i){tone({f:[523,659,587][i],d:0.08,type:'square',v:0.07,at:t});});},
 panic:function(){tone({f:700,to:350,d:0.25,type:'square',v:0.1,vib:14,depth:40});tone({f:650,to:300,d:0.25,type:'square',v:0.09,vib:14,depth:40,at:0.27});},
 buzz:function(){tone({f:110,d:0.18,type:'sawtooth',v:0.12});tone({f:104,d:0.18,type:'square',v:0.08});},
 slide:function(){noise({d:0.32,f:600,to:3200,v:0.12,hp:false});tone({f:330,to:520,d:0.25,type:'triangle',v:0.06});},
 lift:function(){tone({f:523,to:784,d:0.09,type:'triangle',v:0.1});},
 solve:function(){[523,659,784,1047].forEach(function(f,i){tone({f:f,d:0.14,type:'square',v:0.1,at:i*0.09});});tone({f:1568,d:0.5,type:'triangle',v:0.1,at:0.36});},
 win:function(){var n=[523,659,784,1047,784,1047,1319];n.forEach(function(f,i){tone({f:f,d:i===n.length-1?0.7:0.13,type:'square',v:0.11,at:i*0.11,vib:i===n.length-1?7:0,depth:6});tone({f:f/2,d:i===n.length-1?0.7:0.13,type:'triangle',v:0.08,at:i*0.11});});
   [0,0.08,0.16].forEach(function(t){tone({f:2637,d:0.06,type:'square',v:0.05,at:0.85+t});});},
 /* 게임오버: 쾅! → 어두운 화음 → 처량하게 내려앉는 네 음 → 바닥으로 꺼지는 울림 */
 gameover:function(){
   noise({d:0.9,f:1800,to:120,v:0.5,a:0.002});
   tone({f:55,to:38,d:1.0,type:'sine',v:0.5,a:0.003});
   [110,130.8,155.6].forEach(function(f){tone({f:f,d:0.55,type:'square',v:0.07,a:0.003});});
   var seq=[[196,0.42],[185,0.42],[174.6,0.42],[164.8,1.7]],t=0.6;
   seq.forEach(function(s,i){var last=i===seq.length-1;
     tone({f:s[0],to:last?s[0]*0.94:null,d:s[1],type:'sawtooth',v:0.3,at:t,a:0.03,lp:420,lpTo:1500,q:7,vib:last?5.5:0,depth:last?7:0});
     tone({f:s[0]/2,d:s[1],type:'triangle',v:0.16,at:t,a:0.03});t+=s[1]+0.06;});
   tone({f:82,to:30,d:1.6,type:'sine',v:0.35,at:t-0.9,a:0.05});
   noise({d:1.4,f:400,to:60,v:0.12,at:t-0.9,a:0.2});}
};
function play(name,arg){if(!on)return;var f=LIB[name];if(f)try{f(arg);}catch(e){}}
function toggle(){on=!on;try{localStorage.setItem('ai_game_lab_sfx',on?'on':'off');}catch(e){}if(on){ac();play('click');}return on;}
/* 효과음 단추: 같은 class 단추를 모두 함께 갱신 */
function bind(){var bs=document.querySelectorAll('.sfx-btn');function lab(){bs.forEach(function(b){b.textContent=on?'🔊 효과음 켜짐':'🔈 효과음 꺼짐';b.setAttribute('aria-pressed',String(on));});}
  bs.forEach(function(b){b.onclick=function(){toggle();lab();};});lab();}
return {play:play,toggle:toggle,bind:bind,isOn:function(){return on;}};
})();
