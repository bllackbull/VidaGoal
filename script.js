const titleElement = document.querySelector(".title");
const descriptionElement = document.querySelector(".description");
const progressElement = document.querySelector(".progress");
const textElement = document.querySelector(".text");
const imageElement = document.querySelector(".img");
const widget = document.querySelector(".widget");

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
  winkEffect();

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

  if (percent == 100 && state.cachedData.percent != 100) triggerConfetti();

  pages[0] = {
    title,
    description: `${formattedCurrent} تومان از ${formattedTotal} تومان (%${formattedPercent})`,
  };
}

function triggerConfetti() {
  // Left side confetti
  confetti({
    particleCount: 727,
    angle: 90,
    spread: 100,
    origin: { x: 0, y: 0.6 },
    gravity: 0.5,
    drift: 0.2,
    scalar: 1.5,
  });

  // Right side confetti
  confetti({
    particleCount: 727,
    angle: 90,
    spread: 100,
    origin: { x: 1, y: 0.6 },
    gravity: 0.5,
    drift: 0.2,
    scalar: 1.5,
  });
}

function changeContent() {
  textElement.classList.remove("show");

  setTimeout(() => {
    titleElement.textContent = pages[index].title;
    descriptionElement.textContent = pages[index].description;

    if (pages[index].title.length > 20) {
      titleElement.style.fontSize = "1.3em";
      textElement.style.paddingTop = "5%";
    } else if (pages[index].title.length > 15) {
      titleElement.style.fontSize = "1.8em";
      textElement.style.paddingTop = "3%";
    } else {
      titleElement.style.fontSize = "2.3em";
      textElement.style.paddingTop = "1%";
    }

    textElement.classList.add("show");

    index = (index + 1) % pages.length;
  }, 1000);
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

setInterval(fetchData, TIMEOUT_DURATION);
setInterval(changeContent, TIMEOUT_DURATION);

changeContent();
