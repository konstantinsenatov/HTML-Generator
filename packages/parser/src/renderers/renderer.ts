// Главный рендерер для всех типов секций

import { Section, RendererConfig, RenderResult } from '../types';
import { BaseRenderer } from './baseRenderer';
import { MediaRenderer } from './mediaRenderer';
import { ZigzagRenderer } from './zigzagRenderer';
import { CardsRenderer } from './cardsRenderer';
import { FAQRenderer } from './faqRenderer';

export class BotHTMLRenderer {
  private config: RendererConfig;
  private renderers: Map<string, BaseRenderer>;
  
  constructor(config: RendererConfig) {
    this.config = config;
    this.renderers = new Map();
    this.initializeRenderers();
  }
  
  /**
   * Инициализирует все рендереры
   */
  private initializeRenderers(): void {
    this.renderers.set('media', new MediaRenderer(this.config));
    this.renderers.set('zigzag', new ZigzagRenderer(this.config));
    this.renderers.set('cards', new CardsRenderer(this.config));
    this.renderers.set('faq', new FAQRenderer(this.config));
    this.renderers.set('banner', new MediaRenderer(this.config)); // Используем MediaRenderer для banner
    this.renderers.set('text', new MediaRenderer(this.config)); // Используем MediaRenderer для text
  }
  
  /**
   * Рендерит все секции в HTML
   */
  render(sections: Section[]): RenderResult {
    let html = '';
    let css = '';
    
    // Добавляем CSS переменные если нужно
    if (this.config.cssVariables) {
      css += this.generateCSSVariables();
    }
    
    // Рендерим каждую секцию
    for (const section of sections) {
      const renderer = this.renderers.get(section.type);
      if (renderer) {
        html += renderer.render(section);
        css += renderer.generateCSS(section);
      }
    }
    
    // Добавляем JavaScript для интерактивности
    const js = this.generateJavaScript();
    
    return {
      html,
      css,
      metadata: {
        sectionsCount: sections.length,
        renderersUsed: Array.from(this.renderers.keys())
      }
    };
  }
  
  /**
   * Рендерит секцию в HTML с inline стилями
   */
  renderWithInlineStyles(sections: Section[]): RenderResult {
    const inlineConfig: RendererConfig = {
      ...this.config,
      inlineStyles: true,
      cssVariables: false
    };
    
    const inlineRenderer = new BotHTMLRenderer(inlineConfig);
    return inlineRenderer.render(sections);
  }
  
  /**
   * Генерирует CSS переменные
   */
  private generateCSSVariables(): string {
    return `
:root {
  --${this.config.cssPrefix}-primary-color: #007bff;
  --${this.config.cssPrefix}-secondary-color: #6c757d;
  --${this.config.cssPrefix}-success-color: #28a745;
  --${this.config.cssPrefix}-danger-color: #dc3545;
  --${this.config.cssPrefix}-warning-color: #ffc107;
  --${this.config.cssPrefix}-info-color: #17a2b8;
  --${this.config.cssPrefix}-light-color: #f8f9fa;
  --${this.config.cssPrefix}-dark-color: #343a40;
  
  --${this.config.cssPrefix}-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --${this.config.cssPrefix}-font-size-base: 1rem;
  --${this.config.cssPrefix}-line-height-base: 1.5;
  
  --${this.config.cssPrefix}-border-radius: 0.375rem;
  --${this.config.cssPrefix}-box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  --${this.config.cssPrefix}-transition: all 0.15s ease-in-out;
}
`;
  }
  
  /**
   * Генерирует JavaScript для интерактивности
   */
  private generateJavaScript(): string {
    return `
// Bot HTML JavaScript
(function() {
  'use strict';
  
  // FAQ Accordion functionality
  function initFAQ() {
    const faqItems = document.querySelectorAll('.${this.config.cssPrefix}-faq-item');
    
    faqItems.forEach(item => {
      const question = item.querySelector('.${this.config.cssPrefix}-faq-question');
      
      if (question) {
        question.addEventListener('click', function() {
          const isActive = item.classList.contains('active');
          
          // Закрываем все другие элементы
          faqItems.forEach(otherItem => {
            if (otherItem !== item) {
              otherItem.classList.remove('active');
              const otherQuestion = otherItem.querySelector('.${this.config.cssPrefix}-faq-question');
              if (otherQuestion) {
                otherQuestion.setAttribute('aria-expanded', 'false');
              }
            }
          });
          
          // Переключаем текущий элемент
          if (isActive) {
            item.classList.remove('active');
            question.setAttribute('aria-expanded', 'false');
          } else {
            item.classList.add('active');
            question.setAttribute('aria-expanded', 'true');
          }
        });
      }
    });
  }
  
  // Инициализация при загрузке DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFAQ);
  } else {
    initFAQ();
  }
})();
`;
  }
  
  /**
   * Создает полный HTML документ
   */
  createFullHTML(sections: Section[], title: string = 'Bot HTML Document'): string {
    const result = this.render(sections);
    
    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
${result.css}
    </style>
</head>
<body>
    ${result.html}
    <script>
${this.generateJavaScript()}
    </script>
</body>
</html>`;
  }
  
  /**
   * Создает HTML с inline стилями
   */
  createInlineHTML(sections: Section[], title: string = 'Bot HTML Document'): string {
    const result = this.renderWithInlineStyles(sections);
    
    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
${result.css}
    </style>
</head>
<body>
    ${result.html}
    <script>
${this.generateJavaScript()}
    </script>
</body>
</html>`;
  }
}
