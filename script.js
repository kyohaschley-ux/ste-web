// ==== MENU + ONGLET SUIVANT ====
const steps = document.querySelectorAll('.step');
const bars = document.querySelectorAll('.bar');
const tabName = document.getElementById('tabName');

const tabList = Array.from(steps).map(s => s.dataset.name);

function updateNextTab(index) {
    tabName.textContent = tabList[(index + 1) % tabList.length];
}

steps.forEach((step, i) => {
    step.addEventListener('click', () => {
        steps.forEach(s => s.classList.remove('active'));
        bars.forEach(b => b.classList.remove('active'));

        step.classList.add('active');

        for (let j = 0; j < i; j++) {
            bars[j].classList.add('active');
        }

        updateNextTab(i);
    });
});

updateNextTab(0);

// ==== HORLOGE ====
const clock = document.getElementById('clock');

function updateClock() {
    const now = new Date();
    clock.textContent = now.toLocaleTimeString("fr-CA", {
        timeZone: "America/Toronto",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit"
    });
}

setInterval(updateClock, 1000);
updateClock();

// ==== MÉTÉO ====
const tempEl = document.getElementById('temp');
const descEl = document.getElementById('desc');
const API_KEY = 'VOTRE_CLE_OPENWEATHERMAP';

fetch(`https://api.openweathermap.org/data/2.5/weather?q=Montreal,CA&units=metric&lang=fr&appid=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
        tempEl.textContent = `${Math.round(data.main.temp)}°C`;
        descEl.textContent = data.weather[0].description;
    })
    .catch(() => {
        tempEl.textContent = '--°C';
        descEl.textContent = 'Erreur';
    });

// ==== ACTUALITÉS ====
const newsTitle = document.getElementById("newsTitle");
const newsImage = document.getElementById("newsImage");
const newsDate = document.getElementById("newsDate");

let newsItems = [];
let currentNews = 0;

fetch("https://api.rss2json.com/v1/api.json?rss_url=https://ici.radio-canada.ca/rss/4159")
    .then(res => res.json())
    .then(data => {
        newsItems = data.items.filter(item => item.enclosure?.link);
        showNews();
        setInterval(nextNews, 30000);
    });

function showNews() {
    const item = newsItems[currentNews];
    newsTitle.textContent = item.title;
    newsImage.src = item.enclosure.link;
    newsDate.textContent = new Date(item.pubDate).toLocaleDateString("fr-CA");
}

function nextNews() {
    currentNews = (currentNews + 1) % newsItems.length;
    showNews();
}
