// Add light interactivity (reveal or waitlist)
const hero = document.querySelector('.hero');
hero.classList.add('reveal');

// Waitlist form submission handler
const waitlistForm = document.getElementById('waitlist-form');
waitlistForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = waitlistForm.email.value;
  console.log(`User joined the waitlist with email: ${email}`);
});
