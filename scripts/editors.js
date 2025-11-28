class CardEditor {
  constructor() {
    this.currentCard = null;
    this.init();
  }

  init() {
    this.setupSaveButton();
    this.loadCardData();
  }

  setupSaveButton() {
    const saveBtn = document.createElement('button');
    saveBtn.id = 'saveCard';
    saveBtn.innerHTML = 'Сохранить';
    saveBtn.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 24px;
      background: gray;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
      z-index: 10000;
    `;

    saveBtn.addEventListener('click', () => this.saveCard());
    document.body.appendChild(saveBtn);
  }

  collectCardData() {
    try {
      return {
        id: this.currentCard?.id,
        title: this.getSafeTextContent('.header__title'),
        image: this.getSafeAttribute('.header__illustration img', 'src'),
        video:
          this.getSafeAttribute('#video source', 'src') ||
          this.getSafeAttribute('#video', 'src'),
        footerVideo:
          this.getSafeAttribute('#footerVideo source', 'src') ||
          this.getSafeAttribute('#footerVideo', 'src'),
        colors: {
          primary: this.getComputedColor('.header__title'),
          background: this.getComputedColor('body', 'backgroundColor'),
        },
        content: {
          brewery: this.getSafeTextContent('.header__brauerei'),
          city: this.getSafeTextContent('.header__kaliningrad'),
          quote: this.getSafeTextContent('.footer-content__quote p'),
          caption: this.getSafeTextContent('.video-overlay__caption'),
          overlayTitle: this.getSafeTextContent('.video-overlay__title'),
          overlayText: this.getSafeTextContent('.video-overlay__text'),
          credits: this.getSafeTextContent('.footer-content__credit'),
          email: this.getSafeTextContent('.email-container__email'),
          label: this.getSafeTextContent('.mountain-footer__label'),
        },
        styles: {
          titleFontSize: this.getComputedStyleValue(
            '.header__title',
            'fontSize'
          ),
          titleFontFamily: this.getComputedStyleValue(
            '.header__title',
            'fontFamily'
          ),
        },
        metadata: {
          lastModified: new Date().toISOString(),
          isImageHidden: document
            .querySelector('.header__illustration')
            .classList.contains('hidden'),
        },
      };
    } catch (error) {
      console.error('Ошибка при сборе данных карточки:', error);
      return this.getDefaultCardData();
    }
  }

  getSafeTextContent(selector) {
    const element = document.querySelector(selector);
    return element ? element.textContent.trim() : '';
  }

  getSafeAttribute(selector, attribute) {
    const element = document.querySelector(selector);
    return element ? element[attribute] || element.getAttribute(attribute) : '';
  }

  getComputedColor(selector, property = 'color') {
    const element = document.querySelector(selector);
    return element ? getComputedStyle(element)[property] : '';
  }

  getComputedStyleValue(selector, property) {
    const element = document.querySelector(selector);
    return element ? getComputedStyle(element)[property] : '';
  }

  getDefaultCardData() {
    return {
      title: 'Новый напиток',
      image: '',
      colors: {
        primary: '#f06a12',
        background: '#f8f6f2',
      },
      content: {
        brewery: 'Brauerei Ponarth',
        city: 'Калининград',
        quote: 'Trapped in the wisdom of certainty...',
        caption: 'THOUGHT VESSEL 01',
        overlayTitle: 'Clarity in Silence',
        overlayText:
          'Design emerges from emptiness. Mental clarity precedes visual harmony.',
        credits: 'A Way of Being\nThrough Mindful Creation',
        email: 'hi@filip.fyi',
        label: '+Get In Touch',
      },
    };
  }

  async saveCard() {
    try {
      this.showLoadingState();

      const cardData = this.collectCardData();

      if (!cardData.title || cardData.title.trim() === '') {
        alert('Пожалуйста, укажите название напитка');
        this.hideLoadingState();
        return;
      }

      const savedCard = CardStorage.saveCard(cardData);

      this.showSuccessMessage(
        `Карточка "${savedCard.title}" успешно сохранена!`
      );

      setTimeout(() => {
        window.location.href = 'catalog.html';
      }, 1500);
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('Произошла ошибка при сохранении карточки');
      this.hideLoadingState();
    }
  }

  loadCardData() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const cardId = urlParams.get('edit');

      if (cardId && cardId.trim() !== '') {
        const cards = CardStorage.getCards();
        const card = cards.find(c => c.id === cardId);

        if (card) {
          this.currentCard = card;
          this.applyCardData(card);
          this.updateUIForEditMode(card.title);
        } else {
          console.warn('Карточка с ID', cardId, 'не найдена');
          this.updateUIForNewMode();
        }
      } else {
        this.updateUIForNewMode();
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      this.updateUIForNewMode();
    }
  }

  applyCardData(card) {
    this.setSafeTextContent('.header__title', card.title);
    this.setSafeTextContent('.header__brauerei', card.content?.brewery || '');
    this.setSafeTextContent('.header__kaliningrad', card.content?.city || '');
    this.setSafeTextContent(
      '.footer-content__quote p',
      card.content?.quote || ''
    );
    this.setSafeTextContent(
      '.video-overlay__caption',
      card.content?.caption || ''
    );
    this.setSafeTextContent(
      '.video-overlay__title',
      card.content?.overlayTitle || ''
    );
    this.setSafeTextContent(
      '.video-overlay__text',
      card.content?.overlayText || ''
    );
    this.setSafeTextContent(
      '.footer-content__credit',
      card.content?.credits || ''
    );
    this.setSafeTextContent(
      '.email-container__email',
      card.content?.email || ''
    );
    this.setSafeTextContent(
      '.mountain-footer__label',
      card.content?.label || ''
    );

    this.setSafeAttribute('.header__illustration img', 'src', card.image || '');

    if (card.video) {
      this.setVideoSource('#video', card.video);
    }
    if (card.footerVideo) {
      this.setVideoSource('#footerVideo', card.footerVideo);
    }

    if (card.colors) {
      this.applyColors(card.colors);
    }

    if (card.metadata?.isImageHidden) {
      document.querySelector('.header__illustration').classList.add('hidden');
      document.querySelector('.header').classList.add('image-hidden');
    }
  }

  setSafeTextContent(selector, text) {
    const element = document.querySelector(selector);
    if (element) {
      element.textContent = text;
    }
  }

  setSafeAttribute(selector, attribute, value) {
    const element = document.querySelector(selector);
    if (element && value) {
      element[attribute] = value;
    }
  }

  setVideoSource(videoSelector, source) {
    const video = document.querySelector(videoSelector);
    if (video && source) {
      const sourceElement = video.querySelector('source');
      if (sourceElement) {
        sourceElement.src = source;
      } else {
        video.src = source;
      }
      video.load();
    }
  }

  applyColors(colors) {
    if (colors.background) {
      document.body.style.backgroundColor = colors.background;
    }
    if (colors.primary) {
      const elements = document.querySelectorAll(
        '.header__title, .header__brauerei, .header__kaliningrad'
      );
      elements.forEach(el => {
        el.style.color = colors.primary;
      });

      this.applyLogoColor(colors.primary);
    }
  }

  applyLogoColor(color) {
    const logo = document.querySelector('.logo img');
    if (logo) {
      this.updateSvgFilter(color);
      logo.style.filter = 'url(#colorFilter)';
    }
  }

  updateSvgFilter(color) {
    let svgFilter = document.getElementById('colorFilter');
    if (!svgFilter) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.style.position = 'absolute';
      svg.style.width = '0';
      svg.style.height = '0';
      svgFilter = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'filter'
      );
      svgFilter.id = 'colorFilter';
      svg.appendChild(svgFilter);
      document.body.appendChild(svg);
    }

    svgFilter.innerHTML =
      '<feFlood flood-color="' +
      color +
      '" result="flood"/><feComposite in="flood" in2="SourceGraphic" operator="in"/>';
  }

  updateUIForEditMode(cardTitle) {
    document.title = `Редактирование: ${cardTitle}`;
    const saveBtn = document.getElementById('saveCard');
    if (saveBtn) {
      saveBtn.innerHTML = 'Обновить карточку';
      saveBtn.style.background = '#2ecc71';
    }
  }

  updateUIForNewMode() {
    document.title = 'Создание новой карточки';
  }

  showLoadingState() {
    const saveBtn = document.getElementById('saveCard');
    if (saveBtn) {
      saveBtn.innerHTML = 'Сохранение...';
      saveBtn.disabled = true;
      saveBtn.style.background = '#95a5a6';
    }
  }

  hideLoadingState() {
    const saveBtn = document.getElementById('saveCard');
    if (saveBtn) {
      saveBtn.innerHTML = this.currentCard
        ? 'Обновить карточку'
        : 'Сохранить карточку';
      saveBtn.disabled = false;
      saveBtn.style.background = this.currentCard ? '#2ecc71' : '#f06a12';
    }
  }

  showSuccessMessage(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #9ACD32;
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10001;
      font-weight: bold;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CardEditor();
});
