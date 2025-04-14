
    const API_KEY = "77d0c6c9492a479ab43a891b30e1d77f";
    const proxy = "https://api.allorigins.win/raw?url=";

    const baseURL = `https://newsapi.org/v2/everything?q=`;

    let debounceTimeout;

    window.addEventListener("load", () => fetchNews("India"));

    async function fetchNews(query) {
      const statusMsg = document.getElementById("status-msg");
      statusMsg.textContent = "Loading news...";

      try {
        const apiURL = `${baseURL}${encodeURIComponent(query)}&apiKey=${API_KEY}`;
        const res = await fetch(`${proxy}${encodeURIComponent(apiURL)}`);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (data.status !== "ok" || !data.articles || data.articles.length === 0) {
          statusMsg.innerHTML = `No news found or error: ${data.message || "Unknown error"}. <button onclick="fetchNews('${query}')">Retry</button>`;
          return;
        }

        statusMsg.textContent = "";
        bindData(data.articles);
      } catch (error) {
        statusMsg.textContent = `Failed to load news. <button onclick="fetchNews('${query}')">Retry</button>`;
        console.error("Error fetching news:", error);
      }
    }

    function bindData(articles) {
      const cardsContainer = document.getElementById("cards-container");
      const newsCardTemplate = document.getElementById("template-news-card");

      cardsContainer.innerHTML = "";

      articles.forEach((article) => {
        if (!article.urlToImage) return;

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
      newsTitle.innerHTML = article.title || "No Title";
      newsDesc.innerHTML = article.description || "No Description Available";

      const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      });

      newsSource.innerHTML = `${article.source.name || "Unknown"} · ${date}`;

      cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
      });
    }

    let curSelectedNav = null;

    function onNavItemClick(id) {
      fetchNews(id);
      const navItem = document.getElementById(id);
      curSelectedNav?.classList.remove("active");
      curSelectedNav = navItem;
      curSelectedNav.classList.add("active");
    }

    const searchButton = document.getElementById("search-button");
    const searchText = document.getElementById("search-text");

    searchText.addEventListener("input", () => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        const query = searchText.value.trim();
        if (!query) return;
        fetchNews(query);
        curSelectedNav?.classList.remove("active");
        curSelectedNav = null;
      }, 500); // Debounce timeout of 500ms
    });
    const authSection = document.getElementById("auth-section");
    const nav = document.querySelector("nav");
    const main = document.querySelector("main");

    const authTitle = document.getElementById("auth-title");
    const authEmail = document.getElementById("auth-email");
    const authPassword = document.getElementById("auth-password");
    const authButton = document.getElementById("auth-button");
    const switchAuth = document.getElementById("toggle-auth");

    let isLoginMode = false;

    // Toggle Login/Signup Mode
    switchAuth.addEventListener("click", () => {
      isLoginMode = !isLoginMode;
      authTitle.textContent = isLoginMode ? "Login" : "Sign Up";
      authButton.textContent = isLoginMode ? "Login" : "Sign Up";
      switchAuth.textContent = isLoginMode
        ? "Don't have an account? Sign Up"
        : "Already have an account? Login";
    });

    // Auth Button Click
    authButton.addEventListener("click", () => {
      const email = authEmail.value.trim();
      const password = authPassword.value.trim();

      if (!email || !password) {
        alert("Please fill out all fields.");
        return;
      }

      if (isLoginMode) {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser && storedUser.email === email && storedUser.password === password) {
          localStorage.setItem("loggedIn", "true");
          showNewsApp();
        } else {
          alert("Invalid credentials.");
        }
      } else {
        localStorage.setItem("user", JSON.stringify({ email, password }));
        alert("Signup successful! Please login.");
        isLoginMode = true;
        authTitle.textContent = "Login";
        authButton.textContent = "Login";
        switchAuth.textContent = "Don't have an account? Sign Up";
      }
    });

    // Show/hide sections based on auth
    function showNewsApp() {
      authSection.style.display = "none";
      nav.style.display = "block";
      main.style.display = "block";
      fetchNews("India"); // load default news
    }

    // Check if user is logged in
    if (localStorage.getItem("loggedIn") === "true") {
      showNewsApp();
    } else {
      authSection.style.display = "flex";
      nav.style.display = "none";
      main.style.display = "none";
    }

    // Logout Button
    const logoutBtn = document.getElementById("logout-btn");
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("loggedIn");
      authSection.style.display = "flex";
      nav.style.display = "none";
      main.style.display = "none";
    });

    // Toggle navbar on small screens
document.getElementById('menu-toggle').addEventListener('click', () => {
    document.getElementById('nav-links').classList.toggle('show');
  });