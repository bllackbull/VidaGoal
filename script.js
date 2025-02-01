const widget = document.querySelector(".widget");
const progressElement = document.querySelector(".progress");
const textElement = document.querySelector(".text");
const titleElement = document.querySelector(".title");
const descriptionElement = document.querySelector(".description");
const titleOverlayElement = document.querySelector(".title-overlay");
const desriptionOverlayElement = document.querySelector(".description-overlay");
const imageElement = document.querySelector(".img");
const goalElement = document.querySelector(".goal");

const API_KEY =
  "MjVjM2NlNTFlNWZiOTZjOEJESGtLQzd6bHovTjh4SnNQbXVNd3BISWgzMExBV2lFOWJlQmQ5TlJ5ZTA9";
const TIMEOUT_DURATION = 5000;

const state = {
  success: false,
  cachedData: loadData(),
  currentData: {},
};

let pages = [];
let index = 0;
let firstChange = true;

function fetchData() {
  fetch(`https://api.reymit.ir/user/${API_KEY}/goal`)
    .then((response) => response.json())
    .then((json) => processData(json))
    .catch((error) => {
      state.success = false;
      console.error("Failed to fetch goal data:", error);
    });

  fetch(`https://api.reymit.ir/user/${API_KEY}/donates/last-donates`)
    .then((response) => response.json())
    .then((json) => processLatestDonateData(json.data.donates[0]))
    .catch((error) => {
      console.error("Failed to fetch latest donate data:", error);
    });

  fetch(`https://api.reymit.ir/user/${API_KEY}/donates/top-donates`)
    .then((response) => response.json())
    .then((json) => processTopDonateData(json.data.donates.alltime[0]))
    .catch((error) => {
      console.error("Failed to fetch top donate data:", error);
    });

  fetch(`https://api.reymit.ir/user/${API_KEY}/donates/top-donators`)
    .then((response) => response.json())
    .then((json) => processTopDonatorData(json.data.donates.alltime[0]))
    .catch((error) => {
      console.error("Failed to fetch top donator data:", error);
    });
}

function processData(json) {
  const { current, total, title } = json.data;

  state.success = true;
  state.currentData = json.data;

  const percent = Math.round((current * 100) / total);

  if (
    state.cachedData.title !== title ||
    state.cachedData.current !== current
  ) {
    updateUI(title, current, total, percent);

    const newData = { title, percent, current, total };
    saveData(newData);

    state.cachedData = newData;
  }
}

function processLatestDonateData(data) {
  const { name, amount, censored_name } = data;

  const title = censored_name == "" ? name : censored_name;
  const formattedAmount = convertToPersian(amount.toLocaleString());

  pages[1] = {
    title: `آخرین دونیت: ${title}`,
    description: `${formattedAmount} تومان حمایت کرد.`,
  };
}

function processTopDonateData(data) {
  const { name, amount, censored_name } = data;

  const title = censored_name == "" ? name : censored_name;
  const formattedAmount = convertToPersian(amount.toLocaleString());

  pages[2] = {
    title: `بزرگترین دونیت: ${title}`,
    description: `${formattedAmount} تومان حمایت کرد.`,
  };
}

function processTopDonatorData(data) {
  const { name, total } = data;
  const formattedAmount = convertToPersian(total.toLocaleString());

  pages[3] = {
    title: `برترین حمایت کننده: ${name}`,
    description: `${formattedAmount} تومان حمایت کرد.`,
  };
}

function updateUI(title, current, total, percent) {
  const formattedCurrent = convertToPersian(current.toLocaleString());
  const formattedTotal = convertToPersian(total.toLocaleString());
  const formattedPercent = convertToPersian(percent);

  progressElement.style.width = `${percent}%`;

  if (percent > 7) {
    titleOverlayElement.style.width = `${percent - 7}%`;
    desriptionOverlayElement.style.width = `${percent - 7}%`;
  }

  winkEffect();

  if (
    percent != 100 &&
    percent >= 10 &&
    percent.toString()[0] != state.cachedData.percent.toString()[0]
  ) {
    setImage(state.cachedData.percent);
    moveImage(percent);
  } else {
    setImage(percent);
  }

  if (percent >= 100 && state.cachedData.percent < 100) completionAnimation();

  pages[0] = {
    title: `هدف: ${title}`,
    description: `${formattedCurrent} تومان از ${formattedTotal} تومان (%${formattedPercent})`,
  };
}

function completionAnimation() {
  triggerConfetti();
  const confettiInterval = setInterval(triggerConfetti, 1000);
  setTimeout(() => {
    clearInterval(confettiInterval);
  }, 60_000);

  widget.classList.add("scale");
  titleOverlayElement.classList.add("complete");
  desriptionOverlayElement.classList.add("complete");
}

