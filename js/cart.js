/* ============================================================
   MUJER COBRA — cart.js
   Carrito de compras con soporte CLP / USD / UF
   ============================================================ */

/* ── Exchange rates (actualizados periódicamente) ──────────── */
const RATES = {
  USD_TO_CLP: 920,      // Tasa referencial CLP por USD
  UF_CLP: 38200,        // Valor UF en CLP (actualizar con API CMF)
  IVA: 0.19,            // IVA Chile 19%
};

/* ── Cart state ────────────────────────────────────────────── */
let cart = [];

function loadCart() {
  try {
    cart = JSON.parse(localStorage.getItem('mc-cart') || '[]');
  } catch { cart = []; }
}

function saveCart() {
  localStorage.setItem('mc-cart', JSON.stringify(cart));
  if (window.MC) window.MC.updateCartBadge();
}

/* ── Core operations ───────────────────────────────────────── */
function addToCart(product, qty = 1) {
  loadCart();
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.qty = Math.min(existing.qty + qty, product.stock || 99);
  } else {
    cart.push({ ...product, qty: Math.min(qty, product.stock || 99) });
  }
  saveCart();
  const msg = window.MC?.lang === 'en'
    ? `"${product.name_en || product.name}" added to cart`
    : `"${product.name}" agregado al carrito`;
  if (window.MC) window.MC.showToast(msg, '🛒');
}

function removeFromCart(id) {
  loadCart();
  cart = cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
}

function updateQty(id, qty) {
  loadCart();
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty = Math.max(1, Math.min(qty, item.stock || 99));
    if (item.qty === 0) cart = cart.filter(i => i.id !== id);
  }
  saveCart();
  renderCart();
}

function clearCart() {
  cart = [];
  saveCart();
  renderCart();
}

/* ── Price helpers ─────────────────────────────────────────── */
function fmtCLP(n) {
  return '$ ' + Math.round(n).toLocaleString('es-CL');
}
function fmtUSD(n) {
  return 'USD ' + (n / RATES.USD_TO_CLP).toFixed(2);
}
function fmtUF(n) {
  return (n / RATES.UF_CLP).toFixed(4) + ' UF';
}

/* ── Totals ────────────────────────────────────────────────── */
function calcTotals() {
  const subtotal = cart.reduce((s, i) => s + i.price_clp * i.qty, 0);
  const shipping = subtotal > 0 ? (subtotal > 150000 ? 0 : 5990) : 0;
  const taxBase  = subtotal + shipping;
  const total    = taxBase; // IVA incluido en precio (precio final)
  return { subtotal, shipping, total };
}

