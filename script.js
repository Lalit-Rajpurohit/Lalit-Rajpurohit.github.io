/* ========================================
   PORTFOLIO SCRIPTS - Lalit Rajpurohit
   ========================================

   Table of Contents:
   1. Mobile Navigation Toggle
   2. Smooth Scroll
   3. Auto-close Nav on Scroll
   4. Contact Form Handler
======================================== */

document.addEventListener('DOMContentLoaded', function() {

  /* ========================================
     1. MOBILE NAVIGATION TOGGLE
  ======================================== */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  /* ========================================
     2. SMOOTH SCROLL
  ======================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();

      // Close mobile nav if open
      if (navLinks) {
        navLinks.classList.remove('active');
      }

      // Smooth scroll to target
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  /* ========================================
     3. AUTO-CLOSE NAV ON SCROLL
  ======================================== */
  let scrollTimer;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      if (window.innerWidth <= 1510 && navLinks) {
        navLinks.classList.remove('active');
      }
    }, 10);
  });

  /* ========================================
     4. CONTACT FORM HANDLER
  ======================================== */
  const contactForm = document.getElementById('contactsform');

  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const formData = {
        name: this.name.value,
        email: this.email.value,
        sub: this.subject.value,
        message: this.message.value
      };

      try {
        const response = await fetch('https://0w2rgqkyac.execute-api.ap-south-1.amazonaws.com/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
          this.reset();
          alert('Message sent successfully!\nI will reach out to you via email from rajpurohitlalit181@gmail.com.\nPlease check your spam folder if you do not see it in your inbox.');
        } else {
          alert('Failed to send message: ' + result.message);
        }
      } catch (error) {
        alert('Error: ' + error.message);
      }
    });
  }

});
