const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const form = document.getElementById('waitlist-form');
const emailInput = document.getElementById('email');
const note = document.getElementById('form-note');
const submit = document.getElementById('waitlist-submit');

if (form && emailInput && note && submit) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!valid) {
      note.textContent = 'Enter a valid work email to join the list.';
      note.style.color = '#ffd4c7';
      return;
    }

    submit.disabled = true;
    submit.textContent = 'Saving...';
    note.textContent = '';

    window.setTimeout(() => {
      note.textContent = 'You are in. We will send your early access invite soon.';
      note.style.color = '#b8ffe4';
      form.reset();
      submit.disabled = false;
      submit.textContent = 'Join the waitlist';
    }, 800);
  });
}
