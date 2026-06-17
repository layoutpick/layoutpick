// Element-picker overlay injected into every page via puppeteer
// evaluateOnNewDocument. Runs in the real Chromium page (no proxy). On click
// it calls the exposed binding window.EMIT_BROWSE_LITE_ELEMENT_PICKED(json);
// the host writes markdown + an element screenshot and inserts them into the
// active Claude terminal. Toggle via window.__noticedPickerSetActive() or Alt+S.
//
// Authored as a plain JS string (no template interpolation, no backslash escapes
// — CSS.escape is always present in Chromium) so it ships verbatim to the page.
export const PICKER_SOURCE = `(function(){
  "use strict";
  if (window.__noticedPicker) return;
  window.__noticedPicker = true;
  var active=false,current=null,box,label,toast,styleEl,toastTimer;
  function injectStyle(){
    if(styleEl)return;
    styleEl=document.createElement('style');
    styleEl.setAttribute('data-noticed-picker','1');
    styleEl.textContent='html.noticed-picking,html.noticed-picking *{cursor:crosshair !important}'
      +'.noticed-pick-box{position:fixed;z-index:2147483646;pointer-events:none;display:none;background:rgba(76,141,255,.18);border:2px solid #4c8dff;border-radius:2px}'
      +'.noticed-pick-label{position:fixed;z-index:2147483647;pointer-events:none;display:none;background:#1f2937;color:#fff;font:11px/1.4 ui-monospace,monospace;padding:2px 6px;border-radius:3px;white-space:nowrap}'
      +'.noticed-toast{position:fixed;right:16px;bottom:16px;z-index:2147483647;pointer-events:none;background:#111827;color:#fff;font:13px/1 system-ui,sans-serif;padding:10px 14px;border-radius:8px;opacity:0;transition:opacity .2s;box-shadow:0 4px 14px rgba(0,0,0,.4)}';
    (document.head||document.documentElement).appendChild(styleEl);
  }
  function el(tag,cls){var e=document.createElement(tag);e.setAttribute('data-noticed-picker','1');if(cls)e.className=cls;return e;}
  function ensureUi(){injectStyle();if(box)return;if(!document.body)return;box=el('div','noticed-pick-box');label=el('div','noticed-pick-label');document.body.appendChild(box);document.body.appendChild(label);}
  function isOurs(n){return n&&n.getAttribute&&n.getAttribute('data-noticed-picker')==='1';}
  function setActive(force){active=(typeof force==='boolean')?force:!active;ensureUi();document.documentElement.classList.toggle('noticed-picking',active);if(!active&&box){box.style.display='none';label.style.display='none';current=null;}}
  window.__noticedPickerSetActive=setActive;
  window.__noticedPickerShowToast=showToast;
  function describe(t){var s=t.tagName.toLowerCase();if(t.id)s+='#'+t.id;if(t.classList&&t.classList.length){s+='.'+Array.prototype.slice.call(t.classList).filter(function(c){return c.indexOf('noticed-')!==0;}).slice(0,3).join('.');}return s;}
  function onMove(e){if(!active||!box)return;var t=e.target;if(!t||isOurs(t))return;current=t;var r=t.getBoundingClientRect();box.style.display='block';box.style.top=r.top+'px';box.style.left=r.left+'px';box.style.width=r.width+'px';box.style.height=r.height+'px';label.style.display='block';label.textContent=describe(t)+'  '+Math.round(r.width)+'×'+Math.round(r.height);var ly=r.top-22;if(ly<0)ly=r.top+2;label.style.top=ly+'px';label.style.left=r.left+'px';}
  function onClick(e){if(!active)return;e.preventDefault();e.stopImmediatePropagation();var t=current||e.target;if(t&&!isOurs(t))capture(t);setActive(false);return false;}
  function onKey(e){if(e.altKey&&(e.key==='s'||e.key==='S')){e.preventDefault();setActive();}else if(e.key==='Escape'&&active){setActive(false);}}
  function cssEscape(s){return (window.CSS&&CSS.escape)?CSS.escape(s):s;}
  function cssPath(node){if(!(node instanceof Element))return '';if(node.id)return '#'+cssEscape(node.id);var parts=[],cur=node;while(cur&&cur.nodeType===1&&cur.tagName.toLowerCase()!=='html'){if(cur.id){parts.unshift('#'+cssEscape(cur.id));break;}var seg=cur.tagName.toLowerCase();var parent=cur.parentNode;if(parent){var same=Array.prototype.filter.call(parent.children,function(c){return c.tagName===cur.tagName&&!isOurs(c);});if(same.length>1)seg+=':nth-of-type('+(same.indexOf(cur)+1)+')';}parts.unshift(seg);cur=parent;}return parts.join(' > ');}
  var STYLE_PROPS=['display','position','color','background-color','background-image','font-family','font-size','font-weight','line-height','padding','margin','border','border-radius','box-shadow','width','height','flex-direction','justify-content','align-items','gap','text-align','opacity','z-index'];
  function styles(node){var cs=getComputedStyle(node),out={};STYLE_PROPS.forEach(function(p){var v=cs.getPropertyValue(p);if(v&&v!=='none'&&v!=='normal'&&v!=='auto'&&v!=='0px')out[p]=v.trim();});return out;}
  function attrs(node){var out={};Array.prototype.forEach.call(node.attributes||[],function(a){if(a.name==='data-noticed-picker')return;out[a.name]=a.value.length>200?a.value.slice(0,200)+'…':a.value;});return out;}
  function capture(node){var r=node.getBoundingClientRect();var html=node.outerHTML||'';if(html.length>20000)html=html.slice(0,20000)+' <!-- truncated -->';var text=(node.innerText||'').trim();if(text.length>2000)text=text.slice(0,2000)+'…';var payload={url:document.baseURI,title:document.title,selector:cssPath(node),tag:node.tagName.toLowerCase(),id:node.id||'',classes:Array.prototype.slice.call(node.classList||[]).filter(function(c){return c.indexOf('noticed-')!==0;}),attributes:attrs(node),rect:{x:r.left+window.scrollX,y:r.top+window.scrollY,width:r.width,height:r.height},viewRect:{x:r.left,y:r.top,width:r.width,height:r.height},styles:styles(node),text:text,outerHTML:html,innerWidth:window.innerWidth,devicePixelRatio:window.devicePixelRatio||1};try{window.EMIT_BROWSE_LITE_ELEMENT_PICKED(JSON.stringify(payload));showToast('✓ Sent to Claude');}catch(err){showToast('✗ '+(err&&err.message?err.message:err));}}
  function showToast(msg){injectStyle();if(!toast){if(!document.body)return;toast=el('div','noticed-toast');document.body.appendChild(toast);}toast.textContent=msg;toast.style.opacity='1';clearTimeout(toastTimer);toastTimer=setTimeout(function(){if(toast)toast.style.opacity='0';},1600);}
  document.addEventListener('mousemove',onMove,true);
  document.addEventListener('click',onClick,true);
  document.addEventListener('keydown',onKey,true);
})();`
