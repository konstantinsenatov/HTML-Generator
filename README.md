# Bot HTML Office Add-in

Production-готовый Office Web Add-in для Word с панелью "Bot HTML", который читает документы Word, парсит директивы и генерирует HTML с изолированными стилями.

## 🚀 Возможности

- **Панель в Word**: Читает текст документа через Office.js (заголовки/параграфы/списки/ссылки)
- **Парсинг директив**: Поддерживает все директивы Bot HTML (CTA/BTN/IMG/ICON, LAYOUT, COLORS, и др.)
- **HTML превью**: Рендерит HTML с CSS_BOT стилями
- **Кнопки действий**: Refresh, Copy HTML, Copy HTML+CSS (inline), Open Full Preview, Save as PDF
- **Изоляция стилей**: Префикс `.bot-*` + CSS переменные для безопасного встраивания
- **Адаптивность**: Zigzag чередует ряды, на мобиле - стек

## 📁 Структура проекта

```
html generator/
├── apps/
│   └── sidebar/          # Фронтенд панели (Vite + React)
├── packages/
│   ├── parser/          # Парсер и рендереры (чистый TS)
│   └── addin/           # manifest.xml + bootstrap для Office.js
├── .github/workflows/   # CI (lint/test/build/deploy)
└── tests/              # Jest + Playwright тесты
```

## 🛠 Установка и запуск

### Предварительные требования

- Node.js 18+
- pnpm 8+
- Word (для тестирования)

### Локальная разработка

1. **Клонируйте репозиторий**
   ```bash
   git clone <repository-url>
   cd html-generator
   ```

2. **Установите зависимости**
   ```bash
   pnpm install
   ```

3. **Запустите dev сервер**
   ```bash
   pnpm dev
   ```

4. **Откройте в браузере**
   - Панель: https://localhost:3000
   - Add-in: https://localhost:3001/taskpane.html

### Тестирование

```bash
# Юнит тесты (Jest)
pnpm test

# E2E тесты (Playwright)
pnpm playwright test

# Линтинг
pnpm lint

# Проверка типов
pnpm type-check
```

## 📋 Sideload в Word

### Метод 1: Через Office Developer Portal

