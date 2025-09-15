// Рендерер для zigzag секций с чередованием

import { Section } from '../types';
import { BaseRenderer } from './baseRenderer';

export class ZigzagRenderer extends BaseRenderer {
  render(section: Section): string {
    const content = this.extractContent(section);
    const imageDirective = section.directives.find(d => d.type === 'IMG');
    const titleDirective = section.directives.find(d => d.type === 'TITLE');
    const leadDirective = section.directives.find(d => d.type === 'LEAD');
    
    let html = '';
    
    // Заголовок секции
    if (titleDirective) {
      html += this.createElement('h2', 'zigzag-title', titleDirective.text);
    }
    
    // Основной контент zigzag
    const zigzagContent = this.createZigzagContent(content, imageDirective, leadDirective);
    html += this.createElement('div', 'zigzag-content', zigzagContent);
    
    // Обертка секции
    const sectionElement = this.createElement('section', 'zigzag-section', html, {
      id: section.id
    });
    
    return sectionElement;
  }
  
  generateCSS(section: Section): string {
    const styles: string[] = [];
    
    // Базовые стили для zigzag секции
    styles.push(this.createCSSClass('zigzag-section', {
      padding: '2rem 1rem',
      'max-width': '1200px',
      margin: '0 auto'
    }));
    
    // Стили для заголовка
    styles.push(this.createCSSClass('zigzag-title', {
      'font-size': '2rem',
      'font-weight': 'bold',
      'margin-bottom': '2rem',
      'text-align': 'center',
      color: '#333'
    }));
    
    // Стили для контейнера zigzag
    styles.push(this.createCSSClass('zigzag-content', {
      display: 'flex',
      'flex-direction': 'column',
      gap: '2rem'
    }));
    
    // Стили для строки zigzag
    styles.push(this.createCSSClass('zigzag-row', {
      display: 'flex',
      'align-items': 'center',
      gap: '2rem',
      'min-height': '300px'
    }));
    
    // Стили для четных строк (изображение справа)
    styles.push(this.createCSSClass('zigzag-row-even', {
      'flex-direction': 'row-reverse'
    }));
    
    // Стили для колонки контента
    styles.push(this.createCSSClass('zigzag-text', {
      flex: '1',
      padding: '1rem'
    }));
    
    // Стили для колонки изображения
    styles.push(this.createCSSClass('zigzag-image', {
      flex: '1',
      'text-align': 'center'
    }));
    
    // Стили для изображения
    styles.push(this.createCSSClass('zigzag-img', {
      'max-width': '100%',
      height: 'auto',
      'border-radius': '8px'
    }));
    
    // Стили для подзаголовка
    styles.push(this.createCSSClass('zigzag-lead', {
      'font-size': '1.2rem',
      color: '#666',
      'margin-bottom': '1rem',
      'line-height': '1.6'
    }));
    
    // Стили для текста
    styles.push(this.createCSSClass('zigzag-text-content', {
      'font-size': '1rem',
      'line-height': '1.6',
      color: '#333'
    }));
    
    // Применяем директивы
    this.applyDirectives(section, styles);
    
    // Адаптивность - на мобиле все в колонку
    styles.push(this.createMediaQuery('768px', `
      .${this.config.cssPrefix}-zigzag-row {
        flex-direction: column !important;
        gap: 1rem;
      }
      .${this.config.cssPrefix}-zigzag-row-even {
        flex-direction: column !important;
      }
      .${this.config.cssPrefix}-zigzag-text {
        padding: 0.5rem;
      }
      .${this.config.cssPrefix}-zigzag-title {
        font-size: 1.5rem;
      }
      .${this.config.cssPrefix}-zigzag-lead {
        font-size: 1rem;
      }
    `));
    
    return styles.join('\n\n');
  }
  
  private createZigzagContent(content: string, imageDirective: any, leadDirective: any): string {
    // Разбиваем контент на блоки (по параграфам или заголовкам)
    const blocks = this.splitContentIntoBlocks(content);
    let html = '';
    
    blocks.forEach((block, index) => {
      const isEven = index % 2 === 1; // Четные индексы (1, 3, 5...) - изображение справа
      const rowClass = isEven ? 'zigzag-row-even' : 'zigzag-row';
      
      let rowContent = '';
      
      // Текстовый блок
      let textContent = '';
      if (leadDirective && index === 0) {
        textContent += this.createElement('p', 'zigzag-lead', leadDirective.text);
      }
      textContent += this.createElement('div', 'zigzag-text-content', block);
      
      const textColumn = this.createElement('div', 'zigzag-text', textContent);
      rowContent += textColumn;
      
      // Блок изображения
      let imageContent = '';
      if (imageDirective) {
        const imgElement = this.createElement(
          'img',
          'zigzag-img',
          '',
          {
            src: imageDirective.src,
            alt: imageDirective.alt || '',
            width: imageDirective.width || '',
            height: imageDirective.height || ''
          }
        );
        imageContent = this.createElement('div', 'zigzag-image', imgElement);
      } else {
        // Заглушка для изображения
        imageContent = this.createElement('div', 'zigzag-image', '');
      }
      
      rowContent += imageContent;
      
      // Создаем строку
      const rowElement = this.createElement('div', rowClass, rowContent);
      html += rowElement;
    });
    
    return html;
  }
  
  private splitContentIntoBlocks(content: string): string[] {
    // Разбиваем контент на блоки по двойным переносам строк или заголовкам
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
        styles.push(this.createCSSClass('zigzag-section', bgStyles));
      }
    }
    
    // Выравнивание
    const alignDirective = section.directives.find(d => d.type === 'ALIGN');
    if (alignDirective) {
      const textAlign = alignDirective.alignment === 'center' ? 'center' : 
                       alignDirective.alignment === 'right' ? 'right' : 'left';
      
      styles.push(this.createCSSClass('zigzag-text', {
        'text-align': textAlign
      }));
    }
    
    // Отступы
    const marginDirective = section.directives.find(d => d.type === 'MARGIN');
    if (marginDirective && marginDirective.target === 'section') {
      styles.push(this.createCSSClass('zigzag-section', {
        margin: this.normalizeCSS(marginDirective.padding, 'box')
      }));
    }
    
    const paddingDirective = section.directives.find(d => d.type === 'PADDING');
    if (paddingDirective && paddingDirective.target === 'section') {
      styles.push(this.createCSSClass('zigzag-section', {
        padding: this.normalizeCSS(paddingDirective.padding, 'box')
      }));
    }
    
    // Радиус
    const radiusDirective = section.directives.find(d => d.type === 'RADIUS');
    if (radiusDirective && radiusDirective.target === 'section') {
      styles.push(this.createCSSClass('zigzag-section', {
        'border-radius': this.normalizeCSS(radiusDirective.radius, 'radius')
      }));
    }
    
    // Минимальная высота строк
    const minHeightDirective = section.directives.find(d => d.type === 'MIN_HEIGHT');
    if (minHeightDirective) {
      styles.push(this.createCSSClass('zigzag-row', {
        'min-height': this.normalizeCSS(minHeightDirective.height, 'len')
      }));
    }
  }
}
