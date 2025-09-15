import { 
  normPx_, 
  normLen_, 
  normBox_, 
  normRadiusBox_, 
  isColor_, 
  esc_, 
  stripTags_ 
} from '../utils/normalizers';

describe('Normalizers', () => {
  describe('normPx_', () => {
    it('should add px to numbers', () => {
      expect(normPx_('10')).toBe('10px');
      expect(normPx_(10)).toBe('10px');
      expect(normPx_('10.5')).toBe('10.5px');
    });

    it('should preserve existing units', () => {
      expect(normPx_('10px')).toBe('10px');
      expect(normPx_('10em')).toBe('10em');
      expect(normPx_('10%')).toBe('10%');
    });

    it('should handle complex values', () => {
      expect(normPx_('10px 20px')).toBe('10px 20px');
    });
  });

  describe('normLen_', () => {
    it('should add px to numbers', () => {
      expect(normLen_('10')).toBe('10px');
      expect(normLen_(10)).toBe('10px');
    });

    it('should preserve existing units', () => {
      expect(normLen_('10px')).toBe('10px');
      expect(normLen_('10em')).toBe('10em');
      expect(normLen_('10rem')).toBe('10rem');
      expect(normLen_('10vh')).toBe('10vh');
      expect(normLen_('10vw')).toBe('10vw');
    });
  });

  describe('normBox_', () => {
    it('should normalize box values', () => {
      expect(normBox_('10')).toBe('10px');
      expect(normBox_('10 20')).toBe('10px 20px');
      expect(normBox_('10 20 30')).toBe('10px 20px 30px');
      expect(normBox_('10 20 30 40')).toBe('10px 20px 30px 40px');
    });

    it('should preserve existing units', () => {
      expect(normBox_('10px')).toBe('10px');
      expect(normBox_('10px 20em')).toBe('10px 20em');
    });

    it('should handle empty values', () => {
      expect(normBox_('')).toBe('0');
    });
  });

  describe('normRadiusBox_', () => {
    it('should normalize radius values', () => {
      expect(normRadiusBox_('10')).toBe('10px');
      expect(normRadiusBox_('10 20')).toBe('10px 20px');
    });

    it('should preserve existing units', () => {
      expect(normRadiusBox_('10px')).toBe('10px');
      expect(normRadiusBox_('10%')).toBe('10%');
    });
  });

  describe('isColor_', () => {
    it('should detect hex colors', () => {
      expect(isColor_('#fff')).toBe(true);
      expect(isColor_('#ffffff')).toBe(true);
      expect(isColor_('#ffffffff')).toBe(true);
      expect(isColor_('#000')).toBe(true);
    });

    it('should detect rgb colors', () => {
      expect(isColor_('rgb(255, 255, 255)')).toBe(true);
      expect(isColor_('rgba(255, 255, 255, 0.5)')).toBe(true);
    });

    it('should detect hsl colors', () => {
      expect(isColor_('hsl(0, 0%, 100%)')).toBe(true);
      expect(isColor_('hsla(0, 0%, 100%, 0.5)')).toBe(true);
    });

    it('should detect named colors', () => {
      expect(isColor_('red')).toBe(true);
      expect(isColor_('blue')).toBe(true);
      expect(isColor_('transparent')).toBe(true);
    });

    it('should reject invalid colors', () => {
      expect(isColor_('invalid')).toBe(false);
      expect(isColor_('#ggg')).toBe(false);
      expect(isColor_('rgb(300, 300, 300)')).toBe(false);
    });
  });

  describe('esc_', () => {
    it('should escape HTML characters', () => {
      expect(esc_('<script>alert("test")</script>')).toBe('&lt;script&gt;alert(&quot;test&quot;)&lt;/script&gt;');
      expect(esc_('test & more')).toBe('test &amp; more');
      expect(esc_("test 'quotes'")).toBe('test &#39;quotes&#39;');
    });
  });

  describe('stripTags_', () => {
    it('should remove HTML tags', () => {
      expect(stripTags_('<p>Hello world</p>')).toBe('Hello world');
      expect(stripTags_('<div><span>Test</span></div>')).toBe('Test');
      expect(stripTags_('No tags here')).toBe('No tags here');
    });
  });
});
