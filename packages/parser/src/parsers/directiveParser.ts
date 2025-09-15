// Парсер директив Bot HTML

import { AnyDirective, Directive } from '../types';

/**
 * Основной парсер директив
 */
export class DirectiveParser {
  private static readonly DIRECTIVE_REGEX = /\[([A-Z_]+)(?::([^\]]+))?\]/g;
  
  /**
   * Парсит текст и извлекает все директивы
   */
  static parseDirectives(text: string): Directive[] {
    const directives: Directive[] = [];
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
  private static parseDirective(type: string, value: string): AnyDirective | null {
    switch (type) {
      case 'CTA':
        return this.parseCTA(value);
      case 'BTN':
        return this.parseBTN(value);
      case 'IMG':
        return this.parseIMG(value);
      case 'ICON':
        return this.parseICON(value);
      case 'LAYOUT':
        return this.parseLAYOUT(value);
      case 'IMAGE_SIZE':
        return this.parseIMAGE_SIZE(value);
      case 'CAP':
        return this.parseCAP(value);
      case 'COLS':
        return this.parseCOLS(value);
      case 'WIDTHS':
        return this.parseWIDTHS(value);
      case 'GRID':
        return this.parseGRID(value);
      case 'BG':
        return this.parseBG(value);
      case 'BG_SECTION':
        return this.parseBG_SECTION(value);
      case 'BG_CONTAINER':
        return this.parseBG_CONTAINER(value);
      case 'ALIGN':
        return this.parseALIGN(value);
      case 'VALIGN':
        return this.parseVALIGN(value);
      case 'HEADING':
        return this.parseHEADING(value);
      case 'MIN_HEIGHT':
        return this.parseMIN_HEIGHT(value);
      case 'SECTION_WIDTH':
        return this.parseSECTION_WIDTH(value);
      case 'CONTAINER_WIDTH':
        return this.parseCONTAINER_WIDTH(value);
      case 'HERO_WIDTH':
        return this.parseHERO_WIDTH(value);
      case 'SCOPE':
        return this.parseSCOPE(value);
      case 'LINK_COLOR':
        return this.parseLINK_COLOR(value);
      case 'LINK_WEIGHT':
        return this.parseLINK_WEIGHT(value);
      case 'LINK_UNDERLINE':
        return this.parseLINK_UNDERLINE(value);
      case 'OVERLAY':
        return this.parseOVERLAY(value);
      case 'MARGIN':
        return this.parseMARGIN(value);
      case 'PADDING':
        return this.parsePADDING(value);
      case 'SEC_MT':
        return this.parseSEC_MT(value);
      case 'SEC_MB':
        return this.parseSEC_MB(value);
      case 'TITLE':
        return this.parseTITLE(value);
      case 'LEAD':
        return this.parseLEAD(value);
      case 'SEO':
        return this.parseSEO(value);
      case 'RADIUS':
        return this.parseRADIUS(value);
      case 'CARD':
        return this.parseCARD(value);
      case 'BORDER':
        return this.parseBORDER(value);
      case 'FAQ_MODE':
        return this.parseFAQ_MODE(value);
      case 'FAQ_ICON':
        return this.parseFAQ_ICON(value);
      case 'BORDER_FAQ_ITEM':
        return this.parseBORDER_FAQ_ITEM(value);
      case 'CONTAINER_ALIGN':
        return this.parseCONTAINER_ALIGN(value);
      default:
        return null;
    }
  }
  
  // Парсеры для каждой директивы
  private static parseCTA(value: string): CTADirective {
    const [text, href, style] = value.split('|');
    return {
      type: 'CTA',
      value,
      text: text || '',
      href: href || '#',
      style: (style as 'primary' | 'secondary' | 'outline') || 'primary'
    };
  }
  
  private static parseBTN(value: string): BTNDirective {
    const [text, href, style] = value.split('|');
    return {
      type: 'BTN',
      value,
      text: text || '',
      href: href || '#',
      style: (style as 'primary' | 'secondary' | 'outline') || 'primary'
    };
  }
  
  private static parseIMG(value: string): IMGDirective {
    const [src, alt, width, height] = value.split('|');
    return {
      type: 'IMG',
      value,
      src: src || '',
      alt: alt || '',
      width: width || '',
      height: height || ''
    };
  }
  
  private static parseICON(value: string): ICONDirective {
    const [name, size, color] = value.split('|');
    return {
      type: 'ICON',
      value,
      name: name || '',
      size: size || '24px',
      color: color || '#000'
    };
  }
  
  private static parseLAYOUT(value: string): LayoutDirective {
    const layout = value as 'media' | 'cards' | 'banner' | 'faq' | 'zigzag';
    return {
      type: 'LAYOUT',
      value,
      layout: layout || 'media'
    };
  }
  
  private static parseIMAGE_SIZE(value: string): ImageSizeDirective {
    return {
      type: 'IMAGE_SIZE',
      value,
      ratio: value || '16:9'
    };
  }
  
  private static parseCAP(value: string): CapDirective {
    return {
      type: 'CAP',
      value,
      text: value || ''
    };
  }
  
  private static parseCOLS(value: string): ColsDirective {
    const count = parseInt(value) || 1;
    return {
      type: 'COLS',
      value,
      count
    };
  }
  
  private static parseWIDTHS(value: string): WidthsDirective {
    const widths = value.split(',').map(w => parseInt(w.trim()) || 0);
    return {
      type: 'WIDTHS',
      value,
      widths
    };
  }
  
  private static parseGRID(value: string): Directive {
    const [columns, gap] = value.split('|');
    return {
      type: 'GRID',
      value,
      columns: parseInt(columns) || 1,
      gap: gap || '20px'
    };
  }
  
  private static parseBG(value: string): Directive {
    const [color, image] = value.split('|');
    return {
      type: 'BG',
      value,
      color: color || '#ffffff',
      image: image || ''
    };
  }
  
  private static parseBG_SECTION(value: string): Directive {
    const [color, image] = value.split('|');
    return {
      type: 'BG_SECTION',
      value,
      color: color || '#ffffff',
      image: image || ''
    };
  }
  
  private static parseBG_CONTAINER(value: string): Directive {
    const [color, image] = value.split('|');
    return {
      type: 'BG_CONTAINER',
      value,
      color: color || '#ffffff',
      image: image || ''
    };
  }
  
  private static parseALIGN(value: string): Directive {
    const alignment = value as 'left' | 'center' | 'right' | 'justify';
    return {
      type: 'ALIGN',
      value,
      alignment: alignment || 'left'
    };
  }
  
  private static parseVALIGN(value: string): Directive {
    const alignment = value as 'top' | 'middle' | 'bottom';
    return {
      type: 'VALIGN',
      value,
      alignment: alignment || 'top'
    };
  }
  
  private static parseHEADING(value: string): Directive {
    const [level, text] = value.split('|');
    return {
      type: 'HEADING',
      value,
      level: parseInt(level) || 1,
      text: text || ''
    };
  }
  
  private static parseMIN_HEIGHT(value: string): Directive {
    return {
      type: 'MIN_HEIGHT',
      value,
      height: value || '200px'
    };
  }
  
  private static parseSECTION_WIDTH(value: string): Directive {
    return {
      type: 'SECTION_WIDTH',
      value,
      width: value || '100%'
    };
  }
  
  private static parseCONTAINER_WIDTH(value: string): Directive {
    return {
      type: 'CONTAINER_WIDTH',
      value,
      width: value || '1200px'
    };
  }
  
  private static parseHERO_WIDTH(value: string): Directive {
    return {
      type: 'HERO_WIDTH',
      value,
      width: value || '100%'
    };
  }
  
  private static parseSCOPE(value: string): Directive {
    const scope = value as 'container' | 'section';
    return {
      type: 'SCOPE',
      value,
      scope: scope || 'container'
    };
  }
  
  private static parseLINK_COLOR(value: string): Directive {
    return {
      type: 'LINK_COLOR',
      value,
      color: value || '#007bff'
    };
  }
  
  private static parseLINK_WEIGHT(value: string): Directive {
    const weight = value as 'normal' | 'bold';
    return {
      type: 'LINK_WEIGHT',
      value,
      weight: weight || 'normal'
    };
  }
  
  private static parseLINK_UNDERLINE(value: string): Directive {
    return {
      type: 'LINK_UNDERLINE',
      value,
      underline: value.toLowerCase() === 'true'
    };
  }
  
  private static parseOVERLAY(value: string): Directive {
    const [target, opacity, color] = value.split('|');
    return {
      type: 'OVERLAY',
      value,
      target: (target as 'section' | 'container') || 'section',
      opacity: parseFloat(opacity) || 0.5,
      color: color || '#000000'
    };
  }
  
  private static parseMARGIN(value: string): Directive {
    const [target, margin] = value.split('|');
    return {
      type: 'MARGIN',
      value,
      target: (target as 'section' | 'container') || 'section',
      padding: margin || '0'
    };
  }
  
  private static parsePADDING(value: string): Directive {
    const [target, padding] = value.split('|');
    return {
      type: 'PADDING',
      value,
      target: (target as 'section' | 'container') || 'section',
      padding: padding || '0'
    };
  }
  
  private static parseSEC_MT(value: string): Directive {
    return {
      type: 'SEC_MT',
      value,
      marginTop: value || '0'
    };
  }
  
  private static parseSEC_MB(value: string): Directive {
    return {
      type: 'SEC_MB',
      value,
      marginBottom: value || '0'
    };
  }
  
  private static parseTITLE(value: string): Directive {
    return {
      type: 'TITLE',
      value,
      text: value || ''
    };
  }
  
  private static parseLEAD(value: string): Directive {
    return {
      type: 'LEAD',
      value,
      text: value || ''
    };
  }
  
  private static parseSEO(value: string): Directive {
    const [title, description, keywords] = value.split('|');
    return {
      type: 'SEO',
      value,
      title: title || '',
      description: description || '',
      keywords: keywords ? keywords.split(',').map(k => k.trim()) : []
    };
  }
  
  private static parseRADIUS(value: string): Directive {
    const [target, radius] = value.split('|');
    return {
      type: 'RADIUS',
      value,
      target: (target as 'section' | 'container' | 'img' | 'card' | 'btn') || 'section',
      radius: radius || '0'
    };
  }
  
  private static parseCARD(value: string): CardDirective {
    const [property, cardValue] = value.split('|');
    return {
      type: 'CARD',
      value,
      property: (property as 'colors' | 'bg' | 'border' | 'title_color') || 'bg',
      value: cardValue || ''
    };
  }
  
  private static parseBORDER(value: string): Directive {
    const [target, border] = value.split('|');
    return {
      type: 'BORDER',
      value,
      target: (target as 'section' | 'container' | 'card' | 'btn') || 'section',
      border: border || 'none'
    };
  }
  
  private static parseFAQ_MODE(value: string): Directive {
    const mode = value as 'accordion' | 'list';
    return {
      type: 'FAQ_MODE',
      value,
      mode: mode || 'accordion'
    };
  }
  
  private static parseFAQ_ICON(value: string): Directive {
    return {
      type: 'FAQ_ICON',
      value,
      icon: value || 'plus'
    };
  }
  
  private static parseBORDER_FAQ_ITEM(value: string): Directive {
    return {
      type: 'BORDER_FAQ_ITEM',
      value,
      border: value || '1px solid #e0e0e0'
    };
  }
  
  private static parseCONTAINER_ALIGN(value: string): Directive {
    const alignment = value as 'left' | 'center' | 'right';
    return {
      type: 'CONTAINER_ALIGN',
      value,
      alignment: alignment || 'center'
    };
  }
}
