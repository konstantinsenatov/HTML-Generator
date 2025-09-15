// Парсер документа Word для Bot HTML

import { DocumentToken, ParsedDocument, Section, Directive } from '../types';
import { DirectiveParser } from './directiveParser';

/**
 * Основной парсер документа
 */
export class DocumentParser {
  /**
   * Парсит документ Word в структуру секций
   */
  static parseDocument(tokens: DocumentToken[]): ParsedDocument {
    const sections: Section[] = [];
    let currentSection: Section | null = null;
    let sectionId = 1;
    
    for (const token of tokens) {
      // Извлекаем директивы из текста
      const directives = DirectiveParser.parseDirectives(token.text);
      
      // Определяем тип секции на основе директив
      const layoutDirective = directives.find(d => d.type === 'LAYOUT');
      const sectionType = layoutDirective?.layout || this.inferSectionType(token, directives);
      
      // Если тип секции изменился или это первая секция
      if (!currentSection || currentSection.type !== sectionType) {
        // Сохраняем предыдущую секцию
        if (currentSection) {
          sections.push(currentSection);
        }
        
        // Создаем новую секцию
        currentSection = {
          id: `section-${sectionId++}`,
          type: sectionType,
          content: token.text,
          directives: directives
        };
      } else {
        // Добавляем контент к существующей секции
        currentSection.content += '\n' + token.text;
        currentSection.directives.push(...directives);
      }
    }
    
    // Добавляем последнюю секцию
    if (currentSection) {
      sections.push(currentSection);
    }
    
    // Извлекаем метаданные
    const metadata = this.extractMetadata(sections);
    
    return {
      sections,
      metadata
    };
  }
  
  /**
   * Определяет тип секции на основе токена и директив
   */
  private static inferSectionType(token: DocumentToken, directives: Directive[]): Section['type'] {
    // Проверяем наличие специфических директив
    if (directives.some(d => d.type === 'FAQ_MODE')) {
      return 'faq';
    }
    
    if (directives.some(d => d.type === 'COLS' || d.type === 'WIDTHS')) {
      return 'cards';
    }
    
    if (directives.some(d => d.type === 'IMG')) {
      return 'media';
    }
    
    // Определяем по типу токена
    switch (token.type) {
      case 'heading':
        if (token.level === 1) {
          return 'banner';
        }
        return 'media';
      case 'list':
        return 'faq';
      default:
        return 'text';
    }
  }
  
  /**
   * Извлекает метаданные из секций
   */
  private static extractMetadata(sections: Section[]): ParsedDocument['metadata'] {
    const metadata: ParsedDocument['metadata'] = {};
    
    for (const section of sections) {
      for (const directive of section.directives) {
        if (directive.type === 'SEO') {
          if (directive.title) metadata.title = directive.title;
          if (directive.description) metadata.description = directive.description;
          if (directive.keywords) metadata.keywords = directive.keywords;
        }
        
        if (directive.type === 'TITLE' && !metadata.title) {
          metadata.title = directive.text;
        }
      }
    }
    
    return metadata;
  }
  
  /**
   * Очищает текст от директив
   */
  static cleanText(text: string): string {
    return text.replace(/\[([A-Z_]+)(?::([^\]]+))?\]/g, '').trim();
  }
  
  /**
   * Группирует секции по типу
   */
  static groupSectionsByType(sections: Section[]): Record<string, Section[]> {
    const grouped: Record<string, Section[]> = {};
    
    for (const section of sections) {
      if (!grouped[section.type]) {
        grouped[section.type] = [];
      }
      grouped[section.type].push(section);
    }
    
    return grouped;
  }
  
  /**
   * Находит секции с определенным типом директивы
   */
  static findSectionsWithDirective(sections: Section[], directiveType: string): Section[] {
    return sections.filter(section => 
      section.directives.some(d => d.type === directiveType)
    );
  }
  
  /**
   * Извлекает все директивы определенного типа
   */
  static extractDirectives(sections: Section[], directiveType: string): Directive[] {
    const directives: Directive[] = [];
    
    for (const section of sections) {
      const sectionDirectives = section.directives.filter(d => d.type === directiveType);
      directives.push(...sectionDirectives);
    }
    
    return directives;
  }
}
