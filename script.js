// API Keys and URLs
const NEWS_API_KEY = "0ea2bdb2e0714ed0a010339f866ae4b0";
const NEWS_API_URL = "https://newsapi.org/v2/everything?q=";

const CRUNCHBASE_API_KEY = "YOUR_CRUNCHBASE_API_KEY";
const CRUNCHBASE_URL = "https://api.crunchbase.com/v3.1/organizations?query=";

const ANGELLIST_API_KEY = "YOUR_ANGELLIST_API_KEY";
const ANGELLIST_URL = "https://api.angel.co/1/startups?search=";

const LINKEDIN_API_KEY = "YOUR_LINKEDIN_API_KEY";
const LINKEDIN_URL = "https://api.linkedin.com/v2/jobs?keywords=";

// On window load, fetch default news category (Technology)
window.addEventListener("load", () => fetchNews("Technology"));

// Fetch news from different APIs
async function fetchNews(query) {
    try {
        // Fetch from News API
        const newsRes = await fetch(`${NEWS_API_URL}${query}&apiKey=${NEWS_API_KEY}`);
        const newsData = await newsRes.json();
        bindData(newsData.articles);

        // Fetch from Crunchbase API
        const crunchbaseRes = await fetch(`${CRUNCHBASE_URL}${query}&user_key=${CRUNCHBASE_API_KEY}`);
        const crunchbaseData = await crunchbaseRes.json();
        bindData(crunchbaseData.data.items);

        // Fetch from AngelList API
        const angellistRes = await fetch(`${ANGELLIST_URL}${query}&access_token=${ANGELLIST_API_KEY}`);
        const angellistData = await angellistRes.json();
        bindData(angellistData.startups);

        // Fetch from LinkedIn API
        const linkedinRes = await fetch(`${LINKEDIN_URL}${query}&oauth2_access_token=${LINKEDIN_API_KEY}`);
        const linkedinData = await linkedinRes.json();
        bindData(linkedinData.elements);
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cardscontainer");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = ""; // Clear previous content

    articles.forEach((article) => {
        if (!article.urlToImage) return; // Skip articles without an image

        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = `${article.title.slice(0, 60)}...`;
    newsDesc.innerHTML = `${article.description.slice(0, 150)}...`;

    const date = new Date(article.publishedAt).toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;

function onNavItemClick(category) {
    if (category === 'aboutus') {
        // Redirect to the external "About Us" page
        window.location.href = "https://newznow.tech/about.html";
    } else {
        // Fetch news based on the category
        fetchNews(category);

        // Highlight the selected navigation item
        const navItem = document.getElementById(category.toLowerCase());
        curSelectedNav?.classList.remove("active");
        curSelectedNav = navItem;
        curSelectedNav.classList.add("active");
    }
}

// Search functionality
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});
