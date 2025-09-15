// Базовые типы для парсера Bot HTML

export interface DocumentToken {
  type: 'heading' | 'paragraph' | 'list' | 'link';
  level?: number; // для heading
  text: string;
  href?: string; // для link
  items?: string[]; // для list
}

export interface Directive {
  type: string;
  value: string;
  params?: Record<string, string>;
}

export interface Section {
  id: string;
  type: 'media' | 'banner' | 'cards' | 'faq' | 'zigzag' | 'text';
  content: string;
  directives: Directive[];
  children?: Section[];
}

export interface ParsedDocument {
  sections: Section[];
  metadata: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

// Директивы
export interface CTADirective extends Directive {
  type: 'CTA';
  text: string;
  href: string;
  style?: 'primary' | 'secondary' | 'outline';
}

export interface BTNDirective extends Directive {
  type: 'BTN';
  text: string;
  href: string;
  style?: 'primary' | 'secondary' | 'outline';
}

export interface IMGDirective extends Directive {
  type: 'IMG';
  src: string;
  alt?: string;
  width?: string;
  height?: string;
}

export interface ICONDirective extends Directive {
  type: 'ICON';
  name: string;
  size?: string;
  color?: string;
}

export interface LayoutDirective extends Directive {
  type: 'LAYOUT';
  layout: 'media' | 'cards' | 'banner' | 'faq' | 'zigzag';
}

export interface ImageSizeDirective extends Directive {
  type: 'IMAGE_SIZE';
  ratio: string; // например "16:9", "1:1", "4:3"
}

export interface CapDirective extends Directive {
  type: 'CAP';
  text: string;
}

export interface ColsDirective extends Directive {
  type: 'COLS';
  count: number;
  widths?: number[];
}

export interface WidthsDirective extends Directive {
  type: 'WIDTHS';
  widths: number[];
}

export interface GridDirective extends Directive {
  type: 'GRID';
  columns: number;
  gap?: string;
}

export interface BgDirective extends Directive {
  type: 'BG';
  color: string;
  image?: string;
}

export interface BgSectionDirective extends Directive {
  type: 'BG_SECTION';
  color: string;
  image?: string;
}

export interface BgContainerDirective extends Directive {
  type: 'BG_CONTAINER';
  color: string;
  image?: string;
}

export interface AlignDirective extends Directive {
  type: 'ALIGN';
  alignment: 'left' | 'center' | 'right' | 'justify';
}

export interface VAlignDirective extends Directive {
  type: 'VALIGN';
  alignment: 'top' | 'middle' | 'bottom';
}

export interface HeadingDirective extends Directive {
  type: 'HEADING';
  level: number;
  text: string;
}

export interface MinHeightDirective extends Directive {
  type: 'MIN_HEIGHT';
  height: string;
}

export interface SectionWidthDirective extends Directive {
  type: 'SECTION_WIDTH';
  width: string;
}

export interface ContainerWidthDirective extends Directive {
  type: 'CONTAINER_WIDTH';
  width: string;
}

export interface HeroWidthDirective extends Directive {
  type: 'HERO_WIDTH';
  width: string;
}

export interface ScopeDirective extends Directive {
  type: 'SCOPE';
  scope: 'container' | 'section';
}

export interface LinkColorDirective extends Directive {
  type: 'LINK_COLOR';
  color: string;
}

export interface LinkWeightDirective extends Directive {
  type: 'LINK_WEIGHT';
  weight: 'normal' | 'bold';
}

export interface LinkUnderlineDirective extends Directive {
  type: 'LINK_UNDERLINE';
  underline: boolean;
}

export interface OverlayDirective extends Directive {
  type: 'OVERLAY';
  target: 'section' | 'container';
  opacity: number;
  color?: string;
}

export interface MarginDirective extends Directive {
  type: 'MARGIN';
  target: 'section' | 'container';
  margin: string;
}

export interface PaddingDirective extends Directive {
  type: 'PADDING';
  target: 'section' | 'container';
  padding: string;
}

export interface SecMtDirective extends Directive {
  type: 'SEC_MT';
  marginTop: string;
}

export interface SecMbDirective extends Directive {
  type: 'SEC_MB';
  marginBottom: string;
}

export interface TitleDirective extends Directive {
  type: 'TITLE';
  text: string;
}

export interface LeadDirective extends Directive {
  type: 'LEAD';
  text: string;
}

export interface SeoDirective extends Directive {
  type: 'SEO';
  title?: string;
  description?: string;
  keywords?: string[];
}

export interface RadiusDirective extends Directive {
  type: 'RADIUS';
  target: 'section' | 'container' | 'img' | 'card' | 'btn';
  radius: string;
}

export interface CardDirective extends Directive {
  type: 'CARD';
  property: 'colors' | 'bg' | 'border' | 'title_color';
  value: string;
}

export interface BTNDirective extends Directive {
  type: 'BTN';
  property: 'bg' | 'border' | 'color';
  value: string;
}

export interface BorderDirective extends Directive {
  type: 'BORDER';
  target: 'section' | 'container' | 'card' | 'btn';
  border: string;
}

export interface FAQModeDirective extends Directive {
  type: 'FAQ_MODE';
  mode: 'accordion' | 'list';
}

export interface FAQIconDirective extends Directive {
  type: 'FAQ_ICON';
  icon: string;
}

export interface BorderFAQItemDirective extends Directive {
  type: 'BORDER_FAQ_ITEM';
  border: string;
}

export interface ContainerAlignDirective extends Directive {
  type: 'CONTAINER_ALIGN';
  alignment: 'left' | 'center' | 'right';
}

// Union тип для всех директив
export type AnyDirective = 
  | CTADirective
  | BTNDirective
  | IMGDirective
  | ICONDirective
  | LayoutDirective
  | ImageSizeDirective
  | CapDirective
  | ColsDirective
  | WidthsDirective
  | GridDirective
  | BgDirective
  | BgSectionDirective
  | BgContainerDirective
  | AlignDirective
  | VAlignDirective
  | HeadingDirective
  | MinHeightDirective
  | SectionWidthDirective
  | ContainerWidthDirective
  | HeroWidthDirective
  | ScopeDirective
  | LinkColorDirective
  | LinkWeightDirective
  | LinkUnderlineDirective
  | OverlayDirective
  | MarginDirective
  | PaddingDirective
  | SecMtDirective
  | SecMbDirective
  | TitleDirective
  | LeadDirective
  | SeoDirective
  | RadiusDirective
  | CardDirective
  | BorderDirective
  | FAQModeDirective
  | FAQIconDirective
  | BorderFAQItemDirective
  | ContainerAlignDirective;

// Конфигурация рендерера
export interface RendererConfig {
  cssPrefix: string;
  inlineStyles: boolean;
  cssVariables: boolean;
}

// Результат рендеринга
export interface RenderResult {
  html: string;
  css?: string;
  metadata?: Record<string, any>;
}
