/** ============================== МЕНЮ ============================== */
function onOpen() {
  DocumentApp.getUi()
    .createMenu('Bot HTML')
    .addItem('Live Preview', 'openSidebar')
    .addToUi();
}

function openSidebar() {
  const t = HtmlService.createTemplateFromFile('Sidebar');
  t.html = buildHtml_();
  DocumentApp.getUi().showSidebar(t.evaluate().setTitle('Bot HTML'));
}

/** ============================ ПАТТЕРНЫ ============================ */
const RX = {
  CTA: /^\s*CTA\s*[:.\-–—)\]]\s*/i,
  BTN: /^\s*BTN\s*[:.\-–—)\]]\s*/i,
  IMG: /^\s*IMG\s*[:.\-–—)\]]\s*/i,
  ICON:/^\s*ICON\s*[:.\-–—)\]]\s*/i, // NEW: карточка через иконку/эмодзи/символ

  // Тип + варианты: LAYOUT: Media left|right  /  LAYOUT: Cards 3col|4col
  LAYOUT_ANY: /^\s*LAYOUT\s*[:.\-–—)\]]\s*(.+)$/i,

  // Соотношение сторон картинок (media): IMAGE SIZE (RATIO): 3/2
  IMG_SIZE: /^\s*IMAGE\s*SIZE\s*\(\s*RATIO\s*\)\s*[:.\-–—)\]]\s*/i,

  // Подпись к картинке (media)
  CAP: /^\s*CAP\s*[:.\-–—)\]]\s*/i,

  // Ширины колонок (media)  ИЛИ количество колонок (cards):
  // media: COLS: 40/60;  cards: COLS: 3
  COLS:/^\s*(?:COLS|WIDTHS|GRID)\s*[:.\-–—)\]]\s*/i,

  BG:     /^\s*(?:BG|BACKGROUND)\s*(?:IMG|IMAGE)?\s*[:.\-–—)\]]\s*/i,     // BG: https://...jpg
  ALIGN:  /^\s*(?:ALIGN|TEXT\s*ALIGN)\s*[:.\-–—)\]]\s*/i,                 // ALIGN: left|center|right
  HEADING:/^\s*(?:HEADING|TITLE\s*LEVEL|H-?LEVEL)\s*[:.\-–—)\]]\s*/i,     // HEADING: H1|H2
  MINH:   /^\s*(?:MIN\s*-?\s*HEIGHT|HEIGHT)\s*[:.\-–—)\]]\s*/i,  
  TITLE_COLOR: /^\s*(?:TITLE|HEADING)\s*COLOR\s*[:.\-–—)\]]\s*/i,
  TEXT_COLOR:  /^\s*(?:TEXT|BODY)\s*COLOR\s*[:.\-–—)\]]\s*/i,
  COLOR:       /^\s*COLOR\s*[:.\-–—)\]]\s*/i,
  VALIGN: /^\s*(?:VALIGN|VERTICAL\s*ALIGN)\s*[:.\-–—)\]]\s*/i,
  BTN_COLOR: /^\s*(?:BTN|BUTTON)\s*COLOR\s*[:.\-–—)\]]\s*/i,

  // FAQ
  Q:   /^\s*(?:Q|Вопрос)\s*[:.\-–—)\]]\s*/i,
  A:   /^\s*(?:A|Ответ)\s*[:.\-–—)\]]\s*/i,
  FAQ_MODE: /^\s*(?:FAQ\s*MODE|ACCORDION|TOGGLE)\s*[:.\-–—)\]]\s*/i,   // FAQ MODE: accordion|static  /  ACCORDION: on|off
  FAQ_ICON: /^\s*(?:FAQ\s*ICON|Q\s*ICON)\s*[:.\-–—)\]]\s*/i,           // FAQ ICON: ❓
  LINK_COLOR:      /^\s*(?:LINK\s*COLOR)\s*[:.\-–—)\]]\s*/i,
  LINK_WEIGHT:     /^\s*(?:LINK\s*WEIGHT|LINK\s*FONT\s*WEIGHT)\s*[:.\-–—)\]]\s*/i,
  LINK_UNDERLINE:  /^\s*(?:LINK\s*UNDERLINE)\s*[:.\-–—)\]]\s*/i, // on|off|hover
  OVERLAY: /^\s*(?:BG\s*OVERLAY|OVERLAY)\s*[:.\-–—)\]]\s*/i,
  // Отступы секции
  MARGIN_ANY:  /^\s*MARGIN\s*[:.\-–—)\]]\s*/i,              // MARGIN: 10 20 | 0 auto ...
  PADDING_ANY: /^\s*(?:PADDING|PAD)\s*[:.\-–—)\]]\s*/i,     // PADDING: 24 16 ...
  SEC_MT: /^\s*(?:MARGIN\s*TOP|MT)\s*[:.\-–—)\]]\s*/i,
  SEC_MB: /^\s*(?:MARGIN\s*BOTTOM|MB)\s*[:.\-–—)\]]\s*/i,

  // Ширины (пересекаются с глобальными)
  CONTAINER_W: /^\s*CONTAINER\s*WIDTH\s*[:.\-–—)\]]\s*/i,
  SECTION_W:   /^\s*SECTION\s*WIDTH\s*[:.\-–—)\]]\s*/i,
  HERO_W:      /^\s*(?:HERO|BANNER|BOT\s*HERO)\s*WIDTH\s*[:.\-–—)\]]\s*/i,

  // Глобальные настройки на всё полотно (.bot-scope)
  SCOPE_ANY:   /^\s*(?:GLOBAL|SCOPE)\s*[:.\-–—)\]]\s*(.+)$/i,
  
  // BG для секции/контейнера
  BG_SECTION:    /^\s*BG\s*SECTION\s*[:.\-–—)\]]\s*/i,
  BG_CONTAINER:  /^\s*BG\s*CONTAINER\s*[:.\-–—)\]]\s*/i,

  // Шортханды отступов/внутренних отступов (1–4 значения, в px)
  MARGIN_SECTION:   /^\s*MARGIN\s*SECTION\s*[:.\-–—)\]]\s*/i,
  MARGIN_CONTAINER: /^\s*MARGIN\s*CONTAINER\s*[:.\-–—)\]]\s*/i,
  PADDING_SECTION:  /^\s*(?:PADDING|PAD)\s*SECTION\s*[:.\-–—)\]]\s*/i,
  PADDING_CONTAINER:/^\s*(?:PADDING|PAD)\s*CONTAINER\s*[:.\-–—)\]]\s*/i,
  TITLE: /^\s*TITLE\s*[:.\-–—)\]]\s*/i,   // TITLE: Текст секционного H2 (пусто или "-" — скрыть)
  OVERLAY_CONTAINER: /^\s*(?:BG\s*OVERLAY|OVERLAY)\s*CONTAINER\s*[:.\-–—)\]]\s*/i,
  LEAD: /^\s*(?:LEAD|LEDE|INTRO)\s*[:.\-–—)\]]\s*/i,
  // ==== Radius ====
  RADIUS_ANY:        /^\s*(?:RADIUS|BORDER\s*RADIUS)\s*[:.\-–—)\]]\s*/i,                 // RADIUS: 12 | 12 8 | pill | 50%
  RADIUS_SECTION:    /^\s*(?:RADIUS|BORDER\s*RADIUS)\s*SECTION\s*[:.\-–—)\]]\s*/i,      // RADIUS SECTION: ...
  RADIUS_CONTAINER:  /^\s*(?:RADIUS|BORDER\s*RADIUS)\s*CONTAINER\s*[:.\-–—)\]]\s*/i,    // RADIUS CONTAINER: ...
  RADIUS_IMG:        /^\s*(?:IMG\s*(?:RADIUS|ROUND|BORDER\s*RADIUS))\s*[:.\-–—)\]]\s*/i,// IMG RADIUS: ...
  RADIUS_CARD:       /^\s*(?:CARD|CARDS?)\s*(?:RADIUS|ROUND)\s*[:.\-–—)\]]\s*/i,        // CARD RADIUS: ...
  RADIUS_BTN:        /^\s*(?:BTN|BUTTON)\s*(?:RADIUS|ROUND)\s*[:.\-–—)\]]\s*/i,          // BTN RADIUS: ...

  // ==== Cards colors / backgrounds ====
  CARD_COLOR:       /^\s*(?:CARD|CARDS?)\s*COLOR\s*[:.\-–—)\]]\s*/i,
  CARD_TITLE_COLOR: /^\s*(?:CARD|CARDS?)\s*(?:TITLE\s*COLOR|HEADING\s*COLOR)\s*[:.\-–—)\]]\s*/i,
  CARD_BG:          /^\s*(?:CARD|CARDS?)\s*(?:BG|BACKGROUND)\s*[:.\-–—)\]]\s*/i,

  // ==== Button background ====
  BTN_BG:           /^\s*(?:BTN|BUTTON)\s*(?:BG|BACKGROUND|FILL)\s*[:.\-–—)\]]\s*/i,

  // ==== Borders (CSS shorthand) ====
  BORDER_SECTION:   /^\s*(?:BORDER|OUTLINE)\s*SECTION\s*[:.\-–—)\]]\s*/i,
  BORDER_CONTAINER: /^\s*(?:BORDER|OUTLINE)\s*CONTAINER\s*[:.\-–—)\]]\s*/i,
  BORDER_CARD:      /^\s*(?:CARD|CARDS?)\s*(?:BORDER|OUTLINE)\s*[:.\-–—)\]]\s*/i,
  BORDER_BTN:       /^\s*(?:BTN|BUTTON)\s*(?:BORDER|OUTLINE)\s*[:.\-–—)\]]\s*/i,
  BORDER_FAQ_ITEM:  /^\s*(?:FAQ\s*ITEM\s*BORDER|FAQ\s*BORDER)\s*[:.\-–—)\]]\s*/i,
  
  // ===== Section descriptions (top/bottom inside .bot-container)
  DESC_TOP:    /^\s*(?:DESC|DESCRIPTION|NOTE|SUMMARY)\s*(?:TOP|UP|ABOVE)?\s*[:.\-–—)\]]\s*/i,
  DESC_BOTTOM: /^\s*(?:DESC|DESCRIPTION|NOTE|SUMMARY)\s*(?:BOTTOM|DOWN|BELOW)\s*[:.\-–—)\]]\s*/i,
  SEO_TITLE: /^\s*(?:META|SEO)\s*TITLE\s*[:.\-–—)\]]\s*/i,
  SEO_DESC:  /^\s*(?:META|SEO)\s*(?:DESC|DESCRIPTION)\s*[:.\-–—)\]]\s*/i,
  SEO_KEYS:  /^\s*(?:META\s*)?KEYWORDS?\s*[:.\-–—)\]]\s*/i,
  CONTAINER_ALIGN: /^\s*(?:CONTAINER\s*ALIGN|ALIGN\s*CONTAINER)\s*[:.\-–—)\]]\s*/i,

};
function stripTags_(s){ return String(s||'').replace(/<[^>]*>/g,''); }

