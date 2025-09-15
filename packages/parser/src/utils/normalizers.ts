// Утилиты для нормализации значений в парсере

/**
 * Нормализует пиксельные значения
 */
export function normPx_(value: string | number): string {
  if (typeof value === 'number') {
    return `${value}px`;
  }
  
  const str = String(value).trim();
  
  // Если уже содержит единицы измерения
  if (/^\d+(\.\d+)?(px|em|rem|%|vh|vw)$/.test(str)) {
    return str;
  }
  
  // Если только число
  if (/^\d+(\.\d+)?$/.test(str)) {
    return `${str}px`;
  }
  
  return str;
}

/**
 * Нормализует длину (может быть в разных единицах)
 */
export function normLen_(value: string | number): string {
  if (typeof value === 'number') {
    return `${value}px`;
  }
  
  const str = String(value).trim();
  
  // Если уже содержит единицы измерения
  if (/^\d+(\.\d+)?(px|em|rem|%|vh|vw|ch|ex)$/.test(str)) {
    return str;
  }
  
  // Если только число
  if (/^\d+(\.\d+)?$/.test(str)) {
    return `${str}px`;
  }
  
  return str;
}

/**
 * Нормализует box значения (margin, padding)
 */
export function normBox_(value: string): string {
  const str = String(value).trim();
  
  // Если пустая строка
  if (!str) {
    return '0';
  }
  
  // Если уже валидное CSS значение
  if (/^(\d+(\.\d+)?(px|em|rem|%|vh|vw|ch|ex)\s*)+$/.test(str)) {
    return str;
  }
  
  // Разбиваем по пробелам и нормализуем каждое значение
  const parts = str.split(/\s+/).map(part => {
    const trimmed = part.trim();
    if (/^\d+(\.\d+)?$/.test(trimmed)) {
      return `${trimmed}px`;
    }
    return trimmed;
  });
  
  return parts.join(' ');
}

/**
 * Нормализует CSS box значения с поддержкой шортхандов
 */
export function normCssBox_(value: string): string {
  const str = String(value).trim();
  
  if (!str) {
    return '0';
  }
  
  // Проверяем на шортханды (1-4 значения)
  const parts = str.split(/\s+/).map(part => {
    const trimmed = part.trim();
    if (/^\d+(\.\d+)?$/.test(trimmed)) {
      return `${trimmed}px`;
    }
    return trimmed;
  });
  
  return parts.join(' ');
}

/**
 * Масштабирует CSS box значения
 */
export function scaleCssBox_(value: string, scale: number): string {
  const str = String(value).trim();
  
  if (!str) {
    return '0';
  }
  
  const parts = str.split(/\s+/).map(part => {
    const trimmed = part.trim();
    const match = trimmed.match(/^(\d+(?:\.\d+)?)(px|em|rem|%|vh|vw|ch|ex)$/);
    
    if (match) {
      const [, num, unit] = match;
      const scaledNum = parseFloat(num) * scale;
      return `${scaledNum}${unit}`;
    }
    
    return trimmed;
  });
  
  return parts.join(' ');
}

/**
 * Нормализует border-radius значения
 */
export function normRadiusBox_(value: string): string {
  const str = String(value).trim();
  
  if (!str) {
    return '0';
  }
  
  // Если уже валидное CSS значение
  if (/^(\d+(\.\d+)?(px|em|rem|%)\s*)+$/.test(str)) {
    return str;
  }
  
  // Разбиваем по пробелам и нормализуем каждое значение
  const parts = str.split(/\s+/).map(part => {
    const trimmed = part.trim();
    if (/^\d+(\.\d+)?$/.test(trimmed)) {
      return `${trimmed}px`;
    }
    return trimmed;
  });
  
  return parts.join(' ');
}

/**
 * Проверяет, является ли значение цветом
 */
export function isColor_(value: string): boolean {
  const str = String(value).trim();
  
  // Hex цвета
  if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(str)) {
    return true;
  }
  
  // RGB/RGBA цвета
  if (/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+)?\s*\)$/.test(str)) {
    return true;
  }
  
  // HSL/HSLA цвета
  if (/^hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(,\s*[\d.]+)?\s*\)$/.test(str)) {
    return true;
  }
  
  // CSS именованные цвета
  const namedColors = [
    'black', 'white', 'red', 'green', 'blue', 'yellow', 'orange', 'purple',
    'pink', 'brown', 'gray', 'grey', 'transparent', 'currentColor'
  ];
  
  return namedColors.includes(str.toLowerCase());
}

/**
 * Экранирует HTML теги
 */
export function esc_(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Удаляет HTML теги из строки
 */
export function stripTags_(value: string): string {
  return String(value).replace(/<[^>]*>/g, '');
}

/**
 * Нормализует соотношение сторон изображения
 */
export function normImageRatio_(value: string): string {
  const str = String(value).trim();
  
  // Поддерживаемые форматы: 16:9, 1:1, 4:3, 21:9
  if (/^\d+:\d+$/.test(str)) {
    return str;
  }
  
  // Если только число, считаем квадратным
  if (/^\d+(\.\d+)?$/.test(str)) {
    return `${str}:${str}`;
  }
  
  // Дефолтное значение
  return '16:9';
}

/**
 * Нормализует ширину контейнера
 */
export function normContainerWidth_(value: string): string {
  const str = String(value).trim();
  
  // Если уже содержит единицы измерения
  if (/^\d+(\.\d+)?(px|em|rem|%|vw)$/.test(str)) {
    return str;
  }
  
  // Если только число
  if (/^\d+(\.\d+)?$/.test(str)) {
    return `${str}px`;
  }
  
  // Дефолтное значение
  return '1200px';
}

/**
 * Нормализует высоту секции
 */
export function normMinHeight_(value: string): string {
  const str = String(value).trim();
  
  // Если уже содержит единицы измерения
  if (/^\d+(\.\d+)?(px|em|rem|%|vh)$/.test(str)) {
    return str;
  }
  
  // Если только число
  if (/^\d+(\.\d+)?$/.test(str)) {
    return `${str}px`;
  }
  
  // Дефолтное значение
  return '200px';
}
