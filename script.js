// Final script for M.D. Dry Cleaners - centered logo version
GAS_ENDPOINT = "https://script.google.com/macros/s/AKfycbz3OFTq6fBrwQHVZcUwztiB49NIaLAWTGR40pkvBS-tlPLFE29VdkJYLJ_FQ3xWpdHX/exec";

const SERVICES = {
  "Clothing": [
    {
      "id": "shirt",
      "name": "Shirt",
      "price": 80
    },
    {
      "id": "tshirt",
      "name": "T-shirt",
      "price": 70
    },
    {
      "id": "jeans",
      "name": "Jeans",
      "price": 150
    },
    {
      "id": "trousers",
      "name": "Trousers",
      "price": 120
    },
    {
      "id": "dress",
      "name": "Dress",
      "price": 200
    },
    {
      "id": "pajama",
      "name": "Pajama",
      "price": 90
    },
    {
      "id": "leggings",
      "name": "Leggings",
      "price": 80
    },
    {
      "id": "sweatshirt",
      "name": "Sweatshirt",
      "price": 180
    },
    {
      "id": "sweater",
      "name": "Sweater",
      "price": 220
    },
    {
      "id": "jacket",
      "name": "Jacket",
      "price": 350
    }
  ],
  "Traditional & Ethnic": [
    {
      "id": "kurta",
      "name": "Kurta / Kameez",
      "price": 120
    },
    {
      "id": "dupatta",
      "name": "Dupatta",
      "price": 50
    },
    {
      "id": "blouse",
      "name": "Blouse",
      "price": 60
    },
    {
      "id": "saree",
      "name": "Saree",
      "price": 300
    },
    {
      "id": "sherwani",
      "name": "Sherwani",
      "price": 1200
    },
    {
      "id": "lehenga",
      "name": "Lehenga",
      "price": 1000
    },
    {
      "id": "plazo",
      "name": "Plazo",
      "price": 110
    },
    {
      "id": "cord_set",
      "name": "Cord-set",
      "price": 180
    }
  ],
  "Outerwear & Winter": [
    {
      "id": "2piece",
      "name": "2-piece Coat",
      "price": 450
    },
    {
      "id": "3piece",
      "name": "3-piece Coat",
      "price": 600
    },
    {
      "id": "shawl",
      "name": "Shawl",
      "price": 200
    },
    {
      "id": "blanket",
      "name": "Blanket",
      "price": 350
    },
    {
      "id": "quilt",
      "name": "Quilt (Rajai)",
      "price": 600
    },
    {
      "id": "sweater2",
      "name": "Sweater (wool)",
      "price": 240
    }
  ],
  "Home & Household": [
    {
      "id": "bedsheet",
      "name": "Bedsheet",
      "price": 250
    },
    {
      "id": "pillow",
      "name": "Pillow Cover",
      "price": 60
    },
    {
      "id": "cushion_cover",
      "name": "Cushion Cover",
      "price": 80
    },
    {
      "id": "sofa",
      "name": "Sofa Cover",
      "price": 800
    },
    {
      "id": "curtain",
      "name": "Curtain",
      "price": 300
    },
    {
      "id": "carpet",
      "name": "Carpet",
      "price": 1200
    }
  ],
  "Accessories & Others": [
    {
      "id": "bag",
      "name": "Bag",
      "price": 250
    },
    {
      "id": "shoes",
      "name": "Shoes (Pair)",
      "price": 250
    },
    {
      "id": "raffu",
      "name": "Raffu",
      "price": 150
    },
    {
      "id": "steam",
      "name": "Steam Press",
      "price": 40
    },
    {
      "id": "blanket_small",
      "name": "Small Blanket",
      "price": 200
    }
  ]
};

function q(s){return document.querySelector(s)}
function create(t,cls){let e=document.createElement(t); if(cls) e.className=cls; return e}

