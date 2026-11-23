// READ, AFTER — independent experiment. Original read-no-reply files are unchanged.
// The reveal needs TWO inputs: spatial closeness AND matching clocks.
const $ = id => document.getElementById(id);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const mobile = window.matchMedia('(max-width: 760px)');
const state = { scene: 0, near: false, you: 4, them: 7, revealed: false, completed: false, language: 'en', sound: false, draftPhase: 'writing' };
let timers = [], toastTimer, drag = null, audioContext, audioMaster, ambience;
const words = {
 en: {
  mobileDetail:'Tap a window title or “Bring closer”. Set both clocks to 12:04.', mobileAccess:'Tap either window title or “Bring closer”, then use the time sliders. Sound is optional.', mobileYour:'Bring your window closer', mobileTheir:'Bring their window closer', brand:'READ, AFTER', title:'Read, after.', subtitle:'Two windows. One unanswered message.', about:'About', yourSide:'Your side', theirSide:'Their side', conversation:'Your conversation', today:'Today', message:'Can we talk later?', receipt:'Read 12:04', waiting:'Still no reply.', composer:'Message…', yourClock:'Your clock', theirClock:'Their clock', hidden:'A moment you can’t see. Yet.', bring:'Bring closer', next:'Another possibility', reset:'Start again', credit:'An interactive fiction by Wanqi Wu', footer:'A read receipt isn’t the whole story.', space:'There is a whole world<br>on the other side.', aboutTitle:'What a receipt leaves out.', aboutBody:'Two fictional moments share one message and one read receipt. Bring the windows together, then align both clocks to 12:04 to see the part the sender cannot see.', aboutNote:'The second scene is another possibility, not the next event. Neither scene lets us read someone’s mind.', access:'Drag a title bar or use its arrow keys. “Bring closer” also works. Sound is optional.', replayMoment:'Replay the draft', distance:'Windows apart', clocks:'Clocks unmatched', near:'Windows together', synced:'Both at 12:04', soundOn:'Sound on', soundOff:'Sound off', beginTitle:'Bring two moments together.', beginDetail:'Drag the windows closer. Set both clocks to 12:04.', nearTitle:'Closer. Now find the moment.', nearDetail:'Move both clocks to the time on the read receipt: 12:04.', timeTitle:'Same time. Different places.', timeDetail:'Bring the windows closer to see the other side.', firstTitle:'A reply can exist without arriving.', firstDetail:'Your screen still says exactly the same thing.', secondTitle:'Some words never reach the chat.', secondDetail:'You saw a draft disappear. You still don’t know why.', finalTitle:'Same receipt. Different silences.', finalDetail:'“Read” tells you what happened to a message. There’s more happening around it.', chapterOne:'A moment apart', chapterTwo:'Another possibility', chapterEnd:'Two possible silences', underground:'Underground', atWindow:'By the window', reply:'Yes. Give me a minute.', sending:'Sending… · No signal', firstCaption:'The message was read. Then the train entered the tunnel.', draft:'I’m not sure what to say yet.', deleted:'The words are gone.', draftStatus:'Unsent draft', deletedStatus:'Draft deleted · Nothing sent', secondCaption:'The connection is fine. The draft disappears.', finish:'Hold both possibilities', closeEnough:'Windows together. Find 12:04.', soundUnavailable:'Sound is unavailable in this browser.', replayToast:'The moment starts again.', yourAria:'Move your window with arrow keys or drag', theirAria:'Move their window with arrow keys or drag'
 },
 zh: {
  mobileDetail:'点击窗口标题或“把窗靠近”，将时间都调到 12:04。', mobileAccess:'点击窗口标题或“把窗靠近”，再调节时间滑块。声音可以随时关闭。', mobileYour:'把你的窗靠近', mobileTheir:'把对方的窗靠近', brand:'已读以后', title:'已读以后。', subtitle:'两扇窗，同一条没有回复的消息。', about:'关于', yourSide:'你这一边', theirSide:'对方那一边', conversation:'你们的对话', today:'今天', message:'晚点可以聊聊吗？', receipt:'已读 12:04', waiting:'还是没有回复。', composer:'输入消息…', yourClock:'你的时间', theirClock:'对方的时间', hidden:'你还看不到的那个瞬间。', bring:'把窗靠近', next:'另一种可能', reset:'重新开始', credit:'Wanqi Wu 创作的互动虚构故事', footer:'已读，不是故事的全部。', space:'另一边，<br>还有一个世界。', aboutTitle:'回执没有告诉你的。', aboutBody:'两个虚构的瞬间，有着同一条消息和同一个已读回执。把两扇窗靠近，再把时间都调到 12:04，就能看到发送者不知道的那一边。', aboutNote:'第二个场景是另一种可能，并非之后发生的事。任何一种场景，都不能让我们读懂一个人的全部想法。', access:'拖动标题栏，或聚焦后按方向键。“把窗靠近”按钮也能操作。声音可以随时关闭。', replayMoment:'再看一次草稿', distance:'两窗尚远', clocks:'时间未对齐', near:'两窗已靠近', synced:'都在 12:04', soundOn:'声音开', soundOff:'声音关', beginTitle:'让两个瞬间相遇。', beginDetail:'把两扇窗靠近，将时间都调到 12:04。', nearTitle:'靠近了，再找对那个瞬间。', nearDetail:'把两边时间调到已读回执上的 12:04。', timeTitle:'同一时间，不同地方。', timeDetail:'把两扇窗靠近，看看对方那一边。', firstTitle:'回复可能存在，却没有抵达。', firstDetail:'你的屏幕，仍然显示同样的内容。', secondTitle:'有些话，没能进入对话。', secondDetail:'你看到草稿消失了，但你仍不知道原因。', finalTitle:'相同的已读，不同的沉默。', finalDetail:'“已读”说明消息被看见。消息之外，还发生着别的事。', chapterOne:'相隔的瞬间', chapterTwo:'另一种可能', chapterEnd:'两种可能的沉默', underground:'地铁隧道里', atWindow:'窗边', reply:'可以，等我一下。', sending:'发送中… · 无信号', firstCaption:'消息已经被读到，随后列车进入了隧道。', draft:'我还不知道怎么说。', deleted:'那些字消失了。', draftStatus:'尚未发送的草稿', deletedStatus:'草稿已删除 · 未发送', secondCaption:'网络连接正常，草稿却消失了。', finish:'记住这两种可能', closeEnough:'窗已靠近，找到 12:04。', soundUnavailable:'这个浏览器暂时无法播放声音。', replayToast:'这个瞬间重新开始了。', yourAria:'拖动或使用方向键移动你的窗口', theirAria:'拖动或使用方向键移动对方的窗口'
 }
};
const t = key => words[state.language][key];
const clock = minute => `12:${String(minute).padStart(2,'0')}`;
const atReadMoment = () => state.you === 4 && state.them === 4;
function later(fn,ms){const id=setTimeout(fn,ms);timers.push(id);return id;}
function clearStoryTimers(){timers.forEach(clearTimeout);timers=[];}
function say(message){$('announcement').textContent=message;}
function toast(message){clearTimeout(toastTimer);$('toast').textContent=message;$('toast').classList.add('visible');toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),2300);}

