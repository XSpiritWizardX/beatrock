const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

reveals.forEach((el) => observer.observe(el));

const form = document.getElementById('waitlist-form');
const message = document.getElementById('form-message');
const count = document.getElementById('waitlist-count');

const baseCount = 2184;
const storedCount = Number(localStorage.getItem('beatrock_waitlist_count') || baseCount);
count.textContent = `${storedCount.toLocaleString()} teams waiting`;

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value.trim();
  const name = document.getElementById('name').value.trim();

  if (!email || !email.includes('@')) {
    message.textContent = 'Add a valid email to join the waitlist.';
    return;
  }

  message.textContent = `Thanks${name ? `, ${name}` : ''}! You\'re on the list.`;
  const nextCount = storedCount + 1;
  localStorage.setItem('beatrock_waitlist_count', String(nextCount));
  localStorage.setItem('beatrock_waitlist_email', email);
  count.textContent = `${nextCount.toLocaleString()} teams waiting`;
  form.reset();
});