// render services
const grids = q('#serviceGrids');
for(const cat in SERVICES){
  const sec = create('div','cat');
  const h = create('h4'); h.textContent = cat; sec.appendChild(h);
  const grid = create('div','grid'); grid.style.display='grid'; grid.style.gridTemplateColumns='repeat(auto-fill,minmax(200px,1fr))'; grid.style.gap='10px';
  SERVICES[cat].forEach(s=>{
    const card = create('div','svc'); card.style.padding='8px'; card.style.border='1px solid #eef6ff'; card.style.borderRadius='8px'; card.style.display='flex'; card.style.justifyContent='space-between'; card.style.alignItems='center';
    const left = create('div'); const name=create('div'); name.textContent=s.name; name.style.fontWeight='600'; const price=create('div'); price.textContent='₹'+s.price; price.style.color='#1A2E8D'; price.style.marginTop='6px'; left.appendChild(name); left.appendChild(price);
    const ctr=create('div'); ctr.style.display='flex'; ctr.style.gap='6px'; ctr.style.alignItems='center'; const dec=create('button'); dec.textContent='-'; const inp=create('input'); inp.type='number'; inp.min=0; inp.value=0; inp.dataset.id=s.id; inp.style.width='56px'; const inc=create('button'); inc.textContent='+'; ctr.appendChild(dec); ctr.appendChild(inp); ctr.appendChild(inc);
    card.appendChild(left); card.appendChild(ctr); grid.appendChild(card);
    inc.addEventListener('click', ()=>{ inp.value=Number(inp.value)+1; updateCart(inp)});
    dec.addEventListener('click', ()=>{ inp.value=Math.max(0,Number(inp.value)-1); updateCart(inp)});
    inp.addEventListener('input', ()=> updateCart(inp));
  });
  sec.appendChild(grid); grids.appendChild(sec);
}

let cart={};
function updateCart(input){ const id=input.dataset.id; const qty=Number(input.value)||0; const svc=Object.values(SERVICES).flat().find(s=>s.id===id); if(!svc) return; if(qty<=0) delete cart[id]; else cart[id]={...svc,qty,subtotal:svc.price*qty}; renderSummary(); }
function renderSummary(){ const summary=q('#summary'); summary.innerHTML=''; const items=Object.values(cart); if(items.length===0){ summary.innerHTML='<div class="summary-empty">No items selected</div>'; q('#total').textContent='₹0'; return;} items.forEach(it=>{ const r=create('div'); r.textContent=`${it.name} x ${it.qty} = ₹${it.subtotal}`; summary.appendChild(r); }); const total=items.reduce((s,i)=>s+i.subtotal,0); q('#total').textContent='₹'+total}

const slots=[{id:'10-12',label:'10:00 AM - 12:00 PM'},{id:'12-14',label:'12:00 PM - 2:00 PM'},{id:'14-16',label:'2:00 PM - 4:00 PM'},{id:'16-18',label:'4:00 PM - 6:00 PM'},{id:'18-20',label:'6:00 PM - 8:00 PM'}];
function populateSlots(dateStr){ const sel=q('#slot'); sel.innerHTML='<option value="">Select slot</option>'; const today=new Date(); const chosen=new Date(dateStr+'T00:00:00'); const nowH=today.getHours(); slots.forEach(s=>{ let disabled=false; if(chosen.toDateString()===today.toDateString()){ const end=Number(s.id.split('-')[1]); if(nowH>=end) disabled=true;} const opt=create('option'); opt.value=s.id; opt.textContent=s.label+(disabled?' (unavailable)':''); if(disabled) opt.disabled=true; sel.appendChild(opt); }); }
(function(){ const d=new Date(); const yyyy=d.getFullYear(), mm=String(d.getMonth()+1).padStart(2,'0'), dd=String(d.getDate()).padStart(2,'0'); q('#date').value=`${yyyy}-${mm}-${dd}`; q('#date').min=`${yyyy}-${mm}-${dd}`; populateSlots(q('#date').value); })(); q('#date').addEventListener('change', ()=> populateSlots(q('#date').value));

