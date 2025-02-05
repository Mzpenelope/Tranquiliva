(function () {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector("body");
    const selectHeader = document.querySelector("#header");
    if (
      !selectHeader.classList.contains("scroll-up-sticky") &&
      !selectHeader.classList.contains("sticky-top") &&
      !selectHeader.classList.contains("fixed-top")
    )
      return;
    window.scrollY > 100
      ? selectBody.classList.add("scrolled")
      : selectBody.classList.remove("scrolled");
  }

  document.addEventListener("scroll", toggleScrolled);
  window.addEventListener("load", toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");

  function mobileNavToogle() {
    document.querySelector("body").classList.toggle("mobile-nav-active");
    mobileNavToggleBtn.classList.toggle("bi-list");
    mobileNavToggleBtn.classList.toggle("bi-x");
  }
  mobileNavToggleBtn.addEventListener("click", mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll("#navmenu a").forEach((navmenu) => {
    navmenu.addEventListener("click", () => {
      if (document.querySelector(".mobile-nav-active")) {
        mobileNavToogle();
      }
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll(".navmenu .toggle-dropdown").forEach((navmenu) => {
    navmenu.addEventListener("click", function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle("active");
      this.parentNode.nextElementSibling.classList.toggle("dropdown-active");
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector(".scroll-top");

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100
        ? scrollTop.classList.add("active")
        : scrollTop.classList.remove("active");
    }
  }
  scrollTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  window.addEventListener("load", toggleScrollTop);
  document.addEventListener("scroll", toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }
  window.addEventListener("load", aosInit);

  /**
   * Auto generate the carousel indicators
   */
  document
    .querySelectorAll(".carousel-indicators")
    .forEach((carouselIndicator) => {
      carouselIndicator
        .closest(".carousel")
        .querySelectorAll(".carousel-item")
        .forEach((carouselItem, index) => {
          if (index === 0) {
            carouselIndicator.innerHTML += `<li data-bs-target="#${
              carouselIndicator.closest(".carousel").id
            }" data-bs-slide-to="${index}" class="active"></li>`;
          } else {
            carouselIndicator.innerHTML += `<li data-bs-target="#${
              carouselIndicator.closest(".carousel").id
            }" data-bs-slide-to="${index}"></li>`;
          }
        });
    });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: ".glightbox",
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Frequently Asked Questions Toggle
   */
  document
    .querySelectorAll(".faq-item h3, .faq-item .faq-toggle")
    .forEach((faqItem) => {
      faqItem.addEventListener("click", () => {
        faqItem.parentNode.classList.toggle("faq-active");
      });
    });

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener("load", function (e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: "smooth",
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll(".navmenu a");

  function navmenuScrollspy() {
    navmenulinks.forEach((navmenulink) => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        document
          .querySelectorAll(".navmenu a.active")
          .forEach((link) => link.classList.remove("active"));
        navmenulink.classList.add("active");
      } else {
        navmenulink.classList.remove("active");
      }
    });
  }
  window.addEventListener("load", navmenuScrollspy);
  document.addEventListener("scroll", navmenuScrollspy);
})();



//POPUP NEWSLETTER
"use strict";

// Selectors for the modal and its elements
const modall = document.querySelector(".modal[data-modal]");
const modallCloseOverlay = document.querySelector("[data-modal-overlay]");
const modallCloseBtn = document.querySelector("[data-modal-close]");
const questionnaireForm = document.getElementById("questionnaireForm");
const questions = document.querySelectorAll(".question");
const startButton = document.createElement("button");

let currentQuestion = -1; // Set to -1 to initialize with Start button
let totalPoints = 0; // Tracks the total score

// Check cookies/localStorage to determine if the assessment was already taken
if (!localStorage.getItem("assessmentTaken")) {
  modall.classList.remove("closed"); // Show modal if not taken
} else {
  modall.classList.add("closed"); // Hide modal if already taken
}

// Close modal function
const closeModall = () => {
  modall.classList.add("closed");
};

// Event listeners for modal closing
modallCloseOverlay.addEventListener("click", closeModall);
modallCloseBtn.addEventListener("click", closeModall);

// Add a Start button dynamically
startButton.textContent = "Start Assessment";
startButton.type = "button";
startButton.classList.add("start-btn");
startButton.addEventListener("click", nextQuestion);
questionnaireForm.prepend(startButton);

// Function to move to the next question
function nextQuestion() {
  if (currentQuestion === -1) {
    // Remove Start button on first click
    startButton.style.display = "none";
  } else if (currentQuestion < questions.length) {
    questions[currentQuestion].style.display = "none"; // Hide current question
  }

  if (currentQuestion < questions.length - 1) {
    currentQuestion++; // Increment question index
    questions[currentQuestion].style.display = "block"; // Show next question
  }
}

// Function to calculate points for each question
function calculatePoints(selectedValue) {
  totalPoints += parseInt(selectedValue);
}

// Function to validate answers
function validateAnswers() {
  for (let i = 1; i <= questions.length; i++) {
    const selectedValue = document.querySelector(`input[name="q${i}"]:checked`);
    if (!selectedValue) {
      alert(`Please answer question ${i}`);
      return false;
    }
  }
  return true;
}

// Function to submit the questionnaire
function submitQuestionnaire() {
  // Validate that all questions are answered
  if (!validateAnswers()) return;

  // Calculate total points
  for (let i = 1; i <= questions.length; i++) {
    const selectedValue = document.querySelector(`input[name="q${i}"]:checked`);
    if (selectedValue) {
      calculatePoints(selectedValue.value);
    }
  }

  // Generate result message based on total points
  let resultMessage;
  if (totalPoints > 40) {
    resultMessage = "Your mental health is excellent!";
  } else if (totalPoints > 30) {
    resultMessage = "Your mental health is good.";
  } else if (totalPoints > 20) {
    resultMessage = "Your mental health is fair.";
  } else {
    resultMessage =
      "Your mental health needs attention. Consider seeking help.";
  }

  // Display result in a new container
  const resultContainer = document.createElement("div");
  resultContainer.innerHTML = `<h4>Result:</h4><p>${resultMessage}</p>`;
  document.querySelector(".newsletter").appendChild(resultContainer);

  // Mark the assessment as completed in localStorage
  localStorage.setItem("assessmentTaken", "true");

  // Hide the form and close the modal after 3 seconds
  questionnaireForm.style.display = "none";
  setTimeout(closeModall, 3000);
}


//Notification Toast
const positiveQuotes = [
    "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
    "It's okay to not be okay as long as you are not giving up.",
    "You are stronger than you know, braver than you believe, and smarter than you think.",
    "Healing doesn't mean the damage never existed. It means the damage no longer controls your life.",
    "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, annoyed, frustrated, scared, or anxious. Having feelings doesn't make you a negative person. It makes you human.",
    "You are not a burden. You are a human with feelings, emotions, and needs.",
    "It's okay to ask for help. You don't have to go through this alone.",
    "Mental health is just as important as physical health.",
    "Your mental health matters more than anything else.",
    "You are worthy of love, care, and support.",
    "You are not defined by your struggles. You are defined by how you overcome them.",
    "Progress is progress, no matter how small.",
    "It's okay to take a break and focus on self-care.",
    "You are enough just as you are.",
    "One step at a time. One day at a time. You can do it.",
    "Your mental health is worth the effort.",
    "You are not alone in this battle.",
    "It's okay to not have it all together.",
    "You are not weak for having feelings. You are strong for dealing with them.",
    "Recovery is not a race. You don't have to get it all together right away.",
    "Your story is important, and it matters.",
    "Be kind to yourself. You are doing the best you can.",
    "Your mental health journey is unique to you.",
    "You are capable of healing and growing.",
    "Your thoughts do not define you.",
    "Self-compassion is key to mental well-being.",
    "You have the strength to face whatever comes your way.",
    "Your mental health is a lifelong journey, and it's worth it.",
    "There is hope even in the darkest moments.",
    "You are loved, valued, and appreciated just as you are.",
];

let usedQuotes = [];

function getRandomQuote() {
    if (usedQuotes.length === positiveQuotes.length) {
        // Reset if all quotes have been shown
        usedQuotes = [];
    }

    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * positiveQuotes.length);
    } while (usedQuotes.includes(randomIndex));

    usedQuotes.push(randomIndex);
    return positiveQuotes[randomIndex];
}

function changeBackgroundColor() {
    const colors = ["#C1E1DC", "#3FBBC0", "008080", "#F7F7F7", "65C9CD"];
    document.body.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
}

function showToast() {
    const quote = getRandomQuote();
    const toast = document.getElementById('toast');
    const quoteText = document.getElementById('quote-text');
    quoteText.textContent = `"${quote}"`;

    toast.style.display = 'block';  // Show the toast
    changeBackgroundColor();

    // Hide the toast after 5 seconds
    setTimeout(() => {
        toast.style.display = 'none';
    }, 90000);
}

document.getElementById('close-button').addEventListener('click', () => {
    document.getElementById('toast').style.display = 'none';
});

// Show a new quote every minute
setInterval(showToast, 30000);

// Show the first toast immediately on page load
setTimeout(showToast, 800);



//DARKMOOD
document.getElementById('darkModeToggle').addEventListener('click', function (e) {
  e.preventDefault(); // Prevent default behavior of the link

  const darkModeLink = document.getElementById('darkModeStylesheet');
  const lightModeLink = document.getElementById('lightModeStylesheet');

  if (darkModeLink) {
    // If dark mode is active, remove the dark mode stylesheet and enable the light mode stylesheet
    darkModeLink.remove();
    localStorage.setItem('mode', 'light');
    if (!lightModeLink) {
      const link = document.createElement('link');
      link.id = 'lightModeStylesheet';
      link.rel = 'stylesheet';
      link.href = './css/main.css';
      document.head.appendChild(link);
    }
  } else {
    // If light mode is active, remove the light mode stylesheet and enable the dark mode stylesheet
    if (lightModeLink) {
      lightModeLink.remove();
    }
    const link = document.createElement('link');
    link.id = 'darkModeStylesheet';
    link.rel = 'stylesheet';
    link.href = './css/darkmood.css';
    document.head.appendChild(link);
    localStorage.setItem('mode', 'dark');
  }
});

// On page load, restore the user's last mode preference
window.addEventListener('DOMContentLoaded', function () {
  const mode = localStorage.getItem('mode');
  if (mode === 'dark') {
    const link = document.createElement('link');
    link.id = 'darkModeStylesheet';
    link.rel = 'stylesheet';
    link.href = './css/darkmood.css';
    document.head.appendChild(link);
  } else {
    const link = document.createElement('link');
    link.id = 'lightModeStylesheet';
    link.rel = 'stylesheet';
    link.href = './css/main.css';
    document.head.appendChild(link);
  }
});
