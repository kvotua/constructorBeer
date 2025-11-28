class CardCatalog {
  constructor() {
    this.cardsContainer = document.querySelector('.container_cards__list');
    this.init();
  }

  init() {
    this.renderCards();
  }

  renderCards() {
    const cards = CardStorage.getCards();
    const addCardBtn = this.cardsContainer.querySelector('.card:first-child');

    this.cardsContainer.innerHTML = '';
    this.cardsContainer.appendChild(addCardBtn);

    cards.forEach(card => {
      const cardElement = this.createCardElement(card);
      this.cardsContainer.appendChild(cardElement);
    });
  }

  createCardElement(card) {
    const cardElement = document.createElement('a');
    cardElement.href = `editor.html?edit=${card.id}`;
    cardElement.className = 'card';
    cardElement.innerHTML = `
            <span class="card__image-span">
                <img src="${card.image}" alt="${card.title}">
            </span>
            <h3 class="card__name">${card.title}</h3>
        `;

    return cardElement;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CardCatalog();
});
