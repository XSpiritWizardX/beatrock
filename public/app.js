const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

reveals.forEach((el) => observer.observe(el));

const form = document.getElementById('waitlist-form');
const note = document.getElementById('form-note');

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = form.querySelector('input[name="email"]');
    const email = input ? input.value.trim() : '';

    if (!email) return;

    form.reset();
    note.textContent = `Thanks! ${email} is on the list.`;
    note.style.opacity = '1';
  });
}
