"use strict";

const contactForm = document.querySelector("#contact-form");

if (contactForm instanceof HTMLFormElement) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(contactForm);
    const name = String(data.get("name") ?? "").trim();
    const contact = String(data.get("contact") ?? "").trim();
    const patient = String(data.get("patient") ?? "Взрослый пациент");
    const message = String(data.get("message") ?? "").trim();
    const subject = `Обращение с сайта — ${name}`;
    const body = [
      `Имя: ${name}`,
      `Email для ответа: ${contact}`,
      `Пациент: ${patient}`,
      "",
      "Кратко о ситуации:",
      message,
    ].join("\n");

    window.location.href = `mailto:Kirill.orlov@rens-russia.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

const currentYear = document.querySelector("#current-year");

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}
