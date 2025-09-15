// Базовый рендерер для Bot HTML

import { Section, Directive, RendererConfig, RenderResult } from '../types';
import { normPx_, normLen_, normBox_, normRadiusBox_, esc_ } from '../utils/normalizers';

/**
 * Базовый класс для всех рендереров
 */
export abstract class BaseRenderer {
  protected config: RendererConfig;
  
  constructor(config: RendererConfig) {
    this.config = config;
  }
  
  /**
   * Рендерит секцию в HTML
   */
  abstract render(section: Section): string;
  
  /**
   * Генерирует CSS для секции
   */
  abstract generateCSS(section: Section): string;
  
  /**
   * Создает CSS переменную
   */
  protected createCSSVariable(name: string, value: string): string {
    if (this.config.cssVariables) {
      return `--${this.config.cssPrefix}-${name}: ${value};`;
    }
    return '';
  }
  
  /**
   * Создает CSS класс
   */
  protected createCSSClass(className: string, styles: Record<string, string>): string {
    const prefix = this.config.cssPrefix;
    const classSelector = `.${prefix}-${className}`;
    
    const cssRules = Object.entries(styles)
      .map(([property, value]) => `  ${property}: ${value};`)
      .join('\n');
    
    return `${classSelector} {\n${cssRules}\n}`;
  }
  
  /**
   * Создает HTML элемент с классами
   */
  protected createElement(
    tag: string, 
    className: string, 
    content: string = '', 
    attributes: Record<string, string> = {}
  ): string {
    const prefix = this.config.cssPrefix;
    const classAttr = `${prefix}-${className}`;
    
    const attrs = Object.entries(attributes)
      .map(([key, value]) => `${key}="${esc_(value)}"`)
      .join(' ');
    
    if (attrs) {
      return `<${tag} class="${classAttr}" ${attrs}>${content}</${tag}>`;
    }
    
    return `<${tag} class="${classAttr}">${content}</${tag}>`;
  }
  
  /**
   * Применяет стили к элементу
   */
  protected applyStyles(element: string, styles: Record<string, string>): string {
    if (this.config.inlineStyles) {
      const styleAttr = Object.entries(styles)
        .map(([property, value]) => `${property}: ${value}`)
        .join('; ');
      
      return element.replace(/>/, ` style="${styleAttr}">`);
    }
    
    return element;
  }
  
  /**
   * Извлекает значение директивы
   */
  protected getDirectiveValue(section: Section, directiveType: string, defaultValue: string = ''): string {
    const directive = section.directives.find(d => d.type === directiveType);
    return directive ? directive.value : defaultValue;
  }
  
  /**
   * Извлекает параметры директивы
   */
  protected getDirectiveParams(section: Section, directiveType: string): Record<string, string> {
    const directive = section.directives.find(d => d.type === directiveType);
    return directive?.params || {};
  }
  
  /**
   * Нормализует CSS значения
   */
  protected normalizeCSS(value: string, type: 'px' | 'len' | 'box' | 'radius' = 'px'): string {
    switch (type) {
      case 'px':
        return normPx_(value);
      case 'len':
        return normLen_(value);
      case 'box':
        return normBox_(value);
      case 'radius':
        return normRadiusBox_(value);
      default:
        return value;
    }
  }
  
  /**
   * Создает медиа-запросы для адаптивности
   */
  protected createMediaQuery(breakpoint: string, styles: string): string {
    return `@media (max-width: ${breakpoint}) {\n${styles}\n}`;
  }
  
  /**
   * Генерирует уникальный ID для элемента
   */
  protected generateId(prefix: string, section: Section): string {
    return `${this.config.cssPrefix}-${prefix}-${section.id}`;
  }
}