function esc_(s){ return String(s||'')
  .replace(/&/g,'&amp;').replace(/</g,'&lt;')
  .replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }


function normPx_(v){
  const s = String(v||'').trim();
  if (/^-?\d+px$/i.test(s)) return s.toLowerCase();
  if (/^-?\d+(\.\d+)?$/.test(s)) return parseFloat(s)+'px';
  return null;
}
function normLen_(v){ // px или %
  const s = String(v||'').trim();
  if (/^-?\d+(\.\d+)?%$/.test(s)) return s;
  return normPx_((s));
}
function normBox_(v){ // 1..4 значений → "t r b l" (px)
  const parts = String(v||'').trim().split(/[ ,]+/).filter(Boolean);
  if (!parts.length) return null;
  const toPx = (x) => normPx_(x);
  let a = parts.map(toPx).filter(Boolean);
  if (!a.length) return null;
  if (a.length===1) a=[a[0],a[0],a[0],a[0]];
  if (a.length===2) a=[a[0],a[1],a[0],a[1]];
  if (a.length===3) a=[a[0],a[1],a[2],a[1]];
  return a.slice(0,4).join(' ');
}
function normCssBox_(raw, allowAuto=false){
  const parts = String(raw||'').trim().split(/[ ,]+/).filter(Boolean)
    .map(s => allowAuto && /auto/i.test(s) ? 'auto' : (normPx_(s) || ''));
  if (!parts.length) return null;
  let a = parts.filter(Boolean);
  if (a.length===1) a=[a[0],a[0],a[0],a[0]];
  if (a.length===2) a=[a[0],a[1],a[0],a[1]];
  if (a.length===3) a=[a[0],a[1],a[2],a[1]];
  return a.slice(0,4).join(' ');
}
function isColor_(v){
  const s = String(v||'').trim();
  return /^#([0-9a-f]{3,8})$/i.test(s) || /^rgba?\(/i.test(s) || /^hsla?\(/i.test(s) || /^var\(/i.test(s);
}

// Масштабирование CSS-боксов вида "t r b l" (px/auto)
function scaleCssBox_(raw, k){
  const parts = String(raw||'').trim().split(/[ ,]+/).filter(Boolean);
  if (!parts.length) return null;
  return parts.map(s=>{
    if (/^auto$/i.test(s)) return 'auto';
    const m = s.match(/^(-?\d+(?:\.\d+)?)(px)$/i);
    if (m){
      const v = parseFloat(m[1]) * k;
      return (Math.round(v*100)/100) + m[2].toLowerCase(); // до 2 знаков
    }
    return s; // на всякий случай оставим как есть
  }).join(' ');
}
function normRadiusToken_(s){
  const v = String(s||'').trim();
  if (!v) return null;
  if (/^(none|off|0)$/i.test(v)) return '0';
  if (/^(pill|round|circle|full)$/i.test(v)) return '9999px';
  if (/^\d+(\.\d+)?(px|%)?$/.test(v)) return /[a-z%]$/i.test(v) ? v : (parseFloat(v)+'px');
  return null;
}
// 1..4 значения (px/%/ключевые слова выше)
function normRadiusBox_(raw){
  const parts = String(raw||'').trim().split(/[ ,]+/).filter(Boolean)
    .map(normRadiusToken_).filter(Boolean);
  if (!parts.length) return null;
  if (parts.length===1) return parts[0];
  if (parts.length===2) return parts[0]+' '+parts[1];
  if (parts.length===3) return parts[0]+' '+parts[1]+' '+parts[2];
  return parts.slice(0,4).join(' ');
}






function wrapLinkHtml_(text, url){
  const safe = esc_(text || '');
  return url
    ? '<a href="'+esc_(url)+'" target="_blank" rel="noopener">'+safe+'</a>'
    : safe;
}

// Возвращает массив строк с HTML c учётом ссылок: [{raw, html}, ...]
function getParaLinesWithHtml_(para){
  const htmlLines = [];
  let cur = '';

  const n = para.getNumChildren ? para.getNumChildren() : 0;
  for (let i=0;i<n;i++){
    const ch = para.getChild(i);
    if (ch.getType && ch.getType() === DocumentApp.ElementType.TEXT){
      const t = ch.asText();
      const s = t.getText() || '';
      const idx = t.getTextAttributeIndices();
      const cuts = idx.slice();
      if (!cuts.includes(0)) cuts.unshift(0);
      if (!cuts.includes(s.length)) cuts.push(s.length);

      for (let k=0;k<cuts.length-1;k++){
        const a = cuts[k], b = cuts[k+1];
        const seg = s.substring(a,b);

        // Пытаемся получить URL ссылки на этом диапазоне
        let url = null;
        if (typeof t.getLinkUrl === 'function') url = t.getLinkUrl(a);
        if (!url){
          const attrs = t.getAttributes(a) || {};
          url = attrs[DocumentApp.Attribute.LINK_URL] || null;
        }

        const parts = seg.split(/\r?\n/);
        for (let pi=0; pi<parts.length; pi++){
          cur += wrapLinkHtml_(parts[pi], url);
          if (pi < parts.length-1){ htmlLines.push(cur); cur=''; }
        }
      }
    }
  }
  if (cur !== '') htmlLines.push(cur);

  const rawLines = (para.getText() || '').split(/\r?\n/);
  if (htmlLines.length !== rawLines.length){
    // Фолбэк на безопасный текст, если вдруг разошлось количество строк
    return rawLines.map(r=>({ raw:r, html:esc_(r) }));
  }
  return rawLines.map((r,i)=>({ raw:r, html: htmlLines[i] }));
}




/** ======================== СБОРКА HTML ========================= */
function buildHtml_(){ const parsed = parseDoc_(); return renderAll_(parsed.sections, parsed.scope); }


function isOrderedGlyph_(gt){
  const O = DocumentApp.GlyphType;
  return [O.NUMBER, O.LATIN, O.LATIN_UPPER, O.LATIN_LOWER, O.ROMAN, O.ROMAN_UPPER, O.ROMAN_LOWER].indexOf(gt) !== -1;
}

function buildListHtml_(items){
  // items: [{level, ordered, html}]
  let html = '', level = 0, stack = [], openLi = false;

  const openList  = (ord)=>{ const tag = ord ? 'ol' : 'ul'; html += `<${tag}>`; stack.push(tag); level++; };
  const closeList = ()=>{ if (openLi){ html += '</li>'; openLi = false; } html += `</${stack.pop()}>`; level--; };

  items.forEach(it=>{
    while (level < it.level) openList(it.ordered);
    while (level > it.level) closeList();

    // смена типа списка на том же уровне (редко, но учтём)
    if (stack.length && ((stack[stack.length-1] === 'ol') !== it.ordered)){
      closeList(); openList(it.ordered);
    }

    if (openLi){ html += '</li>'; openLi = false; }
    html += `<li>${it.html}`; openLi = true;
  });

  if (openLi) html += '</li>';
  while (level > 0) closeList();
  return html;
}