// Web Audio sounds are synthesized locally; nothing is recorded or transmitted.
function ensureAudio(){
 if(!state.sound)return;
 try{if(!audioContext){const AC=window.AudioContext||window.webkitAudioContext;audioContext=new AC();audioMaster=audioContext.createGain();audioMaster.gain.value=.16;audioMaster.connect(audioContext.destination);}if(audioContext.state==='suspended')audioContext.resume().catch(()=>{});}
 catch{state.sound=false;render();toast(t('soundUnavailable'));}
}
function tone(frequency=500,duration=.08,volume=.16){
 if(!state.sound)return;ensureAudio();if(!audioContext)return;
 const oscillator=audioContext.createOscillator(),gain=audioContext.createGain(),now=audioContext.currentTime;
 oscillator.type='sine';oscillator.frequency.setValueAtTime(frequency,now);oscillator.frequency.exponentialRampToValueAtTime(frequency*.7,now+duration);
 gain.gain.setValueAtTime(.001,now);gain.gain.exponentialRampToValueAtTime(volume,now+.008);gain.gain.exponentialRampToValueAtTime(.001,now+duration);
 oscillator.connect(gain);gain.connect(audioMaster);oscillator.start(now);oscillator.stop(now+duration+.01);
}
function stopAmbience(){if(ambience){try{ambience.source.stop();}catch{}ambience=null;}}
function startAmbience(){
 stopAmbience();if(!state.sound||!state.revealed||state.completed||document.hidden)return;ensureAudio();if(!audioContext)return;
 const buffer=audioContext.createBuffer(1,audioContext.sampleRate*3,audioContext.sampleRate),data=buffer.getChannelData(0);let last=0;
 for(let i=0;i<data.length;i++){last=(last+Math.random()*.04-.02)/1.02;data[i]=last*3;}
 const source=audioContext.createBufferSource(),filter=audioContext.createBiquadFilter(),gain=audioContext.createGain();source.buffer=buffer;source.loop=true;filter.type='lowpass';filter.frequency.value=state.scene===0?280:850;gain.gain.value=state.scene===0?.32:.15;source.connect(filter);filter.connect(gain);gain.connect(audioMaster);source.start();ambience={source};
}

