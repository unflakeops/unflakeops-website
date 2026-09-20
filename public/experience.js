(() => {
  const story=document.querySelector('.scroll-story'),pin=story.querySelector('.story-pin'),scene=document.querySelector('.story-scene'),cards=[...document.querySelectorAll('.data-card')],core=document.querySelector('.connection-core'),report=document.querySelector('.finished-report'),title=document.querySelector('#story-title'),description=document.querySelector('#story-description'),timeline=document.querySelector('.story-timeline b'),reduced=matchMedia('(prefers-reduced-motion: reduce)'),assembly=document.querySelector('.assembly-scene'),replay=document.querySelector('.replay-assembly');
  const ns='http://www.w3.org/2000/svg',svg=document.querySelector('.story-wires');
  const paths=cards.map(()=>{const p=document.createElementNS(ns,'path');p.setAttribute('pathLength','1');p.setAttribute('stroke-dasharray','1');document.querySelector('#wire-lines').append(p);return p;});
  const pulsePaths=paths.map(()=>{const p=document.createElementNS(ns,'path');p.setAttribute('pathLength','1');p.setAttribute('stroke-dasharray','.035 .965');document.querySelector('#wire-pulses').append(p);return p;});
  const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x)};
  let scheduled=false,lastPhase=-1;
  const phases=[['Good information.<br><em>In too many places.</em>','The work is finding the right version, the missing pieces and the person who can confirm them.'],['Make the checks and<br><em>hand-offs visible.</em>','See what is missing, who needs to review it and where each figure came from.'],['One recurring report.<br><em>A calmer next time.</em>','Prepared for your team to review. Built to run again.']];
  function render(){
    scheduled=false;
    const r=story.getBoundingClientRect(),top=parseFloat(getComputedStyle(pin).top)||0;
    const p=reduced.matches?1:clamp((top-r.top)/Math.max(1,r.height-pin.offsetHeight));
    const w=scene.clientWidth,h=scene.clientHeight,mobile=w<600,join=ease((p-.13)/.4),finish=ease((p-.66)/.2);
    const phase=p<.3?0:p<.73?1:2;
    if(phase!==lastPhase){title.innerHTML=phases[phase][0];description.textContent=phases[phase][1];document.querySelectorAll('.timeline-step').forEach((el,i)=>el.classList.toggle('active',i===phase));lastPhase=phase;}
    const spreadX=mobile?w*.255:Math.min(w*.30,390),spreadY=mobile?h*.25:Math.min(h*.28,116);
    const directions=[[-1,-1],[1,-1],[-1,1],[1,1]],angles=[-9,8,6,-7];
    svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
    cards.forEach((el,i)=>{
      const [sx,sy]=directions[i],x=sx*spreadX*(1-.17*join)*(1-.75*finish),y=sy*spreadY*(1-.1*join)*(1-.75*finish);
      const rot=angles[i]*(1-join),scale=(mobile?.94:1)-.12*join-.48*finish;
      el.style.transform=`translate(-50%,-50%) translate(${x}px,${y}px) rotate(${rot}deg) scale(${scale})`;
      el.style.opacity=String(1-finish);el.style.visibility=finish===1?'hidden':'visible';
      const startX=w/2+x,startY=h/2+y,endX=w/2,endY=h/2;
      const d=`M ${startX} ${startY} C ${startX} ${endY}, ${endX+sx*40} ${startY}, ${endX} ${endY}`;
      paths[i].setAttribute('d',d);pulsePaths[i].setAttribute('d',d);
      paths[i].style.strokeDashoffset=String(1-join);paths[i].style.opacity=String((1-finish)*.55);
      pulsePaths[i].style.strokeDashoffset=String(-clamp((p-.2-i*.03)/.45));pulsePaths[i].style.opacity=String(p>.2&&p<.73?Math.min(join*3,1):0);
    });
    core.style.opacity=String(ease((p-.15)/.16)*(1-finish));core.style.transform=`translate(-50%,-50%) scale(${.8+.2*join})`;
    report.style.opacity=String(finish);report.style.visibility=finish===0?'hidden':'visible';report.style.transform=`translate(-50%,-50%) translateY(${(1-finish)*36}px) rotate(${(1-finish)*-6}deg) scale(${.8+finish*.2})`;
    timeline.style.width=`${p*100}%`;
  }
  function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(render)}}
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);if(reduced.addEventListener)reduced.addEventListener('change',schedule);if('ResizeObserver' in window)new ResizeObserver(schedule).observe(scene);render();
  let assemblyTimer,assemblyPlayed=false;
  function playAssembly(){if(!assembly||reduced.matches)return;clearTimeout(assemblyTimer);assembly.classList.remove('is-playing');void assembly.offsetWidth;assembly.classList.add('is-playing');assemblyTimer=setTimeout(()=>assembly.classList.remove('is-playing'),2700);assemblyPlayed=true;}
  if(assembly){if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{if(entries[0].isIntersecting&&!assemblyPlayed){playAssembly();observer.disconnect();}},{threshold:.2});observer.observe(assembly);}else playAssembly();}
  if(replay)replay.addEventListener('click',playAssembly);
  document.querySelector('#year').textContent=new Date().getFullYear();
  document.querySelector('#contact-form').addEventListener('submit',event=>{event.preventDefault();const data=new FormData(event.currentTarget),organisation=data.get('organisation')||'UK charity',subject=`Reporting workflow conversation — ${organisation}`,body=[`Organisation: ${organisation}`,`Email: ${data.get('email')}`,'','Recurring report or process:',data.get('workflow')].join('\n');location.href=`mailto:hello@unflakeops.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;});
})();