function parseDoc_() {
  const body = DocumentApp.getActiveDocument().getBody();
  const sections = [];
  const scope = {
    containerMaxW:null, containerPct:null, sectionMaxW:null,
    seoTitle:null, seoDesc:null, seoKeys:[]   // <— НОВОЕ
  };


  let cur = null;
  const startSection = () => (cur = {
    title: '',
    type: null,
    blocks: [],
    meta: {
      forcedType:null, layout:null, ratio:null, caption:null, cols:null,
      cardsCols:null, cardRatio:null,
      featCols:null,  featRatio:null,
      bannerAlign:null, bannerSplit:false, bannerH:null, bannerBg:null,
      bannerMinH:null, bannerVAlign:null, bannerPadX:null, bannerPadY:null, bannerOverlay:null,
      secMt:null, secMb:null,
      containerMaxW:null, containerPct:null, sectionMaxW:null, heroMaxW:null,
      faqMode:'static', faqIcon:'',
      titleColor:null, textColor:null, btnColor:null,
      linkColor:null, linkWeight:null, linkUnderline:null,
      bgSection:null, bgContainer:null,
      sectionRadius:null, containerRadius:null, imgRadius:null, cardRadius:null, btnRadius:null,
      cardColor:null, cardTitleColor:null, cardBgColor:null, cardBgImg:null,
      btnBg:null,
      sectionBorder:null, containerBorder:null, cardBorder:null, btnBorder:null, faqItemBorder:null,
      descTop:[], descBottom:[]
    }
  });

  // локальный обработчик именно для глобального SCOPE (можно писать до первого LAYOUT)
  function tryScopeOnly_(line){
    if (!RX.SCOPE_ANY.test(line)) return false;
    const arg = line.replace(RX.SCOPE_ANY,'$1').trim();
    if (/container/i.test(arg) && /width/i.test(arg)){
      (arg.split(/width/i)[1]||'').split('|').map(s=>s.trim()).forEach(val=>{
        const len = normLen_(val);
        if (!len) return;
        if (/%$/.test(len)) scope.containerPct = len; else scope.containerMaxW = len;
      });
      return true;
    }
    if (/section/i.test(arg) && /width/i.test(arg)){
      const part = (arg.split(/width/i)[1]||'').trim();
      const len = normLen_(part);
      if (len) scope.sectionMaxW = len;
      return true;
    }
    return false;
  }

  for (let i = 0; i < body.getNumChildren(); i++) {
    const el = body.getChild(i);
    const t  = el.getType();

    if (t === DocumentApp.ElementType.PARAGRAPH){
      const p   = el.asParagraph();
      const H   = DocumentApp.ParagraphHeading;
      const headLevel =
        p.getHeading()===H.HEADING1?1:
        p.getHeading()===H.HEADING2?2:
        p.getHeading()===H.HEADING3?3:
        p.getHeading()===H.HEADING4?4:0;

      const lines = getParaLinesWithHtml_(p); // [{raw, html}]

      // Заголовки добавляем ТОЛЬКО если уже внутри секции
      if (headLevel){
        if (cur){ // только внутри начатой секции
          const html = lines.map(x=>x.html).join('');
          cur.blocks.push({kind:'h', level:headLevel, html});
        }
        continue;
      }

      // Обычные строки — по одной
      for (const {raw, html} of lines){
        const s = String(raw||'').trim();
        if (!s) continue;
        // --- SEO перед первой LAYOUT ---
        if (!cur){
          if (RX.SEO_TITLE.test(s)){ scope.seoTitle = s.replace(RX.SEO_TITLE,'').trim(); continue; }
          if (RX.SEO_DESC.test(s)){  scope.seoDesc  = (html ? html.replace(RX.SEO_DESC,'') : esc_(s.replace(RX.SEO_DESC,''))); continue; }
          if (RX.SEO_KEYS.test(s)){
            const add = s.replace(RX.SEO_KEYS,'').split(',').map(x=>x.trim()).filter(Boolean);
            if (add.length) scope.seoKeys = (scope.seoKeys||[]).concat(add);
            continue;
          }
        }

        // LAYOUT всегда начинает новую секцию
        if (RX.LAYOUT_ANY.test(s)){
          if (cur) sections.push(cur);
          startSection();                 // открыли новую
          // применяем саму директиву LAYOUT к текущей секции
          tryPushDirective_(cur, raw, html, scope);
          continue;
        }

        // До первого LAYOUT: разрешаем только глобальный SCOPE
        if (!cur){
          tryScopeOnly_(s);
          continue;
        }

        // Уже внутри секции: любые директивы/контент
        if (!tryPushDirective_(cur, raw, html, scope)){
          cur.blocks.push({kind:'p', html});
        }
      }
      continue;
    }

    if (t === DocumentApp.ElementType.LIST_ITEM){
      if (!cur) continue; // списки до первого LAYOUT игнорируем
      // собрать подряд идущие элементы списка
      let j = i; const items = [];
      while (j < body.getNumChildren() && body.getChild(j).getType() === DocumentApp.ElementType.LIST_ITEM){
        const li   = body.getChild(j).asListItem();
        const lvl  = li.getNestingLevel();
        const ord  = isOrderedGlyph_(li.getGlyphType());
        const html = getParaLinesWithHtml_(li).map(x=>x.html).join(' ');
        items.push({ level:lvl, ordered:ord, html });
        j++;
      }
      cur.blocks.push({kind:'list', html: buildListHtml_(items)});
      i = j - 1;
      continue;
    }
  }

  if (cur) sections.push(cur);

  // дефолтный тип, если не задан
  sections.forEach(sec => { if (!sec.type) sec.type = 'media'; });

  return { sections, scope };
}






