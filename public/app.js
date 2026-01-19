document.addEventListener('DOMContentLoaded', function() {
  const pricingEstimator = document.querySelector('.pricing-estimator');
  const waitlistStatus = document.querySelector('[data-waitlist-status]');

  // Add interactivity to the range input
  const teamSizeInput = document.getElementById('team-size');
  teamSizeInput.addEventListener('input', function() {
    const value = parseInt(teamSizeInput.value);
    document.querySelector('[data-team-size]').textContent = value;
  });

  // Add interactivity to the checkbox
  const billingToggle = document.getElementById('billing-toggle');
  billingToggle.addEventListener('change', function() {
    if (this.checked) {
      document.querySelector('.estimator-total span[data-price]').textContent = '$96';
    } else {
      document.querySelector('.estimator-total span[data-price]').textContent = '$120';
    }
  });

  // Update the waitlist status
  pricingEstimator.addEventListener('input', function() {
    const teamSize = parseInt(teamSizeInput.value);
    const billing = billingToggle.checked ? 'Annual' : 'Monthly';
    waitlistStatus.textContent = `You are on our ${billing} waitlist for a team of ${teamSize} members.`;
  });
});