/* ── Render cart page ──────────────────────────────────────── */
function renderCart() {
  const wrap = document.getElementById('cart-items-wrap');
  const summaryWrap = document.getElementById('cart-summary-wrap');
  if (!wrap) return;

  loadCart();
  const lang = window.MC?.lang || 'es';
  const isEn = lang === 'en';

  if (cart.length === 0) {
    wrap.innerHTML = `
      <div class="empty-cart reveal">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style="margin:0 auto 20px;opacity:0.25">
          <circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="1.5"/>
          <path d="M20 24h24l-3 16H23L20 24z" stroke="currentColor" stroke-width="1.5" fill="none"/>
          <circle cx="26" cy="44" r="2" fill="currentColor"/>
          <circle cx="38" cy="44" r="2" fill="currentColor"/>
        </svg>
        <h2>${isEn ? 'Your cart is empty' : 'Tu carrito está vacío'}</h2>
        <p>${isEn ? 'Discover our handcrafted pieces.' : 'Descubre nuestras piezas artesanales.'}</p>
        <a href="shop.html" class="btn-primary"><span>${isEn ? 'Go to Shop' : 'Ir a la Tienda'}</span></a>
      </div>`;
    if (summaryWrap) summaryWrap.innerHTML = '';
    return;
  }

  // Items
  wrap.innerHTML = cart.map(item => {
    const name = isEn ? (item.name_en || item.name) : item.name;
    const imgHtml = item.img
      ? `<img class="cart-item-img" src="${item.img}" alt="${name}" loading="lazy">`
      : `<div class="cart-item-img-placeholder">
           <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
             <rect x="4" y="4" width="24" height="24" rx="2" stroke="currentColor" stroke-width="1"/>
             <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1"/>
             <path d="M4 22l7-6 5 5 4-4 8 7" stroke="currentColor" stroke-width="1"/>
           </svg>
         </div>`;
    return `
    <div class="cart-item" data-id="${item.id}">
      ${imgHtml}
      <div class="cart-item-info">
        <span class="cart-item-category">${isEn ? (item.category_en || item.category) : item.category}</span>
        <div class="cart-item-name">${name}</div>
        <div class="cart-item-detail">${isEn ? (item.detail_en || '') : (item.detail || '')}</div>
        <div class="qty-control" style="margin-top:10px">
          <button class="qty-btn" onclick="updateQty('${item.id}', ${item.qty - 1})">−</button>
          <input class="qty-value" type="number" value="${item.qty}" min="1" max="${item.stock || 99}"
            onchange="updateQty('${item.id}', parseInt(this.value)||1)">
          <button class="qty-btn" onclick="updateQty('${item.id}', ${item.qty + 1})">+</button>
        </div>
      </div>
      <div class="cart-item-actions">
        <div class="cart-item-price">${fmtCLP(item.price_clp * item.qty)}</div>
        <div style="font-size:0.75rem;color:rgba(245,237,224,0.35)">${fmtUSD(item.price_clp * item.qty)}</div>
        <button class="cart-remove" onclick="removeFromCart('${item.id}')">
          ${isEn ? 'Remove' : 'Eliminar'}
        </button>
      </div>
    </div>`;
  }).join('');

  // Summary
  const { subtotal, shipping, total } = calcTotals();
  if (summaryWrap) {
    summaryWrap.innerHTML = `
      <div class="cart-summary">
        <h2>${isEn ? 'Order Summary' : 'Resumen del Pedido'}</h2>
        <div class="summary-row">
          <span>${isEn ? 'Subtotal' : 'Subtotal'}</span>
          <span>${fmtCLP(subtotal)}</span>
        </div>
        <div class="summary-row">
          <span>${isEn ? 'Shipping' : 'Envío'}</span>
          <span>${shipping === 0 ? (isEn ? 'Free' : 'Gratis') : fmtCLP(shipping)}</span>
        </div>
        <div class="summary-row total">
          <span>${isEn ? 'Total (IVA incl.)' : 'Total (IVA incl.)'}</span>
          <div>
            <div class="summary-total-clp">${fmtCLP(total)}</div>
            <div class="summary-total-usd">${fmtUSD(total)} · ${fmtUF(total)}</div>
          </div>
        </div>
        <p class="currency-note">
          ${isEn
            ? 'Prices in Chilean pesos (CLP). USD and UF are approximate references. Final charge in CLP.'
            : 'Precios en pesos chilenos (CLP). USD y UF son referencias aproximadas. Cobro final en CLP.'}
        </p>
        <a href="#checkout" class="btn-primary cart-cta" onclick="handleCheckout(event)">
          <span>${isEn ? 'Proceed to Payment' : 'Proceder al Pago'}</span>
        </a>
        <a href="shop.html" class="btn-outline" style="width:100%;justify-content:center;margin-top:10px">
          <span>${isEn ? 'Continue Shopping' : 'Seguir Comprando'}</span>
        </a>
      </div>`;
  }
}

function handleCheckout(e) {
  e.preventDefault();
  const lang = window.MC?.lang || 'es';
  const isEn = lang === 'en';
  // En producción, aquí se integraría Shopify / WebPay
  window.MC?.showToast(
    isEn ? 'Redirecting to Shopify checkout…' : 'Redirigiendo a pago Shopify…',
    '🔒'
  );
}

/* ── Init ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
});

// Exportar para uso desde shop.js
window.CartAPI = { addToCart, removeFromCart, updateQty, clearCart, loadCart };
