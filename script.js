
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("pickupForm");
  const loading = document.getElementById("loading");
  const successMessage = document.getElementById("successMessage");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    loading.classList.remove("hidden");

    fetch("https://script.google.com/macros/s/AKfycbz3OFTq6fBrwQHVZcUwztiB49NIaLAWTGR40pkvBS-tlPLFE29VdkJYLJ_FQ3xWpdHX/exec", {
      method: "POST",
      body: new FormData(form)
    })
    .then(() => {
      loading.classList.add("hidden");
      successMessage.classList.remove("hidden");
      form.reset();
      setTimeout(() => successMessage.classList.add("hidden"), 4000);
    })
    .catch(() => {
      loading.textContent = "Error submitting. Please try again.";
    });
  });

  // Contact popup
  const popupBtn = document.getElementById("contactPopupBtn");
  const popup = document.getElementById("contactPopup");
  const closePopup = document.getElementById("closePopup");

  popupBtn.addEventListener("click", () => popup.classList.remove("hidden"));
  closePopup.addEventListener("click", () => popup.classList.add("hidden"));

  const contactForm = document.getElementById("contactForm");
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    fetch("https://script.google.com/macros/s/AKfycbz3OFTq6fBrwQHVZcUwztiB49NIaLAWTGR40pkvBS-tlPLFE29VdkJYLJ_FQ3xWpdHX/exec", {
      method: "POST",
      body: new FormData(contactForm)
    })
    .then(() => {
      alert("✅ Thank you! We’ll get back to you soon.");
      contactForm.reset();
      popup.classList.add("hidden");
    })
    .catch(() => alert("❌ Error sending message."));
  });
});
