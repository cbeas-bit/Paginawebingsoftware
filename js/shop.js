/* ============================================================
   MUJER COBRA — shop.js
   Catálogo de productos, filtros, modal, add to cart
   ============================================================ */

/* ── Productos de muestra ──────────────────────────────────── */
// En producción estos vendrían de Shopify Storefront API
const PRODUCTS = [
  {
    id: 'joya-001',
    category: 'Joyería', category_en: 'Jewelry',
    name: 'Aros Cobra Martillados',  name_en: 'Hammered Cobra Earrings',
    desc: 'Aros de cobre recuperado forjados a mano. Acabado martillado texturizado, cierre de gancho plateado.',
    desc_en: 'Recovered copper earrings hand-forged. Hammered textured finish, silver hook closure.',
    detail: 'Cobre recuperado · Gancho plateado', detail_en: 'Recovered copper · Silver hook',
    price_clp: 42000, stock: 8,
    badge: null, img: null, tags: ['joyeria','jewelry']
  },
  {
    id: 'joya-002',
    category: 'Joyería', category_en: 'Jewelry',
    name: 'Pulsera Kintsugi',  name_en: 'Kintsugi Bracelet',
    desc: 'Pulsera rígida en cobre con incrustaciones de resina dorada. Técnica kintsugi aplicada a mano.',
    desc_en: 'Rigid copper bracelet with gold resin inlays. Kintsugi technique applied by hand.',
    detail: 'Cobre · Resina dorada', detail_en: 'Copper · Gold resin',
    price_clp: 68000, stock: 5,
    badge: 'new', img: null, tags: ['joyeria','jewelry']
  },
  {
    id: 'joya-003',
    category: 'Joyería', category_en: 'Jewelry',
    name: 'Collar Serpiente',  name_en: 'Serpent Necklace',
    desc: 'Collar de cobre en cadena artesanal con dije cobra central. 45 cm, cierre de mosquetón.',
    desc_en: 'Copper chain necklace with central cobra pendant. 45 cm, carabiner clasp.',
    detail: 'Cobre · 45cm', detail_en: 'Copper · 45cm',
    price_clp: 95000, stock: 3,
    badge: null, img: null, tags: ['joyeria','jewelry']
  },
  {
    id: 'joya-004',
    category: 'Joyería', category_en: 'Jewelry',
    name: 'Anillo Petróleo',  name_en: 'Petrol Ring',
    desc: 'Anillo de cobre oxidado con baño en verde petróleo. Talla única ajustable.',
    desc_en: 'Oxidized copper ring with petrol green finish. One size fits all.',
    detail: 'Cobre oxidado · Talla única', detail_en: 'Oxidized copper · One size',
    price_clp: 34000, stock: 12,
    badge: null, img: null, tags: ['joyeria','jewelry']
  },
  {
    id: 'text-001',
    category: 'Textil', category_en: 'Textile',
    name: 'Cartera Oveja Negra', name_en: 'Black Sheep Bag',
    desc: 'Cartera tejida en lana natural de oveja negra. Asa de cuero crudo, cierre magnético.',
    desc_en: 'Bag woven in natural black sheep wool. Raw leather handle, magnetic closure.',
    detail: 'Lana natural · Cuero crudo', detail_en: 'Natural wool · Raw leather',
    price_clp: 85000, stock: 6,
    badge: null, img: null, tags: ['textil','textile']
  },
  {
    id: 'text-002',
    category: 'Textil', category_en: 'Textile',
    name: 'Tote Petróleo', name_en: 'Petrol Tote',
    desc: 'Tote grande en lana merino teñida en verde petróleo. Interior de tela de algodón.',
    desc_en: 'Large tote in merino wool dyed in petrol green. Cotton fabric interior.',
    detail: 'Merino · Algodón', detail_en: 'Merino · Cotton',
    price_clp: 110000, stock: 4,
    badge: 'new', img: null, tags: ['textil','textile']
  },
  {
    id: 'text-003',
    category: 'Textil', category_en: 'Textile',
    name: 'Clutch Cobre & Lana', name_en: 'Copper & Wool Clutch',
    desc: 'Clutch de lana con cierre de cobre forjado. Pieza que combina textil y metalistería.',
    desc_en: 'Wool clutch with forged copper clasp. Piece combining textile and metalwork.',
    detail: 'Lana · Cobre forjado', detail_en: 'Wool · Forged copper',
    price_clp: 72000, stock: 7,
    badge: null, img: null, tags: ['textil','textile']
  },
  {
    id: 'cuad-001',
    category: 'Cuadros', category_en: 'Paintings',
    name: 'Cobra Ígnea I', name_en: 'Igneous Cobra I',
    desc: 'Acrílico y cobre en polvo sobre lienzo de lino. 60×80 cm. Pieza única con certificado de autenticidad.',
    desc_en: 'Acrylic and copper powder on linen canvas. 60×80 cm. Unique piece with certificate of authenticity.',
    detail: 'Acrílico · Cobre · Lino · 60×80cm', detail_en: 'Acrylic · Copper · Linen · 60×80cm',
    price_clp: 480000, stock: 1,
    badge: 'unique', img: null, tags: ['cuadros','paintings']
  },
  {
    id: 'cuad-002',
    category: 'Cuadros', category_en: 'Paintings',
    name: 'Kintsugi Azul', name_en: 'Blue Kintsugi',
    desc: 'Óleo con hoja de cobre sobre madera envejecida. 40×50 cm. Serie limitada de 3.',
    desc_en: 'Oil with copper leaf on aged wood. 40×50 cm. Limited series of 3.',
    detail: 'Óleo · Hoja de cobre · 40×50cm', detail_en: 'Oil · Copper leaf · 40×50cm',
    price_clp: 320000, stock: 2,
    badge: 'unique', img: null, tags: ['cuadros','paintings']
  },
  {
    id: 'cuad-003',
    category: 'Cuadros', category_en: 'Paintings',
    name: 'Selva Mística', name_en: 'Mystic Jungle',
    desc: 'Técnica mixta con pigmentos naturales, resina y cobre texturizado. 80×100 cm.',
    desc_en: 'Mixed media with natural pigments, resin and textured copper. 80×100 cm.',
    detail: 'Mixta · Resina · Cobre · 80×100cm', detail_en: 'Mixed · Resin · Copper · 80×100cm',
    price_clp: 650000, stock: 1,
    badge: 'unique', img: null, tags: ['cuadros','paintings']
  },
];

