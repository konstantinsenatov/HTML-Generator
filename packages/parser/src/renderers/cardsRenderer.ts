// Рендерер для карточек

import { Section } from '../types';
import { BaseRenderer } from './baseRenderer';

export class CardsRenderer extends BaseRenderer {
  render(section: Section): string {
    const content = this.extractContent(section);
    const titleDirective = section.directives.find(d => d.type === 'TITLE');
    const colsDirective = section.directives.find(d => d.type === 'COLS');
    const cols = colsDirective?.count || 3;
    
    let html = '';
    
    // Заголовок секции
    if (titleDirective) {
      html += this.createElement('h2', 'cards-title', titleDirective.text);
    }
    
    // Создаем карточки из контента
    const cards = this.createCards(content, cols);
    html += this.createElement('div', 'cards-grid', cards);
    
    // Обертка секции
    const sectionElement = this.createElement('section', 'cards-section', html, {
      id: section.id
    });
    
    return sectionElement;
  }
  
  generateCSS(section: Section): string {
    const styles: string[] = [];
    const colsDirective = section.directives.find(d => d.type === 'COLS');
    const cols = colsDirective?.count || 3;
    
    // Базовые стили для секции карточек
    styles.push(this.createCSSClass('cards-section', {
      padding: '2rem 1rem',
      'max-width': '1200px',
      margin: '0 auto'
    }));
    
    // Стили для заголовка
    styles.push(this.createCSSClass('cards-title', {
      'font-size': '2rem',
      'font-weight': 'bold',
      'margin-bottom': '2rem',
      'text-align': 'center',
      color: '#333'
    }));
    
    // Стили для сетки карточек
    styles.push(this.createCSSClass('cards-grid', {
      display: 'grid',
      'grid-template-columns': `repeat(${cols}, 1fr)`,
      gap: '1.5rem',
      'align-items': 'stretch'
    }));
    
    // Стили для карточки
    styles.push(this.createCSSClass('card', {
      'background-color': '#ffffff',
      border: '1px solid #e0e0e0',
      'border-radius': '8px',
      padding: '1.5rem',
      'box-shadow': '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'box-shadow 0.3s ease'
    }));
    
    // Hover эффект для карточки
    styles.push(this.createCSSClass('card:hover', {
      'box-shadow': '0 4px 8px rgba(0,0,0,0.15)'
    }));
    
    // Стили для заголовка карточки
    styles.push(this.createCSSClass('card-title', {
      'font-size': '1.25rem',
      'font-weight': 'bold',
      'margin-bottom': '1rem',
      color: '#333'
    }));
    
    // Стили для контента карточки
    styles.push(this.createCSSClass('card-content', {
      'font-size': '1rem',
      'line-height': '1.6',
      color: '#666'
    }));
    
    // Применяем директивы
    this.applyDirectives(section, styles);
    
    // Адаптивность
    styles.push(this.createMediaQuery('768px', `
      .${this.config.cssPrefix}-cards-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      .${this.config.cssPrefix}-cards-title {
        font-size: 1.5rem;
      }
      .${this.config.cssPrefix}-card {
        padding: 1rem;
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
  
  private createCards(content: string, cols: number): string {
    // Разбиваем контент на блоки для карточек
    const blocks = this.splitContentIntoBlocks(content);
    let html = '';
    
    blocks.forEach((block, index) => {
      const cardContent = this.createCardContent(block, index);
      html += this.createElement('div', 'card', cardContent);
    });
    
    return html;
  }
  
  private createCardContent(block: string, index: number): string {
    // Пытаемся извлечь заголовок из блока
    const lines = block.split('\n').map(line => line.trim()).filter(line => line);
    
    if (lines.length === 0) {
      return this.createElement('div', 'card-content', block);
    }
    
    let title = '';
    let content = '';
    
    // Первая строка может быть заголовком
    if (lines.length > 1 && lines[0].length < 50) {
      title = lines[0];
      content = lines.slice(1).join('\n');
    } else {
      content = block;
    }
    
    let cardHtml = '';
    
    if (title) {
      cardHtml += this.createElement('h3', 'card-title', title);
    }
    
    cardHtml += this.createElement('div', 'card-content', content);
    
    return cardHtml;
  }
  
  private splitContentIntoBlocks(content: string): string[] {
    // Разбиваем контент на блоки по двойным переносам строк
    const blocks = content
      .split(/\n\s*\n/)
      .map(block => block.trim())
      .filter(block => block.length > 0);
    
    // Если блоков нет, создаем один блок из всего контента
    if (blocks.length === 0) {
      return [content];
    }
    
    return blocks;
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
        styles.push(this.createCSSClass('cards-section', bgStyles));
      }
    }
    
    // Стили карточек
    const cardDirective = section.directives.find(d => d.type === 'CARD');
    if (cardDirective) {
      const cardStyles: Record<string, string> = {};
      
      switch (cardDirective.property) {
        case 'bg':
          cardStyles['background-color'] = cardDirective.value;
          break;
        case 'border':
          cardStyles['border'] = cardDirective.value;
          break;
        case 'title_color':
          styles.push(this.createCSSClass('card-title', {
            color: cardDirective.value
          }));
          break;
      }
      
      if (Object.keys(cardStyles).length > 0) {
        styles.push(this.createCSSClass('card', cardStyles));
      }
    }
    
    // Радиус карточек
    const radiusDirective = section.directives.find(d => d.type === 'RADIUS');
    if (radiusDirective && radiusDirective.target === 'card') {
      styles.push(this.createCSSClass('card', {
        'border-radius': this.normalizeCSS(radiusDirective.radius, 'radius')
      }));
    }
    
    // Отступы секции
    const marginDirective = section.directives.find(d => d.type === 'MARGIN');
    if (marginDirective && marginDirective.target === 'section') {
      styles.push(this.createCSSClass('cards-section', {
        margin: this.normalizeCSS(marginDirective.padding, 'box')
      }));
    }
    
    const paddingDirective = section.directives.find(d => d.type === 'PADDING');
    if (paddingDirective && paddingDirective.target === 'section') {
      styles.push(this.createCSSClass('cards-section', {
        padding: this.normalizeCSS(paddingDirective.padding, 'box')
      }));
    }
  }
}
