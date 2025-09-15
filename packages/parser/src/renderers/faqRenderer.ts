// Рендерер для FAQ секций

import { Section } from '../types';
import { BaseRenderer } from './baseRenderer';

export class FAQRenderer extends BaseRenderer {
  render(section: Section): string {
    const content = this.extractContent(section);
    const titleDirective = section.directives.find(d => d.type === 'TITLE');
    const faqModeDirective = section.directives.find(d => d.type === 'FAQ_MODE');
    const mode = faqModeDirective?.mode || 'accordion';
    
    let html = '';
    
    // Заголовок секции
    if (titleDirective) {
      html += this.createElement('h2', 'faq-title', titleDirective.text);
    }
    
    // Создаем FAQ элементы
    const faqItems = this.createFAQItems(content, mode);
    html += this.createElement('div', 'faq-container', faqItems);
    
    // Обертка секции
    const sectionElement = this.createElement('section', 'faq-section', html, {
      id: section.id
    });
    
    return sectionElement;
  }
  
  generateCSS(section: Section): string {
    const styles: string[] = [];
    const faqModeDirective = section.directives.find(d => d.type === 'FAQ_MODE');
    const mode = faqModeDirective?.mode || 'accordion';
    
    // Базовые стили для секции FAQ
    styles.push(this.createCSSClass('faq-section', {
      padding: '2rem 1rem',
      'max-width': '1200px',
      margin: '0 auto'
    }));
    
    // Стили для заголовка
    styles.push(this.createCSSClass('faq-title', {
      'font-size': '2rem',
      'font-weight': 'bold',
      'margin-bottom': '2rem',
      'text-align': 'center',
      color: '#333'
    }));
    
    // Стили для контейнера FAQ
    styles.push(this.createCSSClass('faq-container', {
      display: 'flex',
      'flex-direction': 'column',
      gap: '1rem'
    }));
    
    // Стили для элемента FAQ
    styles.push(this.createCSSClass('faq-item', {
      'background-color': '#ffffff',
      border: '1px solid #e0e0e0',
      'border-radius': '8px',
      overflow: 'hidden'
    }));
    
    // Стили для заголовка FAQ элемента
    styles.push(this.createCSSClass('faq-question', {
      padding: '1rem 1.5rem',
      'background-color': '#f8f9fa',
      border: 'none',
      width: '100%',
      'text-align': 'left',
      'font-size': '1.1rem',
      'font-weight': 'bold',
      color: '#333',
      cursor: 'pointer',
      display: 'flex',
      'justify-content': 'space-between',
      'align-items': 'center',
      transition: 'background-color 0.3s ease'
    }));
    
    // Hover эффект для вопроса
    styles.push(this.createCSSClass('faq-question:hover', {
      'background-color': '#e9ecef'
    }));
    
    // Стили для иконки
    styles.push(this.createCSSClass('faq-icon', {
      'font-size': '1.2rem',
      transition: 'transform 0.3s ease'
    }));
    
    // Стили для ответа
    styles.push(this.createCSSClass('faq-answer', {
      padding: '0 1.5rem 1rem 1.5rem',
      'font-size': '1rem',
      'line-height': '1.6',
      color: '#666',
      display: 'none'
    }));
    
    // Стили для открытого состояния
    styles.push(this.createCSSClass('faq-item.active .faq-answer', {
      display: 'block'
    }));
    
    styles.push(this.createCSSClass('faq-item.active .faq-icon', {
      transform: 'rotate(45deg)'
    }));
    
    // Применяем директивы
    this.applyDirectives(section, styles);
    
    // Адаптивность
    styles.push(this.createMediaQuery('768px', `
      .${this.config.cssPrefix}-faq-section {
        padding: 1rem 0.5rem;
      }
      .${this.config.cssPrefix}-faq-title {
        font-size: 1.5rem;
      }
      .${this.config.cssPrefix}-faq-question {
        padding: 0.75rem 1rem;
        font-size: 1rem;
      }
      .${this.config.cssPrefix}-faq-answer {
        padding: 0 1rem 0.75rem 1rem;
      }
    `));
    
    return styles.join('\n\n');
  }
  
