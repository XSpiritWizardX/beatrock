const form = document.querySelector("#waitlist-form");
const message = document.querySelector("#waitlist-message");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const email = String(data.get("email") || "").trim();
    if (!email) {
      return;
    }
    const key = "waitlist";
    const entries = JSON.parse(localStorage.getItem(key) || "[]");
    entries.push({ email, createdAt: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(entries));
    if (message) {
      message.textContent = "Thanks for joining the beatrock waitlist!";
    }
    form.reset();
  });
}
