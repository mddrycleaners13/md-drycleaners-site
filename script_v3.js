
document.addEventListener('DOMContentLoaded', function(){
  const SERVICES = window.SERVICES || {"Clothing": [{"id": "shirt", "name": "Shirt", "price": 80}, {"id": "tshirt", "name": "T-shirt", "price": 70}, {"id": "jeans", "name": "Jeans", "price": 150}, {"id": "trousers", "name": "Trousers", "price": 120}, {"id": "dress", "name": "Dress", "price": 200}, {"id": "pajama", "name": "Pajama", "price": 90}, {"id": "leggings", "name": "Leggings", "price": 80}, {"id": "cord_set", "name": "Cord-set", "price": 180}, {"id": "plazo", "name": "Plazo", "price": 110}], "Traditional & Ethnic": [{"id": "dupatta", "name": "Dupatta", "price": 50}, {"id": "blouse", "name": "Blouse", "price": 60}, {"id": "saree", "name": "Saree", "price": 300}, {"id": "sherwani", "name": "Sherwani", "price": 1200}, {"id": "lehenga", "name": "Lehenga", "price": 1000}], "Outerwear & Winter": [{"id": "2piece", "name": "2-piece Coat", "price": 450}, {"id": "3piece", "name": "3-piece Coat", "price": 600}, {"id": "sweatshirt", "name": "Sweatshirt", "price": 180}, {"id": "sweater", "name": "Sweater", "price": 220}, {"id": "jacket", "name": "Jacket", "price": 350}, {"id": "shawl", "name": "Shawl", "price": 200}], "Home & Household": [{"id": "bedsheet", "name": "Bedsheet", "price": 250}, {"id": "pillow_cover", "name": "Pillow Cover", "price": 60}, {"id": "cushion_cover", "name": "Cushion Cover", "price": 80}, {"id": "sofa_cover", "name": "Sofa Cover", "price": 800}, {"id": "curtain", "name": "Curtain", "price": 300}, {"id": "blanket", "name": "Blanket", "price": 350}, {"id": "quilt", "name": "Quilt (Rajai)", "price": 600}, {"id": "carpet", "name": "Carpet", "price": 1200}], "Accessories & Other": [{"id": "bag", "name": "Bag", "price": 250}, {"id": "shoes", "name": "Shoes (Pair)", "price": 250}, {"id": "raffu", "name": "Raffu", "price": 150}, {"id": "steam", "name": "Steam Press", "price": 40}]};
  const GAS_ENDPOINT = window.GAS_ENDPOINT || "https://script.google.com/macros/s/AKfycbz3OFTq6fBrwQHVZcUwztiB49NIaLAWTGR40pkvBS-tlPLFE29VdkJYLJ_FQ3xWpdHX/exec";

  function q(s){return document.querySelector(s)}
  function create(t,cls){let e=document.createElement(t); if(cls) e.className=cls; return e}

  // Render services
  const grids = q('#serviceGrids');
  grids.innerHTML = '';
  for(const cat in SERVICES){
    const box = create('div','service-section');
    const h = create('h4'); h.textContent = cat; box.appendChild(h);
    const grid = create('div','service-grids');
    SERVICES[cat].forEach(s=>{
      const card = create('div','service-card');
      const left = create('div');
      const name = create('div'); name.textContent = s.name; name.style.fontWeight='700';
      const price = create('div'); price.textContent = '₹'+s.price; price.style.color='#122b6b';
      left.appendChild(name); left.appendChild(price);
      const ctr = create('div'); ctr.style.display='flex'; ctr.style.gap='8px'; ctr.style.alignItems='center';
      const dec = create('button'); dec.textContent='-'; dec.setAttribute('aria-label','decrease');
      const inp = create('input'); inp.type='number'; inp.min=0; inp.value=0; inp.dataset.id=s.id; inp.style.width='56px';
      const inc = create('button'); inc.textContent='+'; inc.setAttribute('aria-label','increase');
      ctr.appendChild(dec); ctr.appendChild(inp); ctr.appendChild(inc);
      card.appendChild(left); card.appendChild(ctr);
      grid.appendChild(card);

      inc.addEventListener('click', ()=>{ inp.value=Number(inp.value)+1; updateCart(inp); });
      dec.addEventListener('click', ()=>{ inp.value=Math.max(0,Number(inp.value)-1); updateCart(inp); });
      inp.addEventListener('input', ()=> updateCart(inp));
    });
    box.appendChild(grid);
    grids.appendChild(box);
  }

  let cart = {}
  function updateCart(input){ const id = input.dataset.id; const qty = Number(input.value)||0; let svc=null; for(const c in SERVICES){ svc = SERVICES[c].find(x=>x.id===id); if(svc) break; } if(!svc) return; if(qty<=0) delete cart[id]; else cart[id] = Object.assign({}, svc, {qty:qty, subtotal: svc.price*qty}); renderSummary(); }
  function renderSummary(){ const summary = q('#summary'); summary.innerHTML = ''; const items = Object.values(cart); if(items.length===0){ summary.innerHTML = '<div class="summary-empty">No items selected</div>'; q('#total').textContent='₹0'; return; } items.forEach(function(it){ var r = create('div'); r.textContent = it.name + ' x ' + it.qty + ' = ₹' + it.subtotal; summary.appendChild(r); }); var total = items.reduce(function(s,i){return s+i.subtotal},0); q('#total').textContent = '₹'+total; }

  // slots
  const slots = [{id:'10-12',label:'10:00 AM - 12:00 PM'},{id:'12-14',label:'12:00 PM - 2:00 PM'},{id:'14-16',label:'2:00 PM - 4:00 PM'},{id:'16-18',label:'4:00 PM - 6:00 PM'},{id:'18-20',label:'6:00 PM - 8:00 PM'}];
  function populateSlots(dateStr){ const sel=q('#slot'); if(!sel) return; sel.innerHTML='<option value="">Select slot</option>'; const today=new Date(); const chosen=new Date(dateStr + 'T00:00:00'); const nowH=today.getHours(); slots.forEach(s=>{ let disabled=false; if(chosen.toDateString()===today.toDateString()){ const end=Number(s.id.split('-')[1]); if(nowH>=end) disabled=true } const opt=create('option'); opt.value=s.id; opt.textContent=s.label + (disabled ? ' (unavailable)' : ''); if(disabled) opt.disabled=true; sel.appendChild(opt); }); }

  // init date
  (function(){ const d=new Date(); const yyyy=d.getFullYear(), mm=String(d.getMonth()+1).padStart(2,'0'), dd=String(d.getDate()).padStart(2,'0'); if(q('#date')){ q('#date').value = yyyy+'-'+mm+'-'+dd; q('#date').min = yyyy+'-'+mm+'-'+dd; populateSlots(q('#date').value); q('#date').addEventListener('change', ()=> populateSlots(q('#date').value)); } })();

  // clear
  if(q('#clearBtn')) q('#clearBtn').addEventListener('click', ()=>{ document.querySelectorAll('input[type=number]').forEach(i=>i.value=0); cart={}; renderSummary(); if(q('#pickupForm')){ q('#pickupForm').reset(); const d=new Date(); const yyyy=d.getFullYear(), mm=String(d.getMonth()+1).padStart(2,'0'), dd=String(d.getDate()).padStart(2,'0'); q('#date').value=yyyy+'-'+mm+'-'+dd; populateSlots(q('#date').value); } });

  // pickup submit
  if(q('#pickupForm')) q('#pickupForm').addEventListener('submit', async (e)=>{ e.preventDefault(); if(Object.values(cart).length===0){ alert('Please select at least one service'); return; } const name = q('#name').value.trim(), phone = q('#phone').value.trim(), address=q('#address').value.trim(); const date=q('#date').value, slot=q('#slot').value, notes=q('#notes').value.trim(); if(!name||!phone||!address||!date||!slot){ alert('Please fill all required fields'); return; } const items = Object.values(cart).map(i=>({id:i.id,name:i.name,qty:i.qty,subtotal:i.subtotal})); const total = items.reduce((s,i)=>s+i.subtotal,0); q('#loading').style.display='flex'; q('#submitBtn').disabled=true; q('#clearBtn').disabled=true; try{ await fetch(GAS_ENDPOINT, {method:'POST',headers:{'Content-Type':'application/json'},body: JSON.stringify({formType:'pickup', name, phone, address, items, pickupDate:date, pickupTime:slot, total, notes})}); }catch(err){ console.warn('GAS save failed', err); } q('#loading').style.display='none'; q('#submitBtn').disabled=false; q('#clearBtn').disabled=false; showConfirm(); showToast('✅ Pickup request saved'); document.querySelectorAll('input[type=number]').forEach(i=>i.value=0); cart={}; renderSummary(); if(q('#pickupForm')){ q('#pickupForm').reset(); const d=new Date(); const yyyy=d.getFullYear(), mm=String(d.getMonth()+1).padStart(2,'0'), dd=String(d.getDate()).padStart(2,'0'); q('#date').value=yyyy+'-'+mm+'-'+dd; populateSlots(q('#date').value); } });

  // contact popup
  if(q('#contactPopupBtn')) q('#contactPopupBtn').addEventListener('click', ()=>{ const p=q('#contactPopup'); p.style.display='flex'; p.setAttribute('aria-hidden','false'); });
  if(q('#contactCancel')) q('#contactCancel').addEventListener('click', ()=>{ const p=q('#contactPopup'); p.style.display='none'; p.setAttribute('aria-hidden','true'); });

  if(q('#contactForm')) q('#contactForm').addEventListener('submit', async (e)=>{ e.preventDefault(); const name=q('#c_name').value.trim(), phone=q('#c_phone').value.trim(), msg=q('#c_message').value.trim(); if(!name||!phone||!msg){ alert('Please fill all fields'); return; } q('#loading').style.display='flex'; try{ await fetch(GAS_ENDPOINT, {method:'POST',headers:{'Content-Type':'application/json'},body: JSON.stringify({formType:'contact', name, phone, message:msg})}); }catch(err){ console.warn('Contact save failed', err); } q('#loading').style.display='none'; const p=q('#contactPopup'); p.style.display='none'; p.setAttribute('aria-hidden','true'); showConfirm(); showToast('✅ Message sent'); q('#contactForm').reset(); });

  // confirm & toast
  function showConfirm(){ const c=q('#confirmPopup'); c.style.display='flex'; c.setAttribute('aria-hidden','false'); }
  if(q('#closePopup')) q('#closePopup').addEventListener('click', ()=>{ const c=q('#confirmPopup'); c.style.display='none'; c.setAttribute('aria-hidden','true'); });
  function showToast(msg){ const t=q('#toast'); t.textContent=msg; t.style.display='block'; setTimeout(()=> t.style.display='none', 3500); }

  // utilities
  if(q('#callBtn')) q('#callBtn').addEventListener('click', ()=>{ if(confirm('Call 9821266799? Press OK for 9821266799, Cancel for 9811993799')){ location.href='tel:+919821266799'; } else { location.href='tel:+919811993799'; } });
  if(q('#waBtn')) q('#waBtn').addEventListener('click', ()=>{ const text=encodeURIComponent("Hi! I'd like to schedule a pickup from M.D. Dry Cleaners."); window.open('https://wa.me/919821266799?text='+text, '_blank'); });

  // scroll
  if(q('#pickupBtn')) q('#pickupBtn').addEventListener('click', ()=> q('#pickup').scrollIntoView({behavior:'smooth'}));
  if(q('#contactScroll')) q('#contactScroll').addEventListener('click', ()=> q('#contactUs').scrollIntoView({behavior:'smooth'}));
  if(q('#shareBtn')) q('#shareBtn').addEventListener('click', async ()=>{ const url=window.location.href; if(navigator.share){ try{ await navigator.share({title:'M.D. Dry Cleaners', text:'Book a pickup', url}); return; }catch(e){} } try{ await navigator.clipboard.writeText(url); alert('Link copied'); }catch(e){ prompt('Copy link', url); } });

}); // DOMContentLoaded end
