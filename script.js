// Переводы для интерфейса (пока en/ru)
const i18n = {
    en: {
        tagline: "games with soul • unique mechanics • anytime",
        copyright: "© 2026 DeFey Games. All rights reserved. jdefey@gmail.com"
    },
    ru: {
        tagline: "игры с душой • уникальные механики • в любое время",
        copyright: "© 2026 DeFey Games. Все права защищены. jdefey@gmail.com"
    }
};

let currentLang = "en";
let gamesData = [];

// Загрузка JSON файлов из папки /games/
async function loadGames() {
    const gameFiles = ["rare-solitaires.json"]; // сюда добавлять новые файлы
    const container = document.getElementById("gamesContainer");
    container.innerHTML = "";
    for (const file of gameFiles) {
        try {
            const res = await fetch(`games/${file}`);
            const game = await res.json();
            gamesData.push(game);
            renderGameCard(game, container);
        } catch(e) { console.error(`Ошибка загрузки ${file}:`, e); }
    }
}

function renderGameCard(game, container) {
    const card = document.createElement("div");
    card.className = "game-card";
    
    // Обложка
    if (game.cover) {
        const coverImg = document.createElement("img");
        coverImg.src = game.cover;
        coverImg.className = "cover";
        card.appendChild(coverImg);
    }
    
    const content = document.createElement("div");
    content.className = "card-content";
    
    // Название (двуязычное)
    const title = document.createElement("div");
    title.className = "game-title";
    if (currentLang === "en") {
        title.innerText = game.title.en;
    } else {
        title.innerText = `${game.title.en} / ${game.title[currentLang] || game.title.en}`;
    }
    content.appendChild(title);
    
    // Badge (теги)
    if (game.badge) {
        const badgeSpan = document.createElement("div");
        badgeSpan.className = "badge";
        badgeSpan.innerText = game.badge[currentLang] || game.badge.en;
        content.appendChild(badgeSpan);
    }
    
    // Описание
    const desc = document.createElement("div");
    desc.className = "description";
    desc.innerText = game.description[currentLang] || game.description.en;
    content.appendChild(desc);
    
    // Список особенностей
    if (game.features && game.features.length) {
        const ul = document.createElement("ul");
        ul.className = "feature-list";
        game.features.forEach(f => {
            const li = document.createElement("li");
            li.innerText = f[currentLang] || f.en;
            ul.appendChild(li);
        });
        content.appendChild(ul);
    }
    
    // Карусель скриншотов
    if (game.screenshots && game.screenshots.length) {
        const carouselDiv = document.createElement("div");
        carouselDiv.className = "carousel";
        const track = document.createElement("div");
        track.className = "carousel-track";
        game.screenshots.forEach(src => {
            const img = document.createElement("img");
            img.src = src;
            img.loading = "lazy";
            track.appendChild(img);
        });
        carouselDiv.appendChild(track);
        content.appendChild(carouselDiv);
    }
    
    // Кнопки магазинов
    const btnContainer = document.createElement("div");
    btnContainer.className = "store-buttons";
    if (game.storeLinks.googleplay) {
        const a = document.createElement("a");
        a.href = game.storeLinks.googleplay;
        a.className = "btn btn-google";
        a.innerText = "📲 Google Play";
        btnContainer.appendChild(a);
    }
    if (game.storeLinks.rustore) {
        const a = document.createElement("a");
        a.href = game.storeLinks.rustore;
        a.className = "btn btn-rustore";
        a.innerText = "🛍️ RuStore";
        btnContainer.appendChild(a);
    }
    if (game.storeLinks.huawei) {
        const a = document.createElement("a");
        a.href = game.storeLinks.huawei;
        a.className = "btn btn-huawei";
        a.innerText = "📱 AppGallery";
        btnContainer.appendChild(a);
    }
    content.appendChild(btnContainer);
    
    // Ссылки на политику и условия (если есть)
    if (game.privacyPolicy || game.termsOfService) {
        const legalDiv = document.createElement("div");
        legalDiv.className = "legal-links";
        if (game.privacyPolicy) {
            const a = document.createElement("a");
            a.href = game.privacyPolicy;
            a.innerText = "Privacy Policy / Политика конфиденциальности";
            legalDiv.appendChild(a);
        }
        if (game.termsOfService) {
            const a = document.createElement("a");
            a.href = game.termsOfService;
            a.innerText = "Terms of Service / Условия использования";
            legalDiv.appendChild(a);
        }
        content.appendChild(legalDiv);
    }
    
    card.appendChild(content);
    container.appendChild(card);
}

// Переключение языка интерфейса сайта и перерисовка карточек
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("lang", lang);
    
    // Обновление текстов интерфейса (шапка, футер)
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (i18n[lang] && i18n[lang][key]) el.innerText = i18n[lang][key];
    });
    
    // Перерисовка карточек
    document.getElementById("gamesContainer").innerHTML = "";
    gamesData = [];
    loadGames();
}

// Логика выпадающего списка языков
function initLangSelector() {
    const selected = document.getElementById("langSelected");
    const dropdown = document.getElementById("langDropdown");
    selected.addEventListener("click", () => dropdown.classList.toggle("open"));
    document.querySelectorAll("#langDropdown li").forEach(li => {
        li.addEventListener("click", () => {
            const lang = li.getAttribute("data-lang");
            const flag = li.getAttribute("data-flag");
            const name = li.innerText;
            document.getElementById("currentLangFlag").innerText = flag;
            document.getElementById("currentLangName").innerText = name;
            setLanguage(lang);
            dropdown.classList.remove("open");
        });
    });
    window.addEventListener("click", (e) => {
        if (!selected.contains(e.target)) dropdown.classList.remove("open");
    });
}

// Определение языка по браузеру
function detectLanguage() {
    const saved = localStorage.getItem("lang");
    if (saved && (saved === "en" || saved === "ru")) return saved;
    const browserLang = navigator.language.slice(0,2);
    return (browserLang === "ru") ? "ru" : "en";
}

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
    initLangSelector();
    const lang = detectLanguage();
    const flag = lang === "ru" ? "🇷🇺" : "🇬🇧";
    const name = lang === "ru" ? "Русский" : "English";
    document.getElementById("currentLangFlag").innerText = flag;
    document.getElementById("currentLangName").innerText = name;
    setLanguage(lang);
});