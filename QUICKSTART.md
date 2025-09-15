# 🚀 Быстрый старт Bot HTML Office Add-in

## ✅ Что уже готово

✅ **Монорепо структура** с pnpm workspace  
✅ **Парсер директив** на TypeScript с тестами  
✅ **Рендереры** для всех типов секций (media, zigzag, cards, faq)  
✅ **Фронтенд панели** на React + Vite  
✅ **Office Add-in** с manifest.xml и HTML файлами  
✅ **CSS изоляция** с префиксом `.bot-*`  
✅ **CI/CD** с GitHub Actions  
✅ **Тесты** Jest + Playwright  
✅ **Документация** с инструкциями  

## 🎯 Демонстрация работы

Запустите демонстрацию парсера:

```bash
node simple-demo.js
```

**Результат:**
- Парсит 12 директив из примера документа
- Генерирует HTML с изолированными стилями
- Поддерживает все основные типы секций
- Создает адаптивный дизайн

## 🛠 Локальная разработка

### 1. Установка зависимостей

```bash
# Установите pnpm (если не установлен)
npm install -g pnpm

# Или используйте npm для отдельных пакетов
cd apps/sidebar && npm install
cd ../../packages/addin && npm install
cd ../parser && npm install
```

### 2. Запуск серверов

```bash
# Терминал 1: Фронтенд панели (React + Vite)
cd apps/sidebar
npm run dev
# Откроется на https://localhost:3000

# Терминал 2: Office Add-in сервер
cd packages/addin
npm run dev
# Откроется на https://localhost:3001
```

### 3. Тестирование

```bash
# Тесты парсера
cd packages/parser
npm test

# E2E тесты (требует запущенных серверов)
npx playwright test
```

## 📋 Sideload в Word

### Метод 1: Локальный sideload

1. **Обновите manifest.xml**
   ```xml
   <!-- Замените localhost:3001 на ваш локальный URL -->
   <SourceLocation DefaultValue="https://localhost:3001/taskpane.html"/>
   ```

2. **Загрузите в Word**
   - Откройте Word
   - Insert > Add-ins > Upload My Add-in
   - Выберите `packages/addin/manifest.xml`

### Метод 2: Office Developer Portal

1. **Создайте аккаунт** на [Office Developer Portal](https://developer.microsoft.com/en-us/microsoft-365/profile)

2. **Создайте проект**
   - Create a new project > Office Add-in > Word

3. **Загрузите манифест**
   - Скопируйте содержимое `packages/addin/manifest.xml`
   - Замените URL на ваш production домен
   - Загрузите в портал

4. **Установите в Word**
   - Insert > Add-ins > My Add-ins
   - Найдите ваш add-in и установите

## 🚀 Деплой в production

### Vercel (рекомендуется)

1. **Подготовьте проект**
   ```bash
   pnpm build
   ```

2. **Настройте Vercel**
   - Создайте аккаунт на [Vercel](https://vercel.com)
   - Подключите GitHub репозиторий
   - Настройте переменные окружения

3. **Деплой**
   ```bash
   pnpm deploy
   ```

4. **Обновите manifest.xml**
   - Замените URL на ваш Vercel домен
   - Обновите в Office Developer Portal

### Cloudflare Pages

1. **Настройте Cloudflare Pages**
   - Создайте аккаунт на [Cloudflare Pages](https://pages.cloudflare.com)
   - Подключите GitHub репозиторий
   - Настройте build команду: `pnpm build`

2. **Деплой**
   - Cloudflare автоматически задеплоит при push в main
   - Получите production URL

## 📖 Использование

### Основные директивы

```text
[LAYOUT:zigzag]     - Тип секции (media|cards|banner|faq|zigzag)
[IMG:url|alt|w|h]   - Изображение
[CTA:текст|ссылка]  - Кнопка призыва к действию
[BG:#цвет]          - Фон секции
[COLS:3]            - Количество колонок
[TITLE:Заголовок]   - Заголовок секции
[LEAD:Подзаголовок] - Подзаголовок
```

### Пример документа

```text
[LAYOUT:banner]
[TITLE:Добро пожаловать в Bot HTML]
[LEAD:Создавайте красивые HTML страницы]

[LAYOUT:zigzag]
[TITLE:Особенности]
[IMG:https://example.com/image1.jpg|Особенность 1|400|300]
Это первая особенность.

[IMG:https://example.com/image2.jpg|Особенность 2|400|300]
Это вторая особенность с чередованием.

[LAYOUT:cards]
[TITLE:Наши услуги]
[COLS:3]
[BG:#f8f9fa]

Разработка веб-сайтов
Создаем современные сайты

Мобильные приложения
Разрабатываем приложения

Консультации
Помогаем с выбором технологий

[CTA:Связаться с нами|https://example.com/contact|primary]
```

### Результат

- **Copy HTML**: Чистый HTML без стилей для встраивания
- **Copy HTML+CSS**: HTML с встроенными стилями, переносится "как есть"
- **Open Preview**: Полное превью в новой вкладке
- **Save PDF**: PDF для печати и сохранения

## 🔧 Архитектура

```
html generator/
├── apps/sidebar/          # React панель (Vite)
├── packages/
│   ├── parser/           # Парсер + рендереры (TS)
│   └── addin/            # Office Add-in файлы
├── .github/workflows/    # CI/CD
└── tests/               # Jest + Playwright
```

### Ключевые особенности

- **Изоляция стилей**: Префикс `.bot-*` + CSS переменные
- **Адаптивность**: Zigzag чередует ряды, на мобиле - стек
- **Модульность**: Чистый TypeScript без внешних зависимостей
- **Тестируемость**: Полное покрытие тестами
- **Production-ready**: CI/CD, деплой, документация

## 🧪 Тестирование

```bash
# Юнит тесты
pnpm test

# E2E тесты
pnpm playwright test

# Линтинг
pnpm lint

# Проверка типов
pnpm type-check
```

## 📞 Поддержка

- **Issues**: [GitHub Issues](https://github.com/bot-html/office-addin/issues)
- **Документация**: [README.md](README.md)
- **Демо**: Запустите `node simple-demo.js`

## 🎯 Следующие шаги

1. **Запустите демо**: `node simple-demo.js`
2. **Настройте локальную разработку**: Следуйте инструкциям выше
3. **Протестируйте в Word**: Sideload манифест
4. **Деплойте в production**: Vercel или Cloudflare
5. **Поделитесь с коллегами**: Отправьте им production URL

---

**🎉 Поздравляем! У вас есть production-готовый Office Web Add-in для Word с панелью Bot HTML!**