/* ── State ─────────────────────────────────────────────────── */
let activeFilter = 'all';
let sortBy = 'default';
let activeProduct = null;

/* ── Filter & sort ─────────────────────────────────────────── */
function getFiltered() {
  let list = [...PRODUCTS];
  if (activeFilter !== 'all') {
    list = list.filter(p => p.tags.includes(activeFilter));
  }
  if (sortBy === 'price-asc')  list.sort((a,b) => a.price_clp - b.price_clp);
  if (sortBy === 'price-desc') list.sort((a,b) => b.price_clp - a.price_clp);
  if (sortBy === 'name')       list.sort((a,b) => a.name.localeCompare(b.name));
  return list;
}

/* ── SVG placeholder icon ──────────────────────────────────── */
function placeholderSVG() {
  return `<div class="product-placeholder">
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 8 L68 24 L68 56 L40 72 L12 56 L12 24 Z" stroke="#e8b878" stroke-width="1" fill="none" opacity="0.4"/>
      <circle cx="40" cy="40" r="12" stroke="#c97a4b" stroke-width="1" fill="none" opacity="0.4"/>
      <path d="M28 52 Q34 44 40 48 Q46 52 52 40" stroke="#e8b878" stroke-width="1" fill="none" opacity="0.3"/>
    </svg>
  </div>`;
}

