/* ===== HORLOGE ===== */
function updateClock() {
    const d = new Date();
    document.getElementById("clock").textContent =
        `${String(d.getHours()).padStart(2,"0")} h ${String(d.getMinutes()).padStart(2,"0")}`;
}
setInterval(updateClock, 60000);
updateClock();
/* ===================== NAVIGATION (DOT ACTIF) ===================== */



/* ===== ACTUALITÉS (DÉMO LOCALE GARANTIE) ===== */
/* ===== RADIO-CANADA ===== */
const RSS_URL = "https://ici.radio-canada.ca/rss/4159";
const PROXY = "https://api.allorigins.win/raw?url=";

const newsImage = document.getElementById("newsImage");
const newsTitle = document.getElementById("newsTitle");
const newsDate = document.getElementById("newsDate");

let news = [];
let index = 0;const pages = [
    "accueil.html",
    "club.html",
    "equipe.html",
    "robot.html",
    "crc.html",
    "video.html"
];

const stations = [
    { name: "Prochaine station : Accueil", image: "images/mur metro.webp" },
    { name: "Prochaine station : Club", image: "images/club.webp" },
    { name: "Prochaine station : L’équipe", image: "images/equipe.webp" },
    { name: "Prochaine station : Bob le Robot", image: "images/robot.webp" },
    { name: "Prochaine station : CRC", image: "images/CRC-Robotics.jpg" },
    { name: "Prochaine station : Vidéo", image: "images/Mtl-metro-map.svg.png" }
];

const dots = document.querySelectorAll(".dot");

// page actuelle
const currentPage =
    location.pathname.split("/").pop().toLowerCase();

// index actuel
let currentIndex = pages.indexOf(currentPage);
if (currentIndex === -1) currentIndex = 0;

// DOT ACTIF
dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === currentIndex);
});

// PROCHAINE STATION
const nextIndex = (currentIndex + 1) % stations.length;
document.getElementById("stationName").textContent =
    stations[nextIndex].name;
document.getElementById("stationImage").src =
    stations[nextIndex].image;


async function loadNews() {
    const res = await fetch(PROXY + encodeURIComponent(RSS_URL));
    const text = await res.text();
    const xml = new DOMParser().parseFromString(text, "text/xml");

    news = [...xml.querySelectorAll("item")].map(item => ({
        title: item.querySelector("title")?.textContent || "",
        date: new Date(item.querySelector("pubDate")?.textContent)
            .toLocaleDateString("fr-CA", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }),
        image: item.querySelector("enclosure")?.getAttribute("url")
    })).filter(n => n.image);

    showNews();
}

function showNews() {
    if (!news.length) return;
    const n = news[index];
    newsImage.src = n.image;
    newsTitle.textContent = n.title;
    newsDate.textContent = n.date;
    index = (index + 1) % news.length;
}

setInterval(showNews, 7000);
loadNews();