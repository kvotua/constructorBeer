class CardStorage {
  static STORAGE_KEY = 'drinkCards';

  static saveCard(cardData) {
    const cards = this.getCards();
    const newCard = {
      id: cardData.id || Date.now().toString(),
      title: cardData.title || 'Новый напиток',
      image: cardData.image || '',
      video: cardData.video || '',
      footerVideo: cardData.footerVideo || '',
      colors: {
        primary: cardData.colors?.primary || '#f06a12',
        background: cardData.colors?.background || '#f8f6f2',
      },
      content: {
        brewery: cardData.content?.brewery || '',
        city: cardData.content?.city || '',
        quote: cardData.content?.quote || '',
        caption: cardData.content?.caption || '',
        overlayTitle: cardData.content?.overlayTitle || '',
        overlayText: cardData.content?.overlayText || '',
        credits: cardData.content?.credits || '',
        email: cardData.content?.email || '',
        label: cardData.content?.label || '',
      },
      styles: cardData.styles || {},
      metadata: cardData.metadata || {},
      createdAt: cardData.createdAt || new Date().toISOString(),
    };

    if (cardData.id) {
      const cardIndex = cards.findIndex(card => card.id === cardData.id);
      if (cardIndex !== -1) {
        cards[cardIndex] = newCard;
      } else {
        cards.push(newCard);
      }
    } else {
      cards.push(newCard);
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cards));
    return newCard;
  }

  static getCards() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
  }

  static deleteCard(cardId) {
    const cards = this.getCards().filter(card => card.id !== cardId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cards));
  }

  static updateCard(cardId, newData) {
    const cards = this.getCards();
    const cardIndex = cards.findIndex(card => card.id === cardId);
    if (cardIndex !== -1) {
      cards[cardIndex] = { ...cards[cardIndex], ...newData };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cards));
    }
  }
}