/* ── Render grid ───────────────────────────────────────────── */
function renderGrid() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  const lang = window.MC?.lang || 'es';
  const isEn = lang === 'en';
  const list = getFiltered();

  if (list.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:80px 20px;color:rgba(245,237,224,0.4)">
      <p style="font-family:var(--font-display);font-size:1.5rem">${isEn ? 'No products found' : 'No se encontraron productos'}</p>
    </div>`;
    return;
  }

  const USD_CLP = 920;
  grid.innerHTML = list.map(p => {
    const name = isEn ? (p.name_en || p.name) : p.name;
    const desc = isEn ? (p.desc_en || p.desc) : p.desc;
    const cat  = isEn ? (p.category_en || p.category) : p.category;
    const usd  = (p.price_clp / USD_CLP).toFixed(0);
    const stockText = p.stock <= 0
      ? (isEn ? 'Out of stock' : 'Sin stock')
      : p.stock <= 3
        ? (isEn ? `Only ${p.stock} left` : `Solo ${p.stock} disponibles`)
        : (isEn ? `${p.stock} available` : `${p.stock} disponibles`);
    const stockClass = p.stock <= 0 ? 'out' : p.stock <= 3 ? 'low' : '';

    const badgeMap = {
      unique: isEn ? 'Unique' : 'Única',
      new:    isEn ? 'New'    : 'Nueva',
      sale:   'Sale',
    };
    const badgeHtml = p.badge
      ? `<div class="product-badge ${p.badge}">${badgeMap[p.badge] || p.badge}</div>`
      : '';

    const addLabel = isEn ? 'Add to Cart' : 'Agregar al Carrito';
    const disabled = p.stock <= 0 ? 'disabled style="opacity:0.4;cursor:not-allowed"' : '';

    return `
    <article class="product-card reveal" data-id="${p.id}" onclick="openModal('${p.id}')">
      <div class="product-image-wrap">
        ${p.img ? `<img src="${p.img}" alt="${name}" loading="lazy">` : placeholderSVG()}
        ${badgeHtml}
        <div class="product-quick-add" onclick="event.stopPropagation()">
          <button class="quick-add-btn" ${disabled}
            onclick="window.CartAPI?.addToCart(PRODUCTS.find(x=>x.id==='${p.id}'))">
            ${addLabel}
          </button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-category">${cat}</div>
        <h3 class="product-name">${name}</h3>
        <p class="product-desc">${desc.substring(0,80)}…</p>
        <div class="product-footer">
          <div class="product-price">
            <div class="price-clp">$ ${p.price_clp.toLocaleString('es-CL')}</div>
            <div class="price-usd">≈ USD ${usd}</div>
          </div>
          <div class="product-stock ${stockClass}">${stockText}</div>
        </div>
      </div>
    </article>`;
  }).join('');

  // Re-trigger reveal
  if (window.IntersectionObserver) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    grid.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }
}

/* ── Modal ─────────────────────────────────────────────────── */
function openModal(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  activeProduct = p;
  const lang = window.MC?.lang || 'es';
  const isEn = lang === 'en';
  const name = isEn ? (p.name_en || p.name) : p.name;
  const desc = isEn ? (p.desc_en || p.desc) : p.desc;
  const cat  = isEn ? (p.category_en || p.category) : p.category;
  const detail = isEn ? (p.detail_en || p.detail || '') : (p.detail || '');
  const USD_CLP = 920, UF_CLP = 38200;
  const usd = (p.price_clp / USD_CLP).toFixed(2);
  const uf  = (p.price_clp / UF_CLP).toFixed(4);

  const modal = document.getElementById('product-modal');
  if (!modal) return;

  modal.querySelector('.modal-images').innerHTML = p.img
    ? `<img src="${p.img}" alt="${name}">`
    : placeholderSVG();

  modal.querySelector('.modal-category').textContent = cat;
  modal.querySelector('.modal-title').textContent = name;
  modal.querySelector('.modal-desc').textContent = desc;
  modal.querySelector('.modal-price-main').textContent = `$ ${p.price_clp.toLocaleString('es-CL')}`;
  modal.querySelector('.modal-price-sub').innerHTML =
    `≈ USD ${usd} &nbsp;·&nbsp; ${uf} UF`;

  modal.querySelector('.modal-details').innerHTML = `
    <div class="detail-row"><span>${isEn ? 'Material' : 'Material'}</span><span>${detail}</span></div>
    <div class="detail-row"><span>${isEn ? 'Stock' : 'Stock'}</span>
      <span class="${p.stock <= 0 ? 'gain-negative' : p.stock <= 3 ? '' : 'gain-positive'}">
        ${p.stock <= 0 ? (isEn ? 'Out of stock' : 'Sin stock') : p.stock + (isEn ? ' units' : ' unidades')}
      </span>
    </div>
    <div class="detail-row"><span>${isEn ? 'Shipping' : 'Envío'}</span>
      <span>${isEn ? 'Chile & International' : 'Chile e Internacional'}</span>
    </div>`;

  const addBtn = modal.querySelector('#modal-add-btn');
  if (addBtn) {
    addBtn.textContent = p.stock <= 0
      ? (isEn ? 'Out of Stock' : 'Sin Stock')
      : (isEn ? 'Add to Cart' : 'Agregar al Carrito');
    addBtn.disabled = p.stock <= 0;
  }

  modal.querySelector('#modal-qty').value = 1;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('product-modal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
  activeProduct = null;
}

function modalAddToCart() {
  if (!activeProduct) return;
  const qty = parseInt(document.getElementById('modal-qty')?.value || '1');
  window.CartAPI?.addToCart(activeProduct, qty);
  closeModal();
}

/* ── Filter tabs & sort ────────────────────────────────────── */
function initFilters() {
  document.querySelectorAll('.filter-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      activeFilter = btn.dataset.filter;
      document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderGrid();
    });
  });

  const sortEl = document.getElementById('sort-select');
  if (sortEl) {
    sortEl.addEventListener('change', () => {
      sortBy = sortEl.value;
      renderGrid();
    });
  }

  // Modal close
  const overlay = document.getElementById('product-modal');
  if (overlay) {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeModal();
    });
  }
}

/* ── Init ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initFilters();
  renderGrid();
  // Re-render on language change
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setTimeout(renderGrid, 50));
  });
});