function render(){
 document.documentElement.lang=state.language==='en'?'en':'zh-CN';
 document.querySelectorAll('[data-copy]').forEach(el=>{const k=el.dataset.copy;if(t(k)!==undefined){if(k==='space')el.innerHTML=t(k);else el.textContent=t(k);}});
 $('language-button').textContent=state.language==='en'?'中文':'EN';$('language-button').setAttribute('aria-label',state.language==='en'?'Switch to Chinese':'Switch to English');
 $('sound-label').textContent=t(state.sound?'soundOn':'soundOff');$('sound-button').setAttribute('aria-pressed',String(state.sound));$('sound-button').setAttribute('aria-label',t(state.sound?'soundOn':'soundOff'));
 $('your-handle').setAttribute('aria-label',t(mobile.matches?'mobileYour':'yourAria'));$('their-handle').setAttribute('aria-label',t(mobile.matches?'mobileTheir':'theirAria'));
 document.querySelector('[data-copy=access]').textContent=t(mobile.matches?'mobileAccess':'access');
 document.body.classList.toggle('near',state.near);document.body.classList.toggle('revealed',state.revealed);document.body.classList.toggle('completed',state.completed);
 $('your-time').value=state.you;$('their-time').value=state.them;$('your-clock').textContent=clock(state.you);$('their-clock').textContent=clock(state.them);$('hidden-time').textContent=clock(state.them);
 for(const side of ['your','their']){$(side+'-time').disabled=state.revealed;$(side+'-time').setAttribute('aria-valuetext',clock(side==='your'?state.you:state.them));$(side+'-time').setAttribute('aria-label',t(side==='your'?'yourClock':'theirClock'));}
 $('distance-condition').classList.toggle('met',state.near);$('distance-condition').lastElementChild.textContent=t(state.near?'near':'distance');
 $('time-condition').classList.toggle('met',atReadMoment());$('time-condition').lastElementChild.textContent=t(atReadMoment()?'synced':'clocks');
 $('bring-button').disabled=state.near;$('hidden-perspective').hidden=state.revealed;$('revealed-scene').hidden=!state.revealed;
 $('puzzle-controls').hidden=state.revealed;$('outcome-controls').hidden=!state.revealed;$('replay-moment').hidden=state.scene!==1||state.completed;
 $('mobile-hint').textContent=t(state.revealed?'footer':'mobileDetail');
 $('next-button').querySelector('span').textContent=t(state.completed?'reset':state.scene===0?'next':'finish');
 const prompt=state.completed?'final':state.revealed?(state.scene===0?'first':'second'):state.near?'near':atReadMoment()?'time':'begin';
 $('prompt-title').textContent=t(prompt+'Title');$('prompt-detail').textContent=t(!state.revealed&&mobile.matches?'mobileDetail':prompt+'Detail');
 $('chapter-label').textContent=t(state.completed?'chapterEnd':state.scene===0?'chapterOne':'chapterTwo');
 document.querySelectorAll('.chapter i').forEach((el,i)=>el.classList.toggle('active',state.completed||i===state.scene));
 $('location-label').textContent=t(state.scene===0?'underground':'atWindow');$('signal-icon').toggleAttribute('hidden',state.scene!==0);
 $('scene-photo').alt=!state.revealed?'Unrevealed surroundings':state.scene===0?'Inside a subway carriage':'Rain on a window';
 $('scene-caption').textContent=t(state.scene===0?'firstCaption':'secondCaption');
 const staticDraft=state.scene===1&&state.draftPhase==='deleted-static';
 const deleted=state.scene===1&&(state.draftPhase==='deleted'||staticDraft);
 $('receiver-text').textContent=t(state.scene===0?'reply':deleted&&!staticDraft?'deleted':'draft');$('delivery-status').textContent=t(state.scene===0?'sending':deleted?'deletedStatus':'draftStatus');
 document.querySelector('.receiver-message').classList.toggle('deleted',deleted);
}