q('#clearBtn').addEventListener('click', ()=>{ document.querySelectorAll('input[type=number]').forEach(i=>i.value=0); cart={}; renderSummary(); q('#pickupForm').reset(); const d=new Date(); const yyyy=d.getFullYear(), mm=String(d.getMonth()+1).padStart(2,'0'), dd=String(d.getDate()).padStart(2,'0'); q('#date').value=`${yyyy}-${mm}-${dd}`; populateSlots(q('#date').value); });

q('#pickupForm').addEventListener('submit', async (e)=>{ e.preventDefault(); if(Object.values(cart).length===0){ alert('Please select at least one service'); return;} const name=q('#name').value.trim(), phone=q('#phone').value.trim(), address=q('#address').value.trim(); const date=q('#date').value, slot=q('#slot').value, notes=q('#notes').value.trim(); if(!name||!phone||!address||!date||!slot){ alert('Please fill all required fields'); return;} const items=Object.values(cart).map(i=>({id:i.id,name:i.name,qty:i.qty,subtotal:i.subtotal})); const total=items.reduce((s,i)=>s+i.subtotal,0);
  q('#loading').style.display='flex'; q('#submitBtn').disabled=true; q('#clearBtn').disabled=true;
  try{ await fetch(GAS_ENDPOINT, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({name,phone,address,selectedServices:items,pickupDate:date,pickupTime:slot,totalAmount:total})}); }catch(err){ console.warn('Save to GAS failed', err); }
  q('#loading').style.display='none'; q('#submitBtn').disabled=false; q('#clearBtn').disabled=false; showPopup(); document.querySelectorAll('input[type=number]').forEach(i=>i.value=0); cart={}; renderSummary(); q('#pickupForm').reset(); const d=new Date(); const yyyy=d.getFullYear(), mm=String(d.getMonth()+1).padStart(2,'0'), dd=String(d.getDate()).padStart(2,'0'); q('#date').value=`${yyyy}-${mm}-${dd}`; populateSlots(q('#date').value);
});
function showPopup(){ const p=q('#confirmPopup'); p.style.display='flex'; p.setAttribute('aria-hidden','false'); }
q('#closePopup').addEventListener('click', ()=>{ const p=q('#confirmPopup'); p.style.display='none'; p.setAttribute('aria-hidden','true'); });
q('#callBtn').addEventListener('click', ()=>{ if(confirm('Call 9821266799? Press OK for 9821266799, Cancel for 9811993799')){ location.href='tel:+919821266799'; } else { location.href='tel:+919811993799'; }});
q('#waBtn').addEventListener('click', ()=>{ const text=encodeURIComponent("Hi! I'd like to schedule a pickup from M.D. Dry Cleaners."); window.open('https://wa.me/919821266799?text='+text,'_blank'); });
q('#contactBtn').addEventListener('click', ()=> q('#contactUs').scrollIntoView({behavior:'smooth', block:'start'})); q('#pickupBtn').addEventListener('click', ()=> q('#pickup').scrollIntoView({behavior:'smooth', block:'start'}));
q('#shareBtn').addEventListener('click', async ()=>{ const url=window.location.href; if(navigator.share){ try{ await navigator.share({title:'M.D. Dry Cleaners', text:'Book a pickup', url}); return;}catch(e){} } try{ await navigator.clipboard.writeText(url); alert('Link copied to clipboard'); }catch(e){ prompt('Copy this link', url); } });
q('#maps').href='https://www.google.com/maps/place/M.D.+Drycleaners/@28.5780651,77.2093911,21z/data=!4m6!3m5!1s0x390ce3aa00a20ac1:0x6c1740f1ef27efb4!8m2!3d28.5780459!4d77.2094476!16s%2Fg%2F11whv4vj7v?entry=ttu&g_ep=EgoyMDI1MTAyOS4yIKXMDSoASAFQAw%3D%3D';

q('#closePopup').addEventListener('keydown', (e)=>{ if(e.key==='Enter') q('#closePopup').click(); });
