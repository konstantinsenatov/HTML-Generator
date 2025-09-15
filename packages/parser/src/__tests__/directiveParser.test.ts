import { DirectiveParser } from '../parsers/directiveParser';

describe('DirectiveParser', () => {
  describe('parseDirectives', () => {
    it('should parse CTA directive', () => {
      const text = 'Нажмите [CTA:Купить сейчас|https://example.com|primary] для покупки';
      const directives = DirectiveParser.parseDirectives(text);
      
      expect(directives).toHaveLength(1);
      expect(directives[0]).toEqual({
        type: 'CTA',
        value: 'Купить сейчас|https://example.com|primary',
        text: 'Купить сейчас',
        href: 'https://example.com',
        style: 'primary'
      });
    });

    it('should parse IMG directive', () => {
      const text = 'Изображение [IMG:https://example.com/image.jpg|Альтернативный текст|300|200]';
      const directives = DirectiveParser.parseDirectives(text);
      
      expect(directives).toHaveLength(1);
      expect(directives[0]).toEqual({
        type: 'IMG',
        value: 'https://example.com/image.jpg|Альтернативный текст|300|200',
        src: 'https://example.com/image.jpg',
        alt: 'Альтернативный текст',
        width: '300',
        height: '200'
      });
    });

    it('should parse LAYOUT directive', () => {
      const text = 'Секция [LAYOUT:zigzag] с чередованием';
      const directives = DirectiveParser.parseDirectives(text);
      
      expect(directives).toHaveLength(1);
      expect(directives[0]).toEqual({
        type: 'LAYOUT',
        value: 'zigzag',
        layout: 'zigzag'
      });
    });

    it('should parse multiple directives', () => {
      const text = '[LAYOUT:cards] [COLS:3] [BG:#f0f0f0]';
      const directives = DirectiveParser.parseDirectives(text);
      
      expect(directives).toHaveLength(3);
      expect(directives[0].type).toBe('LAYOUT');
      expect(directives[1].type).toBe('COLS');
      expect(directives[2].type).toBe('BG');
    });

    it('should handle empty value', () => {
      const text = '[CTA:]';
      const directives = DirectiveParser.parseDirectives(text);
      
      expect(directives).toHaveLength(1);
      expect(directives[0]).toEqual({
        type: 'CTA',
        value: '',
        text: '',
        href: '#',
        style: 'primary'
      });
    });

    it('should ignore unknown directives', () => {
      const text = '[UNKNOWN:value] [CTA:Test|#]';
      const directives = DirectiveParser.parseDirectives(text);
      
      expect(directives).toHaveLength(1);
      expect(directives[0].type).toBe('CTA');
    });
  });
});