// A reveal is latched: moving a window afterwards never erases a discovery.
function evaluate(){render();if(!state.revealed&&state.near&&atReadMoment())reveal();}
function reveal(){
 state.revealed=true;state.draftPhase='writing';clearTimeout(toastTimer);$('toast').classList.remove('visible');$('toast').textContent='';render();$('next-button').focus({preventScroll:true});tone(660,.25,.15);later(()=>tone(880,.3,.12),160);startAmbience();
 say(t(state.scene===0?'firstTitle':'secondTitle'));
 if(state.scene===1)playDraft();
}
function playDraft(){
 clearStoryTimers();state.draftPhase='writing';render();
 if(reducedMotion.matches){state.draftPhase='deleted-static';render();say(t('draft')+' '+t('deletedStatus'));return;}
 const text=t('draft');$('receiver-text').textContent='';
 [...text].forEach((_,i)=>later(()=>{$('receiver-text').textContent=[...text].slice(0,i+1).join('');if(i%4===0)tone(350,.025,.035);},100+i*58));
 const hold=1100+[...text].length*58;
 [...text].forEach((_,i)=>later(()=>{$('receiver-text').textContent=[...text].slice(0,text.length-i-1).join('');},hold+i*26));
 later(()=>{state.draftPhase='deleted';render();say(t('deletedStatus'));},hold+text.length*26+100);
}

function clamp(value,min,max){return Math.max(min,Math.min(value,max));}
function moveWindow(el,x,y){const stage=$('stage');el.style.left=clamp(x,8,stage.clientWidth-el.offsetWidth-8)+'px';el.style.top=clamp(y,8,stage.clientHeight-el.offsetHeight-8)+'px';}
function checkDistance(){
 if(mobile.matches)return;
 const a=$('your-window').getBoundingClientRect(),b=$('their-window').getBoundingClientRect();
 const gap=Math.max(0,Math.max(a.left,b.left)-Math.min(a.right,b.right));
 const vertical=Math.abs((a.top+a.height/2)-(b.top+b.height/2));
 state.near=gap<40&&vertical<100;evaluate();
}
function arrangeWindows(animate=true){
 if(!mobile.matches){
  const a=$('your-window'),b=$('their-window'),width=$('stage').clientWidth,total=a.offsetWidth+b.offsetWidth+24,start=(width-total)/2;
  if(animate)[a,b].forEach(el=>el.classList.add('snapping'));moveWindow(a,start,30);moveWindow(b,start+a.offsetWidth+24,48);later(()=>[a,b].forEach(el=>el.classList.remove('snapping')),850);
 }
 }
