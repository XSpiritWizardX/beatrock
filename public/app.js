document.addEventListener('DOMContentLoaded', function() {
  const waitlistForm = document.getElementById('waitlist-form');
  if (waitlistForm) {
    waitlistForm.addEventListener('submit', function(event) {
      event.preventDefault();
      console.log('Waitlist form submitted.');
    });
  }
});
