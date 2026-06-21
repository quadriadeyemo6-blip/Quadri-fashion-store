console.log("CONTACT PAGE LOADED");

document.addEventListener("DOMContentLoaded", () => {
  // Initialize EmailJS
  emailjs.init("tazt7HRNi8CjHIMEU");
  // Example: emailjs.init("XyZAbC123DEF");

  const form = document.getElementById("contact-form");
  const successBox = document.getElementById("contact-success");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("contact-name").value.trim();
    const email = document.getElementById("contact-email").value.trim();
    const message = document.getElementById("contact-message").value.trim();

    if (!name || !email || !message) {
      alert("Please fill in all fields.");
      return;
    }

    // Send email using EmailJS
    emailjs
      .send("service_kzm8vhi", "template_m8tw31m", {
        from_name: name,
        from_email: email,
        message: message,
      })
      .then(() => {
        successBox.classList.remove("d-none");
        form.reset();

        setTimeout(() => {
          successBox.classList.add("d-none");
        }, 4000);
      })
      .catch((error) => {
        console.error("EmailJS Error:", error);
        alert("Something went wrong. Please try again.");
      });
  });
});
