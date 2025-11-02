document.addEventListener('DOMContentLoaded', function(){
  const GAS_ENDPOINT = "https://script.google.com/macros/s/AKfycbw8c4fjzl-rteNlO8z1V03T91EixcSUZ_E4xGlZE3yzx-xYIaL0yN7J-sMfntw3Jcfy/exec";

  const q = s => document.querySelector(s);
  const SERVICES = {
    "Clothing": [
      {id:"shirt", name:"Shirt", price:80},
      {id:"tshirt", name:"T-shirt", price:70},
      {id:"jeans", name:"Jeans", price:150},
      {id:"trousers", name:"Trousers", price:120},
      {id:"dress", name:"Dress", price:200},
      {id:"pajama", name:"Pajama", price:90},
      {id:"leggings", name:"Leggings", price:80},
      {id:"cordset", name:"Cord-set", price:180},
      {id:"plazo", name:"Plazo", price:110}
    ],
    "Traditional & Ethnic": [
      {id:"dupatta", name:"Dupatta", price:50},
      {id:"blouse", name:"Blouse", price:60},
      {id:"saree", name:"Saree", price:300},
      {id:"sherwani", name:"Sherwani", price:1200},
      {id:"lehenga", name:"Lehenga", price:1000}
    ],
    "Outerwear & Winter": [
      {id:"2piece", name:"2-piece Coat", price:450},
      {id:"3piece", name:"3-piece Coat", price:600},
      {id:"sweatshirt", name:"Sweatshirt", price:180},
      {id:"sweater", name:"Sweater", price:220},
      {id:"jacket", name:"Jacket", price:350},
      {id:"shawl", name:"Shawl", price:200}
    ],
    "Home & Household": [
      {id:"bedsheet", name:"Bedsheet", price:250},
      {id:"pillowcover", name:"Pillow Cover", price:60},
      {id:"cushioncover", name:"Cushion Cover", price:80},
      {id:"sofacover", name:"Sofa Cover", price:800},
      {id:"curtain", name:"Curtain", price:300},
      {id:"blanket", name:"Blanket", price:350},
      {id:"quilt", name:"Quilt (Rajai)", price:600},
      {id:"carpet", name:"Carpet", price:1200}
    ],
    "Accessories & Other": [
      {id:"bag", name:"Bag", price:250},
      {id:"shoes", name:"Shoes (Pair)", price:250},
      {id:"raffu", name:"Raffu", price:150},
      {id:"steam", name:"Steam Press", price:40}
    ]
  };

  // Render services grid
  const container = q('#serviceGrids');
  for (const category in SERVICES) {
    const section = document.createElement('div');
    section.className = 'service-section';
    const title = document.createElement('h4');
    title.textContent = category;
    section.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'service-grid';
    SERVICES[category].forEach(item => {
      const card = document.createElement('div');
      card.className = 'service-card';
      const left = document.createElement('div');
      left.innerHTML = `<strong>${item.name}</strong><br>₹${item.price}`;
      const ctr = document.createElement('div');
      ctr.style.display = 'flex';
      ctr.style.gap = '8px';
      ctr.style.alignItems = 'center';
      const dec = document.createElement('button');
      dec.textContent = '-';
      const inp = document.createElement('input');
      inp.type = 'number'; inp.min = 0; inp.value = 0;
      inp.dataset.id = item.id;
      inp.style.width = '50px';
      const inc = document.createElement('button');
      inc.textContent = '+';
      ctr.append(dec, inp, inc);
      card.append(left, ctr);
      grid.appendChild(card);

      inc.addEventListener('click', () => { inp.value = +inp.value + 1; updateCart(inp); });
      dec.addEventListener('click', () => { inp.value = Math.max(0, +inp.value - 1); updateCart(inp); });
      inp.addEventListener('input', () => updateCart(inp));
    });
    section.appendChild(grid);
    container.appendChild(section);
  }

  let cart = {};
  function updateCart(input){
    const id = input.dataset.id;
    const qty = Number(input.value) || 0;
    let svc;
    for (const cat in SERVICES){
      svc = SERVICES[cat].find(s => s.id === id);
      if (svc) break;
    }
    if (!svc) return;
    if (qty <= 0) delete cart[id];
    else cart[id] = {...svc, qty, subtotal: svc.price * qty};
    renderSummary();
  }

  function renderSummary(){
    const summary = q('#summary');
    const totalEl = q('#total');
    const items = Object.values(cart);
    if (items.length === 0){
      summary.innerHTML = '<div class="summary-empty">No items selected</div>';
      totalEl.textContent = '₹0';
      return;
    }
    summary.innerHTML = items.map(i => `${i.name} x ${i.qty} = ₹${i.subtotal}`).join('<br>');
    const total = items.reduce((s, i) => s + i.subtotal, 0);
    totalEl.textContent = '₹' + total;
  }

  // Slots logic
  const slots = [
    {id:'10-12', label:'10:00 AM - 12:00 PM'},
    {id:'12-14', label:'12:00 PM - 2:00 PM'},
    {id:'14-16', label:'2:00 PM - 4:00 PM'},
    {id:'16-18', label:'4:00 PM - 6:00 PM'},
    {id:'18-20', label:'6:00 PM - 8:00 PM'}
  ];
  function populateSlots(dateStr){
    const sel = q('#slot');
    if (!sel) return;
    sel.innerHTML = '<option value="">Select slot</option>';
    const today = new Date();
    const chosen = new Date(dateStr + 'T00:00:00');
    const nowH = today.getHours();
    slots.forEach(s => {
      let disabled = false;
      if (chosen.toDateString() === today.toDateString()){
        const end = Number(s.id.split('-')[1]);
        if (nowH >= end) disabled = true;
      }
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = s.label + (disabled ? ' (unavailable)' : '');
      if (disabled) opt.disabled = true;
      sel.appendChild(opt);
    });
  }

  const dateInput = q('#date');
  if (dateInput){
    const d = new Date();
    const yyyy = d.getFullYear(), mm = String(d.getMonth()+1).padStart(2,'0'), dd = String(d.getDate()).padStart(2,'0');
    dateInput.value = yyyy + '-' + mm + '-' + dd;
    dateInput.min = yyyy + '-' + mm + '-' + dd;
    populateSlots(dateInput.value);
    dateInput.addEventListener('change', () => populateSlots(dateInput.value));
  }

  // Clear form
  q('#clearBtn').addEventListener('click', () => {
    document.querySelectorAll('input[type=number]').forEach(i => i.value = 0);
    cart = {};
    renderSummary();
    q('#pickupForm').reset();
    populateSlots(q('#date').value);
  });

  // Pickup form submit
  q('#pickupForm').addEventListener('submit', async e => {
    e.preventDefault();
    if (Object.values(cart).length === 0) return alert('Please select at least one service.');
    const name = q('#name').value.trim();
    const phone = q('#phone').value.trim();
    const address = q('#address').value.trim();
    const date = q('#date').value;
    const slot = q('#slot').value;
    if (!name || !phone || !address || !slot) return alert('Please fill all fields.');

    const data = {
      formType: 'pickup',
      name, phone, address,
      pickupDate: date,
      pickupTime: slot,
      items: Object.values(cart),
      total: Object.values(cart).reduce((s, i) => s + i.subtotal, 0)
    };

    q('#loading').style.display = 'flex';
    try {
      const res = await fetch(GAS_ENDPOINT, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      });
      const text = await res.text();
      console.log('✅ Pickup request: server response ->', text);
      showConfirm();
      showToast('✅ Pickup saved successfully');
    } catch (err) {
      console.error('❌ Failed to send pickup data:', err);
      showToast('❌ Error sending data');
    }
    q('#loading').style.display = 'none';
    q('#pickupForm').reset();
    document.querySelectorAll('input[type=number]').forEach(i => i.value = 0);
    cart = {};
    renderSummary();
  });

  // Contact form
  q('#contactPopupBtn').addEventListener('click', () => {
    q('#contactPopup').style.display = 'flex';
  });
  q('#contactCancel').addEventListener('click', () => {
    q('#contactPopup').style.display = 'none';
  });
  q('#contactForm').addEventListener('submit', async e => {
    e.preventDefault();
    const name = q('#c_name').value.trim();
    const phone = q('#c_phone').value.trim();
    const message = q('#c_message').value.trim();
    if (!name || !phone || !message) return alert('Please fill all fields.');

    try {
      const res = await fetch(GAS_ENDPOINT, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({formType:'contact', name, phone, message})
      });
      const text = await res.text();
      console.log('✅ Contact message: server response ->', text);
      showConfirm();
      showToast('✅ Message sent');
    } catch (err) {
      console.error('❌ Failed to send contact message:', err);
      showToast('❌ Error sending data');
    }
    q('#contactPopup').style.display = 'none';
    q('#contactForm').reset();
  });

  // Confirmation popup
  function showConfirm(){
    const c = q('#confirmPopup');
    c.style.display = 'flex';
  }
  q('#closePopup').addEventListener('click', () => {
    q('#confirmPopup').style.display = 'none';
  });

  // Toast
  function showToast(msg){
    const t = q('#toast');
    t.textContent = msg;
    t.style.display = 'block';
    setTimeout(() => t.style.display = 'none', 3500);
  }

  // Call & WhatsApp
  q('#callBtn').addEventListener('click', () => {
    if (confirm('Call 9821266799? Press OK for 9821266799, Cancel for 9811993799')){
      location.href = 'tel:+919821266799';
    } else {
      location.href = 'tel:+919811993799';
    }
  });
  q('#waBtn').addEventListener('click', () => {
    const msg = encodeURIComponent("Hi! I'd like to schedule a pickup from M.D. Dry Cleaners.");
    window.open('https://wa.me/919821266799?text=' + msg, '_blank');
  });

  // Scroll
  q('#pickupBtn').addEventListener('click', () => q('#pickup').scrollIntoView({behavior:'smooth'}));
  q('#contactScroll').addEventListener('click', () => q('#contactUs').scrollIntoView({behavior:'smooth'}));
});
