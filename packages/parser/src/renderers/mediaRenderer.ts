// Рендерер для медиа-секций

import { Section } from '../types';
import { BaseRenderer } from './baseRenderer';

export class MediaRenderer extends BaseRenderer {
  render(section: Section): string {
    const content = this.extractContent(section);
    const imageDirective = section.directives.find(d => d.type === 'IMG');
    const titleDirective = section.directives.find(d => d.type === 'TITLE');
    const leadDirective = section.directives.find(d => d.type === 'LEAD');
    
    let html = '';
    
    // Заголовок
    if (titleDirective) {
      html += this.createElement('h2', 'media-title', titleDirective.text);
    }
    
    // Изображение
    if (imageDirective) {
      const imgElement = this.createElement(
        'img',
        'media-image',
        '',
        {
          src: imageDirective.src,
          alt: imageDirective.alt || '',
          width: imageDirective.width || '',
          height: imageDirective.height || ''
        }
      );
      html += imgElement;
    }
    
    // Подзаголовок
    if (leadDirective) {
      html += this.createElement('p', 'media-lead', leadDirective.text);
    }
    
    // Основной контент
    if (content) {
      html += this.createElement('div', 'media-content', content);
    }
    
    // Обертка секции
    const sectionElement = this.createElement('section', 'media-section', html, {
      id: section.id
    });
    
    return sectionElement;
  }
  
  generateCSS(section: Section): string {
    const styles: string[] = [];
    
    // Базовые стили для медиа-секции
    styles.push(this.createCSSClass('media-section', {
      display: 'flex',
      'flex-direction': 'column',
      'align-items': 'center',
      'text-align': 'center',
      padding: '2rem 1rem',
      'max-width': '1200px',
      margin: '0 auto'
    }));
    
    // Стили для заголовка
    styles.push(this.createCSSClass('media-title', {
      'font-size': '2rem',
      'font-weight': 'bold',
      'margin-bottom': '1rem',
      color: '#333'
    }));
    
    // Стили для изображения
    styles.push(this.createCSSClass('media-image', {
      'max-width': '100%',
      height: 'auto',
      'border-radius': '8px',
      'margin-bottom': '1rem'
    }));
    
    // Стили для подзаголовка
    styles.push(this.createCSSClass('media-lead', {
      'font-size': '1.2rem',
      color: '#666',
      'margin-bottom': '1rem',
      'line-height': '1.6'
    }));
    
    // Стили для контента
    styles.push(this.createCSSClass('media-content', {
      'font-size': '1rem',
      'line-height': '1.6',
      color: '#333'
    }));
    
    // Применяем директивы
    this.applyDirectives(section, styles);
    
    // Адаптивность
    styles.push(this.createMediaQuery('768px', `
      .${this.config.cssPrefix}-media-section {
        padding: 1rem 0.5rem;
      }
      .${this.config.cssPrefix}-media-title {
        font-size: 1.5rem;
      }
      .${this.config.cssPrefix}-media-lead {
        font-size: 1rem;
      }
    `));
    
    return styles.join('\n\n');
  }
  
  private extractContent(section: Section): string {
    // Удаляем директивы из контента
    let content = section.content;
    
    // Удаляем все директивы
    content = content.replace(/\[([A-Z_]+)(?::([^\]]+))?\]/g, '');
    
    // Очищаем от лишних пробелов
    content = content.trim();
    
    return content;
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
        styles.push(this.createCSSClass('media-section', bgStyles));
      }
    }
    
    // Выравнивание
    const alignDirective = section.directives.find(d => d.type === 'ALIGN');
    if (alignDirective) {
      const textAlign = alignDirective.alignment === 'center' ? 'center' : 
                       alignDirective.alignment === 'right' ? 'right' : 'left';
      
      styles.push(this.createCSSClass('media-section', {
        'text-align': textAlign
      }));
    }
    
    // Отступы
    const marginDirective = section.directives.find(d => d.type === 'MARGIN');
    if (marginDirective && marginDirective.target === 'section') {
      styles.push(this.createCSSClass('media-section', {
        margin: this.normalizeCSS(marginDirective.padding, 'box')
      }));
    }
    
    const paddingDirective = section.directives.find(d => d.type === 'PADDING');
    if (paddingDirective && paddingDirective.target === 'section') {
      styles.push(this.createCSSClass('media-section', {
        padding: this.normalizeCSS(paddingDirective.padding, 'box')
      }));
    }
    
    // Радиус
    const radiusDirective = section.directives.find(d => d.type === 'RADIUS');
    if (radiusDirective && radiusDirective.target === 'section') {
      styles.push(this.createCSSClass('media-section', {
        'border-radius': this.normalizeCSS(radiusDirective.radius, 'radius')
      }));
    }
    
    // Минимальная высота
    const minHeightDirective = section.directives.find(d => d.type === 'MIN_HEIGHT');
    if (minHeightDirective) {
      styles.push(this.createCSSClass('media-section', {
        'min-height': this.normalizeCSS(minHeightDirective.height, 'len')
      }));
    }
  }
}
