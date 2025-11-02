
document.addEventListener('DOMContentLoaded', function(){
  const GAS_ENDPOINT = "https://script.google.com/macros/s/AKfycbw8c4fjzl-rteNlO8z1V03T91EixcSUZ_E4xGlZE3yzx-xYIaL0yN7J-sMfntw3Jcfy/exec";
  const q = s => document.querySelector(s);
  const SERVICES = {"Clothing": [{"id": "shirt", "name": "Shirt", "price": 80}, {"id": "tshirt", "name": "T-shirt", "price": 70}, {"id": "jeans", "name": "Jeans", "price": 150}, {"id": "trousers", "name": "Trousers", "price": 120}, {"id": "dress", "name": "Dress", "price": 200}, {"id": "pajama", "name": "Pajama", "price": 90}, {"id": "leggings", "name": "Leggings", "price": 80}, {"id": "cord_set", "name": "Cord-set", "price": 180}, {"id": "plazo", "name": "Plazo", "price": 110}], "Traditional & Ethnic": [{"id": "dupatta", "name": "Dupatta", "price": 50}, {"id": "blouse", "name": "Blouse", "price": 60}, {"id": "saree", "name": "Saree", "price": 300}, {"id": "sherwani", "name": "Sherwani", "price": 1200}, {"id": "lehenga", "name": "Lehenga", "price": 1000}], "Outerwear & Winter": [{"id": "2piece", "name": "2-piece Coat", "price": 450}, {"id": "3piece", "name": "3-piece Coat", "price": 600}, {"id": "sweatshirt", "name": "Sweatshirt", "price": 180}, {"id": "sweater", "name": "Sweater", "price": 220}, {"id": "jacket", "name": "Jacket", "price": 350}, {"id": "shawl", "name": "Shawl", "price": 200}], "Home & Household": [{"id": "bedsheet", "name": "Bedsheet", "price": 250}, {"id": "pillow_cover", "name": "Pillow Cover", "price": 60}, {"id": "cushion_cover", "name": "Cushion Cover", "price": 80}, {"id": "sofa_cover", "name": "Sofa Cover", "price": 800}, {"id": "curtain", "name": "Curtain", "price": 300}, {"id": "blanket", "name": "Blanket", "price": 350}, {"id": "quilt", "name": "Quilt (Rajai)", "price": 600}, {"id": "carpet", "name": "Carpet", "price": 1200}], "Accessories & Other": [{"id": "bag", "name": "Bag", "price": 250}, {"id": "shoes", "name": "Shoes (Pair)", "price": 250}, {"id": "raffu", "name": "Raffu", "price": 150}, {"id": "steam", "name": "Steam Press", "price": 40}]};

  const container = q('#serviceGrids');
  for (const cat of Object.keys(SERVICES)) {
    const section = document.createElement('div');
    section.className = 'service-section';
    const h4 = document.createElement('h4'); h4.textContent = cat; section.appendChild(h4);
    const list = document.createElement('div'); list.className = 'service-list';
    SERVICES[cat].forEach(s => {
      const item = document.createElement('div'); item.className = 'service-item';
      const left = document.createElement('div'); left.className = 'left'; left.textContent = s.name;
      const right = document.createElement('div'); right.className = 'right'; right.textContent = '₹' + s.price;
      const qty = document.createElement('input'); qty.type = 'number'; qty.min = 0; qty.value = 0; qty.dataset.id = s.id; qty.style.width = '60px'; qty.style.marginLeft='12px';
      const ctr = document.createElement('div'); ctr.style.display='flex'; ctr.style.alignItems='center';
      const dec = document.createElement('button'); dec.textContent='-'; dec.style.marginRight='6px';
      const inc = document.createElement('button'); inc.textContent='+'; inc.style.marginLeft='6px';
      ctr.appendChild(dec); ctr.appendChild(qty); ctr.appendChild(inc);
      item.appendChild(left); item.appendChild(right); item.appendChild(ctr);
      list.appendChild(item);

      inc.addEventListener('click', () => { qty.value = Number(qty.value) + 1; updateCart(qty); });
      dec.addEventListener('click', () => { qty.value = Math.max(0, Number(qty.value) - 1); updateCart(qty); });
      qty.addEventListener('input', () => updateCart(qty));
    });
    section.appendChild(list);
    container.appendChild(section);
  }

  let cart = {};
  function updateCart(input){ const id = input.dataset.id; const qty = Number(input.value)||0; let svc=null; for(const c in SERVICES){ svc = SERVICES[c].find(x=>x.id===id); if(svc) break; } if(!svc) return; if(qty<=0) delete cart[id]; else cart[id] = Object.assign({}, svc, {qty:qty, subtotal: svc.price*qty}); renderSummary(); }
  function renderSummary(){ const summary = q('#summary'); summary.innerHTML=''; const items = Object.values(cart); if(items.length===0){ summary.innerHTML = '<div class="summary-empty">No items selected</div>'; q('#total').textContent='₹0'; return; } items.forEach(it=>{ const r = document.createElement('div'); r.textContent = it.name + ' x ' + it.qty + ' = ₹' + it.subtotal; summary.appendChild(r); }); const total = items.reduce((s,i)=>s+i.subtotal,0); q('#total').textContent='₹'+total; }

  const slots = [{id:'10-12',label:'10:00 AM - 12:00 PM'},{id:'12-14',label:'12:00 PM - 2:00 PM'},{id:'14-16',label:'2:00 PM - 4:00 PM'},{id:'16-18',label:'4:00 PM - 6:00 PM'},{id:'18-20',label:'6:00 PM - 8:00 PM'}];
  function populateSlots(dateStr){ const sel = q('#slot'); if(!sel) return; sel.innerHTML='<option value="">Select slot</option>'; const today = new Date(); const chosen = new Date(dateStr + 'T00:00:00'); const nowH = today.getHours(); slots.forEach(s=>{ let disabled=false; if(chosen.toDateString()===today.toDateString()){ const end=Number(s.id.split('-')[1]); if(nowH>=end) disabled=true } const opt=document.createElement('option'); opt.value=s.id; opt.textContent=s.label + (disabled? ' (unavailable)':''); if(disabled) opt.disabled=true; sel.appendChild(opt); }); }

  (function(){ const d=new Date(); const yyyy=d.getFullYear(), mm=String(d.getMonth()+1).padStart(2,'0'), dd=String(d.getDate()).padStart(2,'0'); if(q('#date')){ q('#date').value = yyyy+'-'+mm+'-'+dd; q('#date').min = yyyy+'-'+mm+'-'+dd; populateSlots(q('#date').value); q('#date').addEventListener('change', ()=> populateSlots(q('#date').value)); } })();

  if(q('#clearBtn')) q('#clearBtn').addEventListener('click', ()=>{ document.querySelectorAll('input[type=number]').forEach(i=>i.value=0); cart={}; renderSummary(); if(q('#pickupForm')){ q('#pickupForm').reset(); populateSlots(q('#date').value); } });

  async function sendToGAS(payload){ try{ const res = await fetch(GAS_ENDPOINT, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload), mode:'cors'}); const text = await res.text(); console.log('GAS response ->', text); return {ok:true, text}; }catch(err){ console.error('GAS send error', err); return {ok:false, error: String(err)}; } }

  if(q('#pickupForm')) q('#pickupForm').addEventListener('submit', async (e)=>{ e.preventDefault(); if(Object.values(cart).length===0){ alert('Please select at least one service'); return; } const name=q('#name').value.trim(), phone=q('#phone').value.trim(), address=q('#address').value.trim(), date=q('#date').value, slot=q('#slot').value, notes=q('#notes').value.trim(); if(!name||!phone||!address||!date||!slot){ alert('Please fill all required fields'); return; } const items=Object.values(cart).map(i=>({id:i.id,name:i.name,qty:i.qty,subtotal:i.subtotal})); const total=items.reduce((s,i)=>s+i.subtotal,0); q('#loading').style.display='flex'; q('#submitBtn').disabled=true; q('#clearBtn').disabled=true; const payload={formType:'pickup', name, phone, address, pickupDate:date, pickupTime:slot, items, total, notes}; const result = await sendToGAS(payload); q('#loading').style.display='none'; q('#submitBtn').disabled=false; q('#clearBtn').disabled=false; if(result.ok){ console.log('✅ Pickup request saved ->', result.text); showConfirm(); showToast('✅ Pickup saved'); } else { console.error('❌ Pickup failed ->', result.error); showToast('❌ Error saving pickup'); } q('#pickupForm').reset(); document.querySelectorAll('input[type=number]').forEach(i=>i.value=0); cart={}; renderSummary(); });

  if(q('#contactPopupBtn')) q('#contactPopupBtn').addEventListener('click', ()=>{ q('#contactPopup').style.display='flex'; });
  if(q('#contactCancel')) q('#contactCancel').addEventListener('click', ()=>{ q('#contactPopup').style.display='none'; });
  if(q('#contactForm')) q('#contactForm').addEventListener('submit', async (e)=>{ e.preventDefault(); const name=q('#c_name').value.trim(), phone=q('#c_phone').value.trim(), message=q('#c_message').value.trim(); if(!name||!phone||!message){ alert('Please fill all fields'); return; } q('#loading').style.display='flex'; const payload={formType:'contact', name, phone, message}; const result = await sendToGAS(payload); q('#loading').style.display='none'; if(result.ok){ console.log('✅ Contact saved ->', result.text); showConfirm(); showToast('✅ Message sent'); } else { console.error('❌ Contact failed ->', result.error); showToast('❌ Error sending message'); } q('#contactPopup').style.display='none'; q('#contactForm').reset(); });

  function showConfirm(){ const c=q('#confirmPopup'); c.style.display='flex'; setTimeout(()=> c.style.display='none', 2800); }
  document.addEventListener('click', function(e){ if(e.target && e.target.id === 'closePopup'){ q('#confirmPopup').style.display='none'; } }, true);
  function showToast(msg){ const t=q('#toast'); t.textContent = msg; t.style.display = 'block'; setTimeout(()=> t.style.display = 'none', 3800); }

  if(q('#callBtn')) q('#callBtn').addEventListener('click', ()=>{ if(confirm('Call 9821266799? Press OK for 9821266799, Cancel for 9811993799')){ location.href='tel:+919821266799'; } else { location.href='tel:+919811993799'; } });
  if(q('#waBtn')) q('#waBtn').addEventListener('click', ()=>{ const text=encodeURIComponent("Hi! I'd like to schedule a pickup from M.D. Dry Cleaners."); window.open('https://wa.me/919821266799?text='+text, '_blank'); });

  if(q('#pickupBtn')) q('#pickupBtn').addEventListener('click', ()=> q('#pickup').scrollIntoView({behavior:'smooth'}));
  if(q('#contactScroll')) q('#contactScroll').addEventListener('click', ()=> q('#contactUs').scrollIntoView({behavior:'smooth'}));
});
