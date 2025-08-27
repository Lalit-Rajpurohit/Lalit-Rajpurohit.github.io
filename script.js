/* ---------- MOBILE NAV TOGGLE ---------- */
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.onclick = () => navLinks.classList.toggle('active');

/* ---------- SMOOTH SCROLL ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    navLinks.classList.remove('active');
    document.querySelector(anchor.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

/* ---------- AUTO-CLOSE NAV ON SCROLL (mobile & tablet) ---------- */

let scrollTimer;
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    if (window.innerWidth <= 768) {
      navLinks.classList.remove('active');
    }
  }, 10);   // 100 ms after the last scroll event
});


// contact form 

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contactsform');

  form.addEventListener('submit', async function (e) {
    e.preventDefault(); // ✅ Prevent page refresh
console.log("test");
    const data = {
      name: form.name.value,
      email: form.email.value,
      sub: form.subject.value,
      message: form.message.value
    };

    try {
      const response = await fetch('https://0w2rgqkyac.execute-api.ap-south-1.amazonaws.com/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        form.reset(); // ✅ Clear the form
        alert('✅ Message sent successfully! \n I will reach out to you via email from my address rajpurohitlalit181@gmail.com. \n Please check your spam folder if you do not see it in your inbox');
      } else {
        alert('❌ Failed to send message: ' + result.message);
      }
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
  });
});