  private extractContent(section: Section): string {
    // Удаляем директивы из контента
    let content = section.content;
    content = content.replace(/\[([A-Z_]+)(?::([^\]]+))?\]/g, '');
    content = content.trim();
    return content;
  }
  
  private createFAQItems(content: string, mode: string): string {
    // Разбиваем контент на вопросы и ответы
    const items = this.parseFAQContent(content);
    let html = '';
    
    items.forEach((item, index) => {
      const faqItem = this.createFAQItem(item.question, item.answer, index, mode);
      html += faqItem;
    });
    
    return html;
  }
  
  private parseFAQContent(content: string): Array<{question: string, answer: string}> {
    const items: Array<{question: string, answer: string}> = [];
    
    // Разбиваем по строкам
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    
    let currentQuestion = '';
    let currentAnswer = '';
    
    for (const line of lines) {
      // Если строка начинается с "Q:" или "Вопрос:" - это вопрос
      if (line.match(/^(Q:|Вопрос:|Question:)\s*/i)) {
        // Сохраняем предыдущий элемент
        if (currentQuestion && currentAnswer) {
          items.push({
            question: currentQuestion,
            answer: currentAnswer
          });
        }
        
        // Начинаем новый вопрос
        currentQuestion = line.replace(/^(Q:|Вопрос:|Question:)\s*/i, '');
        currentAnswer = '';
      } else if (line.match(/^(A:|Ответ:|Answer:)\s*/i)) {
        // Если строка начинается с "A:" или "Ответ:" - это ответ
        currentAnswer = line.replace(/^(A:|Ответ:|Answer:)\s*/i, '');
      } else if (currentQuestion) {
        // Если у нас есть вопрос, добавляем к ответу
        if (currentAnswer) {
          currentAnswer += '\n' + line;
        } else {
          // Если ответа еще нет, возможно это продолжение вопроса
          currentQuestion += '\n' + line;
        }
      }
    }
    
    // Сохраняем последний элемент
    if (currentQuestion && currentAnswer) {
      items.push({
        question: currentQuestion,
        answer: currentAnswer
      });
    }
    
    // Если не нашли структурированные вопросы, создаем из списка
    if (items.length === 0) {
      const listItems = lines.filter(line => line.match(/^[-*•]\s/));
      if (listItems.length > 0) {
        listItems.forEach((item, index) => {
          const question = item.replace(/^[-*•]\s/, '');
          items.push({
            question: question,
            answer: `Ответ на вопрос ${index + 1}`
          });
        });
      }
    }
    
    return items;
  }
  
  private createFAQItem(question: string, answer: string, index: number, mode: string): string {
    const itemId = `faq-item-${index}`;
    
    // Иконка (плюс или стрелка)
    const icon = mode === 'accordion' ? '+' : '→';
    
    const questionElement = this.createElement(
      'button',
      'faq-question',
      `${question}<span class="${this.config.cssPrefix}-faq-icon">${icon}</span>`,
      {
        'data-faq-item': itemId,
        'aria-expanded': 'false'
      }
    );
    
    const answerElement = this.createElement('div', 'faq-answer', answer);
    
    const itemElement = this.createElement(
      'div',
      'faq-item',
      questionElement + answerElement,
      {
        id: itemId,
        'data-faq-mode': mode
      }
    );
    
    return itemElement;
  }
  
  private applyDirectives(section: Section, styles: string[]): void {
    // Фон секции
    const bgDirective = section.directives.find(d => d.type === 'BG_SECTION');
    if (bgDirective) {
      const bgStyles: Record<string, string> = {};
      
      if (bgDirective.color) {
        bgStyles['background-color'] = bgDirective.color;
      }
      
      if (bgDirective.image) {
        bgStyles['background-image'] = `url(${bgDirective.image})`;
        bgStyles['background-size'] = 'cover';
        bgStyles['background-position'] = 'center';
      }
      
      if (Object.keys(bgStyles).length > 0) {
        styles.push(this.createCSSClass('faq-section', bgStyles));
      }
    }
    
    // Границы FAQ элементов
    const borderDirective = section.directives.find(d => d.type === 'BORDER_FAQ_ITEM');
    if (borderDirective) {
      styles.push(this.createCSSClass('faq-item', {
        border: borderDirective.border
      }));
    }
    
    // Отступы секции
    const marginDirective = section.directives.find(d => d.type === 'MARGIN');
    if (marginDirective && marginDirective.target === 'section') {
      styles.push(this.createCSSClass('faq-section', {
        margin: this.normalizeCSS(marginDirective.padding, 'box')
      }));
    }
    
    const paddingDirective = section.directives.find(d => d.type === 'PADDING');
    if (paddingDirective && paddingDirective.target === 'section') {
      styles.push(this.createCSSClass('faq-section', {
        padding: this.normalizeCSS(paddingDirective.padding, 'box')
      }));
    }
    
    // Радиус секции
    const radiusDirective = section.directives.find(d => d.type === 'RADIUS');
    if (radiusDirective && radiusDirective.target === 'section') {
      styles.push(this.createCSSClass('faq-section', {
        'border-radius': this.normalizeCSS(radiusDirective.radius, 'radius')
      }));
    }
  }
}