1. **Создайте аккаунт разработчика**
   - Перейдите на [Office Developer Portal](https://developer.microsoft.com/en-us/microsoft-365/profile)
   - Войдите с Microsoft аккаунтом

2. **Создайте новый проект**
   - Нажмите "Create a new project"
   - Выберите "Office Add-in"
   - Выберите "Word"

3. **Загрузите манифест**
   - Скопируйте `packages/addin/manifest.xml`
   - Замените URL на ваш production домен
   - Загрузите в портал

4. **Установите в Word**
   - Откройте Word
   - Перейдите в Insert > Add-ins > My Add-ins
   - Найдите ваш add-in и установите

### Метод 2: Локальный sideload

1. **Настройте HTTPS сервер**
   ```bash
   cd packages/addin
   pnpm dev
   ```

2. **Обновите manifest.xml**
   - Замените `https://localhost:3001` на ваш локальный URL
   - Убедитесь, что сертификат валидный

3. **Загрузите в Word**
   - Откройте Word
   - Перейдите в Insert > Add-ins > Upload My Add-in
   - Выберите `manifest.xml`

### Метод 3: Через SharePoint

1. **Загрузите в SharePoint**
   - Поместите файлы add-in в SharePoint библиотеку
   - Обновите URL в manifest.xml

2. **Установите из SharePoint**
   - В Word: Insert > Add-ins > SharePoint My Organization
   - Выберите ваш add-in

## 🚀 Деплой в production

### Vercel (рекомендуется)

1. **Подготовьте проект**
   ```bash
   pnpm build
   ```

2. **Настройте Vercel**
   - Создайте аккаунт на [Vercel](https://vercel.com)
   - Подключите GitHub репозиторий
   - Настройте переменные окружения:
     ```
     VERCEL_TOKEN=your_token
     VERCEL_ORG_ID=your_org_id
     VERCEL_PROJECT_ID=your_project_id
     ```

3. **Деплой**
   ```bash
   pnpm deploy
   ```

4. **Обновите manifest.xml**
   - Замените URL на ваш Vercel домен
   - Обновите в Office Developer Portal

### Cloudflare Pages

1. **Подготовьте проект**
   ```bash
   pnpm build
   ```

2. **Настройте Cloudflare Pages**
   - Создайте аккаунт на [Cloudflare Pages](https://pages.cloudflare.com)
   - Подключите GitHub репозиторий
   - Настройте build команду: `pnpm build`

3. **Деплой**
   - Cloudflare автоматически задеплоит при push в main
   - Получите production URL

4. **Обновите manifest.xml**
   - Замените URL на ваш Cloudflare домен

## 📖 Использование

### Основные директивы

```text
[LAYOUT:zigzag] - Тип секции (media|cards|banner|faq|zigzag)
[IMG:url|alt|width|height] - Изображение
[CTA:текст|ссылка|стиль] - Кнопка призыва к действию
[BG:#цвет] - Фон секции
[COLS:3] - Количество колонок
[TITLE:Заголовок] - Заголовок секции
[LEAD:Подзаголовок] - Подзаголовок
```

### Пример документа

```text
[LAYOUT:banner]
[TITLE:Добро пожаловать в Bot HTML]
[LEAD:Создавайте красивые HTML страницы из документов Word]

[LAYOUT:zigzag]
[TITLE:Особенности]
[IMG:https://example.com/image1.jpg|Особенность 1]
Это первая особенность нашего продукта.

[IMG:https://example.com/image2.jpg|Особенность 2]
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
```

### Результат

- **Copy HTML**: Чистый HTML без стилей для встраивания
- **Copy HTML+CSS**: HTML с встроенными стилями, переносится "как есть"
- **Open Preview**: Полное превью в новой вкладке
- **Save PDF**: PDF для печати и сохранения

## 🔧 Разработка

### Архитектура

- **Parser**: Чистый TypeScript, без зависимостей
- **Renderers**: Модульная система рендереров для каждого типа секции
- **CSS**: Изолированные стили с префиксом `.bot-*`
- **Office.js**: Интеграция с Word API

### Добавление новых директив

1. **Добавьте тип в `types/index.ts`**
2. **Создайте парсер в `parsers/directiveParser.ts`**
3. **Обновите рендереры в `renderers/`**
4. **Добавьте тесты**

### Добавление новых рендереров

1. **Создайте класс в `renderers/`**
2. **Наследуйтесь от `BaseRenderer`**
3. **Реализуйте методы `render()` и `generateCSS()`**
4. **Зарегистрируйте в `renderer.ts`**

## 🧪 Тестирование

### Юнит тесты (Jest)

```bash
# Запуск всех тестов
pnpm test

# Тесты с покрытием
pnpm test --coverage

# Тесты конкретного файла
pnpm test directiveParser.test.ts
```

### E2E тесты (Playwright)

```bash
# Запуск всех тестов
pnpm playwright test

# Тесты в UI режиме
pnpm playwright test --ui

# Тесты конкретного браузера
pnpm playwright test --project=chromium
```

## 📝 Лицензия

MIT License - см. файл [LICENSE](LICENSE)

## 🤝 Вклад в проект

1. Fork репозиторий
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📞 Поддержка

- **Issues**: [GitHub Issues](https://github.com/bot-html/office-addin/issues)
- **Discussions**: [GitHub Discussions](https://github.com/bot-html/office-addin/discussions)
- **Email**: support@bot-html.com

## 🎯 Roadmap

- [ ] Поддержка Excel и PowerPoint
- [ ] Темная тема
- [ ] Экспорт в другие форматы (Markdown, LaTeX)
- [ ] Интеграция с CMS
- [ ] Плагины для расширения функциональности
