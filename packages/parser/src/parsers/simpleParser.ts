// Упрощенный парсер для демонстрации

export interface SimpleDirective {
  type: string;
  value: string;
  params?: Record<string, string>;
}

export class SimpleDirectiveParser {
  private static readonly DIRECTIVE_REGEX = /\[([A-Z_]+)(?::([^\]]*))?\]/g;
  
  /**
   * Парсит текст и извлекает все директивы
   */
  static parseDirectives(text: string): SimpleDirective[] {
    const directives: SimpleDirective[] = [];
    let match;
    
    while ((match = this.DIRECTIVE_REGEX.exec(text)) !== null) {
      const [, type, value] = match;
      const directive = this.parseDirective(type, value || '');
      if (directive) {
        directives.push(directive);
      }
    }
    
    return directives;
  }
  
  /**
   * Парсит отдельную директиву
   */
  private static parseDirective(type: string, value: string): SimpleDirective | null {
    // Простая обработка основных директив
    switch (type) {
      case 'CTA':
        return this.parseCTA(value);
      case 'BTN':
        return this.parseBTN(value);
      case 'IMG':
        return this.parseIMG(value);
      case 'LAYOUT':
        return this.parseLAYOUT(value);
      case 'BG':
        return this.parseBG(value);
      case 'COLS':
        return this.parseCOLS(value);
      case 'TITLE':
        return this.parseTITLE(value);
      case 'LEAD':
        return this.parseLEAD(value);
      default:
        return null;
    }
  }
  
  // Парсеры для каждой директивы
  private static parseCTA(value: string): SimpleDirective {
    const [text, href, style] = value.split('|');
    return {
      type: 'CTA',
      value,
      params: {
        text: text || '',
        href: href || '#',
        style: style || 'primary'
      }
    };
  }
  
  private static parseBTN(value: string): SimpleDirective {
    const [text, href, style] = value.split('|');
    return {
      type: 'BTN',
      value,
      params: {
        text: text || '',
        href: href || '#',
        style: style || 'primary'
      }
    };
  }
  
  private static parseIMG(value: string): SimpleDirective {
    const [src, alt, width, height] = value.split('|');
    return {
      type: 'IMG',
      value,
      params: {
        src: src || '',
        alt: alt || '',
        width: width || '',
        height: height || ''
      }
    };
  }
  
  private static parseLAYOUT(value: string): SimpleDirective {
    return {
      type: 'LAYOUT',
      value,
      params: {
        layout: value || 'media'
      }
    };
  }
  
  private static parseBG(value: string): SimpleDirective {
    const [color, image] = value.split('|');
    return {
      type: 'BG',
      value,
      params: {
        color: color || '#ffffff',
        image: image || ''
      }
    };
  }
  
  private static parseCOLS(value: string): SimpleDirective {
    return {
      type: 'COLS',
      value,
      params: {
        count: value || '1'
      }
    };
  }
  
  private static parseTITLE(value: string): SimpleDirective {
    return {
      type: 'TITLE',
      value,
      params: {
        text: value || ''
      }
    };
  }
  
  private static parseLEAD(value: string): SimpleDirective {
    return {
      type: 'LEAD',
      value,
      params: {
        text: value || ''
      }
    };
  }
}
