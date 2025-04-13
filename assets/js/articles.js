async function loadArticles() {
  const cards = document.querySelector(".cards");
  try {
    const response = await fetch("/api/articles.json");
    const articles = await response.json();

    articles.forEach((a) => {
      const card = createCard(a);
      cards.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading articles:", error);
    cards.innerHTML = "<p>Error loading articles. Please try again later.</p>";
  }
}

function createCard(article) {
  const card = document.createElement("card");
  card.className = "card";
  card.innerHTML = `
    <a href="articles/${article.filename}">
        <h2>${article.title}</h2>
        <p>${article.description}</p>
        <p><em class="article-date">${article.date}</em></p>
  `;
  return card;
}

document.addEventListener("DOMContentLoaded", loadArticles);
