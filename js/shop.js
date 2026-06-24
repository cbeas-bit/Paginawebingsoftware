/* ============================================================
   MUJER COBRA — shop.js  (v2 — Supabase)
   Carga productos desde Supabase en vez de array hardcodeado.
   ============================================================ */

let PRODUCTS     = [];
let CATEGORIAS   = [];
let activeFilter = 'all';
let sortBy       = 'default';
let activeProduct = null;

const SLUG_A_TAG = {
  'aros-capim':    'joyeria',
  'aros-frivolite':'joyeria',
  'collares':      'joyeria',
  'cuadros':       'cuadros',
  'textil':        'textil',
};

async function cargarProductosSupabase() {
  const grid = document.getElementById('products-grid');
  if (grid) grid.innerHTML = `<div style="grid-column:1/-1;padding:60px;text-align:center;color:rgba(245,237,224,0.4)">Cargando productos…</div>`;
  try {
    const { data: cats } = await supabaseClient.from('categorias').select('*').eq('activa', true).order('orden');
    CATEGORIAS = cats || [];
    const { data: prods, error } = await supabaseClient.from('productos').select('*, categorias(slug, nombre_es, nombre_en)').eq('disponible', true).order('creado_en', { ascending: false });
    if (error) throw error;
    PRODUCTS = (prods || []).map(p => {
      const slug = p.categorias?.slug || '';
      const tag  = SLUG_A_TAG[slug] || 'joyeria';
      return {
        id: p.id, supabase_id: p.id,
        category: p.categorias?.nombre_es || 'Joyería', category_en: p.categorias?.nombre_en || 'Jewelry',
        name: p.nombre_es, name_en: p.nombre_en,
        desc: p.descripcion_es || '', desc_en: p.descripcion_en || '',
        detail: '', detail_en: '',
        price_clp: Number(p.precio_clp), price_usd: Number(p.precio_usd),
        stock: p.stock, badge: p.destacado ? 'new' : null,
        img: (p.imagenes && p.imagenes.length > 0) ? p.imagenes[0] : null,
        tags: [tag],
      };
    });
    actualizarFilterTabs();
    renderGrid();
  } catch (err) {
    console.error('Error cargando productos:', err);
    if (grid) grid.innerHTML = `<div style="grid-column:1/-1;padding:60px;text-align:center;color:rgba(245,237,224,0.4)">Error al cargar productos. Por favor recarga la página.</div>`;
  }
}

function actualizarFilterTabs() {
  const tabsContainer = document.getElementById('filter-tabs');
  if (!tabsContainer) return;
  const isEn = window.MC?.lang === 'en';
  const tagsDisponibles = [...new Set(PRODUCTS.flatMap(p => p.tags))];
  const tabMap = {
    joyeria: { es: 'Joyería', en: 'Jewelry' },
    textil:  { es: 'Textil',  en: 'Textile' },
    cuadros: { es: 'Cuadros', en: 'Paintings' },
  };
  let html = `<button class="filter-tab ${activeFilter === 'all' ? 'active' : ''}" data-filter="all">${isEn ? 'All' : 'Todo'}</button>`;
  tagsDisponibles.forEach(tag => {
    if (tabMap[tag]) html += `<button class="filter-tab ${activeFilter === tag ? 'active' : ''}" data-filter="${tag}">${isEn ? tabMap[tag].en : tabMap[tag].es}</button>`;
  });
  tabsContainer.innerHTML = html;
  initFilters();
}

function getFiltered() {
  let list = [...PRODUCTS];
  if (activeFilter !== 'all') list = list.filter(p => p.tags.includes(activeFilter));
  if (sortBy === 'price-asc')  list.sort((a,b) => a.price_clp - b.price_clp);
  if (sortBy === 'price-desc') list.sort((a,b) => b.price_clp - a.price_clp);
  if (sortBy === 'name')       list.sort((a,b) => a.name.localeCompare(b.name));
  return list;
}

function placeholderSVG() {
  return `<div class="product-placeholder"><svg viewBox="0 0 80 80" fill="none"><path d="M40 8 L68 24 L68 56 L40 72 L12 56 L12 24 Z" stroke="#e8b878" stroke-width="1" fill="none" opacity="0.4"/><circle cx="40" cy="40" r="12" stroke="#c97a4b" stroke-width="1" fill="none" opacity="0.4"/></svg></div>`;
}

