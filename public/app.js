const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  { threshold: 0.2 }
);
revealItems.forEach(item => revealObserver.observe(item));

const form = document.getElementById('waitlist-form');
const message = document.getElementById('waitlist-message');
if (form && message) {
  form.addEventListener('submit', event => {
    event.preventDefault();
    message.textContent = 'You are on the list. We will be in touch soon.';
    form.reset();
  });
}
