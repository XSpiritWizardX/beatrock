const waitlistForm = document.getElementById('waitlist-form');

if (waitlistForm) {
  waitlistForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Waitlist form submitted.');
  });
}

const heroSection = document.querySelector('.hero');

if (heroSection) {
  heroSection.classList.add('reveal');
}
