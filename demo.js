// Демонстрация работы парсера Bot HTML

const { SimpleDirectiveParser } = require('./packages/parser/dist/parsers/simpleParser');

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
  if (directive.params) {
    Object.entries(directive.params).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });
  }
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
      currentLayout = directive.params?.layout || 'media';
      break;
    case 'TITLE':
      currentTitle = directive.params?.text || '';
      break;
    case 'LEAD':
      currentLead = directive.params?.text || '';
      break;
    case 'BG':
      currentBg = directive.params?.color || '#ffffff';
      break;
    case 'COLS':
      currentCols = parseInt(directive.params?.count || '1');
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
    const src = img.params?.src || '';
    const alt = img.params?.alt || '';
    const width = img.params?.width || '';
    const height = img.params?.height || '';
    
    html += `<img src="${src}" alt="${alt}" width="${width}" height="${height}" class="bot-image">`;
  });
  html += '</div>';
}

// Добавляем кнопки
const buttons = directives.filter(d => d.type === 'CTA' || d.type === 'BTN');
if (buttons.length > 0) {
  html += '<div class="bot-buttons">';
  buttons.forEach(btn => {
    const text = btn.params?.text || '';
    const href = btn.params?.href || '#';
    const style = btn.params?.style || 'primary';
    
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
