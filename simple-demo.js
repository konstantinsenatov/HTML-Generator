// Простая демонстрация работы парсера Bot HTML

// Простой парсер директив
class SimpleDirectiveParser {
  static parseDirectives(text) {
    const directives = [];
    const regex = /\[([A-Z_]+)(?::([^\]]*))?\]/g;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      const [, type, value] = match;
      const directive = this.parseDirective(type, value || '');
      if (directive) {
        directives.push(directive);
      }
    }
    
    return directives;
  }
  
  static parseDirective(type, value) {
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
  
  static parseCTA(value) {
    const [text, href, style] = value.split('|');
    return {
      type: 'CTA',
      value,
      text: text || '',
      href: href || '#',
      style: style || 'primary'
    };
  }
  
  static parseBTN(value) {
    const [text, href, style] = value.split('|');
    return {
      type: 'BTN',
      value,
      text: text || '',
      href: href || '#',
      style: style || 'primary'
    };
  }
  
  static parseIMG(value) {
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
  
  static parseLAYOUT(value) {
    return {
      type: 'LAYOUT',
      value,
      layout: value || 'media'
    };
  }
  
  static parseBG(value) {
    const [color, image] = value.split('|');
    return {
      type: 'BG',
      value,
      color: color || '#ffffff',
      image: image || ''
    };
  }
  
  static parseCOLS(value) {
    return {
      type: 'COLS',
      value,
      count: parseInt(value) || 1
    };
  }
  
  static parseTITLE(value) {
    return {
      type: 'TITLE',
      value,
      text: value || ''
    };
  }
  
  static parseLEAD(value) {
    return {
      type: 'LEAD',
      value,
      text: value || ''
    };
  }
}

// Пример документа Word с директивами
const documentText = `
[LAYOUT:banner]
[TITLE:Добро пожаловать в Bot HTML]
[LEAD:Создавайте красивые HTML страницы из документов Word]

[LAYOUT:zigzag]
[TITLE:Особенности]
[IMG:https://example.com/image1.jpg|Особенность 1|400|300]
Это первая особенность нашего продукта.

[IMG:https://example.com/image2.jpg|Особенность 2|400|300]
Это вторая особенность с чередованием.

[LAYOUT:cards]
[TITLE:Наши услуги]
[COLS:3]
[BG:#f8f9fa]

Разработка веб-сайтов
Создаем современные и адаптивные сайты

Мобильные приложения
Разрабатываем приложения для iOS и Android

Консультации
Помогаем с выбором технологий и архитектуры

[CTA:Связаться с нами|https://example.com/contact|primary]
`;

console.log('=== Демонстрация парсера Bot HTML ===\n');

// Парсим директивы
const directives = SimpleDirectiveParser.parseDirectives(documentText);

console.log('Найденные директивы:');
directives.forEach((directive, index) => {
  console.log(`${index + 1}. [${directive.type}] ${directive.value}`);
  if (directive.text) console.log(`   text: ${directive.text}`);
  if (directive.href) console.log(`   href: ${directive.href}`);
  if (directive.style) console.log(`   style: ${directive.style}`);
  if (directive.src) console.log(`   src: ${directive.src}`);
  if (directive.alt) console.log(`   alt: ${directive.alt}`);
  if (directive.layout) console.log(`   layout: ${directive.layout}`);
  if (directive.color) console.log(`   color: ${directive.color}`);
  if (directive.count) console.log(`   count: ${directive.count}`);
  console.log('');
});

// Группируем по типам
const directivesByType = directives.reduce((acc, directive) => {
  if (!acc[directive.type]) {
    acc[directive.type] = [];
  }
  acc[directive.type].push(directive);
  return acc;
}, {});

console.log('Директивы по типам:');
Object.entries(directivesByType).forEach(([type, dirs]) => {
  console.log(`${type}: ${dirs.length} шт.`);
});

console.log('\n=== Генерация HTML ===\n');

// Простая генерация HTML
let html = '<div class="bot-container">';

// Обрабатываем директивы по порядку
let currentLayout = 'media';
let currentTitle = '';
let currentLead = '';
let currentBg = '';
let currentCols = 1;

directives.forEach(directive => {
  switch (directive.type) {
    case 'LAYOUT':
      currentLayout = directive.layout || 'media';
      break;
    case 'TITLE':
      currentTitle = directive.text || '';
      break;
    case 'LEAD':
      currentLead = directive.text || '';
      break;
    case 'BG':
      currentBg = directive.color || '#ffffff';
      break;
    case 'COLS':
      currentCols = directive.count || 1;
      break;
  }
});

// Генерируем HTML на основе директив
if (currentTitle) {
  html += `<h1 class="bot-title">${currentTitle}</h1>`;
}

if (currentLead) {
  html += `<p class="bot-lead">${currentLead}</p>`;
}

// Добавляем изображения
const images = directives.filter(d => d.type === 'IMG');
if (images.length > 0) {
  html += '<div class="bot-images">';
  images.forEach(img => {
    const src = img.src || '';
    const alt = img.alt || '';
    const width = img.width || '';
    const height = img.height || '';
    
    html += `<img src="${src}" alt="${alt}" width="${width}" height="${height}" class="bot-image">`;
  });
  html += '</div>';
}

// Добавляем кнопки
const buttons = directives.filter(d => d.type === 'CTA' || d.type === 'BTN');
if (buttons.length > 0) {
  html += '<div class="bot-buttons">';
  buttons.forEach(btn => {
    const text = btn.text || '';
    const href = btn.href || '#';
    const style = btn.style || 'primary';
    
    html += `<a href="${href}" class="bot-btn bot-btn-${style}">${text}</a>`;
  });
  html += '</div>';
}

html += '</div>';

console.log('Сгенерированный HTML:');
console.log(html);

console.log('\n=== CSS стили ===\n');

const css = `
.bot-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: ${currentBg};
}

.bot-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #333;
}

.bot-lead {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

.bot-images {
  display: flex;
  gap: 20px;
  margin-bottom: 2rem;
}

.bot-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

.bot-buttons {
  display: flex;
  gap: 10px;
  margin-top: 2rem;
}

.bot-btn {
  display: inline-block;
  padding: 12px 24px;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
}

.bot-btn-primary {
  background-color: #007bff;
  color: white;
}

.bot-btn-primary:hover {
  background-color: #0056b3;
}

@media (max-width: 768px) {
  .bot-images {
    flex-direction: column;
  }
  
  .bot-buttons {
    flex-direction: column;
  }
}
`;

console.log('CSS стили:');
console.log(css);

console.log('\n=== Полный HTML документ ===\n');

const fullHTML = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bot HTML Demo</title>
    <style>
        ${css}
    </style>
</head>
<body>
    ${html}
</body>
</html>`;

console.log(fullHTML);

console.log('\n=== Демонстрация завершена ===');
console.log('Парсер успешно обработал документ и сгенерировал HTML с CSS!');
console.log('\n=== Статистика ===');
console.log(`Всего директив: ${directives.length}`);
console.log(`Типы секций: ${Object.keys(directivesByType).join(', ')}`);
console.log(`Текущий layout: ${currentLayout}`);
console.log(`Фон: ${currentBg}`);
console.log(`Колонок: ${currentCols}`);