/** Директивы одной строкой; true → обработано */
function tryPushDirective_(cur, line, htmlLine, scope){
  const txt = String(line||'');



  if (RX.CONTAINER_ALIGN.test(txt)){
    const v = txt.replace(RX.CONTAINER_ALIGN,'').trim().toLowerCase();
    if (v === 'center')      cur.meta.containerMargin = '0 auto';
    else if (v === 'right')  cur.meta.containerMargin = '0 0 0 auto';
    else if (v === 'left')   cur.meta.containerMargin = '0';
    return true;
  }

  // ====== BORDER-RADIUS ======

  // "RADIUS:" без суффикса считаем радиусом СЕКЦИИ
  if (RX.RADIUS_ANY.test(txt) && !RX.RADIUS_SECTION.test(txt) && !RX.RADIUS_CONTAINER.test(txt)){
    const val = normRadiusBox_(txt.replace(RX.RADIUS_ANY,''));
    if (val) cur.meta.sectionRadius = val;
    return true;
  }
  if (RX.RADIUS_SECTION.test(txt)){
    const val = normRadiusBox_(txt.replace(RX.RADIUS_SECTION,''));
    if (val) cur.meta.sectionRadius = val;
    return true;
  }
  if (RX.RADIUS_CONTAINER.test(txt)){
    const val = normRadiusBox_(txt.replace(RX.RADIUS_CONTAINER,''));
    if (val) cur.meta.containerRadius = val;
    return true;
  }
  if (RX.RADIUS_IMG.test(txt)){
    const val = normRadiusBox_(txt.replace(RX.RADIUS_IMG,''));
    if (val) cur.meta.imgRadius = val;
    return true;
  }
  if (RX.RADIUS_CARD.test(txt)){
    const val = normRadiusBox_(txt.replace(RX.RADIUS_CARD,''));
    if (val) cur.meta.cardRadius = val;
    return true;
  }
  if (RX.RADIUS_BTN.test(txt)){
    const val = normRadiusBox_(txt.replace(RX.RADIUS_BTN,''));
    if (val) cur.meta.btnRadius = val;
    return true;
  }


  if (RX.LEAD.test(txt)){
    const raw = txt.replace(RX.LEAD,'');
    const html = htmlLine ? htmlLine.replace(RX.LEAD,'') : esc_(raw);
    cur.blocks.push({ kind:'lead', html });
    return true;
  }

  // ===== Section descriptions (top/bottom) =====
  if (RX.DESC_TOP.test(txt)){
    const raw  = txt.replace(RX.DESC_TOP,'');
    const html = htmlLine ? htmlLine.replace(RX.DESC_TOP,'') : esc_(raw);
    (cur.meta.descTop || (cur.meta.descTop=[])).push(html);
    return true;
  }
  if (RX.DESC_BOTTOM.test(txt)){
    const raw  = txt.replace(RX.DESC_BOTTOM,'');
    const html = htmlLine ? htmlLine.replace(RX.DESC_BOTTOM,'') : esc_(raw);
    (cur.meta.descBottom || (cur.meta.descBottom=[])).push(html);
    return true;
  }



  if (RX.TITLE.test(txt)){
    const v = txt.replace(RX.TITLE,'').trim();
    // TITLE: -  → скрыть H2
    cur.title = (v === '-' || v.toLowerCase() === 'none') ? '' : esc_(v);
    return true;
  }

  // LAYOUT: Media left/right  |  Cards 3col/4col
  if (RX.LAYOUT_ANY.test(txt)){
    const arg = txt.replace(RX.LAYOUT_ANY, '$1').trim().toLowerCase();

    if (/\bzigzag\b/.test(arg) || /\balternat(?:e|ing)\b/.test(arg)){
      cur.type = 'zigzag';
      cur.meta.forcedType = 'zigzag';
    }

    if (arg.includes('faq')){
      cur.type = 'faq'; cur.meta.forcedType = 'faq';
      if (/\baccordion\b/.test(arg)) cur.meta.faqMode = 'accordion';
      if (/\bstatic\b/.test(arg))    cur.meta.faqMode = 'static';
    }

    if (arg.includes('banner')){
      cur.type = 'banner'; cur.meta.forcedType = 'banner';
      if (/\bsplit\b/.test(arg))  cur.meta.bannerSplit = true;         // LAYOUT: Banner split
      if (/\bright\b/.test(arg))  cur.meta.bannerAlign = 'right';
      else if (/\bcenter\b/.test(arg)) cur.meta.bannerAlign = 'center';
      else if (/\bleft\b/.test(arg))   cur.meta.bannerAlign = 'left';  // по умолчанию left
    }

    // внутри tryPushDirective_ — в блоке if (RX.LAYOUT_ANY.test(txt)) { ... }
    if (arg.includes('media')){
      cur.type = 'media'; 
      cur.meta.forcedType = 'media';
      if (/\bright\b/.test(arg)) cur.meta.layout = 'right';
      if (/\bleft\b/.test(arg))  cur.meta.layout = 'left';
      if (/\bstack(ed)?\b/.test(arg)) cur.meta.mediaStacked = true;  // ← NEW
    }

    if (arg.includes('cards')){
      cur.type = 'cards'; cur.meta.forcedType = 'cards';
      const m = arg.match(/(\d+)\s*col/);
      if (m) cur.meta.cardsCols = Math.max(1, parseInt(m[1],10)||3);
      // необязательное соотношение для изображений карточек: Cards 3col 4/5
      const r = arg.match(/(\d+)\s*\/\s*(\d+)/);
      if (r) cur.meta.cardRatio = r[1]+'/'+r[2];
    }
    return true;
  }

  // MEDIA: IMAGE SIZE (RATIO): 3/2
  if (RX.IMG_SIZE.test(txt)){
    const v = txt.replace(RX.IMG_SIZE,'').trim();
    if (/^\d+\s*\/\s*\d+$/.test(v)){
      if (cur.type === 'cards') cur.meta.cardRatio = v.replace(/\s+/g,'');
      else cur.meta.ratio = v.replace(/\s+/g,'');
    }
    return true;
  }

  // MEDIA: CAP:
  if (RX.CAP.test(txt)){
    const cap = esc_(txt.replace(RX.CAP,'').trim());
    if (cur.type === 'zigzag'){
      const lastImg = [...cur.blocks].reverse().find(b=>b.kind==='img');
      if (lastImg) lastImg.cap = cap; else cur.meta.caption = cap;
    } else {
      cur.meta.caption = cap;
    }
    return true;
  }


  // COLS:
  // media → ожидаем 2 числа (img/content); cards → одно число (колонок)
  if (RX.COLS.test(txt)){
    const raw = txt.replace(RX.COLS,'').trim();
    const m = raw.match(/(\d+(?:\.\d+)?)/g);
    if (cur.type === 'cards'){
      if (m && m.length >= 1){
        const n = Math.max(1, parseInt(m[0],10)||3);
        cur.meta.cardsCols = n;
      }
    } else {
      if (m && m.length >= 2){
        let a = parseFloat(m[0]), b = parseFloat(m[1]);
        if (a + b <= 1.001) { a*=100; b*=100; } // доли → проценты
        if (a + b > 0) cur.meta.cols = [a,b];
      }
    }
    return true;
  }


  // BG SECTION: цвет | градиент | URL | url(...)
  if (RX.BG_SECTION.test(txt)){
    const vRaw = txt.replace(RX.BG_SECTION,'').trim();
    if (vRaw){
      const isUrl  = /^https?:\/\//i.test(vRaw) || /^data:/i.test(vRaw) || /^url\(/i.test(vRaw);
      const isGrad = /gradient\(/i.test(vRaw);
      const isCol  = /^#|^rgb|^hsl|^var\(/i.test(vRaw);

      if (isUrl){
        cur.meta.sectionBgImg = /^url\(/i.test(vRaw) ? vRaw : "url('"+esc_(vRaw)+"')";
      } else if (isGrad){
        cur.meta.sectionBgImg = vRaw;                  // ← градиент без url()
      } else if (isCol){
        cur.meta.sectionBgColor = vRaw;
      } else {
        cur.meta.sectionBgColor = vRaw;                // фолбэк
      }
    }
    return true;
  }


  // BG CONTAINER: цвет | градиент | URL | url(...)
  if (RX.BG_CONTAINER.test(txt)){
    const vRaw = txt.replace(RX.BG_CONTAINER,'').trim();
    if (vRaw){
      const isUrl  = /^https?:\/\//i.test(vRaw) || /^data:/i.test(vRaw) || /^url\(/i.test(vRaw);
      const isGrad = /gradient\(/i.test(vRaw);
      const isCol  = /^#|^rgb|^hsl|^var\(/i.test(vRaw);

      if (isUrl){
        cur.meta.containerBgImg = /^url\(/i.test(vRaw) ? vRaw : "url('"+esc_(vRaw)+"')";
      } else if (isGrad){
        cur.meta.containerBgImg = vRaw;                // ← градиент без url()
      } else if (isCol){
        cur.meta.containerBgColor = vRaw;
      } else {
        cur.meta.containerBgColor = vRaw;
      }
    }
    return true;
  }


  // MARGIN SECTION: 15 20 50 12
  if (RX.MARGIN_SECTION.test(txt)){
    const box = normBox_(txt.replace(RX.MARGIN_SECTION,''));
    if (box) cur.meta.sectionMargin = box;
    return true;
  }

  // PADDING SECTION: 20 16
  if (RX.PADDING_SECTION.test(txt)){
    const box = normBox_(txt.replace(RX.PADDING_SECTION,'')); 
    if (box) cur.meta.sectionPadding = box;
    return true;
  }

  // MARGIN CONTAINER: 0 auto 40 auto  (или просто 15 20 50 12)
  if (RX.MARGIN_CONTAINER.test(txt)){
    // поддерживаем только px числа (как просил), если нужно auto — пиши словом "auto"
    const raw = txt.replace(RX.MARGIN_CONTAINER,'').trim();
    const parts = raw.split(/[ ,]+/).filter(Boolean).map(s=>/auto/i.test(s)?'auto':(normPx_(s)||''));
    if (parts.some(Boolean)){
      // дополняем до 4 как в CSS
      let a = parts.filter(Boolean);
      if (a.length===1) a=[a[0],a[0],a[0],a[0]];
      if (a.length===2) a=[a[0],a[1],a[0],a[1]];
      if (a.length===3) a=[a[0],a[1],a[2],a[1]];
      cur.meta.containerMargin = a.slice(0,4).join(' ');
    }
    return true;
  }

  // PADDING CONTAINER: 24 16
  if (RX.PADDING_CONTAINER.test(txt)){
    const box = normBox_(txt.replace(RX.PADDING_CONTAINER,''));
    if (box) cur.meta.containerPadding = box;
    return true;
  }



  // BG: фон для секции
  if (RX.BG.test(txt)){
    const vRaw = txt.replace(RX.BG,'').trim();
    if (!vRaw) return true;

    const isUrl   = /^https?:\/\//i.test(vRaw) || /^data:/i.test(vRaw) || /^url\(/i.test(vRaw);
    const isGrad  = /gradient\(/i.test(vRaw);
    const isColor = /^#|^rgb|^hsl|^var\(/i.test(vRaw);

    if (isUrl){
      cur.meta.sectionBgImg = /^url\(/i.test(vRaw) ? vRaw : "url('"+esc_(vRaw)+"')";
    } else if (isGrad){
      cur.meta.sectionBgImg = vRaw;                    // ← градиент без url()
    } else if (isColor){
      cur.meta.sectionBgColor = vRaw;
    } else {
      cur.meta.sectionBgColor = vRaw;
    }
    return true;
  }



  // ALIGN: выравнивание
  if (RX.ALIGN.test(txt)){
    const v = txt.replace(RX.ALIGN,'').trim().toLowerCase();
    if (['left','center','right'].includes(v)) cur.meta.bannerAlign = v;
    return true;
  }

  // HEADING: уровень заголовка
  if (RX.HEADING.test(txt)){
    const v = txt.replace(RX.HEADING,'').trim().toLowerCase();
    if (v.includes('1')) cur.meta.bannerH = 'h1';
    else if (v.includes('2')) cur.meta.bannerH = 'h2';
    return true;
  }

  // MIN HEIGHT: минимальная высота (px)
  if (RX.MINH.test(txt)){
    const raw = txt.replace(RX.MINH,'').trim();
    const m = raw.match(/(\d+)/);
    if (m) cur.meta.bannerMinH = m[1] + 'px';
    return true;
  }


  // ===== COLORS =====
  if (RX.COLOR.test(txt)){
    const v = txt.replace(RX.COLOR,'').trim();
    if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(v)){ cur.meta.titleColor = v; cur.meta.textColor = v; }
    return true;
  }
  if (RX.TITLE_COLOR.test(txt)){
    const v = txt.replace(RX.TITLE_COLOR,'').trim();
    if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(v)) cur.meta.titleColor = v;
    return true;
  }
  if (RX.TEXT_COLOR.test(txt)){
    const v = txt.replace(RX.TEXT_COLOR,'').trim();
    if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(v)) cur.meta.textColor = v;
    return true;
  }



  // VALIGN: top|center|bottom
  if (RX.VALIGN.test(txt)){
    const v = txt.replace(RX.VALIGN,'').trim().toLowerCase();
    if (['top','center','middle','bottom'].includes(v)){
      cur.meta.bannerVAlign = (v === 'middle') ? 'center' : v;
    }
    return true;
  }

  // BTN COLOR: #hex
  if (RX.BTN_COLOR.test(txt)){
    const v = txt.replace(RX.BTN_COLOR,'').trim();
    if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(v)) cur.meta.btnColor = v;
    return true;
  }






  // FAQ MODE: accordion|static    /   ACCORDION: on|off
  if (RX.FAQ_MODE.test(txt)){
    const v = txt.replace(RX.FAQ_MODE,'').trim().toLowerCase();
    if (v.includes('accordion') || v === 'on' || v === 'true') cur.meta.faqMode = 'accordion';
    if (v.includes('static')    || v === 'off' || v === 'false') cur.meta.faqMode = 'static';
    return true;
  }

  // FAQ ICON: ❓ (по умолчанию без иконки)
  if (RX.FAQ_ICON.test(txt)){
    cur.meta.faqIcon = esc_(txt.replace(RX.FAQ_ICON,'').trim() || '❓');
    return true;
  }

  // Q / A пары
  if (RX.Q.test(txt)){
    const raw = txt.replace(RX.Q,'');
    const html = (htmlLine ? htmlLine.replace(RX.Q,'') : esc_(raw));
    cur.blocks.push({kind:'faq_q', text: html});
    return true;
  }
  if (RX.A.test(txt)){
    const raw = txt.replace(RX.A,'');
    const html = (htmlLine ? htmlLine.replace(RX.A,'') : esc_(raw));
    cur.blocks.push({kind:'faq_a', text: html});
    return true;
  }




  // LINK COLOR: #hex
  if (RX.LINK_COLOR.test(txt)){
    const v = txt.replace(RX.LINK_COLOR,'').trim();
    if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(v)) cur.meta.linkColor = v;
    return true;
  }
  // LINK WEIGHT: 400|500|600|700|bold|normal...
  if (RX.LINK_WEIGHT.test(txt)){
    let v = txt.replace(RX.LINK_WEIGHT,'').trim().toLowerCase();
    // допускаем число или ключевое слово
    if (/^\d{3}$/.test(v) || /^(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/.test(v)){
      // маппим ключевые слова на числа (по желанию)
      const map = {thin:'100', extralight:'200', light:'300', normal:'400', medium:'500', semibold:'600', bold:'700', extrabold:'800', black:'900'};
      if (map[v]) v = map[v];
      cur.meta.linkWeight = v;
    }
    return true;
  }
  // LINK UNDERLINE: on|off|hover
  if (RX.LINK_UNDERLINE.test(txt)){
    const v = txt.replace(RX.LINK_UNDERLINE,'').trim().toLowerCase();
    if (['on','off','hover'].includes(v)) cur.meta.linkUnderline = v;
    return true;
  }



  // OVERLAY CONTAINER: rgba(...) | #hex[aa] | 0..1 | none/off
  if (RX.OVERLAY_CONTAINER.test(txt)){
    const v = txt.replace(RX.OVERLAY_CONTAINER,'').trim();
    let out = v;
    if (/^(none|off)$/i.test(v)) out = 'transparent';
    else if (/^(0?\.\d+|1(?:\.0+)?)$/.test(v)) out = 'rgba(0,0,0,'+(parseFloat(v))+')';
    cur.meta.containerOverlay = out;
    return true;
  }

  // OVERLAY (SECTION): rgba(...) | #hex[aa] | 0..1 | none/off
  if (RX.OVERLAY.test(txt)){
    const v = txt.replace(RX.OVERLAY,'').trim();
    let out = v;
    if (/^(none|off)$/i.test(v)) out = 'transparent';
    else if (/^(0?\.\d+|1(?:\.0+)?)$/.test(v)) out = 'rgba(0,0,0,'+(parseFloat(v))+')';
    cur.meta.sectionOverlay = out;
    return true;
  }



  // ====== ОТСТУПЫ СЕКЦИИ ======

  // Полноценный CSS-шортханд для секции: MARGIN: [1..4] (px/auto)
  if (RX.MARGIN_ANY.test(txt) && !RX.MARGIN_CONTAINER.test(txt) && !RX.MARGIN_SECTION.test(txt)){
    const box = normCssBox_(txt.replace(RX.MARGIN_ANY,''), /*allowAuto*/ true);
    if (box) cur.meta.sectionMargin = box;
    return true;
  }

  // Короткие формы по-прежнему поддерживаем (MT/MB), но уже не обязательны
  if (RX.SEC_MT.test(txt)){
    const px = normPx_(txt.replace(RX.SEC_MT,'').trim());
    if (px) cur.meta.secMt = px;
    return true;
  }
  if (RX.SEC_MB.test(txt)){
    const px = normPx_(txt.replace(RX.SEC_MB,'').trim());
    if (px) cur.meta.secMb = px;
    return true;
  }

  // Полноценный CSS-шортханд для секции: PADDING: [1..4] (px)
  if (RX.PADDING_ANY.test(txt) && !RX.PADDING_CONTAINER.test(txt) && !RX.PADDING_SECTION.test(txt)){
    const box = normCssBox_(txt.replace(RX.PADDING_ANY,'')); // только px
    if (box) cur.meta.sectionPadding = box;
    return true;
  }



  // ====== ШИРИНЫ ДЛЯ СЕКЦИИ ======
  if (RX.CONTAINER_W.test(txt)){
    const raw = txt.replace(RX.CONTAINER_W,'').trim();
    raw.split('|').map(s=>s.trim()).forEach(val=>{
      const len = normLen_(val);
      if (!len) return;
      if (/%$/.test(len)) cur.meta.containerPct = len; else cur.meta.containerMaxW = len;
    });
    return true;
  }
  if (RX.SECTION_W.test(txt)){
    const len = normLen_(txt.replace(RX.SECTION_W,'').trim());
    if (len) cur.meta.sectionMaxW = len;
    return true;
  }
  if (RX.HERO_W.test(txt)){
    const len = normLen_(txt.replace(RX.HERO_W,'').trim());
    if (len) cur.meta.heroMaxW = len;
    return true;
  }

  // ====== ГЛОБАЛЬНО НА ВСЁ ПОЛОТНО (.bot-scope) ======
  if (RX.SCOPE_ANY.test(txt) && scope){
    const arg = txt.replace(RX.SCOPE_ANY,'$1').trim();
    // SCOPE: CONTAINER WIDTH 1200 | 92%
    if (/container/i.test(arg) && /width/i.test(arg)){
      (arg.split(/width/i)[1]||'').split('|').map(s=>s.trim()).forEach(val=>{
        const len = normLen_(val);
        if (!len) return;
        if (/%$/.test(len)) scope.containerPct = len; else scope.containerMaxW = len;
      });
      return true;
    }
    // SCOPE: SECTION WIDTH 1400
    if (/section/i.test(arg) && /width/i.test(arg)){
      const part = (arg.split(/width/i)[1]||'').trim();
      const len = normLen_(part);
      if (len) scope.sectionMaxW = len;
      return true;
    }
  }

  // ===== CARDS: цвет и фон =====
  if (RX.CARD_COLOR.test(txt)){
    const v = txt.replace(RX.CARD_COLOR,'').trim();
    if (isColor_(v)) cur.meta.cardColor = v;
    return true;
  }
  if (RX.CARD_TITLE_COLOR.test(txt)){
    const v = txt.replace(RX.CARD_TITLE_COLOR,'').trim();
    if (isColor_(v)) cur.meta.cardTitleColor = v;
    return true;
  }
  if (RX.CARD_BG.test(txt)){
    const vRaw = txt.replace(RX.CARD_BG,'').trim();
    if (vRaw){
      const isUrl  = /^https?:\/\//i.test(vRaw) || /^data:/i.test(vRaw) || /^url\(/i.test(vRaw);
      const isGrad = /gradient\(/i.test(vRaw);
      if (isUrl || isGrad){
        cur.meta.cardBgImg = /^url\(/i.test(vRaw) ? vRaw : "url('"+esc_(vRaw)+"')";
      } else {
        cur.meta.cardBgColor = vRaw; // цвет/var(...)
      }
    }
    return true;
  }

  // ===== BUTTON: фоновый цвет =====
  if (RX.BTN_BG.test(txt)){
    const v = txt.replace(RX.BTN_BG,'').trim();
    if (v) cur.meta.btnBg = v;  // цвет или gradient(...)
    return true;
  }

  // ===== BORDERS (CSS shorthand) =====
  if (RX.BORDER_SECTION.test(txt)){
    const v = txt.replace(RX.BORDER_SECTION,'').trim();
    if (v) cur.meta.sectionBorder = v;  // напр. "2px dashed #ccc"
    return true;
  }
  if (RX.BORDER_CONTAINER.test(txt)){
    const v = txt.replace(RX.BORDER_CONTAINER,'').trim();
    if (v) cur.meta.containerBorder = v;
    return true;
  }
  if (RX.BORDER_CARD.test(txt)){
    const v = txt.replace(RX.BORDER_CARD,'').trim();
    if (v) cur.meta.cardBorder = v;
    return true;
  }
  if (RX.BORDER_BTN.test(txt)){
    const v = txt.replace(RX.BORDER_BTN,'').trim();
    if (v) cur.meta.btnBorder = v;
    return true;
  }
  if (RX.BORDER_FAQ_ITEM.test(txt)){
    const v = txt.replace(RX.BORDER_FAQ_ITEM,'').trim();
    if (v) cur.meta.faqItemBorder = v;
    return true;
  }













  // CTA / BTN
  if (RX.CTA.test(txt)){
    const parts = txt.replace(RX.CTA,'').split('|').map(s=>s.trim());
    cur.blocks.push({kind:'cta', text:esc_(parts[0]||'Learn more'), url:esc_(parts[1]||'#')});
    return true;
  }
  if (RX.BTN.test(txt)){
    const parts = txt.replace(RX.BTN,'').split('|').map(s=>s.trim());
    cur.blocks.push({kind:'btn', text:esc_(parts[0]||'Button'), url:esc_(parts[1]||'#')});
    return true;
  }

  // IMG: (универсально)
  if (RX.IMG.test(txt)){
    const p = txt.replace(RX.IMG,'').split('|').map(s=>s.trim());
    const ph = htmlLine ? htmlLine.replace(RX.IMG,'').split('|').map(s=>s.trim()) : null;
    if (cur.type === 'cards'){
      // IMG: url | Title | Description | Button | URL
      cur.blocks.push({
        kind:'card', img:esc_(p[0]||''), icon:'', title: ph && ph[1] ? ph[1] : esc_(p[1]||''), descr: ph && ph[2] ? ph[2] : esc_(p[2]||''),
        btnText:esc_(p[3]||''), btnUrl:esc_(p[4]||'')
      });
    } else {
      cur.blocks.push({ kind:'img', src:esc_(p[0]||''), alt:esc_(p[1]||'') });
    }
    return true;
  }

  // ICON: символ/эмодзи вместо изображения
  if (RX.ICON.test(txt)){
    const p = txt.replace(RX.ICON,'').split('|').map(s=>s.trim());
    const ph = htmlLine ? htmlLine.replace(RX.ICON,'').split('|').map(s=>s.trim()) : null;
    // ICON: 🙂 | Title | Description | Button | URL
    cur.blocks.push({
      kind:'card', img:'', icon:esc_(p[0]||'★'), title: ph && ph[1] ? ph[1] : esc_(p[1]||''), descr: ph && ph[2] ? ph[2] : esc_(p[2]||''), 
      btnText:esc_(p[3]||''), btnUrl:esc_(p[4]||'')
    });
    return true;
  }

  return false;
}

function renderAll_(sections, scope){
  const out = [];
  const scopeVars=[];
  const MOBILE_K = 0.4; // уменьшение на 60%
  if (scope?.containerMaxW) scopeVars.push(`--bot-container-maxw:${scope.containerMaxW}`);
  if (scope?.containerPct)   scopeVars.push(`--bot-container-pct:${scope.containerPct}`);
  if (scope?.sectionMaxW)    scopeVars.push(`--bot-section-maxw:${scope.sectionMaxW}`);
  out.push('<!-- Safe scope wrapper -->');
  out.push('<div class="bot-scope"'+(scopeVars.length? ' style="'+scopeVars.join(';')+'"' : '')+'>');

  // ---- SEO preview + готовые meta-теги ----
  if (scope?.seoTitle || scope?.seoDesc || (scope?.seoKeys||[]).length){
    const keys = (scope.seoKeys||[]).join(', ');
    const descPlain = stripTags_(scope.seoDesc||'');
    out.push('  <!-- SEO: put into <head>');
    if (scope.seoTitle) out.push('       <title>'+esc_(scope.seoTitle)+'</title>');
    if (descPlain)      out.push('       <meta name="description" content="'+esc_(descPlain)+'">');
    if (keys)           out.push('       <meta name="keywords" content="'+esc_(keys)+'">');
    out.push('  -->');

    out.push('  <div class="bot-seo">');
    if (scope.seoTitle) out.push('    <div><b>Title:</b> '+esc_(scope.seoTitle)+'</div>');
    if (scope.seoDesc)  out.push('    <div><b>Description:</b> '+scope.seoDesc+'</div>');
    if (keys)           out.push('    <div><b>Keywords:</b> '+esc_(keys)+'</div>');
    out.push('  </div>');
}


  sections.forEach(sec=>{
    const styleVars = [];
    const containerVars = []; // <— объявляем СРАЗУ, чтобы им можно было пользоваться

    // цвета/ссылки
    if (sec.meta?.titleColor) styleVars.push(`--bot-title-color:${sec.meta.titleColor}`);
    if (sec.meta?.textColor)  styleVars.push(`--bot-text-color:${sec.meta.textColor}`);
    if (sec.meta?.btnColor)   styleVars.push(`--bot-btn-color:${sec.meta.btnColor}`);
    if (sec.meta?.linkColor)  styleVars.push(`--bot-link-color:${sec.meta.linkColor}`);
    if (sec.meta?.linkWeight) styleVars.push(`--bot-link-weight:${sec.meta.linkWeight}`);

    // отступы/ширины
    if (sec.meta?.secMt)         styleVars.push(`--bot-section-mt:${sec.meta.secMt}`);
    if (sec.meta?.secMb)         styleVars.push(`--bot-section-mb:${sec.meta.secMb}`);
    if (sec.meta?.containerMaxW) styleVars.push(`--bot-container-maxw:${sec.meta.containerMaxW}`);
    if (sec.meta?.containerPct)  styleVars.push(`--bot-container-pct:${sec.meta.containerPct}`);
    if (sec.meta?.sectionMaxW)   styleVars.push(`--bot-section-maxw:${sec.meta.sectionMaxW}`);
    if (sec.meta?.sectionMargin)  styleVars.push(`--bot-section-m:${sec.meta.sectionMargin}`);
    if (sec.meta?.sectionPadding) styleVars.push(`--bot-section-p:${sec.meta.sectionPadding}`);
    if (sec.meta?.sectionMargin)  styleVars.push(`--bot-section-m-m:${scaleCssBox_(sec.meta.sectionMargin,  MOBILE_K)}`);
    if (sec.meta?.sectionPadding) styleVars.push(`--bot-section-p-m:${scaleCssBox_(sec.meta.sectionPadding, MOBILE_K)}`);


    // ФОНЫ секции
    if (sec.meta?.sectionBgColor) styleVars.push(`--bot-section_bgcolor:${sec.meta.sectionBgColor}`);
    if (sec.meta?.sectionBgImg)   styleVars.push(`--bot-section_bgimg:${sec.meta.sectionBgImg}`);
    if (sec.meta?.sectionOverlay) styleVars.push(`--bot-section_overlay:${sec.meta.sectionOverlay}`);

    if (sec.meta?.sectionRadius) styleVars.push(`--bot-section-radius:${sec.meta.sectionRadius}`);
    if (sec.meta?.btnRadius)     styleVars.push(`--bot-btn-radius:${sec.meta.btnRadius}`);

    if (sec.meta?.sectionBorder) styleVars.push(`--bot-section-border:${sec.meta.sectionBorder}`);
    if (sec.meta?.btnBg)        styleVars.push(`--bot-btn-bg:${sec.meta.btnBg}`);
    if (sec.meta?.btnBorder)    styleVars.push(`--bot-btn-border:${sec.meta.btnBorder}`);



    // ФОНЫ контейнера
    if (sec.meta?.containerBgColor) containerVars.push(`--bot-container_bgcolor:${sec.meta.containerBgColor}`);
    if (sec.meta?.containerBgImg)   containerVars.push(`--bot-container_bgimg:${sec.meta.containerBgImg}`);
    if (sec.meta?.containerOverlay) containerVars.push(`--bot-container_overlay:${sec.meta.containerOverlay}`);

    if (sec.meta?.containerMargin)  containerVars.push(`--bot-container-m:${sec.meta.containerMargin}`);
    if (sec.meta?.containerPadding) containerVars.push(`--bot-container-p:${sec.meta.containerPadding}`);

    if (sec.meta?.containerMargin)  containerVars.push(`--bot-container-m-m:${scaleCssBox_(sec.meta.containerMargin,  MOBILE_K)}`);
    if (sec.meta?.containerPadding) containerVars.push(`--bot-container-p-m:${scaleCssBox_(sec.meta.containerPadding, MOBILE_K)}`);

    if (sec.meta?.containerRadius) containerVars.push(`--bot-container-radius:${sec.meta.containerRadius}`);
    if (sec.meta?.imgRadius)       containerVars.push(`--bot-img-radius:${sec.meta.imgRadius}`);
    if (sec.meta?.cardRadius)      containerVars.push(`--bot-card-radius:${sec.meta.cardRadius}`);

    if (sec.meta?.containerBorder)  containerVars.push(`--bot-container-border:${sec.meta.containerBorder}`);

    if (sec.meta?.cardColor)        containerVars.push(`--bot-card-color:${sec.meta.cardColor}`);
    if (sec.meta?.cardTitleColor)   containerVars.push(`--bot-card-title-color:${sec.meta.cardTitleColor}`);
    if (sec.meta?.cardBgColor)      containerVars.push(`--bot-card-bgcolor:${sec.meta.cardBgColor}`);
    if (sec.meta?.cardBgImg)        containerVars.push(`--bot-card-bgimg:${sec.meta.cardBgImg}`);
    if (sec.meta?.cardBorder)       containerVars.push(`--bot-card-border:${sec.meta.cardBorder}`);

    if (sec.meta?.faqItemBorder)    containerVars.push(`--bot-faq-item-border:${sec.meta.faqItemBorder}`);



    // подчёркивание ссылок
    if (sec.meta?.linkUnderline && sec.meta.linkUnderline !== 'hover'){
      styleVars.push(`--bot-link-decoration:${sec.meta.linkUnderline === 'on' ? 'underline' : 'none'}`);
    }
    const dataUnderline = (sec.meta?.linkUnderline === 'hover') ? ' data-link-underline="hover"' : '';

    out.push('  <section class="bot-section"'+(styleVars.length? ' style="'+styleVars.join(';')+'"' : '')+ dataUnderline + '>');
    out.push('    <div class="bot-container"'+(containerVars.length?' style="'+containerVars.join(';')+'"':'')+'>');


    // у баннера НЕ выводим секционный H2
    if (sec.type !== 'banner' && sec.title){
      out.push('      <h2 class="bot-section-title bot-center">'+esc_(sec.title)+'</h2>');
    }

    // ВЕРХ описания секции (внутри контейнера)
    if (sec.meta?.descTop && sec.meta.descTop.length){
      out.push('      <div class="bot-section-desc is-top">');
      sec.meta.descTop.forEach(p => out.push('        <p class="bot-text-muted">'+p+'</p>'));
      out.push('      </div>');
    }


    const r = (sec.type === 'cards')  ? RENDERERS.cards
            : (sec.type === 'banner') ? RENDERERS.banner
            : (sec.type === 'faq')    ? RENDERERS.faq
            : (sec.type === 'zigzag') ? RENDERERS.zigzag
            :                           RENDERERS.media;

    out.push(r(sec));

    // НИЗ описания секции (внутри контейнера)
    if (sec.meta?.descBottom && sec.meta.descBottom.length){
      out.push('      <div class="bot-section-desc is-bottom">');
      sec.meta.descBottom.forEach(p => out.push('        <p class="bot-text-muted">'+p+'</p>'));
      out.push('      </div>');
    }


    out.push('    </div>');
    out.push('  </section>');
  });
  out.push('</div><!-- /.bot-scope -->');
  return out.join('\n');
}


/** =========================== РЕНДЕРЕРЫ =========================== */
const RENDERERS = {
  // ===== MEDIA (как было) =====
  media: (sec) => {
    const out = [];
    const img  = sec.blocks.find(b=>b.kind==='img');
    const btns = sec.blocks.filter(b=>b.kind==='btn' || b.kind==='cta');

    const right = (sec.meta.layout === 'right');
    const stacked = !!sec.meta.mediaStacked;   
    const ratio = sec.meta.ratio || '4/3';

    let imgFr = 1, contentFr = 1;
    if (Array.isArray(sec.meta.cols)) {
      const a = sec.meta.cols[0], b = sec.meta.cols[1];
      if ((a > 0) && (b > 0)) { imgFr = a; contentFr = b; }
    }
    const widthVars = `--bot-media-img:${imgFr}fr;--bot-media-content:${contentFr}fr;`;

    out.push(
      '      <div class="bot-media'
      + (right ? ' is-right' : '')
      + (stacked ? ' is-stacked' : '')                    // ← NEW
      + '" style="--bot-media-ratio:'+ratio+';'+widthVars+'">'
    );

    // колонка с картинкой
    out.push('        <div class="bot-media__col bot-media__imgcol">');
    if (img){
      out.push('          <figure class="bot-media__figure">');
      out.push('            <img loading="lazy" class="bot-media__img bot-rounded bot-shadow-outline" src="'+(img.src||'')+'" alt="'+(img.alt||'')+'">');
      if (sec.meta.caption) out.push('            <figcaption class="bot-media__cap bot-text-sm bot-text-muted">'+sec.meta.caption+'</figcaption>');
      out.push('          </figure>');
    }
    out.push('        </div>');

    // колонка с текстом — выводим блоки в том порядке, как в документе
    out.push('        <div class="bot-media__col bot-media__txtcol">');
    sec.blocks.forEach(b=>{
      if (b.kind==='img' || b.kind==='btn' || b.kind==='cta') return;
      if (b.kind==='h')   out.push(`          <h${b.level} style="margin:0 0 .5rem 0; line-height:1.2;">${b.html}</h${b.level}>`);
      else if (b.kind==='p')   out.push('          <p class="bot-text-muted" style="margin:.25rem 0 0 0;">'+b.html+'</p>');
      else if (b.kind==='list')out.push('          '+b.html);
    });

    if (btns.length){
      out.push('          <div class="bot-actions" style="margin-top:var(--bot-gap-sm);">');
      btns.forEach(b=> out.push('            <a class="bot-btn" href="'+(b.url||'#')+'">'+(b.text||'Learn more')+'</a>'));
      out.push('          </div>');
    }
    out.push('        </div>');

    out.push('      </div>');
    return out.join('\n');
  },

  zigzag: (sec) => {
    const out = [];
    const ratio = (sec.meta.ratio || '4/3').replace(/\s+/g,'');
    let imgFr = 1, contentFr = 1;
    if (Array.isArray(sec.meta.cols)) { imgFr = sec.meta.cols[0]; contentFr = sec.meta.cols[1]; }
    const rowVars = `--bot-zig-img:${imgFr}fr;--bot-zig-content:${contentFr}fr;--bot-zig-ratio:${ratio};`;

    // группируем по IMG: каждая картинка открывает новую «строку»
    const rows = [];
    let cur = null;
    sec.blocks.forEach(b=>{
      if (b.kind==='img'){ if (cur) rows.push(cur); cur = {img:b, content:[], btns:[]}; return; }
      if (!cur) cur = {img:null, content:[], btns:[]}; // на случай текста до первой IMG
      if (b.kind==='btn' || b.kind==='cta') cur.btns.push(b);
      else if (b.kind==='h' || b.kind==='p' || b.kind==='list') cur.content.push(b);
    });
    if (cur) rows.push(cur);

    // лид сверху (если есть)
    const lead = sec.blocks.find(b=>b.kind==='lead');
    if (lead?.html) out.push('      <p class="bot-lead bot-center bot-text-muted">'+lead.html+'</p>');

    out.push('      <div class="bot-zigzag">');

    rows.forEach((r, i)=>{
      const right = (i % 2 === 1); // 2-я, 4-я... строка — контент слева, картинка справа
      out.push('        <div class="bot-zigzag__row'+(right?' is-right':'')+'" style="'+rowVars+'">');

      // колонка с картинкой (всегда идёт первой в DOM — на мобиле она будет сверху)
      out.push('          <div class="bot-zigzag__col bot-zigzag__imgcol">');
      if (r.img){
        out.push('            <figure class="bot-zigzag__figure">');
        out.push('              <img loading="lazy" class="bot-zigzag__img bot-rounded bot-shadow-outline" src="'+(r.img.src||'')+'" alt="'+(r.img.alt||'')+'">');
        if (r.img.cap) out.push('              <figcaption class="bot-zigzag__cap bot-text-sm bot-text-muted">'+r.img.cap+'</figcaption>');
        out.push('            </figure>');
      }
      out.push('          </div>');

      // колонка с текстом
      out.push('          <div class="bot-zigzag__col bot-zigzag__txtcol">');
      r.content.forEach(b=>{
        if (b.kind==='h')      out.push(`            <h${b.level} style="margin:0 0 .5rem 0; line-height:1.2;">${b.html}</h${b.level}>`);
        else if (b.kind==='p') out.push('            <p class="bot-text-muted" style="margin:.25rem 0 0 0;">'+b.html+'</p>');
        else if (b.kind==='list') out.push('            '+b.html);
      });
      if (r.btns.length){
        out.push('            <div class="bot-actions" style="margin-top:var(--bot-gap-sm);">');
        r.btns.forEach(b=> out.push('              <a class="bot-btn" href="'+(b.url||'#')+'">'+(b.text||'Learn more')+'</a>'));
        out.push('            </div>');
      }
      out.push('          </div>');

      out.push('        </div>');
    });

    out.push('      </div>');
    return out.join('\n');
  },


  banner: (sec) => {
    const out = [];
    const btns = sec.blocks.filter(b=>b.kind==='btn' || b.kind==='cta');

    const align = sec.meta.bannerAlign || 'left';
    const split = !!sec.meta.bannerSplit;
    const styles = [];
    if (sec.meta.bannerMinH)    styles.push(`--bot-hero-minh:${sec.meta.bannerMinH}`);
    if (sec.meta.heroMaxW)      styles.push(`--bot-hero-maxw:${sec.meta.heroMaxW}`);

    // контент из документа
    const firstH = sec.blocks.find(b=>b.kind==='h');
    const paragraphs = sec.blocks.filter(b=>b.kind==='p');
    const titleHtml = firstH ? firstH.html : esc_(sec.title || '');
    const descHtml  = paragraphs[0]?.html || '';
    const extra     = paragraphs.slice(1);

    const cls = ['bot-hero'];
    if (split) cls.push('is-split');
    if (align === 'center') cls.push('is-center');
    if (align === 'right')  cls.push('is-right');
    if (sec.meta.bannerVAlign === 'center') cls.push('is-vcenter');
    if (sec.meta.bannerVAlign === 'bottom') cls.push('is-vbottom');

    out.push('      <div class="'+cls.join(' ')+'" style="'+styles.join(';')+'">');
    out.push('        <div class="bot-hero__inner">');

    const H = firstH ? `h${firstH.level}` : (sec.meta.bannerH==='h1' ? 'h1' : 'h2');

    if (split){
      out.push('          <div class="bot-hero__text">');
      if (titleHtml) out.push(`            <${H} class="bot-hero__title">${titleHtml}</${H}>`);
      if (descHtml)  out.push('            <p class="bot-hero__desc">'+descHtml+'</p>');
      extra.forEach(p=> out.push('            <p class="bot-hero__desc">'+p.html+'</p>'));
      out.push('          </div>');

      out.push('          <div class="bot-hero__cta">');
      btns.forEach(b=> out.push('            <a class="bot-btn" href="'+(b.url||'#')+'">'+(b.text||'Learn more')+'</a>'));
      out.push('          </div>');
    } else {
      out.push('          <div class="bot-hero__text">');
      if (titleHtml) out.push(`            <${H} class="bot-hero__title">${titleHtml}</${H}>`);
      if (descHtml)  out.push('            <p class="bot-hero__desc">'+descHtml+'</p>');
      extra.forEach(p=> out.push('            <p class="bot-hero__desc">'+p.html+'</p>'));
      if (btns.length){
        out.push('            <div class="bot-hero__actions">');
        btns.forEach(b=> out.push('              <a class="bot-btn" href="'+(b.url||'#')+'">'+(b.text||'Learn more')+'</a>'));
        out.push('            </div>');
      }
      out.push('          </div>');
    }

    out.push('        </div>');
    out.push('      </div>');
    return out.join('\n');
  },


  // ===== CARDS (новое) =====
  cards: (sec) => {
    const out = [];
    const items = sec.blocks.filter(b=>b.kind==='card');
    const cols  = Math.max(1, parseInt(sec.meta.cardsCols||3,10));

    // глобальная установка, если задана директивой IMAGE SIZE (RATIO):
    const globalRatio = (sec.meta.cardRatio || '').replace(/\s+/g,'');

    // Лид (если есть)
    const lead = sec.blocks.find(b=>b.kind==='lead');
    if (lead?.html) out.push('      <p class="bot-lead bot-center bot-text-muted">'+lead.html+'</p>');

    // убрали --bot-card-ratio с контейнера, чтобы задавать per-card
    out.push('      <div class="bot-cards" style="--bot-cards-cols:'+cols+';">');

    items.forEach(c=>{
      // дефолты: иконка 5/2, изображение 4/3; директива секции переопределяет
      const ratio = globalRatio || (c.img ? '4/3' : '5/2');

      out.push('        <article class="bot-card" style="--bot-card-ratio:'+ratio+';">');

      // Медиа: либо картинка, либо иконка
      if (c.img){
        out.push('          <img loading="lazy" decoding="async" class="bot-card__media" src="'+c.img+'" alt="">');
      } else if (c.icon){
        out.push('          <div class="bot-card__icon" aria-hidden="true">'+c.icon+'</div>');
      }

      out.push('          <div class="bot-card__body">');
      if (c.title) out.push('            <h3 class="bot-card__title">'+c.title+'</h3>');
      if (c.descr) out.push('            <p class="bot-card__text bot-text-muted">'+c.descr+'</p>');
      if (c.btnText){
        out.push('            <div class="bot-card__actions"><a class="bot-btn" href="'+(c.btnUrl||'#')+'">'+c.btnText+'</a></div>');
      }
      out.push('          </div>');

      out.push('        </article>');
    });

    out.push('      </div>');
    return out.join('\n');
  },

  faq: (sec) => {
    const out = [];
    const qa = [];
    for (let i=0;i<sec.blocks.length;i++){
      if (sec.blocks[i].kind==='faq_q' && sec.blocks[i+1]?.kind==='faq_a'){
        qa.push({q:sec.blocks[i].text, a:sec.blocks[i+1].text});
        i++;
      }
    }
    const icon = sec.meta.faqIcon || '';
    const mode = sec.meta.faqMode || 'static';

    // Лид-пояснение (если есть)
    const lead = sec.blocks.find(b=>b.kind==='lead');
    if (lead?.html) out.push('      <p class="bot-lead bot-center bot-text-muted">'+lead.html+'</p>');

    out.push('      <div class="bot-faq">');

    qa.forEach(pair=>{
      if (mode === 'accordion'){
        out.push('        <details class="bot-faq__item">');
        out.push('          <summary class="bot-faq__q">');
        if (icon) out.push('            <span class="bot-faq__icon" aria-hidden="true">'+icon+'</span>');
        out.push('            <h3 class="bot-faq__title">'+pair.q+'</h3>');
        out.push('            <span class="bot-faq__chev" aria-hidden="true"></span>');
        out.push('          </summary>');
        out.push('          <div class="bot-faq__a"><p>'+pair.a+'</p></div>');
        out.push('        </details>');
      } else {
        out.push('        <article class="bot-faq__item">');
        out.push('          <div class="bot-faq__q">');
        if (icon) out.push('            <span class="bot-faq__icon" aria-hidden="true">'+icon+'</span>');
        out.push('            <h3 class="bot-faq__title">'+pair.q+'</h3>');
        out.push('          </div>');
        out.push('          <div class="bot-faq__a"><p class="bot-text-muted">'+pair.a+'</p></div>');
        out.push('        </article>');
      }
    });

    // Кнопка/CTA по центру в конце секции
    const btns = sec.blocks.filter(b=>b.kind==='btn' || b.kind==='cta');
    if (btns.length){
      out.push('        <div class="bot-faq__actions bot-center" style="margin-top:var(--bot-gap);">');
      btns.forEach(b=> out.push('          <a class="bot-btn" href="'+(b.url||'#')+'">'+(b.text||'Contact us')+'</a>'));
      out.push('        </div>');
    }

    out.push('      </div>');
    return out.join('\n');
  },
};
