const waitlistForm = document.getElementById('waitlist-form');
if (waitlistForm) {
  waitlistForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = waitlistForm.email.value;
    console.log(`Email submitted: ${email}`);
  });
}
