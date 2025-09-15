// Главный экспорт пакета парсера Bot HTML

// Типы
export * from './types';

// Утилиты
export * from './utils/normalizers';

// Парсеры
export * from './parsers/directiveParser';
export * from './parsers/documentParser';

// Рендереры
export * from './renderers/baseRenderer';
export * from './renderers/mediaRenderer';
export * from './renderers/zigzagRenderer';
export * from './renderers/cardsRenderer';
export * from './renderers/faqRenderer';
export * from './renderers/renderer';

// CSS
export * from './css/bot-styles';

// Главный класс для удобного использования
import { DocumentParser } from './parsers/documentParser';
import { BotHTMLRenderer } from './renderers/renderer';
import { DocumentToken, Section, RendererConfig, RenderResult } from './types';

export class BotHTML {
  private renderer: BotHTMLRenderer;
  
  constructor(config: RendererConfig = { cssPrefix: 'bot', inlineStyles: false, cssVariables: true }) {
    this.renderer = new BotHTMLRenderer(config);
  }
  
  /**
   * Парсит документ Word в секции
   */
  parseDocument(tokens: DocumentToken[]): { sections: Section[]; metadata: any } {
    return DocumentParser.parseDocument(tokens);
  }
  
  /**
   * Рендерит секции в HTML
   */
  render(sections: Section[]): RenderResult {
    return this.renderer.render(sections);
  }
  
  /**
   * Рендерит секции в HTML с inline стилями
   */
  renderInline(sections: Section[]): RenderResult {
    return this.renderer.renderWithInlineStyles(sections);
  }
  
  /**
   * Создает полный HTML документ
   */
  createHTML(tokens: DocumentToken[], title?: string): string {
    const parsed = this.parseDocument(tokens);
    return this.renderer.createFullHTML(parsed.sections, title);
  }
  
  /**
   * Создает HTML с inline стилями
   */
  createInlineHTML(tokens: DocumentToken[], title?: string): string {
    const parsed = this.parseDocument(tokens);
    return this.renderer.createInlineHTML(parsed.sections, title);
  }
  
  /**
   * Очищает текст от директив
   */
  cleanText(text: string): string {
    return DocumentParser.cleanText(text);
  }
}
