/* ===== HORLOGE ===== */
function updateClock() {
    const d = new Date();
    document.getElementById("clock").textContent =
        `${String(d.getHours()).padStart(2,"0")} h ${String(d.getMinutes()).padStart(2,"0")}`;
}
setInterval(updateClock, 60000);
updateClock();

/* ===== STATIONS ===== */
const stations = [
    { name: " Prochaine Station: Accueil", image: "images/mur metro.webp" },
    { name: "Prochaine Station: Club", image: "images/club.webp" },
    { name: "Prochaine Station: l'équipe", image: "images/equipe.webp" },
    { name: "Prochaine Station: Bob le Robot", image: "images/robot.webp" },
    { name: "Prochaine Station: CRC", image: "images/CRC-Robotics.jpg" },
    { name: "Prochaine Station: Vidéo", image: "images/Mtl-metro-map.svg.png" }
];

const dots = document.querySelectorAll(".dot");

function updateStation(index) {
    const next = stations[(index + 1) % stations.length];
    document.getElementById("stationName").textContent = next.name;
    document.getElementById("stationImage").src = next.image;
}

/* NAVIGATION */
dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
        dots.forEach(d => d.classList.remove("active"));
        dot.classList.add("active");
        updateStation(index);
    });
});

updateStation(0);

/* ===== ACTUALITÉS (DÉMO LOCALE GARANTIE) ===== */
/* ===== RADIO-CANADA ===== */
const RSS_URL = "https://ici.radio-canada.ca/rss/4159";
const PROXY = "https://api.allorigins.win/raw?url=";

const newsImage = document.getElementById("newsImage");
const newsTitle = document.getElementById("newsTitle");
const newsDate = document.getElementById("newsDate");

let news = [];
let index = 0;

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