function moveImage(percent) {
  imageElement.style.animation = "none";

  setTimeout(() => {
    imageElement.style.transform =
      "translateY(135%) translateX(20%) rotate(30deg) scale(1.2)";
  }, 500);

  setTimeout(() => {
    imageElement.style.zIndex = "-1";
    imageElement.style.transform =
      "translateY(0) translateX(40%) rotate(30deg) scale(0.6)";
  }, 1500);

  setTimeout(() => {
    setImage(percent);
  }, 2000);

  setTimeout(() => {
    imageElement.style.transform =
      "translateY(-135%) translateX(-10%) rotate(-60deg) scale(0.6)";
  }, 2500);

  setTimeout(() => {
    imageElement.style.zIndex = "1";
    imageElement.style.transform = "translateY(0) translateX(0) scale(1.2)";
  }, 3500);

  setTimeout(() => {
    imageElement.style.transform = "scale(1)";
  }, 4500);

  setTimeout(() => {
    imageElement.style.animation = "float 6s ease-in-out infinite alternate";
  }, 5500);
}

function setImage(percent) {
  if (percent >= 90) {
    imageElement.src = "./images/10.png";
  } else if (percent >= 80) {
    imageElement.src = "./images/9.png";
  } else if (percent >= 70) {
    imageElement.src = "./images/8.png";
  } else if (percent >= 60) {
    imageElement.src = "./images/7.png";
  } else if (percent >= 50) {
    imageElement.src = "./images/6.png";
  } else if (percent >= 40) {
    imageElement.src = "./images/5.png";
  } else if (percent >= 30) {
    imageElement.src = "./images/4.png";
  } else if (percent >= 20) {
    imageElement.src = "./images/3.png";
  } else if (percent >= 10) {
    imageElement.src = "./images/2.png";
  } else {
    imageElement.src = "./images/1.png";
  }
}

function triggerConfetti() {
  if (state.currentData.percent < 100) return;

  const colors = [
    "#daf7aa",
    "#c0f3b0",
    "#95bc8f",
    "#518c4c",
    "#10422f",
    "#093223",
  ];

  // Left side confetti
  confetti({
    particleCount: 200,
    angle: -30,
    spread: 120,
    origin: { x: -0.1, y: 0 },
    colors: colors,
    gravity: 0.5,
    drift: 0,
    scalar: 1.8,
  });

  // Right side confetti
  confetti({
    particleCount: 200,
    angle: 210,
    spread: 120,
    origin: { x: 1.1, y: 0 },
    colors: colors,
    gravity: 0.5,
    drift: 0,
    scalar: 1.8,
  });
}

function initializeContent() {
  titleElement.textContent = pages[0].title;
  descriptionElement.textContent = pages[0].description;

  titleOverlayElement.textContent = pages[0].title;
  desriptionOverlayElement.textContent = pages[0].description;

  checkLength();

  textElement.classList.add("show");
  titleOverlayElement.classList.add("show");
}

function changeContent() {
  if (state.cachedData.percent >= 100 && index == 1) return;

  textElement.classList.remove("show");
  titleOverlayElement.classList.remove("show");

  if (state.cachedData.percent >= 100) index = 0;

  setTimeout(() => {
    if (firstChange) {
      index = 1;
      firstChange = false;
    }

    titleElement.textContent = pages[index].title;
    descriptionElement.textContent = pages[index].description;

    titleOverlayElement.textContent = pages[index].title;
    desriptionOverlayElement.textContent = pages[index].description;

    checkLength();

    textElement.classList.add("show");
    titleOverlayElement.classList.add("show");

    index = (index + 1) % pages.length;
  }, 1000);
}

function checkLength() {
  if (pages[index].title.length > 20) {
    titleElement.style.fontSize = "1.4em";
    textElement.style.paddingTop = "5%";

    titleOverlayElement.style.fontSize = "1.4em";
  } else if (pages[index].title.length > 15) {
    titleElement.style.fontSize = "1.6em";
    textElement.style.paddingTop = "4.5%";

    titleOverlayElement.style.fontSize = "1.6em";
  } else {
    titleElement.style.fontSize = "1.7em";
    textElement.style.paddingTop = "4%";

    titleOverlayElement.style.fontSize = "1.7em";
  }
}

function winkEffect() {
  progressElement.classList.add("wink");

  setTimeout(() => {
    progressElement.classList.add("remove");
  }, 2500);
}

function convertToPersian(num) {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num
    .toString()
    .split("")
    .map((char) => {
      const index = parseInt(char, 10);
      return isNaN(index) ? char : persianDigits[index];
    })
    .join("");
}

function saveData(data) {
  localStorage.setItem("donationGoal", JSON.stringify(data));
}

function loadData() {
  const data = localStorage.getItem("donationGoal");
  const rawData = {
    title: "...Loading",
    current: 0,
    total: 0,
    percent: 0,
  };

  return data ? JSON.parse(data) : rawData;
}

const { title, current, total, percent } = state.cachedData;
updateUI(title, current, total, percent);

initializeContent();

setInterval(fetchData, TIMEOUT_DURATION);
setInterval(changeContent, TIMEOUT_DURATION);