function renderGrid() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  const isEn = window.MC?.lang === 'en';
  const list = getFiltered();
  if (list.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:80px 20px;color:rgba(245,237,224,0.4)"><p style="font-family:var(--font-display);font-size:1.5rem">${isEn ? 'No products found' : 'No se encontraron productos'}</p></div>`;
    return;
  }
  const UF_CLP = 38200;
  grid.innerHTML = list.map(p => {
    const name = isEn ? (p.name_en || p.name) : p.name;
    const desc = isEn ? (p.desc_en || p.desc) : p.desc;
    const cat  = isEn ? (p.category_en || p.category) : p.category;
    const usd  = p.price_usd > 0 ? p.price_usd.toFixed(0) : (p.price_clp / 920).toFixed(0);
    const stockText = p.stock <= 0 ? (isEn ? 'Out of stock' : 'Sin stock') : p.stock <= 3 ? (isEn ? `Only ${p.stock} left` : `Solo ${p.stock} disponibles`) : (isEn ? `${p.stock} available` : `${p.stock} disponibles`);
    const stockClass = p.stock <= 0 ? 'out' : p.stock <= 3 ? 'low' : '';
    const badgeHtml = p.badge ? `<div class="product-badge ${p.badge}">${isEn ? 'Featured' : 'Destacada'}</div>` : '';
    const disabled = p.stock <= 0 ? 'disabled style="opacity:0.4;cursor:not-allowed"' : '';
    const imgHtml = p.img ? `<img src="${p.img}" alt="${name}" loading="lazy" style="width:100%;height:100%;object-fit:cover;">` : placeholderSVG();
    return `<article class="product-card reveal" data-id="${p.id}" onclick="openModal(${p.id})">
      <div class="product-image-wrap">${imgHtml}${badgeHtml}<div class="product-quick-add" onclick="event.stopPropagation()"><button class="quick-add-btn" ${disabled} onclick="window.CartAPI?.addToCart(PRODUCTS.find(x=>x.id===${p.id}))">${isEn ? 'Add to Cart' : 'Agregar al Carrito'}</button></div></div>
      <div class="product-info"><div class="product-category">${cat}</div><h3 class="product-name">${name}</h3><p class="product-desc">${desc.substring(0,80)}…</p><div class="product-footer"><div class="product-price"><div class="price-clp">$ ${p.price_clp.toLocaleString('es-CL')}</div><div class="price-usd">≈ USD ${usd}</div></div><div class="product-stock ${stockClass}">${stockText}</div></div></div>
    </article>`;
  }).join('');
  if (window.IntersectionObserver) {
    const obs = new IntersectionObserver((entries) => { entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } }); }, { threshold: 0.08 });
    grid.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  }
}

function openModal(id) {
  const p = PRODUCTS.find(x => x.id == id);
  if (!p) return;
  activeProduct = p;
  const isEn = window.MC?.lang === 'en';
  const name = isEn ? (p.name_en || p.name) : p.name;
  const desc = isEn ? (p.desc_en || p.desc) : p.desc;
  const cat  = isEn ? (p.category_en || p.category) : p.category;
  const usd  = p.price_usd > 0 ? p.price_usd.toFixed(2) : (p.price_clp / 920).toFixed(2);
  const uf   = (p.price_clp / 38200).toFixed(4);
  const modal = document.getElementById('product-modal');
  if (!modal) return;
  modal.querySelector('.modal-images').innerHTML = p.img ? `<img src="${p.img}" alt="${name}" style="width:100%;height:100%;object-fit:cover;">` : placeholderSVG();
  modal.querySelector('.modal-category').textContent = cat;
  modal.querySelector('.modal-title').textContent = name;
  modal.querySelector('.modal-desc').textContent = desc;
  modal.querySelector('.modal-price-main').textContent = `$ ${p.price_clp.toLocaleString('es-CL')}`;
  modal.querySelector('.modal-price-sub').innerHTML = `≈ USD ${usd} &nbsp;·&nbsp; ${uf} UF`;
  modal.querySelector('.modal-details').innerHTML = `<div class="detail-row"><span>${isEn ? 'Stock' : 'Stock'}</span><span class="${p.stock <= 0 ? 'gain-negative' : p.stock <= 3 ? '' : 'gain-positive'}">${p.stock <= 0 ? (isEn ? 'Out of stock' : 'Sin stock') : p.stock + (isEn ? ' units' : ' unidades')}</span></div><div class="detail-row"><span>${isEn ? 'Shipping' : 'Envío'}</span><span>${isEn ? 'Chile & International' : 'Chile e Internacional'}</span></div>`;
  const addBtn = modal.querySelector('#modal-add-btn');
  if (addBtn) { addBtn.textContent = p.stock <= 0 ? (isEn ? 'Out of Stock' : 'Sin Stock') : (isEn ? 'Add to Cart' : 'Agregar al Carrito'); addBtn.disabled = p.stock <= 0; }
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
  if (sortEl) sortEl.addEventListener('change', () => { sortBy = sortEl.value; renderGrid(); });
  const overlay = document.getElementById('product-modal');
  if (overlay) {
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initFilters();
  cargarProductosSupabase();
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setTimeout(() => { actualizarFilterTabs(); renderGrid(); }, 50));
  });
});
