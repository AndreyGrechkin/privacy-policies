// Переводы интерфейса (10 языков)
const i18n = {
    en: { tagline: "games with soul • unique mechanics • anytime", copyright: "© 2026 DeFey Games. All rights reserved. jdefey@gmail.com" },
    ru: { tagline: "игры с душой • уникальные механики • в любое время", copyright: "© 2026 DeFey Games. Все права защищены. jdefey@gmail.com" },
    de: { tagline: "Spiele mit Seele • einzigartige Mechaniken • jederzeit", copyright: "© 2026 DeFey Games. Alle Rechte vorbehalten. jdefey@gmail.com" },
    fr: { tagline: "jeux avec âme • mécaniques uniques • à tout moment", copyright: "© 2026 DeFey Games. Tous droits réservés. jdefey@gmail.com" },
    es: { tagline: "juegos con alma • mecánicas únicas • en cualquier momento", copyright: "© 2026 DeFey Games. Todos los derechos reservados. jdefey@gmail.com" },
    pt: { tagline: "jogos com alma • mecânicas únicas • a qualquer momento", copyright: "© 2026 DeFey Games. Todos os direitos reservados. jdefey@gmail.com" },
    ja: { tagline: "魂を込めたゲーム • ユニークなメカニクス • いつでも", copyright: "© 2026 DeFey Games. 無断転載を禁じます。 jdefey@gmail.com" },
    ko: { tagline: "영혼을 담은 게임 • 독특한 메커니즘 • 언제든지", copyright: "© 2026 DeFey Games. 모든 권리 보유. jdefey@gmail.com" },
    zh: { tagline: "有灵魂的游戏 • 独特的机制 • 随时随地", copyright: "© 2026 DeFey Games. 版权所有。 jdefey@gmail.com" },
    it: { tagline: "giochi con anima • meccaniche uniche • sempre", copyright: "© 2026 DeFey Games. Tutti i diritti riservati. jdefey@gmail.com" }
};

// Переводы для кнопок юридических документов
const legalTexts = {
    en: { privacy: "Privacy Policy", terms: "Terms of Service" },
    ru: { privacy: "Политика конфиденциальности", terms: "Условия использования" },
    de: { privacy: "Datenschutzerklärung", terms: "Nutzungsbedingungen" },
    fr: { privacy: "Politique de confidentialité", terms: "Conditions d'utilisation" },
    es: { privacy: "Política de privacidad", terms: "Términos de servicio" },
    pt: { privacy: "Política de privacidade", terms: "Termos de serviço" },
    ja: { privacy: "プライバシーポリシー", terms: "利用規約" },
    ko: { privacy: "개인정보 보호정책", terms: "이용약관" },
    zh: { privacy: "隐私政策", terms: "服务条款" },
    it: { privacy: "Informativa sulla privacy", terms: "Termini di servizio" }
};

let currentLang = "en";
let gamesData = [];

async function loadGames() {
    const gameFiles = ["rare-solitaires.json"];
    const container = document.getElementById("gamesContainer");
    container.innerHTML = "";
    gamesData = [];
    for (const file of gameFiles) {
        try {
            const res = await fetch(`games/${file}`);
            const game = await res.json();
            gamesData.push(game);
            renderGameCard(game, container);
        } catch(e) {
            console.error(`Error loading ${file}:`, e);
        }
    }
}

function renderGameCard(game, container) {
    const card = document.createElement("div");
    card.className = "game-card";
    
    if (game.cover) {
        const coverImg = document.createElement("img");
        coverImg.src = game.cover;
        coverImg.className = "cover";
        card.appendChild(coverImg);
    }
    
    const content = document.createElement("div");
    content.className = "card-content";
    
    // Название
    const title = document.createElement("div");
    title.className = "game-title";
    if (currentLang === "en") {
        title.innerText = game.title.en;
    } else {
        title.innerText = `${game.title.en} / ${game.title[currentLang] || game.title.en}`;
    }
    content.appendChild(title);
    
    // Badge
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
    
    // Особенности
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
    
    // Юридические ссылки (перевод на выбранный язык)
    const legalDiv = document.createElement("div");
    legalDiv.className = "legal-links";
    if (game.privacyPolicy) {
        const a = document.createElement("a");
        a.href = game.privacyPolicy;
        a.innerText = legalTexts[currentLang]?.privacy || legalTexts.en.privacy;
        legalDiv.appendChild(a);
    }
    if (game.termsOfService) {
        const a = document.createElement("a");
        a.href = game.termsOfService;
        a.innerText = legalTexts[currentLang]?.terms || legalTexts.en.terms;
        legalDiv.appendChild(a);
    }
    content.appendChild(legalDiv);
    
    card.appendChild(content);
    container.appendChild(card);
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("lang", lang);
    
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (i18n[lang] && i18n[lang][key]) el.innerText = i18n[lang][key];
    });
    
    document.getElementById("gamesContainer").innerHTML = "";
    gamesData = [];
    loadGames();
}

function initLangSelector() {
    const selected = document.getElementById("langSelected");
    const dropdown = document.getElementById("langDropdown");
    selected.addEventListener("click", () => dropdown.classList.toggle("open"));
    document.querySelectorAll("#langDropdown li").forEach(li => {
        li.addEventListener("click", () => {
            const lang = li.getAttribute("data-lang");
            const flag = li.getAttribute("data-flag");
            const name = li.innerText.trim();
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

function detectLanguage() {
    const saved = localStorage.getItem("lang");
    if (saved && i18n[saved]) return saved;
    const browserLang = navigator.language.slice(0,2);
    return i18n[browserLang] ? browserLang : "en";
}

document.addEventListener("DOMContentLoaded", () => {
    initLangSelector();
    const lang = detectLanguage();
    const flagMap = {
        en:"🇬🇧", ru:"🇷🇺", de:"🇩🇪", fr:"🇫🇷", es:"🇪🇸", pt:"🇵🇹", ja:"🇯🇵", ko:"🇰🇷", zh:"🇨🇳", it:"🇮🇹"
    };
    const nameMap = {
        en:"English", ru:"Русский", de:"Deutsch", fr:"Français", es:"Español", pt:"Português", ja:"日本語", ko:"한국어", zh:"中文", it:"Italiano"
    };
    document.getElementById("currentLangFlag").innerText = flagMap[lang];
    document.getElementById("currentLangName").innerText = nameMap[lang];
    setLanguage(lang);
});
