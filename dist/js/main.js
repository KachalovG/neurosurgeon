"use strict";

document.documentElement.classList.add("js");

const revealGroups = document.querySelectorAll("[data-reveal-group]");

for (const group of revealGroups) {
  const items = Array.from(group.children).filter(
    (item) => item instanceof HTMLElement && item.hasAttribute("data-reveal"),
  );

  items.forEach((item, index) => {
    item.style.setProperty("--reveal-delay", `${Math.min(index, 3) * 70}ms`);
  });
}

const revealItems = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

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
