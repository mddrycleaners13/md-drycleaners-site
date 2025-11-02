const GAS_ENDPOINT = "https://script.google.com/macros/s/AKfycbz3OFTq6fBrwQHVZcUwztiB49NIaLAWTGR40pkvBS-tlPLFE29VdkJYLJ_FQ3xWpdHX/exec";

document.addEventListener('DOMContentLoaded',()=>{
 const contactBtn=document.getElementById('contactPopupBtn');
 const contactPopup=document.getElementById('contactPopup');
 const contactCancel=document.getElementById('contactCancel');
 const contactForm=document.getElementById('contactForm');
 const confirmPopup=document.getElementById('confirmPopup');
 const closePopup=document.getElementById('closePopup');

 if(contactBtn)contactBtn.addEventListener('click',()=>{contactPopup.style.display='flex';});
 if(contactCancel)contactCancel.addEventListener('click',()=>{contactPopup.style.display='none';});
 if(closePopup)closePopup.addEventListener('click',()=>{confirmPopup.style.display='none';});

 if(contactForm){
   contactForm.addEventListener('submit',async e=>{
     e.preventDefault();
     const name=document.getElementById('c_name').value.trim();
     const phone=document.getElementById('c_phone').value.trim();
     const message=document.getElementById('c_message').value.trim();
     if(!name||!phone||!message){alert('Please fill all fields');return;}
     try{
       await fetch(GAS_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({formType:'contact',name,phone,message})});
     }catch(e){console.log(e);}
     contactPopup.style.display='none';confirmPopup.style.display='flex';contactForm.reset();
   });
 }

 const waLink=document.getElementById('waLink');
 if(waLink)waLink.addEventListener('click',e=>{
   e.preventDefault();
   window.open('https://wa.me/919821266799?text='+encodeURIComponent('Hi! I would like to schedule a pickup from M.D. Dry Cleaners.'),'_blank');
 });
});