function bringTogether(){
 arrangeWindows();state.near=true;tone(420,.1);evaluate();if(!state.revealed)toast(t('closeEnough'));
}
function resetPositions(){
 for(const id of ['your-window','their-window']){const el=$(id);el.style.left='';el.style.top='';el.classList.remove('snapping','moving');}
}
function resetStory(scene=0){
 clearStoryTimers();stopAmbience();clearTimeout(toastTimer);$('toast').classList.remove('visible');$('toast').textContent='';drag=null;Object.assign(state,{scene,near:false,you:4,them:7,revealed:false,completed:false,draftPhase:'writing'});resetPositions();
 const asset=scene===0?'assets/subway.jpg':'assets/rain-window.jpg';$('scene-photo').src=asset;$('backdrop').src=asset;$('scene-photo').alt=scene===0?'A subway carriage, representing Eli’s surroundings':'Rain on a window, representing another possible setting';
 render();say(t('beginDetail'));
}
for(const [id,key] of [['your-time','you'],['their-time','them']])$(id).addEventListener('input',event=>{state[key]=Number(event.target.value);tone(220+state[key]*40,.045,.08);evaluate();});
$('bring-button').addEventListener('click',bringTogether);
for(const handle of document.querySelectorAll('.window-handle')){
 const el=handle.closest('.story-window');
 handle.addEventListener('click',()=>{if(mobile.matches)bringTogether();});
 handle.addEventListener('pointerdown',event=>{if(mobile.matches||event.button!==0)return;event.preventDefault();clearTimeout(toastTimer);el.classList.remove('snapping');handle.setPointerCapture(event.pointerId);drag={el,handle,pointer:event.pointerId,x:event.clientX,y:event.clientY,left:el.offsetLeft,top:el.offsetTop};el.classList.add('moving');tone(220,.07,.09);});
 handle.addEventListener('pointermove',event=>{if(!drag||drag.handle!==handle)return;moveWindow(el,drag.left+event.clientX-drag.x,drag.top+event.clientY-drag.y);checkDistance();});
 const end=()=>{if(!drag||drag.handle!==handle)return;el.classList.remove('moving');drag=null;checkDistance();if(state.near)bringTogether();tone(320,.09,.08);};
 handle.addEventListener('pointerup',end);handle.addEventListener('pointercancel',end);handle.addEventListener('lostpointercapture',end);
 handle.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Enter',' '].includes(event.key))return;event.preventDefault();if(mobile.matches||event.key==='Enter'||event.key===' '){bringTogether();return;}const d=event.shiftKey?40:15;moveWindow(el,el.offsetLeft+(event.key==='ArrowLeft'?-d:event.key==='ArrowRight'?d:0),el.offsetTop+(event.key==='ArrowUp'?-d:event.key==='ArrowDown'?d:0));checkDistance();});
}
$('next-button').addEventListener('click',()=>{
 tone(520,.1);
 if(state.completed){resetStory();$('bring-button').focus();return;}
 if(state.scene===0){resetStory(1);$('prompt-title').scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth',block:'nearest'});$('their-time').focus({preventScroll:true});}
 else{clearStoryTimers();state.draftPhase='deleted';state.completed=true;stopAmbience();render();say(t('finalTitle'));}
});
$('reset-button').addEventListener('click',()=>{resetStory();tone(400,.12);});
$('replay-moment').addEventListener('click',()=>{playDraft();toast(t('replayToast'));});
$('language-button').addEventListener('click',()=>{clearStoryTimers();state.language=state.language==='en'?'zh':'en';if(state.scene===1&&state.revealed)state.draftPhase=reducedMotion.matches?'deleted-static':'deleted';render();});
$('sound-button').addEventListener('click',()=>{state.sound=!state.sound;if(state.sound){ensureAudio();tone(500,.2,.12);startAmbience();}else stopAmbience();render();});
$('about-button').addEventListener('click',()=>$('about-dialog').showModal());
$('about-dialog').addEventListener('click',e=>{if(e.target===$('about-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
window.addEventListener('resize',()=>{resetPositions();if(state.near)arrangeWindows(false);render();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){stopAmbience();if(audioContext)audioContext.suspend();}else if(state.sound){ensureAudio();startAmbience();}});
resetStory();
