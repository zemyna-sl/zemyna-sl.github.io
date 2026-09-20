const carousel = document.querySelector("[data-carousel]");

if (carousel) {
  const cards = Array.from(
    carousel.querySelectorAll(".project-card")
  );

  const previousButton = carousel.querySelector(
    "[data-carousel-previous]"
  );

  const nextButton = carousel.querySelector(
    "[data-carousel-next]"
  );

  const positionClasses = [
    "is-far-left",
    "is-left",
    "is-center",
    "is-right",
    "is-far-right"
  ];

  const positions = [
    {
      offset: -2,
      className: "is-far-left"
    },
    {
      offset: -1,
      className: "is-left"
    },
    {
      offset: 0,
      className: "is-center"
    },
    {
      offset: 1,
      className: "is-right"
    },
    {
      offset: 2,
      className: "is-far-right"
    }
  ];

  let activeIndex = cards.findIndex((card) =>
    card.classList.contains("is-center")
  );

  if (activeIndex === -1) {
    activeIndex = 0;
  }

  function normalizeIndex(index) {
    return (index + cards.length) % cards.length;
  }

  function updateCarousel() {
    cards.forEach((card) => {
      card.classList.remove(...positionClasses);

      card.setAttribute("aria-hidden", "true");

      const links = card.querySelectorAll("a");

      links.forEach((link) => {
        link.tabIndex = -1;
      });
    });

    positions.forEach(({ offset, className }) => {
      const cardIndex = normalizeIndex(
        activeIndex + offset
      );

      const card = cards[cardIndex];

      card.classList.add(className);

      const isClearCard = Math.abs(offset) <= 1;

      card.setAttribute(
        "aria-hidden",
        String(!isClearCard)
      );

      const links = card.querySelectorAll("a");

      links.forEach((link) => {
        link.tabIndex = isClearCard ? 0 : -1;
      });
    });
  }

  function moveCarousel(direction) {
    activeIndex = normalizeIndex(
      activeIndex + direction
    );

    updateCarousel();
  }

  previousButton.addEventListener("click", () => {
    moveCarousel(-1);
  });

  nextButton.addEventListener("click", () => {
    moveCarousel(1);
  });

  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveCarousel(-1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveCarousel(1);
    }
  });

  updateCarousel();
}

const themeStylesheet = document.querySelector(
  "#theme-stylesheet"
);

const themeButtons = document.querySelectorAll(
  ".theme-option"
);

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedTheme = button.dataset.theme;

    themeStylesheet.href =
      selectedTheme === "light"
        ? "light.css"
        : "styles.css";

    themeButtons.forEach((themeButton) => {
      const isActive =
        themeButton.dataset.theme === selectedTheme;

      themeButton.classList.toggle(
        "is-active",
        isActive
      );

      themeButton.setAttribute(
        "aria-pressed",
        String(isActive)
      );
    });
  });
});


function createCodeRain(selector, columnCount = 8) {
  const container = document.querySelector(selector);

  if (!container) {
    return;
  }

  const symbols = [
    "0", "1", "0", "1", "1", "1", "0", "1",
    "0", "1", "1", "0", "1", "♡", "♡"
  ];

  const colourClasses = [
    "blue",
    "blue",
    "blue",
    "pink"
  ];

  for (let i = 0; i < columnCount; i += 1) {
    const column = document.createElement("div");
    column.className = "code-column";

    const laneWidth = 100 / columnCount;

    const leftOffset =
      i * laneWidth +
      laneWidth * (0.2 + Math.random() * 0.6);  

    const duration = 8 + Math.random() * 8;
    const delay = Math.random() * -12;

    column.style.left = `${leftOffset}%`;
    column.style.animationDuration = `${duration}s`;
    column.style.animationDelay = `${delay}s`;

    const charCount = 10 + Math.floor(Math.random() * 10);

    for (let j = 0; j < charCount; j += 1) {
      const char = document.createElement("span");
      char.className = `code-char ${
        colourClasses[
          Math.floor(Math.random() * colourClasses.length)
        ]
      }`;

      char.textContent =
        symbols[Math.floor(Math.random() * symbols.length)];

      column.appendChild(char);
    }

    container.appendChild(column);
  }
}

createCodeRain(".code-rain-left");
createCodeRain(".code-rain-right");

const contactForm = document.querySelector(
  "#contact-form"
);

if (contactForm) {
  const submitButton =
    contactForm.querySelector(".contact-submit");

  const submitButtonText =
    submitButton.querySelector("span");

  const formStatus =
    contactForm.querySelector(
      ".contact-form-status"
    );

  contactForm.addEventListener(
    "submit",
    async (event) => {
      event.preventDefault();

      const formData =
        new FormData(contactForm);

      submitButton.disabled = true;
      submitButtonText.textContent =
        "Sending...";

      formStatus.textContent = "";

      try {
        await fetch(contactForm.action, {
          method: "POST",
          body: formData,
          mode: "no-cors"
        });

        contactForm.reset();

        formStatus.textContent =
          "Message sent!";

      } catch (error) {
        console.error(error);

        formStatus.textContent =
          "Something went wrong. Please try again.";

      } finally {
        submitButton.disabled = false;
        submitButtonText.textContent =
          "Send Message";
      }
    }
  );
}

const emailCopyButton = document.querySelector(
  "[data-copy-email]"
);

const emailCopyFeedback = document.querySelector(
  ".email-copy-feedback"
);

let emailFeedbackTimeout;

if (emailCopyButton && emailCopyFeedback) {

  emailCopyButton.addEventListener(
    "click",
    async () => {

      const email =
        emailCopyButton.dataset.copyEmail;

      try {

        await navigator.clipboard.writeText(email);

        emailCopyFeedback.textContent =
          `Copied: ${email}`;

        clearTimeout(emailFeedbackTimeout);

        emailFeedbackTimeout = setTimeout(() => {
          emailCopyFeedback.textContent = "";
        }, 4500);

      } catch (error) {

        console.error(error);

        emailCopyFeedback.textContent =
          `Email: ${email}`;

      }

    }
  );

}