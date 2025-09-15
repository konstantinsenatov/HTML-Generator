// CSS стили для Bot HTML

export const BOT_CSS = `
/* Bot HTML CSS - Изолированные стили с префиксом .bot- */

/* CSS переменные */
:root {
  --bot-primary-color: #007bff;
  --bot-secondary-color: #6c757d;
  --bot-success-color: #28a745;
  --bot-danger-color: #dc3545;
  --bot-warning-color: #ffc107;
  --bot-info-color: #17a2b8;
  --bot-light-color: #f8f9fa;
  --bot-dark-color: #343a40;
  
  --bot-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --bot-font-size-base: 1rem;
  --bot-line-height-base: 1.5;
  
  --bot-border-radius: 0.375rem;
  --bot-box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  --bot-transition: all 0.15s ease-in-out;
  
  --bot-container-max-width: 1200px;
  --bot-section-padding: 2rem 1rem;
  --bot-card-padding: 1.5rem;
  --bot-button-padding: 0.5rem 1rem;
}

/* Базовые стили */
.bot-container {
  max-width: var(--bot-container-max-width);
  margin: 0 auto;
  padding: 0 1rem;
}

.bot-section {
  padding: var(--bot-section-padding);
}

.bot-text-center {
  text-align: center;
}

.bot-text-left {
  text-align: left;
}

.bot-text-right {
  text-align: right;
}

/* Кнопки */
.bot-btn {
  display: inline-block;
  padding: var(--bot-button-padding);
  font-size: var(--bot-font-size-base);
  font-weight: 400;
  line-height: var(--bot-line-height-base);
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: var(--bot-border-radius);
  transition: var(--bot-transition);
  user-select: none;
}

.bot-btn:hover {
  text-decoration: none;
}

.bot-btn:focus {
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.bot-btn-primary {
  color: #fff;
  background-color: var(--bot-primary-color);
  border-color: var(--bot-primary-color);
}

.bot-btn-primary:hover {
  color: #fff;
  background-color: #0056b3;
  border-color: #004085;
}

.bot-btn-secondary {
  color: #fff;
  background-color: var(--bot-secondary-color);
  border-color: var(--bot-secondary-color);
}

.bot-btn-secondary:hover {
  color: #fff;
  background-color: #545b62;
  border-color: #4e555b;
}

.bot-btn-outline {
  color: var(--bot-primary-color);
  background-color: transparent;
  border-color: var(--bot-primary-color);
}

.bot-btn-outline:hover {
  color: #fff;
  background-color: var(--bot-primary-color);
  border-color: var(--bot-primary-color);
}

/* Медиа секции */
.bot-media-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--bot-section-padding);
  max-width: var(--bot-container-max-width);
  margin: 0 auto;
}

.bot-media-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #333;
}

.bot-media-image {
  max-width: 100%;
  height: auto;
  border-radius: var(--bot-border-radius);
  margin-bottom: 1rem;
}

.bot-media-lead {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.bot-media-content {
  font-size: var(--bot-font-size-base);
  line-height: 1.6;
  color: #333;
}

/* Zigzag секции */
.bot-zigzag-section {
  padding: var(--bot-section-padding);
  max-width: var(--bot-container-max-width);
  margin: 0 auto;
}

.bot-zigzag-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-align: center;
  color: #333;
}

.bot-zigzag-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.bot-zigzag-row {
  display: flex;
  align-items: center;
  gap: 2rem;
  min-height: 300px;
}

.bot-zigzag-row-even {
  flex-direction: row-reverse;
}

.bot-zigzag-text {
  flex: 1;
  padding: 1rem;
}

.bot-zigzag-image {
  flex: 1;
  text-align: center;
}

.bot-zigzag-img {
  max-width: 100%;
  height: auto;
  border-radius: var(--bot-border-radius);
}

.bot-zigzag-lead {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.bot-zigzag-text-content {
  font-size: var(--bot-font-size-base);
  line-height: 1.6;
  color: #333;
}

/* Карточки */
.bot-cards-section {
  padding: var(--bot-section-padding);
  max-width: var(--bot-container-max-width);
  margin: 0 auto;
}

.bot-cards-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-align: center;
  color: #333;
}

.bot-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  align-items: stretch;
}

.bot-card {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: var(--bot-border-radius);
  padding: var(--bot-card-padding);
  box-shadow: var(--bot-box-shadow);
  transition: var(--bot-transition);
}

.bot-card:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.bot-card-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #333;
}

.bot-card-content {
  font-size: var(--bot-font-size-base);
  line-height: 1.6;
  color: #666;
}

/* FAQ секции */
.bot-faq-section {
  padding: var(--bot-section-padding);
  max-width: var(--bot-container-max-width);
  margin: 0 auto;
}

.bot-faq-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-align: center;
  color: #333;
}

.bot-faq-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.bot-faq-item {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: var(--bot-border-radius);
  overflow: hidden;
}

.bot-faq-question {
  padding: 1rem 1.5rem;
  background-color: #f8f9fa;
  border: none;
  width: 100%;
  text-align: left;
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: var(--bot-transition);
}

.bot-faq-question:hover {
  background-color: #e9ecef;
}

.bot-faq-icon {
  font-size: 1.2rem;
  transition: var(--bot-transition);
}

.bot-faq-answer {
  padding: 0 1.5rem 1rem 1.5rem;
  font-size: var(--bot-font-size-base);
  line-height: 1.6;
  color: #666;
  display: none;
}

.bot-faq-item.active .bot-faq-answer {
  display: block;
}

.bot-faq-item.active .bot-faq-icon {
  transform: rotate(45deg);
}

/* Адаптивность */
@media (max-width: 768px) {
  .bot-media-section {
    padding: 1rem 0.5rem;
  }
  
  .bot-media-title {
    font-size: 1.5rem;
  }
  
  .bot-media-lead {
    font-size: 1rem;
  }
  
  .bot-zigzag-row {
    flex-direction: column !important;
    gap: 1rem;
  }
  
  .bot-zigzag-row-even {
    flex-direction: column !important;
  }
  
  .bot-zigzag-text {
    padding: 0.5rem;
  }
  
  .bot-zigzag-title {
    font-size: 1.5rem;
  }
  
  .bot-zigzag-lead {
    font-size: 1rem;
  }
  
  .bot-cards-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .bot-cards-title {
    font-size: 1.5rem;
  }
  
  .bot-card {
    padding: 1rem;
  }
  
  .bot-faq-section {
    padding: 1rem 0.5rem;
  }
  
  .bot-faq-title {
    font-size: 1.5rem;
  }
  
  .bot-faq-question {
    padding: 0.75rem 1rem;
    font-size: 1rem;
  }
  
  .bot-faq-answer {
    padding: 0 1rem 0.75rem 1rem;
  }
}

/* Утилиты */
.bot-mb-1 { margin-bottom: 0.25rem; }
.bot-mb-2 { margin-bottom: 0.5rem; }
.bot-mb-3 { margin-bottom: 1rem; }
.bot-mb-4 { margin-bottom: 1.5rem; }
.bot-mb-5 { margin-bottom: 3rem; }

.bot-mt-1 { margin-top: 0.25rem; }
.bot-mt-2 { margin-top: 0.5rem; }
.bot-mt-3 { margin-top: 1rem; }
.bot-mt-4 { margin-top: 1.5rem; }
.bot-mt-5 { margin-top: 3rem; }

.bot-p-1 { padding: 0.25rem; }
.bot-p-2 { padding: 0.5rem; }
.bot-p-3 { padding: 1rem; }
.bot-p-4 { padding: 1.5rem; }
.bot-p-5 { padding: 3rem; }

.bot-rounded { border-radius: var(--bot-border-radius); }
.bot-rounded-lg { border-radius: 0.5rem; }
.bot-rounded-xl { border-radius: 1rem; }

.bot-shadow { box-shadow: var(--bot-box-shadow); }
.bot-shadow-lg { box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15); }

.bot-d-none { display: none; }
.bot-d-block { display: block; }
.bot-d-flex { display: flex; }
.bot-d-grid { display: grid; }
`;

/**
 * Возвращает CSS с кастомным префиксом
 */
export function getBotCSS(customPrefix: string = 'bot'): string {
  return BOT_CSS.replace(/\.bot-/g, `.${customPrefix}-`);
}

/**
 * Возвращает inline CSS для встраивания в HTML
 */
export function getInlineBotCSS(customPrefix: string = 'bot'): string {
  return `<style>\n${getBotCSS(customPrefix)}\n</style>`;
}
